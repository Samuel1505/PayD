# #071: Soroban Contract Invocation Hook

**Category:** [FRONTEND]
**Difficulty:** ● HARD
**Tags:** `soroban`, `hook`, `anchor`, `smart-contract`, `react`

## Description

Create a `useSorobanContract` React hook that abstracts direct invocations of deployed Soroban smart contracts (bulk_payment, vesting_escrow, revenue_split). The hook should handle XDR assembly, transaction signing via `useWallet`, simulation pre-flight via `transactionSimulation`, and on-chain submission with result parsing.

## Acceptance Criteria

- [ ] `useSorobanContract(contractId)` returns `invoke`, `loading`, `error`, and `result` state.
- [ ] Hook integrates `simulateTransaction` before every live submission.
- [ ] Wallet signing is delegated to `useWalletSigning`.
- [ ] On-chain result decoded and returned as typed data.
- [ ] Error states surfaced via the `useNotification` toast system.
