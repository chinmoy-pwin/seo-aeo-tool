import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export interface CreateReportInput {
  recipients: string[];
  frequency: 'weekly' | 'monthly';
  sections: string[];
}

export const scheduledReportService = {
  async list(workspaceId: string) {
    return prisma.scheduledReport.findMany({ where: { workspaceId } });
  },

  async create(workspaceId: string, input: CreateReportInput) {
    return prisma.scheduledReport.create({
      data: {
        workspaceId,
        recipients: input.recipients.join(','),
        frequency: input.frequency,
        sections: input.sections as any,
      },
    });
  },

  async remove(workspaceId: string, id: string) {
    const report = await prisma.scheduledReport.findFirst({ where: { id, workspaceId } });
    if (!report) throw new NotFoundError('Scheduled report not found');
    await prisma.scheduledReport.delete({ where: { id } });
  },
};