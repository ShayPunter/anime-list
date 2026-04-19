<?php

namespace App\DTOs;

use Carbon\Carbon;
use Spatie\LaravelData\Data;

class AnimeData extends Data
{
    public function __construct(
        public readonly int $anilist_id,
        public readonly ?int $mal_id,
        public readonly string $title_romaji,
        public readonly ?string $title_english,
        public readonly ?string $title_native,
        public readonly ?array $title_synonyms,
        public readonly ?string $format,
        public readonly ?string $status,
        public readonly ?string $season,
        public readonly ?int $season_year,
        public readonly ?string $source,
        public readonly ?int $episodes,
        public readonly ?int $duration,
        public readonly bool $episode_count_unknown,
        public readonly ?Carbon $aired_from,
        public readonly ?Carbon $aired_to,
        public readonly ?string $synopsis,
        public readonly ?string $cover_image_large,
        public readonly ?string $cover_image_medium,
        public readonly ?string $cover_image_color,
        public readonly ?string $banner_image,
        public readonly ?string $trailer_url,
        public readonly ?int $average_score,
        public readonly ?int $mean_score,
        public readonly ?int $popularity,
        public readonly ?int $trending,
        public readonly ?int $favourites,
        public readonly bool $is_adult,
        public readonly ?Carbon $anilist_updated_at,
        /** @var GenreData[] */
        public readonly array $genres,
        /** @var StudioEdgeData[] */
        public readonly array $studios,
        /** @var AnimeRelationData[] */
        public readonly array $relations,
        /** @var ExternalLinkData[] */
        public readonly array $external_links,
        /** @var AiringScheduleData[] */
        public readonly array $airing_schedules,
        /** @var CharacterEdgeData[] */
        public readonly array $characters,
        /** @var EpisodeData[] */
        public readonly array $episodes_data,
    ) {}

    public static function fromAniList(array $media): self
    {
        return new self(
            anilist_id: $media['id'],
            mal_id: $media['idMal'] ?? null,
            title_romaji: $media['title']['romaji']
                ?? $media['title']['english']
                ?? $media['title']['native']
                ?? "Unknown Title [AniList #{$media['id']}]",
            title_english: $media['title']['english'] ?? null,
            title_native: $media['title']['native'] ?? null,
            title_synonyms: $media['synonyms'] ?? null,
            format: $media['format'] ?? null,
            status: $media['status'] ?? null,
            season: $media['season'] ?? null,
            season_year: $media['seasonYear'] ?? null,
            source: $media['source'] ?? null,
            episodes: $media['episodes'] ?? null,
            duration: $media['duration'] ?? null,
            episode_count_unknown: ($media['episodes'] ?? null) === null
                && ($media['status'] ?? null) === 'RELEASING',
            aired_from: self::buildDate($media['startDate'] ?? null),
            aired_to: self::buildDate($media['endDate'] ?? null),
            synopsis: $media['description'] ?? null,
            cover_image_large: $media['coverImage']['large'] ?? null,
            cover_image_medium: $media['coverImage']['medium'] ?? null,
            cover_image_color: $media['coverImage']['color'] ?? null,
            banner_image: $media['bannerImage'] ?? null,
            trailer_url: self::buildTrailerUrl($media['trailer'] ?? null),
            average_score: $media['averageScore'] ?? null,
            mean_score: $media['meanScore'] ?? null,
            popularity: $media['popularity'] ?? null,
            trending: $media['trending'] ?? null,
            favourites: $media['favourites'] ?? null,
            is_adult: $media['isAdult'] ?? false,
            anilist_updated_at: isset($media['updatedAt'])
                ? Carbon::createFromTimestamp($media['updatedAt'])
                : null,
            genres: array_map(
                fn (string $g) => GenreData::fromAniList($g),
                $media['genres'] ?? [],
            ),
            studios: array_map(
                fn (array $edge) => StudioEdgeData::fromAniList($edge),
                $media['studios']['edges'] ?? [],
            ),
            relations: array_values(array_filter(
                array_map(
                    fn (array $edge) => ($edge['node']['type'] ?? null) === 'ANIME'
                        ? AnimeRelationData::fromAniList($edge)
                        : null,
                    $media['relations']['edges'] ?? [],
                ),
            )),
            external_links: array_map(
                fn (array $link) => ExternalLinkData::fromAniList($link),
                $media['externalLinks'] ?? [],
            ),
            airing_schedules: isset($media['nextAiringEpisode']['id'])
                ? [AiringScheduleData::fromAniList($media['nextAiringEpisode'])]
                : [],
            characters: array_map(
                fn (array $edge) => CharacterEdgeData::fromAniList($edge),
                $media['characters']['edges'] ?? [],
            ),
            episodes_data: EpisodeData::mergeFromAniList(
                streaming: $media['streamingEpisodes'] ?? [],
                schedule: $media['airingSchedule']['nodes'] ?? [],
                totalEpisodes: $media['episodes'] ?? null,
                defaultDuration: $media['duration'] ?? null,
            ),
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

    private static function buildTrailerUrl(?array $trailer): ?string
    {
        if (! $trailer || ! isset($trailer['id'], $trailer['site'])) {
            return null;
        }

        return match ($trailer['site']) {
            'youtube' => "https://www.youtube.com/watch?v={$trailer['id']}",
            'dailymotion' => "https://www.dailymotion.com/video/{$trailer['id']}",
            default => null,
        };
    }
}
