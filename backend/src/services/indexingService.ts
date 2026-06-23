import { prisma } from '../config/database';
import { NotFoundError, ValidationError } from '../utils/errors';
import { quotaService } from './quotaService';
import { siteService } from './siteService';
import { enqueue } from '../queues';
import { parseSitemap } from '../integrations/sitemapParser';

export interface CreateJobInput {
  siteId: string;
  source: 'manual' | 'sitemap' | 'cms_plugin' | 'api' | 'gsc';
  engine: 'google' | 'bing' | 'both';
  urls?: string[];
  sitemapUrl?: string;
}

export const indexingService = {
  async list(workspaceId: string, filters: { siteId?: string; status?: string }) {
    return prisma.indexJob.findMany({
      where: {
        workspaceId,
        ...(filters.siteId ? { siteId: filters.siteId } : {}),
        ...(filters.status ? { status: filters.status } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async get(workspaceId: string, id: string) {
    const job = await prisma.indexJob.findFirst({ where: { id, workspaceId } });
    if (!job) throw new NotFoundError('Index job not found');
    const urls = await prisma.indexUrl.findMany({ where: { jobId: id }, orderBy: { url: 'asc' } });
    return { job, urls };
  },

  async createJob(workspaceId: string, input: CreateJobInput) {
    await siteService.get(workspaceId, input.siteId);

    let urls: string[] = [];
    if (input.source === 'sitemap') {
      const sitemapUrl = input.sitemapUrl;
      if (!sitemapUrl) throw new ValidationError('sitemapUrl is required for sitemap source');
      urls = await parseSitemap(sitemapUrl);
    } else {
      urls = (input.urls || []).map((u) => u.trim()).filter(Boolean);
    }

    if (urls.length === 0) {
      throw new ValidationError('No URLs provided to index');
    }

    // dedupe
    urls = Array.from(new Set(urls));

    await quotaService.check(workspaceId, 'urlsIndexed', urls.length);

    const job = await prisma.$transaction(async (tx) => {
      const created = await tx.indexJob.create({
        data: {
          workspaceId,
          siteId: input.siteId,
          source: input.source,
          engine: input.engine,
          status: 'pending',
          totalUrls: urls.length,
        },
      });
      await tx.indexUrl.createMany({
        data: urls.map((url) => ({ jobId: created.id, url, status: 'queued' })),
      });
      return created;
    });

    await quotaService.increment(workspaceId, 'urlsIndexed', urls.length);
    await enqueue('index', 'process-job', { jobId: job.id, workspaceId });

    return job;
  },

  async retry(workspaceId: string, id: string) {
    const job = await prisma.indexJob.findFirst({ where: { id, workspaceId } });
    if (!job) throw new NotFoundError('Index job not found');
    await prisma.indexUrl.updateMany({
      where: { jobId: id, status: 'failed' },
      data: { status: 'queued' },
    });
    await prisma.indexJob.update({
      where: { id },
      data: { status: 'pending', completedAt: null },
    });
    await enqueue('index', 'process-job', { jobId: id, workspaceId });
    return prisma.indexJob.findUnique({ where: { id } });
  },

  async remove(workspaceId: string, id: string) {
    const job = await prisma.indexJob.findFirst({ where: { id, workspaceId } });
    if (!job) throw new NotFoundError('Index job not found');
    await prisma.indexJob.delete({ where: { id } });
  },
};