<?php

namespace App\DTOs;

use Spatie\LaravelData\Data;

class StudioEdgeData extends Data
{
    public function __construct(
        public readonly StudioData $studio,
        public readonly bool $is_main,
    ) {}

    public static function fromAniList(array $edge): self
    {
        return new self(
            studio: new StudioData(
                anilist_id: $edge['node']['id'],
                name: $edge['node']['name'],
                is_animation_studio: $edge['node']['isAnimationStudio'] ?? false,
                website_url: $edge['node']['siteUrl'] ?? null,
            ),
            is_main: $edge['isMain'] ?? false,
        );
    }
}
