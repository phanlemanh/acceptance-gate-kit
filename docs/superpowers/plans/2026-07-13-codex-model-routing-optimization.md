# Codex-Native Model Routing Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an installable, auditable Codex-native custom-agent policy that routes Feature Loop and Acceptance Gate roles to suitable models and reasoning effort without changing Claude Code behavior.

**Architecture:** The Codex overlay ships six project-agent templates and a deterministic installer. A new helper skill installs them into consumer `.codex/agents/`, the consumer runner exposes only the installer action, and Feature Loop/Acceptance skills select named agents when the runtime supports it while recording explicit fallbacks otherwise.

**Tech Stack:** Node.js ESM, TOML agent files, Bash fixture suites, Codex plugin overlays, Codex CLI 0.144.1.

## Global Constraints

- Claude Acceptance Gate and Feature Loop stay at version `1.11.2`; do not edit their manifests, Workflow scripts, or `feature_loop.models` behavior.
- Codex Acceptance Gate and Feature Loop Codex advance from `1.11.3` to `1.11.4`; Design Loop stays at `0.2.1`.
- Use only model ids present in the target catalog: `gpt-5.6-sol` and `gpt-5.6-terra`.
- Do not edit global `~/.codex/config.toml` and do not invoke nested `codex exec` sessions for role routing.
- Machine test/script, provenance, run-log, and report-copy operations stay tool-run without separate model workers.
- Never overwrite a user-owned or locally modified `.codex/agents/*.toml` file.
- Report configured/requested model data separately from runtime-effective model data.
- Install the final policy into `/Users/manhphan/dev/worktrees/zalo-desktop-crm-memory` while preserving its Claude `finder: opus` and `executor: opus` settings.

---

### Task 1: Deterministic model-policy installer and native agent templates

**Files:**
- Create: `tests/codex/model-policy.test.mjs`
- Create: `codex/feature-loop-codex/scripts/install-model-policy.mjs`
- Create: `codex/feature-loop-codex/agent-templates/feature-loop-explorer.toml`
- Create: `codex/feature-loop-codex/agent-templates/feature-loop-executor.toml`
- Create: `codex/feature-loop-codex/agent-templates/acceptance-ui-verifier.toml`
- Create: `codex/feature-loop-codex/agent-templates/acceptance-judge.toml`
- Create: `codex/feature-loop-codex/agent-templates/acceptance-reviewer.toml`
- Create: `codex/feature-loop-codex/agent-templates/acceptance-refuter.toml`

**Interfaces:**
- Produces: `installModelPolicy({ root, templateDir, write }) -> { exitCode, files }`.
- Produces: `renderManaged(body) -> string` and `inspectManaged(text) -> { managed, clean, version, body }` for tests and upgrades.
- Produces CLI: `node install-model-policy.mjs --root <repo> [--write]` with exit `0` current/success, `1` drift/conflict, `2` invalid invocation/template/path.
- Produces six native agent TOMLs consumed by Tasks 3, 4, and 6.

- [ ] **Step 1: Write the failing installer test**

Create `tests/codex/model-policy.test.mjs` with fixtures that assert empty-check,
initial write, idempotence, safe managed upgrade, user-file preservation,
symlink rejection, missing-template failure, and exact role policy:

```js
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const MODULE = path.join(ROOT, 'codex/feature-loop-codex/scripts/install-model-policy.mjs');
const TEMPLATES = path.join(ROOT, 'codex/feature-loop-codex/agent-templates');
const EXPECTED = new Map([
  ['feature-loop-explorer.toml', ['gpt-5.6-terra', 'medium', 'read-only']],
  ['feature-loop-executor.toml', ['gpt-5.6-sol', 'high', 'workspace-write']],
  ['acceptance-ui-verifier.toml', ['gpt-5.6-sol', 'medium', 'workspace-write']],
  ['acceptance-judge.toml', ['gpt-5.6-sol', 'medium', 'read-only']],
  ['acceptance-reviewer.toml', ['gpt-5.6-sol', 'high', 'read-only']],
  ['acceptance-refuter.toml', ['gpt-5.6-terra', 'medium', 'read-only']],
]);

const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'agk-model-policy-'));
try {
  const mod = await import(`file://${MODULE}`);
  const empty = mod.installModelPolicy({ root: temp, templateDir: TEMPLATES, write: false });
  assert.equal(empty.exitCode, 1);
  assert.equal(empty.files.filter((item) => item.state === 'missing').length, 6);

  const installed = mod.installModelPolicy({ root: temp, templateDir: TEMPLATES, write: true });
  assert.equal(installed.exitCode, 0);
  assert.equal(installed.files.filter((item) => item.state === 'installed').length, 6);

  const current = mod.installModelPolicy({ root: temp, templateDir: TEMPLATES, write: false });
  assert.equal(current.exitCode, 0);
  assert.ok(current.files.every((item) => item.state === 'current'));

  for (const [file, [model, effort, sandbox]] of EXPECTED) {
    const text = fs.readFileSync(path.join(temp, '.codex/agents', file), 'utf8');
    assert.match(text, /^# managed-by: feature-loop-codex$/m);
    assert.match(text, /^# template-version: 1\.11\.4$/m);
    assert.match(text, /^# source-hash: sha256:[a-f0-9]{64}$/m);
    assert.match(text, new RegExp(`model = "${model.replaceAll('.', '\\.')}"`));
    assert.match(text, new RegExp(`model_reasoning_effort = "${effort}"`));
    assert.match(text, new RegExp(`sandbox_mode = "${sandbox}"`));
  }

  const explorer = path.join(temp, '.codex/agents/feature-loop-explorer.toml');
  fs.writeFileSync(explorer, mod.renderManaged('name = "old-explorer"\n'));
  const upgraded = mod.installModelPolicy({ root: temp, templateDir: TEMPLATES, write: true });
  assert.equal(upgraded.exitCode, 0);
  assert.equal(upgraded.files.find((item) => item.file === 'feature-loop-explorer.toml').state, 'upgraded');

  const judge = path.join(temp, '.codex/agents/acceptance-judge.toml');
  fs.appendFileSync(judge, '# local-edit\n');
  const before = fs.readFileSync(judge, 'utf8');
  const conflict = mod.installModelPolicy({ root: temp, templateDir: TEMPLATES, write: true });
  assert.equal(conflict.exitCode, 1);
  assert.equal(conflict.files.find((item) => item.file === 'acceptance-judge.toml').state, 'conflict');
  assert.equal(fs.readFileSync(judge, 'utf8'), before);

  const symlinkRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'agk-model-policy-link-'));
  fs.symlinkSync(temp, path.join(symlinkRoot, '.codex'));
  assert.throws(
    () => mod.installModelPolicy({ root: symlinkRoot, templateDir: TEMPLATES, write: true }),
    /symlink/i,
  );

  const incompleteTemplates = fs.mkdtempSync(path.join(os.tmpdir(), 'agk-model-policy-templates-'));
  assert.throws(
    () => mod.installModelPolicy({ root: temp, templateDir: incompleteTemplates, write: false }),
    /missing template/i,
  );
  fs.rmSync(incompleteTemplates, { recursive: true, force: true });
  fs.rmSync(symlinkRoot, { recursive: true, force: true });
  console.log('PASS: Codex model policy installs, upgrades, and preserves user agents');
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
```

- [ ] **Step 2: Run the test to verify RED**

Run: `node tests/codex/model-policy.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for
`codex/feature-loop-codex/scripts/install-model-policy.mjs`.

- [ ] **Step 3: Add the six complete native agent bodies**

Use these exact TOML bodies; the installer adds the managed header and hash:

```toml
# feature-loop-explorer.toml
name = "feature-loop-explorer"
description = "Read-heavy Feature Loop discovery and bounded codebase scans."
model = "gpt-5.6-terra"
model_reasoning_effort = "medium"
sandbox_mode = "read-only"
developer_instructions = """
Inspect only the files and subsystems named by the parent. Do not edit files, run destructive commands, or broaden scope. Return a concise evidence-backed map with absolute or repo-relative file references, risks, and unanswered questions.
"""
```

```toml
# feature-loop-executor.toml
name = "feature-loop-executor"
description = "Independent Feature Loop implementation worker with explicit file ownership."
model = "gpt-5.6-sol"
model_reasoning_effort = "high"
sandbox_mode = "workspace-write"
developer_instructions = """
Implement only the assigned plan task and owned files. Preserve other worktree changes, run the assigned verification command, and return changed files plus exact test evidence. Never self-grade Acceptance Gate S4 and never sign human-owned gate fields.
"""
```

```toml
# acceptance-ui-verifier.toml
name = "acceptance-ui-verifier"
description = "Acceptance Gate UI verifier that captures observed visual evidence without editing product code."
model = "gpt-5.6-sol"
model_reasoning_effort = "medium"
sandbox_mode = "workspace-write"
developer_instructions = """
Act only as an S4 UI grader. Do not edit product code. Run the approved UI steps, manage the dev server safely, save the required frames or HTML evidence, inspect every saved frame, and report observed behavior against the expected result. A contradictory frame is FAIL even when the command exits zero.
"""
```

```toml
# acceptance-judge.toml
name = "acceptance-judge"
description = "Blind scoped Acceptance Gate judgment lens."
model = "gpt-5.6-sol"
model_reasoning_effort = "medium"
sandbox_mode = "read-only"
developer_instructions = """
Judge only the resolved question and approved input files. Do not inspect the implementation diff or the doer's reasoning. Return PASS, FAIL, or UNCERTAIN with a short rationale tied to the supplied evidence. Do not convert uncertainty into PASS.
"""
```

```toml
# acceptance-reviewer.toml
name = "acceptance-reviewer"
description = "High-recall Acceptance Gate reviewer for invariants, bugs, and silent failures."
model = "gpt-5.6-sol"
model_reasoning_effort = "high"
sandbox_mode = "read-only"
developer_instructions = """
Review the assigned diff and repository guidance without editing files. Find concrete convention, invariant, bug, and silent-failure risks. Return only actionable findings with severity, file:line, evidence, and a concise failure scenario; return an explicit no-findings result when appropriate.
"""
```

```toml
# acceptance-refuter.toml
name = "acceptance-refuter"
description = "Scoped adversarial refuter for one concrete Acceptance Gate review finding."
model = "gpt-5.6-terra"
model_reasoning_effort = "medium"
sandbox_mode = "read-only"
developer_instructions = """
Test exactly one supplied finding against the cited file and repository evidence. Do not edit files or search for unrelated issues. Return confirmed or dismissed with the decisive evidence; return unverified only when required evidence is unavailable.
"""
```

- [ ] **Step 4: Implement the minimal installer**

Implement `codex/feature-loop-codex/scripts/install-model-policy.mjs` with these
constants and exported functions:

```js
#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const POLICY_VERSION = '1.11.4';
export const TEMPLATE_FILES = Object.freeze([
  'feature-loop-explorer.toml',
  'feature-loop-executor.toml',
  'acceptance-ui-verifier.toml',
  'acceptance-judge.toml',
  'acceptance-reviewer.toml',
  'acceptance-refuter.toml',
]);

const MANAGED_RE = /^# managed-by: feature-loop-codex\n# template-version: ([^\n]+)\n# source-hash: sha256:([a-f0-9]{64})\n/;
const sha256 = (text) => crypto.createHash('sha256').update(text).digest('hex');

export function renderManaged(body) {
  const normalized = body.endsWith('\n') ? body : `${body}\n`;
  return `# managed-by: feature-loop-codex\n# template-version: ${POLICY_VERSION}\n# source-hash: sha256:${sha256(normalized)}\n${normalized}`;
}

export function inspectManaged(text) {
  const match = text.match(MANAGED_RE);
  if (!match) return { managed: false, clean: false, version: null, body: text };
  const body = text.slice(match[0].length);
  return { managed: true, clean: sha256(body) === match[2], version: match[1], body };
}

function rejectSymlink(target) {
  if (fs.existsSync(target) && fs.lstatSync(target).isSymbolicLink()) {
    throw new Error(`refusing symlink path: ${target}`);
  }
}

function writeAtomic(target, content) {
  const temp = `${target}.tmp-${process.pid}`;
  fs.writeFileSync(temp, content, { encoding: 'utf8', flag: 'wx' });
  fs.renameSync(temp, target);
}
```

Complete `installModelPolicy` so it validates the root and all six source
templates, rejects symlinked `.codex` or `.codex/agents`, classifies every
target as `current`, `missing`, `upgrade`, or `conflict`, and in write mode
changes only `missing` and clean managed `upgrade` files. Return `exitCode: 1`
when drift remains or a conflict exists. Add a direct-execution guard that
parses only `--root` and `--write`, prints one state line per file, catches
errors, and exits `2` on invalid input.

- [ ] **Step 5: Run the focused Codex suite to verify GREEN**

Run: `node tests/codex/model-policy.test.mjs && bash tests/codex/run-tests.sh`

Expected: the model-policy test prints its PASS line and all Codex suites pass.

- [ ] **Step 6: Commit the installer slice**

```bash
git add tests/codex/model-policy.test.mjs codex/feature-loop-codex/scripts codex/feature-loop-codex/agent-templates
git commit -m "feat(codex): add managed role model policy"
```

### Task 2: Allowlisted consumer-runner entrypoint

**Files:**
- Modify: `tests/codex/runner.test.mjs`
- Modify: `codex/acceptance-gate/skills/acceptance-init/references/codex-plugin-runner.mjs`

**Interfaces:**
- Consumes: `codex/feature-loop-codex/scripts/install-model-policy.mjs` from Task 1.
- Produces: `node scripts/codex-plugin-runner.mjs feature-loop-codex install-model-policy <args>`.

- [ ] **Step 1: Extend the runner test first**

Add a fake Feature Loop installer and assertions before the final PASS line:

```js
  const missingFeatureLoop = run(['feature-loop-codex', 'install-model-policy']);
  assert.equal(missingFeatureLoop.status, 2);
  assert.match(missingFeatureLoop.stderr, /install.*feature-loop-codex/i);

  addFake(
    'acceptance-gate-kit',
    'feature-loop-codex',
    '1.11.4',
    'scripts/install-model-policy.mjs',
    'feature-loop-codex-1.11.4',
  );
  const modelPolicy = run(['feature-loop-codex', 'install-model-policy']);
  assert.equal(modelPolicy.status, 0, modelPolicy.stderr);
  assert.match(modelPolicy.stdout, /feature-loop-codex-1\.11\.4/);
```

Also change the newest Acceptance Gate fake from `1.11.3` to `1.11.4` and its
assertion to `/acceptance-1\.11\.4/`.

- [ ] **Step 2: Run the test to verify RED**

Run: `node tests/codex/runner.test.mjs`

Expected: FAIL because `feature-loop-codex/install-model-policy` is unsupported.

- [ ] **Step 3: Add the single allowlisted action**

Insert this frozen map beside the existing plugin maps:

```js
  'feature-loop-codex': Object.freeze({
    'install-model-policy': 'scripts/install-model-policy.mjs',
  }),
```

- [ ] **Step 4: Run the runner and Codex suites to verify GREEN**

Run: `node tests/codex/runner.test.mjs && bash tests/codex/run-tests.sh`

Expected: runner PASS and all Codex suites pass.

- [ ] **Step 5: Commit the runner slice**

```bash
git add tests/codex/runner.test.mjs codex/acceptance-gate/skills/acceptance-init/references/codex-plugin-runner.mjs
git commit -m "feat(codex): allowlist model policy installer"
```

### Task 3: Skill contracts for initialization, named dispatch, and routing evidence

**Files:**
- Create: `tests/codex/skill-routing.test.mjs`
- Create: `codex/feature-loop-codex/skills/feature-loop-model-init/SKILL.md`
- Modify: `codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md`
- Modify: `codex/acceptance-gate/skills/acceptance/SKILL.md`

**Interfaces:**
- Consumes: the six agent names and installer command from Tasks 1-2.
- Produces: routing modes `custom-agent`, `session-inherited`, and `sequential-fallback`.
- Produces: evidence section `## Codex routing` with requested policy fields and invocation counts.

- [ ] **Step 1: Add a failing source-level skill contract test**

Create `tests/codex/skill-routing.test.mjs`:

```js
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const feature = fs.readFileSync(
  path.join(ROOT, 'codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md'),
  'utf8',
);
const initPath = path.join(
  ROOT,
  'codex/feature-loop-codex/skills/feature-loop-model-init/SKILL.md',
);
assert.ok(fs.existsSync(initPath), 'feature-loop-model-init skill missing');
const init = fs.readFileSync(initPath, 'utf8');
const acceptance = fs.readFileSync(
  path.join(ROOT, 'codex/acceptance-gate/skills/acceptance/SKILL.md'),
  'utf8',
);

for (const needle of [
  'version: 1.11.4',
  'feature-loop-model-init',
  '.codex/agents',
  'feature-loop-explorer',
  'feature-loop-executor',
  'acceptance-ui-verifier',
  'acceptance-judge',
  'acceptance-reviewer',
  'acceptance-refuter',
  'custom-agent',
  'session-inherited',
  'sequential-fallback',
  '## Codex routing',
  'requested_model',
  'requested_reasoning_effort',
]) assert.ok(feature.includes(needle), needle);

for (const needle of [
  'name: feature-loop-model-init',
  'install-model-policy',
  '--write',
  '.codex/agents',
  'fresh Codex task',
  'conflict',
]) assert.ok(init.includes(needle), needle);

for (const needle of [
  'acceptance-ui-verifier',
  'acceptance-judge',
  'acceptance-reviewer',
  'acceptance-refuter',
  '## Codex routing',
]) assert.ok(acceptance.includes(needle), needle);

console.log('PASS: Codex skills declare native role routing and honest fallback');
```

- [ ] **Step 2: Run plugin tests to verify RED**

Run: `node tests/codex/skill-routing.test.mjs`

Expected: FAIL because `feature-loop-model-init/SKILL.md` does not exist.

- [ ] **Step 3: Create the helper skill**

Create `feature-loop-model-init/SKILL.md` with this contract:

```markdown
---
name: feature-loop-model-init
description: Use when a consumer repository should install, check, or upgrade the Codex-native role model policy for Feature Loop and Acceptance Gate without changing Claude Code routing.
version: 1.11.4
---

# Feature Loop Model Init

Run the managed policy check from the repository root:

`node scripts/codex-plugin-runner.mjs feature-loop-codex install-model-policy --root .`

Show every `current`, `missing`, `upgrade`, or `conflict` result. On explicit
installation or upgrade approval, rerun with `--write`. Never overwrite a
`conflict`; preserve the user's `.codex/agents` file and report its path.

After a zero-exit write, run check mode again. Tell the user to open a fresh
Codex task because project custom agents are loaded at task start. Do not edit
`feature_loop.models`; it remains the Claude Code routing seam.
```

- [ ] **Step 4: Update Feature Loop Codex role dispatch**

Set the skill version to `1.11.4`. Add one `Codex Role Policy` section containing
the exact six-role table from the design. Require preflight detection of the
agent files and the spawn selector. At S1 use `feature-loop-explorer`; at S3 use
`feature-loop-executor`; at S4 use `acceptance-ui-verifier`, three
`acceptance-judge` lenses, two `acceptance-reviewer` passes, and one
`acceptance-refuter` per proposed finding.

The dispatch recipe must have this exact decision order:

```text
named agent selectable and installed -> custom-agent
spawn available but no named-agent selector -> session-inherited
no usable spawn surface -> sequential-fallback
```

Do not pass Claude aliases to Codex. Require an `## Codex routing` section with
`role`, `mode`, `requested_model`, `requested_reasoning_effort`, `invocations`,
and `effective_model` only when runtime metadata supplies it. Record
`deterministic_executor_workers: 0`.

- [ ] **Step 5: Update the Codex Acceptance Gate skill**

In Phase 3, select the installed UI verifier/judge/reviewer/refuter named agents
through the same capability decision. Preserve standalone behavior and the
existing sequential fallback. Require the same `## Codex routing` evidence
shape without changing verdict or human-signoff rules.

- [ ] **Step 6: Run Codex skill tests to verify GREEN**

Run: `node tests/codex/skill-routing.test.mjs && bash tests/codex/run-tests.sh`

Expected: the routing contract PASS line and all Codex suites pass.

- [ ] **Step 7: Commit the skill-source slice**

```bash
git add tests/codex/skill-routing.test.mjs codex/feature-loop-codex/skills codex/acceptance-gate/skills/acceptance/SKILL.md
git commit -m "feat(codex): route acceptance roles through native agents"
```

### Task 4: Codex-only version bump, documentation, and generated packages

**Files:**
- Modify: `codex/acceptance-gate/.codex-plugin/plugin.json`
- Modify: `codex/feature-loop-codex/.codex-plugin/plugin.json`
- Modify: `codex/feature-loop-codex/README.md`
- Modify: `README.md`
- Modify: `GUIDE.md`
- Modify: `scripts/sync-plugin-packages.sh`
- Regenerate: `plugins/acceptance-gate/**`
- Regenerate: `plugins/feature-loop-codex/**`
- Regenerate: `plugins/design-loop-codex/**` without changing its version

**Interfaces:**
- Consumes: all Codex source changes from Tasks 1-3.
- Produces: installable `acceptance-gate@1.11.4` and `feature-loop-codex@1.11.4` packages.
- Preserves: Claude manifests at `1.11.2` and Claude Workflow routing tests.

- [ ] **Step 1: Tighten version, package, and generated-skill assertions first**

Change P03/P04/P05b/P22 expected Codex versions to `1.11.4`. Add package checks
for all six `agent-templates/*.toml`, `scripts/install-model-policy.mjs`, and
`skills/feature-loop-model-init/SKILL.md`, plus byte equality between each Codex
source file and generated package file. Extend P05b/P26 with the same routing
needles already asserted by `tests/codex/skill-routing.test.mjs` so generated
packages cannot drift from their Codex-only sources.

Keep these explicit isolation assertions:

```python
assert json.loads((root / ".claude-plugin/plugin.json").read_text())["version"] == "1.11.2"
assert json.loads((root / "feature-loop/.claude-plugin/plugin.json").read_text())["version"] == "1.11.2"
assert "machine: 'haiku'" in (root / "feature-loop/workflows/acceptance-verify.js").read_text()
assert "judge: 'sonnet'" in (root / "feature-loop/workflows/acceptance-verify.js").read_text()
assert "executor: null" in (root / "feature-loop/workflows/execute-parallel.js").read_text()
```

- [ ] **Step 2: Run plugin tests to verify RED on stale versions/packages**

Run: `bash tests/plugins/run-tests.sh`

Expected: failures naming `1.11.3` and missing generated model-policy files.

- [ ] **Step 3: Bump only the two changed Codex manifests and docs**

Set Acceptance Gate Codex and Feature Loop Codex manifests to `1.11.4`; leave
Design Loop `0.2.1`. Update Feature Loop Codex README, root README, and GUIDE to
document `feature-loop-model-init`, the six-role balanced policy, fresh-task
activation, and honest fallback. Change the sync script's final version line to:

```bash
echo "Synced Codex packages: acceptance-gate@1.11.4 feature-loop-codex@1.11.4 design-loop@0.2.1"
```

- [ ] **Step 4: Regenerate packages mechanically**

Run: `bash scripts/sync-plugin-packages.sh`

Expected: sync message lists Acceptance Gate and Feature Loop Codex `1.11.4`.

- [ ] **Step 5: Verify package tests and Claude isolation**

Run:

```bash
bash tests/plugins/run-tests.sh
bash tests/workflows/run-tests.sh
git diff 9b6750a -- .claude-plugin feature-loop/.claude-plugin feature-loop/workflows
```

Expected: plugin and Workflow suites pass; the final diff command prints no
Claude runtime changes.

- [ ] **Step 6: Commit the release package slice**

```bash
git add codex plugins README.md GUIDE.md scripts/sync-plugin-packages.sh tests/plugins/run-tests.sh
git commit -m "release(codex): model-routed acceptance agents 1.11.4"
```

### Task 5: Local Codex plugin installation and cache verification

**Files:**
- External install state: `~/.codex/plugins/cache/acceptance-gate-kit/acceptance-gate/1.11.4/`
- External install state: `~/.codex/plugins/cache/acceptance-gate-kit/feature-loop-codex/1.11.4/`

**Interfaces:**
- Consumes: generated packages from Task 4.
- Produces: installed/enabled Codex plugin versions and a cache copy containing the new skill, templates, and installer.

- [ ] **Step 1: Verify the live model catalog before installation**

Run:

```bash
codex debug models | jq -r '.. | objects | .slug? // empty' | sort -u | rg '^gpt-5\.6-(sol|terra)$'
```

Expected: both `gpt-5.6-sol` and `gpt-5.6-terra` appear.

- [ ] **Step 2: Reinstall the two changed plugins**

Run:

```bash
codex plugin remove acceptance-gate@acceptance-gate-kit --json
codex plugin remove feature-loop-codex@acceptance-gate-kit --json
codex plugin add acceptance-gate@acceptance-gate-kit --json
codex plugin add feature-loop-codex@acceptance-gate-kit --json
```

Expected: both add commands report installed version `1.11.4`.

- [ ] **Step 3: Verify registry, cache, and model-policy check behavior**

Run:

```bash
codex plugin list | rg 'acceptance-gate|feature-loop-codex'
test -f ~/.codex/plugins/cache/acceptance-gate-kit/feature-loop-codex/1.11.4/skills/feature-loop-model-init/SKILL.md
test -f ~/.codex/plugins/cache/acceptance-gate-kit/feature-loop-codex/1.11.4/scripts/install-model-policy.mjs
node ~/.codex/plugins/cache/acceptance-gate-kit/feature-loop-codex/1.11.4/scripts/install-model-policy.mjs --root .
```

Expected: both plugins are enabled at `1.11.4`; the cache files exist; check
mode exits `1` with six missing agents in the kit worktree and writes nothing.

### Task 6: Install the Codex policy into the active OneHub Desktop branch

**Files:**
- Modify: `/Users/manhphan/dev/worktrees/zalo-desktop-crm-memory/scripts/codex-plugin-runner.mjs`
- Create: `/Users/manhphan/dev/worktrees/zalo-desktop-crm-memory/.codex/agents/feature-loop-explorer.toml`
- Create: `/Users/manhphan/dev/worktrees/zalo-desktop-crm-memory/.codex/agents/feature-loop-executor.toml`
- Create: `/Users/manhphan/dev/worktrees/zalo-desktop-crm-memory/.codex/agents/acceptance-ui-verifier.toml`
- Create: `/Users/manhphan/dev/worktrees/zalo-desktop-crm-memory/.codex/agents/acceptance-judge.toml`
- Create: `/Users/manhphan/dev/worktrees/zalo-desktop-crm-memory/.codex/agents/acceptance-reviewer.toml`
- Create: `/Users/manhphan/dev/worktrees/zalo-desktop-crm-memory/.codex/agents/acceptance-refuter.toml`

**Interfaces:**
- Consumes: installed plugin caches and runner reference from Task 5.
- Produces: project-scoped Codex agent discovery on branch `codex/zalo-desktop-crm-memory`.
- Preserves: `_acceptance/config.yaml` Claude aliases and all existing OneHub files outside the listed paths.

- [ ] **Step 1: Capture the consumer precondition**

Run:

```bash
git -C /Users/manhphan/dev/worktrees/zalo-desktop-crm-memory status --short --branch
sed -n '323,332p' /Users/manhphan/dev/worktrees/zalo-desktop-crm-memory/_acceptance/config.yaml
```

Expected: worktree clean; output contains `finder: opus` and `executor: opus`.
If unrelated user changes appear, preserve them and stop before overlapping
files.

- [ ] **Step 2: Refresh only the managed consumer runner**

Use `apply_patch` to add the exact Feature Loop allowlist block from Task 2 to
the checked-in OneHub runner. Compare it with the installed Acceptance Gate
reference before and after the patch.

- [ ] **Step 3: Run policy check to verify the OneHub RED state**

Run:

```bash
node /Users/manhphan/dev/worktrees/zalo-desktop-crm-memory/scripts/codex-plugin-runner.mjs feature-loop-codex install-model-policy --root /Users/manhphan/dev/worktrees/zalo-desktop-crm-memory
```

Expected: exit `1`, six `missing` states, and no `.codex/agents` writes.

- [ ] **Step 4: Install and recheck the policy**

Run the same command with `--write`, then run it once more without `--write`.

Expected: first command installs six files with exit `0`; second command reports
six `current` states with exit `0`.

- [ ] **Step 5: Verify TOML/model compatibility and Claude isolation**

Run:

```bash
codex exec --strict-config --ephemeral -C /Users/manhphan/dev/worktrees/zalo-desktop-crm-memory -m gpt-5.6-terra -c 'model_reasoning_effort="low"' "Without reading repository files and without spawning, list the project custom-agent names available in the native agent catalog." | rg 'feature-loop-explorer|acceptance-judge|acceptance-reviewer'
rg -n 'model =|model_reasoning_effort =|sandbox_mode =' /Users/manhphan/dev/worktrees/zalo-desktop-crm-memory/.codex/agents
sed -n '323,332p' /Users/manhphan/dev/worktrees/zalo-desktop-crm-memory/_acceptance/config.yaml
git -C /Users/manhphan/dev/worktrees/zalo-desktop-crm-memory diff --check
```

Expected: prompt input exposes project agents, every TOML contains the configured
model/effort/sandbox, Claude aliases remain unchanged, and diff check is clean.

- [ ] **Step 6: Commit the OneHub installation**

```bash
git -C /Users/manhphan/dev/worktrees/zalo-desktop-crm-memory add scripts/codex-plugin-runner.mjs .codex/agents
git -C /Users/manhphan/dev/worktrees/zalo-desktop-crm-memory commit -m "chore(codex): install role model policy"
```

### Task 7: Final verification, integration, and push

**Files:**
- Verify all changed kit and OneHub files.
- Integrate `codex/model-routing-optimization` into kit `main`.
- Update remote branches only after fresh verification.

**Interfaces:**
- Consumes: committed kit and OneHub slices from Tasks 1-6.
- Produces: pushed kit `main` and pushed OneHub feature branch with auditable runtime evidence.

- [ ] **Step 1: Run the complete kit verification matrix**

Run:

```bash
for t in hooks scripts plugins design-loop workflows codex; do bash tests/$t/run-tests.sh; done
git diff 9b6750a --check
git status --short --branch
```

Expected: 51 hook, 151 script, all plugin/design-loop/Workflow/Codex suites
pass; diff check has no output; only committed branch state remains.

- [ ] **Step 2: Revalidate OneHub after its install commit**

Run:

```bash
node /Users/manhphan/dev/worktrees/zalo-desktop-crm-memory/scripts/codex-plugin-runner.mjs feature-loop-codex install-model-policy --root /Users/manhphan/dev/worktrees/zalo-desktop-crm-memory
git -C /Users/manhphan/dev/worktrees/zalo-desktop-crm-memory status --short --branch
```

Expected: six current states, exit `0`, and a clean worktree.

- [ ] **Step 3: Synchronize and merge kit branch safely**

Run:

```bash
git -C /Users/manhphan/dev/acceptance-gate-kit fetch origin
git -C /Users/manhphan/dev/acceptance-gate-kit pull --ff-only origin main
git -C /Users/manhphan/dev/acceptance-gate-kit merge --no-ff codex/model-routing-optimization -m "merge: Codex-native model routing optimization"
```

Expected: local kit `main` contains all feature commits without unrelated
conflicts. Re-run `bash tests/plugins/run-tests.sh && bash tests/codex/run-tests.sh`
from main after the merge.

- [ ] **Step 4: Push kit main**

Run: `git -C /Users/manhphan/dev/acceptance-gate-kit push origin main`

Expected: push succeeds and `main` matches `origin/main`.

- [ ] **Step 5: Bring OneHub feature branch up to date and push it**

Run:

```bash
git -C /Users/manhphan/dev/worktrees/zalo-desktop-crm-memory fetch origin
git -C /Users/manhphan/dev/worktrees/zalo-desktop-crm-memory merge origin/main
node /Users/manhphan/dev/worktrees/zalo-desktop-crm-memory/scripts/codex-plugin-runner.mjs feature-loop-codex install-model-policy --root /Users/manhphan/dev/worktrees/zalo-desktop-crm-memory
npm --prefix /Users/manhphan/dev/worktrees/zalo-desktop-crm-memory run typecheck
git -C /Users/manhphan/dev/worktrees/zalo-desktop-crm-memory push -u origin codex/zalo-desktop-crm-memory
```

Expected: origin/main merges without losing OneHub feature commits, the policy
remains current, and the remote feature branch is created or updated.

- [ ] **Step 6: Report source, cache, and runtime truth separately**

Report kit commit, OneHub commit, installed plugin versions, six agent files,
fresh prompt-input discovery, test totals, merge commits, and pushed branches.
State explicitly that current Desktop spawn APIs still fall back to
`session-inherited` when they do not expose a named-agent selector.
