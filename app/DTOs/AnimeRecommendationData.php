<?php

namespace App\DTOs;

use Spatie\LaravelData\Data;

class AnimeRecommendationData extends Data
{
    public function __construct(
        public readonly int $anilist_recommendation_id,
        public readonly int $recommended_anilist_id,
        public readonly int $rating,
    ) {}

    public static function fromAniList(array $edge): ?self
    {
        $node = $edge['node'] ?? null;
        if (! $node) {
            return null;
        }

        $media = $node['mediaRecommendation'] ?? null;
        if (! $media || ($media['type'] ?? null) !== 'ANIME' || ! isset($media['id'])) {
            return null;
        }

        return new self(
            anilist_recommendation_id: (int) $node['id'],
            recommended_anilist_id: (int) $media['id'],
            rating: (int) ($node['rating'] ?? 0),
        );
    }
}
