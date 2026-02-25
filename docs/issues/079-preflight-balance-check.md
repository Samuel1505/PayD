# #079: Preflight Balance Check Service

**Category:** [FRONTEND]
**Difficulty:** ● MEDIUM
**Tags:** `preflight`, `balance`, `soroban`, `stellar`, `validation`

## Description

Extend the existing `useFeeEstimation` hook to run a comprehensive preflight check before any payroll submission: verify the org wallet has sufficient XLM (fees + reserves), has active trustlines for every asset in the batch, and that every employee destination account exists on-chain. Surface per-employee failures clearly in the UI before the user signs.

## Acceptance Criteria

- [ ] Preflight checks run automatically when the payroll batch is finalised.
- [ ] Per-employee rows flagged with the specific failure reason (no account, no trustline, insufficient balance).
- [ ] Overall "Ready to Submit" / "Issues Detected" status banner shown.
- [ ] User can download a CSV of failed checks.
- [ ] Checks re-run after the user resolves an issue without full page reload.
