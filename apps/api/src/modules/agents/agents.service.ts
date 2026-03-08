import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class AgentsService {
    private readonly logger = new Logger(AgentsService.name);

    constructor(
        @InjectQueue('research-queue') private researchQueue: Queue,
        @InjectQueue('audit-queue') private auditQueue: Queue,
        @InjectQueue('enrichment-queue') private enrichmentQueue: Queue,
        @InjectQueue('outreach-queue') private outreachQueue: Queue,
        @InjectQueue('demo-queue') private demoQueue: Queue,
        @InjectQueue('build-queue') private buildQueue: Queue,
        @InjectQueue('content-queue') private contentQueue: Queue,
        @InjectQueue('sales-close-queue') private salesQueue: Queue,
        @InjectQueue('client-success-queue') private successQueue: Queue,
        @InjectQueue('error-queue') private errorQueue: Queue,
    ) { }

    async getStatus() {
        const queues = [
            { name: 'Scout Agent', queue: this.researchQueue, id: 'scout' },
            { name: 'SEO Audit Agent', queue: this.auditQueue, id: 'audit' },
            { name: 'Enrichment Agent', queue: this.enrichmentQueue, id: 'enrichment' },
            { name: 'Outreach Agent', queue: this.outreachQueue, id: 'outreach' },
            { name: 'Design Preview', queue: this.demoQueue, id: 'demo' },
            { name: 'Web Build', queue: this.buildQueue, id: 'build' },
            { name: 'Content Agent', queue: this.contentQueue, id: 'content' },
            { name: 'Sales Close', queue: this.salesQueue, id: 'sales' },
            { name: 'Client Success', queue: this.successQueue, id: 'success' },
            { name: 'Error Agent', queue: this.errorQueue, id: 'error' },
        ];

        const results = await Promise.all(
            queues.map(async (q) => {
                const counts = await q.queue.getJobCounts();
                const isPaused = await q.queue.isPaused();
                // Simple status logic: if jobs active or waiting, it's 'active'
                const status = counts.active > 0 ? 'active' : counts.waiting > 0 ? 'pending' : isPaused ? 'paused' : 'idle';

                return {
                    id: q.id,
                    name: q.name,
                    status,
                    processed: counts.completed,
                    failed: counts.failed,
                    active: counts.active,
                    waiting: counts.waiting,
                    lastRun: 'Just now', // Placeholder
                };
            }),
        );

        return results;
    }
}
