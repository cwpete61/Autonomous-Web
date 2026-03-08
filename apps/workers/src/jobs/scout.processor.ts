import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { BaseProcessor } from './base.processor';
import { ScoutAgent } from '@agency/agents';
import { PrismaService } from '@agency/db';
import { RedisEventBus, EVENTS } from '@agency/events';

@Processor('research-queue')
export class ScoutProcessor extends BaseProcessor {
    private readonly scoutAgent: ScoutAgent;

    constructor(
        private readonly prisma: PrismaService,
        private readonly eventBus: RedisEventBus,
    ) {
        super(ScoutProcessor.name);
        this.scoutAgent = new ScoutAgent();
    }

    @Process('process')
    async handleResearch(job: Job<any>) {
        const { id: leadId, ...data } = job.data;
        this.logger.log(`Starting research for lead: ${leadId}`);

        try {
            this.reportProgress(job, 10);

            // Call the agent's research logic
            const results = await this.scoutAgent.evaluateBusiness(data);

            this.reportProgress(job, 70);

            // Update lead and create audit log
            const lead = await this.prisma.lead.update({
                where: { id: leadId },
                data: {
                    status: 'RESEARCHED',
                    qualificationScore: results.qualityScore,
                    discoveryNotes: results.redesignPitch,
                },
                include: { business: true }
            });

            await this.prisma.auditLog.create({
                data: {
                    actorType: 'AGENT',
                    action: 'LEAD_RESEARCH_COMPLETED',
                    targetType: 'LEAD',
                    targetId: leadId,
                    metadata: {
                        agent: 'ScoutAgent',
                        qualityScore: results.qualityScore,
                        issues: results.issues
                    }
                }
            });

            // Emit status change event to trigger next stage in WorkflowListener
            await this.eventBus.publish({
                eventType: EVENTS.LEAD_STATUS_CHANGED,
                timestamp: new Date().toISOString(),
                correlationId: `scout-${leadId}-${Date.now()}`,
                actorType: 'AGENT',
                payload: {
                    leadId,
                    from: 'DISCOVERED',
                    to: 'RESEARCHED',
                    lead,
                },
            });

            this.reportProgress(job, 100);
            this.logger.log(`Research completed and event emitted for lead: ${leadId}`);

            return results;
        } catch (error) {
            this.handleFailure(job, error);
            throw error;
        }
    }
}
