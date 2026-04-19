<script setup lang="ts">
import type { ListEntryResource } from '@/types'
import { LIST_STATUS_LABELS } from '@/types'
import { statusDotColor } from '@/composables/useLibraryTheme'

defineProps<{
    entries: ListEntryResource[]
}>()

const emit = defineEmits<{
    edit: [entry: ListEntryResource]
    progress: [entry: ListEntryResource, delta: number]
}>()

function displayTitle(entry: ListEntryResource): string {
    return entry.anime?.title_english || entry.anime?.title_romaji || 'Unknown'
}

function canIncrement(entry: ListEntryResource): boolean {
    const total = entry.anime?.episodes
    return total == null || entry.progress < total
}

function progressPercent(entry: ListEntryResource): number {
    const total = entry.anime?.episodes
    if (!total) return 0
    return Math.min(100, Math.max(0, (entry.progress / total) * 100))
}

function seasonLabel(entry: ListEntryResource): string {
    const year = entry.anime?.season_year
    const season = entry.anime?.season
    if (!year && !season) return '—'
    const s = season ? season.charAt(0) + season.slice(1).toLowerCase() : ''
    return [year, s].filter(Boolean).join(' ')
}

function genrePair(entry: ListEntryResource): string {
    return (entry.anime?.genres ?? []).slice(0, 2).map(g => g.name).join(' / ')
}
</script>

<template>
    <div class="library-rows">
        <div v-for="(e, i) in entries" :key="e.id" class="library-row" :class="{ 'library-row-top': i === 0 }">
            <Link
                v-if="e.anime"
                :href="e.anime.slug ? route('anime.show', { anime: e.anime.slug }) : '#'"
                class="library-row-cover"
            >
                <img
                    v-if="e.anime.cover_image_medium || e.anime.cover_image_large"
                    :src="(e.anime.cover_image_medium || e.anime.cover_image_large)!"
                    :alt="displayTitle(e)"
                    loading="lazy"
                />
            </Link>

            <div class="library-row-body">
                <Link
                    v-if="e.anime"
                    :href="e.anime.slug ? route('anime.show', { anime: e.anime.slug }) : '#'"
                    class="library-row-title"
                >
                    {{ displayTitle(e) }}
                </Link>
                <div class="library-row-meta">
                    <span class="library-row-meta-item">
                        <span class="library-dot" :style="{ background: statusDotColor(e.status) }" />
                        {{ LIST_STATUS_LABELS[e.status] }}
                    </span>
                    <span class="library-row-sep">·</span>
                    <span>{{ seasonLabel(e) }}</span>
                    <template v-if="genrePair(e)">
                        <span class="library-row-sep">·</span>
                        <span>{{ genrePair(e) }}</span>
                    </template>
                </div>
            </div>

            <div class="library-row-progress">
                <div class="library-row-progress-nums">
                    <span>EP {{ e.progress }}</span>
                    <span>{{ e.anime?.episodes ?? '?' }}</span>
                </div>
                <div class="library-bar">
                    <div class="library-bar-fill" :style="{ width: `${progressPercent(e)}%` }" />
                </div>
            </div>

            <div class="library-row-score" :class="{ 'library-row-score-muted': !e.display_score }">
                {{ e.display_score ? `★ ${e.display_score}` : '—' }}
            </div>

            <button
                class="library-row-plus"
                :disabled="!canIncrement(e)"
                title="Add one episode"
                @click="emit('progress', e, 1)"
            >+1</button>

            <button class="library-row-more" title="Edit entry" @click="emit('edit', e)">
                <svg viewBox="0 0 20 20" fill="currentColor" class="h-3.5 w-3.5">
                    <circle cx="4" cy="10" r="1.5" />
                    <circle cx="10" cy="10" r="1.5" />
                    <circle cx="16" cy="10" r="1.5" />
                </svg>
            </button>
        </div>
        <p v-if="entries.length === 0" class="library-empty">No entries found.</p>
    </div>
</template>

<style scoped>
.library-rows {
    border: 1px solid var(--lib-line);
    border-radius: 10px;
    overflow: hidden;
    background: var(--lib-surface);
}

.library-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 10px 14px;
    border-top: 1px solid var(--lib-line);
}

.library-row.library-row-top { border-top: none; }

.library-row-cover {
    flex: 0 0 auto;
    width: 36px;
    height: 52px;
    border-radius: 4px;
    overflow: hidden;
    background: var(--lib-line);
}

.library-row-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.library-row-body {
    flex: 1;
    min-width: 0;
}

.library-row-title {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: var(--lib-ink);
    margin-bottom: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color .15s;
}

.library-row-title:hover { color: var(--lib-accent); }

.library-row-meta {
    font-size: 11px;
    color: var(--lib-mute);
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.library-row-meta-item {
    display: inline-flex;
    align-items: center;
    gap: 5px;
}

.library-row-sep { color: var(--lib-mute-2); }

.library-dot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    display: inline-block;
}

.library-row-progress {
    width: 180px;
    flex: 0 0 auto;
}

.library-row-progress-nums {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace);
    color: var(--lib-mute);
    margin-bottom: 4px;
}

.library-bar {
    height: 3px;
    background: var(--lib-line);
    border-radius: 999px;
    overflow: hidden;
}

.library-bar-fill {
    height: 100%;
    background: var(--lib-ink);
}

.library-row-score {
    width: 50px;
    text-align: right;
    font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace);
    font-size: 12px;
    color: var(--lib-ink);
    flex: 0 0 auto;
}

.library-row-score.library-row-score-muted { color: var(--lib-mute); }

.library-row-plus {
    padding: 4px 9px;
    border-radius: 6px;
    border: 1px solid var(--lib-line-2);
    background: var(--lib-surface);
    color: var(--lib-ink);
    font-size: 11px;
    font-weight: 500;
    font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace);
    transition: border-color .15s, color .15s;
}

.library-row-plus:hover:not(:disabled) { border-color: var(--lib-accent); color: var(--lib-accent); }
.library-row-plus:disabled { color: var(--lib-mute); cursor: default; }

.library-row-more {
    padding: 4px;
    color: var(--lib-mute);
    transition: color .15s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.library-row-more:hover { color: var(--lib-ink); }

.library-empty {
    padding: 32px 14px;
    text-align: center;
    color: var(--lib-mute);
    font-size: 13px;
}
</style>
