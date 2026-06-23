export type QuotaMetric = 'urlsIndexed' | 'promptsRun' | 'contentGenerated';

export interface PlanLimits {
  urlsIndexed: number;
  promptsRun: number;
  contentGenerated: number;
}

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: { urlsIndexed: 100, promptsRun: 20, contentGenerated: 5 },
  pro: { urlsIndexed: 10000, promptsRun: 1000, contentGenerated: 200 },
  agency: { urlsIndexed: 100000, promptsRun: 10000, contentGenerated: 2000 },
};

export function getLimits(plan: string): PlanLimits {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.free;
}

export function currentPeriod(): string {
  return new Date().toISOString().slice(0, 7); // YYYY-MM
}