<?php

return [
    'endpoint' => env('ANILIST_API_URL', 'https://graphql.anilist.co'),

    'rate_limit' => [
        'requests_per_minute' => (int) env('ANILIST_RATE_LIMIT', 85),
    ],

    'http' => [
        'connect_timeout' => 30,
        'timeout' => 60,
    ],

    'retry' => [
        'max_attempts' => 3,
        'backoff_base_seconds' => 5,
        'rate_limit_backoff_seconds' => 60,
        // Backoff for AniList service-unavailable responses (HTTP 403
        // "temporarily disabled" or sustained 5xx). Also doubles as the
        // circuit-breaker TTL so queued jobs stop hitting the endpoint.
        'service_unavailable_backoff_seconds' => 900,
    ],

    'sync' => [
        'per_page' => 50,
        'store_raw_responses' => (bool) env('ANILIST_STORE_RAW', true),
        'progress_cache_ttl' => 86400,
    ],
];
