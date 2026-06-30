# A-judge — manual calibration protocol

The detector is the production gate (deterministic, hook-legal). The LLM judge
panel is **not** in CI — it is non-deterministic and costs tokens. It runs
**periodically, by hand**, to answer one question the detector can't answer about
itself: *what is the detector missing?*

## When to run

- After editing the P-tier map or vendoring a new detector version.
- Quarterly, or before rolling the gate out to a new surface/team.
- When a real design slips through the gate (add it to `fixtures/` first).

## What it measures

Run an independent LLM panel (4 judges) over the same `fixtures/`, with a fixed
defect vocabulary, then compare to the detector arms:

- **Recall gap** — defects the judge catches that the detector misses
  (in the validated run: judge 95% vs detector-DOM 36%; 12 defects judge-only).
- **Complementarity** — defects the detector catches that the judge rationalizes
  away (the validated run: `side-tab` on f04 — judges called it a normal banner).
- **Strategic floor** — `strategic_weak` votes flag generic-but-clean designs
  (f10) the detector cannot reason about. This is why Tier 2 judgment stays.
- **Variance** — disagreement across the 4 judges = the non-determinism that
  disqualifies the judge as a hook-legal `script` executor.

## How to run

Each judge is an independent agent that reads one fixture's HTML + this rubric
and returns `{verdict, defects_detected[], strategic_weak, confidence, rationale}`.
Vocabulary = `ground-truth.json::defect_vocabulary`.

Rubric per judge:
> You are an independent senior product-design reviewer (no tools, pure
> judgment). Read the HTML. Decide verdict PASS/FAIL, list observed defects from
> the controlled vocabulary only, mark strategic_weak=true if technically clean
> but generic/derivative, give confidence and a one-line rationale.

Drive it however the host allows (a 4-agent fan-out, or 4 sequential runs). Save
the panel output to `judge-results.json` next to this file, then:

```bash
node score.mjs          # if judge-results.json is present, it folds into report-data.json
```

## Reading the result

- Detector recall drifting **down** vs the judge over time → vendor a newer
  detector or extend the P-tier map.
- A judge-only defect that recurs across fixtures and matters → consider adding
  a rule (upstream to Impeccable) or a fixture that pins it.
- Never let the judge's higher recall tempt you into making it the gate: it is
  not reproducible and not hook-legal. It calibrates the gate; it is not the gate.
