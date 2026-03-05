<?php

namespace App\Services;

use App\Models\Anime;
use App\Models\User;
use App\Models\UserAnimeList;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use SimpleXMLElement;

class MalImportService
{
    private static function cacheKey(int $userId, string $token): string
    {
        return "mal_import:{$userId}:{$token}";
    }

    private const STATUS_MAP = [
        'Watching' => UserAnimeList::STATUS_WATCHING,
        'Completed' => UserAnimeList::STATUS_COMPLETED,
        'On-Hold' => UserAnimeList::STATUS_ON_HOLD,
        'Dropped' => UserAnimeList::STATUS_DROPPED,
        'Plan to Watch' => UserAnimeList::STATUS_PLAN_TO_WATCH,
    ];

    public function parse(string $xmlPath, int $userId): array
    {
        $content = file_get_contents($xmlPath);

        if ($content === false || trim($content) === '') {
            throw new \InvalidArgumentException('The uploaded file could not be read or is empty.');
        }

        $content = preg_replace('/<!DOCTYPE[^>]*>/i', '', $content);
        $previousValue = libxml_use_internal_errors(true);

        try {
            $xml = new SimpleXMLElement($content, LIBXML_NOWARNING);
        } catch (\Exception $e) {
            libxml_clear_errors();
            libxml_use_internal_errors($previousValue);
            throw new \InvalidArgumentException(
                'The uploaded file is not valid MAL XML. Please export your list from MyAnimeList and try again.'
            );
        }

        libxml_use_internal_errors($previousValue);

        $entries = [];
        foreach ($xml->anime as $anime) {
            $malStatus = html_entity_decode((string) $anime->my_status);
            $status = self::STATUS_MAP[$malStatus] ?? UserAnimeList::STATUS_PLAN_TO_WATCH;

            $malScore = (int) $anime->my_score;
            $score = $malScore > 0 ? min($malScore * 10, 100) : 0;

            $startDate = (string) $anime->my_start_date;
            $finishDate = (string) $anime->my_finish_date;

            $entries[] = [
                'mal_id' => (int) $anime->series_animedb_id ?: null,
                'title' => html_entity_decode((string) $anime->series_title),
                'status' => $status,
                'score' => $score,
                'progress' => (int) $anime->my_watched_episodes,
                'started_at' => $startDate !== '0000-00-00' ? $startDate : null,
                'completed_at' => $finishDate !== '0000-00-00' ? $finishDate : null,
            ];
        }

        $token = Str::uuid()->toString();
        Cache::put(self::cacheKey($userId, $token), $entries, 1800);

        return [
            'token' => $token,
            'entries' => array_slice($entries, 0, 20),
            'total' => count($entries),
        ];
    }

    public function getPreview(int $userId, string $token): ?array
    {
        return Cache::get(self::cacheKey($userId, $token));
    }

    public function processEntries(User $user, string $token, bool $overwrite): array
    {
        $entries = $this->getPreview($user->id, $token);

        if ($entries === null) {
            throw new \RuntimeException('Import session expired. Please upload the file again.');
        }

        $malIds = array_filter(array_column($entries, 'mal_id'));
        $animeMap = Anime::whereIn('mal_id', $malIds)->pluck('id', 'mal_id');

        $existing = $user->animeList()
            ->whereIn('anime_id', $animeMap->values())
            ->pluck('anime_id')
            ->flip()
            ->toArray();

        $imported = 0;
        $skipped = 0;
        $errors = 0;

        foreach ($entries as $entry) {
            if (! $entry['mal_id'] || ! $animeMap->has($entry['mal_id'])) {
                $errors++;
                continue;
            }

            $animeId = $animeMap->get($entry['mal_id']);

            if (isset($existing[$animeId]) && ! $overwrite) {
                $skipped++;
                continue;
            }

            $data = [
                'user_id' => $user->id,
                'anime_id' => $animeId,
                'status' => $entry['status'],
                'score' => $entry['score'] > 0 ? $entry['score'] : null,
                'progress' => $entry['progress'],
                'started_at' => $entry['started_at'],
                'completed_at' => $entry['completed_at'],
            ];

            try {
                $listEntry = UserAnimeList::withTrashed()
                    ->updateOrCreate(
                        ['user_id' => $user->id, 'anime_id' => $animeId],
                        $data,
                    );

                if ($listEntry->trashed()) {
                    $listEntry->restore();
                }

                $imported++;
            } catch (\Illuminate\Database\QueryException $e) {
                $errors++;
            }
        }

        Cache::forget(self::cacheKey($user->id, $token));

        return [
            'imported' => $imported,
            'skipped' => $skipped,
            'errors' => $errors,
            'total' => count($entries),
        ];
    }
}
