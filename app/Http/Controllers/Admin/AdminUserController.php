<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::query()
            ->select(['id', 'name', 'username', 'email', 'avatar_url', 'is_admin', 'list_is_public', 'created_at'])
            ->withCount('animeList as anime_count');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%");
            });
        }

        $users = $query->latest()->paginate(20)->through(fn (User $user) => [
            'id' => $user->id,
            'name' => $user->name,
            'username' => $user->username,
            'email' => $user->email,
            'avatar_url' => $user->avatar_url,
            'is_admin' => $user->is_admin,
            'list_is_public' => $user->list_is_public,
            'created_at' => $user->created_at->toIso8601String(),
            'anime_count' => $user->anime_count,
        ]);

        return Inertia::render('Admin/UsersPage', [
            'users' => $users,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function search(Request $request): JsonResponse
    {
        $term = trim((string) $request->query('q', ''));

        if ($term === '') {
            return response()->json([]);
        }

        $users = User::query()
            ->select(['id', 'name', 'username', 'avatar_url'])
            ->where(fn ($q) => $q
                ->where('username', 'like', "%{$term}%")
                ->orWhere('name', 'like', "%{$term}%")
            )
            ->orderBy('username')
            ->limit(10)
            ->get();

        return response()->json($users);
    }

    public function toggleAdmin(Request $request, User $user): RedirectResponse
    {
        $user->update(['is_admin' => ! $user->is_admin]);

        $action = $user->is_admin ? 'granted' : 'revoked';

        return back()->with('message', "Admin access {$action} for {$user->name}.");
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($user->id === $request->user()->id) {
            return back()->with('message', 'You cannot delete your own account.');
        }

        $user->delete();

        return back()->with('message', "{$user->name} has been deleted.");
    }
}
