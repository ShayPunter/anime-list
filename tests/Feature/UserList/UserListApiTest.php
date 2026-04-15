<?php

namespace Tests\Feature\UserList;

use App\Models\Anime;
use App\Models\User;
use App\Models\UserAnimeList;
use Tests\TestCase;

class UserListApiTest extends TestCase
{
    public function test_authenticated_users_can_add_anime_to_their_list(): void
    {
        $user = User::factory()->create();
        $anime = Anime::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/list', [
            'anime_id' => $anime->id,
            'status' => UserAnimeList::STATUS_PLAN_TO_WATCH,
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('user_anime_lists', [
            'user_id' => $user->id,
            'anime_id' => $anime->id,
            'status' => UserAnimeList::STATUS_PLAN_TO_WATCH,
        ]);
    }

    public function test_guest_users_cannot_add_list_entries(): void
    {
        $anime = Anime::factory()->create();

        $this->postJson('/api/list', [
            'anime_id' => $anime->id,
            'status' => UserAnimeList::STATUS_WATCHING,
        ])->assertUnauthorized();
    }

    public function test_duplicate_entries_for_the_same_anime_are_rejected(): void
    {
        $user = User::factory()->create();
        $anime = Anime::factory()->create();
        UserAnimeList::factory()->for($user)->for($anime)->create();

        $this->actingAs($user)->postJson('/api/list', [
            'anime_id' => $anime->id,
            'status' => UserAnimeList::STATUS_WATCHING,
        ])->assertUnprocessable()->assertJsonValidationErrors('anime_id');
    }

    public function test_invalid_status_is_rejected(): void
    {
        $user = User::factory()->create();
        $anime = Anime::factory()->create();

        $this->actingAs($user)->postJson('/api/list', [
            'anime_id' => $anime->id,
            'status' => 'not-a-real-status',
        ])->assertUnprocessable()->assertJsonValidationErrors('status');
    }

    public function test_score_out_of_range_is_rejected(): void
    {
        $user = User::factory()->create();
        $anime = Anime::factory()->create();

        $this->actingAs($user)->postJson('/api/list', [
            'anime_id' => $anime->id,
            'status' => UserAnimeList::STATUS_COMPLETED,
            'score' => 150,
        ])->assertUnprocessable()->assertJsonValidationErrors('score');
    }

    public function test_owner_can_update_their_list_entry(): void
    {
        $user = User::factory()->create();
        $anime = Anime::factory()->create(['episodes' => 24]);
        $entry = UserAnimeList::factory()->for($user)->for($anime)->create([
            'status' => UserAnimeList::STATUS_WATCHING,
            'progress' => 5,
        ]);

        $response = $this->actingAs($user)->patchJson("/api/list/{$entry->id}", [
            'progress' => 10,
            'score' => 80,
        ]);

        $response->assertOk();
        $this->assertDatabaseHas('user_anime_lists', [
            'id' => $entry->id,
            'progress' => 10,
            'score' => 80,
        ]);
    }

    public function test_non_owner_cannot_update_an_entry(): void
    {
        $alice = User::factory()->create();
        $bob = User::factory()->create();
        $entry = UserAnimeList::factory()->for($alice)->create();

        $this->actingAs($bob)->patchJson("/api/list/{$entry->id}", [
            'progress' => 5,
        ])->assertForbidden();
    }

    public function test_owner_can_soft_delete_their_entry(): void
    {
        $user = User::factory()->create();
        $entry = UserAnimeList::factory()->for($user)->create();

        $this->actingAs($user)->deleteJson("/api/list/{$entry->id}")
            ->assertNoContent();

        $this->assertSoftDeleted('user_anime_lists', ['id' => $entry->id]);
    }

    public function test_non_owner_cannot_delete_another_users_entry(): void
    {
        $alice = User::factory()->create();
        $bob = User::factory()->create();
        $entry = UserAnimeList::factory()->for($alice)->create();

        $this->actingAs($bob)->deleteJson("/api/list/{$entry->id}")
            ->assertForbidden();
    }

    public function test_completing_an_entry_fills_progress_to_total_episodes(): void
    {
        $user = User::factory()->create();
        $anime = Anime::factory()->create(['episodes' => 12]);
        $entry = UserAnimeList::factory()->for($user)->for($anime)->create([
            'status' => UserAnimeList::STATUS_WATCHING,
            'progress' => 3,
        ]);

        $this->actingAs($user)->patchJson("/api/list/{$entry->id}", [
            'status' => UserAnimeList::STATUS_COMPLETED,
        ])->assertOk();

        $this->assertDatabaseHas('user_anime_lists', [
            'id' => $entry->id,
            'status' => UserAnimeList::STATUS_COMPLETED,
            'progress' => 12,
        ]);
    }

    public function test_export_returns_mal_compatible_xml_download(): void
    {
        $user = User::factory()->create();
        $anime = Anime::factory()->create(['mal_id' => 42]);
        UserAnimeList::factory()->for($user)->for($anime)->create();

        $response = $this->actingAs($user)->get('/list/export');

        $response->assertOk();
        $response->assertHeader('content-type', 'application/xml');
        $this->assertStringContainsString('<myanimelist>', $response->streamedContent());
    }
}
