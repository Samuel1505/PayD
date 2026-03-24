# #091: Implement Graceful Revert with Refund

**Category:** [CONTRACT]
**Difficulty:** ● MEDIUM
**Tags:** `soroban`, `refund`, `revert`, `bulk-payment`, `error-handling`

## Description

Implement a "partial success" mechanism in the bulk payment contract. If one recipient in a large batch fails (e.g., trustline revoked), the entire transaction should not necessarily fail. Instead, the contract should return the funds for the failed recipient back to the employer's storage or allow for a manual refund trigger.

## Acceptance Criteria

- [ ] Add a `refund_failed_payment` function.
- [ ] Implement state tracking for individual payment statuses within a batch.
- [ ] Ensure that "all-or-nothing" execution is still an option via a flag.
- [ ] Unit tests for refund edge cases (e.g., contract balance insufficient).
