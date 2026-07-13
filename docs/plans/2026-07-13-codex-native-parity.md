# Codex-Native Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship isolated Codex-native packages for Acceptance Gate, Feature Loop, and Design Loop while preserving Claude Code behavior and proving activation on Codex 0.139.0 and 0.144.1.

**Architecture:** Keep Claude sources authoritative and unchanged. Assemble three committed Codex packages under `plugins/` from shared engines plus runtime-specific overlays under `codex/`; replace Claude command and hook assumptions with Codex skills, a cache-resolving consumer runner, and an `apply_patch` adapter.

**Tech Stack:** Bash, Node.js CommonJS/ESM, JSON manifests, Markdown skills, fixture-driven shell and Node tests, Codex CLI.

## Global Constraints

- Follow `docs/specs/2026-07-13-codex-native-parity-design.md` exactly.
- Keep `.claude-plugin/**`, `feature-loop/**`, `design-loop/.claude-plugin/**`, `design-loop/commands/**`, `design-loop/skills/**`, and `feature-loop/workflows/**` behaviorally unchanged.
- Codex versions are independent: Acceptance Gate 1.11.3, Feature Loop Codex 1.11.3, Design Loop 0.2.1.
- Codex 0.139.0 is the compatibility floor; upgrade to 0.144.1 only after the 0.139.0 matrix passes.
- No Codex executor command may contain `${CLAUDE_PLUGIN_ROOT}`.
- Codex packages must never execute Claude Workflow, Claude Design, `DesignSync`, `/design-login`, or `/design-sync`.
- Hooks remain a guardrail; `recheck-evidence.js` and `pre-merge-check.sh` remain the merge boundary.
- Implement behavior test-first: write one failing test, observe the intended failure, implement the minimum, and rerun the focused suite.
- Use `apply_patch` for hand-authored file changes. Generated package outputs are produced only by `bash scripts/sync-plugin-packages.sh`.
- Commit each completed task separately. Do not push.

---

### Task 1: Establish isolated Codex overlay sources and deterministic package generation

**Files:**
- Modify: `tests/plugins/run-tests.sh`
- Modify: `scripts/sync-plugin-packages.sh`
- Modify: `.agents/plugins/marketplace.json`
- Move: `plugins/feature-loop-codex/` → `codex/feature-loop-codex/`
- Create: `codex/acceptance-gate/.codex-plugin/plugin.json`
- Create: `codex/design-loop/.codex-plugin/plugin.json`
- Generate: `plugins/acceptance-gate/**`
- Generate: `plugins/feature-loop-codex/**`
- Generate: `plugins/design-loop-codex/**`

**Interfaces:**
- Produces: three installable package roots consumed by every later task.
- Preserves: root Claude sources and their versions.

- [ ] **Step 1: Add failing packaging assertions.** Extend `tests/plugins/run-tests.sh` with checks named P22-P26 that assert:

```python
assert json.loads((root / "codex/acceptance-gate/.codex-plugin/plugin.json").read_text())["version"] == "1.11.3"
assert json.loads((root / "codex/feature-loop-codex/.codex-plugin/plugin.json").read_text())["version"] == "1.11.3"
assert json.loads((root / "codex/design-loop/.codex-plugin/plugin.json").read_text())["version"] == "0.2.1"
assert (root / "plugins/design-loop-codex/.codex-plugin/plugin.json").is_file()
market = json.loads((root / ".agents/plugins/marketplace.json").read_text())
paths = {p["name"]: p["source"]["path"] for p in market["plugins"]}
assert paths == {
    "acceptance-gate": "./plugins/acceptance-gate",
    "feature-loop-codex": "./plugins/feature-loop-codex",
    "design-loop": "./plugins/design-loop-codex",
}
for rel in ["plugins/acceptance-gate", "plugins/feature-loop-codex", "plugins/design-loop-codex"]:
    assert not (root / rel / ".claude-plugin").exists()
    assert not (root / rel / "commands").exists()
```

Also rewrite the existing package assumptions:

```python
root_claude = json.loads((root / ".claude-plugin/plugin.json").read_text())
overlay_codex = json.loads((root / "codex/acceptance-gate/.codex-plugin/plugin.json").read_text())
pkg_codex = json.loads((root / "plugins/acceptance-gate/.codex-plugin/plugin.json").read_text())
assert root_claude["version"] == "1.11.2"
assert overlay_codex["version"] == "1.11.3"
assert pkg_codex == overlay_codex
```

P03 no longer expects a packaged `.claude-plugin`; P06 validates the generated
`plugins/design-loop-codex` manifest against `codex/design-loop`; P08 scans
Claude source roots plus Codex overlay roots, not deleted command directories in
generated packages.

- [ ] **Step 2: Run the plugin suite and observe RED.** Run `bash tests/plugins/run-tests.sh`. Expected: P22-P26 fail because the overlay roots and generated Design Loop package do not exist and the marketplace still points to `./design-loop`.

- [ ] **Step 3: Move the existing Feature Loop Codex source.** Use a tracked move:

```bash
mkdir -p codex
git mv plugins/feature-loop-codex codex/feature-loop-codex
```

Update its manifest version to `1.11.3`. Do not change the skill behavior yet.

- [ ] **Step 4: Create exact Codex manifests.** Add `codex/acceptance-gate/.codex-plugin/plugin.json` with name `acceptance-gate`, version `1.11.3`, `skills: "./skills/"`, `hooks: "./hooks/hooks.json"`, and the current Acceptance Gate interface metadata. Add `codex/design-loop/.codex-plugin/plugin.json` with name `design-loop`, version `0.2.1`, `skills: "./skills/"`, and the current Design Loop interface metadata. Neither manifest includes `commands`.

- [ ] **Step 5: Replace the generator with three explicit builders.** Preserve `set -euo pipefail`, then implement these exact source/output relationships:

```bash
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

sync_overlay() {
  local src="$1" dst="$2"
  if [ -d "$src" ]; then
    rsync -a --exclude '.DS_Store' "$src/" "$dst/"
  fi
}

build_acceptance() {
  local out="$ROOT/plugins/acceptance-gate"
  rm -rf "$out"
  mkdir -p "$out"
  rsync -a --exclude '.DS_Store' "$ROOT/skills/" "$out/skills/"
  rsync -a --exclude '.DS_Store' --exclude 'sync-plugin-packages.sh' "$ROOT/scripts/" "$out/scripts/"
  rsync -a --exclude '.DS_Store' "$ROOT/lib/" "$out/lib/"
  rsync -a --exclude '.DS_Store' "$ROOT/vendor/" "$out/vendor/"
  rsync -a --exclude '.DS_Store' "$ROOT/hooks/" "$out/hooks/"
  for f in README.md QUICKSTART.md GUIDE.md; do rsync -a "$ROOT/$f" "$out/$f"; done
  sync_overlay "$ROOT/codex/acceptance-gate" "$out"
}

build_feature_loop() {
  local out="$ROOT/plugins/feature-loop-codex"
  rm -rf "$out"
  mkdir -p "$out"
  sync_overlay "$ROOT/codex/feature-loop-codex" "$out"
}

build_design_loop() {
  local out="$ROOT/plugins/design-loop-codex"
  rm -rf "$out"
  mkdir -p "$out"
  rsync -a --exclude '.DS_Store' "$ROOT/design-loop/scripts/" "$out/scripts/"
  rsync -a --exclude '.DS_Store' "$ROOT/design-loop/skills/" "$out/skills/"
  rsync -a --exclude '.DS_Store' "$ROOT/design-loop/README.md" "$out/README.md"
  sync_overlay "$ROOT/codex/design-loop" "$out"
}

build_acceptance
build_feature_loop
build_design_loop
echo "Synced Codex packages: acceptance-gate@1.11.3 feature-loop-codex@1.11.3 design-loop@0.2.1"
```

- [ ] **Step 6: Point the Codex marketplace to generated outputs.** Change only the Design Loop source path from `./design-loop` to `./plugins/design-loop-codex`.

- [ ] **Step 7: Generate and verify GREEN.** Run `bash scripts/sync-plugin-packages.sh` and `bash tests/plugins/run-tests.sh`. Expected: all plugin tests pass, including P22-P26.

- [ ] **Step 8: Prove Claude source isolation.** Run:

```bash
git diff --exit-code 0b2ac83 -- .claude-plugin feature-loop design-loop/.claude-plugin design-loop/commands design-loop/skills feature-loop/workflows hooks
```

Expected: no output and exit 0.

- [ ] **Step 9: Commit.** Stage the generator, marketplace, `codex/**`, and generated `plugins/**`; commit `build(codex): isolate generated plugin overlays`.

---

### Task 2: Add the safe consumer-local Codex plugin runner

**Files:**
- Create: `tests/codex/run-tests.sh`
- Create: `tests/codex/runner.test.mjs`
- Create: `codex/acceptance-gate/skills/acceptance-init/references/codex-plugin-runner.mjs`
- Generate: `plugins/acceptance-gate/skills/acceptance-init/references/codex-plugin-runner.mjs`

**Interfaces:**
- Produces: `node scripts/codex-plugin-runner.mjs <plugin> <action> [args...]`.
- Consumes: `$CODEX_HOME/plugins/cache/<marketplace>/<plugin>/<version>/`.

- [ ] **Step 1: Write runner tests.** In `runner.test.mjs`, create an isolated temporary `CODEX_HOME` with fake cache versions `1.9.0`, `1.11.2`, and `1.11.3`. Use `spawnSync(process.execPath, [RUNNER, ...])` and assert:

```js
assert.equal(run(['acceptance-gate', 'gate-card']).status, 0);
assert.match(run(['acceptance-gate', 'gate-card']).stdout, /1\.11\.3/);
assert.equal(run(['unknown', 'gate-card']).status, 2);
assert.equal(run(['acceptance-gate', '../../bin/sh']).status, 2);
assert.equal(run(['design-loop', 'provenance']).status, 2); // before its fake cache is added
```

Then add a fake Design Loop 0.2.1 cache and assert `design-loop provenance` resolves it. Fake scripts print their absolute path so the selected version is observable.

- [ ] **Step 2: Create the suite runner and observe RED.** `tests/codex/run-tests.sh` runs every `tests/codex/*.test.mjs`, accumulates failures, and exits 1 when any test fails. Run it; expected failure: runner reference missing.

- [ ] **Step 3: Implement the allowlisted runner.** Use this exact mapping and resolution contract:

```js
const ACTIONS = Object.freeze({
  'acceptance-gate': Object.freeze({
    'design-gate': 'scripts/design-gate.mjs',
    'design-scan': 'scripts/design-scan.js',
    'gate-card': 'scripts/gate-card.js',
    'evidence-page': 'scripts/evidence-page.js',
    'recheck-evidence': 'scripts/recheck-evidence.js',
    'eval-coverage-lint': 'scripts/eval-coverage-lint.js',
    'config-patch': 'scripts/config-patch.mjs',
  }),
  'design-loop': Object.freeze({
    'design-static-check': 'scripts/design-static-check.mjs',
    'design-fidelity-diff': 'scripts/design-fidelity-diff.mjs',
    'design-config-patch': 'scripts/design-config-patch.mjs',
    'provenance': 'scripts/provenance.mjs',
    'design-detect-surface': 'scripts/design-detect-surface.mjs',
  }),
});
```

Resolve `CODEX_HOME || ~/.codex`, scan marketplace directories, collect only directories containing the allowlisted script, sort version directory names with `localeCompare({ numeric: true, sensitivity: 'base' })`, and choose the last candidate. Execute with `spawnSync(process.execPath, [script, ...args], { stdio: 'inherit' })`. Return the child status. Missing or invalid input prints a one-line `BLOCKED:` message and exits 2.

- [ ] **Step 4: Verify RED→GREEN and regenerate.** Run `bash tests/codex/run-tests.sh`, then `bash scripts/sync-plugin-packages.sh`, then `cmp` the overlay and generated runner. Expected: tests pass and files match.

- [ ] **Step 5: Commit.** Commit `feat(codex): add allowlisted plugin cache runner`.

---

### Task 3: Add Codex-native init wiring and runner-backed design configuration

**Files:**
- Modify: `tests/codex/runner.test.mjs`
- Create: `tests/codex/design-config.test.mjs`
- Create: `codex/acceptance-gate/skills/acceptance-init/SKILL.md`
- Create: `codex/design-loop/scripts/design-config-patch.mjs`
- Generate: corresponding files under `plugins/acceptance-gate/` and `plugins/design-loop-codex/`

**Interfaces:**
- Acceptance init copies its bundled runner reference to `scripts/codex-plugin-runner.mjs`.
- Design config patch writes only runner-backed executor commands.

- [ ] **Step 1: Write failing design-config tests.** Copy a fixture config to a temp directory, run the generated Codex Design Loop patcher with `--config <temp> --surface-globs "apps/web/**,src/components/**" --write`, then assert:

```js
assert.match(text, /node scripts\/codex-plugin-runner\.mjs acceptance-gate design-gate/);
assert.match(text, /node scripts\/codex-plugin-runner\.mjs acceptance-gate design-scan/);
assert.match(text, /node scripts\/codex-plugin-runner\.mjs design-loop design-static-check/);
assert.match(text, /node scripts\/codex-plugin-runner\.mjs design-loop design-fidelity-diff/);
assert.doesNotMatch(text, /CLAUDE_PLUGIN_ROOT/);
assert.match(text, /surface_globs: \[apps\/web\/\*\*, src\/components\/\*\*\]/);
```

Run twice and assert the second run makes no duplicate `design:` blocks.

- [ ] **Step 2: Observe RED.** Run `bash tests/codex/run-tests.sh`. Expected: the Codex design patcher is missing.

- [ ] **Step 3: Implement the Codex patcher.** Copy the proven parsing and append-only logic from `design-loop/scripts/design-config-patch.mjs` into the overlay file, but replace `DESIGN_BLOCK` exactly with:

```js
const DESIGN_BLOCK = [
  '  design:',
  '    gate: "node scripts/codex-plugin-runner.mjs acceptance-gate design-gate"',
  '    ui_check: "node scripts/codex-plugin-runner.mjs acceptance-gate design-scan"',
  '    static: "node scripts/codex-plugin-runner.mjs design-loop design-static-check"',
  '    fidelity: "node scripts/codex-plugin-runner.mjs design-loop design-fidelity-diff"',
];
```

Its success output says runner-backed paths were written. It never prints or writes `${CLAUDE_PLUGIN_ROOT}`.

- [ ] **Step 4: Author the `acceptance-init` skill.** Adapt `commands/acceptance-init.md` into a Codex skill with frontmatter name `acceptance-init`. Keep one-question-at-a-time intake and the existing config schema, but use runner-backed design commands. Before writing config, copy the bundled reference runner with `apply_patch` semantics into `scripts/codex-plugin-runner.mjs`; if that file exists and differs, show the diff and ask before replacement. Preserve the existing CI three-file copy recommendation.

- [ ] **Step 5: Add packaging assertions.** Assert the generated init skill contains `codex-plugin-runner.mjs`, `recheck: strict`, `require_human_commit: true`, and no `${CLAUDE_PLUGIN_ROOT}`.

- [ ] **Step 6: Verify focused suites.** Run `bash scripts/sync-plugin-packages.sh`, `bash tests/codex/run-tests.sh`, and `bash tests/plugins/run-tests.sh`. Expected: all pass.

- [ ] **Step 7: Commit.** Commit `feat(codex): wire runner-backed acceptance init`.

---

### Task 4: Enforce gate writes from native Codex `apply_patch` payloads

**Files:**
- Create: `tests/codex/hook.test.mjs`
- Create: `codex/acceptance-gate/hooks/hooks.json`
- Create: `codex/acceptance-gate/hooks/acceptance-evidence-gate-codex.js`
- Generate: `plugins/acceptance-gate/hooks/**`

**Interfaces:**
- Consumes: Codex `PreToolUse` JSON with `tool_name: "apply_patch"`, `tool_input.command`, and `cwd`.
- Delegates final policy evaluation to the unchanged Claude-compatible `acceptance-evidence-gate.js` by synthesizing a `Write` payload.

- [ ] **Step 1: Write failing native hook tests.** Use temporary copies of `tests/hooks/fixtures/repo`. Send exact patch payloads and assert:

```js
const payload = (cwd, command) => JSON.stringify({
  cwd,
  hook_event_name: 'PreToolUse',
  tool_name: 'apply_patch',
  tool_input: { command },
});
```

Cases: non-target update exits 0; valid draft Add File exits 0; new implemented contract without `approved_by` exits 2; PASS report without evidence exits 2; valid approved contract update exits 0; multi-file patch with one non-target and one valid gate file exits 0; `../` traversal exits 2; malformed hunk touching a gate file exits 2; `enforcement: warn` and `ACCEPTANCE_GATE_BYPASS=1` exit 0.

- [ ] **Step 2: Observe RED.** Run `bash tests/codex/run-tests.sh`. Expected: native hook file missing.

- [ ] **Step 3: Create the Codex hooks manifest.** Use:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write|^apply_patch$",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${PLUGIN_ROOT}/hooks/acceptance-evidence-gate-codex.js\"",
            "timeout": 30,
            "statusMessage": "Checking acceptance gate files"
          }
        ]
      }
    ]
  }
}
```

- [ ] **Step 4: Implement the patch adapter.** Parse `*** Add File`, `*** Update File`, `*** Delete File`, `*** Move to`, hunk headers, and `+/-/ ` lines. Resolve paths with `path.resolve(cwd, rel)` and require the result to stay under `cwd`. For each `*_acceptance/<slug>/{contract,evidence-report}.md` target, reconstruct final bytes. Feed:

```js
JSON.stringify({
  tool_name: 'Write',
  tool_input: { file_path: absolutePath, content: reconstructedContent },
})
```

to `node <same-dir>/acceptance-evidence-gate.js` with `spawnSync`, inherited environment, and captured stderr. Any child exit 2 causes the adapter to print the reason and exit 2. Delete of a strict gate file exits 2; warn/off/bypass reuse the legacy hook policy. If a visible gate target cannot be reconstructed, exit 2 with `BLOCKED by acceptance-evidence-gate (Codex patch adapter)`.

- [ ] **Step 5: Verify both hook protocols.** Run `bash tests/codex/run-tests.sh` and `bash tests/hooks/run-tests.sh`. Expected: new native tests pass and legacy 51/51 remains unchanged.

- [ ] **Step 6: Regenerate and assert manifest isolation.** Run sync. Assert generated Codex hooks use `${PLUGIN_ROOT}` and root `hooks/hooks.json` still uses `${CLAUDE_PLUGIN_ROOT}`.

- [ ] **Step 7: Commit.** Commit `feat(codex): enforce acceptance writes through apply patch`.

---

### Task 5: Replace Claude command assumptions with Codex-native Acceptance skills

**Files:**
- Modify: `tests/plugins/run-tests.sh`
- Create: `codex/acceptance-gate/skills/acceptance-card/SKILL.md`
- Create: `codex/acceptance-gate/skills/acceptance-status/SKILL.md`
- Create: `codex/acceptance-gate/skills/acceptance/SKILL.md`
- Generate: `plugins/acceptance-gate/skills/**`

**Interfaces:**
- Produces: explicit `$acceptance-gate:acceptance-init`, `$acceptance-gate:acceptance-card`, and `$acceptance-gate:acceptance-status` invocation surfaces.
- The overlaid `acceptance` skill remains compatible with existing contract/evidence formats.

- [ ] **Step 1: Add failing skill assertions.** Assert the generated package contains the three native helper skills, that the Acceptance skill routes missing config to `acceptance-init`, and that no Codex skill instructs the user to depend exclusively on `/acceptance-init`, `/acceptance-card`, or `/acceptance-status`.

- [ ] **Step 2: Observe RED.** Run `bash tests/plugins/run-tests.sh` and confirm the helper skill checks fail.

- [ ] **Step 3: Author `acceptance-card`.** Adapt the existing command document with frontmatter name `acceptance-card`. Resolve scripts through `node scripts/codex-plugin-runner.mjs acceptance-gate gate-card` when the consumer runner exists; otherwise locate the newest installed Acceptance package and run its script directly. Generate `card-plain.json`, `card.html`, and Gate-2 `evidence-page.html`. Use the available Codex browser or local open mechanism; never claim the card decides a gate.

- [ ] **Step 4: Author `acceptance-status`.** Adapt the current status table and actionable routing exactly. Missing `_acceptance/` directs the user to the `acceptance-init` skill.

- [ ] **Step 5: Overlay the main Acceptance skill.** Start from `skills/acceptance/SKILL.md`; make only runtime-surface changes:

```markdown
Missing config → STOP: invoke the `acceptance-init` skill (Claude legacy alias: `/acceptance-init`).
Decision card → invoke the `acceptance-card` skill or run the runner-backed `gate-card` action.
In Codex, write-time enforcement uses the apply_patch adapter when the hook is trusted; always run committed evidence recheck before completion.
```

Keep all Phase 0-3 verdict, evidence, staleness, signoff, and degradation rules unchanged.

- [ ] **Step 6: Generate and verify.** Run sync, plugin tests, hook tests, and scripts tests. Expected: helper skills present; legacy deterministic suites unchanged.

- [ ] **Step 7: Commit.** Commit `feat(codex): expose native acceptance helper skills`.

---

### Task 6: Bring Feature Loop Codex to 1.11.2 behavioral parity

**Files:**
- Modify: `tests/plugins/run-tests.sh`
- Modify: `codex/feature-loop-codex/.codex-plugin/plugin.json`
- Modify: `codex/feature-loop-codex/README.md`
- Modify: `codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md`
- Generate: `plugins/feature-loop-codex/**`

**Interfaces:**
- Consumes: Acceptance helper skills, Design Loop skills, Codex goals, and Codex subagents.
- Produces: native S0-S5 orchestration without Workflow scripts.

- [ ] **Step 1: Replace the old parity test with failing 1.11.3 assertions.** P04/P05 must require version 1.11.3 and these markers:

```python
for needle in [
    "decisions.jsonl", "type\":\"seal", "supersedes", "D0", "D1", "D2",
    "CT1", "CT2", "design.surface_globs", "/goal", "verified", "signed-off",
    "/model", "feature_loop.models", "role-specific model routing",
]:
    assert needle in text, needle
assert "Workflow(" not in text
assert "feature-loop/workflows" not in text
assert ".claude/plugins/cache" not in text
assert "/goal" in text and "never" in text.lower() and "signed-off" in text
```

- [ ] **Step 2: Observe RED.** Run plugin tests. Expected: missing ledger, lane table, goal/model guidance, and version parity markers.

- [ ] **Step 3: Add the decision ledger section.** Copy the Claude 1.11.2 schema and rules, but replace shell-append examples with the instruction to use `apply_patch` append-only edits. Preserve fields `id`, `type`, `stage`, `at`, `decision`, `impact`, optional `serves`, `revisit`, and `supersedes`; preserve Gate-1 `seal` and provisional-after-seal semantics.

- [ ] **Step 4: Add the exact lane table and guards.** Add CT1/CT2 derivation, D0/D1/D2 vocabulary, the Gate-1 lane question, the S4 `design.surface_globs` mismatch guard, and the CT2 resume guard from Claude 1.11.2. Replace command references with `design-init`, `design-mockup`, and `design-evidence` skills.

- [ ] **Step 5: Add native goal/model guidance at Gate 1.** Use this exact policy paragraph:

```markdown
If the user wants the machine-owned segment S2→S4 to continue unattended, suggest the native Codex `/goal` command with an objective that ends at `contract.status: verified`. Never create or suggest a goal that reaches `signed-off`; Gate 2 remains human-owned. If the current model is more expensive than the machine segment needs, suggest that the user open the native `/model` picker before setting the goal. Do not change the model or create the goal without the user's explicit action. When `_acceptance/config.yaml` contains `feature_loop.models`, warn that the current Codex spawn interface does not expose role-specific model routing; inherit the session model and record that degradation instead of claiming the roles were pinned.
```

- [ ] **Step 6: Preserve native verification boundaries.** S3 may edit product code; S4 graders may not. Fresh subagents are preferred when available. Sequential fallback must say `separated sequential grader`, never `fresh agent`. Keep runs, baseline, variance, review/refutation, provenance, report, and signoff logic from the existing Codex skill.

- [ ] **Step 7: Update README and generate.** Document version 1.11.3, parity base 1.11.2, native goals, lane decisions, and unsupported role-model routing. Run sync.

- [ ] **Step 8: Verify.** Run plugin, workflows, scripts, and Codex suites. Expected: all pass; Workflow suite remains 82/82 because Claude scripts were untouched.

- [ ] **Step 9: Commit.** Commit `feat(codex): align feature loop with 1.11.2 behavior`.

---

### Task 7: Ship Design Loop as a native Codex package

**Files:**
- Modify: `tests/plugins/run-tests.sh`
- Create: `codex/design-loop/skills/design-init/SKILL.md`
- Create: `codex/design-loop/skills/design-mockup/SKILL.md`
- Create: `codex/design-loop/skills/design-evidence/SKILL.md`
- Create: `codex/design-loop/skills/design-push-status/SKILL.md`
- Create: `codex/design-loop/skills/design-subtrack/SKILL.md`
- Generate: `plugins/design-loop-codex/**`

**Interfaces:**
- Produces: five Design Loop skills; no Claude command documents in the Codex package.
- Consumes: runner-backed Design Loop actions and Codex visual tools.

- [ ] **Step 1: Add failing Design Loop package assertions.** Require all five skill files, version 0.2.1, no `commands/`, no `.claude-plugin/`, no instruction to invoke Claude Design, and explicit strings `portable reference`, `provenance.json`, `BLOCKED`, and `No blind VLM judge`.

- [ ] **Step 2: Observe RED.** Run plugin tests. Expected: helper skills absent.

- [ ] **Step 3: Author `design-init`.** Adapt the existing command into a skill. It verifies `_acceptance/config.yaml` and `scripts/codex-plugin-runner.mjs`, dry-runs `node scripts/codex-plugin-runner.mjs design-loop design-config-patch`, asks once, then applies with `--write`. It proposes 1-3 UI source globs and never writes `${CLAUDE_PLUGIN_ROOT}`.

- [ ] **Step 4: Author `design-mockup`.** Require contract surfaces and a state matrix; choose a design repo, checked-in HTML/CSS, generated reference, or screenshot source; capture pinned states; write provenance through `node scripts/codex-plugin-runner.mjs design-loop provenance`; explicitly state that Claude Design and `DesignSync` are unavailable.

- [ ] **Step 5: Author `design-evidence`.** Gather static/gate/fidelity evidence, build or present `_acceptance/<slug>/evidence/design/panel.html`, and ask the human the Gate-2 product question. Pixel diff remains advisory and no blind VLM judge replaces human perception.

- [ ] **Step 6: Author `design-push-status`.** It never pushes. It verifies the design repo SHA, records `skipped` or `handled outside Codex`, and explains that the app PR does not depend on Claude cloud sync.

- [ ] **Step 7: Overlay `design-subtrack`.** Start from the 0.2.0 shared skill and replace legacy `/design-*` entry points with the four native skill names. Preserve CT1/CT2, D0/D1/D2, static P0 floor, fidelity advisory, provenance BLOCKED rule, and Gate-2 human panel.

- [ ] **Step 8: Generate and verify.** Run sync, plugin tests, Design Loop fixtures, and Codex tests. Expected: all pass and the generated package contains only native Codex surfaces.

- [ ] **Step 9: Commit.** Commit `feat(codex): package portable design loop skills`.

---

### Task 8: Document installation, run the complete regression matrix, and prove Claude isolation

**Files:**
- Modify: `README.md`
- Modify: `GUIDE.md`
- Modify: `tests/plugins/run-tests.sh`
- Generate: all `plugins/**` outputs

**Interfaces:**
- Produces: user-facing install/upgrade instructions and a source-complete candidate.

- [ ] **Step 1: Add a failing documentation test.** Require README/GUIDE to contain the Codex marketplace command, all three plugin selectors, `fresh task`, hook trust, 0.139.0 floor, and no claim that Claude Design works in Codex.

- [ ] **Step 2: Add exact Codex install instructions.** Document:

```bash
codex plugin marketplace add /absolute/path/to/acceptance-gate-kit
codex plugin add acceptance-gate@acceptance-gate-kit
codex plugin add feature-loop-codex@acceptance-gate-kit
codex plugin add design-loop@acceptance-gate-kit
codex plugin list
```

Tell users to review/trust the Acceptance hook and start a fresh task after install or upgrade. Document that Claude install instructions remain unchanged.

- [ ] **Step 3: Regenerate from scratch.** Remove only generated package roots, run `bash scripts/sync-plugin-packages.sh`, then run `git diff --check`.

- [ ] **Step 4: Run every source suite.** Run:

```bash
for t in hooks scripts plugins design-loop workflows codex; do
  bash "tests/$t/run-tests.sh"
done
```

Expected: 0 failures in every suite.

- [ ] **Step 5: Prove Claude isolation.** Run the Task 1 isolation diff again. Additionally compare Claude manifest versions with `jq`: Acceptance and Feature Loop remain 1.11.2; Design Loop remains 0.2.0.

- [ ] **Step 6: Review generated-only drift.** `git status --short` must show only intended Codex sources, generated packages, tests, README/GUIDE, generator, and marketplace changes.

- [ ] **Step 7: Commit.** Commit `docs(codex): document native plugin installation`.

---

### Task 9: Verify live runtime on Codex 0.139.0, upgrade to 0.144.1, and verify again

**Files:**
- Runtime state: `~/.codex/config.toml`
- Runtime cache: `~/.codex/plugins/cache/acceptance-gate-kit/**`
- No repository file changes expected.

**Interfaces:**
- Consumes: final generated packages and the configured local marketplace.
- Produces: concrete registry, cache, hook, runner, and prompt-injection evidence.

- [ ] **Step 1: Record the 0.139.0 preflight.** Run `codex --version`, `codex features list`, and `codex doctor --summary`. Require plugins, hooks, goals, and multi-agent to be enabled/stable; note unrelated doctor warnings separately.

- [ ] **Step 2: Install or refresh all three plugins.** Run:

```bash
codex plugin add acceptance-gate@acceptance-gate-kit --json
codex plugin add feature-loop-codex@acceptance-gate-kit --json
codex plugin add design-loop@acceptance-gate-kit --json
```

Then run `codex plugin list` and require enabled versions 1.11.3, 1.11.3, and 0.2.1.

- [ ] **Step 3: Verify cache and hook directly on 0.139.0.** Read all three cached manifests. Run the native hook adapter against one valid and one invalid `apply_patch` fixture; require exit 0 and exit 2. Copy the runner fixture to a temp consumer and run a harmless allowlisted action.

- [ ] **Step 4: Attempt prompt injection proof with a hard timeout.** Run `codex debug prompt-input 'compatibility probe'` under a 25-second alarm. If it returns, assert the three skill families are present and Claude `feature-loop` is absent. If it times out, record that exact limitation and use registry + cache + a fresh task skill list as the activation proof.

- [ ] **Step 5: Upgrade Codex.** Run `codex update`. Then require `codex --version` to report 0.144.1 or a newer version explicitly offered by the updater. Do not downgrade if the updater moves beyond 0.144.1.

- [ ] **Step 6: Repeat the full runtime matrix.** Repeat Steps 1-4 on the updated CLI. Re-run all repository suites because the CLI update may change plugin or hook behavior even when source tests are unchanged.

- [ ] **Step 7: Open a fresh Codex task for final injection proof.** Confirm Acceptance Gate, Feature Loop Codex, and Design Loop skills appear; confirm Claude `feature-loop` does not. A full desktop restart is required only if the updated plugin list or hook trust state does not refresh after a new task.

- [ ] **Step 8: Final source verification.** Run `git status --short --branch`, `git log --oneline --decorate -10`, and the complete suite command from Task 8. Do not claim completion without the fresh outputs.

---

## Plan Self-Review

- **Spec coverage:** Architecture and versions map to Task 1; runner to Tasks 2-3; native hook to Task 4; Acceptance helper skills to Task 5; Feature Loop parity to Task 6; Design Loop portability to Task 7; regression/isolation to Task 8; dual-runtime activation to Task 9.
- **Placeholder scan:** No `TBD`, `TODO`, deferred implementation, or unspecified error-handling steps remain. Each behavior-changing task starts with a named failing test and an expected failure.
- **Interface consistency:** Generated package paths and marketplace paths are consistent across Tasks 1-9. Runner plugin/action names match Design Config and skill instructions. Versions are Acceptance 1.11.3, Feature Loop Codex 1.11.3, Design Loop 0.2.1 everywhere.
- **Scope:** Claude engines and workflows are reused or left untouched; no task adds Claude Design emulation, remote publishing, or PR/push work.
