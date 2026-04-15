<script setup lang="ts">
import { ref } from 'vue';
import { addToList, ApiClientError, titleFor } from '@/lib/api';
import type { AnimeCard, ListStatus } from '@/types/api';

const props = defineProps<{ anime: AnimeCard }>();

const busy = ref(false);
const added = ref<ListStatus | null>(null);
const error = ref<string | null>(null);

async function add(status: ListStatus) {
    busy.value = true;
    error.value = null;
    try {
        await addToList({ anime_id: props.anime.id, status });
        added.value = status;
    } catch (err) {
        if (err instanceof ApiClientError && err.status === 422) {
            // Likely already on the list — surface a friendly message.
            error.value = err.message || 'Already on your list.';
        } else {
            error.value = err instanceof ApiClientError ? err.message : 'Failed to add.';
        }
    } finally {
        busy.value = false;
    }
}
</script>

<template>
    <article class="card">
        <img
            v-if="anime.cover_image_medium"
            :src="anime.cover_image_medium"
            :alt="titleFor(anime)"
            class="cover"
        />
        <div class="cover placeholder" v-else></div>

        <div class="body">
            <div class="title" :title="titleFor(anime)">{{ titleFor(anime) }}</div>
            <div class="meta muted">
                <span v-if="anime.format">{{ anime.format }}</span>
                <span v-if="anime.episodes">· {{ anime.episodes }} ep</span>
                <span v-if="anime.season_year">· {{ anime.season_year }}</span>
            </div>

            <div v-if="added" class="added-msg">
                Added to {{ added.replace('_', ' ') }}.
            </div>
            <div v-else class="actions">
                <button class="btn" :disabled="busy" @click="add('watching')">+ Watching</button>
                <button
                    class="btn-secondary"
                    :disabled="busy"
                    @click="add('plan_to_watch')"
                >
                    + Plan
                </button>
            </div>

            <p v-if="error" class="error">{{ error }}</p>
        </div>
    </article>
</template>

<style scoped>
.card {
    display: flex;
    gap: 10px;
    padding: 8px;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-radius: 8px;
}
.cover {
    width: 52px;
    height: 74px;
    object-fit: cover;
    border-radius: 4px;
    flex-shrink: 0;
    background: var(--border);
}
.body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.title {
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.meta {
    font-size: 11px;
}
.actions {
    display: flex;
    gap: 6px;
    margin-top: 4px;
}
.actions .btn,
.actions .btn-secondary {
    padding: 4px 10px;
    font-size: 12px;
    border-radius: 5px;
}
.btn-secondary {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--fg);
}
.btn-secondary:hover:not(:disabled) {
    background: var(--border);
}
.added-msg {
    font-size: 12px;
    color: var(--success);
    margin-top: 4px;
}
</style>
