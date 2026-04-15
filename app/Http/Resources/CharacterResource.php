<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CharacterResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name_full' => $this->name_full,
            'name_native' => $this->name_native,
            'image_large' => $this->image_large,
            'image_medium' => $this->image_medium,
            'gender' => $this->gender,
            'site_url' => $this->site_url,
            'role' => $this->pivot->role ?? null,
            'voice_actors' => $this->when(
                $this->relationLoaded('voiceActors'),
                fn () => $this->voiceActors->map(fn ($p) => [
                    'id' => $p->id,
                    'slug' => $p->slug,
                    'name_full' => $p->name_full,
                    'name_native' => $p->name_native,
                    'image_medium' => $p->image_medium,
                    'language' => $p->pivot->language ?? 'JAPANESE',
                ])->values(),
            ),
        ];
    }
}
