<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudioResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'is_animation_studio' => $this->is_animation_studio,
            'is_main' => (bool) ($this->pivot->is_main ?? false),
        ];
    }
}
