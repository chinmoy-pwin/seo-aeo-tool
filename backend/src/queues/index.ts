import { Queue } from 'bullmq';
import { getRedisConnection, redisEnabled } from '../lib/redis';
import { logger } from '../utils/logger';

export type QueueName = 'index' | 'ai-monitor' | 'audit' | 'content' | 'publish' | 'report';

const queues = new Map<QueueName, Queue>();

/**
 * In-process fallback handlers registered when Redis is not configured.
 * Workers register their processors here so jobs run synchronously (async) inline.
 */
type InlineHandler = (data: any) => Promise<void>;
const inlineHandlers = new Map<QueueName, InlineHandler>();

export function registerInlineHandler(name: QueueName, handler: InlineHandler): void {
  inlineHandlers.set(name, handler);
}

export function getQueue(name: QueueName): Queue | null {
  if (!redisEnabled()) return null;
  if (!queues.has(name)) {
    const conn = getRedisConnection();
    if (!conn) return null;
    queues.set(name, new Queue(name, { connection: conn }));
  }
  return queues.get(name)!;
}

/**
 * Enqueue a job. If Redis is available, push to BullMQ; otherwise run the
 * registered inline handler asynchronously (fire-and-forget on next tick).
 */
export async function enqueue(name: QueueName, jobName: string, data: any): Promise<void> {
  const queue = getQueue(name);
  if (queue) {
    await queue.add(jobName, data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: 100,
      removeOnFail: 200,
    });
    return;
  }
  // Inline fallback
  const handler = inlineHandlers.get(name);
  if (handler) {
    setImmediate(() => {
      handler(data).catch((err) => logger.error({ err, name, jobName }, 'Inline job failed'));
    });
  } else {
    logger.warn({ name, jobName }, 'No queue/inline handler available; job dropped');
  }
}

export async function closeQueues(): Promise<void> {
  for (const q of queues.values()) {
    await q.close();
  }
}