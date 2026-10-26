# OPENCODE MASTER PROMPT: Make MediLynk fully functional and fix the UI/UX

> **How to use:** put this file in the project root (next to `package.json`) as `PROMPT.md`. Start OpenCode in that folder and say:
> *"Read PROMPT.md fully. Start with Phase 0. Stop at every checkpoint and wait for my reply."*

---

## 0. Role

You are a senior full-stack engineer and product designer working on an existing project. You write production-quality code and you design like an experienced human product designer, not like a generator. You work in small verified steps and you do not guess: when something is unclear, you read the code or ask.

## 1. The project (source of truth)

**MediLynk** is a clinic teleconsultation booking and reminder system for IT 302 (System Integration and Architecture), Bulacan State University, Group 4, BSIT 3I-G2.

Documents in the repo and what they are for:
- `Master Test Plan - G4.pdf` and `docs/mtp-review/` hold the requirements REQ-01 to REQ-10 and their thresholds. **Never change a threshold silently.**
- `README.md` maps each REQ to a screen and lists known gaps and assumptions.
- `MediLynk_MTP_Review_and_React_Build_Prompt.md` is the earlier build prompt.
- Group Activity 1 (architecture) and Activity 2 (software failure investigation, scenario E) are summarised in sections 3 and 5 below.

Current stack: Vite + React 18 (JavaScript), React Router v6, TanStack Query, React Hook Form + Zod, FullCalendar, Tailwind 3, Atkinson Hyperlegible (self-hosted 400/700). There is **no real backend**: `src/api/mockServer.js` is an in-memory store bundled into the browser. 15 `node:test` checks pass (`npm test`). Many elements have `data-testid` attributes.

Roles: Patient, Doctor, Clinic Admin/Staff, System Administrator (platform-level, separate from clinic staff).

A first cleanup pass already flattened the CSS (no gradients, smaller radii, no decorative landing visuals). Treat that as a baseline, **not as finished design**.

## 2. Skills you must use (read them before touching any UI)

1. **taste skill** (`design-taste-frontend`, already in `.agents/skills/design-taste-frontend/`). Read `SKILL.md`, then `references/app-screens.md`, `tells.md`, `layout.md`, `colour.md`, `type.md`, `critique.md`. Use it for art direction, the anti-slop rules and the look-and-fix loop on real screenshots.
2. **UI/UX Pro Max** (`nextlevelbuilder/ui-ux-pro-max-skill`). If it is not installed for OpenCode, tell me and I will install it (`npm i -g uipro-cli`, then `uipro init --ai opencode`; check the repo README for the current command). Then follow its own `SKILL.md` to generate a design system for the query *"healthcare clinic teleconsultation booking app, patient and clinician dashboards"*, and persist it (for example `design-system/MASTER.md`). Use it for tokens, accessibility, touch targets, form UX, chart and table rules, and its pre-delivery checklist.

**How they work together:** Pro Max sets the system and the usability rules. The taste skill sets art direction and removes AI tells. If they conflict, or either conflicts with section 4 below, **section 4 wins**.

## 3. What "fully functional" means

Build it as a real three-tier system as the group documented (presentation, logic, data), while keeping the demo runnable offline.

### 3.1 Backend (new `server/` folder)
- Node.js + Express, MVC structure (routes, controllers, services, models). Singleton DB connection. **Observer/event emitter** for appointment events that trigger notifications.
- **MySQL (InnoDB)** via `mysql2`. Provide `server/schema.sql`, `server/seed.sql` (same synthetic accounts as README) and a `docker-compose.yml` for MySQL. Tables: users, doctors/schedules, appointments, symptom_submissions + files, consultations (notes, diagnosis, prescription), reminders/notification_logs, audit_log, sessions.
- Auth: bcrypt password hashing, real JWT (short-lived access token), role checks in middleware, `helmet`, CORS allow-list, rate limit on login, Zod validation on every input. No secrets in code; use `.env` and `.env.example`.
- Environment switch: `VITE_USE_MOCK=true` keeps the current mock API working for offline demos and the existing tests. `false` talks to the server. **Both paths must expose the same function signatures** in `src/api/*.js` so UI code does not change.
- Times are stored in UTC and shown in Asia/Manila.

### 3.2 Features that must really work (map to the MTP)
| REQ | Real behaviour |
|---|---|
| REQ-01 | Booking uses a DB transaction with a unique constraint or row lock. Two simultaneous requests: exactly one succeeds, the other gets 409 "slot just taken". **10-minute buffer** between a doctor's consecutive appointments. |
| REQ-02 | Role-based access enforced in the API (403), not only in the UI. Patients see only their own data. Doctors see assigned consultations only. |
| REQ-03 | Doctor calendar reflects a booking within **5 seconds** (polling or SSE). Failed sync is retried once, then flagged for staff, who can retry. |
| REQ-04 | Reminders at **24 h and 1 h** before, **±2 min**, on Email, SMS, Push. A scheduler (`node-cron` or a DB-polling worker) sends them through provider adapters. Default adapter is a **simulated sender that writes to `notification_logs`** with delivery status and retry on failure. Real Twilio, SendGrid and Firebase adapters are optional and enabled only by env keys. Label simulated sends clearly in the UI. |
| REQ-05 | Clinical fields are masked **in the API response** for roles without clearance, and in the UI. Matrix stays in one file and stays marked `[NEEDS CONFIRMATION]` (ER-08 is open). |
| REQ-06 | Status state machine (requested, confirmed, in_progress, completed, cancelled, no_show). Invalid transitions return 409. Reschedule and cancel free or move the slot and regenerate reminders. |
| REQ-07 | Dropped call or outage: **Rejoin first**, reschedule prompt only after rejoin fails or **2 minutes** pass, same banner for patient and doctor. |
| REQ-08 | Video starts within **10 seconds** (measure and show it) and a 10-minute session timer runs. Use an embedded **Jitsi Meet** room (`meet.jit.si` or self-hosted domain from env), room name derived from a non-guessable appointment token. Keep the current placeholder state machine as the test fallback. Note in the README that public Jitsi is for demo only, not for real patient data. |
| REQ-09 | Registration rejects empty, invalid and boundary values with a specific message per field, on client and server. |
| REQ-10 | Past or expired slots are disabled in the UI and rejected by the server with 422. |

Also make these work end to end: symptom intake with real file upload (`multer`, type and size limits, stored outside the web root, served only to authorised roles), doctor schedule and availability management, consultation notes/diagnosis/prescription saved under the correct patient, staff conflict desk with manual retry, admin user management, and reminder log with delivery status.

## 4. Design rules (hard constraints)

Make the interface look **understated, purposeful and designed for real users**, like a production clinical tool.

**Do not use:** purple/blue/pink gradients, glow or neon, glassmorphism, big soft shadows, heavily rounded everything, cards nested in cards, oversized headings, empty hero whitespace, decorative blobs/orbits/floating shapes, emojis or glyph characters as icons, "heading plus three cards" repetition, gradient text, constant hover animation, fake metrics or decorative charts, piles of colored pills, generic SaaS landing templates.

**Do use:**
- One brand colour (the logo's teal/blue, around `#0E7490` unless Pro Max recommends a better accessible match), neutral surfaces, and limited semantic colours (success, warning, error). Text contrast at least 4.5:1.
- One type family (keep Atkinson Hyperlegible for readability), a small size scale, body 14 to 16px, nothing below 12px.
- Corner radius 4 to 8px, hairline borders, almost no shadow.
- A real icon set (for example Lucide via `lucide-react`) used **only** where it aids recognition. This is the one allowed new dependency, and it must be justified in `CHANGES.md`.
- Tables and compact lists for data-heavy views. Cards only when grouping truly helps.
- Visible focus rings, 44px touch targets on mobile, labelled inputs, inline validation messages, `aria-live` for toasts, `prefers-reduced-motion` respected.
- Every list and form has an **empty state, loading state, error state and success message** that say something useful.
- Design per role, because tasks differ: **Patient** is mobile-first and simple (next appointment, book, reminders). **Doctor** is dense and schedule-centred. **Staff** is table-heavy (appointments, conflict desk). **Admin** is a plain users table. The public pages are a short honest landing, sign in and register.
- Show only real data. Remove any hardcoded number that is not computed from the store or database.

## 5. Activity 2 incident must be fixed in code (scenario E)

Incident: on a shared clinic tablet, a patient opened their reminder link and saw the **previous patient's appointment summary for several seconds** because the browser was still signed in (defect DEF-E-001, severity Critical, priority P1). Root cause is unconfirmed in the group's report (missing session termination, delayed revalidation, or a cache), so **investigate in this codebase and prove the cause before fixing**.

Implement and test:
1. Reminder links carry a signed, expiring, single-purpose token bound to `appointmentId` and `patientId`.
2. On opening a link, **validate the session owner before rendering any data**. If the signed-in user is not the link's patient, end that session, clear the TanStack Query cache and all client storage, and show the sign-in screen for the link's patient. Never render the old user's data, not even for one frame.
3. Clear the query cache on logout and on any user change. Set `Cache-Control: no-store` on API responses with health data.
4. Add a "shared device" choice at sign-in: session in `sessionStorage`, idle timeout with a visible warning, automatic sign-out.
5. Automated tests for the Activity 2 retest and regression plan: Patient A then Patient B on the same browser, repeated **5 times** with zero appearances of A's data (retest); doctor and staff accounts switching on one device (Regression 1); history and cached views show no previous-user data after sign-in (Regression 2).

## 6. How to work

**Phase 0: Inspect (no edits).** Read the repo, run `npm install`, `npm test`, `npm run build`. Report: stack, structure, what already works per REQ, what is mock-only, UI problems per page (use screenshots at 375, 768 and 1280 px if browser tooling exists), and the root-cause investigation for the shared-tablet defect. Give me a short plan. **Stop and wait.**

**Phase 1: Design system.** Run Pro Max, read the taste skill, write `design-system/MASTER.md` (tokens, type scale, components, states, per-role layouts) and update `tailwind.config.js` and `src/index.css`. Reuse existing components. No UI changes yet beyond tokens. **Stop.**

**Phase 2: Backend foundation.** `server/`, schema, seed, auth, role middleware, API contract matching `src/api/*.js`, mock/real switch. Tests for the rules. **Stop.**

**Phase 3: Features per REQ,** one REQ at a time, each with a test and a note in the README mapping. Include uploads, scheduler, notification adapters, Jitsi, masking in the API. **Stop after REQ-01 to 05, then after REQ-06 to 10.**

**Phase 4: Session safety (section 5)** with the tests listed there. **Stop.**

**Phase 5: UI/UX pass** page by page in this order: Login, Register, Landing, Patient (Dashboard, Book, Appointments, Symptoms, History), Doctor (Schedule, Consultations, Room, Notes), Staff, Admin, shared Layout and the demo panel. After each page: screenshot, compare against the taste skill's tells list and Pro Max checklist, fix, re-screenshot. **Stop after the patient flow, then after the rest.**

**Phase 6: Final checks.** `npm test`, `npm run build`, lint if present, keyboard-only walkthrough, 375/768/1280 screenshots, contrast check, every REQ walked through by hand using the README test table. Write `CHANGES.md` (what changed and why, new dependencies, setup steps, known gaps). Update `README.md`.

## 7. Rules

- Preserve every existing feature, route, permission, `data-testid` and the 15 passing tests. Do not delete functionality to simplify the design.
- Work with the existing architecture. No new UI framework or component library. Keep new dependencies minimal and justify each.
- Do not duplicate CSS or stack overrides. Prefer editing the source rule over adding another one on top.
- Never invent requirements. If the MTP is silent (appointment length, password policy, phone format), keep the README's current assumption and list it as an open question.
- Synthetic data only. No real patient data. Mark every simulated behaviour (Email/SMS/Push, public Jitsi, mock mode) as simulated in the UI and the README.
- Commit after each phase with a clear message. If a step fails, fix it before moving on. Do not claim something works until you have run it.
- Ask me before any destructive action (deleting files, force pushes, dropping tables).

## 8. Definition of done

- A new user can register, book, upload symptoms, receive simulated reminders, join a video room, and have the doctor write notes, all against the real server and MySQL, and also in offline mock mode.
- All REQ-01 to REQ-10 behaviours pass their checks, plus the Activity 2 retest and both regression checks.
- The UI passes the Pro Max checklist and the taste skill's critique, with no item from the "do not use" list left anywhere.
- Build and tests pass. `README.md` and `CHANGES.md` are accurate.

Start with **Phase 0** now.
