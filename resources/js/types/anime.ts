export interface AnimeCard {
    id: number | null
    slug: string | null
    anilist_id: number
    title_romaji: string
    title_english: string | null
    format: AnimeFormat | null
    status: AnimeStatus | null
    season: AnimeSeason | null
    season_year: number | null
    episodes: number | null
    cover_image_large: string | null
    cover_image_medium: string | null
    cover_image_color: string | null
    average_score: number | null
    bayesian_score: number | null
    popularity: number | null
    genres: Genre[]
    next_airing_episode: AiringScheduleEntry | null
}

export interface AnimeDetail extends AnimeCard {
    anilist_id: number
    mal_id: number | null
    title_native: string | null
    title_synonyms: string[] | null
    source: string | null
    duration: number | null
    episode_count_unknown: boolean
    aired_from: string | null
    aired_to: string | null
    synopsis: string | null
    cover_image_large: string | null
    banner_image: string | null
    trailer_url: string | null
    mean_score: number | null
    trending: number | null
    favourites: number | null
    is_adult: boolean
    studios: StudioEntry[]
    external_ids: ExternalId[]
    airing_schedules: AiringScheduleEntry[]
    relations: AnimeRelationEntry[]
}

// Keep legacy Anime type as alias for backward compatibility
export type Anime = AnimeDetail

export interface Genre {
    id: number
    name: string
}

export interface StudioEntry {
    id: number
    name: string
    is_animation_studio: boolean
    is_main: boolean
}

export interface Studio {
    id: number
    anilist_id: number
    name: string
    is_animation_studio: boolean
    pivot?: { is_main: boolean }
}

export interface AiringScheduleEntry {
    id: number
    episode: number
    airs_at: string
}

export interface AiringSchedule {
    id: number
    anime_id: number
    episode: number
    airs_at: string
    time_until_airing: number | null
}

export interface AnimeRelationEntry {
    id: number
    relation_type: string
    related_anime: RelatedAnimeCard | null
}

export interface RelatedAnimeCard {
    id: number
    slug: string | null
    title_romaji: string
    title_english: string | null
    format: AnimeFormat | null
    status: AnimeStatus | null
    cover_image_medium: string | null
    cover_image_color: string | null
    average_score: number | null
    genres: Genre[]
}

export interface SeasonEntry {
    id: number
    slug: string | null
    title_romaji: string
    title_english: string | null
    cover_image_large: string | null
    cover_image_medium: string | null
    episodes: number | null
    format: AnimeFormat | null
    status: AnimeStatus | null
    average_score: number | null
    is_current: boolean
}

export interface AnimeRelation {
    id: number
    anime_id: number
    related_anime_id: number
    relation_type: string
    related_anime?: Anime
}

export interface ExternalId {
    id: number
    platform: string
    external_id: string | null
    url: string | null
}

export interface SeasonalGroup {
    format: string
    anime: AnimeCard[]
}

export interface AdjacentSeasons {
    previous: { year: number; season: AnimeSeason }
    next: { year: number; season: AnimeSeason }
}

export interface BrowseFilters {
    format?: AnimeFormat
    status?: AnimeStatus
    season?: AnimeSeason
    season_year?: number
    genre?: string
    studio?: number
    sort?: string
}

export interface FilterOption {
    id: number | string
    name: string
}

export type AnimeFormat = 'TV' | 'TV_SHORT' | 'MOVIE' | 'SPECIAL' | 'OVA' | 'ONA' | 'MUSIC'
export type AnimeStatus = 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED' | 'HIATUS'
export type AnimeSeason = 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL'
