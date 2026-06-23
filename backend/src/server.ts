/**
 * Application entry — Express: config, database, middleware, API routes, graceful shutdown.
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { env } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { registerRoutes } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

async function buildApp() {
  await connectDatabase();

  const app = express();
  app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
  app.use(helmet());
  app.use(express.json());

  registerRoutes(app);
  app.use(errorHandler);

  return app;
}

async function main() {
  const app = await buildApp();
  const server = createServer(app);

  const stop = async (signal: string) => {
    logger.info({ signal }, 'Shutting down');
    try {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      });
      await disconnectDatabase();
      process.exit(0);
    } catch (e) {
      logger.error(e);
      process.exit(1);
    }
  };
  process.once('SIGTERM', () => void stop('SIGTERM'));
  process.once('SIGINT', () => void stop('SIGINT'));

  server.listen(env.PORT, env.HOST, () => {
    logger.info(`Listening on http://${env.HOST}:${env.PORT}`);
  });
}

main().catch((err) => {
  logger.error(err);
  process.exit(1);
});
