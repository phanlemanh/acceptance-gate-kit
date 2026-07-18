# Information architecture craft — structure before screens

Read at Step 4 when the surface has more than one content area, or the
brief touches navigation. IA is the map (where things live, what they're
called, how you get there); flow is the route. The skill is strong on
routes — this file covers the map. Visual hierarchy can only *express*
structure; it cannot repair a wrong grouping.

## Organization — group by the actor's mental model

- Pick ONE primary scheme per surface and name it: by **task** (what the
  actor does), by **object** (the things they manage), by **audience**
  (who they are), or by **recency/time**. Mixed schemes at the same
  level are how "12 mục lộn xộn" happens.
- The grouping must match how the ACTOR thinks, not how the company is
  org-charted or the database is normalized. A broker thinks
  "khách của tôi / căn đang bán / việc hôm nay" — not "CRM module /
  inventory module / task module".
- Five-minute paper card-sort: write every content item on a line, group
  them cold, name each group in ≤2 words. A group you can't name in two
  words is two groups. An "Other/Khác" bucket with >2 items means the
  scheme is wrong.
- *Test: show the actor a thing and the group names — can they guess
  which group holds it, without opening anything? Wrong guesses = wrong
  map, regardless of how clean the nav looks.*

## Labeling — one name per concept, everywhere

- Keep a **labeling ledger**: concept → the one term used in nav,
  buttons, headings, empty states, and toasts alike. "Deal" in the nav,
  "Giao dịch" on the button, "Thương vụ" in the empty state is three
  labels for one concept — each switch costs the user a re-derivation.
- Speak the actor's trade language (the ledger extends the insider-
  fluency rule): labels are the smallest trust surface.
- Labels predict destinations — the "scent" rule: from the label alone,
  the actor should predict ≥80% of what's behind it. Cute labels
  ("Workspace ✨") have no scent.
- **On a scannable list, legibility repeats — it isn't taught once.** A
  relationship shown by an elegant unlabeled rail plus a one-time legend
  loses to plain per-item labels, because the reader doesn't carry the
  legend down a scroll. If each card must encode the same structure,
  label it on each card (compactly); reserve "teach once" for a fixed
  frame the eye never leaves, not for a feed.
- **Novelty is budgeted for structure too, not just visuals.** An added
  organizing concept — a new grouping, a coined section name ("orbit",
  "clusters") the brief didn't ask for — must earn its keep against the
  label voices and scan-breaks it introduces. When a grouping's own
  headers, counts, and tags become the busiest thing on the page, it
  cost more calm than it bought clarity; collapse it. The calm gate
  (typography-craft § voice budget) applies to IA chrome, not only type.

## Navigation — choose the model by count and frequency

| Destinations | Model |
|---|---|
| ≤5, flat | Tabs / bottom nav (mobile) |
| 6–15 | Sidebar with named groups (from the card-sort) |
| >15 or cross-linked | Sidebar + search; consider Cmd+K (top-tier) |
| Deep hierarchies (≥3 levels) | Breadcrumbs become mandatory wayfinding |

- **Wayfinding invariant** — every screen answers three questions
  without scrolling: *Where am I? What's here? How do I get back?*
  (Active nav state, a real page title, and an escape route.)
- Contextual nav (links inside content) supplements the global model —
  it never replaces it; content-only navigation strands the user after
  two hops.
- Expansion states are part of the nav contract: collapsible sidebars
  keep icons + tooltips, never vanish entirely; the expand/collapse
  control itself follows the component-contracts rule.

## Findability — when memory runs out

- Search earns its place at roughly >30 items or >2 levels — below that,
  good grouping IS the search.
- Empty search results are a designed state: suggest broadening, show
  near-misses, never a bare "no results".
- If an item is reachable only by search, it is lost for the user who
  doesn't know its name — everything needs at least one browsable home.

## Audience layering — one seat per frame

When a surface previews another audience's view (a broker previewing the
customer's page, an admin previewing a member's screen), keep the seats
physically separate:

- **The previewed frame stays pure** — inside it, ONLY what that
  audience will actually see. Reviewer-facing metadata (provenance
  chips, schema proposals, telemetry, approval notes) lives *outside*
  the frame: a margin rail, a toggleable overlay, or the chat/commentary
  layer.
- Mixing seats inside one frame does double damage: it clutters the
  layout AND it lies — the reviewer can no longer trust that the frame
  is what the customer gets.
- *Test: cover everything outside the previewed frame. Is what remains
  exactly 100% the other seat's page? Any chip that survives the
  covering but wouldn't ship to that audience is in the wrong layer.*

*Exit test for the whole file: sketch the sitemap in ≤10 lines of
indented text before drawing any screen. If the sketch embarrasses you,
the screens would have hidden it — that's the point of doing it first.*
