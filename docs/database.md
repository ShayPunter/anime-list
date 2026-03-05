# AniTrack Database Documentation

## 1. Schema Overview

AniTrack uses **MySQL 8** with **21 tables** organized into four functional groups:

- **Core anime data** (7 tables): `anime`, `genres`, `studios`, `anime_genre`, `anime_studio`, `anime_relations`, `airing_schedules`
- **User data** (4 tables): `users`, `user_anime_lists`, `recommendations`, `recommendation_votes`
- **Integration & sync** (3 tables): `external_ids`, `raw_api_responses`, `personal_access_tokens`
- **Infrastructure** (7 tables): `sessions`, `password_reset_tokens`, `cache`, `cache_locks`, `jobs`, `job_batches`, `failed_jobs`

### ER Diagram

```
┌──────────────────────┐
│        users         │
│──────────────────────│
│ id (PK)              │
│ name                 │
│ email (UQ)           │
│ mal_id (UQ)          │
│ ...                  │
│ soft deletes         │
└──────┬───────┬───────┘
       │       │
       │       │ 1:N
       │       ▼
       │  ┌─────────────────────┐      ┌────────────────────┐
       │  │ recommendation_votes│      │  password_reset_    │
       │  │─────────────────────│      │  tokens             │
       │  │ id (PK)             │      │────────────────────│
       │  │ recommendation_id   │──┐   │ email (PK)         │
       │  │ user_id (FK)        │  │   │ token              │
       │  │ vote                │  │   └────────────────────┘
       │  └─────────────────────┘  │
       │                           │   ┌────────────────────┐
       │ 1:N                       │   │     sessions       │
       ▼                           │   │────────────────────│
┌──────────────────────┐           │   │ id (PK)            │
│  user_anime_lists    │           │   │ user_id (FK, idx)  │
│──────────────────────│           │   │ payload            │
│ id (PK)              │           │   └────────────────────┘
│ user_id (FK)         │           │
│ anime_id (FK)        │──┐        │
│ status               │  │        │
│ score                │  │        │
│ ...                  │  │        │
│ soft deletes         │  │        │
└──────────────────────┘  │        │
                          │        │
         ┌────────────────┘        │
         │                         │
         ▼                         │
┌──────────────────────┐           │
│       anime          │           │
│──────────────────────│           │
│ id (PK)              │           │
│ anilist_id (UQ)      │           │
│ mal_id (UQ)          │           │
│ title_romaji         │           │
│ ...                  │           │
└──┬──┬──┬──┬──┬──┬────┘           │
   │  │  │  │  │  │                │
   │  │  │  │  │  │ 1:N            │
   │  │  │  │  │  ▼                │
   │  │  │  │  │ ┌──────────────────────┐
   │  │  │  │  │ │   recommendations    │
   │  │  │  │  │ │──────────────────────│
   │  │  │  │  │ │ id (PK)              │
   │  │  │  │  │ │ anime_id (FK)        │
   │  │  │  │  │ │ recommended_anime_id │──► anime
   │  │  │  │  │ │ source               │
   │  │  │  │  │ │ rating               │
   │  │  │  │  │ └──────────┬───────────┘
   │  │  │  │  │            │ 1:N
   │  │  │  │  │            └──────────────┘
   │  │  │  │  │
   │  │  │  │  │ 1:N
   │  │  │  │  ▼
   │  │  │  │ ┌──────────────────────┐
   │  │  │  │ │   external_ids       │
   │  │  │  │ │──────────────────────│
   │  │  │  │ │ id (PK)              │
   │  │  │  │ │ anime_id (FK)        │
   │  │  │  │ │ platform             │
   │  │  │  │ │ external_id          │
   │  │  │  │ └──────────────────────┘
   │  │  │  │
   │  │  │  │ 1:N
   │  │  │  ▼
   │  │  │ ┌──────────────────────┐
   │  │  │ │  airing_schedules    │
   │  │  │ │──────────────────────│
   │  │  │ │ id (PK)              │
   │  │  │ │ anime_id (FK)        │
   │  │  │ │ anilist_airing_id    │
   │  │  │ │ episode              │
   │  │  │ │ airs_at              │
   │  │  │ └──────────────────────┘
   │  │  │
   │  │  │ 1:N
   │  │  ▼
   │  │ ┌──────────────────────┐
   │  │ │  anime_relations     │
   │  │ │──────────────────────│
   │  │ │ id (PK)              │
   │  │ │ anime_id (FK)        │
   │  │ │ related_anime_id(FK) │──► anime
   │  │ │ relation_type        │
   │  │ └──────────────────────┘
   │  │
   │  │  M:N via anime_studio
   │  ▼
   │ ┌───────────────┐     ┌──────────────────────┐
   │ │ anime_studio  │     │      studios          │
   │ │───────────────│     │──────────────────────│
   │ │ anime_id (FK) │     │ id (PK)              │
   │ │ studio_id(FK) │────►│ anilist_id (UQ)      │
   │ │ is_main       │     │ name                 │
   │ └───────────────┘     │ is_animation_studio  │
   │                       └──────────────────────┘
   │  M:N via anime_genre
   ▼
  ┌───────────────┐     ┌──────────────────────┐
  │ anime_genre   │     │       genres          │
  │───────────────│     │──────────────────────│
  │ anime_id (FK) │     │ id (PK)              │
  │ genre_id (FK) │────►│ anilist_id (UQ)      │
  └───────────────┘     │ name (UQ)            │
                        └──────────────────────┘

Standalone tables:

┌──────────────────────┐  ┌──────────────┐  ┌────────────────┐
│  raw_api_responses   │  │    cache      │  │     jobs       │
│──────────────────────│  │──────────────│  │────────────────│
│ id (PK)              │  │ key (PK)     │  │ id (PK)        │
│ source               │  │ value        │  │ queue          │
│ endpoint             │  │ expiration   │  │ payload        │
│ external_id          │  └──────────────┘  │ attempts       │
│ response_body        │                    └────────────────┘
│ is_processed         │  ┌──────────────┐  ┌────────────────┐
└──────────────────────┘  │ cache_locks  │  │  job_batches   │
                          │──────────────│  │────────────────│
┌──────────────────────┐  │ key (PK)     │  │ id (PK)        │
│ personal_access_     │  │ owner        │  │ name           │
│ tokens               │  │ expiration   │  │ total_jobs     │
│──────────────────────│  └──────────────┘  └────────────────┘
│ id (PK)              │
│ tokenable (morph)    │  ┌────────────────┐
│ token (UQ)           │  │  failed_jobs   │
│ abilities            │  │────────────────│
└──────────────────────┘  │ id (PK)        │
                          │ uuid (UQ)      │
                          │ exception      │
                          └────────────────┘
```

---

## 2. Table Documentation

### 2.1 `users`

Extended from Laravel's default users table with avatar, bio, timezone, MAL integration fields, and soft deletes.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `bigint unsigned` | No | Auto-increment | Primary key |
| `name` | `varchar(255)` | No | -- | Display name |
| `email` | `varchar(255)` | No | -- | Email address (unique) |
| `email_verified_at` | `timestamp` | Yes | `NULL` | When email was verified |
| `password` | `varchar(255)` | No | -- | Hashed password |
| `avatar_url` | `varchar(255)` | Yes | `NULL` | URL to user's avatar image |
| `bio` | `text` | Yes | `NULL` | User biography / about text |
| `timezone` | `varchar(50)` | No | `'UTC'` | User's timezone for display conversion |
| `mal_id` | `bigint unsigned` | Yes | `NULL` | MyAnimeList user ID (unique) |
| `mal_username` | `varchar(255)` | Yes | `NULL` | MyAnimeList username |
| `mal_access_token` | `text` | Yes | `NULL` | MAL OAuth2 access token (hidden) |
| `mal_refresh_token` | `text` | Yes | `NULL` | MAL OAuth2 refresh token (hidden) |
| `mal_token_expires_at` | `timestamp` | Yes | `NULL` | When MAL token expires |
| `remember_token` | `varchar(100)` | Yes | `NULL` | Laravel remember-me token (hidden) |
| `created_at` | `timestamp` | Yes | `NULL` | Record creation time |
| `updated_at` | `timestamp` | Yes | `NULL` | Last update time |
| `deleted_at` | `timestamp` | Yes | `NULL` | Soft delete timestamp |

**Primary key:** `id`
**Unique constraints:** `email`, `mal_id`
**Soft deletes:** Yes
**Timestamps:** Yes

---

### 2.2 `password_reset_tokens`

Standard Laravel password reset tokens table.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `email` | `varchar(255)` | No | -- | User email (primary key) |
| `token` | `varchar(255)` | No | -- | Hashed reset token |
| `created_at` | `timestamp` | Yes | `NULL` | When token was created |

**Primary key:** `email`

---

### 2.3 `sessions`

Laravel database session driver table.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `varchar(255)` | No | -- | Session ID (primary key) |
| `user_id` | `bigint unsigned` | Yes | `NULL` | Owning user (nullable for guests) |
| `ip_address` | `varchar(45)` | Yes | `NULL` | Client IP (supports IPv6) |
| `user_agent` | `text` | Yes | `NULL` | Browser user agent string |
| `payload` | `longtext` | No | -- | Serialized session data |
| `last_activity` | `integer` | No | -- | Unix timestamp of last activity |

**Primary key:** `id`
**Indexes:** `sessions_user_id_index` (`user_id`), `sessions_last_activity_index` (`last_activity`)

---

### 2.4 `anime`

The central table storing all anime metadata. Data is synced from AniList API.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `bigint unsigned` | No | Auto-increment | Primary key |
| `anilist_id` | `bigint unsigned` | No | -- | AniList media ID (unique) |
| `mal_id` | `bigint unsigned` | Yes | `NULL` | MyAnimeList ID (unique) |
| `title_romaji` | `varchar(255)` | No | -- | Romanized Japanese title |
| `title_english` | `varchar(255)` | Yes | `NULL` | Official English title |
| `title_native` | `varchar(255)` | Yes | `NULL` | Native (Japanese) title |
| `title_synonyms` | `json` | Yes | `NULL` | Array of alternative titles |
| `format` | `varchar(20)` | Yes | `NULL` | Media format (TV, MOVIE, OVA, ONA, SPECIAL, MUSIC) |
| `status` | `varchar(20)` | Yes | `NULL` | Airing status (FINISHED, RELEASING, NOT_YET_RELEASED, CANCELLED, HIATUS) |
| `season` | `varchar(10)` | Yes | `NULL` | Season (WINTER, SPRING, SUMMER, FALL) |
| `season_year` | `smallint unsigned` | Yes | `NULL` | Year of the season |
| `source` | `varchar(30)` | Yes | `NULL` | Source material (MANGA, LIGHT_NOVEL, ORIGINAL, etc.) |
| `episodes` | `smallint unsigned` | Yes | `NULL` | Total episode count |
| `duration` | `smallint unsigned` | Yes | `NULL` | Episode duration in minutes |
| `episode_count_unknown` | `boolean` | No | `false` | Whether total episodes is unknown |
| `aired_from` | `date` | Yes | `NULL` | Airing start date |
| `aired_to` | `date` | Yes | `NULL` | Airing end date |
| `synopsis` | `text` | Yes | `NULL` | Description/synopsis (HTML from AniList) |
| `cover_image_large` | `varchar(255)` | Yes | `NULL` | Large cover image URL (AniList CDN) |
| `cover_image_medium` | `varchar(255)` | Yes | `NULL` | Medium cover image URL (AniList CDN) |
| `cover_image_color` | `varchar(7)` | Yes | `NULL` | Dominant cover color hex code |
| `banner_image` | `varchar(255)` | Yes | `NULL` | Banner image URL (AniList CDN) |
| `trailer_url` | `varchar(255)` | Yes | `NULL` | URL to trailer video |
| `average_score` | `tinyint unsigned` | Yes | `NULL` | AniList average score (0-100) |
| `mean_score` | `tinyint unsigned` | Yes | `NULL` | AniList mean score (0-100) |
| `bayesian_score` | `tinyint unsigned` | Yes | `NULL` | Calculated Bayesian score (0-100) |
| `popularity` | `int unsigned` | Yes | `NULL` | Popularity rank from AniList |
| `trending` | `int unsigned` | Yes | `NULL` | Trending rank from AniList |
| `favourites` | `int unsigned` | Yes | `NULL` | Favourites count from AniList |
| `is_adult` | `boolean` | No | `false` | Whether this is adult/18+ content |
| `anilist_updated_at` | `timestamp` | Yes | `NULL` | Last updated timestamp on AniList |
| `synced_at` | `timestamp` | Yes | `NULL` | When AniTrack last synced this record |
| `created_at` | `timestamp` | Yes | `NULL` | Record creation time |
| `updated_at` | `timestamp` | Yes | `NULL` | Last update time |

**Primary key:** `id`
**Unique constraints:** `anilist_id`, `mal_id`
**Indexes:**
| Index Name | Columns | Purpose |
|------------|---------|---------|
| `anime_format_index` | `format` | Filter by format (TV, MOVIE, etc.) |
| `anime_status_index` | `status` | Filter by airing status |
| `anime_season_index` | `season` | Filter by season |
| `anime_season_year_index` | `season_year` | Filter by year |
| `anime_average_score_index` | `average_score` | Sort/filter by score |
| `anime_bayesian_score_index` | `bayesian_score` | Sort/filter by Bayesian score |
| `anime_popularity_index` | `popularity` | Sort/filter by popularity |
| `anime_is_adult_index` | `is_adult` | Filter adult content |
| `anime_synced_at_index` | `synced_at` | Find stale records for re-sync |
| `anime_season_year_season_index` | `season_year`, `season` | Composite: seasonal anime queries |

**Full-text search:** Enabled via Laravel Scout (Searchable trait). Indexed fields: `id`, `title_romaji`, `title_english`, `title_native`, `title_synonyms`, `format`, `status`, `season_year`.

---

### 2.5 `genres`

Lookup table for anime genres, mapped to AniList genre IDs.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `bigint unsigned` | No | Auto-increment | Primary key |
| `anilist_id` | `bigint unsigned` | Yes | `NULL` | AniList genre ID (unique, made nullable by later migration) |
| `name` | `varchar(255)` | No | -- | Genre name (unique) |
| `created_at` | `timestamp` | Yes | `NULL` | Record creation time |
| `updated_at` | `timestamp` | Yes | `NULL` | Last update time |

**Primary key:** `id`
**Unique constraints:** `anilist_id`, `name`
**Timestamps:** Yes

> **Note:** `anilist_id` was made nullable via migration `2026_03_05_000001_make_genres_anilist_id_nullable.php` to support genres that may not have an AniList numeric ID.

---

### 2.6 `studios`

Lookup table for animation studios, mapped to AniList studio IDs.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `bigint unsigned` | No | Auto-increment | Primary key |
| `anilist_id` | `bigint unsigned` | No | -- | AniList studio ID (unique) |
| `name` | `varchar(255)` | No | -- | Studio name |
| `is_animation_studio` | `boolean` | No | `false` | Whether this is an animation studio (vs. producer/licensor) |
| `website_url` | `varchar(255)` | Yes | `NULL` | Studio website URL |
| `created_at` | `timestamp` | Yes | `NULL` | Record creation time |
| `updated_at` | `timestamp` | Yes | `NULL` | Last update time |

**Primary key:** `id`
**Unique constraints:** `anilist_id`
**Timestamps:** Yes

---

### 2.7 `anime_genre` (pivot)

Many-to-many pivot connecting anime to genres. No timestamps.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `anime_id` | `bigint unsigned` | No | -- | FK to `anime.id` |
| `genre_id` | `bigint unsigned` | No | -- | FK to `genres.id` |

**Primary key:** Composite (`anime_id`, `genre_id`)
**Foreign keys:**
- `anime_id` -> `anime.id` (CASCADE on delete)
- `genre_id` -> `genres.id` (CASCADE on delete)

---

### 2.8 `anime_studio` (pivot)

Many-to-many pivot connecting anime to studios, with an `is_main` flag to distinguish the primary studio from producers/licensors.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `anime_id` | `bigint unsigned` | No | -- | FK to `anime.id` |
| `studio_id` | `bigint unsigned` | No | -- | FK to `studios.id` |
| `is_main` | `boolean` | No | `false` | Whether this is the main animation studio |

**Primary key:** Composite (`anime_id`, `studio_id`)
**Foreign keys:**
- `anime_id` -> `anime.id` (CASCADE on delete)
- `studio_id` -> `studios.id` (CASCADE on delete)

---

### 2.9 `anime_relations`

Stores relationships between anime entries (sequel, prequel, side story, etc.).

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `bigint unsigned` | No | Auto-increment | Primary key |
| `anime_id` | `bigint unsigned` | No | -- | FK to `anime.id` (the source anime) |
| `related_anime_id` | `bigint unsigned` | No | -- | FK to `anime.id` (the related anime) |
| `relation_type` | `varchar(30)` | No | -- | Relationship type (SEQUEL, PREQUEL, SIDE_STORY, PARENT, etc.) |
| `created_at` | `timestamp` | Yes | `NULL` | Record creation time |
| `updated_at` | `timestamp` | Yes | `NULL` | Last update time |

**Primary key:** `id`
**Unique constraints:** `anime_relations_unique` (`anime_id`, `related_anime_id`, `relation_type`)
**Foreign keys:**
- `anime_id` -> `anime.id` (CASCADE on delete)
- `related_anime_id` -> `anime.id` (CASCADE on delete)
**Timestamps:** Yes

---

### 2.10 `airing_schedules`

Tracks upcoming and past episode air times. Used for the airing schedule feature and "next episode" display.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `bigint unsigned` | No | Auto-increment | Primary key |
| `anime_id` | `bigint unsigned` | No | -- | FK to `anime.id` |
| `anilist_airing_id` | `bigint unsigned` | No | -- | AniList airing schedule ID (unique) |
| `episode` | `smallint unsigned` | No | -- | Episode number |
| `airs_at` | `timestamp` | No | -- | When the episode airs (UTC) |
| `time_until_airing` | `integer` | Yes | `NULL` | Seconds until airing (from AniList, can become stale) |
| `created_at` | `timestamp` | Yes | `NULL` | Record creation time |
| `updated_at` | `timestamp` | Yes | `NULL` | Last update time |

**Primary key:** `id`
**Unique constraints:** `anilist_airing_id`
**Indexes:**
| Index Name | Columns | Purpose |
|------------|---------|---------|
| `airing_schedules_anime_id_episode_index` | `anime_id`, `episode` | Look up schedule for a specific anime episode |
| `airing_schedules_airs_at_index` | `airs_at` | Query upcoming/recent airings |

**Foreign keys:**
- `anime_id` -> `anime.id` (CASCADE on delete)
**Timestamps:** Yes

---

### 2.11 `user_anime_lists`

Stores each user's personal anime list entries with status, score, progress, and metadata. Supports soft deletes for data recovery.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `bigint unsigned` | No | Auto-increment | Primary key |
| `user_id` | `bigint unsigned` | No | -- | FK to `users.id` |
| `anime_id` | `bigint unsigned` | No | -- | FK to `anime.id` |
| `status` | `varchar(20)` | No | -- | Watch status: `watching`, `completed`, `on_hold`, `dropped`, `plan_to_watch` |
| `score` | `tinyint unsigned` | No | `0` | User score (0-100 internal scale; 0 = unscored) |
| `progress` | `smallint unsigned` | No | `0` | Episodes watched |
| `rewatch_count` | `smallint unsigned` | No | `0` | Number of rewatches |
| `started_at` | `date` | Yes | `NULL` | Date user started watching |
| `completed_at` | `date` | Yes | `NULL` | Date user finished watching |
| `notes` | `text` | Yes | `NULL` | User's personal notes |
| `tags` | `json` | Yes | `NULL` | User-defined tags (array) |
| `is_private` | `boolean` | No | `false` | Whether this entry is private |
| `is_rewatching` | `boolean` | No | `false` | Whether user is currently rewatching |
| `created_at` | `timestamp` | Yes | `NULL` | Record creation time |
| `updated_at` | `timestamp` | Yes | `NULL` | Last update time |
| `deleted_at` | `timestamp` | Yes | `NULL` | Soft delete timestamp |

**Primary key:** `id`
**Unique constraints:** (`user_id`, `anime_id`) -- one entry per user per anime
**Indexes:**
| Index Name | Columns | Purpose |
|------------|---------|---------|
| `user_anime_lists_user_id_anime_id_unique` | `user_id`, `anime_id` | Enforce one entry per user per anime |
| `user_anime_lists_user_id_status_index` | `user_id`, `status` | Filter user's list by status |
| `user_anime_lists_user_id_score_index` | `user_id`, `score` | Sort user's list by score |
| `user_anime_lists_user_id_updated_at_index` | `user_id`, `updated_at` | Sort user's list by last update |
| `user_anime_lists_status_index` | `status` | Global status queries |

**Foreign keys:**
- `user_id` -> `users.id` (CASCADE on delete)
- `anime_id` -> `anime.id` (CASCADE on delete)
**Soft deletes:** Yes
**Timestamps:** Yes

**Valid statuses** (defined as constants on `UserAnimeList` model):
- `watching` -- Currently watching
- `completed` -- Finished watching
- `on_hold` -- Temporarily paused
- `dropped` -- Stopped watching
- `plan_to_watch` -- Intend to watch later

---

### 2.12 `recommendations`

Stores anime-to-anime recommendations, sourced from AniList or user-submitted.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `bigint unsigned` | No | Auto-increment | Primary key |
| `anime_id` | `bigint unsigned` | No | -- | FK to `anime.id` (source anime) |
| `recommended_anime_id` | `bigint unsigned` | No | -- | FK to `anime.id` (recommended anime) |
| `source` | `varchar(20)` | No | `'anilist'` | Where this recommendation came from |
| `anilist_recommendation_id` | `bigint unsigned` | Yes | `NULL` | AniList recommendation ID (unique) |
| `rating` | `integer` | No | `0` | Aggregate rating score |
| `created_at` | `timestamp` | Yes | `NULL` | Record creation time |
| `updated_at` | `timestamp` | Yes | `NULL` | Last update time |

**Primary key:** `id`
**Unique constraints:** `anilist_recommendation_id`, `recommendations_unique` (`anime_id`, `recommended_anime_id`, `source`)
**Foreign keys:**
- `anime_id` -> `anime.id` (CASCADE on delete)
- `recommended_anime_id` -> `anime.id` (CASCADE on delete)
**Timestamps:** Yes

---

### 2.13 `recommendation_votes`

Stores user votes on recommendations (upvote/downvote).

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `bigint unsigned` | No | Auto-increment | Primary key |
| `recommendation_id` | `bigint unsigned` | No | -- | FK to `recommendations.id` |
| `user_id` | `bigint unsigned` | No | -- | FK to `users.id` |
| `vote` | `tinyint` | No | -- | Vote value (1 = upvote, -1 = downvote) |
| `created_at` | `timestamp` | Yes | `NULL` | Record creation time |
| `updated_at` | `timestamp` | Yes | `NULL` | Last update time |

**Primary key:** `id`
**Unique constraints:** (`recommendation_id`, `user_id`) -- one vote per user per recommendation
**Foreign keys:**
- `recommendation_id` -> `recommendations.id` (CASCADE on delete)
- `user_id` -> `users.id` (CASCADE on delete)
**Timestamps:** Yes

---

### 2.14 `external_ids`

Maps anime to IDs on external platforms (MAL, Crunchyroll, etc.). Used for cross-platform linking and streaming availability.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `bigint unsigned` | No | Auto-increment | Primary key |
| `anime_id` | `bigint unsigned` | No | -- | FK to `anime.id` |
| `platform` | `varchar(30)` | No | -- | Platform name (e.g., `mal`, `crunchyroll`, `hidive`) |
| `external_id` | `varchar(255)` | Yes | `NULL` | ID on the external platform |
| `url` | `varchar(255)` | Yes | `NULL` | Direct URL on the external platform |
| `created_at` | `timestamp` | Yes | `NULL` | Record creation time |
| `updated_at` | `timestamp` | Yes | `NULL` | Last update time |

**Primary key:** `id`
**Unique constraints:** (`anime_id`, `platform`) -- one entry per platform per anime
**Foreign keys:**
- `anime_id` -> `anime.id` (CASCADE on delete)
**Timestamps:** Yes

---

### 2.15 `raw_api_responses`

Stores raw JSON responses from external APIs during development for debugging and reprocessing.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `bigint unsigned` | No | Auto-increment | Primary key |
| `source` | `varchar(20)` | No | -- | API source (e.g., `anilist`, `mal`) |
| `endpoint` | `varchar(255)` | No | -- | API endpoint or query name |
| `external_id` | `varchar(255)` | No | -- | External ID that was queried |
| `response_body` | `longtext` | No | -- | Full raw JSON response |
| `fetched_at` | `timestamp` | No | -- | When the response was fetched |
| `is_processed` | `boolean` | No | `false` | Whether response has been processed into app data |
| `processed_at` | `timestamp` | Yes | `NULL` | When the response was processed |
| `created_at` | `timestamp` | Yes | `NULL` | Record creation time |
| `updated_at` | `timestamp` | Yes | `NULL` | Last update time |

**Primary key:** `id`
**Indexes:**
| Index Name | Columns | Purpose |
|------------|---------|---------|
| `raw_api_responses_source_external_id_index` | `source`, `external_id` | Look up responses by source and ID |
| `raw_api_responses_is_processed_index` | `is_processed` | Find unprocessed responses for batch processing |

**Timestamps:** Yes

---

### 2.16 `personal_access_tokens`

Laravel Sanctum API tokens table (polymorphic).

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `bigint unsigned` | No | Auto-increment | Primary key |
| `tokenable_type` | `varchar(255)` | No | -- | Polymorphic model type (e.g., `App\Models\User`) |
| `tokenable_id` | `bigint unsigned` | No | -- | Polymorphic model ID |
| `name` | `text` | No | -- | Token name/label |
| `token` | `varchar(64)` | No | -- | SHA-256 hashed token (unique) |
| `abilities` | `text` | Yes | `NULL` | JSON-encoded abilities/permissions |
| `last_used_at` | `timestamp` | Yes | `NULL` | When token was last used |
| `expires_at` | `timestamp` | Yes | `NULL` | Token expiration time |
| `created_at` | `timestamp` | Yes | `NULL` | Record creation time |
| `updated_at` | `timestamp` | Yes | `NULL` | Last update time |

**Primary key:** `id`
**Unique constraints:** `token`
**Indexes:** `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`, `tokenable_id`), `personal_access_tokens_expires_at_index` (`expires_at`)
**Timestamps:** Yes

---

### 2.17 `cache`

Laravel database cache driver table.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `key` | `varchar(255)` | No | -- | Cache key (primary key) |
| `value` | `mediumtext` | No | -- | Serialized cached value |
| `expiration` | `integer` | No | -- | Unix timestamp when entry expires |

**Primary key:** `key`
**Indexes:** `cache_expiration_index` (`expiration`)

---

### 2.18 `cache_locks`

Laravel atomic cache lock table.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `key` | `varchar(255)` | No | -- | Lock key (primary key) |
| `owner` | `varchar(255)` | No | -- | Lock owner identifier |
| `expiration` | `integer` | No | -- | Unix timestamp when lock expires |

**Primary key:** `key`
**Indexes:** `cache_locks_expiration_index` (`expiration`)

---

### 2.19 `jobs`

Laravel queue jobs table (used with Redis + Horizon, but available as fallback).

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `bigint unsigned` | No | Auto-increment | Primary key |
| `queue` | `varchar(255)` | No | -- | Queue name |
| `payload` | `longtext` | No | -- | Serialized job payload |
| `attempts` | `tinyint unsigned` | No | -- | Number of execution attempts |
| `reserved_at` | `int unsigned` | Yes | `NULL` | Unix timestamp when job was reserved by a worker |
| `available_at` | `int unsigned` | No | -- | Unix timestamp when job becomes available |
| `created_at` | `int unsigned` | No | -- | Unix timestamp when job was created |

**Primary key:** `id`
**Indexes:** `jobs_queue_index` (`queue`)

---

### 2.20 `job_batches`

Laravel job batch tracking table.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `varchar(255)` | No | -- | Batch UUID (primary key) |
| `name` | `varchar(255)` | No | -- | Batch name |
| `total_jobs` | `integer` | No | -- | Total jobs in batch |
| `pending_jobs` | `integer` | No | -- | Jobs still pending |
| `failed_jobs` | `integer` | No | -- | Jobs that failed |
| `failed_job_ids` | `longtext` | No | -- | JSON array of failed job IDs |
| `options` | `mediumtext` | Yes | `NULL` | Serialized batch options |
| `cancelled_at` | `integer` | Yes | `NULL` | Unix timestamp when batch was cancelled |
| `created_at` | `integer` | No | -- | Unix timestamp when batch was created |
| `finished_at` | `integer` | Yes | `NULL` | Unix timestamp when batch finished |

**Primary key:** `id`

---

### 2.21 `failed_jobs`

Laravel failed job log table.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `bigint unsigned` | No | Auto-increment | Primary key |
| `uuid` | `varchar(255)` | No | -- | Unique job UUID |
| `connection` | `text` | No | -- | Queue connection name |
| `queue` | `text` | No | -- | Queue name |
| `payload` | `longtext` | No | -- | Serialized job payload |
| `exception` | `longtext` | No | -- | Exception trace |
| `failed_at` | `timestamp` | No | `CURRENT_TIMESTAMP` | When the job failed |

**Primary key:** `id`
**Unique constraints:** `uuid`

---

## 3. Eloquent Relationships

### Anime (`App\Models\Anime`)

| Relationship | Method | Type | Related Model | Pivot/FK | Notes |
|-------------|--------|------|---------------|----------|-------|
| Genres | `genres()` | `BelongsToMany` | `Genre` | via `anime_genre` | -- |
| Studios | `studios()` | `BelongsToMany` | `Studio` | via `anime_studio` | Includes `is_main` pivot column |
| Relations | `relations()` | `HasMany` | `AnimeRelation` | `anime_id` | Sequel, prequel, side story, etc. |
| Airing Schedules | `airingSchedules()` | `HasMany` | `AiringSchedule` | `anime_id` | All scheduled episodes |
| Next Airing Episode | `nextAiringEpisode()` | `HasOne` | `AiringSchedule` | `anime_id` | Scoped: `airs_at > now()`, ordered by `airs_at` |
| User Entries | `userEntries()` | `HasMany` | `UserAnimeList` | `anime_id` | All users' list entries for this anime |
| Recommendations | `recommendations()` | `HasMany` | `Recommendation` | `anime_id` | Recommendations from this anime |
| External IDs | `externalIds()` | `HasMany` | `ExternalId` | `anime_id` | Cross-platform identifiers |

**Scopes:** `finished()`, `releasing()`, `forSeason($year, $season)`, `byFormat($format)`, `adultContent($include)`

### User (`App\Models\User`)

| Relationship | Method | Type | Related Model | FK |
|-------------|--------|------|---------------|-----|
| Anime List | `animeList()` | `HasMany` | `UserAnimeList` | `user_id` |
| Recommendation Votes | `recommendationVotes()` | `HasMany` | `RecommendationVote` | `user_id` |

**Traits:** `HasApiTokens` (Sanctum), `HasFactory`, `Notifiable`, `SoftDeletes`

### Genre (`App\Models\Genre`)

| Relationship | Method | Type | Related Model | Pivot |
|-------------|--------|------|---------------|-------|
| Anime | `anime()` | `BelongsToMany` | `Anime` | via `anime_genre` |

### Studio (`App\Models\Studio`)

| Relationship | Method | Type | Related Model | Pivot |
|-------------|--------|------|---------------|-------|
| Anime | `anime()` | `BelongsToMany` | `Anime` | via `anime_studio` (with `is_main` pivot) |

### UserAnimeList (`App\Models\UserAnimeList`)

| Relationship | Method | Type | Related Model | FK |
|-------------|--------|------|---------------|-----|
| User | `user()` | `BelongsTo` | `User` | `user_id` |
| Anime | `anime()` | `BelongsTo` | `Anime` | `anime_id` |

**Accessor:** `display_score` -- returns score divided by 10 (0-10 scale)

### AiringSchedule (`App\Models\AiringSchedule`)

| Relationship | Method | Type | Related Model | FK |
|-------------|--------|------|---------------|-----|
| Anime | `anime()` | `BelongsTo` | `Anime` | `anime_id` |

**Scopes:** `upcoming()`, `today()`, `thisWeek()`

### AnimeRelation (`App\Models\AnimeRelation`)

| Relationship | Method | Type | Related Model | FK |
|-------------|--------|------|---------------|-----|
| Anime | `anime()` | `BelongsTo` | `Anime` | `anime_id` |
| Related Anime | `relatedAnime()` | `BelongsTo` | `Anime` | `related_anime_id` |

### Recommendation (`App\Models\Recommendation`)

| Relationship | Method | Type | Related Model | FK |
|-------------|--------|------|---------------|-----|
| Anime | `anime()` | `BelongsTo` | `Anime` | `anime_id` |
| Recommended Anime | `recommendedAnime()` | `BelongsTo` | `Anime` | `recommended_anime_id` |
| Votes | `votes()` | `HasMany` | `RecommendationVote` | `recommendation_id` |

### RecommendationVote (`App\Models\RecommendationVote`)

| Relationship | Method | Type | Related Model | FK |
|-------------|--------|------|---------------|-----|
| Recommendation | `recommendation()` | `BelongsTo` | `Recommendation` | `recommendation_id` |
| User | `user()` | `BelongsTo` | `User` | `user_id` |

### ExternalId (`App\Models\ExternalId`)

| Relationship | Method | Type | Related Model | FK |
|-------------|--------|------|---------------|-----|
| Anime | `anime()` | `BelongsTo` | `Anime` | `anime_id` |

### RawApiResponse (`App\Models\RawApiResponse`)

No relationships. Standalone table for development/debugging.

---

## 4. Index Reference

Complete list of all custom and notable indexes across the schema.

| Table | Index Name | Columns | Purpose |
|-------|-----------|---------|---------|
| `users` | `users_email_unique` | `email` | Unique login identifier |
| `users` | `users_mal_id_unique` | `mal_id` | Unique MAL account link |
| `sessions` | `sessions_user_id_index` | `user_id` | Look up sessions by user |
| `sessions` | `sessions_last_activity_index` | `last_activity` | Expire stale sessions |
| `anime` | `anime_anilist_id_unique` | `anilist_id` | Unique AniList identifier |
| `anime` | `anime_mal_id_unique` | `mal_id` | Unique MAL identifier |
| `anime` | `anime_format_index` | `format` | Filter by media format |
| `anime` | `anime_status_index` | `status` | Filter by airing status |
| `anime` | `anime_season_index` | `season` | Filter by season |
| `anime` | `anime_season_year_index` | `season_year` | Filter by year |
| `anime` | `anime_season_year_season_index` | `season_year`, `season` | Composite seasonal queries |
| `anime` | `anime_average_score_index` | `average_score` | Sort/filter by average score |
| `anime` | `anime_bayesian_score_index` | `bayesian_score` | Sort/filter by Bayesian score |
| `anime` | `anime_popularity_index` | `popularity` | Sort/filter by popularity |
| `anime` | `anime_is_adult_index` | `is_adult` | Filter adult content |
| `anime` | `anime_synced_at_index` | `synced_at` | Find stale records for re-sync |
| `genres` | `genres_anilist_id_unique` | `anilist_id` | Unique AniList genre ID |
| `genres` | `genres_name_unique` | `name` | Prevent duplicate genre names |
| `studios` | `studios_anilist_id_unique` | `anilist_id` | Unique AniList studio ID |
| `airing_schedules` | `airing_schedules_anilist_airing_id_unique` | `anilist_airing_id` | Unique AniList airing entry |
| `airing_schedules` | `airing_schedules_anime_id_episode_index` | `anime_id`, `episode` | Look up specific episode schedule |
| `airing_schedules` | `airing_schedules_airs_at_index` | `airs_at` | Query by air date/time |
| `user_anime_lists` | `user_anime_lists_user_id_anime_id_unique` | `user_id`, `anime_id` | One entry per user per anime |
| `user_anime_lists` | `user_anime_lists_user_id_status_index` | `user_id`, `status` | Filter user's list by status |
| `user_anime_lists` | `user_anime_lists_user_id_score_index` | `user_id`, `score` | Sort user's list by score |
| `user_anime_lists` | `user_anime_lists_user_id_updated_at_index` | `user_id`, `updated_at` | Sort user's list by recency |
| `user_anime_lists` | `user_anime_lists_status_index` | `status` | Global status distribution queries |
| `recommendations` | `recommendations_anilist_recommendation_id_unique` | `anilist_recommendation_id` | Unique AniList rec ID |
| `recommendations` | `recommendations_unique` | `anime_id`, `recommended_anime_id`, `source` | Prevent duplicate recommendations |
| `recommendation_votes` | `recommendation_votes_recommendation_id_user_id_unique` | `recommendation_id`, `user_id` | One vote per user per recommendation |
| `external_ids` | `external_ids_anime_id_platform_unique` | `anime_id`, `platform` | One entry per platform per anime |
| `raw_api_responses` | `raw_api_responses_source_external_id_index` | `source`, `external_id` | Look up responses by source |
| `raw_api_responses` | `raw_api_responses_is_processed_index` | `is_processed` | Find unprocessed responses |
| `personal_access_tokens` | `personal_access_tokens_token_unique` | `token` | Token lookup |
| `personal_access_tokens` | `personal_access_tokens_tokenable_type_tokenable_id_index` | `tokenable_type`, `tokenable_id` | Polymorphic lookup |
| `personal_access_tokens` | `personal_access_tokens_expires_at_index` | `expires_at` | Expire old tokens |
| `cache` | `cache_expiration_index` | `expiration` | Expire cache entries |
| `cache_locks` | `cache_locks_expiration_index` | `expiration` | Expire stale locks |
| `jobs` | `jobs_queue_index` | `queue` | Queue worker dispatch |
| `failed_jobs` | `failed_jobs_uuid_unique` | `uuid` | Unique failed job lookup |

---

## 5. Score Storage

AniTrack uses a **two-tier score system** to balance precision and display simplicity.

### Internal Storage (0-100 integer)

All scores are stored as unsigned integers on a 0-100 scale in the database:

- **`anime.average_score`** -- AniList's average score, stored as-is (0-100)
- **`anime.mean_score`** -- AniList's mean score, stored as-is (0-100)
- **`anime.bayesian_score`** -- Calculated internally (0-100)
- **`user_anime_lists.score`** -- User's personal score (0-100, where 0 means unscored)

Using integers avoids floating-point precision issues in the database and allows efficient indexing and comparisons.

### Display (0-10 float)

Scores are divided by 10 when displayed to the user, yielding a **0.0 to 10.0 scale** with one decimal place (matching MAL's familiar 10-point system).

### Normalization Methods

**`Anime::normalizeScore(?int $score): ?float`** (static method on the Anime model):

```php
public static function normalizeScore(?int $score): ?float
{
    return $score !== null ? round($score / 10, 1) : null;
}
```

**`UserAnimeList::$display_score`** (accessor on the UserAnimeList model):

```php
public function getDisplayScoreAttribute(): ?float
{
    return $this->score !== null ? round($this->score / 10, 1) : null;
}
```

### Bayesian Score

The `bayesian_score` column on the `anime` table stores a weighted average that prevents anime with very few ratings from appearing disproportionately high in rankings. It is **recalculated periodically** (twice daily via scheduled job) using the formula:

```
bayesian = (C * m + sum_of_scores) / (C + num_scores)
```

Where `C` is a confidence constant (minimum vote threshold) and `m` is the global mean score.

---

## 6. Soft Deletes

Two tables use Laravel's `SoftDeletes` trait (`deleted_at` timestamp column):

| Table | Model | Reason |
|-------|-------|--------|
| `users` | `User` | Preserve user data for potential account recovery. Prevents orphaned references in recommendation votes and list history. Allows "deactivate" without permanent data loss. |
| `user_anime_lists` | `UserAnimeList` | Preserve watch history even if a user removes an entry from their list. Enables undo functionality, historical analytics, and data recovery after accidental deletion. |

Both tables were designed with soft deletes from day one as a deliberate architectural decision -- user-generated data is considered valuable and should never be permanently lost without explicit intent.

All other tables use hard deletes with cascading foreign keys. Anime metadata, genres, studios, and related data can be re-fetched from the AniList API, so soft deletes are unnecessary for those tables.
