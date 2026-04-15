<?php

namespace Database\Factories;

use App\Models\Studio;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Studio>
 */
class StudioFactory extends Factory
{
    protected $model = Studio::class;

    public function definition(): array
    {
        return [
            'anilist_id' => fake()->unique()->numberBetween(1, 100_000),
            'name' => fake()->unique()->company(),
            'is_animation_studio' => true,
            'website_url' => fake()->url(),
        ];
    }

    public function producer(): static
    {
        return $this->state(fn () => ['is_animation_studio' => false]);
    }
}
