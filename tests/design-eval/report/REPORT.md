# Design-eval — results

Validated A/B over 10 labelled fixtures (22 planted defects). Re-run: `bash run-tests.sh` (regression) · `node score.mjs` (calibration + this report).

## Regression — verifier evidence

```
verdict: PASS
run_id: score-mqzz5wmr
exit_code: 0
verifier: tests/design-eval/run-tests.sh
verified_at: 2026-06-30T01:36:02Z
```
T01 static recall ≥ baseline · T02/T03 static gate REJECT P1 / PASS clean · T04 DOM recall ≥ baseline + P0(f03) rejected + clean(f09) passed · T05 production gate DOM REJECTs f03. 5 passed, 0 failed.

## Recall (22 planted defects)

| Arm | Recall | P0 contrast (f03) | Determinism | Role |
|---|---|---|---|---|
| B-static (source scan, zero-dep) | 23% | misses → PASS | identical | always-on guard |
| B-DOM (rendered DOM, jsdom) | 36% | catches → REJECT | identical | production gate |
| A-judge (LLM panel, no Impeccable) | 95% | catches | varies | manual calibration only |
| B-DOM ∪ A-judge | 100% | — | — | the case for two tiers |

## Gate verdicts (fail_on: [P0])

static REJECTs nothing (it sees no P0 — the reason a static-only gate is unsafe).
DOM REJECTs f01/f03/f05 (detectable low-contrast P0); the rest are P1/P2 tells
that pass the P0 gate and belong to Tier 2 judgment or a wider fail_on.

## Key findings

- Static cannot see computed contrast → a static `fail_on:[P0]` gate passes
  inaccessible UIs. DOM mode is mandatory; the gate emits BLOCKED, never a silent
  static fallback.
- Detector ∪ judge = 100%: detector caught `side-tab` (f04) the judge waved
  through; the judge caught 12 layout/strategy defects the detector misses.
- The detector is a deterministic floor, not a ceiling — f10 (clean but generic)
  needs the judge's `strategic_weak` signal, which no rule can produce.

See `ab-dashboard.html` (interactive, open in a browser) and `arms-mechanism.svg`.
