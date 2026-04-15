<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Return the profile of the authenticated API user.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'username' => $user->username,
            'email' => $user->email,
            'avatar_url' => $user->avatar_url,
            'bio' => $user->bio,
            'timezone' => $user->timezone,
            'list_is_public' => (bool) $user->list_is_public,
            'created_at' => $user->created_at->toISOString(),
        ]);
    }
}
