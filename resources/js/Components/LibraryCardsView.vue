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
</script>

<template>
    <div class="library-cards-grid">
        <div v-for="e in entries" :key="e.id" class="library-card">
            <Link
                v-if="e.anime"
                :href="e.anime.slug ? route('anime.show', { anime: e.anime.slug }) : '#'"
                class="library-cover"
                :style="{ backgroundColor: e.anime.cover_image_color || '#2a2a24' }"
            >
                <img
                    v-if="e.anime.cover_image_large || e.anime.cover_image_medium"
                    :src="(e.anime.cover_image_large || e.anime.cover_image_medium)!"
                    :alt="displayTitle(e)"
                    loading="lazy"
                />
                <div class="library-cover-overlay" />

                <div class="library-cover-status">
                    <span class="library-status-dot" :style="{ background: statusDotColor(e.status) }" />
                    {{ LIST_STATUS_LABELS[e.status] }}
                </div>

                <div v-if="e.display_score" class="library-cover-score">
                    ★ {{ e.display_score }}
                </div>

                <div class="library-cover-bottom">
                    <div class="library-cover-title">{{ displayTitle(e) }}</div>
                    <div class="library-cover-progress">
                        <span class="library-mono">
                            {{ e.progress }}/{{ e.anime?.episodes ?? '?' }}
                        </span>
                        <div class="library-bar">
                            <div class="library-bar-fill" :style="{ width: `${progressPercent(e)}%` }" />
                        </div>
                    </div>
                </div>
            </Link>

            <div class="library-card-actions">
                <button
                    class="library-plus-btn"
                    :disabled="!canIncrement(e)"
                    :title="canIncrement(e) ? 'Add one episode' : 'Already at total'"
                    @click="emit('progress', e, 1)"
                >
                    <svg viewBox="0 0 20 20" fill="currentColor" class="h-3 w-3">
                        <path d="M10 3a1 1 0 011 1v5h5a1 1 0 010 2h-5v5a1 1 0 01-2 0v-5H4a1 1 0 010-2h5V4a1 1 0 011-1z" />
                    </svg>
                    EP {{ e.progress + 1 }}
                </button>
                <button class="library-more-btn" title="Edit entry" @click="emit('edit', e)">
                    <svg viewBox="0 0 20 20" fill="currentColor" class="h-3.5 w-3.5">
                        <circle cx="4" cy="10" r="1.5" />
                        <circle cx="10" cy="10" r="1.5" />
                        <circle cx="16" cy="10" r="1.5" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.library-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
}

.library-card { position: relative; }

.library-cover {
    display: block;
    aspect-ratio: 2 / 3;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 1px 2px rgba(0, 0, 0, .5);
}

.library-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.library-cover-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 55%, rgba(0, 0, 0, .7) 100%);
}

.library-cover-status {
    position: absolute;
    top: 8px;
    left: 8px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 2px 8px;
    border-radius: 999px;
    background: rgba(0, 0, 0, .55);
    color: #fff;
    font-size: 10px;
    font-weight: 500;
    backdrop-filter: blur(6px);
}

.library-status-dot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    display: inline-block;
}

.library-cover-score {
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 2px 7px;
    border-radius: 6px;
    background: rgba(0, 0, 0, .6);
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    backdrop-filter: blur(6px);
}

.library-cover-bottom {
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 10px;
    color: #fff;
}

.library-cover-title {
    font-size: 15px;
    line-height: 1.2;
    text-shadow: 0 1px 6px rgba(0, 0, 0, .6);
    margin-bottom: 6px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-weight: 500;
}

.library-cover-progress {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    opacity: .9;
}

.library-mono {
    font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace);
}

.library-bar {
    flex: 1;
    height: 2px;
    background: rgba(255, 255, 255, .2);
    border-radius: 999px;
    overflow: hidden;
}

.library-bar-fill {
    height: 100%;
    background: #fff;
}

.library-card-actions {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 8px;
}

.library-plus-btn {
    flex: 1;
    padding: 5px 8px;
    font-size: 11px;
    font-weight: 500;
    border-radius: 6px;
    border: 1px solid var(--lib-line-2);
    background: var(--lib-surface);
    color: var(--lib-ink);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    transition: border-color .15s, background .15s;
}

.library-plus-btn:hover:not(:disabled) {
    border-color: var(--lib-accent);
    color: var(--lib-accent);
}

.library-plus-btn:disabled {
    color: var(--lib-mute);
    cursor: default;
}

.library-more-btn {
    padding: 5px 8px;
    border-radius: 6px;
    border: 1px solid var(--lib-line-2);
    background: var(--lib-surface);
    color: var(--lib-ink-2);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: color .15s, border-color .15s;
}

.library-more-btn:hover {
    color: var(--lib-ink);
    border-color: var(--lib-mute);
}
</style>
