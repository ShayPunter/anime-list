<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserAnimeList;
use DOMDocument;

class MalExportService
{
    private const STATUS_MAP = [
        UserAnimeList::STATUS_WATCHING => 'Watching',
        UserAnimeList::STATUS_COMPLETED => 'Completed',
        UserAnimeList::STATUS_ON_HOLD => 'On-Hold',
        UserAnimeList::STATUS_DROPPED => 'Dropped',
        UserAnimeList::STATUS_PLAN_TO_WATCH => 'Plan to Watch',
    ];

    public function generate(User $user): string
    {
        $entries = $user->animeList()
            ->with('anime:id,mal_id,title_romaji,episodes')
            ->get();

        $doc = new DOMDocument('1.0', 'UTF-8');
        $doc->formatOutput = true;

        $root = $doc->createElement('myanimelist');
        $doc->appendChild($root);

        // Build anime nodes first, then count
        $animeNodes = [];
        foreach ($entries as $entry) {
            $anime = $entry->anime;
            if (! $anime || ! $anime->mal_id) {
                continue;
            }

            $node = $doc->createElement('anime');
            $node->appendChild($doc->createElement('series_animedb_id', (string) $anime->mal_id));
            $node->appendChild($doc->createElement('series_title', htmlspecialchars($anime->title_romaji)));
            $node->appendChild($doc->createElement('series_episodes', (string) ($anime->episodes ?? 0)));
            $node->appendChild($doc->createElement('my_watched_episodes', (string) $entry->progress));
            $node->appendChild($doc->createElement('my_start_date', $entry->started_at?->format('Y-m-d') ?? '0000-00-00'));
            $node->appendChild($doc->createElement('my_finish_date', $entry->completed_at?->format('Y-m-d') ?? '0000-00-00'));
            $node->appendChild($doc->createElement('my_score', (string) ($entry->score ?? 0)));
            $node->appendChild($doc->createElement('my_status', self::STATUS_MAP[$entry->status] ?? 'Plan to Watch'));
            $node->appendChild($doc->createElement('my_rewatching', $entry->is_rewatching ? '1' : '0'));
            $node->appendChild($doc->createElement('my_rewatching_ep', '0'));
            $node->appendChild($doc->createElement('update_on_import', '1'));
            $animeNodes[] = $node;
        }

        // User info header with accurate count
        $myinfo = $doc->createElement('myinfo');
        $myinfo->appendChild($doc->createElement('user_name', htmlspecialchars($user->name)));
        $myinfo->appendChild($doc->createElement('user_export_type', '1'));
        $myinfo->appendChild($doc->createElement('user_total_anime', (string) count($animeNodes)));
        $root->appendChild($myinfo);

        foreach ($animeNodes as $node) {
            $root->appendChild($node);
        }

        return $doc->saveXML();
    }
}
