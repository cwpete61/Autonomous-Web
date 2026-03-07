import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CampaignStatus } from '@agency/db';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Injectable()
export class CampaignsService {
    constructor(private prisma: PrismaService) { }

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
        await this.findOne(id);
        return this.prisma.campaign.update({
            where: { id },
            data: { status, lastRunAt: status === CampaignStatus.ACTIVE ? new Date() : undefined },
        });
    }
}
