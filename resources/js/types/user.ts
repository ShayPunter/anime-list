export interface User {
    id: number
    name: string
    email: string
    avatar_url: string | null
    bio: string | null
    timezone: string
}

export interface UserProfile {
    id: number
    name: string
    avatar_url: string | null
    bio: string | null
    timezone: string
    created_at: string
}
