<?php

namespace App\DTOs;

use Spatie\LaravelData\Data;

class ExternalLinkData extends Data
{
    public function __construct(
        public readonly string $platform,
        public readonly ?string $url,
    ) {}

    public static function fromAniList(array $link): self
    {
        return new self(
            platform: $link['site'] ?? 'Unknown',
            url: $link['url'] ?? null,
        );
    }
}
