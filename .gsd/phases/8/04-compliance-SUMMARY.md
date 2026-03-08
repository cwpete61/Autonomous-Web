# SUMMARY: Compliance and Access Control

I have implemented security and compliance measures for Phase 8.

## Changes Made
- **RolesGuard**: Implemented a RBAC guard to enforce permissions across operational endpoints. Added `Roles` decorator for declarative access control.
- **OutreachAgent Compliance**: Added `validateCompliance` logic to ensure cold emails include unsubscribe links and physical addresses.
- **AuditInterceptor**: Implemented a global interceptor to log all mutations (POST/PATCH/PUT/DELETE) to the `AuditLog` table for accountability.
- **AppModule Integration**: Registered the global `AuditInterceptor` and the `RolesGuard`.

## Verification
- Verified CAN-SPAM failure when unsubscribe links are missing.
- Verified mutation logging in `AuditLog` for test API calls.
- Verified access rejection for unauthorized roles.
