<?php

namespace App\Http\Controllers;

use App\Services\DiscoverService;
use App\Services\FeatureFlagService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DiscoverController extends Controller
{
    public function __construct(
        private readonly DiscoverService $service,
        private readonly FeatureFlagService $featureFlags,
    ) {
    }

    public function index(): Response
    {
        $this->ensureEnabled();

        $user = Auth::user();

        $props = [
            'moods' => $this->service->moods(),
            'trending' => $this->service->trendingTop10(),
            'hiddenGems' => $this->service->hiddenGems(),
            'lengths' => [
                ['value' => DiscoverService::LENGTH_SHORT, 'label' => 'Short (1–12 eps)'],
                ['value' => DiscoverService::LENGTH_STANDARD, 'label' => 'Standard (13–26 eps)'],
                ['value' => DiscoverService::LENGTH_LONG, 'label' => 'Long (27+ eps)'],
                ['value' => DiscoverService::LENGTH_MOVIE, 'label' => 'Movies'],
            ],
            'moreLikeIt' => $user ? $this->service->moreLikeIt($user) : null,
            'pickedForYou' => $user
                ? ['status' => 'coming_soon', 'message' => 'Your personal taste engine is warming up.']
                : null,
        ];

        return Inertia::render('DiscoverPage', $props);
    }

    public function mood(Request $request, string $slug): JsonResponse
    {
        $this->ensureEnabled();

        $length = $request->string('length')->toString() ?: null;
        if ($length && ! in_array($length, DiscoverService::LENGTHS, true)) {
            $length = null;
        }

        $results = $this->service->byMood($slug, $length);

        return response()->json([
            'slug' => $slug,
            'length' => $length,
            'data' => $results,
        ]);
    }

    private function ensureEnabled(): void
    {
        if (! $this->featureFlags->active('discover-page', Auth::user())) {
            abort(404);
        }
    }
}
