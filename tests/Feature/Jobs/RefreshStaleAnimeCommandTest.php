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

    public function test_it_skips_cleanly_alongside_a_running_sweep(): void
    {
        Queue::fake();

        Anime::factory()->create(['synced_at' => now()->subDays(90)]);
        app(SyncRunTracker::class)->start(SyncRun::MODE_STALE_REFRESH);

        // Exiting non-zero here made the scheduler raise "Scheduled command
        // ... failed with exit code [1]" whenever an AniList outage kept the
        // previous sweep paused past the next nightly run. A skip is not a
        // failure.
        $this->artisan('anime:refresh-stale')
            ->expectsOutputToContain('already in progress')
            ->assertSuccessful();

        Queue::assertNothingPushed();
    }

    public function test_a_sweep_whose_worker_died_does_not_block_the_nightly_run(): void
    {
        Queue::fake();

        Anime::factory()->create(['synced_at' => now()->subDays(90)]);
        $abandoned = app(SyncRunTracker::class)->start(SyncRun::MODE_STALE_REFRESH);
        $abandoned->forceFill([
            'heartbeat_at' => now()->subSeconds(SyncRun::HEARTBEAT_TIMEOUT_SECONDS + 60),
        ])->save();

        $this->artisan('anime:refresh-stale')->assertSuccessful();

        Queue::assertPushed(RefreshStaleAnimeBatch::class);
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
