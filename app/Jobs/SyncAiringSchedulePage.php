<?php

namespace App\Jobs;

use App\Exceptions\AniListServiceUnavailableException;
use App\Models\AiringSchedule;
use App\Models\Anime;
use App\Models\SyncRun;
use App\Services\AniListClient;
use App\Services\AniListQueryBuilder;
use App\Services\SyncRunTracker;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class SyncAiringSchedulePage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 120;

    /**
     * Attempts are bounded by retryUntil() rather than a fixed count: the job
     * releases itself back onto the queue while AniList is unavailable, and
     * every one of those releases would otherwise burn an attempt and kill the
     * whole page chain with MaxAttemptsExceededException.
     */
    public int $tries = 0;

    /**
     * Genuine errors (as opposed to outage releases) still fail fast.
     */
    public int $maxExceptions = 3;

    /**
     * Declared with a default rather than promoted in the constructor: a
     * promoted property has no class-level default, so a job payload
     * serialized before this property existed unserializes with it
     * uninitialized and every read throws. Payloads queued across a deploy
     * have to land on null instead.
     */
    public ?int $syncRunId = null;

    public function __construct(
        public readonly int $page,
        public readonly int $airingAtGreater,
        public readonly int $airingAtLesser,
        public readonly int $perPage = 50,
        ?int $syncRunId = null,
    ) {
        $this->syncRunId = $syncRunId;
    }

    /**
     * Long enough to sit out several AniList circuit-breaker windows
     * (900s each by default) before giving up on the page.
     */
    public function retryUntil(): \DateTimeInterface
    {
        return now()->addHours(4);
    }

    public function handle(AniListClient $client, SyncRunTracker $tracker): void
    {
        $run = $tracker->find($this->syncRunId)
            ?? $tracker->start(SyncRun::MODE_SCHEDULE);

        try {
            $data = $client->query(AniListQueryBuilder::airingSchedulePage(), [
                'page' => $this->page,
                'perPage' => $this->perPage,
                'airingAt_greater' => $this->airingAtGreater,
                'airingAt_lesser' => $this->airingAtLesser,
            ]);
        } catch (AniListServiceUnavailableException $e) {
            $this->pauseForOutage($tracker, $run, $e);

            return;
        }

        // Store raw response
        $client->storeRawResponse(
            'Page.airingSchedules',
            "schedule:page:{$this->page}",
            $data,
        );

        $schedules = $data['Page']['airingSchedules'] ?? [];
        $pageInfo = $data['Page']['pageInfo'] ?? [];

        Log::info('SyncAiringSchedulePage fetched', [
            'page' => $this->page,
            'items' => count($schedules),
        ]);

        // Batch-load anime ID map to avoid N+1
        $anilistIds = collect($schedules)->pluck('media.id')->filter()->unique()->values();
        $animeMap = Anime::whereIn('anilist_id', $anilistIds)->pluck('id', 'anilist_id')->all();

        // Build rows for batch upsert
        $rows = [];
        foreach ($schedules as $node) {
            $animeAnilistId = $node['media']['id'] ?? null;
            if (! $animeAnilistId) {
                Log::warning('Airing schedule node missing media ID', ['node_id' => $node['id'] ?? 'unknown']);

                continue;
            }

            if (! isset($node['episode'], $node['airingAt'])) {
                Log::warning('Airing schedule node missing required fields', ['node_id' => $node['id'] ?? 'unknown']);

                continue;
            }

            $animeId = $animeMap[$animeAnilistId] ?? null;
            if (! $animeId) {
                Log::debug('Skipping airing schedule for unknown anime', [
                    'anilist_id' => $animeAnilistId,
                    'airing_id' => $node['id'],
                ]);

                continue;
            }

            $rows[] = [
                'anime_id' => $animeId,
                'anilist_airing_id' => $node['id'],
                'episode' => $node['episode'],
                'airs_at' => Carbon::createFromTimestamp($node['airingAt']),
                'time_until_airing' => $node['timeUntilAiring'] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        if (! empty($rows)) {
            AiringSchedule::upsert(
                $rows,
                ['anilist_airing_id'],
                ['anime_id', 'episode', 'airs_at', 'time_until_airing', 'updated_at'],
            );
        }

        $tracker->advance(
            run: $run,
            page: $this->page,
            lastPage: (int) ($pageInfo['lastPage'] ?? 0),
            totalItems: (int) ($pageInfo['total'] ?? 0),
            processedDelta: count($rows),
        );

        // Chain next page or finalize
        if ($pageInfo['hasNextPage'] ?? false) {
            self::dispatch(
                $this->page + 1,
                $this->airingAtGreater,
                $this->airingAtLesser,
                $this->perPage,
                $run->id,
            )->onQueue('sync');
        } else {
            $this->invalidateScheduleCaches();
            $tracker->complete($run);
            Log::info('Airing schedule sync complete', ['total_pages' => $this->page]);
        }
    }

    private function pauseForOutage(SyncRunTracker $tracker, SyncRun $run, AniListServiceUnavailableException $e): void
    {
        $tracker->pause($run, $e->getMessage());

        Log::warning('SyncAiringSchedulePage paused: AniList unavailable', [
            'page' => $this->page,
            'retry_after_s' => $e->retryAfter,
        ]);

        $this->release($e->retryAfter);
    }

    private function invalidateScheduleCaches(): void
    {
        $today = now();
        for ($i = 0; $i < 7; $i++) {
            $date = $today->copy()->addDays($i);
            Cache::forget("schedule:daily:{$date->toDateString()}");
        }
        Cache::forget("schedule:week:{$today->year}:{$today->weekOfYear}");
    }

    public function failed(\Throwable $e): void
    {
        $tracker = app(SyncRunTracker::class);
        $run = $tracker->find($this->syncRunId);

        if ($run !== null) {
            $tracker->fail($run, $e);
        }

        Log::error('SyncAiringSchedulePage failed', [
            'page' => $this->page,
            'exception' => $e,
        ]);
    }
}
