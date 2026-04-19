<?php

namespace App\Http\Resources;

use App\Models\Episode;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Episode
 */
class EpisodeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $status = 'unknown';
        if ($this->air_date !== null) {
            $status = $this->air_date->isPast() ? 'aired' : 'upcoming';
        }

        return [
            'id' => $this->id,
            'number' => $this->number,
            'title' => $this->title,
            'thumbnail_url' => $this->thumbnail_url,
            'air_date' => $this->air_date?->toIso8601String(),
            'runtime_minutes' => $this->runtime_minutes,
            'score' => $this->score,
            'site_url' => $this->site_url,
            'source_site' => $this->source_site,
            'status' => $status,
        ];
    }
}
