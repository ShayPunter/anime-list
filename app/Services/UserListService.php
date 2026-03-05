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
            ->with(['anime:id,title_romaji,title_english,format,episodes,cover_image_medium,cover_image_color,average_score,status as anime_status'])
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
            ->with(['anime:id,title_romaji,title_english,format,episodes,cover_image_medium,cover_image_color,average_score,status as anime_status'])
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
        $entry = $user->animeList()->create($data);
        $entry->load('anime');

        return $this->applyAutoComplete($entry);
    }

    public function update(UserAnimeList $entry, array $data): UserAnimeList
    {
        if (array_key_exists('score', $data)) {
            $data['score'] = $data['score'] ?? 0;
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

        if ($anime && $anime->episodes !== null && $entry->progress >= $anime->episodes && $anime->episodes > 0) {
            if ($entry->status !== UserAnimeList::STATUS_COMPLETED) {
                $entry->status = UserAnimeList::STATUS_COMPLETED;
            }
            if ($entry->completed_at === null) {
                $entry->completed_at = now();
            }
            $entry->save();
        }

        return $entry;
    }
}
