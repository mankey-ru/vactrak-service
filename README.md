# vactrak

Job vacancy tracker — **monorepo** with Nest API, Nuxt SSR web, and shared types.

## Layout

```text
apps/api          NestJS API (@vactrak/api)
apps/web          Nuxt 3 SSR UI (@vactrak/web)
packages/shared   Shared types/constants (@vactrak/shared)
```

## The goal

Many jobs get applicants immediately; job sites only offer daily notifications. This project notifies you **as soon as** a vacancy is posted, on top of a userscript (to avoid site auth / blocking issues).

## Supported sites

- [HeadHunter](https://hh.ru)
- [Habr Career](https://career.habr.com)

## Basic usage (client-side only)

1. Install [Tampermonkey](https://www.tampermonkey.net/) (or similar).
1. Install the [userscript](https://github.com/mankey-ru/userscripts#vactrak-vacancy-tracker).
1. Open supported job site and search with your exact conditions (note: HH supports [advanced](https://hh.ru/article/25295) [queries](https://hh.ru/article/1175))
1. On a search URL add:
   - `&use_vactrak=yes` to enable userscript
   - `&vactrak_search_key=YOUR_OPTIONAL_SEARCH_NAME` (optional) to have a convenient label when getting notifications. Important: use different keys for each search criteria set. E.g. `node` and `vue`.

The page reloads ~every 2 minutes and shows clickable system notifications for new vacancies.

## Full stack (API + optional web)

### Local

```bash
# Postgres
cp .env.example .env          # compose credentials
npm run db

# install (workspaces)
npm ci
npm run build:shared

# API — copy env and start (port 3000)
cp apps/api/.env.example apps/api/.env
# set POSTGRES_*, JWT_SECRET, TELEGRAM_*
npm run dev:api

# Web SSR (port 3001)
cp apps/web/.env.example apps/web/.env
# NUXT_PUBLIC_API_BASE=http://localhost:3000
npm run dev:web
```

### Database migrations (TypeORM)

Prefer **migrations** over `DB_SYNCHRONIZE` (keep synchronize `false` in prod).

```bash
# from monorepo root (uses apps/api/.env)
npm run migration:show    # pending / applied
npm run migration:run     # apply pending
npm run migration:revert  # undo last

# after entity changes (rename the generated file):
npm run migration:generate -w @vactrak/api
# or:
cd apps/api && npx ts-node -P tsconfig.typeorm.json -r tsconfig-paths/register \
  ./node_modules/typeorm/cli.js migration:generate \
  src/database/migrations/MyChange -d src/database/data-source.ts
```

On Render, set `DB_MIGRATIONS_RUN=true` so Nest applies pending migrations on boot (`DB_SYNCHRONIZE=false`).

Baseline migration: `apps/api/src/database/migrations/1730000000000-InitAuthAndVacancyOwner.ts`.

If the DB was already created with synchronize, `migration:run` still records the baseline (SQL is IF NOT EXISTS-safe). If TypeORM refuses because of drift, mark baseline applied only after verifying schema, or run SQL manually then `migration:run`.

### Auth (multi-user)

1. `POST /api/auth/telegram` — Telegram Login Widget payload → JWT.
2. Browser stores JWT in cookie `vactrak_token` (Nuxt SSR).
3. Userscript: create an API token via `POST /api/auth/tokens` (JWT), send `Authorization: Bearer vt_…` to `POST /api/vac`.
4. Vacancies are **row-owned** (`user_id`); statuses: `new` | `archived`.

### Deploy (Render + GitHub)

- **CI:** `.github/workflows/ci.yml` — parallel `api` and `web` jobs (after `shared`).
- **Render:** `render.yaml` defines:
  - `vactrak-api` — Node web service, root `apps/api`
  - `vactrak-web` — Node web service (Nuxt SSR), root `apps/web`

Point `NUXT_PUBLIC_API_BASE` at the API URL and `WEB_ORIGIN` at the web URL. Configure Telegram Login domain for the **web** host in BotFather.

Userscript:

```js
localStorage.VACTRAK_URL = 'https://YOUR_API_HOST'
// plus Authorization token when required by the userscript
```

## Scripts (root)

| Script | Purpose |
|--------|---------|
| `npm run dev:api` / `dev:web` | Local watch / Nuxt dev |
| `npm run build:api` / `build:web` | Production builds |
| `npm test` | API unit tests |
| `npm run db` | Docker Compose Postgres |
