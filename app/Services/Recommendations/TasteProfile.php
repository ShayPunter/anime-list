<?php

namespace App\Services\Recommendations;

/**
 * Snapshot of a user's taste inferred from their list.
 *
 * - genreAffinity / studioAffinity: weighted signal per name (positive = liked, negative = disliked)
 * - seenAnimeIds: every anime the user has touched, used to exclude from ranking
 * - anchorAnimeIds: top highly-rated completed entries, used as seeds for item-item
 * - planToWatchGenres: cold-start fallback pool
 * - ratedCount: number of entries with a meaningful score
 */
readonly class TasteProfile
{
    public function __construct(
        /** @var array<string, float> */
        public array $genreAffinity,
        /** @var array<string, float> */
        public array $studioAffinity,
        /** @var list<int> */
        public array $seenAnimeIds,
        /** @var list<int> */
        public array $anchorAnimeIds,
        /** @var list<string> */
        public array $planToWatchGenres,
        public int $ratedCount,
    ) {}

    /**
     * A user with very little rated history needs the cold-start fallback.
     */
    public function isCold(): bool
    {
        return $this->ratedCount < 5;
    }

    public function hasAnyList(): bool
    {
        return count($this->seenAnimeIds) > 0;
    }
}
