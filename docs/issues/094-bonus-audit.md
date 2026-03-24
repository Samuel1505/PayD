# #094: Build On-Chain Audit Trail for Bonuses

**Category:** [CONTRACT]
**Difficulty:** ● MEDIUM
**Tags:** `soroban`, `audit`, `events`, `bonus`, `tracking`

## Description

Create specialized events and storage structures specifically for one-off bonus payments. This separates "Regular Payroll" from "Bonuses" on the blockchain level, making it easier for tax authorities and auditors to categorize transfers.

## Acceptance Criteria

- [ ] Define a `BonusPaymentEvent` with unique identifiers.
- [ ] Implement a `tag` or `category` field in the payment operation.
- [ ] Ensure the indexing service can filter events by payment category.
- [ ] Add a `total_bonuses_paid` counter to the contract's persistent storage.
