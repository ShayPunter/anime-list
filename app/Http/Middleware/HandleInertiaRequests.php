<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function title(string $title): string
    {
        return $title ? "{$title} — AniTrack" : 'AniTrack';
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'username' => $request->user()->username,
                    'email' => $request->user()->email,
                    'avatar_url' => $request->user()->avatar_url,
                    'bio' => $request->user()->bio,
                    'timezone' => $request->user()->timezone,
                    'is_admin' => (bool) $request->user()->is_admin,
                    'list_is_public' => (bool) $request->user()->list_is_public,
                ] : null,
            ],
            'flash' => [
                'message' => $request->session()->get('message'),
                'status' => $request->session()->get('status'),
            ],
        ];
    }
}
