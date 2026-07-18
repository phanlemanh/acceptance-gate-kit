# Web reference — sites, dashboards, web apps

Read this after the Context Lock, before generating tokens. It refines the
core process for the web; it does not replace it.

## Typography carries the page

On the web, type is the cheapest big lever you have — it sets personality
before a single image loads.

- Pair a characterful display face with a workhorse body face
  deliberately; never default to the pairing you'd reach for on any
  project. If the stack is constrained to system fonts, get character from
  scale, weight contrast, and spacing instead.
- Set a real scale (e.g., 1.2–1.333 ratio), define line-length 45–75
  characters for body text, and line-height ~1.5 for body, tighter
  (1.1–1.2) for large display.
- Use `rem` for type and spacing so user font-size preferences are
  honored. Minimum body size 16px; smaller text is for captions and data
  labels only.
- Load fonts with `font-display: swap` and preload the display face; a
  flash of invisible text is a self-inflicted performance bug.

## The hero is a thesis

The top of a page must state what this is, for whom, and what to do next —
in the most characteristic form the subject allows: a headline, a live
demo, a real screenshot, an interactive moment. The centered generic hero
(big claim, gradient blob, two buttons) is the template answer; use it
only if honestly nothing better fits this subject.

*Test: cover everything below the fold — does a first-time visitor know
what the product does and what to click?*

## Layout and density

- Choose density from the Context Lock, not from fashion: marketing pages
  breathe; operational dashboards for daily actors earn high density,
  tighter spacing, and smaller (but still ≥ 4.5:1 contrast) type.
- Density is measured at the fold, not asserted in the plan. *Test: at the
  primary desktop width, count the records visible without scrolling —
  would your daily actor call that a working set, or a preview?* Airy
  rows, oversized per-row buttons, and tall chrome are how a "high
  density" decision quietly ships as 14 rows where 25 fit; an operator
  pays that tax every minute of every shift.
- Build on a spacing grid (4/8) and a consistent max-width container.
  Full-bleed is a choice for specific sections, not the default.
- Structure encodes meaning: eyebrows, dividers, and numbering must say
  something true about the content. Number things only when order carries
  information.

## Forms — where products are won and lost

- One column beats two; group by topic; label above the field (not
  placeholder-as-label — it vanishes on focus and fails recall).
- Validate inline on blur, not only on submit; error text sits next to the
  field, says what's wrong and how to fix it.
- Mark optional fields, not required ones (most fields should be
  required — if they aren't, cut them).
- Every extra field is a cost paid by every user forever. *Test: for each
  field, name who uses the answer and for what. No answer → delete it.*
- Preserve user input at all costs: navigation away, validation failure,
  or a lost connection must never destroy what someone typed.

## Data tables and dashboards

- Right-align numbers, use tabular figures (`font-variant-numeric:
  tabular-nums`), and keep decimal places consistent per column.
- Row hover, sticky header, and a visible sort state are baseline for any
  table an operator uses daily.
- Empty and single-digit datasets are states too: a chart with one data
  point must not look broken.
- Progressive disclosure over cramming: summary row → expand for detail
  beats 14 columns of everything.

## Performance is UX

Budgets, verified, not hoped for:

- LCP < 2.5 s, CLS < 0.1, INP < 200 ms on a mid-range device profile.
- Images: modern formats, explicit `width`/`height` (CLS), lazy-load below
  the fold only.
- Ship the skeleton with the first paint; reserve space for everything
  that arrives late. Layout shift is broken trust rendered visible.

## Keyboard, focus, and scroll

- Focus order follows visual order; a visible `:focus-visible` style on
  every interactive element (never `outline: none` without replacement).
- Skip-to-content link on content-heavy pages.
- Respect scroll: no hijacking, no surprise `scroll-behavior` on user
  actions, modals trap focus and restore it on close.

## CSS craft notes

- Derive every value from the tokens (CSS custom properties). A hex code
  or px value outside the token sheet is drift — the exact failure Step 3
  exists to prevent.
- Watch selector specificity: type-level section rules
  (`.section`) and element rules (`.cta`) commonly cancel each other's
  spacing. Keep specificity flat; prefer utility or component classes with
  one clear owner for each margin.
- Dark mode is a re-mapping of semantic color roles, not a second
  stylesheet. If dark mode requires touching components, the tokens were
  wrong.
- Container queries over viewport queries for components that live in
  multiple layouts.

## Web top-tier notes

- Optimistic UI on every mutation the server will almost certainly accept;
  reconcile and offer undo on failure.
- Prefetch on hover/intent for primary navigation; route transitions keep
  a stable shell so the app never white-flashes.
- Command surface (Cmd+K) once an app has more than ~15 destinations or
  frequent cross-navigation; keyboard shortcuts documented in the UI
  itself.
