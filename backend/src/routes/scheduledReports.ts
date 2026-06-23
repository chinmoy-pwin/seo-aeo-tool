import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler';
import { workspaceContext } from '../middleware/workspaceContext';
import { scheduledReportService } from '../services/scheduledReportService';

const router = Router();
router.use(workspaceContext);

const createSchema = z.object({
  recipients: z.array(z.string().email()).min(1),
  frequency: z.enum(['weekly', 'monthly']),
  sections: z.array(z.string()).min(1),
});

const idSchema = z.object({ id: z.string().uuid() });

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const reports = await scheduledReportService.list(req.workspaceId!);
    res.json({ success: true, data: { reports } });
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = createSchema.parse(req.body);
    const report = await scheduledReportService.create(req.workspaceId!, body);
    res.status(201).json({ success: true, data: { report } });
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = idSchema.parse(req.params);
    await scheduledReportService.remove(req.workspaceId!, id);
    res.status(204).send();
  }),
);

export default router;