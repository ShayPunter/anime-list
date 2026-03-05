<?php

namespace App\Console\Commands;

use App\Jobs\SyncAiringSchedulePage;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class SyncScheduleCommand extends Command
{
    protected $signature = 'sync:schedule
                            {--days=7 : Number of days ahead to sync}
                            {--watch : Watch progress after dispatching}';

    protected $description = 'Sync airing schedules from AniList for the next N days';

    public function handle(): int
    {
        $days = (int) $this->option('days');
        $now = now();

        $airingAtGreater = $now->timestamp;
        $airingAtLesser = $now->copy()->addDays($days)->timestamp;

        $this->info("Syncing airing schedules for the next {$days} days");

        $progressTtl = config('anilist.sync.progress_cache_ttl', 86400);
        Cache::put('sync:schedule:status', 'running', $progressTtl);
        Cache::put('sync:schedule:progress', [
            'last_completed_page' => 0,
            'last_page' => 0,
            'total' => 0,
            'started_at' => now()->toIso8601String(),
        ], $progressTtl);

        SyncAiringSchedulePage::dispatch(
            page: 1,
            airingAtGreater: $airingAtGreater,
            airingAtLesser: $airingAtLesser,
            perPage: config('anilist.sync.per_page', 50),
        )->onQueue('sync');

        $this->info('Airing schedule sync dispatched.');

        if ($this->option('watch')) {
            $this->watchProgress();
        } else {
            $this->info('Tip: use --watch to follow progress, or monitor with: php artisan horizon');
        }

        return self::SUCCESS;
    }

    private function watchProgress(): void
    {
        $this->newLine();
        $this->info('Watching sync progress... (Ctrl+C to stop)');
        $this->newLine();

        $lastPage = 0;
        $staleCount = 0;

        while (true) {
            $status = Cache::get('sync:schedule:status', 'unknown');
            $progress = Cache::get('sync:schedule:progress');

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
                    $this->output->write("\r  [{$bar}] {$percent}% — Page {$currentPage}/{$totalPages} ({$totalItems} schedules)");
                } else {
                    $this->output->write("\r  Page {$currentPage}/? ({$totalItems} schedules) — discovering total...");
                }
            } else {
                $staleCount++;
            }

            if ($status === 'completed') {
                $this->newLine();
                $this->newLine();
                $this->info("Sync complete! {$totalItems} airing schedules across {$currentPage} pages.");

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
