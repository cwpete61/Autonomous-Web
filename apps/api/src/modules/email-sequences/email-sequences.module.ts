import { Module } from '@nestjs/common';
import { EmailSequencesService } from './email-sequences.service';
import { EmailSequencesController } from './email-sequences.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [EmailSequencesController],
    providers: [EmailSequencesService],
    exports: [EmailSequencesService],
})
export class EmailSequencesModule { }
