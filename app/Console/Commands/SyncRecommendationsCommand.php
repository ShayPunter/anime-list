<?php

namespace App\Console\Commands;

use App\Jobs\SyncRecommendationsPage;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class SyncRecommendationsCommand extends Command
{
    protected $signature = 'sync:recommendations
                            {--page=1 : Start from specific page}
                            {--per-page=50 : Page size for AniList}';

    protected $description = 'Backfill AniList anime-to-anime recommendations into the recommendations table';

    public function handle(): int
    {
        $page = max(1, (int) $this->option('page'));
        $perPage = max(1, (int) $this->option('per-page'));
        $progressTtl = config('anilist.sync.progress_cache_ttl', 86400);

        Cache::put('sync:recommendations:status', 'running', $progressTtl);
        Cache::put('sync:recommendations:progress', [
            'last_completed_page' => $page - 1,
            'last_page' => 0,
            'total' => 0,
            'started_at' => now()->toIso8601String(),
        ], $progressTtl);

        SyncRecommendationsPage::dispatch(page: $page, perPage: $perPage)->onQueue('sync');

        $this->info("Recommendations backfill dispatched starting from page {$page}.");
        $this->info('Monitor with: php artisan horizon');

        return self::SUCCESS;
    }
}
