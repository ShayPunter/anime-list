<?php

namespace Tests\Feature\Discover;

use App\Models\Anime;
use App\Models\Genre;
use App\Models\User;
use App\Models\UserAnimeList;
use App\Models\UserAnimeRecommendation;
use App\Services\FeatureFlagService;
use Tests\TestCase;

class PickedForYouTest extends TestCase
{
    public function test_picked_for_you_is_null_when_feature_flag_is_off(): void
    {
        $user = User::factory()->create();
        app(FeatureFlagService::class)->activateForUser('discover-page', $user);

        $this->actingAs($user)
            ->get('/discover')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('DiscoverPage')
                ->where('pickedForYou', null)
            );
    }

    public function test_picked_for_you_surfaces_precomputed_recommendations_when_present(): void
    {
        $user = User::factory()->create();
        $features = app(FeatureFlagService::class);
        $features->activateForUser('discover-page', $user);
        $features->activateForUser('picked-for-you', $user);

        $target = Anime::factory()->create([
            'title_english' => 'Precomputed Pick',
            'is_adult' => false,
        ]);

        UserAnimeRecommendation::create([
            'user_id' => $user->id,
            'anime_id' => $target->id,
            'score' => 4.2,
            'strategy' => 'hybrid',
            'rank' => 1,
            'computed_at' => now(),
        ]);

        $this->actingAs($user)
            ->get('/discover')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('DiscoverPage')
                ->where('pickedForYou.source', 'precomputed')
                ->has('pickedForYou.items', 1)
                ->where('pickedForYou.items.0.title_english', 'Precomputed Pick'),
            );
    }

    public function test_picked_for_you_falls_back_to_live_compute_when_table_is_empty(): void
    {
        $user = User::factory()->create();
        $features = app(FeatureFlagService::class);
        $features->activateForUser('discover-page', $user);
        $features->activateForUser('picked-for-you', $user);

        $action = Genre::factory()->create(['name' => 'Action']);

        // Six rated entries push user past cold-start threshold.
        for ($i = 0; $i < 6; $i++) {
            $seed = Anime::factory()->create();
            $seed->genres()->attach($action);
            UserAnimeList::factory()->completed()->create([
                'user_id' => $user->id,
                'anime_id' => $seed->id,
                'score' => 90,
            ]);
        }

        $candidate = Anime::factory()->create([
            'title_english' => 'Live Match',
            'is_adult' => false,
        ]);
        $candidate->genres()->attach($action);

        $this->actingAs($user)
            ->get('/discover')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('DiscoverPage')
                ->where('pickedForYou.source', 'live')
                ->has('pickedForYou.items')
            );
    }
}
