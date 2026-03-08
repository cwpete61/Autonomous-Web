---
phase: 8
plan: 4
wave: 2
name: Compliance and Access Control
---

# PLAN: Compliance and Access Control

Implement security and regulatory compliance checks for operational workflows.

## Tasks

### 1. CAN-SPAM Compliance Check
Implement a basic check in the `OutreachService` to verify presence of Unsubscribe or physical address if required.
<task>
Develop a compliance validator in `OutreachAgent`.
</task>

### 2. Admin vs Client Access Separation
Review and enforce role-based access in controllers (Guard refinements).
<task>
Update `JwtAuthGuard` and add `RolesGuard` for sensitive operational endpoints.
</task>

### 3. Log Sensitive Actions
Ensure all mutations on billing and user status are captured in `AuditLog`.
<task>
Use `AuditInterceptor` or similar on sensitive controllers.
</task>

## Verification
- [ ] Attempt to send an email missing an unsubscribe link; verify it is blocked or flagged.
- [ ] Verify a `CLIENT_VIEWER` cannot access `backups` or `incidents` endpoints.
- [ ] Check `AuditLog` records after a test mutation.
