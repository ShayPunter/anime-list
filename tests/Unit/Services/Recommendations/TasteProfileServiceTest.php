<?php

namespace Tests\Unit\Services\Recommendations;

use App\Models\Anime;
use App\Models\Genre;
use App\Models\Studio;
use App\Models\User;
use App\Models\UserAnimeList;
use App\Services\Recommendations\TasteProfileService;
use Tests\TestCase;

class TasteProfileServiceTest extends TestCase
{
    private TasteProfileService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new TasteProfileService;
    }

    public function test_build_produces_empty_profile_for_user_with_no_list(): void
    {
        $user = User::factory()->create();

        $profile = $this->service->build($user);

        $this->assertSame([], $profile->genreAffinity);
        $this->assertSame([], $profile->studioAffinity);
        $this->assertSame([], $profile->seenAnimeIds);
        $this->assertSame([], $profile->anchorAnimeIds);
        $this->assertSame(0, $profile->ratedCount);
        $this->assertFalse($profile->hasAnyList());
        $this->assertTrue($profile->isCold());
    }

    public function test_high_scored_completed_entries_drive_genre_affinity(): void
    {
        $user = User::factory()->create();
        $action = Genre::factory()->create(['name' => 'Action']);
        $romance = Genre::factory()->create(['name' => 'Romance']);

        $loved = Anime::factory()->create();
        $loved->genres()->attach([$action->id, $romance->id]);

        UserAnimeList::factory()->completed()->create([
            'user_id' => $user->id,
            'anime_id' => $loved->id,
            'score' => 10,
        ]);

        $profile = $this->service->build($user);

        $this->assertArrayHasKey('Action', $profile->genreAffinity);
        $this->assertArrayHasKey('Romance', $profile->genreAffinity);
        $this->assertEqualsWithDelta(1 / sqrt(2), $profile->genreAffinity['Action'], 0.0001);
    }

    public function test_dropped_entries_produce_negative_weight(): void
    {
        $user = User::factory()->create();
        $horror = Genre::factory()->create(['name' => 'Horror']);

        $loved = Anime::factory()->create();
        $loved->genres()->attach($horror);

        UserAnimeList::factory()->create([
            'user_id' => $user->id,
            'anime_id' => $loved->id,
            'status' => UserAnimeList::STATUS_DROPPED,
            'score' => 3,
        ]);

        $profile = $this->service->build($user);

        $this->assertArrayHasKey('Horror', $profile->genreAffinity);
        $this->assertLessThan(0, $profile->genreAffinity['Horror']);
    }

    public function test_anchors_are_sorted_with_highest_score_first(): void
    {
        $user = User::factory()->create();
        $genre = Genre::factory()->create(['name' => 'Drama']);

        $eight = Anime::factory()->create();
        $nine = Anime::factory()->create();
        $ten = Anime::factory()->create();
        foreach ([$eight, $nine, $ten] as $anime) {
            $anime->genres()->attach($genre);
        }

        UserAnimeList::factory()->completed()->create([
            'user_id' => $user->id, 'anime_id' => $eight->id, 'score' => 8,
        ]);
        UserAnimeList::factory()->completed()->create([
            'user_id' => $user->id, 'anime_id' => $ten->id, 'score' => 10,
        ]);
        UserAnimeList::factory()->completed()->create([
            'user_id' => $user->id, 'anime_id' => $nine->id, 'score' => 9,
        ]);

        $profile = $this->service->build($user);

        $this->assertSame($ten->id, $profile->anchorAnimeIds[0]);
        $this->assertSame($nine->id, $profile->anchorAnimeIds[1]);
        $this->assertSame($eight->id, $profile->anchorAnimeIds[2]);
    }

    public function test_anchors_are_capped_at_five_entries(): void
    {
        $user = User::factory()->create();
        $genre = Genre::factory()->create(['name' => 'Drama']);

        // Seven completed entries, all above the anchor threshold of 8.
        for ($i = 0; $i < 7; $i++) {
            $anime = Anime::factory()->create();
            $anime->genres()->attach($genre);

            UserAnimeList::factory()->completed()->create([
                'user_id' => $user->id,
                'anime_id' => $anime->id,
                'score' => 8 + ($i % 3),
            ]);
        }

        $profile = $this->service->build($user);

        $this->assertCount(5, $profile->anchorAnimeIds);
    }

    public function test_plan_to_watch_genres_are_tracked_separately(): void
    {
        $user = User::factory()->create();
        $mystery = Genre::factory()->create(['name' => 'Mystery']);

        $future = Anime::factory()->create();
        $future->genres()->attach($mystery);

        UserAnimeList::factory()->create([
            'user_id' => $user->id,
            'anime_id' => $future->id,
            'status' => UserAnimeList::STATUS_PLAN_TO_WATCH,
            'score' => 0,
        ]);

        $profile = $this->service->build($user);

        $this->assertContains('Mystery', $profile->planToWatchGenres);
        $this->assertArrayNotHasKey('Mystery', $profile->genreAffinity);
        $this->assertContains($future->id, $profile->seenAnimeIds);
    }

    public function test_studio_affinity_follows_rated_entries(): void
    {
        $user = User::factory()->create();
        $studio = Studio::factory()->create(['name' => 'Trigger']);
        $genre = Genre::factory()->create(['name' => 'Action']);

        $anime = Anime::factory()->create();
        $anime->genres()->attach($genre);
        $anime->studios()->attach($studio, ['is_main' => true]);

        UserAnimeList::factory()->completed()->create([
            'user_id' => $user->id,
            'anime_id' => $anime->id,
            'score' => 9,
        ]);

        $profile = $this->service->build($user);

        $this->assertArrayHasKey('Trigger', $profile->studioAffinity);
        $this->assertGreaterThan(0, $profile->studioAffinity['Trigger']);
    }

    public function test_cold_start_threshold_uses_rated_entries_not_plan_to_watch(): void
    {
        $user = User::factory()->create();
        $genre = Genre::factory()->create(['name' => 'Action']);

        for ($i = 0; $i < 10; $i++) {
            $anime = Anime::factory()->create();
            $anime->genres()->attach($genre);

            UserAnimeList::factory()->create([
                'user_id' => $user->id,
                'anime_id' => $anime->id,
                'status' => UserAnimeList::STATUS_PLAN_TO_WATCH,
                'score' => 0,
            ]);
        }

        $profile = $this->service->build($user);

        $this->assertTrue($profile->isCold());
        $this->assertTrue($profile->hasAnyList());
    }
}
