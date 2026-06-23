import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';
import { encrypt } from '../utils/crypto';

export interface CreateConnectionInput {
  siteUrl: string;
  username: string;
  appPassword: string;
}

export const publishingService = {
  async list(workspaceId: string) {
    const conns = await prisma.wordPressConnection.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    });
    // Never expose the encrypted password
    return conns.map(({ appPasswordEnc, ...rest }) => rest);
  },

  async create(workspaceId: string, input: CreateConnectionInput) {
    const conn = await prisma.wordPressConnection.create({
      data: {
        workspaceId,
        siteUrl: input.siteUrl,
        username: input.username,
        appPasswordEnc: encrypt(input.appPassword),
      },
    });
    const { appPasswordEnc, ...rest } = conn;
    void appPasswordEnc;
    return rest;
  },

  async remove(workspaceId: string, id: string) {
    const conn = await prisma.wordPressConnection.findFirst({ where: { id, workspaceId } });
    if (!conn) throw new NotFoundError('WordPress connection not found');
    await prisma.wordPressConnection.delete({ where: { id } });
  },
};