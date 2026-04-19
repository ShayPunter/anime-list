<?php

namespace App\Console\Commands;

use App\Jobs\ComputeUserRecommendations;
use App\Models\User;
use Illuminate\Console\Command;

class PrecomputeRecommendations extends Command
{
    protected $signature = 'recommendations:precompute
        {--days=30 : Dispatch for users active within this many days}
        {--user= : Precompute for a single user id, ignoring activity filter}
        {--limit=100 : Top-N to persist per user}';

    protected $description = 'Precompute "Picked for you" recommendations for active users';

    public function handle(): int
    {
        $limit = (int) $this->option('limit');

        if ($userId = $this->option('user')) {
            ComputeUserRecommendations::dispatch((int) $userId, $limit)
                ->onQueue('recommendations');
            $this->info("Dispatched recommendations job for user {$userId}.");

            return self::SUCCESS;
        }

        $days = (int) $this->option('days');
        $cutoff = now()->subDays($days);

        $count = 0;
        User::query()
            ->whereHas('animeList', fn ($q) => $q->where('user_anime_lists.updated_at', '>=', $cutoff))
            ->select('id')
            ->chunkById(200, function ($users) use (&$count, $limit) {
                foreach ($users as $user) {
                    ComputeUserRecommendations::dispatch($user->id, $limit)
                        ->onQueue('recommendations');
                    $count++;
                }
            });

        $this->info("Dispatched {$count} recommendation jobs (active in last {$days} days).");

        return self::SUCCESS;
    }
}
