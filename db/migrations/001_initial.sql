-- 001_initial.sql — Indexly initial schema (PostgreSQL)
-- Run with: psql $DATABASE_URL < db/migrations/001_initial.sql
-- Mirrors backend/prisma/schema.prisma

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================================
-- workspaces
-- =====================================================================
CREATE TABLE IF NOT EXISTS workspaces (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                VARCHAR(255) NOT NULL,
  slug                VARCHAR(120) NOT NULL UNIQUE,
  plan                VARCHAR(20)  NOT NULL DEFAULT 'free',
  white_label_enabled BOOLEAN      NOT NULL DEFAULT false,
  branding_logo_url   TEXT,
  api_key             VARCHAR(64)  NOT NULL UNIQUE,
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_workspaces_api_key ON workspaces (api_key);

-- =====================================================================
-- sites
-- =====================================================================
CREATE TABLE IF NOT EXISTS sites (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID NOT NULL REFERENCES workspaces (id) ON DELETE CASCADE,
  domain        VARCHAR(255) NOT NULL,
  sitemap_url   TEXT,
  gsc_connected BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (workspace_id, domain)
);
CREATE INDEX IF NOT EXISTS idx_sites_workspace_id ON sites (workspace_id);

-- =====================================================================
-- index_jobs
-- =====================================================================
CREATE TABLE IF NOT EXISTS index_jobs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID NOT NULL REFERENCES workspaces (id) ON DELETE CASCADE,
  site_id       UUID NOT NULL REFERENCES sites (id) ON DELETE CASCADE,
  source        VARCHAR(30) NOT NULL,
  engine        VARCHAR(20) NOT NULL,
  status        VARCHAR(20) NOT NULL DEFAULT 'pending',
  total_urls    INTEGER NOT NULL DEFAULT 0,
  success_count INTEGER NOT NULL DEFAULT 0,
  failed_count  INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at  TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_index_jobs_workspace_id ON index_jobs (workspace_id);
CREATE INDEX IF NOT EXISTS idx_index_jobs_site_id ON index_jobs (site_id);
CREATE INDEX IF NOT EXISTS idx_index_jobs_status ON index_jobs (status);

-- =====================================================================
-- index_urls
-- =====================================================================
CREATE TABLE IF NOT EXISTS index_urls (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id          UUID NOT NULL REFERENCES index_jobs (id) ON DELETE CASCADE,
  url             TEXT NOT NULL,
  status          VARCHAR(20) NOT NULL DEFAULT 'queued',
  engine_response JSONB,
  submitted_at    TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_index_urls_job_id ON index_urls (job_id);
CREATE INDEX IF NOT EXISTS idx_index_urls_status ON index_urls (status);

-- =====================================================================
-- brand_prompts
-- =====================================================================
CREATE TABLE IF NOT EXISTS brand_prompts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces (id) ON DELETE CASCADE,
  prompt_text  TEXT NOT NULL,
  brand_name   VARCHAR(255) NOT NULL,
  engines      VARCHAR(120) NOT NULL,
  frequency    VARCHAR(20) NOT NULL DEFAULT 'weekly',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_brand_prompts_workspace_id ON brand_prompts (workspace_id);

-- =====================================================================
-- brand_mention_results
-- =====================================================================
CREATE TABLE IF NOT EXISTS brand_mention_results (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id     UUID NOT NULL REFERENCES brand_prompts (id) ON DELETE CASCADE,
  engine        VARCHAR(30) NOT NULL,
  mentioned     BOOLEAN NOT NULL DEFAULT false,
  sentiment     VARCHAR(20),
  citation_url  TEXT,
  response_text TEXT,
  run_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_brand_mention_results_prompt_id ON brand_mention_results (prompt_id);
CREATE INDEX IF NOT EXISTS idx_brand_mention_results_run_at ON brand_mention_results (run_at);

-- =====================================================================
-- audit_reports
-- =====================================================================
CREATE TABLE IF NOT EXISTS audit_reports (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id       UUID NOT NULL REFERENCES workspaces (id) ON DELETE CASCADE,
  site_id            UUID NOT NULL REFERENCES sites (id) ON DELETE CASCADE,
  status             VARCHAR(20) NOT NULL DEFAULT 'pending',
  ai_readiness_score INTEGER,
  technical_score    INTEGER,
  issues             JSONB,
  artifact_url       TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_reports_workspace_id ON audit_reports (workspace_id);
CREATE INDEX IF NOT EXISTS idx_audit_reports_site_id ON audit_reports (site_id);

-- =====================================================================
-- keywords
-- =====================================================================
CREATE TABLE IF NOT EXISTS keywords (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID NOT NULL REFERENCES workspaces (id) ON DELETE CASCADE,
  site_id       UUID NOT NULL REFERENCES sites (id) ON DELETE CASCADE,
  term          VARCHAR(255) NOT NULL,
  country       VARCHAR(8) DEFAULT 'US',
  current_rank  INTEGER,
  previous_rank INTEGER,
  checked_at    TIMESTAMPTZ,
  UNIQUE (site_id, term, country)
);
CREATE INDEX IF NOT EXISTS idx_keywords_workspace_id ON keywords (workspace_id);

-- =====================================================================
-- backlinks
-- =====================================================================
CREATE TABLE IF NOT EXISTS backlinks (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id          UUID NOT NULL REFERENCES sites (id) ON DELETE CASCADE,
  source_url       TEXT NOT NULL,
  target_url       TEXT NOT NULL,
  anchor_text      TEXT,
  domain_authority INTEGER,
  discovered_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_backlinks_site_id ON backlinks (site_id);

-- =====================================================================
-- content_drafts
-- =====================================================================
CREATE TABLE IF NOT EXISTS content_drafts (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id       UUID NOT NULL REFERENCES workspaces (id) ON DELETE CASCADE,
  title              VARCHAR(500) NOT NULL,
  language           VARCHAR(10) NOT NULL DEFAULT 'en',
  topic              TEXT,
  body               TEXT NOT NULL,
  status             VARCHAR(20) NOT NULL DEFAULT 'draft',
  ai_detection_score INTEGER,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_content_drafts_workspace_id ON content_drafts (workspace_id);
CREATE INDEX IF NOT EXISTS idx_content_drafts_status ON content_drafts (status);

-- =====================================================================
-- wordpress_connections
-- =====================================================================
CREATE TABLE IF NOT EXISTS wordpress_connections (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id     UUID NOT NULL REFERENCES workspaces (id) ON DELETE CASCADE,
  site_url         TEXT NOT NULL,
  username         VARCHAR(255) NOT NULL,
  app_password_enc TEXT NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_wordpress_connections_workspace_id ON wordpress_connections (workspace_id);

-- =====================================================================
-- publish_targets
-- =====================================================================
CREATE TABLE IF NOT EXISTS publish_targets (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id       UUID NOT NULL REFERENCES content_drafts (id) ON DELETE CASCADE,
  connection_id  UUID NOT NULL REFERENCES wordpress_connections (id) ON DELETE CASCADE,
  remote_post_id VARCHAR(120),
  status         VARCHAR(20) NOT NULL DEFAULT 'pending',
  published_at   TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_publish_targets_draft_id ON publish_targets (draft_id);

-- =====================================================================
-- alerts
-- =====================================================================
CREATE TABLE IF NOT EXISTS alerts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces (id) ON DELETE CASCADE,
  type         VARCHAR(40) NOT NULL,
  threshold    JSONB,
  message      TEXT,
  triggered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read         BOOLEAN NOT NULL DEFAULT false
);
CREATE INDEX IF NOT EXISTS idx_alerts_workspace_id ON alerts (workspace_id);
CREATE INDEX IF NOT EXISTS idx_alerts_workspace_read ON alerts (workspace_id, read);

-- =====================================================================
-- scheduled_reports
-- =====================================================================
CREATE TABLE IF NOT EXISTS scheduled_reports (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces (id) ON DELETE CASCADE,
  recipients   TEXT NOT NULL,
  frequency    VARCHAR(20) NOT NULL,
  sections     JSONB NOT NULL,
  last_sent_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_scheduled_reports_workspace_id ON scheduled_reports (workspace_id);

-- =====================================================================
-- quota_usage
-- =====================================================================
CREATE TABLE IF NOT EXISTS quota_usage (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id      UUID NOT NULL REFERENCES workspaces (id) ON DELETE CASCADE,
  period            VARCHAR(7) NOT NULL,
  urls_indexed      INTEGER NOT NULL DEFAULT 0,
  prompts_run       INTEGER NOT NULL DEFAULT 0,
  content_generated INTEGER NOT NULL DEFAULT 0,
  UNIQUE (workspace_id, period)
);