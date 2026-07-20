# Typography craft — technique beyond the budgets

Read at Step 3 when setting type. The budgets (≤2 faces, one scale) say
how much; this file says *how well*. On the web, type is 90% of the
interface's voice — it loads before any image and outlives every trend.

## Pairing logic — contrast on at least two axes

A pairing works when the faces differ on ≥2 of: construction
(serif/sans/slab/mono), weight range, width, era. Differing on none reads
as a mistake; differing on all four reads as a costume.

Recipes by intent (derive from the direction, don't rotate):
- **Editorial authority** — high-contrast or old-style serif display +
  neutral grotesk body. The serif carries conviction; the grotesk keeps
  it working.
- **Technical/instrument** — grotesk display + mono for every number and
  identifier. The mono *is* the personality; don't add a serif on top.
- **Warm human** — humanist sans throughout, serif only as an accent
  (pull quotes, one hero line). Warmth from generous x-height and round
  terminals, not from script fonts.
- **Single-family strategy** — one variable family, personality from
  weight span (300↔800) and optical size. The discipline choice for
  system-owned surfaces.

## Scale technique

- Ratio by density: **1.2** for dense operational UI, **1.25** for
  product surfaces, **1.333+** for editorial pages. One ratio per
  surface.
- **Skip a step for display**: h1 jumping two scale steps above h2 reads
  intentional; adjacent steps read timid.
- Fluid display: `clamp(2.2rem, 1.2rem + 3.5vw, 4rem)` — floor keeps
  mobile dignified, ceiling protects the measure. Body never fluid below
  16px.
- Cap display size by copy length before aesthetics: past ~50 characters,
  step down a rung rather than shrinking tracking.

## Micro-typography — where "designed" is actually perceived

- **Tracking**: tighten display type (≥32px) by −1 to −2.5%; body stays
  at 0; tracked-out text is for SHORT UPPERCASE LABELS only — never
  lowercase.
- **Numbers**: `font-variant-numeric: tabular-nums` wherever digits
  align vertically (tables, timers, prices); mono face for identifiers;
  consistent decimals per column; unit labels one step muted.
- **Wrapping**: `text-wrap: balance` on headings, `text-wrap: pretty` on
  body where supported; `overflow-wrap: anywhere` + `min-width: 0` on
  any user-supplied string.
- **Real glyphs**: curly quotes, en/em dashes, × not x, − not hyphen for
  minus. Straight quotes in display copy are a five-second tell.
- **Line-height inverse to size**: 1.05–1.2 display, 1.4 UI, 1.5–1.65
  body. Measure 45–75ch; a wide container is a layout problem, not a
  license for 120ch lines.

## Hierarchy technique

Order of levers: **weight first, then size, then color** — a page that
does hierarchy with size alone gets loud; with color alone gets vague.
The eyebrow pattern done right: small tracked caps, one step muted,
directly above the heading in the same column — never fake-numbered,
never floating in the left margin.

## Label discipline — the voice budget

Every text element is one of three things: **content** (what the reader
came for), **label** (names a group), or **metadata** (annotates for a
narrower audience). Clutter is what happens when labels and metadata
outnumber content:

- **One eyebrow voice per card.** A card whose header, badge, chip, and
  caption each wear different small-caps styles has four label voices
  arguing; pick one style (size, color, casing) and reuse it.
- **Chips are ONE style.** If every row wears a chip, the chips have
  become the layout — collapse them to a single muted mono style, one
  color, smallest step on the scale. Metadata never gets more visual
  presence than the content it annotates.
- **Count the voices**: display + body + one mono/data voice = three.
  Each additional voice (a colored tag, an italic note, a second chip
  style) must displace one — it can't just join.
- *Measured test: on the rendered screen, count computed font sizes
  (≤5-6 — the Step-6 Type budget, which is the single authority) and
  distinct small-label colors (≤2). 33 tiny mono labels in 7 colors
  across a 12-size ladder is what "lộn xộn" looks like in numbers — and
  none of it came from the token sheet; it leaked in through inline
  styles.*

*Test: print the page grayscale at 50% zoom. If reading order isn't
obvious, the type hierarchy failed regardless of how the palette looks.*
