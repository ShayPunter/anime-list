<script setup lang="ts">
import type { ListEntryResource } from '@/types'
import { LIST_STATUS_LABELS } from '@/types'
import { statusDotColor } from '@/composables/useLibraryTheme'

defineProps<{
    entries: ListEntryResource[]
}>()

const emit = defineEmits<{
    edit: [entry: ListEntryResource]
}>()

function displayTitle(entry: ListEntryResource): string {
    return entry.anime?.title_english || entry.anime?.title_romaji || 'Unknown'
}

function progressPercent(entry: ListEntryResource): number {
    const total = entry.anime?.episodes
    if (!total) return 0
    return Math.min(100, Math.max(0, (entry.progress / total) * 100))
}

function daysAgo(iso: string): string {
    const ms = Date.now() - new Date(iso).getTime()
    const days = Math.round(ms / 86400000)
    if (days <= 0) return 'today'
    if (days === 1) return '1d ago'
    if (days < 30) return `${days}d ago`
    const months = Math.round(days / 30)
    if (months < 12) return `${months}mo ago`
    return `${Math.round(months / 12)}y ago`
}

function formatLabel(entry: ListEntryResource): string {
    return entry.anime?.format?.replace(/_/g, ' ') ?? '—'
}
</script>

<template>
    <div class="library-table">
        <div class="library-table-head">
            <div>#</div>
            <div>Title</div>
            <div>Status</div>
            <div>Score</div>
            <div>Progress</div>
            <div>Type</div>
            <div>Updated</div>
            <div></div>
        </div>

        <div
            v-for="(e, i) in entries"
            :key="e.id"
            class="library-table-row"
            :class="{ 'library-table-row-top': i === 0 }"
        >
            <div class="library-table-num">{{ String(i + 1).padStart(2, '0') }}</div>

            <Link
                v-if="e.anime"
                :href="e.anime.slug ? route('anime.show', { anime: e.anime.slug }) : '#'"
                class="library-table-title-cell"
            >
                <div class="library-table-cover">
                    <img
                        v-if="e.anime.cover_image_medium || e.anime.cover_image_large"
                        :src="(e.anime.cover_image_medium || e.anime.cover_image_large)!"
                        :alt="displayTitle(e)"
                        loading="lazy"
                    />
                </div>
                <div class="library-table-title-text">
                    <div class="library-table-title-en">{{ displayTitle(e) }}</div>
                    <div class="library-table-title-ro">{{ e.anime.title_romaji }}</div>
                </div>
            </Link>

            <div class="library-table-status">
                <span class="library-dot" :style="{ background: statusDotColor(e.status) }" />
                {{ LIST_STATUS_LABELS[e.status] }}
            </div>

            <div class="library-table-score" :class="{ 'library-table-mute': !e.display_score }">
                {{ e.display_score ? `★ ${e.display_score}` : '—' }}
            </div>

            <div class="library-table-progress">
                <div class="library-table-progress-nums">
                    <span>{{ e.progress }}</span>
                    <span>{{ e.anime?.episodes ?? '?' }}</span>
                </div>
                <div class="library-bar">
                    <div class="library-bar-fill" :style="{ width: `${progressPercent(e)}%` }" />
                </div>
            </div>

            <div class="library-table-mute">{{ formatLabel(e) }}</div>

            <div class="library-table-updated">{{ daysAgo(e.updated_at) }}</div>

            <button class="library-table-more" title="Edit entry" @click="emit('edit', e)">
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
.library-table {
    border: 1px solid var(--lib-line);
    border-radius: 10px;
    overflow: hidden;
    background: var(--lib-surface);
}

.library-table-head,
.library-table-row {
    display: grid;
    grid-template-columns: 40px 2.2fr 0.9fr 0.7fr 1fr 0.7fr 0.9fr 40px;
    gap: 12px;
    padding: 10px 14px;
    align-items: center;
}

.library-table-head {
    border-bottom: 1px solid var(--lib-line);
    font-size: 10px;
    font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--lib-mute);
}

.library-table-row {
    border-top: 1px solid var(--lib-line);
    font-size: 13px;
}

.library-table-row.library-table-row-top { border-top: none; }

.library-table-num {
    color: var(--lib-mute);
    font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace);
    font-size: 11px;
}

.library-table-title-cell {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    color: var(--lib-ink);
    transition: color .15s;
}

.library-table-title-cell:hover .library-table-title-en { color: var(--lib-accent); }

.library-table-cover {
    width: 30px;
    height: 42px;
    border-radius: 4px;
    overflow: hidden;
    background: var(--lib-line);
    flex: 0 0 auto;
}

.library-table-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.library-table-title-text {
    min-width: 0;
    flex: 1;
}

.library-table-title-en {
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color .15s;
}

.library-table-title-ro {
    font-size: 11px;
    color: var(--lib-mute);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.library-table-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--lib-ink-2);
}

.library-dot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    display: inline-block;
}

.library-table-score {
    font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace);
    font-size: 12px;
    color: var(--lib-ink);
}

.library-table-progress-nums {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace);
    color: var(--lib-mute);
    margin-bottom: 3px;
}

.library-bar {
    height: 2px;
    background: var(--lib-line);
    border-radius: 999px;
    overflow: hidden;
}

.library-bar-fill {
    height: 100%;
    background: var(--lib-ink);
}

.library-table-mute {
    font-size: 12px;
    color: var(--lib-mute);
}

.library-table-updated {
    font-size: 11px;
    color: var(--lib-mute);
    font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace);
}

.library-table-more {
    color: var(--lib-mute);
    transition: color .15s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.library-table-more:hover { color: var(--lib-ink); }

.library-empty {
    padding: 32px 14px;
    text-align: center;
    color: var(--lib-mute);
    font-size: 13px;
}
</style>
