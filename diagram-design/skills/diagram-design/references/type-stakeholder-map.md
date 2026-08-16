# Stakeholder map

**Best for:** who surrounds a product, programme, or launch — and how close each party sits to it. Concentric rings encode proximity (core → direct → indirect), a sector split separates internal from external, and position alone carries the relationship.

**Routing note.** When the question is *prioritisation along two axes* — power × interest, influence × support — the [quadrant](type-quadrant.md) is the right tool; it ranks. The orbit map answers a different question: **proximity and grouping.** Who is core, who is peripheral, who sits inside the wall and who sits outside. If you find yourself wanting an x-axis and a y-axis, you wanted a quadrant.

## Layout conventions

- One ink-filled hub rect at the centre holds the subject: name in Geist sans semibold, a mono sublabel for the phase or date. Centre coordinates, ring radii, and chip sizes stay divisible by 4.
- Three concentric hairline rings (`rule`), each carrying a masked 7–8px mono eyebrow at 12 o'clock — `CORE · DIRECT · INDIRECT`. One vertical hairline divider through the centre splits the population, with masked mono labels (`INTERNAL` / `EXTERNAL`) where it meets the outer ring. Mask any ring or sector label sitting on a stroke.
- Stakeholders are typographic chips: white fill, `rx=4`, ~112×40 (widen to 128 for a long name). **40px tall is deliberate** — a 12px sans name plus an 8px mono sublabel needs the room, and both lines land on the 4px grid. Chip centres sit *on* their ring, inside their sector.
- The sublabel says what the party does to the subject (`funds the roadmap`, `release sign-off`, `capacity SLA`) — not their job title.
- **No connector lines between stakeholders.** Ring and sector already encode the relationship; arrows only add spaghetti.
- Focal chips take `accent-tint` fill + `accent` stroke and need an **opaque paper mask rect underneath** — the tint is translucent, so without the mask the ring stroke bleeds through the chip.
- Legend is the usual bottom strip, outside the diagram area: one entry per ring, plus one for the focal treatment.

## Complexity budget

**max 3 rings · max 12 stakeholders · max 2 sectors · max 2 focal accents.** Past these, split into an overview map plus a per-sector detail.

## Anti-patterns

| Anti-pattern | Why it fails / correction |
|---|---|
| Reaching for the orbit map when the question is two-axis prioritisation | That is a quadrant. Rings show closeness, not power or interest. |
| Connector spaghetti between stakeholders | Position already carries the relationship. Delete the lines. |
| Equal angular spacing that implies false equivalence | Cluster honestly by sector and leave the gaps where the gaps are. |
| Logos or avatars instead of typographic chips | Turns an analytical figure into a vendor slide. Names in sans, roles in mono. |
| More than three rings | The gradations stop meaning anything and the chips crowd the hub. |

## Examples

- `assets/example-stakeholder-map.html` — minimal light: nine parties around an internal data-platform launch.
- `assets/example-stakeholder-map-dark.html` — the same geometry under the dark token inversion.
- `assets/example-stakeholder-map-full.html` — editorial page with the orbit map, three summary cards, and colophon.
