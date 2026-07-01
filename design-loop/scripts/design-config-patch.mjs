#!/usr/bin/env node
// design-config-patch.mjs — idempotent wirer behind /design-init.
//
// Adds executors.design.{gate,ui_check,static,fidelity} and appends
// executors.design.static to feature_loop.suite_keys in _acceptance/config.yaml.
//
// TEXT-based on purpose: the acceptance-gate hook parses config.yaml line-by-line
// with 2-space indentation, so we splice lines rather than round-trip a YAML lib
// (which would reformat and break that parser). Append-only-when-absent; never
// rewrites or removes existing keys.
//
// SAFETY: executors.script.smoke_sv_design is LEFT UNTOUCHED — it is a live key
// referenced by _acceptance/v3-m3/evals.yaml (5 refs). The script aborts if any
// edit would change a smoke_sv_design line.
//
// Default: DRY-RUN (print the plan + a diff, write nothing). Pass --write to apply.
//
// Usage: node design-config-patch.mjs [--config <path>] [--write]
// Exit:  0 ok/dry-run · 2 refused (would touch protected key) · 4 bad usage/shape.

import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  const a = { config: '_acceptance/config.yaml', write: false };
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t === '--config') a.config = argv[++i];
    else if (t === '--write') a.write = true;
  }
  return a;
}

// Executor commands reach BOTH plugins through ${CLAUDE_PLUGIN_ROOT}: acceptance-gate's
// plugin root is the kit root (marketplace source "./"), and design-loop lives at
// ./design-loop under it — so one variable resolves both without machine-absolute paths.
const DESIGN_BLOCK = [
  '  design:',
  '    gate: "node ${CLAUDE_PLUGIN_ROOT}/scripts/design-gate.mjs"',
  '    ui_check: "${CLAUDE_PLUGIN_ROOT}/scripts/design-scan.js"',
  '    static: "node ${CLAUDE_PLUGIN_ROOT}/design-loop/scripts/design-static-check.mjs"',
  '    fidelity: "node ${CLAUDE_PLUGIN_ROOT}/design-loop/scripts/design-fidelity-diff.mjs"',
];
const SUITE_KEY = '    - executors.design.static';

function nextTopLevel(lines, startIdx) {
  for (let i = startIdx + 1; i < lines.length; i++) {
    const l = lines[i];
    if (l.trim() === '' || l.startsWith('#')) continue;
    if (/^[^\s#]/.test(l)) return i;
  }
  return lines.length;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const cfgPath = path.resolve(args.config);
  if (!fs.existsSync(cfgPath)) {
    console.error(`[design-init] config not found: ${cfgPath}\n  Run /acceptance-init first.`);
    process.exit(4);
  }
  const orig = fs.readFileSync(cfgPath, 'utf8');
  const out = orig.split('\n');
  const changes = [];
  let addedDesign = false;
  let addedSuite = false;

  // 1) executors.design block
  const execIdx = out.findIndex((l) => /^executors:\s*$/.test(l));
  if (execIdx < 0) {
    console.error('[design-init] no `executors:` block found — unexpected config shape. Aborting.');
    process.exit(4);
  }
  const execEnd = nextTopLevel(out, execIdx);
  const hasDesign = out.slice(execIdx + 1, execEnd).some((l) => /^  design:\s*$/.test(l));
  if (hasDesign) {
    changes.push('executors.design: already present — skipped (idempotent).');
  } else {
    let ins = execEnd;
    while (ins - 1 > execIdx && out[ins - 1].trim() === '') ins--;
    out.splice(ins, 0, ...DESIGN_BLOCK);
    changes.push('ADD executors.design.{gate,ui_check,static,fidelity}');
    addedDesign = true;
  }

  // 2) feature_loop.suite_keys += executors.design.static
  const flIdx = out.findIndex((l) => /^feature_loop:\s*$/.test(l));
  if (flIdx < 0) {
    changes.push('WARN: no `feature_loop:` block — static-check will not run per-round until it exists.');
  } else {
    const skIdx = out.findIndex((l, i) => i > flIdx && /^  suite_keys:\s*$/.test(l));
    if (skIdx < 0) {
      changes.push('WARN: feature_loop present but no suite_keys — skipped.');
    } else {
      let last = skIdx;
      const items = [];
      for (let i = skIdx + 1; i < out.length; i++) {
        if (/^    -\s/.test(out[i])) { last = i; items.push(out[i].trim()); }
        else if (out[i].trim() === '') continue;
        else break;
      }
      if (items.includes('- executors.design.static')) {
        changes.push('suite_keys already has executors.design.static — skipped.');
      } else {
        out.splice(last + 1, 0, SUITE_KEY);
        changes.push('APPEND executors.design.static to feature_loop.suite_keys');
        addedSuite = true;
      }
    }
  }

  // SAFETY: protected key untouched
  const smokeBefore = orig.split('\n').filter((l) => l.includes('smoke_sv_design')).join('\n');
  const smokeAfter = out.filter((l) => l.includes('smoke_sv_design')).join('\n');
  if (smokeBefore !== smokeAfter) {
    console.error('[design-init] ABORT: would alter smoke_sv_design (live key, referenced by v3-m3 evals). No changes written.');
    process.exit(2);
  }

  const newText = out.join('\n');
  console.log('── /design-init plan ──────────────────────────────');
  for (const c of changes) console.log('  •', c);
  console.log('───────────────────────────────────────────────────');
  if (newText === orig) {
    console.log('Already wired — nothing to change. ✔');
    return;
  }
  console.log('\nLines to ADD:');
  if (addedDesign) DESIGN_BLOCK.forEach((l) => console.log('  +', l));
  if (addedSuite) console.log('  +', SUITE_KEY, '   (under feature_loop.suite_keys)');

  if (args.write) {
    fs.copyFileSync(cfgPath, cfgPath + '.bak');
    fs.writeFileSync(cfgPath, newText, 'utf8');
    console.log(`\n✔ written · backup: ${path.basename(cfgPath)}.bak`);
    console.log('  Paths use ${CLAUDE_PLUGIN_ROOT} (kit root). If it does not resolve at verify time, re-run /design-init on this machine.');
  } else {
    console.log('\n(dry-run) re-run with --write to apply. smoke_sv_design left untouched.');
  }
}

main();
