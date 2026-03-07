<?php

namespace App\Http\Resources;

use App\Models\Anime;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Log;

class ScheduleDayResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        if (! $this->anime) {
            Log::warning("AiringSchedule #{$this->id} references missing anime_id {$this->anime_id}");

            return [
                'id' => $this->id,
                'episode' => $this->episode,
                'airs_at' => $this->airs_at->toIso8601String(),
                'anime' => null,
            ];
        }

        return [
            'id' => $this->id,
            'episode' => $this->episode,
            'airs_at' => $this->airs_at->toIso8601String(),
            'anime' => [
                'id' => $this->anime->id,
                'slug' => $this->anime->slug,
                'title_romaji' => $this->anime->title_romaji,
                'title_english' => $this->anime->title_english,
                'cover_image_medium' => $this->anime->cover_image_medium,
                'cover_image_color' => $this->anime->cover_image_color,
                'average_score' => Anime::normalizeScore($this->anime->average_score),
                'format' => $this->anime->format,
                'episodes' => $this->anime->episodes,
                'genres' => GenreResource::collection($this->anime->genres),
            ],
        ];
    }
}
