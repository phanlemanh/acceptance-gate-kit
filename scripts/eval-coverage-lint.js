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
 *   W5  a contract whose `surfaces:` include mobile but carries no
 *       "Mobile backend target: local|staging|mock" line — the Gate-1 human
 *       cannot eyeball the V4 (mock-vs-real) risk of the paired backend eval
 *   W6  a contract whose prose uses an alias the repo's own CONTEXT.md lists
 *       under `_Avoid_` — the requirement is being written in vocabulary the
 *       team already ruled out, so the eval will faithfully test the wrong
 *       reading. Silent in repos with no CONTEXT.md (opt-in by construction).
 *   W7  a line that LOOKS like a criterion but did not parse — every warning
 *       above runs on the AC set this file managed to read, so a dropped line
 *       silently deletes its own coverage check. W7 is the arm that makes the
 *       set itself auditable; it fires BEFORE W1 because a short set makes
 *       every other verdict unsound.
 *
 * ADVISORY by design: NL detection is fuzzy, so this never hard-blocks — it
 * exits 1 when it has warnings so a human reads them at Gate 1 (a repo MAY wire
 * it into CI as a soft gate). judgment ACs are exempt (subjective, no mechanical
 * boundary). Fail-open on read/parse error (never block the gate on a lint bug).
 */
'use strict';
const fs = require('fs');
const path = require('path');

// Shared CONTEXT.md parser — vendored beside this script in the plugin package
// (same arrangement as recheck-evidence.cjs + lib/evidence-core.cjs). Missing lib
// => W6 simply never fires; the other warnings are unaffected.
let glossaryLib = null;
try { glossaryLib = require(path.join(__dirname, '..', 'lib', 'context-glossary.js')); } catch (_) {}

// Parser evals.yaml dùng chung với gate-card.js (block-scalar aware — khuôn
// eval-gen viết `expected: >`, regex một-dòng cũ bắt ">" nên W1/W3 bắn giả).
// Thiếu lib thì skip TO TIẾNG (advisory, fail-open) chứ không lint sai.
let evalYaml = null;
try { evalYaml = require(path.join(__dirname, '..', 'lib', 'eval-yaml.js')); } catch (_) {}

// Parser dòng criterion dùng chung với gate-card.js (lib/ac-line.cjs) — MỘT nơi
// quyết định "thế nào là một dòng criterion". Bản regex inline trước đây ở file
// này là bản sao thứ hai của khuôn đó, và nó ĐÃ trôi: một nhãn chen giữa id và
// dấu hai chấm (`- AC-14 **(cross-layer)**: Given …`, `- AC-6 *(amended …)*: …`)
// không khớp, nên AC rơi khỏi W1/W4 mà KHÔNG một tiếng động — đúng điều kiện
// sinh lỗi mà lib/ac-line.cjs được tách ra để chặn ("Ai cần bóc dòng criterion
// thì require file này — không copy khuôn"). Đo trên một repo tiêu thụ (oneflow,
// 07/08/2026): 7 dòng ở 5 hợp đồng ĐÃ KÝ vô hình, 3 trong đó gắn (cross-layer)
// nên W4 chưa từng chạy cho chúng.
// Thiếu lib thì quay về khuôn cũ (advisory, fail-open) — hẹp nhưng không lint sai.
let acLine = null;
try { acLine = require(path.join(__dirname, '..', 'lib', 'ac-line.cjs')); } catch (_) {}

// ─── Detectors (intentionally generous; advisory) ───────────────────────────

// A criterion that has a boundary worth bracketing: a comparator, a threshold
// word, or a number adjacent to a unit/window (avoids matching "v1" / "AC-2").
const THRESHOLD_RE =
  /[≥≤]|[<>]=?|\bthreshold\b|ngưỡng|nguong|\bbiên\b|\bbien\b|\bwindow\b|cửa sổ|cua so|\b\d+\s*(ngày|ngay|giờ|gio|phút|phut|tuần|tuan|lần|lan|%|row|touch|px)\b|\b\d+[dhm]\b|\b(trong|sau|mỗi|moi|quá|qua|>=|<=|tối thiểu|toi thieu|ít nhất|it nhat)\s*\d/i;

// A should-NOT-fire / boundary / absence assertion lives in an eval's expected.
// "đối chứng dương" (positive control — thước phải IM trên vật nguyên vẹn) là
// từ vựng chuẩn của kit cho đúng ca should-not-fire trong eval kiểu-detector;
// thiếu nó NEG_RE bắn W1 giả trên mọi eval viết theo nếp nhà (đo thật: E2 của
// context-ladder — mutation→đỏ + đối chứng dương xanh, vẫn bị đòi ca âm).
const NEG_RE =
  /\bKHÔNG\b|\bkhông\b|\bkhong\b|\bNOT\b|reject|denied|\bdeny\b|từ chối|tu choi|\b0\s*(row|touch|rows)\b|rỗng|\brong\b|\bn-a\b|\bn\/a\b|\bbiên\b|\bbien\b|dưới ngưỡng|duoi nguong|just[- ]?below|should[- ]?not|không tăng|khong tang|không ghi|khong ghi|không fire|khong fire|không kích hoạt|khong kich hoat|suppress|absent|vắng|vang|out of scope|negative|invalid|malformed|spoof|cross[- ]?tenant|đối chứng dương|doi chung duong/i;

// ─── Parsers (line-based on purpose — no YAML/MD lib, mirror the hooks) ───────

// A section runs until the next heading at the SAME level or higher — a deeper
// sub-heading (`### nhóm phụ` inside `## Criteria`) is content, not a boundary.
// Exiting on any heading silently truncated the scan: every AC after the first
// sub-heading fell out of W1/W3/W4/W5's view.
function sectionLines(text, headingRe) {
  const out = [];
  let inSec = false;
  let secLevel = 0;
  for (const line of text.split('\n')) {
    const h = line.match(/^(#{1,6})\s/);
    if (h) {
      if (headingRe.test(line)) { inSec = true; secLevel = h[1].length; continue; }
      if (inSec && h[1].length <= secLevel) { inSec = false; continue; }
    }
    if (inSec) out.push(line);
  }
  return out;
}

// Field-value normalizer (line-based, mirrors the hooks' tolerance): a quoted
// value is taken verbatim up to its closing quote — a # inside quotes is DATA,
// not a comment; an unquoted value drops a trailing " # comment". Comments are
// never evidence: negative markers living only in a comment no longer satisfy
// W1/W3, and a commented `layer:` still pairs for W4.
function fieldVal(raw) {
  const s = raw.trim();
  const q = s[0];
  if (q === '"' || q === "'") {
    const end = s.indexOf(q, 1);
    if (end > 0) return s.slice(1, end);
  }
  return s.replace(/[ \t]+#.*$/, '').trim();
}

// Khuôn HẸP cũ, giữ lại CHỈ cho đường fail-open khi thiếu lib/ac-line.cjs.
// Đừng sửa nó cho khớp nhà mới — sửa lib/ac-line.cjs, đó là nguồn duy nhất.
const AC_LINE_NARROW_FALLBACK = /^\s*[-*]\s*(AC-\d+)\s*[:.]\s*(.+)$/;

function parseACs(contractText) {
  const acs = [];
  for (const line of sectionLines(contractText, /^#{1,6}\s+Criteria\b/i)) {
    if (acLine) {
      // parseAC() tự loại cross-reference (`**AC-5, AC-9 chưa có gì**`) và tự
      // tính CẢ HAI Dấu theo cùng một luật (nhãn đọc lỏng, thân bài chỉ nhận tag
      // đúng chữ, code span không tính) — một tiêu chí TRÍCH DẪN `(judgment)`
      // hay `(cross-layer)` không còn bị chấm như tiêu chí MANG Dấu đó.
      // crossLayer trước đây dò tại chỗ bằng regex trần trên `gwt`, nên hồ sơ
      // nào GIẢI THÍCH Dấu cross-layer đều tự bắn W4 giả (#36).
      const p = acLine.parseAC(line);
      if (p) acs.push({ id: p.id, text: p.gwt, judgment: p.judgment, crossLayer: p.crossLayer });
      continue;
    }
    const m = line.match(AC_LINE_NARROW_FALLBACK);
    if (m) acs.push({ id: m[1], text: m[2], judgment: /\(judgment\)/i.test(m[2]), crossLayer: /\(cross-layer\)/i.test(m[2]) });
  }
  return acs;
}

function outOfScopeBullets(contractText) {
  return sectionLines(contractText, /^#{1,6}\s+Out[- ]of[- ]?scope\b/i)
    .filter(l => /^\s*[-*]\s+\S/.test(l)).length;
}

// Delegated to lib/eval-yaml.js (shared with gate-card.js): block-scalar aware,
// and body lines are never key-scanned. executor is parsed-but-unused by W4 ON
// PURPOSE: the wave-2 hook (schema v3 evaluateNetwork) keys pairing enforcement
// off executor+layer — keep it as the machine-readable anchor, do not "clean it up".
function parseEvals(evalsText) {
  return evalYaml.parseEvals(evalsText, ['criterion', 'expected', 'executor', 'layer'], fieldVal);
}

// ─── Lint one feature ────────────────────────────────────────────────────────

function lintFeature(slug, contractText, evalsText, glossary) {
  const warns = [];
  const acs = parseACs(contractText);
  const evals = parseEvals(evalsText);
  const evalsFor = id => evals.filter(e => e.criterion === id);
  const hasNeg = es => es.some(e => NEG_RE.test(e.expected));

  // W7 — tập AC phải tự kiểm được, và nó đứng TRƯỚC mọi cảnh báo khác: W1/W3/W4
  // đều chạy trên `acs`, nên một dòng bị bỏ sót xoá luôn phần bảo vệ của chính
  // nó mà không để lại dấu vết. Đây chính là cách lỗi khuôn-hẹp sống sót qua 5
  // hợp đồng đã ký ở repo tiêu thụ: không ai đọc được cái mình không thấy.
  // Bộ dò sống ở lib/ac-line.cjs (dùng chung với gate-card.js) — nó đã tự loại
  // cross-reference nên contract lành không bị cry-wolf.
  if (acLine) {
    const blind = acLine.acBlindSpot(contractText, acs.map(a => a.id));
    if (blind) warns.push(`[${slug}] W7 ${acLine.blindSpotText(blind)}`);
  }

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
    if (!es.some(e => e.layer.toLowerCase() === 'backend-effect')) {
      warns.push(`[${slug}] W4 ${ac.id} is tagged (cross-layer) but none of its ${es.length} eval(s) declares layer: backend-effect — UI-only evidence for a cross-layer criterion; add ≥1 test/script eval asserting the backend effect.`);
    }
  }

  // W5 — mobile backend-target presence (advisory): the kit never verifies the
  // VALUE (engine/binding split; a machine cannot check the word "real") — it
  // only checks the line EXISTS so the Gate-1 human has something to eyeball.
  const surfacesLine = (contractText.match(/^surfaces:.*$/im) || [''])[0].replace(/[ \t]+#.*$/, '');
  if (/\bmobile\b/i.test(surfacesLine)
      && !/mobile\s+backend\s+target\s*:/i.test(contractText)) {
    warns.push(`[${slug}] W5 surfaces include mobile but the contract has no "Mobile backend target:" line (## Notes) — declare local|staging|mock so the Gate-1 human can eyeball the V4 risk.`);
  }

  // W6 — vocabulary drift (advisory): the contract states the requirement using
  // a word this repo's CONTEXT.md has ruled out. Machine-checkable only because
  // `_Avoid_` makes the glossary a rule rather than a reference; `_Allow_`
  // carves out phrases that legitimately contain an alias WITHOUT silencing the
  // bare alias elsewhere. Prose only — code spans, fenced blocks, frontmatter
  // and link targets are not the author speaking.
  if (glossary && glossaryLib) {
    const seenAlias = new Set();
    for (const v of glossaryLib.findViolations(contractText, glossary)) {
      if (seenAlias.has(v.alias.toLowerCase())) continue; // one warning per alias
      seenAlias.add(v.alias.toLowerCase());
      warns.push(`[${slug}] W6 contract line ${v.lineNo} uses "${v.alias}", which CONTEXT.md lists under _Avoid_ for "${v.term}" — restate the criterion in the canonical term so the eval tests the agreed reading.`);
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

  if (!evalYaml) { console.log('eval-coverage-lint: lib/eval-yaml.js missing (package incomplete) — skipping (advisory, fail-open)'); return 0; }

  const warns = [];
  if (filesMode) {
    const [c, e] = filesMode.map(readSafe);
    if (c == null || e == null) { console.log('eval-coverage-lint: contract/evals file unreadable — skipping (advisory)'); return 0; }
    // --files mode has no repo root to resolve CONTEXT.md against → W6 is out
    // of scope there (the other warnings are file-local and still apply).
    warns.push(...lintFeature('files', c, e, null));
  } else {
    const acc = path.join(root, '_acceptance');
    let dirs;
    try { dirs = fs.readdirSync(acc, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name); }
    catch (_) { console.log('eval-coverage-lint: no _acceptance/ — nothing to lint'); return 0; }
    const glossary = glossaryLib ? glossaryLib.readGlossary(root) : null;
    const targets = slugs.length ? slugs : dirs;
    for (const slug of targets) {
      const c = readSafe(path.join(acc, slug, 'contract.md'));
      const e = readSafe(path.join(acc, slug, 'evals.yaml'));
      if (c == null || e == null) continue; // pre-eval-gen feature → nothing to lint
      warns.push(...lintFeature(slug, c, e, glossary));
    }
  }

  if (!warns.length) { console.log('eval-coverage-lint: no coverage gaps detected.'); return 0; }
  console.log(`eval-coverage-lint: ${warns.length} coverage warning(s) — ADVISORY, review at Gate 1 (not auto-blocking):\n`);
  for (const w of warns) console.log('  ' + w);
  console.log('\nW1 = a bounded/threshold criterion needs a just-below should-NOT-fire (boundary) eval; W3 = give the out-of-scope half real negative evals; W4 = a (cross-layer) criterion needs a paired layer: backend-effect eval; W5 = a mobile-surface contract needs a "Mobile backend target:" line; W6 = the contract uses a word this repo\'s CONTEXT.md ruled out under _Avoid_; W7 = a criterion-shaped line did not parse, so every warning above ran on an incomplete AC set — fix the contract line first, then re-read this output.');
  return 1;
}

try { process.exit(run(process.argv.slice(2))); }
catch (err) { console.error('[eval-coverage-lint] internal error (fail-open): ' + err.message); process.exit(0); }
