# SUMMARY: Incident Management and Logging

I have implemented a centralized incident management system for Phase 8.

## Changes Made
- **IncidentsService**: Implemented `logIncident` which creates both `Incident` (summary level) and `ErrorEvent` (granular data) records.
- **IncidentsController**: Added endpoints to list open incidents and mark them as resolved.
- **HttpExceptionFilter**: Updated the global exception filter to automatically capture 500 INTERNAL SERVER ERRORs and log them as `HIGH` severity incidents with stack traces.
- **IncidentsModule**: Registered as a `@Global()` module and integrated into `AppModule`.

## Verification
- Verified that handled and unhandled errors now persist in the database.
- Verified resolution logic via `IncidentsController`.
