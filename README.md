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
claude plugin install feature-loop@acceptance-gate-kit    # optional — full feature loop on top of the gate
```

> **feature-loop** (second plugin in this kit): end-to-end feature development
> loop orchestrating this gate + the superpowers plugin + multi-agent verify
> workflows — brainstorm → contract+evals (Gate 1) → plan → execute →
> parallel verify (machine evals, 3-judge blind panels, adversarial review)
> → evidence + signoff (Gate 2). See [feature-loop/README.md](feature-loop/README.md).
> Requires the superpowers plugin (`claude-plugins-official` marketplace).

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
ln -s <kit>/commands/acceptance-card.md   .claude/commands/acceptance-card.md
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

Copy `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.js`, and
`lib/evidence-core.js` into the repo (keep the `scripts/` + `lib/` layout so the
re-check can `require ../lib`), and run the gate in CI:

```yaml
# e.g. GitHub Actions step
- run: bash scripts/pre-merge-check.sh .
```

`pre-merge-check.sh` finds `recheck-evidence.js` next to itself; if it (or
`node`) is absent the merge gate still runs, minus the committed-evidence
re-check. That re-check is advisory by default (`recheck: warn` — prints NOTEs,
never blocks); set `recheck: strict` in `_acceptance/config.yaml` to make it
block, once your committed reports meet the current evidence shape (older
templates produce advisory NOTEs, not failures).

## Daily use

- New feature → invoke the `acceptance` skill → contract + evals → approve
  (Gate 1) → implement → verify → sign off (Gate 2).
- `/acceptance-status` → table of every feature's gate state.
- `/acceptance-card <slug>` → render a plain-language DECISION CARD for the gate:
  Gate 1 as "sẽ làm / sẽ KHÔNG làm" + coverage flags, or Gate 2 as "your
  decision / machine handled" + reversibility. Presentation only — the contract,
  evidence, verdict, and hook stay the source of truth; the card decides nothing.
- Risk tiers: T1 skips the kit; T3 requires direct human verdicts on all
  judgment items. Tiers/globs are per-repo in `_acceptance/config.yaml`.
- Current test surface: 24 hook cases (`tests/hooks/run-tests.sh`) + 61 script
  cases (`tests/scripts/run-tests.sh`: pre-merge gate + provenance + evidence
  re-check, eval-coverage lint, gate-card).

## Layout

| Path | What |
|---|---|
| `skills/acceptance/` | The 3-phase skill + templates |
| `hooks/` | PreToolUse evidence gate (write time) |
| `lib/evidence-core.js` | Shared L1/L2/L3 evidence validation (hook + CI re-check) |
| `commands/` | `/acceptance-init`, `/acceptance-status`, `/acceptance-card` |
| `scripts/pre-merge-check.sh` | CI gate (copy into consumer repos) |
| `scripts/recheck-evidence.js` | CI re-verify a committed report's evidence |
| `scripts/gate-card.js` | Render the Gate 1 / Gate 2 human decision card |
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
  in CI is the backstop for exactly that path — it re-runs the gate's own
  L1/L2/L3 evidence bar on the COMMITTED report via `scripts/recheck-evidence.js`
  (the same `lib/evidence-core.js` the hook uses), so a report hand-edited to
  PASS with a nonzero exit, a manual verifier, or an unresolved UNCERTAIN is
  caught at merge regardless of whether the write-time hook ran. The re-check
  defaults to `recheck: warn` (advise only — so adopting it never blocks merges
  over reports written by an older evidence template); set `recheck: strict` in
  `_acceptance/config.yaml` to hard-block, or `off` to skip. Provenance: a
  deterministic capture step stamps `enforcement_mode` + `bypass_used`; pre-merge
  BLOCKS an un-acknowledged `bypass_used: true` (a human may release it with
  `bypass_ack`) and `enforcement_mode: off`, and WARNS on `warn`. Residual: a
  report bypassed but written with fully authentic evidence passes the re-check
  (it is, in fact, authentic) while its `bypass_used` stamp depends on the verify
  env — hook-authoritative bypass capture is the remaining follow-up.
- **`enforcement: warn` / `off` hook outputs are not assertion-tested** (exit
  codes are — T12/T24); a `warn` report now warns at the merge gate, an `off`
  report is blocked.

Design spec: `docs/specs/2026-06-10-acceptance-gate-kit-design.md`
