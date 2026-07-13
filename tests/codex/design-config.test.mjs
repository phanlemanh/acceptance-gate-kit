import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const PATCHER = path.join(ROOT, 'plugins/design-loop-codex/scripts/design-config-patch.mjs');
const FIXTURE = path.join(ROOT, 'tests/hooks/fixtures/repo/_acceptance/config.yaml');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'codex-design-config-'));
const config = path.join(temp, 'config.yaml');
fs.copyFileSync(FIXTURE, config);

function patch() {
  return spawnSync(process.execPath, [
    PATCHER,
    '--config', config,
    '--surface-globs', 'apps/web/**,src/components/**',
    '--write',
  ], { encoding: 'utf8' });
}

try {
  const first = patch();
  assert.equal(first.status, 0, first.stderr);
  const text = fs.readFileSync(config, 'utf8');
  assert.match(text, /node scripts\/codex-plugin-runner\.mjs acceptance-gate design-gate/);
  assert.match(text, /node scripts\/codex-plugin-runner\.mjs acceptance-gate design-scan/);
  assert.match(text, /node scripts\/codex-plugin-runner\.mjs design-loop design-static-check/);
  assert.match(text, /node scripts\/codex-plugin-runner\.mjs design-loop design-fidelity-diff/);
  assert.doesNotMatch(text, /CLAUDE_PLUGIN_ROOT/);
  assert.match(text, /surface_globs: \[apps\/web\/\*\*, src\/components\/\*\*\]/);

  const second = patch();
  assert.equal(second.status, 0, second.stderr);
  const secondText = fs.readFileSync(config, 'utf8');
  assert.equal((secondText.match(/^  design:$/gm) || []).length, 1);
  assert.equal((secondText.match(/^design:$/gm) || []).length, 1);

  console.log('PASS: Codex design config uses runner-backed idempotent commands');
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
