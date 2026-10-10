# Eval Executors — 4 types

Every eval in `evals.yaml` declares exactly one `executor`. The executor
determines who grades and what counts as evidence.

| Executor | Surface | Grades | Evidence required |
|---|---|---|---|
| `test` | api / backend / sdk / mobile flow (native E2E runner) | Machine (exit code) | run_id, exit_code, verifier, verified_at |
| `script` | cli | Machine (exit code + output match) | run_id, exit_code, verifier, verified_at, output excerpt |
| `ui-check` | web ui | Machine assertion + human glance | run_id, exit_code, verifier, verified_at, screenshot path |
| `judgment` | any ("does this match business intent?") — a clause weighed against intent, on files listed in `inputs` (the panel reads nothing else: no diff, no command) | Judge subagent → human | judged_by, verdict, rationale (+ human_override if UNCERTAIN) |

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
    inputs: [_acceptance/login-flow/contract.md, _acceptance/login-flow/evidence/E3-step3.png]
    evidence_required: [judged_by, verdict, rationale]
```

Note: `config:` references resolve against `_acceptance/config.yaml`, whose
parser requires 2-space indentation.

List fields (`inputs`, `paths`, `evidence_required`, `steps`) may be written in
any valid layout — the kit reads them through ONE reader (`evalListsOf` in
`lib/evidence-core.cjs`) for the S4 args step, the fix-round carry plan and the
re-pin lane:

- indentation: the 4-space shape above, or flush-left (`- id:` at column 0,
  keys at column 2, list items `- x` at column 2 directly under their key —
  what a YAML dumper writes by default);
- block list or one-line `[a, b]`; a `#` inside quotes is text, not a comment;
- an anchor `paths: &name` followed by its items is read as those items.

NOT read, and never guessed: an alias (`paths: *name`), a block scalar
(`inputs: |`), a one-line mapping (`paths: {a: b}`), an unclosed `[`, or a key
with no items under it. Each one is named — `<id>.<field> (<reason>)` — in a
`s4-args: danh sách không đọc được: …` line at S4 and as a yellow flag on both
the scope card and the evidence card. Rewrite those fields as plain lists. A
repo already writing the 4-space shape has nothing to do.

`inputs` (judgment) and `paths` (any eval) share ONE root: the repo root, or an
absolute path. Never write them relative to `_acceptance/{slug}/` — a dossier
file is `_acceptance/{slug}/contract.md`, a source file is `apps/app/lib/x.ts`.
The S4 args step resolves every input to an absolute path and refuses to
generate args (exit 2, file named) when one is missing on disk or is a
directory; a judge that reads an empty file grades nothing. One exception:
`_acceptance/{slug}/evidence/**` of the dossier being verified may not exist
yet, because a ui-check of the same round produces it (E4 above reads E3's
frame) — it is resolved anyway with one notice line, and a judge that still
finds it missing returns UNCERTAIN. That `evidence/**` is written only by the
dossier's own S4 round — see «Where a run writes its artifacts».

The panel reads STATE, not HISTORY. A source file in `inputs` is legitimate: it
is the tree as it stands, and the panel memo (P3, keyed by a hash of `inputs`)
re-grades when it changes. A diff or patch is never an input: a hand-made diff
file is frozen history — the code changes, the file does not, and P3 carries the
old verdict onto new code (measured: a 500-line diff file holding only `--stat`
kept a panel UNCERTAIN two rounds running). So a `question` asks only about what its
`inputs` contain — never for the round's diff, never for a command to be run.
Such a question has a verdict known before grading (UNCERTAIN, whatever the code
does); the feature-loop S4 args step (`s4-args.mjs`) refuses it — exit 2, eval
named, both ways out printed — and the plain `/acceptance` path, which has no
args step, must catch it here. See «Pick the grader per clause» below.

Optional `runs: N` (int > 1) on a `test`/`script` eval marks it **stochastic** —
its command crosses `ctx.providers.invoke` (an LLM generator) so the output is a
random variable. VERIFY runs it N times and reports `pass_rate: <passes>/N`; a
mixed pass_rate (not 0/N or N/N) routes the overall verdict to PENDING-JUDGMENT
for a human threshold call (see `## Variance` in the evidence template). Leave it
off (default 1) for deterministic evals — re-running a deterministic command N
times is wasted round-time, and a deterministic eval that varies is a flaky test,
not a score. `runs` is ignored on `ui-check`/`judgment` (judgment already runs a
3-lens panel).

Optional `long_running: <minutes>` (integer 1–240) on a `test`/`script` eval
declares the **longest the command is expected to take**. Declare it when the
command can run past ~9 minutes — e.g. an eval that drives a real model for
20–35 minutes. The verifier's shell tool stops waiting at 600 s and pushes a
longer command to the background; its background output stays empty until the
command ends, which a verifier misreads as "killed" (crm, 07/10/2026: two
rounds BLOCKED on an eval that was still running). With the key, the
feature-loop S4 round runs the command in the background itself, writes all its
output to a fixed log `.acceptance-runs/{slug}/s4-lenh-dai/r<round>-l<k>-<run>.log`
that ends with `__EXIT=<n>`, and waits in short polls until it finishes; past
the declared minutes it stops the whole process tree and reports the eval
BLOCKED (cannot run — "over the declared duration"), never PASS or FAIL. The
measure does not need its own log or end line. Leave it off for commands that
finish within a few minutes. Wrong values (0, over 240, decimals, words, on a
`ui-check`/`judgment` eval) make the S4 args step stop with the eval named.
Without the key, a command pushed to the background is waited on for up to 30
minutes by the TOOL-KILL rule (`tool-kill-rule.md`).

Evals listed in `feature_loop.model_evals` (`<slug>/<Eid>`, see GUIDE §7.1)
also **run alone** in the S4 round: after every other machine command (parallel
evals and the sequential suite chain) has finished, one at a time. A measure
that starts a shared process (a dev server, an agent runtime) no longer runs
on top of a suite that guards that process.

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

## Where a run writes its artifacts

A command that can run more than once — every `test`/`script` eval `cmd`, every
`suite_keys` command — writes its artifacts to the **run directory**
`.acceptance-runs/{slug}/` at the repo root (add `.acceptance-runs/` to
`.gitignore`) or to a temp dir, **never under `_acceptance/`**. The same command
runs again in the re-pin lane, inside another dossier's S4 round whose suite
includes it, in CI, in a developer's `test` — a path under `_acceptance/` is
overwritten on every one of those runs. `_acceptance/{slug}/evidence/**` is
written only by the S4 round of that dossier while its contract is
`implemented`: the verifier saves ui-check frames there with explicit paths
(`config:capture.ui`), and copies a run-directory artifact there when the round
wants it as evidence — an act of the round, not of the command.

- Once a dossier is past the Evidence Gate (either status in
  `DA_THONG_CONG_2`, `lib/workspace-record.cjs`), its whole tree
  `_acceptance/{slug}/**` — `evidence/**` above all — is **read-only history**:
  it is what the Evidence Gate read. A measure that overwrites it after the fact
  silently replaces signed evidence with whatever today's run produced (crm-onehub,
  16/09/2026: a spec in the shared `test` suite rewrote a signed
  `evidence/ve-that.json` on every run, ~450 lines lost, in every worktree).
- Updating the evidence of a dossier past the Evidence Gate is an **explicit
  step, not a side effect**: first append a `revisit` line to that dossier's
  `decisions.jsonl` whose `decision` starts with `sửa bằng chứng đã thông cổng —`
  and names every file and why (the line's `impact` says what the signer read
  vs what replaces it), then write the files and commit them together. Like any
  line after the seal it is provisional until a human approves it — a later
  line naming who approved, never an edit of this one. Re-verifying through a
  new S4 round is the other legitimate path.
- Tooth: `repin-lane.mjs` snapshots `_acceptance/<slug>/` of EVERY dossier past
  the Evidence Gate (content hash + mtime + size, via
  `feature-loop/scripts/chup-ho-so-da-thong.mjs`) before the first suite and
  after the last eval; any touched file — changed, rewritten with the same bytes,
  added or removed — turns the lane red, names each file, and nothing is
  written. Known limit: the S4 round and plain CI runs are not snapshotted, so a
  writer there is caught at the next re-pin lane, not at the run that wrote it.

**Exclusive resources.** A driver that uses a resource only one run may hold at
a time (a shared dev database or store, a single browser profile) queues itself
inside the measure — a lock or wait in the driver, the way crm's DB lock does.
The kit runs ui-check evals in parallel and does not serialise them for you:
only the measure knows its resource is exclusive.

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
   "makes sense", or tagged `(judgment)` in the contract → `judgment` — for the
   clauses that need weighing, not for the whole criterion. The `(judgment)` tag
   never overrides "the most mechanical executor that can check it": a criterion
   that bundles command-checkable clauses with one clause to weigh splits into
   separate evals (see «Pick the grader per clause»).
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

### Pick the grader per clause, not per criterion

A criterion often bundles clauses of different kinds. Measured on a real round:
one criterion tagged `(judgment)` asked eight clauses — seven checkable only in
code (no new comments, no key read outside one module, no repeated literal…),
one on a doc — with six docs as `inputs`: 3/3 judges UNCERTAIN two rounds
running, and a real defect slipped through that exact gap. Pick per clause:

| The clause is… | Grader |
|---|---|
| readable by a command | a `script`/`test` eval of the repo — measures the STATE of the tree |
| visible only on a running screen | `ui-check` |
| a weighing against intent, on a file | `judgment` with exactly that file in `inputs` (a source file is fine; a diff is not) |
| readable by no one here (prod data, real keys, real users) | declare the limit when writing the eval — do not call three judges to discover what the writer already knew |

Three traps of a repo-rule script (the first row):

- **Measuring the diff goes green-empty after merge**: once
  base = HEAD the diff is empty and the check passes on nothing — in the re-pin
  lane too. Measure the state ("0 comments in the files this round touches",
  "0 key reads outside the one module allowed to read it"), not "lines added".
- **Measuring the state goes red on a tree already dirty**: a red machine eval
  routes the round to REJECT and the baseline column does not rescue it. The
  script must be green on the current tree before it is accepted (positive
  control, `MEASURE-BIRTH-CLAUSE`); if the tree is already dirty, narrow the scan
  to the round's `paths:`. The script is the repo's own object — the kit does
  not write it.
- **A shared rule script must run on every branch the code runs on** (measured:
  a shared rule script took one round's own folder as a premise, and 13/20 of
  its planted cases injected into files that exist only on the branch that wrote
  it — the red side survived 6/20 elsewhere). A folder that is absent means that
  rule has nothing to measure: stay silent or declare it by name, never exit
  "cannot measure". Planted cases build their target file
  inside the copy before injecting; they never require a file already on the tree.

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

## Pairing mechanics — `layer: ui-observed` (human-visible surfaces)

The mirror of the cross-layer rule. When the contract's `surfaces` include a
web UI (`ui`; aliases `web`, `web-ui`; NOT `mobile`), evals.yaml MUST carry
≥1 eval with `executor: ui-check` — per CONTRACT, not per criterion — and that
eval declares `layer: ui-observed`. Code-layer evidence (`test` component/DOM,
`script` axe-core/design-gate) stays valid for its own criterion but never
discharges this obligation: the obligation is a saved frame + an `observed:`
line in the ui-check block of the report. The tooth for the FRAME is the Gate-2
card (it reads `exit_code: 0` + `screenshot:` on the report block); the write-time
hook only checks `observed:` once a `screenshot:` is present and does NOT require
a screenshot on ui-check blocks by itself. At the declaration tier (lint W8,
Gate-1 card, pre-merge NOTE) the machine anchor is the executor; the label is for readers and for the vacuous
guard (`layer: ui-observed` on a non-ui-check executor is lint W8). Opting out
must be a named ledger entry whose decision starts with `bỏ ui-observed — `.
Teeth: lint W8 · Gate-1 card flag · Gate-2 card reads the REPORT (a declared
ui-check whose block lacks `exit_code: 0` + `screenshot:` counts as absent) ·
pre-merge NOTE (not a VIOLATION yet; tightening threshold: two signed UI
contracts without frames within one release). One source for the surface
predicate, aliases and the descope prefix: `lib/lop-nhin-thay.cjs`.

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

- **Capture a frame per state transition** — in the dossier's own S4 round
  (a re-run writes to the run directory, see «Where a run writes its
  artifacts»), screenshot to
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
  design-pass — No blind VLM judge.
- Opt-in per eval: Phase 2 EVAL-GEN never adds these automatically.
