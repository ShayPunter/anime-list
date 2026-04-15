<?php

namespace Tests;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use RefreshDatabase;

    /**
     * The DatabaseSeeder creates a Test User for local dev; avoid re-running it
     * on every test so the data can be controlled explicitly by each test.
     */
    protected bool $seed = false;

    protected function setUp(): void
    {
        parent::setUp();

        // Tests don't run vite; stub out the manifest so Inertia views can render.
        $this->withoutVite();
    }

    /**
     * Create an authenticated admin user and act as them.
     */
    protected function actingAsAdmin(array $attributes = []): User
    {
        $admin = User::factory()->admin()->create($attributes);
        $this->actingAs($admin);

        return $admin;
    }
}
