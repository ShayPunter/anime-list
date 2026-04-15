<?php

namespace Tests\Feature\Playlists;

use App\Models\Anime;
use App\Models\Playlist;
use App\Models\PlaylistItem;
use App\Models\User;
use App\Services\FeatureFlagService;
use Tests\TestCase;

class PlaylistCrudTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        // Turn on the playlists feature globally for these tests.
        app(FeatureFlagService::class)->setGlobalStatus('playlists', 'everyone');
    }

    public function test_user_can_create_a_playlist(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/playlists', [
            'title' => 'My Shounen Picks',
            'description' => 'Only the best',
            'is_public' => true,
        ]);

        $response->assertCreated()
            ->assertJsonPath('playlist.title', 'My Shounen Picks')
            ->assertJsonPath('playlist.is_public', true);

        $this->assertDatabaseHas('playlists', [
            'user_id' => $user->id,
            'title' => 'My Shounen Picks',
            'is_public' => true,
        ]);
    }

    public function test_creating_a_playlist_requires_a_title(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->postJson('/api/playlists', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('title');
    }

    public function test_user_can_update_their_own_playlist(): void
    {
        $user = User::factory()->create();
        $playlist = Playlist::factory()->for($user)->create();

        $this->actingAs($user)->patchJson("/api/playlists/{$playlist->id}", [
            'title' => 'Updated Title',
        ])->assertOk();

        $this->assertDatabaseHas('playlists', [
            'id' => $playlist->id,
            'title' => 'Updated Title',
        ]);
    }

    public function test_user_cannot_update_another_users_playlist(): void
    {
        $alice = User::factory()->create();
        $bob = User::factory()->create();
        $playlist = Playlist::factory()->for($alice)->create();

        // update() uses implicit route-model binding with authorize rule;
        // Non-owners typically can't even reach it via Pennant scoping, so expect an auth failure.
        $response = $this->actingAs($bob)->patchJson("/api/playlists/{$playlist->id}", [
            'title' => 'Hacked',
        ]);

        // Behavior: UpdatePlaylistRequest->authorize() returns false for non-owner, yielding 403.
        $response->assertForbidden();
    }

    public function test_user_can_delete_their_playlist(): void
    {
        $user = User::factory()->create();
        $playlist = Playlist::factory()->for($user)->create();

        $this->actingAs($user)->deleteJson("/api/playlists/{$playlist->id}")
            ->assertNoContent();

        $this->assertSoftDeleted('playlists', ['id' => $playlist->id]);
    }

    public function test_user_can_add_an_item_to_their_playlist(): void
    {
        $user = User::factory()->create();
        $playlist = Playlist::factory()->for($user)->create();
        $anime = Anime::factory()->create();

        $this->actingAs($user)->postJson("/api/playlists/{$playlist->id}/items", [
            'anime_id' => $anime->id,
        ])->assertCreated();

        $this->assertDatabaseHas('playlist_items', [
            'playlist_id' => $playlist->id,
            'anime_id' => $anime->id,
            'position' => 1,
        ]);
    }

    public function test_adding_an_item_assigns_the_next_position(): void
    {
        $user = User::factory()->create();
        $playlist = Playlist::factory()->for($user)->create();
        PlaylistItem::factory()->for($playlist)->create(['position' => 1]);
        PlaylistItem::factory()->for($playlist)->create(['position' => 2]);
        $newAnime = Anime::factory()->create();

        $response = $this->actingAs($user)->postJson("/api/playlists/{$playlist->id}/items", [
            'anime_id' => $newAnime->id,
        ]);

        $response->assertCreated()->assertJsonPath('position', 3);
    }

    public function test_user_can_reorder_items_in_their_playlist(): void
    {
        $user = User::factory()->create();
        $playlist = Playlist::factory()->for($user)->create();
        $items = PlaylistItem::factory()->for($playlist)->count(3)->sequence(
            ['position' => 1],
            ['position' => 2],
            ['position' => 3],
        )->create();

        $reversed = $items->pluck('id')->reverse()->values()->all();

        $this->actingAs($user)->patchJson("/api/playlists/{$playlist->id}/reorder", [
            'item_ids' => $reversed,
        ])->assertNoContent();

        $this->assertDatabaseHas('playlist_items', ['id' => $reversed[0], 'position' => 1]);
        $this->assertDatabaseHas('playlist_items', ['id' => $reversed[2], 'position' => 3]);
    }

    public function test_public_playlist_is_viewable_by_anyone(): void
    {
        $owner = User::factory()->create();
        $playlist = Playlist::factory()->for($owner)->public()->create();

        $this->get("/playlist/{$playlist->slug}")->assertOk();
    }

    public function test_private_playlist_is_forbidden_to_non_owners(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $playlist = Playlist::factory()->for($owner)->create(['is_public' => false]);

        $this->actingAs($other)->get("/playlist/{$playlist->slug}")->assertForbidden();
    }
}
