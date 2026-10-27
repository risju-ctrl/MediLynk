# MediLynk design system

Source of truth for the look of the app. Tokens live in `src/index.css` (`:root`); components use the names.

## Direction

A calm, macOS-style interface: the app is a rounded window floating on a soft blue-to-green desktop, with a frosted sidebar, white cards on a light-grey canvas, pill buttons and pastel status colours. The palette comes from the logo (a blue that slides into teal). Black is used for the single primary action on each screen, so the brand colour stays for marks, links, focus and the hero card.

Reference screens that informed it: a clinical dashboard with a soft sidebar and KPI cards, a clinic landing page with a rounded hero and bento sections, and a patient app with pastel cards and a calendar.

## Tokens

| Group | Tokens |
|---|---|
| Brand | `--brand #1d5bd8`, `--teal #14b8a6`, with `-soft` and `-ink` pairs |
| Surfaces | `--canvas #f3f5f8`, `--card #fff`, `--sunken #f6f8fb`, `--line #e6e9f0` |
| Ink | `--ink #0f1728`, `--ink-2`, `--muted #566176` (4.5:1+ on white), `--faint` (placeholders only) |
| Pastels | blue, sky, amber, rose, green: a soft fill and a dark ink each |
| Radius | window 28, card 22, large 18, control 14, pill 999 |
| Depth | `--shadow-sm` on cards, `--shadow-lg` on floating things, `--shadow-window` on the shell |

Status colour only ever means good (green), waiting (amber), bad (rose) or neutral (grey). Blue means "in progress or confirmed".

## Type

Inter Variable, self-hosted through `@fontsource-variable/inter`. Page title 30/700, card title 16/650, body 15/400, meta 12.5–13.5. Sentence case everywhere, no uppercase labels. Tabular figures for times and counts.

## Components

- **Shell**: 252px frosted sidebar with 42px nav rows (white pill when active), toolbar with the date and demo tools, account row at the bottom. On phones the sidebar becomes a bottom tab bar and the toolbar shows the brand and an account menu.
- **Buttons**: pill shaped. Primary is near-black, secondary is white with a border, danger is white with a rose border. One primary per screen.
- **Cards**: white, 22px radius, 1px line, a very light shadow. No cards inside cards.
- **Badges**: pill with a dot, soft fill, dark ink.
- **Segmented control**: replaces filter buttons and tabs, with counts.
- **Empty states**: icon, one line saying what is empty, one line saying what to do, and the action.
- **Booking**: doctor cards, a 14-day strip, slot buttons, a sticky summary.
- **Consultation room**: a dark stage with a status pill, a session timer and progress bar, and the recovery banner under it.

## Rules

- 4px spacing base, 20px between cards, 32px page gutter (16px on phones).
- Touch targets 42px or taller on phones.
- Visible keyboard focus (3px ring), skip link, `prefers-reduced-motion` respected, no entrance animations.
- Copy is written for patients: say what happened and what to do, no requirement IDs on screen.
