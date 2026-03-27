# Contract Storage Layout

This document provides a detailed map of the storage footprint (instance, persistent, and temporary) for the Soroban smart contracts in the PayD repository.

## 1. Bulk Payment (`contracts/bulk_payment/src/lib.rs`)

### Instance Storage
- `DataKey::Paused`: (bool) Indicates whether the contract is paused.
- `DataKey::DefaultLimits`: (`AccountLimits`) Default limits for accounts.
- `DataKey::TotalBonusesPaid`: (`i128`) Accumulator for total bonuses distributed.

### Persistent Storage
- `DataKey::Admin`: (`Address`) The admin address. Expected to have its TTL extended.
- `DataKey::BatchCount`: (`u64`) Counter for total number of batches created.
- `DataKey::Sequence`: (`u64`) A sequence number or nonce.
- `DataKey::AcctLimits(Address)`: (`AccountLimits`) Limits specific to an account.
- `DataKey::AcctUsage(Address)`: (`AccountUsage`) Tracks usage for an account.

### Temporary Storage
- `DataKey::Batch(u64)`: (`BatchRecord`) Temporary record holding batch details such as list of payments.
- `DataKey::PaymentEntry(u64, u64)`: Details of an individual payment within a batch.


## 2. Vesting Escrow (`contracts/vesting_escrow/src/lib.rs`)

### Persistent Storage
- `DataKey::Config`: (`VestingConfig`) Stores the main configuration of the vesting escrow.


## 3. Asset Path Payment (`contracts/asset_path_payment/src/lib.rs`)

### Persistent Storage
- `DataKey::Admin`: (`Address`) The admin address of the contract.
- `DataKey::PaymentCount`: (`u64`) Total count of payments processed.
- `DataKey::Payment(u64)`: Payment definitions and status.


## 4. Revenue Split (`contracts/revenue_split/src/lib.rs`)

### Persistent Storage
- `DataKey::Admin`: (`Address`) The admin address.
- `DataKey::Recipients`: (`Vec<RecipientShare>`) Definition of shares split across address recipients.


## 5. Cross Asset Payment (`contracts/cross_asset_payment/src/lib.rs`)

### Persistent Storage
- `DataKey::Admin`: (`Address`) The admin address.
- `DataKey::PaymentCount`: (`u64`) Counter for total cross asset payments.
- `DataKey::Payment(u64)`: Payment details structure.
