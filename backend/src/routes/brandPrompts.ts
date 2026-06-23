import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler';
import { workspaceContext } from '../middleware/workspaceContext';
import { aiMonitoringService } from '../services/aiMonitoringService';

const router = Router();
router.use(workspaceContext);

const engineEnum = z.enum(['chatgpt', 'gemini', 'claude']);

const createSchema = z.object({
  promptText: z.string().min(1),
  brandName: z.string().min(1),
  engines: z.array(engineEnum).min(1),
  frequency: z.enum(['daily', 'weekly']),
});

const updateSchema = z.object({
  promptText: z.string().min(1).optional(),
  brandName: z.string().min(1).optional(),
  engines: z.array(engineEnum).min(1).optional(),
  frequency: z.enum(['daily', 'weekly']).optional(),
});

const idSchema = z.object({ id: z.string().uuid() });
const resultsQuerySchema = z.object({
  engine: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const prompts = await aiMonitoringService.list(req.workspaceId!);
    res.json({ success: true, data: { prompts } });
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = createSchema.parse(req.body);
    const prompt = await aiMonitoringService.create(req.workspaceId!, body);
    res.status(201).json({ success: true, data: { prompt } });
  }),
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = idSchema.parse(req.params);
    const body = updateSchema.parse(req.body);
    const prompt = await aiMonitoringService.update(req.workspaceId!, id, body);
    res.json({ success: true, data: { prompt } });
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = idSchema.parse(req.params);
    await aiMonitoringService.remove(req.workspaceId!, id);
    res.status(204).send();
  }),
);

router.post(
  '/:id/run',
  asyncHandler(async (req, res) => {
    const { id } = idSchema.parse(req.params);
    await aiMonitoringService.run(req.workspaceId!, id);
    res.status(202).json({ success: true, data: { queued: true } });
  }),
);

router.get(
  '/:id/results',
  asyncHandler(async (req, res) => {
    const { id } = idSchema.parse(req.params);
    const query = resultsQuerySchema.parse(req.query);
    const results = await aiMonitoringService.results(req.workspaceId!, id, query);
    res.json({ success: true, data: { results } });
  }),
);

export default router;