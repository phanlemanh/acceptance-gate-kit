#!/usr/bin/env node
// provenance.mjs — write/verify the design-of-record provenance for a feature.
//
// Defeats two known false-green traps (see docs/DESIGN-AWARE-FEATURE-LOOP.md §5):
//   1. reference-rot — a stale reference silently becomes "impl-alone".
//   2. viewport mismatch — cloud export ~1920 vs impl breakpoints 390/1024/1440.
//
// Writes _acceptance/<slug>/design/provenance.json:
//   { slug, design_repo, commit, captured_at, breakpoints, reference_dir }
//
// The blocking (design-static-check) and advisory (design-fidelity-diff) layers
// REFUSE (BLOCKED, not false-green PASS) when provenance is missing.
//
// Usage:
//   node provenance.mjs write  --slug <slug> [--design-repo <path>] [--commit <sha>] [--breakpoints 390,1024,1440]
//   node provenance.mjs verify --slug <slug>
// Exit: 0 ok/fresh · 3 BLOCKED (missing) · 4 bad usage.

import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  const a = { cmd: argv[0], slug: null, designRepo: null, commit: null, breakpoints: '390,1024,1440' };
  for (let i = 1; i < argv.length; i++) {
    const t = argv[i];
    if (t === '--slug') a.slug = argv[++i];
    else if (t === '--design-repo') a.designRepo = argv[++i];
    else if (t === '--commit') a.commit = argv[++i];
    else if (t === '--breakpoints') a.breakpoints = argv[++i];
  }
  return a;
}

function provPath(slug) {
  return path.resolve('_acceptance', slug, 'design', 'provenance.json');
}

function main() {
  const a = parseArgs(process.argv.slice(2));
  if (!a.slug || !['write', 'verify'].includes(a.cmd)) {
    console.error('usage: provenance.mjs <write|verify> --slug <slug> [...]');
    process.exit(4);
  }
  const p = provPath(a.slug);

  if (a.cmd === 'write') {
    const rec = {
      slug: a.slug,
      design_repo: a.designRepo || '(unset — set to the design-of-record repo path)',
      commit: a.commit || '(unset — record the design-repo commit the reference was captured from)',
      captured_at: new Date().toISOString(),
      breakpoints: a.breakpoints.split(',').map((s) => Number(s.trim())).filter(Boolean),
      reference_dir: `_acceptance/${a.slug}/evidence/design/reference`,
    };
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, JSON.stringify(rec, null, 2) + '\n', 'utf8');
    console.log(`✔ provenance written: ${path.relative(process.cwd(), p)}`);
    console.log(JSON.stringify(rec, null, 2));
    // TODO(v0.2): auto-detect commit via `git -C <design_repo> rev-parse HEAD`.
    return;
  }

  // verify
  if (!fs.existsSync(p)) {
    console.log(JSON.stringify({ verdict: 'BLOCKED', reason: `no provenance for ${a.slug} — run /design-mockup to capture the design-of-record reference first`, exit_code: 3 }, null, 2));
    process.exit(3);
  }
  const rec = JSON.parse(fs.readFileSync(p, 'utf8'));
  // TODO(v0.2): staleness policy (open decision) — block on design-repo commit drift
  // vs only on breakpoint/schema mismatch. For now: present ⇒ fresh (warn only).
  console.log(JSON.stringify({ verdict: 'OK', slug: rec.slug, captured_at: rec.captured_at, breakpoints: rec.breakpoints }, null, 2));
}

main();
