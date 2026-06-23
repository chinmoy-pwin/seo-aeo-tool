import type { Express } from 'express';
import healthRouter from './health.js';

/** Mounts all HTTP API routers under /api. */
export function registerRoutes(app: Express): void {
  app.use('/api', healthRouter);
}
