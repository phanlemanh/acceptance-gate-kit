// tests/plugins/ra-co-ten.test.mjs — ca hồ sơ ra-co-ten-lam-va-trao (RT1–RT15).
// Fixture CODE-SINH từ khuôn trong chính lần chạy; chạy THẬT start-scan / gate-card /
// product-map / pre-merge / hook; đường dẫn suy từ vị trí file; mỗi ca có đối chứng dương
// + chiều đỏ ghim thông điệp (MEASURE-BIRTH-CLAUSE).
//   RT_CASES=RT1,RT2 node tests/plugins/ra-co-ten.test.mjs
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, copyFileSync, cpSync, existsSync } from 'node:fs';
import { spawnSync, execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const require = createRequire(import.meta.url);
const { blockFromTemplate, fileFromTemplate } = await import(path.join(ROOT, 'tests', 'fixtures', 'from-template.mjs'));
const XS = await import(path.join(ROOT, 'scripts', 'khong-can-nguoi.mjs'));
const REF = p => path.join(ROOT, 'skills', 'acceptance', 'references', p);
const CONTRACT_TPL = REF('contract-template.md');
const OPP_TPL = REF('opportunity-template.md');
const EVID_TPL = REF('evidence-report-template.md');
const SCAN = path.join(ROOT, 'scripts', 'start-scan.mjs');
const CARD = path.join(ROOT, 'scripts', 'gate-card.js');
const PMAP = path.join(ROOT, 'scripts', 'product-map.mjs');
const PREMERGE = path.join(ROOT, 'scripts', 'pre-merge-check.sh');
const HOOK = path.join(ROOT, 'hooks', 'acceptance-evidence-gate.js');
// LUẬT NGƯỠNG hỏi lib sở hữu nó — ca đo giữ bản chép là đúng lớp lỗi hồ sơ này bị bắt
// HAI vòng liền (S4-r2 chép thresholdState, S4-r4 chép vị từ timebox lệch một ngày).
const NG = require(path.join(ROOT, 'lib', 'nguong-o-co-hoi.cjs'));
const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const UAT_H = NG.UAT_THRESHOLD_HEADING;

let failures = 0;
// MỘT nguồn danh sách ca: file này. Chỉ liệt ca ĐÃ CÓ THÂN — khai id chưa dựng thì suite đỏ.
const ALL_IDS = ['RT1', 'RT2', 'RT3', 'RT4', 'RT5', 'RT6', 'RT9', 'RT10', 'RT11', 'RT12', 'RT13', 'RT14', 'RT15', 'RT16', 'RT18'];
if (process.argv.includes('--ids')) { console.log(ALL_IDS.join(' ')); process.exit(0); }
const only = (process.env.RT_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => only.length === 0 || only.includes(id);
// Ranh giới cứng quanh id: `PASS: [RT1]` không là tiền tố của ca anh em.
const pass = (id, name) => console.log(`PASS: [${id}] ${name}`);
const fail = (id, msg) => { console.log(`FAIL: [${id}] ${msg}`); failures++; };

// ── hằng rút từ khuôn (MỘT nguồn — chép tay vào đây là hai bản trôi) ─────────
const DE_XUAT = blockFromTemplate(OPP_TPL, 'OPP-DE-XUAT-PREFIX').trim();
const KHONG_DO = blockFromTemplate(OPP_TPL, 'OPP-KHONG-DO-DUOC-PREFIX').trim();
const XANH_SACH = blockFromTemplate(EVID_TPL, 'EVIDENCE-XANH-SACH-BLOCK').trim().split('\n').map(l => l.trim().split(/\s+/)[0]);
const STATUS_ENUM_FROM_TPL = (() => {
  const line = readFileSync(CONTRACT_TPL, 'utf8').split('\n').find(l => /^status:\s*\{status\}/.test(l));
  const m = line && line.match(/#\s*([a-z-]+(?:\s*\|\s*[a-z-]+)+)/);
  return m ? m[1].split('|').map(s => s.trim()) : [];
})();

// ── fixture builders ─────────────────────────────────────────────────────────
const tmp = pre => mkdtempSync(path.join(tmpdir(), pre));
const W = (root, rel, s) => { const p = path.join(root, rel); mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, s); return p; };
const mkRepo = () => { const r = tmp('rt-'); W(r, '_acceptance/config.yaml', 'schema_version: 1\nenforcement: strict\n'); W(r, 'verify.sh', '#!/bin/sh\nexit 0\n'); return r; };
const withRepo = fn => { const r = mkRepo(); try { return fn(r); } finally { rmSync(r, { recursive: true, force: true }); } };

function contractText(slug, { status, tier = 'T2', veto = null, opened = null, approvedBy = '', surfaces = 'cli' }) {
  let t = fileFromTemplate(CONTRACT_TPL, 'CONTRACT-FRONTMATTER-TEMPLATE',
    { feature: `${slug} — fixture`, slug, owner: 'fx@example.com', risk_tier: tier, surfaces, status },
    `# Contract: ${slug}\n\n## Criteria\n\n- AC-1: fixture\n\n## Out of scope\n\n- khong co\n`);
  if (approvedBy) t = t.replace(/^approved_by:.*$/m, `approved_by: ${approvedBy}`).replace(/^approved_at:.*$/m, 'approved_at: 2026-08-20');
  const extra = [];
  if (veto != null) extra.push(`veto_state: ${veto}`);
  if (opened != null) extra.push(`veto_opened_at: ${opened}`);
  if (extra.length) t = t.replace(/^approved_at:.*$/m, m => [m, ...extra].join('\n'));
  return t;
}

// Báo cáo dựng từ TRỌN vùng chép của khuôn bên viết (sau mốc ---8<---): thứ tự section,
// heading, khoá của khối evidence — mọi HÌNH DẠNG — đến từ khuôn; test chỉ điền GIÁ TRỊ
// vào {{...}} và giá trị frontmatter. Bản cũ gõ tay bảng eval + khối ## Evidence theo
// khuôn bên đọc, nên bên viết đổi hình dạng thì mọi ca vẫn xanh trong khi hồ sơ thật đỏ
// ở lưới (S4-r6 [8], đúng hình dạng (3) của «thước phải gắn vào vật được giao»).
// sach: 'sach' | 'uncertain' | 'kl-co' | 'bypass' | 'enf-off'
function evidenceText(slug, { verdict = 'PASS', signoff = '', sach = 'sach', verifiedCommit = '0'.repeat(40) } = {}) {
  const tpl = readFileSync(EVID_TPL, 'utf8');
  // Hồ sơ THẬT phải bắt đầu ngay ở dòng `---`: dư một dòng trống là hàng rào lệch và mọi
  // bên đọc gọi là hồ sơ hỏng (đúng ca P115 của khuôn). Cắt xong phải trim đầu.
  let t = tpl.slice(tpl.indexOf('---8<---') + '---8<---'.length).replace(/^\s*/, '');
  t = t.replace(/\{\{slug\}\}/g, slug)
    .replace(/^verdict: .*$/m, `verdict: ${verdict}`)
    .replace(/^enforcement_mode: .*$/m, `enforcement_mode: ${sach === 'enf-off' ? 'off' : 'strict'}`)
    .replace(/^bypass_used: .*$/m, `bypass_used: ${sach === 'bypass' ? 'true' : 'false'}`)
    .replace(/^verified_commit: .*$/m, `verified_commit: ${verifiedCommit}`)
    .replace(/^human_signoff:.*$/m, `human_signoff:${signoff ? ' ' + signoff : ''}`);
  // Một dòng eval thật vào bảng: điền 4 ô placeholder THEO THỨ TỰ CỘT của khuôn.
  const rowVals = ['E1', 'AC-1', 'test', 'PASS']; let ri = 0;
  t = t.replace(/^\|.*\{\{.*\|$/m, line => line.replace(/\{\{[^}]*\}\}/g, () => rowVals[ri++] ?? '…'));
  // Một khối evidence thật đúng chỗ khuôn dạy: điền GIÁ TRỊ theo KHOÁ của khuôn —
  // khoá, thụt dòng, thứ tự dòng giữ nguyên từ khuôn.
  t = t.replace(/^(- eval:).*\{\{[^}]*\}\}.*$/m, '$1 E1')
    .replace(/^(\s+run_id:).*\{\{[^}]*\}\}.*$/m, `$1 ${slug}-E1-001`)
    .replace(/^(\s+verifier:).*\{\{[^}]*\}\}.*$/m, '$1 verify.sh')
    .replace(/^(\s+verified_at:).*\{\{[^}]*\}\}.*$/m, '$1 2026-08-23T00:00:00Z')
    .replace(/^(\s+)\{\{last 5-10[^}]*\}\}.*$/m, '$1ok')
    .replace(/\{\{eval ids green-on-both[^}]*\}\}/, 'none — every feature eval is red on baseline (discriminates)')
    .replace(/\{\{eval ids with mixed pass_rate[^}]*\}\}/, 'none — every multi-run eval is uniform')
    .replace(/\{\{One line per verify round[\s\S]*?\}\}/, 'Round 1: ok');
  // Fail-loud: khuôn đổi tên placeholder mà bảng điền chưa theo → ném, không xanh im.
  const soT = t.match(/\{\{[^}]*\}\}/g);
  if (soT) throw new Error(`evidenceText: placeholder chưa điền: ${soT.slice(0, 3).join(' · ')}`);
  // Chiều tiêm: mục UNCERTAIN lấy đúng KHỐI judgment của khuôn (marker), không gõ tay.
  if (sach === 'uncertain') t += '\n' + blockFromTemplate(EVID_TPL, 'JUDGMENT-BLOCK-TEMPLATE');
  if (sach === 'kl-co') t = t.replace(/(## Known limits\n)/, '$1\n- còn một lỗ\n');
  return t;
}
const runLogText = slug => JSON.stringify({ ts: '2026-08-23T00:00:00Z', kind: 'eval', run_id: `${slug}-E1-001`, exit_code: 0 }) + '\n';

// nguong: 'chua-chot' | 'de-xuat' | 'chot' | 'khong-do-duoc' | 'khong-do-duoc-bullet' | 'khong-do-duoc-hai-cham'
function opportunityText(slug, { stage = 'decided', decision = 'build', nguong = 'chot', timebox = null, nguonNgoai = 'du' } = {}) {
  const fm = fileFromTemplate(OPP_TPL, 'OPP-FRONTMATTER-TEMPLATE',
    { slug, feature: `${slug} — fixture`, owner: 'fx@example.com', stage, decision,
      decided_by: decision ? 'Fx' : '', decided_at: decision ? '2026-08-20T00:00:00Z' : '', base_commit: '', disposition: '' }, '');
  const bullets = v => `- Câu hỏi phép đo trả lời: ${v}\n- Kết quả nào là SỐNG: ${v}\n- Kết quả nào là CHẾT: ${v}\n- Timebox: ${timebox ?? v}\n`;
  const ng = nguong === 'chua-chot' ? bullets('…')
    : nguong === 'de-xuat' ? bullets(`${DE_XUAT} ngưỡng máy đề xuất`)
    : nguong === 'chot' ? bullets('ngưỡng thật')
    : nguong === 'khong-do-duoc' ? `${KHONG_DO} vòng nội bộ, không có người dùng cuối\n`
    : nguong === 'khong-do-duoc-bullet' ? `- ${KHONG_DO} vòng nội bộ, không có người dùng cuối\n`
    : 'Không đo được: vòng nội bộ\n';
  const nn = nguonNgoai === 'du' ? '| x | y | triết-lý/logic | có | — |' : '| x | y |  | có | — |';
  return fm + `\n## Vấn đề & ai gặp\n\nfixture\n\n## Giả định chốt sinh tử\n\n| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |\n|---|---|---|---|---|\n| 1 | a | b | c | Chưa thử |\n\n## ${UAT_H}\n\n${ng}\n## Nguồn ngoài & phạm vi kế thừa\n\n| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |\n|---|---|---|---|---|\n${nn}\n\n## Out of scope từ khám phá\n\n- a\n- b\n`;
}

function mkWs(root, slug, { contract = null, evidence = null, opportunity = null, decisions = null, runLog = null } = {}) {
  const dir = path.join(root, '_acceptance', slug); mkdirSync(dir, { recursive: true });
  if (contract) writeFileSync(path.join(dir, 'contract.md'), contractText(slug, contract));
  if (evidence) { writeFileSync(path.join(dir, 'evidence-report.md'), evidenceText(slug, evidence)); writeFileSync(path.join(dir, 'run-log.jsonl'), runLog ?? runLogText(slug)); }
  if (opportunity) writeFileSync(path.join(dir, 'opportunity.md'), opportunityText(slug, opportunity));
  if (decisions) writeFileSync(path.join(dir, 'decisions.jsonl'), decisions);
  return dir;
}
const scan = (root, script = SCAN) => {
  const r = spawnSync(process.execPath, [script, '--root', root], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`start-scan exit ${r.status}: ${r.stderr}`);
  return JSON.parse(r.stdout);
};
const findSlug = (j, slug) => {
  for (const grp of ['gates', 'inProgress', 'considering', 'done']) { const x = (j.groups[grp] || []).find(e => e.slug === slug); if (x) return { grp, ...x }; }
  const b = (j.broken || []).find(e => e.slug === slug); return b ? { grp: 'broken', ...b } : null;
};

// ── bộ đọc thân văn bản: CẮT PHẠM VI rồi đếm hit; mutant gỡ mệnh đề phải ĐỎ ────
const readRepo = rel => readFileSync(path.join(ROOT, rel), 'utf8');
const cut = (txt, startRe, endRe) => {
  const s0 = txt.search(startRe); if (s0 < 0) return '';
  const rest = txt.slice(s0); const e = rest.slice(1).search(endRe);
  return e < 0 ? rest : rest.slice(0, e + 1);
};
const gflag = re => new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
const countIn = (txt, re) => (txt.match(gflag(re)) || []).length;
// rows: [tên, file, cắt-phạm-vi, regex, số-lần (null = ≥1)]
//
// Chiều đỏ phải TIÊM VÀO VĂN BẢN rồi chạy lại CẢ cutter lẫn regex. Vòng 1 viết mutant là
// `full.replace(re,'')` rồi đếm lại `re` — kết quả luôn 0, nên nhánh đó đo engine regex của
// Node chứ không đo file dưới thước (finding S4-r1: «chiều đỏ giả»). Hai mutant thật:
//   DỜI  — chuyển mệnh đề RA NGOÀI phạm vi cắt (nối vào cuối file). Nếu cutter thực sự cắt
//          phạm vi thì đếm trong phạm vi phải hụt; cutter giả (đọc cả file) sẽ vẫn xanh và
//          bị bắt tại đây. Đây là vế chứng minh PHẠM VI có thật.
//   ĐỔI  — thay một chữ trong mệnh đề (bản sao) → đếm phải hụt. Vế chứng minh NEEDLE bám vật.
// Cả hai đều đòi lệnh tiêm phải ĐỔI ĐƯỢC văn bản; không đổi được thì ca đỏ, không xanh im.
function checkMenhDe(rows) {
  const errs = [];
  for (const [ten, file, cutter, re, n, caFile] of rows) {
    const full = readRepo(file);
    const c = countIn(cutter(full), re);
    if (n == null ? c < 1 : c !== n) { errs.push(`${ten}: thấy ${c} lần, mong ${n ?? '≥1'}`); continue; }
    const hits = full.match(gflag(re)) || [];
    if (!hits.length) { errs.push(`${ten}: không rút được đoạn khớp để tiêm`); continue; }
    // DỜI chỉ có nghĩa khi hàng CÓ phạm vi cắt. Hàng cố ý đọc cả file phải KHAI (cột 6) —
    // im lặng bỏ vế này cho mọi hàng là mở lại đúng cái lỗ vừa vá.
    const coPhamVi = cutter(full) !== full;
    if (!coPhamVi && !caFile) { errs.push(`${ten}: cutter đọc CẢ FILE mà hàng không khai — khai cột 6 nếu cố ý`); continue; }
    if (coPhamVi) {
      const doi = full.replace(gflag(re), '') + '\n\n## Phụ lục máy sinh (mutant)\n\n' + hits.join('\n') + '\n';
      if (doi === full) { errs.push(`${ten}: lệnh tiêm DỜI không đổi được văn bản`); continue; }
      if (countIn(cutter(doi), re) !== 0) errs.push(`${ten}: dời mệnh đề RA NGOÀI phạm vi mà bộ đọc vẫn thấy — phạm vi cắt không có thật`);
    }
    // ĐỔI: thay một chữ trong MỌI lần khớp.
    let doiChu = false;
    const sua = full.replace(gflag(re), m => { const m2 = m.replace(/[A-Za-zÀ-ỹ]/, 'Z'); if (m2 !== m) doiChu = true; return m2; });
    if (!doiChu || sua === full) { errs.push(`${ten}: lệnh tiêm ĐỔI không đổi được văn bản`); continue; }
    if (countIn(cutter(sua), re) !== 0) errs.push(`${ten}: đổi chữ trong mệnh đề mà bộ đọc vẫn thấy — needle không bám vật`);
  }
  return errs;
}

// ── RT1 — enum round-trip khuôn↔lib + usesUat/usesEvidence + khối xanh-sạch ba đầu ──
if (want('RT1')) {
  const errs = [];
  const WR = require(path.join(ROOT, 'lib', 'workspace-record.cjs'));
  const EXPECT = ['draft', 'approved', 'implemented', 'verified', 'signed-off', 'machine-cleared'];
  const got = WR.NAV_RULES['contract.md'].status.enum;
  if (JSON.stringify(got) !== JSON.stringify(EXPECT)) errs.push(`enum lib = ${JSON.stringify(got)}`);
  if (JSON.stringify(STATUS_ENUM_FROM_TPL) !== JSON.stringify(EXPECT)) errs.push(`enum khuôn = ${JSON.stringify(STATUS_ENUM_FROM_TPL)}`);
  const c = s => `---\nstatus: ${s}\n---\n`;
  for (const s of EXPECT) {
    const u = WR.usesUat(c(s)), e = WR.usesEvidence(c(s));
    if (u !== (s === 'signed-off' || s === 'machine-cleared')) errs.push(`usesUat(${s})=${u}`);
    if (e !== ['implemented', 'verified', 'machine-cleared'].includes(s)) errs.push(`usesEvidence(${s})=${e}`);
  }
  const EXPECT_XS = ['verdict-pass', 'bypass', 'enforcement', 'tier', 'uncertain', 'sections'];
  if (JSON.stringify(XANH_SACH) !== JSON.stringify(EXPECT_XS)) errs.push(`khối xanh-sạch = ${JSON.stringify(XANH_SACH)}`);
  // Thứ tự sáu điều kiện trong HAI bản dựng phải khớp thứ tự khối (round-trip ba đầu).
  const mjsAll = readFileSync(path.join(ROOT, 'scripts', 'khong-can-nguoi.mjs'), 'utf8');
  // Cắt THÂN HÀM: khối chú thích đầu file cũng nhắc bypass_used/enforcement_mode, dò cả file
  // là đo văn xuôi chứ không đo mã (bắt được ở chính lượt chạy đầu).
  const mjs = mjsAll.slice(mjsAll.indexOf('export function xanhSach'), mjsAll.indexOf('export function khongCanNguoi'));
  const orderMjs = ["!== 'PASS'", 'bypass_used', 'enforcement_mode', 'risk_tier', 'UNCERTAIN_RE.test', "'Known limits', 'Ngoài hợp đồng'"].map(n => mjs.indexOf(n));
  if (orderMjs.some(i => i < 0) || orderMjs.some((v, i) => i > 0 && v < orderMjs[i - 1])) errs.push(`thứ tự xanhSach (mjs) lệch khối: ${orderMjs}`);
  const sh = readFileSync(PREMERGE, 'utf8'); const fn = sh.slice(sh.indexOf('xanh_sach_check() {'));
  // SÁU needle, không phải năm: bỏ `enforcement_mode` khỏi vế bash là ca đo tự khoét đúng
  // chỗ vật thiếu — thước không thể đỏ cho điều kiện đó ở cả hai chiều (finding S4-r1).
  const orderSh = ['= "PASS"', 'bypass_used', 'enforcement_mode', 'risk_tier', 'UNCERTAIN', '"Known limits" "Ngoài hợp đồng"'].map(n => fn.indexOf(n));
  if (orderSh.some(i => i < 0) || orderSh.some((v, i) => i > 0 && v < orderSh[i - 1])) errs.push(`thứ tự xanh_sach_check (bash) lệch khối: ${orderSh}`);
  // Số needle PHẢI bằng số điều kiện khối: bớt một needle là ca đo tự khoét đúng chỗ vật thiếu.
  if (orderMjs.length !== EXPECT_XS.length || orderSh.length !== EXPECT_XS.length)
    errs.push(`số needle (${orderMjs.length}/${orderSh.length}) != số điều kiện khối (${EXPECT_XS.length}) — thước không phủ hết khối`);
  // Chiều đỏ: bản sao khuôn gỡ mục «sections» → reader của chính ca này phải nêu tên mục thiếu.
  const t2 = tmp('rt1-'); const fake = path.join(t2, 'evidence-report-template.md');
  writeFileSync(fake, readFileSync(EVID_TPL, 'utf8').replace(/^sections .*\n/m, ''));
  const xs2 = blockFromTemplate(fake, 'EVIDENCE-XANH-SACH-BLOCK').trim().split('\n').map(l => l.trim().split(/\s+/)[0]);
  const missing = EXPECT_XS.filter(k => !xs2.includes(k));
  if (JSON.stringify(missing) !== JSON.stringify(['sections'])) errs.push(`chiều đỏ khuôn: mong thiếu [sections], thấy ${JSON.stringify(missing)}`);
  rmSync(t2, { recursive: true, force: true });
  // Khối xanh-sạch phải nằm NGOÀI vùng chép: nội dung nó có chữ UNCERTAIN, mà cả hai bộ
  // kiểm quét TRỌN file — nằm trong vùng chép là mọi báo cáo mới tự thành «có mục
  // UNCERTAIN» và trạng thái máy-thông không bao giờ ghi được (S4-r5, đã dựng lại).
  {
    const tplRaw = readFileSync(EVID_TPL, 'utf8');
    const vungChep = tplRaw.slice(tplRaw.indexOf('---8<---') + 8);
    if (vungChep.includes('EVIDENCE-XANH-SACH-BLOCK')) errs.push('khối xanh-sạch nằm TRONG vùng chép — mọi báo cáo mới sẽ tự dính «có mục UNCERTAIN»');
    // [1] Vùng chép phải sạch chữ UNCERTAIN — cả hai bộ kiểm quét TRỌN báo cáo tìm nó,
    // nên một báo cáo chép nguyên vùng chép mà dính chữ đó thì không bao giờ xanh-sạch.
    if (/(^|[^a-z])UNCERTAIN([^a-z]|$)/i.test(vungChep)) errs.push('vùng chép chứa chữ UNCERTAIN — báo cáo chép nguyên không bao giờ xanh-sạch');
    // [1] Hai mục của khối EVIDENCE-SECTIONS-TEMPLATE phải nằm TRONG vùng chép DẠNG TRẦN
    // (không marker/comment bên trong — một dòng bất kỳ dưới heading là «có nội dung»,
    // vì h1 KHÔNG đóng section h2 theo luật same-or-higher của lib/md-section.cjs), và
    // đứng ĐÚNG vị trí hồ sơ thật đang đặt: sau ## Evidence, trước ## Analyst (S4-r6 [1]).
    const secTpl = blockFromTemplate(EVID_TPL, 'EVIDENCE-SECTIONS-TEMPLATE').trim();
    const iEv = vungChep.indexOf('\n## Evidence'), iSec = vungChep.indexOf('\n' + secTpl), iAn = vungChep.indexOf('\n## Analyst');
    if (iSec < 0) errs.push('vùng chép không mang hai mục của khối EVIDENCE-SECTIONS-TEMPLATE đúng nguyên văn');
    else if (!(iEv >= 0 && iAn >= 0 && iEv < iSec && iSec < iAn)) errs.push(`hai mục phải đứng sau ## Evidence và trước ## Analyst (ev=${iEv}, sec=${iSec}, an=${iAn})`);
    // chiều đỏ: dựng báo cáo TRỌN từ vùng chép + thay giá trị → vị từ phải nói sạch
    // Phép đo SỐNG: báo cáo dựng bằng chính evidenceText() (rút từ khuôn) phải được vị từ
    // xanhSach gọi là SẠCH. Tiêm khối xanh-sạch vào bản sao báo cáo → vị từ phải ĐỎ đúng
    // «có mục UNCERTAIN»; đó là cách chứng minh vị trí khối có thật sự quan trọng.
    const cSach = contractText('zz', { status: 'machine-cleared', tier: 'T2', veto: 'mo', opened: '2026-08-23T00:00:00Z' });
    const eSach = evidenceText('zz', { verdict: 'PASS', signoff: '', sach: 'sach' });
    const r1 = XS.xanhSach(cSach, eSach);
    if (!r1.clean) errs.push(`báo cáo dựng từ khuôn KHÔNG sạch: ${r1.why} — làn máy-thông không ghi được`);
    const khoi = tplRaw.match(/<!-- <<<EVIDENCE-XANH-SACH-BLOCK -->[\s\S]*?<!-- EVIDENCE-XANH-SACH-BLOCK>>> -->/)[0];
    const r2 = XS.xanhSach(cSach, eSach + '\n' + khoi + '\n');
    if (r2.clean) errs.push('chiều đỏ: chèn khối xanh-sạch vào báo cáo mà vị từ vẫn nói sạch — vị trí khối không được đo');
    else if (!/UNCERTAIN/.test(r2.why)) errs.push(`chiều đỏ: đỏ vì «${r2.why}», mong «có mục UNCERTAIN»`);
  }
  if (errs.length) fail('RT1', errs.join(' · '));
  else pass('RT1', 'enum 6 giá trị round-trip khuôn↔lib; usesUat/usesEvidence; khối xanh-sạch ba đầu; chiều đỏ nêu mục');
}

// ── hook: ghi hồ sơ qua PreToolUse payload ───────────────────────────────────
function hook(filePath, content, { existing = null } = {}) {
  if (existing != null) writeFileSync(filePath, existing); else if (existsSync(filePath)) rmSync(filePath);
  const payload = JSON.stringify({ tool_name: 'Write', tool_input: { file_path: filePath, content } });
  const r = spawnSync(process.execPath, [HOOK], { input: payload, encoding: 'utf8' });
  return { code: r.status, err: (r.stderr || '') };
}
const MC = { status: 'machine-cleared', tier: 'T2', veto: 'mo', opened: '2026-08-23T00:00:00Z' };

// ── RT3 — hook lúc ghi: Cổng 1 cho machine-cleared ───────────────────────────
if (want('RT3')) {
  const errs = [];
  withRepo(root => {
    W(root, '.git', '');   // hook dừng leo cây ở đây
    const dir = path.join(root, '_acceptance', 'rt3'); mkdirSync(dir, { recursive: true });
    const cp = path.join(dir, 'contract.md');
    // (a) đối chứng dương: làn V đúng vết → QUA
    let r = hook(cp, contractText('rt3', MC), { existing: contractText('rt3', { ...MC, status: 'verified' }) });
    if (r.code !== 0) errs.push(`(a) làn V đúng vết phải QUA, exit ${r.code}: ${r.err.slice(0, 200)}`);
    // (b) T3 → chặn ghim câu
    r = hook(cp, contractText('rt3', { ...MC, tier: 'T3' }), { existing: contractText('rt3', { ...MC, status: 'verified', tier: 'T3' }) });
    if (r.code !== 2 || !/veto_state: mo on a T3 contract/.test(r.err)) errs.push(`(b) T3 phải chặn ghim câu, exit ${r.code}`);
    // (c) không veto, không gate1_skipped → chặn ghim đúng status mới
    r = hook(cp, contractText('rt3', { status: 'machine-cleared' }), { existing: contractText('rt3', { status: 'verified' }) });
    if (r.code !== 2 || !/status: machine-cleared with empty approved_by — Gate 1 approval not recorded/.test(r.err)) errs.push(`(c) phải chặn ghim câu machine-cleared, exit ${r.code}: ${r.err.slice(0, 200)}`);
    // (d) draft → machine-cleared thẳng → chặn ghim skips Gate 1
    r = hook(cp, contractText('rt3', { status: 'machine-cleared' }), { existing: contractText('rt3', { status: 'draft' }) });
    if (r.code !== 2 || !/skips Gate 1/.test(r.err)) errs.push(`(d) draft→machine-cleared phải chặn ghim skips Gate 1, exit ${r.code}`);
    // (e) T3 + approved_by ĐÃ điền → vẫn phải chặn: «máy thông không chữ ký» là T2-only.
    // Nhánh veto ở (b) chỉ bắt ca đi qua veto_state; ca này lọt suốt tới lưới trước-merge (S4-r8 [0]).
    r = hook(cp, contractText('rt3', { status: 'machine-cleared', tier: 'T3', approvedBy: 'Manh' }),
      { existing: contractText('rt3', { status: 'verified', tier: 'T3', approvedBy: 'Manh' }) });
    if (r.code !== 2 || !/status: machine-cleared on a T3 contract/.test(r.err)) errs.push(`(e) T3 + approved_by phải chặn ghim câu T2-only, exit ${r.code}: ${r.err.slice(0, 200)}`);
    // ĐỐI CHỨNG DƯƠNG: cùng fixture hạ về T2 → QUA (chứng minh răng bắt HẠNG, không bắt bừa)
    r = hook(cp, contractText('rt3', { status: 'machine-cleared', tier: 'T2', approvedBy: 'Manh' }),
      { existing: contractText('rt3', { status: 'verified', tier: 'T2', approvedBy: 'Manh' }) });
    if (r.code !== 0) errs.push(`(e-ctrl) cùng fixture ở T2 phải QUA, exit ${r.code}: ${r.err.slice(0, 200)}`);
  });
  // ── lifecycle: đo THÔNG ĐIỆP hook IN RA, không grep mã nguồn ────────────────
  // Bản cũ đọc file hook rồi /machine-cleared/ — mã nguồn có chuỗi đó ở nhiều dòng CHÚ THÍCH,
  // nên gỡ sạch khỏi khối lifecycle THẬT mà ca vẫn xanh: phép đo không phân biệt «thông điệp
  // liệt đủ» với «một comment nhắc tên» (S4-r8 [4]). Và lời hứa AC-3 là QUAN HỆ với enum AC-1.
  const khoiLifecycle = err => {
    const i = err.indexOf('Gate-1 lifecycle reference:');
    if (i < 0) return null;
    const sau = err.slice(i).split('\n').slice(1);
    const het = sau.findIndex(l => !/^\s{2}/.test(l));
    return sau.slice(0, het < 0 ? sau.length : het).join('\n');
  };
  // Chạy hook từ một bản sao cây (hooks/ + lib/) để chiều đỏ tiêm được vào vật THẬT.
  const hookTuCay = (cayRoot, filePath, content, existing) => {
    if (existing != null) writeFileSync(filePath, existing); else if (existsSync(filePath)) rmSync(filePath);
    const r = spawnSync(process.execPath, [path.join(cayRoot, 'hooks', 'acceptance-evidence-gate.js')],
      { input: JSON.stringify({ tool_name: 'Write', tool_input: { file_path: filePath, content } }), encoding: 'utf8' });
    return { code: r.status, err: r.stderr || '' };
  };
  const docLifecycle = cayRoot => withRepo(root => {
    W(root, '.git', '');
    const dir = path.join(root, '_acceptance', 'lc'); mkdirSync(dir, { recursive: true });
    const cp = path.join(dir, 'contract.md');
    // ca (c): chặn ghim → hook in TRỌN khối lifecycle ra stderr
    const r = hookTuCay(cayRoot, cp, contractText('lc', { status: 'machine-cleared' }), contractText('lc', { status: 'verified' }));
    return khoiLifecycle(r.err);
  });
  {
    const kh = docLifecycle(ROOT);
    if (!kh) errs.push('không cắt được khối «Gate-1 lifecycle reference:» từ stderr của hook');
    else {
      if (!kh.includes('machine-cleared')) errs.push('khối lifecycle hook IN RA chưa liệt machine-cleared');
      // QUAN HỆ với enum AC-1: mọi tên trạng thái xuất hiện trong khối phải là thành viên enum.
      // Enum lấy TỪ CHÍNH nguồn AC-1 (lib), không gõ lại — đây là vế «khớp enum AC-1».
      const ENUM = require(path.join(ROOT, 'lib', 'workspace-record.cjs')).NAV_RULES['contract.md'].status.enum;
      // Chỉ soi các dòng Ở VỊ TRÍ TRẠNG THÁI (dòng `status: …` và dòng chuyển `draft -> …`),
      // tách theo dấu `/` và `->` — không quét cả khối, vì khối còn nhắc pre-merge, Gate 1…
      const viTriTrangThai = kh.split('\n').filter(l => /^\s+(status:|draft ->)/.test(l))
        .map(l => l.replace(/^\s+status:\s*/, '').replace(/->.*$/g, m => m))
        .join(' | ');
      const la = [...new Set(viTriTrangThai.split(/\s*(?:\||\/|->)\s*/).map(t => t.trim()).filter(Boolean))]
        .filter(t => /^[a-z][a-z-]*$/.test(t))
        .filter(t => !ENUM.includes(t));
      if (la.length) errs.push(`khối lifecycle nêu tên KHÔNG có trong enum AC-1: ${la.join(', ')}`);
      for (const st of ENUM) if (!kh.includes(st)) errs.push(`enum AC-1 có «${st}» mà khối lifecycle không nhắc`);
      // Chiều đỏ: bản sao cây gỡ machine-cleared khỏi ĐÚNG hai dòng lifecycle → đọc lại phải ĐỎ.
      const cay = tmp('rt3-cay-');
      cpSync(path.join(ROOT, 'hooks'), path.join(cay, 'hooks'), { recursive: true });
      cpSync(path.join(ROOT, 'lib'), path.join(cay, 'lib'), { recursive: true });
      const hp = path.join(cay, 'hooks', 'acceptance-evidence-gate.js');
      const goc = readFileSync(hp, 'utf8');
      // tiêm đích danh: chỉ hai dòng THUỘC khối lifecycle
      const tiem = goc.replace(/(\s*'\s*status: approved \/ signed-off )\/ machine-cleared/, '$1')
        .replace(/(\s*'\s*draft -> implemented \/ verified )\/ machine-cleared/, '$1');
      if (tiem === goc) errs.push('chiều đỏ RT3: lệnh tiêm KHÔNG đổi được hai dòng lifecycle — needle không bám vật');
      else {
        writeFileSync(hp, tiem);
        const kh2 = docLifecycle(cay);
        if (kh2 == null) errs.push('chiều đỏ RT3: bản sao hook không in được khối lifecycle');
        else if (kh2.includes('machine-cleared')) errs.push('chiều đỏ RT3: gỡ khỏi hai dòng lifecycle mà khối IN RA vẫn có machine-cleared');
      }
      rmSync(cay, { recursive: true, force: true });
    }
  }
  if (errs.length) fail('RT3', errs.join(' · '));
  else pass('RT3', 'hook: làn V qua; T3/không-vết/draft-nhảy-thẳng chặn ghim câu; khối lifecycle IN RA khớp enum AC-1, bản sao gỡ → đỏ');
}

// ── kho git fixture cho lưới trước-merge ─────────────────────────────────────
// c1 (config · code · lib) → nhánh basepoint → c2 (code đổi + hợp đồng) → c3 (bằng chứng).
function mkGit(slug, o, { evidence = true } = {}) {
  const R = tmp('rt-git-');
  const git = (...a) => execFileSync('git', ['-c', 'user.name=rt', '-c', 'user.email=rt@x', '-C', R, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  mkdirSync(path.join(R, 'src'), { recursive: true }); mkdirSync(path.join(R, '_acceptance'), { recursive: true });
  git('init', '-q');
  writeFileSync(path.join(R, '_acceptance', 'config.yaml'), 'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n    - "*.md"\n');
  writeFileSync(path.join(R, 'src', 'app.js'), 'code v1\n');
  writeFileSync(path.join(R, 'verify.sh'), '#!/bin/sh\nexit 0\n');
  // Kho tiêu thụ chép đúng bộ này khi /acceptance-init. Thiếu lib/md-section.cjs thì lưới
  // KHÔNG BAO GIỜ thấy hồ sơ sạch (fail-closed) — đối chứng dương sẽ đỏ, y như đời thật.
  mkdirSync(path.join(R, 'lib'), { recursive: true }); mkdirSync(path.join(R, 'scripts'), { recursive: true });
  for (const f of ['evidence-core.cjs', 'gap-probe.cjs', 'workspace-record.cjs', 'ac-line.cjs', 'md-section.cjs'])
    copyFileSync(path.join(ROOT, 'lib', f), path.join(R, 'lib', f));
  copyFileSync(path.join(ROOT, 'scripts', 'recheck-evidence.cjs'), path.join(R, 'scripts', 'recheck-evidence.cjs'));
  git('add', '-A'); git('commit', '-qm', 'c1'); git('branch', 'basepoint');
  writeFileSync(path.join(R, 'src', 'app.js'), 'code v2\n');
  mkdirSync(path.join(R, '_acceptance', slug), { recursive: true });
  writeFileSync(path.join(R, '_acceptance', slug, 'contract.md'), contractText(slug, o));
  git('add', '-A'); git('commit', '-qm', 'c2');
  const c2 = git('rev-parse', 'HEAD').trim();
  if (evidence) {
    writeFileSync(path.join(R, '_acceptance', slug, 'evidence-report.md'), evidenceText(slug, { ...o, verifiedCommit: c2 }));
    writeFileSync(path.join(R, '_acceptance', slug, 'run-log.jsonl'), runLogText(slug));
    git('add', '-A'); git('commit', '-qm', 'c3');
  }
  return R;
}
function luoi(R) {
  const env = { ...process.env }; delete env.PRE_MERGE_BASE;
  const r = spawnSync('bash', [PREMERGE, R, '--base', 'basepoint'], { encoding: 'utf8', env });
  return { status: r.status, out: (r.stdout || '') + '\n' + (r.stderr || '') };
}
const withGit = (slug, o, opts, fn) => { const R = mkGit(slug, o, opts); try { return fn(R); } finally { rmSync(R, { recursive: true, force: true }); } };

// ── RT2 — lưới: machine-cleared là LỜI KHAI, lưới đòi bằng chứng ─────────────
if (want('RT2')) {
  const errs = [];
  const BASE = { ...MC, approvedBy: '', sach: 'sach', signoff: '' };
  const cases = [
    ['dương', BASE, r => r.status === 0 && /NOTE \[rt2\]: xanh-sạch — máy đi tiếp/.test(r.out), 'exit 0 + NOTE xanh-sạch'],
    ['(a) UNCERTAIN', { ...BASE, sach: 'uncertain' }, r => r.status !== 0 && /VIOLATION \[rt2\]: status machine-cleared nhưng hồ sơ còn cần người — có mục UNCERTAIN/.test(r.out), 'VIOLATION ghim UNCERTAIN'],
    ['(a2) Known limits có nội dung', { ...BASE, sach: 'kl-co' }, r => r.status !== 0 && /còn cần người — mục «Known limits» có nội dung/.test(r.out), 'VIOLATION ghim mục có nội dung'],
    ['(b) T3 + người duyệt Cổng 1', { ...BASE, tier: 'T3', approvedBy: 'Fx', veto: null, opened: null }, r => r.status !== 0 && /còn cần người — hạng T3 \(chỉ T2 được đi tiếp không ký\)/.test(r.out), 'VIOLATION ghim hạng T3'],
    ['(c) không veto, approved_by rỗng', { ...BASE, veto: null, opened: null }, r => r.status !== 0 && /VIOLATION \[rt2\]: status=machine-cleared but approved_by is empty/.test(r.out), 'VIOLATION Cổng 1'],
  ];
  for (const [ten, o, ok, mo] of cases) withGit('rt2', o, {}, R => {
    const r = luoi(R);
    if (!ok(r)) errs.push(`${ten}: mong ${mo}; exit ${r.status}; ${r.out.split('\n').filter(l => /rt2/.test(l)).join(' | ').slice(0, 260)}`);
  });
  // (d) fixture có approved_by: chỉ còn ĐÚNG một vấn đề là thiếu báo cáo, nên câu trả về
  // là câu của luật thiếu-hồ-sơ chứ không lẫn với luật Cổng 1.
  withGit('rt2', { ...BASE, approvedBy: 'Fx', veto: null, opened: null }, { evidence: false }, R => {
    const r = luoi(R);
    if (r.status === 0 || !/VIOLATION \[rt2\]: status=machine-cleared but no evidence-report.md/.test(r.out)) errs.push(`(d) thiếu báo cáo phải VIOLATION arm; exit ${r.status}; ${r.out.split('\n').filter(l => /rt2/.test(l)).join(' | ').slice(0, 260)}`);
  });
  if (errs.length) fail('RT2', errs.join(' · '));
  else pass('RT2', 'lưới: machine-cleared xanh-sạch qua; UNCERTAIN/mục-có-nội-dung/T3/không-veto/thiếu-báo-cáo chặn ghim câu');
}

// ── RT15 — machine-cleared × chữ ký người (chân hook; lưới+quét thêm ở chặng sau) ──
if (want('RT15')) {
  const errs = [];
  withRepo(root => {
    W(root, '.git', '');
    const dir = path.join(root, '_acceptance', 'rt15'); mkdirSync(dir, { recursive: true });
    const cp = path.join(dir, 'contract.md'), ep = path.join(dir, 'evidence-report.md');
    writeFileSync(path.join(dir, 'run-log.jsonl'), runLogText('rt15'));
    // (a+) đối chứng dương: báo cáo KHÔNG chữ ký → ghi hợp đồng machine-cleared QUA
    writeFileSync(ep, evidenceText('rt15', { signoff: '' }));
    let r = hook(cp, contractText('rt15', MC), { existing: contractText('rt15', { ...MC, status: 'verified' }) });
    if (r.code !== 0) errs.push(`(a+) đối chứng dương exit ${r.code}: ${r.err.slice(0, 160)}`);
    // (a) báo cáo CÓ chữ ký → ghi hợp đồng machine-cleared CHẶN
    writeFileSync(ep, evidenceText('rt15', { signoff: 'Fx 2026-08-23' }));
    r = hook(cp, contractText('rt15', MC), { existing: contractText('rt15', { ...MC, status: 'verified' }) });
    if (r.code !== 2 || !/chữ ký người trên hồ sơ máy-thông/.test(r.err)) errs.push(`(a) hook nhánh hợp đồng phải chặn, exit ${r.code}: ${r.err.slice(0, 200)}`);
    // (a') ghi BÁO CÁO có chữ ký khi hợp đồng đang machine-cleared → CHẶN
    writeFileSync(cp, contractText('rt15', MC));
    r = hook(ep, evidenceText('rt15', { signoff: 'Fx 2026-08-23' }), { existing: evidenceText('rt15', { signoff: '' }) });
    if (r.code !== 2 || !/chữ ký người trên hồ sơ máy-thông/.test(r.err)) errs.push(`(a') hook nhánh báo cáo phải chặn, exit ${r.code}: ${r.err.slice(0, 200)}`);
    // (a'+) đối chứng dương nhánh báo cáo: hợp đồng verified thì ghi chữ ký là bình thường
    writeFileSync(cp, contractText('rt15', { ...MC, status: 'verified' }));
    r = hook(ep, evidenceText('rt15', { signoff: 'Fx 2026-08-23' }), { existing: evidenceText('rt15', { signoff: '' }) });
    if (r.code !== 0) errs.push(`(a'+) verified + chữ ký phải QUA, exit ${r.code}: ${r.err.slice(0, 200)}`);
  });
  // (a-lưới) chữ ký trên hồ sơ máy-thông → lưới VIOLATION; đối chứng dương không chữ ký → qua
  withGit('rt15', { ...MC, signoff: 'Fx 2026-08-23' }, {}, R => {
    const r = luoi(R);
    if (r.status === 0 || !/VIOLATION \[rt15\]: chữ ký người trên hồ sơ máy-thông/.test(r.out)) errs.push(`(a-lưới) phải VIOLATION, exit ${r.status}; ${r.out.split('\n').filter(l => /rt15/.test(l)).join(' | ').slice(0, 240)}`);
  });
  withGit('rt15', { ...MC, signoff: '' }, {}, R => {
    const r = luoi(R);
    if (r.status !== 0) errs.push(`(a-lưới+) đối chứng dương exit ${r.status}: ${r.out.split('\n').filter(l => /VIOLATION/.test(l)).join(' | ').slice(0, 240)}`);
  });
  // (c) da-veto trên machine-cleared bị chặn CÙNG thông điệp với verified (không đẻ luật mới)
  for (const st of ['machine-cleared', 'verified']) withGit('rt15', { ...MC, status: st, veto: 'da-veto' }, {}, R => {
    const r = luoi(R);
    if (r.status === 0 || !/VIOLATION \[rt15\]: veto_state=da-veto chưa xử/.test(r.out)) errs.push(`(c) ${st}+da-veto phải chặn cùng thông điệp; exit ${r.status}`);
  });
  // (b) chuyển machine-cleared -> signed-off có CHỦ đứng tên: thân lệnh ký phải nói ra.
  errs.push(...checkMenhDe([
    ['signoff nhận machine-cleared', 'commands/signoff.md',
      t => cut(t, /^3\. \*\*List what only the human decides/m, /^4\. \*\*Collect decisions/m),
      /kể cả khi hồ sơ đang `machine-cleared`/, 1],
  ]));
  // (d) bộ quét gọi HỎNG cho hồ sơ mâu thuẫn — không im lặng xếp vào «đã giao».
  withRepo(root => {
    mkWs(root, 'k', { contract: MC, evidence: { signoff: 'Fx 2026-08-23' } });
    const x = findSlug(scan(root), 'k');
    if (!x || x.grp !== 'broken') errs.push(`(d) bộ quét phải gọi hỏng: ${JSON.stringify(x)}`);
    else if (!/chữ ký người trên hồ sơ máy-thông/.test(x.reason || '')) errs.push(`(d) lý do không nêu mâu thuẫn: ${x.reason}`);
    // đối chứng dương: bỏ chữ ký thì cùng fixture phải vào «đã giao», không hỏng
    mkWs(root, 'k2', { contract: MC, evidence: { signoff: '' } });
    const y = findSlug(scan(root), 'k2');
    if (!y || y.grp !== 'done' || y.stateKey !== 'da-giao-may-thong-veto-mo') errs.push(`(d+) đối chứng dương: ${JSON.stringify(y)}`);
    // (d-thẻ) THẺ phải đọc mảng `broken` TẦNG NGOÀI groups: hồ sơ bộ quét gọi HỎNG không
    // bao giờ là «máy đã đi tiếp» — thẻ in cờ đỏ kèm ĐÚNG lý do của bộ quét + đường sửa
    // (S4-r6 [4]: mệnh đề null-scan từng biến đúng ca này thành «đi tiếp hợp lệ»).
    const crB = spawnSync(process.execPath, [CARD, '--root', root, '--slug', 'k'], { encoding: 'utf8' });
    if (crB.status !== 0) errs.push(`(d-thẻ) thẻ sập exit ${crB.status}: ${(crB.stderr || '').slice(0, 160)}`);
    else {
      if (/Cổng 2 · máy đã đi tiếp|Hồ sơ này máy đã đi tiếp/.test(crB.stdout)) errs.push('(d-thẻ) thẻ vẫn gọi hồ sơ hỏng là «máy đã đi tiếp»');
      if (!/HỎNG/.test(crB.stdout) || !/chữ ký người trên hồ sơ máy-thông/.test(crB.stdout)) errs.push('(d-thẻ) thẻ không in cờ HỎNG kèm lý do của bộ quét');
    }
    // (d-thẻ+) đối chứng dương: cùng lớp fixture, không chữ ký → thẻ nói «máy đã đi tiếp»,
    // không cờ HỎNG.
    const crK2 = spawnSync(process.execPath, [CARD, '--root', root, '--slug', 'k2'], { encoding: 'utf8' });
    if (crK2.status !== 0 || !/Hồ sơ này máy đã đi tiếp/.test(crK2.stdout) || /HỎNG/.test(crK2.stdout))
      errs.push(`(d-thẻ+) đối chứng dương: thẻ phải nói «máy đã đi tiếp», không cờ HỎNG (exit ${crK2.status})`);
  });
  // (e) LỐI KÝ CHẠY THẬT — không chỉ ghim rằng thân lệnh CÓ CHỨA câu. Chạy đúng chuỗi ghi
  // mà signoff.md bước 7 dạy cho hồ sơ máy-thông, qua CHÍNH hook: phải đi tới nơi. Vòng 1
  // chỉ đo chuỗi trong tài liệu, nên cổng ký khoá mà mọi ca vẫn xanh (finding S4-r3).
  withRepo(root => {
    W(root, '.git', '');
    const dir = path.join(root, '_acceptance', 'rt15b'); mkdirSync(dir, { recursive: true });
    const cp = path.join(dir, 'contract.md'), ep = path.join(dir, 'evidence-report.md');
    writeFileSync(cp, contractText('rt15b', MC));
    writeFileSync(ep, evidenceText('rt15b', { signoff: '' }));
    writeFileSync(path.join(dir, 'run-log.jsonl'), runLogText('rt15b'));
    // Thứ tự signoff.md bước 7 dạy: hợp đồng TRƯỚC, rồi báo cáo. Cả hai lượt phải QUA.
    let r = hook(cp, contractText('rt15b', { ...MC, status: 'signed-off', approvedBy: 'Fx' }), { existing: contractText('rt15b', MC) });
    if (r.code !== 0) errs.push(`(e) lượt 1 (ghi hợp đồng signed-off) bị chặn: exit ${r.code} — ${r.err.slice(0, 160)}`);
    writeFileSync(cp, contractText('rt15b', { ...MC, status: 'signed-off', approvedBy: 'Fx' }));
    r = hook(ep, evidenceText('rt15b', { signoff: 'Fx 2026-08-24' }), { existing: evidenceText('rt15b', { signoff: '' }) });
    if (r.code !== 0) errs.push(`(e) lượt 2 (ghi chữ ký vào báo cáo) bị chặn: exit ${r.code} — ${r.err.slice(0, 160)}`);
    // Và thân lệnh phải NÓI RA thứ tự đó — người/máy đọc tài liệu mới đi đúng.
    errs.push(...checkMenhDe([
      ['signoff dạy thứ tự ghi', 'commands/signoff.md',
        t => cut(t, /^7\. \*\*Ghi và commit/m, /^8\.|^Never:/m),
        /ghi contract `status:\n   signed-off` TRƯỚC/, 1],
    ]));
    // Thông điệp chặn phải chỉ đường, không chỉ nói sai.
    writeFileSync(cp, contractText('rt15b', MC));
    r = hook(ep, evidenceText('rt15b', { signoff: 'Fx 2026-08-24' }), { existing: evidenceText('rt15b', { signoff: '' }) });
    if (r.code !== 2) errs.push(`(e) chiều đỏ: thứ tự ngược phải bị chặn, exit ${r.code}`);
    else if (!/ghi contract\.md `status: signed-off` TRƯỚC/.test(r.err)) errs.push('(e) thông điệp chặn không chỉ ra bước kế');
  });
  if (errs.length) fail('RT15', errs.join(' · '));
  else pass('RT15', 'machine-cleared × chữ ký: hook hai chiều + lưới + bộ quét gọi hỏng; LỐI KÝ chạy thật theo thứ tự thân lệnh dạy (hai lượt đều qua) + thứ tự ngược bị chặn kèm bước kế; da-veto cùng thông điệp');
}

// ── RT5 — bảng chữ: 4 khoá mới, nhãn riêng, bucket đúng (phần bản đồ/thẻ ở chặng sau) ──
if (want('RT5')) {
  const errs = [];
  const B = require(path.join(ROOT, 'scripts', 'trang-thai-ho-so.cjs'));
  const MOI = {
    'da-giao-may-thong-veto-mo': ['máy thông', 'da-ship'],
    'da-giao-may-thong-xanh-sach': ['máy thông', 'da-ship'],
    'da-giao-khong-do': ['không đo', 'da-ship'],
    'da-dong-ho-so': ['đóng có hồ sơ', 'da-bac'],
  };
  for (const [k, [chu, bucket]] of Object.entries(MOI)) {
    let c; try { c = B.chu(k); } catch (e) { errs.push(`thiếu khoá ${k}`); continue; }
    if (!c.nhan.includes(chu)) errs.push(`${k}: nhãn «${c.nhan}» không chứa «${chu}»`);
    if (B.BUCKET_OF[k] !== bucket) errs.push(`${k}: bucket ${B.BUCKET_OF[k]} != ${bucket}`);
  }
  // Bất biến phân biệt: máy-thông KHÔNG BAO GIỜ cùng chữ với hồ sơ người ký.
  try { if (B.chu('da-giao').nhan === B.chu('da-giao-may-thong-veto-mo').nhan) errs.push('nhãn máy-thông trùng nhãn đã giao'); } catch (_) {}
  // Bản đồ và thẻ phải in chữ RÚT TỪ BẢNG, không tự chế chuỗi.
  withRepo(root => {
    mkWs(root, 'm', { contract: MC, evidence: {} });
    spawnSync(process.execPath, [PMAP, '--root', root], { encoding: 'utf8' });
    const md = existsSync(path.join(root, 'PRODUCT-MAP.md')) ? readFileSync(path.join(root, 'PRODUCT-MAP.md'), 'utf8') : '';
    if (!md.includes(B.chu('da-giao-may-thong-veto-mo').nhan)) errs.push('bản đồ không in nhãn máy-thông rút từ bảng');
    const ex = JSON.parse(spawnSync(process.execPath, [CARD, '--root', root, '--slug', 'm', '--extract'], { encoding: 'utf8' }).stdout);
    if (String(ex.gate) !== '2') errs.push(`thẻ nhận gate=${ex.gate}, mong 2`);
    const cr = spawnSync(process.execPath, [CARD, '--root', root, '--slug', 'm'], { encoding: 'utf8' });
    const html = cr.stdout || '';
    if (cr.status !== 0) errs.push(`thẻ exit ${cr.status}: ${(cr.stderr || '').slice(0, 200)}`);
    if (!/máy đã thông/.test(html)) errs.push('thẻ thiếu dòng «máy đã thông»');
    if (!/cửa veto đang mở/.test(html)) errs.push('thẻ thiếu trạng thái cửa veto');
    if (/Ký duyệt|Ký hay trả/.test(html)) errs.push('thẻ vẫn mời ký một hồ sơ máy đã thông');
  });
  // Bộ quét MÙ (repo chưa dựng cổng → không có groups) mà hợp đồng khai máy-thông: thẻ
  // phải RENDER, không sập. Vòng trước gọi bảng chữ với khoá null → bảng ném → exit 1,
  // 0 byte, người nhận màn hình trắng (S4-r5, đã dựng lại).
  {
    const r = tmp('rt5-mu-');
    mkdirSync(path.join(r, '_acceptance', 'm'), { recursive: true });   // KHÔNG có config.yaml
    writeFileSync(path.join(r, '_acceptance', 'm', 'contract.md'), contractText('m', MC));
    writeFileSync(path.join(r, '_acceptance', 'm', 'evidence-report.md'), evidenceText('m', {}));
    const cr = spawnSync(process.execPath, [CARD, '--root', r, '--slug', 'm'], { encoding: 'utf8' });
    if (cr.status !== 0) errs.push(`bộ quét mù: thẻ sập exit ${cr.status} — ${(cr.stderr || '').split('\n')[1] || ''}`);
    else if (!(cr.stdout || '').includes('máy đã thông')) errs.push('bộ quét mù: thẻ render nhưng không nói hồ sơ máy-thông');
    else if (/Ký duyệt/.test(cr.stdout)) errs.push('bộ quét mù: thẻ vẫn mời ký hồ sơ máy-thông');
    rmSync(r, { recursive: true, force: true });
  }
  // ── Dòng ngưỡng KHÔNG gạch đầu dòng: thẻ và lib phải nói CÙNG một chuyện ──────
  // Hồi quy S4-r8: `chuaDien` từng đi qua bulletOf (bắt buộc `- `), nên ô toàn placeholder
  // viết không gạch bị thẻ gọi là «đã khai» — mất cờ vàng, lại đòi thêm `## Đường đo` — trong
  // khi thresholdState vẫn gọi «chưa chốt». Đo QUAN HỆ giữa hai bên đọc, không đo hằng số.
  {
    const r = mkRepo();
    const KHONG_GACH = ['Câu hỏi phép đo trả lời: …', 'Kết quả nào là SỐNG: …', 'Kết quả nào là CHẾT: …', 'Timebox: …'];
    const opp = `---\nslug: ng\nstage: decided\ndecision: build\ndecided_by: Fx\n---\n\n# ng\n\n## ${NG.UAT_THRESHOLD_HEADING}\n\n${KHONG_GACH.join('\n')}\n`;
    mkdirSync(path.join(r, '_acceptance', 'ng'), { recursive: true });
    writeFileSync(path.join(r, '_acceptance', 'ng', 'contract.md'), contractText('ng', { status: 'draft' }));
    writeFileSync(path.join(r, '_acceptance', 'ng', 'opportunity.md'), opp);
    const ex = spawnSync(process.execPath, [CARD, '--root', r, '--slug', 'ng', '--extract'], { encoding: 'utf8' });
    let card = null; try { card = JSON.parse(ex.stdout); } catch { /* dưới */ }
    if (!card) errs.push(`ngưỡng không gạch: thẻ --extract không ra JSON (exit ${ex.status})`);
    else {
      const theKhai = (card.uat_threshold && card.uat_threshold.lines || []).length > 0;
      const libKhai = NG.thresholdState(opp, readFileSync(OPP_TPL, 'utf8')) === 'chot';
      // QUAN HỆ: thẻ coi là «đã khai» ⇔ lib coi là «đã chốt». Cả hai phải nói CHƯA.
      if (theKhai !== libKhai) errs.push(`ngưỡng không gạch: thẻ nói ${theKhai ? 'đã khai' : 'chưa khai'} còn lib nói ${libKhai ? 'đã chốt' : 'chưa chốt'} — hai bộ đọc lệch`);
      if (theKhai) errs.push(`ngưỡng không gạch: thẻ nhận placeholder thành ngưỡng đã khai (${JSON.stringify(card.uat_threshold.lines)})`);
      // Chiều đỏ: hoàn nguyên vị từ về bulletOf (bắt buộc gạch) → dòng không gạch LỌT.
      const cuChuaDien = l => { const b = NG.bulletOf(l); return !!b && NG.PLACEHOLDER_RE.test(b.value); };
      if (KHONG_GACH.every(cuChuaDien)) errs.push('chiều đỏ RT5: vị từ CŨ (đòi gạch) vẫn bắt được dòng không gạch — fixture không phân biệt được hai luật');
      if (!KHONG_GACH.every(l => NG.chuaDien(l))) errs.push('chiều đỏ RT5: vị từ MỚI không nhận dòng không gạch là chưa điền');
    }
    rmSync(r, { recursive: true, force: true });
  }
  if (errs.length) fail('RT5', errs.join(' · '));
  else pass('RT5', '4 khoá mới có nhãn riêng + bucket đúng; bản đồ và thẻ in chữ từ bảng; thẻ không mời ký hồ sơ máy-thông; ngưỡng không-gạch: thẻ ⇔ lib cùng kết luận');
}

// ── RT4 — bộ quét: machine-cleared vào đúng ô, tới được Cổng Giá trị ─────────
if (want('RT4')) {
  const errs = [];
  withRepo(root => {
    mkWs(root, 'a', { contract: MC, evidence: {} });
    mkWs(root, 'b', { contract: { status: 'machine-cleared', tier: 'T2', approvedBy: 'Fx' }, evidence: {} });
    mkWs(root, 'c', { contract: MC, evidence: {}, opportunity: { nguong: 'chot' } });
    mkWs(root, 'd', { contract: { ...MC, status: 'verified' }, evidence: {}, opportunity: { nguong: 'chot' } });
    mkWs(root, 'e', { contract: { status: 'signed-off', tier: 'T2', approvedBy: 'Fx' }, evidence: { signoff: 'Fx 2026-08-23' } });
    const j = scan(root);
    const A = findSlug(j, 'a'), B = findSlug(j, 'b'), C = findSlug(j, 'c'), D = findSlug(j, 'd'), E = findSlug(j, 'e');
    if (!A || A.grp !== 'done' || A.stateKey !== 'da-giao-may-thong-veto-mo') errs.push(`(a) ${JSON.stringify(A)}`);
    if ((j.groups.done || []).some(x => x.slug === 'a' && x.stateKey === 'da-giao')) errs.push('(a) có phần tử da-giao cho slug máy-thông');
    if (!B || B.stateKey !== 'da-giao-may-thong-xanh-sach') errs.push(`(b) ${JSON.stringify(B)}`);
    if (!C || C.grp !== 'gates' || C.gate !== 'gia-tri') errs.push(`(c) máy-thông + ô build phải tới Cổng Giá trị: ${JSON.stringify(C)}`);
    if (!D || D.grp === 'gates' || D.stateKey !== 'may-di-tiep-veto-mo') errs.push(`(d) đọc-cũ: verified phải giữ may-di-tiep-veto-mo: ${JSON.stringify(D)}`);
    if (!E || E.stateKey !== 'da-giao') errs.push(`(e) signed-off phải là da-giao: ${JSON.stringify(E)}`);
    if (E && A && E.label === A.label) errs.push('(e) nhãn signed-off trùng nhãn máy-thông');
    if (j.broken.length) errs.push(`broken: ${JSON.stringify(j.broken)}`);
  });
  if (errs.length) fail('RT4', errs.join(' · '));
  else pass('RT4', 'machine-cleared: hai khoá máy-thông; tới Cổng Giá trị khi có ô build; verified cũ giữ nguyên; khác chữ với đã ký');
}

// ── RT9 — ma trận ngưỡng × trạng thái (8 ô, 8 assert viết trước) ─────────────
if (want('RT9')) {
  const errs = []; let oDem = 0;
  const KV = { chot: ['gates', 'gia-tri', false], 'khong-do-duoc': ['done', 'da-giao-khong-do', false], 'chua-chot': ['gates', 'gia-tri', true], 'de-xuat': ['gates', 'gia-tri', true] };
  for (const st of ['signed-off', 'machine-cleared']) for (const ng of Object.keys(KV)) {
    oDem++;
    withRepo(root => {
      const con = st === 'signed-off' ? { status: st, tier: 'T2', approvedBy: 'Fx' } : MC;
      mkWs(root, 'x', { contract: con, evidence: { signoff: st === 'signed-off' ? 'Fx 2026-08-23' : '' }, opportunity: { nguong: ng } });
      const x = findSlug(scan(root), 'x'); const [grp, key, flag] = KV[ng];
      const ok = x && x.grp === grp && (grp === 'gates' ? x.gate === key : x.stateKey === key) && ((x.flags || []).includes('nguong-chua-chot') === flag);
      if (!ok) errs.push(`${st}×${ng}: ${JSON.stringify(x)}`);
    });
  }
  if (oDem !== 8) errs.push(`ma trận ${oDem} != 8 khai trước`);
  withRepo(root => {
    mkWs(root, 'y', { opportunity: { stage: 'discovery', decision: '', nguong: 'de-xuat' } });
    mkWs(root, 'z', { opportunity: { stage: 'discovery', decision: '', nguong: 'chua-chot' } });
    const j = scan(root);
    if (findSlug(j, 'y')?.gate !== 'dang') errs.push(`de-xuat chưa hợp đồng phải chờ Cổng Đáng: ${JSON.stringify(findSlug(j, 'y'))}`);
    if (findSlug(j, 'z')?.grp !== 'considering') errs.push(`chua-chot phải ở considering: ${JSON.stringify(findSlug(j, 'z'))}`);
  });
  // Seam: «Không đo được:» (hai chấm) KHÔNG phải lối ra — chỉ tiền tố đúng mới nhận.
  withRepo(root => {
    mkWs(root, 's', { contract: MC, evidence: {}, opportunity: { nguong: 'khong-do-duoc-hai-cham' } });
    const x = findSlug(scan(root), 's');
    if (!x || x.grp !== 'gates' || !(x.flags || []).includes('nguong-chua-chot')) errs.push(`seam hai chấm không được nhận: ${JSON.stringify(x)}`);
  });
  // [5] Dạng BULLET (gạch đầu dòng trước tiền tố không-đo-được) PHẢI được nhận (section
  // Ngưỡng toàn bullet nên đó là dạng tự nhiên nhất; bản cũ xếp im lặng thành chua-chot)
  // — đo qua CHÍNH bộ quét, đối chứng âm là ca hai-chấm ngay trên (cùng họ fixture).
  withRepo(root => {
    mkWs(root, 'sb', { contract: MC, evidence: {}, opportunity: { nguong: 'khong-do-duoc-bullet' } });
    const x = findSlug(scan(root), 'sb');
    if (!x || x.grp !== 'done' || x.stateKey !== 'da-giao-khong-do') errs.push(`bullet không-đo-được phải được nhận là lối ra: ${JSON.stringify(x)}`);
  });
  // [5] Vị từ lib hai chiều, needle dựng từ chuỗi khuôn (không literal — RT18 canh):
  // bullet `-`/`*` nhận; hai chấm vẫn KHÔNG nhận.
  for (const [l, exp] of [[`- ${KHONG_DO} nội bộ`, true], [`* ${KHONG_DO} nội bộ`, true],
                          [`${KHONG_DO.replace(/\s*—\s*$/, ':')} nội bộ`, false]])
    if (NG.isKhongDoLine(l, KHONG_DO) !== exp) errs.push(`isKhongDoLine(${JSON.stringify(l)}) phải là ${exp}`);
  if (errs.length) fail('RT9', errs.join(' · '));
  else pass('RT9', 'ma trận 8 ô ngưỡng × trạng thái; de-xuat là đã điền ở Cổng Đáng; bullet không-đo-được nhận, seam hai chấm không nhận');
}

// ── RT12 — archived có ô kết; timebox quá hạn có cờ ─────────────────────────
if (want('RT12')) {
  const errs = [];
  withRepo(root => {
    const KY = { status: 'signed-off', tier: 'T2', approvedBy: 'Fx' };
    mkWs(root, 'ar', { opportunity: { stage: 'archived', decision: 'kill' } });
    // [6] Hai fixture BIÊN sinh từ Date.now() lúc chạy: hạn «muộn nhất <HÔM NAY>» BAO GỒM
    // ngày đó → KHÔNG cờ; «muộn nhất <HÔM QUA>» → CÓ cờ. Hai assert này phân biệt ba cách
    // viết biên (d<now · d<=now · d+1day<=now) — RT13(iii) hỏi chính lib nên không chạm
    // biên được; bốn fixture cũ cách biên hàng trăm năm (S4-r6 [6]).
    const ngayUTC = ts => new Date(ts).toISOString().slice(0, 10);
    // «Hôm qua» dựng bằng phép lùi NGÀY của Date, KHÔNG bằng hằng mili-giây: một hằng
    // một-ngày viết ở đây là bản chép thứ hai của luật timebox (S4-r7 [5]).
    const homQua = () => { const d = new Date(); d.setUTCDate(d.getUTCDate() - 1); return d.toISOString().slice(0, 10); };
    for (const [slug, tb] of [['tb1', 'muộn nhất 2000-01-01 → park'], ['tb2', 'muộn nhất 01/01/2000'], ['tb3', 'muộn nhất 2999-12-31'], ['tb4', 'cuối quý'],
                              ['tb5', `muộn nhất ${ngayUTC(Date.now())}`], ['tb6', `muộn nhất ${homQua()}`]])
      mkWs(root, slug, { contract: KY, evidence: { signoff: 'Fx 2026-08-23' }, opportunity: { nguong: 'chot', timebox: tb } });
    const j = scan(root);
    if (findSlug(j, 'ar')?.stateKey !== 'da-dong-ho-so') errs.push(`archived: ${JSON.stringify(findSlug(j, 'ar'))}`);
    for (const [s, exp] of [['tb1', true], ['tb2', true], ['tb3', false], ['tb4', false], ['tb5', false], ['tb6', true]]) {
      const x = findSlug(j, s);
      if (!x || x.grp !== 'gates' || ((x.flags || []).includes('qua-timebox') !== exp)) errs.push(`${s}: mong cờ=${exp}, ${JSON.stringify(x)}`);
    }
  });
  // [2] Thân lệnh /start phải DẠY in cờ ở CẢ HAI nhóm còn lại mà bộ quét có gắn cờ
  // («Đang dở» sap-mo-vong mang qua-timebox; «Vừa xong»/done mang qua-timebox +
  // mien-do-co-nguoi-dung) — không chỉ nhóm chờ chữ ký (S4-r6 [2]).
  errs.push(...checkMenhDe([
    ['start in cờ nhóm đang dở', 'commands/start.md',
      t => cut(t, /^   - \*\*Đang dở\*\*/m, /<!-- <<<START-CAN-NHAC -->/m),
      /Phần tử có `flags` → in thêm ngay dòng đó/, 1],
    ['start in cờ nhóm vừa xong', 'commands/start.md',
      t => cut(t, /^   - \*\*Vừa xong\*\*/m, /^   - \*\*Còn veto được\*\*/m),
      /Phần tử có `flags` → in thêm ngay dưới dòng của nó/, 1],
  ]));
  // E12 tuyên hai mệnh đề của nghi thức nghiệm thu — đường SINH RA trạng thái mà nửa trên
  // đang đo. Không đo nó là đo cái kết mà không đo cái tạo ra nó (finding S4-r1).
  errs.push(...checkMenhDe([
    ['uat kill→archived', 'skills/uat-session/SKILL.md', t => cut(t, /^- Bước kế theo verdict/m, /^- Append kết quả đo/m), /`kill` → ghi `stage: archived`/, 1],
    ['uat iterate→bước kế', 'skills/uat-session/SKILL.md', t => cut(t, /^- Bước kế theo verdict/m, /^- Append kết quả đo/m), /`iterate` → in đúng một dòng/, 1],
  ]));
  if (errs.length) fail('RT12', errs.join(' · '));
  else pass('RT12', 'archived → đã đóng có hồ sơ; timebox hai dạng ngày; nghi thức nghiệm thu có mệnh đề sinh ra trạng thái đó');
}

const card = (root, slug, extra = []) => spawnSync(process.execPath, [CARD, '--root', root, '--slug', slug, ...extra], { encoding: 'utf8' });

// ── RT11 — răng chống lách: lối «không đo được» không thành đường trốn ───────
if (want('RT11')) {
  const errs = [];
  for (const [sf, exp] of [['ui', true], ['mobile', true], ['cli', false]]) withRepo(root => {
    mkWs(root, 'u', { contract: { status: 'draft', surfaces: sf }, opportunity: { nguong: 'khong-do-duoc' } });
    const ex = JSON.parse(card(root, 'u', ['--extract']).stdout);
    const html = card(root, 'u').stdout || '';
    if (!!ex.cong_gia_tri?.mien_do_co_nguoi_dung !== exp) errs.push(`${sf}: extract=${JSON.stringify(ex.cong_gia_tri)}`);
    if (/[Kk]hai không đo được nhưng hợp đồng có mặt người dùng/.test(html) !== exp) errs.push(`${sf}: cờ đỏ ${exp ? 'thiếu' : 'thừa'}`);
    const x = findSlug(scan(root), 'u');
    if (!x || x.grp === 'broken') errs.push(`${sf}: bộ quét gọi hỏng: ${JSON.stringify(x)}`);
    else if (((x.flags || []).includes('mien-do-co-nguoi-dung')) !== exp) errs.push(`${sf}: cờ bộ quét ${JSON.stringify(x.flags)}`);
  });
  if (errs.length) fail('RT11', errs.join(' · '));
  else pass('RT11', 'ui/mobile + khai không-đo-được → cờ đỏ trên thẻ + cờ ở bộ quét, hồ sơ vẫn ở ô của nó; cli → không cờ');
}

// ── RT6 — năm văn bản nghi thức biết trạng thái mới ─────────────────────────
if (want('RT6')) {
  const FL = 'feature-loop/skills/feature-loop/SKILL.md';
  const errs = checkMenhDe([
    ['uat-§0 điều kiện vào', 'skills/uat-session/SKILL.md', t => cut(t, /^## 0\. Điều kiện vào/m, /^## 1\./m), /`status: signed-off` hoặc `machine-cleared`/, 1],
    ['uat-§0 ba ca ngưỡng', 'skills/uat-session/SKILL.md', t => cut(t, /^## 0\. Điều kiện vào/m, /^## 1\./m), new RegExp(reEsc(KHONG_DO) + ' '), null],
    ['fl bảng có hàng mới', FL, t => cut(t, /^\| status hiện tại/m, /^\n## /m), /^\| `machine-cleared` \|.*S5/m, 1],
    ['fl hàng machine-cleared khai đường ghi chưa bật', FL, t => cut(t, /^\| `machine-cleared` \|/m, /\n/), /ĐƯỜNG GHI CHƯA BẬT \(giới hạn đã khai\)/, 1],
    ['acceptance SKILL khai đường ghi chưa bật', 'skills/acceptance/SKILL.md', t => cut(t, /^4b\. \*\*Cổng Bằng chứng xanh-sạch/m, /^5\./m), /máy KHÔNG được tự đặt\n   trạng thái đó/, 1],
    ['CONTEXT term', 'CONTEXT.md', t => cut(t, /^\*\*Máy đã thông\*\*/m, /^\*\*|^### /m), /_Avoid_: gọi hồ sơ máy-thông là «đã ký»/, 1],
    ['acceptance-status hai trạng thái', 'commands/acceptance-status.md', t => t, /`machine-cleared` là máy đã thông/, 1, 'ca-file'],
    ['acceptance-report tách hai số', 'commands/acceptance-report.md', t => t, /`machine-cleared` \(máy đã thông, không chữ ký\)/, 1, 'ca-file'],
  ]);
  // CONTEXT phải có TERM, không chỉ nhắc chuỗi
  if (!/\*\*Máy đã thông\*\* \(`machine-cleared`\)/.test(readRepo('CONTEXT.md'))) errs.push('CONTEXT.md chưa có term «Máy đã thông»');
  // Đường ghi CHƯA BẬT: không văn bản nghi thức nào được dạy máy tự đặt trạng thái này.
  // GIỚI HẠN CỦA CHÍNH CA NÀY: needle bắt HÌNH DẠNG câu lệnh («set/đặt/ghi … status:
  // machine-cleared»), không bắt mọi cách diễn đạt — nó canh việc bật lại đường ghi bằng
  // đúng câu đã gỡ, không thay được người đọc. Khai ở «Known limits» của hồ sơ.
  const VAN_BAN_NGHI_THUC = ['feature-loop/skills/feature-loop/SKILL.md', 'skills/acceptance/SKILL.md',
    'skills/uat-session/SKILL.md', 'commands/signoff.md', 'commands/acceptance-status.md', 'commands/acceptance-report.md'];
  const RE_GHI = /(set|đặt|ghi)[^.\n]{0,40}`?status: machine-cleared/i;
  // PHÉP QUÉT THẬT trên một root cho trước — tham số hoá để chiều đỏ tiêm vào FILE, không
  // vào một chuỗi nối trong bộ nhớ (chuỗi nối chỉ chứng minh regex chạy, không chứng minh
  // phép quét đọc đúng file và nêu đúng tên — S4-r8 [6]).
  const quetGhi = root => VAN_BAN_NGHI_THUC
    .filter(f => existsSync(path.join(root, f)) && RE_GHI.test(readFileSync(path.join(root, f), 'utf8')));
  for (const f of quetGhi(ROOT)) errs.push(`${f}: dạy máy TỰ ĐẶT machine-cleared — đường ghi chưa bật (xem _acceptance/lan-may-thong-duong-ghi/)`);
  // Chiều đỏ: dựng cây tạm chứa SÁU văn bản thật, tiêm đúng câu vừa gỡ vào MỘT file, rồi
  // chạy CHÍNH phép quét trên cây đó — phải nêu đúng tên file ấy và KHÔNG nêu năm file kia.
  {
    const c6 = tmp('rt6-');
    try {
      for (const f of VAN_BAN_NGHI_THUC) {
        const d = path.join(c6, f); mkdirSync(path.dirname(d), { recursive: true });
        writeFileSync(d, readRepo(f));
      }
      if (quetGhi(c6).length) errs.push('chiều đỏ RT6: bản sao NGUYÊN VẸN đã đỏ — đối chứng dương hỏng');
      const dich = path.join(c6, FL);
      const truoc = readFileSync(dich, 'utf8');
      writeFileSync(dich, truoc + '\n(3) set contract `status: machine-cleared` rồi commit.\n');
      if (readFileSync(dich, 'utf8') === truoc) errs.push('chiều đỏ RT6: lệnh tiêm không đổi được file');
      const thay = quetGhi(c6);
      if (!thay.includes(FL)) errs.push(`chiều đỏ RT6: tiêm câu ghi vào ${FL} mà phép quét không nêu tên (thấy: ${JSON.stringify(thay)})`);
      if (thay.length > 1) errs.push(`chiều đỏ RT6: nêu oan file không bị tiêm: ${thay.filter(f => f !== FL).join(', ')}`);
    } finally { rmSync(c6, { recursive: true, force: true }); }
  }
  if (errs.length) fail('RT6', errs.join(' · '));
  else pass('RT6', 'văn bản nghi thức biết ĐỌC machine-cleared và khai đường GHI chưa bật; gỡ từng mệnh đề → bộ đọc đỏ; tiêm lại câu ghi → đỏ nêu tên file');
}

// ── RT10 — hai tiền tố: MỘT chỗ khai, năm nơi đọc lại ───────────────────────
if (want('RT10')) {
  const errs = [];
  // `commands/approve.md` KHÔNG còn trong vòng này: chế độ ký Cổng Đáng đã tách sang hồ sơ
  // `cong-dang-co-cua` (cắt đôi 24/08). Ba nơi đọc lại còn: khuôn · uat-session · start.
  const u = cut(readRepo('skills/uat-session/SKILL.md'), /^## 0\./m, /^## 1\./m);
  const st = readRepo('commands/start.md');
  if (!u.includes(KHONG_DO)) errs.push('uat-session §0 không mang đúng tiền tố không-đo-được');
  if (!st.includes(DE_XUAT)) errs.push(`start.md không mang đúng tiền tố ${DE_XUAT}`);
  if (!st.includes(KHONG_DO)) errs.push('start.md không mang đúng tiền tố không-đo-được');
  // Bên ĐỌC dùng đúng chuỗi khuôn: dựng fixture TỪ chuỗi khuôn rồi chạy bộ quét + thẻ thật.
  withRepo(root => {
    mkWs(root, 'p', { contract: MC, evidence: {}, opportunity: { nguong: 'khong-do-duoc' } });
    if (findSlug(scan(root), 'p')?.stateKey !== 'da-giao-khong-do') errs.push('bộ quét không nhận dòng dựng từ chuỗi khuôn');
  });
  // Chiều đỏ: bản sao khuôn đổi chuỗi → khuôn và bên đọc lệch nhau, ca phải NÊU CẢ HAI.
  const t2 = tmp('rt10-'); const fake = path.join(t2, 'opportunity-template.md');
  // Tiêm vào ĐÚNG khối marker: khuôn còn nhắc chuỗi trong câu hướng dẫn, replace() thường
  // ăn vào câu đó và khối vẫn nguyên — lệnh tiêm không đổi được dòng nào là ca chết.
  const tplRaw = readFileSync(OPP_TPL, 'utf8');
  const injected = tplRaw.replace(new RegExp('(<<<OPP-KHONG-DO-DUOC-PREFIX -->\\n)' + reEsc(KHONG_DO)), '$1Khong do duoc —');
  if (injected === tplRaw) errs.push('lệnh tiêm KHÔNG đổi được dòng nào trong khối marker');
  writeFileSync(fake, injected);
  const k2 = blockFromTemplate(fake, 'OPP-KHONG-DO-DUOC-PREFIX').trim();
  if (k2 === KHONG_DO) errs.push('bản sao khuôn đổi chuỗi mà bộ rút không thấy khác');
  // Chiều đỏ THẬT: chạy lại CHÍNH bộ đọc (lib phân loại ngưỡng) với khuôn bản sao trên một
  // ô cơ hội viết theo chuỗi CŨ. Khuôn lệch khỏi văn bản nghi thức thì lối ra có tên phải
  // TẮT — và ca phải nêu CẢ HAI chuỗi. Vòng trước chỉ hỏi «u.includes(k2)» với k2 là chuỗi
  // vừa bịa: không bao giờ đúng, tức assert luôn-xanh đội lốt chiều đỏ (S4-r7).
  {
    const tplFake = readFileSync(fake, 'utf8');
    const oCu = `## ${UAT_H}\n\n${KHONG_DO} vòng nội bộ\n`;
    const ngCu = NG.thresholdState(oCu, tplFake);
    if (ngCu === 'khong-do-duoc') errs.push(`chiều đỏ: khuôn đổi sang «${k2}» mà ô viết theo «${KHONG_DO}» VẪN được nhận — bộ đọc không bám khuôn`);
    const oMoi = `## ${UAT_H}\n\n${k2} vòng nội bộ\n`;
    if (NG.thresholdState(oMoi, tplFake) !== 'khong-do-duoc') errs.push(`chiều đỏ: ô viết theo chuỗi MỚI «${k2}» của khuôn bản sao lại không được nhận`);
  }
  rmSync(t2, { recursive: true, force: true });
  if (errs.length) fail('RT10', errs.join(' · '));
  else pass('RT10', `hai tiền tố («${DE_XUAT}», «${KHONG_DO}») khai một chỗ, năm nơi đọc lại; đổi khuôn → lệch nêu cả hai chuỗi`);
}

// ── RT13 — đọc-cũ trên CÂY THẬT + cờ theo QUAN HỆ + quét không gian mở ──────
if (want('RT13')) {
  const errs = [];
  const MOC_CU = 'cb38ea01';
  const contractRT = readRepo('_acceptance/ra-co-ten-lam-va-trao/contract.md');
  const block = m => {
    const x = contractRT.match(new RegExp(`<<<${m}\\n([\\s\\S]*?)${m}>>>`));
    if (!x) { errs.push(`contract thiếu khối ${m}`); return []; }
    return x[1].trim().split('\n').map(l => l.trim()).filter(Boolean);
  };
  const KHAC = block('KHAC-BIET-DOC-CU').map(l => l.split(/\s+/));
  const GACH = block('BO-DOC-KHAI-GACH').map(l => l.split(/\s+/)[0]);

  const keyOfAll = j => {
    const m = new Map();
    for (const grp of ['gates', 'inProgress', 'considering', 'done']) for (const x of (j.groups[grp] || [])) m.set(x.slug, x.stateKey);
    for (const b of (j.broken || [])) m.set(b.slug, 'ho-so-hong');
    return m;
  };

  // (i) bản MỚI trên cây thật
  const jNew = scan(ROOT);
  if (jNew.broken.length) errs.push(`bản mới broken: ${JSON.stringify(jNew.broken.map(b => b.slug))}`);

  // (ii) bản CŨ tại mốc, dựng vào thư mục tạm rồi chạy trên CÙNG cây
  const old = tmp('rt13-old-');
  const show = rel => execFileSync('git', ['-C', ROOT, 'show', `${MOC_CU}:${rel}`], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  for (const rel of ['scripts/start-scan.mjs', 'scripts/trang-thai-ho-so.cjs', 'scripts/khong-can-nguoi.mjs',
                     'lib/workspace-record.cjs', 'lib/evidence-core.cjs', 'lib/md-section.cjs', 'lib/ac-line.cjs',
                     'skills/acceptance/references/opportunity-template.md'])
    W(old, rel, show(rel));
  let jOld = null;
  try { jOld = scan(ROOT, path.join(old, 'scripts', 'start-scan.mjs')); }
  catch (e) { errs.push(`bản cũ không chạy được: ${String(e.message).slice(0, 160)}`); }
  rmSync(old, { recursive: true, force: true });
  if (jOld) {
    const mOld = keyOfAll(jOld), mNew = keyOfAll(jNew);
    for (const [slug, kOld] of mOld) {
      const kNew = mNew.get(slug);
      const kh = KHAC.find(r => r[0] === slug);
      if (kh) { if (kOld !== kh[1] || kNew !== kh[2]) errs.push(`${slug}: khối khai ${kh[1]}→${kh[2]}, thực ${kOld}→${kNew}`); }
      else if (kOld !== kNew) errs.push(`${slug}: lệch ${kOld}→${kNew} mà khối không khai`);
    }
    for (const slug of mNew.keys()) if (!mOld.has(slug)) errs.push(`${slug}: chỉ có ở bản mới`);
  }

  // (iii) CỜ đo bằng QUAN HỆ (đúng ở mọi ngày chạy) — vị từ HỎI LIB, không chép lại:
  // bản chép của vòng trước lệch đúng MỘT NGÀY và hẹn suite tự đỏ 30/08/2026 (S4-r4).
  const tplTxt = readFileSync(OPP_TPL, 'utf8');
  const all = ['gates', 'inProgress', 'done', 'considering'].flatMap(grp => (jNew.groups[grp] || []).map(x => ({ grp, ...x })));
  for (const x of all) {
    const op = path.join(ROOT, '_acceptance', x.slug, 'opportunity.md');
    const oTxt = existsSync(op) ? readFileSync(op, 'utf8') : null;
    // Nhóm «đang cân nhắc» writer CỐ Ý không gắn cờ (ý chưa quyết thì timebox chưa áp) —
    // quét CẢ nhóm đó và đòi cờ RỖNG, thay vì bỏ qua đúng chỗ có thể sai (S4-r4).
    if (x.grp === 'considering') {
      if ((x.flags || []).length) errs.push(`${x.slug}: nhóm cân nhắc mang cờ ${JSON.stringify(x.flags)} — writer khai không gắn`);
      continue;
    }
    const expQua = !!oTxt && NG.quaTimebox(oTxt);
    if (((x.flags || []).includes('qua-timebox')) !== expQua) errs.push(`${x.slug}: cờ qua-timebox ${expQua ? 'thiếu' : 'thừa'}`);
    const ng = oTxt ? NG.thresholdState(oTxt, tplTxt) : null;
    const expNg = x.grp === 'gates' && x.gate === 'gia-tri' && ng !== 'chot';
    if (((x.flags || []).includes('nguong-chua-chot')) !== !!expNg) errs.push(`${x.slug}: cờ nguong-chua-chot ${expNg ? 'thiếu' : 'thừa'} (ngưỡng ${ng})`);
  }

  // (iv) QUÉT KHÔNG GIAN MỞ: bộ đọc thứ N rẽ nhánh trên `signed-off` mà không ai nhớ tới.
  // Luật so đặt thành HÀM THUẦN để chiều đỏ tiêm được vào ĐẦU VÀO của chính nó — vòng 1
  // viết chiều đỏ là phép lọc trên một mảng vừa tự nối thêm phần tử, không chạy lại gì
  // (finding S4-r1: «chiều đỏ giả»).
  const NGOAI = [/^_acceptance\//, /^docs\//, /^PRODUCT-MAP\.md$/, /^CHANGELOG\.md$/, /^README\.md$/, /^GUIDE\.md$/, /^QUICKSTART\.md$/];
  // Nhận GỐC làm tham số: chiều đỏ (iv-a) phải chạy CHÍNH bước quét này trên cây tiêm,
  // chứ không nối tay tên file vào mảng (S4-r7).
  const grepSignedOff = (root = ROOT) => execFileSync('git', ['-C', root, 'grep', '-l', 'signed-off'], { encoding: 'utf8' })
    .trim().split('\n').filter(Boolean).filter(f => !NGOAI.some(re => re.test(f)));
  // «CÓ CA» = tên file vừa nằm trong `paths` của một eval, VỪA xuất hiện trong một BIỂU
  // THỨC ĐƯỢC CHẠY của chính file ca (chuỗi 'path' của readRepo/path.join/hàng checkMenhDe).
  // Chỉ dựa vào `paths` là miễn trừ theo LỜI KHAI; và bản cũ hỏi «tên có trong VĂN BẢN ca
  // không» nên một câu CHÚ THÍCH cũng miễn trừ được — đo chỉ dẫn thay vì đầu ra (S4-r6 [7],
  // ca thật: approve.md được miễn nhờ đúng dòng comment khai nó KHÔNG còn trong vòng).
  const evalsY = readRepo('_acceptance/ra-co-ten-lam-va-trao/evals.yaml');
  const testSrc = readRepo('tests/plugins/ra-co-ten.test.mjs');
  const khaiPaths = new Set((evalsY.match(/paths: \[([^\]]+)\]/g) || [])
    .flatMap(l => l.replace(/^paths: \[/, '').replace(/\]$/, '').split(',').map(x => x.trim())));
  // Lột chú thích khỏi nguồn ca TRƯỚC khi tìm: dòng //… và dòng thân khối /*…*/ (mở bằng
  // /* hoặc *) không phải mã chạy. Lột THEO DÒNG, không regex [\s\S] xuyên file: nguồn ca
  // chứa chuỗi glob `docs/**` nên một regex khối sẽ nuốt nhầm cả trăm dòng mã thật —
  // chiều lệch của lột-theo-dòng là STRICTER (lỡ tay lột một dòng mã thì răng đỏ, không xanh im).
  const stripChuThich = src => src.split('\n').filter(l => !/^\s*(\/\/|\/\*|\*)/.test(l)).join('\n');
  // So theo TÊN FILE trong CHUỖI được chạy ('…' / "…" / `…`): ca dựng đường dẫn bằng
  // path.join(ROOT,'hooks','…') nên chuỗi đủ đường dẫn không có mặt, nhưng tên file thì
  // luôn nằm trong một literal chuỗi nếu ca thật sự đọc nó.
  const coCaIn = (f, khai, srcChay) => khai.has(f)
    && new RegExp(`['"\`][^'"\`\n]*${reEsc(f.split('/').pop())}`).test(srcChay);
  const testSrcChay = stripChuThich(testSrc);
  const coCa = f => coCaIn(f, khaiPaths, testSrcChay);
  // Hàm thuần: trả danh sách file KHÔNG được giải trình, và dòng khai gạch đã chết.
  const soSanh = (files, gach, co = coCa) => ({
    la: files.filter(f => !co(f) && !gach.includes(f)),
    chet: gach.filter(f => !files.includes(f)),
  });
  const filesThat = grepSignedOff();
  if (filesThat.length < 5) errs.push(`git grep chỉ ra ${filesThat.length} file — nghi bước quét hỏng, không tin kết luận`);
  const r0 = soSanh(filesThat, GACH);
  for (const f of r0.la) errs.push(`file lạ chứa "signed-off": ${f} — thêm ca, hoặc khai gạch có lý do trong khối BO-DOC-KHAI-GACH`);
  for (const f of r0.chet) errs.push(`khối gạch khai ${f} nhưng file không còn chứa "signed-off" (dòng chết)`);
  // Chiều đỏ (iv-a): TIÊM file vào một KHO GIT tạm rồi chạy lại CHÍNH bước quét trên đó.
  // Vòng trước chỉ nối tên vào mảng rồi gọi hàm lọc — chứng minh hàm lọc, KHÔNG chứng minh
  // bước tìm (git grep + bộ lọc NGOAI). Nay bước tìm chạy thật trên cây có file tiêm.
  {
    const g = tmp('rt13-grep-');
    const git = (...a) => execFileSync('git', ['-c', 'user.name=rt', '-c', 'user.email=rt@x', '-C', g, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    git('init', '-q');
    W(g, 'scripts/gia-lap-bo-doc-moi.mjs', "// bộ đọc mới rẽ nhánh trên 'signed-off'\n");
    W(g, 'scripts/khong-lien-quan.mjs', '// không nhắc chuỗi nào\n');
    W(g, 'docs/ghi-chu.md', 'signed-off trong tài liệu — phải bị bộ lọc NGOAI loại\n');
    git('add', '-A'); git('commit', '-qm', 'fixture');
    const files2 = grepSignedOff(g);
    if (!files2.includes('scripts/gia-lap-bo-doc-moi.mjs')) errs.push('chiều đỏ (iv-a): bước quét THẬT không tìm ra bộ đọc mới vừa tiêm');
    if (files2.includes('docs/ghi-chu.md')) errs.push('chiều đỏ (iv-a): bộ lọc NGOAI không loại docs/**');
    if (files2.includes('scripts/khong-lien-quan.mjs')) errs.push('chiều đỏ (iv-a): bước quét nêu cả file không chứa chuỗi');
    if (!soSanh(files2, GACH).la.includes('scripts/gia-lap-bo-doc-moi.mjs')) errs.push('chiều đỏ (iv-a): quét ra rồi mà phép so không nêu tên');
    rmSync(g, { recursive: true, force: true });
  }
  // Chiều đỏ (iv-b): gỡ một dòng khai gạch → chính file đó phải bị nêu là «lạ».
  if (GACH.length) {
    const bo = GACH[0];
    const r2 = soSanh(filesThat, GACH.slice(1));
    if (!r2.la.includes(bo)) errs.push(`chiều đỏ (iv-b): gỡ dòng gạch «${bo}» mà phép so vẫn im`);
  }
  // Chiều đỏ (iv-c): một câu CHÚ THÍCH nhắc tên file KHÔNG được tính là «có ca» — tiêm
  // file vào paths + nguồn ca chỉ nhắc nó trong comment, chạy lại CHÍNH phép so → phải
  // nêu «lạ»; đối chứng dương: cùng file nhắc trong CHUỖI được chạy → hết «lạ».
  {
    // Tên ghép để KHÔNG nằm nguyên trong literal nào của chính file ca này — nếu viết
    // thẳng, chính dòng khai fixture đã là một «chuỗi được chạy» và chiều đỏ tự xanh.
    const F = 'commands/gia-lap-' + 'mien-tru.md';
    const ten = F.split('/').pop();
    const khai2 = new Set([...khaiPaths, F]);
    const raw2 = testSrc + `\n// ca giả: ${ten} coi như đã có ca\n`;
    if (raw2 === testSrc || !raw2.includes(ten)) errs.push('chiều đỏ (iv-c): lệnh tiêm không đổi được văn bản');
    const r3 = soSanh([...filesThat, F], GACH, f => coCaIn(f, khai2, stripChuThich(raw2)));
    if (!r3.la.includes(F)) errs.push('chiều đỏ (iv-c): tên file chỉ nằm trong CHÚ THÍCH mà răng vẫn coi là «có ca»');
    const raw3 = testSrc + `\nconst giaLapMienTru = readRepo('${F}');\n`;
    const r4 = soSanh([...filesThat, F], GACH, f => coCaIn(f, khai2, stripChuThich(raw3)));
    if (r4.la.includes(F)) errs.push('chiều đỏ (iv-c) đối chứng dương: nhắc trong CHUỖI được chạy mà vẫn bị nêu «lạ»');
  }
  // Chiều đỏ (ii): TIÊM vào khối KHAC-BIET-DOC-CU (bản sao contract) rồi chạy lại phép so.
  if (jOld) {
    const mOld2 = keyOfAll(jOld), mNew2 = keyOfAll(jNew);
    const lech = KH => [...mOld2].filter(([slug, k]) => {
      const kh = KH.find(r => r[0] === slug);
      return kh ? (k !== kh[1] || mNew2.get(slug) !== kh[2]) : k !== mNew2.get(slug);
    }).map(([slug]) => slug);
    if (lech(KHAC).length) errs.push(`phép so khai-khác-biệt đỏ trên cây thật: ${lech(KHAC).join(',')}`);
    if (KHAC.length) {
      const thieu = lech(KHAC.slice(1));
      if (!thieu.includes(KHAC[0][0])) errs.push(`chiều đỏ (ii): xoá dòng khối «${KHAC[0][0]}» mà phép so vẫn im`);
    }
  }
  if (errs.length) fail('RT13', errs.join(' · '));
  else pass('RT13', `đọc-cũ: broken rỗng, khác biệt đúng khối; cờ ⇔ điều kiện (đúng mọi ngày chạy); ${filesThat.length} file chứa "signed-off" đều có ca thật hoặc khai gạch; hai chiều đỏ tiêm vào đầu vào của chính phép so`);
}

// ── RT14 — hồ sơ THẬT thoát Cổng Giá trị bằng lối có tên, có vết ────────────
if (want('RT14')) {
  const errs = [];
  const D = '_acceptance/duong-do-trong-dinh-nghia-xong';
  const { section: sec2 } = require(path.join(ROOT, 'lib', 'md-section.cjs'));
  const o = readRepo(`${D}/opportunity.md`);
  const lines = sec2(o, UAT_H);
  if (!lines.some(l => { const t = l.trim(); return t.startsWith(KHONG_DO) && (t.length === KHONG_DO.length || /\s/.test(t[KHONG_DO.length])); }))
    errs.push('ô ngưỡng chưa có dòng đúng tiền tố «không đo được»');
  // Quyết định ĐÃ KÝ không được sửa: so với chính bản tại mốc.
  const oOld = execFileSync('git', ['-C', ROOT, 'show', `cb38ea01:${D}/opportunity.md`], { encoding: 'utf8' });
  for (const k of ['decision', 'decided_by', 'decided_at', 'stage']) {
    const g = t => (t.match(new RegExp(`^${k}:.*$`, 'm')) || [''])[0].split('#')[0].trim();
    if (g(o) !== g(oOld)) errs.push(`${k} đã đổi: «${g(oOld)}» → «${g(o)}» — hồ sơ đã ký không sửa quyết định`);
  }
  // Vết: entry sổ quyết định cite đúng entry bỏ đường-đo cũ.
  const led = readRepo(`${D}/decisions.jsonl`).split('\n').filter(Boolean)
    .map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  if (!led.some(e => e.type === 'revisit' && /Không đo được/.test(JSON.stringify(e)) && /d-20260822T000500Z-4306/.test(JSON.stringify(e))))
    errs.push('sổ quyết định thiếu entry revisit cite d-20260822T000500Z-4306');
  // Bộ quét trên CÂY THẬT xếp đúng ô.
  const x = findSlug(scan(ROOT), 'duong-do-trong-dinh-nghia-xong');
  if (!x || x.stateKey !== 'da-giao-khong-do') errs.push(`bộ quét: ${JSON.stringify(x)}`);
  if (errs.length) fail('RT14', errs.join(' · '));
  else pass('RT14', 'hồ sơ treo thoát bằng lối «không đo được» có vết; decision/người ký/ngày giữ nguyên');
}

// ── RT16 — bản đồ và bộ quét ĐỒNG kết luận (quan hệ, không chép danh sách) ──
if (want('RT16')) {
  const errs = [];
  const B16 = require(path.join(ROOT, 'scripts', 'trang-thai-ho-so.cjs'));
  // Ô bản đồ của slug: đọc từ PRODUCT-MAP.md vừa vẽ — heading gần nhất phía trên dòng slug.
  const oBanDo = (md, slug) => {
    const lines = md.split('\n');
    let cur = null;
    for (const l of lines) {
      const h = l.match(/^##\s+(.+?)\s*$/); if (h) { cur = h[1]; continue; }
      if (new RegExp(`\\\`${slug}\\\``).test(l)) return cur;
    }
    return null;
  };
  // Bảng ô bản đồ (SECTIONS) rút từ CHÍNH product-map.mjs — không chép tay tên ô.
  const pmSrc = readRepo('scripts/product-map.mjs');
  const oCuaKhoa = key => {
    const bucket = B16.BUCKET_OF[key];
    const m = pmSrc.match(new RegExp(`\\\['${bucket}',\\s*'([^']+)'`));
    return m ? m[1] : null;
  };
  const veBanDo = (root, script = PMAP) => {
    const r = spawnSync(process.execPath, [script, '--root', root], { encoding: 'utf8' });
    if (r.status !== 0) return null;
    const p = path.join(root, 'PRODUCT-MAP.md');
    return existsSync(p) ? readFileSync(p, 'utf8') : null;
  };
  // Ma trận: {signed-off, machine-cleared} × 4 trạng thái ngưỡng — hai bên phải nói CÙNG ô.
  let oDem = 0;
  for (const st of ['signed-off', 'machine-cleared']) for (const ng of ['chot', 'khong-do-duoc', 'chua-chot', 'de-xuat']) {
    oDem++;
    withRepo(root => {
      const con = st === 'signed-off' ? { status: st, tier: 'T2', approvedBy: 'Fx' } : MC;
      mkWs(root, 'zz', { contract: con, evidence: { signoff: st === 'signed-off' ? 'Fx 2026-08-24' : '' }, opportunity: { nguong: ng } });
      const x = findSlug(scan(root), 'zz');
      const md = veBanDo(root);
      if (!x || !md) { errs.push(`${st}×${ng}: quét/bản đồ không chạy`); return; }
      const mong = oCuaKhoa(x.stateKey);
      const that = oBanDo(md, 'zz');
      if (!mong) errs.push(`${st}×${ng}: không rút được tên ô cho khoá ${x.stateKey}`);
      else if (that !== mong) errs.push(`${st}×${ng}: bộ quét ${x.stateKey} → ô «${mong}», bản đồ in «${that}»`);
    });
  }
  if (oDem !== 8) errs.push(`ma trận ${oDem} != 8 khai trước`);
  // Hồ sơ THẬT trong diff: bản đồ đã commit không được in nó dưới «chờ phiên nghiệm thu».
  {
    const md = readRepo('PRODUCT-MAP.md');
    const x = findSlug(scan(ROOT), 'duong-do-trong-dinh-nghia-xong');
    const mong = oCuaKhoa(x.stateKey), that = oBanDo(md, 'duong-do-trong-dinh-nghia-xong');
    if (that !== mong) errs.push(`hồ sơ thật: bộ quét ${x.stateKey} → «${mong}», bản đồ in «${that}»`);
  }
  // Chiều đỏ: bản sao product-map GỠ nhánh mới → phép so phải ĐỎ nêu slug và hai ô lệch.
  {
    const mut = tmp('rt16-mut-');
    for (const rel of ['lib/evidence-core.cjs', 'lib/workspace-record.cjs', 'lib/md-section.cjs', 'lib/gap-probe.cjs',
                       'lib/ac-line.cjs', 'lib/nguong-o-co-hoi.cjs', 'scripts/trang-thai-ho-so.cjs',
                       // bản đồ nay đọc khuôn LÚC CHẠY (fail-closed) — cây mutant thiếu khuôn thì
                       // chết vì hạ tầng chứ không vì vật, và chiều đỏ thành xanh-không-chạy
                       'skills/acceptance/references/opportunity-template.md'])
      W(mut, rel, readRepo(rel));
    const src = readRepo('scripts/product-map.mjs');
    const NEEDLE = "if (ngBD === 'khong-do-duoc') return { ...o('da-giao-khong-do'), note: chu('da-giao-khong-do').nhan };";
    if (!src.includes(NEEDLE)) errs.push('chiều đỏ: không thấy nhánh khong-do-duoc trong product-map để tiêm');
    else {
      W(mut, 'scripts/product-map.mjs', src.replace(NEEDLE, ''));
      withRepo(root => {
        mkWs(root, 'zz', { contract: { status: 'signed-off', tier: 'T2', approvedBy: 'Fx' }, evidence: { signoff: 'Fx 2026-08-24' }, opportunity: { nguong: 'khong-do-duoc' } });
        const x = findSlug(scan(root), 'zz');
        const md = veBanDo(root, path.join(mut, 'scripts', 'product-map.mjs'));
        if (!md) { errs.push('chiều đỏ: bản sao product-map không chạy được'); return; }
        if (oBanDo(md, 'zz') === oCuaKhoa(x.stateKey)) errs.push('chiều đỏ: gỡ nhánh mà bản đồ vẫn khớp bộ quét — phép so không bám vật');
      });
    }
    rmSync(mut, { recursive: true, force: true });
  }
  if (errs.length) fail('RT16', errs.join(' · '));
  else pass('RT16', 'bản đồ ⇔ bộ quét đồng ô trên 8 fixture + hồ sơ thật; gỡ nhánh khong-do-duoc → phép so đỏ');
}

// ── RT18 — CHỐNG-CHÉP: chuỗi luật ngưỡng chỉ sống trong lib, chỗ khác khai gạch ──
// Lớp lỗi tái diễn hai vòng (S4-r2, S4-r4): mỗi bộ đọc mới lại CHÉP luật thay vì gọi
// nguồn, rồi bản chép trôi (lệch một ngày, lệch placeholder). Ca này làm bản chép thứ
// hai KHÔNG LAND được nữa — của tôi lẫn của người sau.
if (want('RT18')) {
  const errs = [];
  const OWNER = 'lib/nguong-o-co-hoi.cjs';
  // Needle RÚT lúc chạy — chính file này không mang literal nào (tự kiểm bằng chính ca).
  const NEEDLES = [
    ['tiêu đề section', NG.UAT_THRESHOLD_HEADING],
    ['tiền tố đề xuất', DE_XUAT],
    ['tiền tố không-đo', KHONG_DO],
    ['hằng một-ngày', String(24 * 60 * 60 * 1000)],
    ['vị từ mặt người dùng', NG.SURFACE_NGUOI_DUNG.source],
  ];
  const contractRT18 = readRepo('_acceptance/ra-co-ten-lam-va-trao/contract.md');
  const mG = contractRT18.match(/<<<LUAT-NGUONG-KHAI-GACH\n([\s\S]*?)LUAT-NGUONG-KHAI-GACH>>>/);
  const GACH18 = mG ? mG[1].trim().split('\n').map(l => l.trim().split(/\s+/)) : null;
  if (!GACH18) errs.push('contract thiếu khối LUAT-NGUONG-KHAI-GACH');
  if (GACH18 && GACH18.some(r => r.length < 2)) errs.push('dòng khai gạch thiếu lý do — dòng thiếu là lỗi kêu to');
  // PHÉP QUÉT THẬT: đệ quy fs trên root cho trước — tham số hoá để chiều đỏ tiêm được.
  const scanRoot = root => {
    const hits = [];
    const walk = dir => {
      if (!existsSync(dir)) return;
      for (const e of require('node:fs').readdirSync(dir, { withFileTypes: true })) {
        const p2 = path.join(dir, e.name);
        if (e.isDirectory()) { walk(p2); continue; }
        if (!/\.(js|cjs|mjs)$/.test(e.name)) continue;
        const rel = path.relative(root, p2).split(path.sep).join('/');
        if (rel === OWNER) continue;
        const txt = readFileSync(p2, 'utf8');
        for (const [ten, nd] of NEEDLES) if (txt.includes(nd)) hits.push([rel, ten]);
      }
    };
    for (const d of ['scripts', 'lib', 'hooks', 'tests']) walk(path.join(root, d));
    return hits;
  };
  // Gạch tính theo CẶP (file, chuỗi), không theo file: dòng khai gạch mà LÝ DO gọi đúng tên
  // một needle thì chỉ miễn needle ĐÓ — miễn cả file là mở lại đúng cửa vừa đóng, vì bộ đọc
  // đã chép luật một lần (start-scan ở S4-r2) lại được gạch trắng cho cả năm chuỗi (S4-r7 [4]).
  // Lý do KHÔNG gọi tên needle nào → giữ nghĩa cũ: miễn cả file.
  const tenNeedle = ten => ten.replace(/\s+/g, '-');
  const gachTrung = (gach, rel, ten) => gach.some(r => {
    if (r[0] !== rel) return false;
    const lyDo = r.slice(1).join(' ');
    const goiTen = NEEDLES.filter(([n]) => lyDo.includes(tenNeedle(n))).map(([n]) => n);
    return goiTen.length === 0 || goiTen.includes(ten);
  });
  const soSanh18 = (hits, gach) => hits.filter(([rel, ten]) => !gachTrung(gach, rel, ten)).map(([rel, ten]) => `${rel} (${ten})`);
  if (GACH18) {
    const hits = scanRoot(ROOT);
    if (!hits.length) errs.push('phép quét không thấy hit nào kể cả file đã khai gạch — nghi bước quét hỏng, không tin kết luận');
    for (const la of soSanh18(hits, GACH18)) errs.push(`bản CHÉP luật ngưỡng ngoài lib: ${la} — gọi lib/nguong-o-co-hoi.cjs, hoặc khai gạch có lý do`);
    for (const [f] of GACH18) if (!hits.some(([rel]) => rel === f)) errs.push(`khai gạch ${f} nhưng file không còn mang chuỗi luật (dòng chết)`);
    // Chiều đỏ (a): TIÊM vào bản sao cây rồi chạy lại CHÍNH phép quét trên đó.
    const g = tmp('rt18-');
    try {
      const { cpSync } = require('node:fs');
      for (const d of ['scripts', 'lib', 'hooks']) cpSync(path.join(ROOT, d), path.join(g, d), { recursive: true });
      mkdirSync(path.join(g, 'tests'), { recursive: true });
      W(g, 'scripts/gia-lap-chep-luat.mjs', `// bản chép mới\nconst H = '${NG.UAT_THRESHOLD_HEADING}';\n`);
      const la2 = soSanh18(scanRoot(g), GACH18);
      if (!la2.some(x => x.startsWith('scripts/gia-lap-chep-luat.mjs'))) errs.push('chiều đỏ (a): tiêm bản chép vào cây mà phép quét không nêu tên');
    } finally { rmSync(g, { recursive: true, force: true }); }
    // Chiều đỏ (b): gỡ một dòng gạch → file đó phải thành lạ.
    const bo = GACH18[0];
    if (bo && !soSanh18(hits, GACH18.slice(1)).some(x => x.startsWith(bo[0]))) errs.push(`chiều đỏ (b): gỡ dòng gạch «${bo[0]}» mà phép so vẫn im`);
    // Chiều đỏ (c) — ca PHÂN BIỆT hai luật gạch. Không có nó thì nhánh «gạch theo CẶP» là
    // assertion âm-tính-một-mình: hoàn nguyên gachTrung về «miễn cả file» vẫn xanh y hệt,
    // vì trên cây thật file được gạch chỉ mang ĐÚNG một needle (S4-r8 [5]).
    // Cách phân biệt: tiêm needle KHÁC vào chính file ĐÃ khai gạch cho một needle có tên.
    {
      const coTen = GACH18.find(r => NEEDLES.some(([n]) => r.slice(1).join(' ').includes(tenNeedle(n))));
      if (!coTen) errs.push('chiều đỏ (c): không có dòng gạch nào gọi tên needle — nhánh gạch-theo-cặp không được đo');
      else {
        const daGach = NEEDLES.filter(([n]) => coTen.slice(1).join(' ').includes(tenNeedle(n))).map(([n]) => n);
        const khac = NEEDLES.find(([n]) => !daGach.includes(n));
        const g2 = tmp('rt18c-');
        try {
          for (const d of ['scripts', 'lib', 'hooks']) cpSync(path.join(ROOT, d), path.join(g2, d), { recursive: true });
          mkdirSync(path.join(g2, 'tests'), { recursive: true });
          const dich = path.join(g2, coTen[0]);
          const truoc = readFileSync(dich, 'utf8');
          writeFileSync(dich, truoc + `\nconst CHEP_KHAC = ${JSON.stringify(khac[1])};\n`);
          if (readFileSync(dich, 'utf8') === truoc) errs.push('chiều đỏ (c): lệnh tiêm không đổi được file');
          const la3 = soSanh18(scanRoot(g2), GACH18);
          const mong = `${coTen[0]} (${khac[0]})`;
          if (!la3.includes(mong)) errs.push(`chiều đỏ (c): tiêm «${khac[0]}» vào ${coTen[0]} (file đã gạch cho «${daGach.join(',')}») mà phép so KHÔNG nêu cặp đó — gạch vẫn là gạch trắng cả file`);
          // và phải KHÔNG nêu cặp đã được gạch đích danh (không đỏ oan)
          if (la3.some(x => daGach.some(n => x === `${coTen[0]} (${n})`))) errs.push(`chiều đỏ (c): nêu oan cặp đã khai gạch đích danh trên ${coTen[0]}`);
        } finally { rmSync(g2, { recursive: true, force: true }); }
      }
    }
  }
  if (errs.length) fail('RT18', errs.join(' · '));
  // GIỚI HẠN ĐÃ KHAI của ca này: needle so khớp LITERAL. Bản chép viết khác chính tả
  // (`24 * 60 * 60 * 1000`, `86_400_000`) hoặc diễn lại luật bằng biểu thức không có hằng
  // (`d <= now`) thì KHÔNG bị bắt — grep cả file không phủ được lớp đó. Đường đóng lớp:
  // _acceptance/phep-kiem-sach-do-theo-vung/ (S4-r7 [5]).
  else pass('RT18', `chống-chép: ${NEEDLES.length} chuỗi luật LITERAL chỉ sống trong lib (gạch tính theo cặp file×chuỗi); ${GACH18 ? GACH18.length : 0} dòng khai gạch có lý do; tiêm bản chép → nêu tên`);
}

const la = only.filter(id => !ALL_IDS.includes(id));
if (la.length) { console.log(`FAIL: id lạ ${la.join(',')} — sửa ALL_IDS hoặc gõ đúng tên`); failures++; }
process.exit(failures ? 1 : 0);
