<script setup lang="ts">
import type { AnimeRelationEntry } from '@/types/anime'

defineProps<{
    relations: AnimeRelationEntry[]
}>()

function relationLabel(type: string): string {
    return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}
</script>

<template>
    <div v-if="relations.length" class="space-y-3">
        <h3 class="text-lg font-semibold text-gray-100">Relations</h3>
        <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700">
            <Link
                v-for="rel in relations"
                :key="rel.id"
                :href="rel.related_anime ? route('anime.show', { anime: rel.related_anime.id }) : '#'"
                class="group flex-shrink-0 w-36"
            >
                <div class="aspect-[3/4] overflow-hidden rounded-lg bg-gray-800">
                    <img
                        v-if="rel.related_anime?.cover_image_medium"
                        :src="rel.related_anime.cover_image_medium"
                        :alt="rel.related_anime?.title_english || rel.related_anime?.title_romaji"
                        class="h-full w-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                    />
                </div>
                <p class="mt-1.5 line-clamp-2 text-xs font-medium text-gray-300 group-hover:text-primary-400 transition">
                    {{ rel.related_anime?.title_english || rel.related_anime?.title_romaji || 'Unknown' }}
                </p>
                <p class="text-[10px] text-gray-500">{{ relationLabel(rel.relation_type) }}</p>
            </Link>
        </div>
    </div>
</template>
