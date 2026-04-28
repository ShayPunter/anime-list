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

    public int $tries = 3;

    public function __construct(
        public readonly int $anilistId,
    ) {}

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
