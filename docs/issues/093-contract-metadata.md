# #093: Implement Contract Metadata (SEP-0034)

**Category:** [CONTRACT]
**Difficulty:** ● EASY
**Tags:** `soroban`, `metadata`, `sep-0034`, `explorer`, `standardization`

## Description

Implement the SEP-0034 standard for on-chain contract metadata. This includes providing the contract's name, version, and author in a standardized way so that Stellar explorers (like Stellar.Expert or Laboratory) can display rich information about the contract.

## Acceptance Criteria

- [ ] Implement the `name`, `version`, and `author` functions as per SEP-0034.
- [ ] Store metadata in the contract source code during build.
- [ ] Verify that the metadata is correctly visible via `stellar contract invoke`.
- [ ] Update the `Cargo.toml` to reflect the correct metadata versioning.
