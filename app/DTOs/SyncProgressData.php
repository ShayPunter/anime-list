<?php

namespace App\DTOs;

use Spatie\LaravelData\Data;

class SyncProgressData extends Data
{
    public function __construct(
        public readonly string $type,
        public readonly int $current_page,
        public readonly int $last_page,
        public readonly int $total_items,
        public readonly int $processed_items,
        public readonly ?string $started_at,
        public readonly string $status,
    ) {}
}
