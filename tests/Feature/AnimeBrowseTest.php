<?php

namespace Tests\Feature;

use App\Models\Anime;
use App\Models\Genre;
use Tests\TestCase;

class AnimeBrowseTest extends TestCase
{
    public function test_public_users_can_browse_the_anime_index(): void
    {
        Anime::factory()->count(3)->create(['is_adult' => false]);

        $this->get('/anime')->assertOk();
    }

    public function test_adult_titles_are_excluded_from_the_browse_list(): void
    {
        Anime::factory()->create(['is_adult' => false, 'title_english' => 'Safe Title']);
        Anime::factory()->adult()->create(['title_english' => 'Adult Title']);

        $response = $this->get('/anime');

        $response->assertOk();
        $response->assertSee('Safe Title');
        $response->assertDontSee('Adult Title');
    }

    public function test_anime_detail_page_renders_for_a_valid_slug(): void
    {
        $anime = Anime::factory()->create([
            'title_english' => 'Cowboy Bebop',
            'is_adult' => false,
        ]);

        $this->get("/anime/{$anime->slug}")->assertOk();
    }

    public function test_anime_detail_page_is_404_for_adult_title(): void
    {
        $anime = Anime::factory()->adult()->create();

        $this->get("/anime/{$anime->slug}")->assertNotFound();
    }

    public function test_anime_detail_404s_on_missing_slug(): void
    {
        $this->get('/anime/does-not-exist-slug')->assertNotFound();
    }

    public function test_top_pages_render_with_anime_present(): void
    {
        Anime::factory()->count(3)->create();

        $this->get('/top')->assertOk();
        $this->get('/top/popular')->assertOk();
    }

    public function test_seasonal_page_renders_with_current_season(): void
    {
        Anime::factory()->count(2)->create();

        $this->get('/seasonal')->assertOk();
    }

    public function test_filtering_by_genre_narrows_results(): void
    {
        $genreA = Genre::factory()->create(['name' => 'Action']);
        $genreB = Genre::factory()->create(['name' => 'Romance']);

        $action = Anime::factory()->create(['title_english' => 'Action Title']);
        $romance = Anime::factory()->create(['title_english' => 'Romance Title']);
        $action->genres()->attach($genreA->id);
        $romance->genres()->attach($genreB->id);

        $response = $this->get('/anime?filter[genre]=Action');

        $response->assertOk();
        $response->assertSee('Action Title');
        $response->assertDontSee('Romance Title');
    }
}
