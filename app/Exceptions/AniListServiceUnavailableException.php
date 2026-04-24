<?php

namespace App\Exceptions;

/**
 * Thrown when the AniList API has explicitly rejected our requests because the
 * service is temporarily unavailable (e.g. a 403 "API has been temporarily
 * disabled" response, or an extended 5xx outage). Callers should back off for
 * {@see self::$retryAfter} seconds before retrying.
 */
class AniListServiceUnavailableException extends AniListApiException
{
    public function __construct(
        int $statusCode,
        public readonly int $retryAfter,
        array $errors = [],
        string $message = '',
    ) {
        parent::__construct(
            statusCode: $statusCode,
            errors: $errors,
            message: $message ?: "AniList API is temporarily unavailable (HTTP {$statusCode}). Retry after {$retryAfter}s.",
        );
    }
}
