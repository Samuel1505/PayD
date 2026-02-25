# #074: Contract-Backed Revenue Split Dashboard

**Category:** [FRONTEND]
**Difficulty:** ● HARD
**Tags:** `revenue-split`, `soroban`, `dashboard`, `analytics`, `chart`

## Description

Build a revenue split dashboard that reads allocation percentages and historical distributions directly from the `revenue_split` Soroban contract. Display live recipient balances, on-chain distribution events (indexed from the backend), and allow the org admin to update allocation weights through a signed contract call.

## Acceptance Criteria

- [ ] Pie or donut chart showing current allocation splits fetched from the contract.
- [ ] Historical distribution table sourced from the backend audit API.
- [ ] "Edit Allocations" form submits an on-chain update transaction after simulation.
- [ ] Total distributed amounts shown in org's preferred stablecoin.
- [ ] Percentage validation ensures allocations always sum to 100%.
