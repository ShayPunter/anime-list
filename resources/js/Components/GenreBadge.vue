<script setup lang="ts">
defineProps<{
    name: string
}>()
</script>

<template>
    <Link
        :href="route('anime.index', { 'filter[genre]': name })"
        class="inline-block rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300 transition hover:bg-primary-600/20 hover:text-primary-400"
    >
        {{ name }}
    </Link>
</template>
