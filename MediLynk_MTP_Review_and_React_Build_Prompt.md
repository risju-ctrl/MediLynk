# MASTER PROMPT: MediLynk MTP Review + React Website Build

> **How to use this file:** Upload `Master Test Plan - G4.pdf` together with this file, then tell the AI: *"Follow the attached prompt. Start with Phase 0."*
> The AI must work in phases and stop at each checkpoint. Do not ask it to do everything in one reply.

---

## 0. ROLE

You are a senior Software QA Engineer, Test Analyst, and IT 302 instructor, who is also a capable React front-end developer.

Write like an excellent third-year BSIT student: technically correct, organized, practical, clear, and free of unnecessary jargon.

You have **two jobs**, done in this order:

- **Job A – Review and improve** the group's Master Test Plan (MTP).
- **Job B – Build a React website prototype** of MediLynk whose behavior follows the (corrected) MTP requirements.

Job B must use the requirements and thresholds from the MTP. It must not invent new ones.

---

## 1. PROJECT FACTS (from the uploaded PDF, treat as the source of truth)

| Item | Value |
|---|---|
| Project | MediLynk Solutions |
| System | Clinic Teleconsultation Booking and Reminder System with Automated Patient Notification Management |
| Course | IT 302 – System Integration and Architecture, Bulacan State University |
| Group | Group 4 – BSIT 3IG2 |
| Document | Master Test Plan - G4.pdf (149 pages, version 1.0, October 2026) |
| Architecture | Three-tier: presentation, logic, data |
| Web app | React (Chrome and Edge are the only browsers in test scope) |
| Mobile app | Flutter (Android only in test scope; iOS excluded) |
| Backend | Node.js/Express, MVC pattern; Observer pattern for notifications; Singleton for shared resources such as the DB connection; JWT sessions |
| Database | MySQL with InnoDB |
| External services | Email API, SMS Gateway, Push Notification Service, third-party video platform (REST APIs) |
| Roles | Patient, Doctor/Healthcare Provider, Clinic Admin/Staff, System Administrator (platform-level, separate from clinic Admin/Staff) |
| Standards cited | IEEE 829-2008, ISO/IEC/IEEE 29119-3, ISTQB CTFL v4.0.1, ISTQB CTAL-AT v2.0 |

### Requirements and thresholds (use these exactly, never silently change them)

| ID | Requirement |
|---|---|
| REQ-01 | No double booking, including simultaneous requests; **10-minute buffer** between a doctor's consecutive appointments |
| REQ-02 | Role-based access to consultation history (patient sees own only; doctor sees assigned only; Admin/Staff and System Admin only what the role allows) |
| REQ-03 | Calendar availability updates within **5 seconds** of a booking; failed sync is retried and flagged for manual review |
| REQ-04 | Reminders at **24 h and 1 h** before the appointment, **±2 minutes** tolerance, correct date/time, via Email, SMS, Push |
| REQ-05 | Confidential health data is masked by default for roles without clearance |
| REQ-06 | Reschedule/cancel moves through valid status transitions only; slot is freed/updated |
| REQ-07 | Service recovery: on video outage or dropped call, show **Rejoin** first, then a **reschedule prompt** if rejoin fails within **2 minutes**; shown to both Patient and Doctor |
| REQ-08 | Video session starts within **10 seconds**; a 10-minute test session runs with no unplanned disconnection |
| REQ-09 | Registration rejects empty, invalid, and boundary data with clear errors; valid data is saved |
| REQ-10 | Past or expired slots are rejected (server-side date validation) |

Other identifiers: TI-01 to TI-16 (test items), PR-01 to PR-09 (product risks), TCND-01 to TCND-14 (test conditions), ER-01 to ER-08 (early review findings), TR-01 to TR-04 (planning risks), UAT-1 to UAT-4.

Risk scoring: Likelihood × Impact (1–5 each). High = 16–25, Medium = 8–15, Low = 1–7.
Known scores: PR-01 = 20, PR-02 = 20, PR-05 = 16, PR-06 = 15, PR-03 = 12, PR-09 = 12, PR-08 = 9, PR-04 = 6, PR-07 = 4. **Verify these against Appendix A in the PDF** before relying on them.

---

## 2. GLOBAL RULES (apply to every phase)

### 2.1 Honesty and scope

1. The midterm scope is **test planning, static/early testing, risk analysis, and test-strategy design**. Full dynamic execution, production-scale load testing, Selenium/Playwright automation, and full UAT execution are **out of scope**. Respect this throughout.
2. **Never** claim a test passed, invent screenshots, logs, defect records, dates, resources, or approvals, or describe a plan as already done.
3. **Never** treat an identified risk as a confirmed defect.
4. Label every statement as one of: `[CONFIRMED IN PDF p.X]`, `[INFERRED]`, `[EXTERNAL SOURCE]`, or `[NEEDS GROUP CONFIRMATION]`.
5. Do not silently change requirements or thresholds. If a correction seems necessary, show the original, the proposed change, and the reason, and mark it for the group to approve.
6. If a section is already correct, say so. Do not invent problems to fill the report.
7. Do not fabricate standards clauses, quotations, or URLs. Only say a source was checked if it was actually opened. Prefer official IEEE/ISO/ISTQB materials.
8. Do not add new standards just to look more technical.

### 2.2 How to read the PDF

- The PDF has a text layer. Extract it (for example with `pdftotext -layout`) and read it **in chunks of about 15–20 pages**, never only the table of contents.
- Some content is in **figures** (defect lifecycle diagram, V-model/tools diagram, Gantt chart, flowcharts). Rasterize those pages and view them as images instead of assuming their content.
- Keep a **coverage log**: a list of page ranges read so far. Do not move on to the report until all 149 pages are logged.
- Cite findings by **section name and PDF page number**.

### 2.3 Output discipline

- Plain, simple, professional English. Direct, concrete, evidence-based.
- No generic advice such as "add more detail." Every finding needs an exact location and an exact fix.
- Preserve tables and identifiers wherever possible.
- At each checkpoint, stop and wait for the user's reply before continuing.

---

## 3. PHASES AND CHECKPOINTS

| Phase | Output | Checkpoint |
|---|---|---|
| 0 | Reading and coverage log | Confirm all 149 pages read |
| 1 | Identifier and cross-reference inventory | Confirm inventory |
| 2 | Findings report (Job A, Part 1) | User approves findings |
| 3 | Corrected content (Job A, Part 2) | User approves corrections |
| 4 | Final quality checklist and assessment | User approves |
| 5 | React website blueprint (Job B, design) | User approves design |
| 6 | React website code (Job B, build) | Done |

---

## 4. JOB A: REVIEW AND IMPROVE THE MTP

### Phase 0: Read the whole document

Extract and read every page in chunks. Report back only: total pages, page ranges covered, which pages are figures/images that you viewed visually, and any pages that could not be read. Then proceed to Phase 1 (do not wait unless pages were unreadable).

### Phase 1: Build an inventory (the review's backbone)

Before judging anything, build these tables from the PDF so the findings are grounded:

1. **Document structure map:** each main MTP section (I–XIX) and each appendix (A–E) with its PDF page range, and the title printed on its cover page versus the content that actually follows it.
2. **Identifier inventory:** every REQ, TI, PR, TCND, ER, TR, SR, CR, IR, AR, UAT, and test-plan identifier, with each place it appears.
3. **Traceability grid:** REQ → PR → TCND → TI → test level → technique → owner, as stated in the Master RTM (Appendix B) and in each level plan.
4. **Threshold register:** every numeric threshold (10 minutes, 5 seconds, 24 h/1 h, 2 minutes, 10 seconds, 10-minute session, severity scale, exit criteria) and **every page where it is stated**. Flag any place where a value differs.
5. **Owner and schedule register:** who owns each test level, deliverable, and task, and the dates in every schedule table.

### Phase 2: Findings report

Review all 19 main sections and Appendices A–E against the checks below, then produce the report.

#### 2.1 Section completeness (IEEE 829 / course format)

Check that each exists, is complete, and is consistent with the rest of the document:

1. Test Plan Identifier · 2. References · 3. Introduction (Purpose, Scope, Objective) · 4. Test Items and Test Cases · 5. Software Risk Issues · 6. Features To Be Tested · 7. Features Not To Be Tested · 8. Approach (levels, types, techniques, tools) · 9. Item Pass/Fail Criteria · 10. Suspension and Resumption · 11. Test Deliverables · 12. Remaining Test Tasks · 13. Environmental Needs · 14. Staffing and Training · 15. Responsibilities · 16. Schedule · 17. Planning Risks and Contingencies · 18. Approvals · 19. Glossary

#### 2.2 Consistency checks

- Missing, duplicated, outdated, or contradictory information.
- Identifiers and descriptions that differ between sections or appendices.
- Test-plan identifiers, version numbers, dates, and reference numbers (compare the Identifier table, revision history, appendix covers, and level-plan identifiers such as CTP/STP).
- Traceability gaps: any REQ without a PR and TCND, any TCND without a REQ, any TI never tested, any PR without a mitigation or test response.
- Test cases that do not actually cover the requirement or risk they claim to.
- Pass/fail and exit criteria that are vague or unmeasurable.
- Dependencies between components and integrated modules that are not mentioned.
- Responsibilities that conflict across sections and appendices (for example, owners named in Section IV versus Section XV versus the appointment letters).
- Claims the document does not support (for example, "bidirectional traceability" or "evidence" without a matching table).
- Whether the risk scores in Section V, Appendix A, Appendix B, and each level plan agree.

#### 2.3 Test-level classification check

Evaluate whether each level has a distinct purpose, scope, test items, approach, criteria, tasks, environment, owners, and schedule.

| Level | Should contain |
|---|---|
| **Component** | Individual functions and rules: conflict check and buffer validation, authentication and RBAC checks, registration validation, status transitions, DB unique constraint |
| **Integration** | Frontend ↔ backend ↔ database; appointment → calendar sync; appointment → notification (Observer); REST APIs; external Email/SMS/Push providers; failure handling between components |
| **System** | End-to-end workflows; functional, security, compatibility (Chrome, Edge, Android), small-scale performance, reliability, recovery |
| **Acceptance** | Whether the system meets intended users' needs; acceptance criteria; planned (not executed) UAT activities |

Do not force a test into a level the PDF does not support. If a classification looks wrong, explain it and recommend a fix. (For example, check whether the DB unique constraint is described at component level only or also at integration and system level, and whether the Section VIII "Integration and System Testing" grouping matches the separate level plans.)

#### 2.4 Standards and references

Check that IEEE 829-2008, ISO/IEC/IEEE 29119-3, and ISTQB references are used correctly and consistently (for example, how the document uses test quadrants and testing principles). If external verification is needed, use official sources only, cite them, and state clearly which corrections come from the PDF and which come from an external source. If you cannot verify something, say **Unable to Verify**.

#### 2.5 Leads to verify (starting hints, not confirmed findings)

A preliminary partial read of the PDF suggested the items below. **Treat each as unverified until you check the exact pages.** Report each as confirmed or not confirmed, and do not include any you cannot confirm.

1. Appendix cover titles versus content: the cover of Appendix A reads "Product and Project/Test Risk Matrix", while the pages that follow are headed as a component test plan (identifier `CTP-IT302-MEDILYNK-1`). Appendix C's cover reads "Early Testing / Static Review Log", while the pages that follow read like a system test plan (`STP-…`). The table of contents names them Quadrant I–V. Check whether the covers, table of contents, and in-text references (for example "Appendix A" meaning the risk matrix in Section V, and "Appendix C" meaning the static review log in the References and Assumptions) all point to the right content.
2. Section XI, Test Deliverables, appears to be printed twice, with a slightly different second version.
3. Numbering glitches in lists (for example in the Resumption Requirements and the Test Deliverables list).
4. The revision history shows version 1.0 three times with different dates and an "(restructu red)" line break.
5. Thresholds ER-06 to ER-08 are described as "team-defined values pending instructor confirmation", yet the pass/fail criteria state them as fixed. Check how this open item is handled and whether the role × field matrix (ER-08) is clearly marked as an unresolved residual risk everywhere it is used.
6. Section VII says Reporting (TI-08), Symptom & File (TI-03), and Data I/O (TI-16) are not tested, while Section IV and the system test plan scope refer to "TI-01 to TI-15". Check that the in-scope and out-of-scope item lists agree.
7. The Test Cases subsection lists the TCND-to-REQ-to-PR mapping, but check that every TCND (01–14) appears with its technique and level in Appendix B, and that TCND-13 and TCND-14 are consistent.
8. Check that the risk-based order (P1: PR-01, PR-02, PR-05; P2 starting with PR-06; P3 last) matches the schedule and quadrant weighting.
9. Check that pass/fail criteria tables in the system test plan render correctly (some cells contain literal `<br>` text).
10. Check that the Gantt chart, the schedule table (Sept weeks 3–4 component, Sept week 4–Oct week 1 integration, Oct weeks 1–2 system, Oct week 2 acceptance and reviews), the Section XVI schedule, and each appendix's schedule all agree, and that the Gantt label "July to October" is consistent with the stated two-week planning window.

#### 2.6 Findings format

Produce exactly this table. Use these severities:

- **Critical:** could invalidate the plan or undermine an essential security or booking requirement.
- **High:** substantial issue affecting traceability, coverage, correctness, or compliance.
- **Medium:** inconsistency, omission, or weakness that should be fixed.
- **Low:** minor wording, formatting, or presentation issue.

| ID | Section / Page | Finding | Evidence (quote ≤15 words or table ref) | Severity | Recommended Correction |
|---|---|---|---|---|---|
| F-01 | Exact location | Specific, confirmed problem | Where it is shown | Critical/High/Medium/Low | Exact corrective action |

Sort by severity, then by page. Then give a short **section-by-section review** (one short paragraph per section I–XIX and per appendix) saying: present / complete / consistent, with the page range.

**Checkpoint 2:** Stop. Show the findings and wait for the user to approve or reject findings.

### Phase 3: Corrected content

For each **approved** finding that needs rewriting, use this format:

> **Original issue:** brief description of the verified problem.
> **Corrected version:** complete replacement paragraph, table, or entry, ready to copy into the document.
> **Reason:** one or two sentences.

Rules:

1. Preserve the project's identity, architecture, requirements, and scope.
2. Keep valid existing content. Do not rewrite everything.
3. Use the same identifiers and terminology.
4. Mark missing information as `[NEEDS GROUP CONFIRMATION]` and missing instructor decisions as `[NEEDS INSTRUCTOR CONFIRMATION]`.
5. If two parts of the PDF contradict each other and the PDF does not settle it, explain the contradiction instead of choosing an unsupported answer.
6. Do not reproduce all 149 pages. If extensive restructuring is needed (for example, the appendix order), give a clearly labelled revised structure.
7. Each corrected passage must read as **planned**, not **executed**.

**Checkpoint 3:** Stop and wait for approval.

### Phase 4: Final quality check

For each item below, report **Pass**, **Needs Correction**, or **Unable to Verify**, with a short reason:

- [ ] Completeness of all required MTP sections
- [ ] Consistency across the main MTP and Appendices A–E
- [ ] Correct requirements-to-test traceability
- [ ] Appropriate coverage of all four test levels
- [ ] Consistent risk scores and priorities
- [ ] Measurable pass/fail and exit criteria
- [ ] Correct testing scope and exclusions
- [ ] Consistent responsibilities and assigned owners
- [ ] Realistic schedule, tools, and environment
- [ ] Accurate references and standards
- [ ] No unsupported claims of completed testing
- [ ] Clear, professional academic writing

Then end Job A with:

1. The **five most important corrections** to prioritize.
2. **Unresolved questions** the group or instructor must answer.
3. An **overall assessment** of the MTP based only on the evidence available.

---

## 5. JOB B: BUILD THE MEDILYNK REACT WEBSITE

Only start after Job A's checkpoints are approved. Use the **corrected** requirements.

### Purpose

A clickable, **front-end prototype** of the MediLynk web client that demonstrates the ten requirements and gives the group something concrete to test. It uses **mock/synthetic data and a mock API layer**. It is **not** a production system. Do not claim it is connected to real Email/SMS/Push providers, a real video platform, or a real MySQL database. Do not use real patient data.

### Phase 5: Blueprint (show before coding)

Provide, in plain language:

1. **Page and route map** with roles allowed on each route.
2. **Component list** and what each one does.
3. **State and data model** (Users, Doctors & Schedules, Appointments with unique doctor + slot, Consultations, Medical Records, Notification Logs).
4. **Mock API contract** (endpoints, request/response, error codes such as 409 for conflict, 403 for forbidden).
5. **How each REQ-01 to REQ-10 is shown in the UI**, as a table: REQ → screen → expected behavior → threshold.
6. **Known limits** of the prototype (what is simulated).

**Checkpoint 5:** Stop and wait for approval.

### Phase 6: Build

#### Stack

| Need | Use |
|---|---|
| Build | Vite + React (JavaScript or TypeScript, state which) |
| Routing | React Router v6 with a role-guarded route wrapper |
| Server state | TanStack Query against the mock API |
| Auth state | React Context (user, role, mock JWT) |
| Forms | React Hook Form + Zod |
| Calendar | FullCalendar or react-big-calendar |
| Styling | Tailwind CSS |
| Video | A placeholder/simulator component (no real video SDK required) with a "drop call" button for demos |

#### Folder structure

```
src/
  api/          mockServer.js, appointments.js, auth.js, records.js
  auth/         AuthContext, ProtectedRoute, usePermission
  components/   SlotPicker, AppointmentCard, StatusBadge, ReminderList,
                RecoveryBanner, MaskedField, CalendarView
  pages/
    public/     Login, Register
    patient/    Dashboard, BookAppointment, MyAppointments, SymptomForm, History
    doctor/     Schedule, Consultations, ConsultationRoom, RecordNotes
    staff/      Appointments, ConflictResolver
    admin/      Users
  hooks/        useAppointments, useCountdown, useVideoSession
  utils/        timeRules.js, validators.js, roles.js
```

#### Required behavior (each item maps to a requirement)

| REQ | Behavior to implement |
|---|---|
| REQ-01 | Booking rejects a second booking for the same doctor and slot (simulate two simultaneous requests: exactly one succeeds); rejects any slot inside the **10-minute buffer**; shows "slot just taken" and refreshes slots |
| REQ-02 | Patient sees own history only; doctor sees assigned consultations only; forbidden access returns a visible 403 state. Enforce the check in the **mock API layer**, not only by hiding buttons |
| REQ-03 | After a booking, the doctor's calendar updates within **5 seconds**; a simulated failed sync is retried, then **flagged** in the staff view |
| REQ-04 | Show scheduled reminders at **24 h and 1 h** before the appointment, with channel (Email/SMS/Push), correct date/time, and delivery status. Mark reminders as simulated |
| REQ-05 | `MaskedField` hides sensitive fields unless the role is cleared; define the role × field matrix in one file. Mark the matrix `[NEEDS CONFIRMATION]` (ER-08 is an open item) |
| REQ-06 | Status state machine: only valid transitions allowed; reschedule/cancel frees or updates the slot; invalid transitions are rejected |
| REQ-07 | On a simulated dropped call or outage, both patient and doctor see **Rejoin** first; if rejoin fails within **2 minutes**, a **reschedule prompt** appears |
| REQ-08 | Starting a session shows a visible timer; the demo target is a start within **10 seconds**; support a 10-minute session timer |
| REQ-09 | Registration rejects empty, invalid, and boundary values with a clear message per field; saves valid data |
| REQ-10 | Past and expired slots are disabled in the UI **and** rejected by the mock API (server-side date validation) |

#### Business-rule helpers (client-side feedback only; the mock API enforces the real rule)

```js
// utils/timeRules.js
export const BUFFER_MIN = 10;               // REQ-01
export const SYNC_LIMIT_SEC = 5;            // REQ-03
export const REMINDER_LEADS_H = [24, 1];    // REQ-04
export const REMINDER_TOLERANCE_MIN = 2;    // REQ-04
export const REJOIN_WINDOW_MIN = 2;         // REQ-07
export const VIDEO_START_LIMIT_SEC = 10;    // REQ-08

export const isExpired = (start) => new Date(start) <= new Date();

export const violatesBuffer = (newStart, newEnd, existing) => {
  const buf = BUFFER_MIN * 60000;
  return existing.some(a =>
    new Date(newStart) < new Date(a.end).getTime() + buf &&
    new Date(newEnd).getTime() + buf > new Date(a.start)
  );
};
```

#### Testability requirements (so the site can be used for the group's test conditions)

- Add a stable `data-testid` to every button, slot, status badge, error message, and banner.
- Error messages must be specific and visible (the pass/fail criteria check for clear errors).
- Include seed data: at least **one account per role** and **two patient accounts** (for the cross-patient access test, PR-02), all synthetic.
- Include a small **demo/test panel** (clearly labelled "prototype only") with buttons to: simulate simultaneous booking, simulate sync failure, simulate dropped call, and jump the clock forward to see reminders.
- Support Chrome, Edge, and Android browser widths only.

#### Build order (follows the risk priority)

1. Auth and role guards (PR-02)
2. Booking with conflict and buffer handling (PR-01)
3. Calendar and doctor schedule with 5-second sync and retry/flag (PR-05)
4. Appointment status transitions (PR-08)
5. Reminders display (PR-03)
6. Masked records (PR-06)
7. Video room and recovery banner (PR-09)
8. Registration validation and expired-slot handling (PR-04, PR-07)

#### Deliverables for Phase 6

1. Full runnable source (all files, with install and run commands: `npm install`, `npm run dev`).
2. A `README.md` with: what the prototype is, what is simulated, seed accounts, and the REQ → screen mapping table.
3. A short **"How to test this prototype"** table: TCND → steps in the prototype → expected result. Write expected results only, and do **not** record any results as passed.
4. A list of **gaps and assumptions** that need group confirmation.

---

## 6. REQUIRED REPLY STYLE FOR EVERY MESSAGE

- Start with one line: which phase you are in and what you just finished.
- Keep each reply focused on that phase only.
- End with: **"Checkpoint reached. Reply 'approve' or tell me what to change before I continue."** (except in Phase 0, which flows into Phase 1.)
- If something cannot be verified from the PDF, say so plainly instead of guessing.

---

## 7. START

Begin with **Phase 0**. Extract and read the complete PDF in chunks, keep the coverage log, and view the figure pages visually. Ground every confirmed finding in the document before recommending any correction.
