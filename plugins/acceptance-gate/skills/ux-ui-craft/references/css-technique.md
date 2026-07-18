# CSS technique — the design-engineer's toolbox

Read at Step 6 while writing code. Craft dies in translation when the
hands don't know the medium; these are the implementation moves that make
a design render *crisp* instead of approximately.

## Fluid and intrinsic values

- Space and type scale fluidly with `clamp(min, calc, max)`; components
  respond to their *container*, not the viewport: `@container` +
  `cqi` units for anything that lives in multiple layouts.
- Grid: image-bearing tracks are `minmax(0, 1fr)` (bare `1fr` lets
  content blow the track); `auto-fill` keeps empty tracks for stable
  rhythm, `auto-fit` collapses them — choose deliberately.
- `subgrid` aligns card internals (title/meta/action rows) across
  siblings — the difference between a card grid and a card *system*.

## State styling without JavaScript

- `:has()` turns state into CSS: `form:has(:invalid)` gates the submit
  affordance's look; `.list:not(:has(li))` reveals the empty state;
  `:has(> [data-state="error"])` tints a container. Less JS = fewer
  broken states.
- Derive interaction ladders from tokens instead of inventing hovers:
  `color-mix(in oklch, var(--primary), black 8%)` for hover,
  `12%` for active, `white 88%` for tint fills. One source of truth,
  mathematically related steps.
- `light-dark(var(--x-light), var(--x-dark))` where supported collapses
  theme forks at the declaration site.

## Crisp details (where "production" is perceived)

- Hairlines: `1px` reads heavy on dense data UI — use a low-alpha border
  from the neutral ramp (`color-mix(in oklch, var(--border), transparent
  40%)`) rather than a lighter gray that breaks undertone.
- Media: always `aspect-ratio` + `object-fit: cover` — reserved space
  kills CLS and cropping stays intentional.
- Reserve space for late content: `min-height: 1lh` on message slots,
  skeletons matching the real layout's dimensions (a skeleton that
  reflows on load is a spinner with extra steps).
- `scrollbar-gutter: stable` on scroll containers; `scroll-margin-top`
  on anchor targets under sticky headers.
- Focus: `:focus-visible` ring via `outline` + `outline-offset: 2px` —
  outlines don't shift layout and appear instantly (never animate them).

## Motion engineering

- Animate `transform` and `opacity` only; set `transform-origin` to the
  edge the element logically comes from — origin is what makes motion
  read as spatial rather than decorative.
- Stagger lists with `transition-delay: calc(var(--i) * 40ms)` (cap the
  total under ~400ms); asymmetric enter/exit (enter 200ms, exit 150ms).
- `@starting-style` gives entry transitions to newly-inserted elements
  without JS class juggling.
- `prefers-reduced-motion: reduce` collapses spatial motion to ≤150ms
  opacity — write it once at the sheet's end, not per-component.

## Performance is rendering craft

- `font-display: swap` + preload the display face; system-stack fallback
  metrics close to the webfont to reduce swap-shift.
- `content-visibility: auto` on long below-fold sections.
- `text-wrap: balance` (headings) / `pretty` (body) — free rag quality
  where supported; harmless where not.
- Logical properties (`margin-inline`, `padding-block`) by default —
  free correctness if the surface ever localizes to an RTL market.
