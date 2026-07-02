#!/usr/bin/env node
// config-patch.mjs — THE single splice path for programmatic writes to
// _acceptance/config.yaml (e.g. feature-loop S4 auto-writing
// feature_loop.suite_keys).
//
// The kit's parsers (lib/evidence-core.js resolveConfigKey + the sed/awk in
// pre-merge-check.sh) are line/2-space-indent based — a YAML-lib round-trip
// would reformat and break them, and a free-hand agent edit can corrupt live
// keys. So: TEXT splice, append-only into the right block, ABORT when the key
// already exists (never overwrite a live value). Same discipline as
// design-loop/scripts/design-config-patch.mjs, generalized to one dotted key.
//
// Default: DRY-RUN (print the plan, write nothing). Pass --write to apply —
// backs up to <config>.bak first, and self-checks the result with the SAME
// resolver the hook uses (resolveConfigKey) before touching the file.
//
// Usage: node config-patch.mjs --key <dotted.key> --value <scalar|[inline,list]>
//                              [--config <path=_acceptance/config.yaml>] [--write]
// Exit:  0 ok/dry-run · 2 refused (key already exists) · 4 bad usage/shape.

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const requireCjs = createRequire(import.meta.url);
let core = null;
try { core = requireCjs('../lib/evidence-core.js'); } catch (_) { /* standalone copy — self-check degrades to a warning */ }

function parseArgs(argv) {
  const a = { config: '_acceptance/config.yaml', key: '', value: undefined, write: false };
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t === '--config') a.config = argv[++i];
    else if (t === '--key') a.key = argv[++i];
    else if (t === '--value') a.value = argv[++i];
    else if (t === '--write') a.write = true;
  }
  return a;
}

// End of the block owned by the key line at `indent` spaces: index of the
// first following non-blank, non-comment line indented <= indent.
function blockEnd(lines, idx, indent) {
  for (let i = idx + 1; i < lines.length; i++) {
    const l = lines[i];
    if (l.trim() === '' || l.trim().startsWith('#')) continue;
    if (l.length - l.trimStart().length <= indent) return i;
  }
  return lines.length;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.key || args.value === undefined || args.value === '') {
    console.error('[config-patch] usage: config-patch.mjs --key <dotted.key> --value <scalar> [--config <path>] [--write]');
    process.exit(4);
  }
  const parts = args.key.split('.');
  if (parts.some(p => !/^[\w-]+$/.test(p))) {
    console.error(`[config-patch] bad key "${args.key}" — dotted segments of [A-Za-z0-9_-] only`);
    process.exit(4);
  }
  const cfgPath = path.resolve(args.config);
  if (!fs.existsSync(cfgPath)) {
    console.error(`[config-patch] config not found: ${cfgPath} — run /acceptance-init first`);
    process.exit(4);
  }
  const orig = fs.readFileSync(cfgPath, 'utf8');
  const lines = orig.split('\n');

  // Walk the dotted key through 2-space blocks; stop at the first missing level.
  let searchStart = 0;
  let searchEnd = lines.length;
  let missingFrom = parts.length; // first level that does NOT exist yet
  for (let depth = 0; depth < parts.length; depth++) {
    const indent = depth * 2;
    const re = new RegExp('^' + ' '.repeat(indent) + parts[depth] + '\\s*:(.*)$');
    let foundIdx = -1;
    let rest = '';
    for (let i = searchStart; i < searchEnd; i++) {
      const l = lines[i];
      if (l.trim() === '' || l.trim().startsWith('#')) continue;
      const m = l.match(re);
      if (m) { foundIdx = i; rest = m[1]; break; }
    }
    if (foundIdx < 0) { missingFrom = depth; break; }
    if (depth === parts.length - 1) {
      console.error(`[config-patch] REFUSED: key "${args.key}" already exists (line ${foundIdx + 1}: ${lines[foundIdx].trim()}) — this tool is append-only; edit live keys by hand, in review.`);
      process.exit(2);
    }
    if (rest.replace(/#.*$/, '').trim() !== '') {
      console.error(`[config-patch] "${parts.slice(0, depth + 1).join('.')}" holds a scalar value — cannot nest "${args.key}" under it`);
      process.exit(4);
    }
    searchStart = foundIdx + 1;
    searchEnd = blockEnd(lines, foundIdx, indent);
  }

  // Splice the missing chain at the end of the innermost existing block
  // (backing over trailing blank lines, like design-config-patch).
  const added = [];
  for (let d = missingFrom; d < parts.length; d++) {
    added.push('  '.repeat(d) + parts[d] + (d === parts.length - 1 ? `: ${args.value}` : ':'));
  }
  let insertAt = searchEnd;
  while (insertAt - 1 >= searchStart && lines[insertAt - 1].trim() === '') insertAt--;
  const out = lines.slice();
  out.splice(insertAt, 0, ...added);
  const newText = out.join('\n');

  // Self-check with the SAME resolver the hook uses — never write a config
  // the enforcement layer cannot read back.
  if (core) {
    const resolved = core.resolveConfigKey(newText, args.key);
    if (resolved == null) {
      console.error(`[config-patch] ABORT: spliced text does not resolve "${args.key}" via evidence-core (2-space schema violated?) — nothing written`);
      process.exit(4);
    }
  } else {
    console.error('[config-patch] warning: lib/evidence-core.js not found next to scripts/ — resolve self-check skipped');
  }

  console.log('── config-patch plan ──────────────────────────────');
  console.log(`  file: ${cfgPath}`);
  added.forEach(l => console.log('  +', l));
  console.log('───────────────────────────────────────────────────');
  if (args.write) {
    fs.copyFileSync(cfgPath, cfgPath + '.bak');
    fs.writeFileSync(cfgPath, newText, 'utf8');
    console.log(`✔ written · backup: ${path.basename(cfgPath)}.bak`);
  } else {
    console.log('(dry-run) re-run with --write to apply.');
  }
}

main();
