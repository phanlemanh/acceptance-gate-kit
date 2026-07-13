---
name: acceptance
description: 'Acceptance gate 3-phase cho feature do AI code. Phase 1 NORMALIZE input prompt/ticket/PRD thanh acceptance contract voi Given/When/Then criteria, Phase 2 EVAL-GEN sinh eval cases theo 4 executor types test/script/ui-check/judgment, Phase 3 VERIFY chay evals bang fresh-context subagent va viet evidence report. Trigger: acceptance feature X, tao acceptance contract, chay acceptance gate, verify feature vua code, acceptance review, sinh evals cho feature. KHONG trigger cho code review thuan tuy khong co contract, architecture review, viet unit test thong thuong, hoac sua bug nho T1.'
version: '1.0.0'
---

# acceptance — Evidence-backed Acceptance Gate

## Role

Run the acceptance gate for one feature: turn whatever requirement input
exists into a contract, generate evals from it, and verify the implementation
with machine evidence — so the human reviews a 1-page evidence report instead
of hand-testing for an hour.

Core principles (non-negotiable):
1. **Doer ≠ grader** — the verify phase runs in a fresh agent/context when the
   runtime supports it, or a clearly separated grader pass in Codex; never let
   the same implementation reasoning self-grade the feature.
2. **Evidence over assertion** — PASS requires `run_id + exit_code: 0 +
   verifier + verified_at`. The acceptance-evidence-gate hook blocks
   violations at write time when the runtime supports hooks; the CI re-check is
   the merge-time backstop in every runtime. REJECT and BLOCKED are always legal
   verdicts.
3. **Two human gates only** — Gate 1 approves contract+evals BEFORE
   implementation; Gate 2 signs off on the evidence report AFTER. Never ask
   the human to hand-test what an executor already proved.

Codex role routing is optional and project-scoped. When Feature Loop's managed
`.codex/agents` policy is installed, select `acceptance-ui-verifier`,
`acceptance-judge`, `acceptance-reviewer`, and `acceptance-refuter` by name only
when the spawn surface exposes a named-agent selector. Otherwise inherit the
session configuration or run a separated sequential pass and record that
fallback. Claude `feature_loop.models` aliases are not Codex model ids.

## Phase 0 — Preflight (always run first)

1. Locate consumer config: `_acceptance/config.yaml` from repo root.
   Missing → STOP: invoke the `acceptance-init` skill (Claude legacy alias:
   `/acceptance-init`) before continuing.
2. Read config: `enforcement`, `executors`, `risk_tiers`, `signoff`,
   `dev_server`.
3. Determine risk tier. Pre-implementation there is no diff yet — classify
   from the paths the feature is EXPECTED to touch (inferred from the
   request/ticket; confirm the guess with the user at Gate 1):
   - Expected paths all match `risk_tiers.t1_skip_globs` → do NOT skip
     silently: print the per-path match table (`<expected path> → <glob>`),
     say "T1 — acceptance gate skipped", and ask the user to CONFIRM the T1
     call before stopping. Warn that the CI backstop
     (`pre-merge-check.sh --base <ref>`) blocks the merge if the actual PR
     ends up touching gated paths with no `_acceptance/` artifacts. Do not
     create artifacts.
   - Any expected path matches `risk_tiers.t3_paths` → T3.
   - Else → T2.
   At Phase 3 entry, re-check the ACTUAL `git diff` file list against
   `t3_paths`: if the implementation touched a T3 path, escalate the
   contract's `risk_tier` to T3 and tell the user.
4. Determine entry state from `_acceptance/{slug}/`:
   **Slug-ownership guard first:** if `_acceptance/{slug}/` already exists,
   compare its contract's `feature:` (and `owner:`) with the CURRENT request.
   Different feature → this is a slug COLLISION, not a resume: REQUIRE a new
   slug (suggest `{slug}-2` or a date suffix) and never silently continue on
   top of someone else's workspace. Same feature → resume per the table below.
   - No `contract.md` → Phase 1.
   - `contract.md` status: draft → Gate 1 pending (re-present to user).
   - status: approved, no implementation yet → hand off to implementation.
   - status: implemented → Phase 3.
   - `evidence-report.md` verdict PASS or PENDING-JUDGMENT + no
     `human_signoff` → Gate 2 pending (re-present per Phase 3 step 5) —
     AFTER the staleness guard below.
   - `evidence-report.md` verdict REJECT or BLOCKED → re-enter Phase 3;
     resume the round count from the report's Iterations section.
   - contract `status: signed-off` → done, nothing to run.

   **Staleness guard** (run before ANY Gate-2 re-present — contract
   `status: verified`, or a PASS/PENDING-JUDGMENT report awaiting signoff):
   read `verified_commit` from the report frontmatter.
   - Present → run `git diff --name-only <verified_commit>`. If any changed
     file is outside `_acceptance/` and not matched by
     `risk_tiers.t1_skip_globs`, the evidence is STALE (code changed after
     verify): announce it to the user, set contract `status: implemented`,
     and re-enter Phase 3 (next round). Never present Gate 2 on stale
     evidence.
   - Absent (report from an older template) → tell the user the evidence is
     not pinned to a commit and recommend re-verifying; do not downgrade
     automatically.

## Phase 1 — NORMALIZE (input → contract)

Input forms and how to mine them:
| Input | Mining steps |
|---|---|
| Conversational prompt | Extract feature name, actors, observable behaviors from the conversation; ask the user ONLY for what cannot be inferred |
| Ticket (Jira/Linear/GitHub) | Read title + description + AC section; preserve ticket URL as source |
| Spec/PRD file | Read it; lift explicit AC; compress context to 2-4 sentences |

Steps:
1. Read `references/contract-template.md`. Create
   `_acceptance/{slug}/contract.md` from it (slug = kebab-case feature name).
2. Write 5-15 criteria, each Given/When/Then, each independently checkable.
   Tag business-judgment criteria with `(judgment)`.
3. Fill **Out of scope** — minimum 2 bullets. An empty out-of-scope section
   means you have not thought about boundaries; dig for them.
4. Set frontmatter: `risk_tier` (from Phase 0), `status: draft`,
   `surfaces` (only surfaces this feature actually touches), and
   `owner:` = the output of `git config user.email` (slug-ownership audit;
   empty when git has no identity — leave the field present).
5. **STOP — Gate 1 part A.** Present the contract to the user verbatim.
   Do NOT proceed to implementation. Do NOT start Phase 2 until the user
   reacts; fold their edits in directly.

## Phase 2 — EVAL-GEN (contract → evals.yaml)

Run immediately after the user reviews the contract (same gate, one sitting).

1. Read `references/eval-executors.md`. Create `_acceptance/{slug}/evals.yaml`.
2. Map every criterion to ≥1 eval using the executor selection rules
   (test > script > ui-check > judgment — prefer the most mechanical executor
   that can actually check the criterion).
2b. **Design quality (web-UI surfaces, default-on).** If any `surface` in the
   contract renders a web UI, add ≥1 design-quality eval **even when no criterion
   explicitly mentions design**: a `script` eval `cmd: config:executors.design.gate`
   (deterministic floor, fails on P0 a11y/contrast), plus — when a browser
   session + dev server are available — a `ui-check` eval per
   `references/design-ui-check.md` (authoritative P0). Skip only when no surface
   renders UI, or when `executors.design` is absent from config.yaml (then note
   the skip). Strategic "on-brand / not generic" goes to a `judgment` eval.
3. Repo-specific commands MUST be `config:` references
   (e.g. `cmd: config:executors.test.api`) — never hardcoded.
4. Coverage check — two rules:
   (a) every AC-n appears in ≥1 eval's `criterion` field. Print the mapping
       table (criterion → eval ids → executor).
   (b) **Boundary + should-NOT-fire.** Given/When/Then is structurally positive,
       so a naive eval suite is all-should-fire and silent on the half a feature
       is most likely to break (cry-wolf, tenant leak, off-by-one). For every
       threshold/numeric/window criterion (a count, ≥/≤/<>, "trong N ngày", a
       budget), at least one eval must assert the SUPPRESSION half — a just-below
       case that must NOT fire. For every system boundary, add an explicit
       negative/absence eval: Zod input → malformed rejected; RLS → cross-tenant
       denied; jsonb-from-DB → malformed throws/defaults; no-embed → PII absent;
       no-fabricate → source_field present. Mine the contract's **Out of scope**
       + risk list — each is a should-NOT-fire assertion in disguise.
   Run the advisory lint and present its warnings at Gate 1 (it never auto-blocks;
   the human decides): `node <acceptance-gate-plugin>/scripts/eval-coverage-lint.js
   <repo_root> --slug <slug>` — flags threshold criteria whose evals never assert a
   should-NOT-fire case (W1) and out-of-scope items with zero negative evals (W3).
5. **STOP — Gate 1 part B.** Present evals.yaml + mapping table — or, to cut
   review time, invoke the `acceptance-card` skill for `<slug>`: the human reviews
   "sẽ làm / sẽ KHÔNG làm" + coverage flags instead of
   raw YAML (presentation only; the contract/evals stay the source of truth). On approval:
   set contract `status: approved`, `approved_by`, `approved_at`, and ask the
   user how many minutes Gate 1 took → write `time_human_minutes.gate1`.
6. Hand off to implementation (normal agent coding flow — the implementing
   agent reads contract + evals and codes until it believes evals will pass).
   The implementing agent's FINAL act is setting the contract's
   `status: implemented` — that transition is what arms Phase 3 entry
   detection. If Phase 0 finds `status: approved` but implementation seems to
   exist, ask the user instead of guessing.

## Phase 3 — VERIFY (implementation → evidence-report.md)

Entry: implementation complete, contract `status: implemented`.

1. **Dispatch a fresh verification context**. Prefer a fresh subagent when the
   runtime exposes one; in Codex without multi-agent tools, run a separated
   grader pass after implementation and record that fallback in the report. It
   executes resolved commands and fills an evidence template; no large-model
   self-assertion is accepted because the hook/CI evidence gate is the
   correctness backstop. Its prompt
   contains: contract.md, evals.yaml, config executor commands, the FULL
   `references/evidence-report-template.md` (Verdict rules + Field notes +
   template body), the verdict routing rules from step 4 below, and the
   current verify round number (the subagent fills the Iterations section),
   and the instruction: "You did not write this code. Run every eval. Record
   evidence faithfully; in a PASS report sanitize output excerpts — no
   nonzero exit tokens (exit_code:/exit=) and no 'verdict: FAIL' strings
   (hook-enforced L1 CONSISTENCY). UNCERTAIN when unsure. Never mark PASS
   without captured output. For every ui-check: after saving frames, OPEN each frame with a multimodal
   Read and record observed: — 1-3 lines of what is visible vs expected; a
   frame contradicting expected means that eval FAILS even with exit 0; never
   write observed from memory. If any judgment item is UNCERTAIN — or the
   contract is T3 with judgment evals — the overall verdict is
   PENDING-JUDGMENT, never PASS."
2. The subagent executes per executor type:
   - `test` / `script`: run the resolved `config:` command. Capture exit code
     + last 10 output lines. Use the run_id from verifier stdout when
     printed; else mint `{slug}-{evalid}-{timestamp}`.
   - **Run-log (before writing the report):** for every machine/ui-check eval
     executed, append one JSON line to `_acceptance/{slug}/run-log.jsonl` AT
     RUN TIME (mechanical Bash append, exact values from the run):
     `{"ts":"<ISO8601>","round":N,"evalId":"E1","run_id":"<id>","exit_code":0,"cmd":"<resolved cmd>"}`.
     The report MUST reuse exactly these run_ids — the hook and CI re-check
     reconcile every report run_id against this log; an id absent from the
     log blocks the PASS. Never write the log from memory after the fact.
   - `ui-check`: select `acceptance-ui-verifier` when available, then start dev server per `config:dev_server.start`; drive via the
     available browser tool (Claude Preview, Chrome MCP, Playwright/Puppeteer,
     or equivalent); save a frame at EACH step to
     `_acceptance/{slug}/evidence/E{id}-step{n}.png` via `config:capture.ui`
     (preview_screenshot is inline-only; the Gate-2 page plays `E{id}-*.png` as a
     slideshow); `screenshot:` = the first frame. Read each saved frame and record observed: in its report block (schema-v2 reports without it are hook-blocked).
     No capture/browser → save HTML / downgrade to judgment + note (see eval-executors.md).
   - `judgment`: dispatch `acceptance-judge` per `references/judge-personas.md`
     (separate fresh subagent when available, or three separated Codex passes
     with hidden implementer reasoning). The verdict is scoped on resolved
     inputs; blind: no diff, no implementer reasoning. If the verify context
     cannot spawn nested agents, it returns judgment evals unscored; the
     ORCHESTRATOR dispatches each judge per references/judge-personas.md and
     merges verdicts into the report. Never let the implementation pass judge
     itself inline.
   - **Review:** run two `acceptance-reviewer` passes for conventions/invariants
     and bugs/silent failures. Dispatch one `acceptance-refuter` for each
     proposed finding before treating it as confirmed.
3. Write `_acceptance/{slug}/evidence-report.md` per template. Add an
   `## Codex routing` section containing each role's routing mode, requested
   model, requested reasoning effort, invocation count, and effective model
   only when the runtime exposes it. Record
   `deterministic_executor_workers: 0`. The
   acceptance-evidence-gate hook validates evidence at write time — if it
   blocks, the evidence is incomplete: fix the evidence, never the wording.
   Replace the template's `enforcement_mode` / `bypass_used` placeholders with
   REAL values — `enforcement` from config.yaml (default strict), and `true`
   iff `printf '%s' "$ACCEPTANCE_GATE_BYPASS"` prints `1`. Set
   `verified_commit` to the REAL `git rev-parse HEAD` output (omit the field
   only when the repo is not a git repo — the hook rejects any non-SHA
   value). CI-enforced provenance: `pre-merge-check.sh` blocks
   `enforcement_mode: off`, an un-acknowledged `bypass_used: true` (a human
   may release it with `bypass_ack: <name> <date>`; `warn` only warns), and
   STALE evidence — non-gate files changed after `verified_commit`.
4. Verdict routing:
   - All pass (incl. judgment, with no UNCERTAIN) → verdict PASS, contract
     `status: verified`. → step 5.
   - All machine evals pass but ≥1 judgment item is UNCERTAIN (or the
     feature is T3, whose judgment items always await direct human verdicts)
     → verdict PENDING-JUDGMENT, contract `status: verified`. → step 5; the
     human resolves each item at Gate 2 and upgrades the verdict to PASS.
   - Any eval fails → verdict REJECT + `failed_evals[]`. Return findings to
     the implementing context. Max 3 verify rounds; log each in the report's
     Iterations section. After round 3 → STOP, escalate to user.
   - Executor cannot run → verdict BLOCKED + reason. STOP, escalate.
5. **STOP — Gate 2.** FIRST commit the machine-written verify output
   (evidence-report.md + run-log.jsonl + contract + evidence/) as its own
   commit containing NO human signature — the Gate-2 edits below must land
   in a SEPARATE commit touching only human-owned report lines
   (`human_signoff` / `human_override` / `verdict` upgrade / `bypass_ack`);
   with `signoff.require_human_commit: true` pre-merge enforces this split,
   and the reviewer commits the signature themselves (or explicitly orders
   the agent to commit exactly those lines).
   Then present to the user: verdict, the per-eval table, links
   to evidence, and the list of UNCERTAIN judgment items they must personally
   check (T3: ALL judgment items). To cut review time, render the decision card
   (invoke the `acceptance-card` skill for `<slug>`) — judgment items + deferred scope (việc-của-người)
   surface FIRST in plain language, machine evidence collapsed; the verdict + hook
   are unchanged. The user resolves each pending item by
   filling its `human_override: <name> <date>` line; if the verdict was
   PENDING-JUDGMENT they then upgrade it to PASS (the hook re-validates that
   write) — have the agent apply that edit so the hook actually sees it; a
   human editing outside the agent bypasses PreToolUse (CI pre-merge-check
   is the backstop). The user (not you) fills `human_signoff`; then ask
   minutes spent →
   `time_human_minutes.gate2`, set contract `status: signed-off`. In Codex,
   trusted hooks use the native apply_patch adapter; when that adapter is not
   active, run
   `scripts/recheck-evidence.js` or `scripts/pre-merge-check.sh` before calling
   the gate complete; CI remains the authoritative merge backstop.

## Degradation table

| Situation | Action |
|---|---|
| No `_acceptance/config.yaml` | STOP at Phase 0 → invoke `acceptance-init` |
| Executor command fails to start (env broken) | verdict BLOCKED + reason — never PASS |
| No browser MCP for ui-check | Downgrade eval to judgment + note in report |
| Judge returns >50% UNCERTAIN | Complete the run, then flag contract quality at Gate 2 |
| 3 verify rounds exhausted | verdict REJECT, escalate with failure pattern summary |
| User asks to skip Gate 1 | Refuse politely once, explain leverage; if insisted, note `gate1_skipped: true` in contract |
| Hook blocks the report write | Evidence is incomplete — capture real evidence; do NOT reword the verdict to dodge the gate |
| Hook L1 CONSISTENCY blocks an all-green PASS (stray exit=1 or verdict: FAIL token in pasted output) | Sanitize the output excerpt per template — verdict stays PASS; flip to REJECT only if an eval actually failed |

## Anti-patterns

| Anti-pattern | Why it kills the gate |
|---|---|
| Implementing agent runs its own evals and writes the report | Doer = grader; self-grading inflates PASS. Always fresh subagent |
| Marking judgment UNCERTAIN items as PASS "because they look fine" | UNCERTAIN exists to route to humans; guessing destroys trust in every future PASS |
| Hardcoding repo commands in evals.yaml | Breaks the engine/binding split; kit stops being portable |
| Writing contract criteria after implementation | Criteria mold themselves to what was built; gate becomes theater |
| Asking the human to re-test machine-proven evals at Gate 2 | Burns the exact time the kit exists to save |
| Editing verdict wording to slip past the hook | The hook is the contract; evidence or no PASS |
| Using checked_by: for attribution | checked_by is reserved — parsed as a verifier, fails L2 authenticity; attribution belongs in verified_by: |

## References

- `references/contract-template.md` — contract format + lifecycle
- `references/eval-executors.md` — 4 executors, evals.yaml shape, selection rules
- `references/evidence-report-template.md` — report format, verdict rules, Gate 2 checklist
- `references/judge-personas.md` — blind judge dispatch + persona
