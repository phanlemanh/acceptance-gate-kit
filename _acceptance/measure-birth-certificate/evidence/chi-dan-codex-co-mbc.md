Implement the plan in the main Codex agent by default. When the plan has at
least two independent tasks and Codex exposes multi-agent tools, split only
tasks with disjoint file ownership:

1. Spawn one `feature_loop_executor` per independent task when named selection
   is available. Otherwise spawn a normal worker with `session-inherited`.
   Always provide explicit owned files and a verify command.
2. Tell workers not to revert, stash, reset, switch branches, or overwrite
   others' changes.
3. Wait for every worker, review returned diffs, and integrate deliberately.
4. Repair failed tasks sequentially in the main agent.

<!-- <<<MEASURE-BIRTH-CLAUSE -->
**A NEW measure (suite case, eval in evals.yaml, rule/check in a script) only
counts as DONE when it ships with a two-direction case pair on the SAME
fixture:** intact object → the measure stays green (positive control); break
the real object in a copy → the measure goes red with a PINNED MESSAGE (mold
name / case name / invariant — never exit code alone). No pair = the task is
NOT done — that task's per-task verify must include the break-it run. Full
mold + living samples: `references/measure-birth.md` in the acceptance-gate
package (resolve via resolve-plugin.mjs). Why: green from a measure that has
never been red cannot distinguish "healthy object" from "a ruler that never
ran" — a broken fixture, a failed cp, exit 127 all paint the same green.
<!-- MBC-CORE: pair-same-fixture + pinned-message + not-done-without-pair; objects: suite-case, eval, rule-script -->
<!-- MEASURE-BIRTH-CLAUSE>>> -->

When execution must depart from the approved plan, append a provisional `fix`
or `descope` entry immediately with `stage: S3`.

At the end, run task-level verification and set contract status to
`implemented`, then enter S4 immediately in the same turn. Do not run
acceptance evals inside S3 — but do not pause for the human at this boundary
either: doer ≠ grader is satisfied by the separated grader pass of S4, not by
a human turn.
