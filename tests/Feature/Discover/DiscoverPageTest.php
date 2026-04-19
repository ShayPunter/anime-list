<?php

namespace Tests\Feature\Discover;

use App\Models\Anime;
use App\Models\Genre;
use App\Models\Recommendation;
use App\Models\User;
use App\Models\UserAnimeList;
use App\Services\FeatureFlagService;
use Tests\TestCase;

class DiscoverPageTest extends TestCase
{
    public function test_discover_page_is_404_when_flag_disabled_for_guest(): void
    {
        $this->get('/discover')->assertNotFound();
    }

    public function test_discover_page_renders_when_flag_enabled_globally(): void
    {
        app(FeatureFlagService::class)->setGlobalStatus('discover-page', 'everyone');

        $this->get('/discover')->assertOk();
    }

    public function test_discover_page_renders_personalized_sections_for_authenticated_user(): void
    {
        $user = User::factory()->create();
        app(FeatureFlagService::class)->activateForUser('discover-page', $user);

        $anchor = Anime::factory()->create(['is_adult' => false]);
        $similar = Anime::factory()->create(['is_adult' => false]);

        UserAnimeList::factory()->create([
            'user_id' => $user->id,
            'anime_id' => $anchor->id,
            'status' => UserAnimeList::STATUS_COMPLETED,
            'score' => 90,
        ]);

        Recommendation::create([
            'anime_id' => $anchor->id,
            'recommended_anime_id' => $similar->id,
            'source' => 'anilist',
            'rating' => 50,
        ]);

        $this->actingAs($user)
            ->get('/discover')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('DiscoverPage')
                ->has('moods')
                ->has('lengths', 4)
                ->has('moreLikeIt')
                ->has('pickedForYou')
            );
    }

    public function test_mood_endpoint_filters_by_genre(): void
    {
        app(FeatureFlagService::class)->setGlobalStatus('discover-page', 'everyone');

        $sliceOfLife = Genre::factory()->create(['name' => 'Slice of Life']);
        $thriller = Genre::factory()->create(['name' => 'Thriller']);

        $cozy = Anime::factory()->create([
            'title_english' => 'Cozy Title',
            'is_adult' => false,
            'average_score' => 82,
            'bayesian_score' => 80,
        ]);
        $cozy->genres()->attach($sliceOfLife);

        $tense = Anime::factory()->create([
            'title_english' => 'Tense Title',
            'is_adult' => false,
            'average_score' => 88,
            'bayesian_score' => 85,
        ]);
        $tense->genres()->attach($thriller);

        $response = $this->getJson('/api/discover/mood/cozy-and-slow');

        $response->assertOk();
        $response->assertJsonPath('slug', 'cozy-and-slow');
        $titles = collect($response->json('data'))->pluck('title_english')->all();
        $this->assertContains('Cozy Title', $titles);
        $this->assertNotContains('Tense Title', $titles);
    }

    public function test_mood_endpoint_is_404_when_flag_disabled(): void
    {
        $this->getJson('/api/discover/mood/cozy-and-slow')->assertNotFound();
    }
}
