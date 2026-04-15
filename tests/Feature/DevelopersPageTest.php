<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\FeatureFlagService;
use Laravel\Pennant\Feature;
use Tests\TestCase;

class DevelopersPageTest extends TestCase
{
    public function test_guests_get_404_when_flag_is_off(): void
    {
        $this->get('/developers')->assertNotFound();
    }

    public function test_guests_see_the_page_when_flag_is_enabled_globally(): void
    {
        app(FeatureFlagService::class)->setGlobalStatus('public-api', 'everyone');

        $this->get('/developers')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('DevelopersPage')
                ->has('apiBaseUrl')
            );
    }

    public function test_authenticated_users_see_the_page_when_flag_is_active_for_them(): void
    {
        $user = User::factory()->create();
        Feature::for($user)->activate('public-api');

        $this->actingAs($user)
            ->get('/developers')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('DevelopersPage'));
    }

    public function test_authenticated_users_get_404_without_the_flag(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/developers')
            ->assertNotFound();
    }
}
