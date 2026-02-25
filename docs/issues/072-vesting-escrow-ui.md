# #072: Vesting Escrow Management UI

**Category:** [FRONTEND]
**Difficulty:** ● HARD
**Tags:** `vesting`, `soroban`, `escrow`, `ui`, `contract`

## Description

Build a vesting schedule management page that reads from and writes to the `vesting_escrow` Soroban contract. Admins can create new vesting grants per employee, view cliff and vesting progress, and trigger on-chain claim transactions directly from the UI.

## Acceptance Criteria

- [ ] Page lists all active vesting grants fetched from the contract.
- [ ] Progress bar reflects vested vs. unvested token amounts.
- [ ] "Claim" button invokes the contract claim entry point and shows simulation result.
- [ ] Admin form to create a new grant (start date, cliff, duration, amount) submits via signed XDR.
- [ ] Errors surfaced via the toast notification system.
