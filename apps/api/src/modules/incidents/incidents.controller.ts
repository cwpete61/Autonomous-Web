import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IncidentsService } from './incidents.service';

@ApiTags('incidents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('incidents')
export class IncidentsController {
    constructor(private incidentsService: IncidentsService) { }

    @Get()
    @ApiOperation({ summary: 'List all open system incidents' })
    async listIncidents() {
        return this.incidentsService.listIncidents();
    }

    @Patch(':id/resolve')
    @ApiOperation({ summary: 'Mark an incident as resolved' })
    async resolveIncident(@Param('id') id: string, @Body() body: { resolution: string }) {
        return this.incidentsService.resolveIncident(id, body.resolution);
    }
}
