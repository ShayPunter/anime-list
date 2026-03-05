<?php

namespace App\Exceptions;

use RuntimeException;

class AniListApiException extends RuntimeException
{
    public function __construct(
        public readonly int $statusCode,
        public readonly array $errors = [],
        string $message = '',
    ) {
        parent::__construct($message ?: "AniList API error (HTTP {$statusCode})");
    }
}
