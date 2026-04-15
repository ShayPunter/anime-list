<?php

namespace Database\Factories;

use App\Models\Anime;
use App\Models\Playlist;
use App\Models\PlaylistItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PlaylistItem>
 */
class PlaylistItemFactory extends Factory
{
    protected $model = PlaylistItem::class;

    public function definition(): array
    {
        return [
            'playlist_id' => Playlist::factory(),
            'anime_id' => Anime::factory(),
            'position' => 1,
            'note' => null,
            'is_optional' => false,
        ];
    }
}
