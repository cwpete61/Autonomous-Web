import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CampaignStatus } from '@agency/db';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Injectable()
export class CampaignsService {
    constructor(
        private prisma: PrismaService,
        @InjectQueue('research-queue') private researchQueue: Queue
    ) { }

    /** Create a new campaign and immediately return it. */
    async create(dto: CreateCampaignDto) {
        return this.prisma.campaign.create({
            data: {
                name: dto.name,
                niche: dto.niche,
                geography: dto.geography,
                sourceConfig: (dto.sourceConfig ?? {}) as object,
                thresholds: (dto.thresholds ?? {}) as object,
                status: dto.status ?? CampaignStatus.ACTIVE,
            },
        });
    }

    async findAll() {
        return this.prisma.campaign.findMany({
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { leads: true } } },
        });
    }

    /** Returns campaigns that are ACTIVE (ready to run immediately) or PAUSED. */
    async findQueue() {
        return this.prisma.campaign.findMany({
            where: { status: { in: [CampaignStatus.ACTIVE, CampaignStatus.PAUSED] } },
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { leads: true } } },
        });
    }

    async findOne(id: string) {
        const campaign = await this.prisma.campaign.findUnique({
            where: { id },
            include: { leads: { include: { business: true } } },
        });
        if (!campaign) throw new NotFoundException(`Campaign ${id} not found`);
        return campaign;
    }

    async update(id: string, dto: UpdateCampaignDto) {
        await this.findOne(id); // throws 404 if missing
        return this.prisma.campaign.update({
            where: { id },
            data: dto as any,
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.campaign.delete({ where: { id } });
    }

    /** Transition campaign status (start / pause / complete). */
    async updateStatus(id: string, status: CampaignStatus) {
        const campaign = await this.findOne(id);

        const updated = await this.prisma.campaign.update({
            where: { id },
            data: { status, lastRunAt: status === CampaignStatus.ACTIVE ? new Date() : undefined },
        });

        // If newly active, enqueue all leads who aren't already RESEARCHED or better
        if (status === CampaignStatus.ACTIVE) {
            const leads = await this.prisma.lead.findMany({
                where: {
                    campaignId: id,
                    status: 'DISCOVERED'
                },
                include: { business: true }
            });

            for (const lead of leads) {
                await this.researchQueue.add('research', lead, {
                    attempts: 3,
                    backoff: 5000,
                    removeOnComplete: true
                });
            }
        }

        return updated;
    }
}
