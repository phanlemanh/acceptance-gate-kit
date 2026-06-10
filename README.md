# Acceptance-Gate Kit

Evidence-backed acceptance gate for AI-generated features. Cuts human
acceptance time from hours of hand-testing to ~15-20 minutes at two
high-leverage gates.

## How it works

```
input (prompt/ticket/PRD)
  → Phase 1 NORMALIZE  → contract.md          ┐
  → Phase 2 EVAL-GEN   → evals.yaml           ├─ Gate 1: human approves (5-10 min)
  → implementation (normal Claude Code flow)  │
  → Phase 3 VERIFY     → evidence-report.md   ├─ Gate 2: human signs off (5-10 min)
       fresh-context subagent runs every eval ┘
```

Enforcement is deterministic, not aspirational:
- **Hook** (`acceptance-evidence-gate.js`): blocks any PASS verdict written
  without machine evidence (run_id, exit_code 0, authentic verifier,
  verified_at) or with unresolved UNCERTAIN judgments.
- **CI** (`scripts/pre-merge-check.sh`): blocks merge of implemented T2/T3
  features without a signed PASS evidence report.

> **Thành viên mới: đọc [QUICKSTART.md](QUICKSTART.md) (tiếng Việt, 5 phút) — cài 2 lệnh là dùng được.**

## Install

Team install — this repo doubles as its own marketplace:

```bash
claude plugin marketplace add phanlemanh/acceptance-gate-kit
claude plugin install acceptance-gate@acceptance-gate-kit
```

Installing the plugin registers the skill, both commands, and the
PreToolUse hook automatically — no settings edits needed.

Pilot mode (iterate on the kit while using it) — symlink ALL THREE pieces
into the consumer repo; the skill alone is not enough (commands and the hook
live outside `skills/`):

```bash
cd <consumer-repo>
ln -s <kit>/skills/acceptance .claude/skills/acceptance
mkdir -p .claude/commands
ln -s <kit>/commands/acceptance-init.md   .claude/commands/acceptance-init.md
ln -s <kit>/commands/acceptance-status.md .claude/commands/acceptance-status.md
# hook: register in .claude/settings.local.json (machine-local, not committed)
#   PreToolUse Write|Edit -> node "<kit>/hooks/acceptance-evidence-gate.js"
```

Restart the Claude Code session afterwards — skills/commands/hooks are
discovered at session start. Keep the symlinks and settings.local.json
uncommitted (absolute machine paths).

## Per-repo setup (once)

```
/acceptance-init      # interactive: writes _acceptance/config.yaml
```

Copy `scripts/pre-merge-check.sh` into the repo's CI:

```yaml
# e.g. GitHub Actions step
- run: bash scripts/pre-merge-check.sh .
```

## Daily use

- New feature → invoke the `acceptance` skill → contract + evals → approve
  (Gate 1) → implement → verify → sign off (Gate 2).
- `/acceptance-status` → table of every feature's gate state.
- Risk tiers: T1 skips the kit; T3 requires direct human verdicts on all
  judgment items. Tiers/globs are per-repo in `_acceptance/config.yaml`.
- Current test surface: 24 hook cases (`tests/hooks/run-tests.sh`) + 12 CI-gate
  cases (`tests/scripts/run-tests.sh`).

## Layout

| Path | What |
|---|---|
| `skills/acceptance/` | The 3-phase skill + templates |
| `hooks/` | PreToolUse evidence gate |
| `commands/` | `/acceptance-init`, `/acceptance-status` |
| `scripts/pre-merge-check.sh` | CI gate (copy into consumer repos) |
| `tests/` | Fixture tests: `bash tests/hooks/run-tests.sh && bash tests/scripts/run-tests.sh` |

## Pilot metrics

`time_human_minutes` (gate1/gate2) lives in each contract's frontmatter.
Capture the pre-kit baseline ONCE during `/acceptance-init` (optional
question): estimated acceptance minutes for the last 3 features →
`baseline_minutes` in `_acceptance/config.yaml`.
Success bar for the pilot: ≥50% less human time than that baseline,
zero business-logic defects slipping past the gate.

## Known limitations (v1)

Deliberate scope cuts — each is backed by the CI gate + human sign-off
downstream, and revisited after the pilot:

- **L3 judgment pairing is count-based**, not position-aware: any
  `human_override:` with a value balances any UNCERTAIN. A determined agent
  can game it; an honest one cannot trip it accidentally.
- **Verdict synonyms**: PASS/PASSED/ACCEPTED/APPROVED/GO/SUCCESS are caught;
  unicode homoglyph evasion is out of scope for a defense-in-depth gate.
- **Config lookup prefers the nearest `_acceptance/config.yaml`** walking up
  from the report — a planted nested config can lower enforcement; it would
  be visible in any diff/review.
- **The hook only sees agent edits** (PreToolUse). A human editing
  evidence-report.md in their editor bypasses it; `scripts/pre-merge-check.sh`
  in CI is the backstop for exactly that path.
- **`enforcement: warn` / `off` outputs are not assertion-tested** (exit codes
  are — T12/T24).

Design spec: `docs/specs/2026-06-10-acceptance-gate-kit-design.md`
