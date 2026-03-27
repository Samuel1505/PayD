# Pull Request

## Description

This PR resolves several issues related to smart contract documentation and workflow simulation/pre-flight optimizations.
- Resolves #175: Document Contract Storage Layout
- Resolves #172: Add Wallet Connection Timeout Logic
- Resolves #169: Implement Payout Simulation Preflight
- Resolves #170: Add 'Network Switcher' Support in UI

## Changes Made
- **Docs:** Added `docs/CONTRACT_STORAGE_LAYOUT.md` to map the contract instance, persistent, and temporary storage footprints for Soroban Contracts (`bulk_payment`, `vesting_escrow`, `asset_path_payment`, `revenue_split`, and `cross_asset_payment`).
- **Wallet Connection Strategy:** Added a 15-second timeout logic in `WalletProvider.tsx` (`connectWithWallet`) when requesting Freighter or Albedo `kit.getAddress()`. Fails gracefully throwing a connection timeout error.
- **Simulation Preflight:** Included preflight check with `simulateTransaction` before triggering any transaction signature prompts via `useWalletSigning()`, preventing wasted fees and failing immediately when validation errors occur.
- **Network Switcher:** Created a simple network switcher tab in the `<AppNav />` UI header to easily toggle the `StellarWalletsKit` network context between `TESTNET` and `PUBLIC` for easy DevNet/Mainnet switching.

## Verification
- Verified wallet switching and connection timeouts reflect in the global app states properly and render intuitive errors.
- Verified simulation effectively catches malformed or unfunded distributions before a wallet signature prompt happens.
