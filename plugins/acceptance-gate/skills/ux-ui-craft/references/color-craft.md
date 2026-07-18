# Color craft — ramps, undertone, and deployment

Read at Step 3 when building the palette. Contrast ratios make color
*legal*; this file makes it *professional*. Work in OKLCH: its lightness
is perceptual, so ramps built by stepping L actually look even — hex
guessing does not survive dark mode.

## Build ramps, not palettes

- **Neutral ramp with ONE undertone.** Decide warm (paper, cream, putty)
  or cool (slate, zinc) from the direction, then keep every neutral —
  background, surface, border, muted text — on that undertone. Mixed
  undertones (warm page + pure-gray borders) is the quiet tell that a
  palette was assembled, not built. Borders come from the same ramp as
  surfaces, two steps apart.
- **7–9 lightness steps** from page to ink. Surface elevation = climbing
  the ramp (L+3–5% per level), shadows optional on top. This is what
  makes "flat but layered" work.
- **Accent as a ramp too**: ink (text-safe on light, ≥4.5:1), base
  (buttons), bright (on-dark), soft (fills), tint (washes ~10%). One hue,
  five duties — this kills the washed-CTA failure where a single accent
  value is asked to do jobs it can't.

## Deployment discipline

- **One accent, budgeted appearances**: primary action, focus ring,
  selected state, one key data highlight. When the accent marks
  everything, it marks nothing.
- **Status colors are data, not decoration.** Red/amber/green appear
  only where state is being encoded, on a consistent scale (soft fill +
  line + strong text), theme-invariant. If a screen's most saturated
  pixel isn't its most important fact, redistribute.
- **Large fills desaturate**: a hue that sings at 24px chip size shouts
  at 400px hero size — drop chroma ~30–50% as area grows.
- **Temperature coherence**: imagery, illustration, and UI neutrals
  share warmth. A warm photo on a cool-gray card looks pasted on.

## Dark mode as an engineered remap

- Invert the lightness ladder, don't negate colors. Never pure black
  (#0a0a0c-family with the undertone kept) or pure white text (L≈93%).
- **Compensate chroma upward** slightly — the same chroma reads duller
  on dark — but desaturate large fills as above.
- Elevation on dark = *lighter* surfaces (climbing toward the viewer),
  never darker; shadows barely work on dark, lightness does.
- Re-run the contrast script on the dark pairs separately; passing light
  mode proves nothing about dark.

## Tests

1. **Grayscale squint** — hierarchy must survive without hue.
2. **Ramp audit** — every color in the CSS traces to a ramp+role; a hex
   that belongs to no ramp doesn't ship (it's the drift Step 3 exists to
   prevent).
3. **Contrast script on every shipped pair, both themes** — measured,
   not assumed.
4. **Saturation map** — squint and find the most saturated region: is it
   the primary action or key state? If it's a decorative band, rebudget.
