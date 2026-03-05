<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Recommendation extends Model
{
    protected $fillable = [
        'anime_id',
        'recommended_anime_id',
        'source',
        'anilist_recommendation_id',
        'rating',
    ];

    public function anime(): BelongsTo
    {
        return $this->belongsTo(Anime::class);
    }

    public function recommendedAnime(): BelongsTo
    {
        return $this->belongsTo(Anime::class, 'recommended_anime_id');
    }

    public function votes(): HasMany
    {
        return $this->hasMany(RecommendationVote::class);
    }
}
