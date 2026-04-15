<?php

namespace App\Http\Controllers;

use App\Services\FeatureFlagService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DevelopersController extends Controller
{
    public function index(Request $request, FeatureFlagService $flags): Response
    {
        // Gated by the `public-api` flag: visible when the flag is on globally
        // (admin-toggled for "everyone"), or when the authenticated viewer has
        // been granted access individually.
        abort_unless($flags->active('public-api', $request->user()), 404);

        return Inertia::render('DevelopersPage', [
            'apiBaseUrl' => url('/api/v1'),
        ]);
    }
}
