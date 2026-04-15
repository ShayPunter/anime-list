<?php

/*
|--------------------------------------------------------------------------
| Cross-Origin Resource Sharing (CORS) Configuration
|--------------------------------------------------------------------------
|
| This scope is limited to the public API (/api/*). The session-based SPA
| served by this app is same-origin and does not rely on CORS.
|
| Allowed origins cover:
|   - The official web app and any configured frontend URL.
|   - Any `chrome-extension://<id>` origin, since Chrome generates a new
|     extension ID per-install and per-developer until the extension is
|     published to the Web Store with a stable key. Bearer-token auth on
|     every request is our actual security boundary.
|
*/

return [
    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_values(array_filter([
        env('APP_URL'),
        env('FRONTEND_URL'),
    ])),

    'allowed_origins_patterns' => [
        '#^chrome-extension://[a-z]{32}$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 60 * 60 * 24,

    'supports_credentials' => false,
];
