<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { listEntries, ApiClientError } from '@/lib/api';
import type { ListEntry } from '@/types/api';
import ListEntryCard from '../components/ListEntryCard.vue';

const entries = ref<ListEntry[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

async function load() {
    loading.value = true;
    error.value = null;
    try {
        const response = await listEntries('watching');
        entries.value = response.data;
    } catch (err) {
        error.value = err instanceof ApiClientError ? err.message : 'Failed to load list.';
    } finally {
        loading.value = false;
    }
}

function onEntryUpdated(updated: ListEntry) {
    const idx = entries.value.findIndex((e) => e.id === updated.id);
    if (idx !== -1) {
        // If the entry was auto-completed by the backend, drop it from the
        // "watching" view so the list reflects current status.
        if (updated.status !== 'watching') entries.value.splice(idx, 1);
        else entries.value[idx] = updated;
    }
}

function onEntryRemoved(entryId: number) {
    entries.value = entries.value.filter((e) => e.id !== entryId);
}

onMounted(load);
</script>

<template>
    <div class="watching">
        <div v-if="loading" class="empty">Loading your list…</div>
        <div v-else-if="error" class="empty error">{{ error }}</div>
        <div v-else-if="entries.length === 0" class="empty">
            Nothing in progress. Switch to the Search tab to add something.
        </div>
        <ul v-else class="list">
            <li v-for="entry in entries" :key="entry.id">
                <ListEntryCard
                    :entry="entry"
                    @updated="onEntryUpdated"
                    @removed="onEntryRemoved"
                />
            </li>
        </ul>
    </div>
</template>

<style scoped>
.list {
    list-style: none;
    margin: 0;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}
</style>
