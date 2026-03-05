# AniTrack Backend Documentation

Comprehensive reference for the AniTrack Laravel backend: routing, controllers, models, resources, form requests, middleware, and services.

---

## Table of Contents

1. [Routing](#1-routing)
2. [Controllers](#2-controllers)
3. [Models](#3-models)
4. [HTTP Resources](#4-http-resources)
5. [Form Requests](#5-form-requests)
6. [Middleware](#6-middleware)
7. [Services](#7-services)

---

## 1. Routing

All routes are defined in `routes/web.php`. The application uses Inertia.js, so page routes return `Inertia::render()` responses while JSON endpoints return `JsonResponse`.

### Public Routes

| Method | URI | Handler | Route Name | Middleware |
|--------|-----|---------|------------|------------|
| GET | `/` | `HomeController@__invoke` | `home` | (none) |
| GET | `/anime` | `AnimeController@index` | `anime.index` | (none) |
| GET | `/anime/{anime}` | `AnimeController@show` | `anime.show` | (none) |
| GET | `/anime/al/{anilistId}` | `AnimeController@showByAnilistId` | `anime.show.anilist` | (none) |
| GET | `/seasonal` | `SeasonalController@index` | `seasonal` | (none) |
| GET | `/schedule` | `ScheduleController@__invoke` | `schedule` | (none) |
| GET | `/search` | Closure (renders `SearchPage`) | `search` | (none) |
| GET | `/user/{user:name}` | `ProfileController@show` | `profile.show` | (none) |

Route constraints: `{anime}` and `{anilistId}` are constrained to `[0-9]+`. The `{user:name}` parameter uses route model binding on the `name` column.

### JSON API Endpoints (Public)

| Method | URI | Handler | Route Name | Middleware |
|--------|-----|---------|------------|------------|
| GET | `/api/search` | `SearchController@__invoke` | `api.search` | `throttle:api` |

### Auth Routes (Guest Only)

These routes are wrapped in `middleware('guest')` and are only accessible to unauthenticated users.

| Method | URI | Handler | Route Name | Middleware |
|--------|-----|---------|------------|------------|
| GET | `/login` | `AuthenticatedSessionController@create` | `login` | `guest` |
| POST | `/login` | `AuthenticatedSessionController@store` | (none) | `guest`, `throttle:auth` |
| GET | `/register` | `RegisteredUserController@create` | `register` | `guest` |
| POST | `/register` | `RegisteredUserController@store` | (none) | `guest`, `throttle:auth` |

### Authenticated Routes

These routes are wrapped in `middleware('auth')`.

| Method | URI | Handler | Route Name | Middleware |
|--------|-----|---------|------------|------------|
| GET | `/list` | `UserListController@index` | `list` | `auth` |
| GET | `/list/export` | `UserListController@export` | `list.export` | `auth` |
| POST | `/api/list` | `UserListController@store` | `api.list.store` | `auth`, `throttle:api` |
| PATCH | `/api/list/{entry}` | `UserListController@update` | `api.list.update` | `auth`, `throttle:api` |
| DELETE | `/api/list/{entry}` | `UserListController@destroy` | `api.list.destroy` | `auth`, `throttle:api` |
| GET | `/import` | `ImportController@show` | `import` | `auth` |
| POST | `/import/upload` | `ImportController@upload` | `import.upload` | `auth` |
| POST | `/import/confirm` | `ImportController@confirm` | `import.confirm` | `auth` |
| GET | `/import/status` | `ImportController@status` | `import.status` | `auth` |
| GET | `/settings` | `SettingsController@show` | `settings` | `auth` |
| PATCH | `/settings/profile` | `SettingsController@updateProfile` | `settings.profile` | `auth` |
| PATCH | `/settings/password` | `SettingsController@updatePassword` | `settings.password` | `auth` |
| POST | `/logout` | `AuthenticatedSessionController@destroy` | `logout` | `auth` |

---

## 2. Controllers

### HomeController

**File:** `app/Http/Controllers/HomeController.php`

**Purpose:** Renders the landing page with seasonal showcase, currently airing anime, and (for authenticated users) personalized stats and schedule data.

**Dependencies:** `SeasonService` (injected into `__invoke`)

| Method | Description | Returns |
|--------|-------------|---------|
| `__invoke(SeasonService)` | Builds the home page. For guests: seasonal showcase (top 12 by popularity, cached 6h), currently airing anime (top 10, cached 1h). For authenticated users: additionally includes list stats (total anime, episodes watched, average score, watching count), today's airing schedule filtered to the user's watching list, and "continue watching" entries (last 12 updated). | `Inertia::render('HomePage', ...)` |

**Inertia Props (guest):** `seasonalShowcase`, `airingNow`, `currentSeason`, `currentYear`, `isAuthenticated` (false)

**Inertia Props (authenticated):** All guest props plus `isAuthenticated` (true), `stats`, `airingToday`, `continueWatching`

---

### AnimeController

**File:** `app/Http/Controllers/AnimeController.php`

**Purpose:** Handles the anime browse page, anime detail page, and on-demand AniList fetching for unknown anime.

**Dependencies:** `AnimeQueryService`, `AniListClient`, `AnimeDataPersistenceService` (injected per-method)

| Method | Description | Returns |
|--------|-------------|---------|
| `index(Request, AnimeQueryService)` | Browse/filter anime. Delegates to `AnimeQueryService::browse(24)` which applies Spatie QueryBuilder filters and sorts. | `Inertia::render('AnimeIndexPage', ...)` |
| `show(Request, int $anime)` | Detail page for a single anime. Caches the loaded model for 1h. Eager-loads genres, studios, external IDs, next airing episode, upcoming airing schedules (limit 12), and relations with their related anime and genres. Also loads the authenticated user's list entry if applicable. Filters out adult content; returns 404 if not found. | `Inertia::render('AnimeDetailPage', ...)` |
| `showByAnilistId(int, AniListClient, AnimeDataPersistenceService)` | Looks up an anime by its AniList ID. If it exists locally, redirects to the detail page. Otherwise, fetches from the AniList API, persists it, and redirects. Handles rate limit and API errors with flash messages. | `RedirectResponse` |

---

### SearchController

**File:** `app/Http/Controllers/SearchController.php`

**Purpose:** JSON search endpoint that first tries local Laravel Scout search, then falls back to the AniList GraphQL API.

**Dependencies:** `AniListClient` (injected into `__invoke`)

| Method | Description | Returns |
|--------|-------------|---------|
| `__invoke(Request, AniListClient)` | Validates query length (2-200 chars). Caches results for 15 minutes keyed by MD5 of lowercased query. Local Scout search returns `AnimeCardResource` collections. AniList fallback maps raw API data to a compatible card format, cross-referencing local IDs. Returns 503 on failure. | `JsonResponse` with `data`, `query`, `total`, `source` |

**JSON Response Shape:**
```json
{
  "data": [ ...anime card objects... ],
  "query": "search term",
  "total": 20,
  "source": "local" | "anilist"
}
```

---

### SeasonalController

**File:** `app/Http/Controllers/SeasonalController.php`

**Purpose:** Renders the seasonal anime browser, showing anime grouped by format for a given year and season.

**Dependencies:** `SeasonService` (injected into `index`)

| Method | Description | Returns |
|--------|-------------|---------|
| `index(Request, SeasonService)` | Accepts optional `year` and `season` query parameters (defaults to current season). Validates year range (1940 to current year + 2) and season value (WINTER, SPRING, SUMMER, FALL). Groups anime by format using `SeasonService::formatOrder()`. Caches 6h for current season, 24h for past seasons. | `Inertia::render('SeasonalPage', ...)` |

**Inertia Props:** `groups` (array of `{format, anime}`), `year`, `season`, `adjacentSeasons`

---

### ScheduleController

**File:** `app/Http/Controllers/ScheduleController.php`

**Purpose:** Renders the weekly airing schedule, optionally filtered to the user's watching list.

**Dependencies:** None (uses models directly)

| Method | Description | Returns |
|--------|-------------|---------|
| `__invoke(Request)` | Accepts `week` (0 = current, 1 = next) and `watching_only` (boolean, requires auth) query parameters. Groups airing schedules by date. Eager-loads anime with selected fields and genres. | `Inertia::render('SchedulePage', ...)` |

**Inertia Props:** `days` (grouped by date string), `weekOffset`, `weekStart`, `weekEnd`, `watchingOnly`, `isAuth`

---

### UserListController

**File:** `app/Http/Controllers/UserListController.php`

**Purpose:** Manages the authenticated user's anime list -- viewing, CRUD operations, and MAL XML export.

**Dependencies:** `UserListService` (constructor-injected), `MalExportService` (injected into `export`)

| Method | Description | Returns |
|--------|-------------|---------|
| `index(Request)` | Loads the full list page with entries and status counts via `UserListService::getListForPage()`. | `Inertia::render('MyListPage', ...)` |
| `store(StoreListEntryRequest)` | Creates a new list entry. Loads anime and genres before returning. | `JsonResponse` (201) with `ListEntryResource` |
| `update(UpdateListEntryRequest, UserAnimeList)` | Updates an existing list entry. Loads anime and genres before returning. | `JsonResponse` (200) with `ListEntryResource` |
| `destroy(Request, UserAnimeList)` | Soft-deletes a list entry. Aborts 403 if the entry does not belong to the authenticated user. | `JsonResponse` (204, null) |
| `export(Request, MalExportService)` | Generates a MAL-compatible XML export and streams it as a download (`animelist_export.xml`). | `StreamedResponse` (application/xml) |

---

### ImportController

**File:** `app/Http/Controllers/ImportController.php`

**Purpose:** Handles MAL XML import -- upload, preview, confirmation, and background job status polling.

**Dependencies:** `MalImportService` (injected per-method)

| Method | Description | Returns |
|--------|-------------|---------|
| `show()` | Renders the import page. | `Inertia::render('ImportPage')` |
| `upload(ImportUploadRequest, MalImportService)` | Parses the uploaded XML file. Returns parsed preview data or 422 on invalid format. | `JsonResponse` with preview data |
| `confirm(Request, MalImportService)` | Validates `token` (required string) and `overwrite_existing` (boolean). For lists <= 200 entries: processes synchronously and returns `{status: "done", result}`. For larger lists: dispatches `ProcessMalImport` job, stores progress in cache, and returns `{status: "pending", token}`. | `JsonResponse` |
| `status(Request)` | Polls import progress by `token` query parameter. Returns cached progress object or 404 if not found. | `JsonResponse` |

---

### ProfileController

**File:** `app/Http/Controllers/ProfileController.php`

**Purpose:** Renders public user profile pages with anime list statistics.

**Dependencies:** None

| Method | Description | Returns |
|--------|-------------|---------|
| `show(User)` | Loads status distribution counts, average score (normalized to 0-10 scale), and total episodes watched. Uses route model binding on `user:name`. | `Inertia::render('ProfilePage', ...)` |

**Inertia Props:** `profile` (UserProfileResource), `stats` (status => count map), `avg_score`, `episodes_watched`

---

### SettingsController

**File:** `app/Http/Controllers/SettingsController.php`

**Purpose:** Manages user settings -- profile updates and password changes.

**Dependencies:** None (uses form requests)

| Method | Description | Returns |
|--------|-------------|---------|
| `show()` | Renders the settings page with a list of all PHP timezone identifiers. | `Inertia::render('SettingsPage', ...)` |
| `updateProfile(UpdateProfileRequest)` | Updates the authenticated user's profile fields. | `RedirectResponse` (back with flash) |
| `updatePassword(UpdatePasswordRequest)` | Updates the authenticated user's password. The password is automatically hashed via the `hashed` cast on the User model. | `RedirectResponse` (back with flash) |

---

### Auth\AuthenticatedSessionController

**File:** `app/Http/Controllers/Auth/AuthenticatedSessionController.php`

**Purpose:** Handles login and logout via session-based authentication.

**Dependencies:** `LoginRequest`

| Method | Description | Returns |
|--------|-------------|---------|
| `create()` | Renders the login page. | `Inertia::render('LoginPage')` |
| `store(LoginRequest)` | Authenticates credentials (delegated to `LoginRequest::authenticate()`), regenerates the session, and redirects to the intended URL or home. | `RedirectResponse` |
| `destroy(Request)` | Logs out via the `web` guard, invalidates the session, regenerates the CSRF token, and redirects to home. | `RedirectResponse` |

---

### Auth\RegisteredUserController

**File:** `app/Http/Controllers/Auth/RegisteredUserController.php`

**Purpose:** Handles new user registration.

**Dependencies:** None

| Method | Description | Returns |
|--------|-------------|---------|
| `create()` | Renders the registration page. | `Inertia::render('RegisterPage')` |
| `store(Request)` | Validates inline (name, email unique, password confirmed with defaults). Creates the user, fires `Registered` event, logs in, and redirects to home. | `RedirectResponse` |

**Inline Validation Rules:**
- `name`: required, string, max:255
- `email`: required, string, lowercase, email, max:255, unique:users
- `password`: required, confirmed, `Password::defaults()`

---

## 3. Models

### User

**File:** `app/Models/User.php`
**Table:** `users`

**Traits:** `HasApiTokens`, `HasFactory`, `Notifiable`, `SoftDeletes`

| Fillable | Type |
|----------|------|
| `name` | string |
| `email` | string |
| `password` | string |
| `avatar_url` | string (nullable) |
| `bio` | string (nullable) |
| `timezone` | string (nullable) |
| `mal_id` | integer (nullable) |
| `mal_username` | string (nullable) |

**Hidden:** `password`, `remember_token`, `mal_access_token`, `mal_refresh_token`

**Casts:**

| Attribute | Cast |
|-----------|------|
| `email_verified_at` | `datetime` |
| `password` | `hashed` |
| `mal_token_expires_at` | `datetime` |

**Relationships:**

| Method | Type | Related Model |
|--------|------|---------------|
| `animeList()` | `HasMany` | `UserAnimeList` |
| `recommendationVotes()` | `HasMany` | `RecommendationVote` |

---

### Anime

**File:** `app/Models/Anime.php`
**Table:** `anime`

**Traits:** `Searchable` (Laravel Scout)

**Fillable:**

| Field | Field | Field |
|-------|-------|-------|
| `anilist_id` | `mal_id` | `title_romaji` |
| `title_english` | `title_native` | `title_synonyms` |
| `format` | `status` | `season` |
| `season_year` | `source` | `episodes` |
| `duration` | `episode_count_unknown` | `aired_from` |
| `aired_to` | `synopsis` | `cover_image_large` |
| `cover_image_medium` | `cover_image_color` | `banner_image` |
| `trailer_url` | `average_score` | `mean_score` |
| `bayesian_score` | `popularity` | `trending` |
| `favourites` | `is_adult` | `anilist_updated_at` |
| `synced_at` | | |

**Casts:**

| Attribute | Cast |
|-----------|------|
| `title_synonyms` | `array` |
| `episode_count_unknown` | `boolean` |
| `aired_from` | `date` |
| `aired_to` | `date` |
| `is_adult` | `boolean` |
| `anilist_updated_at` | `datetime` |
| `synced_at` | `datetime` |

**Relationships:**

| Method | Type | Related Model | Pivot/Notes |
|--------|------|---------------|-------------|
| `genres()` | `BelongsToMany` | `Genre` | via `anime_genre` |
| `studios()` | `BelongsToMany` | `Studio` | via `anime_studio`, pivot: `is_main` |
| `relations()` | `HasMany` | `AnimeRelation` | |
| `airingSchedules()` | `HasMany` | `AiringSchedule` | |
| `nextAiringEpisode()` | `HasOne` | `AiringSchedule` | Scoped to future, ordered by `airs_at` |
| `userEntries()` | `HasMany` | `UserAnimeList` | |
| `recommendations()` | `HasMany` | `Recommendation` | |
| `externalIds()` | `HasMany` | `ExternalId` | |

**Scopes:**

| Scope | Query |
|-------|-------|
| `finished()` | `WHERE status = 'FINISHED'` |
| `releasing()` | `WHERE status = 'RELEASING'` |
| `forSeason($year, $season)` | `WHERE season_year = ? AND season = ?` |
| `byFormat($format)` | `WHERE format = ?` |
| `adultContent($include = false)` | If false: `WHERE is_adult = false`; if true: no filter |

**Special Methods:**

| Method | Description |
|--------|-------------|
| `normalizeScore(?int $score): ?float` | Static. Converts internal 0-100 score to display 0-10 scale with one decimal. Returns `null` for null input. |
| `toSearchableArray(): array` | Returns Scout search index fields: `id`, `title_romaji`, `title_english`, `title_native`, `title_synonyms`, `format`, `status`, `season_year`. |

---

### Genre

**File:** `app/Models/Genre.php`
**Table:** `genres`

**Fillable:** `anilist_id`, `name`

**Relationships:**

| Method | Type | Related Model | Pivot Table |
|--------|------|---------------|-------------|
| `anime()` | `BelongsToMany` | `Anime` | `anime_genre` |

---

### Studio

**File:** `app/Models/Studio.php`
**Table:** `studios`

**Fillable:** `anilist_id`, `name`, `is_animation_studio`, `website_url`

**Casts:**

| Attribute | Cast |
|-----------|------|
| `is_animation_studio` | `boolean` |

**Relationships:**

| Method | Type | Related Model | Pivot Table / Notes |
|--------|------|---------------|---------------------|
| `anime()` | `BelongsToMany` | `Anime` | `anime_studio`, pivot: `is_main` |

---

### UserAnimeList

**File:** `app/Models/UserAnimeList.php`
**Table:** `user_anime_lists`

**Traits:** `SoftDeletes`

**Constants:**

| Constant | Value |
|----------|-------|
| `STATUS_WATCHING` | `'watching'` |
| `STATUS_COMPLETED` | `'completed'` |
| `STATUS_ON_HOLD` | `'on_hold'` |
| `STATUS_DROPPED` | `'dropped'` |
| `STATUS_PLAN_TO_WATCH` | `'plan_to_watch'` |
| `STATUSES` | Array of all five status values |

**Fillable:** `user_id`, `anime_id`, `status`, `score`, `progress`, `rewatch_count`, `started_at`, `completed_at`, `notes`, `tags`, `is_private`, `is_rewatching`

**Casts:**

| Attribute | Cast |
|-----------|------|
| `score` | `integer` |
| `progress` | `integer` |
| `rewatch_count` | `integer` |
| `started_at` | `date` |
| `completed_at` | `date` |
| `tags` | `array` |
| `is_private` | `boolean` |
| `is_rewatching` | `boolean` |

**Relationships:**

| Method | Type | Related Model |
|--------|------|---------------|
| `user()` | `BelongsTo` | `User` |
| `anime()` | `BelongsTo` | `Anime` |

**Accessors:**

| Accessor | Description |
|----------|-------------|
| `getDisplayScoreAttribute(): ?float` | Converts internal 0-100 score to 0-10 display scale. |

---

### AiringSchedule

**File:** `app/Models/AiringSchedule.php`
**Table:** `airing_schedules`

**Fillable:** `anime_id`, `anilist_airing_id`, `episode`, `airs_at`, `time_until_airing`

**Casts:**

| Attribute | Cast |
|-----------|------|
| `airs_at` | `datetime` |

**Relationships:**

| Method | Type | Related Model |
|--------|------|---------------|
| `anime()` | `BelongsTo` | `Anime` |

**Scopes:**

| Scope | Query |
|-------|-------|
| `upcoming()` | `WHERE airs_at > now() ORDER BY airs_at` |
| `today()` | `WHERE airs_at BETWEEN start_of_day AND end_of_day` |
| `thisWeek()` | `WHERE airs_at BETWEEN start_of_week AND end_of_week` |

---

### AnimeRelation

**File:** `app/Models/AnimeRelation.php`
**Table:** `anime_relations`

**Fillable:** `anime_id`, `related_anime_id`, `relation_type`

**Relationships:**

| Method | Type | Related Model | Foreign Key |
|--------|------|---------------|-------------|
| `anime()` | `BelongsTo` | `Anime` | `anime_id` |
| `relatedAnime()` | `BelongsTo` | `Anime` | `related_anime_id` |

---

### ExternalId

**File:** `app/Models/ExternalId.php`
**Table:** `external_ids`

**Fillable:** `anime_id`, `platform`, `external_id`, `url`

**Relationships:**

| Method | Type | Related Model |
|--------|------|---------------|
| `anime()` | `BelongsTo` | `Anime` |

---

### Recommendation

**File:** `app/Models/Recommendation.php`
**Table:** `recommendations`

**Fillable:** `anime_id`, `recommended_anime_id`, `source`, `anilist_recommendation_id`, `rating`

**Relationships:**

| Method | Type | Related Model | Foreign Key |
|--------|------|---------------|-------------|
| `anime()` | `BelongsTo` | `Anime` | `anime_id` |
| `recommendedAnime()` | `BelongsTo` | `Anime` | `recommended_anime_id` |
| `votes()` | `HasMany` | `RecommendationVote` | |

---

### RecommendationVote

**File:** `app/Models/RecommendationVote.php`
**Table:** `recommendation_votes`

**Fillable:** `recommendation_id`, `user_id`, `vote`

**Relationships:**

| Method | Type | Related Model |
|--------|------|---------------|
| `recommendation()` | `BelongsTo` | `Recommendation` |
| `user()` | `BelongsTo` | `User` |

---

### RawApiResponse

**File:** `app/Models/RawApiResponse.php`
**Table:** `raw_api_responses`

**Fillable:** `source`, `endpoint`, `external_id`, `response_body`, `fetched_at`, `is_processed`, `processed_at`

**Casts:**

| Attribute | Cast |
|-----------|------|
| `fetched_at` | `datetime` |
| `is_processed` | `boolean` |
| `processed_at` | `datetime` |

**Relationships:** None

---

## 4. HTTP Resources

### AnimeResource

**File:** `app/Http/Resources/AnimeResource.php`
**Used on:** Anime detail page

Full anime representation. Scores are normalized from 0-100 to 0-10 via `Anime::normalizeScore()`. Synopsis is sanitized with `strip_tags()` allowing `<br>`, `<i>`, `<b>`, `<em>`, `<strong>`, `<p>`.

| Key | Type | Notes |
|-----|------|-------|
| `id` | int | |
| `anilist_id` | int | |
| `mal_id` | int/null | |
| `title_romaji` | string | |
| `title_english` | string/null | |
| `title_native` | string/null | |
| `title_synonyms` | array/null | |
| `format` | string | TV, MOVIE, OVA, ONA, etc. |
| `status` | string | FINISHED, RELEASING, NOT_YET_RELEASED, CANCELLED, HIATUS |
| `season` | string/null | WINTER, SPRING, SUMMER, FALL |
| `season_year` | int/null | |
| `source` | string/null | |
| `episodes` | int/null | |
| `duration` | int/null | Minutes per episode |
| `episode_count_unknown` | bool | |
| `aired_from` | string/null | Date string (Y-m-d) |
| `aired_to` | string/null | Date string (Y-m-d) |
| `synopsis` | string/null | HTML-sanitized |
| `cover_image_large` | string/null | URL |
| `cover_image_medium` | string/null | URL |
| `cover_image_color` | string/null | Hex color |
| `banner_image` | string/null | URL |
| `trailer_url` | string/null | URL |
| `average_score` | float/null | 0-10 scale |
| `mean_score` | float/null | 0-10 scale |
| `bayesian_score` | float/null | 0-10 scale |
| `popularity` | int/null | |
| `trending` | int/null | |
| `favourites` | int/null | |
| `is_adult` | bool | |
| `genres` | array | `GenreResource[]` (when loaded) |
| `studios` | array | `StudioResource[]` (when loaded) |
| `external_ids` | array | `ExternalIdResource[]` (when loaded) |
| `airing_schedules` | array | `AiringScheduleResource[]` (when loaded) |
| `next_airing_episode` | object/null | `AiringScheduleResource` (when loaded) |
| `relations` | array | `AnimeRelationResource[]` (when loaded) |

---

### AnimeCardResource

**File:** `app/Http/Resources/AnimeCardResource.php`
**Used on:** Browse, seasonal, search results, home page, list entries

Compact anime representation for cards/lists.

| Key | Type | Notes |
|-----|------|-------|
| `id` | int | |
| `anilist_id` | int | |
| `title_romaji` | string | |
| `title_english` | string/null | |
| `format` | string | |
| `status` | string | |
| `season` | string/null | |
| `season_year` | int/null | |
| `episodes` | int/null | |
| `cover_image_medium` | string/null | URL |
| `cover_image_color` | string/null | Hex color |
| `average_score` | float/null | 0-10 scale |
| `bayesian_score` | float/null | 0-10 scale |
| `popularity` | int/null | |
| `genres` | array | `GenreResource[]` (when loaded) |
| `next_airing_episode` | object/null | `AiringScheduleResource` (when loaded) |

---

### GenreResource

**File:** `app/Http/Resources/GenreResource.php`

| Key | Type |
|-----|------|
| `id` | int |
| `name` | string |

---

### StudioResource

**File:** `app/Http/Resources/StudioResource.php`

| Key | Type | Notes |
|-----|------|-------|
| `id` | int | |
| `name` | string | |
| `is_animation_studio` | bool | |
| `is_main` | bool | From pivot table (`anime_studio.is_main`) |

---

### AnimeRelationResource

**File:** `app/Http/Resources/AnimeRelationResource.php`

| Key | Type | Notes |
|-----|------|-------|
| `id` | int | Relation record ID |
| `relation_type` | string | e.g., SEQUEL, PREQUEL, SIDE_STORY |
| `related_anime` | object/null | Inline object (not a nested resource) |

**`related_anime` object shape:**

| Key | Type |
|-----|------|
| `id` | int |
| `title_romaji` | string |
| `title_english` | string/null |
| `format` | string |
| `status` | string |
| `cover_image_medium` | string/null |
| `cover_image_color` | string/null |
| `average_score` | float/null (0-10) |
| `genres` | array (`GenreResource[]`, if loaded) |

---

### AiringScheduleResource

**File:** `app/Http/Resources/AiringScheduleResource.php`

| Key | Type | Notes |
|-----|------|-------|
| `id` | int | |
| `episode` | int | |
| `airs_at` | string | ISO 8601 datetime. `time_until_airing` is intentionally omitted; computed client-side to avoid cache staleness. |

---

### ExternalIdResource

**File:** `app/Http/Resources/ExternalIdResource.php`

| Key | Type |
|-----|------|
| `id` | int |
| `platform` | string |
| `external_id` | string |
| `url` | string |

---

### ListEntryResource

**File:** `app/Http/Resources/ListEntryResource.php`

| Key | Type | Notes |
|-----|------|-------|
| `id` | int | |
| `anime_id` | int | |
| `status` | string | One of the 5 MAL statuses |
| `score` | int/null | Raw 0-100 |
| `display_score` | float/null | Normalized 0-10 |
| `progress` | int | Episodes watched |
| `rewatch_count` | int | |
| `is_rewatching` | bool | |
| `started_at` | string/null | Date (Y-m-d) |
| `completed_at` | string/null | Date (Y-m-d) |
| `notes` | string/null | |
| `tags` | array | Defaults to `[]` |
| `is_private` | bool | |
| `updated_at` | string | ISO 8601 |
| `anime` | object/null | `AnimeCardResource` (when loaded) |

---

### ScheduleDayResource

**File:** `app/Http/Resources/ScheduleDayResource.php`

Represents a single airing schedule entry with embedded anime data. Logs a warning if the referenced anime is missing.

| Key | Type | Notes |
|-----|------|-------|
| `id` | int | AiringSchedule ID |
| `episode` | int | |
| `airs_at` | string | ISO 8601 |
| `anime` | object/null | Inline anime object (see below) |

**`anime` object shape:**

| Key | Type |
|-----|------|
| `id` | int |
| `title_romaji` | string |
| `title_english` | string/null |
| `cover_image_medium` | string/null |
| `cover_image_color` | string/null |
| `average_score` | float/null (0-10) |
| `format` | string |
| `episodes` | int/null |
| `genres` | array (`GenreResource[]`) |

---

### UserProfileResource

**File:** `app/Http/Resources/UserProfileResource.php`

| Key | Type |
|-----|------|
| `id` | int |
| `name` | string |
| `avatar_url` | string/null |
| `bio` | string/null |
| `timezone` | string/null |
| `created_at` | string (ISO 8601) |

---

## 5. Form Requests

### LoginRequest

**File:** `app/Http/Requests/Auth/LoginRequest.php`

**Authorization:** Always authorized (returns `true`).

**Validation Rules:**

| Field | Rules |
|-------|-------|
| `email` | required, string, email |
| `password` | required, string |

**Additional Methods:**

| Method | Description |
|--------|-------------|
| `authenticate()` | Checks rate limit, attempts `Auth::attempt()` with email, password, and optional `remember` boolean. On failure, increments rate limiter and throws `ValidationException`. On success, clears rate limiter. |
| `ensureIsNotRateLimited()` | Allows 5 attempts before locking out. Fires `Lockout` event and throws `ValidationException` with seconds remaining. |
| `throttleKey()` | Returns `transliterated_lowercase_email|ip_address` as the rate limit key. |

---

### ImportUploadRequest

**File:** `app/Http/Requests/ImportUploadRequest.php`

**Authorization:** Authenticated users only (`$this->user() !== null`).

**Validation Rules:**

| Field | Rules |
|-------|-------|
| `file` | required, file, mimes:xml, max:10240 (10 MB) |

---

### StoreListEntryRequest

**File:** `app/Http/Requests/StoreListEntryRequest.php`

**Authorization:** Authenticated users only.

**Validation Rules:**

| Field | Rules |
|-------|-------|
| `anime_id` | required, integer, exists:anime,id, unique:user_anime_lists (scoped to user_id, excluding soft-deleted) |
| `status` | required, string, in: watching, completed, on_hold, dropped, plan_to_watch |
| `score` | nullable, integer, min:0, max:100 |
| `progress` | nullable, integer, min:0 |
| `started_at` | nullable, date |
| `completed_at` | nullable, date |
| `notes` | nullable, string, max:2000 |
| `is_private` | boolean |

---

### UpdateListEntryRequest

**File:** `app/Http/Requests/UpdateListEntryRequest.php`

**Authorization:** Authenticated user must own the route-bound `{entry}` (checks `$this->user()->id === $entry->user_id`).

**Validation Rules:**

| Field | Rules |
|-------|-------|
| `status` | sometimes, string, in: watching, completed, on_hold, dropped, plan_to_watch |
| `score` | nullable, integer, min:0, max:100 |
| `progress` | nullable, integer, min:0 |
| `started_at` | nullable, date |
| `completed_at` | nullable, date |
| `notes` | nullable, string, max:2000 |
| `is_private` | boolean |
| `is_rewatching` | boolean |
| `rewatch_count` | nullable, integer, min:0 |
| `tags` | nullable, array |
| `tags.*` | string, max:50 |

---

### UpdateProfileRequest

**File:** `app/Http/Requests/UpdateProfileRequest.php`

**Authorization:** Always authorized.

**Validation Rules:**

| Field | Rules |
|-------|-------|
| `name` | required, string, max:255, unique:users (ignoring current user) |
| `email` | required, email, max:255, unique:users (ignoring current user) |
| `bio` | nullable, string, max:1000 |
| `timezone` | required, string, in: `timezone_identifiers_list()` |
| `avatar_url` | nullable, url:https, max:2048 |

---

### UpdatePasswordRequest

**File:** `app/Http/Requests/UpdatePasswordRequest.php`

**Authorization:** Always authorized.

**Validation Rules:**

| Field | Rules |
|-------|-------|
| `current_password` | required, current_password (validates against the authenticated user's stored hash) |
| `password` | required, confirmed, `Password::min(8)` |

---

## 6. Middleware

### HandleInertiaRequests

**File:** `app/Http/Middleware/HandleInertiaRequests.php`

Extends `Inertia\Middleware`. Applied globally to share props on every Inertia response.

**Root View:** `app` (maps to `resources/views/app.blade.php`)

**Version:** Delegates to `parent::version($request)` (uses mix-manifest or Vite manifest hash for asset versioning).

**Shared Props:**

| Prop Path | Value |
|-----------|-------|
| `auth.user` | `null` if guest. For authenticated users: `{id, name, email, avatar_url, bio, timezone}` |
| `flash.message` | Session flash `message` value |
| `flash.status` | Session flash `status` value |

---

### SecurityHeaders

**File:** `app/Http/Middleware/SecurityHeaders.php`

Sets security-related HTTP headers on every response. Content Security Policy rules are environment-aware to allow Vite dev server in local development.

**Headers Set:**

| Header | Value |
|--------|-------|
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |

**Content-Security-Policy Directives:**

| Directive | Production | Local (dev) |
|-----------|-----------|-------------|
| `default-src` | `'self'` | `'self'` |
| `script-src` | `'self'` | `'self' http://localhost:5173 'unsafe-inline'` |
| `style-src` | `'self' 'unsafe-inline'` | `'self' 'unsafe-inline'` |
| `img-src` | `'self' https://s4.anilist.co https://img.anilist.co https://img1.ak.crunchyroll.com data:` | Same |
| `font-src` | `'self'` | `'self'` |
| `connect-src` | `'self'` | `'self' ws://localhost:5173` |
| `frame-src` | `https://www.youtube.com https://www.dailymotion.com` | Same |
| `frame-ancestors` | `'none'` | `'none'` |

---

### EnsureEmailIsVerified

**File:** `app/Http/Middleware/EnsureEmailIsVerified.php`

Checks if the authenticated user has verified their email, but only if the User model implements `MustVerifyEmail`. Currently the `User` model does not implement this interface, so this middleware passes through for all users.

**Behavior when active:** Returns `409 Conflict` JSON response with `{"message": "Your email address is not verified."}` if the user's email is unverified.

---

## 7. Services

### AnimeQueryService

**File:** `app/Services/AnimeQueryService.php`

Provides the browse/filter/sort/paginate logic for the anime index page using Spatie QueryBuilder.

**Methods:**

#### `browse(int $perPage = 24): array`

Builds a paginated, filtered, and sorted query for non-adult anime.

**Allowed Filters (query string: `?filter[key]=value`):**

| Filter | Type | Description |
|--------|------|-------------|
| `format` | Exact | Anime format (TV, MOVIE, OVA, ONA, etc.) |
| `status` | Exact | Airing status (FINISHED, RELEASING, etc.) |
| `season` | Exact | Season name (WINTER, SPRING, SUMMER, FALL) |
| `season_year` | Exact | Year integer |
| `genre` | Callback | Filters by genre name via `whereHas('genres')` |
| `studio` | Callback | Filters by studio ID via `whereHas('studios')` |

**Allowed Sorts (query string: `?sort=field` or `?sort=-field` for descending):**

| Sort Field |
|------------|
| `popularity` |
| `average_score` |
| `trending` |
| `favourites` |
| `title_romaji` |
| `season_year` |
| `aired_from` |

**Default Sort:** `-popularity` (descending)

**Per-page Range:** Clamped to 1-100.

**Eager Loads:** `genres`, `nextAiringEpisode`

**Return Value:**
```php
[
    'anime' => AnimeCardResource::collection($paginator), // paginated
    'genres' => [...],   // cached 24h, only genres with anime
    'studios' => [...],  // cached 24h, only animation studios with anime
]
```

#### `cachedGenres(): array`

Returns all genres that have at least one anime, ordered by name. Cached for 24 hours under key `filter:genres`.

#### `cachedStudios(): array`

Returns all animation studios that have at least one anime, ordered by name. Cached for 24 hours under key `filter:studios`.

---

### SeasonService

**File:** `app/Services/SeasonService.php`

Handles anime season calculations and navigation.

**Constants:**

| Constant | Value |
|----------|-------|
| `SEASONS` | `['WINTER', 'SPRING', 'SUMMER', 'FALL']` |
| `FORMAT_ORDER` | `['TV', 'TV_SHORT', 'MOVIE', 'OVA', 'ONA', 'SPECIAL', 'MUSIC']` |

**Methods:**

| Method | Description | Returns |
|--------|-------------|---------|
| `currentSeason()` | Determines the current anime season from the current month. Jan-Mar = WINTER, Apr-Jun = SPRING, Jul-Sep = SUMMER, Oct-Dec = FALL. | `['year' => int, 'season' => string]` |
| `adjacentSeasons(int $year, string $season)` | Calculates the previous and next seasons, wrapping around year boundaries (e.g., WINTER 2024 -> previous is FALL 2023, next is SPRING 2024). Throws `InvalidArgumentException` for invalid season names. | `['previous' => ['year' => int, 'season' => string], 'next' => ['year' => int, 'season' => string]]` |
| `isCurrentSeason(int $year, string $season)` | Checks if the given year/season matches the current season. | `bool` |
| `formatOrder()` | Returns the canonical ordering of anime formats for display grouping. | `string[]` |

---

### UserListService

**File:** `app/Services/UserListService.php`

Encapsulates all user anime list operations with auto-completion logic.

**Methods:**

| Method | Description | Returns |
|--------|-------------|---------|
| `getListForPage(User $user)` | Loads all list entries with anime (selected fields) and genres, plus status distribution counts. | `['entries' => ListEntryResource collection, 'counts' => [status => count]]` |
| `store(User $user, array $data)` | Creates a new list entry, loads the anime relationship, and applies auto-complete logic. | `UserAnimeList` |
| `update(UserAnimeList $entry, array $data)` | Updates an existing entry, reloads anime, and applies auto-complete logic. | `UserAnimeList` |
| `delete(UserAnimeList $entry)` | Soft-deletes the list entry. | `void` |

**Auto-Complete Logic (`applyAutoComplete`):**

When a list entry's `progress` meets or exceeds the anime's known `episodes` count (and episodes > 0):
1. The entry's `status` is set to `completed` (if not already).
2. The `completed_at` date is set to the current time (if not already set).
3. The entry is saved.

This runs automatically on both `store` and `update` operations.
