# Capability Map

**Best for:** what a business *does*, held still on one page — a stable L1-domain → L2-capability grammar with an investment layer (invest / maintain / sunset) painted on top. Strategy pages, portfolio reviews, build-vs-buy scoping, "where do the next two years of budget go".

Not [nested](type-nested.md): nested draws *generic* containment — any hierarchy of scope, any depth, no fixed vocabulary. A capability map fixes the grammar at two levels and carries a treatment axis nested has no concept of. Not an org chart either: **a capability is not a team.** "Renewal management" survives the reorg that dissolves the Renewals squad — if a box would rename itself when reporting lines move, it was a team, not a capability.

## Layout conventions
- Two bands, each labeled above its row in a Geist Mono eyebrow (7px, tracked 0.14em, outside the containers): customer-facing domains on top, enabling domains below.
- L1 domains: `paper-2` fill, `rule` hairline, `rx=8`, domain name as a Geist Mono uppercase eyebrow inset at the top-left. Row heights follow the tallest domain in the row; don't stretch a 3-capability domain to match a 4.
- L2 capabilities: white boxes (`rx=6`, 40px tall, 8px apart), names **left-aligned** in Geist sans 12px/600 — not centered, so each domain scans as a list.
- Mono sublabel only where a real system or metric exists (`crm: salesforce`, `csat 94%`). An invented sublabel on every box is noise.
- Treatment: invest = `accent` stroke + `accent-tint` fill; sunset = dashed `ink @ 0.20` stroke + `soft` name; maintain = the plain white box, unmarked. Treated boxes carry a 7px mono tag (INVEST / SUNSET, `rx=2`) at their right edge.
- **No arrows, ever.** A capability map is structural, not a flow — sequence, dependency and handoff belong to a process or architecture diagram.
- Legend as a bottom strip: Maintain · Invest · Sunset · Capability domain.

## Complexity budget
| Limit | Rule |
|---|---|
| Max L1 domains | 6 |
| Max L2 capabilities per domain | 6 |
| Levels | exactly 2 — L3 detail becomes a second diagram |
| Max invest accents | 2 |

## Anti-patterns
- Verbs and processes as capabilities. Capabilities are stable nouns — "Order fulfillment", not "Fulfil order flow".
- Mirroring the org chart. If the boxes match today's reporting lines, redraw from what the business does.
- A rainbow heatmap scoring every box. Two coral accents carry a thesis; color on all nineteen carries none.
- Arrows between capabilities.
- Three or more nesting levels.

## Examples
- `assets/example-capability-map.html` — minimal light
- `assets/example-capability-map-dark.html` — minimal dark
- `assets/example-capability-map-full.html` — full editorial
