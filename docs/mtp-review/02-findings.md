# Job A — Phase 2 findings report

**Basis:** `Master Test Plan - G4.pdf`, 149 pages, version 1.0, October 2026. Page numbers are PDF pages.
**Legend:** `[CONFIRMED]` = seen in the PDF text layer or in a rasterised page; `[INFERRED]` = reconstruction, not stated; `[NEEDS GROUP CONFIRMATION]` = the PDF does not settle it.
**Severity:** Critical = could invalidate the plan or an essential booking/security requirement; High = affects traceability, coverage, correctness or compliance; Medium = inconsistency or omission that should be fixed; Low = wording or presentation.

## Findings

| ID | Section / Page | Finding | Evidence (quote or table reference) | Severity | Recommended correction |
|---|---|---|---|---|---|
| F-01 | Appendix A, pp. 42–43 | The Appendix A cover says it is the risk matrix, but the pages that follow are the Component Test Plan. The master risk matrix does not exist anywhere. | "APPENDIX A - PRODUCT AND PROJECT/TEST RISK MATRIX" then "CTP-IT302-MEDILYNK-1" | Critical | Move the Component Test Plan out of Appendix A. Put the nine-risk matrix in Appendix A (see `03-corrections.md`, C-06). |
| F-02 | Appendix B, pp. 60–61 | The Appendix B cover says RTM, but the content is the Integration Test Plan. The RTM is missing, so p. 17's "bidirectional traceability" claim is unsupported. | "APPENDIX B - PRELIMINARY REQUIREMENTS TRACEABILITY MATRIX" then "ITP-IT302-MEDILYNK-1" | Critical | Replace the Appendix B content with a real REQ → PR → TCND → TI → level → technique → owner matrix (C-07). |
| F-03 | Appendix C, pp. 78–79 | The Appendix C cover says static review log, but the content is the System Test Plan. Only ER-04, ER-06 and ER-08 are ever used; ER-02, ER-03, ER-05 and ER-07 never appear. | "APPENDIX C - EARLY TESTING / STATIC REVIEW LOG" then "STP-IT302-MEDILYNK-1" | Critical | Put the ER-01 to ER-08 log in Appendix C, or remove every ER reference that has no entry (C-08). |
| F-04 | Table of contents, pp. 2–6 | The TOC concatenates five plan TOCs and labels them "QUADRANT I" to "QUADRANT V". ISTQB has four quadrants; Appendix E is not a quadrant. The TOC has no page numbers and repeats the same 19 headings five times. | "QUADRANT I: APPENDIX A … QUADRANT V: APPENDIX E" | High | Replace with one MTP TOC (I–XIX) plus a separate list of the four level plans and five appendices, with page numbers (C-02). |
| F-05 | §III Scope p. 11; §IV p. 13; §VII pp. 26–27; STP p. 81 | Scope counts disagree: 16 test items are declared in scope, three are excluded, and the system plan still says "TI-01 to TI-15". | "sixteen test items (TI-01 to TI-16)" vs "All In-Scope Modules (TI-01 to TI-15)" | High | State one number: 13 in-scope items (TI-01–TI-02, TI-04–TI-07, TI-09–TI-15) and list them (C-05). |
| F-06 | §III Assumptions p. 12; §IX pp. 36–38 | ER-06 to ER-08 are declared "pending instructor confirmation", yet Section IX uses them as fixed pass/fail criteria. The role × field matrix is open but is an acceptance criterion. | "thresholds in ER-06 to ER-08 are team-defined values pending instructor confirmation" | High | Keep the values, mark each criterion "provisional until ER-06–ER-08 are confirmed", and add the open item to the exit criteria (C-09). |
| F-07 | §III p. 12; §VI p. 24 | ER-08 is used for two different things: the role × field masking matrix and time zones. | "role x field matrix (ER-08)" … "time zones per ER-08" | High | Keep ER-08 for the masking matrix only; give the time-zone decision its own ID and record it in Appendix C (C-08). |
| F-08 | §V p. 18 | Section V promises "the summary of all nine product risks", but the page after the third risk starts Section VI. No summary table exists; the only nine scores are scattered across four plans. | "followed by the summary of all nine product risks" | High | Insert the nine-row risk summary as Appendix A and cross-reference it from §V (C-06). |
| F-09 | §VIII Gantt, p. 35 | The plan says testing "began" in September and spans "July to October", although the Midterm is planning-only and approval is dated 4 October. This is an unsupported claim of completed execution. | "Testing began in the third week of September" | High | Rewrite in the future tense: "Dynamic execution is planned after MTP approval", and remove July and the September start (C-11). |
| F-10 | §IX pp. 36–38; Glossary p. 147; App. E pp. 111, 121 | Section IX has no severity scale and no exit criteria, although the revision history and glossary say the severity scale was added, and Appendix E cites "Section IX: Exit Criteria". The acceptance plan's entry criterion is "system test exit criteria met", but the system plan defines none. | "Severity … (Section IX)" and "Section IX: Exit Criteria" | High | Add a severity table and an exit-criteria subsection to §IX; make the STP and ATP refer to them (C-09). |
| F-11 | CTP p. 59; STP p. 92; ATP p. 103; Gantt p. 35 | Level schedules use overlapping relative weeks that contradict the calendar Gantt: component week 1–2 vs Sept weeks 3–4; system week 3–4 vs Oct weeks 1–2; acceptance week 4–5 vs Oct week 2. | "Week 1" … "Week 1-2" … "Week 2" vs "Sept weeks 3 to 4" | High | Publish one calendar-anchored schedule (dates after approval) and derive every level table from it (C-10). |
| F-12 | ITP §XVI p. 76 | The integration plan prints "Table 4. Integration Testing Schedule" but no table follows; the next page starts the risk section. | "Table 4. Integration Testing Schedule" | High | Insert the schedule table, aligned with C-10. |
| F-13 | Appendix D, pp. 94–95 | The Appendix D cover says "Testing Quadrants Coverage Map", but the content is the Acceptance Test Plan. No quadrant map exists; only a three-sentence prose summary in §VIII p. 31. | "APPENDIX D - TESTING QUADRANTS COVERAGE MAP" then "ATP-IT302-MEDILYNK-1" | High | Put the quadrant map (Q1–Q4 with test types, levels and evidence) in Appendix D (C-12). |
| F-14 | Appendix E, pp. 105–107 | Appendix E wraps a second acceptance plan around the seven-principles matrix. Its Purpose, Scope, Objective, Test Items and risk list repeat the Acceptance Test Plan almost word for word. | "To plan the validation that MediLynk meets business needs" on pp. 96 and 107 | High | Reduce Appendix E to the seven-principles matrix; delete Sections III–V and the duplicate UAT material (C-13). |
| F-15 | §XIV pp. 130–132; §XV pp. 133–134; letters pp. 139–144 | The same six people hold different titles in the plan and in the appointment letters: e.g. Salvador is Test Manager in the plan but System Analyst in her letter; Marasigan is Technical Test Analyst but Architecture Mapper. | §XV "Test Manager Salvador" vs letter "System Analyst" (p. 140) | High | Choose one role title per member and regenerate the letters to match (C-14). |
| F-16 | §I p. 7 | Version 1.0 appears twice with different dates, and the second is split as "1.0 (restructu red)". A restructure should raise the version. | "1.0 September 29" and "1.0 (restructu red) October 1" | Medium | Re-number the restructured version 1.1 and put each entry on one line (C-03). |
| F-17 | §IV p. 13 | Traceability is said to be in "Sections V and VI and Appendices A and B". Section VI is features, and Appendices A/B are level plans, so the pointer does not lead to traceability. The paragraph also says items were "identified from the master test plan" inside the master plan. | "traceability is in Sections V and VI and Appendices A and B" | Medium | Point to §IV's own table and Appendix B only; delete the self-reference (C-04). |
| F-18 | §IV p. 17 | TCND-13 maps REQ-01, 03, 04 and 09 to PR-01, 03 and 05. REQ-09's risk, PR-04, is missing. TCND-02 and TCND-05 appear only inside paired lists, so they have no standalone trace. | "TCND-13 REQ-01, 03, 04, 09 PR-01, 03, 05" | Medium | Add PR-04 to TCND-13 and give each TCND its own row (C-07). |
| F-19 | §VIII pp. 29, 33 | Two defect-lifecycle figures use different state names for the same process (TRIAGED/IN PROCESS/FIXED vs OPEN/IN PROGRESS/READY FOR RETEST). | Figure 3 state "IN PROCESS"; Figure 4 state "IN PROGRESS" | Medium | Keep one lifecycle diagram and one state vocabulary; delete the duplicate (C-15). |
| F-20 | §VIII p. 29 | The master approach merges Integration and System Testing into one item, although separate ITP and STP documents exist. There is no distinct system-test approach paragraph. | "3. Integration and System Testing" | Medium | Split into "4. Integration Testing" and "5. System Testing", each pointing to its plan (C-04). |
| F-21 | §VIII p. 34; CTP p. 56 | Figure 6 shows a "Jest unit-testing tutorial", but Jest is absent from the master tool list and from the component plan's tools. | "Jest unit-testing tutorial" (Figure 6) | Medium | Add Jest to the component tool table or change the figure caption (C-16). |
| F-22 | §XI pp. 40–41 | The heading and opening paragraph of Section XI are printed twice, with a slightly different second paragraph. The deliverables list then numbers 1–11 but leaves "Test Logs and Screenshots" unnumbered. | "XI. Test Deliverables" twice on p. 40 | Medium | Keep one heading/paragraph and renumber the list 1–12 (C-17). |
| F-23 | CTP p. 57 | A literal "[screenshot]" placeholder is printed above Figure 9. | "[screenshot]" | Medium | Remove the placeholder or insert the actual screenshot (C-18). |
| F-24 | ITP pp. 64–65; STP p. 82 | Several test items are linked only to requirements, not to a test condition: TI-14 (API), TI-15 (data flow), TI-13 (UI). The RTM cannot show coverage without those links. | "Internal API Layer (TI-14) … linked to REQ-01 and REQ-03" | Medium | Add a TCND for each in-scope TI, or state explicitly that the TI is exercised through another item's TCND (C-07). |
| F-25 | ITP p. 69 | Figure 11, the Booking-to-Calendar flowchart, is blank. The page contains only the caption: 0.41% non-white pixels, no image, no flowchart text. | Figure 11 caption only | Medium | Re-insert the flowchart or replace it with the numbered steps in C-19. |
| F-26 | STP pp. 86–87 | Literal `<br><br>` tags are printed inside the pass/fail cells, so the criteria read as raw markup. | "Only one booking is made per slot.<br><br>" | Medium | Replace with line breaks or separate bullet rows (C-20). |
| F-27 | §IX pp. 37–38 | Two criteria are not measurable as written: "a clear error" has no content rule, and masking is judged against the open role × field matrix. | "Invalid data is rejected with a clear error" | Medium | Define the required error fields/messages and attach the approved matrix version (C-09). |
| F-28 | App. E pp. 111–112 | Appendix E points to "Section IX: Exit Criteria" and "Section XIX: Residual Risk", but those are not headings in the MTP; XIX is a glossary. | "Section XIX: Residual Risk" | Medium | Point to the corrected §IX exit criteria and to the glossary entry "Residual Risk" (C-13). |
| F-29 | §VI p. 25 | The 2-minute rejoin window is stated only once, in Section VI. It is absent from Section IX, the system plan and the acceptance plan, so a tester cannot find the criterion where it is needed. | "if rejoin fails within 2 minutes" | Medium | Add the 2-minute window to the §IX recovery criterion and to TCND-09 (C-09). |
| F-30 | §X p. 39; TR-02 p. 137 | Suspension rule 2 halts reminder testing when the gateway is unavailable, but TR-02's contingency is to use the mock and continue. The two instructions conflict. | "reminder-related testing will be halted" vs "Use the mock notification service" | Medium | Suspend only if both the sandbox and the mock are unavailable; otherwise switch to the mock and record the limitation (C-17). |
| F-31 | §II p. 9; CTP p. 43 | REF-10 is "Appendix C … (this document)" — a document cannot be its own reference. In the component plan, REF-03 is titled ISTQB CTFL but linked to IEEE 829, and REF-04 duplicates the ISTQB entry. | "REF-10 Appendix C … (this document)" | Medium | Remove REF-10; correct REF-03/REF-04 to match the master reference table (C-03). |
| F-32 | Front matter pp. 2, 7, 77, 143 | Wording and layout defects: "Featured To Be Tested", "(restructu red)", "C ontingency", "Eng." instead of "Engr.". | "VI. Featured To Be Tested" | Low | Correct the words and re-run a spelling check (C-03, C-21). |
| F-33 | §I p. 7 | Two document identifiers are printed for the same plan, and the identifier date (1 October) differs from the approval date (4 October). | "MTP-IT302-MEDILYNK-1 (IT302-MTP-G4-SCENARIO-D-v1.0)" | Low | Keep one ID and one date field; record the approval date separately in §XVIII (C-03). |
| F-34 | App. E p. 119 | "EP-01" is used for an evidence-principle check while "EP" already means Equivalence Partitioning throughout the plan. | "EP-01 No statement claims testing proves absence of defects" | Low | Rename the checks EV-01 to EV-07 (C-13). |
| F-35 | §II pp. 8–9 | IEEE 829-2008 is cited alongside ISO/IEC/IEEE 29119-3 without saying which governs the structure. IEEE 829-2008 has been superseded by 29119-3. `[EXTERNAL SOURCE — not re-checked online in this review]` | "IEEE Std 829-2008" and "ISO/IEC/IEEE 29119-3" | Low | State that 29119-3 is the governing structure and 829-2008 is cited for historical format only. Verify REF-05 (CTAL-AT v2.0, 2026) before submission — `[UNABLE TO VERIFY]` |

## Section-by-section review

**I. Test Plan Identifier (p. 7).** Present and readable. Not consistent: two IDs, two rows numbered 1.0, a broken word in the revision table, and a date that does not match the approval page. Correct before submission.

**II. References (pp. 8–9).** Present. REF-01 and REF-02 point to the same student-guide file; REF-10 is a self-reference; the level plans reuse REF-03 and REF-04 with different titles. Internal consistency fails even though the source list is plausible.

**III. Introduction (pp. 10–13).** Complete: purpose, scope, objective, assumptions and constraints are all there. The MySQL-versus-PostgreSQL assumption is handled well. The open-threshold assumption is honest, but later sections then treat the thresholds as fixed.

**IV. Test Items (pp. 13–17).** Complete item descriptions. The test-condition table is only an ID mapping: no condition is defined, two IDs exist only inside pairs, and the promised RTM is missing. The traceability pointer is wrong.

**V. Software Risk Issues (pp. 18–23).** The three High risks are described thoroughly with impact, mitigation, contingency and incident response. The promised nine-risk summary is absent, and the section points to an Appendix A that contains a different document. Scores for the other six risks are scattered elsewhere.

**VI. Features To Be Tested (pp. 24–25).** Complete and aligned one-to-one with REQ-01 to REQ-10. ER-08 is misused for time zones. The 2-minute rejoin value appears here but not in the criteria sections.

**VII. Features Not To Be Tested (pp. 26–27).** Clear exclusions with reasons. It conflicts with §IV's count, with the system plan's "TI-01 to TI-15", and with the Gantt's claim that execution began.

**VIII. Approach (pp. 28–35).** The risk-based strategy, techniques and entry criteria are good. Weaknesses: Integration and System are merged into one approach; there are no exit criteria; the two lifecycle figures disagree; the Gantt text is unsupported; Figure 11 is blank; Jest appears in a figure but not in the tool list.

**IX. Item Pass/Fail Criteria (pp. 36–38).** The ten functional criteria cover all requirements, but the section has no severity scale and no exit criteria, and some criteria are unmeasurable. Appendix E and the acceptance plan depend on an exit-criteria subsection that does not exist.

**X. Suspension Criteria and Resumption Requirements (pp. 39–40).** Present and mostly usable. Resumption numbering breaks (item 1, then an unnumbered item, then 2–4), and the gateway suspension rule contradicts the mock fallback in TR-02.

**XI. Test Deliverables (pp. 40–41).** The deliverable set is appropriate, but the heading and opening paragraph are duplicated and one list item is unnumbered. Owner roles are assigned.

**XII. Remaining Test Tasks (pp. 125–126).** Eight tasks with owners and descriptions; reasonable. It is physically separated from Section XI by 83 pages, which makes the plan hard to follow.

**XIII. Environmental Needs (pp. 126–129).** Complete for hardware, software, network, accounts and data. It matches the level plans and the no-real-patient-data constraint.

**XIV. Staffing and Training Needs (pp. 130–132).** Six role descriptions with duties and required skills. The titles conflict with §XV and with the appointment letters, and one heading reads "INTEGRATION TESTING" instead of "Integration Test Engineer".

**XV. Responsibilities (pp. 133–134).** A clean role/member table plus activity owners. It does not assign test-level ownership, and it contradicts §XIV and the letters. This is the plan's most visible governance problem.

**XVI. Schedule (pp. 135–136).** The ten-day planning schedule is coherent and dated. It is contradicted by the Gantt and by every level plan's relative weeks, and it ends before the approval date.

**XVII. Planning Risks and Contingencies (pp. 136–137).** Four risks with likelihood, impact, score, mitigation and contingency. TR-01's mitigation cites ER-06, which is a threshold, not a clarification action.

**XVIII. Approvals (p. 138).** Prepared and reviewed entries are dated 4 October 2026; the approver row has no signature or date and is marked pending. That is acceptable for a draft, but the dates must match the identifier page.

**XIX. Glossary (pp. 145–149).** Broad and useful. Four problems: it defines ER-01 to ER-08 when only three are used; it says Severity is in §IX, which is false; it conflates REQ with a test condition; and it claims TI-01 to TI-16 are in scope.

**Appendix A (pp. 42–60).** Cover only. The content is the Component Test Plan; the risk matrix is missing. As a result, every "see Appendix A" reference in the document is wrong.

**Appendix B (pp. 60–77).** Cover only. The content is the Integration Test Plan; the RTM is missing, so no requirement-to-test trace can be checked. The plan itself is otherwise complete except for the missing Table 4.

**Appendix C (pp. 78–93).** Cover only. The content is the System Test Plan; the static review log is missing. The plan is substantial, but its pass/fail cells contain literal `<br>` tags and it defines no exit criteria.

**Appendix D (pp. 94–104).** Cover only. The content is the Acceptance Test Plan; the quadrant map is missing. The acceptance plan is appropriately planning-only and has a real entry/exit criteria paragraph, unlike the master plan.

**Appendix E (pp. 105–124).** The seven-principles matrix is present (pp. 111–116) and is the strongest evidence artifact in the document. It is buried inside a duplicate acceptance plan with a new identifier, new risk IDs (AE), new check IDs (EP) and references to sections that do not exist.

## What is already correct

- The ten requirements and their numeric thresholds are internally consistent wherever they are repeated. No value drift was found for 10 minutes, 5 seconds, 24 h/1 h, ±2 minutes, 10 seconds or the 10-minute session.
- The risk scores that do exist agree with the prompt's known scores (PR-01 20, PR-02 20, PR-05 16, PR-06 15, PR-03 12, PR-09 12, PR-08 9, PR-04 6, PR-07 4).
- The assumption that MySQL replaces the recommended PostgreSQL is argued, not hidden.
- The document does not fabricate execution results, screenshots, defects or completed UAT. The one exception is the sentence "Testing began in the third week of September" (F-09).
- The acceptance plan correctly stays at planning level and does not claim UAT was run.

**Checkpoint 2 content is above. The user's instruction was to continue without stopping, so Phase 3 follows in `03-corrections.md`.**
