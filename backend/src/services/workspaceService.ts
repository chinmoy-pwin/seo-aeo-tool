import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';
import { generateApiKey } from '../utils/crypto';

export interface CreateWorkspaceInput {
  name: string;
  slug: string;
  plan?: string;
}

export interface UpdateWorkspaceInput {
  name?: string;
  plan?: string;
  whiteLabelEnabled?: boolean;
  brandingLogoUrl?: string;
}

export const workspaceService = {
  async list() {
    return prisma.workspace.findMany({ orderBy: { createdAt: 'desc' } });
  },

  async get(id: string) {
    const ws = await prisma.workspace.findUnique({ where: { id } });
    if (!ws) throw new NotFoundError('Workspace not found');
    return ws;
  },

  async create(input: CreateWorkspaceInput) {
    return prisma.workspace.create({
      data: {
        name: input.name,
        slug: input.slug,
        plan: input.plan || 'free',
        apiKey: generateApiKey(),
      },
    });
  },

  async update(id: string, input: UpdateWorkspaceInput) {
    await this.get(id);
    return prisma.workspace.update({ where: { id }, data: input });
  },

  async remove(id: string) {
    await this.get(id);
    await prisma.workspace.delete({ where: { id } });
  },

  async rotateApiKey(id: string): Promise<string> {
    await this.get(id);
    const apiKey = generateApiKey();
    await prisma.workspace.update({ where: { id }, data: { apiKey } });
    return apiKey;
  },
};