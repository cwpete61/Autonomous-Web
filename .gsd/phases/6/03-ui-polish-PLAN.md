---
phase: 6
plan: 3
wave: 3
name: Real-time UI & Polish
---

# 03-ui-polish-PLAN

## Goal
Add live agent monitoring and finalize email sequence persistence.

## Tasks

### Dashboard: Agent Monitoring
1. Implement real-time polling to `agentsApi.list()`.
2. Update agent status cards with live `status`, `lastRun`, and `jobsProcessed`.
3. Add `ErrorAgent` incidents view syncing with `GET /incidents`.
// <verify>
Verify agent count in dashboard matches Bull Board queue counts.
// </verify>

### Dashboard: Email Sequences
4. Replace `emailSequences` state with data from `emailSequencesApi.list()`.
5. Update `saveEmailSequence` to use `emailSequencesApi.create()`.
6. Update `deleteEmailSequence` with API call.
// <verify>
Observe email sequences are saved and reloaded between refresh.
// </verify>

### Verification
7. Run `npm run typecheck` in `apps/dashboard`.
8. Check `ROADMAP.md` updates.
// <verify>
Final site-wide regression.
// </verify>
