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
  'version: 1.11.5',
  'feature-loop-model-init',
  '.codex/agents',
  'feature_loop_explorer',
  'feature_loop_executor',
  'acceptance_ui_verifier',
  'acceptance_judge',
  'acceptance_reviewer',
  'acceptance_refuter',
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
  'acceptance_ui_verifier',
  'acceptance_judge',
  'acceptance_reviewer',
  'acceptance_refuter',
  '## Codex routing',
]) assert.ok(acceptance.includes(needle), needle);

console.log('PASS: Codex skills declare native role routing and honest fallback');
