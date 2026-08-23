<?php

namespace App\Console\Commands;

use App\Jobs\SyncRecommendationsPage;
use App\Models\SyncRun;
use App\Services\SyncRunTracker;
use Illuminate\Console\Command;

class SyncRecommendationsCommand extends Command
{
    protected $signature = 'sync:recommendations
                            {--page=1 : Start from specific page}
                            {--per-page=50 : Page size for AniList}';

    protected $description = 'Backfill AniList anime-to-anime recommendations into the recommendations table';

    public function __construct(private readonly SyncRunTracker $tracker)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $page = max(1, (int) $this->option('page'));
        $perPage = max(1, (int) $this->option('per-page'));

        $run = $this->tracker->start(SyncRun::MODE_RECOMMENDATIONS);
        $run->forceFill(['current_page' => $page - 1])->save();

        SyncRecommendationsPage::dispatch(page: $page, perPage: $perPage, syncRunId: $run->id)->onQueue('sync');

        $this->info("Recommendations backfill dispatched starting from page {$page}.");
        $this->info('Monitor with: php artisan horizon');

        return self::SUCCESS;
    }
}
