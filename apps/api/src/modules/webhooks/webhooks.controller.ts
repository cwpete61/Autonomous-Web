import { Controller, Post, Body, Headers, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LeadsService } from '../leads/leads.service';
import { LeadStatus } from '@agency/db';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(
    private configService: ConfigService,
    private leadsService: LeadsService,
  ) { }

  @Post('stripe')
  @ApiOperation({ summary: 'Handle Stripe webhook events' })
  async handleStripe(@Body() payload: any, @Headers('stripe-signature') signature: string) {
    // In production, verify signature with Stripe library
    console.log('[Webhook] Stripe event received:', payload.type);

    if (payload.type === 'checkout.session.completed') {
      const session = payload.data.object;
      const leadId = session.client_reference_id;

      if (leadId) {
        console.log(`[Webhook] Payment completed for lead ${leadId}. Advancing to PAID.`);
        await this.leadsService.updateStage(leadId, LeadStatus.PAID);
      }
    }

    return { received: true };
  }

  @Post('email')
  @ApiOperation({ summary: 'Handle inbound email events (replies)' })
  async handleEmail(@Body() payload: any) {
    console.log('[Webhook] Email event received:', payload);

    // Assume payload contains leadId or we can find it via email mapping
    const leadId = payload.leadId;

    if (leadId) {
      console.log(`[Webhook] Reply received for lead ${leadId}. Advancing to REPLIED.`);
      await this.leadsService.updateStage(leadId, LeadStatus.REPLIED);
    }

    return { received: true };
  }

  @Post('twilio')
  @ApiOperation({ summary: 'Handle inbound Twilio (SMS) events' })
  async handleTwilio(@Body() payload: any) {
    console.log('[Webhook] Twilio message received:', payload);

    // Twilio usually sends 'From' and 'Body'. We'd lookup the lead by phone.
    const fromPhone = payload.From;

    if (fromPhone) {
      // Stub: In a real app, find lead by phone first
      // const lead = await this.leadsService.findByPhone(fromPhone);
      // if (lead) await this.leadsService.updateStage(lead.id, LeadStatus.REPLIED);
      console.log(`[Webhook] SMS reply from ${fromPhone}. Stage update logic would trigger here.`);
    }

    return { received: true };
  }
}
