# Product Requirements Document

## Overview
A multi-tenant SEO and AI visibility platform (Indexly-like) that helps SaaS, B2B, and e-commerce brands accelerate page indexing on Google/Bing, monitor brand mentions across AI engines (ChatGPT, Gemini, Claude, Perplexity), run AI-readiness and technical SEO audits, track keywords and backlinks, and generate/publish multilingual content to WordPress. Built with workspace-based multitenancy, tiered quotas, BullMQ job processing, and dashboard reporting.

## Goals
- Enable rapid URL indexing via Indexing APIs, sitemap parsing, and GSC connection
- Track brand visibility across major AI chat engines with prompt-based monitoring
- Provide actionable AI-readiness and technical SEO audits
- Generate human-like multilingual content and publish to WordPress
- Support workspace-based collaboration with tiered usage quotas
- Deliver dashboards, scheduled email reports, alerts, white-label, and API access

## User Stories
- As a **SEO manager**, I want **to bulk-submit URLs for indexing**, so that **new pages appear in Google/Bing within hours**
- As a **marketing lead**, I want **to monitor whether ChatGPT/Gemini/Claude mention my brand**, so that **I can track AI visibility**
- As a **growth engineer**, I want **to upload a sitemap and auto-index all URLs**, so that **I save manual GSC work**
- As a **content marketer**, I want **to generate multilingual articles and publish to WordPress**, so that **I scale content production**
- As a **agency owner**, I want **white-label reports and workspaces per client**, so that **I serve multiple brands**
- As a **technical SEO**, I want **AI-readiness and technical audits with issues list**, so that **I prioritize fixes**
- As a **ops lead**, I want **real-time job status for indexing batches**, so that **I can monitor progress**
- As a **admin**, I want **tiered quotas per workspace**, so that **usage is controlled by plan**

## Features
### Workspace Management (P0)
Create, switch, and manage workspaces; shared-DB row-level isolation via workspaceId.

### Auto & Bulk Indexing (P0)
Submit single URLs or bulk lists to Google/Bing Indexing APIs; queue via BullMQ; track status per URL.

### Sitemap Ingestion (P0)
Parse sitemap.xml and enqueue all URLs for indexing.

### GSC Connect (P1)
Connect Google Search Console for property verification and URL submission.

### CMS Plugin/API Indexing (P1)
Webhook/API endpoint and CMS plugin to push new URLs automatically.

### AI Brand Monitoring (P0)
Define prompts/keywords; periodically query ChatGPT, Gemini, Claude; detect brand mentions, sentiment, citations.

### AI Readiness & Technical SEO Audit (P0)
Crawl site; produce score, issues, recommendations for AI/SEO readiness.

### Keyword Monitoring (P1)
Track rankings for target keywords over time.

### Backlink Tracking (P2)
List and monitor backlinks per domain.

### Multilingual Content Generation (P0)
Generate AI-detection-resistant content in multiple languages.

### WordPress Publishing (P0)
Connect WordPress sites and publish generated content as draft/published posts.

### Dashboards (P0)
Workspace dashboard summarizing indexing, AI visibility, audit scores, keywords.

### Scheduled Email Reports (P1)
Configure weekly/monthly emailed reports.

### Alerts (P1)
Trigger alerts on ranking drops, brand mention changes, indexing failures.

### White-Label Reports (P2)
Customize branding on reports for agency use.

### API Access (P1)
Public REST API with workspace API keys.

### Tiered Quota Billing (P0)
Plans (Free/Pro/Agency) with quotas on URLs, prompts, content generations.

### Realtime Job Updates (P1)
WebSocket/SSE for live job/index status updates.

## Non-Functional Requirements
- Multi-tenant data isolation by workspaceId on every query
- Horizontal scaling of BullMQ workers
- P95 API latency < 400ms for CRUD
- Postgres for relational data; S3-compatible storage for crawl artifacts and generated content
- Dockerized deployment with docker-compose
- Structured error responses with codes
- Standard testing: unit + integration

## Assumptions
- No end-user authentication required in v1 per request; workspaces accessed via workspace selector + API keys for programmatic use
- External APIs (Google Indexing, Bing, OpenAI, Gemini, Anthropic) are mocked/stubbed at integration boundaries
- WordPress publishing uses WP REST API with app passwords stored per connection
- Shared DB with row-level workspaceId filtering is sufficient isolation

## Constraints
- Stack fixed: React + Tailwind frontend, Fastify backend, PostgreSQL, BullMQ, Docker
- REST API design with layered backend architecture
- react-query for client state

---

## Changelog

### v7 — 2026-06-23T09:46:19.755Z

- **Type:** bug fix
- **Areas:** frontend

Removed the duplicated entries from the Header's navigation array so the top bar now renders a single row of links instead of two stacked rows that looked like repeated headers.

### v6 — 2026-06-23T09:41:47.145Z

- **Type:** bug fix
- **Areas:** frontend

Fixed an unresponsive "New Indexing Job" button on the Indexing page so that clicking it now correctly opens the job creation modal.

### v5 — 2026-06-23T08:09:25.960Z

- **Type:** frontend change
- **Areas:** frontend

Added a polished public landing page at `/` featuring a hero, product features, how-it-works section, social proof, and a CTA into the app, and moved the authenticated experience under `/dashboard` so the marketing page renders cleanly without the internal header and navigation.

### v4 — 2026-06-23T08:00:42.441Z

- **Type:** backend change
- **Areas:** backend, docs

Expanded the demo seed data to populate multiple workspaces, sites, index jobs, audits, keywords, backlinks, content drafts, alerts, AI monitoring prompts, WordPress connections, and scheduled reports with realistic values and varied timestamps, so every page now showcases believable content for external demos.

### v3 — 2026-06-22T10:49:17.053Z

- **Type:** bug fix
- **Areas:** frontend

Fixed a regression where routed pages appeared blank after the sidebar redesign by switching the app shell to a horizontal flex layout, so the sidebar and main content now render side-by-side instead of stacked.

### v2 — 2026-06-22T10:39:47.157Z

- **Type:** bug fix
- **Areas:** frontend

Fixed the non-functional "Add Connection" button on the Integrations page by wiring it to open a modal form that submits to the WordPress connections API and refreshes the list on success.

### v1 — 2026-06-19T12:24:17.101Z

- **Type:** initial build
- **Areas:** frontend, backend, docs

Launched the initial release of an SEO and AI visibility platform that helps SaaS, B2B, and e-commerce brands get pages indexed on Google and Bing within hours via Indexing APIs, while monitoring brand mentions across LLMs like ChatGPT, Gemini, and Perplexity.