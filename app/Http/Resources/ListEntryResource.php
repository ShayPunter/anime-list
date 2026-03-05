<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ListEntryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'anime_id' => $this->anime_id,
            'status' => $this->status,
            'score' => $this->score,
            'display_score' => $this->score !== null ? round($this->score / 10, 1) : null,
            'progress' => $this->progress,
            'rewatch_count' => $this->rewatch_count,
            'is_rewatching' => $this->is_rewatching,
            'started_at' => $this->started_at?->toDateString(),
            'completed_at' => $this->completed_at?->toDateString(),
            'notes' => $this->notes,
            'tags' => $this->tags ?? [],
            'is_private' => $this->is_private,
            'updated_at' => $this->updated_at->toISOString(),
            'anime' => $this->whenLoaded('anime', fn () => new AnimeCardResource($this->anime)),
        ];
    }
}
