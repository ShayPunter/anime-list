<?php

namespace App\Services;

use App\Models\Anime;
use Illuminate\Support\Collection;

/**
 * Decides which anime the stale-refresh sweep should stop fetching.
 *
 * The catalogue is overwhelmingly made up of shows that finished airing years
 * ago and will never change on AniList again. Re-fetching all of them on every
 * sweep burns the API rate limit without producing new data, so once such a
 * row has been refreshed it is flagged out of future sweeps. Genuine upstream
 * edits are still picked up by the monthly FINISHED incremental sync, which
 * queries AniList by updatedAt rather than walking our own table.
 */
class AnimeRefreshPolicy
{
    public const REASON_FINISHED = 'finished';

    public const REASON_MISSING_UPSTREAM = 'missing_upstream';

    public const REASON_MANUAL = 'manual';

    /**
     * Why this anime should be skipped from now on, or null to keep refreshing it.
     */
    public function exclusionReasonFor(Anime $anime): ?string
    {
        if (! in_array($anime->status, ['FINISHED', 'CANCELLED'], true)) {
            return null;
        }

        $days = (int) config('anilist.refresh.exclude_finished_after_days', 180);
        $cutoff = now()->subDays($days);

        if ($anime->aired_to !== null) {
            return $anime->aired_to->lt($cutoff) ? self::REASON_FINISHED : null;
        }

        // No end date recorded — fall back to the season it aired in, treating
        // the season as ending at the close of its year.
        if ($anime->season_year !== null) {
            return $anime->season_year < $cutoff->year ? self::REASON_FINISHED : null;
        }

        // Nothing to date it by; keep it in the sweep rather than guessing.
        return null;
    }

    /**
     * Flag every anime in the collection that has settled, and return how many
     * were newly excluded.
     *
     * @param  Collection<int, Anime>  $anime
     */
    public function applyTo(Collection $anime): int
    {
        $excluded = [];

        foreach ($anime as $item) {
            if ($item->refresh_excluded_at !== null) {
                continue;
            }

            $reason = $this->exclusionReasonFor($item);
            if ($reason !== null) {
                $excluded[$reason][] = $item->id;
            }
        }

        $count = 0;
        foreach ($excluded as $reason => $ids) {
            $count += $this->exclude($ids, $reason);
        }

        return $count;
    }

    /**
     * @param  array<int, int>  $animeIds
     */
    public function exclude(array $animeIds, string $reason): int
    {
        if (empty($animeIds)) {
            return 0;
        }

        return Anime::whereIn('id', $animeIds)
            ->whereNull('refresh_excluded_at')
            ->update([
                'refresh_excluded_at' => now(),
                'refresh_exclusion_reason' => $reason,
                'updated_at' => now(),
            ]);
    }

    /**
     * Put anime back into the sweep.
     *
     * @param  array<int, int>  $animeIds
     */
    public function include(array $animeIds): int
    {
        if (empty($animeIds)) {
            return 0;
        }

        return Anime::whereIn('id', $animeIds)
            ->update([
                'refresh_excluded_at' => null,
                'refresh_exclusion_reason' => null,
                'updated_at' => now(),
            ]);
    }
}
