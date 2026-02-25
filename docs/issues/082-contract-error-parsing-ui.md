# #082: Contract Error Parsing and UI Display

**Category:** [FRONTEND]
**Difficulty:** ● MEDIUM
**Tags:** `error-handling`, `soroban`, `xdr`, `ux`, `contract`

## Description

Implement a dedicated contract error parser that decodes Soroban invocation failures from XDR result codes into human-readable messages, matching the pattern established in `transactionSimulation.ts`. Render these structured errors in a collapsible error panel on any page that invokes a Soroban contract, replacing generic "Transaction Failed" toasts.

## Acceptance Criteria

- [ ] `parseContractError(resultXdr)` utility function decodes known contract error codes.
- [ ] Error panel component shows error code, human-readable description, and suggested action.
- [ ] Panel used consistently across PayrollScheduler, CrossAssetPayment, and vesting UI.
- [ ] Unknown error codes fall back to raw XDR display with a copy button.
- [ ] Integration tests cover all mapped error codes.
