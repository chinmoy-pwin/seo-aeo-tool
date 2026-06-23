import { prisma } from '../config/database';
import { QuotaExceededError, NotFoundError } from '../utils/errors';
import { QuotaMetric, getLimits, currentPeriod } from '../lib/quotaLimits';

async function getOrCreateUsage(workspaceId: string) {
  const period = currentPeriod();
  return prisma.quotaUsage.upsert({
    where: { workspaceId_period: { workspaceId, period } },
    create: { workspaceId, period },
    update: {},
  });
}

export const quotaService = {
  async getUsage(workspaceId: string) {
    const ws = await prisma.workspace.findUnique({ where: { id: workspaceId }, select: { plan: true } });
    if (!ws) throw new NotFoundError('Workspace not found');
    const usage = await getOrCreateUsage(workspaceId);
    const limits = getLimits(ws.plan);
    return {
      plan: ws.plan,
      usage: {
        urlsIndexed: usage.urlsIndexed,
        promptsRun: usage.promptsRun,
        contentGenerated: usage.contentGenerated,
      },
      limits,
      period: usage.period,
    };
  },

  async check(workspaceId: string, metric: QuotaMetric, amount = 1): Promise<void> {
    const ws = await prisma.workspace.findUnique({ where: { id: workspaceId }, select: { plan: true } });
    if (!ws) throw new NotFoundError('Workspace not found');
    const usage = await getOrCreateUsage(workspaceId);
    const limits = getLimits(ws.plan);
    const current = usage[metric];
    if (current + amount > limits[metric]) {
      throw new QuotaExceededError(
        `Quota exceeded for ${metric}: ${current}/${limits[metric]} (requested +${amount})`,
        { metric, current, limit: limits[metric], requested: amount },
      );
    }
  },

  async increment(workspaceId: string, metric: QuotaMetric, amount = 1): Promise<void> {
    const period = currentPeriod();
    await prisma.quotaUsage.upsert({
      where: { workspaceId_period: { workspaceId, period } },
      create: { workspaceId, period, [metric]: amount } as any,
      update: { [metric]: { increment: amount } },
    });
  },
};