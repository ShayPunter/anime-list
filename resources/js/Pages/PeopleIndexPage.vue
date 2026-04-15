<script setup lang="ts">
import { ref } from 'vue'
import { router } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/AppLayout.vue'
import PaginationBar from '@/Components/PaginationBar.vue'
import type { PersonCard } from '@/types/anime'

defineOptions({ layout: AppLayout })

interface PeopleData {
    data: PersonCard[]
    meta: {
        current_page: number
        last_page: number
        per_page: number
        total: number
    }
}

const props = defineProps<{
    people: PeopleData
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

    router.get(route('people.index'), params, {
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

function personUrl(person: PersonCard): string {
    return person.slug ? route('people.show', { person: person.slug }) : '#'
}
</script>

<template>
    <Head title="Voice Actors">
        <meta name="description" content="Browse Japanese voice actors and their anime roles on AniTrack." />
        <link rel="canonical" :href="route('people.index')" />
    </Head>

    <div>
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-100 md:text-3xl">Voice Actors</h1>
            <p class="mt-1 text-sm text-gray-400">
                Browse {{ people.meta.total.toLocaleString() }} Japanese voice actors.
            </p>
        </div>

        <div class="mb-6">
            <form @submit.prevent="onSearchSubmit">
                <input
                    v-model="search"
                    type="search"
                    placeholder="Search voice actors..."
                    class="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-gray-200 placeholder-gray-500 outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    @input="onSearchInput"
                />
            </form>
        </div>

        <div v-if="people.data.length" class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            <Link
                v-for="person in people.data"
                :key="person.id"
                :href="personUrl(person)"
                class="group block"
            >
                <div class="aspect-[3/4] overflow-hidden rounded-lg bg-gray-800">
                    <img
                        v-if="person.image_medium"
                        :src="person.image_medium"
                        :alt="person.name_full"
                        class="h-full w-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                    />
                    <div v-else class="flex h-full items-center justify-center text-gray-600">
                        <span class="text-4xl">?</span>
                    </div>
                </div>
                <div class="mt-2">
                    <h3 class="line-clamp-2 text-sm font-medium text-gray-200 group-hover:text-primary-400 transition">
                        {{ person.name_full }}
                    </h3>
                    <p v-if="person.name_native" class="line-clamp-1 text-xs text-gray-500">{{ person.name_native }}</p>
                    <p class="mt-0.5 text-xs text-gray-500">{{ person.role_count }} role{{ person.role_count === 1 ? '' : 's' }}</p>
                </div>
            </Link>
        </div>
        <div v-else class="py-16 text-center">
            <p class="text-gray-500">No voice actors found.</p>
        </div>

        <div class="mt-8">
            <PaginationBar
                :current-page="people.meta.current_page"
                :last-page="people.meta.last_page"
                :total="people.meta.total"
            />
        </div>
    </div>
</template>
