<script setup lang="ts">
const props = defineProps<{
    score?: number | null
    size?: 'sm' | 'md' | 'lg'
}>()

const sizeClass = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
}[props.size ?? 'md']

function scoreColor(score: number): string {
    if (score >= 8) return 'bg-green-600/20 text-green-400 border-green-600/30'
    if (score >= 7) return 'bg-lime-600/20 text-lime-400 border-lime-600/30'
    if (score >= 6) return 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30'
    if (score >= 5) return 'bg-orange-600/20 text-orange-400 border-orange-600/30'
    return 'bg-red-600/20 text-red-400 border-red-600/30'
}
</script>

<template>
    <span
        v-if="score != null"
        :class="[scoreColor(score), sizeClass]"
        class="inline-flex items-center rounded-md border font-semibold"
    >
        {{ score.toFixed(1) }}
    </span>
</template>
