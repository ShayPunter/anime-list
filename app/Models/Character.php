<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Character extends Model
{
    protected $fillable = [
        'anilist_id',
        'name_full',
        'name_native',
        'image_large',
        'image_medium',
        'description',
        'gender',
        'site_url',
    ];

    public function anime(): BelongsToMany
    {
        return $this->belongsToMany(Anime::class, 'anime_character')
            ->withPivot('role');
    }

    public function voiceActorEntries(): HasMany
    {
        return $this->hasMany(CharacterVoiceActor::class);
    }

    public function voiceActors(): BelongsToMany
    {
        return $this->belongsToMany(Person::class, 'character_voice_actor')
            ->withPivot('anime_id', 'language');
    }
}
