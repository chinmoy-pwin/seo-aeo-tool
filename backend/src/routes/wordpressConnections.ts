import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler';
import { workspaceContext } from '../middleware/workspaceContext';
import { publishingService } from '../services/publishingService';

const router = Router();
router.use(workspaceContext);

const createSchema = z.object({
  siteUrl: z.string().url(),
  username: z.string().min(1),
  appPassword: z.string().min(1),
});

const idSchema = z.object({ id: z.string().uuid() });

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const connections = await publishingService.list(req.workspaceId!);
    res.json({ success: true, data: { connections } });
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = createSchema.parse(req.body);
    const connection = await publishingService.create(req.workspaceId!, body);
    res.status(201).json({ success: true, data: { connection } });
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = idSchema.parse(req.params);
    await publishingService.remove(req.workspaceId!, id);
    res.status(204).send();
  }),
);

export default router;