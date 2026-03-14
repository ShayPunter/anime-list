<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlaylistCardResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $coverImages = $this->items
            ->take(3)
            ->map(fn ($item) => $item->anime?->cover_image_medium)
            ->filter()
            ->values()
            ->all();

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'is_public' => $this->is_public,
            'item_count' => $this->items_count ?? $this->items->count(),
            'cover_images' => $coverImages,
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
