<script setup lang="ts">
defineProps<{
    totalAnime: number
    episodesWatched: number
    avgScore: number | null
    watchingCount: number
}>()
</script>

<template>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div class="rounded-lg border border-gray-800 bg-gray-900/50 p-4 text-center">
            <p class="text-2xl font-bold text-gray-100">{{ totalAnime }}</p>
            <p class="mt-1 text-xs text-gray-500">Total Anime</p>
        </div>
        <div class="rounded-lg border border-gray-800 bg-gray-900/50 p-4 text-center">
            <p class="text-2xl font-bold text-gray-100">{{ episodesWatched }}</p>
            <p class="mt-1 text-xs text-gray-500">Episodes Watched</p>
        </div>
        <div class="rounded-lg border border-gray-800 bg-gray-900/50 p-4 text-center">
            <p class="text-2xl font-bold text-gray-100">
                {{ avgScore !== null ? avgScore.toFixed(1) : '-' }}
            </p>
            <p class="mt-1 text-xs text-gray-500">Avg Score</p>
        </div>
        <div class="rounded-lg border border-gray-800 bg-gray-900/50 p-4 text-center">
            <p class="text-2xl font-bold text-primary-400">{{ watchingCount }}</p>
            <p class="mt-1 text-xs text-gray-500">Watching</p>
        </div>
    </div>
</template>
