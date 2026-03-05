# AniTrack Infrastructure Documentation

This document covers the complete infrastructure setup for AniTrack, including local development, Docker services, configuration, and production deployment.

---

## 1. Local Development Setup

### Option A: Laravel Herd (Windows)

Laravel Herd provides a native PHP environment on Windows without Docker.

**Prerequisites:**
- Laravel Herd installed with PHP 8.4
- MySQL 8 running locally (via Herd or standalone)
- Redis running locally
- Node.js 22+ and pnpm installed

**Steps:**

```bash
# 1. Clone the repository
git clone <repo-url> && cd backend

# 2. Install PHP dependencies
# Note: --ignore-platform-reqs is required on Windows because ext-pcntl
# is not available (it works fine on the Linux production server).
composer install --ignore-platform-reqs

# 3. Copy environment file and generate app key
cp .env.example .env
php artisan key:generate

# 4. Configure .env
# Set DB_HOST=127.0.0.1, DB_PASSWORD to your local MySQL password,
# REDIS_HOST=127.0.0.1, and APP_URL=http://localhost:8000.
# The defaults in .env.example are already configured for local Herd usage.

# 5. Run database migrations
php artisan migrate

# 6. Install frontend dependencies and start Vite dev server
pnpm install
pnpm dev

# 7. (Optional) Start Horizon for queue processing
php artisan horizon

# 8. (Optional) Run the scheduler
php artisan schedule:work
```

The application will be available at the URL configured in Herd (typically `http://anitrack.test` or `http://localhost:8000`).

**PHP path on this machine:** `C:/Users/shayp/.config/herd/bin/php84/php.exe`
**Composer path:** `C:/Users/shayp/.config/herd/bin/composer.phar`

---

### Option B: Docker Compose

Docker Compose provides a fully containerized environment with all services pre-configured.

**Prerequisites:**
- Docker Desktop installed and running

**Steps:**

```bash
# 1. Clone the repository
git clone <repo-url> && cd backend

# 2. Copy environment file
cp .env.example .env

# 3. Start all services
docker compose up -d

# 4. Generate app key (after containers are healthy)
docker compose exec app php artisan key:generate
```

Docker Compose automatically handles:
- Composer dependency installation
- Database migrations
- Vite dev server startup
- Horizon queue worker
- Laravel scheduler

The application will be available at `http://localhost:8000`.
The Vite HMR dev server runs on `http://localhost:5173`.
MailHog web UI is available at `http://localhost:8025`.

---

## 2. Docker Compose Services

All services are defined in `docker-compose.yml` at the project root.

### Service Overview

| Service     | Image                  | Ports             | Purpose                        | Dependencies             |
|-------------|------------------------|-------------------|--------------------------------|--------------------------|
| `app`       | Custom (php:8.4-fpm)   | None (internal)   | PHP-FPM application server     | mysql, redis (healthy)   |
| `nginx`     | nginx:alpine           | 8000:80           | Web server / reverse proxy     | app                      |
| `vite`      | node:22-alpine         | 5173:5173         | Frontend dev server with HMR   | None                     |
| `mysql`     | mysql:8.4              | 3306:3306         | Primary database               | None                     |
| `redis`     | redis:alpine           | 6379:6379         | Cache, queue broker, sessions  | None                     |
| `horizon`   | Custom (php:8.4-fpm)   | None (internal)   | Queue worker manager           | app (healthy), redis (healthy) |
| `scheduler` | Custom (php:8.4-fpm)   | None (internal)   | Laravel task scheduler         | app (healthy)            |
| `mailhog`   | mailhog/mailhog        | 8025:8025, 1025:1025 | Local email testing         | None                     |

### Named Volumes

| Volume         | Purpose                                    |
|----------------|--------------------------------------------|
| `mysql_data`   | Persistent MySQL data across restarts      |
| `redis_data`   | Persistent Redis data across restarts      |
| `vendor`       | Cached Composer dependencies               |
| `node_modules` | Cached pnpm/node dependencies              |

### Detailed Service Documentation

#### app (PHP-FPM)

- **Build:** `./docker/Dockerfile`
- **Volumes:** Project root mounted to `/var/www/html`; `vendor` as a named volume
- **Command:** Runs `composer install --ignore-platform-reqs`, then `php artisan migrate --force`, creates a readiness marker file, and starts `php-fpm`
- **Healthcheck:** Tests for existence of `/tmp/app-ready` (interval: 5s, timeout: 3s, retries: 30)
- **Environment overrides:** `DB_HOST=mysql`, `DB_PASSWORD=secret`, `REDIS_HOST=redis`, `MAIL_HOST=mailhog`, `MAIL_PORT=1025`

#### nginx

- **Image:** `nginx:alpine`
- **Ports:** `8000:80`
- **Volumes:** Project root to `/var/www/html`; custom config at `./docker/nginx.conf` mapped to `/etc/nginx/conf.d/default.conf`
- **Depends on:** `app`

#### vite

- **Image:** `node:22-alpine`
- **Ports:** `5173:5173`
- **Volumes:** Project root to `/var/www/html`; `node_modules` as a named volume
- **Working directory:** `/var/www/html`
- **Command:** `sh -c "npm install -g pnpm && pnpm install && pnpm dev"`

#### mysql

- **Image:** `mysql:8.4`
- **Ports:** `3306:3306`
- **Environment:** `MYSQL_DATABASE=anitrack`, `MYSQL_ROOT_PASSWORD=secret`
- **Volumes:** `mysql_data:/var/lib/mysql`
- **Healthcheck:** `mysqladmin ping -h localhost` (interval: 5s, timeout: 3s, retries: 10)

#### redis

- **Image:** `redis:alpine`
- **Ports:** `6379:6379`
- **Volumes:** `redis_data:/data`
- **Healthcheck:** `redis-cli ping` (interval: 5s, timeout: 3s, retries: 5)

#### horizon

- **Build:** `./docker/Dockerfile` (same image as `app`)
- **Volumes:** Same as `app`
- **Command:** `php artisan horizon`
- **Environment:** Same overrides as `app` (minus mail settings)
- **Depends on:** `app` (healthy), `redis` (healthy)

#### scheduler

- **Build:** `./docker/Dockerfile` (same image as `app`)
- **Volumes:** Same as `app`
- **Command:** `php artisan schedule:work`
- **Environment:** Same overrides as `app` (minus mail settings)
- **Depends on:** `app` (healthy)

#### mailhog

- **Image:** `mailhog/mailhog`
- **Ports:** `8025:8025` (web UI), `1025:1025` (SMTP)
- **Purpose:** Catches all outgoing email in development. Access the web UI at `http://localhost:8025`.

---

## 3. Dockerfile

**Location:** `docker/Dockerfile`

**Base image:** `php:8.4-fpm`

### System Dependencies

The following system packages are installed:
- `git`, `curl`, `zip`, `unzip` -- general tooling
- `libpng-dev`, `libjpeg-dev`, `libfreetype6-dev` -- GD image library
- `libonig-dev` -- mbstring support
- `libxml2-dev` -- XML extension

### PHP Extensions

| Extension   | Install Method | Purpose                                       |
|-------------|----------------|-----------------------------------------------|
| `pdo_mysql` | docker-php-ext | MySQL database driver                         |
| `mbstring`  | docker-php-ext | Multibyte string handling                     |
| `exif`      | docker-php-ext | Image metadata reading                        |
| `pcntl`     | docker-php-ext | Process control (required by Horizon)         |
| `bcmath`    | docker-php-ext | Arbitrary precision math                      |
| `gd`        | docker-php-ext | Image processing (configured with freetype + jpeg) |
| `xml`       | docker-php-ext | XML parsing                                   |
| `redis`     | pecl           | PHP Redis client for cache/queue/sessions     |

### Composer

Composer is installed by copying the binary from the official `composer:latest` image:

```dockerfile
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
```

### Working Directory

```
WORKDIR /var/www/html
```

---

## 4. Nginx Configuration

**Location:** `docker/nginx.conf`

The Nginx configuration provides a standard Laravel-optimized server block:

```nginx
server {
    listen 80;
    server_name localhost;
    root /var/www/html/public;
    index index.php;

    charset utf-8;
    client_max_body_size 10M;

    # Laravel front-controller pattern
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Suppress logs for common static files
    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    # Route 404s through Laravel
    error_page 404 /index.php;

    # PHP-FPM proxy
    location ~ \.php$ {
        fastcgi_pass app:9000;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Deny access to dotfiles (except .well-known)
    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

**Key details:**
- **Document root:** `/var/www/html/public` (Laravel's public directory)
- **PHP-FPM upstream:** `app:9000` -- resolves to the `app` Docker service on port 9000
- **try_files rule:** All non-file, non-directory requests are routed to `index.php`, which is Laravel's front controller
- **Upload limit:** 10 MB (`client_max_body_size`)
- **Security:** All dotfiles are blocked except `.well-known` (used for SSL certificate validation)

---

## 5. Environment Variables

**Location:** `.env.example`

All variables are documented below. Variables marked with **(Docker override)** are automatically set by the Docker Compose `environment` block and will override whatever is in the `.env` file when running in Docker.

### Application

| Variable                  | Default Value          | Description                                              |
|---------------------------|------------------------|----------------------------------------------------------|
| `APP_NAME`                | `AniTrack`             | Application name, used in UI and email sender            |
| `APP_ENV`                 | `local`                | Environment: `local`, `production`, `testing`            |
| `APP_KEY`                 | (empty)                | Encryption key. Generate with `php artisan key:generate` |
| `APP_DEBUG`               | `true`                 | Enable detailed error pages. Set `false` in production   |
| `APP_URL`                 | `http://localhost:8000`| Base URL for link generation                             |
| `APP_LOCALE`              | `en`                   | Default application locale                               |
| `APP_FALLBACK_LOCALE`     | `en`                   | Fallback locale when translation is missing              |
| `APP_FAKER_LOCALE`        | `en_US`                | Locale for Faker data in tests/seeds                     |
| `APP_MAINTENANCE_DRIVER`  | `file`                 | Maintenance mode storage driver                          |

### Security

| Variable        | Default Value | Description                         |
|-----------------|---------------|-------------------------------------|
| `BCRYPT_ROUNDS` | `12`          | Bcrypt hashing cost factor          |

### Logging

| Variable                   | Default Value | Description                                     |
|----------------------------|---------------|-------------------------------------------------|
| `LOG_CHANNEL`              | `stack`       | Default log channel                             |
| `LOG_STACK`                | `single`      | Channels included in the stack                  |
| `LOG_DEPRECATIONS_CHANNEL` | `null`        | Channel for PHP deprecation warnings            |
| `LOG_LEVEL`                | `debug`       | Minimum log level                               |

### Database

| Variable        | Default Value | Docker Override | Description                     |
|-----------------|---------------|-----------------|---------------------------------|
| `DB_CONNECTION` | `mysql`       | `mysql`         | Database driver                 |
| `DB_HOST`       | `127.0.0.1`   | `mysql`         | Database hostname               |
| `DB_PORT`       | `3306`        | --              | Database port                   |
| `DB_DATABASE`   | `anitrack`    | `anitrack`      | Database name                   |
| `DB_USERNAME`   | `root`        | `root`          | Database username               |
| `DB_PASSWORD`   | (empty)       | `secret`        | Database password               |

### Session

| Variable            | Default Value | Description                               |
|---------------------|---------------|-------------------------------------------|
| `SESSION_DRIVER`    | `database`    | Session storage driver                    |
| `SESSION_LIFETIME`  | `120`         | Session lifetime in minutes               |
| `SESSION_ENCRYPT`   | `false`       | Whether to encrypt session data           |
| `SESSION_PATH`      | `/`           | Cookie path                               |
| `SESSION_DOMAIN`    | `localhost`   | Cookie domain                             |

### Broadcasting, Filesystem, Queue

| Variable               | Default Value | Docker Override | Description                          |
|------------------------|---------------|-----------------|--------------------------------------|
| `BROADCAST_CONNECTION` | `log`         | --              | Broadcast driver                     |
| `FILESYSTEM_DISK`      | `local`       | --              | Default filesystem disk              |
| `QUEUE_CONNECTION`     | `redis`       | `redis`         | Queue backend driver                 |

### Cache

| Variable       | Default Value | Docker Override | Description                       |
|----------------|---------------|-----------------|-----------------------------------|
| `CACHE_STORE`  | `redis`       | `redis`         | Cache backend driver              |
| `CACHE_PREFIX` | `anitrack_`   | --              | Key prefix for cache entries      |

### Search

| Variable       | Default Value | Description                                    |
|----------------|---------------|------------------------------------------------|
| `SCOUT_DRIVER` | `database`    | Laravel Scout search driver                    |

### Redis

| Variable         | Default Value | Docker Override | Description                    |
|------------------|---------------|-----------------|--------------------------------|
| `REDIS_CLIENT`   | `phpredis`    | --              | PHP Redis client library       |
| `REDIS_HOST`     | `127.0.0.1`   | `redis`         | Redis server hostname          |
| `REDIS_PASSWORD` | `null`        | --              | Redis auth password            |
| `REDIS_PORT`     | `6379`        | --              | Redis server port              |

### Mail

| Variable            | Default Value          | Docker Override | Description                    |
|---------------------|------------------------|-----------------|--------------------------------|
| `MAIL_MAILER`       | `log`                  | --              | Mail transport driver          |
| `MAIL_SCHEME`       | `null`                 | --              | Mail encryption scheme         |
| `MAIL_HOST`         | `127.0.0.1`            | `mailhog`       | SMTP server hostname           |
| `MAIL_PORT`         | `2525`                 | `1025`          | SMTP server port               |
| `MAIL_USERNAME`     | `null`                 | --              | SMTP auth username             |
| `MAIL_PASSWORD`     | `null`                 | --              | SMTP auth password             |
| `MAIL_FROM_ADDRESS` | `hello@anitrack.dev`   | --              | Default sender email address   |
| `MAIL_FROM_NAME`    | `${APP_NAME}`          | --              | Default sender display name    |

### AniList API

| Variable             | Default Value                    | Description                                    |
|----------------------|----------------------------------|------------------------------------------------|
| `ANILIST_API_URL`    | `https://graphql.anilist.co`     | AniList GraphQL API endpoint                   |
| `ANILIST_RATE_LIMIT` | `85`                             | Requests per minute (limit is 90; 85 for safety margin) |
| `ANILIST_STORE_RAW`  | `true`                           | Store raw API responses for debugging/reprocessing |

### Jikan API (Deferred to v1.1)

| Variable         | Default Value                    | Description                        |
|------------------|----------------------------------|------------------------------------|
| `JIKAN_API_URL`  | `https://api.jikan.moe/v4`      | Jikan REST API base URL            |

### MAL OAuth (Deferred to v1.1)

| Variable             | Default Value                         | Description                         |
|----------------------|---------------------------------------|-------------------------------------|
| `MAL_CLIENT_ID`      | (empty)                               | MyAnimeList OAuth client ID         |
| `MAL_CLIENT_SECRET`  | (empty)                               | MyAnimeList OAuth client secret     |
| `MAL_REDIRECT_URI`   | `${APP_URL}/auth/mal/callback`        | OAuth callback URL                  |

---

## 6. Laravel Horizon

**Configuration:** `config/horizon.php`
**Service Provider:** `app/Providers/HorizonServiceProvider.php`
**Dashboard URL:** `/horizon`

### Supervisors

Horizon runs three supervisors, each handling a different category of background work:

| Supervisor           | Queue     | Balance  | Max Processes (local) | Max Processes (prod) | Timeout | Tries | Purpose                                    |
|----------------------|-----------|----------|----------------------|---------------------|---------|-------|--------------------------------------------|
| `supervisor-default` | `default` | `auto`   | 2                    | 2                   | 60s     | 3     | General background jobs                    |
| `supervisor-sync`    | `sync`    | `false`  | 1                    | 1                   | 300s    | 3     | AniList API sync jobs (sequential, long-running) |
| `supervisor-import`  | `import`  | `auto`   | 1 (local) / 2 (prod) | 2                   | 120s    | 3     | MAL XML list import processing             |

### Default Supervisor Settings

The `supervisor-default` defines the base configuration that other supervisors inherit from or override:
- **Connection:** `redis`
- **Auto-scaling strategy:** `time`
- **Memory limit per worker:** 128 MB
- **Master memory limit:** 64 MB
- **Max time:** 0 (unlimited)
- **Max jobs:** 0 (unlimited)
- **Nice value:** 0

### Production Overrides

In production, `supervisor-default` adds:
- `balanceMaxShift`: 1 (scale one worker at a time)
- `balanceCooldown`: 3 seconds between scaling decisions

### Job Retention

| Category         | Retention |
|------------------|-----------|
| Recent jobs      | 60 min    |
| Pending jobs     | 60 min    |
| Completed jobs   | 60 min    |
| Recent failed    | 7 days    |
| Failed jobs      | 7 days    |
| Monitored tags   | 7 days    |

### Long Wait Threshold

A `LongWaitDetected` event fires when the `redis:default` queue has jobs waiting longer than **60 seconds**.

### Dashboard Auth Gate

In non-local environments, access to the Horizon dashboard is restricted by a gate defined in `HorizonServiceProvider`. The gate checks the authenticated user's email against an allowlist:

```php
Gate::define('viewHorizon', function ($user = null) {
    return in_array(optional($user)->email, [
        // Add authorized email addresses here
    ]);
});
```

**Important:** Before deploying to production, add your email address to this array.

In `local` environments, the dashboard is accessible to everyone without authentication.

---

## 7. Scheduled Tasks

**Location:** `routes/console.php`

All scheduled tasks run in UTC and use `withoutOverlapping()` to prevent duplicate runs. Each task logs an error on failure.

| Command                                 | Schedule                      | Overlap Lock | Purpose                                              |
|-----------------------------------------|-------------------------------|--------------|------------------------------------------------------|
| `sync:anime --status=RELEASING`         | Every 6 hours                 | 120 min      | Keep currently airing anime data fresh               |
| `sync:anime --status=NOT_YET_RELEASED`  | Daily at 04:00 UTC            | 120 min      | Update upcoming anime (new announcements, date changes) |
| `sync:anime`                            | Weekly on Monday at 03:00 UTC | 120 min      | Incremental sync of all anime data                   |
| `sync:schedule`                         | Hourly                        | 55 min       | Refresh weekly airing schedule/timetable             |

### Failure Handling

Each task uses `onFailure()` to log an error message to the application log:

```php
->onFailure(function () {
    Log::error('Scheduled RELEASING anime sync failed');
});
```

### Running the Scheduler

- **Local (Herd):** `php artisan schedule:work` (runs in the foreground, checks every minute)
- **Docker:** The `scheduler` service runs `php artisan schedule:work` automatically
- **Production (Forge):** A system cron entry runs `php artisan schedule:run` every minute:
  ```
  * * * * * cd /home/forge/anitrack && php artisan schedule:run >> /dev/null 2>&1
  ```

---

## 8. Vite Configuration

**Location:** `vite.config.ts`

### Plugins

| Plugin               | Package                  | Purpose                                          |
|----------------------|--------------------------|--------------------------------------------------|
| Laravel Vite Plugin  | `laravel-vite-plugin`    | Integrates Vite with Laravel's asset pipeline    |
| Vue 3                | `@vitejs/plugin-vue`     | Vue 3 SFC compilation and HMR                   |
| Tailwind CSS v4      | `@tailwindcss/vite`      | Tailwind CSS processing via Vite plugin          |

### Entry Point

```
resources/js/app.ts
```

The Laravel Vite plugin is configured with `refresh: true`, which triggers a full page reload when Blade templates change.

### Path Aliases

| Alias      | Resolves To                             |
|------------|-----------------------------------------|
| `@`        | `resources/js`                          |
| `ziggy-js` | `vendor/tightenco/ziggy`               |

Usage in Vue/TypeScript files:
```typescript
import MyComponent from '@/Components/MyComponent.vue'
import { route } from 'ziggy-js'
```

### Vue Template Configuration

Asset URL transformation is configured to work with Vite's asset handling:
```javascript
template: {
    transformAssetUrls: {
        base: null,
        includeAbsolute: false,
    },
},
```

### Dev Server

| Setting          | Value       | Purpose                                         |
|------------------|-------------|--------------------------------------------------|
| `host`           | `0.0.0.0`  | Bind to all interfaces (required for Docker)     |
| `hmr.host`       | `localhost` | HMR WebSocket connects to localhost from browser |
| **Port**         | `5173`      | Default Vite port (mapped in Docker Compose)     |

The `watch.ignored` array excludes `storage/framework/views/**` to prevent unnecessary rebuilds when Laravel compiles Blade templates.

---

## 9. Production Deployment (Forge)

AniTrack uses **Laravel Forge** for production deployment. Docker is **not used in production** -- Forge manages the server directly.

### What Forge Manages

| Concern          | Forge Approach                                                      |
|------------------|---------------------------------------------------------------------|
| **Web server**   | Nginx configured by Forge, serving from the `public/` directory     |
| **PHP**          | PHP 8.4 FPM managed as a system service                            |
| **SSL**          | Let's Encrypt certificates, auto-renewed by Forge                  |
| **Queue worker** | Horizon runs as a daemon via Forge's queue worker management       |
| **Scheduler**    | Forge adds the cron entry for `schedule:run` automatically         |
| **Deployments**  | Push-to-deploy or manual deploy via Forge dashboard                |

### Key Differences: Docker vs. Forge

| Aspect              | Docker (Local)                        | Forge (Production)                    |
|---------------------|---------------------------------------|---------------------------------------|
| PHP runtime         | php:8.4-fpm container                 | System PHP 8.4 FPM                   |
| Nginx               | nginx:alpine container                | System Nginx managed by Forge        |
| MySQL               | mysql:8.4 container                   | Managed MySQL or external service    |
| Redis               | redis:alpine container                | Managed Redis or external service    |
| Vite                | node:22-alpine container (dev server) | `pnpm build` during deploy (no dev server) |
| Mail                | MailHog container                     | Real SMTP provider                   |
| Queue               | Horizon container                     | Horizon daemon via Forge             |
| Scheduler           | scheduler container                   | System cron via Forge                |
| `ext-pcntl`         | Available (Linux container)           | Available (Linux server)             |
| `--ignore-platform-reqs` | Used in container command        | Not needed (all extensions available) |

### Typical Forge Deploy Script

```bash
cd /home/forge/anitrack

git pull origin main

composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

pnpm install
pnpm build

php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

php artisan horizon:terminate
```

Forge automatically restarts the Horizon daemon after deployment.

### Production Environment Notes

- **No Docker:** The production server runs services natively, not in containers.
- **ext-pcntl:** Available on the Linux production server (unlike Windows local dev), so `--ignore-platform-reqs` is not needed.
- **Vite:** Only `pnpm build` runs during deployment to generate static assets. There is no Vite dev server in production.
- **Horizon auth:** Add your email to the allowlist in `HorizonServiceProvider@gate` before deploying.
- **Dark mode only:** No light theme -- the UI uses PrimeVue 4 with the Aura theme and `.dark` CSS selector.
