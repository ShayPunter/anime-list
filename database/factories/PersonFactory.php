<?php

namespace Database\Factories;

use App\Models\Person;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Person>
 */
class PersonFactory extends Factory
{
    protected $model = Person::class;

    public function definition(): array
    {
        return [
            'anilist_id' => fake()->unique()->numberBetween(1, 1_000_000),
            'name_full' => fake()->unique()->name(),
            'name_native' => null,
            'image_large' => 'https://example.com/person_large.jpg',
            'image_medium' => 'https://example.com/person_medium.jpg',
            'gender' => fake()->randomElement(['Male', 'Female', null]),
            'birthdate' => fake()->optional()->date(),
            'site_url' => fake()->url(),
        ];
    }
}
