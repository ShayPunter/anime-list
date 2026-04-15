<?php

namespace App\DTOs;

use Spatie\LaravelData\Data;

class CharacterData extends Data
{
    public function __construct(
        public readonly int $anilist_id,
        public readonly string $name_full,
        public readonly ?string $name_native,
        public readonly ?string $image_large,
        public readonly ?string $image_medium,
        public readonly ?string $description,
        public readonly ?string $gender,
        public readonly ?string $site_url,
    ) {}

    public static function fromAniList(array $node): self
    {
        $name = $node['name'] ?? [];
        $fullName = trim(
            $name['full']
                ?? trim(($name['first'] ?? '').' '.($name['middle'] ?? '').' '.($name['last'] ?? ''))
        );

        if ($fullName === '') {
            $fullName = "Character #{$node['id']}";
        }

        return new self(
            anilist_id: $node['id'],
            name_full: $fullName,
            name_native: $name['native'] ?? null,
            image_large: $node['image']['large'] ?? null,
            image_medium: $node['image']['medium'] ?? null,
            description: $node['description'] ?? null,
            gender: $node['gender'] ?? null,
            site_url: $node['siteUrl'] ?? null,
        );
    }
}
