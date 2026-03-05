<?php

namespace App\DTOs;

use Spatie\LaravelData\Data;

class StudioData extends Data
{
    public function __construct(
        public readonly int $anilist_id,
        public readonly string $name,
        public readonly bool $is_animation_studio,
        public readonly ?string $website_url,
    ) {}
}
