import { prisma } from '../config/database';
import { quotaService } from './quotaService';

export const dashboardService = {
  async summary(workspaceId: string) {
    const [
      jobCounts,
      totalIndexed,
      mentionAgg,
      latestAudits,
      keywordCount,
      avgRankAgg,
      quota,
    ] = await Promise.all([
      prisma.indexJob.groupBy({
        by: ['status'],
        where: { workspaceId },
        _count: { _all: true },
      }),
      prisma.indexUrl.count({ where: { job: { workspaceId }, status: 'indexed' } }),
      prisma.brandMentionResult.groupBy({
        by: ['mentioned'],
        where: { prompt: { workspaceId } },
        _count: { _all: true },
      }),
      prisma.auditReport.findMany({
        where: { workspaceId, status: 'completed' },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, siteId: true, aiReadinessScore: true, technicalScore: true, createdAt: true },
      }),
      prisma.keyword.count({ where: { workspaceId } }),
      prisma.keyword.aggregate({ where: { workspaceId, currentRank: { not: null } }, _avg: { currentRank: true } }),
      quotaService.getUsage(workspaceId),
    ]);

    const indexingByStatus: Record<string, number> = {};
    for (const row of jobCounts) indexingByStatus[row.status] = row._count._all;

    let mentioned = 0;
    let notMentioned = 0;
    for (const row of mentionAgg) {
      if (row.mentioned) mentioned = row._count._all;
      else notMentioned = row._count._all;
    }
    const totalMentions = mentioned + notMentioned;

    return {
      indexing: {
        jobsByStatus: indexingByStatus,
        totalIndexedUrls: totalIndexed,
      },
      aiVisibility: {
        totalResults: totalMentions,
        mentioned,
        notMentioned,
        mentionRate: totalMentions > 0 ? Math.round((mentioned / totalMentions) * 100) : 0,
      },
      audits: {
        recent: latestAudits,
      },
      keywords: {
        tracked: keywordCount,
        averageRank: avgRankAgg._avg.currentRank ? Math.round(avgRankAgg._avg.currentRank) : null,
      },
      quota,
    };
  },
};