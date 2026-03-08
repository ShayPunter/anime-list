<?php

namespace App\Console\Commands;

use App\Models\Anime;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class RecalculateBayesianScores extends Command
{
    protected $signature = 'anime:recalculate-bayesian';

    protected $description = 'Recalculate Bayesian scores for all anime based on AniList average scores and popularity';

    public function handle(): int
    {
        $this->info('Calculating global averages...');

        // Only consider anime with a score and meaningful popularity
        $globals = DB::table('anime')
            ->whereNotNull('average_score')
            ->where('average_score', '>', 0)
            ->where('popularity', '>', 0)
            ->selectRaw('AVG(average_score) as mean_score, AVG(popularity) as mean_popularity, COUNT(*) as total')
            ->first();

        if (! $globals || $globals->total === 0) {
            $this->warn('No anime with scores found. Nothing to calculate.');

            return self::SUCCESS;
        }

        $C = (float) $globals->mean_score;       // Global mean score
        $m = (float) $globals->mean_popularity;   // Minimum votes threshold (use mean popularity)

        $this->info("Global mean score (C): {$C}");
        $this->info("Minimum threshold (m): {$m}");
        $this->info("Anime with scores: {$globals->total}");

        // Bayesian formula: (v / (v + m)) * R + (m / (v + m)) * C
        // where R = average_score, v = popularity, m = threshold, C = global mean
        $updated = DB::table('anime')
            ->whereNotNull('average_score')
            ->where('average_score', '>', 0)
            ->where('popularity', '>', 0)
            ->update([
                'bayesian_score' => DB::raw(
                    "ROUND((popularity / (popularity + {$m})) * average_score + ({$m} / (popularity + {$m})) * {$C})"
                ),
            ]);

        // Clear scores for anime without ratings
        DB::table('anime')
            ->where(function ($q) {
                $q->whereNull('average_score')
                    ->orWhere('average_score', '=', 0)
                    ->orWhereNull('popularity')
                    ->orWhere('popularity', '=', 0);
            })
            ->update(['bayesian_score' => null]);

        $this->info("Updated Bayesian scores for {$updated} anime.");

        // Clear relevant caches
        Cache::forget('top:rated:100');
        Cache::forget('home:top_rated');

        $this->info('Cleared top rated caches.');

        return self::SUCCESS;
    }
}
