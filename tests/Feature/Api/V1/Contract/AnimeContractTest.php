<?php

namespace Tests\Feature\Api\V1\Contract;

use App\Models\Anime;
use App\Models\Genre;

class AnimeContractTest extends ApiContractTestCase
{
    /**
     * AnimeCardResource shape — used by /anime/search and (implicitly) by list
     * responses that embed anime data.
     */
    private const CARD_STRUCTURE = [
        'id',
        'slug',
        'anilist_id',
        'title_romaji',
        'title_english',
        'format',
        'status',
        'season',
        'season_year',
        'episodes',
        'cover_image_large',
        'cover_image_medium',
        'cover_image_color',
        'average_score',
        'bayesian_score',
        'popularity',
        'genres',
    ];

    /**
     * AnimeResource (full detail) shape — used by /anime/{slug} and
     * /anime/anilist/{id}. Genres, studios, external_ids, next_airing_episode
     * are eagerly loaded by the controllers.
     */
    private const DETAIL_STRUCTURE = [
        'id',
        'slug',
        'anilist_id',
        'mal_id',
        'title_romaji',
        'title_english',
        'title_native',
        'title_synonyms',
        'format',
        'status',
        'season',
        'season_year',
        'source',
        'episodes',
        'duration',
        'episode_count_unknown',
        'aired_from',
        'aired_to',
        'synopsis',
        'cover_image_large',
        'cover_image_medium',
        'cover_image_color',
        'banner_image',
        'trailer_url',
        'average_score',
        'mean_score',
        'bayesian_score',
        'popularity',
        'trending',
        'favourites',
        'is_adult',
        'genres',
        'studios',
        'external_ids',
        'next_airing_episode',
    ];

    /** GET /api/v1/anime/search → 200 with card-shaped items. */
    public function test_search_response_shape(): void
    {
        $user = $this->enabledUser();
        $token = $this->bearerFor($user);

        $genre = Genre::create(['name' => 'Action']);
        $anime = Anime::factory()->create([
            'title_romaji' => 'Naruto Contract',
            'is_adult' => false,
        ]);
        $anime->genres()->attach($genre->id);

        $response = $this->withHeaders($this->bearerHeader($token))
            ->getJson('/api/v1/anime/search?q=naruto');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => ['*' => self::CARD_STRUCTURE],
                'query',
                'total',
            ]);

        $this->assertIsArray($response->json('data'));
        $this->assertIsString($response->json('query'));
        $this->assertIsInt($response->json('total'));
        $this->assertSame('naruto', $response->json('query'));
        $this->assertGreaterThanOrEqual(1, $response->json('total'));

        $first = $response->json('data.0');
        $this->assertIsInt($first['id']);
        $this->assertIsString($first['slug']);
        $this->assertIsInt($first['anilist_id']);
        $this->assertIsArray($first['genres']);
        $this->assertSame('Action', $first['genres'][0]['name']);
    }

    /** GET /api/v1/anime/search with a short query returns an empty, well-shaped response. */
    public function test_search_empty_query_response_shape(): void
    {
        $user = $this->enabledUser();
        $token = $this->bearerFor($user);

        $response = $this->withHeaders($this->bearerHeader($token))
            ->getJson('/api/v1/anime/search?q=a');

        $response->assertOk()
            ->assertJsonStructure(['data', 'query', 'total'])
            ->assertJsonPath('total', 0)
            ->assertJsonPath('data', []);
    }

    /** GET /api/v1/anime/anilist/{id} → 200 with the full detail shape. */
    public function test_anime_by_anilist_id_response_shape(): void
    {
        $user = $this->enabledUser();
        $token = $this->bearerFor($user);
        $anime = Anime::factory()->create(['anilist_id' => 424242]);

        $response = $this->withHeaders($this->bearerHeader($token))
            ->getJson('/api/v1/anime/anilist/424242');

        $response->assertOk()
            ->assertJsonStructure(self::DETAIL_STRUCTURE)
            ->assertJsonPath('id', $anime->id)
            ->assertJsonPath('anilist_id', 424242);

        $this->assertIsString($response->json('slug'));
        $this->assertIsBool($response->json('is_adult'));
        $this->assertIsArray($response->json('genres'));
        $this->assertIsArray($response->json('studios'));
        $this->assertIsArray($response->json('external_ids'));
    }

    /** GET /api/v1/anime/anilist/{id} for an unknown ID → 404 with message key. */
    public function test_anime_by_anilist_id_missing_response_shape(): void
    {
        $user = $this->enabledUser();
        $token = $this->bearerFor($user);

        $this->withHeaders($this->bearerHeader($token))
            ->getJson('/api/v1/anime/anilist/999999999')
            ->assertStatus(404)
            ->assertJsonStructure(['message']);
    }

    /** GET /api/v1/anime/{slug} → 200 with the full detail shape. */
    public function test_anime_by_slug_response_shape(): void
    {
        $user = $this->enabledUser();
        $token = $this->bearerFor($user);
        $anime = Anime::factory()->create(['title_romaji' => 'Contract Slug Show']);

        $response = $this->withHeaders($this->bearerHeader($token))
            ->getJson("/api/v1/anime/{$anime->slug}");

        $response->assertOk()
            ->assertJsonStructure(self::DETAIL_STRUCTURE)
            ->assertJsonPath('id', $anime->id)
            ->assertJsonPath('slug', $anime->slug);
    }
}
