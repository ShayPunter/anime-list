<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Tests\TestCase;

class AdminUserManagementTest extends TestCase
{
    public function test_admin_can_toggle_admin_flag_on_another_user(): void
    {
        $this->actingAsAdmin();
        $target = User::factory()->create(['is_admin' => false]);

        $this->patch("/admin/users/{$target->id}/toggle-admin")->assertRedirect();

        $this->assertTrue($target->fresh()->is_admin);

        $this->patch("/admin/users/{$target->id}/toggle-admin")->assertRedirect();
        $this->assertFalse($target->fresh()->is_admin);
    }

    public function test_admin_cannot_delete_their_own_account(): void
    {
        $admin = $this->actingAsAdmin();

        $this->delete("/admin/users/{$admin->id}")->assertRedirect();

        $this->assertDatabaseHas('users', ['id' => $admin->id, 'deleted_at' => null]);
    }

    public function test_admin_can_delete_another_user(): void
    {
        $this->actingAsAdmin();
        $target = User::factory()->create();

        $this->delete("/admin/users/{$target->id}")->assertRedirect();

        $this->assertSoftDeleted('users', ['id' => $target->id]);
    }

    public function test_admin_user_listing_filters_by_search(): void
    {
        $this->actingAsAdmin();
        User::factory()->create(['username' => 'alice_target']);
        User::factory()->create(['username' => 'bob_other']);

        $response = $this->get('/admin/users?search=alice');

        $response->assertOk();
        $response->assertSee('alice_target');
        $response->assertDontSee('bob_other');
    }
}
