# Evidence chain

**Best for:** the chain of custody behind a verification claim — which artifact came from where, who produced it, who checked it, and which link the producer could have written about itself. One box per artifact, one named boundary across the whole chain separating the doer from an independent checker.

A green report proves nothing on its own — what matters is whether the thing that produced the work also produced the proof. This chain lays the artifacts end to end and draws one boundary across it: on one side the doer, on the other an independent checker. Any link whose evidence was written by the same actor that did the work is marked, because that is the link where a passing result can be a lie. **Routing:** showing how data moves through a pipeline is [type-data-flow.md](type-data-flow.md); this type is only for the custody of *proof*, and it always carries the doer/checker boundary. The boundary itself reuses the line-of-visibility treatment from [type-service-blueprint.md](type-service-blueprint.md) — same weight, same masked right-aligned name on the stroke — because it does the same job: it is the one line the reader must never lose.

## Layout conventions

- **Canvas:** `0 0 1000 520`. The chain reads left to right; the doer's band sits above the boundary, the checker's below, and the chain steps down across it.
- **Hiện vật:** artifact box `160×56` `rx=6`, white fill (`#454b63` dark), `ink` stroke 1. Geist sans name at `y+36`, Geist Mono identity sub-line at `y+48` — `sha256 4f2a…`, `exit_code 0`, `run-log #12`, `pipeline #4471`. The identity line is what makes the artifact checkable: **an artifact with no identity line cannot be verified** — there is nothing to re-open, so it is a claim, not evidence, and it must not be drawn as a box.
- **Ranh giới độc lập:** exactly one horizontal boundary, spanning the full width — dashed `6,4`, `ink@0.60`, 1.2px, deliberately a different class of line from any hairline (`rule` sits at 0.8). Named on the stroke itself, right-aligned masked Geist Mono: `RANH GIỚI ĐỘC LẬP · doer ↑ · người kiểm ↓`.
- **Custody arrows:** orthogonal, `r=8` elbows, straight `<line>` only where the endpoints share x or y. Every arrow names the *act* rather than the payload — `SINH RA`, `GHI LẠI`, `ĐỐI CHIẾU`, `KÝ` — 8px Geist Mono all-caps, masked, 6–10px clear of the stroke. Where an arrow crosses the boundary that is a **legitimate crossing, not a transit violation**: the boundary is a line, not a box, so the stroke stays solid and keeps its arrowhead.
- **Actor badges:** every box carries a 7px mono tag `rx=2` at its top-left reading `DOER` or `NGƯỜI KIỂM` — doer hairline-only, checker with an `ink@0.06` fill. The badges let a reader audit the boundary by eye instead of trusting position.
- **Mắt xích tự khai:** the one artifact produced *and* attested by the doer with nothing independent checking it. Accent stroke 1.2, a 7px mono `TỰ KHAI` tag at its top-right, and one italic Instrument Serif line in the top margin saying a passing value there proves nothing. Those are the diagram's two coral elements; nothing else is coral.
- **Legend:** bottom strip below a hairline, outside the diagram area — Hiện vật · Bên làm · Bên kiểm · Ranh giới độc lập · Mắt xích tự khai.

## Complexity budget

Max 6 artifacts · exactly 1 independence boundary · at most 1 self-attested link shown — more than one and the chain is not worth drawing, fix the process first · every artifact carries an identity line **and** an actor badge · max 2 coral elements.

## Anti-patterns

- **Starting the chain at the report** instead of the raw artifact. The interesting failures happen upstream; a chain that begins at the summary has already discarded the evidence it exists to trace.
- **Artifacts with no id** — a box with a name and no hash, run number, or file is a claim. Nothing to re-check means nothing to verify.
- **Doer and checker drawn as the same actor** with no `TỰ KHAI` mark. If one party did the work and wrote the proof, the diagram has to say so — that omission is the failure this type is built to catch.
- **Boundary styled like an ordinary lane hairline** — at that weight it reads as decoration and the diagram collapses into an undifferentiated flow.
- **Using this type for ordinary pipeline data movement** — that is [type-data-flow.md](type-data-flow.md). No boundary, no evidence chain.

## Examples

- `assets/example-evidence-chain.html` — minimal light
- `assets/example-evidence-chain-dark.html` — minimal dark
- `assets/example-evidence-chain-full.html` — full editorial
