<?php

namespace App\Console\Commands;

use App\Jobs\RefreshStaleAnimeBatch;
use App\Models\Anime;
use App\Models\SyncRun;
use App\Services\AnimeRefreshPolicy;
use App\Services\SyncRunTracker;
use Illuminate\Console\Command;

class RefreshStaleAnimeCommand extends Command
{
    protected $signature = 'anime:refresh-stale
                            {--days= : Treat anime as stale after this many days (default from config)}
                            {--batches= : Cap the number of batches this run dispatches}
                            {--include-excluded : Clear every refresh exclusion first, so settled anime are swept again}
                            {--force : Start even if a stale refresh is already in progress}
                            {--dry-run : Report the backlog without dispatching anything}';

    protected $description = 'Refresh anime whose local copy has gone stale, skipping ones flagged as settled';

    public function __construct(
        private readonly SyncRunTracker $tracker,
        private readonly AnimeRefreshPolicy $policy,
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        $days = $this->option('days') !== null
            ? (int) $this->option('days')
            : (int) config('anilist.refresh.stale_after_days', 30);

        $batches = $this->option('batches') !== null ? (int) $this->option('batches') : null;
        $batchSize = max(1, (int) config('anilist.refresh.batch_size', 50));

        if ($this->option('include-excluded')) {
            $restored = $this->policy->include(
                Anime::query()->refreshExcluded()->pluck('id')->all()
            );
            $this->info("Cleared refresh exclusions on {$restored} anime.");
        }

        $stale = Anime::query()->refreshable()->stale($days)->count();
        $excluded = Anime::query()->refreshExcluded()->count();

        $this->info("Stale anime awaiting refresh: {$stale} (excluded as settled: {$excluded})");

        if ($stale === 0) {
            $this->info('Nothing to refresh.');

            return self::SUCCESS;
        }

        $plannedBatches = (int) ceil($stale / $batchSize);
        $cap = $batches ?? (int) config('anilist.refresh.max_batches_per_run', 200);
        $this->info("Batches needed: {$plannedBatches} at {$batchSize} per request (cap this run: {$cap})");

        if ($this->option('dry-run')) {
            $this->comment('Dry run — nothing dispatched.');

            return self::SUCCESS;
        }

        if (! $this->option('force') && $this->tracker->hasRunInProgress(SyncRun::MODE_STALE_REFRESH)) {
            $this->error('A stale refresh is already in progress. Use --force to start another anyway.');

            return self::FAILURE;
        }

        $run = $this->tracker->start(SyncRun::MODE_STALE_REFRESH);

        RefreshStaleAnimeBatch::dispatch(
            batchNumber: 1,
            staleDays: $days,
            maxBatches: $batches,
            syncRunId: $run->id,
        )->onQueue('sync');

        $this->info('Stale anime refresh dispatched.');

        return self::SUCCESS;
    }
}
