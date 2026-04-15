<script setup lang="ts">
import { ref } from 'vue'
import { Link, router } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/AppLayout.vue'
import PaginationBar from '@/Components/PaginationBar.vue'
import type { StudioCard } from '@/types/anime'

defineOptions({ layout: AppLayout })

interface StudiosData {
    data: StudioCard[]
    meta: {
        current_page: number
        last_page: number
        per_page: number
        total: number
    }
}

const props = defineProps<{
    studios: StudiosData
    filters: { search: string }
}>()

const search = ref(props.filters.search)

let searchDebounce: ReturnType<typeof setTimeout> | null = null

function applySearch() {
    const params: Record<string, string> = {}
    const term = search.value.trim()
    if (term !== '') {
        params.search = term
    }

    router.get(route('studios.index'), params, {
        preserveState: true,
        preserveScroll: false,
        replace: true,
    })
}

function onSearchInput() {
    if (searchDebounce) clearTimeout(searchDebounce)
    searchDebounce = setTimeout(applySearch, 400)
}

function onSearchSubmit() {
    if (searchDebounce) {
        clearTimeout(searchDebounce)
        searchDebounce = null
    }
    applySearch()
}

function studioUrl(studio: StudioCard): string {
    return studio.slug ? route('studios.show', { studio: studio.slug }) : '#'
}
</script>

<template>
    <Head title="Anime Studios">
        <meta name="description" content="Browse anime by studio. Explore every show produced by your favorite animation studios on AniTrack." />
        <link rel="canonical" :href="route('studios.index')" />
    </Head>

    <div>
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-100 md:text-3xl">Anime Studios</h1>
            <p class="mt-1 text-sm text-gray-400">
                Browse {{ studios.meta.total.toLocaleString() }} animation studios.
            </p>
        </div>

        <div class="mb-6">
            <form @submit.prevent="onSearchSubmit">
                <input
                    v-model="search"
                    type="search"
                    placeholder="Search studios..."
                    class="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-gray-200 placeholder-gray-500 outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    @input="onSearchInput"
                />
            </form>
        </div>

        <div v-if="studios.data.length" class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Link
                v-for="studio in studios.data"
                :key="studio.id"
                :href="studioUrl(studio)"
                class="group flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/40 px-4 py-3 transition hover:border-primary-600 hover:bg-gray-900"
            >
                <span class="truncate font-medium text-gray-200 group-hover:text-primary-400">
                    {{ studio.name }}
                </span>
                <span class="ml-3 shrink-0 rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-400">
                    {{ studio.anime_count }}
                </span>
            </Link>
        </div>
        <div v-else class="py-16 text-center">
            <p class="text-gray-500">No studios found.</p>
        </div>

        <div class="mt-8">
            <PaginationBar
                :current-page="studios.meta.current_page"
                :last-page="studios.meta.last_page"
                :total="studios.meta.total"
            />
        </div>
    </div>
</template>
