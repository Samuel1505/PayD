#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, contracterror, contractevent,
    Address, Env, Vec, token,
};

// ── Errors ────────────────────────────────────────────────────────────────────

#[contracterror]
#[derive(Copy, Clone, Debug, PartialEq)]
#[repr(u32)]
pub enum ContractError {
    AlreadyInitialized  = 1,
    NotInitialized      = 2,
    Unauthorized        = 3,
    EmptyBatch          = 4,
    BatchTooLarge       = 5,
    InvalidAmount       = 6,
    AmountOverflow      = 7,
    SequenceMismatch    = 8,
    BatchNotFound       = 9,
    DailyLimitExceeded  = 10,
    WeeklyLimitExceeded = 11,
    MonthlyLimitExceeded = 12,
    InvalidLimitConfig  = 13,
}

// ── Events ────────────────────────────────────────────────────────────────────

#[contractevent]
pub struct BatchExecutedEvent {
    pub batch_id: u64,
    pub total_sent: i128,
}

#[contractevent]
pub struct BatchPartialEvent {
    pub batch_id: u64,
    pub success_count: u32,
    pub fail_count: u32,
}

#[contractevent]
pub struct PaymentSentEvent {
    pub recipient: Address,
    pub amount: i128,
}

#[contractevent]
pub struct PaymentSkippedEvent {
    pub recipient: Address,
    pub amount: i128,
}

#[contractevent]
pub struct TransactionBlockedEvent {
    pub account: Address,
    pub attempted_amount: i128,
    pub limit_type: LimitTier,
    pub current_usage: i128,
    pub cap: i128,
}

#[contractevent]
pub struct LimitsUpdatedEvent {
    pub account: Address,
    pub daily_limit: i128,
    pub weekly_limit: i128,
    pub monthly_limit: i128,
}

// ── Storage types ─────────────────────────────────────────────────────────────

#[contracttype]
#[derive(Clone, Debug)]
pub struct PaymentOp {
    pub recipient: Address,
    pub amount: i128,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct BatchRecord {
    pub sender: Address,
    pub token: Address,
    pub total_sent: i128,
    pub success_count: u32,
    pub fail_count: u32,
    pub status: soroban_sdk::Symbol,
}

/// Configurable limit tiers per account.
/// A cap value of 0 means "no limit" for that tier.
#[contracttype]
#[derive(Clone, Debug)]
pub struct AccountLimits {
    pub daily_limit: i128,
    pub weekly_limit: i128,
    pub monthly_limit: i128,
}

/// Tracks cumulative spending within each rolling window.
#[contracttype]
#[derive(Clone, Debug)]
pub struct AccountUsage {
    pub daily_spent: i128,
    pub daily_reset_ledger: u32,
    pub weekly_spent: i128,
    pub weekly_reset_ledger: u32,
    pub monthly_spent: i128,
    pub monthly_reset_ledger: u32,
}

/// Tier identifier used in events.
#[contracttype]
#[derive(Copy, Clone, Debug, PartialEq)]
#[repr(u32)]
pub enum LimitTier {
    Daily   = 0,
    Weekly  = 1,
    Monthly = 2,
}

#[contracttype]
pub enum DataKey {
    Admin,
    BatchCount,
    Batch(u64),
    Sequence,
    /// Per-account configurable limits
    AcctLimits(Address),
    /// Per-account rolling usage tracker
    AcctUsage(Address),
    /// Default limits applied to all accounts without overrides
    DefaultLimits,
}

const MAX_BATCH_SIZE: u32 = 100;

// Approximate ledger counts for time windows.
// Stellar closes a ledger roughly every 5 seconds.
// Daily  ≈ 86_400 / 5 = 17_280
// Weekly ≈ 7 × 17_280 = 120_960
// Monthly ≈ 30 × 17_280 = 518_400
const LEDGERS_PER_DAY: u32   = 17_280;
const LEDGERS_PER_WEEK: u32  = 120_960;
const LEDGERS_PER_MONTH: u32 = 518_400;

// ── Contract ──────────────────────────────────────────────────────────────────

#[contract]
pub struct BulkPaymentContract;

#[contractimpl]
impl BulkPaymentContract {
    pub fn initialize(env: Env, admin: Address) -> Result<(), ContractError> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(ContractError::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::BatchCount, &0u64);
        env.storage().instance().set(&DataKey::Sequence, &0u64);
        Ok(())
    }

    pub fn set_admin(env: Env, new_admin: Address) -> Result<(), ContractError> {
        Self::require_admin(&env)?;
        env.storage().instance().set(&DataKey::Admin, &new_admin);
        Ok(())
    }

    // ── Limit management (admin-only) ─────────────────────────────────────

    /// Set default limits applied to all accounts that don't have overrides.
    /// A cap of 0 means "unlimited" for that tier.
    pub fn set_default_limits(
        env: Env,
        daily: i128,
        weekly: i128,
        monthly: i128,
    ) -> Result<(), ContractError> {
        Self::require_admin(&env)?;
        Self::validate_limits(daily, weekly, monthly)?;

        let limits = AccountLimits {
            daily_limit: daily,
            weekly_limit: weekly,
            monthly_limit: monthly,
        };
        env.storage().instance().set(&DataKey::DefaultLimits, &limits);
        Ok(())
    }

    /// Override limits for a specific trusted account.
    /// A cap of 0 means "unlimited" for that tier.
    pub fn set_account_limits(
        env: Env,
        account: Address,
        daily: i128,
        weekly: i128,
        monthly: i128,
    ) -> Result<(), ContractError> {
        Self::require_admin(&env)?;
        Self::validate_limits(daily, weekly, monthly)?;

        let limits = AccountLimits {
            daily_limit: daily,
            weekly_limit: weekly,
            monthly_limit: monthly,
        };
        env.storage().persistent().set(&DataKey::AcctLimits(account.clone()), &limits);

        LimitsUpdatedEvent {
            account,
            daily_limit: daily,
            weekly_limit: weekly,
            monthly_limit: monthly,
        };

        Ok(())
    }

    /// Remove per-account overrides so the account falls back to default limits.
    pub fn remove_account_limits(env: Env, account: Address) -> Result<(), ContractError> {
        Self::require_admin(&env)?;
        env.storage().persistent().remove(&DataKey::AcctLimits(account));
        Ok(())
    }

    /// Query the effective limits for an account (per-account override or defaults).
    pub fn get_account_limits(env: Env, account: Address) -> AccountLimits {
        Self::effective_limits(&env, &account)
    }

    /// Query the current usage counters for an account.
    pub fn get_account_usage(env: Env, account: Address) -> AccountUsage {
        Self::current_usage(&env, &account)
    }

    // ── Batch execution ───────────────────────────────────────────────────

    /// All-or-nothing batch. Any failed transfer reverts the entire call.
    /// Wrap in a fee-bump transaction envelope off-chain for high-traffic scenarios.
    pub fn execute_batch(
        env: Env,
        sender: Address,
        token: Address,
        payments: Vec<PaymentOp>,
        expected_sequence: u64,
    ) -> Result<u64, ContractError> {
        sender.require_auth();
        Self::check_and_advance_sequence(&env, expected_sequence)?;

        let len = payments.len();
        if len == 0 {
            return Err(ContractError::EmptyBatch);
        }
        if len > MAX_BATCH_SIZE {
            return Err(ContractError::BatchTooLarge);
        }

        let mut total: i128 = 0;
        for op in payments.iter() {
            if op.amount <= 0 {
                return Err(ContractError::InvalidAmount);
            }
            total = total.checked_add(op.amount).ok_or(ContractError::AmountOverflow)?;
        }

        // ── Check account-level transaction limits ────────────────────────
        Self::check_limits(&env, &sender, total)?;

        let token_client = token::Client::new(&env, &token);
        token_client.transfer(&sender, &env.current_contract_address(), &total);

        for op in payments.iter() {
            token_client.transfer(&env.current_contract_address(), &op.recipient, &op.amount);
        }

        // ── Record usage after successful execution ───────────────────────
        Self::record_usage(&env, &sender, total);

        let batch_id = Self::next_batch_id(&env);
        env.storage().instance().set(&DataKey::Batch(batch_id), &BatchRecord {
            sender,
            token,
            total_sent: total,
            success_count: len,
            fail_count: 0,
            status: soroban_sdk::symbol_short!("completed"),
        });

        BatchExecutedEvent { batch_id, total_sent: total };
        Ok(batch_id)
    }

    /// Best-effort batch. Skips payments that exceed remaining balance and refunds the sender.
    pub fn execute_batch_partial(
        env: Env,
        sender: Address,
        token: Address,
        payments: Vec<PaymentOp>,
        expected_sequence: u64,
    ) -> Result<u64, ContractError> {
        sender.require_auth();
        Self::check_and_advance_sequence(&env, expected_sequence)?;

        let len = payments.len();
        if len == 0 {
            return Err(ContractError::EmptyBatch);
        }
        if len > MAX_BATCH_SIZE {
            return Err(ContractError::BatchTooLarge);
        }

        let mut total: i128 = 0;
        for op in payments.iter() {
            if op.amount > 0 {
                total = total.checked_add(op.amount).ok_or(ContractError::AmountOverflow)?;
            }
        }

        // ── Check account-level transaction limits ────────────────────────
        Self::check_limits(&env, &sender, total)?;

        let token_client = token::Client::new(&env, &token);
        let contract_addr = env.current_contract_address();
        token_client.transfer(&sender, &contract_addr, &total);

        let mut remaining = total;
        let mut success_count: u32 = 0;
        let mut fail_count: u32 = 0;
        let mut total_sent: i128 = 0;

        for op in payments.iter() {
            if op.amount <= 0 || remaining < op.amount {
                fail_count += 1;
                PaymentSkippedEvent {
                    recipient: op.recipient.clone(),
                    amount: op.amount,
                }
               ;
                continue;
            }
            token_client.transfer(&contract_addr, &op.recipient, &op.amount);
            remaining -= op.amount;
            total_sent += op.amount;
            success_count += 1;
            PaymentSentEvent {
                recipient: op.recipient.clone(),
                amount: op.amount,
            }
            ;
        }

        if remaining > 0 {
            token_client.transfer(&contract_addr, &sender, &remaining);
        }

        // ── Record usage for the amount actually sent ─────────────────────
        Self::record_usage(&env, &sender, total_sent);

        let status = if fail_count == 0 {
            soroban_sdk::symbol_short!("completed")
        } else if success_count == 0 {
            soroban_sdk::symbol_short!("rollbck")
        } else {
            soroban_sdk::symbol_short!("partial")
        };

        let batch_id = Self::next_batch_id(&env);
        env.storage().instance().set(&DataKey::Batch(batch_id), &BatchRecord {
            sender,
            token,
            total_sent,
            success_count,
            fail_count,
            status,
        });

        BatchPartialEvent { batch_id, success_count, fail_count };
        Ok(batch_id)
    }

    pub fn get_sequence(env: Env) -> u64 {
        env.storage().instance().get(&DataKey::Sequence).unwrap_or(0)
    }

    pub fn get_batch(env: Env, batch_id: u64) -> Result<BatchRecord, ContractError> {
        env.storage()
            .instance()
            .get(&DataKey::Batch(batch_id))
            .ok_or(ContractError::BatchNotFound)
    }

    pub fn get_batch_count(env: Env) -> u64 {
        env.storage().instance().get(&DataKey::BatchCount).unwrap_or(0)
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    fn require_admin(env: &Env) -> Result<(), ContractError> {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .ok_or(ContractError::NotInitialized)?;
        admin.require_auth();
        Ok(())
    }

    fn check_and_advance_sequence(env: &Env, expected: u64) -> Result<(), ContractError> {
        let current: u64 = env.storage().instance().get(&DataKey::Sequence).unwrap_or(0);
        if current != expected {
            return Err(ContractError::SequenceMismatch);
        }
        env.storage().instance().set(&DataKey::Sequence, &(current + 1));
        Ok(())
    }

    fn next_batch_id(env: &Env) -> u64 {
        let count: u64 = env
            .storage()
            .instance()
            .get(&DataKey::BatchCount)
            .unwrap_or(0)
            + 1;
        env.storage().instance().set(&DataKey::BatchCount, &count);
        count
    }

    /// Validate that limit values are non-negative.
    fn validate_limits(daily: i128, weekly: i128, monthly: i128) -> Result<(), ContractError> {
        if daily < 0 || weekly < 0 || monthly < 0 {
            return Err(ContractError::InvalidLimitConfig);
        }
        Ok(())
    }

    /// Return the effective limits for an account:
    /// per-account override > default limits > unlimited (all zeros).
    fn effective_limits(env: &Env, account: &Address) -> AccountLimits {
        // Check for per-account override first
        if let Some(limits) = env
            .storage()
            .persistent()
            .get::<DataKey, AccountLimits>(&DataKey::AcctLimits(account.clone()))
        {
            return limits;
        }
        // Fall back to default limits
        if let Some(limits) = env
            .storage()
            .instance()
            .get::<DataKey, AccountLimits>(&DataKey::DefaultLimits)
        {
            return limits;
        }
        // No limits configured → unlimited
        AccountLimits {
            daily_limit: 0,
            weekly_limit: 0,
            monthly_limit: 0,
        }
    }

    /// Return the current usage for an account, resetting any expired windows.
    fn current_usage(env: &Env, account: &Address) -> AccountUsage {
        let ledger = env.ledger().sequence();
        let mut usage: AccountUsage = env
            .storage()
            .persistent()
            .get(&DataKey::AcctUsage(account.clone()))
            .unwrap_or(AccountUsage {
                daily_spent: 0,
                daily_reset_ledger: ledger,
                weekly_spent: 0,
                weekly_reset_ledger: ledger,
                monthly_spent: 0,
                monthly_reset_ledger: ledger,
            });

        // Reset expired windows
        if ledger >= usage.daily_reset_ledger + LEDGERS_PER_DAY {
            usage.daily_spent = 0;
            usage.daily_reset_ledger = ledger;
        }
        if ledger >= usage.weekly_reset_ledger + LEDGERS_PER_WEEK {
            usage.weekly_spent = 0;
            usage.weekly_reset_ledger = ledger;
        }
        if ledger >= usage.monthly_reset_ledger + LEDGERS_PER_MONTH {
            usage.monthly_spent = 0;
            usage.monthly_reset_ledger = ledger;
        }

        usage
    }

    /// Check limits for an account before executing a batch.
    /// Emits a `TransactionBlockedEvent` and returns an error if any cap is exceeded.
    fn check_limits(env: &Env, account: &Address, amount: i128) -> Result<(), ContractError> {
        let limits = Self::effective_limits(env, account);
        let usage = Self::current_usage(env, account);

        // Daily check (0 means unlimited)
        if limits.daily_limit > 0 {
            let projected = usage.daily_spent + amount;
            if projected > limits.daily_limit {
                TransactionBlockedEvent {
                    account: account.clone(),
                    attempted_amount: amount,
                    limit_type: LimitTier::Daily,
                    current_usage: usage.daily_spent,
                    cap: limits.daily_limit,
                };
                return Err(ContractError::DailyLimitExceeded);
            }
        }

        // Weekly check
        if limits.weekly_limit > 0 {
            let projected = usage.weekly_spent + amount;
            if projected > limits.weekly_limit {
                TransactionBlockedEvent {
                    account: account.clone(),
                    attempted_amount: amount,
                    limit_type: LimitTier::Weekly,
                    current_usage: usage.weekly_spent,
                    cap: limits.weekly_limit,
                };
                return Err(ContractError::WeeklyLimitExceeded);
            }
        }

        // Monthly check
        if limits.monthly_limit > 0 {
            let projected = usage.monthly_spent + amount;
            if projected > limits.monthly_limit {
                TransactionBlockedEvent {
                    account: account.clone(),
                    attempted_amount: amount,
                    limit_type: LimitTier::Monthly,
                    current_usage: usage.monthly_spent,
                    cap: limits.monthly_limit,
                };
                return Err(ContractError::MonthlyLimitExceeded);
            }
        }

        Ok(())
    }

    /// Record cumulative spending for an account after a successful batch.
    fn record_usage(env: &Env, account: &Address, amount: i128) {
        let mut usage = Self::current_usage(env, account);
        usage.daily_spent += amount;
        usage.weekly_spent += amount;
        usage.monthly_spent += amount;
        env.storage()
            .persistent()
            .set(&DataKey::AcctUsage(account.clone()), &usage);
    }
}

#[cfg(test)]
mod test;