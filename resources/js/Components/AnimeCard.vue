<script setup lang="ts">
import { computed } from 'vue'
import type { AnimeCard } from '@/types/anime'
import ScoreBadge from './ScoreBadge.vue'
import GenreBadge from './GenreBadge.vue'

const props = defineProps<{
    anime: AnimeCard
    viewMode?: 'grid' | 'list'
}>()

const mode = computed(() => props.viewMode ?? 'grid')

function formatLabel(format: string | null): string {
    if (!format) return ''
    return format.replace(/_/g, ' ')
}

function episodeText(anime: AnimeCard): string {
    if (!anime.episodes) return ''
    return `${anime.episodes} ep`
}

function displayTitle(anime: AnimeCard): string {
    return anime.title_english || anime.title_romaji
}

function animeUrl(anime: AnimeCard): string {
    if (anime.slug) {
        return route('anime.show', { anime: anime.slug })
    }
    if (anime.anilist_id) {
        return route('anime.show.anilist', { anilistId: anime.anilist_id })
    }
    return '#'
}
</script>

<template>
    <Link
        :href="animeUrl(anime)"
        class="group block"
        :class="mode === 'list' ? 'flex gap-4' : ''"
    >
        <!-- Grid Mode -->
        <div v-if="mode === 'grid'" class="space-y-2">
            <div class="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-800">
                <img
                    v-if="anime.cover_image_large || anime.cover_image_medium"
                    :src="(anime.cover_image_large || anime.cover_image_medium) ?? undefined"
                    :alt="displayTitle(anime)"
                    class="h-full w-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                />
                <div v-else class="flex h-full items-center justify-center text-gray-600">
                    <span class="text-4xl">?</span>
                </div>
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <ScoreBadge :score="anime.average_score" size="sm" />
                </div>
                <div v-if="anime.next_airing_episode" class="absolute top-2 right-2">
                    <span class="rounded bg-primary-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        EP {{ anime.next_airing_episode.episode }}
                    </span>
                </div>
            </div>
            <div>
                <h3 class="line-clamp-2 text-sm font-medium text-gray-200 group-hover:text-primary-400 transition">
                    {{ displayTitle(anime) }}
                </h3>
                <div class="mt-1 flex items-center gap-2 text-xs text-gray-500">
                    <span v-if="anime.format">{{ formatLabel(anime.format) }}</span>
                    <span v-if="anime.format && anime.episodes" class="text-gray-700">&middot;</span>
                    <span v-if="anime.episodes">{{ episodeText(anime) }}</span>
                </div>
            </div>
        </div>

        <!-- List Mode -->
        <template v-else>
            <div class="h-24 w-16 shrink-0 overflow-hidden rounded-md bg-gray-800">
                <img
                    v-if="anime.cover_image_medium"
                    :src="anime.cover_image_medium"
                    :alt="displayTitle(anime)"
                    class="h-full w-full object-cover"
                    loading="lazy"
                />
            </div>
            <div class="flex min-w-0 flex-1 flex-col justify-center gap-1">
                <h3 class="truncate text-sm font-medium text-gray-200 group-hover:text-primary-400 transition">
                    {{ displayTitle(anime) }}
                </h3>
                <div class="flex items-center gap-2 text-xs text-gray-500">
                    <span v-if="anime.format">{{ formatLabel(anime.format) }}</span>
                    <span v-if="anime.episodes">{{ episodeText(anime) }}</span>
                    <ScoreBadge :score="anime.average_score" size="sm" />
                </div>
                <div class="flex flex-wrap gap-1">
                    <GenreBadge v-for="genre in anime.genres.slice(0, 3)" :key="genre.id" :name="genre.name" />
                </div>
            </div>
        </template>
    </Link>
</template>
