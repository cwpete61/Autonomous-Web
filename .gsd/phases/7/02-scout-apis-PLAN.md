---
phase: 7
plan: 2
wave: 2
name: Scout Agent External API Integration
---

# PLAN: Scout Agent External API Integration

Implement real API calls in `ScoutAgent` for lead discovery and enrichment.

## Tasks

### 1. Implement searchBusinesses (Google Places)
Replace `_mockBusinessSearch` stub with a real call to the Google Places Text Search API.
<task>
Update `packages/agents/scout-agent/scout-agent.js` with Google Places API call.
</task>

### 2. Implement checkPageSpeed (Google PageSpeed)
Replace simple random score with real call to `pagespeedonline/v5/runPagespeed`.
<task>
Update `packages/agents/scout-agent/scout-agent.js` with PageSpeed Insights API.
</task>

### 3. Implement findEmail (Hunter.io)
Replace stub email generation with real call to `api.hunter.io/v2/domain-search`.
<task>
Update `packages/agents/scout-agent/scout-agent.js` with Hunter.io API.
</task>

## Verification
- [ ] Log the results of a real (or mock HTTP) search in a scratch script.
- [ ] Verify error handling for invalid API keys.
