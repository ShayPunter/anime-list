# AniTrack - Project Conventions

## Feature Flags

All new user-facing features MUST be gated behind a feature flag using Laravel Pennant. This allows testing features on production with specific users before enabling them for everyone.

### Adding a new feature flag

1. Define the flag in `app/Providers/AppServiceProvider.php` → `defineFeatureFlags()`:
   ```php
   Feature::define('my-feature', fn ($user) => false);
   ```

2. Use **kebab-case** for flag names (e.g., `playlists`, `social-profiles`, `anime-reviews`).

3. Check the flag in PHP (controllers, middleware, etc.):
   ```php
   use Laravel\Pennant\Feature;

   if (Feature::for($user)->active('my-feature')) {
       // feature-specific logic
   }
   ```

4. Check the flag in Vue components:
   ```vue
   <script setup>
   import { useFeature } from '@/composables/useFeature'
   const showFeature = useFeature('my-feature')
   </script>

   <template>
       <div v-if="showFeature">...</div>
   </template>
   ```

5. Manage flags at `/admin/features` — toggle between Everyone, Nobody, or specific users.

### When to use feature flags

- Any new page, section, or significant UI change
- New API endpoints that change user-facing behavior
- Do NOT flag internal refactors, bug fixes, or admin-only changes

## Tech Stack

- **Backend:** Laravel 12, PHP 8.2+
- **Frontend:** Vue 3 + TypeScript, Inertia.js, PrimeVue, Tailwind CSS
- **Database:** MySQL
- **Queue:** Redis + Laravel Horizon
- **External API:** AniList GraphQL API
- **SSR:** Inertia SSR with Node.js

## Key Patterns

- **Services** handle business logic (`app/Services/`)
- **API Resources** format data for frontend (`app/Http/Resources/`)
- **Form Requests** validate input (`app/Http/Requests/`)
- **Composables** for reusable Vue logic (`resources/js/composables/`)
- **Types** in `resources/js/types/` with barrel export from `index.ts`
- Anime uses **slug-based routing** (`getRouteKeyName()` → `'slug'`)
- API routes use `{model:id}` binding (not slug) for mutation endpoints
- Frontend mutations use **TanStack Vue Query** via composables
