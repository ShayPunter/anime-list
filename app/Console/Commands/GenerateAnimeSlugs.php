<?php

namespace App\Console\Commands;

use App\Models\Anime;
use Illuminate\Console\Command;

class GenerateAnimeSlugs extends Command
{
    protected $signature = 'anime:generate-slugs';

    protected $description = 'Generate slugs for all anime that do not have one';

    public function handle(): int
    {
        $count = Anime::whereNull('slug')->count();

        if ($count === 0) {
            $this->info('All anime already have slugs.');

            return self::SUCCESS;
        }

        $this->info("Generating slugs for {$count} anime...");

        $bar = $this->output->createProgressBar($count);

        Anime::whereNull('slug')->chunkById(500, function ($animes) use ($bar) {
            foreach ($animes as $anime) {
                $anime->slug = Anime::generateUniqueSlug($anime);
                $anime->saveQuietly();
                $bar->advance();
            }
        });

        $bar->finish();
        $this->newLine();
        $this->info('Done.');

        return self::SUCCESS;
    }
}
