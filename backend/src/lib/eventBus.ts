import { EventEmitter } from 'events';

export interface JobStatusEvent {
  workspaceId: string;
  jobId: string;
  status: string;
  successCount: number;
  failedCount: number;
  totalUrls: number;
}

class EventBus extends EventEmitter {}

export const eventBus = new EventBus();
eventBus.setMaxListeners(1000);

export function publishJobStatus(event: JobStatusEvent): void {
  eventBus.emit('job:status', event);
  eventBus.emit(`job:status:${event.workspaceId}`, event);
}