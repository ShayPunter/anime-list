<?php

namespace App\Http\Middleware;

use App\Services\FeatureFlagService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePublicApiEnabled
{
    public function __construct(
        private readonly FeatureFlagService $flags,
    ) {}

    /**
     * Short-circuit the request when the `public-api` feature flag is off for
     * the authenticated user. Resolution goes through FeatureFlagService so
     * the admin panel's "Everyone" global toggle is honoured.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $this->flags->active('public-api', $request->user())) {
            return response()->json([
                'message' => 'The public API is not enabled for this account.',
            ], 403);
        }

        return $next($request);
    }
}
