<?php

namespace App\Jobs;

use App\Models\AiringSchedule;
use App\Models\Anime;
use App\Services\AniListClient;
use App\Services\AniListQueryBuilder;
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

    public int $tries = 3;

    public function __construct(
        public readonly int $page,
        public readonly int $airingAtGreater,
        public readonly int $airingAtLesser,
        public readonly int $perPage = 50,
    ) {}

    public function handle(AniListClient $client): void
    {
        $data = $client->query(AniListQueryBuilder::airingSchedulePage(), [
            'page' => $this->page,
            'perPage' => $this->perPage,
            'airingAt_greater' => $this->airingAtGreater,
            'airingAt_lesser' => $this->airingAtLesser,
        ]);

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

        // Update progress
        $progressTtl = config('anilist.sync.progress_cache_ttl', 86400);
        Cache::put('sync:schedule:progress', [
            'last_completed_page' => $this->page,
            'last_page' => $pageInfo['lastPage'] ?? 0,
            'total' => $pageInfo['total'] ?? 0,
            'started_at' => Cache::get('sync:schedule:progress')['started_at'] ?? now()->toIso8601String(),
        ], $progressTtl);

        // Chain next page or finalize
        if ($pageInfo['hasNextPage'] ?? false) {
            self::dispatch(
                $this->page + 1,
                $this->airingAtGreater,
                $this->airingAtLesser,
                $this->perPage,
            )->onQueue('sync');
        } else {
            $this->invalidateScheduleCaches();
            Cache::put('sync:schedule:status', 'completed', $progressTtl);
            Log::info('Airing schedule sync complete', ['total_pages' => $this->page]);
        }
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
        $progressTtl = config('anilist.sync.progress_cache_ttl', 86400);
        Cache::put('sync:schedule:status', 'failed', $progressTtl);

        Log::error('SyncAiringSchedulePage failed', [
            'page' => $this->page,
            'exception' => $e,
        ]);
    }
}
