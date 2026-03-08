import { Controller, Post, Get, Body, Param, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from './stripe.service';

@ApiTags('billing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('billing')
export class BillingController {
    constructor(
        private prisma: PrismaService,
        private stripeService: StripeService
    ) { }

    @Post('proposals')
    @ApiOperation({ summary: 'Create a new proposal and checkout session' })
    async createProposal(@Body() dto: { leadId: string; amount: number; packageName: string; scope: any }) {
        const proposal = await this.prisma.proposal.create({
            data: {
                leadId: dto.leadId,
                packageName: dto.packageName,
                price: dto.amount,
                scopeJson: dto.scope,
                status: 'DRAFT',
            }
        });

        const session = await this.stripeService.createCheckoutSession({
            leadId: dto.leadId,
            amount: dto.amount,
            packageName: dto.packageName,
        });

        return {
            proposalId: proposal.id,
            checkoutUrl: session.url,
            sessionId: session.id,
        };
    }

    @Post('invoices')
    @ApiOperation({ summary: 'Create a new Stripe invoice' })
    async createInvoice(@Body() dto: { leadId: string; amount: number; description: string }) {
        const lead = await this.prisma.lead.findUnique({
            where: { id: dto.leadId },
            include: { contacts: true },
        });

        if (!lead || !lead.contacts[0]) {
            throw new HttpException('Lead or contact missing', HttpStatus.BAD_REQUEST);
        }

        const invoice = await this.prisma.invoice.create({
            data: {
                leadId: dto.leadId,
                amount: dto.amount,
                status: 'DRAFT',
            }
        });

        const stripeInvoice = await this.stripeService.createInvoice({
            customerEmail: lead.contacts[0].email,
            amount: dto.amount,
            description: dto.description,
            metadata: {
                leadId: dto.leadId,
                invoiceId: invoice.id,
            }
        });

        await this.prisma.invoice.update({
            where: { id: invoice.id },
            data: {
                status: 'ISSUED',
                externalRef: stripeInvoice.id,
                paymentLink: stripeInvoice.hosted_invoice_url,
                issuedAt: new Date(),
            }
        });

        return {
            invoiceId: invoice.id,
            status: 'ISSUED',
            paymentLink: stripeInvoice.hosted_invoice_url,
        };
    }

    @Get('invoices/:id/status')
    @ApiOperation({ summary: 'Get invoice payment status' })
    async getInvoiceStatus(@Param('id') id: string) {
        const invoice = await this.prisma.invoice.findUnique({ where: { id } });
        return { id, status: invoice?.status || 'NOT_FOUND', amount: invoice?.amount };
    }
}
