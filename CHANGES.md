# Changes

## 2026-10-27 — Full visual redesign

- New macOS-style design: rounded window shell, frosted sidebar, pastel cards, pill buttons, segmented
  filters, bottom tab bar on phones. Palette taken from the logo. See `design-system/MASTER.md`.
- Rewrote `src/index.css` as one organised, token-driven file (it was 539 lines of stacked overrides).
  Tailwind is now only used for its reset.
- Rebuilt the landing page: hero with a product preview, key facts, three steps, feature grid, role
  switcher, call-to-action band, FAQ and footer. Sign in and Create account share a new split layout with
  a show/hide password control and named demo accounts.
- Redesigned every screen for all four roles. Patient: greeting, next-visit card with countdown, reminders,
  week strip, booking with doctor cards and a day strip, appointments with Upcoming/Past tabs. Doctor:
  stats, calendar with an "Up next" list. Staff: searchable table with filters. Room: video stage and
  session panel.
- Demo tools moved from a floating button (it covered content) into the toolbar.
- Removed requirement IDs (REQ-xx) and "prototype" wording from patient-facing text; empty, loading and
  error states now say what to do next.
- **Deploy fix:** `BrowserRouter` now uses `basename` from Vite's base URL. Without it the site rendered
  blank at `https://<user>.github.io/MediLynk/`.
- Logos are now transparent PNGs (the white chip behind the lockup is gone). Added `public/favicon.png`.
- Font changed from Atkinson Hyperlegible to Inter Variable (`@fontsource-variable/inter`); removed
  `public/fonts/`.
- All `data-testid` hooks and business rules are unchanged; `npm test` passes (15/15).

## Dependency decisions

- **lucide-react 1.61.0** — the only new dependency. Justification: the app was
  using text glyphs (`✚`, `↗`, `⚙`) and had no icon set at all, which read as
  unfinished. `OpenCode_MediLynk_Prompt.md` §4 names Lucide via `lucide-react` as
  the one allowed addition. Icons are imported by name, so the bundle only carries
  the twelve that are used. Pro Max suggests Phosphor; §4 wins.

## 2026-10-26 — Phase 1 (design system) and icon pass

- Added `design-system/MASTER.md` with the tokens, type scale, components, states
  and per-role layouts.
- Replaced the `:root` block in `src/index.css` with the full token set and mapped
  the semantic tokens in `tailwind.config.js`.
- Replaced every rendered glyph with a Lucide icon: the brand mark (`✚`), the row
  action (`↗`), the demo-panel toggle (`⚙`), and the previously unused nav glyph
  strings with real nav icons.
- Added `src/components/BrandMark.jsx` as the single place the clinic logo lives.

## 2026-10-26 — Logo swap

- The supplied art is opaque 24-bit PNG on a near-white `#FEFEFE` ground, so no
  transparency was available to work with. `public/logo.png` (443×448 mark) and
  `public/logo-with-name.png` (1536×496 lockup) are copies; the originals stay in
  the project root untouched.
- Mark-only sits in the white sidebar; the full lockup replaces the "MediLynk"
  text on the landing header, the login/register story panel and the mobile auth
  header. The dark story panel gets a white chip behind the lockup so the opaque
  background reads as deliberate rather than a rendering bug.
- Favicon now points at the mark. Dead `.brand-mark` overrides from the duplicate
  CSS pass were removed.
- Still open: transparent PNG/SVG exports would remove the need for the white chip.

## 2026-10-26 — GitHub Pages deployment

- Initialised the repository (`main`) and committed the project, including the design
  system, the Lucide icon pass and the supplied logo.
- Logo URLs now come from `src/utils/brandAssets.js`, which prefixes
  `import.meta.env.BASE_URL`, so the same build works at the domain root and under a
  subpath. Vite already rebases the font and favicon URLs on its own.
- Added `.github/workflows/deploy.yml`: runs the tests, builds with
  `--base=/MediLynk/`, copies `index.html` to `404.html` for deep links, and deploys
  through GitHub Pages.
- `.gitignore` now also excludes `.env` files.


