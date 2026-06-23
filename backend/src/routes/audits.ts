import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler';
import { workspaceContext } from '../middleware/workspaceContext';
import { auditService } from '../services/auditService';

const router = Router();
router.use(workspaceContext);

const createSchema = z.object({ siteId: z.string().uuid() });
const idSchema = z.object({ id: z.string().uuid() });
const listQuerySchema = z.object({ siteId: z.string().uuid().optional() });

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { siteId } = listQuerySchema.parse(req.query);
    const audits = await auditService.list(req.workspaceId!, siteId);
    res.json({ success: true, data: { audits } });
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = createSchema.parse(req.body);
    const audit = await auditService.trigger(req.workspaceId!, body.siteId);
    res.status(202).json({ success: true, data: { audit } });
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = idSchema.parse(req.params);
    const audit = await auditService.get(req.workspaceId!, id);
    res.json({ success: true, data: { audit } });
  }),
);

export default router;