// Mirrors the public API v1 response shapes. Kept manually in sync with:
// - app/Http/Resources/ListEntryResource.php
// - app/Http/Resources/AnimeCardResource.php
// - app/Http/Controllers/Api/V1/AuthController.php

export type ListStatus =
    | 'watching'
    | 'completed'
    | 'on_hold'
    | 'dropped'
    | 'plan_to_watch';

export interface AuthenticatedUser {
    id: number;
    name: string;
    username: string;
    email: string;
}

export interface IssueTokenResponse {
    token: string;
    token_id: number;
    device_name: string;
    user: AuthenticatedUser;
}

export interface Genre {
    id: number;
    name: string;
    slug: string;
}

export interface AnimeCard {
    id: number;
    slug: string;
    anilist_id: number | null;
    title_romaji: string | null;
    title_english: string | null;
    format: string | null;
    status: string | null;
    season: string | null;
    season_year: number | null;
    episodes: number | null;
    cover_image_large: string | null;
    cover_image_medium: string | null;
    cover_image_color: string | null;
    average_score: number | null;
    bayesian_score: number | null;
    popularity: number | null;
    genres?: Genre[];
}

export interface ListEntry {
    id: number;
    anime_id: number;
    status: ListStatus;
    score: number | null;
    display_score: number | null;
    progress: number;
    rewatch_count: number;
    is_rewatching: boolean;
    started_at: string | null;
    completed_at: string | null;
    notes: string | null;
    tags: string[];
    is_private: boolean | null;
    updated_at: string;
    anime?: AnimeCard;
}

export interface ListIndexResponse {
    data: ListEntry[];
    total: number;
}

export interface SearchResponse {
    data: AnimeCard[];
    query: string;
    total: number;
}

export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
}
