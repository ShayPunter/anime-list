<?php

namespace App\Jobs;

use App\Models\User;
use App\Models\UserAnimeRecommendation;
use App\Services\Recommendations\RecommendationEngine;
use App\Services\Recommendations\TasteProfileService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ComputeUserRecommendations implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 120;

    public int $tries = 2;

    public function __construct(
        public readonly int $userId,
        public readonly int $limit = 100,
    ) {}

    public function handle(
        RecommendationEngine $engine,
        TasteProfileService $profiles,
    ): void {
        $user = User::find($this->userId);
        if (! $user) {
            return;
        }

        // Force a fresh profile — nightly recompute should reflect the latest list state.
        $profiles->forget($user);

        $ranked = $engine->recommendFor($user, $this->limit);

        $now = now();
        $rows = [];
        $rank = 1;

        foreach ($ranked as $anime) {
            $rows[] = [
                'user_id' => $user->id,
                'anime_id' => $anime->id,
                'score' => (float) ($anime->recommendation_score ?? 0),
                'strategy' => 'hybrid',
                'rank' => $rank++,
                'computed_at' => $now,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::transaction(function () use ($user, $rows) {
            UserAnimeRecommendation::query()
                ->where('user_id', $user->id)
                ->delete();

            if (! empty($rows)) {
                foreach (array_chunk($rows, 200) as $chunk) {
                    UserAnimeRecommendation::insert($chunk);
                }
            }
        });

        Log::info('ComputeUserRecommendations completed', [
            'user_id' => $user->id,
            'count' => count($rows),
        ]);
    }
}
