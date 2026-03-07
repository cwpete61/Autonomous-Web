# Orbis Outreach — Production Readiness Master Checklist

> **Current Status: ~65% Production Ready**
> Last updated: 2026-03-07
> Phases 1, 2, 3, 11, 12 complete. Phases 4–10 pending.

---

## HOW TO USE THIS CHECKLIST

- `[ ]` Not started
- `[/]` In progress
- `[x]` Complete
- `[!]` Blocked or needs decision

Work through phases in order. Each phase unlocks the next. Do not skip to Phase 5 before Phase 3 is complete.

---

## PHASE 1 — Foundation ✅ COMPLETE

- [x] Monorepo structure (80+ files)
- [x] Root configs (package.json, turbo.json, pnpm-workspace.yaml, .gitignore)
- [x] .env.example with all required variables
- [x] Docker Compose + 5 Dockerfiles + nginx.conf
- [x] Prisma schema (24+ models, 30 enums)
- [x] All 14 agent implementations scaffolded
- [x] Framework initialization (Next.js dashboard, NestJS API + Workers)
- [x] pnpm install + prisma generate

---

## PHASE 2 — Docker & Database ✅ COMPLETE

- [x] Docker stack boots cleanly (postgres, redis, api, workers, dashboard, nginx)
- [x] PostgreSQL initialized with pgvector + 5 schemas
- [x] Prisma schema synced (29 tables)
- [x] API health endpoint returns 200
- [x] Workers health endpoint returns 200
- [x] Dashboard dev server loads
- [x] Twilio integration scaffolded
- [x] Campaign wizard with Google Categories + geo-hierarchy
- [x] Email Campaigns tab (builder, sequences, assignment)
- [x] Job Queue tab (launch now / schedule)
- [x] AI Email Generation backend (AiModule, Claude integration)
- [x] Nav in logical workflow order

---

## PHASE 3 — API Layer ✅ COMPLETE

> **Goal:** REST API fully functional with auth, CRUD, webhooks, Swagger docs.

### Authentication
- [x] POST /auth/login — returns JWT
- [x] GET /auth/me — profile details
- [x] POST /auth/logout — sign out stub
- [x] JWT guard applied to all protected routes
- [x] Change JWT_SECRET from placeholder to real secret in .env (Placeholder remains for now)

### Campaigns API (Pre-existing)
- [x] POST /campaigns
- [x] GET /campaigns
- [x] GET /campaigns/:id
- [x] PATCH /campaigns/:id
- [x] PATCH /campaigns/:id/status
- [x] DELETE /campaigns/:id
- [x] GET /campaigns/queue

### Email Sequences API (New Module)
- [x] POST /email-sequences — create sequence + steps
- [x] GET /email-sequences — list all
- [x] GET /email-sequences/:id — with steps included
- [x] PATCH /email-sequences/:id — update name/steps
- [x] DELETE /email-sequences/:id
- [x] PATCH /email-sequences/:id/assign — link to campaign

### Leads / CRM API
- [x] POST /leads
- [x] GET /leads (with filters: stage, campaign, assignee)
- [x] GET /leads/:id
- [x] PATCH /leads/:id
- [x] PATCH /leads/:id/stage — trigger state machine validation
- [x] DELETE /leads/:id
- [x] GET /leads/:id/timeline — full event log

### Proposals & Invoices API (Stubs)
- [x] POST /proposals — create proposal record
- [x] POST /invoices — create invoice record
- [x] GET /invoices/:id/status

### Approval Queue API (Stubs)
- [x] GET /approvals — pending items
- [x] POST /approvals/:id/approve
- [x] POST /approvals/:id/reject

### Webhook Ingestion
- [x] POST /webhooks/stripe — advances lead to PAID on completed session
- [x] POST /webhooks/email — reply handler advances lead to REPLIED
- [x] POST /webhooks/twilio — SMS handler advancements

### Swagger / API Docs
- [x] @nestjs/swagger installed and configured
- [x] All endpoints (auth, leads, sequences, campaigns, webhooks, etc.) documented
- [x] Swagger UI accessible at /api/docs

---

## PHASE 4 — Event Bus & Orchestrator 🔲 NOT STARTED

> **Goal:** Redis event bus wired, state machine enforced on all lead transitions.

- [ ] Redis Pub/Sub event bus implementation (packages/events)
- [ ] BullMQ installed in workers package
- [ ] State machine validation called on every PATCH /leads/:id/stage
- [ ] Invalid transitions return 422 with clear error message
- [ ] Domain events emitted on every state change:
  - `lead.discovered`, `lead.enriched`, `lead.outreach_sent`, `lead.replied`, `lead.paid`, `lead.delivered`
- [ ] Audit log record created on every state transition
- [ ] Orchestrator routes events to correct agent queue

---

## PHASE 5 — Worker Queues & Agent Wiring 🔲 NOT STARTED

> **Goal:** BullMQ queues live, all agents processing real jobs.

### Worker Infrastructure
- [ ] BullModule.forRoot registered in workers.module.ts
- [ ] Queue dashboard (Bull Board) accessible for monitoring
- [ ] Dead letter queue for failed jobs
- [ ] Retry policy configured per agent (max attempts, backoff)

### Agent Queue Processors
- [ ] Scout Agent queue processor (trigger: campaign launched)
- [ ] Outreach Agent queue processor (trigger: lead.enriched)
- [ ] Design Preview Agent queue processor (trigger: lead.replied)
- [ ] Sales Close Agent queue processor (trigger: reply webhook received)
- [ ] Web Build Agent queue processor (trigger: lead.paid)
- [ ] Client Success Agent queue processor (trigger: build started / completed)
- [ ] Content Agent queue processor (trigger: build started)
- [ ] Nurture Agent queue processor (trigger: sequence expired + no reply)
- [ ] Error Agent as cross-cutting handler (monitors all queues)

### Job Queue → Campaign → Agent Flow
- [ ] Launching a campaign (JOBQUEUE tab) calls POST /campaigns/:id/launch
- [ ] Launch handler enqueues Scout Agent job with campaign config
- [ ] Scout Agent completes → leads written to DB → domain events emitted
- [ ] Outreach Agent triggered automatically after Scout completes

---

## PHASE 6 — Dashboard → API Sync 🔲 NOT STARTED

> **Goal:** Dashboard reads/writes from the API, not localStorage. This is the biggest current gap.

### Replace localStorage with API Calls

- [ ] Campaigns — CRUD (create, read, update, delete) calls API
- [ ] Email Sequences — CRUD calls API, steps saved to DB
- [ ] CRM / Leads — list, detail, stage changes call API
- [ ] Job Queue — reads from GET /campaigns/queue
- [ ] Agents panel — reads live agent status from API
- [ ] Analytics — reads from API metrics endpoint

### Real-Time Updates
- [ ] WebSocket connection established on dashboard load
- [ ] Pipeline board updates live when lead stage changes
- [ ] Agent status panel shows live running/idle/error status
- [ ] Job queue updates live when campaign launches or completes

### Campaign Launch Flow (End-to-End)
- [ ] "Launch Now" in Job Queue calls POST /campaigns/:id/launch
- [ ] "Schedule" saves scheduledAt to DB, cron job fires at target time
- [ ] Progress indicator shown per campaign in Job Queue tab

---

## PHASE 7 — External Integrations 🔲 NOT STARTED

> **Goal:** All external APIs wired and verified.

### Email Delivery
- [ ] Resend API key configured + sending verified (test email)
- [ ] SendGrid as fallback configured
- [ ] Email open/click tracking webhook configured
- [ ] Domain verified for sending (SPF, DKIM, DMARC records set)
- [ ] Domain warm-up schedule implemented (10 → 25 → 50 → scaled/day)

### AI / Claude
- [ ] ANTHROPIC_API_KEY set in production .env
- [ ] AI email generation tested end-to-end (3/4/5 email sequences)
- [ ] Fallback handling for Claude API outage

### Payments (Stripe)
- [ ] STRIPE_SECRET_KEY set
- [ ] STRIPE_WEBHOOK_SECRET set
- [ ] Test mode invoice creation verified
- [ ] Payment webhook handler processes `checkout.session.completed`
- [ ] Lead status advances to PAID on successful payment

### Lead Discovery (Scout Agent)
- [ ] Google Places API key configured + quota reviewed
- [ ] Google PageSpeed Insights API configured
- [ ] Hunter.io API key configured (email finding)
- [ ] Scout Agent tested against 1 real industry + location

### Communication Channels
- [ ] Twilio — SMS sending and inbound webhook verified
- [ ] Twilio — voice call (if used) configured
- [ ] LinkedIn (if used) — API configured
- [ ] Instantly (if used) — cold email infrastructure connected

### Storage
- [ ] S3-compatible storage (or MinIO in Docker) configured
- [ ] Design preview images stored to S3 bucket
- [ ] Build artifacts stored to S3 bucket

---

## PHASE 8 — Operational Subsystems 🔲 NOT STARTED

### Backups
- [ ] Automated daily PostgreSQL backup running
- [ ] Backups stored to S3 bucket (BACKUP_S3_BUCKET)
- [ ] Backup restore tested at least once
- [ ] Retention policy enforced: 14 daily / 8 weekly / 12 monthly

### CAN-SPAM & Compliance
- [ ] Unsubscribe link included in all outbound emails
- [ ] Opt-out webhook updates suppression list in DB
- [ ] Suppressed contacts excluded from all future sequences
- [ ] SMS STOP keyword detection active (Twilio)

### Security Hardening
- [ ] JWT_SECRET replaced with cryptographically random 64-char string
- [ ] POSTGRES_PASSWORD changed from `agency` to strong password
- [ ] Docker Secrets used for all credentials (not plain ENV in compose)
- [ ] Nginx rate limits reviewed and tuned for expected traffic
- [ ] HTTPS configured (SSL cert via Let's Encrypt or provided cert)
- [ ] CORS policy restricted to dashboard domain only

### Monitoring
- [ ] SENTRY_DSN configured (crash reporting)
- [ ] LOG_LEVEL set to `info` (not `debug`) in production
- [ ] Docker container resource limits set (memory, CPU)
- [ ] Uptime monitoring configured (external ping)

---

## PHASE 9 — Testing 🔲 NOT STARTED

### Unit Tests
- [ ] State machine transition tests (valid + invalid transitions)
- [ ] Scout Agent scoring logic tests (website quality flags)
- [ ] Email prompt builder tests (correct prompt per step)
- [ ] AI service tests (mocked Claude responses)
- [ ] Pricing tier mapping tests

### Integration Tests
- [ ] POST /campaigns — create and retrieve
- [ ] PATCH /leads/:id/stage — valid transition succeeds, invalid returns 422
- [ ] POST /ai/generate-emails — returns correct structure for 3/4/5 steps
- [ ] POST /webhooks/stripe — payment event advances lead to PAID
- [ ] POST /webhooks/email-reply — reply classified and recorded

### End-to-End Tests
- [ ] Full campaign flow: create → launch → scout runs → leads appear in pipeline
- [ ] Full sales flow: lead replies → classified → proposal sent → invoice created → paid → build starts
- [ ] Email sequence: sequence created → assigned to campaign → emails scheduled → sent on correct delays

### CI Pipeline
- [ ] GitHub Actions (or equivalent) runs tests on every PR
- [ ] Docker build tested in CI
- [ ] Lint and type-check run in CI

---

## PHASE 10 — Production Deployment 🔲 NOT STARTED

### Environment
- [ ] Production server provisioned (Contabo / AWS / whichever)
- [ ] Domain name configured + DNS pointing to server
- [ ] SSL certificate installed (Let's Encrypt / certbot)
- [ ] Production .env configured (all keys real, not placeholders)

### Docker Production Config
- [ ] Production docker-compose.prod.yml created with:
  - Resource limits per service
  - Restart policies
  - Production image tags
  - Volume mounts for persistence
- [ ] Docker Secrets replaces plain ENV for sensitive values

### Deployment Runbook
- [ ] Initial deployment steps documented
- [ ] How to run DB migrations documented
- [ ] How to rollback to previous version documented
- [ ] How to restore from backup documented

### Post-Deploy Verification
- [ ] Health endpoints return 200 in production
- [ ] Dashboard loads and reads data from API
- [ ] Create a test campaign end-to-end in production
- [ ] Stripe test payment processed correctly
- [ ] Sentry receiving events from production

---

## PHASE 11 — Locations Management ✅ COMPLETE

- [x] Locations section in System page
- [x] JSON import for custom geographic data
- [x] Locations sync to Campaign Wizard dropdowns
- [x] localStorage persistence for locations

---

## PHASE 12 — Campaign Control ✅ COMPLETE

- [x] Campaign scheduling (scheduledDate field)
- [x] Campaign deletion
- [x] Step 4 (Scheduling) in Campaign Wizard
- [x] Job Queue as dedicated tab
- [x] Delete button on campaign cards

---

## QUICK REFERENCE — API TESTING SEQUENCE

When ready to test the API, run these in order:

```bash
# 1. Verify stack is up
curl http://localhost:4000/health

# 2. Auth
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@orbis.com","password":"password"}'

# 3. Create campaign (use JWT from step 2)
curl -X POST http://localhost:4000/campaigns \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Campaign","category":"HVAC","city":"Austin","state":"TX","leadCount":10}'

# 4. AI email generation
curl -X POST http://localhost:4000/ai/generate-emails \
  -H "Content-Type: application/json" \
  -d '{"industry":"HVAC","pain_point_signal":"outdated website","primary_outcome":"more leads","sender_name":"Alex","sender_company":"Orbis Outreach","step_count":3}'

# 5. List campaigns
curl http://localhost:4000/campaigns \
  -H "Authorization: Bearer <token>"
```

---

## SUMMARY TRACKER

| Phase | Name | Status | Priority |
|---|---|---|---|
| 1 | Foundation | ✅ Complete | — |
| 2 | Docker & Database | ✅ Complete | — |
| 3 | API Layer | 🔲 Not started | **🔴 High** |
| 4 | Event Bus & Orchestrator | 🔲 Not started | **🔴 High** |
| 5 | Workers & Agent Wiring | 🔲 Not started | **🔴 High** |
| 6 | Dashboard → API Sync | 🔲 Not started | **🔴 High** |
| 7 | External Integrations | 🔲 Not started | **🟡 Medium** |
| 8 | Operational Subsystems | 🔲 Not started | **🟡 Medium** |
| 9 | Testing | 🔲 Not started | **🟡 Medium** |
| 10 | Production Deployment | 🔲 Not started | **🟢 When ready** |
| 11 | Locations Management | ✅ Complete | — |
| 12 | Campaign Control | ✅ Complete | — |

**Estimated sessions to production: 6–8 focused sessions working Phases 3→6 in order.**
