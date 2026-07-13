# feature-loop-codex

Codex-native edition of the feature loop on top of `acceptance-gate`.

Version `1.11.4` tracks the Claude Code `feature-loop` 1.11.2 state machine and
gate discipline, but replaces Claude workflow-script execution with
Codex-native agent orchestration. It includes the append-only decision ledger,
D0/D1/D2 design lanes, native Codex goal guidance, and a managed role model
policy with honest runtime degradation.

## Install

```bash
codex plugin marketplace add phanlemanh/acceptance-gate-kit
codex plugin add acceptance-gate@acceptance-gate-kit
codex plugin add feature-loop-codex@acceptance-gate-kit
codex plugin add design-loop@acceptance-gate-kit      # optional, for web UI work
codex plugin add superpowers@openai-curated
```

Open a new Codex session after installation so the skill list is refreshed.

In a consumer repo that already ran `acceptance-init`, invoke the
`feature-loop-model-init` skill once. It installs six managed project agents
under `.codex/agents/`; open another fresh task so Codex loads them.

## Use

Ask Codex:

```text
Run feature-loop-codex for <feature description>
```

For repo setup, invoke the `acceptance-init` skill first and add `feature_loop.suite_keys`
to `_acceptance/config.yaml` when round-level verification should run a stable
build/typecheck/lint suite. For web UI features, run `design-loop` setup once so
`executors.design.*` exists; feature-loop-codex then requires a state matrix,
reference captures, and `provenance.json` before Gate 1.

## Runtime Model

Codex orchestration is done by the main agent:

- Run deterministic machine evals directly with shell commands.
- Use project agents for explorer, executor, UI verifier, judge, reviewer, and
  refuter roles when Codex exposes named-agent selection.
- Otherwise execute the same loop sequentially and record that fallback in the
  evidence report.
- Keep doer and grader roles separate: S4 verification must not edit product
  code.
- A native `/goal` may cover S2→S4 only and must stop at `verified`; Gate 2 and
  `signed-off` remain human-owned.
- Use `gpt-5.6-terra` at medium effort for bounded exploration/refutation and
  `gpt-5.6-sol` at medium/high effort for execution, UI grading, judgment, and
  high-recall review. The policy is requested configuration, not proof of the
  effective runtime model.
- Keep Claude-style `feature_loop.models` aliases untouched. When the current
  spawn interface cannot select a named agent, record `session-inherited`
  rather than claiming the role was pinned.
- Do not execute Claude Code Workflow scripts or require Claude Design. The
  design-loop path for Codex uses portable references: checked-in design files,
  a design repo, generated reference HTML/CSS, or saved screenshots with
  provenance.

The acceptance contract, evals, evidence report, hook enforcement, and CI gate
remain shared with `acceptance-gate`.
