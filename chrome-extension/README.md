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
npm run build       # type-checks + builds dist/
npm run package     # also produces anitrack-extension.zip ready for Web Store upload
```

## Releasing

Two workflows drive releases:

### Dev builds — `.github/workflows/extension-dev-release.yml`

Rolling prerelease, auto-published on every push to `main` that touches `chrome-extension/**` (or triggered manually via "Run workflow" in the Actions tab).

- Version is `<manifest.version>.<run_number>` (e.g. `0.1.0.47`) so Chrome treats each build as a new version.
- Extension is renamed to **AniTrack (Dev)** so it can be installed side-by-side with a production build.
- Published as a prerelease under the fixed tag `extension-dev-latest` — the tag is overwritten each run, so the download URL is stable.

### Stable releases — `.github/workflows/extension-release.yml`

Triggered by tags matching `extension-v*`.

1. Bump the `version` in `public/manifest.json` (e.g. `0.1.0` → `0.2.0`).
2. Commit, then tag and push:
   ```bash
   git tag extension-v0.2.0
   git push origin extension-v0.2.0
   ```
3. The workflow verifies the tag matches the manifest version, builds, zips `dist/` as `anitrack-extension-<version>.zip`, and publishes it as a GitHub release.

To auto-publish to the Chrome Web Store, extend that workflow with `chrome-webstore-upload-cli` once the extension is listed and CWS API credentials are in repository secrets.

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
