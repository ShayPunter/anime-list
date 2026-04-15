import type { AuthenticatedUser } from '@/types/api';
import { defaultApiBaseUrl } from './config';

interface StoredAuth {
    token: string;
    tokenId: number;
    user: AuthenticatedUser;
}

interface StoredSettings {
    apiBaseUrl: string;
}

const AUTH_KEY = 'auth';
const SETTINGS_KEY = 'settings';

export async function getAuth(): Promise<StoredAuth | null> {
    const result = await chrome.storage.local.get(AUTH_KEY);
    return (result[AUTH_KEY] as StoredAuth | undefined) ?? null;
}

export async function setAuth(auth: StoredAuth): Promise<void> {
    await chrome.storage.local.set({ [AUTH_KEY]: auth });
}

export async function clearAuth(): Promise<void> {
    await chrome.storage.local.remove(AUTH_KEY);
}

export async function getSettings(): Promise<StoredSettings> {
    const result = await chrome.storage.local.get(SETTINGS_KEY);
    const stored = result[SETTINGS_KEY] as Partial<StoredSettings> | undefined;
    return {
        apiBaseUrl: stored?.apiBaseUrl ?? defaultApiBaseUrl(),
    };
}

export async function setApiBaseUrl(url: string): Promise<void> {
    const current = await getSettings();
    await chrome.storage.local.set({
        [SETTINGS_KEY]: { ...current, apiBaseUrl: url },
    });
}

export type { StoredAuth, StoredSettings };
