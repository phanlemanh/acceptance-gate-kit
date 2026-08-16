# Nested Cadence

**Best for:** one short cycle repeated at several time scales — minute / hour / day / week operating rhythms, a ship-loop nested inside a planning loop, drill-then-review cadences, any process where the same named beats run at every horizon.

Some processes are not a sequence of different steps. They are ONE short cycle repeated at minute, hour, day and week scale, where a bigger cycle may only decide after the smaller ones inside it have closed. A flowchart draws that as spaghetti and a Gantt draws it as a schedule it is not. This type keeps the beats identical at every scale on purpose: what changes is the horizon, not the rhythm.

**Routing.** A cycle at ONE scale is [`type-loop.md`](type-loop.md). Stacked abstraction levels that are *not* the same repeated cycle are [`type-layers.md`](type-layers.md). Reach for Nested cadence only when the same named beats recur at every level.

## Layout conventions
- **Horizontal bands, one per scale**, stacked shortest at top to longest at bottom — same x, same width. Each band is a `paper-2` container, `rx=8`, hairline `rule` stroke.
- **Geist Mono eyebrow top-left** inside each band, naming the scale *and* its horizon (`PHÚT · một phép thử rẻ`): scale in `ink` tracked `0.18em`, horizon in `soft`.
- **The identical four beats** left→right as boxes (~128×40, `rx=6`, white fill light / lifted `#454b63` dark, `ink` stroke). The beat names are the **same text in every band** — that repetition is the whole point, never vary them. Each carries a 7px mono gloss beneath naming what that beat *produces at that scale* (at `PHÚT`: `ý định 1 dòng` / `chạy thử` / `đọc kết quả` / `giữ hay bỏ`).
- **One return arc per band**, QUYẾT → KHAI, dashed `muted`, routed below the beat row with `r=8` elbows and the arrowhead landing on KHAI's bottom edge. It is a cycle, not a line.
- **Roll-up arrows between adjacent bands.** *Inner closes before outer decides* — the shorter cycle's evidence feeds the longer cycle's ĐO beat. Since shorter scales sit at the top, the arrow leaves the top band's QUYẾT and travels **down** into the next band's ĐO. Label `CUỘN LÊN`, 8px mono, masked with the local background (`paper-2` inside a band), 6–10px visible gap.
- Two connectors leave QUYẾT — fan them: return arc left of centre, roll-up right of centre, ≥12px apart, so neither crosses the other.
- **Human-gate marker:** some QUYẾT beats are signed by a person, not a machine. Tag those with a small `CỔNG NGƯỜI` box (`rx=2`, `muted` hairline, 7px mono) flush beside the QUYẾT box — typically the longest scales, where reversal is expensive.
- Coral on **one** gate only (`accent-tint` fill + `accent` stroke) plus one short *italic* Instrument Serif line stating the rule that decides it. Two coral elements, no more.
- Legend bottom strip: Thì · Vòng lặp trong một cỡ · Cuộn lên · Cổng người.

## Complexity budget
Max 4 scales · exactly 4 beats per scale, identical wording across scales · exactly 1 return arc per band · roll-up arrows only between adjacent scales.

## Anti-patterns
- Renaming the beats per scale — then it is four different processes, not one cadence.
- Band width or beat width drawn to represent duration. This is rhythm, not schedule — use [`type-gantt.md`](type-gantt.md) if you need dates.
- More than four scales — the repetition stops reading and becomes a table.
- Omitting the return arc, so a cycle reads as a pipeline.
- Roll-up arrows that skip a scale — evidence must climb one horizon at a time.

## Examples
- `assets/example-cadence.html` — minimal light
- `assets/example-cadence-dark.html` — minimal dark
- `assets/example-cadence-full.html` — full editorial
