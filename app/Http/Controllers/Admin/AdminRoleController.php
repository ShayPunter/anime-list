<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminRoleController extends Controller
{
    public function index(): Response
    {
        $roles = Role::with(['users' => fn ($q) => $q->select('users.id', 'users.name', 'users.username', 'users.avatar_url')])
            ->orderBy('name')
            ->get()
            ->map(fn (Role $role) => [
                'id' => $role->id,
                'slug' => $role->slug,
                'name' => $role->name,
                'description' => $role->description,
                'users' => $role->users->map(fn (User $user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'avatar_url' => $user->avatar_url,
                ])->values(),
            ]);

        return Inertia::render('Admin/RolesPage', [
            'roles' => $roles,
        ]);
    }

    public function assign(Request $request, Role $role): JsonResponse
    {
        $request->validate([
            'username' => ['required', 'string', 'exists:users,username'],
        ]);

        $user = User::where('username', $request->input('username'))->firstOrFail();
        $role->users()->syncWithoutDetaching([$user->id]);

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'username' => $user->username,
            'avatar_url' => $user->avatar_url,
        ]);
    }

    public function remove(Role $role, User $user): JsonResponse
    {
        $role->users()->detach($user->id);

        return response()->json(['success' => true]);
    }
}
