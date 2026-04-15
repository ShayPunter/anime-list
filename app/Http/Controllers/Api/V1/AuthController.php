<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\IssueTokenRequest;
use App\Models\User;
use App\Services\FeatureFlagService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(
        private readonly FeatureFlagService $flags,
    ) {}

    /**
     * Exchange credentials for a Sanctum personal access token.
     *
     * Used by the Chrome extension's sign-in flow and by third-party
     * developers issuing a token for their own account.
     */
    public function issueToken(IssueTokenRequest $request): JsonResponse
    {
        $user = User::where('email', $request->string('email'))->first();

        if (! $user || ! Hash::check($request->string('password'), $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (! $this->flags->active('public-api', $user)) {
            return response()->json([
                'message' => 'The public API is not enabled for this account.',
            ], 403);
        }

        $token = $user->createToken($request->string('device_name')->toString());

        return response()->json([
            'token' => $token->plainTextToken,
            'token_id' => $token->accessToken->id,
            'device_name' => $token->accessToken->name,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
            ],
        ], 201);
    }

    /**
     * List the authenticated user's active API tokens.
     */
    public function listTokens(Request $request): JsonResponse
    {
        $tokens = $request->user()->tokens()
            ->orderByDesc('last_used_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($token) => [
                'id' => $token->id,
                'device_name' => $token->name,
                'last_used_at' => $token->last_used_at?->toISOString(),
                'created_at' => $token->created_at->toISOString(),
            ]);

        return response()->json(['data' => $tokens]);
    }

    /**
     * Revoke the token used to authenticate the current request.
     */
    public function revokeCurrentToken(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(null, 204);
    }

    /**
     * Revoke a specific token owned by the authenticated user.
     */
    public function revokeToken(Request $request, int $tokenId): JsonResponse
    {
        $deleted = $request->user()->tokens()->whereKey($tokenId)->delete();

        if ($deleted === 0) {
            return response()->json(['message' => 'Token not found.'], 404);
        }

        return response()->json(null, 204);
    }
}
