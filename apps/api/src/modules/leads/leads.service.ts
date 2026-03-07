import { Injectable, UnprocessableEntityException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Lead, Prisma, LeadStatus } from '@agency/db';
import { isValidTransition } from '@agency/orchestrator';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) { }

  async findAll(filters?: { stage?: LeadStatus; campaignId?: string }) {
    const where: Prisma.LeadWhereInput = {};
    if (filters?.stage) where.status = filters.stage;
    if (filters?.campaignId) where.campaignId = filters.campaignId;

    return this.prisma.lead.findMany({
      where,
      include: { business: true },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async findOne(id: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: { business: true, audit: true, contacts: true }
    });
    if (!lead) throw new NotFoundException(`Lead ${id} not found`);
    return lead;
  }

  async create(data: any) {
    return this.prisma.lead.create({
      data,
      include: { business: true }
    });
  }

  async update(id: string, data: any) {
    return this.prisma.lead.update({
      where: { id },
      data,
      include: { business: true }
    });
  }

  async updateStage(id: string, toStage: LeadStatus) {
    const lead = await this.findOne(id);
    const fromStage = lead.status;

    if (!isValidTransition(fromStage, toStage)) {
      throw new UnprocessableEntityException(
        `Invalid transition from ${fromStage} to ${toStage}`
      );
    }

    // Use a transaction to ensure both lead update and audit log are successful
    return this.prisma.$transaction(async (tx) => {
      const updatedLead = await tx.lead.update({
        where: { id },
        data: { status: toStage },
        include: { business: true }
      });

      await tx.auditLog.create({
        data: {
          actorType: 'SYSTEM',
          action: 'STAGE_CHANGE',
          targetType: 'LEAD',
          targetId: id,
          metadata: { from: fromStage, to: toStage } as Prisma.InputJsonValue,
        }
      });

      return updatedLead;
    });
  }

  async getTimeline(id: string) {
    await this.findOne(id);
    return this.prisma.auditLog.findMany({
      where: {
        targetType: 'LEAD',
        targetId: id
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async remove(id: string) {
    return this.prisma.lead.delete({
      where: { id }
    });
  }
}
