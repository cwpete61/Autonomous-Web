import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CampaignStatus, LeadStatus } from '@agency/db';

@Injectable()
export class DiagnosticsService {
    private readonly logger = new Logger(DiagnosticsService.name);

    constructor(
        private prisma: PrismaService,
        @InjectQueue('research-queue') private researchQueue: Queue
    ) { }

    async runWorkflowTest(url: string) {
        this.logger.log(`Starting workflow test diagnostic for URL: ${url}`);

        // 1. Ensure a diagnostic campaign exists
        let campaign = await this.prisma.campaign.findFirst({
            where: { name: 'SYSTEM_DIAGNOSTIC_CAMPAIGN' }
        });

        if (!campaign) {
            campaign = await this.prisma.campaign.create({
                data: {
                    name: 'SYSTEM_DIAGNOSTIC_CAMPAIGN',
                    niche: 'Diagnostic',
                    geography: 'Global',
                    status: CampaignStatus.ACTIVE,
                    sourceConfig: { diagnostic: true },
                    thresholds: { minScore: 0 }
                }
            });
        }

        // 2. Create a temporary business and lead
        const business = await this.prisma.business.create({
            data: {
                name: `Diagnostic: ${new URL(url).hostname}`,
                websiteUrl: url,
                niche: 'Diagnostic'
            }
        });

        const lead = await this.prisma.lead.create({
            data: {
                campaignId: campaign.id,
                businessId: business.id,
                status: 'DISCOVERED' as LeadStatus,
            },
            include: { business: true }
        });

        // 3. Manually enqueue to research-queue
        await this.researchQueue.add('research', lead, {
            attempts: 1, // diagnostic should be quick
            removeOnComplete: true
        });

        return {
            message: 'Diagnostic workout started',
            leadId: lead.id,
            campaignId: campaign.id
        };
    }
}
