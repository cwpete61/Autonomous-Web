---
phase: 7
plan: 1
wave: 1
name: API Keys and Environment Configuration
---

# PLAN: API Keys and Environment Configuration

Configure the root `.env` file with all required external API keys and ensure the application can read them correctly.

## Tasks

### 1. Update .env with external keys
Add placeholders for all required keys in the root `.env` file if they don't exist.

<task>
Update `.env` with:
- ANTHROPIC_API_KEY
- RESEND_API_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- GOOGLE_PLACES_API_KEY
- GOOGLE_PAGESPEED_API_KEY
- HUNTER_API_KEY
</task>

### 2. Verify Config Loading
Ensure `@agency/config` (or the NestJS ConfigModule) is correctly picking up these variables.

<task>
Check `apps/api/src/modules/ai/ai.service.ts` to see how it accesses `ANTHROPIC_API_KEY`.
</task>

## Verification
- [ ] Run `npm run typecheck` in `apps/api`
- [ ] Log config keys (masked) on startup to verify loading
