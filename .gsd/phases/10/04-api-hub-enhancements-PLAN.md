---
phase: 10
plan: 4
wave: 1
---

# 04-api-hub-enhancements-PLAN.md

## Goal
Enhance the API Integration Hub with LLM model selection and additional service providers (Instantly, Reoon).

## Tasks
### Wave 1: Data Model & Integration
- [x] Update `API_COST_MODELS` with LLM options (GPT-4 series, Claude 3.5) and their pricing.
- [x] Add `instantly` and `reoon` to `API_COST_MODELS`.
- [x] Implement `selectedModels` state in `Dashboard` to track LLM choices.
- [x] Initialize Instantly and Reoon keys from user-provided values.

### Wave 2: UI Reorganization & Components
- [x] Refactor API Hub grid to prioritize LLMs (OpenAI, Claude) in the left column.
- [x] Add model selection dropdowns to LLM cards.
- [x] Update card pricing display to reflect selected model costs dynamically.
- [x] Verify persistence of selected models in `localStorage`.

## Verification
- [x] Navigate to `/api` and verify LLMs are in the first column.
- [x] Select "GPT-4o" and verify cost changes to $0.005/lead (simulated/actual).
- [x] Select "Claude 3.5 Sonnet" and verify pricing.
- [x] Confirm Instantly and Reoon cards are present with provided keys.
