# #073: Bulk Payment Status Tracker

**Category:** [FRONTEND]
**Difficulty:** ● MEDIUM
**Tags:** `bulk-payment`, `soroban`, `status`, `real-time`, `ui`

## Description

Build a status tracker for bulk payroll runs that queries both the backend audit log and reads on-chain confirmation state from the `bulk_payment` contract. Each batch row should show its per-recipient breakdown, on-chain hash, and confirmation count streamed via the existing WebSocket provider.

## Acceptance Criteria

- [ ] Table lists each batch run with employee count and total amount.
- [ ] Per-row expansion shows per-recipient status (pending / confirmed / failed).
- [ ] Transaction hash links to Stellar Explorer.
- [ ] Real-time confirmation count updates via the `SocketProvider`.
- [ ] Failed rows trigger a retry option that re-invokes the contract.
