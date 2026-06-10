# Acceptance-Gate Kit v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a plugin-shaped Acceptance-Gate Kit that cuts human acceptance time for AI-generated features by ≥50% via contract → self-generated evals → evidence-backed verification.

**Architecture:** 3-layer separation — engine (this plugin: skill + hook + commands + templates), binding (per-repo `_acceptance/config.yaml`), data (per-feature `_acceptance/{slug}/` artifacts in consumer repo). Enforcement is deterministic: a PreToolUse hook blocks PASS verdicts lacking machine evidence, and a pre-merge script blocks unsigned reports in CI.

**Tech Stack:** Node.js (hook, no deps), Bash (test runners + pre-merge check), Markdown/YAML (skill, templates, commands). No build step.

**Spec:** `docs/specs/2026-06-10-acceptance-gate-kit-design.md` (approved 2026-06-10)

---

## File Structure

```
acceptance-gate-kit/
  .claude-plugin/plugin.json            # Task 1 — plugin metadata (Cowork-safe)
  .gitignore                            # Task 1
  hooks/
    hooks.json                          # Task 4 — PreToolUse registration
    acceptance-evidence-gate.js         # Task 3 — evidence gate (port of no-self-verdict.js)
  skills/acceptance/
    SKILL.md                            # Task 9 — 3-phase skill
    references/
      contract-template.md              # Task 5
      eval-executors.md                 # Task 6
      evidence-report-template.md       # Task 7
      judge-personas.md                 # Task 8
  commands/
    acceptance-init.md                  # Task 10 — scaffold consumer repo
    acceptance-status.md                # Task 10 — gate status table
  scripts/
    pre-merge-check.sh                  # Task 11 — CI gate (consumer copies)
  tests/
    hooks/
      run-tests.sh                      # Task 2 — fixture test runner
      fixtures/                         # Task 2 — JSON stdin payloads + fake repo
    scripts/
      run-tests.sh                      # Task 11 — pre-merge-check tests
      fixtures/                         # Task 11
  README.md                             # Task 12
```

**Canonical field names** (single source of truth — every task MUST use exactly these):

| Concept | Field | Values |
|---|---|---|
| Evidence block | `run_id`, `exit_code`, `verifier`, `verified_at` | run_id ≥4 chars; exit_code 0; verifier = script path OR `config:<dotted.key>`; verified_at ISO8601 |
| Judgment item | `judged_by`, `verdict`, `rationale`, `human_override` | verdict: PASS\|FAIL\|UNCERTAIN |
| Report overall | `verdict`, `human_signoff` | verdict: PASS\|REJECT\|BLOCKED |
| Contract frontmatter | `schema_version`, `feature`, `slug`, `risk_tier`, `surfaces`, `status`, `approved_by`, `approved_at`, `time_human_minutes` | risk_tier: T1\|T2\|T3; status: draft\|approved\|implemented\|verified\|signed-off |
| Evals file | `schema_version`, `feature_slug`, `evals[]` with `id`, `criterion`, `executor`, `cmd`/`steps`, `expected`, `evidence_required` | executor: test\|script\|ui-check\|judgment |
| Config | `schema_version`, `enforcement`, `executors`, `risk_tiers`, `signoff`, `dev_server` | enforcement: strict\|warn\|off |

---

### Task 1: Scaffold plugin metadata

**Files:**
- Create: `.claude-plugin/plugin.json`
- Create: `.gitignore`

- [ ] **Step 1: Write plugin.json**

```json
{
  "name": "acceptance-gate",
  "version": "1.0.0",
  "description": "Acceptance gate for AI-generated features. Normalizes requirements into acceptance contracts, self-generates eval cases across 4 executor types, verifies with fresh-context subagents, and enforces evidence-backed verdicts via deterministic hooks. Cuts human acceptance time from hours to minutes.",
  "author": {
    "name": "Manh Phan",
    "email": "phanlemanh@gmail.com"
  },
  "keywords": [
    "acceptance",
    "qa",
    "evals",
    "evidence",
    "quality-gate",
    "ai-code-review"
  ],
  "license": "Proprietary"
}
```

- [ ] **Step 2: Write .gitignore**

```
.DS_Store
node_modules/
__pycache__/
*.pyc
# runtime marker created by tests/hooks/run-tests.sh (see Task 2)
tests/hooks/fixtures/repo/.git
tests/hooks/fixtures/repo-warn/
```

- [ ] **Step 3: Verify plugin.json is valid JSON and ASCII-safe (Cowork V0/V7)**

Run: `python3 -c "import json,sys; d=json.load(open('.claude-plugin/plugin.json')); s=d['description']; assert s.isascii(), 'non-ascii'; assert not any(c in s for c in '<>()'), 'forbidden chars'; print('OK', len(s), 'chars')"`
Expected: `OK 295 chars` (any length ≤ 1024 is fine; must print OK)

- [ ] **Step 4: Commit**

```bash
git add .claude-plugin/plugin.json .gitignore
git commit -m "feat: scaffold plugin metadata for acceptance-gate kit"
```

---

### Task 2: Hook test harness + fixtures (failing tests first)

The hook is the highest-risk component — build its tests before the hook exists.

**Files:**
- Create: `tests/hooks/run-tests.sh`
- Create: `tests/hooks/fixtures/repo/_acceptance/config.yaml`
- Create: `tests/hooks/fixtures/repo/_acceptance/login-flow/contract.md`
- Create: `tests/hooks/fixtures/repo/scripts/verify-login.sh`
- Create: `tests/hooks/fixtures/payloads/` (10 JSON files, generated by run-tests.sh inline)

- [ ] **Step 1: Create fixture consumer repo — config.yaml**

Write `tests/hooks/fixtures/repo/_acceptance/config.yaml`:

```yaml
schema_version: 1
enforcement: strict
executors:
  test:
    api: "pnpm --filter backend test"
    sdk: "pnpm --filter sdk test"
  script:
    cli: "./scripts/smoke-cli.sh"
risk_tiers:
  t1_skip_globs:
    - "docs/**"
    - "*.md"
  t3_paths:
    - "src/auth/**"
    - "src/billing/**"
signoff:
  required_for: [T2, T3]
  approvers: ["Manh Phan"]
dev_server:
  start: "pnpm dev"
  url: "http://localhost:3000"
```

- [ ] **Step 2: Create fixture contract + verifier script**

Write `tests/hooks/fixtures/repo/_acceptance/login-flow/contract.md`:

```markdown
---
schema_version: 1
feature: Login flow with SSO
slug: login-flow
risk_tier: T2
surfaces: [api, ui]
status: approved
approved_by: Manh Phan
approved_at: 2026-06-10
time_human_minutes: {gate1: 8, gate2: 0}
---

# Acceptance Contract: login-flow

## Criteria
- AC-1: Given a valid SSO token, When POST /auth/login, Then 200 + session cookie set.
```

Write `tests/hooks/fixtures/repo/scripts/verify-login.sh`:

```bash
#!/usr/bin/env bash
# Fixture verifier — exists so the hook's script-path resolution can find it.
echo "run_id: vl-fixture-001"
exit 0
```

Run: `chmod +x tests/hooks/fixtures/repo/scripts/verify-login.sh`

- [ ] **Step 3: Write the test runner with 10 cases**

Write `tests/hooks/run-tests.sh`:

```bash
#!/usr/bin/env bash
# Test runner for hooks/acceptance-evidence-gate.js
# Each case: build a PreToolUse JSON payload on stdin, assert exit code.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
HOOK="$HERE/../../hooks/acceptance-evidence-gate.js"
REPO="$HERE/fixtures/repo"
REPORT_PATH="$REPO/_acceptance/login-flow/evidence-report.md"
PASS_COUNT=0; FAIL_COUNT=0

# Mark the fixture repo as a git root so the hook's repo-root-relative
# verifier resolution stops here instead of climbing to the kit's own .git.
# A plain file is enough — the hook only checks fs.existsSync('.git').
touch "$REPO/.git"

# payload <tool_name> <file_path> <content> -> JSON on stdout
payload() {
  node -e '
    const [tool, fp, content] = process.argv.slice(1);
    process.stdout.write(JSON.stringify({
      tool_name: tool,
      tool_input: tool === "Edit"
        ? { file_path: fp, old_string: "x", new_string: content }
        : { file_path: fp, content }
    }));
  ' "$1" "$2" "$3"
}

check() { # <name> <expected_exit> <actual_exit>
  if [ "$2" -eq "$3" ]; then
    echo "  PASS: $1"; PASS_COUNT=$((PASS_COUNT+1))
  else
    echo "  FAIL: $1 (expected exit $2, got $3)"; FAIL_COUNT=$((FAIL_COUNT+1))
  fi
}

GOOD_EVIDENCE='---
verdict: PASS
human_signoff:
---
## Evidence
- eval: E1
  run_id: vl-20260610-001
  exit_code: 0
  verifier: scripts/verify-login.sh
  verified_at: 2026-06-10T10:00:00Z'

echo "T01 non-target file passes through"
payload Write "$REPO/src/foo.md" "verdict: PASS" | node "$HOOK"; check T01 0 $?

echo "T02 PASS with full evidence + existing script verifier -> allow"
payload Write "$REPORT_PATH" "$GOOD_EVIDENCE" | node "$HOOK"; check T02 0 $?

echo "T03 PASS missing run_id -> block"
payload Write "$REPORT_PATH" 'verdict: PASS
exit_code: 0
verifier: scripts/verify-login.sh
verified_at: 2026-06-10T10:00:00Z' | node "$HOOK"; check T03 2 $?

echo "T04 PASS with manual verifier -> block"
payload Write "$REPORT_PATH" 'verdict: PASS
run_id: x-001
exit_code: 0
verifier: manual review by team
verified_at: 2026-06-10T10:00:00Z' | node "$HOOK"; check T04 2 $?

echo "T05 PASS with config:executors.test.api verifier -> allow"
payload Write "$REPORT_PATH" 'verdict: PASS
run_id: x-002
exit_code: 0
verifier: config:executors.test.api
verified_at: 2026-06-10T10:00:00Z' | node "$HOOK"; check T05 0 $?

echo "T06 PASS with config: key missing from config.yaml -> block"
payload Write "$REPORT_PATH" 'verdict: PASS
run_id: x-003
exit_code: 0
verifier: config:executors.test.nonexistent
verified_at: 2026-06-10T10:00:00Z' | node "$HOOK"; check T06 2 $?

echo "T07 PASS with unresolved UNCERTAIN judgment -> block"
payload Write "$REPORT_PATH" "$GOOD_EVIDENCE
- eval: E9
  judged_by: judge-subagent
  verdict: UNCERTAIN
  rationale: cannot tell if empty-state matches business intent" | node "$HOOK"; check T07 2 $?

echo "T08 UNCERTAIN resolved by human_override -> allow"
payload Write "$REPORT_PATH" "$GOOD_EVIDENCE
- eval: E9
  judged_by: judge-subagent
  verdict: UNCERTAIN
  rationale: cannot tell if empty-state matches business intent
  human_override: Manh Phan 2026-06-10" | node "$HOOK"; check T08 0 $?

echo "T09 REJECT without evidence -> always allow"
payload Write "$REPORT_PATH" 'verdict: REJECT
failed_evals: [E2, E5]' | node "$HOOK"; check T09 0 $?

echo "T10 Edit tool with PASS missing evidence -> block"
payload Edit "$REPORT_PATH" 'verdict: PASS
nothing else here' | node "$HOOK"; check T10 2 $?

echo "T11 bypass env -> allow"
payload Write "$REPORT_PATH" 'verdict: PASS
nothing else' | ACCEPTANCE_GATE_BYPASS=1 node "$HOOK"; check T11 0 $?

echo "T12 enforcement: warn in config -> allow with warning"
WARN_REPO="$HERE/fixtures/repo-warn"
mkdir -p "$WARN_REPO/_acceptance/feat-x"
sed 's/^enforcement: strict/enforcement: warn/' \
  "$REPO/_acceptance/config.yaml" > "$WARN_REPO/_acceptance/config.yaml"
payload Write "$WARN_REPO/_acceptance/feat-x/evidence-report.md" 'verdict: PASS
nothing else' | node "$HOOK"; check T12 0 $?

echo ""
echo "Results: $PASS_COUNT passed, $FAIL_COUNT failed"
[ "$FAIL_COUNT" -eq 0 ] || exit 1
```

Run: `chmod +x tests/hooks/run-tests.sh`

- [ ] **Step 4: Run tests to verify they fail (hook does not exist yet)**

Run: `bash tests/hooks/run-tests.sh; echo "exit=$?"`
Expected: every case FAILs with `Cannot find module .../hooks/acceptance-evidence-gate.js` (node exit 1 ≠ expected codes), final line `exit=1`

- [ ] **Step 5: Commit failing tests**

```bash
git add tests/hooks/
git commit -m "test: add evidence-gate hook fixture tests (failing — hook not implemented)"
```

---

### Task 3: Implement acceptance-evidence-gate.js

Port of Skill-workspace `no-self-verdict.js` with kit-specific changes: (1) target pattern is `_acceptance/*/evidence-report.md` only, (2) verifier accepts `config:<dotted.key>` resolved against consumer `_acceptance/config.yaml`, (3) UNCERTAIN-without-override blocks overall PASS, (4) enforcement level read from config, (5) bypass env is `ACCEPTANCE_GATE_BYPASS`, (6) marketplace candidate search dropped (YAGNI for v1).

**Files:**
- Create: `hooks/acceptance-evidence-gate.js`

- [ ] **Step 1: Write the hook**

```javascript
#!/usr/bin/env node
/**
 * acceptance-evidence-gate.js — Acceptance-Gate Kit enforcement layer.
 *
 * Trigger: PreToolUse on Write | Edit targeting _acceptance/<slug>/evidence-report.md
 *
 * Blocks (exit 2) when the report claims overall verdict PASS but:
 *   L1 SHAPE      — evidence block incomplete (run_id / exit_code: 0 / verifier / verified_at)
 *   L2 SUBSTANCE  — any verifier is manual/heuristic, or is neither an existing
 *                   script path nor a resolvable config:<dotted.key> in
 *                   _acceptance/config.yaml of the consumer repo
 *   L3 JUDGMENT   — any per-eval `verdict: UNCERTAIN` without a matching
 *                   `human_override:` (count-based: overrides >= uncertains)
 *
 * REJECT / BLOCKED verdicts always pass through — failing honestly is legal.
 * Enforcement level from consumer config: strict (default) | warn | off.
 * Bypass: ACCEPTANCE_GATE_BYPASS=1.
 * Fail-open on internal error (never block unrelated work).
 */

const fs = require('fs');
const path = require('path');

// ─── Config lookup ─────────────────────────────────────────────────────────

function findAcceptanceConfig(fileDir) {
  // evidence-report.md lives at _acceptance/<slug>/ → config is ../config.yaml.
  // Walk up defensively in case of nesting.
  let cur = fileDir;
  for (let i = 0; i < 10 && cur && cur !== path.dirname(cur); i++) {
    const base = path.basename(cur) === '_acceptance'
      ? cur
      : path.join(cur, '_acceptance');
    const candidate = path.join(base, 'config.yaml');
    try {
      if (fs.existsSync(candidate)) return candidate;
    } catch (_) {}
    cur = path.dirname(cur);
  }
  return null;
}

function resolveConfigKey(configText, dottedKey) {
  // Indent-based walk for a 2-3 level dotted key (e.g. executors.test.api).
  // Returns the scalar value or null. No YAML lib — line-based on purpose.
  const parts = dottedKey.split('.');
  const lines = configText.split('\n');
  let depth = 0;
  let expectedIndent = 0;
  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const indent = line.length - line.trimStart().length;
    if (indent < expectedIndent) {
      // left the branch we were following — reset if we fell below current depth
      while (depth > 0 && indent < expectedIndent) {
        depth--;
        expectedIndent -= 2;
      }
    }
    if (indent !== expectedIndent) continue;
    const m = line.trim().match(/^([\w-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    if (m[1] === parts[depth]) {
      if (depth === parts.length - 1) {
        const val = m[2].trim().replace(/^["']|["']$/g, '');
        return val || null; // leaf must have a non-empty scalar
      }
      depth++;
      expectedIndent += 2;
    }
  }
  return null;
}

// ─── Verifier extraction & authenticity ────────────────────────────────────

function extractVerifierValues(payload) {
  const values = [];
  const KEY_RE = /^\s*(?:-\s+)?(verifier|verified_by|checked_by)\s*[:=]\s*(.+?)\s*$/i;
  for (const line of payload.split('\n')) {
    const m = line.match(KEY_RE);
    if (!m) continue;
    let val = m[2].replace(/\s+#.*$/, '').trim().replace(/^["']+|["']+$/g, '').trim();
    if (val) values.push(val);
  }
  return values;
}

function findGitRoot(startDir) {
  let cur = startDir;
  while (cur && cur !== path.dirname(cur)) {
    try {
      if (fs.existsSync(path.join(cur, '.git'))) return cur;
    } catch (_) {}
    cur = path.dirname(cur);
  }
  return null;
}

function isAuthenticVerifier(value, fileDir, configPath, configText) {
  const MANUAL_RE = /\b(manual|human|heuristic|cross-reference|eyeball|interpret(ation)?|persona\s+rubric|llm\s+rubric|llm[-\s]as[-\s]judge)\b/i;
  if (MANUAL_RE.test(value)) {
    return { ok: false, reason: `manual/heuristic verifier disallowed: "${value}"` };
  }

  const configRef = value.match(/^config:([\w.-]+)$/);
  if (configRef) {
    if (!configText) {
      return { ok: false, reason: `verifier "${value}" but no _acceptance/config.yaml found` };
    }
    const resolved = resolveConfigKey(configText, configRef[1]);
    if (resolved) return { ok: true, resolved: `${configPath} :: ${configRef[1]} = ${resolved}` };
    return { ok: false, reason: `config key not found or empty: "${configRef[1]}" in ${configPath}` };
  }

  const scriptMatch = value.match(/(\S+\.(py|js|sh))\b/);
  if (!scriptMatch) {
    return { ok: false, reason: `verifier is neither config:<key> nor a script path (.py/.sh/.js): "${value}"` };
  }
  const rawPath = scriptMatch[1].replace(/^["']+|["']+$/g, '');
  const candidates = [];
  if (path.isAbsolute(rawPath)) {
    candidates.push(rawPath);
  } else {
    if (fileDir) {
      candidates.push(path.resolve(fileDir, rawPath));
      const gitRoot = findGitRoot(fileDir);
      if (gitRoot) candidates.push(path.resolve(gitRoot, rawPath));
    }
    candidates.push(path.resolve(process.cwd(), rawPath));
  }
  for (const c of candidates) {
    try {
      if (fs.existsSync(c) && fs.statSync(c).isFile()) return { ok: true, resolved: c };
    } catch (_) {}
  }
  return {
    ok: false,
    reason: `verifier script not found. raw: ${rawPath}; tried:\n` +
      candidates.map(c => `      ${c}`).join('\n'),
  };
}

// ─── Main ──────────────────────────────────────────────────────────────────

let data = '';
process.stdin.on('data', chunk => (data += chunk));
process.stdin.on('end', () => {
  try {
    if (process.env.ACCEPTANCE_GATE_BYPASS === '1') {
      process.stdout.write(data);
      process.exit(0);
    }

    const input = JSON.parse(data || '{}');
    const toolName = input.tool_name || '';
    const ti = input.tool_input || {};
    const filePath = ti.file_path || '';

    if (toolName !== 'Write' && toolName !== 'Edit') {
      process.stdout.write(data);
      process.exit(0);
    }

    const TARGET_RE = /(^|[\\/])_acceptance[\\/][^\\/]+[\\/]evidence-report\.md$/i;
    if (!TARGET_RE.test(filePath)) {
      process.stdout.write(data);
      process.exit(0);
    }

    const payload = (ti.content || ti.new_string || '').toString();
    if (!payload) {
      process.stdout.write(data);
      process.exit(0);
    }

    // Only the OVERALL verdict triggers enforcement. Per-eval verdicts use
    // `verdict: PASS` too, but enforcement keys off any PASS-family claim:
    // a report that contains a PASS claim anywhere must carry evidence.
    const CLAIM_RE = /(?:^|\n)\s*(?:-\s+)?verdict\s*[:=]\s*(PASS|ACCEPTED|APPROVED|GO)\b/i;
    const CHECKMARK_RE = /✅\s*(PASS|ACCEPTED|APPROVED|GO)/i;
    if (!CLAIM_RE.test(payload) && !CHECKMARK_RE.test(payload)) {
      process.stdout.write(data);
      process.exit(0);
    }

    const fileDir = path.dirname(filePath);
    const configPath = findAcceptanceConfig(fileDir);
    let configText = null;
    let enforcement = 'strict';
    if (configPath) {
      try {
        configText = fs.readFileSync(configPath, 'utf8');
        const em = configText.match(/^enforcement\s*:\s*(strict|warn|off)\s*$/m);
        if (em) enforcement = em[1];
      } catch (_) {}
    }
    if (enforcement === 'off') {
      process.stdout.write(data);
      process.exit(0);
    }

    // L1 SHAPE
    const HAS_RUN_ID = /run_id\s*[:=]\s*\S{4,}/i.test(payload);
    const HAS_EXIT_ZERO = /(exit_code|verifier_exit_code|exit)\s*[:=]\s*0\b/i.test(payload);
    const HAS_VERIFIED_AT = /verified_at\s*[:=]\s*\d{4}-\d{2}-\d{2}/i.test(payload);
    const verifierValues = extractVerifierValues(payload);
    const HAS_VERIFIER = verifierValues.length > 0;

    const missing = [];
    if (!HAS_RUN_ID) missing.push('run_id: <id from verifier stdout>');
    if (!HAS_EXIT_ZERO) missing.push('exit_code: 0');
    if (!HAS_VERIFIER) missing.push('verifier: <script path or config:executors.<type>.<surface>>');
    if (!HAS_VERIFIED_AT) missing.push('verified_at: <ISO8601>');

    // L2 SUBSTANCE
    const authFailures = [];
    for (const v of verifierValues) {
      const r = isAuthenticVerifier(v, fileDir, configPath, configText);
      if (!r.ok) authFailures.push(r.reason);
    }

    // L3 JUDGMENT — UNCERTAIN must be human-resolved before overall PASS
    const uncertainCount = (payload.match(/verdict\s*[:=]\s*UNCERTAIN\b/gi) || []).length;
    const overrideCount = (payload.match(/human_override\s*[:=]\s*\S+/gi) || []).length;
    const judgmentFailure = uncertainCount > overrideCount
      ? `${uncertainCount} UNCERTAIN judgment(s) but only ${overrideCount} human_override(s) — a human must resolve each UNCERTAIN before overall PASS`
      : null;

    if (missing.length === 0 && authFailures.length === 0 && !judgmentFailure) {
      process.stdout.write(data);
      process.exit(0);
    }

    const lines = [
      '',
      'BLOCKED by acceptance-evidence-gate',
      `File: ${filePath}`,
      `Enforcement: ${enforcement}${configPath ? ` (from ${configPath})` : ' (default — no config.yaml found)'}`,
      '',
    ];
    if (missing.length) {
      lines.push('L1 SHAPE — missing required evidence fields:');
      lines.push(...missing.map(m => `  x ${m}`));
      lines.push('');
    }
    if (authFailures.length) {
      lines.push('L2 SUBSTANCE — verifier authenticity failed:');
      lines.push(...authFailures.map(r => `  x ${r}`));
      lines.push('');
    }
    if (judgmentFailure) {
      lines.push('L3 JUDGMENT:');
      lines.push(`  x ${judgmentFailure}`);
      lines.push('');
    }
    lines.push(
      'A PASS verdict is only valid with machine evidence:',
      '  run_id: <from verifier stdout>   exit_code: 0',
      '  verifier: <existing script path OR config:executors.<type>.<surface>>',
      '  verified_at: <ISO8601>',
      '',
      'If the verifier cannot run  -> verdict: BLOCKED (+ reason). Do NOT fake PASS.',
      'If evals fail               -> verdict: REJECT (+ failed_evals[]). Fully legal.',
      'Legacy bypass: ACCEPTANCE_GATE_BYPASS=1',
      '',
    );

    if (enforcement === 'warn') {
      process.stderr.write(lines.join('\n').replace('BLOCKED by', 'WARNING from') + '\n');
      process.stdout.write(data);
      process.exit(0);
    }
    process.stderr.write(lines.join('\n') + '\n');
    process.exit(2);
  } catch (err) {
    process.stderr.write(`[acceptance-evidence-gate] hook error: ${err.message}\n`);
    process.stdout.write(data);
    process.exit(0);
  }
});
```

- [ ] **Step 2: Run hook tests**

Run: `bash tests/hooks/run-tests.sh`
Expected: `Results: 12 passed, 0 failed`, exit 0

- [ ] **Step 3: Syntax sanity check**

Run: `node --check hooks/acceptance-evidence-gate.js && echo SYNTAX_OK`
Expected: `SYNTAX_OK`

- [ ] **Step 4: Commit**

```bash
git add hooks/acceptance-evidence-gate.js
git commit -m "feat: evidence-gate hook — L1 shape, L2 verifier authenticity, L3 judgment overrides"
```

---

### Task 4: Register hook in hooks.json

**Files:**
- Create: `hooks/hooks.json`

- [ ] **Step 1: Write hooks.json**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/hooks/acceptance-evidence-gate.js\""
          }
        ]
      }
    ]
  }
}
```

- [ ] **Step 2: Validate JSON**

Run: `python3 -c "import json; json.load(open('hooks/hooks.json')); print('OK')"`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add hooks/hooks.json
git commit -m "feat: register evidence-gate as PreToolUse hook on Write|Edit"
```

---

### Task 5: contract-template.md

**Files:**
- Create: `skills/acceptance/references/contract-template.md`

- [ ] **Step 1: Write the template**

````markdown
# Contract Template

Copy everything below the `---8<---` line into `_acceptance/{slug}/contract.md`,
replace `{{placeholders}}`. Keep criterion IDs stable (AC-1, AC-2, …) — evals
reference them.

Frontmatter rules:
- `risk_tier`: T1 (skip kit entirely — do not create this file), T2 (standard),
  T3 (critical: auth/data/breaking-API; judgment items REQUIRE direct human verdict)
- `status` lifecycle: draft → approved (Gate 1) → implemented → verified → signed-off (Gate 2)
- `time_human_minutes`: fill gate1 when approving, gate2 when signing off (pilot metric)

---8<---
---
schema_version: 1
feature: {{one-line feature name}}
slug: {{kebab-case-slug}}
risk_tier: {{T2|T3}}
surfaces: [{{api|cli|sdk|ui, comma-separated}}]
status: draft
approved_by:
approved_at:
time_human_minutes: {gate1: 0, gate2: 0}
---

# Acceptance Contract: {{slug}}

## Context

{{2-4 sentences: what this feature does, for whom, and why now. Link the source
input (ticket URL / PRD path / "prompt" if conversational).}}

Source input: {{ticket-url | prd-path | prompt}}

## Criteria

{{5-15 criteria. Each MUST be Given/When/Then and independently checkable.
Tag criteria that require business judgment with (judgment).}}

- AC-1: Given {{precondition}}, When {{action}}, Then {{observable outcome}}.
- AC-2: Given {{precondition}}, When {{action}}, Then {{observable outcome}}. (judgment)

## Out of scope

{{Bullet list of things a reviewer might expect but this feature deliberately
does NOT do. Empty section = red flag at Gate 1.}}

## Notes

{{Optional: constraints, links to ADRs, data dependencies.}}
````

- [ ] **Step 2: Commit**

```bash
git add skills/acceptance/references/contract-template.md
git commit -m "feat: acceptance contract template with lifecycle frontmatter"
```

---

### Task 6: eval-executors.md

**Files:**
- Create: `skills/acceptance/references/eval-executors.md`

- [ ] **Step 1: Write the executor spec**

````markdown
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
- No browser MCP available → DOWNGRADE the eval to `judgment` with the
  screenshot replaced by a manual checklist item, and note the downgrade in
  the evidence report. Never silently skip.
````

- [ ] **Step 2: Commit**

```bash
git add skills/acceptance/references/eval-executors.md
git commit -m "feat: executor spec — 4 types, evals.yaml shape, selection rules"
```

---

### Task 7: evidence-report-template.md

**Files:**
- Create: `skills/acceptance/references/evidence-report-template.md`

- [ ] **Step 1: Write the template**

````markdown
# Evidence Report Template

Written by the VERIFY phase (fresh-context subagent) to
`_acceptance/{slug}/evidence-report.md`. The acceptance-evidence-gate hook
enforces this format at write time: a PASS verdict without complete, authentic
evidence is blocked.

Verdict rules:
- `PASS` — every eval passed. Requires evidence blocks below.
- `REJECT` — ≥1 eval failed. List `failed_evals`. No evidence requirements
  (failing honestly is always legal).
- `BLOCKED` — verifier could not run (env broken, MCP missing). Give `reason`.
- Per-eval `UNCERTAIN` (judgment only): overall PASS is blocked until each
  UNCERTAIN carries a `human_override: <name> <date>` line.

---8<---
---
schema_version: 1
feature_slug: {{slug}}
verdict: {{PASS|REJECT|BLOCKED}}
failed_evals: []        # REJECT only, e.g. [E2, E5]
reason:                 # BLOCKED only
verified_by: fresh-context verification subagent
human_signoff:          # Gate 2 — human writes "<name> <ISO date>" AFTER review
---

# Evidence Report: {{slug}}

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E4 | AC-2 | judgment | UNCERTAIN |

## Evidence

- eval: E1
  run_id: {{from verifier stdout}}
  exit_code: 0
  verifier: config:executors.test.api
  verified_at: {{ISO8601}}
  output: |
    {{last 5-10 relevant lines of runner output}}

- eval: E3
  run_id: {{...}}
  exit_code: 0
  verifier: scripts/verify-ui-login.sh
  verified_at: {{ISO8601}}
  screenshot: evidence/E3-login-redirect.png

- eval: E4
  judged_by: judge-subagent (fresh context)
  verdict: UNCERTAIN
  rationale: {{1-3 sentences — what the judge could not determine and why}}
  human_override:        # human fills "<name> <date>" + optional note to resolve

## Iterations

{{One line per verify round, max 3: "Round 1: E2, E5 failed — <one-line cause>.
Returned to implementation." After round 3 → escalate to user, verdict REJECT.}}

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN
- [ ] T3 only: personally verify ALL judgment items (judge verdicts not accepted)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
````

- [ ] **Step 2: Commit**

```bash
git add skills/acceptance/references/evidence-report-template.md
git commit -m "feat: evidence report template — verdict rules + gate 2 checklist"
```

---

### Task 8: judge-personas.md

**Files:**
- Create: `skills/acceptance/references/judge-personas.md`

- [ ] **Step 1: Write the judge spec**

````markdown
# Judge Personas — judgment executor

## Dispatch protocol (doer ≠ grader)

Judgment evals are graded by a SEPARATE subagent with fresh context — never by
the agent that implemented the feature, and never inline in the implementing
session. Dispatch with exactly these inputs:

- `contract.md` (full)
- The specific eval entry (question + inputs)
- Referenced evidence files (screenshots, outputs)
- This persona prompt

The judge does NOT receive: the implementation diff, the implementing session's
reasoning, or prior verdicts. Blind grading is the point.

## Persona: Acceptance Judge v1

```
You are an acceptance judge for the feature described in the attached
contract. You did not build it and have no stake in it passing.

Question: {{eval.question}}
Evidence: {{attached files}}

Rules:
1. Judge ONLY against the contract's criteria and context — not your own
   taste, not general best practices.
2. Verdict PASS only when the evidence clearly demonstrates the criterion.
3. Verdict FAIL only when the evidence clearly violates the criterion.
   Cite the exact gap in your rationale.
4. Anything else — ambiguous evidence, missing context, criterion open to
   two readings — is UNCERTAIN. UNCERTAIN is a GOOD verdict: it routes the
   item to a human. Guessing PASS is the worst failure mode you have.
5. Output exactly:
   verdict: PASS|FAIL|UNCERTAIN
   rationale: <1-3 sentences, concrete>
```

## Calibration rules

- T3 features: judge verdicts are advisory only — the human verifies every
  judgment item personally (kit rule, enforced by Gate 2 checklist).
- A judge that returns >50% UNCERTAIN across a feature signals criteria that
  are not independently checkable → fix the contract at Gate 1 next time.
- A judge PASS later contradicted by a human (defect slipped) → log it in the
  pilot notes; 2+ occurrences = tighten this persona before widening rollout.
````

- [ ] **Step 2: Commit**

```bash
git add skills/acceptance/references/judge-personas.md
git commit -m "feat: judge persona — blind grading, UNCERTAIN-first rules"
```

---

### Task 9: SKILL.md

**Files:**
- Create: `skills/acceptance/SKILL.md`

Frontmatter byte-pattern MUST match the deployed Cowork-compatible baseline
(see `pipelines/prop-deck-pipeline/skills/prop-deck-intake/SKILL.md` in the
Skill workspace): `name` unquoted, `description` single-quoted ASCII (no
diacritics, no angle brackets), `version` single-quoted. ≤500 lines total.

- [ ] **Step 1: Write SKILL.md**

````markdown
---
name: acceptance
description: 'Acceptance gate 3-phase cho feature do AI code. Phase 1 NORMALIZE input prompt/ticket/PRD thanh acceptance contract voi Given/When/Then criteria, Phase 2 EVAL-GEN sinh eval cases theo 4 executor types test/script/ui-check/judgment, Phase 3 VERIFY chay evals bang fresh-context subagent va viet evidence report. Trigger: acceptance feature X, tao acceptance contract, chay acceptance gate, verify feature vua code, acceptance review, sinh evals cho feature. KHONG trigger cho code review thuan tuy khong co contract, architecture review, viet unit test thong thuong, hoac sua bug nho T1.'
version: '1.0.0'
---

# acceptance — Evidence-backed Acceptance Gate

## Role

Run the acceptance gate for one feature: turn whatever requirement input
exists into a contract, generate evals from it, and verify the implementation
with machine evidence — so the human reviews a 1-page evidence report instead
of hand-testing for an hour.

Core principles (non-negotiable):
1. **Doer ≠ grader** — the verify phase runs in a FRESH subagent, never the
   implementing agent.
2. **Evidence over assertion** — PASS requires `run_id + exit_code: 0 +
   verifier + verified_at`. The acceptance-evidence-gate hook blocks
   violations at write time. REJECT and BLOCKED are always legal verdicts.
3. **Two human gates only** — Gate 1 approves contract+evals BEFORE
   implementation; Gate 2 signs off on the evidence report AFTER. Never ask
   the human to hand-test what an executor already proved.

## Phase 0 — Preflight (always run first)

1. Locate consumer config: `_acceptance/config.yaml` from repo root.
   Missing → STOP: tell the user to run `/acceptance-init` first.
2. Read config: `enforcement`, `executors`, `risk_tiers`, `signoff`,
   `dev_server`.
3. Determine risk tier:
   - Changed paths all match `risk_tiers.t1_skip_globs` → announce
     "T1 — acceptance gate skipped" and STOP. Do not create artifacts.
   - Any changed path matches `risk_tiers.t3_paths` → T3.
   - Else → T2.
4. Determine entry state from `_acceptance/{slug}/`:
   - No `contract.md` → Phase 1.
   - `contract.md` status: draft → Gate 1 pending (re-present to user).
   - status: approved, no implementation yet → hand off to implementation.
   - status: implemented → Phase 3.
   - `evidence-report.md` verdict PASS + no `human_signoff` → Gate 2 pending.

## Phase 1 — NORMALIZE (input → contract)

Input forms and how to mine them:
| Input | Mining steps |
|---|---|
| Conversational prompt | Extract feature name, actors, observable behaviors from the conversation; ask the user ONLY for what cannot be inferred |
| Ticket (Jira/Linear/GitHub) | Read title + description + AC section; preserve ticket URL as source |
| Spec/PRD file | Read it; lift explicit AC; compress context to 2-4 sentences |

Steps:
1. Read `references/contract-template.md`. Create
   `_acceptance/{slug}/contract.md` from it (slug = kebab-case feature name).
2. Write 5-15 criteria, each Given/When/Then, each independently checkable.
   Tag business-judgment criteria with `(judgment)`.
3. Fill **Out of scope** — minimum 2 bullets. An empty out-of-scope section
   means you have not thought about boundaries; dig for them.
4. Set frontmatter: `risk_tier` (from Phase 0), `status: draft`,
   `surfaces` (only surfaces this feature actually touches).
5. **STOP — Gate 1 part A.** Present the contract to the user verbatim.
   Do NOT proceed to implementation. Do NOT start Phase 2 until the user
   reacts; fold their edits in directly.

## Phase 2 — EVAL-GEN (contract → evals.yaml)

Run immediately after the user reviews the contract (same gate, one sitting).

1. Read `references/eval-executors.md`. Create `_acceptance/{slug}/evals.yaml`.
2. Map every criterion to ≥1 eval using the executor selection rules
   (test > script > ui-check > judgment — prefer the most mechanical executor
   that can actually check the criterion).
3. Repo-specific commands MUST be `config:` references
   (e.g. `cmd: config:executors.test.api`) — never hardcoded.
4. Coverage check: every AC-n appears in ≥1 eval's `criterion` field. Print
   the mapping table (criterion → eval ids → executor).
5. **STOP — Gate 1 part B.** Present evals.yaml + mapping table. On approval:
   set contract `status: approved`, `approved_by`, `approved_at`, and ask the
   user how many minutes Gate 1 took → write `time_human_minutes.gate1`.
6. Hand off to implementation (normal Claude Code flow — the implementing
   agent reads contract + evals and codes until it believes evals will pass).

## Phase 3 — VERIFY (implementation → evidence-report.md)

Entry: implementation complete, contract `status: implemented`.

1. **Dispatch a fresh verification subagent** (general-purpose). Its prompt
   contains: contract.md, evals.yaml, config executor commands, the evidence
   block format from `references/evidence-report-template.md`, and the
   instruction: "You did not write this code. Run every eval. Record evidence
   verbatim. UNCERTAIN when unsure. Never mark PASS without captured output."
2. The subagent executes per executor type:
   - `test` / `script`: run the resolved `config:` command. Capture exit code
     + last 10 output lines. Generate `run_id` = `{slug}-{evalid}-{timestamp}`.
   - `ui-check`: start dev server per `config:dev_server.start`; drive via
     Claude Preview MCP; screenshot to `_acceptance/{slug}/evidence/`.
     No browser MCP → downgrade to judgment + note (see eval-executors.md).
   - `judgment`: dispatch the judge per `references/judge-personas.md`
     (separate fresh subagent — blind: no diff, no implementer reasoning).
3. Write `_acceptance/{slug}/evidence-report.md` per template. The
   acceptance-evidence-gate hook validates evidence at write time — if it
   blocks, the evidence is incomplete: fix the evidence, never the wording.
4. Verdict routing:
   - All pass → verdict PASS, contract `status: verified`. → step 5.
   - Any eval fails → verdict REJECT + `failed_evals[]`. Return findings to
     the implementing context. Max 3 verify rounds; log each in the report's
     Iterations section. After round 3 → STOP, escalate to user.
   - Executor cannot run → verdict BLOCKED + reason. STOP, escalate.
5. **STOP — Gate 2.** Present to the user: verdict, the per-eval table, links
   to evidence, and the list of UNCERTAIN judgment items they must personally
   check (T3: ALL judgment items). On approval the user (not you) fills
   `human_signoff`; then ask minutes spent → `time_human_minutes.gate2`,
   set contract `status: signed-off`.

## Degradation table

| Situation | Action |
|---|---|
| No `_acceptance/config.yaml` | STOP at Phase 0 → `/acceptance-init` |
| Executor command fails to start (env broken) | verdict BLOCKED + reason — never PASS |
| No browser MCP for ui-check | Downgrade eval to judgment + note in report |
| Judge returns >50% UNCERTAIN | Complete the run, then flag contract quality at Gate 2 |
| 3 verify rounds exhausted | verdict REJECT, escalate with failure pattern summary |
| User asks to skip Gate 1 | Refuse politely once, explain leverage; if insisted, note `gate1_skipped: true` in contract |
| Hook blocks the report write | Evidence is incomplete — capture real evidence; do NOT reword the verdict to dodge the gate |

## Anti-patterns

| Anti-pattern | Why it kills the gate |
|---|---|
| Implementing agent runs its own evals and writes the report | Doer = grader; self-grading inflates PASS. Always fresh subagent |
| Marking judgment UNCERTAIN items as PASS "because they look fine" | UNCERTAIN exists to route to humans; guessing destroys trust in every future PASS |
| Hardcoding repo commands in evals.yaml | Breaks the engine/binding split; kit stops being portable |
| Writing contract criteria after implementation | Criteria mold themselves to what was built; gate becomes theater |
| Asking the human to re-test machine-proven evals at Gate 2 | Burns the exact time the kit exists to save |
| Editing verdict wording to slip past the hook | The hook is the contract; evidence or no PASS |

## References

- `references/contract-template.md` — contract format + lifecycle
- `references/eval-executors.md` — 4 executors, evals.yaml shape, selection rules
- `references/evidence-report-template.md` — report format, verdict rules, Gate 2 checklist
- `references/judge-personas.md` — blind judge dispatch + persona
````

- [ ] **Step 2: Validate frontmatter parses + line budget**

Run: `python3 -c "
import yaml, io
text = open('skills/acceptance/SKILL.md').read()
fm = text.split('---')[1]
d = yaml.safe_load(fm)
assert set(d) == {'name','description','version'}, d.keys()
assert d['description'].isascii(), 'non-ascii in description'
assert '<' not in d['description'] and '>' not in d['description']
print('FRONTMATTER_OK', len(d['description']), 'chars,', len(text.splitlines()), 'lines')
"`
Expected: `FRONTMATTER_OK <n> chars, <m> lines` with m ≤ 500

- [ ] **Step 3: Commit**

```bash
git add skills/acceptance/SKILL.md
git commit -m "feat: acceptance skill — 3 phases, 2 human gates, degradation + anti-patterns"
```

---

### Task 10: Commands

**Files:**
- Create: `commands/acceptance-init.md`
- Create: `commands/acceptance-status.md`

- [ ] **Step 1: Write acceptance-init.md**

````markdown
---
description: Scaffold _acceptance/ workspace + config.yaml for this repo (one-time setup)
---

Initialize the Acceptance-Gate Kit in the current repository.

1. If `_acceptance/config.yaml` already exists → show it and STOP (never overwrite).
2. Ask the user, one question at a time:
   a. Test commands per surface they have (api/backend/sdk) — e.g. `pnpm --filter backend test`
   b. CLI smoke command if a CLI surface exists
   c. Dev server start command + URL (for ui-check evals)
   d. Paths that are critical (auth/data/payments) → `t3_paths`
   e. Globs safe to skip entirely (docs, pure-config) → `t1_skip_globs`
   f. Who can sign off (names) → `signoff.approvers`
3. Write `_acceptance/config.yaml`:

```yaml
schema_version: 1
enforcement: strict          # strict | warn | off
executors:
  test:
    api: "<from 2a>"
  script:
    cli: "<from 2b>"
risk_tiers:
  t1_skip_globs:
    - "<from 2e>"
  t3_paths:
    - "<from 2d>"
signoff:
  required_for: [T2, T3]
  approvers: ["<from 2f>"]
dev_server:
  start: "<from 2c>"
  url: "<from 2c>"
```

Omit executor keys for surfaces the repo does not have — do not write empty strings.

4. Write `_acceptance/README.md` (3 lines): what this folder is, link to the
   acceptance skill, "artifacts are per-feature in subfolders".
5. Suggest copying `scripts/pre-merge-check.sh` from the plugin into the repo's
   CI (path: `${CLAUDE_PLUGIN_ROOT}/scripts/pre-merge-check.sh`).
6. Print: "Acceptance gate ready. Run the acceptance skill on your next feature."
````

- [ ] **Step 2: Write acceptance-status.md**

````markdown
---
description: Show acceptance gate status for all features in this repo
---

Scan `_acceptance/*/contract.md` in the current repository and print a status
table. For each feature directory (skip `config.yaml` and `README.md`):

1. Parse contract frontmatter: `slug`, `risk_tier`, `status`.
2. If `evidence-report.md` exists, parse: `verdict`, `human_signoff`.
3. Print:

| Slug | Tier | Contract status | Verdict | Signoff |
|---|---|---|---|---|
| login-flow | T2 | verified | PASS | — |

4. Below the table, flag actionable items:
   - status `draft` → "Gate 1 pending: review contract + evals"
   - verdict PASS + empty signoff → "Gate 2 pending: review evidence report"
   - verdict REJECT → "Implementation fixes needed: see failed_evals"
   - verdict BLOCKED → "Environment issue: see reason"
5. If `_acceptance/` does not exist → suggest `/acceptance-init`.
````

- [ ] **Step 3: Commit**

```bash
git add commands/
git commit -m "feat: acceptance-init and acceptance-status commands"
```

---

### Task 11: pre-merge-check.sh (TDD)

**Files:**
- Create: `tests/scripts/run-tests.sh`
- Create: `tests/scripts/fixtures/` (built inline by the runner)
- Create: `scripts/pre-merge-check.sh`

- [ ] **Step 1: Write the failing tests**

Write `tests/scripts/run-tests.sh`:

```bash
#!/usr/bin/env bash
# Tests for scripts/pre-merge-check.sh using throwaway fixture repos.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
CHECK="$HERE/../../scripts/pre-merge-check.sh"
PASS_COUNT=0; FAIL_COUNT=0

check() { # <name> <expected_exit> <actual_exit>
  if [ "$2" -eq "$3" ]; then
    echo "  PASS: $1"; PASS_COUNT=$((PASS_COUNT+1))
  else
    echo "  FAIL: $1 (expected exit $2, got $3)"; FAIL_COUNT=$((FAIL_COUNT+1))
  fi
}

mk_feature() { # <root> <slug> <tier> <status> [verdict] [signoff]
  local d="$1/_acceptance/$2"; mkdir -p "$d"
  printf -- '---\nschema_version: 1\nfeature: %s\nslug: %s\nrisk_tier: %s\nsurfaces: [api]\nstatus: %s\n---\n' \
    "$2" "$2" "$3" "$4" > "$d/contract.md"
  if [ -n "${5:-}" ]; then
    printf -- '---\nschema_version: 1\nfeature_slug: %s\nverdict: %s\nhuman_signoff: %s\n---\n' \
      "$2" "$5" "${6:-}" > "$d/evidence-report.md"
  fi
}

T="$(mktemp -d)"; trap 'rm -rf "$T"' EXIT

echo "S01 T2 signed-off feature -> pass"
R="$T/s01"; mk_feature "$R" feat-a T2 implemented PASS "Manh Phan 2026-06-10"
bash "$CHECK" "$R"; check S01 0 $?

echo "S02 T2 implemented, PASS but no signoff -> fail"
R="$T/s02"; mk_feature "$R" feat-b T2 implemented PASS ""
bash "$CHECK" "$R"; check S02 1 $?

echo "S03 T2 implemented, no evidence report at all -> fail"
R="$T/s03"; mk_feature "$R" feat-c T2 implemented
bash "$CHECK" "$R"; check S03 1 $?

echo "S04 draft contract (not yet implemented) -> pass (not in scope)"
R="$T/s04"; mk_feature "$R" feat-d T2 draft
bash "$CHECK" "$R"; check S04 0 $?

echo "S05 REJECT verdict -> fail (cannot merge rejected feature)"
R="$T/s05"; mk_feature "$R" feat-e T3 implemented REJECT ""
bash "$CHECK" "$R"; check S05 1 $?

echo "S06 --slug filters to one feature"
R="$T/s06"
mk_feature "$R" feat-ok T2 implemented PASS "Manh Phan 2026-06-10"
mk_feature "$R" feat-bad T2 implemented PASS ""
bash "$CHECK" "$R" --slug feat-ok; check S06 0 $?
bash "$CHECK" "$R" --slug feat-bad; check S06b 1 $?

echo "S07 no _acceptance dir -> pass (kit not adopted here)"
R="$T/s07"; mkdir -p "$R"
bash "$CHECK" "$R"; check S07 0 $?

echo ""
echo "Results: $PASS_COUNT passed, $FAIL_COUNT failed"
[ "$FAIL_COUNT" -eq 0 ] || exit 1
```

Run: `chmod +x tests/scripts/run-tests.sh`

- [ ] **Step 2: Run tests to verify they fail**

Run: `bash tests/scripts/run-tests.sh; echo "exit=$?"`
Expected: all cases FAIL (script missing), `exit=1`

- [ ] **Step 3: Implement pre-merge-check.sh**

```bash
#!/usr/bin/env bash
# pre-merge-check.sh — CI gate for the Acceptance-Gate Kit.
#
# Usage: pre-merge-check.sh [repo_root] [--slug <slug>]...
#
# For every feature in _acceptance/ whose contract has status
# implemented|verified|signed-off and risk_tier T2|T3:
#   - evidence-report.md must exist
#   - overall verdict must be PASS
#   - human_signoff must be non-empty
# Exits 1 listing violations; 0 when clean. T1 and draft/approved
# (pre-implementation) features are out of scope.
set -u

ROOT="."
SLUGS=()
while [ $# -gt 0 ]; do
  case "$1" in
    --slug) SLUGS+=("$2"); shift 2 ;;
    *) ROOT="$1"; shift ;;
  esac
done

ACC="$ROOT/_acceptance"
[ -d "$ACC" ] || { echo "pre-merge-check: no _acceptance/ — nothing to check"; exit 0; }

fm_field() { # <file> <key> — first frontmatter-style "key: value" line
  sed -n "s/^${2}:[[:space:]]*//p" "$1" | head -1
}

violations=0
for dir in "$ACC"/*/; do
  [ -d "$dir" ] || continue
  slug="$(basename "$dir")"
  if [ ${#SLUGS[@]} -gt 0 ]; then
    found=0
    for s in "${SLUGS[@]}"; do [ "$s" = "$slug" ] && found=1; done
    [ $found -eq 1 ] || continue
  fi
  contract="$dir/contract.md"
  [ -f "$contract" ] || continue

  tier="$(fm_field "$contract" risk_tier)"
  status="$(fm_field "$contract" status)"

  case "$tier" in T2|T3) ;; *) continue ;; esac
  case "$status" in implemented|verified|signed-off) ;; *) continue ;; esac

  report="$dir/evidence-report.md"
  if [ ! -f "$report" ]; then
    echo "VIOLATION [$slug]: status=$status but no evidence-report.md"
    violations=$((violations+1)); continue
  fi
  verdict="$(fm_field "$report" verdict)"
  signoff="$(fm_field "$report" human_signoff)"
  if [ "$verdict" != "PASS" ]; then
    echo "VIOLATION [$slug]: verdict=$verdict (must be PASS to merge)"
    violations=$((violations+1)); continue
  fi
  if [ -z "$signoff" ]; then
    echo "VIOLATION [$slug]: verdict PASS but human_signoff is empty (Gate 2 pending)"
    violations=$((violations+1)); continue
  fi
  echo "OK [$slug]: $verdict, signed off by $signoff"
done

if [ "$violations" -gt 0 ]; then
  echo "pre-merge-check: $violations violation(s) — merge blocked"
  exit 1
fi
echo "pre-merge-check: clean"
exit 0
```

Run: `chmod +x scripts/pre-merge-check.sh`

- [ ] **Step 4: Run tests to verify they pass**

Run: `bash tests/scripts/run-tests.sh`
Expected: `Results: 8 passed, 0 failed` (S01-S07 with S06 counting twice), exit 0

- [ ] **Step 5: Commit**

```bash
git add scripts/pre-merge-check.sh tests/scripts/
git commit -m "feat: pre-merge CI gate — block unsigned or rejected acceptance reports"
```

---

### Task 12: README + full-kit validation

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write README.md**

````markdown
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

## Install

As a Claude Code plugin (marketplace or local):

```bash
claude plugin install acceptance-gate   # or add this repo as a local plugin
```

Pilot mode (iterate on the kit while using it): symlink into a consumer repo's
`.claude/` or add this directory to your plugin dev paths.

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
Success bar for the pilot: ≥50% less human time than the pre-kit baseline,
zero business-logic defects slipping past the gate.

Design spec: `docs/specs/2026-06-10-acceptance-gate-kit-design.md`
````

- [ ] **Step 2: Run the full validation suite**

Run: `bash tests/hooks/run-tests.sh && bash tests/scripts/run-tests.sh && node --check hooks/acceptance-evidence-gate.js && python3 -c "import json; json.load(open('.claude-plugin/plugin.json')); json.load(open('hooks/hooks.json')); print('ALL_VALID')"`
Expected: both test suites green, `ALL_VALID`

- [ ] **Step 3: Check no forbidden files (Cowork V6)**

Run: `find . -name '.DS_Store' -o -name '__pycache__' -o -name '*.pyc' | grep -v node_modules | grep . && echo FORBIDDEN_FOUND || echo CLEAN`
Expected: `CLEAN`

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: README — install, per-repo setup, daily use, pilot metrics"
```

---

## Out of scope for this plan (Phase 2 — per spec §12-13)

- Architecture gate (b): ADR-based contract section + architecture judge persona
- Golden dataset / regression evals in CI
- `/acceptance-status` as a script (v1 is an LLM command by design)
- Changed-file detection wiring for pre-merge-check `--slug` in CI
- Multi-repo rollout + metrics dashboard
- BSA-pipeline packaging (after pilot stabilizes shapes)

## Verification after all tasks

1. `bash tests/hooks/run-tests.sh` → 12/12 green
2. `bash tests/scripts/run-tests.sh` → 8/8 green
3. SKILL.md frontmatter parse + ≤500 lines (Task 9 Step 2 command)
4. Manual smoke: install plugin locally into a scratch repo, run
   `/acceptance-init`, walk one toy feature through Phase 1→3 and watch the
   hook block a PASS-without-evidence write attempt.
