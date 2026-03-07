import { Module } from '@nestjs/common';
import { ApprovalsController } from './approvals.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [ApprovalsController],
})
export class ApprovalsModule { }
