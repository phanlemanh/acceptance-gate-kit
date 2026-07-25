# Eval Executors — 4 types

Every eval in `evals.yaml` declares exactly one `executor`. The executor
determines who grades and what counts as evidence.

| Executor | Surface | Grades | Evidence required |
|---|---|---|---|
| `test` | api / backend / sdk / mobile flow (native E2E runner) | Machine (exit code) | run_id, exit_code, verifier, verified_at |
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
script flags threshold criteria whose evals never assert this (W1),
out-of-scope items with zero negative evals (W3), and `(cross-layer)` criteria
with no `layer: backend-effect` eval (W4); advisory, surfaced at Gate 1.

## Executor selection rules (used by Phase 2 EVAL-GEN)

1. Criterion checkable by running existing/new automated tests → `test`.
2. Criterion about CLI behavior → `script`.
3. Criterion observable only through the browser → `ui-check`. CAVEAT: for a
   criterion tagged `(cross-layer)` this rule picks the UI half only — pairing
   rule (c) (SKILL.md Phase 2) additionally REQUIRES a `layer: backend-effect`
   eval; a ui-check alone is never sufficient cross-layer evidence.
3b. Criterion observable only through the MOBILE app → still `test`, bound to
   `config:executors.test.e2e_mobile` — the runner's exit code is UI-LAYER
   evidence only (see §Mobile mechanics below). Never `ui-check`: there is no
   browser, no network log, no `network_observed` on this lane.
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

## Pairing mechanics — `(cross-layer)` criteria

A criterion whose When/Then crosses the backend (a UI flow triggering an API
call / data mutation) is tagged `(cross-layer)` in the contract (Phase 1). Its
eval set MUST contain, besides the UI-half eval:

- **≥1 backend-effect eval** — executor `test`/`script`, `cmd` a `config:`
  ref, declaring the machine-readable field `layer: backend-effect` (additive,
  like `runs:`; lint W4 keys off this field — executor type alone is spoofable
  by rule-2b design-gate scripts). It proves "this backend path really works".
- **Self-driving with its own nonce**: the command creates the effect under an
  identifier of its own and asserts it (POST X → GET/query X). It does NOT
  claim to prove UI→API wiring.
- **NEVER author "GET-asserts-the-effect-the-UI-flow-created"**: the machine
  lane and the ui lane run in the SAME parallel() — such an eval races the ui
  agent (fails when scheduled first) and burns a round. Sequencing (`after:
  ui`) is a wave-2 candidate, not available now.
- **Wiring is proven in the ui-check itself**: its asserted marker must be
  server-derived data (an id/value only the server can produce for this flow,
  never a static toast/optimistic DOM); for mutations, assert AFTER a reload;
  recommended nonce-correlation — the flow types a distinguishable identifier
  (e.g. a fixed per-eval string when the env resets between rounds) and both
  the marker and the backend-effect eval assert the record carrying it.
- **Bind to an existing suite command when possible** (the feature's own
  itest): machine-lane dedupe makes the marginal cost ~0; MODEL_ROUTES, A/B
  baseline, run-log and carry-forward apply automatically since this is an
  ordinary machine eval.

## Mobile mechanics — surface `mobile`

Mobile flows are ordinary `test` evals — no new executor. The binding is
`config:executors.test.e2e_mobile` (XCUITest: `xcodebuild test -project
App.xcodeproj -scheme AppUITests -destination 'platform=iOS Simulator,name=…'`;
Espresso: `./gradlew connectedAndroidTest`), so the machine lane's dedupe, A/B
baseline, run-log and carry-forward all apply automatically.

- **Evidence class:** the runner's exit code is UI-LAYER evidence only —
  simulators have no network-reading path, so `network_observed` does not
  exist on this lane. ALL cross-layer truth lives in the paired
  `layer: backend-effect` eval; a `(cross-layer)` criterion with no pair is
  BLOCKED at merge by `pre-merge-check.sh` (CI teeth of pairing rule (c)).
- **Simulator absent on the verify machine** → the runner cannot start →
  `cannotRun` → verdict BLOCKED, never a silent skip or a downgrade.
- **Operational stance:** declare `paths:` on mobile evals (P1 carry-forward
  skips the slow suite on delta rounds that do not touch the app); do NOT put
  the mobile e2e command into `feature_loop.suite_keys` — a slow, flaky suite
  re-run every round burns the 3-round cap.
- **Backend target (V4 risk):** each mobile feature's contract carries one
  line in `## Notes` — `Mobile backend target: local|staging|mock — <note>`.
  Lint W5 checks the line EXISTS; the Gate-1 human eyeballs the VALUE (a mock
  target means the paired eval proves the backend path, not the deployment).
  The kit never machine-verifies "real" (engine/binding split).

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
- **Network truth** (extends the `observed:` rail from pixels to the wire) —
  when the driver is a browser tool with a network log
  (`read_network_requests` / `read_console_messages` or equivalent): after
  driving the flow, dump failed requests + console errors to
  `evidence/E{id}-network.txt` and record `network_observed:` with WORDS ONLY:
  `clean | no-app-traffic | third-party-only | app-fail | n-a (driver) |
  n-a (tool-error: <reason>) | unscoped | unscoped-partial`. Scoping law:
  FAIL-eligible = fetch/XHR to the `dev_server.url` origin or any prefix in
  `dev_server.api_base` (a LIST); third-party (analytics/CDN/trackers) never
  fails; static assets (.map/favicon/images/fonts) never fail even on the app
  origin; within FAIL-eligible, connection-error/timeout/5xx FAILS the eval
  even when frames look right, and 4xx fails unless the eval's `expected`
  declares that exact status. `clean` REQUIRES seen app traffic — zero app
  requests must be recorded `no-app-traffic`, never `clean`. Raw status
  numbers stay in the txt file — NEVER in the report (L1 CONSISTENCY blocks
  nonzero-exit tokens in a PASS report; word-vocab follows the
  `baseline: red/green/n-a` precedent). Drivers with no network path
  (curl+grep SSR, capture-only, a browser driven on a mobile simulator) record
  `n-a (driver)` — the cross-layer burden then rests entirely on the paired
  `layer: backend-effect` eval. NOTE: this covers a BROWSER driven in a mobile
  environment (a web UI on a device/simulator). NATIVE app flows are not
  `ui-check` at all — they take the `test` lane via
  `config:executors.test.e2e_mobile` (see §Mobile mechanics).
  Accepted residual (deliberate stance): a background job/poller firing
  connection-errors/5xx into app scope during the drive window still FAILS the
  eval — an in-scope failure during the drive is never `clean`. That is a
  machine FAIL (it routes to REJECT, not PENDING-JUDGMENT), so `human_override`
  cannot release it: the recourse is to re-run the round, or descope/rewrite
  the eval to exclude the background path — recording the reason in the
  report/ledger.
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
