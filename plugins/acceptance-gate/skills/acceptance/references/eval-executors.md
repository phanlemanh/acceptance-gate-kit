# Eval Executors — 4 types

Every eval in `evals.yaml` declares exactly one `executor`. The executor
determines who grades and what counts as evidence.

| Executor | Surface | Grades | Evidence required |
|---|---|---|---|
| `test` | api / backend / sdk | Machine (exit code) | run_id, exit_code, verifier, verified_at |
| `script` | cli | Machine (exit code + output match) | run_id, exit_code, verifier, verified_at, output excerpt |
| `ui-check` | web ui | Machine assertion + human glance | run_id, exit_code, verifier, verified_at, screenshot path |
| `judgment` | any ("does this match business intent?") | Judge subagent → human | judged_by, verdict, rationale (+ human_override if UNCERTAIN) |

Hook-enforced vs agent-obligation: the hook checks the four machine evidence
fields report-wide (presence + verifier authenticity), the L1 CONSISTENCY
rules (no exit_code != 0, no verdict: FAIL in a PASS report), and the
UNCERTAIN/T3 human_override counts. Per-eval completeness — `output`,
`screenshot`, `rationale` on every block — is the verify-agent's obligation,
audited by the human at Gate 2.

## evals.yaml shape

```yaml
schema_version: 1
feature_slug: login-flow
evals:
  - id: E1
    criterion: AC-1
    executor: test
    cmd: config:executors.test.api      # resolved from _acceptance/config.yaml
    expected: "exit 0; suite auth.login green"
    evidence_required: [run_id, exit_code, verifier, verified_at]

  - id: E2
    criterion: AC-3
    executor: script
    cmd: config:executors.script.cli
    expected: "stdout contains 'session created'"
    evidence_required: [run_id, exit_code, verifier, verified_at, output]

  - id: E3
    criterion: AC-4
    executor: ui-check
    steps:
      - "Start dev server per config dev_server.start"
      - "Navigate {url}/login → screenshot evidence/E3-step1.png"
      - "Submit valid SSO token → screenshot evidence/E3-step2.png"
      - "Assert redirect to /dashboard AND cookie 'session' present → screenshot evidence/E3-step3.png"
    expected: "redirect + cookie; frames show login → submit → dashboard"
    evidence_required: [run_id, exit_code, verifier, verified_at, screenshot]

  - id: E4
    criterion: AC-2
    executor: judgment
    question: "Does the error message on invalid token match the product's tone guideline?"
    inputs: [contract.md, evidence/E3-step3.png]
    evidence_required: [judged_by, verdict, rationale]
```

Note: `config:` references resolve against `_acceptance/config.yaml`, whose
parser requires 2-space indentation.

Optional `runs: N` (int > 1) on a `test`/`script` eval marks it **stochastic** —
its command crosses `ctx.providers.invoke` (an LLM generator) so the output is a
random variable. VERIFY runs it N times and reports `pass_rate: <passes>/N`; a
mixed pass_rate (not 0/N or N/N) routes the overall verdict to PENDING-JUDGMENT
for a human threshold call (see `## Variance` in the evidence template). Leave it
off (default 1) for deterministic evals — re-running a deterministic command N
times is wasted round-time, and a deterministic eval that varies is a flaky test,
not a score. `runs` is ignored on `ui-check`/`judgment` (judgment already runs a
3-lens panel).

Boundary + should-NOT-fire: for a threshold/numeric/window criterion (a count,
≥/≤/<>, "trong N ngày", a budget), don't stop at the happy path — add an eval
whose `expected` asserts the SUPPRESSION half (a just-below case that must NOT
fire). For a system boundary add a negative/absence eval (malformed input
rejected, cross-tenant read denied, jsonb default-or-throw, PII absent,
`source_field` present). A should-NOT-fire eval is an ordinary `test`/`script`
whose `expected` describes the absence/refusal — e.g. "2 opens in 48h → NO touch
created", "anon INSERT denied by RLS" — no new executor. The `eval-coverage-lint`
script flags threshold criteria whose evals never assert this (W1) and
out-of-scope items with zero negative evals (W3); advisory, surfaced at Gate 1.

## Executor selection rules (used by Phase 2 EVAL-GEN)

1. Criterion checkable by running existing/new automated tests → `test`.
2. Criterion about CLI behavior → `script`.
3. Criterion observable only through the browser → `ui-check`.
4. Criterion containing words like "appropriate", "matches intent", "tone",
   "makes sense", or tagged `(judgment)` in the contract → `judgment`.
4b. Criterion about **design / visual quality** on a web UI — accessibility
   (contrast), AI-slop tells, "looks shippable" → the **design tiers**: a
   `script` eval `cmd: config:executors.design.gate` (deterministic floor, fails
   on P0 a11y/contrast) and, when a browser session + dev server exist, a
   `ui-check` eval per [design-ui-check.md](design-ui-check.md) (authoritative
   P0). Strategic "on-brand / not generic" stays `judgment`. Phase 2 adds this
   for any web-UI surface even with no explicit design criterion (SKILL.md 2b).
5. Every criterion gets ≥1 eval. A criterion with zero evals fails Gate 1.
6. `cmd` MUST be a `config:` reference when the command is repo-specific —
   never hardcode repo commands into evals.yaml.

## ui-check mechanics

- **Capture a frame per state transition** — screenshot to
  `evidence/E{id}-step{n}.png` (n = 1, 2, 3…) at each meaningful step, not just
  the final state. The Gate-2 evidence page plays an eval's `evidence/E{id}-*.png`
  frames as a slideshow, so the human SEES the flow run, not one still. The
  report's `screenshot:` field = the first frame (back-compat); the rest are found
  by glob. A single screenshot still works (renders a static image).
- **Look at what you saved** — after writing the frames, open each one with a
  multimodal Read and record `observed:` in the report block (template schema
  v2, hook-enforced): what is actually visible, cross-checked against
  `expected`. A frame that contradicts `expected` fails the eval even when the
  assertion command exited 0. This is the anti-"saved but never looked" rail.
- **Saving a frame to a FILE** (the slideshow needs files, not inline images):
  `preview_screenshot` and most browser tools return an INLINE image, not a saved
  file. So the repo provides `config:capture.ui` — a command `<cmd> <url>
  <out.png>` (e.g. `npm run ui:capture`, a puppeteer/playwright wrapper) that the
  ui-check agent calls to write each `evidence/E{id}-step{n}.png`. The kit ships
  NO browser dependency — capture is the repo's runtime (like the test runner /
  dev server), wired via config; `acceptance-init` can scaffold a reference. No
  capture command → save the asserted HTML as `evidence/E{id}-step{n}.html` and
  note the fallback, or downgrade to judgment.
- Local dev: drive via the browser tool available in the runtime: Claude
  Preview MCP, Chrome MCP, Playwright/Puppeteer, or an equivalent repo-provided
  harness. Save frames via `config:capture.ui`. Verifier value: the assertion
  script if one is written, else `config:dev_server.start`.
- Staging / deployed target: drive a browser against `config:dev_server.url`;
  same evidence requirements.
- No browser tool/harness available → DOWNGRADE the eval to `judgment` with the
  screenshot replaced by a manual checklist item, and note the downgrade in the
  evidence report. Never silently skip.

## External VLM second-opinion (optional, opt-in per eval)

A cross-family model (default: Gemini) re-reads a saved frame and answers ONE
closed YES/NO question — an assertion, not a judge. Same-family graders share
"looks done" bias; a second family reduces correlated error on exactly the
evidence class where hallucinated completion lives (screenshots).

- Scaffold: `/acceptance-init` step 3c copies `vlm-assert.reference.mjs` →
  `scripts/vlm-assert.mjs` (repo-owned; `GEMINI_API_KEY` env; default model
  `gemini-3.5-flash`, override with `VLM_MODEL`; exit 0=YES,
  1=NO, 2=cannot-run → the verify lane maps 2 to BLOCKED, never false-green).
- Per-eval wiring: image + question are eval-specific and a `script` eval only
  has `cmd` — so each assertion is a thin repo wrapper the eval points at
  (a script path is an authentic verifier, same as `scripts/verify-ui-login.sh`
  in the report template):

  ```yaml
  - id: E6
    criterion: AC-5
    executor: script
    cmd: scripts/vlm/video-player-visible.sh
    expected: "exit 0 — frame shows a rendered video player >= 300px wide"
    evidence_required: [run_id, exit_code, verifier, verified_at, output]
  ```

  ```sh
  #!/bin/sh
  # scripts/vlm/video-player-visible.sh
  exec node scripts/vlm-assert.mjs \
    _acceptance/video-plugin/evidence/E3-step2.png \
    "Does this frame show a rendered video player at least 300 pixels wide?"
  ```

- CLOSED questions only ("is X visible?", "does the page show Y?"). OPEN
  quality questions ("does it look good / on-brand?") stay `judgment` /
  design-loop — No blind VLM judge.
- Opt-in per eval: Phase 2 EVAL-GEN never adds these automatically.
