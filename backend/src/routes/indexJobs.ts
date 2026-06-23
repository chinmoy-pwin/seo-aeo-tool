import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler';
import { workspaceContext } from '../middleware/workspaceContext';
import { indexingService } from '../services/indexingService';

const router = Router();
router.use(workspaceContext);

const createSchema = z.object({
  siteId: z.string().uuid(),
  source: z.enum(['manual', 'sitemap', 'cms_plugin', 'api', 'gsc']),
  engine: z.enum(['google', 'bing', 'both']),
  urls: z.array(z.string().url()).optional(),
  sitemapUrl: z.string().url().optional(),
});

const idSchema = z.object({ id: z.string().uuid() });
const listQuerySchema = z.object({
  siteId: z.string().uuid().optional(),
  status: z.string().optional(),
});

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const query = listQuerySchema.parse(req.query);
    const jobs = await indexingService.list(req.workspaceId!, query);
    res.json({ success: true, data: { jobs } });
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = createSchema.parse(req.body);
    const job = await indexingService.createJob(req.workspaceId!, body);
    res.status(202).json({ success: true, data: { job } });
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = idSchema.parse(req.params);
    const { job, urls } = await indexingService.get(req.workspaceId!, id);
    res.json({ success: true, data: { job, urls } });
  }),
);

router.post(
  '/:id/retry',
  asyncHandler(async (req, res) => {
    const { id } = idSchema.parse(req.params);
    const job = await indexingService.retry(req.workspaceId!, id);
    res.status(202).json({ success: true, data: { job } });
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = idSchema.parse(req.params);
    await indexingService.remove(req.workspaceId!, id);
    res.status(204).send();
  }),
);

export default router;