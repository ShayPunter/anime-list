<?php

namespace App\DTOs;

use Spatie\LaravelData\Data;

class CharacterEdgeData extends Data
{
    public function __construct(
        public readonly CharacterData $character,
        public readonly ?string $role,
        /** @var PersonData[] */
        public readonly array $voice_actors,
    ) {}

    public static function fromAniList(array $edge): self
    {
        return new self(
            character: CharacterData::fromAniList($edge['node'] ?? []),
            role: $edge['role'] ?? null,
            voice_actors: array_map(
                fn (array $va) => PersonData::fromAniList($va),
                $edge['voiceActors'] ?? [],
            ),
        );
    }
}
