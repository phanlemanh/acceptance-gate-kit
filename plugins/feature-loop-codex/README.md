# feature-loop-codex

Codex-native edition of the feature loop on top of `acceptance-gate`.

Version `1.10.0` tracks the Claude Code `feature-loop` state machine and gate
discipline, but replaces Claude workflow-script execution with Codex-native
agent orchestration.

## Install

```bash
codex plugin marketplace add phanlemanh/acceptance-gate-kit
codex plugin add acceptance-gate@acceptance-gate-kit
codex plugin add feature-loop-codex@acceptance-gate-kit
codex plugin add design-loop@acceptance-gate-kit      # optional, for web UI work
codex plugin add superpowers@openai-curated
```

Open a new Codex session after installation so the skill list is refreshed.

## Use

Ask Codex:

```text
Run feature-loop-codex for <feature description>
```

For repo setup, run `/acceptance-init` first and add `feature_loop.suite_keys`
to `_acceptance/config.yaml` when round-level verification should run a stable
build/typecheck/lint suite. For web UI features, run `design-loop` setup once so
`executors.design.*` exists; feature-loop-codex then requires a state matrix,
reference captures, and `provenance.json` before Gate 1.

## Runtime Model

Codex orchestration is done by the main agent:

- Run deterministic machine evals directly with shell commands.
- Use `spawn_agent` / `wait_agent` when Codex exposes multi-agent tools and the
  task is independent or needs fresh judgment/review context.
- Otherwise execute the same loop sequentially and record that fallback in the
  evidence report.
- Keep doer and grader roles separate: S4 verification must not edit product
  code.
- Do not execute Claude Code Workflow scripts or require Claude Design. The
  design-loop path for Codex uses portable references: checked-in design files,
  a design repo, generated reference HTML/CSS, or saved screenshots with
  provenance.

The acceptance contract, evals, evidence report, hook enforcement, and CI gate
remain shared with `acceptance-gate`.
