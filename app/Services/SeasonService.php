<?php

namespace App\Services;

class SeasonService
{
    private const SEASONS = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];

    private const FORMAT_ORDER = ['TV', 'TV_SHORT', 'MOVIE', 'OVA', 'ONA', 'SPECIAL', 'MUSIC'];

    public function currentSeason(): array
    {
        $month = (int) now()->format('n');
        $year = (int) now()->format('Y');

        $season = match (true) {
            $month <= 3 => 'WINTER',
            $month <= 6 => 'SPRING',
            $month <= 9 => 'SUMMER',
            default => 'FALL',
        };

        return ['year' => $year, 'season' => $season];
    }

    public function adjacentSeasons(int $year, string $season): array
    {
        $index = array_search($season, self::SEASONS, true);

        if ($index === false) {
            throw new \InvalidArgumentException("Invalid season '{$season}'. Must be one of: ".implode(', ', self::SEASONS));
        }

        // Previous
        $prevIndex = $index - 1;
        $prevYear = $year;
        if ($prevIndex < 0) {
            $prevIndex = 3;
            $prevYear--;
        }

        // Next
        $nextIndex = $index + 1;
        $nextYear = $year;
        if ($nextIndex > 3) {
            $nextIndex = 0;
            $nextYear++;
        }

        return [
            'previous' => ['year' => $prevYear, 'season' => self::SEASONS[$prevIndex]],
            'next' => ['year' => $nextYear, 'season' => self::SEASONS[$nextIndex]],
        ];
    }

    public function isCurrentSeason(int $year, string $season): bool
    {
        $current = $this->currentSeason();

        return $current['year'] === $year && $current['season'] === $season;
    }

    public function formatOrder(): array
    {
        return self::FORMAT_ORDER;
    }
}
