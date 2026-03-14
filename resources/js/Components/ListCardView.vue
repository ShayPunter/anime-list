<script setup lang="ts">
import type { ListEntryResource } from '@/types'
import { LIST_STATUS_LABELS } from '@/types'

defineProps<{
    entries: ListEntryResource[]
    readonly?: boolean
}>()

const emit = defineEmits<{
    edit: [entry: ListEntryResource]
}>()

function displayTitle(entry: ListEntryResource): string {
    return entry.anime?.title_english || entry.anime?.title_romaji || 'Unknown'
}
</script>

<template>
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        <div
            v-for="entry in entries"
            :key="entry.id"
            class="group relative overflow-hidden rounded-lg bg-gray-800"
        >
            <Link
                v-if="entry.anime"
                :href="entry.anime?.slug ? route('anime.show', { anime: entry.anime.slug }) : '#'"
                class="block"
            >
                <img
                    v-if="entry.anime.cover_image_large || entry.anime.cover_image_medium"
                    :src="(entry.anime.cover_image_large || entry.anime.cover_image_medium)!"
                    :alt="displayTitle(entry)"
                    class="aspect-[3/4] w-full object-cover"
                    loading="lazy"
                />
                <div v-else class="aspect-[3/4] w-full bg-gray-700 flex items-center justify-center">
                    <span class="text-gray-500 text-xs">No image</span>
                </div>
            </Link>

            <!-- Overlay -->
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/95 via-gray-900/70 to-transparent p-2 pt-8">
                <p class="text-xs font-medium text-gray-200 line-clamp-2 mb-1">
                    {{ displayTitle(entry) }}
                </p>
                <div class="flex items-center justify-between">
                    <span class="text-[10px] text-gray-400">
                        {{ LIST_STATUS_LABELS[entry.status] }}
                    </span>
                    <span v-if="entry.display_score" class="text-[10px] text-primary-400">
                        {{ entry.display_score }}
                    </span>
                </div>
                <div class="text-[10px] text-gray-500 mt-0.5">
                    {{ entry.progress }}{{ entry.anime?.episodes ? ` / ${entry.anime.episodes}` : '' }} eps
                </div>
            </div>

            <!-- Edit button -->
            <button
                v-if="!readonly"
                class="absolute top-1 right-1 rounded bg-gray-900/80 p-1 text-gray-400 opacity-0 group-hover:opacity-100 transition hover:text-gray-200"
                @click.stop="emit('edit', entry)"
            >
                <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
            </button>
        </div>
    </div>
    <p v-if="entries.length === 0" class="py-8 text-center text-gray-500">
        No entries found.
    </p>
</template>
