<?php

namespace Tests\Feature\Services;

use App\Services\AnimeDataPersistenceService;
use Illuminate\Support\Facades\Redis;
use Mockery;
use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
use Tests\TestCase;

class AnimeDataPersistenceServiceTest extends TestCase
{
    use MockeryPHPUnitIntegration;

    public function test_persist_batch_pushes_recommendations_to_redis(): void
    {
        Redis::shouldReceive('rpush')
            ->withArgs(function (string $key, ...$items) {
                if ($key !== 'sync:pending_recommendations') {
                    return false;
                }
                $decoded = array_map(fn ($s) => json_decode($s, true), $items);
                $pairs = collect($decoded)->map(fn ($d) => [$d['from_anilist_id'], $d['to_anilist_id']])->all();

                return in_array([1, 2], $pairs) && in_array([1, 3], $pairs);
            })
            ->once();

        // Relations are empty in our fixture, so this should not be invoked —
        // but allow it for safety in case other edges are introduced later.
        Redis::shouldReceive('rpush')
            ->with('sync:pending_relations', Mockery::any())
            ->zeroOrMoreTimes();

        $media = [
            $this->minimalMedia(1, recommendations: [
                ['nodeId' => 100, 'recId' => 2, 'rating' => 90],
                ['nodeId' => 101, 'recId' => 3, 'rating' => 50],
            ]),
        ];

        app(AnimeDataPersistenceService::class)->persistBatch($media);
    }

    public function test_persist_batch_skips_non_anime_recommendations(): void
    {
        // A MANGA recommendation must not reach Redis at all. Because no anime
        // recommendations are produced, rpush should never be called.
        Redis::shouldReceive('rpush')
            ->with('sync:pending_recommendations', Mockery::any())
            ->never();
        Redis::shouldReceive('rpush')
            ->with('sync:pending_relations', Mockery::any())
            ->zeroOrMoreTimes();

        $media = [
            $this->minimalMedia(1, recommendationsRaw: [
                [
                    'node' => [
                        'id' => 999,
                        'rating' => 50,
                        'mediaRecommendation' => ['id' => 5, 'type' => 'MANGA'],
                    ],
                ],
            ]),
        ];

        app(AnimeDataPersistenceService::class)->persistBatch($media);
    }

    /**
     * @param  array<int, array{nodeId:int, recId:int, rating:int}>  $recommendations
     * @param  array<int, array<string, mixed>>|null  $recommendationsRaw
     */
    private function minimalMedia(int $id, array $recommendations = [], ?array $recommendationsRaw = null): array
    {
        $edges = $recommendationsRaw ?? array_map(fn (array $r) => [
            'node' => [
                'id' => $r['nodeId'],
                'rating' => $r['rating'],
                'mediaRecommendation' => ['id' => $r['recId'], 'type' => 'ANIME'],
            ],
        ], $recommendations);

        return [
            'id' => $id,
            'idMal' => null,
            'title' => ['romaji' => "Anime #{$id}", 'english' => null, 'native' => null],
            'synonyms' => [],
            'format' => 'TV',
            'status' => 'FINISHED',
            'season' => null,
            'seasonYear' => null,
            'source' => null,
            'episodes' => 12,
            'duration' => 24,
            'startDate' => null,
            'endDate' => null,
            'description' => null,
            'coverImage' => ['large' => null, 'medium' => null, 'color' => null],
            'bannerImage' => null,
            'trailer' => null,
            'averageScore' => null,
            'meanScore' => null,
            'popularity' => null,
            'trending' => null,
            'favourites' => null,
            'isAdult' => false,
            'updatedAt' => null,
            'genres' => [],
            'studios' => ['edges' => []],
            'relations' => ['edges' => []],
            'externalLinks' => [],
            'nextAiringEpisode' => null,
            'streamingEpisodes' => [],
            'airingSchedule' => ['nodes' => []],
            'characters' => ['edges' => []],
            'recommendations' => ['edges' => $edges],
        ];
    }
}
