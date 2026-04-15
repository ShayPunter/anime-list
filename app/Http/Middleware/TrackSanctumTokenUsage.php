<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;
use Symfony\Component\HttpFoundation\Response;

class TrackSanctumTokenUsage
{
    /**
     * Record the IP and user agent of the caller on the Sanctum token used to
     * authenticate the current request. Drives the "where am I logged in from?"
     * view on the settings page.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $token = $request->user()?->currentAccessToken();

        // Skip if the token was revoked during the request (e.g. the caller
        // hit the revoke-token endpoint) — otherwise a save here would
        // re-insert the deleted row.
        if ($token instanceof PersonalAccessToken && $token->exists) {
            $token->forceFill([
                'last_used_ip' => $request->ip(),
                'last_used_user_agent' => mb_substr((string) $request->userAgent(), 0, 500),
            ])->saveQuietly();
        }

        return $response;
    }
}
