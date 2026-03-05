<script setup lang="ts">
import { ref } from 'vue'
import type { AnimeCard, ListEntryResource } from '@/types'
import { LIST_STATUS_LABELS } from '@/types'
import ListEntryModal from '@/Components/ListEntryModal.vue'
import Button from 'primevue/button'

const props = defineProps<{
    anime: AnimeCard
    initialEntry: ListEntryResource | null
}>()

const showModal = ref(false)
const currentEntry = ref<ListEntryResource | null>(props.initialEntry)

function onSaved() {
    showModal.value = false
    // The page will be refreshed by Inertia query invalidation
}

function onDeleted() {
    showModal.value = false
    currentEntry.value = null
}
</script>

<template>
    <div>
        <Button
            v-if="!currentEntry"
            label="Add to List"
            class="w-full"
            @click="showModal = true"
        />
        <button
            v-else
            class="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition flex items-center justify-between"
            @click="showModal = true"
        >
            <span>{{ LIST_STATUS_LABELS[currentEntry.status] }}</span>
            <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
        </button>

        <ListEntryModal
            v-if="showModal"
            :anime="anime"
            :entry="currentEntry"
            @close="showModal = false"
            @saved="onSaved"
            @deleted="onDeleted"
        />
    </div>
</template>
