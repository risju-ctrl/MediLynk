# Changes

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

