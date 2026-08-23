<?php

namespace App\Jobs;

use App\Exceptions\AniListServiceUnavailableException;
use App\Models\Anime;
use App\Models\SyncRun;
use App\Services\AniListClient;
use App\Services\AniListQueryBuilder;
use App\Services\AnimeDataPersistenceService;
use App\Services\AnimeRefreshPolicy;
use App\Services\SyncRunTracker;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * Walks the backlog of anime whose local copy has gone stale, refreshing them
 * a batch at a time and chaining until the backlog is drained or the per-run
 * batch cap is reached.
 *
 * Rows are fetched in one id_in request per batch rather than one request per
 * anime, and anime that have clearly settled (long finished, or gone from
 * AniList entirely) are flagged out of future sweeps so the backlog actually
 * shrinks instead of cycling.
 */
class RefreshStaleAnimeBatch implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 300;

    /**
     * Attempts are bounded by retryUntil() rather than a fixed count: the job
     * releases itself back onto the queue while AniList is unavailable, and
     * every one of those releases would otherwise burn an attempt and kill the
     * whole chain with MaxAttemptsExceededException.
     */
    public int $tries = 0;

    /**
     * Genuine errors (as opposed to outage releases) still fail fast.
     */
    public int $maxExceptions = 3;

    public function __construct(
        public readonly int $batchNumber = 1,
        public readonly ?int $staleDays = null,
        public readonly ?int $maxBatches = null,
        public readonly ?int $syncRunId = null,
    ) {}

    /**
     * Long enough to sit out several AniList circuit-breaker windows
     * (900s each by default) before giving up on the batch.
     */
    public function retryUntil(): \DateTimeInterface
    {
        return now()->addHours(6);
    }

    public function handle(
        AniListClient $client,
        AnimeDataPersistenceService $persistenceService,
        AnimeRefreshPolicy $policy,
        SyncRunTracker $tracker,
    ): void {
        $run = $tracker->find($this->syncRunId)
            ?? $tracker->start(SyncRun::MODE_STALE_REFRESH);

        $staleDays = $this->staleDays ?? (int) config('anilist.refresh.stale_after_days', 30);
        $batchSize = max(1, (int) config('anilist.refresh.batch_size', 50));
        $maxBatches = max(1, $this->maxBatches ?? (int) config('anilist.refresh.max_batches_per_run', 200));

        $candidates = Anime::query()
            ->refreshable()
            ->stale($staleDays)
            // Never-synced rows first, then the longest-stale.
            ->orderByRaw('synced_at is null desc')
            ->orderBy('synced_at')
            ->limit($batchSize)
            ->get(['id', 'anilist_id']);

        if ($candidates->isEmpty()) {
            $tracker->complete($run);
            Log::info('Stale anime refresh complete — no refreshable stale anime left', [
                'batches' => $this->batchNumber - 1,
                'stale_days' => $staleDays,
            ]);

            return;
        }

        $requestedIds = $candidates->pluck('anilist_id')->filter()->values();

        try {
            $data = $client->query(AniListQueryBuilder::animeByIds(), [
                'page' => 1,
                'perPage' => max(1, $requestedIds->count()),
                'ids' => $requestedIds->all(),
            ]);
        } catch (AniListServiceUnavailableException $e) {
            $tracker->pause($run, $e->getMessage());

            Log::warning('RefreshStaleAnimeBatch paused: AniList unavailable', [
                'batch' => $this->batchNumber,
                'retry_after_s' => $e->retryAfter,
            ]);

            $this->release($e->retryAfter);

            return;
        }

        $client->storeRawResponse(
            'Page.media',
            "stale-refresh:batch:{$this->batchNumber}",
            $data,
        );

        $mediaItems = $data['Page']['media'] ?? [];

        $refreshed = collect();
        if (! empty($mediaItems)) {
            $refreshed = $persistenceService->persistBatch($mediaItems);
        }

        // Anything AniList did not return no longer exists upstream, so no
        // amount of re-fetching will ever update it. Flag those rows out of
        // the sweep, otherwise the same batch is selected forever.
        $returnedIds = collect($mediaItems)->pluck('id')->filter()->all();
        $missingIds = $candidates
            ->whereNotIn('anilist_id', $returnedIds)
            ->pluck('id')
            ->all();

        $missingCount = $policy->exclude($missingIds, AnimeRefreshPolicy::REASON_MISSING_UPSTREAM);
        $settledCount = $policy->applyTo($refreshed);

        $remaining = Anime::query()->refreshable()->stale($staleDays)->count();
        $estimatedBatches = $this->batchNumber + (int) ceil($remaining / $batchSize);

        $tracker->advance(
            run: $run,
            page: $this->batchNumber,
            lastPage: $estimatedBatches,
            totalItems: $run->processed_items + count($mediaItems) + $remaining,
            processedDelta: count($mediaItems),
        );

        Log::info('RefreshStaleAnimeBatch processed', [
            'batch' => $this->batchNumber,
            'requested' => $requestedIds->count(),
            'refreshed' => count($mediaItems),
            'excluded_missing' => $missingCount,
            'excluded_settled' => $settledCount,
            'remaining' => $remaining,
        ]);

        if ($remaining === 0) {
            $tracker->complete($run);
            Log::info('Stale anime refresh complete', ['batches' => $this->batchNumber]);

            return;
        }

        if ($this->batchNumber >= $maxBatches) {
            $tracker->complete($run);
            Log::info('Stale anime refresh hit its per-run batch cap', [
                'batches' => $this->batchNumber,
                'remaining' => $remaining,
            ]);

            return;
        }

        self::dispatch(
            batchNumber: $this->batchNumber + 1,
            staleDays: $this->staleDays,
            maxBatches: $this->maxBatches,
            syncRunId: $run->id,
        )->onQueue('sync');
    }

    public function failed(\Throwable $e): void
    {
        $tracker = app(SyncRunTracker::class);
        $run = $tracker->find($this->syncRunId);

        if ($run !== null) {
            $tracker->fail($run, $e);
        }

        Log::error('RefreshStaleAnimeBatch failed', [
            'batch' => $this->batchNumber,
            'exception' => $e,
        ]);
    }
}
