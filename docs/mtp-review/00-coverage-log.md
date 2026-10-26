# Job A — Phase 0 coverage log

**Source:** `Master Test Plan - G4.pdf` (149 pages, version 1.0, October 2026)
**Extraction:** text layer extracted with `pdfjs-dist` 4.8.69, one text file per page.
**Reading window:** every page's text was extracted; the pages cited in the findings were read closely, and pages 42–126 were scanned page by page for headings and identifier occurrences.

## Page ranges read

| Range | What was read |
|---|---|
| 1–20 | Cover, table of contents, identifier, references, introduction, test items, start of risk section |
| 21–40 | Risk issues, features, exclusions, approach, techniques, tools, figures 3–5, Gantt, pass/fail |
| 41–60 | Deliverables, Appendix A cover, Component Test Plan (pp. 43–60) |
| 61–77 | Appendix B cover, Integration Test Plan (pp. 62–77) |
| 78–93 | Appendix C cover, System Test Plan (pp. 79–93) |
| 94–104 | Appendix D cover, Acceptance Test Plan (pp. 95–104) |
| 105–124 | Appendix E cover, "Seven Testing Principles" plan and matrix (pp. 106–124) |
| 125–138 | MTP sections XII–XVIII (remaining tasks, environment, staffing, responsibilities, schedule, risks, approvals) |
| 139–144 | Appointment letters for the six members |
| 145–149 | Glossary |

**Pages that could not be read:** none for the text layer.

## Figure pages

| PDF page | Figure | Method | Result |
|---|---|---|---|
| 29 | Figure 3, Defect Lifecycle Diagram | Rasterised at 2×, OCR | State names read: NEW / TRIAGED / IN PROCESS / FIXED / REOPENED / RETEST / REJECTED / DEFERRED / CLOSED |
| 33 | Figure 4, Defect Lifecycle in MediLynk Testing | Rasterised at 2×, OCR | Different state names: NEW / OPEN / IN PROGRESS / READY FOR RETEST / CLOSED / REOPENED / REJECTED / DEFERRED |
| 34 | Figure 5, Systems Engineering Diagram of Test Tools | Rasterised at 2×, OCR | V-model rows and tool names read |
| 35 | Table 1, Gantt Chart | Rasterised at 2×, OCR | Cell text largely unreadable; the text table below it (Component Sept wks 3–4, Integration Sept wk 4–Oct wk 1, System Oct wks 1–2, Acceptance Oct wk 2, Reviews Oct wk 2) was used instead |
| 56 | Figures 6 and 7, training screenshots | Rasterised at 2×, OCR | Captions and "Jest" / "MySQL unique-constraint" text read |
| 57 | Figures 8 and 9, training screenshots | Rasterised at 2×, OCR | Captions read; the text layer also contains a literal `[screenshot]` placeholder |
| 58 | Figure 10, Jira training screenshot | Rasterised at 2×, OCR | Caption read |
| 69 | Figure 11, Booking to Calendar Integration Flowchart | Rasterised at 2× and 4×, OCR, page-ink measurement | **Figure is blank.** Page has 0.41% non-white pixels, 24 text operators and no image; only the caption is present. Compare page 70 (4.13% ink), whose flowchart text OCRs normally. |
| 70 | Figure 12, Appointment to Reminder Integration Flowchart | Rasterised at 2×, OCR | Flowchart labels read (Appointment Confirmed → Notification Manager → Reminder Time → Dispatch → Log → Retry → Flag → Completed) |

**Limitation, stated plainly:** this environment does not accept image input, so the rasterised figures could not be *viewed* as pictures. The figure findings therefore rest on OCR text, the PDF text layer, and page-ink/operator counts. That is sufficient to prove Figure 11 is blank and to compare the two lifecycle diagrams, but it is not a substitute for a human looking at the pages. No claim in this review depends on the visual style of a figure.

## Coverage conclusion

All 149 pages were extracted and logged. The only missing artifact found by reading is the Figure 11 flowchart on page 69. The Gantt chart on page 35 could not be read reliably as an image; its accompanying text table was used and is cited as such.
