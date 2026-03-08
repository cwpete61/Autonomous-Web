import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AgentsService } from './agents.service';

@ApiTags('agents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('agents')
export class AgentsController {
    constructor(private readonly agentsService: AgentsService) { }

    @Get()
    @ApiOperation({ summary: 'Get status and metrics for all active agent queues' })
    getStatus() {
        return this.agentsService.getStatus();
    }
}
