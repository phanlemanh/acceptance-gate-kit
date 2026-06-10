# Eval Executors — 4 types

Every eval in `evals.yaml` declares exactly one `executor`. The executor
determines who grades and what counts as evidence.

| Executor | Surface | Grades | Evidence required |
|---|---|---|---|
| `test` | api / backend / sdk | Machine (exit code) | run_id, exit_code, verifier, verified_at |
| `script` | cli | Machine (exit code + output match) | run_id, exit_code, verifier, verified_at, output excerpt |
| `ui-check` | web ui | Machine assertion + human glance | run_id, exit_code, verifier, verified_at, screenshot path |
| `judgment` | any ("does this match business intent?") | Judge subagent → human | judged_by, verdict, rationale (+ human_override if UNCERTAIN) |

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
      - "Navigate {url}/login, submit valid SSO token"
      - "Assert redirect to /dashboard AND cookie 'session' present"
      - "Screenshot to evidence/E3-login-redirect.png"
    expected: "redirect + cookie + screenshot shows dashboard"
    evidence_required: [run_id, exit_code, verifier, verified_at, screenshot]

  - id: E4
    criterion: AC-2
    executor: judgment
    question: "Does the error message on invalid token match the product's tone guideline?"
    inputs: [contract.md, evidence/E3-login-redirect.png]
    evidence_required: [judged_by, verdict, rationale]
```

## Executor selection rules (used by Phase 2 EVAL-GEN)

1. Criterion checkable by running existing/new automated tests → `test`.
2. Criterion about CLI behavior → `script`.
3. Criterion observable only through the browser → `ui-check`.
4. Criterion containing words like "appropriate", "matches intent", "tone",
   "makes sense", or tagged `(judgment)` in the contract → `judgment`.
5. Every criterion gets ≥1 eval. A criterion with zero evals fails Gate 1.
6. `cmd` MUST be a `config:` reference when the command is repo-specific —
   never hardcode repo commands into evals.yaml.

## ui-check mechanics

- Local dev: drive via Claude Preview MCP (`preview_start` → `preview_eval` /
  `preview_screenshot`). Verifier value: the assertion script if one is
  written, else `config:dev_server.start`.
- Staging / deployed target: drive via Chrome MCP (navigate → assert →
  screenshot) against `config:dev_server.url`; same evidence requirements.
- No browser MCP available → DOWNGRADE the eval to `judgment` with the
  screenshot replaced by a manual checklist item, and note the downgrade in
  the evidence report. Never silently skip.
