/**
 * Mocked site crawler producing AI-readiness + technical SEO scores and issues.
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface AuditResult {
  aiReadinessScore: number;
  technicalScore: number;
  issues: Array<{ severity: string; category: string; message: string }>;
}

const ISSUE_POOL = [
  { severity: 'high', category: 'ai_readiness', message: 'Missing structured data (schema.org)' },
  { severity: 'medium', category: 'technical', message: 'Slow Largest Contentful Paint (>2.5s)' },
  { severity: 'low', category: 'technical', message: 'Missing alt text on 12 images' },
  { severity: 'high', category: 'ai_readiness', message: 'No llms.txt file detected' },
  { severity: 'medium', category: 'technical', message: 'Duplicate meta descriptions found' },
  { severity: 'low', category: 'ai_readiness', message: 'Content lacks clear Q&A formatting for LLM extraction' },
];

export async function runAudit(_domain: string): Promise<AuditResult> {
  await delay(800 + Math.random() * 1500);
  const aiReadinessScore = Math.floor(50 + Math.random() * 45);
  const technicalScore = Math.floor(55 + Math.random() * 40);
  const issueCount = 2 + Math.floor(Math.random() * 4);
  const shuffled = [...ISSUE_POOL].sort(() => Math.random() - 0.5).slice(0, issueCount);
  return { aiReadinessScore, technicalScore, issues: shuffled };
}