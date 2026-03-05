<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Studio extends Model
{
    protected $fillable = [
        'anilist_id',
        'name',
        'is_animation_studio',
        'website_url',
    ];

    protected function casts(): array
    {
        return [
            'is_animation_studio' => 'boolean',
        ];
    }

    public function anime(): BelongsToMany
    {
        return $this->belongsToMany(Anime::class, 'anime_studio')
            ->withPivot('is_main');
    }
}
