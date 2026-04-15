<?php

use App\Http\Controllers\AnimeController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminFeatureFlagController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ImportController;
use App\Http\Controllers\PeopleController;
use App\Http\Controllers\PlaylistController;
use App\Http\Controllers\TopAnimeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SeasonalController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\StudioController;
use App\Http\Controllers\UserListController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Sitemap
Route::get('/sitemap.xml', SitemapController::class);

// Public pages
Route::get('/', HomeController::class)->name('home');
Route::get('/anime', [AnimeController::class, 'index'])->name('anime.index');
Route::get('/anime/{id}', function (int $id) {
    $anime = \App\Models\Anime::find($id);
    if (! $anime) {
        abort(404);
    }

    return redirect()->route('anime.show', $anime, 301);
})->where('id', '[0-9]+');
Route::get('/anime/al/{anilistId}', [AnimeController::class, 'showByAnilistId'])->where('anilistId', '[0-9]+')->name('anime.show.anilist');
Route::get('/anime/{anime:slug}', [AnimeController::class, 'show'])->name('anime.show');
Route::get('/seasonal', [SeasonalController::class, 'index'])->name('seasonal');
Route::get('/schedule', ScheduleController::class)->name('schedule');
Route::get('/search', function (\Illuminate\Http\Request $request) {
    $params = [];
    $q = trim((string) $request->query('q', ''));
    if ($q !== '') {
        $params['filter[search]'] = $q;
    }

    return redirect()->route('anime.index', $params, 301);
})->name('search');
Route::get('/terms', fn () => Inertia::render('TermsPage'))->name('terms');
Route::get('/privacy', fn () => Inertia::render('PrivacyPage'))->name('privacy');
Route::get('/top', [TopAnimeController::class, 'rated'])->name('top.rated');
Route::get('/top/popular', [TopAnimeController::class, 'popular'])->name('top.popular');

// JSON search endpoint
Route::get('/api/search', SearchController::class)->middleware('throttle:api')->name('api.search');

// Public playlist
Route::get('/playlist/{playlist:slug}', [PlaylistController::class, 'show'])->name('playlist.show');

// Studios & producers
Route::get('/studios', [StudioController::class, 'index'])->name('studios.index');
Route::get('/studios/{studio:slug}', [StudioController::class, 'show'])->name('studios.show');
Route::get('/producers', [StudioController::class, 'producersIndex'])->name('producers.index');
Route::get('/producers/{studio:slug}', [StudioController::class, 'producerShow'])->name('producers.show');

// Voice actors / people
Route::get('/people', [PeopleController::class, 'index'])->name('people.index');
Route::get('/people/{person:slug}', [PeopleController::class, 'show'])->name('people.show');

// Public profile
Route::get('/user/{user:username}/list', [ProfileController::class, 'list'])->name('profile.list');
Route::get('/user/{user:username}', [ProfileController::class, 'show'])->name('profile.show');

// Guest-only (auth)
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->middleware('throttle:auth');
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store'])->middleware('throttle:auth');
});

// Authenticated
Route::middleware('auth')->group(function () {
    Route::get('/list', [UserListController::class, 'index'])->name('list');
    Route::get('/list/export', [UserListController::class, 'export'])->name('list.export');

    Route::prefix('api/list')->middleware('throttle:api')->name('api.list.')->group(function () {
        Route::post('/', [UserListController::class, 'store'])->name('store');
        Route::patch('/{entry}', [UserListController::class, 'update'])->name('update');
        Route::delete('/{entry}', [UserListController::class, 'destroy'])->name('destroy');
    });

    Route::get('/import', [ImportController::class, 'show'])->name('import');
    Route::post('/import/upload', [ImportController::class, 'upload'])->name('import.upload');
    Route::post('/import/confirm', [ImportController::class, 'confirm'])->name('import.confirm');
    Route::get('/import/status', [ImportController::class, 'status'])->name('import.status');

    Route::get('/playlists', [PlaylistController::class, 'index'])->name('playlists.index');
    Route::get('/playlists/create', [PlaylistController::class, 'create'])->name('playlists.create');
    Route::get('/playlists/{playlist:slug}/edit', [PlaylistController::class, 'edit'])->name('playlists.edit');

    Route::prefix('api/playlists')->middleware('throttle:api')->name('api.playlists.')->group(function () {
        Route::post('/', [PlaylistController::class, 'store'])->name('store');
        Route::patch('/{playlist:id}', [PlaylistController::class, 'update'])->name('update');
        Route::delete('/{playlist:id}', [PlaylistController::class, 'destroy'])->name('destroy');
        Route::post('/{playlist:id}/items', [PlaylistController::class, 'addItem'])->name('items.store');
        Route::patch('/{playlist:id}/items/{item}', [PlaylistController::class, 'updateItem'])->name('items.update');
        Route::delete('/{playlist:id}/items/{item}', [PlaylistController::class, 'removeItem'])->name('items.remove');
        Route::patch('/{playlist:id}/reorder', [PlaylistController::class, 'reorder'])->name('reorder');
    });

    Route::get('/settings', [SettingsController::class, 'show'])->name('settings');
    Route::patch('/settings/profile', [SettingsController::class, 'updateProfile'])->name('settings.profile');
    Route::patch('/settings/password', [SettingsController::class, 'updatePassword'])->name('settings.password');
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});

// Admin
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('/users', [AdminUserController::class, 'index'])->name('users');
    Route::patch('/users/{user}/toggle-admin', [AdminUserController::class, 'toggleAdmin'])->name('users.toggle-admin');
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');

    Route::get('/features', [AdminFeatureFlagController::class, 'index'])->name('features');
    Route::patch('/features/{feature}', [AdminFeatureFlagController::class, 'update'])->name('features.update');
    Route::post('/features/{feature}/users', [AdminFeatureFlagController::class, 'activateForUser'])->name('features.activate-user');
    Route::delete('/features/{feature}/users/{user}', [AdminFeatureFlagController::class, 'deactivateForUser'])->name('features.deactivate-user');
});
