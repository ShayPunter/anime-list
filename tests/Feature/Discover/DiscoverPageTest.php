<?php

namespace Tests\Feature\Discover;

use App\Models\AiringSchedule;
use App\Models\Anime;
use App\Models\Genre;
use App\Models\Recommendation;
use App\Models\User;
use App\Models\UserAnimeList;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class DiscoverPageTest extends TestCase
{
    public function test_discover_page_renders_at_root_for_guest(): void
    {
        $this->get('/')->assertOk();
    }

    public function test_legacy_discover_url_redirects_to_root(): void
    {
        $this->get('/discover')->assertRedirect('/');
    }

    public function test_discover_page_renders_personalized_sections_for_authenticated_user(): void
    {
        $user = User::factory()->create();

        $anchor = Anime::factory()->create(['is_adult' => false]);
        $similar = Anime::factory()->create(['is_adult' => false]);

        UserAnimeList::factory()->create([
            'user_id' => $user->id,
            'anime_id' => $anchor->id,
            'status' => UserAnimeList::STATUS_COMPLETED,
            'score' => 9,
        ]);

        Recommendation::create([
            'anime_id' => $anchor->id,
            'recommended_anime_id' => $similar->id,
            'source' => 'anilist',
            'rating' => 50,
        ]);

        $this->actingAs($user)
            ->get('/')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('DiscoverPage')
                ->has('moods')
                ->has('lengths', 4)
                ->has('moreLikeIt')
            );
    }

    public function test_recently_updated_lists_anime_ordered_by_latest_aired_episode(): void
    {
        Cache::flush();

        $older = Anime::factory()->create(['title_english' => 'Older Show', 'is_adult' => false]);
        $newer = Anime::factory()->create(['title_english' => 'Newer Show', 'is_adult' => false]);
        $adult = Anime::factory()->create(['title_english' => 'Adult Show', 'is_adult' => true]);

        AiringSchedule::create([
            'anime_id' => $older->id,
            'anilist_airing_id' => 1001,
            'episode' => 5,
            'airs_at' => now()->subDays(3),
        ]);
        AiringSchedule::create([
            'anime_id' => $newer->id,
            'anilist_airing_id' => 1002,
            'episode' => 9,
            'airs_at' => now()->subHours(2),
        ]);
        AiringSchedule::create([
            'anime_id' => $adult->id,
            'anilist_airing_id' => 1003,
            'episode' => 4,
            'airs_at' => now()->subHour(),
        ]);
        // Future episode should not appear.
        AiringSchedule::create([
            'anime_id' => $newer->id,
            'anilist_airing_id' => 1004,
            'episode' => 10,
            'airs_at' => now()->addDay(),
        ]);

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('DiscoverPage')
                ->has('recentlyUpdated', 2)
                ->where('recentlyUpdated.0.anime.title_english', 'Newer Show')
                ->where('recentlyUpdated.0.latest_episode', 9)
                ->where('recentlyUpdated.1.anime.title_english', 'Older Show')
            );
    }

    public function test_mood_endpoint_filters_by_genre(): void
    {
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
}
