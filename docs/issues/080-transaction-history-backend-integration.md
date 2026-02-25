# #080: Transaction History Backend Integration

**Category:** [FRONTEND]
**Difficulty:** ● MEDIUM
**Tags:** `transaction-history`, `api`, `pagination`, `backend`, `ui`

## Description

Wire `TransactionHistory.tsx` to the backend `GET /api/audit` endpoint and the contract event index (issue #077). Replace all mock/stub data with real paginated API calls. Support server-side filtering by date range, status, employee, and asset, and display contract-level events alongside classic Stellar transactions in a unified timeline.

## Acceptance Criteria

- [ ] Page fetches real data from the backend audit endpoint with pagination.
- [ ] Server-side filters applied on query param change with debounce.
- [ ] Contract events (from the indexer) merged into the timeline with a distinct badge.
- [ ] Infinite scroll or "Load More" pattern for large datasets.
- [ ] Empty state and loading skeleton implemented.
