<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    name: string
    avatarUrl?: string | null
    size?: 'sm' | 'md' | 'lg'
}>(), {
    avatarUrl: null,
    size: 'md',
})

const sizeClasses = computed(() => {
    switch (props.size) {
        case 'sm': return 'w-8 h-8 text-xs'
        case 'lg': return 'w-20 h-20 text-2xl'
        default: return 'w-10 h-10 text-sm'
    }
})

const initials = computed(() => {
    return props.name
        .split(/\s+/)
        .slice(0, 2)
        .map(w => w[0]?.toUpperCase() ?? '')
        .join('')
})

const bgColor = computed(() => {
    let hash = 0
    for (const char of props.name) {
        hash = char.charCodeAt(0) + ((hash << 5) - hash)
    }
    const hue = Math.abs(hash) % 360
    return `hsl(${hue}, 50%, 40%)`
})
</script>

<template>
    <img
        v-if="avatarUrl"
        :src="avatarUrl"
        :alt="name"
        :class="['rounded-full object-cover', sizeClasses]"
    />
    <div
        v-else
        :class="['rounded-full flex items-center justify-center font-semibold text-white', sizeClasses]"
        :style="{ backgroundColor: bgColor }"
    >
        {{ initials }}
    </div>
</template>
