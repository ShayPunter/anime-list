<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlaylistItem extends Model
{
    protected $fillable = [
        'playlist_id',
        'anime_id',
        'position',
        'note',
        'is_optional',
    ];

    protected function casts(): array
    {
        return [
            'is_optional' => 'boolean',
        ];
    }

    public function playlist(): BelongsTo
    {
        return $this->belongsTo(Playlist::class);
    }

    public function anime(): BelongsTo
    {
        return $this->belongsTo(Anime::class);
    }
}
