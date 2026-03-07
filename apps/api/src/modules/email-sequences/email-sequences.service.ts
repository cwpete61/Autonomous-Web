import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmailSequenceDto } from './dto/create-email-sequence.dto';
import { UpdateEmailSequenceDto } from './dto/update-email-sequence.dto';

@Injectable()
export class EmailSequencesService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateEmailSequenceDto) {
        const { steps, assignedCampaignId, ...rest } = dto;

        return this.prisma.emailSequence.create({
            data: {
                ...rest,
                steps: {
                    create: steps.map((step) => ({
                        stepNumber: step.stepNumber,
                        delayDays: step.delayDays,
                        subject: step.subject,
                        body: step.body,
                    })),
                },
                campaigns: assignedCampaignId
                    ? { connect: { id: assignedCampaignId } }
                    : undefined,
            },
            include: { steps: true, campaigns: true },
        });
    }

    async findAll(campaignId?: string) {
        return this.prisma.emailSequence.findMany({
            where: campaignId
                ? { campaigns: { some: { id: campaignId } } }
                : undefined,
            include: { steps: true, _count: { select: { campaigns: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const sequence = await this.prisma.emailSequence.findUnique({
            where: { id },
            include: { steps: { orderBy: { stepNumber: 'asc' } }, campaigns: true },
        });

        if (!sequence) {
            throw new NotFoundException(`Email Sequence with ID ${id} not found`);
        }

        return sequence;
    }

    async update(id: string, dto: UpdateEmailSequenceDto) {
        const { steps, assignedCampaignId, ...rest } = dto;

        // If steps are provided, we replace all existing steps for simplicity in this version
        if (steps) {
            await this.prisma.emailStep.deleteMany({ where: { sequenceId: id } });
        }

        return this.prisma.emailSequence.update({
            where: { id },
            data: {
                ...rest,
                steps: steps
                    ? {
                        create: steps.map((step) => ({
                            stepNumber: step.stepNumber,
                            delayDays: step.delayDays,
                            subject: step.subject,
                            body: step.body,
                        })),
                    }
                    : undefined,
                campaigns: assignedCampaignId
                    ? { set: [{ id: assignedCampaignId }] } // Replaces current assignments
                    : undefined,
            },
            include: { steps: true, campaigns: true },
        });
    }

    async assignToCampaign(id: string, campaignId: string | null) {
        await this.findOne(id); // Ensure sequence exists

        return this.prisma.emailSequence.update({
            where: { id },
            data: {
                campaigns: campaignId
                    ? { set: [{ id: campaignId }] }
                    : { set: [] }
            },
            include: { campaigns: true }
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.emailSequence.delete({ where: { id } });
    }
}
