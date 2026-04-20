<?php

namespace Tests\Feature\Jobs;

use App\Jobs\ResolveAnimeRecommendations;
use App\Models\Anime;
use App\Models\Recommendation;
use Illuminate\Support\Facades\Redis;
use Mockery;
use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
use Tests\TestCase;

class ResolveAnimeRecommendationsJobTest extends TestCase
{
    use MockeryPHPUnitIntegration;

    public function test_resolves_pending_recommendations_into_database(): void
    {
        $source = Anime::factory()->create(['anilist_id' => 111]);
        $target = Anime::factory()->create(['anilist_id' => 222]);

        $this->stubRedisQueue([
            'sync:pending_recommendations' => [
                json_encode([
                    'from_anilist_id' => 111,
                    'to_anilist_id' => 222,
                    'anilist_recommendation_id' => 900,
                    'rating' => 75,
                ]),
            ],
            'sync:unresolved_recommendations' => [],
        ]);

        (new ResolveAnimeRecommendations)->handle();

        $this->assertDatabaseHas('recommendations', [
            'anime_id' => $source->id,
            'recommended_anime_id' => $target->id,
            'source' => 'anilist',
            'anilist_recommendation_id' => 900,
            'rating' => 75,
        ]);
    }

    public function test_requeues_unresolved_when_anime_not_yet_synced(): void
    {
        Anime::factory()->create(['anilist_id' => 111]);

        $requeued = [];

        Redis::shouldReceive('lpop')
            ->with('sync:pending_recommendations')
            ->andReturnValues([
                json_encode([
                    'from_anilist_id' => 111,
                    'to_anilist_id' => 999, // does not exist
                    'anilist_recommendation_id' => 1,
                    'rating' => 10,
                ]),
                null,
            ]);
        Redis::shouldReceive('lpop')
            ->with('sync:unresolved_recommendations')
            ->andReturnNull();
        Redis::shouldReceive('rpush')
            ->with('sync:unresolved_recommendations', Mockery::any())
            ->once()
            ->andReturnUsing(function ($queue, ...$items) use (&$requeued) {
                $requeued = $items;

                return count($items);
            });

        (new ResolveAnimeRecommendations)->handle();

        $this->assertCount(1, $requeued);
        $decoded = json_decode($requeued[0], true);
        $this->assertSame(999, $decoded['to_anilist_id']);

        $this->assertDatabaseCount('recommendations', 0);
    }

    public function test_skips_self_referencing_recommendations(): void
    {
        $anime = Anime::factory()->create(['anilist_id' => 111]);

        $this->stubRedisQueue([
            'sync:pending_recommendations' => [
                json_encode([
                    'from_anilist_id' => 111,
                    'to_anilist_id' => 111,
                    'anilist_recommendation_id' => 5,
                    'rating' => 100,
                ]),
            ],
            'sync:unresolved_recommendations' => [],
        ]);

        (new ResolveAnimeRecommendations)->handle();

        $this->assertDatabaseCount('recommendations', 0);
    }

    public function test_deduplicates_within_batch_keeping_highest_rating(): void
    {
        $source = Anime::factory()->create(['anilist_id' => 111]);
        $target = Anime::factory()->create(['anilist_id' => 222]);

        $this->stubRedisQueue([
            'sync:pending_recommendations' => [
                json_encode([
                    'from_anilist_id' => 111,
                    'to_anilist_id' => 222,
                    'anilist_recommendation_id' => 1,
                    'rating' => 10,
                ]),
                json_encode([
                    'from_anilist_id' => 111,
                    'to_anilist_id' => 222,
                    'anilist_recommendation_id' => 2,
                    'rating' => 80,
                ]),
            ],
            'sync:unresolved_recommendations' => [],
        ]);

        (new ResolveAnimeRecommendations)->handle();

        $this->assertDatabaseCount('recommendations', 1);
        $row = Recommendation::first();
        $this->assertSame(80, $row->rating);
        $this->assertSame($source->id, $row->anime_id);
        $this->assertSame($target->id, $row->recommended_anime_id);
    }

    /**
     * @param  array<string, array<int, string>>  $queues
     */
    private function stubRedisQueue(array $queues): void
    {
        foreach ($queues as $name => $items) {
            // Each lpop returns one item then null when drained.
            $returns = array_merge($items, [null]);
            Redis::shouldReceive('lpop')
                ->with($name)
                ->andReturnValues($returns);
        }

        // Re-queue writes for unresolved recs (may or may not fire per test).
        Redis::shouldReceive('rpush')
            ->with('sync:unresolved_recommendations', Mockery::any())
            ->zeroOrMoreTimes();
    }
}
