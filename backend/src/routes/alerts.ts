import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler';
import { workspaceContext } from '../middleware/workspaceContext';
import { alertService } from '../services/alertService';

const router = Router();
router.use(workspaceContext);

const idSchema = z.object({ id: z.string().uuid() });
const listQuerySchema = z.object({
  read: z
    .union([z.literal('true'), z.literal('false')])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === 'true')),
});

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { read } = listQuerySchema.parse(req.query);
    const alerts = await alertService.list(req.workspaceId!, read);
    res.json({ success: true, data: { alerts } });
  }),
);

router.put(
  '/:id/read',
  asyncHandler(async (req, res) => {
    const { id } = idSchema.parse(req.params);
    const alert = await alertService.markRead(req.workspaceId!, id);
    res.json({ success: true, data: { alert } });
  }),
);

export default router;