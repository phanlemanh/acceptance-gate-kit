# Layout craft — the grid is a contract, not a vibe

Read at Step 3 (declare the grid with the tokens) and Step 4 (choose the
page archetype before drawing). Chaos on a page is rarely bad taste in
parts — it is parts that never agreed on shared lines. Measured on real
surfaces: a disciplined shell reuses ~6–10 left-edge alignment lines per
screen; the page users call "loạn" measured 37 lines with 23 used only
once. Alignment is countable, so it is a gate, not an opinion.

## Declare the grid before screens (Step 3, with the tokens)

Like color and type, layout spends declared tokens — it never invents
values mid-screen:

- **Container widths: ≤ 3–4 per surface, each named by content type.**
  Prose reads at 60–72ch; forms commit at ~560–680px; tables and boards
  go full-bleed inside the shell. Two containers 40px apart in width is
  drift, not nuance — merge them.
- **One gutter system.** A single gap token (with at most a compact
  variant) between columns, between cards, inside grids. The eye reads
  equal gutters as "one system"; three near-equal gaps read as three
  accidents.
- **Columns are explicit.** 12-col only if you truly span it; usually
  the archetype names its tracks outright (`280px sidebar · minmax(0,1fr)
  main · 320px rail`). Bind to the design system's layout tokens when
  they exist (System mode rule); establish your own set when not.
- **Indent is one step.** Nesting inside a card/section indents by
  exactly one spacing step from the parent's line — a third accidental
  indent level is a new alignment line nobody declared.

## Choose the archetype by job, then earn the width (Step 4)

The single stretched column on a 1440 screen — mobile layout wearing a
desktop window — is the most common miss. Pick the skeleton from the
job, and say which one you picked:

| Job of the surface | Archetype |
|---|---|
| One decision / one task (checkout, wizard step, focused form) | **Focus flow** — single column 560–720px, centered; the empty margin is the design |
| Edit-and-see (settings + live preview, composer + result) | **Two-seat split** — form column + sticky preview/consequence rail |
| Pick-one-work-one (inbox, list + record) | **Master–detail** — list pane + detail pane; on mobile it becomes two screens, not two crushed columns |
| Monitor many things (ops, dashboard) | **Dashboard grid** — explicit card tracks, cards sized by importance, no orphan half-rows |
| Work a dataset all day (tables, boards) | **Full-bleed workspace** — the data owns the width; chrome stays out of the columns' way |
| Read / be persuaded (landing, article, report) | **Prose spine** — 60–72ch text spine; media may break out wider deliberately |

*Desktop utilization test: at 1280+, either a second surface earns the
freed width (rail, preview, detail — something the job needs visible),
or the archetype is Focus flow and the margin is deliberate. A long
thin column with fat idle margins on an edit-heavy surface is the
"trang dài không tận dụng desktop" defect by construction.*

## Spacing rhythm — three levels, monotone (Step 4–6)

Space is how structure is read before a single border is drawn:

- **Within a group < between groups < between sections**, and each level
  uses ONE value from the 4/8 scale (e.g. 8 · 24 · 56). The exact
  numbers matter less than the monotone gap: when between-groups (24)
  meets a within-group of 20, grouping dissolves.
- Prefer space over dividers; a border is a divider of last resort
  where space is genuinely unaffordable (dense tables).
- Card internals are part of the rhythm: one padding token per card
  class, and sibling cards align their internal rows (`subgrid` — see
  css-technique) so a card grid reads as a card *system*.

## Hard gate — Alignment budget (counted, like the type budget)

On the rendered artifact, per screenful, per width (getBoundingClientRect
left edges of visible content blocks, clustered ±3px):

- Every alignment line answers to a **declared role**: container edge,
  a named column, card inset, or the one indent step. Budget ≈ **≤ 8–10
  lines per desktop screenful**; a dense operator shell earns a few
  more, and says so.
- **A singleton line — used by exactly one block and matching no
  declared role — is a misalignment, not a variation.** Fix it or name
  it (an optical adjustment is a fine reason, written down).
- **Container widths ≤ 3–4 distinct values per screen.** Near-equal
  widths are the same defect as near-equal grays: merge or justify.
- Count across the declared state matrix and report the worst cell —
  the same anti-flattery rule as the type budget. Drift arrives via
  one-off wrappers, inline margins, and the section added last.

*Exit test: pick any two blocks that look like siblings — do their left
edges share a line, their widths share a value, and their gap match the
level their relationship implies? Three yeses across the page is what
"gọn gàng" is made of.*
