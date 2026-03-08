---
phase: 5
plan: 3
wave: 2
title: Outreach & Audit Agent Processors
---

# 03-outreach-and-audit-PLAN

Implement the processors for the Audit and Outreach agents.

## Tasks

### 1. Audit Agent Processor
- [ ] Create `apps/workers/src/jobs/audit.processor.ts`
- [ ] Implement `handleAudit` to call `AuditAgent`
- [ ] Update lead status to `AUDITED` and score.

### 2. Outreach Agent Processor
- [ ] Create `apps/workers/src/jobs/outreach.processor.ts`
- [ ] Implement `handleOutreach` to call `OutreachAgent`
- [ ] Update lead status to `OUTREACH_SENT`.

### 3. Register in WorkersModule
- [ ] Add `AuditProcessor` and `OutreachProcessor` to `WorkersModule` providers.

## Verification
- [ ] Enqueue a job to `audit-queue` and verify lead becomes `AUDITED`.
- [ ] Enqueue a job to `outreach-queue` and verify email is sent (mocked).
