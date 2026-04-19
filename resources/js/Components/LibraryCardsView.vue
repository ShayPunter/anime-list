<script setup lang="ts">
import type { ListEntryResource } from '@/types'
import { LIST_STATUS_LABELS } from '@/types'
import { statusDotClass } from '@/composables/useLibraryTheme'

defineProps<{
    entries: ListEntryResource[]
}>()

const emit = defineEmits<{
    edit: [entry: ListEntryResource]
    progress: [entry: ListEntryResource, delta: number]
}>()

function displayTitle(entry: ListEntryResource): string {
    return entry.anime?.title_english || entry.anime?.title_romaji || 'Unknown'
}

function canIncrement(entry: ListEntryResource): boolean {
    const total = entry.anime?.episodes
    return total == null || entry.progress < total
}

function progressPercent(entry: ListEntryResource): number {
    const total = entry.anime?.episodes
    if (!total) return 0
    return Math.min(100, Math.max(0, (entry.progress / total) * 100))
}
</script>

<template>
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        <div v-for="e in entries" :key="e.id" class="group">
            <Link
                v-if="e.anime"
                :href="e.anime.slug ? route('anime.show', { anime: e.anime.slug }) : '#'"
                class="relative block aspect-[2/3] overflow-hidden rounded-lg bg-gray-800 shadow-sm"
                :style="{ backgroundColor: e.anime.cover_image_color || undefined }"
            >
                <img
                    v-if="e.anime.cover_image_large || e.anime.cover_image_medium"
                    :src="(e.anime.cover_image_large || e.anime.cover_image_medium)!"
                    :alt="displayTitle(e)"
                    loading="lazy"
                    class="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                />

                <!-- gradient scrim -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <!-- top-left status pill -->
                <div class="absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                    <span class="h-1.5 w-1.5 rounded-full" :class="statusDotClass(e.status)" />
                    {{ LIST_STATUS_LABELS[e.status] }}
                </div>

                <!-- top-right score -->
                <div
                    v-if="e.display_score"
                    class="absolute right-2 top-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur"
                >
                    ★ {{ e.display_score }}
                </div>

                <!-- bottom title + progress -->
                <div class="absolute inset-x-2.5 bottom-2.5 text-white">
                    <p class="mb-1.5 line-clamp-2 text-sm font-medium leading-tight drop-shadow">
                        {{ displayTitle(e) }}
                    </p>
                    <div class="flex items-center gap-1.5 text-[10px] opacity-90">
                        <span class="font-mono">{{ e.progress }}/{{ e.anime?.episodes ?? '?' }}</span>
                        <div class="h-0.5 flex-1 overflow-hidden rounded-full bg-white/20">
                            <div class="h-full bg-white" :style="{ width: `${progressPercent(e)}%` }" />
                        </div>
                    </div>
                </div>
            </Link>

            <!-- quick actions -->
            <div class="mt-2 flex items-center gap-1">
                <button
                    class="flex flex-1 items-center justify-center gap-1 rounded-md border border-gray-700 bg-gray-800 px-2 py-1 text-[11px] font-medium transition hover:border-primary-400 hover:text-primary-400 disabled:cursor-default disabled:text-gray-500 disabled:hover:border-gray-700 disabled:hover:text-gray-500"
                    :disabled="!canIncrement(e)"
                    :title="canIncrement(e) ? 'Add one episode' : 'Already at total episode count'"
                    @click="emit('progress', e, 1)"
                >
                    <svg viewBox="0 0 20 20" fill="currentColor" class="h-3 w-3">
                        <path d="M10 3a1 1 0 011 1v5h5a1 1 0 010 2h-5v5a1 1 0 01-2 0v-5H4a1 1 0 010-2h5V4a1 1 0 011-1z" />
                    </svg>
                    EP {{ e.progress + 1 }}
                </button>
                <button
                    class="rounded-md border border-gray-700 bg-gray-800 px-2 py-1 text-gray-400 transition hover:border-gray-600 hover:text-gray-200"
                    title="Edit entry"
                    @click="emit('edit', e)"
                >
                    <svg viewBox="0 0 20 20" fill="currentColor" class="h-3.5 w-3.5">
                        <circle cx="4" cy="10" r="1.5" />
                        <circle cx="10" cy="10" r="1.5" />
                        <circle cx="16" cy="10" r="1.5" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>
