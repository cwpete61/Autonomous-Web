---
phase: 10
plan: 1
wave: 1
---

# 01-infra-hardening-PLAN.md

## Goal
Prepare production-grade Docker and Nginx configurations.

## Tasks
- [x] Create `docker-compose.prod.yml` with resource limits and restart policies.
- [x] Create hardened `nginx.prod.conf` with SSL, HSTS, and Gzip.
- [x] Integrate health checks for all services.

## Verification
- [x] Run `docker compose -f docker-compose.prod.yml config` to validate syntax.
- [x] Verify Nginx config includes security headers.
