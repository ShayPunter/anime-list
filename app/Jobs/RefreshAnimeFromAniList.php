<?php

namespace App\Jobs;

use App\Exceptions\AniListServiceUnavailableException;
use App\Services\AniListClient;
use App\Services\AniListQueryBuilder;
use App\Services\AnimeDataPersistenceService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class RefreshAnimeFromAniList implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 120;

    /**
     * Attempts are bounded by retryUntil() rather than a fixed count: the job
     * releases itself back onto the queue while AniList is unavailable, and
     * every one of those releases would otherwise burn an attempt and fail the
     * refresh with MaxAttemptsExceededException.
     */
    public int $tries = 0;

    /**
     * Genuine errors (as opposed to outage releases) still fail fast.
     */
    public int $maxExceptions = 3;

    public function __construct(
        public readonly int $anilistId,
    ) {}

    /**
     * Long enough to sit out a couple of AniList circuit-breaker windows
     * (900s each by default) before giving up.
     */
    public function retryUntil(): \DateTimeInterface
    {
        return now()->addHours(2);
    }

    public function handle(AniListClient $client, AnimeDataPersistenceService $persistenceService): void
    {
        try {
            $data = $client->query(
                AniListQueryBuilder::singleAnime(),
                ['id' => $this->anilistId],
            );
        } catch (AniListServiceUnavailableException $e) {
            Log::warning('RefreshAnimeFromAniList paused: AniList unavailable', [
                'anilist_id' => $this->anilistId,
                'retry_after_s' => $e->retryAfter,
            ]);

            $this->release($e->retryAfter);

            return;
        }

        $media = $data['Media'] ?? null;
        if ($media === null) {
            throw new \RuntimeException("AniList response missing 'Media' for id {$this->anilistId}");
        }

        $persistenceService->persistSingle($media);

        Log::info('RefreshAnimeFromAniList persisted', [
            'anilist_id' => $this->anilistId,
        ]);
    }

    public function failed(\Throwable $e): void
    {
        Log::error('RefreshAnimeFromAniList failed', [
            'anilist_id' => $this->anilistId,
            'exception' => $e,
        ]);
    }
}
