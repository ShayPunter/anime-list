<script setup lang="ts">
defineProps<{
    viewMode?: 'grid' | 'list'
}>()
</script>

<template>
    <div v-if="viewMode !== 'list'" class="animate-pulse space-y-2">
        <div class="aspect-[3/4] rounded-lg bg-gray-800" />
        <div class="h-4 w-3/4 rounded bg-gray-800" />
        <div class="h-3 w-1/2 rounded bg-gray-800" />
    </div>
    <div v-else class="flex animate-pulse gap-4">
        <div class="h-24 w-16 shrink-0 rounded-md bg-gray-800" />
        <div class="flex flex-1 flex-col justify-center gap-2">
            <div class="h-4 w-3/4 rounded bg-gray-800" />
            <div class="h-3 w-1/2 rounded bg-gray-800" />
        </div>
    </div>
</template>
