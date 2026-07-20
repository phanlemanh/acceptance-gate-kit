# Acceptance-Gate Kit

Evidence-backed acceptance gate for AI-generated features. Cuts human
acceptance time from hours of hand-testing to ~15-20 minutes at two
high-leverage gates.

## How it works

```
input (prompt/ticket/PRD)
  → Phase 1 NORMALIZE  → contract.md          ┐
  → Phase 2 EVAL-GEN   → evals.yaml           ├─ Gate 1: human approves (5-10 min)
  → implementation (normal agent coding flow) │
  → Phase 3 VERIFY     → evidence-report.md   ├─ Gate 2: human signs off (5-10 min)
       fresh-context subagent runs every eval ┘
```

Enforcement is deterministic, not aspirational:
- **Hook** (`acceptance-evidence-gate.js`): blocks any PASS verdict written
  without machine evidence (run_id — reconciled against the machine-written
  `run-log.jsonl` when it exists, exit_code 0, authentic verifier,
  verified_at, a real-SHA `verified_commit` when present) or with unresolved
  UNCERTAIN judgments — and blocks contract `status` transitions that skip
  Gate 1 (approved/signed-off, or draft → implemented/verified, with an empty
  `approved_by` and no `gate1_skipped: true`).
- **CI** (`scripts/pre-merge-check.sh`): blocks merge of implemented T2/T3
  features without a signed PASS evidence report, without a recorded Gate-1
  approval, with STALE evidence (non-gate files changed after the report's
  `verified_commit`), or — via the committed-evidence re-check — with run_ids
  that were never machine-logged in `run-log.jsonl`. With
  `signoff.require_human_commit: true`, the Gate-2 signature must also land in
  its own human-fields-only commit (git history is the attribution — an AI
  auto-filling `human_signoff` alongside the report body is blocked).

> **Thành viên mới: đọc [QUICKSTART.md](QUICKSTART.md) (tiếng Việt, 5 phút) — cài 2 lệnh là dùng được.**
> **Bản đầy đủ — kiến trúc, cài đặt, vận hành, tra cứu enforcement: [GUIDE.md](GUIDE.md).**

## Install

Claude Code:

```bash
claude plugin marketplace add phanlemanh/acceptance-gate-kit
claude plugin install acceptance-gate@acceptance-gate-kit
claude plugin install feature-loop@acceptance-gate-kit    # Claude Code edition
claude plugin install superpowers@claude-plugins-official # required by feature-loop
claude plugin install design-loop@acceptance-gate-kit     # optional for web UI
```

Codex:

```bash
codex plugin marketplace add phanlemanh/acceptance-gate-kit
codex plugin add acceptance-gate@acceptance-gate-kit
codex plugin add feature-loop-codex@acceptance-gate-kit   # Codex-native edition
codex plugin add design-loop@acceptance-gate-kit          # optional for web UI
codex plugin add superpowers@openai-curated               # optional brainstorm/plan helpers
```

Codex requires CLI **0.139.0 or newer** for the native plugin, hook, goal, and
multi-agent surfaces used by these editions. Open a **fresh task** after
installing or upgrading so the task discovers the new skills and hooks. Review
the plugin in `/hooks` and grant **hook trust** before relying on its write-time
gate; CI remains authoritative if a local hook is untrusted or disabled.

`design-loop` on Codex uses portable mockup/evidence skills and repository
executors. **Claude Design is unavailable in Codex**; the Codex edition never
pretends to invoke that Claude-only surface and never treats an unverified VLM
assertion as design evidence.

Stay current — two devs on different kit versions in one repo run two different
gate rule-sets:

```bash
claude plugin update acceptance-gate@acceptance-gate-kit
claude plugin update feature-loop@acceptance-gate-kit
codex plugin marketplace upgrade
```

> **Codex enforcement note.** The same artifacts, scripts, and CI gate are used.
> Write-time hook behavior depends on the active agent runtime and hook trust,
> so do not rely on it as the only guard. The authoritative cross-runtime
> backstop is still the vendored CI set:
> `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.js`, and
> `lib/evidence-core.js`.

For local development, replace `phanlemanh/acceptance-gate-kit` with the
absolute path to this checkout. After changing acceptance-gate source files,
run:

```bash
scripts/sync-plugin-packages.sh
```

> **feature-loop** has two runtime-specific editions:
> - `feature-loop` is the Claude Code edition and uses Claude workflow scripts.
> - `feature-loop-codex` is the Codex edition using Codex-native agent
>   orchestration and shell/browser evidence.
>
> Both preserve the same gate discipline: brainstorm → contract+evals
> (Gate 1) → plan → execute → verify → evidence + signoff (Gate 2).

Installing the Claude plugin registers the skill, slash commands, and
PreToolUse hook. Installing the Codex plugins registers native skills and
hooks, including helper skills for acceptance init/status/card and portable
design operations; CI remains the runtime-independent enforcement layer.

For Codex role-level budget routing, invoke `feature-loop-model-init` inside the
consumer repository after `acceptance-init`. It installs project-scoped agents
under `.codex/agents/`; a fresh task loads the policy. Claude
`feature_loop.models` remains unchanged and continues to control only the
Claude Workflow edition.

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
uncommitted (absolute machine paths). For Codex pilot mode, prefer adding this
checkout as a local marketplace:

```bash
codex plugin marketplace add /absolute/path/to/acceptance-gate-kit
codex plugin add acceptance-gate@acceptance-gate-kit
codex plugin add feature-loop-codex@acceptance-gate-kit
codex plugin add design-loop@acceptance-gate-kit
```

## Per-repo setup (once)

In Claude Code, run `/acceptance-init`. In Codex, invoke the
`acceptance-init` skill (or ask "run acceptance init"). Both write the same
`_acceptance/config.yaml` artifact.

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
- At Gate 2, `/acceptance-card` also generates a full **evidence page**
  (`evidence-page.html`) and auto-opens it — real screenshots (a ui-check eval
  with multiple frames plays as a CSS slideshow), real output, judge rationale,
  override status, review findings, Gate-2 checklist. The card stays link-only;
  you SEE the artifacts on the page. Self-contained, `file://`-openable, zero-dep.
- Risk tiers: T1 skips the kit; T3 requires direct human verdicts on all
  judgment items. Tiers/globs are per-repo in `_acceptance/config.yaml`.
- Current test surface (8 suites, all fixture-driven): 51 hook cases
  (`tests/hooks/run-tests.sh`) + 155 script cases
  (`tests/scripts/run-tests.sh`: pre-merge gate + provenance + evidence
  re-check, eval-coverage lint, gate-card, evidence-page) + packaging checks
  (`tests/plugins/run-tests.sh`: version alignment, vendored engine import
  graph, `${CLAUDE_PLUGIN_ROOT}` path resolution) + design-loop fixtures
  (`tests/design-loop/run-tests.sh`: token-only + layout-token-only +
  contrast-AA regressions) + layout-meter suite (`tests/skills/run-tests.sh`:
  analyze() geometry + browser-verified fixtures) + design-eval, workflow,
  and Codex suites.

## Layout

| Path | What |
|---|---|
| `.claude-plugin/marketplace.json` | Claude Code marketplace entry |
| `.agents/plugins/marketplace.json` | Codex marketplace entry |
| `.codex-plugin/plugin.json` | Codex manifest for the acceptance-gate plugin |
| `codex/` | Codex-only source overlays; never loaded by Claude Code |
| `plugins/acceptance-gate/` | Packaged acceptance-gate plugin for the Codex marketplace (regenerate with `scripts/sync-plugin-packages.sh`) |
| `plugins/feature-loop-codex/` | Codex-native feature-loop edition |
| `plugins/design-loop-codex/` | Portable Codex design-loop package |
| `design-loop/` | Shared design engine plus the Claude Code design-loop source |
| `skills/acceptance/` | The 3-phase skill + templates |
| `skills/ux-ui-craft/` | Design-engineer skill: 7-step UI process, hard gates (contrast, type/alignment budgets, structure–space coherence, states), Layout Contract + layout meter (`measure_layout.js`), System+Prototype+Audit modes, 10 craft references |
| `skills/morphological-scan/` | CT-S coverage skill: Zwicky-box AC-space scan (MECE axes + CE evidence + Pareto Core/Later/Never) feeding the contract's Coverage section on the Gate-1 card |
| `hooks/` | PreToolUse evidence gate (write time) |
| `lib/evidence-core.js` | Shared L1/L2/L3 evidence validation (hook + CI re-check) |
| `commands/` | `/acceptance-init`, `/acceptance-status`, `/acceptance-card` |
| `scripts/pre-merge-check.sh` | CI gate (copy into consumer repos) |
| `scripts/recheck-evidence.js` | CI re-verify a committed report's evidence |
| `scripts/gate-card.js` | Render the Gate 1 / Gate 2 human decision card |
| `scripts/config-patch.mjs` | THE splice path for programmatic config.yaml writes (dry-run, .bak, abort-on-existing) |
| `scripts/evidence-page.js` | Render the full Gate-2 evidence page (screenshots/output/slideshow) |
| `tests/` | Fixture tests: `for t in hooks scripts plugins design-loop design-eval workflows codex skills; do bash tests/$t/run-tests.sh; done` |

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
