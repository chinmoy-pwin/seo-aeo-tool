import { prisma } from '../config/database';
import { ValidationError } from '../utils/errors';
import { siteService } from './siteService';

export const backlinkService = {
  async list(workspaceId: string, siteId: string) {
    if (!siteId) throw new ValidationError('siteId query parameter is required');
    await siteService.get(workspaceId, siteId);
    return prisma.backlink.findMany({ where: { siteId }, orderBy: { discoveredAt: 'desc' } });
  },
};