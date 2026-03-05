<script setup lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue'
import AnimeCard from '@/Components/AnimeCard.vue'
import { useAnimeSearch } from '@/composables/useAnimeSearch'
import { onMounted } from 'vue'

defineOptions({ layout: AppLayout })

const { query, results, total, isLoading } = useAnimeSearch()

onMounted(() => {
    const params = new URLSearchParams(window.location.search)
    const q = params.get('q')
    if (q) {
        query.value = q
    }
})
</script>

<template>
    <Head title="Search" />

    <div class="mx-auto max-w-4xl space-y-6">
        <h1 class="text-2xl font-bold text-gray-100">Search Anime</h1>

        <input
            v-model="query"
            type="text"
            placeholder="Search by title..."
            class="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-gray-200 placeholder-gray-500 outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            autofocus
        />

        <div v-if="isLoading && query.length >= 2" class="py-8 text-center text-gray-500">
            Searching...
        </div>

        <div v-else-if="query.length >= 2 && results.length === 0" class="py-8 text-center text-gray-500">
            No results found for "{{ query }}"
        </div>

        <div v-else-if="results.length">
            <p class="mb-4 text-sm text-gray-400">{{ total }} results for "{{ query }}"</p>
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                <AnimeCard
                    v-for="anime in results"
                    :key="anime.id ?? anime.anilist_id"
                    :anime="anime"
                    view-mode="grid"
                />
            </div>
        </div>

        <div v-else class="py-8 text-center text-gray-500">
            Type at least 2 characters to search.
        </div>
    </div>
</template>
