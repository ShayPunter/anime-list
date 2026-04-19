<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserAnimeRecommendation extends Model
{
    protected $fillable = [
        'user_id',
        'anime_id',
        'score',
        'strategy',
        'rank',
        'computed_at',
    ];

    protected function casts(): array
    {
        return [
            'score' => 'float',
            'rank' => 'integer',
            'computed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function anime(): BelongsTo
    {
        return $this->belongsTo(Anime::class);
    }
}
