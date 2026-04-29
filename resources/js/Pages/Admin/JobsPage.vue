<script setup lang="ts">
import { computed, ref } from 'vue'
import { router, useForm, usePage } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/AppLayout.vue'
import AdminNav from '@/Components/AdminNav.vue'

defineOptions({ layout: AppLayout })

interface QueueCount {
    queue: string
    count: number
}

interface SyncProgress {
    last_completed_page?: number
    last_page?: number
    total?: number
    started_at?: string
}

interface SyncState {
    status: string
    progress: SyncProgress | null
    last_run: number | null
}

interface FailedJob {
    uuid: string
    queue: string
    job_class: string | null
    exception_summary: string
    failed_at: string
}

interface AnimeRef {
    id: number
    slug: string | null
    anilist_id: number
    title: string
    cover_image_medium: string | null
    created_at?: string
    synced_at?: string
}

interface JobMetrics {
    queued_total: number
    queued_by_queue: QueueCount[]
    failed_total: number
    failed_by_queue: QueueCount[]
    failed_last_24h: number
    oldest_pending_age_seconds: number | null
    anime_total: number
    anime_added: { last_24h: number; last_7d: number; last_30d: number }
    anime_updated: { last_24h: number; last_7d: number; last_30d: number }
    never_synced: number
    stale_sync: number
}

const props = defineProps<{
    metrics: JobMetrics
    recentFailed: FailedJob[]
    recentlyAdded: AnimeRef[]
    recentlyUpdated: AnimeRef[]
    syncStates: Record<string, SyncState>
}>()

const page = usePage()
const flashMessage = computed(
    () => (page.props.flash as { message?: string } | undefined)?.message ?? null,
)

const enqueueForm = useForm({
    anilist_id: '' as string | number,
})

function submitEnqueue() {
    enqueueForm.post(route('admin.jobs.enqueue-anime'), {
        preserveScroll: true,
        onSuccess: () => enqueueForm.reset('anilist_id'),
    })
}

function dispatchIncremental() {
    router.post(
        route('admin.jobs.sync.incremental'),
        {},
        { preserveScroll: true },
    )
}

function refresh() {
    router.reload()
}

const retryingUuid = ref<string | null>(null)
const forgettingUuid = ref<string | null>(null)

function retryJob(uuid: string) {
    retryingUuid.value = uuid
    router.post(
        route('admin.jobs.failed.retry', { uuid }),
        {},
        {
            preserveScroll: true,
            onFinish: () => { retryingUuid.value = null },
        },
    )
}

function forgetJob(uuid: string) {
    forgettingUuid.value = uuid
    router.delete(route('admin.jobs.failed.forget', { uuid }), {
        preserveScroll: true,
        onFinish: () => { forgettingUuid.value = null },
    })
}

function syncStatusColor(status: string): string {
    if (status === 'completed') return 'text-green-400'
    if (status === 'running') return 'text-yellow-400'
    if (status === 'paused') return 'text-orange-400'
    if (status === 'failed') return 'text-red-400'
    return 'text-gray-500'
}

function formatDate(iso?: string | null): string {
    if (!iso) return '—'
    return new Date(iso).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    })
}

function formatTimestamp(ts: number | null): string {
    if (!ts) return '—'
    return new Date(ts * 1000).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    })
}

function formatDuration(seconds: number | null): string {
    if (seconds === null) return '—'
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
}

function progressPercent(state: SyncState): number | null {
    const last = state.progress?.last_completed_page ?? 0
    const total = state.progress?.last_page ?? 0
    if (total <= 0) return null
    return Math.min(100, Math.round((last / total) * 100))
}
</script>

<template>
    <Head title="Job Observability" />

    <div class="mx-auto max-w-6xl space-y-6">
        <AdminNav />

        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold">Jobs &amp; Sync</h1>
                <p class="mt-1 text-sm text-gray-400">
                    Queue depth, sync status, recent failures, and tools for refreshing anime data.
                </p>
            </div>
            <button
                type="button"
                class="rounded-lg border border-gray-700 bg-gray-900 px-3 py-1.5 text-xs text-gray-300 transition hover:border-gray-600 hover:text-gray-100"
                @click="refresh"
            >
                Refresh
            </button>
        </div>

        <div
            v-if="flashMessage"
            class="rounded-lg border border-green-700/50 bg-green-900/20 px-4 py-2 text-sm text-green-300"
        >
            {{ flashMessage }}
        </div>

        <!-- Top stats grid -->
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <div class="rounded-xl border border-gray-800 bg-gray-900 p-4">
                <div class="text-2xl font-bold text-primary-400">{{ metrics.queued_total.toLocaleString() }}</div>
                <div class="mt-1 text-xs text-gray-400">Queued jobs</div>
            </div>
            <div class="rounded-xl border border-gray-800 bg-gray-900 p-4">
                <div class="text-2xl font-bold" :class="metrics.failed_total > 0 ? 'text-red-400' : 'text-primary-400'">
                    {{ metrics.failed_total.toLocaleString() }}
                </div>
                <div class="mt-1 text-xs text-gray-400">
                    Failed total
                    <span v-if="metrics.failed_last_24h > 0" class="ml-1 text-red-400">
                        ({{ metrics.failed_last_24h }} in 24h)
                    </span>
                </div>
            </div>
            <div class="rounded-xl border border-gray-800 bg-gray-900 p-4">
                <div class="text-2xl font-bold text-primary-400">
                    {{ formatDuration(metrics.oldest_pending_age_seconds) }}
                </div>
                <div class="mt-1 text-xs text-gray-400">Oldest pending</div>
            </div>
            <div class="rounded-xl border border-gray-800 bg-gray-900 p-4">
                <div class="text-2xl font-bold text-primary-400">{{ metrics.never_synced.toLocaleString() }}</div>
                <div class="mt-1 text-xs text-gray-400">Never synced</div>
            </div>
            <div class="rounded-xl border border-gray-800 bg-gray-900 p-4">
                <div class="text-2xl font-bold text-primary-400">{{ metrics.stale_sync.toLocaleString() }}</div>
                <div class="mt-1 text-xs text-gray-400">Stale (&gt;30d / never)</div>
            </div>
        </div>

        <!-- Throughput -->
        <div class="grid gap-4 lg:grid-cols-2">
            <div class="rounded-xl border border-gray-800 bg-gray-900 p-5">
                <h2 class="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">Anime added</h2>
                <div class="grid grid-cols-3 gap-3">
                    <div>
                        <div class="text-xl font-bold text-gray-100">{{ metrics.anime_added.last_24h.toLocaleString() }}</div>
                        <div class="text-xs text-gray-500">last 24h</div>
                    </div>
                    <div>
                        <div class="text-xl font-bold text-gray-100">{{ metrics.anime_added.last_7d.toLocaleString() }}</div>
                        <div class="text-xs text-gray-500">last 7d</div>
                    </div>
                    <div>
                        <div class="text-xl font-bold text-gray-100">{{ metrics.anime_added.last_30d.toLocaleString() }}</div>
                        <div class="text-xs text-gray-500">last 30d</div>
                    </div>
                </div>
                <div class="mt-3 text-xs text-gray-500">
                    {{ metrics.anime_total.toLocaleString() }} total in DB
                </div>
            </div>

            <div class="rounded-xl border border-gray-800 bg-gray-900 p-5">
                <h2 class="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">Anime updated</h2>
                <div class="grid grid-cols-3 gap-3">
                    <div>
                        <div class="text-xl font-bold text-gray-100">{{ metrics.anime_updated.last_24h.toLocaleString() }}</div>
                        <div class="text-xs text-gray-500">last 24h</div>
                    </div>
                    <div>
                        <div class="text-xl font-bold text-gray-100">{{ metrics.anime_updated.last_7d.toLocaleString() }}</div>
                        <div class="text-xs text-gray-500">last 7d</div>
                    </div>
                    <div>
                        <div class="text-xl font-bold text-gray-100">{{ metrics.anime_updated.last_30d.toLocaleString() }}</div>
                        <div class="text-xs text-gray-500">last 30d</div>
                    </div>
                </div>
                <div class="mt-3 text-xs text-gray-500">Tracked via <code class="text-gray-400">synced_at</code></div>
            </div>
        </div>

        <!-- Queue breakdown -->
        <div class="grid gap-4 lg:grid-cols-2">
            <div class="rounded-xl border border-gray-800 bg-gray-900 p-5">
                <h2 class="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">Queued by queue</h2>
                <div class="space-y-2">
                    <div
                        v-for="row in metrics.queued_by_queue"
                        :key="`q-${row.queue}`"
                        class="flex items-center justify-between border-b border-gray-800/60 pb-1.5 text-sm last:border-b-0"
                    >
                        <span class="font-mono text-gray-300">{{ row.queue }}</span>
                        <span :class="row.count > 0 ? 'text-primary-300' : 'text-gray-600'">
                            {{ row.count.toLocaleString() }}
                        </span>
                    </div>
                </div>
            </div>
            <div class="rounded-xl border border-gray-800 bg-gray-900 p-5">
                <h2 class="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">Failed by queue</h2>
                <div class="space-y-2">
                    <div
                        v-for="row in metrics.failed_by_queue"
                        :key="`f-${row.queue}`"
                        class="flex items-center justify-between border-b border-gray-800/60 pb-1.5 text-sm last:border-b-0"
                    >
                        <span class="font-mono text-gray-300">{{ row.queue }}</span>
                        <span :class="row.count > 0 ? 'text-red-400' : 'text-gray-600'">
                            {{ row.count.toLocaleString() }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sync states -->
        <div class="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">Sync runs</h2>
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div
                    v-for="(state, mode) in syncStates"
                    :key="`sync-${mode}`"
                    class="rounded-lg border border-gray-800 bg-gray-950 p-3"
                >
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium capitalize text-gray-200">{{ mode }}</span>
                        <span class="text-xs font-medium capitalize" :class="syncStatusColor(state.status)">
                            {{ state.status }}
                        </span>
                    </div>
                    <div v-if="state.progress" class="mt-2">
                        <div class="text-xs text-gray-500">
                            Page {{ state.progress.last_completed_page ?? 0 }}/{{ state.progress.last_page ?? '?' }}
                            <span v-if="state.progress.total">
                                · {{ state.progress.total.toLocaleString() }} items
                            </span>
                        </div>
                        <div v-if="progressPercent(state) !== null" class="mt-1 h-1.5 w-full overflow-hidden rounded bg-gray-800">
                            <div
                                class="h-full bg-primary-500 transition-all"
                                :style="{ width: `${progressPercent(state)}%` }"
                            />
                        </div>
                        <div v-if="state.progress.started_at" class="mt-1 text-[11px] text-gray-600">
                            Started {{ formatDate(state.progress.started_at) }}
                        </div>
                    </div>
                    <div v-else class="mt-2 text-xs text-gray-600">No active progress</div>
                    <div v-if="state.last_run" class="mt-1 text-[11px] text-gray-600">
                        Last run cutoff {{ formatTimestamp(state.last_run) }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Actions -->
        <div class="grid gap-4 lg:grid-cols-2">
            <div class="rounded-xl border border-gray-800 bg-gray-900 p-5">
                <h2 class="mb-1 text-sm font-semibold uppercase tracking-wide text-gray-400">Queue an anime refresh</h2>
                <p class="mb-3 text-xs text-gray-500">
                    Dispatches a job that fetches the AniList record and re-persists it. Useful for fixing stale entries.
                </p>
                <form class="flex flex-col gap-2 sm:flex-row" @submit.prevent="submitEnqueue">
                    <input
                        v-model="enqueueForm.anilist_id"
                        type="number"
                        min="1"
                        placeholder="AniList ID (e.g. 21)"
                        class="flex-1 rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-gray-200 placeholder-gray-600 outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    />
                    <button
                        type="submit"
                        :disabled="enqueueForm.processing || !enqueueForm.anilist_id"
                        class="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {{ enqueueForm.processing ? 'Queueing…' : 'Queue refresh' }}
                    </button>
                </form>
                <div v-if="enqueueForm.errors.anilist_id" class="mt-2 text-xs text-red-400">
                    {{ enqueueForm.errors.anilist_id }}
                </div>
            </div>

            <div class="rounded-xl border border-gray-800 bg-gray-900 p-5">
                <h2 class="mb-1 text-sm font-semibold uppercase tracking-wide text-gray-400">Trigger incremental sync</h2>
                <p class="mb-3 text-xs text-gray-500">
                    Fetches anime updated on AniList since the last incremental run. Falls back to last 24h if there is no prior run.
                </p>
                <button
                    type="button"
                    class="rounded-lg border border-gray-700 bg-gray-950 px-4 py-2 text-sm text-gray-200 transition hover:border-primary-500 hover:text-primary-400"
                    @click="dispatchIncremental"
                >
                    Dispatch incremental sync
                </button>
            </div>
        </div>

        <!-- Recent failed jobs -->
        <div class="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
                Recent failures
                <span class="ml-2 text-xs font-normal text-gray-600">{{ recentFailed.length }} shown</span>
            </h2>
            <div v-if="recentFailed.length === 0" class="py-6 text-center text-sm text-gray-500">
                No recent failures.
            </div>
            <div v-else class="space-y-2">
                <div
                    v-for="job in recentFailed"
                    :key="job.uuid"
                    class="rounded-lg border border-gray-800 bg-gray-950 p-3 text-sm"
                >
                    <div class="flex flex-wrap items-start justify-between gap-2">
                        <div class="min-w-0 flex-1">
                            <div class="flex items-center gap-2">
                                <span class="font-mono text-xs text-gray-400">{{ job.queue }}</span>
                                <span class="text-gray-200">{{ job.job_class ?? 'unknown' }}</span>
                            </div>
                            <div class="mt-1 break-words text-xs text-red-300">{{ job.exception_summary }}</div>
                            <div class="mt-1 text-[11px] text-gray-500">
                                {{ formatDate(job.failed_at) }} · <span class="font-mono">{{ job.uuid }}</span>
                            </div>
                        </div>
                        <div class="flex shrink-0 gap-2">
                            <button
                                type="button"
                                class="rounded bg-primary-600/20 px-2.5 py-1 text-xs text-primary-300 transition hover:bg-primary-600/30 disabled:opacity-50"
                                :disabled="retryingUuid === job.uuid"
                                @click="retryJob(job.uuid)"
                            >
                                {{ retryingUuid === job.uuid ? 'Retrying…' : 'Retry' }}
                            </button>
                            <button
                                type="button"
                                class="rounded bg-gray-800 px-2.5 py-1 text-xs text-gray-300 transition hover:bg-gray-700 disabled:opacity-50"
                                :disabled="forgettingUuid === job.uuid"
                                @click="forgetJob(job.uuid)"
                            >
                                {{ forgettingUuid === job.uuid ? 'Removing…' : 'Forget' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recent activity -->
        <div class="grid gap-4 lg:grid-cols-2">
            <div class="rounded-xl border border-gray-800 bg-gray-900 p-5">
                <h2 class="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">Recently added anime</h2>
                <div v-if="recentlyAdded.length === 0" class="py-4 text-center text-sm text-gray-500">
                    Nothing new yet.
                </div>
                <ul v-else class="space-y-2">
                    <li
                        v-for="anime in recentlyAdded"
                        :key="`a-${anime.id}`"
                        class="flex items-center justify-between gap-3 text-sm"
                    >
                        <div class="flex min-w-0 items-center gap-2">
                            <img
                                v-if="anime.cover_image_medium"
                                :src="anime.cover_image_medium"
                                :alt="anime.title"
                                class="h-9 w-7 flex-shrink-0 rounded object-cover"
                            />
                            <div class="min-w-0">
                                <div class="truncate text-gray-200">{{ anime.title }}</div>
                                <div class="text-[11px] text-gray-500">AniList #{{ anime.anilist_id }}</div>
                            </div>
                        </div>
                        <span class="shrink-0 text-xs text-gray-500">{{ formatDate(anime.created_at) }}</span>
                    </li>
                </ul>
            </div>

            <div class="rounded-xl border border-gray-800 bg-gray-900 p-5">
                <h2 class="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">Recently synced anime</h2>
                <div v-if="recentlyUpdated.length === 0" class="py-4 text-center text-sm text-gray-500">
                    No sync activity yet.
                </div>
                <ul v-else class="space-y-2">
                    <li
                        v-for="anime in recentlyUpdated"
                        :key="`u-${anime.id}`"
                        class="flex items-center justify-between gap-3 text-sm"
                    >
                        <div class="flex min-w-0 items-center gap-2">
                            <img
                                v-if="anime.cover_image_medium"
                                :src="anime.cover_image_medium"
                                :alt="anime.title"
                                class="h-9 w-7 flex-shrink-0 rounded object-cover"
                            />
                            <div class="min-w-0">
                                <div class="truncate text-gray-200">{{ anime.title }}</div>
                                <div class="text-[11px] text-gray-500">AniList #{{ anime.anilist_id }}</div>
                            </div>
                        </div>
                        <span class="shrink-0 text-xs text-gray-500">{{ formatDate(anime.synced_at) }}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
