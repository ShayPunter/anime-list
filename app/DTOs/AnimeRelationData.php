<?php

namespace App\DTOs;

use Spatie\LaravelData\Data;

class AnimeRelationData extends Data
{
    public function __construct(
        public readonly int $related_anilist_id,
        public readonly string $relation_type,
    ) {}

    public static function fromAniList(array $edge): self
    {
        return new self(
            related_anilist_id: $edge['node']['id'],
            relation_type: $edge['relationType'],
        );
    }
}
