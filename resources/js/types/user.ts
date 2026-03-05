export interface User {
    id: number
    name: string
    username: string
    email: string
    avatar_url: string | null
    bio: string | null
    timezone: string
    list_is_public: boolean
}

export interface UserProfile {
    id: number
    name: string
    username: string
    avatar_url: string | null
    bio: string | null
    timezone: string
    list_is_public: boolean
    created_at: string
}
