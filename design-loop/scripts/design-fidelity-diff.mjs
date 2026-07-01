#!/usr/bin/env node
// design-fidelity-diff.mjs — ADVISORY pixel-diff layer (config:executors.design.fidelity).
//
// NEVER blocks (always exit 0, verdict ADVISORY). Thin app-repo wrapper that shells
// to the DESIGN repo's own diff stack (npm run diff:all) — resolved from the slug's
// provenance.json — comparing design-of-record reference captures vs implemented
// captures. It is added to the slug's evals.yaml as an advisory eval (fail_on empty),
// NOT to feature_loop.suite_keys, so it reports but never fails a round. Pixel-diff
// is "shows where to look"; the human onion-skin glance at Gate 2 is the arbiter.
//
// Usage: node design-fidelity-diff.mjs --slug <slug>
// Exit: always 0.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const argv = process.argv.slice(2);
let slug = null;
for (let i = 0; i < argv.length; i++) if (argv[i] === '--slug') slug = argv[++i];
function out(o) { process.stdout.write(JSON.stringify(o, null, 2) + '\n'); }

const base = { verifier: 'design-loop/scripts/design-fidelity-diff.mjs', verdict: 'ADVISORY', slug, verified_at: new Date().toISOString() };
if (!slug) { out({ ...base, note: 'no --slug; nothing to diff' }); process.exit(0); }

const prov = path.resolve('_acceptance', slug, 'design', 'provenance.json');
if (!fs.existsSync(prov)) { out({ ...base, note: 'no provenance.json — run /design-mockup to capture the design-of-record reference first (advisory: skipped, not a failure)' }); process.exit(0); }

const rec = JSON.parse(fs.readFileSync(prov, 'utf8'));
const designRepo = rec.design_repo;
if (!designRepo || String(designRepo).startsWith('(') || !fs.existsSync(designRepo)) {
  out({ ...base, note: `design_repo not resolvable (${designRepo}) — set it in provenance.json to enable pixel-diff. Advisory-only, never blocks.` });
  process.exit(0);
}
try {
  // TODO(v0.2): pass reference/impl dirs + breakpoints (rec.breakpoints) through to diff:all.
  const res = execFileSync('npm', ['run', 'diff:all'], { cwd: designRepo, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  out({ ...base, note: 'ran design-repo diff:all (advisory)', design_repo: designRepo, output_tail: res.split('\n').slice(-8).join('\n') });
} catch (e) {
  out({ ...base, note: 'design-repo diff:all not runnable here (advisory, non-fatal)', error: String(e.message || e).slice(0, 200) });
}
process.exit(0);
