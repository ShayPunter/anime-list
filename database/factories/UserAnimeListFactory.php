<?php

namespace Database\Factories;

use App\Models\Anime;
use App\Models\User;
use App\Models\UserAnimeList;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UserAnimeList>
 */
class UserAnimeListFactory extends Factory
{
    protected $model = UserAnimeList::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'anime_id' => Anime::factory(),
            'status' => UserAnimeList::STATUS_PLAN_TO_WATCH,
            'score' => 0,
            'progress' => 0,
            'rewatch_count' => 0,
            'started_at' => null,
            'completed_at' => null,
            'notes' => null,
            'tags' => null,
            'is_private' => false,
            'is_rewatching' => false,
        ];
    }

    public function watching(): static
    {
        return $this->state(fn () => [
            'status' => UserAnimeList::STATUS_WATCHING,
            'started_at' => now()->subMonth(),
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn () => [
            'status' => UserAnimeList::STATUS_COMPLETED,
            'completed_at' => now(),
        ]);
    }

    public function private(): static
    {
        return $this->state(fn () => ['is_private' => true]);
    }
}
