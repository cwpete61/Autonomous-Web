import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { DiagnosticsService } from './diagnostics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('diagnostics')
export class DiagnosticsController {
    constructor(private readonly diagnosticsService: DiagnosticsService) { }

    @UseGuards(JwtAuthGuard)
    @Post('workflow-test')
    async runWorkflowTest(@Body('url') url: string) {
        return this.diagnosticsService.runWorkflowTest(url);
    }
}
