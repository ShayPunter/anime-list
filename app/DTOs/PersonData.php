<?php

namespace App\DTOs;

use Carbon\Carbon;
use Spatie\LaravelData\Data;

class PersonData extends Data
{
    public function __construct(
        public readonly int $anilist_id,
        public readonly string $name_full,
        public readonly ?string $name_native,
        public readonly ?string $image_large,
        public readonly ?string $image_medium,
        public readonly ?string $gender,
        public readonly ?Carbon $birthdate,
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
            $fullName = "Person #{$node['id']}";
        }

        return new self(
            anilist_id: $node['id'],
            name_full: $fullName,
            name_native: $name['native'] ?? null,
            image_large: $node['image']['large'] ?? null,
            image_medium: $node['image']['medium'] ?? null,
            gender: $node['gender'] ?? null,
            birthdate: self::buildDate($node['dateOfBirth'] ?? null),
            site_url: $node['siteUrl'] ?? null,
        );
    }

    private static function buildDate(?array $date): ?Carbon
    {
        if (! $date || ! isset($date['year']) || $date['year'] === null) {
            return null;
        }

        return Carbon::create(
            $date['year'],
            $date['month'] ?? 1,
            $date['day'] ?? 1,
        );
    }
}
