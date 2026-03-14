<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlaylistItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'position' => $this->position,
            'note' => $this->note,
            'is_optional' => $this->is_optional,
            'anime' => $this->whenLoaded('anime', fn () => new AnimeCardResource($this->anime)),
        ];
    }
}
