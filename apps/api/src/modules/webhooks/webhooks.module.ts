import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { LeadsModule } from '../leads/leads.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [LeadsModule, PrismaModule],
  controllers: [WebhooksController],
})
export class WebhooksModule { }
