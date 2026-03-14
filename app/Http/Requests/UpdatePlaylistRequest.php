<?php

namespace App\Http\Requests;

use App\Models\Playlist;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePlaylistRequest extends FormRequest
{
    public function authorize(): bool
    {
        $playlist = $this->route('playlist');

        return $playlist instanceof Playlist && $this->user()?->id === $playlist->user_id;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'is_public' => ['sometimes', 'boolean'],
        ];
    }
}
