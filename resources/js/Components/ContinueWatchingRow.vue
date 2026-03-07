<script setup lang="ts">
import type { ListEntryResource } from '@/types/list'

defineProps<{
    entries: ListEntryResource[]
}>()

function displayTitle(entry: ListEntryResource): string {
    return entry.anime?.title_english || entry.anime?.title_romaji || 'Unknown'
}

function progressPercent(entry: ListEntryResource): number {
    const total = entry.anime?.episodes
    if (!total || total === 0) return 0
    return Math.min(100, Math.round((entry.progress / total) * 100))
}
</script>

<template>
    <section v-if="entries.length">
        <div class="mb-3 flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-100">Continue Watching</h2>
            <Link :href="route('list')" class="text-sm text-primary-400 hover:text-primary-300 transition">
                My List &rarr;
            </Link>
        </div>
        <div class="flex gap-3 overflow-x-auto pb-2">
            <Link
                v-for="entry in entries"
                :key="entry.id"
                :href="entry.anime?.slug ? route('anime.show', { anime: entry.anime.slug }) : '#'"
                class="group w-32 shrink-0"
            >
                <div class="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-800">
                    <img
                        v-if="entry.anime?.cover_image_large || entry.anime?.cover_image_medium"
                        :src="(entry.anime.cover_image_large || entry.anime.cover_image_medium) ?? undefined"
                        :alt="displayTitle(entry)"
                        class="h-full w-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                    />
                    <div class="absolute bottom-0 left-0 right-0">
                        <div class="h-1 bg-gray-700">
                            <div
                                class="h-1 bg-primary-500 transition-all"
                                :style="{ width: `${progressPercent(entry)}%` }"
                            />
                        </div>
                    </div>
                    <div class="absolute top-1.5 right-1.5">
                        <span class="rounded bg-gray-900/80 px-1 py-0.5 text-[9px] font-medium text-gray-300">
                            {{ entry.progress }}/{{ entry.anime?.episodes ?? '?' }}
                        </span>
                    </div>
                </div>
                <p class="mt-1.5 line-clamp-2 text-xs font-medium text-gray-300 group-hover:text-primary-400 transition">
                    {{ displayTitle(entry) }}
                </p>
            </Link>
        </div>
    </section>
</template>
