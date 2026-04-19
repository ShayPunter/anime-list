<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePage, router } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/AppLayout.vue'
import ToggleSwitch from 'primevue/toggleswitch'
import LibraryCardsView from '@/Components/LibraryCardsView.vue'
import LibraryRowsView from '@/Components/LibraryRowsView.vue'
import LibraryDataTable from '@/Components/LibraryDataTable.vue'
import ListEntryModal from '@/Components/ListEntryModal.vue'
import { useListMutations } from '@/composables/useListMutations'
import { statusDotColor } from '@/composables/useLibraryTheme'
import type { ListEntryResource, ListStatus, ListViewMode } from '@/types'
import { LIST_STATUS_LABELS } from '@/types'

defineOptions({ layout: AppLayout })

const props = defineProps<{
    entries: ListEntryResource[]
    counts: Record<string, number>
}>()

const activeStatus = ref<ListStatus | 'all'>('all')
const viewMode = ref<ListViewMode>('card')
const sortField = ref<string>('-updated_at')
const filterText = ref('')
const selectedGenres = ref<string[]>([])

onMounted(() => {
    const saved = localStorage.getItem('list_view') as ListViewMode | null
    if (saved && ['table', 'card', 'compact'].includes(saved)) {
        viewMode.value = saved
    }
})

function setViewMode(mode: ListViewMode) {
    viewMode.value = mode
    localStorage.setItem('list_view', mode)
}

const statusFiltered = computed(() =>
    activeStatus.value === 'all'
        ? props.entries
        : props.entries.filter(e => e.status === activeStatus.value),
)

const filteredEntries = computed(() => {
    let entries = statusFiltered.value

    if (filterText.value.trim()) {
        const t = filterText.value.trim().toLowerCase()
        entries = entries.filter(e => {
            const en = e.anime?.title_english?.toLowerCase() ?? ''
            const ro = e.anime?.title_romaji?.toLowerCase() ?? ''
            return en.includes(t) || ro.includes(t)
        })
    }

    if (selectedGenres.value.length) {
        entries = entries.filter(e => {
            const names = (e.anime?.genres ?? []).map(g => g.name)
            return selectedGenres.value.every(g => names.includes(g))
        })
    }

    const [dir, field] = sortField.value.startsWith('-')
        ? ['desc', sortField.value.slice(1)] as const
        : ['asc', sortField.value] as const

    return [...entries].sort((a, b) => {
        let aVal: string | number = 0
        let bVal: string | number = 0

        if (field === 'updated_at') {
            aVal = new Date(a.updated_at).getTime()
            bVal = new Date(b.updated_at).getTime()
        } else if (field === 'score') {
            aVal = a.score ?? -1
            bVal = b.score ?? -1
        } else if (field === 'title') {
            aVal = (a.anime?.title_english || a.anime?.title_romaji || '').toLowerCase()
            bVal = (b.anime?.title_english || b.anime?.title_romaji || '').toLowerCase()
        } else if (field === 'progress') {
            const aTot = a.anime?.episodes || 1
            const bTot = b.anime?.episodes || 1
            aVal = a.progress / aTot
            bVal = b.progress / bTot
        }

        if (aVal < bVal) return dir === 'asc' ? -1 : 1
        if (aVal > bVal) return dir === 'asc' ? 1 : -1
        return 0
    })
})

const totalCount = computed(() => Object.values(props.counts).reduce((n, c) => n + c, 0))

const stats = computed(() => {
    const watching = props.counts?.watching ?? 0
    const completed = props.counts?.completed ?? 0

    const scored = props.entries.filter(e => e.display_score != null)
    const avg = scored.length
        ? scored.reduce((n, e) => n + (e.display_score as number), 0) / scored.length
        : 0

    const totalEp = props.entries.reduce((n, e) => n + e.progress, 0)
    const days = Math.round((totalEp * 24) / 60 / 24 * 10) / 10

    return { watching, completed, avg, totalEp, days }
})

const tabs = computed(() => {
    const base: { key: ListStatus | 'all'; label: string; count: number }[] = [
        { key: 'all', label: 'All', count: totalCount.value },
    ]
    const statuses: ListStatus[] = ['watching', 'completed', 'plan_to_watch', 'on_hold', 'dropped']
    statuses.forEach(s => base.push({ key: s, label: LIST_STATUS_LABELS[s], count: props.counts?.[s] ?? 0 }))
    return base
})

const allGenres = computed(() => {
    const s = new Set<string>()
    props.entries.forEach(e => (e.anime?.genres ?? []).forEach(g => s.add(g.name)))
    return [...s].sort()
})

function toggleGenre(g: string) {
    selectedGenres.value = selectedGenres.value.includes(g)
        ? selectedGenres.value.filter(x => x !== g)
        : [...selectedGenres.value, g]
}

const page = usePage<{ auth: { user: import('@/types').User } }>()
const user = computed(() => page.props.auth.user)
const username = computed(() => user.value?.username ?? 'you')

const publicUrl = computed(() => {
    if (!user.value?.list_is_public || !user.value?.username) return null
    return `${window.location.origin}/user/${user.value.username}/list`
})

const listIsPublic = ref(user.value?.list_is_public ?? false)

function togglePublic() {
    router.patch(route('settings.profile'), {
        list_is_public: listIsPublic.value,
    }, { preserveState: true, preserveScroll: true })
}

const copied = ref(false)
function copyUrl() {
    if (!publicUrl.value) return
    navigator.clipboard.writeText(publicUrl.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
}

const { updateMutation } = useListMutations()

function reloadProps() {
    router.reload({ only: ['entries', 'counts'] })
}

function handleProgress(entry: ListEntryResource, delta: number) {
    const total = entry.anime?.episodes
    const next = Math.max(0, total != null ? Math.min(total, entry.progress + delta) : entry.progress + delta)
    if (next === entry.progress) return
    updateMutation.mutate({ id: entry.id, progress: next }, { onSuccess: reloadProps })
}

const editingEntry = ref<ListEntryResource | null>(null)
const showEditModal = ref(false)

function openEdit(entry: ListEntryResource) {
    editingEntry.value = entry
    showEditModal.value = true
}

const sortOptions = [
    { label: 'Recently updated', value: '-updated_at' },
    { label: 'My score', value: '-score' },
    { label: 'Title A–Z', value: 'title' },
    { label: 'Progress', value: '-progress' },
]
</script>

<template>
    <Head title="Library" />
    <div class="library">
        <!-- Hero -->
        <div class="library-hero">
            <div class="library-eyebrow">Library · @{{ username }}</div>
            <h1 class="library-heading">Your collection.</h1>
            <div class="library-subtitle">
                {{ totalCount }} titles · {{ stats.totalEp.toLocaleString() }} episodes watched · {{ stats.days }} days of your life.
            </div>
        </div>

        <!-- Top actions -->
        <div class="library-top-actions">
            <div class="library-public-toggle">
                <ToggleSwitch v-model="listIsPublic" @update:model-value="togglePublic" />
                <span>Public</span>
            </div>
            <button
                v-if="publicUrl"
                class="library-action-btn"
                :class="{ 'library-action-btn-copied': copied }"
                @click="copyUrl"
            >
                <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                {{ copied ? 'Copied!' : 'Share' }}
            </button>
            <a :href="route('list.export')" class="library-action-link">Export XML</a>
            <Link :href="route('import')" class="library-action-link">Import</Link>
        </div>

        <!-- Stats grid -->
        <div class="library-stats">
            <div class="library-stat-cell">
                <div class="library-stat-label">Watching</div>
                <div class="library-stat-value">{{ stats.watching }}</div>
                <div class="library-stat-hint">currently</div>
            </div>
            <div class="library-stat-cell">
                <div class="library-stat-label">Completed</div>
                <div class="library-stat-value">{{ stats.completed }}</div>
                <div class="library-stat-hint">all time</div>
            </div>
            <div class="library-stat-cell">
                <div class="library-stat-label">Avg score</div>
                <div class="library-stat-value">{{ stats.avg ? stats.avg.toFixed(1) : '—' }}</div>
                <div class="library-stat-hint">on scored entries</div>
            </div>
            <div class="library-stat-cell">
                <div class="library-stat-label">Time spent</div>
                <div class="library-stat-value">{{ stats.days }}d</div>
                <div class="library-stat-hint">{{ stats.totalEp }} episodes</div>
            </div>
        </div>

        <!-- Status tabs -->
        <div class="library-tabs">
            <button
                v-for="t in tabs"
                :key="t.key"
                class="library-tab"
                :class="{ 'library-tab-active': activeStatus === t.key }"
                @click="activeStatus = t.key"
            >
                <span
                    v-if="t.key !== 'all'"
                    class="library-tab-dot"
                    :style="{ background: statusDotColor(t.key as ListStatus) }"
                />
                {{ t.label }}
                <span class="library-tab-count">{{ t.count }}</span>
            </button>
        </div>

        <!-- Toolbar -->
        <div class="library-toolbar">
            <div class="library-search">
                <svg viewBox="0 0 20 20" fill="currentColor" class="h-3.5 w-3.5">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
                <input v-model="filterText" type="text" placeholder="Filter your list…" />
            </div>

            <select v-model="sortField" class="library-select">
                <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>

            <div class="library-spacer" />

            <div class="library-view-toggle">
                <button
                    v-for="[key, label] in ([['card', 'Grid'], ['compact', 'Rows'], ['table', 'Table']] as [ListViewMode, string][])"
                    :key="key"
                    :class="{ active: viewMode === key }"
                    :title="label"
                    @click="setViewMode(key)"
                >
                    <svg v-if="key === 'card'" viewBox="0 0 20 20" fill="currentColor" class="h-3.5 w-3.5">
                        <path d="M3 3h6v6H3V3zm8 0h6v6h-6V3zm-8 8h6v6H3v-6zm8 0h6v6h-6v-6z" />
                    </svg>
                    <svg v-else-if="key === 'compact'" viewBox="0 0 20 20" fill="currentColor" class="h-3.5 w-3.5">
                        <path d="M3 4h14v3H3V4zm0 5h14v3H3V9zm0 5h14v3H3v-3z" />
                    </svg>
                    <svg v-else viewBox="0 0 20 20" fill="currentColor" class="h-3.5 w-3.5">
                        <path d="M3 4h14v2H3V4zm0 4h14v2H3V8zm0 4h14v2H3v-2zm0 4h14v2H3v-2z" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Genre chips -->
        <div v-if="allGenres.length > 0" class="library-chips">
            <button
                v-for="g in allGenres.slice(0, 14)"
                :key="g"
                class="library-chip"
                :class="{ 'library-chip-active': selectedGenres.includes(g) }"
                @click="toggleGenre(g)"
            >{{ g }}</button>
            <button v-if="selectedGenres.length" class="library-chip library-chip-clear" @click="selectedGenres = []">
                Clear
            </button>
        </div>

        <!-- Main content -->
        <div v-if="filteredEntries.length === 0" class="library-empty-state">
            <div class="library-empty-title">Nothing here yet</div>
            <div class="library-empty-hint">
                <template v-if="filterText || selectedGenres.length">No entries match your filters.</template>
                <template v-else>Start by searching for an anime or importing from MAL.</template>
            </div>
        </div>

        <LibraryCardsView
            v-else-if="viewMode === 'card'"
            :entries="filteredEntries"
            @edit="openEdit"
            @progress="handleProgress"
        />
        <LibraryRowsView
            v-else-if="viewMode === 'compact'"
            :entries="filteredEntries"
            @edit="openEdit"
            @progress="handleProgress"
        />
        <LibraryDataTable
            v-else
            :entries="filteredEntries"
            @edit="openEdit"
        />

        <ListEntryModal
            v-if="showEditModal && editingEntry?.anime"
            :anime="editingEntry.anime"
            :entry="editingEntry"
            @close="showEditModal = false"
            @saved="() => { showEditModal = false; reloadProps() }"
            @deleted="() => { showEditModal = false; reloadProps() }"
        />
    </div>
</template>

<style scoped>
.library {
    --lib-bg: #0e0e0c;
    --lib-bg-2: #151512;
    --lib-surface: #181814;
    --lib-ink: #f3f3ec;
    --lib-ink-2: #cfcfc6;
    --lib-mute: #8a8a80;
    --lib-mute-2: #5a5a52;
    --lib-line: #25251f;
    --lib-line-2: #32322b;
    --lib-accent: #ff5a1f;
    --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;

    background: var(--lib-bg);
    color: var(--lib-ink);
    margin: -24px -16px;
    padding: 32px 24px 80px;
    min-height: calc(100vh - 120px);
}

@media (min-width: 640px) {
    .library { padding: 40px 40px 80px; }
}

.library-hero { margin-bottom: 20px; }

.library-eyebrow {
    font-size: 11px;
    font-family: var(--font-mono);
    color: var(--lib-mute);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 10px;
}

.library-heading {
    margin: 0;
    font-size: 44px;
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1;
    color: var(--lib-ink);
}

@media (min-width: 640px) {
    .library-heading { font-size: 52px; }
}

.library-subtitle {
    margin-top: 10px;
    font-size: 15px;
    color: var(--lib-mute);
    max-width: 640px;
}

.library-top-actions {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
    margin-bottom: 28px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--lib-line);
}

.library-public-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--lib-mute);
}

.library-action-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid var(--lib-line-2);
    background: var(--lib-surface);
    color: var(--lib-ink-2);
    font-size: 13px;
    transition: border-color .15s, color .15s;
}

.library-action-btn:hover { border-color: var(--lib-mute); color: var(--lib-ink); }
.library-action-btn-copied { color: #4caf7c; border-color: #4caf7c; }

.library-action-link {
    font-size: 13px;
    color: var(--lib-mute);
    transition: color .15s;
}

.library-action-link:hover { color: var(--lib-ink); }

/* Stats */
.library-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1px;
    background: var(--lib-line);
    border: 1px solid var(--lib-line);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 32px;
}

@media (min-width: 640px) {
    .library-stats { grid-template-columns: repeat(4, 1fr); }
}

.library-stat-cell {
    padding: 18px 20px;
    background: var(--lib-bg);
}

.library-stat-label {
    font-size: 11px;
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--lib-mute);
    margin-bottom: 8px;
}

.library-stat-value {
    font-size: 26px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--lib-ink);
    line-height: 1;
    margin-bottom: 6px;
}

.library-stat-hint {
    font-size: 11px;
    color: var(--lib-mute);
}

/* Tabs */
.library-tabs {
    display: flex;
    align-items: center;
    gap: 4px;
    border-bottom: 1px solid var(--lib-line);
    margin-bottom: 20px;
    overflow-x: auto;
}

.library-tab {
    padding: 10px 14px;
    font-size: 13px;
    color: var(--lib-mute);
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    transition: color .15s, border-color .15s;
}

.library-tab:hover { color: var(--lib-ink-2); }

.library-tab-active {
    color: var(--lib-ink);
    border-bottom-color: var(--lib-ink);
    font-weight: 500;
}

.library-tab-dot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    display: inline-block;
}

.library-tab-count {
    font-size: 11px;
    color: var(--lib-mute);
    font-family: var(--font-mono);
}

/* Toolbar */
.library-toolbar {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
    flex-wrap: wrap;
}

.library-search {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 12px;
    border: 1px solid var(--lib-line-2);
    border-radius: 8px;
    background: var(--lib-surface);
    color: var(--lib-mute);
    flex: 1;
    min-width: 220px;
    max-width: 340px;
    transition: border-color .15s;
}

.library-search:focus-within { border-color: var(--lib-mute); }

.library-search input {
    flex: 1;
    border: 0;
    outline: 0;
    background: transparent;
    font-size: 13px;
    color: var(--lib-ink);
}

.library-search input::placeholder { color: var(--lib-mute); }

.library-select {
    padding: 7px 10px;
    border: 1px solid var(--lib-line-2);
    border-radius: 8px;
    background: var(--lib-surface);
    color: var(--lib-ink-2);
    font-size: 13px;
    outline: 0;
    cursor: pointer;
}

.library-spacer { flex: 1; }

.library-view-toggle {
    display: flex;
    border: 1px solid var(--lib-line-2);
    border-radius: 8px;
    overflow: hidden;
    background: var(--lib-surface);
}

.library-view-toggle button {
    padding: 6px 10px;
    background: transparent;
    color: var(--lib-mute);
    border-right: 1px solid var(--lib-line-2);
    transition: background .15s, color .15s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.library-view-toggle button:last-child { border-right: 0; }
.library-view-toggle button:hover { color: var(--lib-ink-2); }

.library-view-toggle button.active {
    background: var(--lib-bg-2);
    color: var(--lib-ink);
}

/* Chips */
.library-chips {
    display: flex;
    gap: 6px;
    margin-bottom: 22px;
    flex-wrap: wrap;
}

.library-chip {
    padding: 5px 11px;
    border-radius: 999px;
    border: 1px solid var(--lib-line-2);
    background: var(--lib-surface);
    color: var(--lib-ink-2);
    font-size: 12px;
    transition: border-color .15s, background .15s, color .15s;
}

.library-chip:hover { border-color: var(--lib-mute); color: var(--lib-ink); }

.library-chip-active {
    background: var(--lib-ink);
    color: var(--lib-bg);
    border-color: var(--lib-ink);
}

.library-chip-clear {
    color: var(--lib-mute);
    border-style: dashed;
}

/* Empty state */
.library-empty-state {
    text-align: center;
    padding: 80px 20px;
    border: 1px dashed var(--lib-line-2);
    border-radius: 12px;
    background: var(--lib-surface);
}

.library-empty-title {
    font-size: 18px;
    font-weight: 500;
    color: var(--lib-ink);
    margin-bottom: 6px;
}

.library-empty-hint {
    font-size: 13px;
    color: var(--lib-mute);
}
</style>
