<?php

use App\Http\Controllers\AnimeController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ImportController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SeasonalController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\UserListController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public pages
Route::get('/', HomeController::class)->name('home');
Route::get('/anime', [AnimeController::class, 'index'])->name('anime.index');
Route::get('/anime/{anime}', [AnimeController::class, 'show'])->where('anime', '[0-9]+')->name('anime.show');
Route::get('/anime/al/{anilistId}', [AnimeController::class, 'showByAnilistId'])->where('anilistId', '[0-9]+')->name('anime.show.anilist');
Route::get('/seasonal', [SeasonalController::class, 'index'])->name('seasonal');
Route::get('/schedule', ScheduleController::class)->name('schedule');
Route::get('/search', fn () => Inertia::render('SearchPage'))->name('search');

// JSON search endpoint
Route::get('/api/search', SearchController::class)->middleware('throttle:api')->name('api.search');

// Public profile
Route::get('/user/{user:name}', [ProfileController::class, 'show'])->name('profile.show');

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

    Route::get('/settings', [SettingsController::class, 'show'])->name('settings');
    Route::patch('/settings/profile', [SettingsController::class, 'updateProfile'])->name('settings.profile');
    Route::patch('/settings/password', [SettingsController::class, 'updatePassword'])->name('settings.password');
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});
