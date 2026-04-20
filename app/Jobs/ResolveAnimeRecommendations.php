<?php

namespace App\Jobs;

use App\Models\Anime;
use App\Models\Recommendation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;

class ResolveAnimeRecommendations implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 600;

    public int $tries = 2;

    public function handle(): void
    {
        $anilistIdMap = Anime::pluck('id', 'anilist_id')->all();

        $inserted = 0;
        $skipped = 0;

        foreach (['sync:pending_recommendations', 'sync:unresolved_recommendations'] as $queue) {
            $stillUnresolved = [];
            $buffer = [];

            while ($item = Redis::lpop($queue)) {
                $rec = json_decode($item, true);

                $fromId = $anilistIdMap[$rec['from_anilist_id']] ?? null;
                $toId = $anilistIdMap[$rec['to_anilist_id']] ?? null;

                if (! $fromId || ! $toId || $fromId === $toId) {
                    if (! $fromId || ! $toId) {
                        $stillUnresolved[] = $item;
                    }
                    $skipped++;

                    continue;
                }

                $buffer[] = [
                    'anime_id' => $fromId,
                    'recommended_anime_id' => $toId,
                    'source' => 'anilist',
                    'anilist_recommendation_id' => $rec['anilist_recommendation_id'] ?? null,
                    'rating' => $rec['rating'] ?? 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                if (count($buffer) >= 500) {
                    $inserted += $this->flush($buffer);
                    $buffer = [];
                }
            }

            if (! empty($buffer)) {
                $inserted += $this->flush($buffer);
            }

            if (! empty($stillUnresolved)) {
                Redis::rpush('sync:unresolved_recommendations', ...$stillUnresolved);
            }
        }

        Log::info('ResolveAnimeRecommendations complete', [
            'inserted' => $inserted,
            'skipped' => $skipped,
        ]);
    }

    /**
     * @param  array<int, array<string, mixed>>  $rows
     */
    private function flush(array $rows): int
    {
        // Deduplicate within the batch on the composite key to avoid upsert conflicts
        $unique = [];
        foreach ($rows as $row) {
            $key = $row['anime_id'].'-'.$row['recommended_anime_id'].'-'.$row['source'];
            $existing = $unique[$key] ?? null;
            if (! $existing || ($row['rating'] ?? 0) > ($existing['rating'] ?? 0)) {
                $unique[$key] = $row;
            }
        }

        Recommendation::upsert(
            array_values($unique),
            ['anime_id', 'recommended_anime_id', 'source'],
            ['anilist_recommendation_id', 'rating', 'updated_at'],
        );

        return count($unique);
    }

    public function failed(\Throwable $e): void
    {
        Log::error('ResolveAnimeRecommendations failed', [
            'exception' => $e,
        ]);
    }
}
