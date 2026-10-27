# tests/design-eval — design-quality gate harness

Validates and calibrates the acceptance gate's **design** executor
(`scripts/design-gate.mjs`), which wraps the vendored Impeccable detector
(`vendor/impeccable/`). Dual role:

1. **Regression guard** (CI) — does the detector still catch what it should, on
   10 labelled fixtures? Deterministic, detector-only.
2. **Calibration** (manual) — the LLM judge panel measures what the detector
   misses. See `judge-panel.md`.

## Run

```bash
cd tests/design-eval
npm ci               # scoped jsdom, pinned 24.1.3 by package-lock.json — enables DOM mode
bash run-tests.sh    # T01-T03, T06 always; T04, T05, T07 only when jsdom is installed
                     # (DESIGN_EVAL_CAN_DOM=1 makes a missing jsdom a FAIL — CI job design-eval sets it)
bash kdd.sh KD1      # one KD case group of khong-do-duoc.test.mjs (unmeasurable dom contrast, FL1)
node score.mjs       # calibration: writes report-data.json + prints the table
```

`run-tests.sh` is wired the same way as the other `tests/<cat>/run-tests.sh`.
Without `npm install`, the DOM tests SKIP and only the zero-dep static guard runs.

## Two detector modes (why both)

| Mode | Engine | Sees | Cost | Role |
|---|---|---|---|---|
| **static** | source scan | gradient-text, side-tab, fonts, bounce | zero-dep | always-on guard |
| **dom** | jsdom + rendered DOM | **+ contrast (P0), cream, leading** | needs jsdom | production gate |

Static **cannot see computed contrast**, so a static-only gate with `fail_on:[P0]`
passes everything — including inaccessible UIs. DOM mode is the real P0 gate. The
production gate defaults to `--mode dom` and emits `BLOCKED` (never a silent
static fallback) when jsdom is missing.

## P-tier policy

`lib/design-detect.mjs` maps detector rules → P0/P1/P2/P3. `fail_on` (default
`[P0]`) decides what REJECTs. P0 = a11y/legibility blockers; P1 = strong AI-slop
tells; P2 = craft; P3 = advisory. Tune the sets in one place.

## Wire into a consumer (_acceptance/config.yaml)

```yaml
executors:
  design:
    gate: "node <kit>/scripts/design-gate.mjs"   # add --jsdom <dir> if jsdom is scoped
    fail_on: [P0]
```

```yaml
# evals.yaml — two-tier
- id: E-design-1          # Tier 1: deterministic floor
  executor: script
  cmd: config:executors.design.gate
- id: E-design-2          # Tier 2: only the strategic ~20%
  executor: judgment
  question: "Beyond the detector floor, is this on-brand and not generic?"
```

## Swap in real artifacts

Replace `fixtures/` with real rendered HTML from your product and drop the
`planted` arrays in `ground-truth.json`; `score.mjs` then reports agreement
between modes and each mode's exclusive catches instead of recall-vs-ground-truth.

## Files

- `fixtures/` — 10 HTML with planted, labelled defects (+ one clean, one clean-but-generic)
- `ground-truth.json` — labels + expected verdicts
- `baseline.json` — regression anchors (recall floors, must-reject/must-pass)
- `lib/dom-detect.mjs` — scoped-jsdom DOM runner (shares core with the repo `lib/`)
- `score.mjs` — recall scoring + assertions + report
- `run-tests.sh` — CI entry
- `judge-panel.md` — manual LLM calibration protocol
- `report/` — `ab-dashboard.html`, `arms-mechanism.svg`, `REPORT.md`

The Tier B (real-browser) ui-check recipe the verify agent follows lives in
`skills/acceptance/references/design-ui-check.md` (wired into Phase 2 step 2b).
