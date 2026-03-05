<?php

namespace App\Services;

use App\DTOs\AnimeData;
use App\Models\AiringSchedule;
use App\Models\Anime;
use App\Models\ExternalId;
use App\Models\Genre;
use App\Models\Studio;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;

class AnimeDataPersistenceService
{
    /**
     * Persist a batch of raw AniList media items in a single transaction.
     *
     * @param  array<int, array>  $mediaItems  Raw AniList media arrays
     * @return Collection<int, Anime>
     */
    public function persistBatch(array $mediaItems): Collection
    {
        $dtos = array_map(fn (array $media) => AnimeData::fromAniList($media), $mediaItems);

        return DB::transaction(function () use ($dtos) {
            $animeModels = $this->upsertAnimeBatch($dtos);
            $animeMap = $animeModels->pluck('id', 'anilist_id');

            $this->syncGenresBatch($dtos, $animeMap);
            $this->syncStudiosBatch($dtos, $animeMap);
            $this->upsertAiringSchedulesBatch($dtos, $animeMap);
            $this->upsertExternalIdsBatch($dtos, $animeMap);
            $this->pushPendingRelations($dtos);
            $this->invalidateCaches($dtos, $animeMap);

            return $animeModels;
        });
    }

    /**
     * Persist a single raw AniList media item.
     */
    public function persistSingle(array $mediaData): Anime
    {
        $dto = AnimeData::fromAniList($mediaData);

        $anime = DB::transaction(function () use ($dto) {
            $anime = $this->upsertSingleAnime($dto);

            $this->syncGenresForAnime($anime, $dto);
            $this->syncStudiosForAnime($anime, $dto);
            $this->upsertAiringSchedulesForAnime($anime, $dto);
            $this->upsertExternalIdsForAnime($anime, $dto);

            return $anime;
        });

        if (! empty($dto->relations)) {
            $this->pushPendingRelations([$dto]);
        }

        Cache::forget("anime:{$anime->id}");
        if ($dto->season && $dto->season_year) {
            Cache::forget("anime:seasonal:{$dto->season_year}:{$dto->season}");
        }

        return $anime;
    }

    // ─── Batch operations ───────────────────────────────────────────────

    /**
     * @param  AnimeData[]  $dtos
     */
    private function upsertAnimeBatch(array $dtos): Collection
    {
        $rows = [];
        foreach ($dtos as $dto) {
            $rows[] = $this->animeAttributes($dto);
        }

        // Handle mal_id duplicates: first attempt with mal_ids, retry without on conflict
        try {
            Anime::upsert($rows, ['anilist_id'], array_keys($rows[0]));
        } catch (UniqueConstraintViolationException $e) {
            if (str_contains($e->getMessage(), 'mal_id')) {
                Log::warning('Batch upsert mal_id conflict, retrying with null mal_ids', [
                    'count' => count($rows),
                ]);
                $rows = array_map(function ($row) {
                    $row['mal_id'] = null;

                    return $row;
                }, $rows);
                Anime::upsert($rows, ['anilist_id'], array_keys($rows[0]));
            } else {
                throw $e;
            }
        }

        $anilistIds = array_column($rows, 'anilist_id');

        return Anime::whereIn('anilist_id', $anilistIds)->get()->keyBy('anilist_id');
    }

    /**
     * @param  AnimeData[]  $dtos
     * @param  Collection<int, int>  $animeMap  anilist_id => anime.id
     */
    private function syncGenresBatch(array $dtos, Collection $animeMap): void
    {
        // Collect all unique genre names
        $allGenreNames = collect($dtos)
            ->flatMap(fn (AnimeData $dto) => collect($dto->genres)->pluck('name'))
            ->unique()
            ->values()
            ->all();

        if (empty($allGenreNames)) {
            return;
        }

        // Ensure all genres exist
        $existing = Genre::whereIn('name', $allGenreNames)->pluck('id', 'name');
        $missing = array_diff($allGenreNames, $existing->keys()->all());

        if (! empty($missing)) {
            Genre::insert(array_map(fn ($name) => [
                'name' => $name,
                'created_at' => now(),
                'updated_at' => now(),
            ], $missing));
            $existing = Genre::whereIn('name', $allGenreNames)->pluck('id', 'name');
        }

        // Build pivot rows
        $pivotRows = [];
        foreach ($dtos as $dto) {
            $animeId = $animeMap->get($dto->anilist_id);
            if (! $animeId || empty($dto->genres)) {
                continue;
            }

            foreach ($dto->genres as $genre) {
                $genreId = $existing->get($genre->name);
                if ($genreId) {
                    $pivotRows[] = ['anime_id' => $animeId, 'genre_id' => $genreId];
                }
            }
        }

        if (! empty($pivotRows)) {
            // Delete existing and re-insert for the batch
            $affectedAnimeIds = array_unique(array_column($pivotRows, 'anime_id'));
            DB::table('anime_genre')->whereIn('anime_id', $affectedAnimeIds)->delete();
            DB::table('anime_genre')->insert($pivotRows);
        }
    }

    /**
     * @param  AnimeData[]  $dtos
     * @param  Collection<int, int>  $animeMap
     */
    private function syncStudiosBatch(array $dtos, Collection $animeMap): void
    {
        // Collect all studios and upsert them
        $allStudios = collect($dtos)
            ->flatMap(fn (AnimeData $dto) => collect($dto->studios)->map(fn ($edge) => $edge->studio))
            ->unique(fn ($s) => $s->anilist_id)
            ->values();

        if ($allStudios->isEmpty()) {
            return;
        }

        $studioRows = $allStudios->map(fn ($s) => [
            'anilist_id' => $s->anilist_id,
            'name' => $s->name,
            'is_animation_studio' => $s->is_animation_studio,
            'website_url' => $s->website_url,
            'created_at' => now(),
            'updated_at' => now(),
        ])->all();

        Studio::upsert($studioRows, ['anilist_id'], ['name', 'is_animation_studio', 'website_url', 'updated_at']);

        $studioMap = Studio::whereIn('anilist_id', $allStudios->pluck('anilist_id'))
            ->pluck('id', 'anilist_id');

        // Build pivot rows
        $pivotRows = [];
        foreach ($dtos as $dto) {
            $animeId = $animeMap->get($dto->anilist_id);
            if (! $animeId || empty($dto->studios)) {
                continue;
            }

            foreach ($dto->studios as $edge) {
                $studioId = $studioMap->get($edge->studio->anilist_id);
                if ($studioId) {
                    $pivotRows[] = [
                        'anime_id' => $animeId,
                        'studio_id' => $studioId,
                        'is_main' => $edge->is_main,
                    ];
                }
            }
        }

        if (! empty($pivotRows)) {
            // Deduplicate: AniList can list the same studio twice (as main + non-main).
            // Keep is_main=true when duplicates exist.
            $unique = [];
            foreach ($pivotRows as $row) {
                $key = $row['anime_id'].'-'.$row['studio_id'];
                if (! isset($unique[$key]) || $row['is_main']) {
                    $unique[$key] = $row;
                }
            }
            $pivotRows = array_values($unique);

            $affectedAnimeIds = array_unique(array_column($pivotRows, 'anime_id'));
            DB::table('anime_studio')->whereIn('anime_id', $affectedAnimeIds)->delete();
            DB::table('anime_studio')->insert($pivotRows);
        }
    }

    /**
     * @param  AnimeData[]  $dtos
     * @param  Collection<int, int>  $animeMap
     */
    private function upsertAiringSchedulesBatch(array $dtos, Collection $animeMap): void
    {
        $rows = [];
        foreach ($dtos as $dto) {
            $animeId = $animeMap->get($dto->anilist_id);
            if (! $animeId || empty($dto->airing_schedules)) {
                continue;
            }

            foreach ($dto->airing_schedules as $s) {
                $rows[] = [
                    'anime_id' => $animeId,
                    'anilist_airing_id' => $s->anilist_airing_id,
                    'episode' => $s->episode,
                    'airs_at' => $s->airs_at,
                    'time_until_airing' => $s->time_until_airing,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        if (! empty($rows)) {
            AiringSchedule::upsert(
                $rows,
                ['anilist_airing_id'],
                ['anime_id', 'episode', 'airs_at', 'time_until_airing', 'updated_at'],
            );
        }
    }

    /**
     * @param  AnimeData[]  $dtos
     * @param  Collection<int, int>  $animeMap
     */
    private function upsertExternalIdsBatch(array $dtos, Collection $animeMap): void
    {
        $rows = [];
        foreach ($dtos as $dto) {
            $animeId = $animeMap->get($dto->anilist_id);
            if (! $animeId || empty($dto->external_links)) {
                continue;
            }

            foreach ($dto->external_links as $link) {
                $rows[] = [
                    'anime_id' => $animeId,
                    'platform' => $link->platform,
                    'external_id' => null,
                    'url' => $link->url,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        if (! empty($rows)) {
            ExternalId::upsert(
                $rows,
                ['anime_id', 'platform'],
                ['url', 'updated_at'],
            );
        }
    }

    /**
     * @param  AnimeData[]  $dtos
     */
    private function pushPendingRelations(array $dtos): void
    {
        $pendingRelations = [];
        foreach ($dtos as $dto) {
            foreach ($dto->relations as $r) {
                $pendingRelations[] = json_encode([
                    'from_anilist_id' => $dto->anilist_id,
                    'to_anilist_id' => $r->related_anilist_id,
                    'relation_type' => $r->relation_type,
                ]);
            }
        }

        if (! empty($pendingRelations)) {
            try {
                Redis::rpush('sync:pending_relations', ...$pendingRelations);
            } catch (\Throwable $e) {
                Log::error('Failed to push pending relations to Redis', [
                    'count' => count($pendingRelations),
                    'error' => $e->getMessage(),
                ]);
            }
        }
    }

    /**
     * @param  AnimeData[]  $dtos
     * @param  Collection<int, int>  $animeMap
     */
    private function invalidateCaches(array $dtos, Collection $animeMap): void
    {
        foreach ($dtos as $dto) {
            $animeId = $animeMap->get($dto->anilist_id);
            if ($animeId) {
                Cache::forget("anime:{$animeId}");
            }
            if ($dto->season && $dto->season_year) {
                Cache::forget("anime:seasonal:{$dto->season_year}:{$dto->season}");
            }
        }
    }

    // ─── Single-item operations (for persistSingle) ─────────────────────

    private function upsertSingleAnime(AnimeData $dto): Anime
    {
        $attributes = $this->animeAttributes($dto);
        unset($attributes['anilist_id']);

        try {
            return Anime::updateOrCreate(
                ['anilist_id' => $dto->anilist_id],
                $attributes,
            );
        } catch (UniqueConstraintViolationException $e) {
            if (str_contains($e->getMessage(), 'mal_id')) {
                $attributes['mal_id'] = null;
                Log::warning('Duplicate mal_id detected, set to null', [
                    'anilist_id' => $dto->anilist_id,
                    'mal_id' => $dto->mal_id,
                ]);

                return Anime::updateOrCreate(
                    ['anilist_id' => $dto->anilist_id],
                    $attributes,
                );
            }

            throw $e;
        }
    }

    private function syncGenresForAnime(Anime $anime, AnimeData $dto): void
    {
        if (empty($dto->genres)) {
            return;
        }

        $genreNames = collect($dto->genres)->pluck('name')->all();
        $existing = Genre::whereIn('name', $genreNames)->pluck('id', 'name');

        $missing = array_diff($genreNames, $existing->keys()->all());
        if (! empty($missing)) {
            Genre::insert(array_map(fn ($name) => [
                'name' => $name,
                'created_at' => now(),
                'updated_at' => now(),
            ], $missing));
            $existing = Genre::whereIn('name', $genreNames)->pluck('id', 'name');
        }

        $anime->genres()->sync($existing->values()->all());
    }

    private function syncStudiosForAnime(Anime $anime, AnimeData $dto): void
    {
        if (empty($dto->studios)) {
            return;
        }

        $studioSync = [];
        foreach ($dto->studios as $edge) {
            $studio = Studio::updateOrCreate(
                ['anilist_id' => $edge->studio->anilist_id],
                [
                    'name' => $edge->studio->name,
                    'is_animation_studio' => $edge->studio->is_animation_studio,
                    'website_url' => $edge->studio->website_url,
                ],
            );
            $studioSync[$studio->id] = ['is_main' => $edge->is_main];
        }

        $anime->studios()->sync($studioSync);
    }

    private function upsertAiringSchedulesForAnime(Anime $anime, AnimeData $dto): void
    {
        if (empty($dto->airing_schedules)) {
            return;
        }

        $rows = array_map(fn ($s) => [
            'anime_id' => $anime->id,
            'anilist_airing_id' => $s->anilist_airing_id,
            'episode' => $s->episode,
            'airs_at' => $s->airs_at,
            'time_until_airing' => $s->time_until_airing,
            'created_at' => now(),
            'updated_at' => now(),
        ], $dto->airing_schedules);

        AiringSchedule::upsert(
            $rows,
            ['anilist_airing_id'],
            ['anime_id', 'episode', 'airs_at', 'time_until_airing', 'updated_at'],
        );
    }

    private function upsertExternalIdsForAnime(Anime $anime, AnimeData $dto): void
    {
        if (empty($dto->external_links)) {
            return;
        }

        $rows = array_map(fn ($link) => [
            'anime_id' => $anime->id,
            'platform' => $link->platform,
            'external_id' => null,
            'url' => $link->url,
            'created_at' => now(),
            'updated_at' => now(),
        ], $dto->external_links);

        ExternalId::upsert(
            $rows,
            ['anime_id', 'platform'],
            ['url', 'updated_at'],
        );
    }

    // ─── Helpers ────────────────────────────────────────────────────────

    private function animeAttributes(AnimeData $dto): array
    {
        return [
            'anilist_id' => $dto->anilist_id,
            'mal_id' => $dto->mal_id,
            'title_romaji' => $dto->title_romaji,
            'title_english' => $dto->title_english,
            'title_native' => $dto->title_native,
            'title_synonyms' => json_encode($dto->title_synonyms),
            'format' => $dto->format,
            'status' => $dto->status,
            'season' => $dto->season,
            'season_year' => $dto->season_year,
            'source' => $dto->source,
            'episodes' => $dto->episodes,
            'duration' => $dto->duration,
            'episode_count_unknown' => $dto->episode_count_unknown,
            'aired_from' => $dto->aired_from,
            'aired_to' => $dto->aired_to,
            'synopsis' => $dto->synopsis,
            'cover_image_large' => $dto->cover_image_large,
            'cover_image_medium' => $dto->cover_image_medium,
            'cover_image_color' => $dto->cover_image_color,
            'banner_image' => $dto->banner_image,
            'trailer_url' => $dto->trailer_url,
            'average_score' => $dto->average_score,
            'mean_score' => $dto->mean_score,
            'popularity' => $dto->popularity,
            'trending' => $dto->trending,
            'favourites' => $dto->favourites,
            'is_adult' => $dto->is_adult,
            'anilist_updated_at' => $dto->anilist_updated_at,
            'synced_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
