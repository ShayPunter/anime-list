<script setup lang="ts">
import { computed, ref } from 'vue';
import {
    ApiClientError,
    deleteEntry,
    incrementProgress,
    titleFor,
    updateEntry,
} from '@/lib/api';
import type { ListEntry, ListStatus } from '@/types/api';

const props = defineProps<{ entry: ListEntry }>();
const emit = defineEmits<{
    updated: [entry: ListEntry];
    removed: [entryId: number];
}>();

const busy = ref(false);
const error = ref<string | null>(null);
const expanded = ref(false);

const total = computed(() => props.entry.anime?.episodes ?? null);
const canIncrement = computed(() =>
    total.value === null ? true : props.entry.progress < total.value,
);

async function guarded(fn: () => Promise<ListEntry | void>) {
    busy.value = true;
    error.value = null;
    try {
        const result = await fn();
        if (result) emit('updated', result);
    } catch (err) {
        error.value = err instanceof ApiClientError ? err.message : 'Update failed.';
    } finally {
        busy.value = false;
    }
}

async function bump() {
    if (!canIncrement.value) return;
    await guarded(() => incrementProgress(props.entry));
}

async function changeStatus(status: ListStatus) {
    await guarded(() => updateEntry(props.entry.id, { status }));
}

async function setScore(raw: string) {
    const parsed = raw === '' ? null : Math.round(Number(raw) * 10);
    await guarded(() => updateEntry(props.entry.id, { score: parsed }));
}

async function remove() {
    busy.value = true;
    try {
        await deleteEntry(props.entry.id);
        emit('removed', props.entry.id);
    } catch (err) {
        error.value = err instanceof ApiClientError ? err.message : 'Remove failed.';
    } finally {
        busy.value = false;
    }
}
</script>

<template>
    <article class="card">
        <img
            v-if="entry.anime?.cover_image_medium"
            :src="entry.anime.cover_image_medium"
            :alt="titleFor(entry.anime)"
            class="cover"
        />
        <div class="cover placeholder" v-else></div>

        <div class="body">
            <div class="title" :title="titleFor(entry.anime)">{{ titleFor(entry.anime) }}</div>
            <div class="progress">
                <span>{{ entry.progress }} / {{ total ?? '?' }} ep</span>
                <span v-if="entry.display_score !== null" class="score">
                    ★ {{ entry.display_score }}
                </span>
            </div>

            <div class="actions">
                <button
                    class="btn"
                    :disabled="busy || !canIncrement"
                    :title="canIncrement ? 'Log one more episode' : 'All episodes watched'"
                    @click="bump"
                >
                    +1 ep
                </button>
                <button class="btn-ghost" @click="expanded = !expanded">
                    {{ expanded ? '▲' : '▼' }}
                </button>
            </div>

            <div v-if="expanded" class="details">
                <div class="field">
                    <label>Status</label>
                    <select
                        :value="entry.status"
                        :disabled="busy"
                        @change="(e) => changeStatus((e.target as HTMLSelectElement).value as ListStatus)"
                    >
                        <option value="watching">Watching</option>
                        <option value="completed">Completed</option>
                        <option value="on_hold">On Hold</option>
                        <option value="dropped">Dropped</option>
                        <option value="plan_to_watch">Plan to Watch</option>
                    </select>
                </div>
                <div class="field">
                    <label>Score (0–10)</label>
                    <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        :value="entry.display_score ?? ''"
                        :disabled="busy"
                        @change="(e) => setScore((e.target as HTMLInputElement).value)"
                    />
                </div>
                <button class="btn-ghost danger" :disabled="busy" @click="remove">
                    Remove from list
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
.cover.placeholder {
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
.progress {
    font-size: 12px;
    color: var(--fg-muted);
    display: flex;
    gap: 8px;
}
.score {
    color: var(--fg);
}
.actions {
    display: flex;
    gap: 6px;
    align-items: center;
    margin-top: 2px;
}
.actions .btn {
    padding: 4px 10px;
    font-size: 12px;
}
.details {
    margin-top: 6px;
    padding-top: 6px;
    border-top: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.details .field {
    margin-bottom: 4px;
}
.details .field label {
    font-size: 10px;
}
.details .field select,
.details .field input {
    padding: 4px 6px;
}
.btn-ghost.danger {
    color: var(--danger);
    align-self: flex-start;
    font-size: 12px;
    padding: 2px 0;
}
</style>
