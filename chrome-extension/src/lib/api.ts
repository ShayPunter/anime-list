import type {
    AnimeCard,
    ApiError,
    IssueTokenResponse,
    ListEntry,
    ListIndexResponse,
    ListStatus,
    SearchResponse,
} from '@/types/api';
import { DEVICE_NAME } from './config';
import { clearAuth, getAuth, getSettings, setAuth } from './storage';

export class ApiClientError extends Error {
    constructor(
        public status: number,
        message: string,
        public errors?: Record<string, string[]>,
    ) {
        super(message);
        this.name = 'ApiClientError';
    }
}

async function request<T>(
    path: string,
    init: RequestInit & { auth?: boolean } = {},
): Promise<T> {
    const { auth = true, ...rest } = init;
    const { apiBaseUrl } = await getSettings();
    const headers = new Headers(rest.headers);
    headers.set('Accept', 'application/json');
    if (rest.body && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    if (auth) {
        const current = await getAuth();
        if (!current) throw new ApiClientError(401, 'Not authenticated.');
        headers.set('Authorization', `Bearer ${current.token}`);
    }

    const response = await fetch(`${apiBaseUrl}${path}`, { ...rest, headers });

    if (response.status === 401 && auth) {
        // Token revoked or invalid — clear local auth so the UI returns to login.
        await clearAuth();
    }

    if (response.status === 204) {
        return undefined as T;
    }

    const text = await response.text();
    const payload = text ? (JSON.parse(text) as unknown) : null;

    if (!response.ok) {
        const err = (payload as ApiError | null) ?? { message: response.statusText };
        throw new ApiClientError(response.status, err.message ?? 'Request failed.', err.errors);
    }

    return payload as T;
}

// -- Auth ------------------------------------------------------------------

export async function login(email: string, password: string): Promise<IssueTokenResponse> {
    const data = await request<IssueTokenResponse>('/api/v1/auth/token', {
        auth: false,
        method: 'POST',
        body: JSON.stringify({ email, password, device_name: DEVICE_NAME }),
    });

    await setAuth({
        token: data.token,
        tokenId: data.token_id,
        user: data.user,
    });

    return data;
}

export async function logout(): Promise<void> {
    try {
        await request<void>('/api/v1/auth/token', { method: 'DELETE' });
    } catch (err) {
        // Even if the server-side revoke fails (e.g. offline) we still clear
        // local state so the UI is consistent.
        if (!(err instanceof ApiClientError) || err.status !== 401) {
            console.warn('Token revoke failed:', err);
        }
    } finally {
        await clearAuth();
    }
}

// -- Anime / list ----------------------------------------------------------

export function searchAnime(query: string, limit = 10): Promise<SearchResponse> {
    const params = new URLSearchParams({ q: query, limit: String(limit) });
    return request<SearchResponse>(`/api/v1/anime/search?${params.toString()}`);
}

export function listEntries(status?: ListStatus): Promise<ListIndexResponse> {
    const path = status ? `/api/v1/list?status=${status}` : '/api/v1/list';
    return request<ListIndexResponse>(path);
}

export function getListEntryByAnime(animeId: number): Promise<ListEntry> {
    return request<ListEntry>(`/api/v1/list/anime/${animeId}`);
}

export function addToList(payload: {
    anime_id: number;
    status: ListStatus;
    progress?: number;
    score?: number;
}): Promise<ListEntry> {
    return request<ListEntry>('/api/v1/list', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

export function updateEntry(
    entryId: number,
    payload: Partial<{
        status: ListStatus;
        progress: number;
        score: number | null;
        notes: string;
    }>,
): Promise<ListEntry> {
    return request<ListEntry>(`/api/v1/list/${entryId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
    });
}

export function deleteEntry(entryId: number): Promise<void> {
    return request<void>(`/api/v1/list/${entryId}`, { method: 'DELETE' });
}

// Convenience: bump progress by 1. Backend auto-marks completed when progress
// reaches total episodes, so the popup doesn't need to duplicate that logic.
export function incrementProgress(entry: ListEntry): Promise<ListEntry> {
    return updateEntry(entry.id, { progress: entry.progress + 1 });
}

// Helper to surface the user-facing title.
export function titleFor(anime: AnimeCard | undefined): string {
    if (!anime) return 'Unknown';
    return anime.title_english ?? anime.title_romaji ?? 'Unknown';
}
