<?php

namespace App\DTOs;

use Carbon\Carbon;
use Spatie\LaravelData\Data;

class EpisodeData extends Data
{
    public function __construct(
        public readonly int $number,
        public readonly ?string $title,
        public readonly ?string $thumbnail_url,
        public readonly ?Carbon $air_date,
        public readonly ?int $runtime_minutes,
        public readonly ?int $score,
        public readonly ?int $anilist_airing_id,
        public readonly ?string $site_url,
        public readonly ?string $source_site,
    ) {}

    /**
     * Merge AniList `streamingEpisodes` + `airingSchedule.nodes` into a
     * per-episode DTO list keyed by episode number.
     *
     * - streamingEpisodes provides title/thumbnail/site/url but no explicit number;
     *   we parse "Episode N" out of the title, falling back to list position.
     * - airingSchedule.nodes provides authoritative episode number + air date.
     *
     * @param  array<int, array>  $streaming   AniList `streamingEpisodes` array
     * @param  array<int, array>  $schedule    AniList `airingSchedule.nodes` array
     * @param  ?int               $totalEpisodes  `Media.episodes` — used to fill gaps
     * @param  ?int               $defaultDuration `Media.duration` — per-episode fallback
     * @return self[]
     */
    public static function mergeFromAniList(
        array $streaming,
        array $schedule,
        ?int $totalEpisodes,
        ?int $defaultDuration,
    ): array {
        $byNumber = [];

        // First pass: schedule entries are authoritative for number + air_date
        foreach ($schedule as $node) {
            $num = $node['episode'] ?? null;
            if (! $num) {
                continue;
            }
            $byNumber[$num] = [
                'number' => (int) $num,
                'title' => null,
                'thumbnail_url' => null,
                'air_date' => isset($node['airingAt'])
                    ? Carbon::createFromTimestamp($node['airingAt'])
                    : null,
                'anilist_airing_id' => isset($node['id']) ? (int) $node['id'] : null,
                'site_url' => null,
                'source_site' => null,
            ];
        }

        // Second pass: streaming episodes contribute title/thumbnail/url
        foreach ($streaming as $index => $ep) {
            $num = self::parseEpisodeNumber($ep['title'] ?? null) ?? ($index + 1);
            if (! isset($byNumber[$num])) {
                $byNumber[$num] = [
                    'number' => $num,
                    'title' => null,
                    'thumbnail_url' => null,
                    'air_date' => null,
                    'anilist_airing_id' => null,
                    'site_url' => null,
                    'source_site' => null,
                ];
            }
            $byNumber[$num]['title'] = self::stripLeadingEpisodeLabel($ep['title'] ?? null);
            $byNumber[$num]['thumbnail_url'] = $ep['thumbnail'] ?? null;
            $byNumber[$num]['site_url'] = $ep['url'] ?? null;
            $byNumber[$num]['source_site'] = $ep['site'] ?? null;
        }

        // Third pass: fill gaps up to $totalEpisodes with unknown-air-date rows
        if ($totalEpisodes !== null && $totalEpisodes > 0) {
            for ($n = 1; $n <= $totalEpisodes; $n++) {
                if (! isset($byNumber[$n])) {
                    $byNumber[$n] = [
                        'number' => $n,
                        'title' => null,
                        'thumbnail_url' => null,
                        'air_date' => null,
                        'anilist_airing_id' => null,
                        'site_url' => null,
                        'source_site' => null,
                    ];
                }
            }
        }

        ksort($byNumber);

        return array_map(fn (array $row) => new self(
            number: $row['number'],
            title: $row['title'],
            thumbnail_url: $row['thumbnail_url'],
            air_date: $row['air_date'],
            runtime_minutes: $defaultDuration,
            score: null,
            anilist_airing_id: $row['anilist_airing_id'],
            site_url: $row['site_url'],
            source_site: $row['source_site'],
        ), array_values($byNumber));
    }

    private static function parseEpisodeNumber(?string $title): ?int
    {
        if (! $title) {
            return null;
        }

        if (preg_match('/^\s*Episode\s+(\d+)/i', $title, $m)) {
            return (int) $m[1];
        }

        return null;
    }

    private static function stripLeadingEpisodeLabel(?string $title): ?string
    {
        if (! $title) {
            return null;
        }

        // "Episode 3 - The Battle" → "The Battle"; leave plain titles untouched
        $stripped = preg_replace('/^\s*Episode\s+\d+\s*[-:–—]\s*/i', '', $title);

        return $stripped !== null && $stripped !== '' ? $stripped : $title;
    }
}
