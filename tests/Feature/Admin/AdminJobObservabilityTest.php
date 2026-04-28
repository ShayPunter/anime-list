<?php

namespace Tests\Feature\Admin;

use App\Jobs\RefreshAnimeFromAniList;
use App\Jobs\SyncAnimePage;
use App\Models\Anime;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class AdminJobObservabilityTest extends TestCase
{
    public function test_admin_can_view_jobs_observability_page(): void
    {
        $this->actingAsAdmin();

        Anime::factory()->create([
            'created_at' => now()->subHours(6),
            'synced_at' => now()->subHours(2),
        ]);

        DB::table('failed_jobs')->insert([
            'uuid' => 'test-uuid-1',
            'connection' => 'database',
            'queue' => 'sync',
            'payload' => json_encode(['displayName' => 'App\\Jobs\\SyncAnimePage']),
            'exception' => "RuntimeException: kaboom\nat /app/x.php:1",
            'failed_at' => now(),
        ]);

        $response = $this->get('/admin/jobs');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/JobsPage')
            ->has('metrics.queued_total')
            ->has('metrics.failed_total')
            ->where('metrics.failed_total', 1)
            ->where('metrics.anime_added.last_24h', 1)
            ->where('metrics.anime_updated.last_24h', 1)
            ->has('recentFailed', 1)
            ->where('recentFailed.0.uuid', 'test-uuid-1'));
    }

    public function test_admin_can_enqueue_anime_refresh_by_anilist_id(): void
    {
        Queue::fake();
        $this->actingAsAdmin();

        $this->post('/admin/jobs/anime', ['anilist_id' => 12345])
            ->assertRedirect();

        Queue::assertPushed(RefreshAnimeFromAniList::class, fn ($job) => $job->anilistId === 12345);
    }

    public function test_admin_can_enqueue_anime_refresh_by_internal_id(): void
    {
        Queue::fake();
        $this->actingAsAdmin();

        $anime = Anime::factory()->create(['anilist_id' => 999]);

        $this->post('/admin/jobs/anime', ['anime_id' => $anime->id])
            ->assertRedirect();

        Queue::assertPushed(RefreshAnimeFromAniList::class, fn ($job) => $job->anilistId === 999);
    }

    public function test_enqueue_requires_at_least_one_id(): void
    {
        $this->actingAsAdmin();

        $this->from('/admin/jobs')
            ->post('/admin/jobs/anime', [])
            ->assertRedirect('/admin/jobs')
            ->assertSessionHasErrors('anilist_id');
    }

    public function test_admin_can_dispatch_incremental_sync(): void
    {
        Queue::fake();
        $this->actingAsAdmin();

        $this->post('/admin/jobs/sync/incremental')->assertRedirect();

        Queue::assertPushed(SyncAnimePage::class, fn ($job) => $job->mode === 'incremental');
    }

    public function test_admin_can_forget_failed_job(): void
    {
        $this->actingAsAdmin();

        DB::table('failed_jobs')->insert([
            'uuid' => 'forget-me',
            'connection' => 'database',
            'queue' => 'sync',
            'payload' => '{}',
            'exception' => 'boom',
            'failed_at' => now(),
        ]);

        $this->delete('/admin/jobs/failed/forget-me')->assertRedirect();

        $this->assertDatabaseMissing('failed_jobs', ['uuid' => 'forget-me']);
    }

    public function test_non_admin_cannot_access_jobs_routes(): void
    {
        $user = \App\Models\User::factory()->create(['is_admin' => false]);

        $this->actingAs($user)->get('/admin/jobs')->assertForbidden();
        $this->actingAs($user)->post('/admin/jobs/anime', ['anilist_id' => 1])->assertForbidden();
    }
}
