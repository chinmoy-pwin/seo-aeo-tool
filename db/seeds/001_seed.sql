-- 001_seed.sql -- Expanded demo seed data for Indexly
-- Idempotent: uses ON CONFLICT DO NOTHING where possible.

BEGIN;

-- =====================================================================
-- WORKSPACES (3 realistic demo orgs)
-- =====================================================================
INSERT INTO workspaces (id, name, slug, plan, white_label_enabled, branding_logo_url, api_key, created_at, updated_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Acme Marketing', 'acme-marketing', 'pro',    false, NULL, 'demo_api_key_pro_123456',     NOW() - INTERVAL '120 days', NOW() - INTERVAL '1 day'),
  ('22222222-2222-2222-2222-222222222222', 'NorthStar Media', 'northstar-media', 'agency', true,  'https://northstar.example.com/logo.png', 'demo_api_key_agency_7890ab',  NOW() - INTERVAL '210 days', NOW() - INTERVAL '2 days'),
  ('33333333-3333-3333-3333-333333333333', 'Brightline SEO', 'brightline-seo', 'free',   false, NULL, 'demo_api_key_free_cdef01',    NOW() - INTERVAL '45 days',  NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- SITES (6 for Acme, 6 for NorthStar, 3 for Brightline)
-- =====================================================================
INSERT INTO sites (id, workspace_id, domain, sitemap_url, gsc_connected, created_at) VALUES
  -- Acme Marketing
  ('a1000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'acmecorp.com',         'https://acmecorp.com/sitemap.xml',         true,  NOW() - INTERVAL '115 days'),
  ('a1000001-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'blog.acmecorp.com',    'https://blog.acmecorp.com/sitemap.xml',    true,  NOW() - INTERVAL '110 days'),
  ('a1000001-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'shop.acmecorp.com',    'https://shop.acmecorp.com/sitemap.xml',    true,  NOW() - INTERVAL '100 days'),
  ('a1000001-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'help.acmecorp.com',    'https://help.acmecorp.com/sitemap.xml',    false, NOW() - INTERVAL '80 days'),
  ('a1000001-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'careers.acmecorp.com', NULL,                                       false, NOW() - INTERVAL '60 days'),
  ('a1000001-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'events.acmecorp.com',  'https://events.acmecorp.com/sitemap.xml',  true,  NOW() - INTERVAL '40 days'),
  -- NorthStar Media
  ('b2000002-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'northstarmedia.io',          'https://northstarmedia.io/sitemap.xml',        true,  NOW() - INTERVAL '200 days'),
  ('b2000002-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'news.northstarmedia.io',     'https://news.northstarmedia.io/sitemap.xml',   true,  NOW() - INTERVAL '180 days'),
  ('b2000002-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'studio.northstarmedia.io',   'https://studio.northstarmedia.io/sitemap.xml', true,  NOW() - INTERVAL '160 days'),
  ('b2000002-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222', 'podcasts.northstarmedia.io', 'https://podcasts.northstarmedia.io/sitemap.xml', false, NOW() - INTERVAL '120 days'),
  ('b2000002-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222', 'go.northstarmedia.io',       NULL,                                            false, NOW() - INTERVAL '90 days'),
  ('b2000002-0000-0000-0000-000000000006', '22222222-2222-2222-2222-222222222222', 'partners.northstarmedia.io', 'https://partners.northstarmedia.io/sitemap.xml', true,  NOW() - INTERVAL '70 days'),
  -- Brightline SEO
  ('c3000003-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'brightlineseo.com',       'https://brightlineseo.com/sitemap.xml',     true,  NOW() - INTERVAL '40 days'),
  ('c3000003-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'guides.brightlineseo.com','https://guides.brightlineseo.com/sitemap.xml', false, NOW() - INTERVAL '30 days'),
  ('c3000003-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'tools.brightlineseo.com', NULL,                                        false, NOW() - INTERVAL '20 days')
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- INDEX JOBS (~24 across workspaces, mixed statuses & sources)
-- =====================================================================
INSERT INTO index_jobs (id, workspace_id, site_id, source, engine, status, total_urls, success_count, failed_count, created_at, completed_at) VALUES
  ('aaaa0001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'a1000001-0000-0000-0000-000000000001', 'sitemap',    'both',   'completed', 240, 232, 8,  NOW() - INTERVAL '28 days', NOW() - INTERVAL '28 days' + INTERVAL '12 minutes'),
  ('aaaa0001-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'a1000001-0000-0000-0000-000000000001', 'manual',     'google', 'completed', 15,  15,  0,  NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days' + INTERVAL '2 minutes'),
  ('aaaa0001-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'a1000001-0000-0000-0000-000000000002', 'sitemap',    'google', 'completed', 412, 408, 4,  NOW() - INTERVAL '22 days', NOW() - INTERVAL '22 days' + INTERVAL '18 minutes'),
  ('aaaa0001-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'a1000001-0000-0000-0000-000000000003', 'cms_plugin', 'both',   'completed', 88,  85,  3,  NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days' + INTERVAL '6 minutes'),
  ('aaaa0001-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'a1000001-0000-0000-0000-000000000002', 'sitemap',    'bing',   'failed',    320, 0,   320,NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days' + INTERVAL '4 minutes'),
  ('aaaa0001-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'a1000001-0000-0000-0000-000000000004', 'manual',     'google', 'completed', 22,  22,  0,  NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days' + INTERVAL '1 minutes'),
  ('aaaa0001-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', 'a1000001-0000-0000-0000-000000000006', 'sitemap',    'both',   'running',   180, 64,  2,  NOW() - INTERVAL '2 hours', NULL),
  ('aaaa0001-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', 'a1000001-0000-0000-0000-000000000001', 'api',        'google', 'pending',   45,  0,   0,  NOW() - INTERVAL '10 minutes', NULL),
  -- NorthStar Media
  ('bbbb0002-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'b2000002-0000-0000-0000-000000000001', 'sitemap',    'both',   'completed', 1240,1208,32, NOW() - INTERVAL '27 days', NOW() - INTERVAL '27 days' + INTERVAL '34 minutes'),
  ('bbbb0002-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'b2000002-0000-0000-0000-000000000002', 'sitemap',    'google', 'completed', 980, 974, 6,  NOW() - INTERVAL '24 days', NOW() - INTERVAL '24 days' + INTERVAL '22 minutes'),
  ('bbbb0002-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'b2000002-0000-0000-0000-000000000003', 'cms_plugin', 'both',   'completed', 156, 150, 6,  NOW() - INTERVAL '19 days', NOW() - INTERVAL '19 days' + INTERVAL '9 minutes'),
  ('bbbb0002-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222', 'b2000002-0000-0000-0000-000000000001', 'gsc',        'google', 'completed', 60,  60,  0,  NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days' + INTERVAL '3 minutes'),
  ('bbbb0002-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222', 'b2000002-0000-0000-0000-000000000006', 'sitemap',    'bing',   'completed', 210, 202, 8,  NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days' + INTERVAL '7 minutes'),
  ('bbbb0002-0000-0000-0000-000000000006', '22222222-2222-2222-2222-222222222222', 'b2000002-0000-0000-0000-000000000002', 'manual',     'both',   'completed', 30,  29,  1,  NOW() - INTERVAL '8 days',  NOW() - INTERVAL '8 days'  + INTERVAL '2 minutes'),
  ('bbbb0002-0000-0000-0000-000000000007', '22222222-2222-2222-2222-222222222222', 'b2000002-0000-0000-0000-000000000003', 'sitemap',    'both',   'failed',    140, 12,  128,NOW() - INTERVAL '5 days',  NOW() - INTERVAL '5 days'  + INTERVAL '5 minutes'),
  ('bbbb0002-0000-0000-0000-000000000008', '22222222-2222-2222-2222-222222222222', 'b2000002-0000-0000-0000-000000000001', 'sitemap',    'both',   'running',   500, 220, 4,  NOW() - INTERVAL '4 hours', NULL),
  ('bbbb0002-0000-0000-0000-000000000009', '22222222-2222-2222-2222-222222222222', 'b2000002-0000-0000-0000-000000000004', 'api',        'google', 'pending',   72,  0,   0,  NOW() - INTERVAL '25 minutes', NULL),
  -- Brightline SEO
  ('cccc0003-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'c3000003-0000-0000-0000-000000000001', 'sitemap',    'both',   'completed', 64,  62,  2,  NOW() - INTERVAL '21 days', NOW() - INTERVAL '21 days' + INTERVAL '3 minutes'),
  ('cccc0003-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'c3000003-0000-0000-0000-000000000002', 'manual',     'google', 'completed', 10,  10,  0,  NOW() - INTERVAL '16 days', NOW() - INTERVAL '16 days' + INTERVAL '1 minutes'),
  ('cccc0003-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'c3000003-0000-0000-0000-000000000001', 'cms_plugin', 'bing',   'completed', 28,  26,  2,  NOW() - INTERVAL '11 days', NOW() - INTERVAL '11 days' + INTERVAL '2 minutes'),
  ('cccc0003-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333', 'c3000003-0000-0000-0000-000000000003', 'manual',     'both',   'failed',    12,  3,   9,  NOW() - INTERVAL '7 days',  NOW() - INTERVAL '7 days'  + INTERVAL '1 minutes'),
  ('cccc0003-0000-0000-0000-000000000005', '33333333-3333-3333-3333-333333333333', 'c3000003-0000-0000-0000-000000000002', 'sitemap',    'google', 'running',   55,  18,  0,  NOW() - INTERVAL '1 hours', NULL),
  ('cccc0003-0000-0000-0000-000000000006', '33333333-3333-3333-3333-333333333333', 'c3000003-0000-0000-0000-000000000001', 'api',        'google', 'pending',   8,   0,   0,  NOW() - INTERVAL '5 minutes', NULL)
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- AUDIT REPORTS (~18 across workspaces)
-- =====================================================================
INSERT INTO audit_reports (id, workspace_id, site_id, status, ai_readiness_score, technical_score, issues, artifact_url, created_at) VALUES
  ('aud00001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'a1000001-0000-0000-0000-000000000001', 'completed', 82, 89, '{"critical":2,"warnings":11,"passed":146,"topIssues":["Missing schema.org on 12 pages","Slow LCP on /pricing"]}'::jsonb, 'https://reports.example.com/acme-main-2024-08.pdf', NOW() - INTERVAL '26 days'),
  ('aud00001-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'a1000001-0000-0000-0000-000000000002', 'completed', 76, 81, '{"critical":4,"warnings":18,"passed":120,"topIssues":["Duplicate meta descriptions","Thin content on 9 posts"]}'::jsonb, 'https://reports.example.com/acme-blog-2024-08.pdf', NOW() - INTERVAL '21 days'),
  ('aud00001-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'a1000001-0000-0000-0000-000000000003', 'completed', 71, 74, '{"critical":6,"warnings":22,"passed":98,"topIssues":["Broken structured product data","Mixed content warnings"]}'::jsonb, 'https://reports.example.com/acme-shop-2024-08.pdf', NOW() - INTERVAL '17 days'),
  ('aud00001-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'a1000001-0000-0000-0000-000000000001', 'completed', 88, 92, '{"critical":0,"warnings":6,"passed":160,"topIssues":["Image alt missing on 4 pages"]}'::jsonb, 'https://reports.example.com/acme-main-2024-09.pdf', NOW() - INTERVAL '6 days'),
  ('aud00001-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'a1000001-0000-0000-0000-000000000004', 'running',   NULL, NULL, NULL, NULL, NOW() - INTERVAL '1 hours'),
  ('aud00001-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'a1000001-0000-0000-0000-000000000006', 'pending',   NULL, NULL, NULL, NULL, NOW() - INTERVAL '20 minutes'),
  -- NorthStar
  ('aud00002-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'b2000002-0000-0000-0000-000000000001', 'completed', 91, 94, '{"critical":1,"warnings":4,"passed":210,"topIssues":["Hreflang missing on 3 pages"]}'::jsonb, 'https://reports.example.com/ns-main-2024-08.pdf', NOW() - INTERVAL '25 days'),
  ('aud00002-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'b2000002-0000-0000-0000-000000000002', 'completed', 84, 87, '{"critical":2,"warnings":9,"passed":175,"topIssues":["Slow TTFB on /world","Missing canonical on 7 articles"]}'::jsonb, 'https://reports.example.com/ns-news-2024-08.pdf', NOW() - INTERVAL '18 days'),
  ('aud00002-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'b2000002-0000-0000-0000-000000000003', 'completed', 78, 80, '{"critical":3,"warnings":14,"passed":140,"topIssues":["Large JS bundles","No sitemap submitted"]}'::jsonb, 'https://reports.example.com/ns-studio-2024-08.pdf', NOW() - INTERVAL '14 days'),
  ('aud00002-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222', 'b2000002-0000-0000-0000-000000000006', 'completed', 86, 90, '{"critical":1,"warnings":7,"passed":188,"topIssues":["Open Graph tags missing"]}'::jsonb, 'https://reports.example.com/ns-partners-2024-09.pdf', NOW() - INTERVAL '9 days'),
  ('aud00002-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222', 'b2000002-0000-0000-0000-000000000002', 'completed', 89, 91, '{"critical":0,"warnings":5,"passed":196,"topIssues":["Minor mobile usability issues"]}'::jsonb, 'https://reports.example.com/ns-news-2024-09.pdf', NOW() - INTERVAL '3 days'),
  ('aud00002-0000-0000-0000-000000000006', '22222222-2222-2222-2222-222222222222', 'b2000002-0000-0000-0000-000000000001', 'running',   NULL, NULL, NULL, NULL, NOW() - INTERVAL '30 minutes'),
  -- Brightline
  ('aud00003-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'c3000003-0000-0000-0000-000000000001', 'completed', 68, 70, '{"critical":5,"warnings":16,"passed":82,"topIssues":["H1 missing on 14 pages","Slow image loading"]}'::jsonb, 'https://reports.example.com/bl-main-2024-08.pdf', NOW() - INTERVAL '19 days'),
  ('aud00003-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'c3000003-0000-0000-0000-000000000002', 'completed', 74, 77, '{"critical":3,"warnings":12,"passed":96,"topIssues":["Thin guides under 300 words"]}'::jsonb, 'https://reports.example.com/bl-guides-2024-08.pdf', NOW() - INTERVAL '12 days'),
  ('aud00003-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'c3000003-0000-0000-0000-000000000003', 'completed', 60, 63, '{"critical":8,"warnings":22,"passed":60,"topIssues":["No sitemap submitted","Robots.txt blocks /tools"]}'::jsonb, 'https://reports.example.com/bl-tools-2024-08.pdf', NOW() - INTERVAL '4 days'),
  ('aud00003-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333', 'c3000003-0000-0000-0000-000000000001', 'pending',   NULL, NULL, NULL, NULL, NOW() - INTERVAL '15 minutes')
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- KEYWORDS (~40)
-- =====================================================================
INSERT INTO keywords (id, workspace_id, site_id, term, country, current_rank, previous_rank, checked_at) VALUES
  -- Acme main
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'a1000001-0000-0000-0000-000000000001', 'enterprise crm software',    'US', 8,  11, NOW() - INTERVAL '1 days'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'a1000001-0000-0000-0000-000000000001', 'sales automation platform',  'US', 14, 16, NOW() - INTERVAL '1 days'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'a1000001-0000-0000-0000-000000000001', 'best b2b crm 2024',          'US', 5,  9,  NOW() - INTERVAL '1 days'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'a1000001-0000-0000-0000-000000000001', 'crm pricing comparison',     'US', 22, 19, NOW() - INTERVAL '1 days'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'a1000001-0000-0000-0000-000000000001', 'acme alternative',           'US', 3,  4,  NOW() - INTERVAL '1 days'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'a1000001-0000-0000-0000-000000000001', 'crm for startups',           'GB', 17, 24, NOW() - INTERVAL '1 days'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'a1000001-0000-0000-0000-000000000001', 'sales pipeline tool',        'CA', 11, 12, NOW() - INTERVAL '1 days'),
  -- Acme blog
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'a1000001-0000-0000-0000-000000000002', 'how to forecast sales',      'US', 6,  10, NOW() - INTERVAL '2 days'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'a1000001-0000-0000-0000-000000000002', 'cold email templates',       'US', 9,  14, NOW() - INTERVAL '2 days'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'a1000001-0000-0000-0000-000000000002', 'lead scoring model',         'US', 18, 22, NOW() - INTERVAL '2 days'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'a1000001-0000-0000-0000-000000000002', 'b2b marketing trends',       'US', 27, 31, NOW() - INTERVAL '2 days'),
  -- Acme shop
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'a1000001-0000-0000-0000-000000000003', 'acme integrations marketplace','US', 12, 15, NOW() - INTERVAL '3 days'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'a1000001-0000-0000-0000-000000000003', 'slack crm integration',      'US', 7,  9,  NOW() - INTERVAL '3 days'),
  -- NorthStar main
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'b2000002-0000-0000-0000-000000000001', 'digital media agency new york','US', 4,  6,  NOW() - INTERVAL '1 days'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'b2000002-0000-0000-0000-000000000001', 'content marketing services', 'US', 9,  12, NOW() - INTERVAL '1 days'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'b2000002-0000-0000-0000-000000000001', 'brand storytelling agency',  'US', 6,  8,  NOW() - INTERVAL '1 days'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'b2000002-0000-0000-0000-000000000001', 'video production firms',     'US', 15, 19, NOW() - INTERVAL '1 days'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'b2000002-0000-0000-0000-000000000001', 'northstar media reviews',    'US', 2,  3,  NOW() - INTERVAL '1 days'),
  -- NorthStar news
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'b2000002-0000-0000-0000-000000000002', 'tech news today',            'US', 28, 33, NOW() - INTERVAL '2 days'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'b2000002-0000-0000-0000-000000000002', 'ai industry updates',        'US', 12, 18, NOW() - INTERVAL '2 days'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'b2000002-0000-0000-0000-000000000002', 'startup funding news',       'US', 19, 22, NOW() - INTERVAL '2 days'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'b2000002-0000-0000-0000-000000000002', 'climate tech news',          'US', 24, 21, NOW() - INTERVAL '2 days'),
  -- NorthStar studio
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'b2000002-0000-0000-0000-000000000003', 'podcast production studio',  'US', 10, 14, NOW() - INTERVAL '3 days'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'b2000002-0000-0000-0000-000000000003', 'animation studio nyc',       'US', 16, 17, NOW() - INTERVAL '3 days'),
  -- NorthStar partners
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'b2000002-0000-0000-0000-000000000006', 'media partnership program',  'US', 8,  11, NOW() - INTERVAL '3 days'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'b2000002-0000-0000-0000-000000000006', 'affiliate media network',    'US', 21, 26, NOW() - INTERVAL '3 days'),
  -- Brightline main
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'c3000003-0000-0000-0000-000000000001', 'seo audit tool',             'US', 13, 17, NOW() - INTERVAL '1 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'c3000003-0000-0000-0000-000000000001', 'rank tracking software',     'US', 19, 23, NOW() - INTERVAL '1 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'c3000003-0000-0000-0000-000000000001', 'technical seo checklist',    'US', 7,  12, NOW() - INTERVAL '1 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'c3000003-0000-0000-0000-000000000001', 'ai seo tools',               'US', 11, 16, NOW() - INTERVAL '1 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'c3000003-0000-0000-0000-000000000001', 'free backlink checker',      'US', 25, 30, NOW() - INTERVAL '1 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'c3000003-0000-0000-0000-000000000001', 'how to rank on google 2024', 'US', 17, 22, NOW() - INTERVAL '1 days'),
  -- Brightline guides
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'c3000003-0000-0000-0000-000000000002', 'on page seo guide',          'US', 9,  14, NOW() - INTERVAL '2 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'c3000003-0000-0000-0000-000000000002', 'link building strategies',   'US', 14, 18, NOW() - INTERVAL '2 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'c3000003-0000-0000-0000-000000000002', 'schema markup tutorial',     'US', 6,  9,  NOW() - INTERVAL '2 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'c3000003-0000-0000-0000-000000000002', 'core web vitals fix',        'US', 20, 24, NOW() - INTERVAL '2 days'),
  -- Brightline tools
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'c3000003-0000-0000-0000-000000000003', 'serp preview tool',          'US', 31, 37, NOW() - INTERVAL '3 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'c3000003-0000-0000-0000-000000000003', 'meta description generator', 'US', 18, 24, NOW() - INTERVAL '3 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'c3000003-0000-0000-0000-000000000003', 'robots txt validator',       'US', 12, 15, NOW() - INTERVAL '3 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'c3000003-0000-0000-0000-000000000003', 'sitemap generator online',   'US', 26, 29, NOW() - INTERVAL '3 days')
ON CONFLICT DO NOTHING;

-- =====================================================================
-- BACKLINKS (~26)
-- =====================================================================
INSERT INTO backlinks (id, site_id, source_url, target_url, anchor_text, domain_authority, discovered_at) VALUES
  (gen_random_uuid(), 'a1000001-0000-0000-0000-000000000001', 'https://techcrunch.com/2024/06/acme-funding',          'https://acmecorp.com/about',        'Acme Corp raises Series C',         92, NOW() - INTERVAL '60 days'),
  (gen_random_uuid(), 'a1000001-0000-0000-0000-000000000001', 'https://forbes.com/sites/lists/2024/top-crm',          'https://acmecorp.com/',             'Acme',                              94, NOW() - INTERVAL '45 days'),
  (gen_random_uuid(), 'a1000001-0000-0000-0000-000000000001', 'https://producthunt.com/posts/acme-v3',                'https://acmecorp.com/pricing',      'try acme',                          81, NOW() - INTERVAL '32 days'),
  (gen_random_uuid(), 'a1000001-0000-0000-0000-000000000001', 'https://saastr.com/articles/best-sales-tools',         'https://acmecorp.com/features',     'best sales tool',                   78, NOW() - INTERVAL '21 days'),
  (gen_random_uuid(), 'a1000001-0000-0000-0000-000000000002', 'https://hubspot.com/blog/forecasting-101',             'https://blog.acmecorp.com/forecasting','sales forecasting guide',        90, NOW() - INTERVAL '18 days'),
  (gen_random_uuid(), 'a1000001-0000-0000-0000-000000000002', 'https://medium.com/@growthx/cold-email',               'https://blog.acmecorp.com/cold-email','cold email templates',           62, NOW() - INTERVAL '12 days'),
  (gen_random_uuid(), 'a1000001-0000-0000-0000-000000000003', 'https://slack.com/marketplace/acme',                   'https://shop.acmecorp.com/slack',   'Acme for Slack',                    95, NOW() - INTERVAL '8 days'),
  (gen_random_uuid(), 'a1000001-0000-0000-0000-000000000003', 'https://zapier.com/apps/acme',                         'https://shop.acmecorp.com/zapier',  'Acme + Zapier',                     93, NOW() - INTERVAL '6 days'),
  (gen_random_uuid(), 'a1000001-0000-0000-0000-000000000001', 'https://random-blog-42.example/seo-stack',             'https://acmecorp.com/',             'click here',                        18, NOW() - INTERVAL '4 days'),
  -- NorthStar
  (gen_random_uuid(), 'b2000002-0000-0000-0000-000000000001', 'https://nytimes.com/2024/05/media-firms-watch',        'https://northstarmedia.io/',        'NorthStar Media',                   97, NOW() - INTERVAL '55 days'),
  (gen_random_uuid(), 'b2000002-0000-0000-0000-000000000001', 'https://adweek.com/agencies-2024',                     'https://northstarmedia.io/agencies','top digital agencies',              89, NOW() - INTERVAL '40 days'),
  (gen_random_uuid(), 'b2000002-0000-0000-0000-000000000001', 'https://campaignlive.com/article/northstar-wins',      'https://northstarmedia.io/news',    'NorthStar wins Cannes',             85, NOW() - INTERVAL '25 days'),
  (gen_random_uuid(), 'b2000002-0000-0000-0000-000000000002', 'https://wired.com/story/ai-newsroom',                  'https://news.northstarmedia.io/ai', 'AI newsroom',                       91, NOW() - INTERVAL '20 days'),
  (gen_random_uuid(), 'b2000002-0000-0000-0000-000000000002', 'https://theverge.com/2024/03/streaming',               'https://news.northstarmedia.io/streaming','streaming wars',              92, NOW() - INTERVAL '14 days'),
  (gen_random_uuid(), 'b2000002-0000-0000-0000-000000000003', 'https://podcastinsights.com/best-studios',             'https://studio.northstarmedia.io/', 'top podcast studios',               72, NOW() - INTERVAL '9 days'),
  (gen_random_uuid(), 'b2000002-0000-0000-0000-000000000006', 'https://partnerstack.com/blog/affiliate',              'https://partners.northstarmedia.io/', 'affiliate program',               68, NOW() - INTERVAL '6 days'),
  (gen_random_uuid(), 'b2000002-0000-0000-0000-000000000001', 'https://spammy-link-farm.example/links',               'https://northstarmedia.io/',        'cheap media services',              9,  NOW() - INTERVAL '3 days'),
  -- Brightline
  (gen_random_uuid(), 'c3000003-0000-0000-0000-000000000001', 'https://searchenginejournal.com/best-seo-tools-2024',  'https://brightlineseo.com/',        'Brightline SEO',                    88, NOW() - INTERVAL '30 days'),
  (gen_random_uuid(), 'c3000003-0000-0000-0000-000000000001', 'https://moz.com/blog/community-tools',                 'https://brightlineseo.com/tools',   'free seo tools',                    91, NOW() - INTERVAL '22 days'),
  (gen_random_uuid(), 'c3000003-0000-0000-0000-000000000001', 'https://ahrefs.com/blog/ai-seo',                       'https://brightlineseo.com/ai-seo',  'AI for SEO',                        93, NOW() - INTERVAL '17 days'),
  (gen_random_uuid(), 'c3000003-0000-0000-0000-000000000002', 'https://backlinko.com/hub/seo/on-page',                'https://guides.brightlineseo.com/on-page','on-page seo guide',           87, NOW() - INTERVAL '13 days'),
  (gen_random_uuid(), 'c3000003-0000-0000-0000-000000000002', 'https://yoast.com/learn/schema',                       'https://guides.brightlineseo.com/schema','schema tutorial',              84, NOW() - INTERVAL '10 days'),
  (gen_random_uuid(), 'c3000003-0000-0000-0000-000000000003', 'https://github.com/awesome-seo/list',                  'https://tools.brightlineseo.com/sitemap','sitemap generator',            76, NOW() - INTERVAL '7 days'),
  (gen_random_uuid(), 'c3000003-0000-0000-0000-000000000003', 'https://reddit.com/r/SEO/comments/serp-tool',          'https://tools.brightlineseo.com/serp','SERP preview',                   80, NOW() - INTERVAL '5 days'),
  (gen_random_uuid(), 'c3000003-0000-0000-0000-000000000001', 'https://tiny-blog-77.example/seo',                     'https://brightlineseo.com/',        'visit',                             15, NOW() - INTERVAL '2 days'),
  (gen_random_uuid(), 'c3000003-0000-0000-0000-000000000001', 'https://devto.example/seo-stack',                      'https://brightlineseo.com/blog',    'brightline blog',                   55, NOW() - INTERVAL '1 days')
ON CONFLICT DO NOTHING;

-- =====================================================================
-- CONTENT DRAFTS (~12)
-- =====================================================================
INSERT INTO content_drafts (id, workspace_id, title, language, topic, body, status, ai_detection_score, created_at) VALUES
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '10 Sales Forecasting Mistakes Every B2B Team Makes',          'en', 'sales forecasting',     'Sales forecasting is the backbone of revenue planning... [800 words]', 'published', 12, NOW() - INTERVAL '20 days'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'How Modern CRMs Replace Spreadsheets for Good',               'en', 'crm vs spreadsheets',   'For decades, spreadsheets ran the world of sales ops... [1200 words]', 'published', 18, NOW() - INTERVAL '15 days'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'The 2024 Guide to AI-Assisted Cold Outreach',                 'en', 'ai cold outreach',      'Generic cold emails are dead. With AI assistance... [950 words]',      'draft',     34, NOW() - INTERVAL '6 days'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Lead Scoring 101: From Static Rules to ML Models',            'en', 'lead scoring',          'Most teams still rely on hand-tuned rules... [1100 words]',            'draft',     22, NOW() - INTERVAL '2 days'),
  -- NorthStar
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'Inside the AI Newsroom: How NorthStar Built Its Stack',       'en', 'ai newsroom',           'When we set out to rebuild our editorial workflow... [1400 words]',    'published', 9,  NOW() - INTERVAL '28 days'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'Brand Storytelling in 2024: Less Polish, More Truth',         'en', 'brand storytelling',    'Audiences smell manufactured authenticity... [1000 words]',            'published', 14, NOW() - INTERVAL '18 days'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'How We Produce 40 Podcasts a Month Without Burning Out',      'en', 'podcast production',    'Volume kills quality unless your pipeline is ruthless... [900 words]', 'draft',     19, NOW() - INTERVAL '5 days'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'A Field Guide to Affiliate Media Partnerships',               'en', 'affiliate partnerships','Affiliate is no longer a coupon game... [1300 words]',                 'draft',     26, NOW() - INTERVAL '1 days'),
  -- Brightline
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'The Only Technical SEO Checklist You Need in 2024',           'en', 'technical seo',         'Search engines have gotten smarter, but the basics still win... [1500 words]','published', 8,  NOW() - INTERVAL '22 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'Core Web Vitals: A No-Nonsense Fix Guide',                    'en', 'core web vitals',       'LCP, INP, CLS — three letters that decide your rankings... [1100 words]','published', 11, NOW() - INTERVAL '12 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'Why AI-Generated Content Still Needs Human Editors',          'en', 'ai content editing',    'AI drafts are fast but rarely ready to publish... [850 words]',        'draft',     41, NOW() - INTERVAL '4 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'Schema Markup Wins: 12 Examples That Moved Rankings',         'en', 'schema markup',         'We pulled before/after data from 12 client sites... [1250 words]',     'draft',     17, NOW() - INTERVAL '8 hours')
ON CONFLICT DO NOTHING;

-- =====================================================================
-- WORDPRESS CONNECTIONS (~6, encrypted password is placeholder)
-- =====================================================================
INSERT INTO wordpress_connections (id, workspace_id, site_url, username, app_password_enc, created_at) VALUES
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'https://blog.acmecorp.com',       'editor@acmecorp.com',         'enc::demo-app-pwd-acme-blog',     NOW() - INTERVAL '90 days'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'https://help.acmecorp.com',       'docs@acmecorp.com',           'enc::demo-app-pwd-acme-help',     NOW() - INTERVAL '50 days'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'https://news.northstarmedia.io',  'newsroom@northstarmedia.io',  'enc::demo-app-pwd-ns-news',       NOW() - INTERVAL '170 days'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'https://partners.northstarmedia.io','partners@northstarmedia.io','enc::demo-app-pwd-ns-partners',   NOW() - INTERVAL '65 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'https://brightlineseo.com',       'admin@brightlineseo.com',     'enc::demo-app-pwd-bl-main',       NOW() - INTERVAL '35 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'https://guides.brightlineseo.com','guides@brightlineseo.com',    'enc::demo-app-pwd-bl-guides',     NOW() - INTERVAL '28 days')
ON CONFLICT DO NOTHING;

-- =====================================================================
-- ALERTS (~13)
-- =====================================================================
INSERT INTO alerts (id, workspace_id, type, threshold, message, triggered_at, read) VALUES
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'rank_drop',         '{"keyword":"crm pricing comparison","drop":3}'::jsonb,        'Keyword "crm pricing comparison" dropped from #19 to #22',         NOW() - INTERVAL '12 hours', false),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'index_failure',     '{"jobId":"aaaa0001-0000-0000-0000-000000000005","failed":320}'::jsonb,'Bing indexing job failed for blog.acmecorp.com (320 URLs)',  NOW() - INTERVAL '18 days', true),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'audit_critical',    '{"siteId":"a1000001-0000-0000-0000-000000000003","critical":6}'::jsonb,'shop.acmecorp.com audit flagged 6 critical issues',         NOW() - INTERVAL '17 days', true),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'backlink_lost',     '{"source":"techcrunch.com"}'::jsonb,                          'Backlink from techcrunch.com no longer detected',                  NOW() - INTERVAL '3 days',  false),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'quota_warning',     '{"metric":"urlsIndexed","usagePct":82}'::jsonb,               'You have used 82% of your monthly indexing quota',                 NOW() - INTERVAL '1 days',  false),
  -- NorthStar
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'rank_gain',         '{"keyword":"ai industry updates","gain":6}'::jsonb,           'Keyword "ai industry updates" jumped from #18 to #12',             NOW() - INTERVAL '2 days',  false),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'index_failure',     '{"jobId":"bbbb0002-0000-0000-0000-000000000007","failed":128}'::jsonb,'Indexing job for studio.northstarmedia.io failed (128 URLs)',NOW() - INTERVAL '5 days',  true),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'new_backlink',      '{"source":"nytimes.com","da":97}'::jsonb,                     'New high-authority backlink discovered from nytimes.com',          NOW() - INTERVAL '55 days', true),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'ai_mention_drop',   '{"brand":"NorthStar","engine":"chatgpt","dropPct":15}'::jsonb,'ChatGPT mentions of NorthStar dropped 15% week-over-week',         NOW() - INTERVAL '4 days',  false),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'audit_passed',      '{"siteId":"b2000002-0000-0000-0000-000000000002","score":89}'::jsonb,'news.northstarmedia.io audit score improved to 89',          NOW() - INTERVAL '3 days',  true),
  -- Brightline
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'rank_drop',         '{"keyword":"free backlink checker","drop":5}'::jsonb,         'Keyword "free backlink checker" dropped from #25 to #30',          NOW() - INTERVAL '6 hours', false),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'audit_critical',    '{"siteId":"c3000003-0000-0000-0000-000000000003","critical":8}'::jsonb,'tools.brightlineseo.com has 8 critical SEO issues',         NOW() - INTERVAL '4 days',  false),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'quota_warning',     '{"metric":"contentGenerated","usagePct":95}'::jsonb,          'You are at 95% of your free plan content generation quota',        NOW() - INTERVAL '8 hours', false)
ON CONFLICT DO NOTHING;

-- =====================================================================
-- SCHEDULED REPORTS (~6)
-- =====================================================================
INSERT INTO scheduled_reports (id, workspace_id, recipients, frequency, sections, last_sent_at) VALUES
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'cmo@acmecorp.com,seo@acmecorp.com',         'weekly',  '["indexing","keywords","audits","backlinks"]'::jsonb,    NOW() - INTERVAL '4 days'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'leadership@acmecorp.com',                   'monthly', '["indexing","keywords","audits","ai_visibility","content"]'::jsonb, NOW() - INTERVAL '12 days'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'editorial@northstarmedia.io',               'weekly',  '["indexing","keywords","content"]'::jsonb,               NOW() - INTERVAL '3 days'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'partners@northstarmedia.io',                'monthly', '["backlinks","ai_visibility"]'::jsonb,                   NOW() - INTERVAL '10 days'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'cto@northstarmedia.io',                     'daily',   '["indexing","alerts"]'::jsonb,                           NOW() - INTERVAL '1 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'founder@brightlineseo.com',                 'weekly',  '["indexing","keywords","audits","backlinks","ai_visibility"]'::jsonb, NOW() - INTERVAL '5 days')
ON CONFLICT DO NOTHING;

-- =====================================================================
-- BRAND PROMPTS + RESULTS (AI monitoring)
-- =====================================================================
INSERT INTO brand_prompts (id, workspace_id, prompt_text, brand_name, engines, frequency, created_at) VALUES
  ('bp000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'What are the best B2B CRM platforms for mid-market sales teams?',  'Acme',       'chatgpt,gemini,claude', 'weekly', NOW() - INTERVAL '60 days'),
  ('bp000001-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Recommend a sales automation tool with strong forecasting.',       'Acme',       'chatgpt,gemini',        'weekly', NOW() - INTERVAL '45 days'),
  ('bp000002-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'Top creative agencies for brand storytelling in North America?',   'NorthStar',  'chatgpt,gemini,claude', 'weekly', NOW() - INTERVAL '80 days'),
  ('bp000002-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'Best podcast production studios for B2B brands?',                  'NorthStar',  'chatgpt,claude',        'weekly', NOW() - INTERVAL '50 days'),
  ('bp000003-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'Which SEO tools are best for technical audits in 2024?',           'Brightline', 'chatgpt,gemini,claude', 'daily',  NOW() - INTERVAL '30 days'),
  ('bp000003-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'Recommend an AI-powered rank tracker.',                            'Brightline', 'chatgpt,gemini',        'weekly', NOW() - INTERVAL '20 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO brand_mention_results (id, prompt_id, engine, mentioned, sentiment, citation_url, response_text, run_at) VALUES
  -- Acme prompt 1
  (gen_random_uuid(), 'bp000001-0000-0000-0000-000000000001', 'chatgpt', true,  'positive', 'https://acmecorp.com/',     'For mid-market sales teams, popular CRM platforms include Salesforce, HubSpot, Acme, and Pipedrive. Acme is often praised for its forecasting and integrations.', NOW() - INTERVAL '7 days'),
  (gen_random_uuid(), 'bp000001-0000-0000-0000-000000000001', 'gemini',  true,  'neutral',  NULL,                        'Common picks include Salesforce, HubSpot, Zoho, and Acme. Acme is a strong choice if your team needs flexible reporting.', NOW() - INTERVAL '7 days'),
  (gen_random_uuid(), 'bp000001-0000-0000-0000-000000000001', 'claude',  false, NULL,       NULL,                        'Top platforms include Salesforce, HubSpot, Zoho, Pipedrive, and Microsoft Dynamics.', NOW() - INTERVAL '7 days'),
  (gen_random_uuid(), 'bp000001-0000-0000-0000-000000000001', 'chatgpt', true,  'positive', 'https://acmecorp.com/pricing','Acme CRM is frequently recommended for mid-market teams thanks to transparent pricing and a strong API.', NOW() - INTERVAL '14 days'),
  -- Acme prompt 2
  (gen_random_uuid(), 'bp000001-0000-0000-0000-000000000002', 'chatgpt', true,  'positive', 'https://acmecorp.com/features','Acme stands out for its sales forecasting accuracy and pipeline analytics.', NOW() - INTERVAL '6 days'),
  (gen_random_uuid(), 'bp000001-0000-0000-0000-000000000002', 'gemini',  false, NULL,       NULL,                        'Consider tools like Clari, Gong, and Salesforce Einstein for forecasting.', NOW() - INTERVAL '6 days'),
  -- NorthStar prompt 1
  (gen_random_uuid(), 'bp000002-0000-0000-0000-000000000001', 'chatgpt', true,  'positive', 'https://northstarmedia.io/','NorthStar Media is often cited alongside Wieden+Kennedy and Droga5 for narrative-driven brand work.', NOW() - INTERVAL '5 days'),
  (gen_random_uuid(), 'bp000002-0000-0000-0000-000000000001', 'gemini',  true,  'positive', 'https://northstarmedia.io/agencies','Top picks include NorthStar Media, Anomaly, and Wieden+Kennedy.', NOW() - INTERVAL '5 days'),
  (gen_random_uuid(), 'bp000002-0000-0000-0000-000000000001', 'claude',  true,  'neutral',  NULL,                        'For brand storytelling, agencies like NorthStar Media, Droga5, and 72andSunny are commonly mentioned.', NOW() - INTERVAL '5 days'),
  -- NorthStar prompt 2
  (gen_random_uuid(), 'bp000002-0000-0000-0000-000000000002', 'chatgpt', true,  'positive', 'https://studio.northstarmedia.io/','NorthStar Studio produces a wide podcast slate for B2B brands and has a strong production reputation.', NOW() - INTERVAL '4 days'),
  (gen_random_uuid(), 'bp000002-0000-0000-0000-000000000002', 'claude',  false, NULL,       NULL,                        'Consider Pacific Content, Lower Street, and JAR Audio for B2B podcasting.', NOW() - INTERVAL '4 days'),
  -- Brightline prompt 1
  (gen_random_uuid(), 'bp000003-0000-0000-0000-000000000001', 'chatgpt', true,  'positive', 'https://brightlineseo.com/','Popular technical SEO tools include Screaming Frog, Sitebulb, Ahrefs, and newer entrants like Brightline SEO.', NOW() - INTERVAL '2 days'),
  (gen_random_uuid(), 'bp000003-0000-0000-0000-000000000001', 'gemini',  true,  'neutral',  'https://brightlineseo.com/tools','Brightline SEO is mentioned as an emerging AI-powered audit tool.', NOW() - INTERVAL '2 days'),
  (gen_random_uuid(), 'bp000003-0000-0000-0000-000000000001', 'claude',  false, NULL,       NULL,                        'Top options: Screaming Frog, Sitebulb, Ahrefs Site Audit, Semrush.', NOW() - INTERVAL '2 days'),
  -- Brightline prompt 2
  (gen_random_uuid(), 'bp000003-0000-0000-0000-000000000002', 'chatgpt', true,  'positive', 'https://brightlineseo.com/ai-seo','For AI-powered rank tracking, Brightline SEO and Semrush Sensor are commonly recommended.', NOW() - INTERVAL '1 days'),
  (gen_random_uuid(), 'bp000003-0000-0000-0000-000000000002', 'gemini',  false, NULL,       NULL,                        'Consider Ahrefs Rank Tracker, Semrush Position Tracking, or Accuranker.', NOW() - INTERVAL '1 days')
ON CONFLICT DO NOTHING;

-- =====================================================================
-- QUOTA USAGE (current period, one row per workspace)
-- =====================================================================
INSERT INTO quota_usage (id, workspace_id, period, urls_indexed, prompts_run, content_generated) VALUES
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', to_char(NOW(), 'YYYY-MM'), 8240, 312, 42),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', to_char(NOW(), 'YYYY-MM'), 42180, 1840, 168),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', to_char(NOW(), 'YYYY-MM'), 78, 14, 4)
ON CONFLICT (workspace_id, period) DO UPDATE
  SET urls_indexed = EXCLUDED.urls_indexed,
      prompts_run = EXCLUDED.prompts_run,
      content_generated = EXCLUDED.content_generated;

COMMIT;