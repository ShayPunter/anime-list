<?php

namespace Tests\Feature\Playlists;

use App\Models\User;
use App\Services\FeatureFlagService;
use Tests\TestCase;

class PlaylistGatingTest extends TestCase
{
    public function test_playlist_index_is_404_when_feature_disabled(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get('/playlists')->assertNotFound();
    }

    public function test_playlist_create_is_404_when_feature_disabled(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get('/playlists/create')->assertNotFound();
    }

    public function test_playlist_routes_accessible_when_flag_activated_for_user(): void
    {
        $user = User::factory()->create();
        app(FeatureFlagService::class)->activateForUser('playlists', $user);

        $this->actingAs($user)->get('/playlists')->assertOk();
    }

    public function test_store_playlist_api_404s_when_feature_disabled(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->postJson('/api/playlists', [
            'title' => 'Blocked',
        ])->assertNotFound();
    }
}
