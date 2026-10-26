# Job A — Phase 3 corrected content

These are drop-in replacements for the findings that need rewriting. Identifiers and thresholds are preserved. Items the PDF cannot settle are marked `[NEEDS GROUP CONFIRMATION]` or `[NEEDS INSTRUCTOR CONFIRMATION]`. Nothing here changes a REQ value.

## C-01 — Revised document order (fixes F-01, F-02, F-03, F-04, F-13, F-14)

**Original issue:** the master plan's sections XII–XIX sit after five appendix covers; each appendix cover is followed by a level test plan instead of the artifact named on the cover.

**Corrected structure:**

```
Master Test Plan (MTP-IT302-MEDILYNK-1)
  Cover
  Table of contents
  I–XI    (as corrected)
  XII–XIX (as corrected)
Part 2 — Level Test Plans
  Component Test Plan   CTP-IT302-MEDILYNK-1
  Integration Test Plan ITP-IT302-MEDILYNK-1
  System Test Plan      STP-IT302-MEDILYNK-1
  Acceptance Test Plan  ATP-IT302-MEDILYNK-1
Part 3 — Appendices
  A. Product and Project/Test Risk Matrix
  B. Preliminary Requirements Traceability Matrix
  C. Early Testing / Static Review Log
  D. Testing Quadrants Coverage Map
  E. Seven Testing Principles Evidence Matrix
```

**Reason:** a reader must be able to follow the master plan from I to XIX without crossing 83 pages of subordinate plans, and each appendix cover must introduce the artifact it names.

**Rule to apply to the DOCX:** every level plan starts on a new page with its own cover and identifier. No level plan may sit under an appendix letter. Appendix E contains only the evidence matrix, not a second acceptance plan.

## C-02 — Replacement table of contents (fixes F-04)

**Original issue:** five concatenated TOCs labelled "QUADRANT I–V", no page numbers, repeated headings.

**Corrected version:**

```
TABLE OF CONTENTS

Master Test Plan
I.    Test Plan Identifier ........ 7
II.   References .................. 8
III.  Introduction ................ 10
IV.   Test Items .................. 13
V.    Software Risk Issues ........ 18
VI.   Features To Be Tested ....... 24
VII.  Features Not To Be Tested ... 26
VIII. Approach .................... 28
IX.   Item Pass/Fail and Exit Criteria ... 36
X.    Suspension Criteria and Resumption Requirements ... 39
XI.   Test Deliverables ........... 40
XII.  Remaining Test Tasks ........ 41
XIII. Environmental Needs ......... 43
XIV.  Staffing and Training Needs . 46
XV.   Responsibilities ............ 49
XVI.  Schedule .................... 51
XVII. Planning Risks and Contingencies ... 53
XVIII.Approvals ................... 55
XIX.  Glossary .................... 56

Part 2 — Level Test Plans
2.1 Component Test Plan (CTP-IT302-MEDILYNK-1) ... 60
2.2 Integration Test Plan (ITP-IT302-MEDILYNK-1) ... 78
2.3 System Test Plan (STP-IT302-MEDILYNK-1) ... 95
2.4 Acceptance Test Plan (ATP-IT302-MEDILYNK-1) ... 111

Part 3 — Appendices
A. Product and Project/Test Risk Matrix ... 121
B. Preliminary Requirements Traceability Matrix ... 124
C. Early Testing / Static Review Log ... 127
D. Testing Quadrants Coverage Map ... 129
E. Seven Testing Principles Evidence Matrix ... 131
```

**Reason:** one TOC for one document. Page numbers are placeholders; replace them after the final layout. ISTQB has four quadrants, and appendices are not quadrants.

## C-03 — Front matter: identifier, revision history, references (fixes F-16, F-31, F-32, F-33)

**Original issue:** two document IDs, two rows numbered 1.0, a broken line "(restructu red)", REF-10 as a self-reference, and mismatched REF-03/REF-04 in the component plan.

**Corrected identifier table:**

| Field | Value |
|---|---|
| Document ID | `MTP-IT302-MEDILYNK-1` |
| Scenario reference | `IT302-MTP-G4-SCENARIO-D` |
| System / Scenario | Scenario D — Clinic Teleconsultation Booking and Reminder App |
| Group / Section | Group 4 / BSIT 3IG2 (MediLynk) |
| Version | 1.2 |
| Date | `[NEEDS GROUP CONFIRMATION — date of submission]` |
| Status | Submitted for instructor review; approval pending |

**Corrected revision history:**

| Version | Date | Description of changes | Prepared by |
|---|---|---|---|
| 0.1 | September 16, 2026 | Initial draft for static review; review issues identified | Maranan, Aryana Rizanne N. |
| 1.0 | September 29, 2026 | Static-review findings corrected; exit criteria, severity scale and monitoring added; RTM and Appendices C, D and E rebuilt; PR-09 and ER-06 to ER-08 added | Maranan, Aryana Rizanne N. |
| 1.1 | October 1, 2026 | Restructured into the Master Test Plan plus four level test plans; appendices A–E rebuilt | Maranan, Aryana Rizanne N. |
| 1.2 | `[date]` | Review corrections applied: appendix contents restored, RTM completed, roles and schedules reconciled | `[NEEDS GROUP CONFIRMATION]` |

**References correction:** delete REF-10 ("Appendix C … this document"). Keep REF-03 = IEEE 829-2008, REF-04 = ISTQB CTFL v4.0.1, REF-05 = ISTQB CTAL-AT v2.0. State in a note: "ISO/IEC/IEEE 29119-3 is the governing structure for this plan; IEEE 829-2008 is cited for historical format comparison." Before submission, open the ISTQB page and confirm the CTAL-AT edition and year — `[UNABLE TO VERIFY]`.

**Reason:** one document has one ID and one version per row; a document cannot be its own reference; the component plan must use the same reference numbers as the master.

## C-04 — Section IV opening and Section VIII level split (fixes F-17, F-20)

**Original issue:** Section IV points to the wrong places and calls the master plan its own source; Section VIII merges integration and system.

**Replacement for the Section IV opening paragraph:**

> This section defines the test items for the MediLynk Teleconsultation System. The test items were identified from the Activity 1 System Blueprint (REF-06), the assigned Scenario D (REF-01) and the course guide (REF-02). Requirement, risk and test-condition links are shown in the table at the end of this section and in the Requirements Traceability Matrix (Appendix B).

**Replacement for Section VIII items 3–5:**

> **3. Integration Testing.** Integration testing verifies that the modules, the internal REST API and the third-party notification services exchange data correctly. It covers TI-14 (internal API), TI-15 (inter-module data flow), TI-06 (Notification Manager), TI-10 (Email/SMS/Push integration) and calendar synchronization, using Postman and sandbox or mock services. It is planned in the Integration Test Plan (`ITP-IT302-MEDILYNK-1`).
>
> **4. System Testing.** System testing verifies REQ-01 to REQ-10 end to end. The test types are functional, security, usability, small-scale concurrency and performance, compatibility (Chrome, Edge and Android only), reliability, recovery, smoke and exploratory testing. It is planned in the System Test Plan (`STP-IT302-MEDILYNK-1`).
>
> **5. Acceptance Testing.** Acceptance testing validates whether the system meets the needs of its intended users. At Midterm it is planning only; full UAT execution is out of scope. It is planned in the Acceptance Test Plan (`ATP-IT302-MEDILYNK-1`).

**Reason:** the master approach must match the four level plans that follow it.

## C-05 — One scope count (fixes F-05)

**Original issue:** 16 items declared, 3 excluded, system plan still says TI-01 to TI-15.

**Replacement sentence for §III Scope:**

> This MTP covers 13 in-scope test items: TI-01, TI-02, TI-04, TI-05, TI-06, TI-07, TI-09, TI-10, TI-11, TI-12, TI-13, TI-14 and TI-15. TI-03, TI-08 and TI-16 are excluded for the reasons in Section VII.

**Replacement sentence for STP §IV item 1 (p. 81):**

> All 13 in-scope test items (TI-01, TI-02, TI-04–TI-07, TI-09–TI-15), the database, the APIs, the integrations and the screens, tested as one system and linked to REQ-01 to REQ-10.

**Reason:** a reader must be able to count the scope the same way in every section.

## C-06 — New Appendix A: product and project/test risk matrix (fixes F-01, F-08)

**Original issue:** Appendix A contains the Component Test Plan, and Section V promises a nine-risk summary that does not exist.

**Corrected Appendix A:**

| ID | Risk | L | I | Score | Level | Mitigation | Test response |
|---|---|---|---|---|---|---|---|
| PR-01 | Double booking of doctor and slot, including buffer violation | 4 | 5 | 20 | High | Unique constraint on doctor + slot; conflict-check engine | TCND-01, TCND-02 |
| PR-02 | Unauthorized access to consultation history | 4 | 5 | 20 | High | Service-layer RBAC; role × data decision table | TCND-03 |
| PR-05 | Calendar synchronization failure | 4 | 4 | 16 | High | Retry, queue and staff flag | TCND-04, TCND-05 |
| PR-06 | Missing data masking | 3 | 5 | 15 | Medium | Masked fields by default; role × field matrix | TCND-07 |
| PR-03 | Reminder timing failure | 3 | 4 | 12 | Medium | Lead-time calculation; BVA on 24 h/1 h | TCND-06, TCND-14 |
| PR-09 | Video platform unavailable or call drops | 3 | 4 | 12 | Medium | Rejoin first, reschedule after 2 minutes | TCND-09, TCND-10 |
| PR-08 | Calendar not updated after reschedule/cancel | 3 | 3 | 9 | Medium | Status state machine; calendar update on every transition | TCND-08 |
| PR-04 | Incomplete or invalid patient registration | 2 | 3 | 6 | Low | Field-level validation; EP and BVA | TCND-11 |
| PR-07 | Booking of an expired slot | 2 | 2 | 4 | Low | Server-side date validation | TCND-12 |

Add this note below the table: "Scores are taken from the plan text. The L and I columns are reconstructed from the published scores and must be confirmed by the Test Manager: `[NEEDS GROUP CONFIRMATION]`."

**Reason:** the section that says "full descriptions … are in Appendix A" must have a complete matrix to point to.

## C-07 — New Appendix B: RTM and test-condition definitions (fixes F-02, F-18, F-24)

**Original issue:** Appendix B contains the Integration Test Plan; no TCND is defined; several TIs have no condition.

**Corrected Appendix B, part 1 — REQ-to-test grid:**

| REQ | PR | TCND | TI | Levels | Technique | Owner |
|---|---|---|---|---|---|---|
| REQ-01 | PR-01 | TCND-01, TCND-02, TCND-13 | TI-02, TI-09, TI-14 | Component, Integration, System | BVA, error guessing, concurrency | Aduna, Estolloso, Marasigan |
| REQ-02 | PR-02 | TCND-03 | TI-01, TI-07, TI-11 | Component, Integration, System | Decision table, OWASP ZAP | Aduna, Estolloso, Marasigan |
| REQ-03 | PR-05 | TCND-04, TCND-05, TCND-13 | TI-02, TI-14, TI-15 | Integration, System | State transition, exploratory | Estolloso, Marasigan |
| REQ-04 | PR-03 | TCND-06, TCND-14 | TI-06, TI-10 | Integration, System | BVA, exploratory | Estolloso, Tamayo |
| REQ-05 | PR-06 | TCND-07 | TI-07, TI-11 | System | Decision table | Marasigan |
| REQ-06 | PR-08 | TCND-08 | TI-02 | Component, Integration | State transition | Aduna, Estolloso |
| REQ-07 | PR-09 | TCND-09 | TI-04, TI-12 | System | Error guessing, exploratory | Marasigan |
| REQ-08 | PR-09 | TCND-10 | TI-04 | System | Checklist, exploratory | Marasigan |
| REQ-09 | PR-04 | TCND-11, TCND-13 | TI-05 | Component, System | EP, BVA | Aduna |
| REQ-10 | PR-07 | TCND-12 | TI-02, TI-14 | Component, Integration, System | BVA | Aduna, Marasigan |

**Corrected Appendix B, part 2 — test-condition definitions.** These are reconstructed from the requirement and feature text. They are not quoted from the PDF; confirm each with the group before baselining. `[INFERRED]`

| TCND | Condition | REQ / PR | Expected outcome |
|---|---|---|---|
| TCND-01 | Two simultaneous requests for the same doctor and slot | REQ-01 / PR-01 | Exactly one succeeds; the other receives 409 and a "slot just taken" message |
| TCND-02 | Booking inside the 10-minute buffer | REQ-01 / PR-01 | Booking is rejected; the nearest valid slot is shown |
| TCND-03 | Cross-patient and cross-role access to consultation history | REQ-02 / PR-02 | Patient sees own only; doctor sees assigned only; others receive 403 |
| TCND-04 | Availability update after booking, reschedule and cancel | REQ-03 / PR-05 | Correct availability within 5 seconds |
| TCND-05 | Calendar sync failure | REQ-03 / PR-05 | Failure is queued, retried and flagged for staff |
| TCND-06 | Reminder lead times and tolerance | REQ-04 / PR-03 | Reminders at 24 h and 1 h, ±2 minutes, correct date/time/channel |
| TCND-07 | Masking of confidential fields by role | REQ-05 / PR-06 | No field outside the approved role × field matrix is visible |
| TCND-08 | Valid and invalid appointment status transitions | REQ-06 / PR-08 | Only valid transitions accepted; slot freed or updated |
| TCND-09 | Video outage or dropped call | REQ-07 / PR-09 | Rejoin offered to both parties; reschedule prompt after 2 minutes of failed rejoin |
| TCND-10 | Video start and 10-minute session | REQ-08 / PR-09 | Start within 10 seconds; no unplanned disconnection in 10 minutes |
| TCND-11 | Empty, invalid and boundary registration data | REQ-09 / PR-04 | Each field shows a specific error; valid data is saved |
| TCND-12 | Past or expired slot booking | REQ-10 / PR-07 | Rejected by the server, even if the client is bypassed |
| TCND-13 | End-to-end acceptance journey (UAT-1) | REQ-01, 03, 04, 09 / PR-01, 03, 04, 05 | Register, book, receive reminders, join, recover — without assistance |
| TCND-14 | Notification provider failure | REQ-04 / PR-03 | Failure logged, retried, flagged; appointment is unaffected |

**Correction to the p. 17 table:** change the TCND-13 risk cell from "PR-01, 03, 05" to "PR-01, 03, 04, 05".

**Correction for TI-13/TI-14/TI-15:** add a note: "TI-13 (UI), TI-14 (API) and TI-15 (data flow) are exercised through the conditions above; each is verified by the TCNDs listed in its level plan." Do not claim a separate condition where none exists.

**Reason:** the document claims bidirectional traceability; this table is the smallest artifact that makes the claim true.

## C-08 — New Appendix C: static review log (fixes F-03, F-07)

**Original issue:** Appendix C contains the System Test Plan; ER-02, ER-03, ER-05 and ER-07 are never defined; ER-08 is used for two different things.

**Corrected Appendix C:**

| ID | Location reviewed | Finding | Decision | Status | Owner |
|---|---|---|---|---|---|
| ER-01 | `[NEEDS GROUP CONFIRMATION]` | `[original finding needed]` | `[decision]` | Open/Closed | `[owner]` |
| ER-02 | `[NEEDS GROUP CONFIRMATION]` | `[original finding needed]` | `[decision]` | Open/Closed | `[owner]` |
| ER-03 | `[NEEDS GROUP CONFIRMATION]` | `[original finding needed]` | `[decision]` | Open/Closed | `[owner]` |
| ER-04 | REQ-03, calendar sync | No retry or flagging defined | Add queue, retry and staff flag | Closed in v1.0 | Marasigan |
| ER-05 | `[NEEDS GROUP CONFIRMATION]` | `[original finding needed]` | `[decision]` | Open/Closed | `[owner]` |
| ER-06 | REQ-01, buffer | 10-minute buffer not defined | Adopt 10 minutes, pending instructor confirmation | Open — residual | Aduna |
| ER-07 | `[NEEDS GROUP CONFIRMATION]` | `[original finding needed]` | `[decision]` | Open/Closed | `[owner]` |
| ER-08 | REQ-02 / REQ-05, masking | Role × field matrix not defined | Matrix drafted; approval pending | Open — residual | Marasigan |
| ER-09 | REQ-04, time zones | Time-zone handling not specified in REQ-04 | Treat as a separate open item; do not reuse ER-08 | Open | `[owner]` |

Add a one-line note under the table: "ER-01 to ER-08 were cited in the plan but the original log was not included in this PDF. Supply the original eight entries or renumber the set contiguously; do not leave unused IDs in the glossary. `[NEEDS GROUP CONFIRMATION]`"

**Reason:** an appendix named "static review log" must contain the log, and each ER cited elsewhere must exist in it.

## C-09 — Section IX: severity, exit criteria and measurable pass criteria (fixes F-06, F-10, F-27, F-29)

**Original issue:** no severity scale, no exit criteria, some criteria unmeasurable, and open thresholds used as fixed.

**Add before the pass/fail table:**

> **Provisional values.** The thresholds marked ER-06 to ER-08 are the team's proposed values. They are used as test criteria so that design can proceed, but each row is provisional until the instructor confirms it. `[NEEDS INSTRUCTOR CONFIRMATION]`

**Add after the pass/fail table:**

> **Severity scale**
>
> | Severity | Definition | Example |
> |---|---|---|
> | Critical | Data exposure, an accepted double booking, or a total blocker | Two appointments accepted for one slot; another patient's record visible |
> | High | A required behaviour fails and has no workaround | Reminders never sent; recovery prompt missing for one party |
> | Medium | A required behaviour fails but a workaround exists | Calendar late beyond 5 seconds but eventually correct |
> | Low | Cosmetic or minor usability problem | Incorrect label or formatting |
>
> **Exit criteria**
>
> 1. All P1 test conditions have been executed.
> 2. No unresolved Critical defect remains, unless the Test Manager records formal risk acceptance.
> 3. At least 80% of P2 and P3 test conditions have been executed; every unexecuted condition is listed with its reason and residual risk.
> 4. Every failed test has a retest result.
> 5. The Test Completion Report has been submitted.
> 6. ER-06 to ER-08 are either confirmed or recorded as residual risks.
>
> Meeting these criteria shows that the planned testing is sufficient. It does not prove that the system is defect-free.

**Replace the unmeasurable rows:**

> **Registration (REQ-09, PR-04):** Pass — every invalid field shows a message that names the field and the rule, and valid data is saved and visible in the user list. Fail — an invalid value is accepted or a valid value is lost.
>
> **Service recovery (REQ-07, PR-09):** Pass — Rejoin is offered to both Patient and Doctor immediately; if rejoin fails for 2 minutes, the reschedule prompt appears for both. Fail — no prompt, or only one party sees it.

**Reason:** a criterion must tell a tester exactly what to observe, and the plan must say when testing may stop.

## C-10 — One calendar-anchored schedule (fixes F-11, F-12)

**Original issue:** level plans use overlapping relative weeks; the Gantt uses different weeks; the integration table is missing.

**Corrected master schedule (replace §XVI table):**

| Period | Activity | Owner | Effort | Output |
|---|---|---|---|---|
| Week 1 after approval | Finalise test cases, framework, stubs and data | Aduna / Marasigan | 8 | Test case set; component harness |
| Weeks 1–2 | Execute P1 component tests (PR-01, PR-02) | Aduna / Estolloso | 10 | Component results; defect log |
| Week 2 | Execute P2/P3 component tests and retest | All testers | 8 | Component exit record |
| Week 3 | Integration entry checks; Flow 1 (calendar), Flow 2 (reminders); API checks | Estolloso | `[NEEDS GROUP CONFIRMATION]` | Integration results |
| Week 4 | System P1 scenarios, then P2; exploratory and usability | Marasigan / Aduna | 12 + 14 | System results |
| Week 5 | UAT scenarios, report and sign-off | Tamayo / Estolloso / Salvador | 6 + 8 + 4 | UAT report |
| Week 5 | Reviews and Test Completion Report | Salvador | `[NEEDS GROUP CONFIRMATION]` | Completion report |

Add this note: "Dates are relative to instructor approval. The Test Manager will replace 'Week n' with calendar dates after approval. No execution has taken place at Midterm."

**Corrected ITP Table 4 (p. 76):**

| Period | Activity | Responsible | Effort (person-hours) |
|---|---|---|---|
| Week 3 | Confirm sandbox and mock services; run Flow 1 (booking → calendar) | Estolloso | `[NEEDS GROUP CONFIRMATION]` |
| Week 3 | Run Flow 2 (appointment → reminder) and API checks | Estolloso | `[NEEDS GROUP CONFIRMATION]` |
| Week 3 | Retest failed integration cases | All testers | `[NEEDS GROUP CONFIRMATION]` |

**Reason:** five schedules that disagree cannot be executed; one schedule with level rows can.

## C-11 — Gantt paragraph in the future tense (fixes F-09)

**Original issue:** "Testing began in the third week of September" and "from July to October" claim or imply execution that the Midterm scope excludes.

**Corrected version:**

> Table 1 shows the planned sequence of testing after MTP approval: component testing in weeks 1–2, integration testing in week 3, system testing in week 4, and acceptance testing plus reviews in week 5. No dynamic testing has been executed at Midterm. The table is a plan, not a record, and the calendar dates will be fixed by the Test Manager after approval.

**Reason:** the plan must read as planned, not executed.

## C-12 — New Appendix D: testing quadrants coverage map (fixes F-13)

**Original issue:** Appendix D contains the Acceptance Test Plan; no quadrant map exists.

**Corrected Appendix D:**

| Quadrant | Focus | MediLynk tests | Levels / evidence |
|---|---|---|---|
| Q1 | Technology-facing, supports the team | Conflict engine, buffer, RBAC checks, registration validation, unique constraint | Component; CTP §IX |
| Q2 | Business-facing, supports the team | Booking, reminders, calendar, masking, status transitions, API behaviour | Integration and System; ITP/STP §IX |
| Q3 | Business-facing, critiques the product | Exploratory timing sessions, usability walkthrough of booking and recovery, UAT planning | System and Acceptance; STP §VIII, ATP |
| Q4 | Technology-facing, critiques the product | Concurrency, security/authorization, performance, recovery | System; STP §IX, §V |

Add: "Static review is outside the quadrant count. Q1 and Q4 carry the most weight because PR-01, PR-02 and PR-05 are the highest risks. No equal quota per quadrant is used."

**Reason:** the ISTQB quadrant map is a required artifact and cannot be replaced by a three-sentence summary.

## C-13 — Appendix E reduced to the evidence matrix (fixes F-14, F-28, F-34)

**Original issue:** a duplicate acceptance plan wraps the matrix; EP IDs collide with Equivalence Partitioning; two section references are wrong.

**Corrected Appendix E structure:**

```
Appendix E — Seven Testing Principles Evidence Matrix
E.1 Purpose (one paragraph: this appendix records how each ISTQB principle is applied)
E.2 Evidence matrix (the existing seven-row table, pp. 111–116)
E.3 Review method (checklist, reviewer independent of writer)
E.4 Pass/fail checks EV-01 to EV-07
```

Delete E's Sections III–V (Purpose/Scope/Objective, Test Items, Software Risk Issues) and the UAT tables, because they duplicate the Acceptance Test Plan. Keep the seven-principle rows exactly as written; they are the best evidence in the document.

Rename every `EP-0n` check to `EV-0n` (Evidence Verification).

Correct the citations:

- "Section IX: Exit Criteria" → "Section IX, Exit criteria".
- "Section XIX: Residual Risk" → "Section XIX, glossary entry 'Residual Risk'".

**Reason:** one artifact per appendix; no identifier collisions; no references to headings that do not exist.

## C-14 — One role title per member (fixes F-15)

**Original issue:** §XIV, §XV and the appointment letters assign different titles to the same six people.

**Corrected role table (use in §XIV, §XV and the letters):**

| Member | Single title | Test-level ownership |
|---|---|---|
| Maranan, Aryana Rizanne N. | Project Manager | Overall plan and coordination |
| Salvador, Mary Pauleen C. | Test Manager | Monitoring, reporting, suspension/resumption, sign-off |
| Aduna, Franz Juris U. | Test Analyst | Component (with Estolloso); functional system scenarios |
| Marasigan, Kylie Denise D.G. | Technical Test Analyst | System (security, performance, compatibility, recovery); environment |
| Tamayo, Jonie R. | QA Engineer | Static review; acceptance scenarios and UAT facilitation |
| Estolloso, Cielo Marie S. | Integration Test Engineer | Integration; component support; data preparation |

Add a note: "The appointment letters in this PDF use different project designations. Regenerate the letters with the titles above, or add a signed note that the letter titles are administrative and the table above governs testing roles. `[NEEDS GROUP CONFIRMATION]`"

**Reason:** a responsibility matrix that contradicts the appointment letters cannot be enforced.

## C-15 — One defect lifecycle (fixes F-19)

**Original issue:** Figures 3 and 4 show the same lifecycle with different state names.

**Corrected version:** keep Figure 4's vocabulary (it is the more complete diagram) and use it everywhere:

`NEW → OPEN → IN PROGRESS → READY FOR RETEST → CLOSED`, with `REOPENED`, `REJECTED` and `DEFERRED` as side states.

Delete Figure 3, or replace its caption with "Figure 3. Defect states used in this plan" and redraw it with the vocabulary above. Update §VIII and the glossary to use the same words.

**Reason:** two diagrams of one process with different labels will produce inconsistent defect reports.

## C-16 — Add Jest to the tools (fixes F-21)

Add to §XIII and to the component plan's tool table:

| Tool | Purpose |
|---|---|
| Jest | Component unit tests for the conflict engine, RBAC checks and validation logic |

**Reason:** Figure 6 already shows Jest training, and the component plan says tests are automated "where feasible"; the tool list must match.

## C-17 — Section XI and suspension rule (fixes F-22, F-30)

**Original issue:** Section XI is printed twice and misnumbered; the suspension rule contradicts the mock fallback.

**Corrected Section XI (single heading, single paragraph, one list):**

> **XI. Test Deliverables**
>
> The test deliverables are the documents and records that support planning, execution, monitoring and evaluation. The owner of each deliverable is the role responsible for preparing it.
>
> 1. Master Test Plan (MTP) — Project Manager.
> 2. Component, Integration, System and Acceptance Test Plans — Project Manager with level leads.
> 3. Product and Project/Test Risk Matrix — Test Manager.
> 4. Preliminary Requirements Traceability Matrix — Test Analyst.
> 5. Early Testing / Static Review Log — QA Engineer.
> 6. Testing Quadrants Coverage Map — Technical Test Analyst.
> 7. Seven Testing Principles Evidence Matrix — QA Engineer / Project Manager.
> 8. Test Conditions and Test Cases — Test Analyst.
> 9. Test Checklists — Test Analyst.
> 10. Defect Reports — All testers.
> 11. Test Logs and Screenshots — Integration Test Engineer.
> 12. Progress and Status Reports — Test Manager.
> 13. Test Completion Report — Test Manager.

**Corrected suspension rule 2 (p. 39):**

> 2. Notification provider unavailable: if neither the sandbox nor the mock notification service is available, reminder testing is suspended. If the mock is available, testing continues with the mock and real third-party delivery is recorded as unverified (TR-02).

**Corrected resumption list:** number all five items 1–5 (the current list has an unnumbered "Environment and Service Restored" between items 1 and 2).

**Reason:** duplicated sections and contradictory stop rules cause execution errors.

## C-18 — Remove the screenshot placeholder (fixes F-23)

Delete the literal `[screenshot]` on p. 57 or insert the screenshot it stands for. If the screenshot is not available, delete the figure and its caption rather than shipping a placeholder.

## C-19 — Replace the blank Figure 11 (fixes F-25)

**Original issue:** p. 69 contains only the caption for Figure 11.

**Corrected version — numbered flow (use if the original image cannot be recovered):**

> **Figure 11. Booking to Calendar Integration Flow (REQ-03 and REQ-06)**
>
> 1. The patient confirms a slot.
> 2. The API checks the session, the slot's expiry, the 10-minute buffer and the unique doctor + slot rule.
> 3. The database transaction inserts the appointment; the unique constraint rejects a duplicate.
> 4. The appointment moves to Confirmed and the slot is marked taken.
> 5. A calendar-sync request is sent.
> 6. On success, availability is updated within 5 seconds.
> 7. On failure, the job is queued, retried, and then flagged for Clinic Admin/Staff.
> 8. Staff resolve the flag and the outcome is recorded.

Mark it `[INFERRED]` until the original flowchart is restored.

**Reason:** a figure caption with no figure is a missing test artifact, and the integration plan explicitly relies on this flow.

## C-20 — Remove literal `<br>` tags (fixes F-26)

**Original issue:** the system plan's pass/fail cells print `<br><br>`.

**Corrected example (Booking row):**

> **Pass:** Only one booking is made per slot.
> • Buffer and expired slots are rejected.
>
> **Fail:** A double booking is accepted.
> • An expired slot is accepted.

Apply the same two-bullet layout to the Sync and Reminders row, the Recovery and Video row, and the Access and Masking row. Do not paste HTML into a Word table cell.

## C-21 — Typo and layout list (fixes F-32)

| Page | Current | Correct |
|---|---|---|
| 2 | "VI. Featured To Be Tested" | "VI. Features To Be Tested" |
| 7 | "1.0 (restructu red)" | "1.1" on one line |
| 77 | "C ontingency" | "Contingency" |
| 43 | "Document Title Document Title" | "Document Title Document Link" |
| 143 | "Eng. Evangeline F Gonzales" | "Engr. Evangeline F. Gonzales" |
| 132 | "INTEGRATION TESTING" | "Integration Test Engineer" |
| 17 | "bidirectional traceability" | keep, but only after Appendix B exists |

**Reason:** these are visible in the submitted PDF and undermine an otherwise professional document.
