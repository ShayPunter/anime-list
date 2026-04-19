export interface AdminUser {
    id: number
    name: string
    username: string
    email: string
    avatar_url: string | null
    is_admin: boolean
    list_is_public: boolean
    created_at: string
    anime_count: number
}

export interface AdminStats {
    total_users: number
    new_users_this_month: number
    total_anime: number
    total_list_entries: number
    total_episodes_watched: number
    active_users_today: number
}

export interface SyncStatuses {
    releasing: string
    incremental: string
    schedule: string
}

export interface AdminAnimeListItem {
    id: number
    slug: string | null
    title: string
    title_secondary: string | null
    format: string | null
    status: string | null
    season: string | null
    season_year: number | null
    cover_image_medium: string | null
    synopsis_excerpt: string | null
    synopsis_rewritten_at: string | null
}

export interface AdminAnimeEdit {
    id: number
    slug: string | null
    title_english: string | null
    title_romaji: string
    title_native: string | null
    cover_image_medium: string | null
    format: string | null
    status: string | null
    season: string | null
    season_year: number | null
    synopsis: string | null
    synopsis_rewritten_at: string | null
}
