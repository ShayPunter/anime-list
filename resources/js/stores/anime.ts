import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AnimeSeason } from '@/types'

export const useAnimeStore = defineStore('anime', () => {
    const currentSeason = ref<AnimeSeason>(getCurrentSeason())
    const currentYear = ref(new Date().getFullYear())

    function getCurrentSeason(): AnimeSeason {
        const month = new Date().getMonth() + 1
        if (month <= 3) return 'WINTER'
        if (month <= 6) return 'SPRING'
        if (month <= 9) return 'SUMMER'
        return 'FALL'
    }

    return { currentSeason, currentYear, getCurrentSeason }
})
