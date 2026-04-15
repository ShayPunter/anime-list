<script setup lang="ts">
import { ref, watch } from 'vue';
import { searchAnime, ApiClientError } from '@/lib/api';
import type { AnimeCard } from '@/types/api';
import SearchResultCard from '../components/SearchResultCard.vue';

const query = ref('');
const results = ref<AnimeCard[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

let debounceHandle: ReturnType<typeof setTimeout> | null = null;

watch(query, (value) => {
    if (debounceHandle) clearTimeout(debounceHandle);
    const trimmed = value.trim();
    if (trimmed.length < 2) {
        results.value = [];
        loading.value = false;
        error.value = null;
        return;
    }

    loading.value = true;
    debounceHandle = setTimeout(async () => {
        try {
            const response = await searchAnime(trimmed, 15);
            results.value = response.data;
            error.value = null;
        } catch (err) {
            error.value = err instanceof ApiClientError ? err.message : 'Search failed.';
            results.value = [];
        } finally {
            loading.value = false;
        }
    }, 250);
});
</script>

<template>
    <div class="search">
        <div class="search-bar">
            <input
                v-model="query"
                type="search"
                placeholder="Search anime…"
                autofocus
            />
        </div>

        <div v-if="loading" class="empty">Searching…</div>
        <div v-else-if="error" class="empty error">{{ error }}</div>
        <div v-else-if="query.trim().length < 2" class="empty">
            Type at least 2 characters to search.
        </div>
        <div v-else-if="results.length === 0" class="empty">No results.</div>
        <ul v-else class="list">
            <li v-for="anime in results" :key="anime.id">
                <SearchResultCard :anime="anime" />
            </li>
        </ul>
    </div>
</template>

<style scoped>
.search-bar {
    padding: 8px;
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    background: var(--bg);
    z-index: 1;
}
.search-bar input {
    width: 100%;
    padding: 8px 10px;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-radius: 6px;
    outline: none;
}
.search-bar input:focus {
    border-color: var(--accent);
}
.list {
    list-style: none;
    margin: 0;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}
</style>
