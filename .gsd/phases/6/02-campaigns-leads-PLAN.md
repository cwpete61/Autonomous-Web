---
phase: 6
plan: 2
wave: 2
name: Campaigns & Leads Sync
---

# 02-campaigns-leads-PLAN

## Goal
Replace localStorage with API calls for campaigns and leads in the dashboard.

## Tasks

### Dashboard: Campaign Sync
1. Replace `INITIAL_CAMPAIGNS` with data from `campaignsApi.list()`.
2. Update `addCampaign` to use `campaignsApi.create()`.
3. Update `handleUpdateCampaignStatus` and `handleDeleteCampaign` with API calls.
// <verify>
Observe campaign list loading from API in console.
// </verify>

### Dashboard: Leads Sync
4. Replace `SAMPLE_LEADS` / `INITIAL_CRM_CLIENTS` with data from `leadsApi.list()`.
5. Update `handleDeleteLead` and `updateLead` with API calls.
6. Fix pipeline drag-and-drop to use `leadsApi.updateStage()`.
// <verify>
Move lead on pipeline, check DB update.
// </verify>
