import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MaintenanceService } from './maintenance.service';

@ApiTags('maintenance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('maintenance')
export class MaintenanceController {
    constructor(private maintenanceService: MaintenanceService) { }

    @Post('sweep')
    @ApiOperation({ summary: 'Trigger a manual maintenance sweep' })
    async triggerSweep() {
        await this.maintenanceService.runMaintenanceSweep();
        return { message: 'Maintenance sweep initiated' };
    }
}
