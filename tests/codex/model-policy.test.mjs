import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

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
  const mod = await import(pathToFileURL(MODULE));
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
  assert.equal(
    upgraded.files.find((item) => item.file === 'feature-loop-explorer.toml').state,
    'upgraded',
  );

  const judge = path.join(temp, '.codex/agents/acceptance-judge.toml');
  fs.appendFileSync(judge, '# local-edit\n');
  const before = fs.readFileSync(judge, 'utf8');
  const conflict = mod.installModelPolicy({ root: temp, templateDir: TEMPLATES, write: true });
  assert.equal(conflict.exitCode, 1);
  assert.equal(
    conflict.files.find((item) => item.file === 'acceptance-judge.toml').state,
    'conflict',
  );
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
