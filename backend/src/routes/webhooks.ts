import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler';
import { prisma } from '../config/database';
import { indexingService } from '../services/indexingService';
import { NotFoundError } from '../utils/errors';

const router = Router();

const bodySchema = z.object({
  siteId: z.string().uuid(),
  urls: z.array(z.string().url()).min(1),
  engine: z.enum(['google', 'bing', 'both']).optional(),
});

router.post(
  '/cms/:apiKey',
  asyncHandler(async (req, res) => {
    const apiKey = req.params.apiKey;
    const workspace = await prisma.workspace.findUnique({ where: { apiKey }, select: { id: true } });
    if (!workspace) throw new NotFoundError('Invalid API key');
    const body = bodySchema.parse(req.body);
    const job = await indexingService.createJob(workspace.id, {
      siteId: body.siteId,
      source: 'cms_plugin',
      engine: body.engine || 'both',
      urls: body.urls,
    });
    res.status(202).json({ success: true, data: { jobId: job.id } });
  }),
);

export default router;