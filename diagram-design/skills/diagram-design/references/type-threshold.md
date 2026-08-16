# Threshold Chart (so-ngưỡng)

**Best for:** measured values placed against thresholds that were declared *before* the measurement — UAT verdicts, SLO reviews, pilot gates, launch readiness. A number only means something against a bar someone committed to in advance. This chart shows both, plus **when** the threshold was declared, so a reader can tell the difference between a target that was met and a target that was quietly moved after the result came in. It belongs to the bullet-chart family (Stephen Few's lineage): the track is the range, the bar is the result, the tick is the promise — with one addition Few's original doesn't carry, the **provenance of the promise**. For a plain magnitude comparison with no committed bar, use [type-bar.md](type-bar.md).

## Layout conventions

- **Canvas:** `0 0 1000 480` for 4 metric rows. Horizontal rows, one per metric, row pitch 88.
- **Name column** (`x=40 → 304`): metric name in Geist sans 12px 600 `ink`, baseline `row_y + 4`. Beneath it a **7px Geist Mono provenance line** in `soft` — `khai 12/07 · Cổng Đáng`, the date and the gate where the threshold was declared, baseline `row_y + 20`. **This line is the type's discipline and is mandatory on every row.** Rows may cite different dates and gates; that variance is information, not noise.
- **Track:** `x=320`, width 480, height 16, `rx=2`, filled at `rule` level — the full range of the scale.
- **Actual value:** an `ink` bar drawn over the track, same height 16 and `rx=2`, length proportional to the value. Honest scale: **all rows on one chart share one scale, or are normalised to percent.** The default normalisation is `% so ngưỡng` = đo ÷ ngưỡng (inverted to ngưỡng ÷ đo when lower is better), scale 0–150%, which puts every threshold at 100% and gives the chart one reading direction — past the tick is pass, on every row. A row whose unit differs **must say so** in 7px mono `soft` beneath its bar (`đơn vị phút · quy đổi ngưỡng ÷ đo`).
- **Threshold marker:** a 2px-wide `ink` tick, height 24, centred on the track so it overhangs 4px above and below — the overhang is what makes it read as a promise laid *over* a result rather than a segment of it. Draw a 6px-wide `paper` notch behind the tick (same 24 height): without it the tick vanishes wherever the ink bar has already crossed the threshold, which is exactly the case the reader most needs to see. A Geist Mono 8px value label sits above the tick on an opaque `paper` mask, carrying the **native** declared value (`80%`, `≤4 phút`), never the normalised index.
- **Numeric column:** the measured value, right-aligned at `x=856`, Geist Mono 8px 600 `ink`, baseline `row_y + 12`. Native units.
- **Verdict chip:** `64 × 24`, `rx=4`, at `x=880`, vertically centred on the track, glyph in Geist Mono 9px 600. `ĐẠT` = `ink` stroke 1 + near-transparent fill + `ink` glyph. `TRƯỢT` = `accent` stroke 1.2 + `accent-tint` fill + `accent` glyph.
- **Axis:** mono 7px labels above a hairline at `y=56`; faint `ink@0.05` verticals at 25 / 50 / 75 / 125%, and the 100% promise line one step stronger at `ink@0.10`. The row ticks sit on it.
- **Delta:** optional 7px mono `soft` beneath a failing bar (`−12% so ngưỡng`), quoted in native points, not the index.
- **Exactly one failing row per example.** Its chip and its threshold tick (with the tick's own label) go coral — nothing else does. The failing bar itself stays `ink`: the verdict lives in the chip, not in the data mark.
- **Legend:** bottom strip below a hairline, outside the diagram area — `Ngưỡng đã khai · Số đo thật · Đạt · Trượt`. Legend swatches sit outside the coral budget.

## Complexity budget

Max 6 metric rows · exactly 1 threshold per row · one shared scale per chart (or explicit per-row unit notes) · every threshold carries a declaration date · max 2 coral elements · no connectors.

## Anti-patterns

- **A threshold with no declaration date** — the reader cannot tell it was set beforehand. This is precisely the failure the type exists to prevent; a chart without provenance lines is not a threshold chart, it is a bar chart with an opinion.
- **Bars without a threshold tick** — that is just a bar chart. Use [type-bar.md](type-bar.md).
- **Mixed units on one scale without saying so** — normalise, then print the conversion in mono on the row that differs.
- **Colouring every row by verdict** — the verdict lives in the chip; coral marks only what failed.
- **A truncated axis** that starts above zero and exaggerates the gap between bar and tick.

## Examples

- `assets/example-threshold.html` — minimal light
- `assets/example-threshold-dark.html` — minimal dark
- `assets/example-threshold-full.html` — full editorial
