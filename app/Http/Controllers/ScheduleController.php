<?php

namespace App\Http\Controllers;

use App\Http\Resources\ScheduleDayResource;
use App\Models\AiringSchedule;
use App\Models\UserAnimeList;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $week = max(0, min(1, (int) $request->query('week', 0)));
        $watchingOnly = $request->boolean('watching_only') && auth()->check();

        $weekStart = now()->startOfWeek(Carbon::MONDAY)->addWeeks($week)->startOfDay();
        $weekEnd = $weekStart->copy()->endOfWeek(Carbon::SUNDAY)->endOfDay();

        $query = AiringSchedule::query()
            ->with(['anime:id,title_romaji,title_english,cover_image_medium,cover_image_color,average_score,format,episodes', 'anime.genres'])
            ->whereBetween('airs_at', [$weekStart, $weekEnd])
            ->orderBy('airs_at');

        if ($watchingOnly) {
            $watchingIds = UserAnimeList::where('user_id', auth()->id())
                ->where('status', UserAnimeList::STATUS_WATCHING)
                ->pluck('anime_id');
            $query->whereIn('anime_id', $watchingIds);
        }

        $schedules = $query->get();

        $grouped = $schedules
            ->groupBy(fn ($s) => $s->airs_at->toDateString())
            ->map(fn ($day) => ScheduleDayResource::collection($day));

        return Inertia::render('SchedulePage', [
            'days' => $grouped,
            'weekOffset' => $week,
            'weekStart' => $weekStart->toIso8601String(),
            'weekEnd' => $weekEnd->toIso8601String(),
            'watchingOnly' => $watchingOnly,
            'isAuth' => auth()->check(),
        ]);
    }
}
