import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const RUNNER = path.join(
  ROOT,
  'codex/acceptance-gate/skills/acceptance-init/references/codex-plugin-runner.mjs',
);
const home = fs.mkdtempSync(path.join(os.tmpdir(), 'codex-runner-'));

function addFake(market, plugin, version, relativeScript, marker) {
  const script = path.join(home, 'plugins/cache', market, plugin, version, relativeScript);
  fs.mkdirSync(path.dirname(script), { recursive: true });
  fs.writeFileSync(script, `console.log(${JSON.stringify(marker)});\n`);
}

function run(args) {
  return spawnSync(process.execPath, [RUNNER, ...args], {
    encoding: 'utf8',
    env: { ...process.env, CODEX_HOME: home },
  });
}

try {
  addFake('acceptance-gate-kit', 'acceptance-gate', '1.9.0', 'scripts/gate-card.js', 'acceptance-1.9.0');
  addFake('acceptance-gate-kit', 'acceptance-gate', '1.11.2', 'scripts/gate-card.js', 'acceptance-1.11.2');
  addFake('acceptance-gate-kit', 'acceptance-gate', '1.11.4', 'scripts/gate-card.js', 'acceptance-1.11.4');
  addFake('acceptance-gate-kit', 'acceptance-gate', '1.11.5', 'scripts/gate-card.js', 'acceptance-1.11.5');

  const newest = run(['acceptance-gate', 'gate-card']);
  assert.equal(newest.status, 0, newest.stderr);
  assert.match(newest.stdout, /acceptance-1\.11\.5/);

  const unknownPlugin = run(['unknown', 'gate-card']);
  assert.equal(unknownPlugin.status, 2);
  assert.match(unknownPlugin.stderr, /BLOCKED:/);

  const traversal = run(['acceptance-gate', '../../bin/sh']);
  assert.equal(traversal.status, 2);
  assert.match(traversal.stderr, /BLOCKED:/);

  const missingDesign = run(['design-loop', 'provenance']);
  assert.equal(missingDesign.status, 2);
  assert.match(missingDesign.stderr, /install.*design-loop/i);

  addFake('acceptance-gate-kit', 'design-loop', '0.2.1', 'scripts/provenance.mjs', 'design-0.2.1');
  const design = run(['design-loop', 'provenance']);
  assert.equal(design.status, 0, design.stderr);
  assert.match(design.stdout, /design-0\.2\.1/);

  const missingFeatureLoop = run(['feature-loop-codex', 'install-model-policy']);
  assert.equal(missingFeatureLoop.status, 2);
  assert.match(missingFeatureLoop.stderr, /install.*feature-loop-codex/i);

  addFake(
    'acceptance-gate-kit',
    'feature-loop-codex',
    '1.11.5',
    'scripts/install-model-policy.mjs',
    'feature-loop-codex-1.11.5',
  );
  const modelPolicy = run(['feature-loop-codex', 'install-model-policy']);
  assert.equal(modelPolicy.status, 0, modelPolicy.stderr);
  assert.match(modelPolicy.stdout, /feature-loop-codex-1\.11\.5/);

  console.log('PASS: runner selects latest allowlisted cache entries and blocks unsafe input');
} finally {
  fs.rmSync(home, { recursive: true, force: true });
}
