import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const HOOK = path.join(ROOT, 'codex/acceptance-gate/hooks/acceptance-evidence-gate-codex.js');
const FIXTURE = path.join(ROOT, 'tests/hooks/fixtures/repo');

function freshRepo(name) {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), `${name}-`));
  fs.cpSync(FIXTURE, repo, { recursive: true });
  return repo;
}

function run(repo, command, env = {}) {
  const input = JSON.stringify({
    cwd: repo,
    hook_event_name: 'PreToolUse',
    tool_name: 'apply_patch',
    tool_input: { command },
  });
  return spawnSync(process.execPath, [HOOK], {
    input,
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
}

const repos = [];
try {
  const repo = freshRepo('codex-hook');
  repos.push(repo);

  fs.writeFileSync(path.join(repo, 'notes.md'), 'before\n');
  const nonTarget = run(repo, `*** Begin Patch
*** Update File: notes.md
@@
-before
+after
*** End Patch`);
  assert.equal(nonTarget.status, 0, nonTarget.stderr);

  const draft = run(repo, `*** Begin Patch
*** Add File: _acceptance/new-flow/contract.md
+---
+status: draft
+approved_by:
+---
+# Contract
*** End Patch`);
  assert.equal(draft.status, 0, draft.stderr);

  const skippedGate1 = run(repo, `*** Begin Patch
*** Add File: _acceptance/new-flow/contract.md
+---
+status: implemented
+approved_by:
+---
+# Contract
*** End Patch`);
  assert.equal(skippedGate1.status, 2);
  assert.match(skippedGate1.stderr, /Gate-1|approval/i);

  const weakPass = run(repo, `*** Begin Patch
*** Add File: _acceptance/new-flow/evidence-report.md
+---
+verdict: PASS
+---
+nothing else
*** End Patch`);
  assert.equal(weakPass.status, 2);
  assert.match(weakPass.stderr, /Evidence|run_id/i);

  const contractDir = path.join(repo, '_acceptance/approved-flow');
  fs.mkdirSync(contractDir, { recursive: true });
  fs.writeFileSync(path.join(contractDir, 'contract.md'), `---
status: draft
approved_by: Manh Phan
---
`);
  const approvedUpdate = run(repo, `*** Begin Patch
*** Update File: _acceptance/approved-flow/contract.md
@@
-status: draft
+status: implemented
*** End Patch`);
  assert.equal(approvedUpdate.status, 0, approvedUpdate.stderr);

  const multi = run(repo, `*** Begin Patch
*** Add File: docs/note.md
+hello
*** Add File: _acceptance/multi-flow/contract.md
+---
+status: draft
+approved_by:
+---
*** End Patch`);
  assert.equal(multi.status, 0, multi.stderr);

  const traversal = run(repo, `*** Begin Patch
*** Add File: ../_acceptance/escape/contract.md
+---
+status: draft
+---
*** End Patch`);
  assert.equal(traversal.status, 2);
  assert.match(traversal.stderr, /outside|traversal/i);

  const malformed = run(repo, `*** Begin Patch
*** Update File: _acceptance/approved-flow/contract.md
@@
-missing old content
+status: verified
*** End Patch`);
  assert.equal(malformed.status, 2);
  assert.match(malformed.stderr, /reconstruct|hunk/i);

  const strictDelete = run(repo, `*** Begin Patch
*** Delete File: _acceptance/approved-flow/contract.md
*** End Patch`);
  assert.equal(strictDelete.status, 2);

  const warnRepo = freshRepo('codex-hook-warn');
  repos.push(warnRepo);
  const warnConfig = path.join(warnRepo, '_acceptance/config.yaml');
  fs.writeFileSync(warnConfig, fs.readFileSync(warnConfig, 'utf8').replace('enforcement: strict', 'enforcement: warn'));
  const warned = run(warnRepo, `*** Begin Patch
*** Add File: _acceptance/warn-flow/contract.md
+---
+status: implemented
+approved_by:
+---
*** End Patch`);
  assert.equal(warned.status, 0, warned.stderr);

  const bypassed = run(repo, `*** Begin Patch
*** Add File: _acceptance/bypass-flow/contract.md
+---
+status: implemented
+approved_by:
+---
*** End Patch`, { ACCEPTANCE_GATE_BYPASS: '1' });
  assert.equal(bypassed.status, 0, bypassed.stderr);

  console.log('PASS: Codex apply_patch adapter preserves Acceptance Gate enforcement');
} finally {
  for (const repo of repos) fs.rmSync(repo, { recursive: true, force: true });
}
