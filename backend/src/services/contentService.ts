import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';
import { quotaService } from './quotaService';
import { generateContent } from '../integrations/aiClient';
import { enqueue } from '../queues';

export interface GenerateInput {
  topic: string;
  language?: string;
  tone?: string;
  wordCount?: number;
}

export interface UpdateDraftInput {
  title?: string;
  body?: string;
  status?: 'draft' | 'published';
}

export const contentService = {
  async list(workspaceId: string, status?: string) {
    return prisma.contentDraft.findMany({
      where: { workspaceId, ...(status ? { status } : {}) },
      orderBy: { createdAt: 'desc' },
    });
  },

  async get(workspaceId: string, id: string) {
    const draft = await prisma.contentDraft.findFirst({ where: { id, workspaceId } });
    if (!draft) throw new NotFoundError('Content draft not found');
    return draft;
  },

  async generate(workspaceId: string, input: GenerateInput) {
    await quotaService.check(workspaceId, 'contentGenerated', 1);
    const language = input.language || 'en';
    const tone = input.tone || 'professional';
    const wordCount = input.wordCount || 600;
    const result = await generateContent(input.topic, language, tone, wordCount);
    await quotaService.increment(workspaceId, 'contentGenerated', 1);
    return prisma.contentDraft.create({
      data: {
        workspaceId,
        title: result.title,
        language,
        topic: input.topic,
        body: result.body,
        status: 'draft',
        aiDetectionScore: result.aiDetectionScore,
      },
    });
  },

  async update(workspaceId: string, id: string, input: UpdateDraftInput) {
    await this.get(workspaceId, id);
    return prisma.contentDraft.update({ where: { id }, data: input });
  },

  async remove(workspaceId: string, id: string) {
    await this.get(workspaceId, id);
    await prisma.contentDraft.delete({ where: { id } });
  },

  async publish(workspaceId: string, draftId: string, connectionId: string, status: 'draft' | 'publish') {
    const draft = await this.get(workspaceId, draftId);
    const connection = await prisma.wordPressConnection.findFirst({
      where: { id: connectionId, workspaceId },
    });
    if (!connection) throw new NotFoundError('WordPress connection not found');

    const target = await prisma.publishTarget.create({
      data: { draftId: draft.id, connectionId, status: 'pending' },
    });
    await enqueue('publish', 'publish-draft', {
      workspaceId,
      publishTargetId: target.id,
      draftId,
      connectionId,
      wpStatus: status,
    });
    return target;
  },
};