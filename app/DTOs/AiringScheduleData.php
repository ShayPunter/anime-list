<?php

namespace App\DTOs;

use Carbon\Carbon;
use Spatie\LaravelData\Data;

class AiringScheduleData extends Data
{
    public function __construct(
        public readonly int $anilist_airing_id,
        public readonly int $episode,
        public readonly Carbon $airs_at,
        public readonly ?int $time_until_airing,
    ) {}

    public static function fromAniList(array $node): self
    {
        return new self(
            anilist_airing_id: $node['id'],
            episode: $node['episode'],
            airs_at: Carbon::createFromTimestamp($node['airingAt']),
            time_until_airing: $node['timeUntilAiring'] ?? null,
        );
    }
}
