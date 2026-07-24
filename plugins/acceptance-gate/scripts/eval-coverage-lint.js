#!/usr/bin/env node
/**
 * eval-coverage-lint.js — ADVISORY coverage lint for the Acceptance-Gate Kit.
 *
 * Usage: eval-coverage-lint.js <repo_root> [--slug <slug>]...
 *        eval-coverage-lint.js --files <contract.md> <evals.yaml>
 *
 * Given/When/Then criteria are structurally POSITIVE — naive eval-gen produces
 * an all-should-fire suite that is green by construction and silent on the
 * suppression / rejection half (the case a hot-lead alert or an RLS feature is
 * most likely to break). This lint mechanically surfaces that gap at Gate 1:
 *
 *   W1  a threshold/boundary AC (a number, a window, ≥/≤/<>, "ngưỡng/biên")
 *       whose evals carry NO should-NOT-fire / boundary assertion in `expected`
 *       (content, not count — one eval that brackets the boundary is fine)
 *   W3  an "Out of scope" section with bullets but ZERO negative evals anywhere
 *       (the deliberately-excluded behaviour is documentation nobody evaluates)
 *   W4  a criterion tagged (cross-layer) whose evals include NO member with
 *       `layer: backend-effect` (UI-only evidence for a UI→API→backend path;
 *       executor-type alone is spoofable by design-gate/VLM `script` evals)
 *
 * ADVISORY by design: NL detection is fuzzy, so this never hard-blocks — it
 * exits 1 when it has warnings so a human reads them at Gate 1 (a repo MAY wire
 * it into CI as a soft gate). judgment ACs are exempt (subjective, no mechanical
 * boundary). Fail-open on read/parse error (never block the gate on a lint bug).
 */
'use strict';
const fs = require('fs');
const path = require('path');

// ─── Detectors (intentionally generous; advisory) ───────────────────────────

// A criterion that has a boundary worth bracketing: a comparator, a threshold
// word, or a number adjacent to a unit/window (avoids matching "v1" / "AC-2").
const THRESHOLD_RE =
  /[≥≤]|[<>]=?|\bthreshold\b|ngưỡng|nguong|\bbiên\b|\bbien\b|\bwindow\b|cửa sổ|cua so|\b\d+\s*(ngày|ngay|giờ|gio|phút|phut|tuần|tuan|lần|lan|%|row|touch|px)\b|\b\d+[dhm]\b|\b(trong|sau|mỗi|moi|quá|qua|>=|<=|tối thiểu|toi thieu|ít nhất|it nhat)\s*\d/i;

// A should-NOT-fire / boundary / absence assertion lives in an eval's expected.
const NEG_RE =
  /\bKHÔNG\b|\bkhông\b|\bkhong\b|\bNOT\b|reject|denied|\bdeny\b|từ chối|tu choi|\b0\s*(row|touch|rows)\b|rỗng|\brong\b|\bn-a\b|\bn\/a\b|\bbiên\b|\bbien\b|dưới ngưỡng|duoi nguong|just[- ]?below|should[- ]?not|không tăng|khong tang|không ghi|khong ghi|không fire|khong fire|không kích hoạt|khong kich hoat|suppress|absent|vắng|vang|out of scope|negative|invalid|malformed|spoof|cross[- ]?tenant/i;

// ─── Parsers (line-based on purpose — no YAML/MD lib, mirror the hooks) ───────

function sectionLines(text, headingRe) {
  const out = [];
  let inSec = false;
  for (const line of text.split('\n')) {
    if (/^#{1,6}\s/.test(line)) inSec = headingRe.test(line);
    else if (inSec) out.push(line);
  }
  return out;
}

function parseACs(contractText) {
  const acs = [];
  for (const line of sectionLines(contractText, /^#{1,6}\s+Criteria\b/i)) {
    const m = line.match(/^\s*[-*]\s*(AC-\d+)\s*[:.]\s*(.+)$/);
    if (m) acs.push({ id: m[1], text: m[2], judgment: /\(judgment\)/i.test(m[2]), crossLayer: /\(cross-layer\)/i.test(m[2]) });
  }
  return acs;
}

function outOfScopeBullets(contractText) {
  return sectionLines(contractText, /^#{1,6}\s+Out[- ]of[- ]?scope\b/i)
    .filter(l => /^\s*[-*]\s+\S/.test(l)).length;
}

function parseEvals(evalsText) {
  const evals = [];
  let cur = null;
  for (const raw of evalsText.split('\n')) {
    const line = raw.replace(/\t/g, '  ');
    const idM = line.match(/^\s*-\s+id:\s*(.+)$/);
    if (idM) { if (cur) evals.push(cur); cur = { id: idM[1].trim(), criterion: '', expected: '', executor: '', layer: '' }; continue; }
    if (!cur) continue;
    const cM = line.match(/^\s*criterion:\s*(.+)$/);
    if (cM) cur.criterion = cM[1].trim().replace(/^["']|["']$/g, '');
    const eM = line.match(/^\s*expected:\s*(.+)$/);
    if (eM) cur.expected = eM[1].trim().replace(/^["']|["']$/g, '');
    const xM = line.match(/^\s*executor:\s*(.+)$/);
    if (xM) cur.executor = xM[1].trim().replace(/^["']|["']$/g, '');
    const lM = line.match(/^\s*layer:\s*(.+)$/);
    if (lM) cur.layer = lM[1].trim().replace(/^["']|["']$/g, '');
  }
  if (cur) evals.push(cur);
  return evals;
}

// ─── Lint one feature ────────────────────────────────────────────────────────

function lintFeature(slug, contractText, evalsText) {
  const warns = [];
  const acs = parseACs(contractText);
  const evals = parseEvals(evalsText);
  const evalsFor = id => evals.filter(e => e.criterion === id);
  const hasNeg = es => es.some(e => NEG_RE.test(e.expected));

  for (const ac of acs) {
    if (ac.judgment) continue;               // subjective — no mechanical boundary
    if (!THRESHOLD_RE.test(ac.text)) continue;
    const es = evalsFor(ac.id);
    if (!es.length) continue;                // zero-eval is the existing ≥1-eval Gate-1 rule's job
    // Content, not count: ONE eval whose `expected` brackets the boundary is fine;
    // N evals that only ever assert the happy path is the demo-driven trap.
    if (!hasNeg(es)) {
      warns.push(`[${slug}] W1 ${ac.id} is a threshold/boundary criterion but none of its ${es.length} eval(s) assert a should-NOT-fire / boundary case (no negative marker in 'expected') — add a just-below (suppress) case.`);
    }
  }

  // W4 — cross-layer pairing (tag-keyed, deterministic): a criterion tagged
  // (cross-layer) whose evals carry NO `layer: backend-effect` member has
  // UI-only evidence for a cross-layer path. Executor-type alone is NOT enough
  // (rule-2b design-gate scripts / VLM wrappers are `script` too) — the layer
  // field is the machine-readable pairing anchor.
  for (const ac of acs) {
    if (!ac.crossLayer) continue;
    const es = evalsFor(ac.id);
    if (!es.length) continue;              // zero-eval is the existing ≥1-eval Gate-1 rule's job
    if (!es.some(e => e.layer === 'backend-effect')) {
      warns.push(`[${slug}] W4 ${ac.id} is tagged (cross-layer) but none of its ${es.length} eval(s) declares layer: backend-effect — UI-only evidence for a cross-layer criterion; add ≥1 test/script eval asserting the backend effect.`);
    }
  }

  const oos = outOfScopeBullets(contractText);
  const negCount = evals.filter(e => NEG_RE.test(e.expected)).length;
  if (oos > 0 && negCount === 0) {
    warns.push(`[${slug}] W3 Out-of-scope lists ${oos} item(s) but evals.yaml has ZERO negative/should-NOT-fire evals — the suppression half is untested. Turn the boundary into evals or confirm it is genuinely unobservable.`);
  }
  return warns;
}

// ─── Main ────────────────────────────────────────────────────────────────────

function readSafe(p) { try { return fs.readFileSync(p, 'utf8'); } catch (_) { return null; } }

function run(argv) {
  let root = '.';
  const slugs = [];
  let filesMode = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--slug') { slugs.push(argv[++i]); }
    else if (argv[i] === '--files') { filesMode = [argv[++i], argv[++i]]; }
    else root = argv[i];
  }

  const warns = [];
  if (filesMode) {
    const [c, e] = filesMode.map(readSafe);
    if (c == null || e == null) { console.log('eval-coverage-lint: contract/evals file unreadable — skipping (advisory)'); return 0; }
    warns.push(...lintFeature('files', c, e));
  } else {
    const acc = path.join(root, '_acceptance');
    let dirs;
    try { dirs = fs.readdirSync(acc, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name); }
    catch (_) { console.log('eval-coverage-lint: no _acceptance/ — nothing to lint'); return 0; }
    const targets = slugs.length ? slugs : dirs;
    for (const slug of targets) {
      const c = readSafe(path.join(acc, slug, 'contract.md'));
      const e = readSafe(path.join(acc, slug, 'evals.yaml'));
      if (c == null || e == null) continue; // pre-eval-gen feature → nothing to lint
      warns.push(...lintFeature(slug, c, e));
    }
  }

  if (!warns.length) { console.log('eval-coverage-lint: no coverage gaps detected.'); return 0; }
  console.log(`eval-coverage-lint: ${warns.length} coverage warning(s) — ADVISORY, review at Gate 1 (not auto-blocking):\n`);
  for (const w of warns) console.log('  ' + w);
  console.log('\nW1 = a bounded/threshold criterion needs a just-below should-NOT-fire (boundary) eval; W3 = give the out-of-scope half real negative evals; W4 = a (cross-layer) criterion needs a paired layer: backend-effect eval.');
  return 1;
}

try { process.exit(run(process.argv.slice(2))); }
catch (err) { console.error('[eval-coverage-lint] internal error (fail-open): ' + err.message); process.exit(0); }
