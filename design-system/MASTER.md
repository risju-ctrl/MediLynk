# MediLynk design system

Source of truth for tokens, type, components, states and per-role layouts.
Every later phase reads this file before touching a screen.

## 0. How this was decided, and what wins

| Input | What it gave |
|---|---|
| `OpenCode_MediLynk_Prompt.md` §4 | Hard constraints: one brand colour, neutral surfaces, 4–8px radii, no gradients/glass/pills-as-decoration, Lucide only new dependency, 4.5:1 text |
| UI/UX Pro Max, query *"healthcare clinic teleconsultation booking app, patient and clinician dashboards"* | Style: minimalism / Swiss. Type: Atkinson Hyperlegible. Palette direction: calm cyan plus health green. Pattern "hero + testimonials + CTA" rejected (no invented proof; the public pages stay short and honest) |
| Taste skill, app sheet `accent-ladder`, seed 2005464730, shell `open plane` | One hue at full strength on small marks only; its pale tints carry areas. Sidebar on the page ground, no top-bar chrome, 34px nav pitch, 230–256px sidebar. KPI strip split by 1px dividers, no tiles. Tables as rules and alignment |

Precedence: **section 4 of the prompt > this file > either skill.** Where a skill
recommends a device section 4 bans (16px card corners, tinted page ground, testimonial
pattern), section 4 wins and the deviation is noted below.

Deviations from the dealt sheet, with reasons:

- Palette kept from the brand (`#0E7490`), not the dealt raspberry. The sheet allows
  `--keep palette,type`.
- The one filled primary stays brand teal instead of near-black. Teal on white text is
  5.4:1; the brand needs one recognisable mark and this is it.
- No `framed-sheet` shell (16px sheet corner and an L-frame) because radii are capped at 8px.

## 1. The product and its jobs

MediLynk is a clinic teleconsultation booking and reminder system. Four roles, four
different jobs, so four different densities:

| Role | Opens the app | Job that must be one click away | Density |
|---|---|---|---|
| Patient | Mobile, minutes before a visit | Book a slot, join the room | Sparse, one column |
| Doctor | Desktop, whole clinic day | Open the next consultation, write notes | Dense, schedule-centred |
| Clinic staff | Desktop, whole shift | Resolve a flagged sync, cancel/reschedule | Densest, tables |
| System admin | Desktop, occasionally | Find an account, disable it | Plain table |

## 2. Tokens

All colour lives in `src/index.css` `:root`. No raw hex in a component.

### Ground and ink

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--bg` | `#F5F7F8` | Page ground | — |
| `--card` | `#FFFFFF` | Panels, tables, inputs | — |
| `--surface-2` | `#F9FAFB` | Recessed wells, table header strip | — |
| `--tint` | `#E8F2F5` | Active nav row, selected row, badge fill | — |
| `--tint-strong` | `#CFE5EC` | Selected border, progress track | — |
| `--fg` | `#17323B` | All running text | 13.5:1 on `--bg`, 15.6:1 on white |
| `--fg-muted` | `#4F646C` | Secondary text, labels, metadata | 5.8:1 on `--bg`, 6.2:1 on white |
| `--fg-faint` | `#63757D` | Placeholders only | 4.8:1 on white |

### Brand

| Token | Value | Use |
|---|---|---|
| `--primary` | `#0E7490` | Filled primary button, links, active tab indicator, focus ring |
| `--primary-hover` | `#155E75` | Hover/pressed on the primary |
| `--on-primary` | `#FFFFFF` | Text on the primary (5.4:1) |
| `--ring` | `#0E7490` | 3px focus outline, 2px offset |

Brand accent budget: **under 5% of any screen**, and only on: the one primary action,
the active nav row, the data mark in a chart, the selected row. Never on headings,
body text, borders, or every button.

### Status (semantic, four only)

| Token | Value | Pill background / ink |
|---|---|---|
| `--positive` | `#047857` | `#DCFAE5` / `#04250E` |
| `--warning` | `#B45309` | `#FEF3C7` / `#78350F` |
| `--negative` | `#B91C1C` | `#FEE2E2` / `#7F1D1D` |
| neutral | `--fg-muted` | `--surface-2` / `--fg` |

Status colour means good/bad, never up/down. A zero or unknown state is neutral.

### Lines, radius, space, controls

| Token | Value | Notes |
|---|---|---|
| `--border` | `#D5DFE3` | Card and table edges |
| `--line` | `#E4EAED` | Row rules |
| `--border-control` | `#7F939B` | Input and secondary button borders (3:1 against white) |
| `--radius-card` | `8px` | Cards, panels, tables |
| `--radius-control` | `6px` | Buttons, inputs, selects |
| `--radius-chip` | `4px` | Status chips, tags |
| `--pad` | `24px` | Page gutter (16px on phones) |
| `--gap` | `16px` | The one gap value, horizontal and vertical |
| `--card-pad` | `20px` | Inside a panel |
| `--nav-row` | `34px` | Sidebar row pitch |
| `--control-h` | `36px` | Buttons and compact controls |
| `--row-h` | `44px` | One-line table rows |
| `--duration-fast` | `150ms` | Feedback only; no entrance animation on app screens |

Spacing is on a 4px base. One gutter value per screen. No nested panels.

## 3. Type

One family, Atkinson Hyperlegible, self-hosted 400 and 700 only. `font-weight: 600`
resolves to 700 in `tailwind.config.js`, so nothing renders a synthesised weight.

| Role | Size | Weight | Line height |
|---|---|---|---|
| Page title (`h1`) | 24px | 700 | 1.2 |
| Section or card title (`h2`, `h3`) | 16px | 700 | 1.3 |
| KPI figure | 24px | 400 | 1.2 |
| Body, nav, table cells | 14px | 400 | 1.5 |
| Labels, metadata, chips, axis ticks | 12px | 400 | 1.4 |

Five sizes, no more. Nothing below 12px. Sentence case everywhere. No uppercase
tracked labels. Numbers use `font-variant-numeric: tabular-nums` in tables, KPIs and
anything that updates. No monospace outside real IDs and code.

## 4. Components

### Shell (open plane)

- Sidebar 224–256px on the page ground, one hairline to the canvas, no top bar.
  The product mark and name sit at the top; the account row at the bottom.
- Nav rows 34px pitch, 14px labels, one grey or `--tint` active pill (radius 6px),
  no coloured left bar. Lucide outline icons at 16px, stroke 1.5.
- Canvas fluid, one gutter (`--pad`), one left edge from title to last row.
- Phone: sidebar folds to a 48px bar with the screen name, a menu button that opens a
  full-screen nav sheet, and at most one action. 16px margins, 44px targets.

### Title row

`h1` at 24/700, an optional 14–16px grey line under it carrying the finding or the
scope (never an instruction about the interface), and at most one primary action on the
right. No eyebrow, no badge above the title.

### Buttons

| Variant | Look | Use |
|---|---|---|
| Primary | `--primary` fill, white label, 6px radius, 36px tall | One per screen; the screen's main job |
| Secondary | White fill, 1px `--border-control`, ink label | Escape, secondary actions |
| Text | Ink label, underline on hover | Row actions, "View all" |
| Danger | White fill, 1px `--negative`, `--negative` label | Cancel, delete, disable |

Focus: 3px `--ring` outline, 2px offset, never removed. Hover changes fill only, never
layout. Disabled stays readable (not below 4.5:1) and says why in text.

### Inputs

Label above the field, 14px, 8px gap. 36–46px tall, white fill, 1px `--border-control`,
6px radius. Inline error in `--negative` under the field, tied to it with
`aria-describedby` and `aria-invalid`. A limit that remains (password rules, file type
and size) is written beside the field. No placeholder used as a label.

### Tables and lists

Header 12px grey sentence case, no fill, no rule. Rows 44–56px, 1px `--line` rules or
none, no zebra. Identity column widest; numbers right-aligned and tabular; one status
mark per row; actions in one trailing column at a fixed pitch. Total stated above the
table. Empty state keeps the frame and adds one sentence.

### KPIs

One container split by 1px dividers, three or four cells. Label 12–14px grey above the
value, value 24px, a 12px caption naming the baseline. No tiles, no icon, no sparkline,
no delta pill. At most one figure is larger than its siblings: the one that answers the
screen's question.

### Status chips

18–22px tall, `--radius-chip`, pale tint with dark ink of the same hue, 12px text,
`white-space: nowrap`. One mark per row. Never a saturated fill with white text except
the single primary action.

### Empty, loading, error, success

| State | Rule |
|---|---|
| Empty | Keep the frame and the header; one sentence naming the next action, with that action as a real control |
| Loading | Final layout with values replaced by flat grey bars at their real size; no shimmer, no layout shift |
| Error | Inside the failing block: what failed, when data was last good, a Retry control. Never a full-screen banner |
| Success | One `aria-live="polite"` sentence beside the action that changed, plus the updated row. No toast that disappears with the message |

## 5. Per-role layout

**Patient** — one column, mobile-first. Overview answers "when is my next visit": next
appointment as the lead block, reminders beside it, then book/symptoms/records as text
actions. Booking is a single page: doctor, date, slot grid (44px targets), symptoms,
confirm. The room is full-bleed with a 10-minute timer.

**Doctor** — schedule-centred. Day list or calendar as the lead block, the next
consultation and its join action adjacent, consultations table below. Room and notes
share one reading column; saving notes shows a quiet "Saved" stamp.

**Clinic staff** — table-heavy. Appointments table with filters as tabs on a rule,
sync status as one chip, conflict desk as a queue with the failing row's action visible.
Every row action is a real button at a fixed trailing column.

**System admin** — one plain users table: name, email, role, status, one action.
No charts, no cards.

**Public** — landing is a short honest page: what it does, the three steps, one primary
action, and the line that data is synthetic. Sign in and register are single-purpose
forms in one column; the demo-account picker moves behind the demo panel.

## 6. Banned, checked in every UI phase

Gradients on grounds/buttons/text, glow, glass or backdrop blur, decorative blobs and
orbits, emoji or glyph characters as icons, cards nested in cards, rows of identical
icon-topped cards, oversized headings (>32px in app screens), fake metrics or charts,
invented testimonials or logos, piles of decorative pills, "heading + three cards" as a
page structure, dark or saturated sidebars, uppercase tracked table headers, zebra rows,
left-aligned numbers, constant hover animation, and any number that is not computed from
the store or the database.

## 7. Accessibility floor

- Text 4.5:1, non-text UI 3:1, focus ring always visible.
- 44px minimum touch target on mobile; 12px minimum text.
- Every input labelled; every error tied to its field; every async result announced
  with `aria-live`.
- Keyboard reaches every control in reading order; the mobile nav sheet traps focus
  while open and restores it on close.
- `prefers-reduced-motion: reduce` removes transitions, never content.

## 8. What each phase changes

| Phase | Uses this file for |
|---|---|
| 1 (done) | Tokens, type scale, Tailwind mapping |
| 2 | Nothing visual; server work |
| 3 | Component behaviour and states |
| 5 | Page-by-page rebuild against §4–§6, screenshots at 375/768/1280, glyphs replaced with Lucide |
| 6 | Final contrast, focus and keyboard checks |
