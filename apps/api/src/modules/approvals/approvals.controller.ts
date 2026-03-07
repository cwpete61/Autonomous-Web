import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { ApprovalStatus } from '@agency/db';

@ApiTags('approvals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('approvals')
export class ApprovalsController {
    constructor(private prisma: PrismaService) { }

    @Get()
    @ApiOperation({ summary: 'List all pending approvals' })
    async findAll() {
        return this.prisma.approvalRequest.findMany({
            where: { status: ApprovalStatus.PENDING },
            orderBy: { requestedAt: 'desc' },
        });
    }

    @Post(':id/approve')
    @ApiOperation({ summary: 'Approve a pending request' })
    async approve(@Param('id') id: string, @Body() body: { notes?: string }) {
        console.log(`[Approvals] Approved ${id}`);
        return { id, status: ApprovalStatus.APPROVED };
    }

    @Post(':id/reject')
    @ApiOperation({ summary: 'Reject a pending request' })
    async reject(@Param('id') id: string, @Body() body: { reason: string }) {
        console.log(`[Approvals] Rejected ${id}: ${body.reason}`);
        return { id, status: ApprovalStatus.REJECTED };
    }
}
