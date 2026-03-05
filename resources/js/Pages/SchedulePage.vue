<script setup lang="ts">
import { computed } from 'vue'
import { router } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/AppLayout.vue'
import ScheduleDayColumn from '@/Components/ScheduleDayColumn.vue'
import type { ScheduleDayMap } from '@/types/schedule'

defineOptions({ layout: AppLayout })

const props = defineProps<{
    days: ScheduleDayMap
    weekOffset: number
    weekStart: string
    weekEnd: string
    watchingOnly: boolean
    isAuth: boolean
}>()

const orderedDays = computed(() => {
    const result: Array<{ utcDate: string; isToday: boolean }> = []
    const todayUtc = new Date().toISOString().slice(0, 10)
    for (let i = 0; i < 7; i++) {
        const d = new Date(props.weekStart)
        d.setUTCDate(d.getUTCDate() + i)
        const utcDate = d.toISOString().slice(0, 10)
        result.push({
            utcDate,
            isToday: utcDate === todayUtc,
        })
    }
    return result
})

function navigate(offset: number) {
    router.get(
        route('schedule'),
        {
            week: offset || undefined,
            watching_only: props.watchingOnly ? '1' : undefined,
        },
        { preserveScroll: false },
    )
}

function toggleWatchingOnly() {
    router.get(
        route('schedule'),
        {
            week: props.weekOffset || undefined,
            watching_only: props.watchingOnly ? undefined : '1',
        },
        { preserveScroll: true },
    )
}
</script>

<template>
    <Head title="Airing Schedule" />

    <div class="space-y-6">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 class="text-2xl font-bold text-gray-100">Airing Schedule</h1>
            <div class="flex items-center gap-3">
                <button
                    v-if="isAuth"
                    class="rounded-lg border px-3 py-1.5 text-sm transition"
                    :class="watchingOnly
                        ? 'border-primary-500 bg-primary-600/20 text-primary-400'
                        : 'border-gray-700 bg-gray-900 text-gray-400 hover:text-gray-200'"
                    @click="toggleWatchingOnly"
                >
                    My Watching Only
                </button>

                <div class="flex items-center gap-1">
                    <button
                        :disabled="weekOffset === 0"
                        class="rounded-lg border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-gray-400 transition hover:text-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
                        @click="navigate(0)"
                    >
                        This Week
                    </button>
                    <button
                        :disabled="weekOffset === 1"
                        class="rounded-lg border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-gray-400 transition hover:text-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
                        @click="navigate(1)"
                    >
                        Next Week
                    </button>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7">
            <ScheduleDayColumn
                v-for="day in orderedDays"
                :key="day.utcDate"
                :utc-date="day.utcDate"
                :slots="days[day.utcDate] ?? []"
                :is-today="day.isToday"
            />
        </div>

        <div
            v-if="!Object.keys(days).length"
            class="py-16 text-center text-gray-500"
        >
            <p>No episodes scheduled for this week.</p>
        </div>
    </div>
</template>
