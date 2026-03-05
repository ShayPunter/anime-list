<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import axios from 'axios'
import type { MalPreviewEntry, ImportResult, ImportStatus } from '@/types'
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'

type Step = 'upload' | 'preview' | 'processing' | 'done'

const step = ref<Step>('upload')
const preview = ref<MalPreviewEntry[]>([])
const token = ref('')
const total = ref(0)
const progress = ref(0)
const result = ref<ImportResult | null>(null)
const overwrite = ref(false)
const uploading = ref(false)
const confirming = ref(false)
const error = ref('')

let pollTimer: ReturnType<typeof setInterval> | null = null

async function handleUpload(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    uploading.value = true
    error.value = ''

    try {
        const formData = new FormData()
        formData.append('file', file)

        const { data } = await axios.post<{ token: string; entries: MalPreviewEntry[]; total: number }>(
            route('import.upload'),
            formData,
        )

        token.value = data.token
        preview.value = data.entries
        total.value = data.total
        step.value = 'preview'
    } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
            error.value = e.response?.data?.message ?? 'Failed to parse XML file'
        } else {
            error.value = 'Failed to parse XML file'
        }
    } finally {
        uploading.value = false
    }
}

async function confirmImport() {
    confirming.value = true
    error.value = ''

    try {
        const { data } = await axios.post<{ status: string; result?: ImportResult; token?: string }>(
            route('import.confirm'),
            { token: token.value, overwrite_existing: overwrite.value },
        )

        if (data.status === 'done') {
            result.value = data.result ?? null
            step.value = 'done'
        } else {
            step.value = 'processing'
            startPolling()
        }
    } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
            error.value = e.response?.data?.error ?? 'Import failed'
        } else {
            error.value = 'Import failed'
        }
    } finally {
        confirming.value = false
    }
}

function startPolling() {
    pollTimer = setInterval(async () => {
        try {
            const { data } = await axios.get<ImportStatus>(route('import.status'), {
                params: { token: token.value },
            })

            progress.value = data.processed

            if (data.status === 'done') {
                result.value = data.result ?? null
                step.value = 'done'
                stopPolling()
            } else if (data.status === 'failed') {
                error.value = 'Import failed during processing'
                step.value = 'upload'
                stopPolling()
            }
        } catch {
            error.value = 'Failed to check import status'
            stopPolling()
        }
    }, 2000)
}

function stopPolling() {
    if (pollTimer) {
        clearInterval(pollTimer)
        pollTimer = null
    }
}

onUnmounted(stopPolling)

function reset() {
    step.value = 'upload'
    preview.value = []
    token.value = ''
    total.value = 0
    progress.value = 0
    result.value = null
    error.value = ''
    overwrite.value = false
}
</script>

<template>
    <div class="max-w-2xl mx-auto">
        <!-- Error -->
        <div v-if="error" class="mb-4 rounded-lg border border-red-800 bg-red-900/30 px-4 py-3 text-red-300 text-sm">
            {{ error }}
        </div>

        <!-- Step 1: Upload -->
        <div v-if="step === 'upload'" class="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
            <h2 class="text-lg font-semibold mb-2">Import from MyAnimeList</h2>
            <p class="text-gray-400 text-sm mb-6">
                Upload your MAL XML export file. You can export your list from
                MyAnimeList under Settings → Import/Export.
            </p>
            <label class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-600 px-8 py-6 hover:border-gray-500 transition">
                <input
                    type="file"
                    accept=".xml"
                    class="hidden"
                    @change="handleUpload"
                />
                <span class="text-gray-300">
                    {{ uploading ? 'Parsing...' : 'Choose XML file' }}
                </span>
            </label>
        </div>

        <!-- Step 2: Preview -->
        <div v-else-if="step === 'preview'" class="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
            <h2 class="text-lg font-semibold">Preview — {{ total }} entries found</h2>

            <div class="max-h-64 overflow-y-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="text-left text-gray-400 border-b border-gray-800">
                            <th class="py-2 pr-4">Title</th>
                            <th class="py-2 pr-4">Status</th>
                            <th class="py-2 pr-4">Score</th>
                            <th class="py-2">Progress</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(entry, i) in preview" :key="i" class="border-b border-gray-800/50">
                            <td class="py-1.5 pr-4 text-gray-300">{{ entry.title }}</td>
                            <td class="py-1.5 pr-4 text-gray-400">{{ entry.status }}</td>
                            <td class="py-1.5 pr-4 text-gray-400">{{ entry.score > 0 ? entry.score / 10 : '-' }}</td>
                            <td class="py-1.5 text-gray-400">{{ entry.progress }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p v-if="total > 20" class="text-xs text-gray-500">
                Showing first 20 of {{ total }} entries.
            </p>

            <label class="flex items-center gap-2 text-sm text-gray-300">
                <input v-model="overwrite" type="checkbox" class="rounded border-gray-600" />
                Overwrite existing entries
            </label>

            <div class="flex gap-2">
                <Button label="Cancel" severity="secondary" text @click="reset" />
                <Button
                    :label="`Import ${total} entries`"
                    :loading="confirming"
                    @click="confirmImport"
                />
            </div>
        </div>

        <!-- Step 3: Processing -->
        <div v-else-if="step === 'processing'" class="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center space-y-4">
            <h2 class="text-lg font-semibold">Importing...</h2>
            <ProgressBar :value="total > 0 ? Math.round((progress / total) * 100) : 0" />
            <p class="text-sm text-gray-400">{{ progress }} / {{ total }} entries processed</p>
        </div>

        <!-- Step 4: Done -->
        <div v-else-if="step === 'done' && result" class="bg-gray-900 border border-gray-800 rounded-xl p-8 space-y-4">
            <h2 class="text-lg font-semibold text-green-400">Import Complete</h2>
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div class="rounded-lg bg-gray-800 p-4 text-center">
                    <div class="text-2xl font-bold text-primary-400">{{ result.imported }}</div>
                    <div class="text-xs text-gray-400">Imported</div>
                </div>
                <div class="rounded-lg bg-gray-800 p-4 text-center">
                    <div class="text-2xl font-bold text-gray-300">{{ result.skipped }}</div>
                    <div class="text-xs text-gray-400">Skipped</div>
                </div>
                <div class="rounded-lg bg-gray-800 p-4 text-center">
                    <div class="text-2xl font-bold text-red-400">{{ result.errors }}</div>
                    <div class="text-xs text-gray-400">Errors</div>
                </div>
                <div class="rounded-lg bg-gray-800 p-4 text-center">
                    <div class="text-2xl font-bold text-gray-300">{{ result.total }}</div>
                    <div class="text-xs text-gray-400">Total</div>
                </div>
            </div>
            <div class="flex gap-2">
                <Link :href="route('list')">
                    <Button label="Go to My List" />
                </Link>
                <Button label="Import Another" severity="secondary" text @click="reset" />
            </div>
        </div>
    </div>
</template>
