<?php

namespace App\Services;

use App\Http\Resources\AnimeCardResource;
use App\Http\Resources\ListEntryResource;
use App\Models\Anime;
use App\Models\User;
use App\Models\UserAnimeList;

class UserListService
{
    public function getListForPage(User $user): array
    {
        $entries = $user->animeList()
            ->with(['anime:id,slug,title_romaji,title_english,format,episodes,cover_image_large,cover_image_medium,cover_image_color,average_score,status as anime_status'])
            ->with(['anime.genres'])
            ->get();

        $counts = $user->animeList()
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        return [
            'entries' => ListEntryResource::collection($entries),
            'counts' => $counts,
        ];
    }

    public function getPublicListForPage(User $user): array
    {
        $entries = $user->animeList()
            ->where('is_private', false)
            ->with(['anime:id,slug,title_romaji,title_english,format,episodes,cover_image_large,cover_image_medium,cover_image_color,average_score,status as anime_status'])
            ->with(['anime.genres'])
            ->get();

        $counts = $user->animeList()
            ->where('is_private', false)
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        return [
            'entries' => ListEntryResource::collection($entries),
            'counts' => $counts,
        ];
    }

    public function store(User $user, array $data): UserAnimeList
    {
        $data['score'] = $data['score'] ?? 0;

        // If creating as "watching" and no start date was supplied, default to today.
        if (
            ($data['status'] ?? null) === UserAnimeList::STATUS_WATCHING
            && empty($data['started_at'])
        ) {
            $data['started_at'] = now();
        }

        // A soft-deleted entry may already exist for (user_id, anime_id).
        // The DB unique constraint ignores deleted_at, so a plain insert would fail —
        // restore and overwrite the trashed row instead.
        $trashed = $user->animeList()
            ->onlyTrashed()
            ->where('anime_id', $data['anime_id'])
            ->first();

        if ($trashed) {
            $trashed->restore();
            $trashed->forceFill([
                'score' => 0,
                'progress' => 0,
                'rewatch_count' => 0,
                'started_at' => null,
                'completed_at' => null,
                'notes' => null,
                'tags' => null,
                'is_private' => false,
                'is_rewatching' => false,
            ])->fill($data)->save();

            $trashed->load('anime');

            return $this->applyAutoComplete($trashed);
        }

        $entry = $user->animeList()->create($data);
        $entry->load('anime');

        return $this->applyAutoComplete($entry);
    }

    public function update(UserAnimeList $entry, array $data): UserAnimeList
    {
        if (array_key_exists('score', $data)) {
            $data['score'] = $data['score'] ?? 0;
        }

        // If status is changing to "watching" and no start date is set
        // (neither in the payload nor already on the entry), default to today.
        if (
            array_key_exists('status', $data)
            && $data['status'] === UserAnimeList::STATUS_WATCHING
            && empty($data['started_at'])
            && $entry->started_at === null
        ) {
            $data['started_at'] = now();
        }

        $entry->update($data);
        $entry->load('anime');

        return $this->applyAutoComplete($entry);
    }

    public function delete(UserAnimeList $entry): void
    {
        $entry->delete();
    }

    private function applyAutoComplete(UserAnimeList $entry): UserAnimeList
    {
        $anime = $entry->anime;
        $dirty = false;

        // When status set to completed:
        // - fill progress to total episodes (if known)
        // - default completed_at to today if unset
        if ($entry->status === UserAnimeList::STATUS_COMPLETED) {
            if ($anime && $anime->episodes !== null && $anime->episodes > 0 && $entry->progress < $anime->episodes) {
                $entry->progress = $anime->episodes;
                $dirty = true;
            }
            if ($entry->completed_at === null) {
                $entry->completed_at = now();
                $dirty = true;
            }
        }

        // When progress reaches total, auto-mark as completed
        if ($anime && $anime->episodes !== null && $entry->progress >= $anime->episodes && $anime->episodes > 0) {
            if ($entry->status !== UserAnimeList::STATUS_COMPLETED) {
                $entry->status = UserAnimeList::STATUS_COMPLETED;
                $dirty = true;
            }
            if ($entry->completed_at === null) {
                $entry->completed_at = now();
                $dirty = true;
            }
        }

        if ($dirty) {
            $entry->save();
        }

        return $entry;
    }
}
