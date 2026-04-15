<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Pennant\Feature;
use Symfony\Component\HttpFoundation\Response;

class EnsurePublicApiEnabled
{
    /**
     * Short-circuit the request when the `public-api` feature flag is off
     * for the authenticated user (or globally, when unauthenticated).
     */
    public function handle(Request $request, Closure $next): Response
    {
        $active = $request->user() !== null
            ? Feature::for($request->user())->active('public-api')
            : Feature::active('public-api');

        if (! $active) {
            return response()->json([
                'message' => 'The public API is not enabled for this account.',
            ], 403);
        }

        return $next($request);
    }
}
