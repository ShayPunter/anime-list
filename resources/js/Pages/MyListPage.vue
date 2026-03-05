<script setup lang="ts">
import { ref, computed } from 'vue'
import AppLayout from '@/Layouts/AppLayout.vue'
import ListStatusTabs from '@/Components/ListStatusTabs.vue'
import ListTableView from '@/Components/ListTableView.vue'
import ListCardView from '@/Components/ListCardView.vue'
import ListCompactView from '@/Components/ListCompactView.vue'
import ListEntryModal from '@/Components/ListEntryModal.vue'
import { useListMutations } from '@/composables/useListMutations'
import type { ListEntryResource, ListStatus, ListViewMode } from '@/types'

defineOptions({ layout: AppLayout })

const props = defineProps<{
    entries: ListEntryResource[]
    counts: Record<string, number>
}>()

const activeStatus = ref<ListStatus | 'all'>('all')
const viewMode = ref<ListViewMode>(
    (localStorage.getItem('list_view') as ListViewMode) || 'table'
)

const sortField = ref<string>('-updated_at')

function setViewMode(mode: ListViewMode) {
    viewMode.value = mode
    localStorage.setItem('list_view', mode)
}

const filteredEntries = computed(() => {
    let entries = props.entries
    if (activeStatus.value !== 'all') {
        entries = entries.filter(e => e.status === activeStatus.value)
    }

    const [dir, field] = sortField.value.startsWith('-')
        ? ['desc', sortField.value.slice(1)] as const
        : ['asc', sortField.value] as const

    return [...entries].sort((a, b) => {
        let aVal: string | number | null = null
        let bVal: string | number | null = null

        if (field === 'updated_at') {
            aVal = a.updated_at
            bVal = b.updated_at
        } else if (field === 'score') {
            aVal = a.score ?? -1
            bVal = b.score ?? -1
        } else if (field === 'title') {
            aVal = (a.anime?.title_english || a.anime?.title_romaji || '').toLowerCase()
            bVal = (b.anime?.title_english || b.anime?.title_romaji || '').toLowerCase()
        } else if (field === 'progress') {
            aVal = a.progress
            bVal = b.progress
        }

        if (aVal === null || bVal === null) return 0
        if (aVal < bVal) return dir === 'asc' ? -1 : 1
        if (aVal > bVal) return dir === 'asc' ? 1 : -1
        return 0
    })
})

const { updateMutation, destroyMutation } = useListMutations()

function handleUpdate(id: number, patch: Record<string, unknown>) {
    updateMutation.mutate({ id, ...patch } as Parameters<typeof updateMutation.mutate>[0])
}

function handleDelete(id: number) {
    destroyMutation.mutate(id)
}

const editingEntry = ref<ListEntryResource | null>(null)
const showEditModal = ref(false)

function openEdit(entry: ListEntryResource) {
    editingEntry.value = entry
    showEditModal.value = true
}

const sortOptions = [
    { label: 'Last Updated', value: '-updated_at' },
    { label: 'Score', value: '-score' },
    { label: 'Title', value: 'title' },
    { label: 'Progress', value: '-progress' },
]
</script>

<template>
    <Head title="My List" />
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold">My Anime List</h1>
            <div class="flex items-center gap-2">
                <a
                    :href="route('list.export')"
                    class="text-sm text-gray-400 hover:text-gray-200 transition"
                >
                    Export XML
                </a>
                <Link
                    :href="route('import')"
                    class="text-sm text-gray-400 hover:text-gray-200 transition"
                >
                    Import
                </Link>
            </div>
        </div>

        <ListStatusTabs
            :active-status="activeStatus"
            :counts="counts"
            @change="activeStatus = $event"
        />

        <div class="flex items-center justify-between">
            <select
                v-model="sortField"
                class="rounded border border-gray-700 bg-gray-800 px-2 py-1 text-sm text-gray-300"
            >
                <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                </option>
            </select>
            <div class="flex items-center gap-1">
                <button
                    v-for="mode in (['table', 'card', 'compact'] as ListViewMode[])"
                    :key="mode"
                    class="rounded px-2 py-1 text-xs transition"
                    :class="viewMode === mode ? 'bg-gray-700 text-gray-200' : 'text-gray-500 hover:text-gray-300'"
                    @click="setViewMode(mode)"
                >
                    {{ mode.charAt(0).toUpperCase() + mode.slice(1) }}
                </button>
            </div>
        </div>

        <ListTableView
            v-if="viewMode === 'table'"
            :entries="filteredEntries"
            @update="handleUpdate"
            @delete="handleDelete"
            @edit="openEdit"
        />
        <ListCardView
            v-else-if="viewMode === 'card'"
            :entries="filteredEntries"
            @edit="openEdit"
        />
        <ListCompactView
            v-else
            :entries="filteredEntries"
            @update="handleUpdate"
        />

        <ListEntryModal
            v-if="showEditModal && editingEntry?.anime"
            :anime="editingEntry.anime"
            :entry="editingEntry"
            @close="showEditModal = false"
            @saved="showEditModal = false"
            @deleted="showEditModal = false"
        />
    </div>
</template>
