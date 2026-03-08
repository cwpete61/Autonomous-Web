---
phase: 8
plan: 1
wave: 1
name: Automated PostgreSQL Backups
---

# PLAN: Automated PostgreSQL Backups

Implement a service and cron job to back up the PostgreSQL database to local storage and S3.

## Tasks

### 1. Implement BackupService
Create `apps/api/src/modules/backups/backups.service.ts` to execute `pg_dump`.
<task>
Develop `BackupsService` using `child_process.exec` for `pg_dump`.
</task>

### 2. S3 Integration for Backups
Stream the backup files to the configured S3 bucket (`BACKUP_S3_BUCKET`).
<task>
Implement S3 upload in `BackupsService`.
</task>

### 3. Backup Database Records
Store `BackupJob` records in Prisma for tracking and auditing.
<task>
Sync backup results with the `BackupJob` model.
</task>

## Verification
- [ ] Run a manual backup and verify the file exists on local disk.
- [ ] Verify the file is uploaded to the S3 bucket.
- [ ] Verify a `BackupJob` record is created with `COMPLETED` status.
