<?php

namespace App\Http\Controllers;

use App\Http\Resources\AnimeCardResource;
use App\Http\Resources\ListEntryResource;
use App\Http\Resources\ScheduleDayResource;
use App\Models\Anime;
use App\Models\AiringSchedule;
use App\Models\UserAnimeList;
use App\Services\SeasonService;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(SeasonService $seasonService): Response
    {
        $current = $seasonService->currentSeason();

        $seasonalShowcase = Cache::remember(
            "home:current_season:{$current['year']}:{$current['season']}",
            21600,
            fn () => AnimeCardResource::collection(
                Anime::query()
                    ->forSeason($current['year'], $current['season'])
                    ->where('is_adult', false)
                    ->with(['genres', 'nextAiringEpisode'])
                    ->orderByDesc('popularity')
                    ->limit(12)
                    ->get()
            )->resolve()
        );

        $airingNow = Cache::remember(
            'home:airing_now',
            3600,
            fn () => AnimeCardResource::collection(
                Anime::query()
                    ->releasing()
                    ->where('is_adult', false)
                    ->with(['genres', 'nextAiringEpisode'])
                    ->orderByDesc('popularity')
                    ->limit(10)
                    ->get()
            )->resolve()
        );

        $sharedProps = [
            'seasonalShowcase' => $seasonalShowcase,
            'airingNow' => $airingNow,
            'currentSeason' => $current['season'],
            'currentYear' => $current['year'],
        ];

        if (! auth()->check()) {
            return Inertia::render('HomePage', array_merge($sharedProps, [
                'isAuthenticated' => false,
            ]));
        }

        $user = auth()->user();

        $listStats = $user->animeList()
            ->selectRaw('
                COUNT(*) as total_anime,
                SUM(progress) as episodes_watched,
                AVG(CASE WHEN score > 0 THEN score ELSE NULL END) as avg_score,
                SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as watching_count
            ', [UserAnimeList::STATUS_WATCHING])
            ->first();

        $stats = [
            'totalAnime' => (int) ($listStats->total_anime ?? 0),
            'episodesWatched' => (int) ($listStats->episodes_watched ?? 0),
            'avgScore' => $listStats->avg_score !== null
                ? round($listStats->avg_score / 10, 1)
                : null,
            'watchingCount' => (int) ($listStats->watching_count ?? 0),
        ];

        $airingToday = AiringSchedule::today()
            ->whereIn('anime_id', function ($sub) use ($user) {
                $sub->select('anime_id')
                    ->from('user_anime_lists')
                    ->where('user_id', $user->id)
                    ->whereNull('deleted_at');
            })
            ->with(['anime:id,title_romaji,title_english,cover_image_medium,cover_image_color,average_score,format,episodes', 'anime.genres'])
            ->orderBy('airs_at')
            ->get();

        $continueWatching = $user->animeList()
            ->where('status', UserAnimeList::STATUS_WATCHING)
            ->with(['anime:id,title_romaji,title_english,cover_image_medium,cover_image_color,average_score,format,episodes', 'anime.genres'])
            ->orderByDesc('updated_at')
            ->limit(12)
            ->get();

        return Inertia::render('HomePage', array_merge($sharedProps, [
            'isAuthenticated' => true,
            'stats' => $stats,
            'airingToday' => ScheduleDayResource::collection($airingToday),
            'continueWatching' => ListEntryResource::collection($continueWatching),
        ]));
    }
}
