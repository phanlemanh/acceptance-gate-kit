#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const GATE_RE = /(^|[\\/])_acceptance[\\/][^\\/]+[\\/](contract|evidence-report)\.md$/i;
const VISIBLE_GATE_RE = /_acceptance[\\/][^\\/]+[\\/](contract|evidence-report)\.md/i;

function block(message) {
  process.stderr.write(`BLOCKED by acceptance-evidence-gate (Codex patch adapter)\n${message}\n`);
  process.exit(2);
}

function inside(root, candidate) {
  return candidate === root || candidate.startsWith(`${root}${path.sep}`);
}

function resolveTarget(cwd, relative) {
  const target = path.resolve(cwd, relative);
  if (!inside(cwd, target)) throw new Error(`path traversal outside session cwd: ${relative}`);
  return target;
}

function parsePatch(command, cwd) {
  const lines = String(command || '').replace(/\r\n/g, '\n').split('\n');
  if (lines[0] !== '*** Begin Patch') throw new Error('missing *** Begin Patch');
  const operations = [];
  let index = 1;

  while (index < lines.length) {
    if (lines[index] === '*** End Patch') return operations;
    const header = lines[index].match(/^\*\*\* (Add|Update|Delete) File: (.+)$/);
    if (!header) throw new Error(`unsupported patch line: ${lines[index]}`);
    const operation = {
      type: header[1],
      source: resolveTarget(cwd, header[2]),
      target: null,
      body: [],
    };
    operation.target = operation.source;
    index += 1;

    if (operation.type === 'Update' && lines[index]?.startsWith('*** Move to: ')) {
      operation.target = resolveTarget(cwd, lines[index].slice('*** Move to: '.length));
      index += 1;
    }

    while (index < lines.length && !/^\*\*\* (Add|Update|Delete) File: /.test(lines[index]) && lines[index] !== '*** End Patch') {
      operation.body.push(lines[index]);
      index += 1;
    }
    operations.push(operation);
  }
  throw new Error('missing *** End Patch');
}

function findSequence(source, expected, start) {
  if (expected.length === 0) return start;
  for (let index = start; index <= source.length - expected.length; index += 1) {
    let matches = true;
    for (let offset = 0; offset < expected.length; offset += 1) {
      if (source[index + offset] !== expected[offset]) {
        matches = false;
        break;
      }
    }
    if (matches) return index;
  }
  return -1;
}

function applyUpdate(original, body) {
  const trailingNewline = original.endsWith('\n');
  const source = original.split('\n');
  if (trailingNewline) source.pop();
  const hunks = [];
  let current = null;

  for (const line of body) {
    if (line.startsWith('@@')) {
      current = [];
      hunks.push(current);
      continue;
    }
    if (!current) {
      if (line === '') continue;
      throw new Error('update content before first hunk');
    }
    if (line === '*** End of File') continue;
    if (![' ', '+', '-'].includes(line[0])) throw new Error(`unsupported hunk line: ${line}`);
    current.push(line);
  }
  if (hunks.length === 0) throw new Error('update has no hunks');

  const output = [];
  let cursor = 0;
  for (const hunk of hunks) {
    const oldLines = [];
    const newLines = [];
    for (const line of hunk) {
      if (line[0] === ' ' || line[0] === '-') oldLines.push(line.slice(1));
      if (line[0] === ' ' || line[0] === '+') newLines.push(line.slice(1));
    }
    const found = findSequence(source, oldLines, cursor);
    if (found < 0) throw new Error(`cannot reconstruct hunk; old content not found: ${oldLines.join(' | ')}`);
    output.push(...source.slice(cursor, found), ...newLines);
    cursor = found + oldLines.length;
  }
  output.push(...source.slice(cursor));
  return `${output.join('\n')}${trailingNewline ? '\n' : ''}`;
}

function enforcementFor(filePath) {
  let directory = path.dirname(filePath);
  while (directory !== path.dirname(directory)) {
    if (path.basename(directory) === '_acceptance') {
      const config = path.join(directory, 'config.yaml');
      try {
        const match = fs.readFileSync(config, 'utf8').match(/^enforcement\s*:\s*(strict|warn|off)\b/m);
        return match?.[1] || 'strict';
      } catch {
        return 'strict';
      }
    }
    directory = path.dirname(directory);
  }
  return 'strict';
}

function handleDelete(filePath) {
  if (process.env.ACCEPTANCE_GATE_BYPASS === '1') return;
  const enforcement = enforcementFor(filePath);
  if (enforcement === 'off') return;
  if (enforcement === 'warn') {
    process.stderr.write(`WARNING: deleting acceptance gate file under enforcement: warn: ${filePath}\n`);
    return;
  }
  block(`strict mode refuses deletion of gate file: ${filePath}`);
}

function legacyHookPath() {
  const packaged = path.join(__dirname, 'acceptance-evidence-gate.js');
  if (fs.existsSync(packaged)) return packaged;
  return path.resolve(__dirname, '../../../hooks/acceptance-evidence-gate.js');
}

function evaluate(filePath, content) {
  const payload = JSON.stringify({
    tool_name: 'Write',
    tool_input: { file_path: filePath, content },
  });
  const result = spawnSync(process.execPath, [legacyHookPath()], {
    input: payload,
    encoding: 'utf8',
    env: process.env,
  });
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error) block(`legacy evidence evaluator failed to start: ${result.error.message}`);
  if (result.status === 2) process.exit(2);
  if (result.status !== 0) block(`legacy evidence evaluator exited ${result.status}`);
}

let input = '';
process.stdin.on('data', (chunk) => { input += chunk; });
process.stdin.on('end', () => {
  let event;
  try {
    event = JSON.parse(input || '{}');
  } catch (error) {
    block(`invalid hook JSON: ${error.message}`);
  }
  if (event.tool_name !== 'apply_patch') process.exit(0);

  const command = String(event.tool_input?.command || '');
  const cwd = path.resolve(event.cwd || process.cwd());
  let operations;
  try {
    operations = parsePatch(command, cwd);
  } catch (error) {
    if (VISIBLE_GATE_RE.test(command)) block(`cannot reconstruct gate-file patch: ${error.message}`);
    process.exit(0);
  }

  const virtual = new Map();
  for (const operation of operations) {
    const sourceIsGate = GATE_RE.test(operation.source);
    const targetIsGate = GATE_RE.test(operation.target);
    if (!sourceIsGate && !targetIsGate) continue;

    if (operation.type === 'Delete') {
      handleDelete(operation.source);
      continue;
    }

    let content;
    try {
      if (operation.type === 'Add') {
        if (operation.body.some((line) => !line.startsWith('+'))) throw new Error('Add File lines must start with +');
        content = `${operation.body.map((line) => line.slice(1)).join('\n')}\n`;
      } else {
        const original = virtual.has(operation.source)
          ? virtual.get(operation.source)
          : fs.readFileSync(operation.source, 'utf8');
        content = applyUpdate(original, operation.body);
        if (sourceIsGate && operation.target !== operation.source && !targetIsGate) handleDelete(operation.source);
      }
    } catch (error) {
      block(`cannot reconstruct gate-file hunk: ${error.message}`);
    }

    virtual.set(operation.target, content);
    if (targetIsGate) evaluate(operation.target, content);
  }
  process.exit(0);
});
