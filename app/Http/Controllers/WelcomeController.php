<?php

namespace App\Http\Controllers;

use App\Services\FeatureFlagService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    public function __construct(
        private readonly FeatureFlagService $featureFlags,
    ) {}

    public function __invoke(): Response
    {
        if (! $this->featureFlags->active('landing-page', Auth::user())) {
            abort(404);
        }

        return Inertia::render('WelcomePage');
    }
}
