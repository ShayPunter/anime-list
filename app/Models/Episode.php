<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Episode extends Model
{
    protected $fillable = [
        'anime_id',
        'number',
        'title',
        'description',
        'thumbnail_url',
        'air_date',
        'runtime_minutes',
        'score',
        'anilist_airing_id',
        'site_url',
        'source_site',
    ];

    protected function casts(): array
    {
        return [
            'air_date' => 'datetime',
        ];
    }

    public function anime(): BelongsTo
    {
        return $this->belongsTo(Anime::class);
    }

    public function scopeAired(Builder $query): Builder
    {
        return $query->whereNotNull('air_date')->where('air_date', '<=', now());
    }

    public function scopeUpcoming(Builder $query): Builder
    {
        return $query->whereNotNull('air_date')->where('air_date', '>', now());
    }

    public function scopeUnknown(Builder $query): Builder
    {
        return $query->whereNull('air_date');
    }
}
