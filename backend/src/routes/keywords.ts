import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler';
import { workspaceContext } from '../middleware/workspaceContext';
import { keywordService } from '../services/keywordService';

const router = Router();
router.use(workspaceContext);

const createSchema = z.object({
  siteId: z.string().uuid(),
  term: z.string().min(1),
  country: z.string().max(8).optional(),
});

const idSchema = z.object({ id: z.string().uuid() });
const listQuerySchema = z.object({ siteId: z.string().uuid().optional() });

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { siteId } = listQuerySchema.parse(req.query);
    const keywords = await keywordService.list(req.workspaceId!, siteId);
    res.json({ success: true, data: { keywords } });
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = createSchema.parse(req.body);
    const keyword = await keywordService.create(req.workspaceId!, body);
    res.status(201).json({ success: true, data: { keyword } });
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = idSchema.parse(req.params);
    await keywordService.remove(req.workspaceId!, id);
    res.status(204).send();
  }),
);

export default router;