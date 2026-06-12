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
1. **Doer ≠ grader** — the verify phase runs in a FRESH subagent, never the
   implementing agent.
2. **Evidence over assertion** — PASS requires `run_id + exit_code: 0 +
   verifier + verified_at`. The acceptance-evidence-gate hook blocks
   violations at write time. REJECT and BLOCKED are always legal verdicts.
3. **Two human gates only** — Gate 1 approves contract+evals BEFORE
   implementation; Gate 2 signs off on the evidence report AFTER. Never ask
   the human to hand-test what an executor already proved.

## Phase 0 — Preflight (always run first)

1. Locate consumer config: `_acceptance/config.yaml` from repo root.
   Missing → STOP: tell the user to run `/acceptance-init` first.
2. Read config: `enforcement`, `executors`, `risk_tiers`, `signoff`,
   `dev_server`.
3. Determine risk tier. Pre-implementation there is no diff yet — classify
   from the paths the feature is EXPECTED to touch (inferred from the
   request/ticket; confirm the guess with the user at Gate 1):
   - Expected paths all match `risk_tiers.t1_skip_globs` → announce
     "T1 — acceptance gate skipped" and STOP. Do not create artifacts.
   - Any expected path matches `risk_tiers.t3_paths` → T3.
   - Else → T2.
   At Phase 3 entry, re-check the ACTUAL `git diff` file list against
   `t3_paths`: if the implementation touched a T3 path, escalate the
   contract's `risk_tier` to T3 and tell the user.
4. Determine entry state from `_acceptance/{slug}/`:
   - No `contract.md` → Phase 1.
   - `contract.md` status: draft → Gate 1 pending (re-present to user).
   - status: approved, no implementation yet → hand off to implementation.
   - status: implemented → Phase 3.
   - `evidence-report.md` verdict PASS or PENDING-JUDGMENT + no
     `human_signoff` → Gate 2 pending (re-present per Phase 3 step 5).
   - `evidence-report.md` verdict REJECT or BLOCKED → re-enter Phase 3;
     resume the round count from the report's Iterations section.
   - contract `status: signed-off` → done, nothing to run.

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
   `surfaces` (only surfaces this feature actually touches).
5. **STOP — Gate 1 part A.** Present the contract to the user verbatim.
   Do NOT proceed to implementation. Do NOT start Phase 2 until the user
   reacts; fold their edits in directly.

## Phase 2 — EVAL-GEN (contract → evals.yaml)

Run immediately after the user reviews the contract (same gate, one sitting).

1. Read `references/eval-executors.md`. Create `_acceptance/{slug}/evals.yaml`.
2. Map every criterion to ≥1 eval using the executor selection rules
   (test > script > ui-check > judgment — prefer the most mechanical executor
   that can actually check the criterion).
3. Repo-specific commands MUST be `config:` references
   (e.g. `cmd: config:executors.test.api`) — never hardcoded.
4. Coverage check: every AC-n appears in ≥1 eval's `criterion` field. Print
   the mapping table (criterion → eval ids → executor).
5. **STOP — Gate 1 part B.** Present evals.yaml + mapping table. On approval:
   set contract `status: approved`, `approved_by`, `approved_at`, and ask the
   user how many minutes Gate 1 took → write `time_human_minutes.gate1`.
6. Hand off to implementation (normal Claude Code flow — the implementing
   agent reads contract + evals and codes until it believes evals will pass).
   The implementing agent's FINAL act is setting the contract's
   `status: implemented` — that transition is what arms Phase 3 entry
   detection. If Phase 0 finds `status: approved` but implementation seems to
   exist, ask the user instead of guessing.

## Phase 3 — VERIFY (implementation → evidence-report.md)

Entry: implementation complete, contract `status: implemented`.

1. **Dispatch a fresh verification subagent** (general-purpose, pass
   `model: sonnet` — it executes resolved commands and fills a hook-enforced
   template; no large-model reasoning needed, the evidence-gate hook is the
   correctness backstop). Its prompt
   contains: contract.md, evals.yaml, config executor commands, the FULL
   `references/evidence-report-template.md` (Verdict rules + Field notes +
   template body), the verdict routing rules from step 4 below, and the
   current verify round number (the subagent fills the Iterations section),
   and the instruction: "You did not write this code. Run every eval. Record
   evidence faithfully; in a PASS report sanitize output excerpts — no
   nonzero exit tokens (exit_code:/exit=) and no 'verdict: FAIL' strings
   (hook-enforced L1 CONSISTENCY). UNCERTAIN when unsure. Never mark PASS
   without captured output. If any judgment item is UNCERTAIN — or the
   contract is T3 with judgment evals — the overall verdict is
   PENDING-JUDGMENT, never PASS."
2. The subagent executes per executor type:
   - `test` / `script`: run the resolved `config:` command. Capture exit code
     + last 10 output lines. Use the run_id from verifier stdout when
     printed; else mint `{slug}-{evalid}-{timestamp}`.
   - `ui-check`: start dev server per `config:dev_server.start`; drive via
     Claude Preview MCP; screenshot to `_acceptance/{slug}/evidence/`.
     No browser MCP → downgrade to judgment + note (see eval-executors.md).
   - `judgment`: dispatch the judge per `references/judge-personas.md`
     (separate fresh subagent, `model: sonnet` — scoped verdict on resolved
     inputs; blind: no diff, no implementer reasoning).
     If the verify subagent cannot spawn nested subagents in this harness,
     it returns judgment evals unscored; the ORCHESTRATOR dispatches each
     judge per references/judge-personas.md and merges verdicts into the
     report. Never judge inline inside the verify agent.
3. Write `_acceptance/{slug}/evidence-report.md` per template. The
   acceptance-evidence-gate hook validates evidence at write time — if it
   blocks, the evidence is incomplete: fix the evidence, never the wording.
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
5. **STOP — Gate 2.** Present to the user: verdict, the per-eval table, links
   to evidence, and the list of UNCERTAIN judgment items they must personally
   check (T3: ALL judgment items). The user resolves each pending item by
   filling its `human_override: <name> <date>` line; if the verdict was
   PENDING-JUDGMENT they then upgrade it to PASS (the hook re-validates that
   write) — have the agent apply that edit so the hook actually sees it; a
   human editing outside the agent bypasses PreToolUse (CI pre-merge-check
   is the backstop). The user (not you) fills `human_signoff`; then ask
   minutes spent →
   `time_human_minutes.gate2`, set contract `status: signed-off`.

## Degradation table

| Situation | Action |
|---|---|
| No `_acceptance/config.yaml` | STOP at Phase 0 → `/acceptance-init` |
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
