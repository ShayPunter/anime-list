<script setup lang="ts">
import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/AppLayout.vue'
import ScoreBadge from '@/Components/ScoreBadge.vue'
import GenreBadge from '@/Components/GenreBadge.vue'
import SeasonsSection from '@/Components/SeasonsSection.vue'
import RelatedAnimeRow from '@/Components/RelatedAnimeRow.vue'
import AiringScheduleTable from '@/Components/AiringScheduleTable.vue'
import AddToListButton from '@/Components/AddToListButton.vue'
import type { AnimeDetail, SeasonEntry } from '@/types/anime'
import type { ListEntryResource, User } from '@/types'

defineOptions({ layout: AppLayout })

interface OgMeta {
    title: string
    description: string
    image: string | null
    url: string
}

const props = defineProps<{
    anime: AnimeDetail
    list_entry: ListEntryResource | null
    seasons: SeasonEntry[]
    og: OgMeta
}>()

const page = usePage<{ auth: { user: User | null } }>()
const isAuthenticated = computed(() => !!page.props.auth.user)

function displayTitle(anime: AnimeDetail): string {
    return anime.title_english || anime.title_romaji
}

function formatLabel(format: string | null): string {
    if (!format) return 'Unknown'
    return format.replace(/_/g, ' ')
}

function statusLabel(status: string | null): string {
    if (!status) return 'Unknown'
    const map: Record<string, string> = {
        FINISHED: 'Finished',
        RELEASING: 'Airing',
        NOT_YET_RELEASED: 'Not Yet Aired',
        CANCELLED: 'Cancelled',
        HIATUS: 'Hiatus',
    }
    return map[status] || status
}

function sourceLabel(source: string | null): string {
    if (!source) return 'Unknown'
    return source.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function seasonLabel(season: string | null, year: number | null): string {
    if (!season || !year) return 'Unknown'
    return `${season.charAt(0) + season.slice(1).toLowerCase()} ${year}`
}

function formatDate(dateStr: string | null): string {
    if (!dateStr) return '?'
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const mainStudios = props.anime.studios?.filter(s => s.is_main) ?? []
const otherStudios = props.anime.studios?.filter(s => !s.is_main) ?? []

function embedUrl(url: string): string | null {
    try {
        const parsed = new URL(url)
        if (parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be')) {
            const videoId = parsed.searchParams.get('v') || parsed.pathname.slice(1)
            return `https://www.youtube.com/embed/${videoId}`
        }
        if (parsed.hostname.includes('dailymotion.com')) {
            const videoId = parsed.pathname.split('/').pop()
            return `https://www.dailymotion.com/embed/video/${videoId}`
        }
        return null
    } catch {
        return null
    }
}
</script>

<template>
    <Head :title="displayTitle(anime)">
        <meta name="description" :content="og.description" />
        <link rel="canonical" :href="og.url" />
        <meta property="og:title" :content="og.title" />
        <meta property="og:description" :content="og.description" />
        <meta v-if="og.image" property="og:image" :content="og.image" />
        <meta property="og:url" :content="og.url" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" :content="og.title" />
        <meta name="twitter:description" :content="og.description" />
        <meta v-if="og.image" name="twitter:image" :content="og.image" />
    </Head>

    <div>
        <!-- Banner -->
        <div v-if="anime.banner_image" class="-mx-4 -mt-6 mb-6 h-48 overflow-hidden md:h-64">
            <img
                :src="anime.banner_image"
                :alt="displayTitle(anime)"
                class="h-full w-full object-cover"
            />
        </div>

        <div class="flex flex-col gap-6 md:flex-row">
            <!-- Left sidebar: Cover + metadata -->
            <div class="w-full shrink-0 md:w-56">
                <div class="overflow-hidden rounded-lg bg-gray-800" :class="{ '-mt-20 relative z-10': anime.banner_image }">
                    <img
                        v-if="anime.cover_image_large || anime.cover_image_medium"
                        :src="anime.cover_image_large || anime.cover_image_medium!"
                        :alt="displayTitle(anime)"
                        class="w-full"
                        loading="lazy"
                    />
                </div>

                <!-- Add to List -->
                <div v-if="isAuthenticated" class="mt-4">
                    <AddToListButton :anime="anime" :initial-entry="list_entry" />
                </div>

                <!-- Metadata cards -->
                <div class="mt-4 space-y-3 text-sm">
                    <div class="rounded-lg border border-gray-800 p-3 space-y-2">
                        <div class="flex items-start justify-between gap-3">
                            <span class="text-gray-500 shrink-0">Format</span>
                            <span class="text-gray-200 text-right">{{ formatLabel(anime.format) }}</span>
                        </div>
                        <div class="flex items-start justify-between gap-3">
                            <span class="text-gray-500 shrink-0">Episodes</span>
                            <span class="text-gray-200 text-right">{{ anime.episodes ?? '?' }}</span>
                        </div>
                        <div v-if="anime.duration" class="flex items-start justify-between gap-3">
                            <span class="text-gray-500 shrink-0">Duration</span>
                            <span class="text-gray-200 text-right">{{ anime.duration }} min</span>
                        </div>
                        <div class="flex items-start justify-between gap-3">
                            <span class="text-gray-500 shrink-0">Status</span>
                            <span class="text-gray-200 text-right">{{ statusLabel(anime.status) }}</span>
                        </div>
                        <div class="flex items-start justify-between gap-3">
                            <span class="text-gray-500 shrink-0">Season</span>
                            <span class="text-gray-200 text-right">{{ seasonLabel(anime.season, anime.season_year) }}</span>
                        </div>
                        <div v-if="anime.aired_from" class="flex items-start justify-between gap-3">
                            <span class="text-gray-500 shrink-0">Aired</span>
                            <span class="text-gray-200 text-right">{{ formatDate(anime.aired_from) }} – {{ formatDate(anime.aired_to) }}</span>
                        </div>
                        <div v-if="anime.source" class="flex items-start justify-between gap-3">
                            <span class="text-gray-500 shrink-0">Source</span>
                            <span class="text-gray-200 text-right">{{ sourceLabel(anime.source) }}</span>
                        </div>
                    </div>

                    <!-- Scores -->
                    <div class="rounded-lg border border-gray-800 p-3 space-y-2">
                        <div class="flex items-center justify-between gap-3">
                            <span class="text-gray-500 shrink-0">Score</span>
                            <ScoreBadge :score="anime.average_score" />
                        </div>
                        <div v-if="anime.mean_score" class="flex items-start justify-between gap-3">
                            <span class="text-gray-500 shrink-0">Mean</span>
                            <span class="text-gray-200 text-right">{{ anime.mean_score.toFixed(1) }}</span>
                        </div>
                        <div class="flex items-start justify-between gap-3">
                            <span class="text-gray-500 shrink-0">Popularity</span>
                            <span class="text-gray-200 text-right">#{{ anime.popularity?.toLocaleString() ?? '?' }}</span>
                        </div>
                        <div v-if="anime.favourites" class="flex items-start justify-between gap-3">
                            <span class="text-gray-500 shrink-0">Favourites</span>
                            <span class="text-gray-200 text-right">{{ anime.favourites.toLocaleString() }}</span>
                        </div>
                    </div>

                    <!-- Studios -->
                    <div v-if="mainStudios.length || otherStudios.length" class="rounded-lg border border-gray-800 p-3 space-y-2">
                        <div v-for="studio in mainStudios" :key="studio.id" class="flex items-start justify-between gap-3">
                            <span class="text-gray-500 shrink-0">Studio</span>
                            <span class="font-medium text-gray-200 text-right">{{ studio.name }}</span>
                        </div>
                        <div v-for="studio in otherStudios" :key="studio.id" class="flex items-start justify-between gap-3">
                            <span class="text-gray-500 shrink-0">Producer</span>
                            <span class="text-gray-300 text-right">{{ studio.name }}</span>
                        </div>
                    </div>

                    <!-- External Links -->
                    <div v-if="anime.external_ids?.length" class="rounded-lg border border-gray-800 p-3 space-y-1.5">
                        <h4 class="text-xs font-medium uppercase tracking-wider text-gray-400">External Links</h4>
                        <a
                            v-for="link in anime.external_ids"
                            :key="link.id"
                            :href="link.url ?? '#'"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="block text-xs text-primary-400 hover:text-primary-300 transition"
                        >
                            {{ link.platform }}
                        </a>
                    </div>
                </div>
            </div>

            <!-- Main content -->
            <div class="min-w-0 flex-1 space-y-6">
                <div>
                    <h1 class="text-2xl font-bold text-gray-100 md:text-3xl">
                        {{ displayTitle(anime) }}
                    </h1>
                    <p v-if="anime.title_english && anime.title_romaji !== anime.title_english" class="mt-1 text-gray-400">
                        {{ anime.title_romaji }}
                    </p>
                    <p v-if="anime.title_native" class="text-sm text-gray-500">{{ anime.title_native }}</p>
                </div>

                <!-- Genres -->
                <div v-if="anime.genres?.length" class="flex flex-wrap gap-2">
                    <GenreBadge v-for="genre in anime.genres" :key="genre.id" :name="genre.name" />
                </div>

                <!-- Seasons -->
                <SeasonsSection :seasons="seasons" />

                <!-- Synopsis -->
                <div v-if="anime.synopsis" class="prose prose-invert max-w-none">
                    <div v-html="anime.synopsis" />
                </div>

                <!-- Trailer -->
                <div v-if="anime.trailer_url && embedUrl(anime.trailer_url)">
                    <h3 class="mb-3 text-lg font-semibold text-gray-100">Trailer</h3>
                    <div class="aspect-video overflow-hidden rounded-lg">
                        <iframe
                            :src="embedUrl(anime.trailer_url)!"
                            class="h-full w-full"
                            allowfullscreen
                            loading="lazy"
                        />
                    </div>
                </div>

                <!-- Relations -->
                <RelatedAnimeRow :relations="anime.relations ?? []" />

                <!-- Airing Schedule -->
                <AiringScheduleTable :schedules="anime.airing_schedules ?? []" />
            </div>
        </div>
    </div>
</template>
