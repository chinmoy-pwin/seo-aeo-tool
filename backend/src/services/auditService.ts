import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';
import { siteService } from './siteService';
import { enqueue } from '../queues';

export const auditService = {
  async list(workspaceId: string, siteId?: string) {
    return prisma.auditReport.findMany({
      where: { workspaceId, ...(siteId ? { siteId } : {}) },
      orderBy: { createdAt: 'desc' },
    });
  },

  async get(workspaceId: string, id: string) {
    const audit = await prisma.auditReport.findFirst({ where: { id, workspaceId } });
    if (!audit) throw new NotFoundError('Audit report not found');
    return audit;
  },

  async trigger(workspaceId: string, siteId: string) {
    await siteService.get(workspaceId, siteId);
    const audit = await prisma.auditReport.create({
      data: { workspaceId, siteId, status: 'pending' },
    });
    await enqueue('audit', 'run-audit', { auditId: audit.id, workspaceId, siteId });
    return audit;
  },
};