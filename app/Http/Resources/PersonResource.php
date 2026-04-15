<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PersonResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name_full' => $this->name_full,
            'name_native' => $this->name_native,
            'image_large' => $this->image_large,
            'image_medium' => $this->image_medium,
            'gender' => $this->gender,
            'birthdate' => $this->birthdate?->toDateString(),
            'site_url' => $this->site_url,
        ];
    }
}
