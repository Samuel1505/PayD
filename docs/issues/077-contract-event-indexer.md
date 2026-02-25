# #077: Backend Contract Event Indexer

**Category:** [BACKEND]
**Difficulty:** ● HARD
**Tags:** `soroban`, `event-indexing`, `horizon`, `ledger`, `postgres`

## Description

Implement a background service in the Express backend that streams Soroban contract events from the Stellar RPC and persists them to PostgreSQL. Index events from `bulk_payment`, `vesting_escrow`, and `revenue_split` contracts so the frontend can query a reliable, queryable audit trail without hitting the RPC on every page load.

## Acceptance Criteria

- [ ] Background worker polls or streams contract events from the Soroban RPC.
- [ ] Events stored in a `contract_events` table with contract_id, event_type, payload, and ledger sequence.
- [ ] REST endpoint `GET /api/events/:contractId` returns paginated events.
- [ ] Duplicate events idempotently skipped on re-indexing.
- [ ] Worker restarts gracefully from the last indexed ledger sequence on crash.
