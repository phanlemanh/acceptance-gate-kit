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



When execution must depart from the approved plan, append a provisional `fix`
or `descope` entry immediately with `stage: S3`.

At the end, run task-level verification and set contract status to
`implemented`, then enter S4 immediately in the same turn. Do not run
acceptance evals inside S3 — but do not pause for the human at this boundary
either: doer ≠ grader is satisfied by the separated grader pass of S4, not by
a human turn.
