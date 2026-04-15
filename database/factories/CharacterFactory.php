<?php

namespace Database\Factories;

use App\Models\Character;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Character>
 */
class CharacterFactory extends Factory
{
    protected $model = Character::class;

    public function definition(): array
    {
        return [
            'anilist_id' => fake()->unique()->numberBetween(1, 1_000_000),
            'name_full' => fake()->name(),
            'name_native' => null,
            'image_large' => 'https://example.com/char_large.jpg',
            'image_medium' => 'https://example.com/char_medium.jpg',
            'description' => fake()->paragraph(),
            'gender' => fake()->randomElement(['Male', 'Female', null]),
            'site_url' => fake()->url(),
        ];
    }
}
