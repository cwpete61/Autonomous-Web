import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { RedisEventBus, EVENTS, DomainEvent } from '@agency/events';
import { OrchestratorService } from '@agency/orchestrator';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class WorkflowListener implements OnModuleInit {
    private readonly logger = new Logger(WorkflowListener.name);

    constructor(
        private readonly eventBus: RedisEventBus,
        private readonly orchestrator: OrchestratorService,
        @InjectQueue('research-queue') private researchQueue: Queue,
        @InjectQueue('audit-queue') private auditQueue: Queue,
        @InjectQueue('qualification-queue') private qualificationQueue: Queue,
        @InjectQueue('enrichment-queue') private enrichmentQueue: Queue,
        @InjectQueue('outreach-queue') private outreachQueue: Queue,
        @InjectQueue('demo-queue') private demoQueue: Queue,
        @InjectQueue('build-queue') private buildQueue: Queue,
        @InjectQueue('content-queue') private contentQueue: Queue,
        @InjectQueue('sales-close-queue') private salesQueue: Queue,
        @InjectQueue('client-success-queue') private successQueue: Queue,
    ) { }

    async onModuleInit() {
        this.logger.log('Initializing WorkflowListener: Subscribing to EVENTS');

        await this.eventBus.subscribe(EVENTS.LEAD_STATUS_CHANGED, async (event: DomainEvent) => {
            await this.handleLeadStatusChange(event);
        });

        await this.eventBus.subscribe(EVENTS.LEAD_CREATED, async (event: DomainEvent) => {
            await this.handleLeadCreated(event);
        });
    }

    private async handleLeadCreated(event: DomainEvent) {
        this.logger.log(`New lead created: ${event.payload.id || event.payload.leadId}. Routing to initial processing.`);
        const lead = event.payload.lead || event.payload;
        await this.researchQueue.add('process', lead, {
            jobId: `research-${lead.id}-${Date.now()}`,
            removeOnComplete: true,
        });
    }

    private async handleLeadStatusChange(event: DomainEvent) {
        const { leadId, to, lead } = event.payload;
        this.logger.log(`Handling status change for lead ${leadId}: ${to}`);

        const queueName = this.orchestrator.getQueueForStatus(to);
        if (!queueName) return;

        const queueMap: Record<string, Queue> = {
            'research-queue': this.researchQueue,
            'audit-queue': this.auditQueue,
            'qualification-queue': this.qualificationQueue,
            'enrichment-queue': this.enrichmentQueue,
            'outreach-queue': this.outreachQueue,
            'demo-queue': this.demoQueue,
            'build-queue': this.buildQueue,
            'content-queue': this.contentQueue,
            'sales-close-queue': this.salesQueue,
            'client-success-queue': this.successQueue,
        };

        const targetQueue = queueMap[queueName];
        if (targetQueue) {
            this.logger.log(`Routing lead ${leadId} to ${queueName}`);
            
            // Map the process name if needed, but most use 'process'
            let processName = 'process';
            if (queueName === 'client-success-queue') {
                // Determine if onboarding or delivery
                processName = to === 'REVIEW_PENDING' ? 'deliver' : 'onboard';
            }

            await targetQueue.add(processName, lead, {
                jobId: `${queueName}-${leadId}-${Date.now()}`,
                removeOnComplete: true,
            });
        }
    }
}
