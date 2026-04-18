<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laragear\WebAuthn\Contracts\WebAuthnAuthenticatable;
use Laragear\WebAuthn\WebAuthnAuthentication;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements WebAuthnAuthenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes, WebAuthnAuthentication;

    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'avatar_url',
        'bio',
        'timezone',
        'mal_id',
        'mal_username',
        'is_admin',
        'list_is_public',
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
            'is_admin' => 'boolean',
            'list_is_public' => 'boolean',
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

    public function playlists(): HasMany
    {
        return $this->hasMany(Playlist::class);
    }
}
