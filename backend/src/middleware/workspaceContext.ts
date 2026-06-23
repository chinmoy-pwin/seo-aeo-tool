import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { UnauthorizedError, NotFoundError } from '../utils/errors';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      workspaceId?: string;
      workspacePlan?: string;
    }
  }
}

/**
 * Resolves the workspace context from the `x-workspace-id` header (or
 * `x-api-key` header for programmatic access). Attaches workspaceId + plan.
 */
export async function workspaceContext(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const headerWsId = req.header('x-workspace-id');
    const apiKey = req.header('x-api-key');

    let workspace: { id: string; plan: string } | null = null;

    if (headerWsId) {
      workspace = await prisma.workspace.findUnique({
        where: { id: headerWsId },
        select: { id: true, plan: true },
      });
    } else if (apiKey) {
      workspace = await prisma.workspace.findUnique({
        where: { apiKey },
        select: { id: true, plan: true },
      });
    }

    if (!headerWsId && !apiKey) {
      return next(new UnauthorizedError('Missing x-workspace-id or x-api-key header'));
    }

    if (!workspace) {
      return next(new NotFoundError('Workspace not found for provided context'));
    }

    req.workspaceId = workspace.id;
    req.workspacePlan = workspace.plan;
    next();
  } catch (err) {
    next(err);
  }
}