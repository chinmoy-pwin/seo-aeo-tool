# System Architecture

## Pattern: monolith

### Architecture Diagram
```
[React SPA] --HTTP/SSE--> [Fastify API] --Prisma--> [Postgres]
                              |                  
                              +--BullMQ--> [Redis] <--consume-- [Workers]
                                                                  |
                                                                  +-> [Mocked integrations: Google/Bing Index, OpenAI, Gemini, Anthropic, WP REST]
                                                                  |
                                                                  +--pub/sub--> [Fastify SSE EventBus] -> Clients
```

### Data Flow
1. Step 1: Client selects workspace; frontend attaches x-workspace-id header on every API call
2. Step 2: Fastify route validates input with zod and resolves workspace context plugin
3. Step 3: Controller calls service; service checks QuotaService and writes via repositories (Prisma) with workspaceId filter
4. Step 4: For long-running ops (indexing, AI monitoring, audit, content, publish), service enqueues BullMQ jobs
5. Step 5: Workers consume jobs, call mocked integration clients, persist results, and publish status events to Redis pub/sub
6. Step 6: API Server subscribes and broadcasts via SSE to /api/realtime/jobs subscribers
7. Step 7: Frontend react-query invalidates queries on SSE events to refresh dashboards in realtime

## API contracts

**Base path**: `/api`  
**Version**: 1.0

| Method | Path | Summary | Auth |
|--------|------|---------|------|
| GET | `/health` | Health check | none |
| GET | `/workspaces` | List all workspaces | none |
| POST | `/workspaces` | Create workspace | none |
| GET | `/workspaces/:id` | Get workspace | none |
| PUT | `/workspaces/:id` | Update workspace | none |
| DELETE | `/workspaces/:id` | Delete workspace | none |
| POST | `/workspaces/:id/rotate-api-key` | Rotate workspace API key | none |
| GET | `/sites` | List sites | workspace-header |
| POST | `/sites` | Create site | workspace-header |
| GET | `/sites/:id` | Get site | workspace-header |
| PUT | `/sites/:id` | Update site | workspace-header |
| DELETE | `/sites/:id` | Delete site | workspace-header |
| GET | `/index-jobs` | List indexing jobs | workspace-header |
| POST | `/index-jobs` | Create indexing job | workspace-header |
| GET | `/index-jobs/:id` | Get index job with URLs | workspace-header |
| DELETE | `/index-jobs/:id` | Cancel/delete job | workspace-header |
| POST | `/index-jobs/:id/retry` | Retry failed URLs in job | workspace-header |
| POST | `/webhooks/cms/:apiKey` | CMS webhook to push URLs for indexing (API-key based) | api-key |
| GET | `/brand-prompts` | List brand monitoring prompts | workspace-header |
| POST | `/brand-prompts` | Create prompt | workspace-header |
| PUT | `/brand-prompts/:id` | Update prompt | workspace-header |
| DELETE | `/brand-prompts/:id` | Delete prompt | workspace-header |
| POST | `/brand-prompts/:id/run` | Trigger prompt run across engines | workspace-header |
| GET | `/brand-prompts/:id/results` | List mention results | workspace-header |
| GET | `/audits` | List audit reports | workspace-header |
| POST | `/audits` | Trigger audit | workspace-header |
| GET | `/audits/:id` | Get audit detail | workspace-header |
| GET | `/keywords` | List keywords | workspace-header |
| POST | `/keywords` | Add keyword | workspace-header |
| DELETE | `/keywords/:id` | Remove keyword | workspace-header |
| GET | `/backlinks` | List backlinks | workspace-header |
| GET | `/content-drafts` | List content drafts | workspace-header |
| POST | `/content-drafts/generate` | Generate new content draft (mocked AI) | workspace-header |
| GET | `/content-drafts/:id` | Get draft | workspace-header |
| PUT | `/content-drafts/:id` | Update draft | workspace-header |
| DELETE | `/content-drafts/:id` | Delete draft | workspace-header |
| POST | `/content-drafts/:id/publish` | Publish draft to WordPress | workspace-header |
| GET | `/wordpress-connections` | List WP connections | workspace-header |
| POST | `/wordpress-connections` | Add WP connection | workspace-header |
| DELETE | `/wordpress-connections/:id` | Remove WP connection | workspace-header |
| GET | `/alerts` | List alerts | workspace-header |
| PUT | `/alerts/:id/read` | Mark alert read | workspace-header |
| GET | `/scheduled-reports` | List scheduled reports | workspace-header |
| POST | `/scheduled-reports` | Create scheduled report | workspace-header |
| DELETE | `/scheduled-reports/:id` | Delete scheduled report | workspace-header |
| GET | `/dashboard/summary` | Dashboard aggregated metrics | workspace-header |
| GET | `/quota` | Get current quota usage | workspace-header |
| GET | `/realtime/jobs` | SSE stream for index job status updates | workspace-header |

### Endpoint details

#### `GET /health`

*Health check*

**Responses**

- **200**: { status: 'ok', uptime: number }

#### `GET /workspaces`

*List all workspaces*

**Responses**

- **200**: { workspaces: Workspace[] }

#### `POST /workspaces`

*Create workspace*

**Request body**

```json
{
  "description": "{ name: string, slug: string, plan: 'free'|'pro'|'agency' }"
}
```

**Responses**

- **201**: { workspace }
- **400**: VALIDATION_ERROR

#### `GET /workspaces/:id`

*Get workspace*

**Responses**

- **200**: { workspace }
- **404**: NOT_FOUND

#### `PUT /workspaces/:id`

*Update workspace*

**Request body**

```json
{
  "description": "{ name?, whiteLabelEnabled?, brandingLogoUrl?, plan? }"
}
```

**Responses**

- **200**: { workspace }

#### `DELETE /workspaces/:id`

*Delete workspace*

**Responses**

- **204**: no content

#### `POST /workspaces/:id/rotate-api-key`

*Rotate workspace API key*

**Responses**

- **200**: { apiKey: string }

#### `GET /sites`

*List sites*

**Query parameters**

| Name | Type | Required |
|------|------|----------|
| x-workspace-id | string | yes |

**Responses**

- **200**: { sites: Site[] }

#### `POST /sites`

*Create site*

**Request body**

```json
{
  "description": "{ domain: string, sitemapUrl?: string }"
}
```

**Responses**

- **201**: { site }

#### `GET /sites/:id`

*Get site*

**Responses**

- **200**: { site }

#### `PUT /sites/:id`

*Update site*

**Request body**

```json
{
  "description": "{ domain?, sitemapUrl?, gscConnected? }"
}
```

**Responses**

- **200**: { site }

#### `DELETE /sites/:id`

*Delete site*

**Responses**

- **204**: no content

#### `GET /index-jobs`

*List indexing jobs*

**Query parameters**

| Name | Type | Required |
|------|------|----------|
| siteId | string | no |
| status | string | no |

**Responses**

- **200**: { jobs: IndexJob[] }

#### `POST /index-jobs`

*Create indexing job*

**Request body**

```json
{
  "description": "{ siteId, source: 'manual'|'sitemap'|'cms_plugin'|'api'|'gsc', engine: 'google'|'bing'|'both', urls?: string[], sitemapUrl?: string }"
}
```

**Responses**

- **202**: { job }
- **429**: QUOTA_EXCEEDED

#### `GET /index-jobs/:id`

*Get index job with URLs*

**Responses**

- **200**: { job, urls }

#### `DELETE /index-jobs/:id`

*Cancel/delete job*

**Responses**

- **204**: no content

#### `POST /index-jobs/:id/retry`

*Retry failed URLs in job*

**Responses**

- **202**: { job }

#### `POST /webhooks/cms/:apiKey`

*CMS webhook to push URLs for indexing (API-key based)*

**Request body**

```json
{
  "description": "{ siteId, urls: string[], engine?: 'google'|'bing'|'both' }"
}
```

**Responses**

- **202**: { jobId }

#### `GET /brand-prompts`

*List brand monitoring prompts*

**Responses**

- **200**: { prompts }

#### `POST /brand-prompts`

*Create prompt*

**Request body**

```json
{
  "description": "{ promptText, brandName, engines: string[], frequency: 'daily'|'weekly' }"
}
```

**Responses**

- **201**: { prompt }

#### `PUT /brand-prompts/:id`

*Update prompt*

**Responses**

- **200**: { prompt }

#### `DELETE /brand-prompts/:id`

*Delete prompt*

**Responses**

- **204**: no content

#### `POST /brand-prompts/:id/run`

*Trigger prompt run across engines*

**Responses**

- **202**: { queued: true }
- **429**: QUOTA_EXCEEDED

#### `GET /brand-prompts/:id/results`

*List mention results*

**Query parameters**

| Name | Type | Required |
|------|------|----------|
| engine | string | no |
| from | string | no |
| to | string | no |

**Responses**

- **200**: { results }

#### `GET /audits`

*List audit reports*

**Query parameters**

| Name | Type | Required |
|------|------|----------|
| siteId | string | no |

**Responses**

- **200**: { audits }

#### `POST /audits`

*Trigger audit*

**Request body**

```json
{
  "description": "{ siteId }"
}
```

**Responses**

- **202**: { audit }

#### `GET /audits/:id`

*Get audit detail*

**Responses**

- **200**: { audit }

#### `GET /keywords`

*List keywords*

**Query parameters**

| Name | Type | Required |
|------|------|----------|
| siteId | string | no |

**Responses**

- **200**: { keywords }

#### `POST /keywords`

*Add keyword*

**Request body**

```json
{
  "description": "{ siteId, term, country? }"
}
```

**Responses**

- **201**: { keyword }

#### `DELETE /keywords/:id`

*Remove keyword*

**Responses**

- **204**: no content

#### `GET /backlinks`

*List backlinks*

**Query parameters**

| Name | Type | Required |
|------|------|----------|
| siteId | string | yes |

**Responses**

- **200**: { backlinks }

#### `GET /content-drafts`

*List content drafts*

**Query parameters**

| Name | Type | Required |
|------|------|----------|
| status | string | no |

**Responses**

- **200**: { drafts }

#### `POST /content-drafts/generate`

*Generate new content draft (mocked AI)*

**Request body**

```json
{
  "description": "{ topic, language, tone?, wordCount? }"
}
```

**Responses**

- **201**: { draft }
- **429**: QUOTA_EXCEEDED

#### `GET /content-drafts/:id`

*Get draft*

**Responses**

- **200**: { draft }

#### `PUT /content-drafts/:id`

*Update draft*

**Responses**

- **200**: { draft }

#### `DELETE /content-drafts/:id`

*Delete draft*

**Responses**

- **204**: no content

#### `POST /content-drafts/:id/publish`

*Publish draft to WordPress*

**Request body**

```json
{
  "description": "{ connectionId, status: 'draft'|'publish' }"
}
```

**Responses**

- **202**: { publishTarget }

#### `GET /wordpress-connections`

*List WP connections*

**Responses**

- **200**: { connections }

#### `POST /wordpress-connections`

*Add WP connection*

**Request body**

```json
{
  "description": "{ siteUrl, username, appPassword }"
}
```

**Responses**

- **201**: { connection }

#### `DELETE /wordpress-connections/:id`

*Remove WP connection*

**Responses**

- **204**: no content

#### `GET /alerts`

*List alerts*

**Query parameters**

| Name | Type | Required |
|------|------|----------|
| read | boolean | no |

**Responses**

- **200**: { alerts }

#### `PUT /alerts/:id/read`

*Mark alert read*

**Responses**

- **200**: { alert }

#### `GET /scheduled-reports`

*List scheduled reports*

**Responses**

- **200**: { reports }

#### `POST /scheduled-reports`

*Create scheduled report*

**Request body**

```json
{
  "description": "{ recipients: string[], frequency: 'weekly'|'monthly', sections: string[] }"
}
```

**Responses**

- **201**: { report }

#### `DELETE /scheduled-reports/:id`

*Delete scheduled report*

**Responses**

- **204**: no content

#### `GET /dashboard/summary`

*Dashboard aggregated metrics*

**Responses**

- **200**: { indexing, aiVisibility, audits, keywords, quota }

#### `GET /quota`

*Get current quota usage*

**Responses**

- **200**: { plan, usage, limits }

#### `GET /realtime/jobs`

*SSE stream for index job status updates*

**Responses**

- **200**: text/event-stream of { jobId, status, successCount, failedCount }

## Database overview

| Table | Description |
|-------|-------------|
| `workspaces` | Tenant container |
| `sites` | Website managed in workspace |
| `index_jobs` | Bulk indexing job |
| `index_urls` | Single URL within an index job |
| `brand_prompts` | AI monitoring prompt |
| `brand_mention_results` | Result of a single AI engine query |
| `audit_reports` | AI readiness + technical SEO audit |
| `keywords` | Tracked keyword |
| `backlinks` | Backlink referencing a site |
| `content_drafts` | AI-generated content draft |
| `wordpress_connections` | WordPress publishing connection |
| `publish_targets` | Record of publishing a draft to a WP connection |
| `alerts` | Workspace alert log |
| `scheduled_reports` | Email report schedules |
| `quota_usage` | Per-workspace per-period usage counters |


## Infrastructure Components

| Component | Type | Technology | Purpose |
|-----------|------|------------|----------|
| API Server | api | Fastify + TypeScript | Serves REST API, SSE stream, webhooks |
| PostgreSQL (Railway) | database | PostgreSQL 15 | Primary relational store for all entities (Railway-managed) |
| Redis (Railway) | cache | Redis | BullMQ broker and lightweight cache; in-process fallback when REDIS_URL unset |
| BullMQ Workers | queue | BullMQ on Redis | Process index submissions, AI prompt runs, audits, content generation, publishing, scheduled reports |
| Crawl Artifact Storage | storage | PostgreSQL (Railway) | Audit artifacts and generated content stored as TEXT/JSONB columns (no external object storage in V1) |
| Frontend | api | React + Vite + Tailwind (served as static build) | SPA UI consuming the REST API |


---

## Project structure
This document is generated in the **Architecture** stage. **All application source** lives under the `app/` root folder at the repository level.

**Summary:** Monorepo-style layout with React+Vite frontend and Fastify+TypeScript backend under app/, with versioned SQL migrations in db/.

## Directory tree

```text
app/
├── app/frontend/
├── app/frontend/src/pages/
├── app/frontend/src/components/
├── app/frontend/src/hooks/
├── app/frontend/src/lib/
├── app/backend/
├── app/backend/src/routes/
├── app/backend/src/services/
├── app/backend/src/repositories/
├── app/backend/src/workers/
├── app/backend/src/queues/
├── app/backend/src/integrations/
├── app/backend/src/plugins/
├── app/backend/src/lib/
├── app/backend/prisma/
├── db/migrations/
├── db/seeds/
├── .nagent/
│   ├── nagent.yml
│   └── summary.txt
└── docs/
    └── Architecture.md
```

## Path reference

| Path | Purpose |
|------|---------|
| `app/frontend` | React (Vite) + Tailwind SPA with react-query |
| `app/frontend/src/pages` | Route-level pages (Dashboard, Indexing, AI Monitoring, Audits, Content, Settings) |
| `app/frontend/src/components` | Reusable UI components |
| `app/frontend/src/hooks` | react-query hooks and custom hooks |
| `app/frontend/src/lib` | API client, workspace context, utilities |
| `app/backend` | Fastify + TypeScript API server (layered architecture) |
| `app/backend/src/routes` | Fastify route handlers (controllers) |
| `app/backend/src/services` | Business logic services |
| `app/backend/src/repositories` | Data access layer (Prisma) |
| `app/backend/src/workers` | BullMQ workers (indexing, monitoring, audit, content) |
| `app/backend/src/queues` | BullMQ queue definitions and producers |
| `app/backend/src/integrations` | Mocked external clients (Google/Bing index, OpenAI, Gemini, Anthropic, WP) |
| `app/backend/src/plugins` | Fastify plugins (workspace context, errors, sse) |
| `app/backend/src/lib` | Shared utilities (quota, crypto, logger) |
| `app/backend/prisma` | Prisma schema (mirrors SQL migrations) |
| `db/migrations` | Ordered SQL migrations (NNN_name.sql) |
| `db/seeds` | Seed data scripts |
| `.nagent/nagent.yml` | Nagent platform blueprint (stack + paths) |
| `.nagent/summary.txt` | Buildcraft run summary + request excerpt |
| `architecture.md` | Full architecture & API contracts |

## Database layout (postgresql)

- SQL: migrations under `db/migrations/` (e.g. `001_initial.sql`); seeds under `db/seeds/`.

---

## Architecture history

### 2026-06-23T07:47:39.689Z

## Pattern: monolith

### Architecture Diagram
```
[React SPA] --HTTP--> [Express API] --SQL--> [PostgreSQL]
                              |
                              +--enqueue--> [BullMQ/Redis] --process--> [Workers] --> [PostgreSQL]
```

### Data Flow
1. 1: User opens SPA, which calls /api/dashboard/summary with x-workspace-id header
2. 2: API aggregates per-workspace stats via Prisma and returns JSON
3. 3: Write endpoints (e.g. create index job) persist a record and enqueue background work
4. 4: Workers process jobs, update DB rows, and emit alerts/quota updates
5. 5: SPA refetches list/detail endpoints to show updated state

## API contracts

**Base path**: `/api`  
**Version**: 1.0

| Method | Path | Summary | Auth |
|--------|------|---------|------|
| GET | `/health` | Liveness probe | none |
| GET | `/workspaces` | List workspaces | none |
| GET | `/sites` | List sites for workspace | workspace |
| GET | `/index-jobs` | List indexing jobs | workspace |
| GET | `/audits` | List audit reports | workspace |
| GET | `/keywords` | List tracked keywords | workspace |
| GET | `/backlinks` | List backlinks | workspace |
| GET | `/content-drafts` | List content drafts | workspace |
| GET | `/brand-prompts` | List brand monitor prompts | workspace |
| GET | `/wordpress-connections` | List WP connections | workspace |
| POST | `/wordpress-connections` | Create WP connection | workspace |
| DELETE | `/wordpress-connections/:id` | Remove WP connection | workspace |
| GET | `/alerts` | List alerts | workspace |
| GET | `/scheduled-reports` | List scheduled reports | workspace |
| GET | `/dashboard/summary` | Aggregated dashboard metrics | workspace |

### Endpoint details

#### `GET /health`

*Liveness probe*

**Responses**

- **200**: { status: 'ok' }

#### `GET /workspaces`

*List workspaces*

**Responses**

- **200**: { workspaces: [...] }

#### `GET /sites`

*List sites for workspace*

**Responses**

- **200**: { sites: [...] }

#### `GET /index-jobs`

*List indexing jobs*

**Responses**

- **200**: { jobs: [...] }

#### `GET /audits`

*List audit reports*

**Responses**

- **200**: { audits: [...] }

#### `GET /keywords`

*List tracked keywords*

**Responses**

- **200**: { keywords: [...] }

#### `GET /backlinks`

*List backlinks*

**Responses**

- **200**: { backlinks: [...] }

#### `GET /content-drafts`

*List content drafts*

**Responses**

- **200**: { drafts: [...] }

#### `GET /brand-prompts`

*List brand monitor prompts*

**Responses**

- **200**: { prompts: [...] }

#### `GET /wordpress-connections`

*List WP connections*

**Responses**

- **200**: { connections: [...] }

#### `POST /wordpress-connections`

*Create WP connection*

**Request body**

```json
{
  "description": "{ siteUrl, username, appPassword }"
}
```

**Responses**

- **201**: { connection }

#### `DELETE /wordpress-connections/:id`

*Remove WP connection*

**Responses**

- **204**: No content

#### `GET /alerts`

*List alerts*

**Responses**

- **200**: { alerts: [...] }

#### `GET /scheduled-reports`

*List scheduled reports*

**Responses**

- **200**: { reports: [...] }

#### `GET /dashboard/summary`

*Aggregated dashboard metrics*

**Responses**

- **200**: { summary }


## Infrastructure Components

| Component | Type | Technology | Purpose |
|-----------|------|------------|----------|
| PostgreSQL (Railway) | database | PostgreSQL | Primary relational store for all workspace data |
| Redis (Railway, optional) | cache | Redis | BullMQ broker + cache; in-process fallback when unset |
| BullMQ Queues | queue | BullMQ | Async jobs: indexing, audits, AI monitoring, publishing, reports |
| Express API | api | Express + TypeScript | REST API for the React SPA |
| Mock Object Storage | mock | filesystem/none | Audit artifacts referenced via URL strings only (no real cloud storage in V1) |


---

## Project structure
This document is generated in the **Architecture** stage. **All application source** lives under the `app/` root folder at the repository level.

**Summary:** Monorepo with React frontend and Express backend under app/, plus versioned db/ scripts for Postgres migrations and seeds.

## Directory tree

```text
app/
├── app/frontend/
├── app/backend/
├── db/migrations/
├── db/seeds/
├── .nagent/
│   ├── nagent.yml
│   └── summary.txt
└── docs/
    └── Architecture.md
```

## Path reference

| Path | Purpose |
|------|---------|
| `app/frontend` | React (Vite) SPA UI |
| `app/backend` | Express + TypeScript API server with Prisma |
| `db/migrations` | Ordered PostgreSQL migration files |
| `db/seeds` | Seed / demo fixture data |
| `.nagent/nagent.yml` | Nagent platform blueprint (stack + paths) |
| `.nagent/summary.txt` | Buildcraft run summary + request excerpt |
| `architecture.md` | Full architecture & API contracts |

## Database layout (postgresql)

- SQL: migrations under `db/migrations/` (e.g. `001_initial.sql`); seeds under `db/seeds/`.