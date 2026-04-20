<?php

namespace App\Jobs;

use App\Services\AniListClient;
use App\Services\AniListQueryBuilder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
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

    public int $tries = 3;

    public function __construct(
        public readonly int $page,
        public readonly int $perPage = 50,
    ) {}

    public function handle(AniListClient $client): void
    {
        $data = $client->query(AniListQueryBuilder::recommendationsPage(), [
            'page' => $this->page,
            'perPage' => $this->perPage,
        ]);

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

        $progressTtl = config('anilist.sync.progress_cache_ttl', 86400);
        Cache::put('sync:recommendations:progress', [
            'last_completed_page' => $this->page,
            'last_page' => $pageInfo['lastPage'] ?? 0,
            'total' => $pageInfo['total'] ?? 0,
            'started_at' => Cache::get('sync:recommendations:progress')['started_at'] ?? now()->toIso8601String(),
        ], $progressTtl);

        if ($pageInfo['hasNextPage'] ?? false) {
            self::dispatch(page: $this->page + 1, perPage: $this->perPage)->onQueue('sync');
        } else {
            Cache::put('sync:recommendations:status', 'completed', $progressTtl);

            ResolveAnimeRecommendations::dispatch()
                ->onQueue('import')
                ->delay(now()->addSeconds(10));

            Log::info('SyncRecommendationsPage sweep complete', ['total_pages' => $this->page]);
        }
    }

    public function failed(\Throwable $e): void
    {
        $progressTtl = config('anilist.sync.progress_cache_ttl', 86400);
        Cache::put('sync:recommendations:status', 'failed', $progressTtl);

        Log::error('SyncRecommendationsPage failed', [
            'page' => $this->page,
            'exception' => $e,
        ]);
    }
}
