---
phase: 7
plan: 4
wave: 3
name: Stripe Invoices and Webhooks
---

# PLAN: Stripe Invoices and Webhooks

Integrate real Stripe SDK for billing and verify webhooks for production use.

## Tasks

### 1. Implement BillingController Invoices
Replace stubs with `stripe.checkout.sessions.create` or `stripe.invoices.create`.
<task>
Update `apps/api/src/modules/billing/billing.controller.ts` with real Stripe calls.
</task>

### 2. Implement Webhook Verification
Use `stripe.webhooks.constructEvent` with `STRIPE_WEBHOOK_SECRET` to verify signatures.
<task>
Update `apps/api/src/modules/webhooks/webhooks.controller.ts` for real signature verification.
</task>

### 3. Handle Payment Finished Events
Update database records when payments succeed.
<task>
Update `apps/api/src/modules/webhooks/webhooks.controller.ts` to handle `checkout.session.completed`.
</task>

## Verification
- [ ] Create a test checkout session and verify the URL is valid.
- [ ] Simulate a webhook event using Stripe CLI (if possible) or a mock payload.
