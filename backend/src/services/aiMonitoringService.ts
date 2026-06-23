import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';
import { quotaService } from './quotaService';
import { enqueue } from '../queues';

export interface CreatePromptInput {
  promptText: string;
  brandName: string;
  engines: string[];
  frequency: 'daily' | 'weekly';
}

export interface UpdatePromptInput {
  promptText?: string;
  brandName?: string;
  engines?: string[];
  frequency?: 'daily' | 'weekly';
}

export const aiMonitoringService = {
  async list(workspaceId: string) {
    return prisma.brandPrompt.findMany({ where: { workspaceId }, orderBy: { createdAt: 'desc' } });
  },

  async get(workspaceId: string, id: string) {
    const prompt = await prisma.brandPrompt.findFirst({ where: { id, workspaceId } });
    if (!prompt) throw new NotFoundError('Brand prompt not found');
    return prompt;
  },

  async create(workspaceId: string, input: CreatePromptInput) {
    return prisma.brandPrompt.create({
      data: {
        workspaceId,
        promptText: input.promptText,
        brandName: input.brandName,
        engines: input.engines.join(','),
        frequency: input.frequency,
      },
    });
  },

  async update(workspaceId: string, id: string, input: UpdatePromptInput) {
    await this.get(workspaceId, id);
    return prisma.brandPrompt.update({
      where: { id },
      data: {
        ...(input.promptText !== undefined ? { promptText: input.promptText } : {}),
        ...(input.brandName !== undefined ? { brandName: input.brandName } : {}),
        ...(input.engines !== undefined ? { engines: input.engines.join(',') } : {}),
        ...(input.frequency !== undefined ? { frequency: input.frequency } : {}),
      },
    });
  },

  async remove(workspaceId: string, id: string) {
    await this.get(workspaceId, id);
    await prisma.brandPrompt.delete({ where: { id } });
  },

  async run(workspaceId: string, id: string) {
    const prompt = await this.get(workspaceId, id);
    const engines = prompt.engines.split(',').map((e) => e.trim()).filter(Boolean);
    await quotaService.check(workspaceId, 'promptsRun', engines.length);
    await quotaService.increment(workspaceId, 'promptsRun', engines.length);
    await enqueue('ai-monitor', 'run-prompt', { promptId: id, workspaceId });
  },

  async results(workspaceId: string, id: string, filters: { engine?: string; from?: string; to?: string }) {
    await this.get(workspaceId, id);
    return prisma.brandMentionResult.findMany({
      where: {
        promptId: id,
        ...(filters.engine ? { engine: filters.engine } : {}),
        ...(filters.from || filters.to
          ? {
              runAt: {
                ...(filters.from ? { gte: new Date(filters.from) } : {}),
                ...(filters.to ? { lte: new Date(filters.to) } : {}),
              },
            }
          : {}),
      },
      orderBy: { runAt: 'desc' },
    });
  },
};