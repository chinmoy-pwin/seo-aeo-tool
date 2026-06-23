import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler';
import { workspaceContext } from '../middleware/workspaceContext';
import { contentService } from '../services/contentService';

const router = Router();
router.use(workspaceContext);

const generateSchema = z.object({
  topic: z.string().min(1),
  language: z.string().max(10).optional(),
  tone: z.string().optional(),
  wordCount: z.number().int().positive().max(5000).optional(),
});

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  body: z.string().min(1).optional(),
  status: z.enum(['draft', 'published']).optional(),
});

const publishSchema = z.object({
  connectionId: z.string().uuid(),
  status: z.enum(['draft', 'publish']),
});

const idSchema = z.object({ id: z.string().uuid() });
const listQuerySchema = z.object({ status: z.string().optional() });

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { status } = listQuerySchema.parse(req.query);
    const drafts = await contentService.list(req.workspaceId!, status);
    res.json({ success: true, data: { drafts } });
  }),
);

router.post(
  '/generate',
  asyncHandler(async (req, res) => {
    const body = generateSchema.parse(req.body);
    const draft = await contentService.generate(req.workspaceId!, body);
    res.status(201).json({ success: true, data: { draft } });
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = idSchema.parse(req.params);
    const draft = await contentService.get(req.workspaceId!, id);
    res.json({ success: true, data: { draft } });
  }),
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = idSchema.parse(req.params);
    const body = updateSchema.parse(req.body);
    const draft = await contentService.update(req.workspaceId!, id, body);
    res.json({ success: true, data: { draft } });
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = idSchema.parse(req.params);
    await contentService.remove(req.workspaceId!, id);
    res.status(204).send();
  }),
);

router.post(
  '/:id/publish',
  asyncHandler(async (req, res) => {
    const { id } = idSchema.parse(req.params);
    const body = publishSchema.parse(req.body);
    const publishTarget = await contentService.publish(req.workspaceId!, id, body.connectionId, body.status);
    res.status(202).json({ success: true, data: { publishTarget } });
  }),
);

export default router;