import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { workspaceContext } from '../middleware/workspaceContext';
import { quotaService } from '../services/quotaService';

const router = Router();
router.use(workspaceContext);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const data = await quotaService.getUsage(req.workspaceId!);
    res.json({ success: true, data });
  }),
);

export default router;