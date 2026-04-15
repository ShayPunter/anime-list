<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Services\FeatureFlagService;
use Tests\TestCase;

class AdminFeatureFlagTest extends TestCase
{
    public function test_admin_can_set_a_feature_flag_to_everyone(): void
    {
        $this->actingAsAdmin();

        $this->patchJson('/admin/features/playlists', ['status' => 'everyone'])
            ->assertOk()
            ->assertJsonPath('success', true);

        // Anonymous viewer should now see the feature as active
        $this->assertTrue(app(FeatureFlagService::class)->active('playlists', null));
    }

    public function test_admin_can_set_a_feature_flag_to_nobody(): void
    {
        $this->actingAsAdmin();

        $this->patchJson('/admin/features/playlists', ['status' => 'nobody'])->assertOk();

        $this->assertFalse(app(FeatureFlagService::class)->active('playlists', null));
    }

    public function test_update_rejects_invalid_status_value(): void
    {
        $this->actingAsAdmin();

        $this->patchJson('/admin/features/playlists', ['status' => 'maybe'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('status');
    }

    public function test_admin_can_activate_a_feature_for_a_specific_user(): void
    {
        $this->actingAsAdmin();
        $target = User::factory()->create(['username' => 'alpha_beta']);

        $this->postJson('/admin/features/playlists/users', ['username' => 'alpha_beta'])
            ->assertOk()
            ->assertJsonPath('username', 'alpha_beta')
            ->assertJsonPath('active', true);

        $this->assertTrue(app(FeatureFlagService::class)->active('playlists', $target->fresh()));
    }

    public function test_admin_cannot_activate_a_feature_for_an_unknown_username(): void
    {
        $this->actingAsAdmin();

        $this->postJson('/admin/features/playlists/users', ['username' => 'does_not_exist'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('username');
    }

    public function test_admin_can_deactivate_a_feature_for_a_specific_user(): void
    {
        $this->actingAsAdmin();
        $target = User::factory()->create();
        app(FeatureFlagService::class)->activateForUser('playlists', $target);
        $this->assertTrue(app(FeatureFlagService::class)->active('playlists', $target));

        $this->deleteJson("/admin/features/playlists/users/{$target->id}")
            ->assertOk();

        $this->assertFalse(app(FeatureFlagService::class)->active('playlists', $target->fresh()));
    }

    public function test_non_admin_cannot_manage_feature_flags(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        $this->actingAs($user)
            ->patchJson('/admin/features/playlists', ['status' => 'everyone'])
            ->assertForbidden();
    }
}
