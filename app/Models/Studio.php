<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Studio extends Model
{
    protected $fillable = [
        'anilist_id',
        'name',
        'slug',
        'is_animation_studio',
        'website_url',
    ];

    protected function casts(): array
    {
        return [
            'is_animation_studio' => 'boolean',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    protected static function booted(): void
    {
        static::saving(function (Studio $studio) {
            if (! $studio->slug || $studio->isDirty('name')) {
                $studio->slug = static::generateUniqueSlug($studio);
            }
        });
    }

    public static function generateUniqueSlug(Studio $studio): string
    {
        $base = Str::slug($studio->name) ?: 'studio';

        $slug = $base;
        $counter = 2;

        while (static::where('slug', $slug)->where('id', '!=', $studio->id ?? 0)->exists()) {
            $slug = "{$base}-{$counter}";
            $counter++;
        }

        return $slug;
    }

    public function anime(): BelongsToMany
    {
        return $this->belongsToMany(Anime::class, 'anime_studio')
            ->withPivot('is_main');
    }
}
