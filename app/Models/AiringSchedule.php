<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiringSchedule extends Model
{
    protected $fillable = [
        'anime_id',
        'anilist_airing_id',
        'episode',
        'airs_at',
        'time_until_airing',
    ];

    protected function casts(): array
    {
        return [
            'airs_at' => 'datetime',
        ];
    }

    public function anime(): BelongsTo
    {
        return $this->belongsTo(Anime::class);
    }

    public function scopeUpcoming(Builder $query): Builder
    {
        return $query->where('airs_at', '>', now())->orderBy('airs_at');
    }

    public function scopeToday(Builder $query): Builder
    {
        return $query->whereBetween('airs_at', [now()->startOfDay(), now()->endOfDay()]);
    }

    public function scopeThisWeek(Builder $query): Builder
    {
        return $query->whereBetween('airs_at', [now()->startOfWeek(), now()->endOfWeek()]);
    }
}
