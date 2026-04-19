export interface User {
    id: number
    name: string
    username: string
    email: string
    avatar_url: string | null
    bio: string | null
    timezone: string
    is_admin: boolean
    list_is_public: boolean
    roles: string[]
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
