<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * A single sweep of one of the AniList sync modes.
 *
 * Sync state used to live in the cache with a 24h TTL, which meant weekly and
 * monthly sweeps always read back as "unknown", and a one-off failure stuck
 * around until the TTL expired. Runs are rows now so the admin panel can show
 * what actually happened and when.
 */
class SyncRun extends Model
{
    use HasFactory;

    public const STATUS_RUNNING = 'running';

    public const STATUS_PAUSED = 'paused';

    public const STATUS_COMPLETED = 'completed';

    public const STATUS_FAILED = 'failed';

    /** Replaced by a newer run of the same mode before it finished. */
    public const STATUS_SUPERSEDED = 'superseded';

    public const MODE_FULL = 'full';

    public const MODE_INCREMENTAL = 'incremental';

    public const MODE_FINISHED_INCREMENTAL = 'finished_incremental';

    public const MODE_TARGETED = 'targeted';

    public const MODE_SCHEDULE = 'schedule';

    public const MODE_STALE_REFRESH = 'stale_refresh';

    public const MODE_RECOMMENDATIONS = 'recommendations';

    /**
     * Modes rendered on the admin panel, in display order.
     */
    public const TRACKED_MODES = [
        self::MODE_FULL,
        self::MODE_INCREMENTAL,
        self::MODE_FINISHED_INCREMENTAL,
        self::MODE_TARGETED,
        self::MODE_SCHEDULE,
        self::MODE_STALE_REFRESH,
        self::MODE_RECOMMENDATIONS,
    ];

    protected $fillable = [
        'mode',
        'label',
        'status',
        'current_page',
        'last_page',
        'total_items',
        'processed_items',
        'cutoff_at',
        'started_at',
        'heartbeat_at',
        'finished_at',
        'last_error',
    ];

    protected function casts(): array
    {
        return [
            'cutoff_at' => 'integer',
            'current_page' => 'integer',
            'last_page' => 'integer',
            'total_items' => 'integer',
            'processed_items' => 'integer',
            'started_at' => 'datetime',
            'heartbeat_at' => 'datetime',
            'finished_at' => 'datetime',
        ];
    }

    public function scopeInProgress(Builder $query): Builder
    {
        return $query->whereIn('status', [self::STATUS_RUNNING, self::STATUS_PAUSED]);
    }

    public function isInProgress(): bool
    {
        return in_array($this->status, [self::STATUS_RUNNING, self::STATUS_PAUSED], true);
    }

    /**
     * Wall-clock seconds the run has been going, or took.
     */
    public function durationSeconds(): ?int
    {
        if (! $this->started_at) {
            return null;
        }

        return $this->started_at->diffInSeconds($this->finished_at ?? now(), absolute: true);
    }

    /**
     * An in-progress run whose worker stopped writing heartbeats. Paused runs
     * are excluded: they are waiting on the AniList circuit breaker by design.
     */
    public function isStalled(int $thresholdSeconds = 3600): bool
    {
        if ($this->status !== self::STATUS_RUNNING) {
            return false;
        }

        $lastBeat = $this->heartbeat_at ?? $this->started_at;

        return $lastBeat !== null && $lastBeat->lt(now()->subSeconds($thresholdSeconds));
    }
}
