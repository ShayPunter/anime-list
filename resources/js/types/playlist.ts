import type { AnimeCard } from './anime'

export interface PlaylistItem {
    id: number
    position: number
    note: string | null
    is_optional: boolean
    anime: AnimeCard
}

export interface PlaylistResource {
    id: number
    title: string
    description: string | null
    slug: string
    is_public: boolean
    item_count: number
    user: { id: number; username: string; avatar_url: string | null }
    items: PlaylistItem[]
    created_at: string
    updated_at: string
}

export interface PlaylistCard {
    id: number
    title: string
    slug: string
    is_public: boolean
    item_count: number
    cover_images: string[]
    updated_at: string
}

export interface PlaylistPayload {
    title: string
    description?: string | null
    is_public?: boolean
}

export interface PlaylistItemPayload {
    anime_id: number
    note?: string | null
    is_optional?: boolean
}
