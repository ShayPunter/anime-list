<script setup lang="ts">
import type { AnimeSeason, AdjacentSeasons } from '@/types/anime'

defineProps<{
    year: number
    season: AnimeSeason
    adjacentSeasons: AdjacentSeasons
}>()

function seasonLabel(season: string): string {
    return season.charAt(0) + season.slice(1).toLowerCase()
}
</script>

<template>
    <div class="flex items-center gap-4">
        <Link
            :href="route('seasonal', { year: adjacentSeasons.previous.year, season: adjacentSeasons.previous.season.toLowerCase() })"
            class="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-400 transition hover:bg-gray-800 hover:text-gray-200"
        >
            &larr; {{ seasonLabel(adjacentSeasons.previous.season) }} {{ adjacentSeasons.previous.year }}
        </Link>

        <h2 class="text-xl font-bold text-gray-100">
            {{ seasonLabel(season) }} {{ year }}
        </h2>

        <Link
            :href="route('seasonal', { year: adjacentSeasons.next.year, season: adjacentSeasons.next.season.toLowerCase() })"
            class="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-400 transition hover:bg-gray-800 hover:text-gray-200"
        >
            {{ seasonLabel(adjacentSeasons.next.season) }} {{ adjacentSeasons.next.year }} &rarr;
        </Link>
    </div>
</template>
