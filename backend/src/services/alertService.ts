import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export const alertService = {
  async list(workspaceId: string, read?: boolean) {
    return prisma.alert.findMany({
      where: { workspaceId, ...(read !== undefined ? { read } : {}) },
      orderBy: { triggeredAt: 'desc' },
    });
  },

  async create(workspaceId: string, type: string, message: string, threshold?: unknown) {
    return prisma.alert.create({
      data: { workspaceId, type, message, threshold: (threshold as any) ?? undefined },
    });
  },

  async markRead(workspaceId: string, id: string) {
    const alert = await prisma.alert.findFirst({ where: { id, workspaceId } });
    if (!alert) throw new NotFoundError('Alert not found');
    return prisma.alert.update({ where: { id }, data: { read: true } });
  },
};