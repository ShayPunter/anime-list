<?php

namespace Tests\Unit\DTOs;

use App\DTOs\EpisodeData;
use PHPUnit\Framework\TestCase;

class EpisodeDataTest extends TestCase
{
    public function test_merge_uses_schedule_for_number_and_air_date(): void
    {
        $episodes = EpisodeData::mergeFromAniList(
            streaming: [],
            schedule: [
                ['id' => 100, 'episode' => 1, 'airingAt' => 1_700_000_000],
                ['id' => 101, 'episode' => 2, 'airingAt' => 1_700_600_000],
            ],
            totalEpisodes: null,
            defaultDuration: 24,
        );

        $this->assertCount(2, $episodes);
        $this->assertSame(1, $episodes[0]->number);
        $this->assertSame(2, $episodes[1]->number);
        $this->assertSame(24, $episodes[0]->runtime_minutes);
    }

    public function test_merge_skips_out_of_range_episode_numbers_from_schedule(): void
    {
        // Episode numbers beyond the supported range previously overflowed the
        // DB column and failed the entire sync batch — they must be dropped.
        $episodes = EpisodeData::mergeFromAniList(
            streaming: [],
            schedule: [
                ['id' => 1, 'episode' => 1, 'airingAt' => 1_700_000_000],
                ['id' => 2, 'episode' => 70000, 'airingAt' => 1_700_600_000],
                ['id' => 3, 'episode' => 0, 'airingAt' => 1_700_700_000],
                ['id' => 4, 'episode' => -5, 'airingAt' => 1_700_800_000],
            ],
            totalEpisodes: null,
            defaultDuration: null,
        );

        $numbers = array_map(fn (EpisodeData $e) => $e->number, $episodes);
        $this->assertSame([1], $numbers);
    }

    public function test_merge_skips_out_of_range_numbers_parsed_from_streaming_titles(): void
    {
        $episodes = EpisodeData::mergeFromAniList(
            streaming: [
                ['title' => 'Episode 999999 - Bogus', 'thumbnail' => null, 'url' => null, 'site' => null],
            ],
            schedule: [],
            totalEpisodes: null,
            defaultDuration: null,
        );

        $this->assertCount(0, $episodes);
    }

    public function test_merge_caps_gap_fill_at_max_episode_number(): void
    {
        // A bogus Media.episodes count must not explode the generated row set.
        $episodes = EpisodeData::mergeFromAniList(
            streaming: [],
            schedule: [],
            totalEpisodes: 5_000_000,
            defaultDuration: null,
        );

        $this->assertCount(50000, $episodes);
        $this->assertSame(1, $episodes[0]->number);
        $this->assertSame(50000, $episodes[count($episodes) - 1]->number);
    }
}
