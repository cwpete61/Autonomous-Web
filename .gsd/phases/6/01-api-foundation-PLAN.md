---
phase: 6
plan: 1
wave: 1
name: API Foundation & Agent Status
---

# 01-api-foundation-PLAN

## Goal
Establish the backend agent status service and update the frontend API client.

## Tasks

### Backend: Agents & Status Module
1. Create `AgentsModule`, `AgentsService`, and `AgentsController` in `apps/api`.
2. Register all agent queues in `AgentsModule`.
3. Implement `getJobCounts()` and `getStatus()` in `AgentsService`.
// <verify>
curl http://localhost:4000/agents
// </verify>

### Frontend: API Client Update
4. Update `apps/dashboard/src/lib/api.ts` with `agentsApi`.
5. Fix `API_BASE_URL` to point to port 4000.
// <verify>
Check api.ts content matches port 4000.
// </verify>
