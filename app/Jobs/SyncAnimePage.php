<?php

namespace App\Jobs;

use App\Services\AniListClient;
use App\Services\AniListQueryBuilder;
use App\Services\AnimeDataPersistenceService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class SyncAnimePage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 300;

    public int $tries = 3;

    public function __construct(
        public readonly int $page,
        public readonly int $perPage = 50,
        public readonly string $mode = 'full',
        public readonly ?int $updatedAtGreater = null,
        public readonly ?string $anilistStatus = null,
        public readonly ?string $anilistSeason = null,
        public readonly ?int $anilistSeasonYear = null,
    ) {}

    public function handle(AniListClient $client, AnimeDataPersistenceService $persistenceService): void
    {
        $query = match ($this->mode) {
            'incremental' => AniListQueryBuilder::updatedSince(),
            'targeted' => AniListQueryBuilder::animeByStatus(),
            default => AniListQueryBuilder::animePage(),
        };

        $variables = [
            'page' => $this->page,
            'perPage' => $this->perPage,
        ];

        // Note: incremental mode sorts by UPDATED_AT_DESC and stops when items
        // are older than the cutoff (handled after persistence below)

        if ($this->mode === 'targeted') {
            if ($this->anilistStatus) {
                $variables['status'] = $this->anilistStatus;
            }
            if ($this->anilistSeason) {
                $variables['season'] = $this->anilistSeason;
            }
            if ($this->anilistSeasonYear) {
                $variables['seasonYear'] = $this->anilistSeasonYear;
            }
        }

        $data = $client->query($query, $variables);

        // Store raw response
        $client->storeRawResponse(
            'Page.media',
            "page:{$this->page}:mode:{$this->mode}",
            $data,
        );

        $pageData = $data['Page'] ?? null;
        if ($pageData === null) {
            throw new \RuntimeException("AniList response missing 'Page' key on page {$this->page}");
        }

        $mediaItems = $pageData['media'] ?? [];
        $pageInfo = $pageData['pageInfo'] ?? [];

        if (empty($mediaItems) && $this->page === 1) {
            Log::error('First page of sync returned 0 items — possible API issue', [
                'mode' => $this->mode,
                'response_keys' => array_keys($data),
            ]);
        }

        Log::info('SyncAnimePage fetched', [
            'page' => $this->page,
            'mode' => $this->mode,
            'items' => count($mediaItems),
            'last_page' => $pageInfo['lastPage'] ?? '?',
        ]);

        // Bulk-persist all media items in a single transaction
        if (! empty($mediaItems)) {
            $persistenceService->persistBatch($mediaItems);
        }

        // Update progress
        $progressTtl = config('anilist.sync.progress_cache_ttl', 86400);
        Cache::put("sync:{$this->mode}:progress", [
            'last_completed_page' => $this->page,
            'last_page' => $pageInfo['lastPage'] ?? 0,
            'total' => $pageInfo['total'] ?? 0,
            'started_at' => Cache::get("sync:{$this->mode}:progress")['started_at'] ?? now()->toIso8601String(),
        ], $progressTtl);

        // In incremental mode, stop when all items on page are older than cutoff
        $shouldContinue = $pageInfo['hasNextPage'] ?? false;

        if ($shouldContinue && $this->mode === 'incremental' && $this->updatedAtGreater !== null && ! empty($mediaItems)) {
            $allOlderThanCutoff = collect($mediaItems)->every(
                fn ($item) => ($item['updatedAt'] ?? 0) <= $this->updatedAtGreater
            );

            if ($allOlderThanCutoff) {
                $shouldContinue = false;
                Log::info('Incremental sync stopping — all items on page older than cutoff', [
                    'page' => $this->page,
                    'cutoff' => date('Y-m-d H:i:s', $this->updatedAtGreater),
                ]);
            }
        }

        // Chain next page or finalize
        if ($shouldContinue) {
            self::dispatch(
                page: $this->page + 1,
                perPage: $this->perPage,
                mode: $this->mode,
                updatedAtGreater: $this->updatedAtGreater,
                anilistStatus: $this->anilistStatus,
                anilistSeason: $this->anilistSeason,
                anilistSeasonYear: $this->anilistSeasonYear,
            )->onQueue('sync');
        } else {
            // Sync complete
            Cache::put("sync:{$this->mode}:status", 'completed', $progressTtl);

            // Resolve deferred relations after sync completes
            $delay = $this->mode === 'full' ? now()->addMinutes(5) : now()->addSeconds(10);
            ResolveAnimeRelations::dispatch()
                ->onQueue('import')
                ->delay($delay);
            ResolveAnimeRecommendations::dispatch()
                ->onQueue('import')
                ->delay($delay);

            if ($this->mode === 'incremental') {
                Cache::forever('sync:incremental:last_run', now()->timestamp);
            }

            Log::info("Sync {$this->mode} page sweep complete", ['total_pages' => $this->page]);
        }
    }

    public function failed(\Throwable $e): void
    {
        $progressTtl = config('anilist.sync.progress_cache_ttl', 86400);
        Cache::put("sync:{$this->mode}:status", 'failed', $progressTtl);

        Log::error('SyncAnimePage failed', [
            'page' => $this->page,
            'mode' => $this->mode,
            'exception' => $e,
        ]);
    }
}
