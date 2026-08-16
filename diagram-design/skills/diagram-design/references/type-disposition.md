# Disposition map

**Best for:** committing, in public, to what happens to every *existing* thing when a new thing of the same class ships — token layers, config files, services, runbooks, report definitions. One row per old artifact, each carrying a declared fate and the evidence that the row was found by looking rather than by memory.

When you build something new, the old thing of the same class does not disappear by itself. A design that names only the new thing quietly creates a second parallel system nobody owns. This map forces one row per existing thing, each with a declared fate and evidence that the row was found by looking, not by memory. Its nearest siblings are [type-it-state.md](type-it-state.md) (which inventories the *before* without committing to a fate) and [type-raci.md](type-raci.md) (whose chip-grid discipline the fate column borrows).

## Layout conventions

- **Canvas:** `0 0 1000 520` for 4 rows. Header band `y=76 → 108` with a single hairline at `y=108`; **no vertical column rules** — the boxes and connectors already define the columns, and rules would collide with the arrow corridor.
- **Rows:** `rowTop = 120 + k*80`; boxes are `56` tall, so row centre is `rowTop + 28`. Four columns: **Vật cũ** `x=32 w=224`, the relationship corridor `x=256 → 456` (kept box-free), **Vật mới** `x=456 w=224`, **Số phận** from `x=744`.
- **Vật cũ:** white box `rx=6`, `muted` stroke 1 — the receding thing. Geist sans name at `rowTop+24`, Geist Mono path/id sublabel at `rowTop+42`.
- **Vật mới:** white box `rx=6`, `ink` stroke 1.2 — the thing that stays. Placed at its *own* y, not slaved to a row: when several old rows point at the same new box, centre it between them and **fan the left-edge attach points ≥12px apart** (24px in the shipped example). Rows sharing a target should sit adjacent, so the fan stays short and no vertical run crosses another connector.
- **Quan hệ:** orthogonal connector, `r=8` elbows, straight `<line>` only when the endpoints share y. Three types with distinct strokes — `THAY` solid `ink` 1.2 · `KẾ THỪA` solid `muted` 1 · `SONG SONG` **dashed** `muted` 1. Parallel is the dangerous relationship and must read as provisional at a glance. Label is 8px Geist Mono all-caps, masked, sitting `8px` above the stroke (mask at `rowCentre−20`, height 12).
- **Số phận:** a chip at the right end of each row, `y=rowTop+12`, `h=16`, `rx=4` — `KHAI TỬ` filled `ink` with `paper` letters, or `GIỮ` stroked `ink` with `ink` letters. Under each chip, an 8px mono sub-line naming the measure or date (`sau 2 sprint`, `hạn Q4`). **A row with no fate chip is the defect this map exists to expose:** draw the empty slot as a dashed `accent` rect and let the italic serif annotation say the gate cannot open while a row has no owner. Those two are the diagram's only coral elements.
- **Bằng chứng:** a 7px mono tier badge in the right margin of every row (`x=932 w=32`), no column header — it is a marginal note, not a fourth content column. `N1` repo declares it via config · `N2` enumerated by machine · `N3` hand-declared, which also carries a small hollow `muted` warning dot. The tier says *how the row was found*; N3 is allowed but visibly weaker.
- **Legend:** bottom strip below a hairline, outside the diagram area — Vật cũ · Vật mới · Thay / Kế thừa / Song song · Số phận · Nấc bằng chứng. Never abbreviate to the chip glyphs alone.

## Complexity budget

Max 6 existing rows (more = split by class) · exactly 3 relationship types · every row carries a fate chip **and** an evidence tier · at most 1 unresolved row shown — an unresolved row is a finding, not a habit · max 2 coral elements.

## Anti-patterns

- **A row with no fate** — the whole point of the map. One unresolved row, flagged coral, is a finding; two or more means the migration has not been decided and the map is being used to hide that.
- **`SONG SONG` with no deadline** — parallel forever is how two systems become permanent. Every parallel row needs a date in the fate sub-line or it is really an unresolved row wearing a chip.
- **Rows gathered from memory** instead of a config list or a machine sweep. That is why the tier badge is mandatory: a map made entirely of `N3` rows is an opinion, not an inventory.
- **Drawing only the new thing and calling it a migration diagram** — that is an architecture sketch. The old column is the diagram.
- **Mixing classes in one map** — tokens and services in the same grid. One class per map; the fates are not comparable across classes.

## Examples

- `assets/example-disposition.html` — minimal light
- `assets/example-disposition-dark.html` — minimal dark
- `assets/example-disposition-full.html` — full editorial
