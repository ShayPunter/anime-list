<?php

namespace App\Http\Controllers;

use App\Http\Resources\AnimeCardResource;
use App\Jobs\ResolveAnimeRelations;
use App\Models\Anime;
use App\Services\AniListClient;
use App\Services\AniListQueryBuilder;
use App\Services\AnimeDataPersistenceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class SearchController extends Controller
{
    public function __invoke(Request $request, AniListClient $client, AnimeDataPersistenceService $persistenceService): JsonResponse
    {
        $query = trim($request->string('q'));

        if (mb_strlen($query) < 2 || mb_strlen($query) > 200) {
            return response()->json(['data' => [], 'query' => $query, 'total' => 0]);
        }

        $cacheKey = 'search:'.md5(mb_strtolower($query));

        try {
            $result = Cache::remember($cacheKey, 900, function () use ($query, $client, $persistenceService) {
                // Try local Scout search first
                $items = Anime::search($query)
                    ->query(fn ($q) => $q->where('is_adult', false)->with('genres'))
                    ->take(20)
                    ->get();

                if ($items->isNotEmpty()) {
                    return [
                        'data' => AnimeCardResource::collection($items)->resolve(),
                        'total' => $items->count(),
                        'source' => 'local',
                    ];
                }

                // Fall back to AniList API search, persist results to DB
                return $this->searchAniList($client, $persistenceService, $query);
            });
        } catch (\Exception $e) {
            Log::error('Search failed', ['query' => $query, 'exception' => $e]);

            return response()->json([
                'data' => [],
                'query' => $query,
                'total' => 0,
                'error' => 'Search is temporarily unavailable.',
            ], 503);
        }

        return response()->json([
            'data' => $result['data'],
            'query' => $query,
            'total' => $result['total'],
            'source' => $result['source'] ?? 'local',
        ]);
    }

    private function searchAniList(AniListClient $client, AnimeDataPersistenceService $persistenceService, string $query): array
    {
        try {
            $data = $client->query(AniListQueryBuilder::searchAnime(), [
                'search' => $query,
                'page' => 1,
                'perPage' => 20,
            ]);

            $mediaItems = $data['Page']['media'] ?? [];

            if (empty($mediaItems)) {
                return ['data' => [], 'total' => 0, 'source' => 'anilist'];
            }

            // Persist all results to DB using the full media data
            $animeModels = $persistenceService->persistBatch($mediaItems);

            // Resolve relations immediately so season chains work
            ResolveAnimeRelations::dispatchSync();

            // Reload with genres for the card resource
            $ids = $animeModels->pluck('id');
            $persisted = Anime::whereIn('id', $ids)
                ->with('genres')
                ->orderByRaw('FIELD(id, '.implode(',', $ids->all()).')')
                ->get();

            return [
                'data' => AnimeCardResource::collection($persisted)->resolve(),
                'total' => $persisted->count(),
                'source' => 'anilist',
            ];
        } catch (\Throwable $e) {
            Log::warning('AniList search fallback failed', [
                'query' => $query,
                'error' => $e->getMessage(),
            ]);

            return ['data' => [], 'total' => 0, 'source' => 'anilist'];
        }
    }
}
