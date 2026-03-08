---
phase: 5
plan: 6
wave: 5
title: Error Agent & Monitoring
---

# 06-error-and-monitoring-PLAN

Implement the Error Agent and centralized monitoring for Phase 5.

## Tasks

### 1. Error Agent Implementation
- [ ] Create `apps/workers/src/jobs/error.processor.ts`
- [ ] Implement cross-cutting logic to monitor all queues for failures.
- [ ] Log failures to `ErrorEvent` table.

### 2. Bull Board Monitoring
- [ ] Integrate `@bull-board/nestjs` in `CampaignsModule` or `AppModule`.
- [ ] Expose queue monitoring UI at `/api/queues`.

### 3. Campaign Launch Enqueueing
- [ ] Update `CampaignsService` to enqueue first research jobs on launch.

## Verification
- [ ] Trigger a failure in any queue and verify `ErrorAgent` captures it.
- [ ] Verify Bull Board is accessible and showing live queues.
