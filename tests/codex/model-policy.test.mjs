import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const MODULE = path.join(ROOT, 'codex/feature-loop-codex/scripts/install-model-policy.mjs');
const TEMPLATES = path.join(ROOT, 'codex/feature-loop-codex/agent-templates');
const EXPECTED = new Map([
  ['feature_loop_explorer.toml', ['gpt-5.6-terra', 'medium', 'read-only']],
  ['feature_loop_executor.toml', ['gpt-5.6-sol', 'high', 'workspace-write']],
  ['acceptance_ui_verifier.toml', ['gpt-5.6-sol', 'medium', 'workspace-write']],
  ['acceptance_judge.toml', ['gpt-5.6-sol', 'medium', 'read-only']],
  ['acceptance_reviewer.toml', ['gpt-5.6-sol', 'high', 'read-only']],
  ['acceptance_refuter.toml', ['gpt-5.6-terra', 'medium', 'read-only']],
]);

function renderLegacyManaged(body) {
  const normalized = body.endsWith('\n') ? body : `${body}\n`;
  const hash = crypto.createHash('sha256').update(normalized).digest('hex');
  return `# managed-by: feature-loop-codex\n# template-version: 1.11.4\n# source-hash: sha256:${hash}\n${normalized}`;
}

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
    assert.match(text, /^# template-version: 1\.11\.5$/m);
    assert.match(text, /^# source-hash: sha256:[a-f0-9]{64}$/m);
    assert.match(text, new RegExp(`model = "${model.replaceAll('.', '\\.')}"`));
    assert.match(text, new RegExp(`model_reasoning_effort = "${effort}"`));
    assert.match(text, new RegExp(`sandbox_mode = "${sandbox}"`));
    const agentName = text.match(/^name = "([^"]+)"$/m)?.[1];
    assert.match(agentName, /^[a-z0-9_]+$/, `${file} must be selectable by Codex`);
  }

  const explorer = path.join(temp, '.codex/agents/feature_loop_explorer.toml');
  fs.writeFileSync(explorer, mod.renderManaged('name = "old-explorer"\n'));
  const upgraded = mod.installModelPolicy({ root: temp, templateDir: TEMPLATES, write: true });
  assert.equal(upgraded.exitCode, 0);
  assert.equal(
    upgraded.files.find((item) => item.file === 'feature_loop_explorer.toml').state,
    'upgraded',
  );

  const judge = path.join(temp, '.codex/agents/acceptance_judge.toml');
  fs.appendFileSync(judge, '# local-edit\n');
  const before = fs.readFileSync(judge, 'utf8');
  const conflict = mod.installModelPolicy({ root: temp, templateDir: TEMPLATES, write: true });
  assert.equal(conflict.exitCode, 1);
  assert.equal(
    conflict.files.find((item) => item.file === 'acceptance_judge.toml').state,
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

  const migrationRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'agk-model-policy-migrate-'));
  const migrationAgents = path.join(migrationRoot, '.codex/agents');
  fs.mkdirSync(migrationAgents, { recursive: true });
  const legacyExplorer = path.join(migrationAgents, 'feature-loop-explorer.toml');
  fs.writeFileSync(
    legacyExplorer,
    renderLegacyManaged('name = "feature-loop-explorer"\ndescription = "legacy invalid name"\ndeveloper_instructions = "legacy"\n'),
  );
  const migrationCheck = mod.installModelPolicy({
    root: migrationRoot,
    templateDir: TEMPLATES,
    write: false,
  });
  assert.equal(migrationCheck.exitCode, 1);
  assert.equal(
    migrationCheck.files.find((item) => item.file === 'feature-loop-explorer.toml').state,
    'remove',
  );
  assert.ok(fs.existsSync(legacyExplorer), 'check mode must preserve legacy files');
  const migrated = mod.installModelPolicy({
    root: migrationRoot,
    templateDir: TEMPLATES,
    write: true,
  });
  assert.equal(migrated.exitCode, 0);
  assert.equal(
    migrated.files.find((item) => item.file === 'feature-loop-explorer.toml').state,
    'removed',
  );
  assert.ok(!fs.existsSync(legacyExplorer), 'clean 1.11.4 legacy file must be removed');
  assert.ok(fs.existsSync(path.join(migrationAgents, 'feature_loop_explorer.toml')));

  const legacyConflict = path.join(migrationAgents, 'acceptance-judge.toml');
  fs.writeFileSync(
    legacyConflict,
    `${renderLegacyManaged('name = "acceptance-judge"\ndescription = "legacy invalid name"\ndeveloper_instructions = "legacy"\n')}# local-edit\n`,
  );
  const preservedLegacy = mod.installModelPolicy({
    root: migrationRoot,
    templateDir: TEMPLATES,
    write: true,
  });
  assert.equal(preservedLegacy.exitCode, 1);
  assert.equal(
    preservedLegacy.files.find((item) => item.file === 'acceptance-judge.toml').state,
    'conflict',
  );
  assert.ok(fs.existsSync(legacyConflict), 'modified legacy file must be preserved');

  fs.rmSync(incompleteTemplates, { recursive: true, force: true });
  fs.rmSync(migrationRoot, { recursive: true, force: true });
  fs.rmSync(symlinkRoot, { recursive: true, force: true });
  console.log('PASS: Codex model policy installs, upgrades, migrates, and preserves user agents');
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
