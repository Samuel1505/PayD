# #083: Employee Payout Claim Portal Integration

**Category:** [FRONTEND]
**Difficulty:** ● HARD
**Tags:** `employee-portal`, `soroban`, `claim`, `vesting`, `wallet`

## Description

Extend `EmployeePortal.tsx` to allow employees to claim vested tokens directly via the `vesting_escrow` contract. The portal should show each employee's claimable amounts (sourced from the contract), trigger a wallet-signed claim transaction after a simulation pre-check, and reflect the updated balance in real time after confirmation.

## Acceptance Criteria

- [ ] Employee portal fetches claimable balance from the `vesting_escrow` contract for the connected wallet.
- [ ] "Claim" button disabled if nothing is vested or wallet is disconnected.
- [ ] Claim transaction simulated and signed via `useWalletSigning` before submission.
- [ ] On-chain confirmation triggers a balance refresh and success notification.
- [ ] Claim history section lists past claims sourced from the backend event indexer.
