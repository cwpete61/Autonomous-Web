---
phase: 10
plan: 5
wave: 1
---

# 05-dev-stability-PLAN.md

## Goal
Resolve `ERR_CONNECTION_REFUSED` errors in the dashboard by implementing a master connection toggle and stabilizing the API development build process.

## Tasks
### Wave 1: Dashboard Connectivity Control
- [ ] Add `masterConnect` state and localStorage persistence to `web-agency-dashboard.jsx`.
- [ ] Implement conditional "Master Connection Sync" switch in the Dashboard Header.
- [ ] Add guardian checks to `fetchData` and `pollInterval` in `web-agency-dashboard.jsx`.
- [ ] Update `api.ts` to respect the `orbis_master_sync` state and prevent unauthorized fetch attempts.

### Wave 2: API & Workers Build Stability
- [ ] Revert `webpack: true` in `nest-cli.json` for both `api` and `workers`.
- [ ] Update `package.json` start scripts to point to the correct monorepo output paths:
    - API: `dist/apps/api/src/main`
    - Workers: `dist/apps/workers/src/main`
- [ ] Verify `npm run dev` starts all components cleanly without port conflicts or module errors.

## Verification
- [ ] Start `npm run dev` and confirm Dashboard, API, and Workers all report healthy status.
- [ ] Toggle the "Master Sync" switch OFF and verify browser Network tab shows no active polling.
- [ ] Confirm no `ERR_CONNECTION_REFUSED` errors appear in the console when sync is disabled.
