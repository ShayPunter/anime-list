# AniTrack Data Pipeline

This document covers the complete data pipeline: AniList API integration, sync commands and jobs, data persistence, DTOs, MAL import/export, scheduled tasks, and caching strategy.

---

## Table of Contents

1. [AniList Integration](#1-anilist-integration)
2. [GraphQL Queries (AniListQueryBuilder)](#2-graphql-queries-anilistquerybuilder)
3. [Sync Commands](#3-sync-commands)
4. [Sync Jobs](#4-sync-jobs)
5. [AnimeDataPersistenceService](#5-animedatapersistenceservice)
6. [DTOs](#6-dtos)
7. [MAL Import/Export](#7-mal-importexport)
8. [Scheduled Tasks](#8-scheduled-tasks)
9. [Caching Strategy](#9-caching-strategy)

---

## 1. AniList Integration

**File:** `app/Services/AniListClient.php`

### Constructor Dependencies

```php
public function __construct(
    private readonly Client $http,              // GuzzleHttp\Client — base URI set to AniList endpoint
    private readonly int $requestsPerMinute,    // Token bucket capacity (default: 85)
    private readonly int $maxRetries,            // Max retry attempts (default: 3)
    private readonly int $backoffBase,           // Base seconds for exponential backoff (default: 5)
    private readonly int $rateLimitBackoff,      // Base seconds for 429 backoff (default: 60)
    private readonly bool $storeRawResponses,    // Whether to persist raw JSON to raw_api_responses table
)
```

All values are sourced from `config/anilist.php` and bound via the service container.

### Public Methods

#### `query(string $query, array $variables = []): array`

Executes a single GraphQL query against `https://graphql.anilist.co`. Enforces the rate limit before each request. Validates the response:

1. Checks JSON decoding succeeded.
2. Checks for GraphQL-level `errors` array and throws `AniListApiException` if present.
3. Checks for the presence of a top-level `data` key.

Returns the `data` portion of the response (i.e., `$response['data']`).

#### `paginatedQuery(string $query, array $variables, int $startPage = 1, int $perPage = 50): Generator`

A Generator that auto-paginates through all pages of a `Page`-based query. Yields each page's data keyed by page number. Merges `page` and `perPage` into the provided variables automatically. Stops when `pageInfo.hasNextPage` is `false`.

#### `storeRawResponse(string $endpoint, string $externalId, array $responseData): void`

Persists the raw API response to the `raw_api_responses` table (via the `RawApiResponse` model) for later reprocessing. Only stores if `storeRawResponses` is `true` (controlled by `ANILIST_STORE_RAW` env var). Failures are caught and logged as non-fatal.

Stored fields:
- `source`: always `'anilist'`
- `endpoint`: e.g., `'Page.media'`, `'Page.airingSchedules'`
- `external_id`: e.g., `'page:1:mode:full'`
- `response_body`: JSON-encoded response
- `fetched_at`: current timestamp
- `is_processed`: `false`

### Rate Limiting

Uses a **Redis token bucket** implemented as an atomic Lua script. The Redis hash key is `anilist:rate_limit` with a 120-second TTL.

**Algorithm:**
1. Read current `tokens` and `last_refill` timestamp from Redis hash.
2. Calculate elapsed time and refill tokens at a rate of `rpm / 60` tokens per second, capped at `rpm`.
3. If `tokens < 1.0`, calculate wait time and return it. The PHP side sleeps for that duration (via `usleep`) and retries recursively.
4. If tokens are available, decrement by 1, update `last_refill`, and return `"0"`.

Default rate limit: **85 requests/minute** (AniList allows 90; 85 provides a safety margin).

### Retry Logic

The `executeWithRetry()` method wraps every API call. Behavior by error type:

| Error Type | Exception Class | Backoff Formula | Max Retries |
|---|---|---|---|
| HTTP 429 (rate limit) | `ClientException` | `rateLimitBackoff * 2^(attempt-1)` (60s, 120s, 240s) | 3 (then throws `AniListRateLimitException`) |
| HTTP 5xx (server error) | `ServerException` | `backoffBase * 2^(attempt-1)` (5s, 10s, 20s) | 3 (then throws `AniListApiException`) |
| Connection failure | `ConnectException` | `backoffBase * 2^(attempt-1)` (5s, 10s, 20s) | 3 (then throws `AniListApiException`) |
| HTTP 4xx (non-429) | `ClientException` | No retry | Immediate `AniListApiException` |

### Configuration

**File:** `config/anilist.php`

```php
return [
    'endpoint'   => env('ANILIST_API_URL', 'https://graphql.anilist.co'),

    'rate_limit' => [
        'requests_per_minute' => (int) env('ANILIST_RATE_LIMIT', 85),
    ],

    'http' => [
        'connect_timeout' => 30,   // seconds
        'timeout'         => 60,   // seconds
    ],

    'retry' => [
        'max_attempts'               => 3,
        'backoff_base_seconds'       => 5,
        'rate_limit_backoff_seconds' => 60,
    ],

    'sync' => [
        'per_page'            => 50,
        'store_raw_responses' => (bool) env('ANILIST_STORE_RAW', true),
        'progress_cache_ttl'  => 86400,  // 24 hours
    ],
];
```

| Env Variable | Default | Description |
|---|---|---|
| `ANILIST_API_URL` | `https://graphql.anilist.co` | AniList GraphQL endpoint |
| `ANILIST_RATE_LIMIT` | `85` | Requests per minute (bucket capacity) |
| `ANILIST_STORE_RAW` | `true` | Store raw API responses for reprocessing |

---

## 2. GraphQL Queries (AniListQueryBuilder)

**File:** `app/Services/AniListQueryBuilder.php`

All methods are `static` and return raw GraphQL query strings. Two field sets are used:

### MEDIA_FIELDS Constant (Full Field Set)

Used by `animePage()`, `updatedSince()`, `animeByStatus()`, and `singleAnime()`:

```
id, idMal
title { romaji, english, native }
synonyms, format, status, season, seasonYear, source
episodes, duration
startDate { year, month, day }
endDate { year, month, day }
description(asHtml: false)
coverImage { large, medium, color }
bannerImage
trailer { site, id }
averageScore, meanScore, popularity, trending, favourites
isAdult, updatedAt, genres
studios { edges { isMain, node { id, name, isAnimationStudio, siteUrl } } }
relations { edges { relationType, node { id, type } } }
externalLinks { site, url }
nextAiringEpisode { id, episode, airingAt, timeUntilAiring }
```

### Query Methods

#### `animePage()`

Full catalog pagination. Used for **full sync** mode.

| Variable | Type | Description |
|---|---|---|
| `$page` | `Int` | Page number |
| `$perPage` | `Int` | Items per page |

Sorts by `ID` ascending. Returns `MEDIA_FIELDS` plus `pageInfo { hasNextPage, currentPage, lastPage, total }`.

#### `updatedSince()`

Fetches anime updated after a given timestamp. Used for **incremental sync** mode.

| Variable | Type | Description |
|---|---|---|
| `$page` | `Int` | Page number |
| `$perPage` | `Int` | Items per page |
| `$updatedAt_greater` | `Int` | Unix timestamp threshold |

Sorts by `UPDATED_AT_DESC`. Returns `MEDIA_FIELDS` plus `pageInfo`.

#### `airingSchedulePage()`

Fetches airing schedule entries within a time window. Uses a **lighter field set** (no `MEDIA_FIELDS`).

| Variable | Type | Description |
|---|---|---|
| `$page` | `Int` | Page number |
| `$perPage` | `Int` | Items per page |
| `$airingAt_greater` | `Int` | Unix timestamp (window start) |
| `$airingAt_lesser` | `Int` | Unix timestamp (window end) |

Sorts by `TIME`. Returns per schedule entry: `id, episode, airingAt, timeUntilAiring, media { id }`.

#### `searchAnime()`

Text search with **lightweight fields** (no studios, relations, external links, or full cover images).

| Variable | Type | Description |
|---|---|---|
| `$search` | `String` | Search term |
| `$page` | `Int` | Page number |
| `$perPage` | `Int` | Items per page |

Filters: `type: ANIME, isAdult: false`. Returns: `id, title { romaji, english }, format, status, season, seasonYear, episodes, coverImage { medium, color }, averageScore, popularity, genres`.

#### `animeByStatus()`

Fetches anime filtered by status, season, and year. Used for **targeted sync** mode.

| Variable | Type | Description |
|---|---|---|
| `$page` | `Int` | Page number |
| `$perPage` | `Int` | Items per page |
| `$status` | `MediaStatus` | e.g., `RELEASING`, `NOT_YET_RELEASED` |
| `$season` | `MediaSeason` | Optional: `WINTER`, `SPRING`, `SUMMER`, `FALL` |
| `$seasonYear` | `Int` | Optional: e.g., `2026` |

Sorts by `POPULARITY_DESC`. Returns `MEDIA_FIELDS` plus `pageInfo`.

#### `singleAnime()`

Fetches a single anime by AniList ID. Uses `Media()` root query (not `Page`).

| Variable | Type | Description |
|---|---|---|
| `$id` | `Int` | AniList media ID |

Returns `MEDIA_FIELDS`.

---

## 3. Sync Commands

### SyncAnimeCommand

**File:** `app/Console/Commands/SyncAnimeCommand.php`

```
php artisan sync:anime [options]
```

**Signature:**

| Option | Description |
|---|---|
| `--full` | Run full catalog sync from page 1 |
| `--resume` | Resume full sync from last saved page (reads `sync:full:progress` from cache) |
| `--page=N` | Start from specific page (implies full mode) |
| `--status=STATUS` | Targeted sync: `FINISHED`, `RELEASING`, `NOT_YET_RELEASED`, `CANCELLED`, `HIATUS` |
| `--season=SEASON` | Filter by season (with `--status`): `WINTER`, `SPRING`, `SUMMER`, `FALL` |
| `--season-year=YEAR` | Filter by year (with `--status`) |
| `--watch` | Watch progress with an ASCII progress bar after dispatching |

**Three Modes:**

1. **Full** (`--full`, `--page`, or `--resume`): Dispatches `SyncAnimePage` with `mode: 'full'` using `animePage()` query. Iterates through the entire AniList catalog sorted by ID. Supports resume from last completed page.

2. **Incremental** (default, no flags): Reads `sync:incremental:last_run` from cache (falls back to 24 hours ago). Dispatches `SyncAnimePage` with `mode: 'incremental'` using `updatedSince()` query.

3. **Targeted** (`--status`): Dispatches `SyncAnimePage` with `mode: 'targeted'` using `animeByStatus()` query. Optionally filters by `--season` and `--season-year`.

**Progress Tracking:**

Each mode stores its status in cache key `sync:{mode}:status` (values: `running`, `completed`, `failed`) and progress in `sync:{mode}:progress` (object with `last_completed_page`, `last_page`, `total`, `started_at`). TTL is `anilist.sync.progress_cache_ttl` (default 86400s / 24h).

**`--watch` Progress Bar:**

Polls cache every 2 seconds and renders an ASCII progress bar:

```
  [========================>                         ] 48% -- Page 24/50 (2500 anime)
```

Exits on `completed`, `failed`, or 2 minutes of no progress updates.

### SyncScheduleCommand

**File:** `app/Console/Commands/SyncScheduleCommand.php`

```
php artisan sync:schedule [options]
```

| Option | Default | Description |
|---|---|---|
| `--days=N` | `7` | Number of days ahead to sync |
| `--watch` | `false` | Watch progress with ASCII progress bar |

Calculates a time window from `now()` to `now() + N days` as Unix timestamps, then dispatches `SyncAiringSchedulePage` on the `sync` queue. Progress tracking and `--watch` behavior are identical to `SyncAnimeCommand` but use the `sync:schedule:progress` and `sync:schedule:status` cache keys.

---

## 4. Sync Jobs

All jobs run on the `sync` queue (except `ResolveAnimeRelations` which runs on `import`).

### SyncAnimePage

**File:** `app/Jobs/SyncAnimePage.php`

| Property | Type | Default | Description |
|---|---|---|---|
| `$page` | `int` | (required) | Current page number |
| `$perPage` | `int` | `50` | Items per page |
| `$mode` | `string` | `'full'` | `'full'`, `'incremental'`, or `'targeted'` |
| `$updatedAtGreater` | `?int` | `null` | Unix timestamp for incremental mode |
| `$status` | `?string` | `null` | AniList MediaStatus for targeted mode |
| `$season` | `?string` | `null` | AniList MediaSeason for targeted mode |
| `$seasonYear` | `?int` | `null` | Year for targeted mode |

**Job settings:** `timeout = 300`, `tries = 3`

**Execution flow:**

1. **Mode selection:** Picks the GraphQL query based on `$mode`:
   - `full` -> `AniListQueryBuilder::animePage()`
   - `incremental` -> `AniListQueryBuilder::updatedSince()`
   - `targeted` -> `AniListQueryBuilder::animeByStatus()`

2. **Query execution:** Builds variables from constructor params, calls `$client->query()`.

3. **Raw response storage:** Calls `$client->storeRawResponse('Page.media', "page:{page}:mode:{mode}", $data)`.

4. **Bulk persistence:** Passes `$mediaItems` array to `$persistenceService->persistBatch()`.

5. **Progress tracking:** Updates `sync:{mode}:progress` cache key with `last_completed_page`, `last_page`, `total`, `started_at`.

6. **Page chaining:** If `pageInfo.hasNextPage` is `true`, dispatches `SyncAnimePage` for the next page on the `sync` queue with all the same parameters.

7. **Completion handling:**
   - Sets `sync:{mode}:status` to `'completed'`.
   - **Full mode only:** Dispatches `ResolveAnimeRelations` on the `import` queue with a 5-minute delay.
   - **Incremental mode only:** Stores `sync:incremental:last_run` timestamp in cache (forever).

8. **Failure handling:** `failed()` method sets `sync:{mode}:status` to `'failed'` and logs the exception.

### SyncAiringSchedulePage

**File:** `app/Jobs/SyncAiringSchedulePage.php`

| Property | Type | Description |
|---|---|---|
| `$page` | `int` | Current page number |
| `$airingAtGreater` | `int` | Unix timestamp (window start) |
| `$airingAtLesser` | `int` | Unix timestamp (window end) |
| `$perPage` | `int` | Items per page (default 50) |

**Job settings:** `timeout = 120`, `tries = 3`

**Execution flow:**

1. Queries AniList using `airingSchedulePage()`.
2. Stores raw response via `storeRawResponse('Page.airingSchedules', ...)`.
3. **Batch anime ID loading:** Collects all unique `media.id` values from the schedule nodes, queries `Anime::whereIn('anilist_id', ...)` to build an `anilist_id -> anime.id` map. This avoids N+1 queries.
4. Builds upsert rows for each schedule entry, skipping nodes with missing `media.id`, missing `episode`/`airingAt`, or unrecognized anime.
5. **Upsert:** `AiringSchedule::upsert()` on unique key `anilist_airing_id`, updating `anime_id`, `episode`, `airs_at`, `time_until_airing`.
6. Updates `sync:schedule:progress` cache.
7. Chains next page if `hasNextPage`, otherwise calls `invalidateScheduleCaches()`.
8. **Cache invalidation on completion:** Clears `schedule:daily:{date}` for the next 7 days and `schedule:week:{year}:{weekOfYear}`.

### ProcessAnimeData

**File:** `app/Jobs/ProcessAnimeData.php`

A thin wrapper that persists a single anime record. Used for on-demand single-anime fetches.

| Property | Type | Description |
|---|---|---|
| `$mediaData` | `array` | Raw AniList media array |

**Job settings:** `timeout = 120`, `tries = 3`

Calls `$persistenceService->persistSingle($this->mediaData)`.

### ResolveAnimeRelations

**File:** `app/Jobs/ResolveAnimeRelations.php`

Processes the deferred relations queue in Redis after a sync sweep completes.

**Job settings:** `timeout = 300`, `tries = 2`, queue: `import`

**Execution flow:**

1. Loads the full `anilist_id -> internal id` map from the `anime` table via `Anime::pluck('id', 'anilist_id')`.
2. Pops items from the `sync:pending_relations` Redis list one at a time (`LPOP`).
3. Each item is a JSON object: `{ from_anilist_id, to_anilist_id, relation_type }`.
4. Resolves both AniList IDs to internal IDs using the map.
5. If both IDs resolve, calls `AnimeRelation::updateOrCreate()` with `anime_id`, `related_anime_id`, `relation_type`.
6. If either ID is missing (anime not yet synced), pushes the item to `sync:unresolved_relations` for later retry.
7. Logs totals: `inserted` and `skipped` counts.

---

## 5. AnimeDataPersistenceService

**File:** `app/Services/AnimeDataPersistenceService.php`

### `persistBatch(array $mediaItems): Collection`

Persists an array of raw AniList media items in a single database transaction. Returns a Collection of `Anime` models keyed by `anilist_id`.

**Transaction flow:**

1. **Map to DTOs:** Converts each raw media array to `AnimeData::fromAniList()`.
2. **Upsert anime batch:** Calls `Anime::upsert()` on unique key `anilist_id`, updating all columns. Builds an `anilist_id -> anime.id` map from the resulting models.
3. **Sync genres batch:** Collects all unique genre names, ensures they exist in the `genres` table (inserting missing ones), then deletes existing `anime_genre` pivot rows for affected anime and re-inserts.
4. **Sync studios batch:** Collects all unique studios, upserts them into the `studios` table on `anilist_id`, then deletes existing `anime_studio` pivot rows and re-inserts with `is_main` flag.
5. **Upsert airing schedules batch:** Builds rows for each DTO's `airing_schedules`, upserts on `anilist_airing_id`.
6. **Upsert external IDs batch:** Builds rows for each DTO's `external_links`, upserts on composite `[anime_id, platform]`.
7. **Push pending relations:** JSON-encodes each relation as `{ from_anilist_id, to_anilist_id, relation_type }` and pushes to `sync:pending_relations` Redis list via `RPUSH`.
8. **Cache invalidation:** Clears `anime:{id}` for each persisted anime and `anime:seasonal:{year}:{season}` for anime with season data.

### `persistSingle(array $mediaData): Anime`

Persists a single raw AniList media item. Uses `updateOrCreate` instead of bulk `upsert`. Runs genre/studio sync via `sync()` (Laravel pivot sync). Pushes pending relations and invalidates caches outside the transaction.

### `mal_id` Conflict Handling

Both batch and single upsert methods handle `UniqueConstraintViolationException` for `mal_id` conflicts:

- **Batch:** If the initial `upsert()` fails with a `mal_id` constraint violation, retries with all `mal_id` values set to `null`.
- **Single:** If `updateOrCreate()` fails with a `mal_id` constraint, sets `mal_id` to `null` and retries. Logs a warning with the affected `anilist_id` and original `mal_id`.

This handles cases where AniList maps multiple anime to the same MAL ID.

### `animeAttributes(AnimeData $dto): array`

Helper that maps an `AnimeData` DTO to the column array for the `anime` table:

```php
[
    'anilist_id', 'mal_id', 'title_romaji', 'title_english', 'title_native',
    'title_synonyms' (JSON-encoded), 'format', 'status', 'season', 'season_year',
    'source', 'episodes', 'duration', 'episode_count_unknown',
    'aired_from', 'aired_to', 'synopsis',
    'cover_image_large', 'cover_image_medium', 'cover_image_color', 'banner_image',
    'trailer_url', 'average_score', 'mean_score', 'popularity', 'trending',
    'favourites', 'is_adult', 'anilist_updated_at', 'synced_at', 'created_at', 'updated_at'
]
```

---

## 6. DTOs

All DTOs extend `Spatie\LaravelData\Data` and live in `app/DTOs/`.

### AnimeData

**File:** `app/DTOs/AnimeData.php`

| Property | Type | Description |
|---|---|---|
| `anilist_id` | `int` | AniList media ID |
| `mal_id` | `?int` | MyAnimeList ID (from `idMal`) |
| `title_romaji` | `string` | Romaji title (required, with fallback chain) |
| `title_english` | `?string` | English title |
| `title_native` | `?string` | Native (Japanese) title |
| `title_synonyms` | `?array` | Alternative titles |
| `format` | `?string` | e.g., `TV`, `MOVIE`, `OVA` |
| `status` | `?string` | e.g., `FINISHED`, `RELEASING` |
| `season` | `?string` | e.g., `WINTER`, `SPRING` |
| `season_year` | `?int` | e.g., `2026` |
| `source` | `?string` | e.g., `MANGA`, `ORIGINAL` |
| `episodes` | `?int` | Total episode count |
| `duration` | `?int` | Episode duration in minutes |
| `episode_count_unknown` | `bool` | `true` if `episodes` is null AND `status` is `RELEASING` |
| `aired_from` | `?Carbon` | Start date |
| `aired_to` | `?Carbon` | End date |
| `synopsis` | `?string` | Description (plain text, not HTML) |
| `cover_image_large` | `?string` | Large cover image URL |
| `cover_image_medium` | `?string` | Medium cover image URL |
| `cover_image_color` | `?string` | Dominant cover color hex |
| `banner_image` | `?string` | Banner image URL |
| `trailer_url` | `?string` | YouTube or Dailymotion URL |
| `average_score` | `?int` | AniList average score (0-100) |
| `mean_score` | `?int` | AniList mean score (0-100) |
| `popularity` | `?int` | Popularity rank |
| `trending` | `?int` | Trending score |
| `favourites` | `?int` | Favourite count |
| `is_adult` | `bool` | Adult content flag |
| `anilist_updated_at` | `?Carbon` | Last update timestamp from AniList |
| `genres` | `GenreData[]` | Array of genres |
| `studios` | `StudioEdgeData[]` | Array of studio edges (with `is_main` flag) |
| `relations` | `AnimeRelationData[]` | Array of related anime (filtered to `type: ANIME` only) |
| `external_links` | `ExternalLinkData[]` | Array of external links |
| `airing_schedules` | `AiringScheduleData[]` | Airing schedule entries (from `nextAiringEpisode`) |

**`fromAniList(array $media)` Fallback Chains:**

- **Title:** `romaji` -> `english` -> `native` -> `"Unknown Title [AniList #{id}]"`
- **Dates:** Requires `year`; defaults `month` to 1 and `day` to 1 if missing.
- **Trailer URL:** YouTube -> `https://www.youtube.com/watch?v={id}`, Dailymotion -> `https://www.dailymotion.com/video/{id}`, other -> `null`.
- **Episode count unknown:** Auto-set to `true` when `episodes` is `null` and `status` is `RELEASING`.
- **Relations:** Filtered to only include edges where `node.type === 'ANIME'` (manga/novel relations are discarded).
- **Airing schedules:** Only populated if `nextAiringEpisode.id` exists; produces a single-element array.

### GenreData

**File:** `app/DTOs/GenreData.php`

| Property | Type | Description |
|---|---|---|
| `name` | `string` | Genre name (e.g., `"Action"`) |

Factory: `fromAniList(string $genre)` -- wraps a plain string.

### StudioData

**File:** `app/DTOs/StudioData.php`

| Property | Type | Description |
|---|---|---|
| `anilist_id` | `int` | AniList studio ID |
| `name` | `string` | Studio name |
| `is_animation_studio` | `bool` | Whether it is an animation studio |
| `website_url` | `?string` | Studio site URL |

No `fromAniList()` factory -- constructed directly by `StudioEdgeData`.

### StudioEdgeData

**File:** `app/DTOs/StudioEdgeData.php`

| Property | Type | Description |
|---|---|---|
| `studio` | `StudioData` | The studio |
| `is_main` | `bool` | Whether this is the main (producing) studio |

Factory: `fromAniList(array $edge)` -- maps `edge.node` to `StudioData` and reads `edge.isMain`.

### AnimeRelationData

**File:** `app/DTOs/AnimeRelationData.php`

| Property | Type | Description |
|---|---|---|
| `related_anilist_id` | `int` | AniList ID of the related anime |
| `relation_type` | `string` | e.g., `SEQUEL`, `PREQUEL`, `SIDE_STORY` |

Factory: `fromAniList(array $edge)` -- reads `edge.node.id` and `edge.relationType`.

### ExternalLinkData

**File:** `app/DTOs/ExternalLinkData.php`

| Property | Type | Description |
|---|---|---|
| `platform` | `string` | Site name (e.g., `"Crunchyroll"`, `"Funimation"`) |
| `url` | `?string` | Full URL |

Factory: `fromAniList(array $link)` -- reads `link.site` (defaults to `"Unknown"`) and `link.url`.

### AiringScheduleData

**File:** `app/DTOs/AiringScheduleData.php`

| Property | Type | Description |
|---|---|---|
| `anilist_airing_id` | `int` | AniList airing schedule ID |
| `episode` | `int` | Episode number |
| `airs_at` | `Carbon` | Air date/time (from Unix timestamp) |
| `time_until_airing` | `?int` | Seconds until airing |

Factory: `fromAniList(array $node)` -- converts `node.airingAt` to Carbon.

### SyncProgressData

**File:** `app/DTOs/SyncProgressData.php`

| Property | Type | Description |
|---|---|---|
| `type` | `string` | Sync type identifier |
| `current_page` | `int` | Current page being processed |
| `last_page` | `int` | Total pages |
| `total_items` | `int` | Total item count |
| `processed_items` | `int` | Items processed so far |
| `started_at` | `?string` | ISO 8601 start timestamp |
| `status` | `string` | `running`, `completed`, `failed` |

---

## 7. MAL Import/Export

### MalImportService

**File:** `app/Services/MalImportService.php`

#### `parse(string $xmlPath, int $userId): array`

Parses a MAL XML export file and caches the entries for confirmation.

1. Reads file contents; strips `<!DOCTYPE>` declarations.
2. Parses with `SimpleXMLElement` (internal XML errors suppressed).
3. Iterates `<anime>` nodes, mapping each to an entry array.
4. Generates a UUID token and caches entries at key `mal_import:{userId}:{token}` with a 30-minute TTL.
5. Returns `{ token, entries (first 20 for preview), total }`.

**Status mapping** (MAL string -> internal constant):

| MAL Status | Internal Constant |
|---|---|
| `Watching` | `STATUS_WATCHING` |
| `Completed` | `STATUS_COMPLETED` |
| `On-Hold` | `STATUS_ON_HOLD` |
| `Dropped` | `STATUS_DROPPED` |
| `Plan to Watch` | `STATUS_PLAN_TO_WATCH` |

Unknown statuses default to `STATUS_PLAN_TO_WATCH`.

**Score conversion:** MAL score (0-10 integer) multiplied by 10, capped at 100. A score of 0 remains 0 (treated as "unscored").

**Date handling:** `0000-00-00` dates are converted to `null`.

**Parsed entry fields:** `mal_id`, `title`, `status`, `score`, `progress` (watched episodes), `started_at`, `completed_at`.

#### `getPreview(int $userId, string $token): ?array`

Retrieves cached entries for a given import token. Returns `null` if expired.

#### `processEntries(User $user, string $token, bool $overwrite): array`

Synchronous processing for small imports (<=200 entries).

1. Retrieves cached entries; throws `RuntimeException` if expired.
2. Batch-loads `mal_id -> anime.id` map from the `anime` table.
3. Loads existing user list entries to check for duplicates.
4. For each entry:
   - Skips if `mal_id` is missing or not in the anime table (counted as `errors`).
   - Skips if entry already exists and `$overwrite` is `false` (counted as `skipped`).
   - Uses `UserAnimeList::withTrashed()->updateOrCreate()` to handle soft-deleted entries (restores if trashed).
5. Clears the cache key after processing.
6. Returns `{ imported, skipped, errors, total }`.

### MalExportService

**File:** `app/Services/MalExportService.php`

#### `generate(User $user): string`

Generates MAL-compatible XML from the user's anime list.

1. Loads all `UserAnimeList` entries with eager-loaded `anime:id,mal_id,title_romaji,episodes`.
2. Builds a `DOMDocument` with root element `<myanimelist>`.
3. Skips entries where `anime` is null or `mal_id` is null.
4. For each entry, creates an `<anime>` node with:
   - `series_animedb_id`: MAL ID
   - `series_title`: romaji title (HTML-escaped)
   - `series_episodes`: episode count (0 if null)
   - `my_watched_episodes`: progress
   - `my_start_date` / `my_finish_date`: `Y-m-d` format or `0000-00-00`
   - `my_score`: internal score (0-100) divided by 10, rounded (back to 0-10 scale)
   - `my_status`: reverse-mapped from internal constants to MAL strings
   - `my_rewatching`: `1` or `0`
   - `my_rewatching_ep`: always `0`
   - `update_on_import`: always `1`
5. Prepends a `<myinfo>` header with `user_name`, `user_export_type` (always `1`), and `user_total_anime`.
6. Returns the XML string.

### ImportController

**File:** `app/Http/Controllers/ImportController.php`

| Route | Method | Description |
|---|---|---|
| `GET /import` | `show()` | Renders the `ImportPage` Inertia page |
| `POST /import/upload` | `upload()` | Accepts file upload, parses XML, returns preview |
| `POST /import/confirm` | `confirm()` | Confirms import; sync or async based on size |
| `GET /import/status` | `status()` | Polls async import progress |

#### Upload Flow

1. `ImportUploadRequest` validates the uploaded file.
2. Calls `MalImportService::parse()` with the temp file path and user ID.
3. Returns JSON: `{ token, entries (first 20), total }`.

#### Confirm Flow

1. Validates `token` (required string) and `overwrite_existing` (optional boolean).
2. Retrieves cached entries via `getPreview()`.
3. **Small imports (<=200 entries):** Processes synchronously via `processEntries()`. Returns `{ status: 'done', result: { imported, skipped, errors, total } }`.
4. **Large imports (>200 entries):** Dispatches `ProcessMalImport` job. Sets initial progress in cache at `import:progress:{token}`. Returns `{ status: 'pending', token }`.

#### Status Polling

Returns the cached progress object at `import:progress:{token}`. Possible `status` values: `pending`, `processing`, `done`, `failed`, `not_found` (404).

### ProcessMalImport Job

**File:** `app/Jobs/ProcessMalImport.php`

| Property | Type | Description |
|---|---|---|
| `$userId` | `int` | User ID |
| `$importToken` | `string` | Cache token for entries |
| `$overwrite` | `bool` | Whether to overwrite existing entries |

**Job settings:** `timeout = 300`, `tries = 2`

**Execution flow:**

1. Retrieves entries from `mal_import:{token}` cache.
2. Batch-loads `mal_id -> anime.id` map and existing user list entries.
3. Processes entries in chunks of 50, updating `import:progress:{token}` after each chunk.
4. Uses `UserAnimeList::withTrashed()->updateOrCreate()` with soft-delete restore.
5. On completion, clears the entries cache and sets final progress with `status: 'done'` and result counts (TTL: 1 hour).
6. On failure, sets `status: 'failed'` in progress cache.

---

## 8. Scheduled Tasks

**File:** `routes/console.php`

All scheduled tasks run in UTC timezone with `withoutOverlapping()` to prevent concurrent execution.

| Schedule | Command | Description | Overlap Guard |
|---|---|---|---|
| Every 6 hours | `sync:anime --status=RELEASING` | Keeps currently airing anime fresh | 120 min |
| Daily at 04:00 UTC | `sync:anime --status=NOT_YET_RELEASED` | Updates upcoming/announced anime | 120 min |
| Weekly on Monday at 03:00 UTC | `sync:anime` (incremental, no flags) | Catches all other updates since last run | 120 min |
| Hourly | `sync:schedule` | Refreshes airing schedules for the next 7 days | 55 min |

All tasks log errors on failure via `onFailure()` callbacks.

---

## 9. Caching Strategy

### Cache Keys Reference

| Cache Key | TTL | Set By | Invalidated By |
|---|---|---|---|
| `anilist:rate_limit` | 120s | `AniListClient::enforceRateLimit()` (Redis hash) | Auto-expires |
| `sync:full:status` | 24h | `SyncAnimeCommand`, `SyncAnimePage` | Overwritten on next sync |
| `sync:full:progress` | 24h | `SyncAnimeCommand`, `SyncAnimePage` | Overwritten on next sync |
| `sync:incremental:status` | 24h | `SyncAnimeCommand`, `SyncAnimePage` | Overwritten on next sync |
| `sync:incremental:progress` | 24h | `SyncAnimeCommand`, `SyncAnimePage` | Overwritten on next sync |
| `sync:incremental:last_run` | Forever | `SyncAnimePage` (on incremental completion) | Overwritten on next incremental sync |
| `sync:targeted:status` | 24h | `SyncAnimeCommand`, `SyncAnimePage` | Overwritten on next sync |
| `sync:targeted:progress` | 24h | `SyncAnimeCommand`, `SyncAnimePage` | Overwritten on next sync |
| `sync:schedule:status` | 24h | `SyncScheduleCommand`, `SyncAiringSchedulePage` | Overwritten on next sync |
| `sync:schedule:progress` | 24h | `SyncScheduleCommand`, `SyncAiringSchedulePage` | Overwritten on next sync |
| `anime:{id}` | App-defined | Application layer | `AnimeDataPersistenceService` on upsert |
| `anime:seasonal:{year}:{season}` | App-defined | Application layer | `AnimeDataPersistenceService` on upsert (when anime has season data) |
| `schedule:daily:{YYYY-MM-DD}` | App-defined | Application layer | `SyncAiringSchedulePage` on completion (next 7 days) |
| `schedule:week:{year}:{weekOfYear}` | App-defined | Application layer | `SyncAiringSchedulePage` on completion |
| `mal_import:{userId}:{token}` | 30 min | `MalImportService::parse()` | `MalImportService::processEntries()` or `ProcessMalImport` job |
| `mal_import:{token}` | 30 min | `ImportController` (alternate key used by `ProcessMalImport`) | `ProcessMalImport` job on completion |
| `import:progress:{token}` | 1 hour | `ImportController::confirm()`, `ProcessMalImport` | Overwritten by job progress updates |

### Redis Keys (Non-Cache)

| Redis Key | Type | Set By | Consumed By |
|---|---|---|---|
| `sync:pending_relations` | List | `AnimeDataPersistenceService::pushPendingRelations()` | `ResolveAnimeRelations` (LPOP) |
| `sync:unresolved_relations` | List | `ResolveAnimeRelations` (for unresolvable entries) | Manual retry / future job |

### Tiered Caching TTLs (Application Layer)

As defined in the project plan:

| Data Type | TTL | Rationale |
|---|---|---|
| Search results | 15 min | Frequently changing, low cost to re-fetch |
| Airing schedules | 6 hours | Updated hourly by sync, stale data acceptable |
| Currently airing anime | 6 hours | Synced every 6 hours |
| Finished anime | 24 hours | Rarely changes |
