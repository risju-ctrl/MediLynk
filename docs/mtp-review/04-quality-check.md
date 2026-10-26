# Job A — Phase 4 quality check

**Asked:** would this corrected MTP pass a review for completeness, consistency, traceability, four test levels, measurable criteria, risk scores, scope, responsibilities, schedule/tools/environment, references, no unsupported claims, and writing quality?

**Verdict:** not yet. The content is strong enough to fix; the submitted layout is not usable as a master plan.

## Checklist

| # | Check | Result | Why |
|---|---|---|---|
| 1 | Completeness — every MTP section present and in order | **Needs correction** | All 19 sections exist, but XII–XIX are separated from I–XI by 83 pages, and Appendices A–D are covers whose content is a different document. |
| 2 | Internal consistency | **Needs correction** | Scope count (16 / 15 / 13), ER-08 (two meanings), roles (three versions), schedules (five versions), revision history (two 1.0 rows). |
| 3 | Traceability REQ → PR → TCND → TI → tests | **Needs correction** | The RTM appendix is missing and no TCND is defined. The p. 17 table is a skeleton only. C-07 supplies the smallest usable version. |
| 4 | Four distinct test levels | **Needs correction** | Four level plans exist and are individually coherent, but the master merges integration and system into one approach item, and Appendix E duplicates the acceptance plan. |
| 5 | Measurable pass/fail and exit criteria | **Needs correction** | No severity scale, no exit criteria, \"clear error\", and masking judged against an unapproved matrix. C-09 fixes this. |
| 6 | Risk scores correct and consistent | **Pass with a note** | All nine scores match the published values and the Low/Medium/High bands. The note: they are scattered across four plans because Appendix A is missing. |
| 7 | Scope and exclusions consistent | **Needs correction** | Three documents give three different item counts; the Gantt claims execution while §VII excludes it. |
| 8 | Responsibilities clear and consistent | **Needs correction** | §XIV, §XV and the six appointment letters disagree. This is the most visible governance defect. |
| 9 | Schedule, tools and environment realistic and consistent | **Needs correction** | Tools and environment are realistic and match the no-real-data constraint. Schedules contradict each other, the integration table is missing, and Jest appears in a figure but not the tool list. |
| 10 | References and standards | **Needs correction** | REF-10 is a self-reference; REF-03/REF-04 are mismatched in the component plan; two standards are cited without precedence; REF-05's 2026 edition was not verified. |
| 11 | No unsupported claims of completed testing | **Needs correction** | Only one sentence (p. 35, \"Testing began in the third week of September\"). No fabricated results, screenshots or defect counts were found. |
| 12 | Writing quality | **Needs correction** | Duplicated Section XI, literal `<br>` tags, a `[screenshot]` placeholder, broken words, and a typo in the TOC. |

## Verification of the two hardest claims

**Claim: Appendix A–D do not contain the artifacts named on their covers.**
Verified from the text layer at the page boundary in each case: p. 42 cover → p. 43 `CTP-IT302-MEDILYNK-1`; p. 60–61 cover → p. 61 `ITP-IT302-MEDILYNK-1`; p. 78 cover → p. 79 `STP-IT302-MEDILYNK-1`; p. 94 cover → p. 95 `ATP-IT302-MEDILYNK-1`. This is not an inference from the TOC; the identifiers are printed on the pages.

**Claim: Figure 11 is blank.**
Verified three ways: the text layer for p. 69 contains only the caption; the rendered page has 0.41% non-white pixels versus 4.13% on p. 70; and the page's operator list has 24 text operators, 3 path constructions and no image, while the comparable p. 70 has an image plus 19 text operators. A human should still glance at p. 69 before the report goes out, because this review could not view images.

## Top five corrections, in order

1. **Fix the document skeleton (C-01, C-02).** Move XII–XIX directly after XI, put the four level plans in their own part, and make Appendices A–E contain the artifacts their covers name. Nothing else can be trusted until a reader can navigate the file.
2. **Build Appendix B (C-07).** Define TCND-01 to TCND-14, correct the TCND-13 row, and add the TI links. This turns \"bidirectional traceability\" from a claim into a check.
3. **Build Appendix C (C-08).** Supply the original ER-01 to ER-08 log or renumber the set. Remove ER-08's second meaning and give time zones its own ID.
4. **Replace every schedule with one calendar-anchored table (C-10, C-11).** Delete \"Testing began\", remove July, insert the missing ITP Table 4, and derive the level weeks from the master table.
5. **Reconcile governance (C-03, C-14).** One ID, one version per row, one title per member, and letters regenerated or annotated. Fix the approval date so it matches the identifier page.

## Questions that block a final sign-off

1. Do the original static-review findings ER-01, ER-02, ER-03, ER-05 and ER-07 exist outside this PDF? If not, should the set be renumbered, or should the references be removed? `[NEEDS GROUP CONFIRMATION]`
2. Are the 10-minute buffer, 5-second sync, 24 h/1 h ±2 min, 2-minute rejoin, 10-second start and 10-minute session confirmed by the instructor, or still proposals? The plan currently says both. `[NEEDS INSTRUCTOR CONFIRMATION]`
3. Which role × field matrix is authoritative for REQ-05? The acceptance criterion cannot be evaluated until it is approved. `[NEEDS GROUP CONFIRMATION]`
4. Was the Midterm supposed to contain four full level plans, or only the master plan with the level plans as separate submissions? The answer decides whether Part 2 stays in this file. `[NEEDS GROUP CONFIRMATION]`
5. Should the governing structure be ISO/IEC/IEEE 29119-3 (which supersedes IEEE 829-2008)? `[NEEDS INSTRUCTOR CONFIRMATION]`
6. What are the real execution dates after approval, and who signs as approver? `[NEEDS GROUP CONFIRMATION]`

## Overall assessment

The group did the hard thinking: the requirements are specific, the thresholds are consistent, the risk analysis is real, the four level plans are substantive, and the seven-principles matrix is genuinely good work. What is missing is the connective tissue — the RTM, the static review log, the risk matrix, the quadrant map — and the discipline that keeps one version of the truth for scope, roles and dates.

As submitted, the document should not be called a complete v1.0 master test plan, because four of its five appendices do not contain what their covers promise and the master plan has no exit criteria. With C-01 to C-14 applied, it becomes defensible: a reader can trace every requirement to a condition, every condition to a level and an owner, and every level to a schedule that does not contradict the others.

**Recommended disposition:** revise and resubmit as v1.2; do not start dynamic execution until the instructor confirms ER-06 to ER-08 and approves v1.2.
