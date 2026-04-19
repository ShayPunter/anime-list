<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    public function test_guests_are_redirected_from_admin_routes(): void
    {
        $this->get('/admin')->assertRedirect('/login');
    }

    public function test_non_admin_users_get_403_on_admin_routes(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        $this->actingAs($user)->get('/admin')->assertForbidden();
        $this->actingAs($user)->get('/admin/users')->assertForbidden();
        $this->actingAs($user)->get('/admin/features')->assertForbidden();
        $this->actingAs($user)->get('/admin/roles')->assertForbidden();
    }

    public function test_admin_users_can_access_admin_routes(): void
    {
        $this->actingAsAdmin();

        $this->get('/admin/users')->assertOk();
        $this->get('/admin/features')->assertOk();
        $this->get('/admin/roles')->assertOk();
    }
}
