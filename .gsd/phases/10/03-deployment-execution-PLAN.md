---
phase: 10
plan: 3
wave: 2
---

# 03-deployment-execution-PLAN.md

## Goal
Execute the first live deployment to a production VPS.

## Tasks
- [ ] Provision Ubuntu VPS and run `provision.sh`.
- [ ] Configure DNS A-records for the domain.
- [ ] Provision SSL certificates via Certbot.
- [ ] Initialize production secrets on the host.
- [ ] Run the first `docker compose up -d`.
- [ ] Execute Prisma migrations on the production DB.

## Verification
- [ ] Verify dashboard and API are reachable via HTTPS.
- [ ] Run health checks on the live endpoints.
- [ ] Perform an end-to-end campaign creation test on production.
