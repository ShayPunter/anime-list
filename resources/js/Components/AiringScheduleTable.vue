<script setup lang="ts">
import type { AiringScheduleEntry } from '@/types/anime'
import { useCountdown } from '@/composables/useCountdown'

defineProps<{
    schedules: AiringScheduleEntry[]
}>()

const { formatCountdown, formatLocalDate } = useCountdown()
</script>

<template>
    <div v-if="schedules.length" class="space-y-3">
        <h3 class="text-lg font-semibold text-gray-100">Upcoming Episodes</h3>
        <div class="overflow-hidden rounded-lg border border-gray-800">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-gray-800 bg-gray-900/50">
                        <th class="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Episode</th>
                        <th class="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Date</th>
                        <th class="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-400">Countdown</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="schedule in schedules"
                        :key="schedule.id"
                        class="border-b border-gray-800/50 last:border-0"
                    >
                        <td class="px-4 py-2.5 text-gray-200">EP {{ schedule.episode }}</td>
                        <td class="px-4 py-2.5 text-gray-400">{{ formatLocalDate(schedule.airs_at) }}</td>
                        <td class="px-4 py-2.5 text-right text-primary-400 font-medium">
                            {{ formatCountdown(schedule.airs_at) }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
