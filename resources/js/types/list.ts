import type { AnimeCard } from './anime'

export type ListStatus = 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch'

export type ListViewMode = 'table' | 'card' | 'compact'

export interface ListEntryResource {
    id: number
    anime_id: number
    status: ListStatus
    score: number | null
    display_score: number | null
    progress: number
    rewatch_count: number
    is_rewatching: boolean
    started_at: string | null
    completed_at: string | null
    notes: string | null
    tags: string[]
    is_private: boolean
    updated_at: string
    anime?: AnimeCard
}

export interface UserAnimeListEntry {
    id: number
    user_id: number
    anime_id: number
    status: ListStatus
    score: number
    progress: number
    rewatch_count: number
    started_at: string | null
    completed_at: string | null
    notes: string | null
    tags: string[] | null
    is_private: boolean
    is_rewatching: boolean
    anime?: AnimeCard
}

export interface ListEntryPayload {
    anime_id: number
    status: ListStatus
    score?: number | null
    progress?: number
    started_at?: string | null
    completed_at?: string | null
    notes?: string | null
    is_private?: boolean
}

export interface MalPreviewEntry {
    mal_id: number | null
    title: string
    status: ListStatus
    score: number
    progress: number
    started_at: string | null
    completed_at: string | null
}

export interface ImportResult {
    imported: number
    skipped: number
    errors: number
    total: number
}

export interface ImportStatus {
    status: 'pending' | 'fetching' | 'processing' | 'done' | 'failed'
    processed: number
    total: number
    result?: ImportResult
}

export const LIST_STATUS_LABELS: Record<ListStatus, string> = {
    watching: 'Watching',
    completed: 'Completed',
    on_hold: 'On Hold',
    dropped: 'Dropped',
    plan_to_watch: 'Plan to Watch',
}
