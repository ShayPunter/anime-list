<?php

namespace App\DTOs;

use Spatie\LaravelData\Data;

class VoiceActorData extends Data
{
    public function __construct(
        public readonly PersonData $person,
        public readonly string $language,
    ) {}
}
