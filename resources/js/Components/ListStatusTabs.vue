<script setup lang="ts">
import type { ListStatus } from '@/types'
import { LIST_STATUS_LABELS } from '@/types'

defineProps<{
    activeStatus: ListStatus | 'all'
    counts: Record<string, number>
}>()

const emit = defineEmits<{
    change: [status: ListStatus | 'all']
}>()

const statuses: (ListStatus | 'all')[] = ['all', 'watching', 'completed', 'plan_to_watch', 'on_hold', 'dropped']

function label(status: ListStatus | 'all'): string {
    return status === 'all' ? 'All' : LIST_STATUS_LABELS[status]
}

function count(status: ListStatus | 'all', counts: Record<string, number>): number {
    if (status === 'all') {
        return Object.values(counts).reduce((sum, c) => sum + c, 0)
    }
    return counts[status] ?? 0
}
</script>

<template>
    <div class="flex gap-1 overflow-x-auto border-b border-gray-800 pb-px">
        <button
            v-for="s in statuses"
            :key="s"
            class="flex items-center gap-1.5 whitespace-nowrap px-4 py-2 text-sm font-medium transition"
            :class="activeStatus === s
                ? 'border-b-2 border-primary-400 text-primary-400'
                : 'text-gray-400 hover:text-gray-200'"
            @click="emit('change', s)"
        >
            {{ label(s) }}
            <span class="text-xs text-gray-500">({{ count(s, counts) }})</span>
        </button>
    </div>
</template>
