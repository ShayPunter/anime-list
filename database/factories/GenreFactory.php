<?php

namespace Database\Factories;

use App\Models\Genre;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Genre>
 */
class GenreFactory extends Factory
{
    protected $model = Genre::class;

    public function definition(): array
    {
        return [
            'anilist_id' => fake()->unique()->numberBetween(1, 10_000),
            'name' => fake()->unique()->word(),
        ];
    }
}
