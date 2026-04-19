<?php

namespace Tests\Feature\Api\V1\Contract;

use App\Models\Anime;
use App\Models\UserAnimeList;

class ListContractTest extends ApiContractTestCase
{
    /**
     * ListEntryResource shape — returned by every list endpoint that yields a
     * single entry (show, store, update) and, wrapped in `data[]`, by index.
     * `anime` is present because every list-returning endpoint eager-loads it.
     */
    private const ENTRY_STRUCTURE = [
        'id',
        'anime_id',
        'status',
        'score',
        'display_score',
        'progress',
        'rewatch_count',
        'is_rewatching',
        'started_at',
        'completed_at',
        'notes',
        'tags',
        'is_private',
        'updated_at',
        'anime' => [
            'id',
            'slug',
            'anilist_id',
            'title_romaji',
        ],
    ];

    /** GET /api/v1/list → 200 with { data: ListEntry[], total }. */
    public function test_index_response_shape(): void
    {
        $user = $this->enabledUser();
        $token = $this->bearerFor($user);
        $anime = Anime::factory()->create();
        UserAnimeList::factory()
            ->for($user)
            ->for($anime)
            ->create(['status' => UserAnimeList::STATUS_WATCHING]);

        $response = $this->withHeaders($this->bearerHeader($token))
            ->getJson('/api/v1/list');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => ['*' => self::ENTRY_STRUCTURE],
                'total',
            ]);

        $this->assertIsInt($response->json('total'));
        $this->assertSame(1, $response->json('total'));

        $entry = $response->json('data.0');
        $this->assertIsInt($entry['id']);
        $this->assertIsInt($entry['anime_id']);
        $this->assertIsString($entry['status']);
        $this->assertIsArray($entry['tags']);
    }

    /** GET /api/v1/list with a `status` filter → response keeps the contract shape. */
    public function test_index_filtered_response_shape(): void
    {
        $user = $this->enabledUser();
        $token = $this->bearerFor($user);
        UserAnimeList::factory()
            ->for($user)
            ->for(Anime::factory()->create())
            ->watching()
            ->create();
        UserAnimeList::factory()
            ->for($user)
            ->for(Anime::factory()->create())
            ->completed()
            ->create();

        $response = $this->withHeaders($this->bearerHeader($token))
            ->getJson('/api/v1/list?status=watching');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => ['*' => self::ENTRY_STRUCTURE],
                'total',
            ]);

        $this->assertSame(1, $response->json('total'));
        $this->assertSame('watching', $response->json('data.0.status'));
    }

    /** GET /api/v1/list/anime/{animeId} → 200 with a single ListEntry. */
    public function test_show_by_anime_response_shape(): void
    {
        $user = $this->enabledUser();
        $token = $this->bearerFor($user);
        $anime = Anime::factory()->create();
        $entry = UserAnimeList::factory()
            ->for($user)
            ->for($anime)
            ->create();

        $response = $this->withHeaders($this->bearerHeader($token))
            ->getJson("/api/v1/list/anime/{$anime->id}");

        $response->assertOk()
            ->assertJsonStructure(self::ENTRY_STRUCTURE)
            ->assertJsonPath('id', $entry->id)
            ->assertJsonPath('anime_id', $anime->id);
    }

    /** GET /api/v1/list/anime/{animeId} with no entry → 404 with message. */
    public function test_show_by_anime_missing_response_shape(): void
    {
        $user = $this->enabledUser();
        $token = $this->bearerFor($user);
        $anime = Anime::factory()->create();

        $this->withHeaders($this->bearerHeader($token))
            ->getJson("/api/v1/list/anime/{$anime->id}")
            ->assertStatus(404)
            ->assertJsonStructure(['message']);
    }

    /** POST /api/v1/list → 201 with a ListEntry. */
    public function test_store_response_shape(): void
    {
        $user = $this->enabledUser();
        $token = $this->bearerFor($user);
        $anime = Anime::factory()->create(['episodes' => 24]);

        $response = $this->withHeaders($this->bearerHeader($token))
            ->postJson('/api/v1/list', [
                'anime_id' => $anime->id,
                'status' => UserAnimeList::STATUS_WATCHING,
                'progress' => 3,
                'score' => 8,
            ]);

        $response->assertCreated()
            ->assertJsonStructure(self::ENTRY_STRUCTURE)
            ->assertJsonPath('anime_id', $anime->id)
            ->assertJsonPath('status', 'watching')
            ->assertJsonPath('progress', 3)
            ->assertJsonPath('score', 8);

        $this->assertIsNumeric($response->json('display_score'));
        $this->assertEquals(8, $response->json('display_score'));
    }

    /** POST /api/v1/list with invalid data → 422 with validation shape. */
    public function test_store_validation_error_shape(): void
    {
        $user = $this->enabledUser();
        $token = $this->bearerFor($user);

        $this->withHeaders($this->bearerHeader($token))
            ->postJson('/api/v1/list', [])
            ->assertStatus(422)
            ->assertJsonStructure([
                'message',
                'errors' => ['anime_id', 'status'],
            ]);
    }

    /** PATCH /api/v1/list/{entryId} → 200 with a ListEntry. */
    public function test_update_response_shape(): void
    {
        $user = $this->enabledUser();
        $token = $this->bearerFor($user);
        $entry = UserAnimeList::factory()
            ->for($user)
            ->for(Anime::factory()->create(['episodes' => 12]))
            ->watching()
            ->create();

        $response = $this->withHeaders($this->bearerHeader($token))
            ->patchJson("/api/v1/list/{$entry->id}", [
                'progress' => 5,
                'score' => 9,
            ]);

        $response->assertOk()
            ->assertJsonStructure(self::ENTRY_STRUCTURE)
            ->assertJsonPath('id', $entry->id)
            ->assertJsonPath('progress', 5)
            ->assertJsonPath('score', 9);
    }

    /** DELETE /api/v1/list/{entryId} → 204 No Content. */
    public function test_destroy_returns_no_content(): void
    {
        $user = $this->enabledUser();
        $token = $this->bearerFor($user);
        $entry = UserAnimeList::factory()->for($user)->create();

        $response = $this->withHeaders($this->bearerHeader($token))
            ->deleteJson("/api/v1/list/{$entry->id}");

        $response->assertStatus(204);
        $this->assertSame('', $response->getContent());
    }
}
