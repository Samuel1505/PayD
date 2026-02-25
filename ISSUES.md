# PayD Project Issues Board

This board tracks the breakdown of 70 issues for the PayD platform across Contract, Backend, and Frontend development.

## 📊 Summary

- **Total Issues**: 70
- **Contract**: 23
- **Backend**: 23
- **Frontend**: 24

---

## ⛓ [CONTRACT] Stellar / Smart Contract

_Focuses on asset issuance, trustlines, payment batching, and Soroban logic._

| ID   | Issue Title                                                                               | Difficulty | Status  |
| :--- | :---------------------------------------------------------------------------------------- | :--------: | :-----: |
| #001 | [Issue ORGUSD Custom Asset on Stellar Testnet](docs/issues/001-issue-orgusd-asset.md)     |   ● HARD   | ⏳ TODO |
| #002 | [Implement Trustline Acceptance Flow](docs/issues/002-trustline-flow.md)                  |  ● MEDIUM  | ⏳ TODO |
| #003 | [Build Bulk Payment Transaction Batching](docs/issues/003-bulk-payment-batching.md)       |   ● HARD   | ⏳ TODO |
| #004 | [Set Up Horizon Client & Config](docs/issues/004-horizon-client-setup.md)                 |   ● EASY   | ⏳ TODO |
| #005 | [Integrate Anchor SEP-24 Protocol](docs/issues/005-sep-24-integration.md)                 |   ● HARD   | ⏳ TODO |
| #006 | [Implement Stellar Wallet Kit Integration](docs/issues/006-wallet-kit-integration.md)     |  ● MEDIUM  | ⏳ TODO |
| #007 | [Build On-Chain Tx Verification & Logging](docs/issues/007-tx-verification-logging.md)    |  ● MEDIUM  | ⏳ TODO |
| #008 | [Implement Account Balance Preflight Checks](docs/issues/008-balance-preflight-checks.md) |   ● EASY   | ⏳ TODO |
| #009 | [Design Soroban Smart Contract](docs/issues/009-soroban-escrow-contract.md)               |   ● HARD   | ⏳ TODO |
| #010 | [Write Stellar Tx Signing Unit Tests](docs/issues/010-stellar-signing-tests.md)           |  ● MEDIUM  | ⏳ TODO |
| #031 | [Multi-Sig for Issuer Account](docs/issues/031-multi-sig-issuer.md)                       |   ● HARD   | ⏳ TODO |
| #032 | [Clawback Support for ORGUSD](docs/issues/032-clawback-support.md)                        |  ● MEDIUM  | ⏳ TODO |
| #033 | [Revenue Split Logic via Soroban](docs/issues/033-soroban-revenue-split.md)               |   ● HARD   | ⏳ TODO |
| #034 | [Asset Metadata SEP-1 Implementation](docs/issues/034-sep-1-metadata.md)                  |   ● EASY   | ⏳ TODO |
| #035 | [Transaction Throttling Mechanism](docs/issues/035-tx-throttling.md)                      |  ● MEDIUM  | ⏳ TODO |
| #036 | [Support for Multiple Stablecoins](docs/issues/036-multi-stablecoin-support.md)           |  ● MEDIUM  | ⏳ TODO |
| #037 | [Emergency Freeze Logic](docs/issues/037-emergency-freeze.md)                             |  ● MEDIUM  | ⏳ TODO |
| #038 | [Fee Estimation Service](docs/issues/038-fee-estimation.md)                               |   ● EASY   | ⏳ TODO |
| #039 | [SDS API Integration](docs/issues/039-sds-integration.md)                                 |   ● HARD   | ⏳ TODO |
| #040 | [Claimable Balances for Unregistered Users](docs/issues/040-claimable-balances.md)        |  ● MEDIUM  | ⏳ TODO |
| #041 | [Transaction Simulation for Validation](docs/issues/041-tx-simulation.md)                 |  ● MEDIUM  | ⏳ TODO |
| #042 | [Ledger Observer for Real-time Events](docs/issues/042-ledger-observer.md)                |   ● HARD   | ⏳ TODO |
| #043 | [SEP-31 Cross-Asset Payments](docs/issues/043-sep-31-payments.md)                         |   ● HARD   | ⏳ TODO |

---

## 🛠 [BACKEND] Node.js / API / Database

_Focuses on project structure, database schema, payroll scheduling, and API logic._

| ID   | Issue Title                                                                           | Difficulty | Status  |
| :--- | :------------------------------------------------------------------------------------ | :--------: | :-----: |
| #011 | [Set Up Express.js Project Structure](docs/issues/011-express-ts-setup.md)            |  ● MEDIUM  | ⏳ TODO |
| #012 | [Design & Migrate PostgreSQL Schema](docs/issues/012-db-schema-migrations.md)         |  ● MEDIUM  | ⏳ TODO |
| #013 | [Build Payroll Scheduling Engine](docs/issues/013-payroll-scheduler.md)               |   ● HARD   | ⏳ TODO |
| #014 | [Implement JWT Auth & RBAC](docs/issues/014-jwt-rbac-auth.md)                         |   ● EASY   | ⏳ TODO |
| #015 | [Build CSV Bulk Import Parser & Validator](docs/issues/015-csv-importer.md)           |   ● HARD   | ⏳ TODO |
| #016 | [Integrate FX Rate API](docs/issues/016-fx-rate-api.md)                               |  ● MEDIUM  | ⏳ TODO |
| #017 | [Build Employee CRUD API Endpoints](docs/issues/017-employee-crud-api.md)             |   ● EASY   | ⏳ TODO |
| #018 | [Set Up Notification Service](docs/issues/018-notification-service.md)                |  ● MEDIUM  | ⏳ TODO |
| #019 | [Implement Payroll Run Audit Log & Reporting](docs/issues/019-audit-reporting-api.md) |   ● HARD   | ⏳ TODO |
| #020 | [Dockerize Backend Service](docs/issues/020-docker-setup.md)                          |   ● EASY   | ⏳ TODO |
| #044 | [OAuth2 Social Login Integration](docs/issues/044-oauth2-social-login.md)             |  ● MEDIUM  | ⏳ TODO |
| #045 | [Multi-tenant Architecture Support](docs/issues/045-multi-tenant-architecture.md)     |   ● HARD   | ⏳ TODO |
| #046 | [Two-Factor Authentication (2FA)](docs/issues/046-2fa-support.md)                     |  ● MEDIUM  | ⏳ TODO |
| #047 | [Data Export System (PDF/Excel)](docs/issues/047-data-export-system.md)               |  ● MEDIUM  | ⏳ TODO |
| #048 | [Webhook System for Integrations](docs/issues/048-webhook-system.md)                  |   ● HARD   | ⏳ TODO |
| #049 | [Support for Performance Bonuses](docs/issues/049-performance-bonuses.md)             |   ● EASY   | ⏳ TODO |
| #050 | [Employee Profile Management](docs/issues/050-employee-profile-mgmt.md)               |   ● EASY   | ⏳ TODO |
| #051 | [Advanced Search & Filtering](docs/issues/051-advanced-search-filtering.md)           |  ● MEDIUM  | ⏳ TODO |
| #052 | [API Versioning Strategy](docs/issues/052-api-versioning.md)                          |   ● EASY   | ⏳ TODO |
| #053 | [Email/System Monitoring (ELK Stack)](docs/issues/053-monitoring-logging.md)          |   ● HARD   | ⏳ TODO |
| #054 | [API Rate Limiting](docs/issues/054-api-rate-limiting.md)                             |   ● EASY   | ⏳ TODO |
| #055 | [Health Dashboard API](docs/issues/055-health-api.md)                                 |   ● EASY   | ⏳ TODO |
| #056 | [Custom Tax Calculations Support](docs/issues/056-tax-calculations.md)                |  ● MEDIUM  | ⏳ TODO |

---

## 🎨 [FRONTEND] React / TypeScript / UI

_Focuses on dashboard layout, wallet connection, management UI, and analytics._

| ID   | Issue Title                                                                             | Difficulty | Status  |
| :--- | :-------------------------------------------------------------------------------------- | :--------: | :-----: |
| #021 | [Scaffold React 19 + Vite Project](docs/issues/021-react-vite-setup.md)                 |  ● MEDIUM  | ⏳ TODO |
| #022 | [Build Employer Dashboard Layout](docs/issues/022-dashboard-layout.md)                  |   ● EASY   | ⏳ TODO |
| #023 | [Implement Wallet Connect Flow](docs/issues/023-wallet-connect-ui.md)                   |   ● HARD   | ⏳ TODO |
| #024 | [Build Employee Management Table](docs/issues/024-employee-table-ui.md)                 |  ● MEDIUM  | ⏳ TODO |
| #025 | [Build CSV Upload UI](docs/issues/025-csv-upload-ui.md)                                 |  ● MEDIUM  | ⏳ TODO |
| #026 | [Build Payroll Analytics Dashboard](docs/issues/026-analytics-dashboard.md)             |   ● HARD   | ⏳ TODO |
| #027 | [Build Employee Portal History View](docs/issues/027-employee-portal.md)                |   ● EASY   | ⏳ TODO |
| #028 | [Implement QR Code Onboarding](docs/issues/028-employee-onboarding-ui.md)               |  ● MEDIUM  | ⏳ TODO |
| #029 | [Add Toast Notification System](docs/issues/029-toast-notification-system.md)           |   ● EASY   | ⏳ TODO |
| #030 | [Build Payroll Scheduling Config UI](docs/issues/030-payroll-scheduling-ui.md)          |   ● HARD   | ⏳ TODO |
| #057 | [Theme Switcher (Light/Dark Mode)](docs/issues/057-theme-switcher.md)                   |   ● EASY   | ⏳ TODO |
| #058 | [Multi-language Support (i18n)](docs/issues/058-multi-language-support.md)              |  ● MEDIUM  | ⏳ TODO |
| #059 | [Interactive Onboarding Tour](docs/issues/059-interactive-onboarding.md)                |  ● MEDIUM  | ⏳ TODO |
| #060 | [Advanced Filter UI for Transactions](docs/issues/060-advanced-filter-ui.md)            |  ● MEDIUM  | ⏳ TODO |
| #061 | [WebSocket Integration for Real-time Updates](docs/issues/061-websocket-integration.md) |   ● HARD   | ⏳ TODO |
| #062 | [Organization Settings Page](docs/issues/062-org-settings-page.md)                      |   ● EASY   | ⏳ TODO |
| #063 | [Custom Report Builder UI](docs/issues/063-custom-report-builder.md)                    |   ● HARD   | ⏳ TODO |
| #064 | [Drag-and-Drop Employee Reordering](docs/issues/064-employee-reordering.md)             |   ● EASY   | ⏳ TODO |
| #065 | [Session Timeout Warnings](docs/issues/065-session-timeout-ui.md)                       |   ● EASY   | ⏳ TODO |
| #066 | [Mobile Responsive Optimization](docs/issues/066-mobile-responsive.md)                  |  ● MEDIUM  | ⏳ TODO |
| #067 | [Profile Pictures / Gravatar Support](docs/issues/067-profile-pictures.md)              |   ● EASY   | ⏳ TODO |
| #068 | [Interactive Documentation Page](docs/issues/068-documentation-page.md)                 |  ● MEDIUM  | ⏳ TODO |
| #069 | [Form Autosave for Configurations](docs/issues/069-form-autosave.md)                    |  ● MEDIUM  | ⏳ TODO |
| #070 | [Error Boundaries & Crash Reporting](docs/issues/070-error-boundaries.md)               |  ● MEDIUM  | ⏳ TODO |
