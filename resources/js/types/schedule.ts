import type { Genre } from './anime'

export interface ScheduleAnime {
    id: number
    title_romaji: string
    title_english: string | null
    cover_image_medium: string | null
    cover_image_color: string | null
    average_score: number | null
    format: string | null
    episodes: number | null
    genres: Genre[]
}

export interface ScheduleSlot {
    id: number
    episode: number
    airs_at: string // ISO8601 UTC
    anime: ScheduleAnime | null
}

// Keyed by UTC date string "YYYY-MM-DD"
export type ScheduleDayMap = Record<string, ScheduleSlot[]>
