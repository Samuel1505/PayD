# #081: Payroll Scheduler Backend Wiring

**Category:** [FRONTEND]
**Difficulty:** ● HARD
**Tags:** `scheduler`, `backend`, `cron`, `api`, `wizard`

## Description

Connect `PayrollScheduler.tsx` (and `SchedulingWizard.tsx`) to the backend scheduling API so that scheduled payroll configs are persisted in the database and the backend cron job triggers on-chain bulk payments at the configured time. The frontend should reflect the next scheduled run and allow real-time cancellation of pending schedules.

## Acceptance Criteria

- [ ] Save Schedule submits to `POST /api/schedules` and persists config.
- [ ] Active schedules listed with next-run timestamp from backend.
- [ ] Cancellation calls `DELETE /api/schedules/:id` and updates UI immediately.
- [ ] `CountdownTimer` driven by the server-returned `next_run_at` timestamp.
- [ ] Backend job executes `bulk_payment` contract invocation at the scheduled time.
