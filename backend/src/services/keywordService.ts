import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';
import { siteService } from './siteService';

export interface CreateKeywordInput {
  siteId: string;
  term: string;
  country?: string;
}

export const keywordService = {
  async list(workspaceId: string, siteId?: string) {
    return prisma.keyword.findMany({
      where: { workspaceId, ...(siteId ? { siteId } : {}) },
      orderBy: { term: 'asc' },
    });
  },

  async create(workspaceId: string, input: CreateKeywordInput) {
    await siteService.get(workspaceId, input.siteId);
    return prisma.keyword.create({
      data: {
        workspaceId,
        siteId: input.siteId,
        term: input.term,
        country: input.country || 'US',
        currentRank: Math.floor(1 + Math.random() * 100),
        checkedAt: new Date(),
      },
    });
  },

  async remove(workspaceId: string, id: string) {
    const kw = await prisma.keyword.findFirst({ where: { id, workspaceId } });
    if (!kw) throw new NotFoundError('Keyword not found');
    await prisma.keyword.delete({ where: { id } });
  },
};