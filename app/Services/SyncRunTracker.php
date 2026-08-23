<?php

namespace App\Services;

use App\Models\SyncRun;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Creates and advances SyncRun rows on behalf of the sync commands and jobs.
 */
class SyncRunTracker
{
    /**
     * Overlap applied when deriving the next incremental cutoff, so anime
     * edited on AniList *while* the previous sweep was running are not skipped.
     */
    private const CUTOFF_OVERLAP_SECONDS = 300;

    /**
     * Open a run, superseding any earlier run of the same mode/label that never
     * reached a terminal state (an abandoned sweep must not keep a stale
     * "running" badge on the panel forever).
     */
    public function start(string $mode, ?string $label = null, ?int $cutoffAt = null): SyncRun
    {
        SyncRun::query()
            ->where('mode', $mode)
            ->where('label', $label)
            ->inProgress()
            ->update([
                'status' => SyncRun::STATUS_SUPERSEDED,
                'finished_at' => now(),
                'updated_at' => now(),
            ]);

        return SyncRun::create([
            'mode' => $mode,
            'label' => $label,
            'status' => SyncRun::STATUS_RUNNING,
            'cutoff_at' => $cutoffAt,
            'started_at' => now(),
            'heartbeat_at' => now(),
        ]);
    }

    public function find(?int $id): ?SyncRun
    {
        return $id === null ? null : SyncRun::find($id);
    }

    /**
     * Record progress for a completed page.
     */
    public function advance(SyncRun $run, int $page, int $lastPage, int $totalItems, int $processedDelta = 0): void
    {
        $run->forceFill([
            // A page fetched out of order (a retry landing late) must not
            // rewind the progress bar.
            'current_page' => max($run->current_page, $page),
            'last_page' => max($run->last_page, $lastPage),
            'total_items' => max($run->total_items, $totalItems),
            'processed_items' => $run->processed_items + max(0, $processedDelta),
            // A page came back, so any earlier outage pause is over.
            'status' => SyncRun::STATUS_RUNNING,
            'heartbeat_at' => now(),
            'last_error' => null,
        ])->save();
    }

    /**
     * The run is waiting out an AniList outage; it has not failed.
     */
    public function pause(SyncRun $run, string $reason): void
    {
        $run->forceFill([
            'status' => SyncRun::STATUS_PAUSED,
            'heartbeat_at' => now(),
            'last_error' => Str::limit($reason, 1000),
        ])->save();
    }

    public function complete(SyncRun $run): void
    {
        $run->forceFill([
            'status' => SyncRun::STATUS_COMPLETED,
            'heartbeat_at' => now(),
            'finished_at' => now(),
            'last_error' => null,
        ])->save();
    }

    public function fail(SyncRun $run, \Throwable|string $error): void
    {
        $message = $error instanceof \Throwable
            ? $error::class.': '.$error->getMessage()
            : $error;

        $run->forceFill([
            'status' => SyncRun::STATUS_FAILED,
            'heartbeat_at' => now(),
            'finished_at' => now(),
            'last_error' => Str::limit($message, 1000),
        ])->save();

        Log::warning('Sync run marked failed', [
            'sync_run_id' => $run->id,
            'mode' => $run->mode,
            'label' => $run->label,
            'page' => $run->current_page,
        ]);
    }

    /**
     * Cutoff for the next "updated since" sweep of this mode.
     *
     * Anchored to the start of the last completed run rather than its end:
     * a sweep can take hours, and anything AniList edited mid-sweep would
     * otherwise fall into the gap and never be picked up.
     */
    public function nextCutoffFor(string $mode, int $fallbackSeconds): int
    {
        $lastCompleted = SyncRun::query()
            ->where('mode', $mode)
            ->where('status', SyncRun::STATUS_COMPLETED)
            ->whereNotNull('started_at')
            ->orderByDesc('started_at')
            ->first();

        if ($lastCompleted === null) {
            return now()->subSeconds($fallbackSeconds)->timestamp;
        }

        return $lastCompleted->started_at->timestamp - self::CUTOFF_OVERLAP_SECONDS;
    }

    /**
     * Latest run per mode, plus every distinct label for multi-label modes
     * such as targeted syncs.
     *
     * @return \Illuminate\Support\Collection<int, SyncRun>
     */
    public function latestRuns(): \Illuminate\Support\Collection
    {
        return SyncRun::query()
            ->whereIn('id', function ($query) {
                $query->selectRaw('max(id)')
                    ->from('sync_runs')
                    ->groupBy('mode', 'label');
            })
            ->orderBy('mode')
            ->orderBy('label')
            ->get();
    }

    /**
     * Whether a sweep of this mode is already under way, so callers can avoid
     * racing a second chain against the same mode.
     */
    public function hasRunInProgress(string $mode, ?string $label = null): bool
    {
        return SyncRun::query()
            ->where('mode', $mode)
            ->when($label !== null, fn ($q) => $q->where('label', $label))
            ->inProgress()
            ->exists();
    }
}
