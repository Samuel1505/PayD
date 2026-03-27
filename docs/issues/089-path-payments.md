# #089: Add Support for Asset Path Payments

**Category:** [CONTRACT]
**Difficulty:** ● HARD
**Tags:** `soroban`, `dex`, `liquidity`, `path-payment`, `cross-asset`

## Description

Integrate Stellar's path payment functionality into the Soroban payroll flow. This allows employers to fund payroll in one asset (e.g., XLM or USDC) while employees receive payment in another (e.g., a local stablecoin like ARST or NGNC), utilizing on-chain liquidity pools.

## Acceptance Criteria

- [ ] Implement logic to find optimal payment paths between source and destination assets.
- [ ] Add a `maximum_source_amount` parameter to protect employers from slippage.
- [ ] Handle partial path failures gracefully.
- [ ] Integrate with existing liquidity pool protocols on Stellar.
