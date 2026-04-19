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
    public function search(Request $request): JsonResponse
    {
        $query = trim((string) $request->input('q', ''));

        if ($query === '') {
            return response()->json(['data' => []]);
        }

        $users = User::query()
            ->select(['id', 'name', 'username', 'avatar_url'])
            ->where(function ($q) use ($query) {
                $q->where('username', 'like', "%{$query}%")
                    ->orWhere('name', 'like', "%{$query}%")
                    ->orWhere('email', 'like', "%{$query}%");
            })
            ->orderBy('username')
            ->limit(10)
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'avatar_url' => $user->avatar_url,
            ]);

        return response()->json(['data' => $users]);
    }

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

        $paginator = $query->latest()->paginate(20)->withQueryString()->through(fn (User $user) => [
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
            'users' => [
                'data' => $paginator->items(),
                'meta' => [
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                ],
                'links' => [
                    'first' => $paginator->url(1),
                    'last' => $paginator->url($paginator->lastPage()),
                    'prev' => $paginator->previousPageUrl(),
                    'next' => $paginator->nextPageUrl(),
                ],
            ],
            'filters' => [
                'search' => $search,
            ],
        ]);
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
