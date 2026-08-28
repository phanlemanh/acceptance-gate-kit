# Wireflow

**Best for:** UI navigation where the screen is the unit of thought — onboarding, checkout, password reset, permission prompts; any "what do I see, and where does this tap take me?" question.

Reach for a wireflow when the *surface* carries the meaning: the reader needs to see roughly what sits on each screen and which action moves them on. Reach for a [flowchart](type-flowchart.md) when branching logic dominates and the screens are incidental — a wireflow with three decision diamonds is a flowchart wearing frames.

## Layout conventions
- One **screen frame** per node: `rx=6`, 136×120, left→right in reading order. 136 (not 140) keeps every frame centre on the 4px grid.
- Each frame carries a 20px `paper-2` **titlebar** with a hairline bottom border — screen name left (Geist sans 10px/600), route right (Geist Mono, `soft`).
- The body holds 3–4 **skeleton hints**: hairline `rule` bars, a bordered input (`ink@0.20`), a filled button. Abstract shapes only.
- Edges are actions, not data. Label every connector with the tap that fires it (`TAP RESET`, `SUBMIT`) — all-caps mono, masked, 6–10px above the stroke.
- Screens share a y, so straight horizontal connectors are permitted. Any edge that leaves the row routes below it with `r=8` quarter-arc elbows and a dashed stroke.
- Coral twice: the one CTA that carries the flow, and the terminal screen.

## Complexity budget
- Max screens: **7** · max action edges: **10** · max decision branches: **1** · max skeleton hints per screen: **4**.
- Past that, split into overview + per-flow detail — or admit it's a flowchart.

## Verified backs (optional)
When the reader should know *which backend serves each screen*, declare it as
an authored fact rather than prose: embed a `data-diagram-facts` manifest,
wrap each screen in `<g data-node-id="…">`, draw a `BACKS n` badge at the
frame's bottom-right inner corner (Geist Mono 7px, `soft`, `text-anchor="end"`),
and add a `BACKS n` legend row naming the target architecture file. The pair
is then gated by `scripts/check_backs.py` (§9 checklist). Full convention:
[verified-backs.md](verified-backs.md). The legend row writes `BACKS n` with
a letter n — a literal digit there reads as an orphan badge to the checker.

## Anti-patterns
- Readable fake copy inside skeletons — the moment a bar becomes a sentence, readers critique the wording instead of the flow.
- Full-fidelity mockups. That's a design tool's job; a wireflow is a map.
- Screens without titlebar labels — an unnamed frame is a grey box.
- Unlabeled branch edges. The unhappy path needs a reason, not just a dash.
- A coral CTA on every screen. Coral marks the single action the flow turns on.
- A screen ↔ backend claim drawn as pixels only. If it matters enough to draw, it matters enough to declare and verify (see Verified backs above).

## Examples
- `assets/example-wireflow.html` — minimal light
- `assets/example-wireflow-dark.html` — minimal dark
- `assets/example-wireflow-full.html` — full editorial
- `assets/example-wireflow-backed.html` — verified backs onto `example-architecture-backed.html`
