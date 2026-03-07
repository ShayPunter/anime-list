<?php

namespace App\Http\Resources;

use App\Models\Anime;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnimeCardResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'anilist_id' => $this->anilist_id,
            'title_romaji' => $this->title_romaji,
            'title_english' => $this->title_english,
            'format' => $this->format,
            'status' => $this->status,
            'season' => $this->season,
            'season_year' => $this->season_year,
            'episodes' => $this->episodes,
            'cover_image_large' => $this->cover_image_large,
            'cover_image_medium' => $this->cover_image_medium,
            'cover_image_color' => $this->cover_image_color,
            'average_score' => Anime::normalizeScore($this->average_score),
            'bayesian_score' => Anime::normalizeScore($this->bayesian_score),
            'popularity' => $this->popularity,
            'genres' => GenreResource::collection($this->whenLoaded('genres')),
            'next_airing_episode' => $this->whenLoaded('nextAiringEpisode', function () {
                return $this->nextAiringEpisode
                    ? new AiringScheduleResource($this->nextAiringEpisode)
                    : null;
            }),
        ];
    }
}
