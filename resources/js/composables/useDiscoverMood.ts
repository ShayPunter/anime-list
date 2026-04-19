import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import type { AnimeCard } from '@/types/anime'

export type DiscoverLength = 'short' | 'standard' | 'long' | 'movie'

interface MoodResponse {
    slug: string
    length: DiscoverLength | null
    data: AnimeCard[]
}

export function useDiscoverMood(
    selectedMood: Ref<string | null>,
    selectedLength: Ref<DiscoverLength | null>,
) {
    const enabled = computed(() => selectedMood.value !== null)

    const { data, isFetching, isError } = useQuery<MoodResponse>({
        queryKey: ['discover-mood', selectedMood, selectedLength],
        queryFn: async ({ signal }) => {
            const slug = selectedMood.value
            if (!slug) {
                return { slug: '', length: null, data: [] }
            }
            const { data } = await axios.get<MoodResponse>(
                `/api/discover/mood/${encodeURIComponent(slug)}`,
                {
                    params: selectedLength.value ? { length: selectedLength.value } : undefined,
                    signal,
                },
            )
            return data
        },
        enabled,
        staleTime: 5 * 60 * 1000,
    })

    const results = computed<AnimeCard[]>(() => data.value?.data ?? [])

    return {
        results,
        isLoading: isFetching,
        isError,
    }
}
