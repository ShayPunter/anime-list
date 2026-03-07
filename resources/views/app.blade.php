<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title inertia>{{ config('app.name', 'AniTrack') }}</title>
        <script type="application/ld+json" nonce="{{ app('csp-nonce') }}">{!! json_encode(['@context' => 'https://schema.org', '@type' => 'WebSite', 'name' => 'AniTrack', 'url' => config('app.url')], JSON_UNESCAPED_SLASHES) !!}</script>
        @routes(nonce: app('csp-nonce'))
        @vite(['resources/js/app.ts'])
        @inertiaHead
    </head>
    <body class="antialiased bg-gray-950 text-gray-100">
        @inertia
    </body>
</html>
