# Service Blueprint

**Best for:** service delivery where the customer's experience and the machinery that fulfils it have to be read together — account opening, claims, fulfilment, support escalation, any journey with vendor dependencies.

A blueprint is **not a swimlane with renamed lanes.** A swimlane's lanes are arbitrary actors — add a team, add a lane. A blueprint has four *fixed semantic layers*, and what separates them are **named boundary lines** that each carry meaning: what the customer sees, what they don't, and where the organisation hands work to systems it doesn't own. Strip the names off the boundaries and you've drawn a swimlane.

## Layout conventions
- Four fixed bands, top to bottom: **customer** (what the person does) → **frontstage** (what they see and touch) → **backstage** (staff and services they never see) → **support** (systems the process depends on). Label each in the left margin with a Geist Mono eyebrow; never reorder them, never add a fifth.
- Time runs left to right. Every band shares one column grid, so a vertical read is a single moment sliced across all four layers.
- The three boundary lines are **named on the line itself** — right-aligned masked Geist Mono, sitting on the stroke: `LINE OF INTERACTION` (customer / frontstage), `LINE OF VISIBILITY` (frontstage / backstage), `LINE OF INTERNAL INTERACTION` (backstage / support).
- Draw the line of visibility **strongest** — dashed `6,4`, `ink@0.60`, 1.2px. It's the one boundary a reader must never lose. The other two sit solid at `ink@0.40`; ordinary frame hairlines stay at `ink@0.22` so boundaries read as a different class of line entirely.
- Support systems take the `paper-2` fill treatment — they're dependencies the service leans on, not steps someone performs.
- Spend the coral on the backstage step where the promise most often breaks, plus the boundary-crossing arrow it owns. That's both accents.

## Complexity budget
Max 4 bands (fixed) · max 6 time steps · max 2 cross-boundary emphasis arrows.

## Anti-patterns
- Treating it as a swimlane with renamed lanes — boundary lines left unlabeled.
- Boundary lines styled identically to ordinary lane hairlines.
- Support systems drawn as people.
- More than one line of visibility.

## Examples
- `assets/example-service-blueprint.html` — minimal light
- `assets/example-service-blueprint-dark.html` — minimal dark
- `assets/example-service-blueprint-full.html` — full editorial
