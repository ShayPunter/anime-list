<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\FeatureFlagService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Pennant\Feature;

class AdminFeatureFlagController extends Controller
{
    public function __construct(private readonly FeatureFlagService $featureFlags) {}

    public function index(): Response
    {
        $definedFeatures = Feature::defined();

        $features = [];
        foreach ($definedFeatures as $feature) {
            $userOverrides = DB::table('features')
                ->where('name', $feature)
                ->whereNotNull('scope')
                ->get()
                ->map(function ($row) {
                    $userId = (int) last(explode('|', $row->scope));
                    $user = User::find($userId);

                    return $user ? [
                        'user_id' => $user->id,
                        'username' => $user->username,
                        'name' => $user->name,
                        'active' => $row->value === 'true',
                    ] : null;
                })
                ->filter()
                ->values()
                ->all();

            $globalOverride = DB::table('features')
                ->where('name', $feature)
                ->whereNull('scope')
                ->first();

            $status = 'default';
            if ($globalOverride) {
                $status = $globalOverride->value === 'true' ? 'everyone' : 'nobody';
            } elseif (! empty($userOverrides)) {
                $status = 'specific';
            }

            $features[] = [
                'name' => $feature,
                'status' => $status,
                'users' => $userOverrides,
            ];
        }

        return Inertia::render('Admin/FeatureFlagsPage', [
            'features' => $features,
        ]);
    }

    public function update(Request $request, string $feature): JsonResponse
    {
        $request->validate([
            'status' => ['required', 'string', 'in:everyone,nobody,default'],
        ]);

        $this->featureFlags->setGlobalStatus($feature, $request->input('status'));

        return response()->json(['success' => true]);
    }

    public function activateForUser(Request $request, string $feature): JsonResponse
    {
        $request->validate([
            'username' => ['required', 'string', 'exists:users,username'],
        ]);

        $user = User::where('username', $request->input('username'))->firstOrFail();
        $this->featureFlags->activateForUser($feature, $user);

        return response()->json([
            'user_id' => $user->id,
            'username' => $user->username,
            'name' => $user->name,
            'active' => true,
        ]);
    }

    public function deactivateForUser(Request $request, string $feature, User $user): JsonResponse
    {
        $this->featureFlags->forgetForUser($feature, $user);

        return response()->json(['success' => true]);
    }
}
