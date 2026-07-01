#!/usr/bin/env node
// design-static-check.mjs — BLOCKING fidelity layer (config:executors.design.static).
//
// Enforces the hard design rules the acceptance-gate P0 legibility floor does NOT
// cover (p-tiers.json drops design-system color/font/radius). Runs in the APP repo
// over ported plugin-view sources, so it is added to feature_loop.suite_keys and
// blocks every S4 round.
//
//   v0.1 ENFORCED: token-only — no raw hex colour literal outside the token layer
//                  (--_* / --color-* class tokens; CLAUDE.md "no hex cứng").
//   v0.1 PENDING (declared, NOT silently passed): tap-target >=44px, contrast-AA.
//                  These need computed/rendered DOM; for now delegated to the P0
//                  gate + Gate-2 human glance. Surfaced in `pending_checks` so a
//                  green verdict never implies they were machine-verified.
//
// Hook-legal evidence: run_id, verifier, verified_at, verdict, exit_code.
// Exit: 0 PASS · 2 REJECT · 3 BLOCKED · 4 bad usage.
//
// Usage: node design-static-check.mjs <dir-or-file> [--slug <slug>]

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

function emit(o, code) { process.stdout.write(JSON.stringify(o, null, 2) + '\n'); process.exit(code); }

const argv = process.argv.slice(2);
let target = null, slug = null;
for (let i = 0; i < argv.length; i++) { const t = argv[i]; if (t === '--slug') slug = argv[++i]; else if (!t.startsWith('--')) target = t; }

const base = {
  run_id: 'design-static-' + crypto.randomBytes(5).toString('hex'),
  verifier: 'design-loop/scripts/design-static-check.mjs',
  verified_at: new Date().toISOString(),
  target, slug,
  pending_checks: ['tap-target>=44px', 'contrast-AA-ratio'],
};

if (!target) emit({ ...base, verdict: 'BLOCKED', reason: 'no target dir/file given', exit_code: 4 }, 4);
if (!fs.existsSync(target)) emit({ ...base, verdict: 'BLOCKED', reason: `target not found: ${target}`, exit_code: 3 }, 3);

const exts = new Set(['.tsx', '.ts', '.jsx', '.js', '.css']);
function walk(p, acc) {
  const st = fs.statSync(p);
  if (st.isDirectory()) { for (const f of fs.readdirSync(p)) { if (f === 'node_modules' || f.startsWith('.')) continue; walk(path.join(p, f), acc); } }
  else if (exts.has(path.extname(p))) acc.push(p);
  return acc;
}
const files = walk(target, []);

// token-only: raw hex colour literals outside CSS-var declarations / comments.
const HEX = /#[0-9a-fA-F]{3,8}\b/g;
const violations = [];
for (const f of files) {
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  lines.forEach((ln, i) => {
    const t = ln.trim();
    if (t.startsWith('//') || t.startsWith('*') || t.startsWith('/*')) return; // comment
    if (/--[\w-]+\s*:/.test(ln)) return; // a token DEFINITION is the token layer
    const m = ln.match(HEX);
    if (m) violations.push({ file: path.relative(process.cwd(), f), line: i + 1, snippet: t.slice(0, 120), matched: m });
  });
}

if (violations.length) {
  emit({ ...base, verdict: 'REJECT', rule: 'token-only', reason: `${violations.length} raw hex colour literal(s) outside the token layer — use --_* / --color-* class tokens`, violations: violations.slice(0, 25), exit_code: 2 }, 2);
}
emit({ ...base, verdict: 'PASS', rule: 'token-only', files_scanned: files.length, note: 'token-only passed; pending_checks are NOT machine-verified here (P0 gate + Gate-2 glance cover them)', exit_code: 0 }, 0);
