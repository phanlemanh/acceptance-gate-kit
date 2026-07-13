#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const POLICY_VERSION = '1.11.5';
export const TEMPLATE_FILES = Object.freeze([
  'feature_loop_explorer.toml',
  'feature_loop_executor.toml',
  'acceptance_ui_verifier.toml',
  'acceptance_judge.toml',
  'acceptance_reviewer.toml',
  'acceptance_refuter.toml',
]);
export const LEGACY_TEMPLATE_FILES = Object.freeze([
  ['feature-loop-explorer.toml', 'feature-loop-explorer'],
  ['feature-loop-executor.toml', 'feature-loop-executor'],
  ['acceptance-ui-verifier.toml', 'acceptance-ui-verifier'],
  ['acceptance-judge.toml', 'acceptance-judge'],
  ['acceptance-reviewer.toml', 'acceptance-reviewer'],
  ['acceptance-refuter.toml', 'acceptance-refuter'],
]);

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_TEMPLATE_DIR = path.resolve(HERE, '../agent-templates');
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
  return {
    managed: true,
    clean: sha256(body) === match[2],
    version: match[1],
    body,
  };
}

function requireDirectory(target, label) {
  if (!fs.existsSync(target)) throw new Error(`${label} does not exist: ${target}`);
  const stat = fs.lstatSync(target);
  if (stat.isSymbolicLink()) throw new Error(`refusing symlink ${label}: ${target}`);
  if (!stat.isDirectory()) throw new Error(`${label} is not a directory: ${target}`);
}

function rejectSymlink(target) {
  if (fs.existsSync(target) && fs.lstatSync(target).isSymbolicLink()) {
    throw new Error(`refusing symlink path: ${target}`);
  }
}

function requireDirectoryOrMissing(target, label) {
  if (!fs.existsSync(target)) return;
  const stat = fs.lstatSync(target);
  if (stat.isSymbolicLink()) throw new Error(`refusing symlink ${label}: ${target}`);
  if (!stat.isDirectory()) throw new Error(`${label} is not a directory: ${target}`);
}

function writeAtomic(target, content) {
  const temp = `${target}.tmp-${process.pid}`;
  try {
    fs.writeFileSync(temp, content, { encoding: 'utf8', flag: 'wx' });
    fs.renameSync(temp, target);
  } finally {
    fs.rmSync(temp, { force: true });
  }
}

function loadTemplates(templateDir) {
  requireDirectory(templateDir, 'template directory');
  return TEMPLATE_FILES.map((file) => {
    const source = path.join(templateDir, file);
    if (!fs.existsSync(source) || !fs.statSync(source).isFile()) {
      throw new Error(`missing template: ${source}`);
    }
    return { file, desired: renderManaged(fs.readFileSync(source, 'utf8')) };
  });
}

export function installModelPolicy({ root, templateDir = DEFAULT_TEMPLATE_DIR, write = false }) {
  if (typeof root !== 'string' || !root.trim()) throw new Error('--root is required');
  const resolvedRoot = path.resolve(root);
  requireDirectory(resolvedRoot, 'root');
  const templates = loadTemplates(path.resolve(templateDir));
  const codexDir = path.join(resolvedRoot, '.codex');
  const agentsDir = path.join(codexDir, 'agents');
  requireDirectoryOrMissing(codexDir, '.codex directory');
  requireDirectoryOrMissing(agentsDir, 'agents directory');

  const files = templates.map(({ file, desired }) => {
    const target = path.join(agentsDir, file);
    rejectSymlink(target);
    if (!fs.existsSync(target)) return { file, state: 'missing', target, desired };
    const current = fs.readFileSync(target, 'utf8');
    if (current === desired) return { file, state: 'current', target, desired };
    const inspected = inspectManaged(current);
    return {
      file,
      state: inspected.managed && inspected.clean ? 'upgrade' : 'conflict',
      target,
      desired,
    };
  });

  for (const [file, legacyName] of LEGACY_TEMPLATE_FILES) {
    const target = path.join(agentsDir, file);
    rejectSymlink(target);
    if (!fs.existsSync(target)) continue;
    const current = fs.readFileSync(target, 'utf8');
    const inspected = inspectManaged(current);
    const expectedLegacyName = `name = "${legacyName}"`;
    const removable = inspected.managed
      && inspected.clean
      && inspected.version === '1.11.4'
      && inspected.body.split('\n').includes(expectedLegacyName);
    files.push({
      file,
      state: removable ? 'remove' : 'conflict',
      target,
      legacy: true,
    });
  }

  if (write && files.some((item) => ['missing', 'upgrade', 'remove'].includes(item.state))) {
    fs.mkdirSync(agentsDir, { recursive: true });
    for (const item of files) {
      if (item.state === 'missing') {
        writeAtomic(item.target, item.desired);
        item.state = 'installed';
      } else if (item.state === 'upgrade') {
        writeAtomic(item.target, item.desired);
        item.state = 'upgraded';
      }
    }
    for (const item of files) {
      if (item.state !== 'remove') continue;
      fs.unlinkSync(item.target);
      item.state = 'removed';
    }
  }

  const driftStates = new Set(['missing', 'upgrade', 'remove', 'conflict']);
  return {
    exitCode: files.some((item) => driftStates.has(item.state)) ? 1 : 0,
    files: files.map(({ desired, target, ...item }) => item),
  };
}

function parseArgs(argv) {
  let root = null;
  let write = false;
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--write') {
      write = true;
    } else if (arg === '--root' && argv[index + 1]) {
      root = argv[index + 1];
      index += 1;
    } else {
      throw new Error(`unsupported argument: ${arg}`);
    }
  }
  if (!root) throw new Error('--root is required');
  return { root, write };
}

function main() {
  try {
    const result = installModelPolicy(parseArgs(process.argv.slice(2)));
    for (const item of result.files) process.stdout.write(`${item.state} ${item.file}\n`);
    process.exitCode = result.exitCode;
  } catch (error) {
    process.stderr.write(`BLOCKED: ${error.message}\n`);
    process.exitCode = 2;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
