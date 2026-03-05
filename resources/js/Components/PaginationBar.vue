<script setup lang="ts">
import { router } from '@inertiajs/vue3'

const props = defineProps<{
    currentPage: number
    lastPage: number
    total: number
}>()

function goToPage(page: number) {
    if (page < 1 || page > props.lastPage || page === props.currentPage) return

    const params = new URLSearchParams(window.location.search)
    params.set('page', String(page))

    router.get(`${window.location.pathname}?${params.toString()}`, {}, {
        preserveState: true,
        preserveScroll: false,
    })
}

function visiblePages(): number[] {
    const pages: number[] = []
    const start = Math.max(1, props.currentPage - 2)
    const end = Math.min(props.lastPage, props.currentPage + 2)

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }
    return pages
}
</script>

<template>
    <nav v-if="lastPage > 1" class="flex items-center justify-center gap-1">
        <button
            class="rounded-lg px-3 py-2 text-sm text-gray-400 transition hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
        >
            Prev
        </button>

        <button
            v-if="visiblePages()[0] > 1"
            class="rounded-lg px-3 py-2 text-sm text-gray-400 transition hover:bg-gray-800"
            @click="goToPage(1)"
        >
            1
        </button>
        <span v-if="visiblePages()[0] > 2" class="px-1 text-gray-600">&hellip;</span>

        <button
            v-for="page in visiblePages()"
            :key="page"
            class="rounded-lg px-3 py-2 text-sm transition"
            :class="page === currentPage ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-gray-800'"
            @click="goToPage(page)"
        >
            {{ page }}
        </button>

        <span v-if="visiblePages()[visiblePages().length - 1] < lastPage - 1" class="px-1 text-gray-600">&hellip;</span>
        <button
            v-if="visiblePages()[visiblePages().length - 1] < lastPage"
            class="rounded-lg px-3 py-2 text-sm text-gray-400 transition hover:bg-gray-800"
            @click="goToPage(lastPage)"
        >
            {{ lastPage }}
        </button>

        <button
            class="rounded-lg px-3 py-2 text-sm text-gray-400 transition hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
            :disabled="currentPage === lastPage"
            @click="goToPage(currentPage + 1)"
        >
            Next
        </button>
    </nav>
</template>
