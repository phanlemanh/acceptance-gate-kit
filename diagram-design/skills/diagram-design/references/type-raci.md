# RACI Matrix

**Best for:** who is Responsible, Accountable, Consulted, and Informed for each activity in a piece of work — launch plans, incident runbooks, governance handovers. It shares its grid grammar with [type-dp-security-matrix.md](type-dp-security-matrix.md): same hairline rows × columns, same one-focal-cell rule, but the semantics differ — a security matrix says what a role *may do*, a RACI says what a role *owes*. The same grid generalises to any role × item matrix (skill matrix, feature comparison, ownership map) by swapping the chip vocabulary; keep the treatment hierarchy and swap only the letters.

## Layout conventions

- **Canvas:** `0 0 1000 504` for 6 activities × 5 roles. Grid spans `x=32 → 976`; activity column 224 wide, role columns 144 wide (centres 328 / 472 / 616 / 760 / 904).
- **Rows:** header band `y=76 → 108`, then 48px rows. Row rules run the full grid width; column rules run `y=76 → 396` and stop at the last row — they never enter the annotation or legend band.
- **Hairlines only.** `rule` at 0.8, no filled cells, no zebra striping, and **no connectors** — a matrix carries its information in the cells.
- **Column headers:** Geist Mono 8px, tracked `0.18em`, uppercase, baseline `y=92`. The activity column label sits in `soft`; role names in `muted` — the roles are what the reader scans.
- **Row labels:** Geist sans 12px `ink`, left-aligned at the grid edge, baseline `row_y + 28`.
- **Chips:** `24 × 16` `rx=4`, centred on the column centre, `y = row_y + 16`. Width 24 (not 20) so a chip centred on a grid-aligned column centre keeps its own `x` on the 4px grid. Glyph is Geist Mono 10px 600 at `row_y + 28`.
- **Treatment hierarchy** — rank is carried by the chip, not by hue:

  | Mark | Chip | Glyph |
  |---|---|---|
  | **A** accountable | filled `ink` | `paper` letter |
  | **R** responsible | `ink` stroke 1, transparent fill | `ink` letter |
  | **C** consulted | `muted` stroke 1 at 0.55 | `muted` letter |
  | **I** informed | no chip | bare `soft` letter |

- **Empty cells are content.** A role with no stake in an activity gets nothing — the white space is the claim.
- **Focal cell:** one contested or load-bearing cell may take `accent-tint` fill + `accent` stroke 1.4 + accent glyph.
- **Annotation:** italic Instrument Serif 14px in `accent`, right-aligned under the grid, with a short accent tick rising toward the flagged column. The focal cell plus this annotation are the diagram's two coral elements — no third.
- **Legend:** horizontal strip below a hairline, outside the grid, spelling out all four letters. Never abbreviate the legend to the letters alone.

## Complexity budget

Max 8 activity rows · max 6 role columns · exactly 1 **A** per row · max 2 coral elements.

## Anti-patterns

- **Two A's in one row** — accountability diffusion. The grid exists to make this impossible to miss; never soften it by drawing both.
- **Filling every cell** — if everyone is consulted, nobody is. Blank cells carry the meaning that a wall of C and I destroys.
- **Colour-coding all four letters with four hues** — the chip-treatment hierarchy already encodes rank; adding hue duplicates the signal and burns the accent.
- **Reaching for RACI when the real question is sequence and handoffs** — that is a [swimlane](type-swimlane.md). RACI answers *who owns this*, not *what happens next*.

## Examples

- `assets/example-raci.html` — minimal light
- `assets/example-raci-dark.html` — minimal dark
- `assets/example-raci-full.html` — full editorial
