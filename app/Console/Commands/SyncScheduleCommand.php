<?php

namespace App\Console\Commands;

use App\Jobs\SyncAiringSchedulePage;
use App\Models\SyncRun;
use App\Services\SyncRunTracker;
use Illuminate\Console\Command;

class SyncScheduleCommand extends Command
{
    protected $signature = 'sync:schedule
                            {--days=7 : Number of days ahead to sync}
                            {--watch : Watch progress after dispatching}';

    protected $description = 'Sync airing schedules from AniList for the next N days';

    public function __construct(private readonly SyncRunTracker $tracker)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $days = (int) $this->option('days');
        $now = now();

        $this->info("Syncing airing schedules for the next {$days} days");

        $run = $this->tracker->start(SyncRun::MODE_SCHEDULE);

        SyncAiringSchedulePage::dispatch(
            page: 1,
            airingAtGreater: $now->timestamp,
            airingAtLesser: $now->copy()->addDays($days)->timestamp,
            perPage: config('anilist.sync.per_page', 50),
            syncRunId: $run->id,
        )->onQueue('sync');

        $this->info('Airing schedule sync dispatched.');

        if ($this->option('watch')) {
            $this->watchProgress($run);
        } else {
            $this->info('Tip: use --watch to follow progress, or monitor with: php artisan horizon');
        }

        return self::SUCCESS;
    }

    private function watchProgress(SyncRun $run): void
    {
        $this->newLine();
        $this->info('Watching sync progress... (Ctrl+C to stop)');
        $this->newLine();

        $lastPage = 0;
        $staleCount = 0;

        while (true) {
            $run->refresh();

            $currentPage = $run->current_page;
            $totalPages = $run->last_page;
            $totalItems = $run->total_items;

            if ($currentPage !== $lastPage) {
                $staleCount = 0;
                $lastPage = $currentPage;

                if ($totalPages > 0) {
                    $percent = min(100, (int) round(($currentPage / $totalPages) * 100));
                    $bar = str_repeat('=', (int) ($percent / 2)).'>'.str_repeat(' ', 50 - (int) ($percent / 2));
                    $this->output->write("\r  [{$bar}] {$percent}% — Page {$currentPage}/{$totalPages} ({$totalItems} schedules)");
                } else {
                    $this->output->write("\r  Page {$currentPage}/? ({$totalItems} schedules) — discovering total...");
                }
            } else {
                $staleCount++;
            }

            if ($run->status === SyncRun::STATUS_COMPLETED) {
                $this->newLine(2);
                $this->info("Sync complete! {$totalItems} airing schedules across {$currentPage} pages.");

                break;
            }

            if ($run->status === SyncRun::STATUS_FAILED) {
                $this->newLine(2);
                $this->error("Sync failed on page {$currentPage}: {$run->last_error}");

                break;
            }

            if ($run->status === SyncRun::STATUS_SUPERSEDED) {
                $this->newLine(2);
                $this->warn('This run was superseded by a newer schedule sync.');

                break;
            }

            if ($staleCount > 60) {
                $this->newLine(2);
                $this->warn($run->status === SyncRun::STATUS_PAUSED
                    ? 'Sync is paused waiting on AniList to come back.'
                    : 'No progress update for 2 minutes. Sync may have stalled — is Horizon running?');

                break;
            }

            sleep(2);
        }
    }
}
