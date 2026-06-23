import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler';
import { workspaceContext } from '../middleware/workspaceContext';
import { backlinkService } from '../services/backlinkService';

const router = Router();
router.use(workspaceContext);

const listQuerySchema = z.object({ siteId: z.string().uuid() });

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { siteId } = listQuerySchema.parse(req.query);
    const backlinks = await backlinkService.list(req.workspaceId!, siteId);
    res.json({ success: true, data: { backlinks } });
  }),
);

export default router;