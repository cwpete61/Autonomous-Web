---
phase: 7
plan: 3
wave: 2
name: Outreach Agent Resend & Anthropic Integration
---

# PLAN: Outreach Agent Resend & Anthropic Integration

Implement real email sending and AI generation in `OutreachAgent`.

## Tasks

### 1. Implement _sendViaResend
Replace stub with `api.resend.com/emails` POST call.
<task>
Update `packages/agents/outreach-agent/outreach-agent.js` with Resend API.
</task>

### 2. Implement callClaude (AI Generation)
Ensure `callClaude` in `OutreachAgent` uses the latest models and provided keys.
<task>
Update `packages/agents/outreach-agent/outreach-agent.js` to use models `claude-3-5-sonnet-latest`.
</task>

### 3. Verify Email Delivery
<task>
Create a test script `tmp/test-email.ts` to send a test email via Resend.
</task>

## Verification
- [ ] Receive test email in inbox.
- [ ] Log AI generated email body for a fake lead.
