#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

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
  'feature-loop-codex': Object.freeze({
    'install-model-policy': 'scripts/install-model-policy.mjs',
  }),
});

function blocked(message) {
  process.stderr.write(`BLOCKED: ${message}\n`);
  process.exit(2);
}

function directories(parent) {
  try {
    return fs.readdirSync(parent, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
  } catch {
    return [];
  }
}

function resolveScript(plugin, relativeScript) {
  const codexHome = process.env.CODEX_HOME || path.join(os.homedir(), '.codex');
  const cacheRoot = path.join(codexHome, 'plugins', 'cache');
  const candidates = [];

  for (const marketplace of directories(cacheRoot)) {
    const pluginRoot = path.join(cacheRoot, marketplace, plugin);
    for (const version of directories(pluginRoot)) {
      const script = path.join(pluginRoot, version, relativeScript);
      if (fs.existsSync(script) && fs.statSync(script).isFile()) {
        candidates.push({ marketplace, version, script });
      }
    }
  }

  candidates.sort((a, b) => {
    const byVersion = a.version.localeCompare(b.version, undefined, {
      numeric: true,
      sensitivity: 'base',
    });
    return byVersion || a.marketplace.localeCompare(b.marketplace);
  });
  return candidates.at(-1)?.script || null;
}

const [plugin, action, ...args] = process.argv.slice(2);
const relativeScript = ACTIONS[plugin]?.[action];
if (!relativeScript) {
  blocked(`unsupported plugin/action: ${plugin || '<missing>'}/${action || '<missing>'}`);
}

const script = resolveScript(plugin, relativeScript);
if (!script) {
  blocked(`install or update ${plugin} (for example: codex plugin add ${plugin}@acceptance-gate-kit)`);
}

const child = spawnSync(process.execPath, [script, ...args], { stdio: 'inherit' });
if (child.error) {
  blocked(`${plugin}/${action} could not start: ${child.error.message}`);
}
process.exit(Number.isInteger(child.status) ? child.status : 2);
