#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const DESIGN_BLOCK = [
  '  design:',
  '    gate: "node scripts/codex-plugin-runner.mjs acceptance-gate design-gate"',
  '    ui_check: "node scripts/codex-plugin-runner.mjs acceptance-gate design-scan"',
  '    static: "node scripts/codex-plugin-runner.mjs design-loop design-static-check"',
  '    fidelity: "node scripts/codex-plugin-runner.mjs design-loop design-fidelity-diff"',
];

function usage(message) {
  if (message) process.stderr.write(`${message}\n`);
  process.stderr.write('Usage: design-config-patch.mjs [--config <path>] [--surface-globs "<g1>,<g2>"] [--write]\n');
  process.exit(4);
}

function parseArgs(argv) {
  const args = { config: '_acceptance/config.yaml', surfaceGlobs: null, write: false };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--config') args.config = argv[++index];
    else if (token === '--surface-globs') args.surfaceGlobs = argv[++index];
    else if (token === '--write') args.write = true;
    else usage(`Unknown argument: ${token}`);
  }
  if (!args.config) usage('Missing --config value');
  return args;
}

function nextTopLevel(lines, start) {
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.trim() === '' || line.startsWith('#')) continue;
    if (/^[^\s#]/.test(line)) return index;
  }
  return lines.length;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const configPath = path.resolve(args.config);
  if (!fs.existsSync(configPath)) usage(`[design-init] config not found: ${configPath}`);

  const original = fs.readFileSync(configPath, 'utf8');
  const lines = original.split('\n');
  const changes = [];

  const executorsIndex = lines.findIndex((line) => /^executors:\s*$/.test(line));
  if (executorsIndex < 0) usage('[design-init] no `executors:` block found');
  const executorsEnd = nextTopLevel(lines, executorsIndex);
  const hasExecutorDesign = lines
    .slice(executorsIndex + 1, executorsEnd)
    .some((line) => /^  design:\s*$/.test(line));

  if (!hasExecutorDesign) {
    let insertAt = executorsEnd;
    while (insertAt - 1 > executorsIndex && lines[insertAt - 1].trim() === '') insertAt -= 1;
    lines.splice(insertAt, 0, ...DESIGN_BLOCK);
    changes.push('ADD executors.design runner-backed commands');
  } else {
    changes.push('executors.design already present');
  }

  if (args.surfaceGlobs) {
    const hasTopDesign = lines.some((line) => /^design:\s*$/.test(line));
    if (!hasTopDesign) {
      const globs = args.surfaceGlobs.split(',').map((value) => value.trim()).filter(Boolean);
      if (globs.length === 0) usage('No usable --surface-globs values');
      lines.push('design:', `  surface_globs: [${globs.join(', ')}]`);
      changes.push(`ADD design.surface_globs [${globs.join(', ')}]`);
    } else {
      changes.push('design.surface_globs already present');
    }
  } else {
    changes.push('design.surface_globs not requested');
  }

  const beforeProtected = original.split('\n').filter((line) => line.includes('smoke_sv_design')).join('\n');
  const afterProtected = lines.filter((line) => line.includes('smoke_sv_design')).join('\n');
  if (beforeProtected !== afterProtected) {
    process.stderr.write('[design-init] ABORT: would alter smoke_sv_design\n');
    process.exit(2);
  }

  const next = lines.join('\n');
  process.stdout.write('── Codex design-init plan ──\n');
  for (const change of changes) process.stdout.write(`  • ${change}\n`);
  if (next === original) {
    process.stdout.write('Already wired — nothing to change.\n');
    return;
  }

  if (!args.write) {
    for (const line of DESIGN_BLOCK) process.stdout.write(`  + ${line}\n`);
    process.stdout.write('(dry-run) re-run with --write to apply.\n');
    return;
  }

  fs.copyFileSync(configPath, `${configPath}.bak`);
  fs.writeFileSync(configPath, next, 'utf8');
  process.stdout.write(`written with runner-backed paths · backup: ${path.basename(configPath)}.bak\n`);
}

main();
