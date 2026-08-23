<?php

namespace Tests\Unit\Services;

use App\Models\Anime;
use App\Services\AnimeRefreshPolicy;
use Tests\TestCase;

class AnimeRefreshPolicyTest extends TestCase
{
    private AnimeRefreshPolicy $policy;

    protected function setUp(): void
    {
        parent::setUp();
        $this->policy = app(AnimeRefreshPolicy::class);
        config(['anilist.refresh.exclude_finished_after_days' => 180]);
    }

    public function test_a_long_finished_anime_is_excluded(): void
    {
        $anime = Anime::factory()->make([
            'status' => 'FINISHED',
            'aired_to' => now()->subYears(3),
        ]);

        $this->assertSame(AnimeRefreshPolicy::REASON_FINISHED, $this->policy->exclusionReasonFor($anime));
    }

    public function test_a_recently_finished_anime_is_kept_in_the_sweep(): void
    {
        $anime = Anime::factory()->make([
            'status' => 'FINISHED',
            'aired_to' => now()->subDays(30),
        ]);

        $this->assertNull($this->policy->exclusionReasonFor($anime));
    }

    public function test_a_releasing_anime_is_never_excluded(): void
    {
        $anime = Anime::factory()->make([
            'status' => 'RELEASING',
            'aired_to' => now()->subYears(3),
        ]);

        $this->assertNull($this->policy->exclusionReasonFor($anime));
    }

    public function test_a_cancelled_anime_is_treated_like_a_finished_one(): void
    {
        $anime = Anime::factory()->make([
            'status' => 'CANCELLED',
            'aired_to' => now()->subYears(3),
        ]);

        $this->assertSame(AnimeRefreshPolicy::REASON_FINISHED, $this->policy->exclusionReasonFor($anime));
    }

    public function test_season_year_is_used_when_no_end_date_is_recorded(): void
    {
        $old = Anime::factory()->make([
            'status' => 'FINISHED',
            'aired_to' => null,
            'season_year' => 2001,
        ]);
        $current = Anime::factory()->make([
            'status' => 'FINISHED',
            'aired_to' => null,
            'season_year' => now()->year,
        ]);

        $this->assertSame(AnimeRefreshPolicy::REASON_FINISHED, $this->policy->exclusionReasonFor($old));
        $this->assertNull($this->policy->exclusionReasonFor($current));
    }

    public function test_an_undated_anime_is_kept_rather_than_guessed_at(): void
    {
        $anime = Anime::factory()->make([
            'status' => 'FINISHED',
            'aired_to' => null,
            'season_year' => null,
        ]);

        $this->assertNull($this->policy->exclusionReasonFor($anime));
    }

    public function test_apply_to_does_not_overwrite_an_existing_exclusion(): void
    {
        $anime = Anime::factory()->create([
            'status' => 'FINISHED',
            'aired_to' => now()->subYears(3),
            'refresh_excluded_at' => now()->subMonth(),
            'refresh_exclusion_reason' => AnimeRefreshPolicy::REASON_MISSING_UPSTREAM,
        ]);

        $this->assertSame(0, $this->policy->applyTo(collect([$anime])));
        $this->assertSame(
            AnimeRefreshPolicy::REASON_MISSING_UPSTREAM,
            $anime->fresh()->refresh_exclusion_reason,
        );
    }

    public function test_include_puts_anime_back_into_the_sweep(): void
    {
        $anime = Anime::factory()->create([
            'refresh_excluded_at' => now(),
            'refresh_exclusion_reason' => AnimeRefreshPolicy::REASON_FINISHED,
        ]);

        $this->assertSame(1, $this->policy->include([$anime->id]));

        $anime->refresh();
        $this->assertNull($anime->refresh_excluded_at);
        $this->assertNull($anime->refresh_exclusion_reason);
    }
}
