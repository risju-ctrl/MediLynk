# MediLynk — Clinic Teleconsultation Booking and Reminder System (React prototype)

A clickable **front-end prototype** of the MediLynk web client for IT 302 – System Integration and Architecture
(Group 4, BSIT 3IG2). It demonstrates REQ-01 to REQ-10 from the group's Master Test Plan.

> This is not a production system. There is no server, no MySQL database, no real Email / SMS / Push provider and
> no real video platform. Every rule runs against an in-memory mock API with synthetic data.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # 15 node:test checks on the business rules and the mock API
npm run build    # production build in dist/
```

Tested with Node 20, Chrome and Edge. Mobile widths are supported down to Android phone size. iOS is out of scope.

## Seed accounts (all synthetic)

| Role | Email | Password |
|---|---|---|
| Patient 1 — Maria Santos | `maria@example.com` | `Patient123!` |
| Patient 2 — Jose Reyes | `jose@example.com` | `Patient123!` |
| Doctor — Dr. Ana Cruz | `doctor@example.com` | `Doctor123!` |
| Doctor — Dr. Ben Lim | `ben@example.com` | `Doctor123!` |
| Clinic Admin / Staff — Liza Bautista | `staff@example.com` | `Staff123!` |
| System Administrator | `admin@example.com` | `Admin123!` |

The sign-in screen has one-click buttons to fill these in. Two patient accounts exist so cross-patient access
(PR-02) can be tested.

## What is simulated

| Area | What actually happens |
|---|---|
| API | `src/api/mockServer.js` — an in-memory singleton store with ~120–380 ms latency, 401/403/409/422 error codes and role checks. It is bundled with the browser app, so it is not secure. |
| Email / SMS / Push | Reminder rows are generated at booking time; "sent"/"delivered" is computed from the clock. Nothing leaves the browser. |
| Calendar sync | A timer changes `pending → synced`, or `failed → flagged` when the failure toggle is on. The 5-second limit is real: the doctor screen polls every 2 s. |
| Video | `src/hooks/useVideoSession.js` — a placeholder state machine with a start timer, a 10-minute session timer, a "drop call" button and a 2-minute rejoin window. No media is captured. |
| Auth | A fake `mock-jwt.<userId>.<timestamp>` token in `localStorage`. No signing, no HTTPS, no password hashing. |
| Data | Resets on refresh unless you press **Reset demo data**. |

## Test panel (bottom-right button, labelled "prototype only")

| Control | What it does |
|---|---|
| Next calendar sync fails | The next booking's sync fails once, is retried, then is flagged for staff. Set it again for each test. |
| +1 h / +24 h / +25 h / Reset clock | Moves a demo-only clock offset so reminders become due and slots become expired without waiting. |
| Rejoin attempts fail | The next "Rejoin" in the consultation room fails, so the reschedule prompt appears. |
| Reset demo data | Re-seeds the store and clears the clock offset. |

"Simulate two simultaneous requests" lives on the booking screen; "Simulate dropped call" lives in the
consultation room.

## REQ → screen mapping

| REQ | Where | Expected behaviour | Threshold |
|---|---|---|---|
| REQ-01 | `/patient/book` | A taken slot is rejected with 409 "slot just taken" and the slot list refreshes. Slots next to an existing appointment are blocked. Two simultaneous requests: exactly one succeeds. | 10-minute buffer |
| REQ-02 | All routes + mock API | Patients see only their own appointments and records; doctors see assigned consultations only. Forbidden routes render a visible 403 state, and the API returns 403 even when a URL is typed directly. | — |
| REQ-03 | `/doctor`, `/staff/conflicts` | The doctor calendar refreshes within 5 s of a booking. A failed sync is retried once, then flagged and listed for staff, who can retry manually. | 5 seconds |
| REQ-04 | Dashboard, `/patient/appointments` | Six reminders per appointment: 24 h and 1 h before, on Email, SMS and Push, with the exact scheduled date/time and status. | ±2 minutes (displayed as scheduled times) |
| REQ-05 | `/patient/history`, `/staff/appointments` | Clinical fields are masked for roles without clearance, in the UI and in the API response. Matrix lives in `src/utils/roles.js`. | — |
| REQ-06 | `/patient/appointments`, `/doctor/consultations` | Reschedule and cancel are only offered on requested/confirmed appointments; the slot is freed or moved; invalid transitions return 409. | — |
| REQ-07 | `/patient/room/:id`, `/doctor/room/:id` | A dropped call shows **Rejoin** first; a reschedule prompt appears only after the rejoin fails or 2 minutes pass. Both roles use the same banner. | 2 minutes |
| REQ-08 | `/doctor/room/:id` | Joining shows the measured start time against the 10-second target and a 10-minute session timer. | 10 s / 10 min |
| REQ-09 | `/register` | Empty, invalid and boundary values are rejected per field with a specific message; valid data is saved and signs in. | — |
| REQ-10 | `/patient/book` | Past and expired slots are disabled in the UI and rejected by the API with 422. | — |

## How to test this prototype (expected results only — none recorded as passed)

| TCND | Steps | Expected result |
|---|---|---|
| Booking conflict (REQ-01) | Sign in as Maria → Book → pick Dr. Ben Lim and a free slot → "Simulate two simultaneous requests". | One request is accepted, one is rejected with 409 "slot just taken"; no duplicate appointment exists. |
| Buffer (REQ-01) | Book Dr. Ana Cruz tomorrow at 10:00, then look at 09:30, 10:30 and 11:00 for the same day. | 09:30 and 10:30 show "Blocked by 10-minute buffer"; 11:00 stays available. |
| Role access (REQ-02) | Sign in as Maria, open `/patient/history`; then sign in as Jose. Type `/doctor` while signed in as staff. | Each patient sees only their own history; the staff role gets the 403 state. |
| Calendar sync (REQ-03) | Turn on "Next calendar sync fails" → book a slot → open `/doctor` → then `/staff/conflicts`. | Sync shows pending for under 5 s, then failed, then flagged; the flagged appointment appears for staff with a retry button. |
| Reminders (REQ-04) | Book a slot, open the reminders table, then press **+24 h** and **+25 h**. | 24 h reminders move from scheduled to sent; 1 h reminders stay scheduled; times are exact and channels are Email, SMS and Push. |
| Masking (REQ-05) | Sign in as staff → `/staff/appointments`; sign in as Maria → `/patient/history`. | Staff cannot read diagnosis, prescription or notes; the patient reads their own record. |
| Status transitions (REQ-06) | As doctor, try to complete a confirmed appointment from the API flow; cancel a completed one as a patient. | Invalid transitions are rejected with 409; only valid ones are offered in the UI. |
| Video recovery (REQ-07) | Open a consultation room → Join → Simulate dropped call → Rejoin with "Rejoin attempts fail" on. | Rejoin is shown first; after the failed attempt or 2 minutes, the reschedule prompt appears. |
| Video start (REQ-08) | Open a consultation room and press Join video. | Start time is measured and compared with the 10-second target; the session timer counts to 10 minutes. |
| Registration (REQ-09) | Submit the form empty; then with `abc` as email; then a 2-character name; then a future birthdate; then valid data. | Each invalid case shows a specific field message; valid data creates the account. |
| Expired slot (REQ-10) | Book a slot, then press **+24 h** until that slot is in the past and try it again. | The slot shows "Past / expired" and the API rejects it with 422. |

## Gaps and assumptions needing group confirmation

- **ER-08** (role × field masking matrix) is still an open item in the MTP. The matrix in `src/utils/roles.js` is
  provisional and marked `[NEEDS CONFIRMATION]` in the UI.
- **Password policy** (8–64 characters, upper + lower + number) and **PH mobile format** were chosen to satisfy
  REQ-09's boundary checks; the MTP does not state them.
- **Slot length** is 30 minutes and slots are 30 minutes apart. The MTP sets a 10-minute buffer but no appointment
  length.
- **Reminder tolerance ±2 minutes** is shown as exact scheduled times; the mock does not introduce jitter.
- **Reschedule keeps the same doctor** and regenerates reminders. Reassigning to another doctor is not in the MTP.
- **Staff and System Administrator** can see clinical data only in masked form.
- The consultation room is shared by both roles. A patient can only open their own appointment; the API keeps
  doctors' actions (status changes, notes) unavailable to the patient role.
- The mock API lives in the browser bundle. It is suitable for UI testing only, never for security testing of the
  real backend.
- Job A of `MediLynk_MTP_Review_and_React_Build_Prompt.md` (the 149-page test-plan review) is done; see
  [`docs/mtp-review/`](docs/mtp-review/). The prototype still uses the thresholds as written in that file.

## Job A — MTP review

The review of `Master Test Plan - G4.pdf` is in five files:

| File | Contents |
|---|---|
| [`00-coverage-log.md`](docs/mtp-review/00-coverage-log.md) | Which of the 149 pages were read, how figures were checked, and what could not be checked |
| [`01-inventory.md`](docs/mtp-review/01-inventory.md) | Document map, identifier inventory, reconstructed traceability grid, threshold and schedule registers |
| [`02-findings.md`](docs/mtp-review/02-findings.md) | 35 page-anchored findings, sorted by severity, plus a section-by-section review |
| [`03-corrections.md`](docs/mtp-review/03-corrections.md) | Drop-in corrected content (C-01 to C-21), including the missing risk matrix, RTM and static review log |
| [`04-quality-check.md`](docs/mtp-review/04-quality-check.md) | Final checklist, top five corrections, open questions and overall assessment |

Nothing in this prototype was changed by the review. The findings confirm the same gaps already listed above
(ER-08, appointment length, password and phone formats).

## Project layout

```
src/
  api/          mockServer.js (store, rules, routes), auth.js, appointments.js, records.js
  auth/         AuthContext, ProtectedRoute, usePermission
  components/   SlotPicker, AppointmentCard, StatusBadge, ReminderList, RecoveryBanner,
                MaskedField, CalendarView, ReschedulePanel, DemoPanel, Layout
  pages/
    public/     Login, Register
    patient/    Dashboard, BookAppointment, MyAppointments, SymptomForm, History
    doctor/     Schedule, Consultations, ConsultationRoom, RecordNotes
    staff/      Appointments, ConflictResolver
    admin/      Users
  hooks/        useAppointments, useCountdown, useVideoSession
  utils/        timeRules.js, validators.js, roles.js
```

Stack: Vite + React 18 (JavaScript), React Router v6, TanStack Query, React Hook Form + Zod, FullCalendar,
Tailwind CSS.
