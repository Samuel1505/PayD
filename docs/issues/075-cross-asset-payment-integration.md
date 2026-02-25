# #075: Cross-Asset Payment UI Integration

**Category:** [FRONTEND]
**Difficulty:** ● HARD
**Tags:** `cross-asset`, `soroban`, `stellar`, `pathfind`, `ui`

## Description

Wire the existing `CrossAssetPayment.tsx` page fully to the backend and the `cross_asset_payment` contract. The page should perform real Stellar path-finding via the backend proxy, display available conversion paths, preview settlement amounts, and submit the final cross-asset payment through a signed Soroban contract invocation.

## Acceptance Criteria

- [ ] Path-finding request sent to backend on asset/amount change with debounce.
- [ ] Available conversion paths rendered as selectable options with rates.
- [ ] Settlement preview shows fee, slippage, and expected delivery amount.
- [ ] Submit triggers simulation then wallet-signed submission to the contract.
- [ ] Page shows live status updates after submission via the `SocketProvider`.
