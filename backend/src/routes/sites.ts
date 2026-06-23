import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler';
import { workspaceContext } from '../middleware/workspaceContext';
import { siteService } from '../services/siteService';

const router = Router();
router.use(workspaceContext);

const createSchema = z.object({
  domain: z.string().min(1),
  sitemapUrl: z.string().url().optional(),
});

const updateSchema = z.object({
  domain: z.string().min(1).optional(),
  sitemapUrl: z.string().url().optional(),
  gscConnected: z.boolean().optional(),
});

const idSchema = z.object({ id: z.string().uuid() });

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const sites = await siteService.list(req.workspaceId!);
    res.json({ success: true, data: { sites } });
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = createSchema.parse(req.body);
    const site = await siteService.create(req.workspaceId!, body);
    res.status(201).json({ success: true, data: { site } });
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = idSchema.parse(req.params);
    const site = await siteService.get(req.workspaceId!, id);
    res.json({ success: true, data: { site } });
  }),
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = idSchema.parse(req.params);
    const body = updateSchema.parse(req.body);
    const site = await siteService.update(req.workspaceId!, id, body);
    res.json({ success: true, data: { site } });
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = idSchema.parse(req.params);
    await siteService.remove(req.workspaceId!, id);
    res.status(204).send();
  }),
);

export default router;