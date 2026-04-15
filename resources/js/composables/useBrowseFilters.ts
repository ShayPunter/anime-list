import { computed, reactive } from 'vue'
import { router } from '@inertiajs/vue3'
import type { BrowseFilters } from '@/types'

export function useBrowseFilters() {
    // Initialize from current URL query params
    const params = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search)
        : new URLSearchParams()

    const filters = reactive<BrowseFilters>({
        search: params.get('filter[search]') || undefined,
        format: (params.get('filter[format]') as BrowseFilters['format']) || undefined,
        status: (params.get('filter[status]') as BrowseFilters['status']) || undefined,
        season: (params.get('filter[season]') as BrowseFilters['season']) || undefined,
        season_year: params.get('filter[season_year]') ? Number(params.get('filter[season_year]')) : undefined,
        genre: params.get('filter[genre]') || undefined,
        studio: params.get('filter[studio]') ? Number(params.get('filter[studio]')) : undefined,
        sort: params.get('sort') || undefined,
    })

    function applyFilters() {
        const query: Record<string, string> = {}

        if (filters.search && filters.search.trim()) query['filter[search]'] = filters.search.trim()
        if (filters.format) query['filter[format]'] = filters.format
        if (filters.status) query['filter[status]'] = filters.status
        if (filters.season) query['filter[season]'] = filters.season
        if (filters.season_year) query['filter[season_year]'] = String(filters.season_year)
        if (filters.genre) query['filter[genre]'] = filters.genre
        if (filters.studio) query['filter[studio]'] = String(filters.studio)
        if (filters.sort) query['sort'] = filters.sort

        router.get(route('anime.index'), query, {
            preserveState: true,
            preserveScroll: false,
        })
    }

    function clearFilters() {
        filters.search = undefined
        filters.format = undefined
        filters.status = undefined
        filters.season = undefined
        filters.season_year = undefined
        filters.genre = undefined
        filters.studio = undefined
        filters.sort = undefined
        applyFilters()
    }

    const hasActiveFilters = computed(() => {
        return !!(filters.search || filters.format || filters.status || filters.season ||
            filters.season_year || filters.genre || filters.studio)
    })

    return {
        filters,
        applyFilters,
        clearFilters,
        hasActiveFilters,
    }
}
