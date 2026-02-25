# #078: Contract Address Registry API

**Category:** [BACKEND]
**Difficulty:** ● EASY
**Tags:** `api`, `soroban`, `registry`, `environment`, `config`

## Description

Expose a `GET /api/contracts` endpoint that returns the deployed contract IDs for all Soroban contracts (bulk_payment, vesting_escrow, revenue_split, cross_asset_payment) per network (testnet/mainnet). The frontend should consume this endpoint at startup instead of reading raw env vars, enabling hot-swappable contract deployments without frontend rebuilds.

## Acceptance Criteria

- [ ] Endpoint returns structured JSON with `contractId`, `network`, and `version` per contract.
- [ ] Values sourced from `environments.toml` or server-side env vars (not hard-coded).
- [ ] Frontend `anchor.ts` / new `contracts.ts` service fetches and caches the registry on startup.
- [ ] Adding a new contract requires only a config change, not a code change.
- [ ] Response includes `deployedAt` ledger sequence for reference.
