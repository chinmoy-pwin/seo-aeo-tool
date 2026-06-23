import IORedis, { Redis } from 'ioredis';
import { env } from '../config/env';
import { logger } from '../utils/logger';

let connection: Redis | null = null;

export function getRedisConnection(): Redis | null {
  if (!env.REDIS_URL) {
    return null;
  }
  if (!connection) {
    connection = new IORedis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });
    connection.on('error', (err) => logger.error({ err }, 'Redis error'));
    connection.on('connect', () => logger.info('✅ Redis connected'));
  }
  return connection;
}

export const redisEnabled = (): boolean => Boolean(env.REDIS_URL);