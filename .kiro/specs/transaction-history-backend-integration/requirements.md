# Requirements Document

## Introduction

This document specifies the requirements for integrating the TransactionHistory.tsx frontend component with the backend audit API and contract event indexer. The feature replaces mock/stub data with real paginated API calls, implements server-side filtering, and displays a unified timeline of Stellar transactions and contract events for the PayD cross-border payroll platform.

## Glossary

- **Transaction_History_Component**: The React component that displays transaction and event data to users
- **Audit_API**: The backend GET /api/audit endpoint that provides transaction and audit data
- **Contract_Event_Indexer**: The backend service that indexes and provides contract-level events from issue #77
- **Timeline**: The chronologically ordered display of transactions and contract events
- **Filter_Parameters**: Query parameters for date range, status, employee, and asset filtering
- **Pagination_State**: The current page number, page size, and total count of results
- **Contract_Event**: An event emitted by a smart contract on the Stellar network
- **Stellar_Transaction**: A classic transaction on the Stellar network
- **Debounce_Delay**: A time delay before executing a filter query to reduce API calls

## Requirements

### Requirement 1: Fetch Real Transaction Data

**User Story:** As a user, I want to see real transaction data from the backend, so that I can view accurate transaction history.

#### Acceptance Criteria

1. WHEN the Transaction_History_Component mounts, THE Transaction_History_Component SHALL fetch data from the Audit_API
2. WHEN the Audit_API returns data, THE Transaction_History_Component SHALL display the transactions in the Timeline
3. WHEN the Audit_API returns an error, THE Transaction_History_Component SHALL display an error message to the user
4. THE Transaction_History_Component SHALL remove all mock data and stub implementations

### Requirement 2: Implement Pagination

**User Story:** As a user, I want to load transaction data in pages, so that I can efficiently browse large datasets.

#### Acceptance Criteria

1. WHEN the Transaction_History_Component fetches data, THE Transaction_History_Component SHALL include page number and page size in the API request
2. WHEN the user triggers a load more action, THE Transaction_History_Component SHALL fetch the next page of results
3. WHEN all pages have been loaded, THE Transaction_History_Component SHALL disable the load more action
4. THE Transaction_History_Component SHALL display the total count of available transactions
5. WHEN new data is loaded, THE Transaction_History_Component SHALL append it to the existing Timeline without replacing previous results

### Requirement 3: Apply Server-Side Filters

**User Story:** As a user, I want to filter transactions by date range, status, employee, and asset, so that I can find specific transactions quickly.

#### Acceptance Criteria

1. WHEN a user changes a filter value, THE Transaction_History_Component SHALL wait for the Debounce_Delay before sending the API request
2. WHEN Filter_Parameters change, THE Transaction_History_Component SHALL reset the Pagination_State to the first page
3. WHEN Filter_Parameters are applied, THE Transaction_History_Component SHALL include them as query parameters in the Audit_API request
4. THE Transaction_History_Component SHALL support filtering by date range with start date and end date parameters
5. THE Transaction_History_Component SHALL support filtering by transaction status
6. THE Transaction_History_Component SHALL support filtering by employee identifier
7. THE Transaction_History_Component SHALL support filtering by asset identifier
8. WHEN multiple filters are applied, THE Transaction_History_Component SHALL combine them with AND logic

### Requirement 4: Merge Contract Events into Timeline

**User Story:** As a user, I want to see contract events alongside Stellar transactions, so that I have a complete view of all blockchain activity.

#### Acceptance Criteria

1. WHEN the Transaction_History_Component fetches data, THE Transaction_History_Component SHALL request both Stellar_Transaction data and Contract_Event data
2. THE Transaction_History_Component SHALL merge Contract_Event entries and Stellar_Transaction entries into a single Timeline
3. THE Transaction_History_Component SHALL sort the Timeline by timestamp in descending order
4. WHEN displaying a Contract_Event, THE Transaction_History_Component SHALL show a distinct visual badge to differentiate it from Stellar_Transaction entries
5. THE Transaction_History_Component SHALL display Contract_Event data with the same filtering and pagination behavior as Stellar_Transaction data

### Requirement 5: Implement Loading States

**User Story:** As a user, I want to see loading indicators, so that I know the application is fetching data.

#### Acceptance Criteria

1. WHEN the Transaction_History_Component is fetching initial data, THE Transaction_History_Component SHALL display a loading skeleton
2. WHEN the Transaction_History_Component is fetching additional pages, THE Transaction_History_Component SHALL display a loading indicator at the bottom of the Timeline
3. WHEN data has finished loading, THE Transaction_History_Component SHALL hide all loading indicators
4. THE loading skeleton SHALL match the layout structure of actual transaction entries

### Requirement 6: Handle Empty States

**User Story:** As a user, I want to see a helpful message when no transactions exist, so that I understand why the list is empty.

#### Acceptance Criteria

1. WHEN the Audit_API returns zero results, THE Transaction_History_Component SHALL display an empty state message
2. WHEN filters are applied and return zero results, THE Transaction_History_Component SHALL display a message indicating no matches were found
3. THE empty state message SHALL include guidance on how to modify filters or what actions to take

### Requirement 7: Optimize API Request Performance

**User Story:** As a developer, I want to minimize unnecessary API calls, so that the application performs efficiently.

#### Acceptance Criteria

1. WHEN a user types in a filter field, THE Transaction_History_Component SHALL debounce the API request by 300 milliseconds
2. WHEN the same data is requested multiple times, THE Transaction_History_Component SHALL use cached results from TanStack Query
3. WHEN the Transaction_History_Component unmounts during an API request, THE Transaction_History_Component SHALL cancel the pending request
4. THE Transaction_History_Component SHALL implement request deduplication to prevent duplicate concurrent requests

### Requirement 8: Maintain Filter State in URL

**User Story:** As a user, I want my filter selections preserved in the URL, so that I can bookmark or share specific filtered views.

#### Acceptance Criteria

1. WHEN Filter_Parameters change, THE Transaction_History_Component SHALL update the URL query parameters
2. WHEN the Transaction_History_Component mounts with URL query parameters, THE Transaction_History_Component SHALL apply those filters to the initial data fetch
3. WHEN a user navigates back or forward in browser history, THE Transaction_History_Component SHALL restore the corresponding filter state
4. THE Transaction_History_Component SHALL encode filter values properly to handle special characters in URLs

### Requirement 9: Display Transaction Details

**User Story:** As a user, I want to see comprehensive details for each transaction, so that I can understand the transaction context.

#### Acceptance Criteria

1. FOR ALL Stellar_Transaction entries, THE Transaction_History_Component SHALL display the transaction hash, timestamp, amount, asset, source account, and destination account
2. FOR ALL Contract_Event entries, THE Transaction_History_Component SHALL display the event type, timestamp, contract address, and relevant event data
3. WHEN a transaction amount is displayed, THE Transaction_History_Component SHALL format it according to the asset's decimal precision
4. WHEN a timestamp is displayed, THE Transaction_History_Component SHALL format it in the user's local timezone
5. THE Transaction_History_Component SHALL display transaction status with appropriate visual indicators for success, pending, and failed states

### Requirement 10: Handle API Errors Gracefully

**User Story:** As a user, I want to see helpful error messages when something goes wrong, so that I understand what happened and what to do next.

#### Acceptance Criteria

1. WHEN the Audit_API returns a 4xx client error, THE Transaction_History_Component SHALL display an error message indicating invalid request parameters
2. WHEN the Audit_API returns a 5xx server error, THE Transaction_History_Component SHALL display an error message indicating a server problem
3. WHEN a network error occurs, THE Transaction_History_Component SHALL display an error message indicating connectivity issues
4. WHEN an error occurs, THE Transaction_History_Component SHALL provide a retry action to the user
5. WHEN the retry action is triggered, THE Transaction_History_Component SHALL attempt to fetch the data again with the same parameters
