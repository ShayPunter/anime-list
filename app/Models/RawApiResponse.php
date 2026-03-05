<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RawApiResponse extends Model
{
    protected $fillable = [
        'source',
        'endpoint',
        'external_id',
        'response_body',
        'fetched_at',
        'is_processed',
        'processed_at',
    ];

    protected function casts(): array
    {
        return [
            'fetched_at' => 'datetime',
            'is_processed' => 'boolean',
            'processed_at' => 'datetime',
        ];
    }
}
