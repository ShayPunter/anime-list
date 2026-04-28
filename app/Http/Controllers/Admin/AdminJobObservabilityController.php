<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\RefreshAnimeFromAniList;
use App\Jobs\SyncAnimePage;
use App\Models\Anime;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminJobObservabilityController extends Controller
{
    private const TRACKED_QUEUES = ['default', 'sync', 'import', 'recommendations'];

    public function index(Request $request): Response
    {
        $now = now();

        $queuedByQueue = DB::table('jobs')
            ->select('queue', DB::raw('count(*) as count'))
            ->groupBy('queue')
            ->pluck('count', 'queue')
            ->all();

        $failedByQueue = DB::table('failed_jobs')
            ->select('queue', DB::raw('count(*) as count'))
            ->groupBy('queue')
            ->pluck('count', 'queue')
            ->all();

        $failedLast24h = DB::table('failed_jobs')
            ->where('failed_at', '>=', $now->copy()->subDay())
            ->count();

        $oldestPendingTs = DB::table('jobs')->min('created_at');
        $oldestPendingAge = $oldestPendingTs !== null
            ? max(0, $now->timestamp - (int) $oldestPendingTs)
            : null;

        $animeAdded = [
            'last_24h' => Anime::where('created_at', '>=', $now->copy()->subDay())->count(),
            'last_7d' => Anime::where('created_at', '>=', $now->copy()->subDays(7))->count(),
            'last_30d' => Anime::where('created_at', '>=', $now->copy()->subDays(30))->count(),
        ];

        $animeUpdated = [
            'last_24h' => Anime::where('synced_at', '>=', $now->copy()->subDay())->count(),
            'last_7d' => Anime::where('synced_at', '>=', $now->copy()->subDays(7))->count(),
            'last_30d' => Anime::where('synced_at', '>=', $now->copy()->subDays(30))->count(),
        ];

        $totalAnime = Anime::count();
        $neverSynced = Anime::whereNull('synced_at')->count();
        $staleSync = Anime::where(function ($q) use ($now) {
            $q->whereNull('synced_at')
                ->orWhere('synced_at', '<', $now->copy()->subDays(30));
        })->count();

        $recentFailed = DB::table('failed_jobs')
            ->orderByDesc('failed_at')
            ->limit(15)
            ->get(['uuid', 'queue', 'payload', 'exception', 'failed_at'])
            ->map(fn ($row) => [
                'uuid' => $row->uuid,
                'queue' => $row->queue,
                'job_class' => $this->extractJobClass($row->payload),
                'exception_summary' => Str::limit($this->extractExceptionMessage($row->exception), 240),
                'failed_at' => $row->failed_at,
            ])
            ->all();

        $recentlyAdded = Anime::query()
            ->orderByDesc('created_at')
            ->limit(10)
            ->get(['id', 'slug', 'anilist_id', 'title_english', 'title_romaji', 'cover_image_medium', 'created_at'])
            ->map(fn (Anime $a) => [
                'id' => $a->id,
                'slug' => $a->slug,
                'anilist_id' => $a->anilist_id,
                'title' => $a->title_english ?: $a->title_romaji,
                'cover_image_medium' => $a->cover_image_medium,
                'created_at' => $a->created_at?->toIso8601String(),
            ])
            ->all();

        $recentlyUpdated = Anime::query()
            ->whereNotNull('synced_at')
            ->orderByDesc('synced_at')
            ->limit(10)
            ->get(['id', 'slug', 'anilist_id', 'title_english', 'title_romaji', 'cover_image_medium', 'synced_at'])
            ->map(fn (Anime $a) => [
                'id' => $a->id,
                'slug' => $a->slug,
                'anilist_id' => $a->anilist_id,
                'title' => $a->title_english ?: $a->title_romaji,
                'cover_image_medium' => $a->cover_image_medium,
                'synced_at' => $a->synced_at?->toIso8601String(),
            ])
            ->all();

        $progressTtl = config('anilist.sync.progress_cache_ttl', 86400);
        $syncStates = [];
        foreach (['full', 'incremental', 'targeted', 'schedule'] as $mode) {
            $syncStates[$mode] = [
                'status' => Cache::get("sync:{$mode}:status", 'unknown'),
                'progress' => Cache::get("sync:{$mode}:progress"),
                'last_run' => $mode === 'incremental'
                    ? Cache::get('sync:incremental:last_run')
                    : null,
            ];
        }

        return Inertia::render('Admin/JobsPage', [
            'metrics' => [
                'queued_total' => array_sum($queuedByQueue),
                'queued_by_queue' => $this->normalizeQueueCounts($queuedByQueue),
                'failed_total' => array_sum($failedByQueue),
                'failed_by_queue' => $this->normalizeQueueCounts($failedByQueue),
                'failed_last_24h' => $failedLast24h,
                'oldest_pending_age_seconds' => $oldestPendingAge,
                'anime_total' => $totalAnime,
                'anime_added' => $animeAdded,
                'anime_updated' => $animeUpdated,
                'never_synced' => $neverSynced,
                'stale_sync' => $staleSync,
            ],
            'recentFailed' => $recentFailed,
            'recentlyAdded' => $recentlyAdded,
            'recentlyUpdated' => $recentlyUpdated,
            'syncStates' => $syncStates,
            'progressTtl' => $progressTtl,
        ]);
    }

    public function enqueueAnime(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'anilist_id' => ['nullable', 'integer', 'min:1'],
            'anime_id' => ['nullable', 'integer', 'min:1'],
        ]);

        $anilistId = $validated['anilist_id'] ?? null;

        if (! $anilistId && ! empty($validated['anime_id'])) {
            $anilistId = Anime::where('id', $validated['anime_id'])->value('anilist_id');
        }

        if (! $anilistId) {
            return back()->withErrors([
                'anilist_id' => 'Provide either an AniList ID or a known internal anime ID.',
            ]);
        }

        RefreshAnimeFromAniList::dispatch($anilistId)->onQueue('sync');

        return back()->with('message', "Queued AniList #{$anilistId} for refresh.");
    }

    public function enqueueIncrementalSync(): RedirectResponse
    {
        $progressTtl = config('anilist.sync.progress_cache_ttl', 86400);
        $lastRun = Cache::get('sync:incremental:last_run');
        $updatedAtGreater = $lastRun ?? now()->subDay()->timestamp;

        Cache::put('sync:incremental:status', 'running', $progressTtl);

        SyncAnimePage::dispatch(
            page: 1,
            perPage: config('anilist.sync.per_page', 50),
            mode: 'incremental',
            updatedAtGreater: $updatedAtGreater,
        )->onQueue('sync');

        return back()->with('message', 'Incremental sync dispatched.');
    }

    public function retryFailed(string $uuid): RedirectResponse
    {
        $exists = DB::table('failed_jobs')->where('uuid', $uuid)->exists();
        if (! $exists) {
            return back()->withErrors(['uuid' => 'Failed job not found.']);
        }

        Artisan::call('queue:retry', ['id' => [$uuid]]);

        return back()->with('message', "Retrying failed job {$uuid}.");
    }

    public function forgetFailed(string $uuid): RedirectResponse
    {
        $deleted = DB::table('failed_jobs')->where('uuid', $uuid)->delete();
        if ($deleted === 0) {
            return back()->withErrors(['uuid' => 'Failed job not found.']);
        }

        return back()->with('message', "Removed failed job {$uuid}.");
    }

    /**
     * @param  array<string, int>  $counts
     * @return array<int, array{queue: string, count: int}>
     */
    private function normalizeQueueCounts(array $counts): array
    {
        $merged = array_fill_keys(self::TRACKED_QUEUES, 0);
        foreach ($counts as $queue => $count) {
            $merged[$queue] = ($merged[$queue] ?? 0) + (int) $count;
        }

        return collect($merged)
            ->map(fn ($count, $queue) => ['queue' => $queue, 'count' => (int) $count])
            ->values()
            ->all();
    }

    private function extractJobClass(string $payload): ?string
    {
        $decoded = json_decode($payload, true);
        if (! is_array($decoded)) {
            return null;
        }

        return $decoded['displayName']
            ?? ($decoded['data']['commandName'] ?? null);
    }

    private function extractExceptionMessage(string $exception): string
    {
        $firstLine = strtok($exception, "\n");

        return $firstLine === false ? $exception : $firstLine;
    }
}
