<?php

namespace App\Http\Requests;

use App\Models\UserAnimeList;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreListEntryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'anime_id' => [
                'required',
                'integer',
                'exists:anime,id',
                Rule::unique('user_anime_lists')
                    ->where('user_id', $this->user()->id)
                    ->whereNull('deleted_at'),
            ],
            'status' => ['required', 'string', Rule::in(UserAnimeList::STATUSES)],
            'score' => ['nullable', 'integer', 'min:0', 'max:100'],
            'progress' => ['nullable', 'integer', 'min:0'],
            'started_at' => ['nullable', 'date'],
            'completed_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'is_private' => ['boolean'],
        ];
    }
}
