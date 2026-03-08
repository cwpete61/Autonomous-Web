---
phase: 8
plan: 2
wave: 1
name: Maintenance Subsystem implementation
---

# PLAN: Maintenance Subsystem Implementation

Implement a maintenance service and cron infrastructure to perform operational cleanup tasks.

## Tasks

### 1. Implement MaintenanceService
Create `apps/api/src/modules/maintenance/maintenance.service.ts` to manage recurring tasks like queue retries and stale lock cleanup.
<task>
Implement the `MaintenanceService` with hooks for scheduled tasks.
</task>

### 2. Queue Retry Logic
Add logic to retry `BullMQ` jobs that have permanently failed or are stuck.
<task>
Implement `queueRetrySweep` logic in `MaintenanceService`.
</task>

### 3. Stale Data Cleanup
Add tasks to clean up orphaned assets (stored in S3 but missing from database) and expired demos.
<task>
Implement `orphanedAssetScan` and `expiredDemoCleanup`.
</task>

## Verification
- [ ] Run a maintenance sweep and verify stale records are cleaned up.
- [ ] Verify that stuck queue jobs are successfully retried.
- [ ] Verify `MaintenanceTask` records are logged in Prisma.
