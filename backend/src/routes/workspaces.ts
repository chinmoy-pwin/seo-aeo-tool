import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler';
import { workspaceService } from '../services/workspaceService';

const router = Router();

const createSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'slug must be lowercase alphanumeric with dashes'),
  plan: z.enum(['free', 'pro', 'agency']).optional(),
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  plan: z.enum(['free', 'pro', 'agency']).optional(),
  whiteLabelEnabled: z.boolean().optional(),
  brandingLogoUrl: z.string().url().optional(),
});

const idSchema = z.object({ id: z.string().uuid() });

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const workspaces = await workspaceService.list();
    res.json({ success: true, data: { workspaces } });
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = createSchema.parse(req.body);
    const workspace = await workspaceService.create(body);
    res.status(201).json({ success: true, data: { workspace } });
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = idSchema.parse(req.params);
    const workspace = await workspaceService.get(id);
    res.json({ success: true, data: { workspace } });
  }),
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = idSchema.parse(req.params);
    const body = updateSchema.parse(req.body);
    const workspace = await workspaceService.update(id, body);
    res.json({ success: true, data: { workspace } });
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = idSchema.parse(req.params);
    await workspaceService.remove(id);
    res.status(204).send();
  }),
);

router.post(
  '/:id/rotate-api-key',
  asyncHandler(async (req, res) => {
    const { id } = idSchema.parse(req.params);
    const apiKey = await workspaceService.rotateApiKey(id);
    res.json({ success: true, data: { apiKey } });
  }),
);

export default router;