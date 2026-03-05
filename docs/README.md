# AniTrack Documentation

AniTrack is an anime tracking application built as a Laravel 12 + Inertia.js v2 monolith with a Vue 3 frontend.

## Table of Contents

| Document | Description |
|----------|-------------|
| [Architecture Overview](./architecture.md) | System design, tech stack, directory structure, request lifecycle, key decisions |
| [Data Pipeline](./data-pipeline.md) | AniList API integration, sync commands, jobs, persistence, DTOs, rate limiting |
| [Backend API & Models](./backend.md) | Routes, controllers, Eloquent models, resources, requests, middleware, services |
| [Frontend](./frontend.md) | Vue pages, components, composables, Pinia stores, TypeScript types, layouts |
| [Database Schema](./database.md) | Table schemas, relationships, indexes, constraints, migrations |
| [Infrastructure & Deployment](./infrastructure.md) | Docker Compose, Horizon, scheduler, environment config, local dev setup |

## Quick Reference

- **Local URL**: `http://localhost:8000` (Docker) or `http://anime-list.test` (Herd)
- **Vite Dev Server**: `http://localhost:5173`
- **Horizon Dashboard**: `http://localhost:8000/horizon`
- **Mailhog UI**: `http://localhost:8025`
- **Database**: MySQL 8.4 on port 3306 (`anitrack` database)
- **Redis**: Port 6379 (cache + queues)

## Key Commands

```bash
# Sync anime catalog (targeted - airing only)
php artisan sync:anime --status=RELEASING --watch

# Full catalog sync
php artisan sync:anime --full --watch

# Sync airing schedules
php artisan sync:schedule --watch

# Queue monitoring
php artisan horizon

# Docker (full stack)
docker compose up -d
```
