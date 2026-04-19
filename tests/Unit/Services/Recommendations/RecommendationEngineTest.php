<?php

namespace Tests\Unit\Services\Recommendations;

use App\Models\Anime;
use App\Models\Genre;
use App\Models\Recommendation;
use App\Models\Studio;
use App\Models\User;
use App\Models\UserAnimeList;
use App\Services\Recommendations\RecommendationEngine;
use App\Services\Recommendations\TasteProfileService;
use Tests\TestCase;

class RecommendationEngineTest extends TestCase
{
    private RecommendationEngine $engine;

    protected function setUp(): void
    {
        parent::setUp();
        $this->engine = new RecommendationEngine(new TasteProfileService);
    }

    public function test_excludes_anime_already_on_users_list(): void
    {
        $user = User::factory()->create();
        $action = Genre::factory()->create(['name' => 'Action']);

        $seeds = Anime::factory()->count(6)->create();
        foreach ($seeds as $seed) {
            $seed->genres()->attach($action);
            UserAnimeList::factory()->completed()->create([
                'user_id' => $user->id,
                'anime_id' => $seed->id,
                'score' => 90,
            ]);
        }

        $candidate = Anime::factory()->create(['is_adult' => false]);
        $candidate->genres()->attach($action);

        $ranked = $this->engine->recommendFor($user, 20);
        $rankedIds = $ranked->pluck('id')->all();

        foreach ($seeds as $seed) {
            $this->assertNotContains($seed->id, $rankedIds);
        }
        $this->assertContains($candidate->id, $rankedIds);
    }

    public function test_excludes_adult_content(): void
    {
        $user = User::factory()->create();
        $romance = Genre::factory()->create(['name' => 'Romance']);

        // Enough rated entries to escape cold-start.
        for ($i = 0; $i < 6; $i++) {
            $anime = Anime::factory()->create();
            $anime->genres()->attach($romance);
            UserAnimeList::factory()->completed()->create([
                'user_id' => $user->id,
                'anime_id' => $anime->id,
                'score' => 90,
            ]);
        }

        $adult = Anime::factory()->adult()->create();
        $adult->genres()->attach($romance);

        $ranked = $this->engine->recommendFor($user, 20);

        $this->assertNotContains($adult->id, $ranked->pluck('id')->all());
    }

    public function test_caps_at_two_results_per_studio(): void
    {
        $user = User::factory()->create();
        $genre = Genre::factory()->create(['name' => 'Action']);
        $studio = Studio::factory()->create(['name' => 'OverusedStudio']);

        // 6 rated entries to escape cold start; none tied to the same studio.
        for ($i = 0; $i < 6; $i++) {
            $seed = Anime::factory()->create();
            $seed->genres()->attach($genre);
            UserAnimeList::factory()->completed()->create([
                'user_id' => $user->id,
                'anime_id' => $seed->id,
                'score' => 95,
            ]);
        }

        // 8 candidates all from one studio → should only surface 2.
        for ($i = 0; $i < 8; $i++) {
            $anime = Anime::factory()->create(['is_adult' => false]);
            $anime->genres()->attach($genre);
            $anime->studios()->attach($studio, ['is_main' => true]);
        }

        $ranked = $this->engine->recommendFor($user, 20);
        $fromStudio = $ranked->filter(
            fn (Anime $a) => $a->studios->contains('name', 'OverusedStudio'),
        );

        $this->assertLessThanOrEqual(2, $fromStudio->count());
    }

    public function test_cold_start_returns_popular_in_plan_to_watch_genres(): void
    {
        $user = User::factory()->create();
        $thriller = Genre::factory()->create(['name' => 'Thriller']);
        $comedy = Genre::factory()->create(['name' => 'Comedy']);

        $planned = Anime::factory()->create();
        $planned->genres()->attach($thriller);
        UserAnimeList::factory()->create([
            'user_id' => $user->id,
            'anime_id' => $planned->id,
            'status' => UserAnimeList::STATUS_PLAN_TO_WATCH,
            'score' => 0,
        ]);

        $matching = Anime::factory()->create([
            'is_adult' => false,
            'bayesian_score' => 85,
            'status' => 'FINISHED',
        ]);
        $matching->genres()->attach($thriller);

        $unrelated = Anime::factory()->create([
            'is_adult' => false,
            'bayesian_score' => 90,
            'status' => 'FINISHED',
        ]);
        $unrelated->genres()->attach($comedy);

        $ranked = $this->engine->recommendFor($user, 10);
        $ids = $ranked->pluck('id')->all();

        $this->assertContains($matching->id, $ids);
        $this->assertNotContains($unrelated->id, $ids);
    }

    public function test_item_item_strategy_pulls_from_recommendation_graph(): void
    {
        $user = User::factory()->create();
        $genre = Genre::factory()->create(['name' => 'Action']);

        // Build 6 rated entries so user escapes cold-start.
        $anchors = [];
        for ($i = 0; $i < 6; $i++) {
            $seed = Anime::factory()->create();
            $seed->genres()->attach($genre);
            UserAnimeList::factory()->completed()->create([
                'user_id' => $user->id,
                'anime_id' => $seed->id,
                'score' => 95,
            ]);
            $anchors[] = $seed;
        }

        // Recommendation graph pointer from each anchor to the same target.
        $target = Anime::factory()->create([
            'is_adult' => false,
            'bayesian_score' => 60,
        ]);
        // The target has *no* shared genres so content-based scores it at ~0;
        // any inclusion must come from the item-item strategy.
        foreach ($anchors as $index => $anchor) {
            Recommendation::create([
                'anime_id' => $anchor->id,
                'recommended_anime_id' => $target->id,
                'source' => 'anilist',
                'anilist_recommendation_id' => 1000 + $index,
                'rating' => 80,
            ]);
        }

        $ranked = $this->engine->recommendFor($user, 20);

        $this->assertContains($target->id, $ranked->pluck('id')->all());
    }

    public function test_recommendation_score_attribute_is_attached(): void
    {
        $user = User::factory()->create();
        $genre = Genre::factory()->create(['name' => 'Action']);

        for ($i = 0; $i < 6; $i++) {
            $seed = Anime::factory()->create();
            $seed->genres()->attach($genre);
            UserAnimeList::factory()->completed()->create([
                'user_id' => $user->id,
                'anime_id' => $seed->id,
                'score' => 95,
            ]);
        }

        $candidate = Anime::factory()->create(['is_adult' => false]);
        $candidate->genres()->attach($genre);

        $ranked = $this->engine->recommendFor($user, 10);
        $top = $ranked->first();

        $this->assertNotNull($top);
        $this->assertIsFloat($top->recommendation_score);
        $this->assertGreaterThan(0, $top->recommendation_score);
    }
}
