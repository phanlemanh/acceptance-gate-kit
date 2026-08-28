# Verified backs — screen ↔ backend links as authored facts

A wireflow that claims "this screen is served by that backend node" normally
draws the claim as pixels only. Nothing holds the pixels to the architecture
diagram next door: rename the backend node, split the service, redraw the
flow — the drawing keeps saying what it said the day it was made. This
convention makes the claim an **authored fact**: it lives as data inside the
HTML, is drawn from that data, and is re-verified against both files by
`scripts/check_backs.py` (fail-closed, exit-code gated, same discipline as
`check_overflow.py` / `check_label_occlusion.py`).

The doctrine is archify's: **links are authored, never inferred — and no
authored fact ships unverified.** The checker proves the diagram, the
manifest, and the target file agree with each other. Whether the fact is true
of the real system stays a human question; both artifacts have the same
author, and the checker's docstring says so out loud.

The manifest is deliberately **type-agnostic** — nodes and backs, not screens
and services — so the same mechanism verifies wireflow ↔ architecture today
and swimlane ↔ architecture or blueprint ↔ architecture without change.

## 1. The manifest

Each participating file embeds exactly one manifest in `<head>`:

```html
<script type="application/json" data-diagram-facts>
{
  "nodes": [
    {"id": "forgot-password", "label": "Forgot password"}
  ],
  "backs": [
    {"node": "forgot-password",
     "target_file": "example-architecture-backed.html",
     "target_node": "auth-service"}
  ]
}
</script>
```

Schema — strict, unknown keys are rejected (a typo like `"back"` would
silently drop every fact):

| Field | Rule |
|---|---|
| `nodes` | required, non-empty. Each entry exactly `{id, label}`. |
| `id` | kebab-case `[a-z0-9][a-z0-9-]*`, unique per file, stable — derived from the node name, never renamed casually (other files point at it). |
| `label` | the node's visible name, **character-for-character** what the SVG draws. |
| `backs` | optional list. Each entry exactly `{node, target_file, target_node}`. |
| `node` | an `id` declared in this file's own `nodes`. |
| `target_file` | relative path from this file's directory. Never absolute — the pair must survive being moved together. |
| `target_node` | a node `id` the target file's own manifest declares. |

A pure target file (an architecture diagram that screens back onto) carries
`nodes` and an empty or absent `backs` — its manifest exists so *other*
files' claims about it can be verified.

## 2. Binding the manifest to the SVG

Every declared node is wrapped in a group carrying its id:

```svg
<g data-node-id="forgot-password">
  <!-- the node's full pattern: mask, box, titlebar, texts -->
  <text …>Forgot password</text>
</g>
```

Rules the checker enforces both ways:

- Every manifest `id` has its `<g data-node-id>` group, and the group
  contains a `<text>` exactly equal to the declared `label`
  (whitespace-collapsed, case-sensitive).
- Every `data-node-id` in the SVG is declared in the manifest — a tagged but
  undeclared node is drift, not decoration.
- `data-node-id` sits on `<g>` only, and node groups never nest.

## 3. The badge and the legend row

A node with N backs facts draws a `BACKS N` badge inside its group — Geist
Mono 7px, `soft`, anchored to the frame's bottom-right inner corner
(`text-anchor="end"`, x = frame right − 8, baseline ≈ frame bottom − 6):

```svg
<text x="360" y="162" fill="#636b80" font-size="7"
      font-family="'Geist Mono', monospace" text-anchor="end"
      letter-spacing="0.08em">BACKS 2</text>
```

The checker matches the exact shape `BACKS <digits>` and holds it to the
manifest in both directions: a fact without its badge fails, a badge whose
count differs fails, and a `BACKS <digits>` text outside any node group fails
as an orphan. **Therefore the legend row must write `BACKS n` (letter n),
never a literal digit:**

```svg
<text … font-family="'Geist Mono', monospace">BACKS n</text>
<text … font-family="'Geist', sans-serif">Screen served by n backend nodes — verified against example-architecture-backed.html</text>
```

Presentation is static by design — no viewer runtime, no interactive JS. The
badge and legend row are plain SVG, so export (`references/export.md`) keeps
the canonical output untouched.

## 4. Running the gate

```bash
python3 <skill-dir>/scripts/check_backs.py file.html [more.html ...]
```

Run it on **every file of the pair** — target files are checked shallowly
(id declared + group drawn); the target's own label agreement is only proven
by naming it as an input too. `--list` prints each verified fact as a
`FACT …` line. Exit 0 clean · 1 any `BROKEN` fact · 2 a named input unusable
(no manifest, malformed JSON, schema violation, no `<svg>`).

Fixtures: `scripts/fixtures/backs/` — one per error branch, exit code
declared by filename prefix, asserted by `scripts/test_check_backs.py`.

## What the checker cannot see

Stated here as in the docstring: it proves *internal consistency*, not truth
— a wrong fact written consistently in manifest, SVG, and target passes. It
reads no geometry (an arrow drawn to the wrong box passes), no legend prose,
and no rendering (overflow and occlusion are the other checkers' jobs).
Whether the arrows and the facts tell the same story is the §9 taste gate's
question — the checker is the floor, not the ceiling.

## Examples

- `assets/example-wireflow-backed.html` — wireflow with 3 backed screens
  (`BACKS 1/2/1` badges, legend row)
- `assets/example-architecture-backed.html` — the target architecture file
  whose manifest those facts verify against
