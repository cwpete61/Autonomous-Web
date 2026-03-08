import { Module } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CampaignsController } from './campaigns.controller';
import { BullModule } from '@nestjs/bull';

@Module({
    imports: [
        BullModule.registerQueue({ name: 'research-queue' }),
    ],
    controllers: [CampaignsController],
    providers: [CampaignsService],
    exports: [CampaignsService],
})
export class CampaignsModule { }
