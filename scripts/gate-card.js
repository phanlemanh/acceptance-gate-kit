#!/usr/bin/env node
/* gate-card.js — render a human DECISION CARD for Gate 1 or Gate 2 from the
 * acceptance artifacts (contract.md / evals.yaml / evidence-report.md).
 *
 * Purpose (acceptance-gate goal: let the human decide at the few real decision
 * moments WITHOUT cutting quality): the two human gates are where the decisions
 * live. This puts the few
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
const gapProbe = require('../lib/gap-probe.cjs');
const outOfContract = require('../lib/out-of-contract.js');
const evidenceCore = require('../lib/evidence-core.cjs');
// Ranh giới section: luật PER-SECTION nằm ở bảng marker trong lib/md-section.cjs
// (Findings=any-heading chặn hàng ma; văn xuôi=same-or-higher giữ AC sau sub-heading).
const { section } = require('../lib/md-section.cjs');
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

// ---- chốt «không có hồ sơ thì không vẽ thẻ» -------------------------------
// Lỗ đã đo 2026-08-30: slug không tồn tại → exit 0 + 4201 byte thẻ Cổng 1 đầy
// đủ, tiêu đề là chính chuỗi người vừa gõ nhầm, khối việc-của-người vẫn hỏi
// «duyệt hay sửa». Người được mời ký trên hư không — false-green ở tầng trình
// bày. Chốt đặt TRƯỚC mọi nhánh đường ra (--extract lẫn render, Cổng 1 lẫn
// Cổng 2) nên một chỗ che hết; vá riêng ở thân lệnh thì ba đường gọi còn lại
// vẫn sinh thẻ ma.
// Câu chữ ở đây là MẶT MÁY theo chính bản luật ngôn ngữ mặt người (nó liệt
// «thông điệp lỗi của script» vào cột KHÔNG ÁP, nơi tên chính xác là bắt
// buộc). Tiếng sản phẩm sống ở thân lệnh commands/acceptance-card.md, nơi
// bước tiền đề thuật lại ca này cho người.
// <<<NO-DOSSIER-GUARD  — MỘT nguồn của ba thông điệp; thân lệnh chép nguyên
// văn và phép đo RÚT từ đây (không gõ literal), nên đổi chữ ở đây mà quên
// thân lệnh là ĐỎ ngay, không trôi âm thầm.
const MSG_NO_WORKSPACE = 'gate-card: xưởng chưa mở';
const MSG_NO_DOSSIER   = 'gate-card: không có hồ sơ';
const MSG_NO_CONTRACT  = 'gate-card: hồ sơ chưa có contract.md';
// NO-DOSSIER-GUARD>>>
// <<<NO-DOSSIER-GUARD-BLOCK
if (!contract.trim()) {
  const acc = path.join(root, '_acceptance');
  let real = [];
  try {
    real = fs.readdirSync(acc, { withFileTypes: true })
      .filter(e => e.isDirectory() && fs.existsSync(path.join(acc, e.name, 'contract.md')))
      .map(e => e.name).sort();
  } catch (_) { /* xưởng không đọc được → danh sách rỗng, nhánh dưới vẫn nói đúng ca */ }
  if (!fs.existsSync(path.join(acc, 'config.yaml'))) {
    process.stderr.write(MSG_NO_WORKSPACE + ' — không thấy _acceptance/config.yaml dưới "' + root + '". Chạy acceptance-init cho kho này trước.\n');
  } else if (!fs.existsSync(dir)) {
    process.stderr.write(MSG_NO_DOSSIER + ' «' + slug + '» — _acceptance/' + slug + '/ không tồn tại.\n' +
      (real.length ? '  Hồ sơ có thật trong xưởng: ' + real.join(', ') + '\n'
                   : '  Xưởng chưa có hồ sơ nào.\n'));
  } else {
    process.stderr.write(MSG_NO_CONTRACT + ' «' + slug + '» — _acceptance/' + slug + '/ có mặt nhưng chưa đọc được contract.md, chưa có gì để trình.\n' +
      (real.length ? '  Hồ sơ đủ bản hợp đồng trong xưởng: ' + real.join(', ') + '\n' : ''));
  }
  process.exit(2);
}
// NO-DOSSIER-GUARD-BLOCK>>>

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
// Lột dấu markdown khi buộc in text thô (fallback của tầng card-plain):
// `code`, **đậm**, *nghiêng*, [nhãn](link) → chữ trần. KHÔNG đụng gạch dưới —
// run_id, suites_exit là tên máy hợp lệ, lột "_" sẽ phá chúng.
//
// HAI CHÂN giữ đường dẫn nguyên vẹn (card-text-fidelity):
//
// (1) CHE nội dung trong dấu nháy ngược TRƯỚC, lột sau, trả lại cuối. Đây là
//     khôi phục ngữ nghĩa markdown chuẩn — nội dung đoạn mã KHÔNG tham gia
//     nhấn mạnh. Bản cũ lột nháy trước rồi mới lột đậm, tức tự tay phá lớp bảo
//     vệ đó: `**Miễn trừ `+"`"+`.github/**`+"`"+` khỏi …**` bị ghép dấu đóng
//     của cụm đậm với hai sao của glob.
//
// (2) Dùng lookbehind (không tiêu thụ ký tự dẫn — nhóm dẫn kiểu (^|[^*/])
//     ăn mất khoảng trắng phân tách nên cụm đậm liền sau bị trượt).
//     Dấu nhấn mạnh không được MỞ ngay trước dấu gạch chéo và không được ĐÓNG
//     ngay sau dấu gạch chéo — `*/_acceptance/*` là đường dẫn, không phải chữ
//     nghiêng. Ba vòng trước chỉ đặt chốt ở dấu mở nên hình dạng đóng-sau-gạch
//     -chéo vẫn lọt.
//
// Kỳ vọng cho TỪNG hình dạng nằm ở bộ kiểm P161 (tests/plugins/run-tests.sh),
// và bảng hình dạng ở đó RÚT TỪ hồ sơ thật chứ không do người viết tự nghĩ.
const MASK = '\u0000';
const stripMd = s => {
  const code = [];
  let t = String(s == null ? '' : s)
    .replace(/`([^`]+)`/g, (_, c) => { code.push(c); return MASK + (code.length - 1) + MASK; })
    .replace(/\[([^\]]*)\]\([^)\s]*\)/g, '$1')
    .replace(/(?<![*/])\*\*\*(?=[^\s/])([^*]+?)(?<=[^\s/])\*\*\*(?!\*)/g, '$1')
    .replace(/(?<![*/])\*\*(?=[^\s/])([^*]+?)(?<=[^\s/])\*\*(?!\*)/g, '$1')
    .replace(/(?<![*/])\*(?=[^\s/])([^*]+?)(?<=[^\s/])\*(?!\*)/g, '$1');
  return t.replace(new RegExp(MASK + '(\\d+)' + MASK, 'g'), (_, i) => (code[+i] !== undefined ? code[+i] : ''));
};
const { parseAC, acBlindSpot, blindSpotText } = require('../lib/ac-line.cjs');
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
  if (/^(implemented|verified|signed-off|machine-cleared)$/i.test(status)) gate = '2';
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
  // Luật van thoát nằm ở lib/gap-probe.cjs — CÙNG hàm mà pre-merge gọi. Không
  // viết lại ở đây: contract v2 chết đúng vì chỗ này bị tách làm hai bản, parity
  // giữ bằng comment (ledger d-125/d-126). P38 canh bằng máy.
  const gpDescopeId = gapProbe.descopeId(read(path.join(dir, 'decisions.jsonl')));
  const gpDescope = gpDescopeId ? (decsAll.find(e => e.id === gpDescopeId) || { id: gpDescopeId }) : null;
  const gpP0 = parseInt(clean(gpFm.p0), 10) || 0, gpP1 = parseInt(clean(gpFm.p1), 10) || 0, gpP2 = parseInt(clean(gpFm.p2), 10) || 0;
  const gpVerdictKnown = gpVerdict === 'clean' || gpVerdict === 'findings' || gpVerdict === 'probe-failed';

  // ---- trục ngữ cảnh (design-pass.md — khối chỉ hiện khi phiên S1-D đã chạy) ----
  // Nhãn tiếng người + chuỗi descope là CHUỖI PIN của P135-P138; đổi phải đổi test.
  // Bảng tra KHÔNG prototype: object literal làm `TABLE[key]` trúng mọi khoá kế thừa
  // (`constructor` · `__proto__` · `toString` · `valueOf` · `hasOwnProperty`), nên cờ
  // «không nhận diện được» im lặng và thẻ in ra rác kiểu `function Object() { … }`.
  // Giá trị vào đây đến thẳng từ frontmatter sổ phiên — văn bản người/máy viết.
  // Sửa theo LỚP: CẢ HAI bảng nhãn, và mọi chỗ tra chúng (cờ · --extract · render).
  const CONTEXT_LABEL = Object.assign(Object.create(null), { 'standalone': 'đứng một mình', 'static-frame': 'khung giả tĩnh', 'host-embedded': 'nhúng host thật' });
  const DP_SCENE_DESCOPE = 'bỏ cảnh ngữ-cảnh — ';
  // Nhãn tiếng người của thang phản ứng — CÙNG chữ với cột «Tên» của REACTION-LADDER
  // trong skills/design-pass/SKILL.md. Không tự chế chuỗi: ca DP9 rút nhãn TỪ bảng đó
  // rồi đòi thấy đúng nó trên đầu ra thẻ, nên lệch một chữ là đỏ.
  const REACTION_LABEL = Object.assign(Object.create(null), {
    'nac-0': 'đi thẳng',
    'nac-1': 'không đồng bộ trên ảnh',
    'nac-2': 'không đồng bộ trên vật bấm được',
    'nac-3': 'ngồi cùng ngắn, có người gọi tên',
  });
  const dpText = read(path.join(dir, 'design-pass.md'));
  const dpFm = frontmatter(dpText);
  const dp = { present: !!dpText.trim(), material: clean(dpFm.material || ''), context: clean(dpFm.context || ''), scenes: [], reaction: '', options: '' };
  if (dp.present) {
    // Placeholder khuôn chưa điền CHỨA DẤU PHẨY — phải loại '<'/'>' TRƯỚC khi split,
    // không thì nửa sau placeholder sống qua filter và standalone-thiếu-cảnh im lặng
    // trong khi card khoe "1 cảnh ngữ-cảnh" (false-green seam writer→reader, S4-r1).
    const rawScenes = clean(dpFm.context_scenes || '');
    if (!/[<>]/.test(rawScenes)) dp.scenes = rawScenes.replace(/^\[|\]$/g, '').split(',').map(s => s.trim()).filter(Boolean);
    // `reaction: <id> (<kênh>)` — lấy id, bỏ phần kênh.
    // Khoá VẮNG HẲN và khoá ĐIỀN NỬA VỜI là hai chuyện khác nhau: cái trước là hồ sơ
    // đời trước thang phản ứng, cái sau là phiên MỚI vừa ghi hỏng. Gộp cả hai vào một
    // câu «hồ sơ đời trước» là nói sai chuyện đang xảy ra cho người duyệt, và giấu mất
    // cái sai vừa xảy ra (S4-r2 finding, AC-10). Nên giữ ba mẩu riêng.
    const rawReaction = clean(dpFm.reaction || '');
    dp.reaction_raw = rawReaction;
    dp.reaction_declared = ('reaction' in dpFm);   // CÓ MẶT dòng khoá, không phải giá trị khác rỗng
    dp.reaction_placeholder = /[<>]/.test(rawReaction);
    const reactionId = (rawReaction.match(/^(nac-[0-9a-z]+)/) || [])[1] || '';
    dp.reaction = reactionId || (dp.reaction_placeholder ? '' : rawReaction);
    const rawOptions = clean(dpFm.options || '');
    dp.options = /[<>]/.test(rawOptions) ? '' : rawOptions;
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
    // Đường đọc-cũ của thang phản ứng: sổ phiên đời trước không có khoá này. Cờ vàng,
    // KHÔNG chặn, KHÔNG bắt migrate — cùng khuôn với trục ngữ cảnh từ 2.0.0.
    if (!dp.reaction && dp.reaction_declared) dpFlags.push('Sổ phiên có khoá nấc phản ứng nhưng CHƯA ĐIỀN: "' + dp.reaction_raw + '" — phiên này vừa ghi hỏng, KHÔNG phải hồ sơ đời trước; không chặn, sửa sổ phiên rồi dựng lại thẻ.');
    else if (!dp.reaction) dpFlags.push('Sổ phiên chưa khai nấc phản ứng (hồ sơ đời trước thang phản ứng) — không biết phiên đã gọi người ở nấc nào; không chặn, khuyên bổ sung ở phiên thiết kế sau.');
    else if (!REACTION_LABEL[dp.reaction]) dpFlags.push('Nấc phản ứng không nhận diện được: "' + dp.reaction + '" — chỉ nhận nac-0 / nac-1 / nac-2 / nac-3.');
    else if (dp.reaction_placeholder) dpFlags.push('Nấc phản ứng đã khai nhưng phần kênh còn nguyên chỗ trống của khuôn: "' + dp.reaction_raw + '" — không biết phiên đã gọi người qua kênh nào; không chặn.');
    if (!he.present) dpFlags.push('Repo chưa khai đường nhúng (design_pass.host_embed) — phiên coi như chưa có đường nhúng rẻ, đi nấc thấp; không chặn.');
    else if (!he.resolvable) dpFlags.push('Đường nhúng đã khai nhưng con trỏ không giải được: "' + he.guide + '" — sửa con trỏ, hoặc phiên đi nấc thấp; không chặn.');
  }

  // ---- ngưỡng nghiệm thu (opportunity.md — mối nối Vòng HIỂU → Cổng Phạm vi) ----
  // Heading là chuỗi PIN round-trip với khuôn opportunity-template (P197 rút heading từ khuôn).
  // Không lưu «đường A» ở đâu cả: có/không hồ sơ cơ hội suy khi đọc (hồ sơ moi-noi-vong-trao,
  // ledger descope route). Đọc-cũ: hồ sơ không opportunity = dòng sự kiện, không lỗi.
  // Hằng + vị từ hỏi LIB sở hữu luật ngưỡng — bản chép tay trong cùng file là hai nguồn
  // cho một hằng, và hai bản PLACEHOLDER_RE đã kịp lệch nhau (finding S4-r4).
  const NG1 = require(path.join(__dirname, '..', 'lib', 'nguong-o-co-hoi.cjs'));
  const OPP_TPL1 = path.join(__dirname, '..', 'skills', 'acceptance', 'references', 'opportunity-template.md');
  const UAT_THRESHOLD_HEADING = NG1.UAT_THRESHOLD_HEADING;
  const oppPath = path.join(dir, 'opportunity.md');
  const oppText = read(oppPath);
  // present = FILE TỒN TẠI (statSync), không suy từ chuỗi rỗng — read() trả '' cho cả file vắng
  // lẫn file quá cỡ; hai ca đó khác nhau trên thẻ (S4-r1 finding).
  let rangHongNguong = null;
  const ut = { opportunity_present: fs.existsSync(oppPath), readable: !!oppText.trim(), section_present: false, lines: [] };
  if (ut.opportunity_present && ut.readable) {
    // Ranh giới heading: cùng dạng tiền tố `\b` với lib/md-section.cjs (một luật, không khớp-chính-xác riêng)
    ut.section_present = new RegExp('^#{2,6}\\s+' + UAT_THRESHOLD_HEADING.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&') + '\\b', 'im').test(oppText);
    // Dòng «đã khai» = có nội dung sau dấu ':' khác placeholder của khuôn («…»/«...»/rỗng); khuôn chép
    // nguyên chưa điền KHÔNG được tính là ngưỡng (S4-r2 finding: placeholder lọt thành «đã khai»).
    // «chưa điền» hỏi đúng vị từ của lib trên PHẦN GIÁ TRỊ bullet — không giữ regex riêng.
    const chuaDien = l => NG1.chuaDien(l);
    if (ut.section_present) ut.lines = section(oppText, UAT_THRESHOLD_HEADING).map(l => l.trim()).filter(l => l && !/^>/.test(l) && !chuaDien(l));
  }
  // «ĐÃ KHAI NGƯỠNG» phải HỎI LIB, không tự suy từ `lines.length > 0`. Vị từ tự chế là bên đọc
  // thứ hai, và nó trả lời KHÁC lib ở ba ca thật (S4-r9 [1][5]): ô thiếu hẳn nhãn của khuôn · ô
  // mang tiền tố ĐỀ XUẤT của khuôn (máy đề nghị, người CHƯA chốt) · ô điền đủ nhưng KHÔNG gạch đầu
  // dòng. Ở cả ba, thẻ in «Ngưỡng nghiệm thu (đã khai ở Cổng Đáng)» — tức gán cho người một lời
  // khai người chưa nói — trong khi bộ quét gọi «chưa chốt». Nguồn phải là MỘT.
  let ngState = null;
  if (ut.opportunity_present && ut.readable && ut.section_present) {
    try { ngState = NG1.thresholdState(oppText, read(OPP_TPL1)); }
    catch (e) { rangHongNguong = e.message; }
  }
  ut.state = ngState;

  // Lối «không đo được» tính NGAY đây — cả răng chống lách lẫn khối đường-đo cùng hỏi nó.
  let mienDo = false, rangHong = null;
  if (ut.opportunity_present && ut.readable) {
    try {
      const kd = NG1.prefixes(read(OPP_TPL1)).khongDo;
      mienDo = section(oppText, UAT_THRESHOLD_HEADING).some(l => NG1.isKhongDoLine(l, kd));
    } catch (e) { rangHong = e.message; }
  }

  // ---- đường đo (contract `## Đường đo` — chỉ có nghĩa khi hồ sơ có ngưỡng đã khai) ----
  // Heading + tiền tố bỏ là CHUỖI PIN round-trip với khối CONTRACT-DUONG-DO-TEMPLATE của khuôn
  // (DD5) và câu auto-draft trong feature-loop SKILL S1#4 (DD6). «Áp dụng» = ĐÚNG vị từ ut ở trên
  // (khối «Ngưỡng nghiệm thu» in ⇔ applicable) — không viết vị từ thứ hai (d-4303).
  const DUONG_DO_HEADING = 'Đường đo';
  const DUONG_DO_DESCOPE = 'bỏ đường-đo — ';
  const ddStem = DUONG_DO_DESCOPE.replace(/\s*—\s*$/, '').toLowerCase();
  // dòng bỏ nhận diện ROỘNG (lệch gạch nối / viết hoa vẫn là dòng bỏ — finding C1); entry ledger vẫn phải ĐÚNG tiền tố mới thành info
  const ddIsBoLine = l => /^bỏ\s+đường[-\s]đo\b/i.test(l.trim()) || l.trim().toLowerCase().startsWith(ddStem);
  // Ô khai «không đo được» thì KHÔNG có ngưỡng để đo → không đòi đường đo (giục xây đường
  // đo cho lối ra vừa khai đúng là cằn nhằn sai ngay tại cổng người — finding S4-r4).
  const ddApplicable = ut.opportunity_present && ut.readable && ut.section_present && ut.lines.length > 0 && !mienDo;
  const ddPresent = new RegExp('^#{2,6}\\s+' + DUONG_DO_HEADING + '\\b', 'im').test(contract);
  // dòng thật = bullet không còn placeholder VÀ không phải dòng bỏ (dòng bỏ không phải đường đo — gap-probe F2)
  const ddLines = ddPresent ? bullets(section(contract, DUONG_DO_HEADING)).filter(l => !/\{\{/.test(l) && !ddIsBoLine(l)) : [];
  const ddDescope = decsAll.find(e => e.type === 'descope' && String(e.decision || '').startsWith(DUONG_DO_DESCOPE)) || null;

  // ── Răng chống lách (hồ sơ ra-co-ten, AC-11) ──
  // Lối «không đo được» chỉ dành cho vòng KHÔNG có người dùng cuối. Hợp đồng khai mặt
  // ui/mobile mà ô cơ hội lại khai không đo được ⇒ đang trốn Cổng Giá trị.
  const mienDoCoNguoiDung = mienDo && NG1.coNguoiDungCuoi(clean(cfm.surfaces));
  if (EXTRACT) { process.stdout.write(JSON.stringify({ gate: 1, feature, tier, blind_spot: blindSpot ? { kind: blindSpot.kind, suspect: blindSpot.suspect, parsed: blindSpot.parsed, lines: blindSpot.lines, heading: blindSpot.heading } : null, will_do: willDo.map(x => ({ id: x.id, gwt: x.gwt })), wont_do: wontDo.map(x => ({ id: x.id, gwt: x.gwt })), scope: oos, coverage: covLines, coverage_missing: !covPresent || !covLines.length, glossary_delta: { present: glossaryPresent, computed: glossaryDelta !== null, error: glossaryDeltaErr, terms: glossaryDelta || [] }, gap_probe: { present: gpPresent, verdict: gpPresent ? (gpVerdict || null) : null, p0: gpP0, p1: gpP1, p2: gpP2, rows: gpRows.map(r => ({ sev: r.sev, artifact: r.artifact, summary: r.summary, disposition: r.disposition })), parse_dropped: gpDropped, descoped: !!gpDescope }, decisions: decsAll.map(e => ({ id: e.id, type: e.type, stage: e.stage, decision: e.decision, impact: e.impact })), decisions_broken: ledger.broken, design_pass: dp.present ? { material: dp.material, context: dp.context, context_label: CONTEXT_LABEL[dp.context] || null, scenes: dp.scenes, reaction: dp.reaction, reaction_label: REACTION_LABEL[dp.reaction] || null, options: dp.options, host_embed: he, flags: dpFlags } : { present: false }, uat_threshold: ut, cong_gia_tri: { mien_do_co_nguoi_dung: mienDoCoNguoiDung }, duong_do: { applicable: ddApplicable, present: ddPresent, lines: ddLines, descoped: ddDescope ? ddDescope.id : null } }, null, 2)); process.exit(0); }
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
<div class="h"><div><div class="ft">${esc(featurePlain)}</div><div class="sub">Cổng 1 · duyệt tiêu chí TRƯỚC khi code${tier === 'T3' ? ' · tier T3 (đụng critical)' : ''}</div></div><span class="chip amber">duyệt tiêu chí</span></div>`];
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
  if (ddLines.length) P.push(`<div class="lab">Đường đo (con số cho ngưỡng sẽ đến từ đâu)</div><div class="grp gnot">${ddLines.map(t => `<p class="li">${esc(t)}</p>`).join('')}</div>`);
  if (dp.present) P.push(`<div class="lab">Bản mẫu &amp; ngữ cảnh</div><div class="grp gnot"><p class="li">Vật liệu: ${esc(dp.material || '(chưa khai)')} · sống ở: <b>${esc(CONTEXT_LABEL[dp.context] || dp.context || '(chưa khai)')}</b>${dp.scenes.length ? ' · ' + dp.scenes.length + ' cảnh ngữ-cảnh' : ''}</p><p class="li">Phản ứng ở nấc: <b>${esc(REACTION_LABEL[dp.reaction] || dp.reaction || '(chưa khai)')}</b>${dp.options ? ' · có bộ phương án đính kèm' : ''}</p></div>`);
  // Dòng ngưỡng in NGUYÊN VĂN (AC-1 hồ sơ moi-noi-vong-trao): chỉ bỏ dấu đầu dòng, không đi qua
  // hàm lột markdown — số chỗ gọi hàm lột là ma trận đã ghim của card-text-fidelity (P161).
  // Nhãn khối nói ĐÚNG trạng thái: chỉ `chot` mới là «đã khai ở Cổng Đáng» (lời của NGƯỜI).
  // `de-xuat` / `chua-chot` vẫn in ra để người soi, nhưng KHÔNG được gọi là lời khai của họ.
  if (ut.opportunity_present && ut.readable && ut.section_present && ut.lines.length) {
    const nhanKhoi = ngState === 'de-xuat' ? 'Ngưỡng nghiệm thu — ĐỀ XUẤT CỦA MÁY, anh chưa chốt'
      : 'Ngưỡng nghiệm thu (đã khai ở Cổng Đáng)';
    P.push(`<div class="lab">${nhanKhoi}</div><div class="grp gnot">${ut.lines.map(l => `<p class="li">${esc(l.replace(/^[-*]\s+/, ''))}</p>`).join('')}<p class="li">${mienDo ? 'Ô khai không đo được — vòng này không có phiên nghiệm thu; đã giao là đóng.' : 'Vòng này sẽ có phiên nghiệm thu sau khi giao — số đo thật sẽ đặt cạnh các ngưỡng trên.'}</p></div>`);
  }
  if (glossaryDelta && glossaryDelta.length) P.push(`<div class="lab">Từ vựng chốt ở feature này</div><div class="grp gnot">${glossaryDelta.map(x => `<p class="li">${esc(x.term)} — ${x.added ? 'term MỚI' : 'định nghĩa/_Avoid_ được sửa'}</p>`).join('')}</div>`);
  if (gpPresent && gpVerdict === 'clean' && !gpRows.length && !gpDropped) P.push(`<div class="lab">Phản biện context sạch</div><div class="flag fok">Phản biện: không còn lỗ đáng kể.</div>`);
  else if (gpRows.length) P.push(`<div class="lab">Phản biện context sạch</div><div class="grp gnot">${gpRows.map((r, i) => `<p class="li"><b>${esc(r.sev)}</b> · ${esc(pIdx(pl.gap_probe_plain, i) || stripMd(r.artifact) + ' · ' + stripMd(r.summary) + ' — ' + stripMd(r.disposition))}</p>`).join('')}</div>`);
  const flags = [];
  if (glossaryPresent && glossaryDelta && !glossaryDelta.length) flags.push(['finfo', 'Từ vựng: feature này không thêm/sửa term nào trong CONTEXT.md.']);
  // (lenh-in-ra-phai-bam-duoc AC-5) cờ «chưa truyền --glossary-base» đã bỏ — nó nói với agent, không với người.
  if (glossaryDeltaErr === 'git-failed') flags.push(['fwarn', 'Từ vựng: không đọc được diff CONTEXT.md (base sai hoặc không phải git repo) — term mới/sửa CHƯA được trình, đừng coi là "không có thay đổi".']);
  for (const id of covGaps) flags.push(['fwarn', `${id} có ngưỡng/biên nhưng chưa có ca "dưới ngưỡng → KHÔNG xảy ra" — thêm 1 ca chặn ngay sẽ rẻ hơn nhiều so với phát hiện sau.`]);
  // dpFlags chảy vào HAI đường: mảng `flags` (ra HTML) và `--extract` (JSON máy-đọc).
  // Thoát chuỗi ở CHỖ ĐẨY làm đúng đường HTML nhưng bẩn đường JSON — thực thể `&lt;`
  // lọt vào trường máy đọc (hồi quy do chính bản vá S4-r4 của tôi). Nên giữ dpFlags
  // NGUYÊN VĂN và thoát chuỗi ở ĐÚNG BIÊN RENDER, cùng nếp với mọi mục khác của
  // `flags` (chúng cũng esc() ngay trước khi vào mảng này).
  for (const f of dpFlags) flags.push(['fwarn', esc(f)]);
  if (!ut.opportunity_present) flags.push(['finfo', 'Vòng này không có hồ sơ cơ hội → sau Cổng Bằng chứng sẽ ship thẳng, không phiên nghiệm thu.']);
  else if (!ut.readable) flags.push(['fwarn', 'Hồ sơ cơ hội có nhưng thẻ không đọc được (file rỗng hoặc quá cỡ) — chưa biết vòng này có ngưỡng nghiệm thu không; soi file trước khi duyệt.']);
  else if (!(ut.section_present && ut.lines.length)) flags.push(['fwarn', 'Hồ sơ cơ hội chưa khai ngưỡng nghiệm thu — chưa biết vòng này sẽ được đo bằng gì; khai ở Cổng Đáng trước khi duyệt.']);
  // Ô mang tiền tố «đề xuất» = MÁY đề nghị, người CHƯA nói. Thẻ Cổng Phạm vi là mặt người duy
  // nhất ở bước đó, nên gọi nó là «đã khai ở Cổng Đáng» là máy nói hộ người — thứ hiến pháp kit
  // cấm (S4-r9 [1]). Cờ này THÊM, không thay chuỗi cũ (P198 của hồ sơ đã ký ghim nguyên văn).
  else if (ngState === 'de-xuat') flags.push(['fwarn', 'Ngưỡng nghiệm thu đang là ĐỀ XUẤT CỦA MÁY — anh chưa chốt. Thẻ KHÔNG coi đây là lời khai của anh; chốt ở Cổng Đáng trước khi duyệt.']);
  if (rangHongNguong) flags.push(['fwarn', `Thẻ không phân loại được ô ngưỡng (${esc(rangHongNguong)}) — sửa khuôn rồi chạy lại, đừng duyệt khi thẻ đang mù.`]);
  if (ddApplicable && !ddLines.length) {
    if (ddDescope) flags.push(['finfo', `Đã bỏ đường đo theo ${esc(ddDescope.id || 'entry descope')} — Cổng Giá trị sẽ đọc ngưỡng với ô CHƯA ĐO; quyết định chủ động, có dấu vết.`]);
    else flags.push(['fwarn', 'Hồ sơ cơ hội có ngưỡng nhưng contract chưa có đường đo — không ai xây thứ sinh ra con số, Cổng Giá trị sẽ đọc bảng toàn CHƯA ĐO. Thêm section «Đường đo» (mỗi thước một dòng: số từ đâu · AC nào bảo đảm) hoặc ghi entry «bỏ đường-đo — lý do 1 dòng» rồi hãy duyệt.']);   // không đặt <…> thô trong cờ: HTML nuốt như tag (review S4-r1 F1)
  }
  // Răng chống lách: đặt SAU chuỗi if/else của ngưỡng — chen vào giữa là cướp mất nhánh else.
  if (rangHong) flags.push(['fred', `Răng chống lách KHÔNG chạy được: ${rangHong} (${OPP_TPL1}) — thẻ này chưa kiểm được «khai không đo được nhưng có mặt người dùng». Sửa khuôn rồi dựng lại thẻ trước khi duyệt.`]);
  if (mienDoCoNguoiDung) flags.push(['fred', 'Khai không đo được nhưng hợp đồng có mặt người dùng (ui/mobile) — lối «không đo được» chỉ dành cho vòng không có người dùng cuối. Khai lại ngưỡng, hoặc bỏ mặt người dùng khỏi hợp đồng.']);
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
  // ---- 👉 VIỆC CỦA ANH trên THẺ (danh sách máy-đếm — chip ② kit 2.1): mỗi
  // mục làm-gì/ở-đâu/trả-lời-dạng-gì + câu mẫu gộp MỘT dòng (một <p> duy nhất,
  // không tag chen giữa — P185 canh). Khuôn này sống CHỈ trên thẻ; tin nhắn
  // mời cổng KHÔNG dùng nó (hồ sơ cat-khoi-viec-cua-anh-tren-tin, 16/08 —
  // điều khoản GATE-INVITE-CLAUSE trong human-facing-language.md).
  P.push(`<div class="lab">👉 VIỆC CỦA ANH</div><div class="grp gdo"><p class="li"><b>Duyệt hay trả hồ sơ này</b> — làm gì: đọc hai khối SẼ làm / KHÔNG làm và các cờ chú ý ở trên; ở đâu: trả lời ngay trong phiên đang trình thẻ; trả lời dạng: «Duyệt» hoặc «Sửa: nêu điều cần đổi».</p><p class="li">Trả lời mẫu (một dòng, điền vào chỗ trống): «duyệt hay sửa: ___»</p></div>`);
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
    if (/^#{1,6}\s/.test(raw)) { cur = null; skip = -1; continue; } // LOP-DOC: heading
    const em = raw.match(/^-\s+eval:\s*(\S+)/); if (em) { cur = em[1]; evid[cur] = {}; skip = -1; continue; }
    // Khối KHÔNG-phải-eval ở cột 0 (khuôn SUITE-BLOCK-TEMPLATE mở đầu bằng `- cmd:`)
    // ĐÓNG khối đang mở. Thiếu nhánh này thì run_id/exit_code/verified_at của lệnh
    // chạy chung chảy vào eval CUỐI và cờ «bằng chứng máy đầy đủ» xanh nhờ mã của
    // lệnh suite — false-green ngay tại khoảnh khắc người bấm ký. Bullet thụt lề
    // (mục của required_evidence) KHÔNG khớp vì mẫu này neo cột 0.
    if (/^-\s+\w+\s*:/.test(raw)) { cur = null; skip = -1; continue; } // LOP-DOC: bullet
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
<div class="lab">👉 VIỆC CỦA ANH</div><div class="grp gnot"><p class="li">không cần làm gì — ${verdict === 'REJECT' ? 'máy đang quay lại sửa code rồi tự chấm vòng mới' : verdict === 'BLOCKED' ? 'máy đang khắc phục nguyên nhân kẹt rồi chạy lại vòng chấm' : 'máy phải chạy lại vòng chấm để có kết luận đọc được'}; thẻ này chỉ báo trạng thái. Khi máy cần bạn quyết, nó hỏi bằng tin nhắn riêng.</p></div>
<div class="foot"><span class="rev">↻ Trả lại → quay về code; trạng thái này không có nút ký.</span><div class="btns"><button class="b no">Quay về code</button></div></div>
</div></div>`);
  process.stdout.write(P.join('\n'));
  process.exit(0);
}

// --- approvable: PASS / PENDING-JUDGMENT ---
// Trạng thái làn V HỎI đúng bộ phân ô, KHÔNG dựng lại sáu điều kiện xanh-sạch ở
// đây: đó sẽ là bản dựng THỨ BA của lớp lỗi lan-v-khong-phai-cho-ky đã trả giá
// (bash trong lưới trước-merge, JS trong khong-can-nguoi). Thẻ tiêu thụ CHÍNH
// đầu ra của máy quét nên không thể lệch theo cấu trúc (ledger d-...-29818).
// Hồ sơ máy đã đi tiếp hợp lệ thì thẻ KHÔNG mời ký — hôm nay nó vẫn in «máy đã
// xong — ký nhanh» kèm nút Ký cho đúng những hồ sơ lưới đã cho qua.
// Máy quét chết → GIỮ NGUYÊN hành vi cũ + một cờ vàng; không bao giờ im lặng
// tuyên sạch (fail-visible, không fail-quiet).
const trangThai = require('./trang-thai-ho-so.cjs');
let scanState = null, scanErr = null, scanBroken = null;
try {
  const r = require('child_process').spawnSync(process.execPath,
    [path.join(__dirname, 'start-scan.mjs'), '--root', root],
    { encoding: 'utf8', timeout: 20000, maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0) scanErr = (r.stderr || '').trim().slice(0, 200) || `exit ${r.status}`;
  else {
    const j = JSON.parse(r.stdout);
    // `config: false` = máy quét CHẠY ĐƯỢC nhưng repo chưa dựng cổng, nên không
    // có `groups`. Đó KHÔNG phải lỗi: không có gì để nói thì thẻ đi lối cũ và
    // KHÔNG bật cờ. Cờ chỉ dành cho máy quét THẤT BẠI. (P150 bắt: bản đầu đọc
    // thẳng j.groups.gates nên ném lỗi và bật cờ oan ở mọi repo không workspace.)
    const gr = j.groups || {};
    const hit = [...(gr.gates || []), ...(gr.inProgress || []), ...(gr.done || [])]
      .find(x => x.slug === slug);
    // `broken` phát ở TẦNG NGOÀI `groups` (start-scan out({..., broken})) — không tra nó
    // thì hồ sơ bộ quét gọi HỎNG rơi vào scanState null và mệnh đề «bộ quét mù» bên dưới
    // biến đúng hồ sơ mâu thuẫn thành «máy đã đi tiếp hợp lệ» (S4-r6 [4], dựng lại được
    // với machine-cleared + human_signoff).
    scanBroken = (j.broken || []).find(x => x.slug === slug) || null;
    scanState = hit ? hit.stateKey : (scanBroken ? (scanBroken.stateKey || 'ho-so-hong') : null);
  }
} catch (e) { scanErr = String(e.message).slice(0, 200); }
// Hồ sơ đã có ô kết `machine-cleared` cũng là «máy đã đi tiếp» — bộ quét gọi nó bằng hai
// khoá riêng, thẻ phải nhận cả bốn, nếu không hồ sơ máy-thông lại bị mời ký (hồ sơ ra-co-ten).
const MAY_THONG = (clean(cfm.status) || '').toLowerCase() === 'machine-cleared';
// Ca «bộ quét mù» (chạy lỗi, hoặc repo chưa dựng cổng) KHÔNG còn cần vế riêng: `MAY_THONG`
// đọc thẳng status nên nó đúng cả khi bộ quét câm — mời ký lúc mù là ca thẻ từng dẫm với
// may-di-tiep (S4-r4). Hồ sơ HỎNG vẫn phải hiện đường sửa, nên `!scanBroken` giữ nguyên
// ở vế đầu (S4-r6 [4]).
// Vế `MAY_THONG` đứng RIÊNG, không nằm trong danh sách khoá: hợp đồng đã khai `machine-cleared`
// là ĐÃ QUA Cổng Bằng chứng KHÔNG chữ ký — sự thật đó do STATUS quyết, không do khoá bộ quét.
// Liệt khoá bằng tay là blacklist trên không gian mở và nó đã thủng ba vòng liền: hồ sơ
// máy-thông CÓ `opportunity.md` rơi vào `cho-cong-gia-tri` (khoảnh khắc người kế là Cổng Giá
// trị, không phải Cổng 2) hoặc `da-giao-khong-do` — cả hai đều ngoài danh sách, nên thẻ vừa in
// «máy đã thông — KHÔNG có chữ ký người» vừa mời «Ký duyệt», và người bấm theo sẽ bị chính
// hook + lưới trước-merge chặn (S4-r7 [0][3], S4-r8 [2]).
// `scanState == null` = bộ quét KHÔNG trả lời được (chạy lỗi, hoặc repo chưa dựng cổng →
// `config:false`). Lúc đó thẻ KHÔNG biết hồ sơ có sạch không, nên phải GIỮ NGUYÊN hành vi cũ
// (mời ký) + một cờ vàng — đúng câu chú thích ngay trên. Bản S4-r10 để `MAY_THONG` đứng một
// mình nên repo không có config.yaml vừa MẤT nút ký vừa in lời khai sáu-điều-kiện mà không ai
// kiểm: im lặng tuyên sạch, đúng thứ bị cấm (S4-r12 [2]).
const MAY_DI_TIEP = !scanBroken && scanState != null && (MAY_THONG
  || ['may-di-tiep-veto-mo', 'may-di-tiep-xanh-sach',
      'da-giao-may-thong-veto-mo', 'da-giao-may-thong-xanh-sach'].includes(scanState));
// Chữ cho trạng thái này: bộ quét trả khoá thì HỎI BẢNG; bộ quét mù (scanState null) thì
// dùng câu dự phòng — `chu(null)` NÉM (bảng cố ý chết cho khoá lạ) và làm sập cả thẻ, đúng
// ca S4-r5 dựng lại được trên repo chưa dựng cổng: exit 1, 0 byte, người nhận màn hình trắng.
const CHU_MAY_THONG = { nhan: 'đã giao — máy thông (chưa đọc được trạng thái)', viecKe: 'người: veto lúc nào cũng được, cửa không có hạn' };
const chuMDT = () => (scanState == null ? CHU_MAY_THONG : trangThai.chu(scanState));
const chip = MAY_DI_TIEP
  ? { t: chuMDT().nhan, c: 'gray' }
  : (verdict === 'PASS' ? { t: 'máy đã xong — ký nhanh', c: 'teal' } : { t: 'cần bạn quyết', c: 'amber' });
P.push(`<div class="gc"><div class="card">
<div class="h"><div><div class="ft">${esc(featurePlain)}</div><div class="sub">${MAY_DI_TIEP ? 'Cổng 2 · máy đã đi tiếp' : 'Cổng 2 · ký duyệt'}${tier === 'T3' ? ' · tier T3 (đụng critical)' : ''}</div></div><span class="chip ${chip.c}">${esc(chip.t)}</span></div>`);
if (MAY_THONG && !scanBroken && scanState == null) P.push(`<div class="flag fwarn">Hợp đồng tự khai «máy đã thông» nhưng thẻ KHÔNG hỏi được bộ quét (repo chưa dựng cổng, hoặc bộ quét lỗi) — chưa ai kiểm sáu điều kiện xanh-sạch. Thẻ giữ lối ký như cũ; chạy máy quét trước khi tin lời khai đó.</div>`);
if (scanErr) P.push(`<div class="flag fwarn">⚠ Chưa đọc được trạng thái làn V (${esc(scanErr)}) — thẻ đang trình theo lối cũ, nên nó có thể đang mời ký một hồ sơ máy đã đi tiếp hợp lệ. Kiểm bằng máy quét trước khi ký.</div>`);
// Bộ quét gọi HỎNG → cờ ĐỎ in đúng lý do + đường sửa. Hồ sơ mâu thuẫn không bao giờ là
// «máy đã đi tiếp hợp lệ»; lưới trước-merge sẽ chặn y vậy, thẻ phải nói trước (S4-r6 [4]).
if (scanBroken) P.push(`<div class="flag fred">⚠ Bộ quét gọi hồ sơ này là HỎNG — ${esc(scanBroken.reason || 'không nêu lý do')}. Đường sửa: sửa hồ sơ đúng theo lý do trên rồi mở lại thẻ (lưới trước-merge cũng sẽ chặn y vậy); chưa sửa thì đừng ký.</div>`);
// Gác `!scanBroken` như MAY_DI_TIEP: hồ sơ HỎNG (vd chữ ký người trên hồ sơ máy-thông) thì câu
// «qua Cổng Bằng chứng bằng sáu điều kiện xanh-sạch, KHÔNG có chữ ký người» vừa SAI vừa KHÔNG
// ai kiểm — thẻ chỉ đọc `status`, không chạy xanhSach. In nó cạnh cờ đỏ đang trích chính chữ
// ký đó là thẻ tự cãi mình, đúng thứ AC-8 cấm (S4-r10 [1]).
if (MAY_THONG && !scanBroken && scanState != null) P.push(`<div class="flag finfo">máy đã thông — hồ sơ này qua Cổng Bằng chứng bằng sáu điều kiện xanh-sạch, KHÔNG có chữ ký người; cửa veto ${(clean(cfm.veto_state) || '').toLowerCase() === 'mo' ? 'đang mở' : 'không mở'}.</div>`);
if (MAY_DI_TIEP) P.push(`<div class="flag finfo">Hồ sơ này máy đã đi tiếp — ${esc(chuMDT().viecKe)}. Thẻ không có nút ký cho trạng thái này.</div>`);
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
  ooc.findings.forEach((f, fi) => {
    const rec = f.proposal === 'new-contract' ? 'Máy đề xuất: tách thành một việc riêng.'
      : f.proposal === 'known-limits' ? 'Máy đề xuất: ghi vào hạn chế đã biết rồi ship.'
      : 'Máy chưa đề xuất hướng nào.';
    // In câu ngôn ngữ sản phẩm do bước triage viết. Thiếu nó thì nói thẳng là
    // thiếu — TUYỆT ĐỐI không rơi về title kỹ thuật của reviewer, vì đó là thứ
    // người quyết kinh doanh không đọc được (và judge sẽ chấm nhầm tài liệu).
    // Nhãn Ngoài-<n> là mã tra cứu (N3) — khối 👉 VIỆC CỦA ANH trỏ về nó.
    const q = f.plain ? f.plain : '(chưa có mô tả cho người đọc — xem review-findings.md)';
    P.push(`<div class="item"><p class="q">Ngoài-${fi + 1} · ${esc(q)}</p><p class="ai">${esc(rec)}</p><div class="btns"><button class="b bn">ghi Known limits</button><button class="b bn">mở hợp đồng mới</button><button class="b no">nâng phạm vi sửa ngay</button></div></div>`);
  });
}
const yourCount = decisions.length + (oos.length ? 1 : 0);
if (yourCount) {
  P.push(`<div class="lab">Việc chỉ mình bạn quyết được — ${yourCount} việc</div>`);
  for (const d of decisions) {
    const reList = (evid[d.id] && evid[d.id].required_evidence_list) || [];
    const reHtml = reList.length ? `<p class="ai"><b>Muốn máy đổi ý, cần:</b> ${reList.map(x => esc(stripMd(x))).join(' · ')}</p>` : '';
    // Mã eval là mã TRA CỨU (N3): khối 👉 VIỆC CỦA ANH bảo "đọc câu hỏi <mã> ở
    // khối này", nên mã PHẢI hiện ngay tại câu hỏi — không thì lời chỉ đường
    // chỉ đúng bằng loại trừ (S4-r1, finding trong hợp đồng + judge E7).
    P.push(`<div class="item"><p class="q">${esc(d.id)} (câu hỏi cần mắt người) · ${esc(plainDec(d.id) || stripMd(d.q))}</p><p class="ai">Máy: chưa chắc${d.why ? ' — ' + esc(stripMd(d.why)) : ' (cần mắt người).'}</p>${reHtml}<div class="btns"><button class="b bn">Đạt</button><button class="b no">Chưa đạt</button></div></div>`);
  }
  if (oos.length) P.push(`<div class="item"><p class="q">Xác nhận các phần đã cắt/hoãn ngoài phạm vi:</p><p class="ai">${esc(scopePlain)}</p><div class="btns"><button class="b bn">Đồng ý cắt</button><button class="b no">Không, kéo vào</button></div></div>`);
}
const plDec2 = id => (((pl.decisions_plain || []).find(x => x.id === id)) || {}).p;
if (decsProvisional.length) {
  P.push(`<div class="lab">Quyết định CHƯA duyệt — cần phê (ghi sau Gate 1)</div>`);
  // Nhãn Treo-<n> là mã tra cứu ngắn (N3) — khối 👉 VIỆC CỦA ANH trỏ về nó khi
  // bảo "không phê: nêu mã". Id đầy đủ của sổ quyết định quá dài cho mặt người.
  decSort(decsProvisional).forEach((e, ti) => P.push(`<div class="item"><p class="q">Treo-${ti + 1} · ${esc(plDec2(e.id)) || decLine(e)}</p><p class="ai">${esc(e.stage || '')} · ${e.type === 'descope' ? 'đề nghị KHÔNG làm' : esc(e.type)}${e.revisit ? ' · xem lại khi: ' + esc(e.revisit) : ''}</p><div class="btns"><button class="b bn">Phê</button><button class="b no">Không phê</button></div></div>`));
}
if (decsApproved.length) P.push(`<div class="lab">Đã duyệt từ Gate 1</div><div class="grp gnot">${decSort(decsApproved).map(e => `<p class="li">${decLine(e)}</p>`).join('')}</div>`);
if (ledger.broken) P.push(`<div class="flag fwarn">⚠ ${ledger.broken} dòng ledger hỏng, đã bỏ qua.</div>`);
const flags = [];
// Cụm ngoài vùng phủ: bộ đo đang hụt so với chỗ lỗi thật xuất hiện. Không nêu
// đường dẫn file ở thẻ — thẻ là chỗ quyết định, chi tiết nằm ở gói bằng chứng.
if (ooc.cluster) flags.push(['fwarn', '⚠ Nhiều lỗi rơi ngoài vùng các bộ đo đang phủ — dừng và quyết: mở rộng hợp đồng hay rút phạm vi. Chi tiết trong review-findings.md.']);
{ const analyst = cleanLines(section(report, 'Analyst')).join(' ').trim();
  // n-a CÓ LÝ DO (≥ 20 ký tự sau «n-a») là lựa chọn chủ ý đã khai — không phải đỏ; n-a trần/ngắn vẫn đỏ
  // (hồ sơ lenh-in-ra-phai-bam-duoc AC-4: đỏ không có nghĩa dạy người bỏ qua màu đỏ).
  const naReason = /^n-a\b[\s—–:-]*([\s\S]*)$/i.exec(analyst);
  // «n-a có lý do» KHÔNG phải khi phần sau còn mệnh đề mở bằng mã eval (`; E4, E5: …`) — đó là phân tích thật (review S4-r1 F2)
  const naMixed = naReason && /[;\n]\s*[A-Z]{1,3}\d+\b/.test(naReason[1]);
  if (naReason && !naMixed && naReason[1].trim().length >= 20) { /* chủ ý, đã nêu lý do — không cờ */ }
  else if (naReason && !naMixed) flags.push(['fred', 'Analyst n-a không nêu lý do — baseline không chạy mà không nói vì sao; ghi lý do (≥ 20 ký tự) hoặc chạy baseline.']);
  else if (analyst && !/^none/i.test(analyst) && !/^\{\{/.test(analyst)) flags.push(['fred', esc(pl.analyst_plain || stripMd(analyst))]); }
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
// ---- 👉 VIỆC CỦA ANH (khối cứng máy-sinh — liệt TỪNG việc máy đã đếm, đúng
// thứ tự thẻ; mẫu gộp build động từ đúng các mã đang hiện, MỘT dòng — P186
// canh đủ mã, P186b canh khối-không-biến-mất khi 0 việc-người).
//
// BẤT BIẾN (luật âm «máy không viết sẵn câu trả lời của người» trong
// human-facing-language.md, đặt sau S4-r2): câu mẫu là KHUÔN DẠNG CÓ CHỖ TRỐNG. Máy nêu mã mục + các ngả
// chọn được, KHÔNG điền sẵn lựa chọn/verdict thay người. Bản round-2 từng in
// «Ngoài-1 ghi Known limits; E9 Đạt; đồng ý cắt; phê hết quyết định treo; Ký»
// — tức viết sẵn câu TRẢ LỜI của người tại cổng, vòng qua chính khoá ADR 0002.
// Mã trong câu mẫu phải là mã THÔ (esc một lần lúc render, không esc hai lần),
// nếu không người dán lại một chuỗi entity HTML không khớp mã họ thấy. ----
{
  const ymItems = []; const ymSlots = [];
  ooc.findings.forEach((f, fi) => {
    const lbl = 'Ngoài-' + (fi + 1);
    ymItems.push(`<b>Chọn hướng cho ${lbl}</b> — làm gì: đọc mục ${lbl} ở khối "Ngoài hợp đồng"; ở đâu: trả lời trong phiên đang trình thẻ; trả lời dạng: «${lbl}: ghi Known limits» hoặc «${lbl}: mở hợp đồng mới» hoặc «${lbl}: nâng phạm vi sửa ngay».`);
    ymSlots.push(lbl + ': ___');
  });
  for (const d of decisions) {
    ymItems.push(`<b>Chấm ${esc(d.id)} (câu hỏi cần mắt người)</b> — làm gì: đọc câu hỏi mở đầu bằng "${esc(d.id)}" ở khối "Việc chỉ mình bạn quyết được"; ở đâu: trả lời trong phiên đang trình thẻ; trả lời dạng: «${esc(d.id)} Đạt» hoặc «${esc(d.id)} Chưa đạt vì nêu lý do».`);
    ymSlots.push(d.id + ': ___');
  }
  if (oos.length) { ymItems.push(`<b>Xác nhận phần cắt/hoãn</b> — làm gì: đọc mục xác nhận phạm vi ở trên; ở đâu: trả lời trong phiên đang trình thẻ; trả lời dạng: «đồng ý cắt» hoặc «kéo vào: nêu mục».`); ymSlots.push('cắt/hoãn: ___'); }
  if (decsProvisional.length) { ymItems.push(`<b>Phê ${decsProvisional.length} quyết định ghi sau Cổng 1 (Treo-1…Treo-${decsProvisional.length})</b> — làm gì: đọc khối "Quyết định CHƯA duyệt"; ở đâu: trả lời trong phiên đang trình thẻ; trả lời dạng: «phê hết» hoặc «không phê: Treo-số».`); ymSlots.push('Treo: ___'); }
  // Hồ sơ máy ĐÃ đi tiếp hợp lệ thì việc-của-người KHÔNG phải ký, mà là veto nếu
  // muốn. Bỏ sót chỗ này là thẻ nói «máy đã đi tiếp» ở đầu rồi vẫn bảo «Ký hay
  // trả» ở cuối — mâu thuẫn ngay trong chính thẻ, và đúng thứ AC-8 cấm.
  if (MAY_DI_TIEP) {
    ymItems.push(`<b>${esc(chuMDT().viecKe)}</b> — làm gì: hồ sơ này máy đã đi tiếp hợp lệ, không cần chữ ký; ở đâu: trả lời trong phiên đang trình thẻ; trả lời dạng: «veto: nêu lý do» nếu muốn dừng, hoặc không trả lời gì.`);
    ymSlots.push('veto hay để yên: ___');
  } else {
    ymItems.push(`<b>Ký hay trả</b> — làm gì: sau khi trả lời các mục trên, chốt hồ sơ; ở đâu: trả lời trong phiên đang trình thẻ; trả lời dạng: «Ký» hoặc «Trả lại: nêu lý do».`);
    ymSlots.push('ký hay trả: ___');
  }
  P.push(`<div class="lab">👉 VIỆC CỦA ANH</div><div class="grp gdo">${ymItems.map(t => `<p class="li">${t}</p>`).join('')}<p class="li">Trả lời mẫu (một dòng, điền vào chỗ trống): «${esc(ymSlots.join('; '))}»</p></div>`);
}
P.push(MAY_DI_TIEP
  ? `<div class="foot"><span class="rev">↻ ${esc(chuMDT().viecKe)}</span><div class="btns"><button class="b no">Veto</button></div></div>
</div></div>`
  : `<div class="foot"><span class="rev">↻ Đảo ngược dễ: trả lại → quay về code, không mất gì.</span><div class="btns"><button class="b no">Trả lại</button><button class="b yes">Ký duyệt</button></div></div>
</div></div>`);
process.stdout.write(P.join('\n'));
