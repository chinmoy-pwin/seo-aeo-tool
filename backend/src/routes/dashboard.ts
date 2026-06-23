import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { workspaceContext } from '../middleware/workspaceContext';
import { dashboardService } from '../services/dashboardService';

const router = Router();
router.use(workspaceContext);

router.get(
  '/summary',
  asyncHandler(async (req, res) => {
    const summary = await dashboardService.summary(req.workspaceId!);
    res.json({ success: true, data: summary });
  }),
);

export default router;