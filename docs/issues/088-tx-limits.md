# #088: Implement Account-Level Transaction Limits

**Category:** [CONTRACT]
**Difficulty:** ● MEDIUM
**Tags:** `soroban`, `security`, `compliance`, `limits`, `aml`

## Description

Implement on-chain rate limiting and transaction amount caps at the account level. This provides an additional layer of security and compliance, preventing unusually large or frequent transfers that could indicate fraud or system misuse.

## Acceptance Criteria

- [ ] Define configurable limit tiers (e.g., Daily, Weekly, Monthly caps).
- [ ] Implement a `check_limits` function called before every execution.
- [ ] Add administrative functions to override or adjust limits for specific trusted accounts.
- [ ] Emit events when a transaction is blocked due to limit violations.
