import { Module } from '@nestjs/common';
import { DiagnosticsService } from './diagnostics.service';
import { DiagnosticsController } from './diagnostics.controller';
import { BullModule } from '@nestjs/bull';
import { LeadsModule } from '../leads/leads.module';
import { BusinessesModule } from '../businesses/businesses.module';
import { CampaignsModule } from '../campaigns/campaigns.module';

@Module({
    imports: [
        BullModule.registerQueue({ name: 'research-queue' }),
        LeadsModule,
        BusinessesModule,
        CampaignsModule,
    ],
    controllers: [DiagnosticsController],
    providers: [DiagnosticsService],
})
export class DiagnosticsModule { }
