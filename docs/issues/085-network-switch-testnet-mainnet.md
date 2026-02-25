# #085: End-to-End Network Switch (Testnet ↔ Mainnet)

**Category:** [FRONTEND]
**Difficulty:** ● MEDIUM
**Tags:** `network`, `testnet`, `mainnet`, `config`, `soroban`, `provider`

## Description

Implement a network switcher that allows developers and org admins to toggle between Stellar Testnet and Mainnet at runtime. All Soroban contract IDs, Horizon URLs, and Stellar RPC endpoints must resolve dynamically from the backend contract registry (issue #078) based on the selected network. Switching networks should clear all cached state and re-initialize wallet context.

## Acceptance Criteria

- [ ] Network selector available in the admin panel and developer debug page.
- [ ] On switch, contract registry re-fetched from backend for the new network.
- [ ] Wallet context, cached balances, and socket subscriptions reset on network change.
- [ ] Testnet banner displayed prominently when on non-mainnet network.
- [ ] Network preference persisted in `localStorage`; mainnet selected by default on production builds.
