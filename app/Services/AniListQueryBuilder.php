<?php

namespace App\Services;

class AniListQueryBuilder
{
    private const MEDIA_FIELDS = <<<'GRAPHQL'
        id
        idMal
        title {
            romaji
            english
            native
        }
        synonyms
        format
        status
        season
        seasonYear
        source
        episodes
        duration
        startDate { year month day }
        endDate { year month day }
        description(asHtml: false)
        coverImage { large medium color }
        bannerImage
        trailer { site id }
        averageScore
        meanScore
        popularity
        trending
        favourites
        isAdult
        updatedAt
        genres
        studios {
            edges {
                isMain
                node {
                    id
                    name
                    isAnimationStudio
                    siteUrl
                }
            }
        }
        relations {
            edges {
                relationType
                node {
                    id
                    type
                }
            }
        }
        externalLinks {
            site
            url
        }
        nextAiringEpisode {
            id
            episode
            airingAt
            timeUntilAiring
        }
    GRAPHQL;

    public static function animePage(): string
    {
        $fields = self::MEDIA_FIELDS;

        return <<<GRAPHQL
        query (\$page: Int, \$perPage: Int) {
            Page(page: \$page, perPage: \$perPage) {
                pageInfo {
                    hasNextPage
                    currentPage
                    lastPage
                    total
                }
                media(type: ANIME, sort: [ID]) {
                    {$fields}
                }
            }
        }
        GRAPHQL;
    }

    public static function updatedSince(): string
    {
        $fields = self::MEDIA_FIELDS;

        return <<<GRAPHQL
        query (\$page: Int, \$perPage: Int) {
            Page(page: \$page, perPage: \$perPage) {
                pageInfo {
                    hasNextPage
                    currentPage
                    lastPage
                    total
                }
                media(type: ANIME, sort: [UPDATED_AT_DESC]) {
                    {$fields}
                }
            }
        }
        GRAPHQL;
    }

    public static function airingSchedulePage(): string
    {
        return <<<'GRAPHQL'
        query ($page: Int, $perPage: Int, $airingAt_greater: Int, $airingAt_lesser: Int) {
            Page(page: $page, perPage: $perPage) {
                pageInfo {
                    hasNextPage
                    currentPage
                    lastPage
                    total
                }
                airingSchedules(
                    airingAt_greater: $airingAt_greater,
                    airingAt_lesser: $airingAt_lesser,
                    sort: [TIME]
                ) {
                    id
                    episode
                    airingAt
                    timeUntilAiring
                    media {
                        id
                    }
                }
            }
        }
        GRAPHQL;
    }

    public static function searchAnime(): string
    {
        $fields = self::MEDIA_FIELDS;

        return <<<GRAPHQL
        query (\$search: String, \$page: Int, \$perPage: Int) {
            Page(page: \$page, perPage: \$perPage) {
                media(search: \$search, type: ANIME, isAdult: false) {
                    {$fields}
                }
            }
        }
        GRAPHQL;
    }

    public static function animeByStatus(): string
    {
        $fields = self::MEDIA_FIELDS;

        return <<<GRAPHQL
        query (\$page: Int, \$perPage: Int, \$status: MediaStatus, \$season: MediaSeason, \$seasonYear: Int) {
            Page(page: \$page, perPage: \$perPage) {
                pageInfo {
                    hasNextPage
                    currentPage
                    lastPage
                    total
                }
                media(type: ANIME, sort: [POPULARITY_DESC], status: \$status, season: \$season, seasonYear: \$seasonYear) {
                    {$fields}
                }
            }
        }
        GRAPHQL;
    }

    public static function singleAnime(): string
    {
        $fields = self::MEDIA_FIELDS;

        return <<<GRAPHQL
        query (\$id: Int) {
            Media(id: \$id, type: ANIME) {
                {$fields}
            }
        }
        GRAPHQL;
    }
}
