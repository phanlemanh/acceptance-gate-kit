# Customer Journey Map

**Best for:** onboarding and activation flows, purchase funnels, renewal and support experiences — anywhere the felt experience matters as much as the steps.

## Layout conventions
- Stages run left to right as equal-width columns, each headed by a Geist Mono eyebrow. Faint vertical hairlines mark the column boundaries — the stages are the spine every band reads against.
- Bands stack top to bottom, one row per lens, each labelled with a Geist Mono eyebrow in the left margin: **DOING** (touchpoints), **FEELING** (emotion curve), **OPPORTUNITY** (where a fix exists).
- DOING holds the only boxes — one uniform node per stage, name in Geist sans, channel sublabel in Geist Mono. Uniformity is the point: the variation belongs to the curve below.
- FEELING is a single smooth cubic-Bézier curve through one point per stage: `r=4` dots, `stroke-width=1.2` in `muted`, flat tangents at each stage point. A dashed neutral midline spans the band with a 7px `NEUTRAL` tag at the right end — above it is positive, below is negative.
- The worst moment takes the one coral dot (`r=6`), with a 1px hairline drop to an italic Instrument Serif annotation naming the friction. One pain moment, not five.
- OPPORTUNITY is plain two-line text, no boxes — deliberately quieter than DOING. Leave a stage empty when no fix is worth naming, and spend the second accent on the single opportunity that answers the pain moment.
- Legend as a horizontal bottom strip after a hairline: touchpoint · emotion point · pain moment · neutral baseline.

## Complexity budget
- Max 6 stages · max 3 bands · 1 emotion curve · max 2 annotations.

## Anti-patterns
- Fake-precision emotion values — the curve is qualitative. No numeric axis, no percentages, no "4.2 / 5".
- Forcing a card into every cell when a band is honestly empty. An empty cell is a finding, not a hole to fill.
- Drawing the emotion curve as jagged straight segments. It is a data curve: one smooth path, no elbows.
- Coral on more than one dot. The second accent belongs to the opportunity that answers the pain, not to a second complaint.

## Examples
- `assets/example-journey.html` — minimal light
- `assets/example-journey-dark.html` — minimal dark
- `assets/example-journey-full.html` — full editorial
