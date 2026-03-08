---
phase: 8
plan: 3
wave: 2
name: Incident Management and Logging
---

# PLAN: Incident Management and Logging

Implement central reporting for system errors and operational incidents.

## Tasks

### 1. Implement IncidentService
Create `apps/api/src/modules/incidents/incidents.service.ts` to log and categorize errors and outages.
<task>
Implement the `IncidentService` with severity classification.
</task>

### 2. Error Logger Integration
Register an error handler to capture top-level exceptions and log them to the `Incident` model.
<task>
Integrate `IncidentService` with Global exceptions handler in NestJS.
</task>

### 3. Monitoring Integration
Add basics for Sentry or similar (if configured) via environment variables.
<task>
Setup `SENTRY_DSN` support in the logging module.
</task>

## Verification
- [ ] Force an error and verify it is captured as an `Incident` in Prisma.
- [ ] Verify severity and category fields are populated correctly.
- [ ] Verify `ErrorEvent` records are also created.
