<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Genre extends Model
{
    protected $fillable = [
        'anilist_id',
        'name',
    ];

    public function anime(): BelongsToMany
    {
        return $this->belongsToMany(Anime::class, 'anime_genre');
    }
}
