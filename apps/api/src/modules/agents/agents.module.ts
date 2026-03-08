import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';

@Module({
    imports: [
        BullModule.registerQueue(
            { name: 'research-queue' },
            { name: 'audit-queue' },
            { name: 'qualification-queue' },
            { name: 'enrichment-queue' },
            { name: 'outreach-queue' },
            { name: 'demo-queue' },
            { name: 'build-queue' },
            { name: 'content-queue' },
            { name: 'sales-close-queue' },
            { name: 'client-success-queue' },
            { name: 'error-queue' },
        ),
    ],
    controllers: [AgentsController],
    providers: [AgentsService],
    exports: [AgentsService],
})
export class AgentsModule { }
