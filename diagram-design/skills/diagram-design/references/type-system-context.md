# System context (C4 L1)

**Best for:** the focal system in its environment — the people who use it, the external systems it talks to, and why. The "what is this and who touches it" answer for onboarding, stakeholder reviews, and scope discussions.

## Layout conventions
- **One focal system at center** — the largest box (~200×80), `accent-tint` fill + `accent` stroke. This is the diagram's coral element. Name in Geist sans semibold plus a one-line **responsibility** sublabel in Geist sans 9px `muted` — context level names responsibilities, never technologies.
- **Persons above/left** — small rounded boxes (~128×48), `input` treatment (`muted@0.10` fill, `soft` stroke), a 16px person glyph (circle head + shoulders arc, stroked `muted`) beside the name, and a mono `PERSON` type tag (rx=2).
- **External systems right/below** — `external` treatment (`ink@0.03` fill, `ink@0.30` stroke) + mono `EXTERNAL` tag.
- **Relationships** — orthogonal r=8 elbow arrows, each with a two-part label: purpose in 8px mono all-caps (`PAY INVOICE`), optional protocol beneath in 7px mono `soft` (`https · rest`). Person interactions in `muted`; external HTTP/API calls in `link`.
- **Fan the focal box's attach points.** Several arrows hit the same edges of the focal system — this is the type's main layout challenge. Spread attach points ≥12px apart per SKILL.md §6 rule 4.
- Coral stays on the focal system + its legend swatch. ONE arrow may take coral instead only when a single relationship is the diagram's thesis.
- Legend bottom strip: Person · Focal system · External system · API call.

## Complexity budget
Exactly 1 focal system · max 8 surrounding elements (persons + externals) · max 12 relationships · **every relationship labeled**.

## Routing rule
Context answers *"what is this system and who touches it."* The moment you want to show what's INSIDE the system — services, containers, databases — switch to the **architecture** type (C4 L2–L3, [type-architecture.md](type-architecture.md)).

## Anti-patterns
- Internal containers drawn inside the focal box — that's architecture (L2), not context.
- Technology names on the focal system — context names responsibilities.
- More than one focal system — split into two diagrams.
- Unlabeled relationship arrows — the #1 context-diagram failure.
- Person glyphs turned into avatar art.

## Examples
- `assets/example-system-context.html` — minimal light
- `assets/example-system-context-dark.html` — minimal dark
- `assets/example-system-context-full.html` — full editorial
