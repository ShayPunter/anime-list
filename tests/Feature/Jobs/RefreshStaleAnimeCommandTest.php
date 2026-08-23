<?php

namespace Tests\Feature\Jobs;

use App\Jobs\RefreshStaleAnimeBatch;
use App\Models\Anime;
use App\Models\SyncRun;
use App\Services\AnimeRefreshPolicy;
use App\Services\SyncRunTracker;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class RefreshStaleAnimeCommandTest extends TestCase
{
    public function test_it_dispatches_a_sweep_for_the_stale_backlog(): void
    {
        Queue::fake();

        Anime::factory()->create(['synced_at' => now()->subDays(90)]);

        $this->artisan('anime:refresh-stale')
            ->expectsOutputToContain('Stale anime awaiting refresh: 1')
            ->assertSuccessful();

        Queue::assertPushed(RefreshStaleAnimeBatch::class);
        $this->assertSame(1, SyncRun::where('mode', SyncRun::MODE_STALE_REFRESH)->count());
    }

    public function test_dry_run_reports_without_dispatching(): void
    {
        Queue::fake();

        Anime::factory()->create(['synced_at' => now()->subDays(90)]);

        $this->artisan('anime:refresh-stale --dry-run')->assertSuccessful();

        Queue::assertNothingPushed();
        $this->assertSame(0, SyncRun::where('mode', SyncRun::MODE_STALE_REFRESH)->count());
    }

    public function test_it_refuses_to_start_alongside_a_running_sweep(): void
    {
        Queue::fake();

        Anime::factory()->create(['synced_at' => now()->subDays(90)]);
        app(SyncRunTracker::class)->start(SyncRun::MODE_STALE_REFRESH);

        $this->artisan('anime:refresh-stale')->assertFailed();

        Queue::assertNothingPushed();
    }

    public function test_force_starts_a_sweep_even_when_one_is_running(): void
    {
        Queue::fake();

        Anime::factory()->create(['synced_at' => now()->subDays(90)]);
        app(SyncRunTracker::class)->start(SyncRun::MODE_STALE_REFRESH);

        $this->artisan('anime:refresh-stale --force')->assertSuccessful();

        Queue::assertPushed(RefreshStaleAnimeBatch::class);
    }

    public function test_include_excluded_puts_settled_anime_back_into_the_sweep(): void
    {
        Queue::fake();

        $excluded = Anime::factory()->create([
            'synced_at' => now()->subDays(90),
            'refresh_excluded_at' => now(),
            'refresh_exclusion_reason' => AnimeRefreshPolicy::REASON_FINISHED,
        ]);

        $this->artisan('anime:refresh-stale --include-excluded')->assertSuccessful();

        $this->assertNull($excluded->fresh()->refresh_excluded_at);
        Queue::assertPushed(RefreshStaleAnimeBatch::class);
    }

    public function test_it_exits_cleanly_when_there_is_nothing_stale(): void
    {
        Queue::fake();

        Anime::factory()->create(['synced_at' => now()]);

        $this->artisan('anime:refresh-stale')
            ->expectsOutputToContain('Nothing to refresh.')
            ->assertSuccessful();

        Queue::assertNothingPushed();
    }
}
