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
        static $anilistId = 1_000_000;

        return [
            'anilist_id' => ++$anilistId,
            'title_romaji' => fake()->unique()->sentence(3, false),
            'title_english' => fake()->optional()->sentence(3, false),
            'format' => 'TV',
            'status' => 'FINISHED',
            'episodes' => fake()->numberBetween(1, 50),
            'average_score' => fake()->numberBetween(50, 95),
            'popularity' => fake()->numberBetween(0, 100000),
            'is_adult' => false,
        ];
    }

    public function adult(): static
    {
        return $this->state(fn () => ['is_adult' => true]);
    }
}
