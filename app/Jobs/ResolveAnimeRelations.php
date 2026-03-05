<?php

namespace App\Jobs;

use App\Models\Anime;
use App\Models\AnimeRelation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;

class ResolveAnimeRelations implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 300;

    public int $tries = 2;

    public function handle(): void
    {
        // Load full anilist_id → internal id map
        $anilistIdMap = Anime::pluck('id', 'anilist_id')->all();

        $inserted = 0;
        $skipped = 0;

        // Process pending relations first, then retry previously unresolved ones
        foreach (['sync:pending_relations', 'sync:unresolved_relations'] as $queue) {
            $stillUnresolved = [];

            while ($item = Redis::lpop($queue)) {
                $relation = json_decode($item, true);

                $fromId = $anilistIdMap[$relation['from_anilist_id']] ?? null;
                $toId = $anilistIdMap[$relation['to_anilist_id']] ?? null;

                if (! $fromId || ! $toId) {
                    $skipped++;
                    $stillUnresolved[] = $item;

                    continue;
                }

                AnimeRelation::updateOrCreate(
                    [
                        'anime_id' => $fromId,
                        'related_anime_id' => $toId,
                        'relation_type' => $relation['relation_type'],
                    ],
                    [],
                );

                $inserted++;
            }

            // Push back only the ones that still can't be resolved
            if (! empty($stillUnresolved)) {
                Redis::rpush('sync:unresolved_relations', ...$stillUnresolved);
            }
        }

        Log::info('ResolveAnimeRelations complete', [
            'inserted' => $inserted,
            'skipped' => $skipped,
        ]);
    }

    public function failed(\Throwable $e): void
    {
        Log::error('ResolveAnimeRelations failed', [
            'exception' => $e,
        ]);
    }
}
