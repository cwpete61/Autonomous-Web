import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [
        PrismaModule,
        BullModule.registerQueue(
            { name: 'research-queue' },
            { name: 'audit-queue' },
            { name: 'outreach-queue' },
        ),
    ],
    controllers: [MaintenanceController],
    providers: [MaintenanceService],
})
export class MaintenanceModule { }
