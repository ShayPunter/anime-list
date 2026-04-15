# AniTrack Chrome Extension

MVP Chrome extension for AniTrack. Lets a signed-in user quickly search anime, add them to their list, and log episode progress without leaving their current tab.

## Features (MVP)

- Sign in with email + password (exchanges credentials for a Sanctum bearer token via `POST /api/v1/auth/token`).
- "Watching" tab: current in-progress entries with a one-click **+1 episode** button. The backend auto-marks entries completed when progress reaches total episodes, so those entries drop off the Watching view automatically.
- Expandable details on each entry: change status, set score (0–10), or remove from list.
- "Search" tab: debounced search against `/api/v1/anime/search`, with one-click add to `watching` or `plan_to_watch`.
- Sign out revokes the current token server-side.

## Requirements

- The signed-in account must have the `public-api` Pennant flag enabled (toggle at `/admin/features` in the main app).
- The Laravel backend must allow CORS for the extension's origin on `/api/*` (see the root project's `config/cors.php`).

## Local development

```bash
cd chrome-extension
pnpm install        # or npm install
pnpm dev            # vite build --watch -> dist/
```

Then in Chrome:

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select `chrome-extension/dist`.

The dev server defaults to `http://localhost:8000` for the API. Use the **Advanced settings** toggle on the login screen to point it elsewhere.

## Production build

```bash
pnpm build          # type-checks + builds dist/
pnpm package        # also produces anitrack-extension.zip ready for Web Store upload
```

## Project layout

```
src/
  popup/            Vue 3 popup (entry: index.html + main.ts)
    views/          LoginView, WatchingView, SearchView
    components/     ListEntryCard, SearchResultCard
  background/       Manifest V3 service worker
  lib/              api client, chrome.storage helpers, config
  types/            TypeScript mirrors of API response shapes
public/
  manifest.json     copied verbatim into dist/
  icons/            (drop icon-16/32/48/128.png here before release)
```

## Notes

- Types in `src/types/api.ts` are kept **manually in sync** with the Laravel API Resources in the parent project (`app/Http/Resources/`). If you change a resource, update the TS type in the same commit.
- `chrome.storage.local` stores the bearer token and API base URL. The service worker is ephemeral — don't cache auth state in module scope.
- On a `401` response the API client clears local auth, which flips the popup back to the login view on next render.
