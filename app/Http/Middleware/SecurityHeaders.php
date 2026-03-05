<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Vite;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        // Horizon serves its own assets; skip CSP for its routes
        if ($request->is('horizon*')) {
            return $next($request);
        }

        $nonce = base64_encode(random_bytes(16));
        app()->instance('csp-nonce', $nonce);
        Vite::useCspNonce($nonce);

        $response = $next($request);

        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

        $isLocal = app()->environment('local');

        $scriptSrc = $isLocal
            ? "script-src 'self' http://localhost:5173 'unsafe-inline' 'nonce-{$nonce}'; "
            : "script-src 'self' 'nonce-{$nonce}'; ";

        $connectSrc = $isLocal
            ? "connect-src 'self' ws://localhost:5173; "
            : "connect-src 'self'; ";

        $response->headers->set(
            'Content-Security-Policy',
            "default-src 'self'; "
            . $scriptSrc
            . "style-src 'self' 'unsafe-inline'; "
            . "img-src 'self' https://s4.anilist.co https://img.anilist.co https://img1.ak.crunchyroll.com data:; "
            . "font-src 'self'; "
            . $connectSrc
            . "worker-src 'self' blob:; "
            . "frame-src https://www.youtube.com https://www.dailymotion.com; "
            . "frame-ancestors 'none'"
        );

        return $response;
    }
}
