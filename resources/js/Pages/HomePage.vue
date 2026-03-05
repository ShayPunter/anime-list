<script setup lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue'
import AnimeHeroSection from '@/Components/AnimeHeroSection.vue'
import SearchBar from '@/Components/SearchBar.vue'
import DashboardStatsBar from '@/Components/DashboardStatsBar.vue'
import ContinueWatchingRow from '@/Components/ContinueWatchingRow.vue'
import AiringTodaySection from '@/Components/AiringTodaySection.vue'
import type { AnimeCard, AnimeSeason } from '@/types/anime'
import type { ListEntryResource } from '@/types/list'
import type { ScheduleSlot } from '@/types/schedule'

defineOptions({ layout: AppLayout })

interface DashboardStats {
    totalAnime: number
    episodesWatched: number
    avgScore: number | null
    watchingCount: number
}

const props = defineProps<{
    seasonalShowcase: AnimeCard[]
    airingNow: AnimeCard[]
    currentSeason: AnimeSeason
    currentYear: number
    isAuthenticated: boolean
    stats?: DashboardStats
    airingToday?: ScheduleSlot[]
    continueWatching?: ListEntryResource[]
}>()

function seasonLabel(season: string): string {
    return season.charAt(0) + season.slice(1).toLowerCase()
}
</script>

<template>
    <Head :title="isAuthenticated ? 'Dashboard' : 'Home'" />

    <div class="space-y-10">
        <!-- Landing: Hero search (anonymous only) -->
        <section v-if="!isAuthenticated" class="py-8 text-center">
            <h1 class="mb-2 text-4xl font-bold text-gray-100">Welcome to AniTrack</h1>
            <p class="mb-6 text-gray-400">Discover and track your favorite anime.</p>
            <div class="mx-auto max-w-lg">
                <SearchBar />
            </div>
        </section>

        <!-- Dashboard: Stats + personalized sections (authenticated only) -->
        <template v-if="isAuthenticated && stats">
            <DashboardStatsBar
                :total-anime="stats.totalAnime"
                :episodes-watched="stats.episodesWatched"
                :avg-score="stats.avgScore"
                :watching-count="stats.watchingCount"
            />

            <AiringTodaySection
                v-if="airingToday && airingToday.length"
                :slots="airingToday"
            />

            <ContinueWatchingRow
                v-if="continueWatching && continueWatching.length"
                :entries="continueWatching"
            />
        </template>

        <!-- Shared: Seasonal Showcase -->
        <AnimeHeroSection
            :anime="seasonalShowcase"
            :title="`${seasonLabel(currentSeason)} ${currentYear} Anime`"
            :see-all-route="route('seasonal', { year: currentYear, season: currentSeason.toLowerCase() })"
        />

        <!-- Shared: Currently Airing -->
        <AnimeHeroSection
            :anime="airingNow"
            title="Currently Airing"
            :see-all-route="route('anime.index', { 'filter[status]': 'RELEASING', sort: '-popularity' })"
        />
    </div>
</template>
