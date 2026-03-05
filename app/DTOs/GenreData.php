<?php

namespace App\DTOs;

use Spatie\LaravelData\Data;

class GenreData extends Data
{
    public function __construct(
        public readonly string $name,
    ) {}

    public static function fromAniList(string $genre): self
    {
        return new self(name: $genre);
    }
}
