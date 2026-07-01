# S1 State Matrix — reference

The state matrix is the machine contract the S1-D mockup drift-check and the S4
captures iterate against. It is authored into the design-doc at S1 and is a
**hard-gate input** (no Gate-1 for a surface feature without it).

## Shape

`state matrix = {domain-state} × {theme} × {viewport}`

- **domain-state** (derive from the plugin's `contentSchema` + async flag, not a fixed list):
  - generic: `default`, `loading`, `empty`, `error`, `hover`, `focus`, `disabled`, `overflow` (long content)
  - OneHub domain-specific (add when applicable): `no-fab provenance-gap` (missing `source_field`), `video def.async render-pending`, `persona` variants
- **theme**: `Modern` (default), `premium` (dark) — a mistranslated role token passes build/typecheck and only shows as an off-but-plausible colour, so BOTH themes must be enumerated.
- **viewport**: `mobile 390`, `tablet 1024`, `desktop 1440` — pinned to defeat the cloud-1920 vs impl mismatch (recorded in `provenance.json`).

## Rules

1. Enumerate every applicable cell — the mockup must produce one surface per cell.
2. Each machine-checkable cell criterion → a `script` eval at S1 (contrast/token-only/hit≥44). Perceptual cells → `(judgment)` human-glance at Gate 2.
3. The seam pairs each state to the **data-shape** (which contract fields it binds) and to **APP-space tokens** (`--_* / --color-*`), never `--oh-*` hex.
4. Keep the matrix TIGHT — DesignSync pulls are one-file-per-turn; a bloated matrix makes the design sub-track the critical path.
