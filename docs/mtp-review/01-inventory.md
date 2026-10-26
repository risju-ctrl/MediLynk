# Job A — Phase 1 inventory

Everything below is taken from `Master Test Plan - G4.pdf`. Page numbers are PDF pages. `[INFERRED]` marks a reconstruction where the document itself does not state the link.

## 1. Document structure map

| Printed heading | PDF pages | What actually follows |
|---|---|---|
| Cover | 1 | Title, group, course, October 2026 |
| Table of contents | 2–6 | Five concatenated section lists, each labelled "QUADRANT I–V: APPENDIX A–E"; no page numbers |
| I. Test Plan Identifier | 7 | Identifier table and revision history |
| II. References | 8–9 | REF-01 to REF-10 |
| III. Introduction | 10–13 | Purpose, Scope, Objective, Assumptions, Constraints |
| IV. Test Items | 13–17 | TI-01 to TI-16, "Test Cases" subsection, TCND-to-REQ/PR table |
| V. Software Risk Issues | 18–23 | Three long-form risks (PR-01, PR-02, PR-05) |
| VI. Features To Be Tested | 24–25 | Ten features, one per REQ |
| VII. Features Not To Be Tested | 26–27 | Ten exclusions |
| VIII. Approach | 28–35 | Risk-based approach, four levels, techniques, entry criteria, monitoring, Figures 3–5, Gantt |
| IX. Item Pass/Fail Criteria | 36–38 | Functionality pass/fail table only |
| X. Suspension / Resumption | 39–40 | Suspension list, resumption list |
| XI. Test Deliverables | 40–41 | Deliverables list, printed twice |
| **Appendix A** cover | 42 | Title "Product and Project/Test Risk Matrix" |
| — content after Appendix A cover | 43–60 | **Component Test Plan** (`CTP-IT302-MEDILYNK-1`); no risk matrix |
| **Appendix B** cover | 60–61 | Title "Preliminary Requirements Traceability Matrix (RTM)" |
| — content after Appendix B cover | 62–77 | **Integration Test Plan** (`ITP-IT302-MEDILYNK-1`); no RTM |
| **Appendix C** cover | 78 | Title "Early Testing / Static Review Log" |
| — content after Appendix C cover | 79–93 | **System Test Plan** (`STP-IT302-MEDILYNK-1`); no static review log |
| **Appendix D** cover | 94 | Title "Testing Quadrants Coverage Map" |
| — content after Appendix D cover | 95–104 | **Acceptance Test Plan** (`ATP-IT302-MEDILYNK-1`); no quadrant map |
| **Appendix E** cover | 105 | Title "Seven Testing Principles Evidence Matrix" |
| — content after Appendix E cover | 106–124 | A second acceptance-style plan (`APX-E-IT302-MEDILYNK-1`) whose Sections III–V duplicate the ATP; the seven-principles matrix itself is in Section VI (pp. 111–116) |
| XII. Remaining Test Tasks | 125–126 | Eight tasks with owners |
| XIII. Environmental Needs | 126–129 | Hardware, network, test accounts and data |
| XIV. Staffing and Training Needs | 130–132 | Six role descriptions |
| XV. Responsibilities | 133–134 | Role/member table, activity owners |
| XVI. Schedule | 135–136 | Ten planning days, 15–29 September 2026 |
| XVII. Planning Risks and Contingencies | 136–137 | TR-01 to TR-04 |
| XVIII. Approvals | 138 | Prepared/reviewed 4 October 2026; approver pending, no signature or date |
| Appointment letters | 139–144 | Six letters with different role titles from Sections XIV–XV |
| XIX. Glossary | 145–149 | Definitions |

The master plan's own sections XII–XIX are therefore separated from sections I–XI by 83 pages of level plans and appendices.

## 2. Test-plan identifiers

| Identifier | Page | Notes |
|---|---|---|
| `MTP-IT302-MEDILYNK-1` | 7 | Primary document ID |
| `IT302-MTP-G4-SCENARIO-D-v1.0` | 7 | Second ID printed in brackets for the same document |
| `CTP-IT302-MEDILYNK-1` | 43 | Component Test Plan, printed under the Appendix A heading |
| `ITP-IT302-MEDILYNK-1` | 61 | Integration Test Plan, printed under the Appendix B heading |
| `STP-IT302-MEDILYNK-1` | 79 | System Test Plan, printed under the Appendix C heading |
| `ATP-IT302-MEDILYNK-1` | 95 | Acceptance Test Plan, printed under the Appendix D heading |
| `APX-E-IT302-MEDILYNK-1` | 106 | Evidence-matrix plan, printed under the Appendix E heading |

## 3. Identifier inventory

Page numbers are every page on which the identifier appears as a token. Paired references such as "TCND-01, 02" are counted under both IDs.

### Requirements (REQ-01 to REQ-10)

| ID | Pages |
|---|---|
| REQ-01 | 11, 17, 26, 30, 36, 44, 45, 46, 47, 51, 64, 66, 72, 80, 81, 83, 86, 97, 98, 108, 112, 114, 135, 147 |
| REQ-02 | 11, 12, 17, 36, 44, 45, 47, 51, 66, 72, 82, 83, 87, 97, 108, 128 |
| REQ-03 | 12, 17, 37, 63, 64, 65, 66, 69, 71, 83, 87, 97, 98, 108 |
| REQ-04 | 12, 17, 37, 63, 64, 65, 66, 70, 71 |
| REQ-05 | 11, 12, 17, 37, 45, 82, 97, 99, 108, 128, 145 |
| REQ-06 | 12, 17, 31, 37, 44, 45, 47, 51, 63, 65, 66, 69, 71 |
| REQ-07 | 12, 17, 38, 82, 83, 87, 98 |
| REQ-08 | 12, 17, 31, 38, 81, 145, 146 |
| REQ-09 | 11, 17, 38, 44, 46, 47, 51, 82, 83, 87 |
| REQ-10 | 11, 17, 26, 30, 38, 44, 45, 47, 51, 80, 81, 112, 135, 147 |

### Test items (TI-01 to TI-16)

| ID | Pages |
|---|---|
| TI-01 | 11, 12, 13, 21, 29, 44, 45, 81, 148 |
| TI-02 | 13, 19, 20, 29, 44, 45, 65, 114, 148 |
| TI-03 | 14, 27, 112 |
| TI-04 | 14, 26, 48, 81 |
| TI-05 | 14, 29, 44, 45 |
| TI-06 | 14, 63, 64, 127, 146 |
| TI-07 | 14, 82 |
| TI-08 | 15, 26, 112 |
| TI-09 | 15, 19, 20, 44, 46 |
| TI-10 | 15, 16, 26, 30, 48, 63, 64, 74, 127, 128, 137, 145 |
| TI-11 | 12, 15, 21, 29, 44, 45, 82 |
| TI-12 | 15, 26, 48, 81 |
| TI-13 | 16, 82 |
| TI-14 | 16, 30, 63, 64, 74, 128, 145 |
| TI-15 | 16, 30, 48, 63, 64, 81 |
| TI-16 | 11, 16, 27, 112, 148 |

`TI-03`, `TI-08` and `TI-16` are excluded on pp. 26–27 and again on p. 112. `TI-13` (UI) has no test condition of its own.

### Product risks (PR-01 to PR-09)

| ID | Score / level | Score page(s) | All pages |
|---|---|---|---|
| PR-01 | 20 / High | 18, 46 | 11, 12, 17, 18, 26, 28, 30, 31, 36, 39, 44, 46, 53, 59, 60, 65, 72, 82, 85, 112, 114, 145, 146, 147, 149 |
| PR-02 | 20 / High | 20, 46 | 11, 17, 20, 28, 30, 31, 36, 39, 44, 46, 53, 59, 65, 72, 82, 85, 114, 145, 146 |
| PR-03 | 12 / Medium | 65, 98, 110 | 12, 17, 30, 31, 37, 65, 82, 146 |
| PR-04 | 6 / Low | 46 | 11, 17, 30, 38, 46, 59, 145 |
| PR-05 | 16 / High | 22 | 12, 17, 22, 28, 31, 37, 39, 64, 65, 67, 72, 82, 85, 114, 146, 148 |
| PR-06 | 15 / Medium | 98, 110 | 11, 17, 28, 30, 37, 82, 85, 145, 146 |
| PR-07 | 4 / Low | 46 | 11, 17, 30, 38, 46, 59 |
| PR-08 | 9 / Medium | 46, 65 | 12, 17, 31, 37, 46, 59, 65, 148 |
| PR-09 | 12 / Medium | 83, 98, 110 | 7, 12, 17, 31, 38, 83, 112, 113, 146, 147 |

No single table lists all nine scores. They are scattered across the master plan, the component plan, the integration plan and the acceptance/evidence plans. That is the work the missing Appendix A should have done.

### Test conditions (TCND-01 to TCND-14)

| ID | Pages | Definition in the PDF |
|---|---|---|
| TCND-01 | 16, 17, 47, 53, 66, 73, 83, 148 | Not defined |
| TCND-02 | 17 | Not defined; appears only inside "TCND-01, 02" |
| TCND-03 | 17, 47, 66, 83 | Not defined |
| TCND-04 | 17, 66, 83, 98 | Not defined |
| TCND-05 | 17, 66 | Not defined; appears only inside "TCND-04, 05" |
| TCND-06 | 17, 66 | Not defined |
| TCND-07 | 17, 99 | Not defined |
| TCND-08 | 17, 47, 66 | Not defined |
| TCND-09 | 17, 83, 98 | Not defined |
| TCND-10 | 17 | Not defined |
| TCND-11 | 17, 47, 83 | Not defined |
| TCND-12 | 17, 47 | Not defined |
| TCND-13 | 17, 98, 101 | Not defined |
| TCND-14 | 16, 65, 82, 98, 110 | Not defined |

The glossary (p. 148) explains only the format: "TCND – Test Condition ID used in Appendix B". The body of Appendix B is the Integration Test Plan.

### Review findings (ER-01 to ER-08)

| ID | Pages | What the PDF says |
|---|---|---|
| ER-01 | 146 | Only the glossary range "ER-01 to ER-08"; no finding |
| ER-02 | — | Never appears |
| ER-03 | — | Never appears |
| ER-04 | 22, 23 | "sync retry logic and flagging for manual review" |
| ER-05 | — | Never appears |
| ER-06 | 7, 11, 12, 30, 44, 81, 92, 112, 113, 136, 145, 147 | The 10-minute buffer threshold |
| ER-07 | — | Never appears |
| ER-08 | 7, 12, 24, 81, 92, 112, 113, 146, 147 | Role × field masking matrix (p. 12); also "time zones" (p. 24) |

### Planning, level and acceptance risks

| ID | Pages |
|---|---|
| TR-01 | 136, 149 |
| TR-02 | 13, 26, 39, 67, 76, 111, 112, 137, 146, 147 |
| TR-03 | 134, 137 |
| TR-04 | 33, 137, 149 |
| CR-01 / CR-02 | 59 / 60 |
| IR-01 / IR-02 / IR-03 | 76 / 77 / 77, 114, 115, 123 |
| SR-01 / SR-02 / SR-03 | 92 / 92 / 93 |
| AR-01 / AR-02 | 104 / 104 |
| AE-01 to AE-03 | 124 |
| UAT-1 to UAT-4 | 97, 100, 108, 109, 116 |
| EP-01 onwards | 119 (identifier also used for Equivalence Partitioning throughout) |

## 4. Traceability grid

The document claims "bidirectional traceability" (p. 17) but its RTM appendix is missing. This grid reconstructs what the PDF actually states. Empty cells are gaps, not assumptions.

| REQ | PR | TCND | TI | Level stated on p. 17 | Technique (stated in §VIII / level plans) | Owner (stated) |
|---|---|---|---|---|---|---|
| REQ-01 | PR-01 (20) | TCND-01, 02, 13 | TI-02, TI-09, TI-14 | Component / Integration / System | BVA, error guessing, concurrency | Aduna + Estolloso (component); Estolloso (integration); Marasigan + Aduna (system) |
| REQ-02 | PR-02 (20) | TCND-03 | TI-01, TI-07, TI-11 | Component / Integration / System | Decision table, OWASP ZAP | Aduna + Estolloso; Marasigan |
| REQ-03 | PR-05 (16) | TCND-04, 05, 13 | TI-02, TI-14, TI-15 | Integration (p. 17); system criteria also exist (p. 37) | State transition, exploratory | Estolloso |
| REQ-04 | PR-03 (12) | TCND-06, 14 | TI-06, TI-10 | Integration / System | BVA, exploratory | Estolloso; Tamayo (acceptance) |
| REQ-05 | PR-06 (15) | TCND-07 | TI-07, TI-11 | System | Decision table | Marasigan |
| REQ-06 | PR-08 (9) | TCND-08 | TI-02 | Component / Integration | State transition | Aduna; Estolloso |
| REQ-07 | PR-09 (12) | TCND-09 | TI-12 | System | Error guessing, exploratory | Marasigan |
| REQ-08 | PR-09 (12) | TCND-10 | TI-04 | System | Checklist, exploratory | Marasigan |
| REQ-09 | PR-04 (6) | TCND-11, 13 | TI-05 | Component / System | EP, BVA | Aduna |
| REQ-10 | PR-07 (4) | TCND-12 | TI-02, TI-14 | Component / System | BVA | Aduna; Marasigan |

Gaps visible in the grid:

1. TCND-13 is mapped to REQ-01, 03, 04 and 09 but to PR-01, 03 and 05 only. REQ-09's risk (PR-04) is missing from the row (p. 17).
2. No TCND describes the test condition itself, so the grid's middle column cannot be verified.
3. TI-09 (database constraint), TI-13 (UI), TI-14 (API) and TI-15 (data flow) have no TCND of their own; they are linked to requirements only.
4. REQ-10's server-side validation is an API/database behaviour, but p. 17 places TCND-12 at component/system, not integration.
5. The owners in this grid come from p. 17 and the level plans, not from Section XV, which assigns no level ownership.

## 5. Threshold register

| Threshold | Value | Pages where stated | Consistency |
|---|---|---|---|
| Buffer between a doctor's consecutive appointments | 10 minutes | 11, 12, 18, 19, 23, 24, 30, 36, 44, 47, 113, 145 | Same value everywhere; always tied to ER-06 |
| Calendar availability update | 5 seconds | 23, 24, 30, 37, 66, 71, 87 | Same value everywhere |
| Reminder lead times | 24 h and 1 h | 24, 30, 37, 66, 82, 83, 145 | Same value everywhere |
| Reminder tolerance | ±2 minutes | 24, 30, 37, 87, 113 | Same value everywhere |
| Rejoin window before the reschedule prompt | 2 minutes | 25 only | Not repeated in Section IX, the system plan, or the acceptance plan |
| Video start | 10 seconds | 12, 25, 38, 83, 87 | Same value everywhere |
| Test session duration | 10 minutes | 25, 38, 83 | Same value everywhere |
| Risk score bands | Low 1–7, Medium 8–15, High 16–25 | 18, 147 | Consistent |
| Severity scale | Critical / High / Medium / Low | 147 only | No scale or definitions in Section IX, although p. 7 and p. 113 say one was added |
| Exit criteria | 80% of P2/P3 executed; all P1; no open Critical | 111, 113 (inside Appendix E) | Not in the master plan's Section IX, although p. 111 and p. 121 call it "Section IX: Exit Criteria" |

## 6. Owner and schedule register

### Planning schedule (MTP §XVI, pp. 135–136)

| Day | Date (2026) | Activity | Owner | Hours |
|---|---|---|---|---|
| 1 | Sep 15 | Analyze Scenario D | Aduna | 4 |
| 2 | Sep 16 | Early/static review | Tamayo | 4 |
| 3 | Sep 17 | Product and project/test risks | Salvador | 4 |
| 4 | Sep 18–19 | Objectives, scope, items, features | Aduna / Maranan | 8 |
| 5 | Sep 21 | Priorities and quadrants map | Marasigan | 4 |
| 6 | Sep 22 | Test approach / strategy | Marasigan | 4 |
| 7 | Sep 23 | Pass/fail, entry/exit, suspension | Marasigan | 4 |
| 8 | Sep 24–25 | Deliverables, tasks, environment, roles, contingencies | Estolloso / Maranan | 8 |
| 9 | Sep 28 | Approvals, glossary, principles evidence, RTM | Tamayo / Maranan | 8 |
| 10 | Sep 29 | Peer static review, revise, baseline, submit | All | 12 |

### Level-plan schedules

| Plan | Schedule as printed |
|---|---|
| Component (p. 59) | Week 1: finalise cases/framework (8 h); Week 1–2: execute P1 (10 h); Week 2: execute P2/P3 and retest (8 h) |
| Integration (p. 76) | "planned over two weeks, starting after component testing" — **Table 4 caption with no table** |
| System (p. 92) | Week 3: environment, smoke, P1 (12 h); Week 3–4: P2, exploratory, usability (14 h) |
| Acceptance (p. 103) | Week 4–5: prepare scenarios (6 h); Week 5: run UAT (8 h); Week 5: report and sign-off (4 h) |
| Appendix E plan (p. 124) | Sep 28 draft; Sep 29 peer review; Oct 1 final reference check |

### Gantt text table (p. 35)

| Testing type | Schedule |
|---|---|
| Component | Sept weeks 3–4 |
| Integration | Sept week 4 – Oct week 1 |
| System | Oct weeks 1–2 |
| Acceptance | Oct week 2 |
| Reviews | Oct week 2 |

The Gantt paragraph also says testing ran "from July to October" and "Testing began in the third week of September".

### Version and approval dates

| Event | Date | Page |
|---|---|---|
| Version 0.1 | September 16, 2026 | 7 |
| Version 1.0 | September 29, 2026 | 7 |
| Version 1.0 "(restructured)" | October 1, 2026 | 7 |
| Prepared and reviewed | October 4, 2026 | 138 |
| Approval | pending; no signature or date | 138 |

**Schedule conflicts:** the planning schedule ends on 29 September and approval is dated 4 October, but the Gantt says execution began in the third week of September; level plans use relative weeks (1–5) that overlap; the integration schedule table is missing; acceptance is week 4–5 in its own plan but one week in the Gantt.
