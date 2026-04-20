<?php

namespace App\Services\Recommendations;

use App\Models\User;
use App\Models\UserAnimeList;
use Illuminate\Support\Facades\Cache;

class TasteProfileService
{
    public const CACHE_TTL_SECONDS = 6 * 3600;

    /**
     * Score → weight mapping for completed/watching entries (0-10 user score scale).
     * Dropped and on-hold contribute a negative signal.
     */
    private const SCORE_WEIGHTS = [
        9 => 3.0,
        7 => 1.0,
        5 => 0.0,
    ];

    public function for(User $user): TasteProfile
    {
        return Cache::remember(
            $this->cacheKey($user),
            self::CACHE_TTL_SECONDS,
            fn () => $this->build($user),
        );
    }

    public function forget(User $user): void
    {
        Cache::forget($this->cacheKey($user));
    }

    public function build(User $user): TasteProfile
    {
        $entries = UserAnimeList::query()
            ->where('user_id', $user->id)
            ->with(['anime.genres', 'anime.studios'])
            ->get();

        $genreAffinity = [];
        $studioAffinity = [];
        $seen = [];
        $anchors = [];
        $planToWatchGenres = [];
        $ratedCount = 0;

        foreach ($entries as $entry) {
            $anime = $entry->anime;
            if (! $anime) {
                continue;
            }

            $seen[] = $anime->id;

            $weight = $this->weightFor($entry);

            if ($entry->status === UserAnimeList::STATUS_PLAN_TO_WATCH) {
                foreach ($anime->genres as $genre) {
                    $planToWatchGenres[$genre->name] = true;
                }

                continue;
            }

            if ($weight === 0.0) {
                continue;
            }

            if ($entry->score >= 8 && $entry->status === UserAnimeList::STATUS_COMPLETED) {
                $anchors[] = ['id' => $anime->id, 'score' => (int) $entry->score];
            }

            if ($entry->score > 0) {
                $ratedCount++;
            }

            foreach ($anime->genres as $genre) {
                $genreAffinity[$genre->name] = ($genreAffinity[$genre->name] ?? 0.0) + $weight;
            }

            foreach ($anime->studios as $studio) {
                $studioAffinity[$studio->name] = ($studioAffinity[$studio->name] ?? 0.0) + $weight;
            }
        }

        // Keep top 5 anchors — item-item seeds.
        usort($anchors, fn ($a, $b) => $b['score'] <=> $a['score']);
        $anchorIds = array_column(array_slice($anchors, 0, 5), 'id');

        return new TasteProfile(
            genreAffinity: $this->normalize($genreAffinity),
            studioAffinity: $this->normalize($studioAffinity),
            seenAnimeIds: array_values(array_unique($seen)),
            anchorAnimeIds: $anchorIds,
            planToWatchGenres: array_keys($planToWatchGenres),
            ratedCount: $ratedCount,
        );
    }

    private function weightFor(UserAnimeList $entry): float
    {
        switch ($entry->status) {
            case UserAnimeList::STATUS_DROPPED:
                return -2.0;
            case UserAnimeList::STATUS_ON_HOLD:
                return -0.5;
            case UserAnimeList::STATUS_COMPLETED:
            case UserAnimeList::STATUS_WATCHING:
                return $this->weightForScore($entry->score);
            default:
                return 0.0;
        }
    }

    private function weightForScore(?int $score): float
    {
        if ($score === null || $score === 0) {
            // Unscored completions still count as mild positive signal.
            return 0.25;
        }

        foreach (self::SCORE_WEIGHTS as $threshold => $weight) {
            if ($score >= $threshold) {
                return $weight;
            }
        }

        return 0.0;
    }

    /**
     * L2-normalize so dot products stay comparable across users.
     *
     * @param  array<string, float>  $vector
     * @return array<string, float>
     */
    private function normalize(array $vector): array
    {
        if (empty($vector)) {
            return [];
        }

        $magnitude = sqrt(array_sum(array_map(fn ($v) => $v * $v, $vector)));
        if ($magnitude <= 0.0) {
            return $vector;
        }

        return array_map(fn ($v) => $v / $magnitude, $vector);
    }

    private function cacheKey(User $user): string
    {
        return "taste:profile:{$user->id}";
    }
}
