<?php

namespace App\Jobs;

use App\Exceptions\AniListServiceUnavailableException;
use App\Models\SyncRun;
use App\Services\AniListClient;
use App\Services\AniListQueryBuilder;
use App\Services\SyncRunTracker;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;

/**
 * Backfill-only variant of SyncAnimePage. Fetches just the recommendations
 * edges for each anime and pushes them onto the same Redis queue that the
 * main sync uses; ResolveAnimeRecommendations then writes them to MySQL.
 */
class SyncRecommendationsPage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 300;

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

    public function __construct(
        public readonly int $page,
        public readonly int $perPage = 50,
        public readonly ?int $syncRunId = null,
    ) {}

    /**
     * Long enough to sit out several AniList circuit-breaker windows
     * (900s each by default) before giving up on the page.
     */
    public function retryUntil(): \DateTimeInterface
    {
        return now()->addHours(6);
    }

    public function handle(AniListClient $client, SyncRunTracker $tracker): void
    {
        $run = $tracker->find($this->syncRunId)
            ?? $tracker->start(SyncRun::MODE_RECOMMENDATIONS);

        try {
            $data = $client->query(AniListQueryBuilder::recommendationsPage(), [
                'page' => $this->page,
                'perPage' => $this->perPage,
            ]);
        } catch (AniListServiceUnavailableException $e) {
            $this->pauseForOutage($tracker, $run, $e);

            return;
        }

        $pageData = $data['Page'] ?? null;
        if ($pageData === null) {
            throw new \RuntimeException("AniList response missing 'Page' key on recommendations page {$this->page}");
        }

        $mediaItems = $pageData['media'] ?? [];
        $pageInfo = $pageData['pageInfo'] ?? [];

        $pending = [];
        foreach ($mediaItems as $media) {
            $fromId = $media['id'] ?? null;
            if (! $fromId) {
                continue;
            }

            foreach ($media['recommendations']['edges'] ?? [] as $edge) {
                $node = $edge['node'] ?? null;
                $rec = $node['mediaRecommendation'] ?? null;
                if (! $node || ! $rec || ($rec['type'] ?? null) !== 'ANIME' || ! isset($rec['id'])) {
                    continue;
                }

                $pending[] = json_encode([
                    'from_anilist_id' => (int) $fromId,
                    'to_anilist_id' => (int) $rec['id'],
                    'anilist_recommendation_id' => (int) ($node['id'] ?? 0),
                    'rating' => (int) ($node['rating'] ?? 0),
                ]);
            }
        }

        if (! empty($pending)) {
            Redis::rpush('sync:pending_recommendations', ...$pending);
        }

        Log::info('SyncRecommendationsPage fetched', [
            'page' => $this->page,
            'media' => count($mediaItems),
            'edges_queued' => count($pending),
        ]);

        $tracker->advance(
            run: $run,
            page: $this->page,
            lastPage: (int) ($pageInfo['lastPage'] ?? 0),
            totalItems: (int) ($pageInfo['total'] ?? 0),
            processedDelta: count($mediaItems),
        );

        if ($pageInfo['hasNextPage'] ?? false) {
            self::dispatch(page: $this->page + 1, perPage: $this->perPage, syncRunId: $run->id)->onQueue('sync');
        } else {
            $tracker->complete($run);

            ResolveAnimeRecommendations::dispatch()
                ->onQueue('import')
                ->delay(now()->addSeconds(10));

            Log::info('SyncRecommendationsPage sweep complete', ['total_pages' => $this->page]);
        }
    }

    private function pauseForOutage(SyncRunTracker $tracker, SyncRun $run, AniListServiceUnavailableException $e): void
    {
        $tracker->pause($run, $e->getMessage());

        Log::warning('SyncRecommendationsPage paused: AniList unavailable', [
            'page' => $this->page,
            'retry_after_s' => $e->retryAfter,
        ]);

        $this->release($e->retryAfter);
    }

    public function failed(\Throwable $e): void
    {
        $tracker = app(SyncRunTracker::class);
        $run = $tracker->find($this->syncRunId);

        if ($run !== null) {
            $tracker->fail($run, $e);
        }

        Log::error('SyncRecommendationsPage failed', [
            'page' => $this->page,
            'exception' => $e,
        ]);
    }
}
