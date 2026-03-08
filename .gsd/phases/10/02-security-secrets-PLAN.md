---
phase: 10
plan: 2
wave: 1
---

# 02-security-secrets-PLAN.md

## Goal
Implement Docker Secrets and secure credential management.

## Tasks
- [x] Create shared `secretsLoader` in `@agency/utils`.
- [x] Update `AppModule` and `WorkersModule` to use the loader.
- [x] Configure `docker-compose.prod.yml` to mount secrets.
- [x] Remove plain environment variables for sensitive data.

## Verification
- [x] Verify secrets are read from `/run/secrets` in production mode.
- [x] Verify `.env.prod.example` contains no sensitive defaults.
