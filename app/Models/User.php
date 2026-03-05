<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar_url',
        'bio',
        'timezone',
        'mal_id',
        'mal_username',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'mal_access_token',
        'mal_refresh_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'mal_token_expires_at' => 'datetime',
        ];
    }

    public function animeList(): HasMany
    {
        return $this->hasMany(UserAnimeList::class);
    }

    public function recommendationVotes(): HasMany
    {
        return $this->hasMany(RecommendationVote::class);
    }
}
