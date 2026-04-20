<?php

namespace Tests\Unit\DTOs;

use App\DTOs\AnimeRecommendationData;
use PHPUnit\Framework\TestCase;

class AnimeRecommendationDataTest extends TestCase
{
    public function test_from_anilist_parses_valid_edge(): void
    {
        $dto = AnimeRecommendationData::fromAniList([
            'node' => [
                'id' => 42,
                'rating' => 87,
                'mediaRecommendation' => [
                    'id' => 1234,
                    'type' => 'ANIME',
                ],
            ],
        ]);

        $this->assertNotNull($dto);
        $this->assertSame(42, $dto->anilist_recommendation_id);
        $this->assertSame(1234, $dto->recommended_anilist_id);
        $this->assertSame(87, $dto->rating);
    }

    public function test_from_anilist_returns_null_when_media_recommendation_is_manga(): void
    {
        $dto = AnimeRecommendationData::fromAniList([
            'node' => [
                'id' => 42,
                'rating' => 10,
                'mediaRecommendation' => [
                    'id' => 999,
                    'type' => 'MANGA',
                ],
            ],
        ]);

        $this->assertNull($dto);
    }

    public function test_from_anilist_returns_null_when_media_recommendation_missing(): void
    {
        $dto = AnimeRecommendationData::fromAniList([
            'node' => [
                'id' => 42,
                'rating' => 5,
                'mediaRecommendation' => null,
            ],
        ]);

        $this->assertNull($dto);
    }

    public function test_from_anilist_defaults_rating_to_zero_when_missing(): void
    {
        $dto = AnimeRecommendationData::fromAniList([
            'node' => [
                'id' => 7,
                'mediaRecommendation' => [
                    'id' => 1,
                    'type' => 'ANIME',
                ],
            ],
        ]);

        $this->assertNotNull($dto);
        $this->assertSame(0, $dto->rating);
    }
}
