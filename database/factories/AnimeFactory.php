<?php

namespace Database\Factories;

use App\Models\Anime;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Anime>
 */
class AnimeFactory extends Factory
{
    protected $model = Anime::class;

    public function definition(): array
    {
        $title = fake()->unique()->words(3, true);

        return [
            'anilist_id' => fake()->unique()->numberBetween(1, 1_000_000),
            'mal_id' => fake()->unique()->numberBetween(1, 1_000_000),
            'title_romaji' => $title,
            'title_english' => $title,
            'title_native' => fake()->words(3, true),
            'title_synonyms' => [],
            'format' => fake()->randomElement(['TV', 'MOVIE', 'OVA', 'ONA', 'SPECIAL']),
            'status' => fake()->randomElement(['FINISHED', 'RELEASING', 'NOT_YET_RELEASED']),
            'season' => fake()->randomElement(['WINTER', 'SPRING', 'SUMMER', 'FALL']),
            'season_year' => fake()->numberBetween(1990, 2026),
            'source' => 'MANGA',
            'episodes' => fake()->numberBetween(1, 24),
            'duration' => 24,
            'episode_count_unknown' => false,
            'aired_from' => fake()->dateTimeBetween('-10 years', '-1 year'),
            'aired_to' => fake()->dateTimeBetween('-1 year', 'now'),
            'synopsis' => fake()->paragraph(),
            'cover_image_large' => 'https://example.com/cover_large.jpg',
            'cover_image_medium' => 'https://example.com/cover_medium.jpg',
            'cover_image_color' => '#abcdef',
            'banner_image' => 'https://example.com/banner.jpg',
            'trailer_url' => null,
            'average_score' => fake()->numberBetween(50, 95),
            'mean_score' => fake()->numberBetween(50, 95),
            'bayesian_score' => fake()->numberBetween(50, 95),
            'popularity' => fake()->numberBetween(0, 500_000),
            'trending' => fake()->numberBetween(0, 1000),
            'favourites' => fake()->numberBetween(0, 50_000),
            'is_adult' => false,
            'anilist_updated_at' => now(),
            'synced_at' => now(),
        ];
    }

    public function releasing(): static
    {
        return $this->state(fn () => ['status' => 'RELEASING']);
    }

    public function finished(): static
    {
        return $this->state(fn () => ['status' => 'FINISHED']);
    }

    public function adult(): static
    {
        return $this->state(fn () => ['is_adult' => true]);
    }
}
