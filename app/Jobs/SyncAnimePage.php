<?php

namespace App\Jobs;

use App\Exceptions\AniListServiceUnavailableException;
use App\Models\SyncRun;
use App\Services\AniListClient;
use App\Services\AniListQueryBuilder;
use App\Services\AnimeDataPersistenceService;
use App\Services\SyncRunTracker;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SyncAnimePage implements ShouldQueue
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
        public readonly int $perPage = 50,
        public readonly string $mode = 'full',
        public readonly ?int $updatedAtGreater = null,
        public readonly ?string $anilistStatus = null,
        public readonly ?string $anilistSeason = null,
        public readonly ?int $anilistSeasonYear = null,
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
        return now()->addHours(6);
    }

    public function handle(
        AniListClient $client,
        AnimeDataPersistenceService $persistenceService,
        SyncRunTracker $tracker,
    ): void {
        $run = $this->resolveRun($tracker);

        $query = match ($this->mode) {
            'incremental' => AniListQueryBuilder::updatedSince(false),
            'finished_incremental' => AniListQueryBuilder::updatedSince(true),
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

        try {
            $data = $client->query($query, $variables);
        } catch (AniListServiceUnavailableException $e) {
            $this->pauseForOutage($tracker, $run, $e);

            return;
        }

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

        $tracker->advance(
            run: $run,
            page: $this->page,
            lastPage: (int) ($pageInfo['lastPage'] ?? 0),
            totalItems: (int) ($pageInfo['total'] ?? 0),
            processedDelta: count($mediaItems),
        );

        // In incremental mode, stop when all items on page are older than cutoff
        $shouldContinue = $pageInfo['hasNextPage'] ?? false;

        if ($shouldContinue && in_array($this->mode, ['incremental', 'finished_incremental'], true) && $this->updatedAtGreater !== null && ! empty($mediaItems)) {
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
                syncRunId: $run->id,
            )->onQueue('sync');
        } else {
            $tracker->complete($run);

            // Resolve deferred relations after sync completes
            $delay = $this->mode === 'full' ? now()->addMinutes(5) : now()->addSeconds(10);
            ResolveAnimeRelations::dispatch()
                ->onQueue('import')
                ->delay($delay);
            ResolveAnimeRecommendations::dispatch()
                ->onQueue('import')
                ->delay($delay);

            Log::info("Sync {$this->mode} page sweep complete", ['total_pages' => $this->page]);
        }
    }

    /**
     * Reattach to the run this chain belongs to. A job dispatched without one
     * (an old payload retried from the failed table, say) opens its own so the
     * sweep is still visible on the admin panel.
     */
    private function resolveRun(SyncRunTracker $tracker): SyncRun
    {
        return $tracker->find($this->syncRunId)
            ?? $tracker->start($this->mode, $this->runLabel(), $this->updatedAtGreater);
    }

    private function runLabel(): ?string
    {
        if ($this->mode !== 'targeted') {
            return null;
        }

        return trim(implode(' ', array_filter([
            $this->anilistStatus,
            $this->anilistSeason,
            $this->anilistSeasonYear,
        ]))) ?: null;
    }

    private function pauseForOutage(SyncRunTracker $tracker, SyncRun $run, AniListServiceUnavailableException $e): void
    {
        $tracker->pause($run, $e->getMessage());

        Log::warning('SyncAnimePage paused: AniList unavailable', [
            'page' => $this->page,
            'mode' => $this->mode,
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

        Log::error('SyncAnimePage failed', [
            'page' => $this->page,
            'mode' => $this->mode,
            'exception' => $e,
        ]);
    }
}
