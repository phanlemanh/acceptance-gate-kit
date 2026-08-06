#!/usr/bin/env node
/* gate-card.js — render a human DECISION CARD for Gate 1 or Gate 2 from the
 * acceptance artifacts (contract.md / evals.yaml / evidence-report.md).
 *
 * Purpose (acceptance-gate goal: cut human acceptance time >=50% WITHOUT cutting
 * quality): the two human gates are where the time is spent. This puts the few
 * things only a human can decide FIRST, in plain product language, collapses what
 * the machine already proved, and always shows reversibility — so the fast
 * decision is also a good one (anti-rubber-stamp). Presentation layer ONLY; it
 * reads artifacts the gate already produced and DECIDES NOTHING. The deterministic
 * hook + evidence remain the source of truth.
 *
 * Trust invariants (the card must NEVER make a bad/incomplete state look
 * approvable): a non-PASS/PENDING-JUDGMENT verdict renders a non-approvable state
 * with no signoff affordance; "all machine checks passed" / "evidence complete"
 * are claimed only when actually true; every judgment item a human still owes
 * (incl. all T3 judgment items) is surfaced.
 *
 * Pipeline: EXTRACT (this script, deterministic) -> translate to plain product
 * language (an LLM step, see commands/acceptance-card.md) -> RENDER (this script).
 *
 * Usage:
 *   gate-card.js --root <repo> --slug <slug> [--gate 1|2] [--extract] [--plain <plain.json>]
 *   gate auto-detected from contract.status, else evidence-report.md presence.
 *   --extract : print the jargon-y bits a plain-language step should translate (JSON)
 *   --plain   : apply a plain.json overlay produced by the translate step
 *   default   : print the card HTML fragment to stdout
 */
'use strict';
const fs = require('fs');
const path = require('path');
const gapProbe = require('../lib/gap-probe.js');
const outOfContract = require('../lib/out-of-contract.js');
const evidenceCore = require('../lib/evidence-core.js');
// Ranh giới section: luật PER-SECTION nằm ở bảng marker trong lib/md-section.js
// (Findings=any-heading chặn hàng ma; văn xuôi=same-or-higher giữ AC sau sub-heading).
const { section } = require('../lib/md-section.js');
// Parser evals.yaml dùng chung với eval-coverage-lint (lib/eval-yaml.js) — hiểu
// block scalar: khuôn eval-gen viết `expected: >`, regex một-dòng cũ bắt được
// ">" nên NEG_RE luôn false → covGaps bắn cảnh báo giả cho MỌI AC có số.
const { parseEvals } = require('../lib/eval-yaml.js');

const a = process.argv.slice(2);
const opt = n => { const i = a.indexOf(n); return i >= 0 ? a[i + 1] : null; };
const root = opt('--root') || '.';
const slug = opt('--slug');
const plainPath = opt('--plain');
const EXTRACT = a.includes('--extract');
const glossaryBase = opt('--glossary-base'); // opt-in: the ONLY path that shells out to git
let gate = opt('--gate');
if (!slug) { process.stderr.write('gate-card: --slug required\n'); process.exit(2); }
// slug must be a single safe path segment — no traversal / separators
if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(slug)) { process.stderr.write('gate-card: invalid --slug (expect one name, got "' + slug + '")\n'); process.exit(2); }

const MAX = 1024 * 1024; // cap artifact reads at 1MB (the card parses only small fields)
const read = p => { try { if (fs.statSync(p).size > MAX) { process.stderr.write('gate-card: ' + p + ' too large, skipped\n'); return ''; } return fs.readFileSync(p, 'utf8'); } catch (_) { return ''; } };
const dir = path.join(root, '_acceptance', slug);
const contract = read(path.join(dir, 'contract.md'));
const evalsT = read(path.join(dir, 'evals.yaml'));
const report = read(path.join(dir, 'evidence-report.md'));
const probeT = read(path.join(dir, 'gap-probe.md'));

// ---- glossary delta (Đợt 2) ----------------------------------------------
// The Gate-1 human approves SCOPE and, alongside it, the LANGUAGE the scope is
// written in: which domain terms this feature adds or sharpens in the repo's
// CONTEXT.md. Parsing is delegated to lib/context-glossary.js — the kit has
// four hand-rolled contract parsers already and 1.20.1 had to patch the same
// bug in all of them; this is not the place to grow a fifth.
// Purity note: gate-card is otherwise a pure file reader. git is touched ONLY
// when --glossary-base is passed, so every existing call site is unchanged.
let glossaryLib = null;
try { glossaryLib = require(path.join(__dirname, '..', 'lib', 'context-glossary.js')); } catch (_) {}
const glossaryText = read(path.join(root, 'CONTEXT.md'));
const glossaryPresent = !!glossaryText.trim();
let glossaryDelta = null;      // [{term, added}] | null = not computed
let glossaryDeltaErr = null;   // 'no-base' | 'git-failed'
if (glossaryPresent && glossaryLib) {
  if (!glossaryBase) glossaryDeltaErr = 'no-base';
  else {
    try {
      const out = require('child_process').execFileSync(
        'git', ['-C', root, 'diff', '-U0', glossaryBase, '--', 'CONTEXT.md'],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
      glossaryDelta = glossaryLib.termsAtLines(glossaryText, glossaryLib.addedLinesFromDiff(out));
    } catch (_) { glossaryDeltaErr = 'git-failed'; }
  }
}

let plain = null;
if (plainPath && fs.existsSync(plainPath)) {
  try { plain = JSON.parse(read(plainPath)); }
  catch (e) { process.stderr.write('gate-card: ignoring malformed --plain (' + e.message + ') — rendering without overlay\n'); plain = null; }
}

// ---- parsers ----
function frontmatter(t) { const m = t.match(/^---\r?\n([\s\S]*?)\r?\n---/); const o = {}; if (m) for (const l of m[1].split('\n')) { const mm = l.match(/^(\w+)\s*:\s*(.*)$/); if (mm) o[mm[1]] = mm[2].trim(); } return o; }
const clean = s => String(s == null ? '' : s).replace(/["']/g, '').replace(/\s*#.*$/, '').trim(); // strip quotes + trailing # comment (matches hook tolerance)
const unquote = s => String(s == null ? '' : s).replace(/^["']|["']$/g, '').trim();
const cleanLines = arr => arr.filter(l => l.trim() && !/^\s*#/.test(l)); // drop blanks + markdown-comment lines
// Bullet list VỚI dòng-nối: contract hard-wrap 80 cột nên phần nối của một bullet
// không mở "- " — lọc theo từng dòng từng vứt nửa sau câu ("AC-6 (sha vào" cụt
// giữa thẻ, findings 2026-08-05). Dòng trắng đóng bullet; prose trước bullet đầu bị bỏ.
const bullets = arr => {
  const out = []; let open = false;
  for (const raw of arr) {
    const l = String(raw == null ? '' : raw);
    if (/^\s*-\s+\S/.test(l)) { out.push(l.trim().replace(/^-\s+/, '')); open = true; }
    else if (!l.trim()) open = false;
    else if (open && !/^\s*#{1,6}\s/.test(l)) out[out.length - 1] += ' ' + l.trim();
  }
  return out;
};
// Lột dấu markdown khi buộc in text thô (fallback của tầng card-plain): `code`,
// **đậm**, *nghiêng*, [nhãn](link) → chữ trần. KHÔNG đụng gạch dưới — run_id,
// suites_exit là tên máy hợp lệ, lột "_" sẽ phá chúng.
// Lột định dạng để in cho NGƯỜI. Dấu nhấn mạnh cần ĐỦ BA điều kiện: dấu mở
// KHÔNG dính vào ký tự kiểu ĐƯỜNG DẪN ngay trước nó (/ . - _), ngay sau dấu
// mở là ký tự không-trắng, và ngay trước dấu đóng là ký tự không-trắng. Chữ
// và số đứng trước dấu mở vẫn hợp lệ, nên `tier T3**mới**` lột y như bản cũ
// (AC-3: nhóm lột không được suy giảm).
// Vì sao cần ràng buộc đó: đường dẫn đệ quy (`plugins/**`, `lib/**`) và mẫu
// glob (`*.md`) trông y hệt cặp nhấn mạnh, nên luật "mọi cặp sao là chữ đậm"
// nuốt mất dấu sao của đường dẫn — và nuốt theo kiểu phụ thuộc số lượng glob
// trên dòng (một cái thì sống, hai cái thì cụt cả hai). Kỳ vọng cho TỪNG hình
// dạng khai ở marker STRIP-SHAPE-MATRIX trong hợp đồng card-text-fidelity.
const stripMd = s => String(s == null ? '' : s)
  .replace(/\[([^\]]*)\]\([^)\s]*\)/g, '$1')
  .replace(/`([^`]+)`/g, '$1')
  .replace(/(^|[^*/._-])\*\*\*(?=\S)([^*]+?)(?<=\S)\*\*\*(?!\*)/g, '$1$2')
  .replace(/(^|[^*/._-])\*\*(?=\S)([^*]+?)(?<=\S)\*\*(?!\*)/g, '$1$2')
  .replace(/(^|[^*/._-])\*(?=\S)([^*]+?)(?<=\S)\*(?!\*)/g, '$1$2');
const { parseAC, acBlindSpot, blindSpotText } = require('../lib/ac-line.js');
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const NEG_RE = /\bKHÔNG\b|\bkhông\b|\bkhong\b|\bNOT\b|reject|denied|\bdeny\b|từ chối|tu choi|\b0\s*(row|touch)\b|rỗng|\bn-a\b|\bbiên\b|\bbien\b|dưới ngưỡng|duoi nguong|just[- ]?below|should[- ]?not|không tăng|không ghi|không fire|không kích hoạt|suppress|absent|vắng/i;
const THRESHOLD_RE = /[≥≤]|[<>]=?|ngưỡng|nguong|threshold|\bbiên\b|\bbien\b|\b\d+\b|reach|at least|at most|exceed|tối thiểu|toi thieu|tối đa|toi da|\bdưới\b|\btrên\b/i;
// classify will/wont on the Then-clause only — reduces false "Sẽ KHÔNG" from an incidental "không" in Given/When.
const thenOf = g => { const m = String(g).split(/\bThen\b|\bthì\b/i); return m.length > 1 ? m[m.length - 1] : String(g); };

const cfm = frontmatter(contract);
const feature = cfm.feature || cfm.slug || slug;
const tier = clean(cfm.risk_tier);
const status = clean(cfm.status);
const oos = bullets(section(contract, 'Out of scope'));

// ---- decisions.jsonl (ledger — rationale only, tolerant per-line parse) ----
// Returns entries in FILE ORDER; sealIdx = index of the first gate-1 seal entry
// (everything after it is provisional until a human ratifies at Gate 2).
function readLedger(d) {
  const t = read(path.join(d, 'decisions.jsonl'));
  const entries = []; let broken = 0; let sealIdx = null;
  if (!t.trim()) return { entries, broken, sealIdx };
  for (const line of t.split('\n')) {
    if (!line.trim()) continue;
    try {
      const e = JSON.parse(line);
      if (e && typeof e === 'object' && !Array.isArray(e)) {
        if (sealIdx === null && e.type === 'seal' && String(e.gate) === '1') sealIdx = entries.length;
        entries.push(e);
      } else broken++;
    } catch (_) { broken++; }
  }
  return { entries, broken, sealIdx };
}
const ledger = readLedger(dir);
const decsAll = ledger.entries.filter(e => e.type !== 'seal');
// display order: descope first (Pareto — "không làm" là quyết định đắt nhất khi bị lật)
const decSort = arr => [...arr.filter(e => e.type === 'descope'), ...arr.filter(e => e.type !== 'descope')];
// no seal yet => NOTHING is approved; everything surfaces as provisional at Gate 2 (fail-visible, not fail-quiet)
const decsApproved = ledger.sealIdx === null ? [] : ledger.entries.slice(0, ledger.sealIdx).filter(e => e.type !== 'seal');
const decsProvisional = ledger.sealIdx === null ? decsAll : ledger.entries.slice(ledger.sealIdx + 1).filter(e => e.type !== 'seal');
const decLine = e => esc(stripMd(e.decision || '')) + (e.impact ? ' — ' + esc(stripMd(e.impact)) : '');

// auto-detect gate: prefer contract.status (the SKILL's source of truth), else report presence
if (!gate) {
  if (/^(implemented|verified|signed-off)$/i.test(status)) gate = '2';
  else if (/^(draft|approved)$/i.test(status)) gate = '1';
  else gate = report.trim() ? '2' : '1';
}

const STYLE = `<style>
.gc{font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:640px;margin:0 auto;color:#1f1f1d;line-height:1.5}
.gc .card{background:#fff;border:1px solid #e6e4de;border-radius:14px;padding:16px 18px}
.gc .h{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:6px}
.gc .ft{font-size:16px;font-weight:600}.gc .sub{font-size:12px;color:#6c6a64;margin-top:2px}
.gc .chip{font-size:12px;font-weight:600;padding:4px 11px;border-radius:999px;white-space:nowrap}
.gc .amber{background:#FAEEDA;color:#633806}.gc .teal{background:#E1F5EE;color:#085041}.gc .coral{background:#FAECE7;color:#712B13}.gc .gray{background:#f1efe8;color:#444441}
.gc .lab{font-size:11px;letter-spacing:.04em;text-transform:uppercase;color:#8a887f;margin:16px 0 8px;font-weight:600}
.gc .grp{border-radius:10px;padding:11px 14px;margin-bottom:8px}.gc .gdo{background:#E1F5EE}.gc .gnot{background:#f4f2ec}
.gc .li{font-size:14px;margin:0 0 6px;padding-left:17px;position:relative}.gc .li:last-child{margin-bottom:0}
.gc .li:before{content:"";position:absolute;left:1px;top:7px;width:7px;height:7px;border-radius:50%}
.gc .gdo .li{color:#085041}.gc .gdo .li:before{background:#1D9E75}.gc .gnot .li{color:#56544d}.gc .gnot .li:before{background:#b4b2a9}
.gc .item{background:#FAEEDA;border:1px solid #EF9F27;border-radius:10px;padding:11px 13px;margin-bottom:8px}
.gc .q{font-size:14px;font-weight:600;color:#412402;margin:0 0 3px}.gc .ai{font-size:12px;color:#854F0B;margin:0 0 9px}
.gc .flag{display:flex;gap:8px;font-size:13px;padding:8px 11px;border-radius:9px;margin-bottom:6px}
.gc .fwarn{background:#FAEEDA;color:#633806}.gc .finfo{background:#f4f2ec;color:#56544d}.gc .fok{background:#E1F5EE;color:#085041}.gc .fred{background:#FAECE7;color:#712B13}
.gc .mach{background:#f4f2ec;border-radius:9px;padding:11px 13px;font-size:13px;color:#56544d}.gc .mach b{color:#1f1f1d}
.gc .foot{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:16px;padding-top:12px;border-top:1px solid #e6e4de}
.gc .rev{font-size:12px;color:#9a988f}
.gc .btns{display:flex;gap:8px}
.gc .b{font-size:13px;padding:6px 14px;border-radius:8px;border:1px solid;background:transparent;cursor:pointer}
.gc .bn{border-color:#cfcdc4;color:#3f3e39}.gc .yes{background:#E1F5EE;border-color:#5DCAA5;color:#085041;font-weight:600}.gc .no{border-color:#F0997B;color:#993C1D}
</style>`;
const pl = plain || {};

// ================= GATE 1 =================
if (gate === '1') {
  const acs = []; const seen = {}; const dupIds = [];
  for (const l of section(contract, 'Criteria')) { const ac = parseAC(l); if (ac) { if (seen[ac.id]) dupIds.push(ac.id); seen[ac.id] = 1; acs.push(ac); } }
  const blindSpot = acBlindSpot(contract, acs.map(x => x.id));
  const evalList = parseEvals(evalsT, ['criterion', 'expected'], unquote);
  const evalsFor = id => evalList.filter(e => e.criterion === id);
  const willDo = acs.filter(x => !x.judgment && !NEG_RE.test(thenOf(x.gwt)));
  const wontDo = acs.filter(x => !x.judgment && NEG_RE.test(thenOf(x.gwt)));
  const judgmentACs = acs.filter(x => x.judgment);
  const covGaps = acs.filter(x => !x.judgment && THRESHOLD_RE.test(x.gwt) && !evalsFor(x.id).some(e => NEG_RE.test(e.expected))).map(x => x.id);
  // CT-S coverage section — presentation only: render what the contract claims, flag absence/unverified
  const covPresent = /^#{2,6}\s+Coverage\b/im.test(contract);
  const covAll = section(contract, 'Coverage');
  const covLines = bullets(covAll).filter(l => !/\{\{/.test(l));
  const covUnverified = covAll.some(l => /CE chưa kiểm chứng/i.test(l));
  // gap-probe (S1#7 phản biện context sạch) — presentation only: render findings + disposition, flag absence/failed/dropped
  const gpFm = frontmatter(probeT);
  const gpPresent = !!probeT.trim();
  const gpVerdict = clean(gpFm.verdict).toLowerCase();
  const gpRows = []; let gpDropped = 0;
  if (gpPresent) for (const l of section(probeT, 'Findings')) {
    if (!/^\s*\|/.test(l)) continue;
    const cells = l.split('|').slice(1, -1).map(c => c.trim());
    if (!cells.length) continue;
    if (cells.every(c => /^:?-+:?$/.test(c))) continue; // separator row
    if (/^sev$/i.test(cells[0])) continue;              // header row
    if (cells.length === 6) gpRows.push({ sev: cells[0], artifact: cells[1], summary: cells[2], scenario: cells[3], measure: cells[4], disposition: cells[5] });
    else gpDropped++; // cell chứa "|" → sai số cột (giới hạn v1, spec §4)
  }
  // Luật van thoát nằm ở lib/gap-probe.js — CÙNG hàm mà pre-merge gọi. Không
  // viết lại ở đây: contract v2 chết đúng vì chỗ này bị tách làm hai bản, parity
  // giữ bằng comment (ledger d-125/d-126). P38 canh bằng máy.
  const gpDescopeId = gapProbe.descopeId(read(path.join(dir, 'decisions.jsonl')));
  const gpDescope = gpDescopeId ? (decsAll.find(e => e.id === gpDescopeId) || { id: gpDescopeId }) : null;
  const gpP0 = parseInt(clean(gpFm.p0), 10) || 0, gpP1 = parseInt(clean(gpFm.p1), 10) || 0, gpP2 = parseInt(clean(gpFm.p2), 10) || 0;
  const gpVerdictKnown = gpVerdict === 'clean' || gpVerdict === 'findings' || gpVerdict === 'probe-failed';

  // ---- trục ngữ cảnh (design-pass.md — khối chỉ hiện khi phiên S1-D đã chạy) ----
  // Nhãn tiếng người + chuỗi descope là CHUỖI PIN của P135-P138; đổi phải đổi test.
  const CONTEXT_LABEL = { 'standalone': 'đứng một mình', 'static-frame': 'khung giả tĩnh', 'host-embedded': 'nhúng host thật' };
  const DP_SCENE_DESCOPE = 'bỏ cảnh ngữ-cảnh — ';
  const dpText = read(path.join(dir, 'design-pass.md'));
  const dpFm = frontmatter(dpText);
  const dp = { present: !!dpText.trim(), material: clean(dpFm.material || ''), context: clean(dpFm.context || ''), scenes: [] };
  if (dp.present) {
    // Placeholder khuôn chưa điền CHỨA DẤU PHẨY — phải loại '<'/'>' TRƯỚC khi split,
    // không thì nửa sau placeholder sống qua filter và standalone-thiếu-cảnh im lặng
    // trong khi card khoe "1 cảnh ngữ-cảnh" (false-green seam writer→reader, S4-r1).
    const rawScenes = clean(dpFm.context_scenes || '');
    if (!/[<>]/.test(rawScenes)) dp.scenes = rawScenes.replace(/^\[|\]$/g, '').split(',').map(s => s.trim()).filter(Boolean);
  }
  // socket design_pass.host_embed — đường đọc-cũ: vắng là hợp lệ (nấc thấp), không lỗi.
  // Đọc bằng resolveConfigKey của lib (blank line / comment đuôi / CRLF như hook) —
  // kit đã trả giá cho 4 parser hand-rolled trùng bug, không mọc con thứ 5 (S4-r1).
  const cfgText = read(path.join(root, '_acceptance', 'config.yaml'));
  const heGuide = evidenceCore.resolveConfigKey(cfgText, 'design_pass.host_embed.guide');
  const he = {
    present: heGuide !== null
      || evidenceCore.resolveConfigKey(cfgText, 'design_pass.host_embed.route') !== null
      || evidenceCore.resolveConfigKey(cfgText, 'design_pass.host_embed.dev_flag') !== null,
    guide: heGuide || '', resolvable: true,
  };
  if (he.present && he.guide) {
    if (he.guide.includes('/') || /\.md$/.test(he.guide)) he.resolvable = fs.existsSync(path.join(root, he.guide));
    else if (!he.guide.includes(':')) he.resolvable = fs.existsSync(path.join(root, '.claude', 'skills', he.guide, 'SKILL.md'));
    // tên skill plugin-qualified (a:b) không kiểm được cache người khác → coi giải được
  }
  const dpFlags = [];
  if (dp.present) {
    if (!dp.context) dpFlags.push('Sổ phiên chưa khai nấc ngữ cảnh (đời trước trục ngữ cảnh) — bản mẫu sống ở đâu chưa được khai; không chặn, khuyên bổ sung ở phiên thiết kế sau.');
    else if (!CONTEXT_LABEL[dp.context]) dpFlags.push('Nấc ngữ cảnh không nhận diện được: "' + dp.context + '" — chỉ nhận standalone / static-frame / host-embedded.');
    else if (dp.context === 'standalone' && !dp.scenes.length && !decsAll.some(e => e.type === 'descope' && String(e.decision || '').startsWith(DP_SCENE_DESCOPE))) {
      dpFlags.push('Bản mẫu khai đứng-một-mình nhưng chưa có cảnh ngữ-cảnh (khung host bọc vật + hành trình vào–ra) và không có dòng từ-chối trong sổ quyết định — người duyệt có quyền trả.');
    }
    if (!he.present) dpFlags.push('Repo chưa khai đường nhúng (design_pass.host_embed) — phiên coi như chưa có đường nhúng rẻ, đi nấc thấp; không chặn.');
    else if (!he.resolvable) dpFlags.push('Đường nhúng đã khai nhưng con trỏ không giải được: "' + he.guide + '" — sửa con trỏ, hoặc phiên đi nấc thấp; không chặn.');
  }

  if (EXTRACT) { process.stdout.write(JSON.stringify({ gate: 1, feature, tier, blind_spot: blindSpot ? { kind: blindSpot.kind, suspect: blindSpot.suspect, parsed: blindSpot.parsed, lines: blindSpot.lines, heading: blindSpot.heading } : null, will_do: willDo.map(x => ({ id: x.id, gwt: x.gwt })), wont_do: wontDo.map(x => ({ id: x.id, gwt: x.gwt })), scope: oos, coverage: covLines, coverage_missing: !covPresent || !covLines.length, glossary_delta: { present: glossaryPresent, computed: glossaryDelta !== null, error: glossaryDeltaErr, terms: glossaryDelta || [] }, gap_probe: { present: gpPresent, verdict: gpPresent ? (gpVerdict || null) : null, p0: gpP0, p1: gpP1, p2: gpP2, rows: gpRows.map(r => ({ sev: r.sev, artifact: r.artifact, summary: r.summary, disposition: r.disposition })), parse_dropped: gpDropped, descoped: !!gpDescope }, decisions: decsAll.map(e => ({ id: e.id, type: e.type, stage: e.stage, decision: e.decision, impact: e.impact })), decisions_broken: ledger.broken, design_pass: dp.present ? { material: dp.material, context: dp.context, context_label: CONTEXT_LABEL[dp.context] || null, scenes: dp.scenes, host_embed: he, flags: dpFlags } : { present: false } }, null, 2)); process.exit(0); }
  const featurePlain = pl.feature_plain || feature;
  const pmap = (arr, id) => (((arr || []).find(x => x.id === id)) || {}).p;
  const willText = x => pmap(pl.will_do, x.id) || stripMd(x.gwt);
  const wontText = x => pmap(pl.wont_do, x.id) || stripMd(x.gwt);
  const scopePlain = pl.scope_plain || oos.map(stripMd).join(' · ');
  // Tầng card-plain cho hai khối sinh sau nó (findings 2026-08-05): overlay chỉ
  // ĐỔI CHỮ theo luật mặt người — script vẫn render đủ MỌI dòng/hàng (không thể
  // quên) và sev do script in (không đè được). Vắng overlay → bản lột-markdown.
  const pIdx = (arr, i) => (((arr || []).find(x => x.i === i)) || {}).p;

  const P = [STYLE, `<div class="gc"><div class="card">
<div class="h"><div><div class="ft">${esc(featurePlain)}</div><div class="sub">Cổng 1 · duyệt tiêu chí TRƯỚC khi code · ~5 phút${tier === 'T3' ? ' · tier T3 (đụng critical)' : ''}</div></div><span class="chip amber">duyệt tiêu chí</span></div>`];
  // First thing on the card, before any criterion list: if the card cannot be trusted,
  // the reviewer must learn that BEFORE reading a list that looks complete.
  if (blindSpot) P.push(`<div class="flag fred">⚠ ${esc(blindSpotText(blindSpot))}</div>`);
  if (willDo.length) P.push(`<div class="lab">Hệ thống SẼ làm</div><div class="grp gdo">${willDo.map(x => `<p class="li">${esc(willText(x))}</p>`).join('')}</div>`);
  const notItems = wontDo.map(x => esc(wontText(x))).concat(oos.length ? ['Hoãn/cắt: ' + esc(scopePlain)] : []);
  if (notItems.length) P.push(`<div class="lab">Sẽ KHÔNG làm / sẽ chặn</div><div class="grp gnot">${notItems.map(t => `<p class="li">${t}</p>`).join('')}</div>`);
  const plDec = id => (((pl.decisions_plain || []).find(x => x.id === id)) || {}).p;
  P.push(`<div class="lab">Quyết định &amp; trade-off</div>`);
  if (!decsAll.length) P.push(`<div class="flag finfo">Sổ quyết định: (chưa ghi quyết định nào)</div>`);
  else P.push(`<div class="grp gnot">${decSort(decsAll).map(e => `<p class="li">${e.type === 'descope' ? '<b>KHÔNG làm:</b> ' : ''}${esc(plDec(e.id)) || decLine(e)}</p>`).join('')}</div>`);
  if (ledger.broken) P.push(`<div class="flag fwarn">⚠ ${ledger.broken} dòng ledger hỏng, đã bỏ qua.</div>`);
  if (covLines.length) P.push(`<div class="lab">Độ phủ AC (bằng chứng "đủ")</div><div class="grp gnot">${covLines.map((t, i) => `<p class="li">${esc(pIdx(pl.coverage_plain, i) || stripMd(t))}</p>`).join('')}</div>`);
  if (dp.present) P.push(`<div class="lab">Bản mẫu &amp; ngữ cảnh</div><div class="grp gnot"><p class="li">Vật liệu: ${esc(dp.material || '(chưa khai)')} · sống ở: <b>${esc(CONTEXT_LABEL[dp.context] || dp.context || '(chưa khai)')}</b>${dp.scenes.length ? ' · ' + dp.scenes.length + ' cảnh ngữ-cảnh' : ''}</p></div>`);
  if (glossaryDelta && glossaryDelta.length) P.push(`<div class="lab">Từ vựng chốt ở feature này</div><div class="grp gnot">${glossaryDelta.map(x => `<p class="li">${esc(x.term)} — ${x.added ? 'term MỚI' : 'định nghĩa/_Avoid_ được sửa'}</p>`).join('')}</div>`);
  if (gpPresent && gpVerdict === 'clean' && !gpRows.length && !gpDropped) P.push(`<div class="lab">Phản biện context sạch</div><div class="flag fok">Phản biện: không còn lỗ đáng kể.</div>`);
  else if (gpRows.length) P.push(`<div class="lab">Phản biện context sạch</div><div class="grp gnot">${gpRows.map((r, i) => `<p class="li"><b>${esc(r.sev)}</b> · ${esc(pIdx(pl.gap_probe_plain, i) || stripMd(r.artifact) + ' · ' + stripMd(r.summary) + ' — ' + stripMd(r.disposition))}</p>`).join('')}</div>`);
  const flags = [];
  if (glossaryPresent && glossaryDelta && !glossaryDelta.length) flags.push(['finfo', 'Từ vựng: feature này không thêm/sửa term nào trong CONTEXT.md.']);
  if (glossaryDeltaErr === 'no-base') flags.push(['finfo', 'Từ vựng: repo có CONTEXT.md nhưng thẻ chưa được truyền --glossary-base, nên không trình được term mới/sửa. Truyền base (merge-base với nhánh chính) nếu muốn duyệt cả ngôn ngữ.']);
  if (glossaryDeltaErr === 'git-failed') flags.push(['fwarn', 'Từ vựng: không đọc được diff CONTEXT.md (base sai hoặc không phải git repo) — term mới/sửa CHƯA được trình, đừng coi là "không có thay đổi".']);
  for (const id of covGaps) flags.push(['fwarn', `${id} có ngưỡng/biên nhưng chưa có ca "dưới ngưỡng → KHÔNG xảy ra" — thêm 1 ca chặn ngay sẽ rẻ hơn nhiều so với phát hiện sau.`]);
  for (const f of dpFlags) flags.push(['fwarn', f]);
  if (!covPresent || !covLines.length) flags.push(['fwarn', 'Contract chưa có section Coverage — độ phủ bộ AC chưa có bằng chứng (workspace cũ / chưa quét). Quét bằng morphological-scan hoặc ghi 1 dòng lý do bỏ, rồi hãy duyệt.']);
  if (covUnverified) flags.push(['fwarn', 'Coverage có trục chưa nêu được thước đo "đủ" (CE chưa kiểm chứng) — hỏi nguồn đối chiếu trước khi tin "đã quét đủ".']);
  if (!gpPresent && gpDescope) flags.push(['finfo', `Đã bỏ phản biện context sạch theo ${esc(gpDescope.id || 'entry descope')} — quyết định chủ động, có dấu vết.`]);
  else if (!gpPresent) flags.push(['fwarn', 'Chưa có phản biện context sạch (gap-probe) — bộ artifact chưa qua truy lỗ hổng bởi context sạch (workspace cũ / bước bị bỏ không dấu vết). Chạy bước S1#7 hoặc ghi entry descope "bỏ gap-probe", rồi hãy duyệt.']);
  if (gpPresent && gpVerdict === 'probe-failed') flags.push(['fwarn', 'Phản biện không chạy được (probe-failed sau retry) — duyệt nghĩa là duyệt KHÔNG có phản biện context sạch.']);
  if (gpPresent && !gpVerdictKnown) flags.push(['fwarn', `gap-probe.md không đọc được (verdict lạ/thiếu${gpVerdict ? ': "' + esc(gpVerdict) + '"' : ''}) — coi như CHƯA có phản biện, chạy lại bước S1#7 hoặc sửa frontmatter.`]);
  if (gpPresent && gpVerdictKnown && gpVerdict !== 'probe-failed' && (gpVerdict === 'findings' || gpP0 + gpP1 + gpP2 > 0) && !gpRows.length && !gpDropped) flags.push(['fwarn', 'gap-probe.md khai findings nhưng không đọc được dòng finding nào (bảng thiếu / heading sai) — soi file trước khi duyệt.']);
  if (gpVerdict === 'clean' && (gpRows.length || gpDropped)) flags.push(['fwarn', 'gap-probe.md mâu thuẫn: verdict clean nhưng bảng có finding — soi lại file trước khi duyệt.']);
  if (gpDropped) flags.push(['fwarn', `${gpDropped} dòng finding không đọc được (sai số cột — cell chứa "|" hoặc thiếu cột) — sửa bảng gap-probe.md nếu cần soi đủ.`]);
  if (dupIds.length) flags.push(['fwarn', `Trùng mã tiêu chí: ${esc([...new Set(dupIds)].join(', '))} — mapping eval mơ hồ, đổi mã trước khi duyệt.`]);
  for (const j of judgmentACs) flags.push(['finfo', `${j.id} cần MẮT bạn chấm sau khi code (việc người, máy không chấm được).`]);
  if (tier === 'T3') flags.push(['finfo', 'Đụng phần nhạy cảm → tier T3, duyệt kỹ phần "sẽ KHÔNG làm".']);
  if (flags.length) P.push(`<div class="lab">Cần chú ý trước khi duyệt</div>${flags.map(([c, t]) => `<div class="flag ${c}">${t}</div>`).join('')}`);
  P.push(`<div class="foot"><span class="rev">↻ Sửa 1 dòng tiêu chí GIỜ rẻ hơn 10× phát hiện sai sau khi code.</span><div class="btns"><button class="b no">Sửa lại</button><button class="b yes">Duyệt, cho code</button></div></div>
</div></div>`);
  process.stdout.write(P.join('\n'));
  process.exit(0);
}

// ================= GATE 2 =================
const rfm = frontmatter(report);
const verdict = clean(rfm.verdict).toUpperCase();
const reason = unquote(rfm.reason);
const approvable = verdict === 'PASS' || verdict === 'PENDING-JUDGMENT';

const critText = {}; for (const l of section(contract, 'Criteria')) { const ac = parseAC(l); if (ac && !critText[ac.id]) critText[ac.id] = ac.gwt; }

// per-eval rows — tolerate any non-pipe cell content (e.g. "N/A", "PASS*")
const rows = [];
for (const l of report.split('\n')) { const m = l.match(/^\|\s*(E\w+)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/); if (m && m[1] !== 'Eval') rows.push({ id: m[1], crit: m[2].trim(), exec: m[3].trim().toLowerCase(), verdict: m[4].trim().toUpperCase() }); }

// evidence blocks — skip YAML block scalars (output: |) and only accept allow-listed keys,
// so a log excerpt line like "human_override: ..." or "baseline: green" inside output can't
// drop a real decision or inflate the regression counts.
const FIELDS = ['run_id', 'exit_code', 'baseline', 'verifier', 'verified_at', 'judged_by', 'verdict', 'rationale', 'human_override', 'screenshot', 'pass_rate', 'reason'];
const evid = {};
{ let cur = null; let skip = -1; for (const raw of report.split('\n')) {
    if (/^#{1,6}\s/.test(raw)) { cur = null; skip = -1; continue; }
    const em = raw.match(/^-\s+eval:\s*(\S+)/); if (em) { cur = em[1]; evid[cur] = {}; skip = -1; continue; }
    if (!cur) continue;
    if (skip >= 0) { if (raw.trim() === '') continue; if (raw.match(/^(\s*)/)[1].length > skip) continue; skip = -1; }
    // judge-required-evidence: gom list items dưới `required_evidence:` (dòng "- …"
    // không match khuôn key:value nên parser cũ bỏ qua — thêm nhánh additive).
    const li = raw.match(/^\s+-\s+(.+)$/);
    if (li && evid[cur].__reOpen) { (evid[cur].required_evidence_list = evid[cur].required_evidence_list || []).push(li[1].trim()); continue; }
    const fm = raw.match(/^(\s*)(\w+):\s*(.*)$/); if (!fm) continue;
    evid[cur].__reOpen = fm[2] === 'required_evidence';
    const indent = fm[1].length, key = fm[2], val = fm[3].trim();
    if (/^[|>]/.test(val)) { skip = indent; if (FIELDS.indexOf(key) >= 0) evid[cur][key] = ''; continue; } // block scalar → skip body
    if (FIELDS.indexOf(key) < 0) continue;
    evid[cur][key] = val;
} }
const hasOverride = id => { const v = evid[id] && evid[id].human_override; return !!(v && v.trim() && !/^#|^<|^\{\{/.test(v.trim())); };

// decisions the human still owes: any UNCERTAIN row, plus EVERY judgment row on T3
// (T3 requires a human verdict on each judgment item — matches the hook), minus those overridden.
const decById = {};
for (const r of rows) {
  const owed = r.verdict === 'UNCERTAIN' || (tier === 'T3' && r.exec === 'judgment');
  if (owed && !hasOverride(r.id)) decById[r.id] = { id: r.id, q: critText[r.crit] || (evid[r.id] && evid[r.id].rationale) || r.crit, why: evid[r.id] && evid[r.id].rationale };
}
const decisions = Object.values(decById);
const machineRows = rows.filter(r => r.exec === 'test' || r.exec === 'script' || r.exec === 'ui-check');
const machinePass = machineRows.filter(r => r.verdict === 'PASS').length;
const allPass = machineRows.length > 0 && machinePass === machineRows.length;
const red = Object.values(evid).filter(e => e.baseline === 'red').length;
const green = Object.values(evid).filter(e => e.baseline === 'green').length;
const evComplete = machineRows.length > 0 && machineRows.every(r => { const e = evid[r.id] || {}; return e.run_id && e.run_id.length >= 4 && e.exit_code === '0' && e.verifier; });

// Scope-triage: lỗi THẬT nhưng ngoài phạm vi đã duyệt. Đọc thẳng từ artifact —
// KHÔNG qua key overlay, cùng luật với gap-probe: cái gì phải hiện trên thẻ thì
// script render, để không thể quên hay điền sai.
const ooc = outOfContract.parse(read(path.join(dir, 'review-findings.md')));

if (EXTRACT) { process.stdout.write(JSON.stringify({ gate: 2, feature, tier, verdict, approvable, decisions: decisions.map(d => ({ id: d.id, gwt: d.q, rationale: d.why })), scope: oos, analyst: '', out_of_contract: { present: ooc.present, findings: ooc.findings, unclassified: ooc.unclassified, cluster: ooc.cluster }, decisions_approved: decsApproved.map(e => ({ id: e.id, type: e.type, decision: e.decision, impact: e.impact })), decisions_provisional: decsProvisional.map(e => ({ id: e.id, type: e.type, stage: e.stage, decision: e.decision, impact: e.impact })), decisions_broken: ledger.broken }, null, 2)); process.exit(0); }

const featurePlain = pl.feature_plain || feature;
const plainDec = id => ((pl.decisions && pl.decisions.find(x => x.id === id)) || {}).q;
const scopePlain = pl.scope_plain || oos.map(stripMd).join(' · ');
const P = [STYLE];

// --- non-approvable: REJECT / BLOCKED / unknown — no signoff affordance, no green reassurance ---
if (!approvable) {
  const ch = verdict === 'REJECT' ? { t: 'có eval fail — trả lại code', c: 'coral' } : verdict === 'BLOCKED' ? { t: 'không chạy được — chưa thể ký', c: 'coral' } : { t: 'verdict không xác định — không ký', c: 'gray' };
  const failed = machineRows.filter(r => r.verdict !== 'PASS').map(r => r.id + (critText[r.crit] ? ' (' + r.crit + ')' : ''));
  const notes = [];
  if (verdict === 'REJECT') notes.push(['fred', (failed.length ? 'Eval chưa đạt: ' + esc(failed.join(', ')) + ' — ' : '') + 'quay lại sửa code, chưa ký.']);
  else if (verdict === 'BLOCKED') notes.push(['fred', 'Không chạy được' + (reason ? ': ' + esc(stripMd(reason)) : '') + ' — sửa môi trường rồi chạy lại, chưa ký.']);
  else notes.push(['fred', 'Verdict "' + esc(verdict || '—') + '" không phải PASS/PENDING-JUDGMENT — không ký ở thẻ này.']);
  P.push(`<div class="gc"><div class="card">
<div class="h"><div><div class="ft">${esc(featurePlain)}</div><div class="sub">Cổng 2 · ${tier === 'T3' ? 'tier T3 · ' : ''}CHƯA ký được</div></div><span class="chip ${ch.c}">${esc(ch.t)}</span></div>
<div class="lab">Vì sao chưa ký được</div>${notes.map(([c, t]) => `<div class="flag ${c}">${t}</div>`).join('')}
<div class="foot"><span class="rev">↻ Trả lại → quay về code; trạng thái này không có nút ký.</span><div class="btns"><button class="b no">Quay về code</button></div></div>
</div></div>`);
  process.stdout.write(P.join('\n'));
  process.exit(0);
}

// --- approvable: PASS / PENDING-JUDGMENT ---
const chip = verdict === 'PASS' ? { t: 'máy đã xong — ký nhanh', c: 'teal' } : { t: 'cần bạn quyết', c: 'amber' };
P.push(`<div class="gc"><div class="card">
<div class="h"><div><div class="ft">${esc(featurePlain)}</div><div class="sub">Cổng 2 · ký duyệt · ~5 phút${tier === 'T3' ? ' · tier T3 (đụng critical)' : ''}</div></div><span class="chip ${chip.c}">${esc(chip.t)}</span></div>`);
P.push(`<a href="evidence-page.html" style="display:flex;justify-content:space-between;align-items:center;gap:10px;background:#E6F1FB;border:1px solid #B5D4F4;border-radius:10px;padding:9px 13px;margin:11px 0 2px;text-decoration:none;color:#0C447C;font-size:13px"><b>Bằng chứng đầy đủ — ảnh chụp + chạy thật</b><span style="font-size:12px;color:#185FA5;white-space:nowrap">đã mở trong trình duyệt</span></a>`);
// Khối "Ngoài hợp đồng" đứng TRƯỚC mọi việc-của-người khác: đây là thứ máy cố ý
// KHÔNG tự sửa, nên nếu người duyệt bỏ qua thì không ai bắt lại.
// Cờ hỏng-phân-loại CỘNG THÊM, không thay thế: nuốt cả khối thì các lỗi đã phân
// loại được biến mất khỏi chỗ người quyết dù chúng vẫn nằm trong file.
if (ooc.unclassified) {
  P.push(`<div class="lab">Phân loại phạm vi chưa đầy đủ</div><div class="flag fwarn">⚠ Bước phân loại phạm vi không chạy trọn — máy không tự sửa lỗi nào trong vòng này. Xem đủ danh sách trong review-findings.md trước khi ký.</div>`);
}
if (ooc.findings.length) {
  P.push(`<div class="lab">Ngoài hợp đồng — bạn quyết (${ooc.findings.length})</div>`);
  P.push(`<div class="flag fwarn">Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — máy cố ý không tự sửa.</div>`);
  for (const f of ooc.findings) {
    const rec = f.proposal === 'new-contract' ? 'Máy đề xuất: tách thành một việc riêng.'
      : f.proposal === 'known-limits' ? 'Máy đề xuất: ghi vào hạn chế đã biết rồi ship.'
      : 'Máy chưa đề xuất hướng nào.';
    // In câu ngôn ngữ sản phẩm do bước triage viết. Thiếu nó thì nói thẳng là
    // thiếu — TUYỆT ĐỐI không rơi về title kỹ thuật của reviewer, vì đó là thứ
    // người quyết kinh doanh không đọc được (và judge sẽ chấm nhầm tài liệu).
    const q = f.plain ? f.plain : '(chưa có mô tả cho người đọc — xem review-findings.md)';
    P.push(`<div class="item"><p class="q">${esc(q)}</p><p class="ai">${esc(rec)}</p><div class="btns"><button class="b bn">ghi Known limits</button><button class="b bn">mở hợp đồng mới</button><button class="b no">nâng phạm vi sửa ngay</button></div></div>`);
  }
}
const yourCount = decisions.length + (oos.length ? 1 : 0);
if (yourCount) {
  P.push(`<div class="lab">Việc chỉ mình bạn quyết được — ${yourCount} việc</div>`);
  for (const d of decisions) {
    const reList = (evid[d.id] && evid[d.id].required_evidence_list) || [];
    const reHtml = reList.length ? `<p class="ai"><b>Muốn máy đổi ý, cần:</b> ${reList.map(x => esc(stripMd(x))).join(' · ')}</p>` : '';
    P.push(`<div class="item"><p class="q">${esc(plainDec(d.id) || stripMd(d.q))}</p><p class="ai">Máy: chưa chắc${d.why ? ' — ' + esc(stripMd(d.why)) : ' (cần mắt người).'}</p>${reHtml}<div class="btns"><button class="b bn">Đạt</button><button class="b no">Chưa đạt</button></div></div>`);
  }
  if (oos.length) P.push(`<div class="item"><p class="q">Xác nhận các phần đã cắt/hoãn ngoài phạm vi:</p><p class="ai">${esc(scopePlain)}</p><div class="btns"><button class="b bn">Đồng ý cắt</button><button class="b no">Không, kéo vào</button></div></div>`);
}
const plDec2 = id => (((pl.decisions_plain || []).find(x => x.id === id)) || {}).p;
if (decsProvisional.length) {
  P.push(`<div class="lab">Quyết định CHƯA duyệt — cần phê (ghi sau Gate 1)</div>`);
  for (const e of decSort(decsProvisional)) P.push(`<div class="item"><p class="q">${esc(plDec2(e.id)) || decLine(e)}</p><p class="ai">${esc(e.stage || '')} · ${e.type === 'descope' ? 'đề nghị KHÔNG làm' : esc(e.type)}${e.revisit ? ' · xem lại khi: ' + esc(e.revisit) : ''}</p><div class="btns"><button class="b bn">Phê</button><button class="b no">Không phê</button></div></div>`);
}
if (decsApproved.length) P.push(`<div class="lab">Đã duyệt từ Gate 1</div><div class="grp gnot">${decSort(decsApproved).map(e => `<p class="li">${decLine(e)}</p>`).join('')}</div>`);
if (ledger.broken) P.push(`<div class="flag fwarn">⚠ ${ledger.broken} dòng ledger hỏng, đã bỏ qua.</div>`);
const flags = [];
// Cụm ngoài vùng phủ: bộ đo đang hụt so với chỗ lỗi thật xuất hiện. Không nêu
// đường dẫn file ở thẻ — thẻ là chỗ quyết định, chi tiết nằm ở gói bằng chứng.
if (ooc.cluster) flags.push(['fwarn', '⚠ Nhiều lỗi rơi ngoài vùng các bộ đo đang phủ — dừng và quyết: mở rộng hợp đồng hay rút phạm vi. Chi tiết trong review-findings.md.']);
{ const analyst = cleanLines(section(report, 'Analyst')).join(' ').trim(); if (analyst && !/^none/i.test(analyst) && !/^\{\{/.test(analyst)) flags.push(['fred', esc(pl.analyst_plain || stripMd(analyst))]); }
{ const varr = cleanLines(section(report, 'Variance')).join(' ').trim(); if (varr && !/^none/i.test(varr) && !/^\{\{/.test(varr)) flags.push(['fred', 'Có eval ngẫu nhiên (pass-rate hỗn hợp) — ' + esc(stripMd(varr))]); }
if (tier === 'T3') flags.push(['fok', 'Đụng phần nhạy cảm → tier T3, đúng là cần bạn duyệt kỹ.']);
if (evComplete) flags.push(['fok', 'Cổng chạy thật, bằng chứng máy đầy đủ (run_id · exit 0 · verifier).']);
else flags.push(['fwarn', 'Bằng chứng máy CHƯA đủ trường (run_id · exit 0 · verifier) — kiểm trước khi ký.']);
P.push(`<div class="lab">Lưu ý trước khi ký</div>${flags.map(([c, t]) => `<div class="flag ${c}">${t}</div>`).join('')}`);
P.push(`<details style="margin-top:14px"><summary style="font-size:11px;letter-spacing:.04em;text-transform:uppercase;color:#8a887f;font-weight:600;cursor:pointer">Máy đã lo (liếc qua, không cần làm gì)</summary>`);
if (machineRows.length === 0) P.push(`<div class="mach" style="margin-top:8px">Không có phép kiểm máy tự động — feature này toàn judgment do người chấm.</div>`);
else if (allPass) P.push(`<div class="mach" style="margin-top:8px"><b>${machinePass}/${machineRows.length} phép kiểm máy đều đạt</b>${red ? ` · ${red} thật sự mới (chạy code cũ là hỏng → đúng là test feature)` : ''}${green ? ` · ${green} canh hồi quy` : ''}${evComplete ? ' · bằng chứng đủ, không lỗi.' : '.'}</div>`);
else P.push(`<div class="flag fred" style="margin-top:8px"><b>${machinePass}/${machineRows.length} phép kiểm máy đạt · ${machineRows.length - machinePass} CHƯA đạt</b> — xem lại trước khi ký.</div>`);
P.push(`</details>`);
P.push(`<div class="foot"><span class="rev">↻ Đảo ngược dễ: trả lại → quay về code, không mất gì.</span><div class="btns"><button class="b no">Trả lại</button><button class="b yes">Ký duyệt</button></div></div>
</div></div>`);
process.stdout.write(P.join('\n'));
