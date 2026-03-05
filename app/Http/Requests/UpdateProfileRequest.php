<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('users')->ignore($this->user()->id),
            ],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users')->ignore($this->user()->id),
            ],
            'bio' => ['nullable', 'string', 'max:1000'],
            'timezone' => ['required', 'string', Rule::in(timezone_identifiers_list())],
            'avatar_url' => ['nullable', 'url:https', 'max:2048'],
        ];
    }
}
