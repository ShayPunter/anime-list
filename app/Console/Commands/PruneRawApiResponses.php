<?php

namespace App\Console\Commands;

use App\Models\RawApiResponse;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class PruneRawApiResponses extends Command
{
    protected $signature = 'anilist:prune-raw-responses
                            {--days=7 : Delete rows older than this many days (by fetched_at)}
                            {--chunk=1000 : Number of rows to delete per batch}
                            {--dry-run : Report what would be deleted without deleting anything}';

    protected $description = 'Prune old rows from the raw_api_responses table to reclaim disk space';

    public function handle(): int
    {
        $days = (int) $this->option('days');
        $chunk = max(1, (int) $this->option('chunk'));
        $dryRun = (bool) $this->option('dry-run');

        if ($days < 0) {
            $this->error('--days must be zero or positive.');

            return self::FAILURE;
        }

        $cutoff = now()->subDays($days);

        $baseQuery = RawApiResponse::query()->where('fetched_at', '<', $cutoff);

        $count = (clone $baseQuery)->count();

        if ($count === 0) {
            $this->info("No raw_api_responses rows older than {$cutoff->toDateTimeString()} — nothing to prune.");

            return self::SUCCESS;
        }

        // Estimate freed space using average row length for the table.
        $estimateMb = $this->estimateFreedMegabytes($count);
        $estimateLabel = $estimateMb !== null ? sprintf(' (~%.1f MB)', $estimateMb) : '';

        if ($dryRun) {
            $this->info("[dry-run] Would delete {$count} rows older than {$cutoff->toDateTimeString()}{$estimateLabel}.");
            $this->line('Run without --dry-run to actually prune.');

            return self::SUCCESS;
        }

        $this->info("Pruning {$count} rows older than {$cutoff->toDateTimeString()}{$estimateLabel}...");

        $deleted = 0;
        $bar = $this->output->createProgressBar($count);
        $bar->start();

        do {
            $batch = (clone $baseQuery)->limit($chunk)->delete();
            $deleted += $batch;
            $bar->advance($batch);
        } while ($batch > 0);

        $bar->finish();
        $this->newLine();

        $this->info("Pruned {$deleted} rows.");
        $this->line('Note: InnoDB does not release disk space back to the OS automatically.');
        $this->line('Run `OPTIMIZE TABLE raw_api_responses;` in MySQL to reclaim disk.');

        return self::SUCCESS;
    }

    /**
     * Estimate MB that would be freed based on InnoDB avg_row_length.
     */
    private function estimateFreedMegabytes(int $rowCount): ?float
    {
        try {
            $row = DB::selectOne(
                'SELECT avg_row_length FROM information_schema.tables
                 WHERE table_schema = DATABASE() AND table_name = ?',
                ['raw_api_responses']
            );
        } catch (\Throwable) {
            return null;
        }

        $avg = (int) ($row->avg_row_length ?? 0);

        if ($avg <= 0) {
            return null;
        }

        return ($rowCount * $avg) / 1024 / 1024;
    }
}
