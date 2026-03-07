<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Anime;
use App\Models\User;
use App\Models\UserAnimeList;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'total_users' => User::count(),
            'new_users_this_month' => User::where('created_at', '>=', now()->startOfMonth())->count(),
            'total_anime' => Anime::count(),
            'total_list_entries' => UserAnimeList::count(),
            'total_episodes_watched' => (int) UserAnimeList::sum('progress'),
            'active_users_today' => UserAnimeList::where('updated_at', '>=', now()->startOfDay())
                ->distinct('user_id')
                ->count('user_id'),
        ];

        $recentUsers = User::query()
            ->select(['id', 'name', 'username', 'email', 'avatar_url', 'is_admin', 'created_at'])
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'avatar_url' => $user->avatar_url,
                'is_admin' => $user->is_admin,
                'created_at' => $user->created_at->toIso8601String(),
            ]);

        $syncStatuses = [
            'releasing' => Cache::get('sync:targeted:status', 'unknown'),
            'incremental' => Cache::get('sync:incremental:status', 'unknown'),
            'schedule' => Cache::get('sync:schedule:status', 'unknown'),
        ];

        return Inertia::render('Admin/DashboardPage', [
            'stats' => $stats,
            'recentUsers' => $recentUsers,
            'syncStatuses' => $syncStatuses,
        ]);
    }
}
