<?php

namespace App\Http\Resources;

use App\Models\Anime;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnimeRelationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $related = $this->relatedAnime;

        return [
            'id' => $this->id,
            'relation_type' => $this->relation_type,
            'related_anime' => $related ? [
                'id' => $related->id,
                'title_romaji' => $related->title_romaji,
                'title_english' => $related->title_english,
                'format' => $related->format,
                'status' => $related->status,
                'cover_image_medium' => $related->cover_image_medium,
                'cover_image_color' => $related->cover_image_color,
                'average_score' => Anime::normalizeScore($related->average_score),
                'genres' => $related->relationLoaded('genres')
                    ? GenreResource::collection($related->genres)
                    : [],
            ] : null,
        ];
    }
}
