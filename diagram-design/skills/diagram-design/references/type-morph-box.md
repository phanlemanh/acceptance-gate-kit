# Morphological Box (Zwicky Box)

**Best for:** a discrete option space made countable — feature scoping, test-matrix coverage, config permutations, channel/format plans — where the reader must see every value that was on the table **and** the one combination you committed to. Rows are independent axes, cells are the values along each axis, and a coral thread ties one value per row into a single answer. It shares its hairline-grid discipline with [type-raci.md](type-raci.md), but a RACI reports an allocation while a morph box reports a *choice made against alternatives* — which is why the rejected values stay on the page.

## Layout conventions
- **Canvas:** `0 0 1000 560` for 4 axes × up to 4 values. Value cells are `128 × 40` `rx=6` on a 152px stride (`x` = 224 / 376 / 528 / 680); the axis-label column is the whitespace to the left of 224.
- **Rows = axes.** Hairline row rules only — `rule` at 0.8, **no column rules**, no filled bands, no zebra. First rule at `y=108`, then an 88px stride; the vertical grid is implied by cell alignment, never drawn.
- **Header eyebrows:** `TRỤC` in `soft`, `GIÁ TRỊ` in `muted`, Geist Mono 8px tracked `0.18em`, baseline `y=92` — the values are what the reader scans.
- **Axis label:** Geist sans 12px 600 `ink` at the grid edge, baseline `row_y + 32`, with a Geist Mono 8px `soft` note beneath at `row_y + 48` naming the axis's measuring stick (`thước: độ trễ`). The note is what makes an axis falsifiable — if you can't name the ruler, it isn't one axis.
- **Cells = values**, laid left to right at `y = row_y + 16`. Default treatment: `#ffffff` fill (`ink@0.20` hairline), name in Geist sans 11px `ink` at `cell_x + 8`, baseline `cell_y + 32`. **Rows may hold different value counts — never pad a row to make the grid rectangular.**
- **Source tag:** every cell carries a 7px Geist Mono tag (`rx=2`, `ink@0.20` stroke, `soft` text) at `cell_y + 8` — `REPO` / `NGÀNH` / `G.ĐỊNH` (codebase / industry / assumption). Tag treatment never changes with selection: provenance is orthogonal to choice.
- **The thread:** one cell per row takes `accent-tint` fill + `accent` stroke 1.4; an `accent` polyline runs from each chosen cell's bottom edge to the next chosen cell's top edge — orthogonal with `r=8` elbows, plain straight segments only where the two centres share an `x`. Keep a sideways step ≥12px clear of the row rule so the elbow doesn't sit on a hairline.
- **Cut cells stay visible:** no fill, `ink@0.12` stroke, name in `soft` at weight 400, plus a one-word 7px Mono reason 12px to the right of the box (`trùng`, `đắt`, `sau`).
- **Coral budget:** the thread plus its tinted cells are **one** gesture — the whole accent allowance. The legend's *đã chọn* swatch restates that gesture and is not a third element. Nothing else takes accent, and no italic annotation competes with the thread.
- **Legend:** horizontal strip below a hairline, outside the grid — Giá trị · Đã chọn · Đã cắt · Nguồn (REPO / NGÀNH / G.ĐỊNH).

## Complexity budget
Max **4** axes — a 5th axis usually belongs inside one of the four, or is a cross-cutting layer that deserves its own diagram. Max **7** values per axis; more means two axes got merged, so split them. Exactly **1** threaded combination per diagram — a second option is a second diagram. Every cell carries a source tag.

## Anti-patterns
- **A value with no source tag** — under scoping pressure people invent options. The tag is the check: an untagged cell is somebody's guess wearing a box.
- **Padding every row to equal length** so the grid looks tidy — fake symmetry that implies values you don't have.
- **Two threads on one diagram without naming them** — the reader can't tell which combination is the recommendation. Draw two diagrams, one per option.
- **An axis whose values overlap** — `Push` and `Mobile` on the same row fails the mutually-exclusive test; that axis is really two axes.
- **Erasing cut cells instead of dimming them** — the reader then can't tell what was considered and rejected, and the same rejected option comes back next quarter.

## Examples
- `assets/example-morph-box.html` — minimal light
- `assets/example-morph-box-dark.html` — minimal dark
- `assets/example-morph-box-full.html` — full editorial
