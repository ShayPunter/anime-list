<?php

namespace App\DTOs;

use Spatie\LaravelData\Data;

class CharacterEdgeData extends Data
{
    public function __construct(
        public readonly CharacterData $character,
        public readonly ?string $role,
        /** @var VoiceActorData[] */
        public readonly array $voice_actors,
    ) {}

    public static function fromAniList(array $edge): self
    {
        $jp = array_map(
            fn (array $va) => new VoiceActorData(
                person: PersonData::fromAniList($va),
                language: 'JAPANESE',
            ),
            $edge['voiceActorsJp'] ?? [],
        );

        $en = array_map(
            fn (array $va) => new VoiceActorData(
                person: PersonData::fromAniList($va),
                language: 'ENGLISH',
            ),
            $edge['voiceActorsEn'] ?? [],
        );

        return new self(
            character: CharacterData::fromAniList($edge['node'] ?? []),
            role: $edge['role'] ?? null,
            voice_actors: array_merge($jp, $en),
        );
    }
}
