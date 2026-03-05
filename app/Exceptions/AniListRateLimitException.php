<?php

namespace App\Exceptions;

use RuntimeException;

class AniListRateLimitException extends RuntimeException
{
    public function __construct(
        public readonly int $retryAfter,
        string $message = '',
    ) {
        parent::__construct($message ?: "AniList rate limit exceeded. Retry after {$retryAfter}s.");
    }
}
