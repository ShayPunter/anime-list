<?php

namespace App\Console\Commands;

use App\Jobs\SyncAnimePage;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class SyncAnimeCommand extends Command
{
    protected $signature = 'sync:anime
                            {--full : Run full catalog sync from page 1}
                            {--resume : Resume full sync from last saved page}
                            {--page= : Start from specific page (implies full)}
                            {--status= : Sync only anime with this AniList status (RELEASING, NOT_YET_RELEASED, etc.)}
                            {--season= : Sync only this season (WINTER, SPRING, SUMMER, FALL)}
                            {--season-year= : Sync only this year (e.g. 2026)}
                            {--watch : Watch progress after dispatching}';

    protected $description = 'Sync anime data from AniList API';

    public function handle(): int
    {
        $progressTtl = config('anilist.sync.progress_cache_ttl', 86400);

        if ($this->option('status')) {
            $result = $this->runTargetedSync($progressTtl);
            $mode = 'targeted';
        } elseif ($this->option('full') || $this->option('page') || $this->option('resume')) {
            $result = $this->runFullSync($progressTtl);
            $mode = 'full';
        } else {
            $result = $this->runIncrementalSync($progressTtl);
            $mode = 'incremental';
        }

        if ($result === self::SUCCESS && $this->option('watch')) {
            $this->watchProgress($mode);
        }

        return $result;
    }

    private function runFullSync(int $progressTtl): int
    {
        $startPage = 1;

        if ($this->option('page')) {
            $startPage = (int) $this->option('page');
            if ($startPage < 1) {
                $this->error('Page number must be a positive integer.');

                return self::FAILURE;
            }
        } elseif ($this->option('resume')) {
            $progress = Cache::get('sync:full:progress');
            if ($progress && isset($progress['last_completed_page'])) {
                $startPage = $progress['last_completed_page'] + 1;
                $this->info("Resuming from page {$startPage} (last completed: {$progress['last_completed_page']} of {$progress['last_page']})");
            } else {
                $this->warn('No previous sync progress found. Starting from page 1.');
            }
        }

        Cache::put('sync:full:status', 'running', $progressTtl);
        Cache::put('sync:full:progress', [
            'last_completed_page' => $startPage - 1,
            'last_page' => 0,
            'total' => 0,
            'started_at' => now()->toIso8601String(),
        ], $progressTtl);

        SyncAnimePage::dispatch(
            page: $startPage,
            perPage: config('anilist.sync.per_page', 50),
            mode: 'full',
        )->onQueue('sync');

        $this->info("Full sync dispatched starting from page {$startPage}.");

        if (! $this->option('watch')) {
            $this->info('Tip: use --watch to follow progress, or monitor with: php artisan horizon');
        }

        return self::SUCCESS;
    }

    private function runTargetedSync(int $progressTtl): int
    {
        $status = strtoupper($this->option('status'));
        $validStatuses = ['FINISHED', 'RELEASING', 'NOT_YET_RELEASED', 'CANCELLED', 'HIATUS'];

        if (! in_array($status, $validStatuses)) {
            $this->error("Invalid status: {$status}. Valid: ".implode(', ', $validStatuses));

            return self::FAILURE;
        }

        $season = $this->option('season') ? strtoupper($this->option('season')) : null;
        $seasonYear = $this->option('season-year') ? (int) $this->option('season-year') : null;

        $label = "status={$status}";
        if ($season) {
            $label .= " season={$season}";
        }
        if ($seasonYear) {
            $label .= " year={$seasonYear}";
        }

        $this->info("Running targeted sync: {$label}");

        Cache::put('sync:targeted:status', 'running', $progressTtl);
        Cache::put('sync:targeted:progress', [
            'last_completed_page' => 0,
            'last_page' => 0,
            'total' => 0,
            'started_at' => now()->toIso8601String(),
        ], $progressTtl);

        SyncAnimePage::dispatch(
            page: 1,
            perPage: config('anilist.sync.per_page', 50),
            mode: 'targeted',
            updatedAtGreater: null,
            anilistStatus: $status,
            anilistSeason: $season,
            anilistSeasonYear: $seasonYear,
        )->onQueue('sync');

        $this->info('Targeted sync dispatched.');

        if (! $this->option('watch')) {
            $this->info('Tip: use --watch to follow progress, or monitor with: php artisan horizon');
        }

        return self::SUCCESS;
    }

    private function runIncrementalSync(int $progressTtl): int
    {
        $lastRun = Cache::get('sync:incremental:last_run');
        $updatedAtGreater = $lastRun ?? now()->subDay()->timestamp;

        $this->info('Running incremental sync for anime updated since '.date('Y-m-d H:i:s', $updatedAtGreater));

        Cache::put('sync:incremental:status', 'running', $progressTtl);

        SyncAnimePage::dispatch(
            page: 1,
            perPage: config('anilist.sync.per_page', 50),
            mode: 'incremental',
            updatedAtGreater: $updatedAtGreater,
        )->onQueue('sync');

        $this->info('Incremental sync dispatched.');

        if (! $this->option('watch')) {
            $this->info('Tip: use --watch to follow progress, or monitor with: php artisan horizon');
        }

        return self::SUCCESS;
    }

    private function watchProgress(string $mode): void
    {
        $this->newLine();
        $this->info('Watching sync progress... (Ctrl+C to stop)');
        $this->newLine();

        $lastPage = 0;
        $staleCount = 0;

        while (true) {
            $status = Cache::get("sync:{$mode}:status", 'unknown');
            $progress = Cache::get("sync:{$mode}:progress");

            if (! $progress) {
                sleep(2);
                $staleCount++;
                if ($staleCount > 30) {
                    $this->warn('No progress data found after 60s. Is Horizon running?');

                    break;
                }

                continue;
            }

            $currentPage = $progress['last_completed_page'] ?? 0;
            $totalPages = $progress['last_page'] ?? 0;
            $totalItems = $progress['total'] ?? 0;

            if ($currentPage !== $lastPage) {
                $staleCount = 0;
                $lastPage = $currentPage;

                if ($totalPages > 0) {
                    $percent = round(($currentPage / $totalPages) * 100);
                    $bar = str_repeat('=', (int) ($percent / 2)).'>'.str_repeat(' ', 50 - (int) ($percent / 2));
                    $this->output->write("\r  [{$bar}] {$percent}% — Page {$currentPage}/{$totalPages} ({$totalItems} anime)");
                } else {
                    $this->output->write("\r  Page {$currentPage}/? ({$totalItems} anime) — discovering total...");
                }
            } else {
                $staleCount++;
            }

            if ($status === 'completed') {
                $this->newLine();
                $this->newLine();
                $this->info("Sync complete! {$totalItems} anime across {$currentPage} pages.");

                break;
            }

            if ($status === 'failed') {
                $this->newLine();
                $this->newLine();
                $this->error("Sync failed on page {$currentPage}. Check logs for details.");

                break;
            }

            if ($staleCount > 60) {
                $this->newLine();
                $this->newLine();
                $this->warn('No progress update for 2 minutes. Sync may have stalled.');

                break;
            }

            sleep(2);
        }
    }
}
