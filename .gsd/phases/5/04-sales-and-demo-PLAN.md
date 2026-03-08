---
phase: 5
plan: 4
wave: 3
title: Sales & Demo Agent Processors
---

# 04-sales-and-demo-PLAN

Implement the processors for Sales and Demo generation agents.

## Tasks

### 1. Sales Close Agent Processor
- [ ] Create `apps/workers/src/jobs/sales-close.processor.ts`
- [ ] Implement `handleReply` to classify and route lead.
- [ ] Update lead status based on classification (e.g., `DEMO_PENDING`).

### 2. Demo Agent Processor
- [ ] Create `apps/workers/src/jobs/demo.processor.ts`
- [ ] Implement `handleDemoRequest` to trigger demo generation.
- [ ] Update lead status to `DEMO_SENT`.

### 3. Register in WorkersModule
- [ ] Add `SalesCloseProcessor` and `DemoProcessor` to `WorkersModule`.

## Verification
- [ ] Mock a lead reply and verify `sales-close-queue` correctly enqueues a demo job.
- [ ] Verify `DEMO_SENT` status update.
