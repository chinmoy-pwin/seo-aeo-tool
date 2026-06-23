import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export interface CreateSiteInput {
  domain: string;
  sitemapUrl?: string;
}

export interface UpdateSiteInput {
  domain?: string;
  sitemapUrl?: string;
  gscConnected?: boolean;
}

export const siteService = {
  async list(workspaceId: string) {
    return prisma.site.findMany({ where: { workspaceId }, orderBy: { createdAt: 'desc' } });
  },

  async get(workspaceId: string, id: string) {
    const site = await prisma.site.findFirst({ where: { id, workspaceId } });
    if (!site) throw new NotFoundError('Site not found');
    return site;
  },

  async create(workspaceId: string, input: CreateSiteInput) {
    return prisma.site.create({
      data: { workspaceId, domain: input.domain, sitemapUrl: input.sitemapUrl },
    });
  },

  async update(workspaceId: string, id: string, input: UpdateSiteInput) {
    await this.get(workspaceId, id);
    return prisma.site.update({ where: { id }, data: input });
  },

  async remove(workspaceId: string, id: string) {
    await this.get(workspaceId, id);
    await prisma.site.delete({ where: { id } });
  },
};