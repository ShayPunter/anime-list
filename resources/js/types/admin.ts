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

export interface AdminRoleUser {
    id: number
    name: string
    username: string
    avatar_url: string | null
}

export interface AdminRole {
    id: number
    slug: string
    name: string
    description: string | null
    users: AdminRoleUser[]
}
