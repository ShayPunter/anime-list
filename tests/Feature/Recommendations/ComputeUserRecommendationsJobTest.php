<?php

namespace Tests\Feature\Recommendations;

use App\Jobs\ComputeUserRecommendations;
use App\Models\Anime;
use App\Models\Genre;
use App\Models\User;
use App\Models\UserAnimeList;
use App\Models\UserAnimeRecommendation;
use Tests\TestCase;

class ComputeUserRecommendationsJobTest extends TestCase
{
    public function test_job_persists_ranked_recommendations_for_user(): void
    {
        $user = User::factory()->create();
        $action = Genre::factory()->create(['name' => 'Action']);

        for ($i = 0; $i < 6; $i++) {
            $seed = Anime::factory()->create();
            $seed->genres()->attach($action);
            UserAnimeList::factory()->completed()->create([
                'user_id' => $user->id,
                'anime_id' => $seed->id,
                'score' => 9,
            ]);
        }

        $candidate = Anime::factory()->create(['is_adult' => false]);
        $candidate->genres()->attach($action);

        ComputeUserRecommendations::dispatchSync($user->id, 25);

        $rows = UserAnimeRecommendation::query()
            ->where('user_id', $user->id)
            ->orderBy('rank')
            ->get();

        $this->assertGreaterThan(0, $rows->count());
        $this->assertSame(1, $rows->first()->rank);
        $this->assertTrue($rows->pluck('anime_id')->contains($candidate->id));
    }

    public function test_job_replaces_previous_recommendations(): void
    {
        $user = User::factory()->create();
        $action = Genre::factory()->create(['name' => 'Action']);

        UserAnimeRecommendation::create([
            'user_id' => $user->id,
            'anime_id' => Anime::factory()->create()->id,
            'score' => 1.0,
            'strategy' => 'hybrid',
            'rank' => 1,
            'computed_at' => now()->subWeek(),
        ]);

        for ($i = 0; $i < 6; $i++) {
            $seed = Anime::factory()->create();
            $seed->genres()->attach($action);
            UserAnimeList::factory()->completed()->create([
                'user_id' => $user->id,
                'anime_id' => $seed->id,
                'score' => 9,
            ]);
        }

        Anime::factory()->create(['is_adult' => false])->genres()->attach($action);

        ComputeUserRecommendations::dispatchSync($user->id, 10);

        $computedAt = UserAnimeRecommendation::query()
            ->where('user_id', $user->id)
            ->min('computed_at');

        $this->assertNotNull($computedAt);
        $this->assertTrue(now()->subMinute()->lte($computedAt));
    }
}
