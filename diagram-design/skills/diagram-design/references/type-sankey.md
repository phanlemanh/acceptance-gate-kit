# Sankey

**Best for:** where a population goes and where it leaks — trial-to-paid flows, traffic splits, budget allocation, energy or material balance, funnel drop-off with more than one exit.

Static editorial storytelling only. A data-bound, interactive, or live-updating sankey inside an artifact or app code belongs to a dataviz / chart skill — this type produces one standalone HTML file that argues one point.

## When sankey beats pyramid / funnel
- A stage splits to **two or more destinations**. A funnel can only narrow; a sankey shows *where* the missing people went.
- The leak is the story, not the conversion. Coral goes on the loss, not the win.
- The reader will check your arithmetic — sankey makes "out equals in" visible at every node.

Use pyramid / funnel instead when every drop-off has the same destination (just "gone"), or when the stages are a rank rather than a flow.

## Layout conventions
- 3–4 node columns, evenly spaced on the 4px grid (e.g. x = 100 / 360 / 620 / 880). Node bars 16px wide.
- **Pick one scale — px per unit — and apply it everywhere.** Choose a scale that lands every height on the 4px grid (0.075px/person turns 4,000 → 300, 1,920 → 144, 480 → 36).
- The **surviving path runs level along the top**; leaks peel downward. This gives the diagram a reading direction without an arrow.
- Ribbons are **cubic Bézier**, filled at ~0.18 opacity of `muted`, **no stroke**. Control points sit on the horizontal midpoint of the span, so the curve flattens at both nodes:
  `M x0,yTop0 C xm,yTop0 xm,yTop1 x1,yTop1 L x1,yBot1 C xm,yBot1 xm,yBot0 x0,yBot0 Z` where `xm = (x0 + x1) / 2`.
- Ribbons are **data curves** — they are exempt from the orthogonal-connector rule in SKILL.md §6. Every other line in the diagram is not.
- Ribbons leave a node at its right edge and land on the next node's left edge; the ribbon's thickness at both ends equals the value.
- Node labels: name in Geist sans 12/600, `count · percent` in Geist Mono 9 beneath. Column heads label above the bar; mid-column exit nodes label beside it.
- **Every ribbon carries its count** in a paper-masked Geist Mono label centred on the span.
- **Exactly one coral ribbon** — the leak you want argued about — plus its coral label. That's the whole 2-coral budget; nodes stay `ink` (surviving path) and `muted` (exits).
- Close with an italic honesty line under the diagram (*"Every ribbon is drawn to scale; at each node, out equals in."*) and a legend strip that restates the reconciliation.

## Complexity budget
Max **4** stage columns · max **10** ribbons · exactly **1** coral ribbon. Past that, split into an overview and a per-stage detail.

## Anti-patterns
- **Ribbon widths not proportional to their values** — fake precision, and an automatic fail. If you don't have the numbers, draw a flowchart.
- A colour per flow (rainbow). One coral ribbon, everything else `muted`.
- Unlabelled ribbons — a thickness the reader can't convert to a number is decoration.
- Ribbons crossing where reordering the nodes would avoid it.
- Gradient fills along the ribbon.

## Examples
- `assets/example-sankey.html` — minimal light
- `assets/example-sankey-dark.html` — minimal dark
- `assets/example-sankey-full.html` — full editorial
