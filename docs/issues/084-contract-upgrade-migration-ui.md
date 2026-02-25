# #084: Contract Upgrade and Migration UI

**Category:** [FRONTEND]
**Difficulty:** ● HARD
**Tags:** `admin`, `contract-upgrade`, `soroban`, `migration`, `governance`

## Description

Add an admin panel section that allows the org admin to trigger Soroban contract upgrades and run post-upgrade data migrations. The UI should show the current deployed contract hash, the new WASM hash to upgrade to, and guide the admin through a confirmation flow that includes simulation, multi-step approval, and on-chain execution.

## Acceptance Criteria

- [ ] AdminPanel shows deployed contract ID and current WASM hash per contract.
- [ ] "Upgrade Contract" form accepts a new WASM hash and validates it against the backend registry.
- [ ] Upgrade transaction simulated before presenting the final confirm step.
- [ ] Multi-step confirmation modal with clear "what will change" diff summary.
- [ ] Post-upgrade migration script execution status shown with progress indicator.
