import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class MaintenanceService {
    private readonly logger = new Logger(MaintenanceService.name);

    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
        @InjectQueue('research-queue') private researchQueue: Queue,
        @InjectQueue('outreach-queue') private outreachQueue: Queue,
        @InjectQueue('audit-queue') private auditQueue: Queue,
    ) { }

    async runMaintenanceSweep() {
        const timestamp = new Date();
        this.logger.log('Starting global maintenance sweep...');

        const task = await this.prisma.maintenanceTask.create({
            data: {
                taskType: 'QUEUE_RETRY_SWEEP',
                status: 'RUNNING',
                startedAt: timestamp,
            }
        });

        try {
            await this.cleanupStaleData();
            await this.retryFailedJobs();
            
            await this.prisma.maintenanceTask.update({
                where: { id: task.id },
                data: {
                    status: 'COMPLETED',
                    finishedAt: new Date(),
                    resultJson: { message: 'Cleanup and retries completed successfully' } as any
                }
            });
            this.logger.log('Maintenance sweep completed.');
        } catch (error) {
            this.logger.error(`Maintenance sweep failed: ${error.message}`);
            await this.prisma.maintenanceTask.update({
                where: { id: task.id },
                data: {
                    status: 'FAILED',
                    finishedAt: new Date(),
                    resultJson: { error: error.message } as any
                }
            });
        }
    }

    private async cleanupStaleData() {
        this.logger.log('Cleaning up stale data...');
        // Placeholder for cleanup logic
    }

    private async retryFailedJobs() {
        this.logger.log('Checking for failed jobs to retry...');
        const queues = [this.researchQueue, this.outreachQueue, this.auditQueue];
        
        for (const queue of queues) {
            const failed = await queue.getFailed();
            for (const job of failed) {
                if (job.attemptsMade < 3) {
                    this.logger.log(`Retrying job ${job.id} in queue ${queue.name}`);
                    await job.retry();
                }
            }
        }
    }
}
