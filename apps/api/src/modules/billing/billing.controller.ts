import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('billing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('billing')
export class BillingController {
    constructor(private prisma: PrismaService) { }

    @Post('proposals')
    @ApiOperation({ summary: 'Create a new proposal' })
    async createProposal(@Body() body: any) {
        // Stub implementation
        return { id: 'prop_stub_123', status: 'DRAFT', message: 'Proposal record created (stub)' };
    }

    @Post('invoices')
    @ApiOperation({ summary: 'Create a new Stripe invoice' })
    async createInvoice(@Body() body: any) {
        // Stub implementation — full Stripe call in Phase 7
        return { id: 'inv_stub_123', status: 'ISSUED', paymentLink: 'https://checkout.stripe.com/stub', message: 'Invoice created (stub)' };
    }

    @Get('invoices/:id/status')
    @ApiOperation({ summary: 'Get invoice payment status' })
    async getInvoiceStatus(@Param('id') id: string) {
        return { id, status: 'PAID', amount: 499.00 };
    }
}
