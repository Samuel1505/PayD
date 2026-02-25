# #076: Wallet Session Persistence and Auto-Reconnect

**Category:** [FRONTEND]
**Difficulty:** ● MEDIUM
**Tags:** `wallet`, `session`, `freighter`, `provider`, `ux`

## Description

Extend `WalletProvider.tsx` to persist the last connected wallet name in `localStorage` and silently attempt reconnection on page load. If the wallet extension is unavailable, show a persistent banner instead of silently failing. Guard all contract invocations against a disconnected state.

## Acceptance Criteria

- [ ] Last wallet name persisted in `localStorage` and restored on load.
- [ ] Silent reconnection attempted before rendering protected pages.
- [ ] Banner displayed when wallet extension not detected.
- [ ] All Soroban invoke calls behind a `requireWallet` guard that prompts connect if needed.
- [ ] `isConnecting` state correctly reflects the reconnection attempt.
