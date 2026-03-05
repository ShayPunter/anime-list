<?php

namespace App\Jobs;

use App\Services\AnimeDataPersistenceService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessAnimeData implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 120;

    public int $tries = 3;

    public function __construct(
        public readonly array $mediaData,
    ) {}

    public function handle(AnimeDataPersistenceService $service): void
    {
        $service->persistSingle($this->mediaData);
    }

    public function failed(\Throwable $e): void
    {
        Log::error('ProcessAnimeData failed', [
            'anilist_id' => $this->mediaData['id'] ?? 'unknown',
            'exception' => $e,
        ]);
    }
}
