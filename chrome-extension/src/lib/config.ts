// API base URL resolution. Defaults to localhost in dev; prod builds should
// override via build-time env or the in-extension settings screen (future work).
const DEV_DEFAULT = 'http://localhost:8000';
const PROD_DEFAULT = 'https://anitrack.app';

export function defaultApiBaseUrl(): string {
    return import.meta.env.DEV ? DEV_DEFAULT : PROD_DEFAULT;
}

export const DEVICE_NAME = 'Chrome Extension';
