<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AiringScheduleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'episode' => $this->episode,
            'airs_at' => $this->airs_at->toIso8601String(),
            // time_until_airing computed client-side from airs_at to avoid cache staleness
        ];
    }
}
