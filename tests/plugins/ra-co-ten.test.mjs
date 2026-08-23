// tests/plugins/ra-co-ten.test.mjs — ca hồ sơ ra-co-ten-lam-va-trao (RT1–RT15).
// Fixture CODE-SINH từ khuôn trong chính lần chạy; chạy THẬT start-scan / gate-card /
// product-map / pre-merge / hook; đường dẫn suy từ vị trí file; mỗi ca có đối chứng dương
// + chiều đỏ ghim thông điệp (MEASURE-BIRTH-CLAUSE).
//   RT_CASES=RT1,RT2 node tests/plugins/ra-co-ten.test.mjs
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, copyFileSync, existsSync } from 'node:fs';
import { spawnSync, execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const require = createRequire(import.meta.url);
const { blockFromTemplate, fileFromTemplate } = await import(path.join(ROOT, 'tests', 'fixtures', 'from-template.mjs'));
const REF = p => path.join(ROOT, 'skills', 'acceptance', 'references', p);
const CONTRACT_TPL = REF('contract-template.md');
const OPP_TPL = REF('opportunity-template.md');
const EVID_TPL = REF('evidence-report-template.md');
const SCAN = path.join(ROOT, 'scripts', 'start-scan.mjs');
const CARD = path.join(ROOT, 'scripts', 'gate-card.js');
const PMAP = path.join(ROOT, 'scripts', 'product-map.mjs');
const PREMERGE = path.join(ROOT, 'scripts', 'pre-merge-check.sh');
const HOOK = path.join(ROOT, 'hooks', 'acceptance-evidence-gate.js');
const UAT_H = 'Ngưỡng chết / ngưỡng UAT';

let failures = 0;
// MỘT nguồn danh sách ca: file này. Chỉ liệt ca ĐÃ CÓ THÂN — khai id chưa dựng thì suite đỏ.
const ALL_IDS = ['RT1', 'RT2', 'RT3', 'RT4', 'RT5', 'RT6', 'RT7', 'RT8', 'RT9', 'RT10', 'RT11', 'RT12', 'RT13', 'RT14', 'RT15'];
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

// Báo cáo SINH TỪ KHUÔN bên viết (khối xanh-sạch + hai heading của khuôn) — không gõ tay
// theo khuôn bên đọc (lớp «fixture đúng khuôn bên ĐỌC», gap-probe P1).
// sach: 'sach' | 'uncertain' | 'kl-co' | 'bypass' | 'enf-off'
function evidenceText(slug, { verdict = 'PASS', signoff = '', sach = 'sach', verifiedCommit = '0'.repeat(40) } = {}) {
  const tpl = readFileSync(EVID_TPL, 'utf8');
  const body = tpl.slice(tpl.indexOf('---8<---') + '---8<---'.length);
  // Hồ sơ THẬT phải bắt đầu ngay ở dòng `---`: dư một dòng trống là hàng rào lệch và mọi
  // bên đọc gọi là hồ sơ hỏng (đúng ca P115 của khuôn). Cắt xong phải trim đầu.
  let fm = body.slice(0, body.indexOf('\n---\n', 4) + 5).replace(/^\s*/, '');
  fm = fm.replace(/\{\{slug\}\}/g, slug)
    .replace(/^verdict: .*$/m, `verdict: ${verdict}`)
    .replace(/^enforcement_mode: .*$/m, `enforcement_mode: ${sach === 'enf-off' ? 'off' : 'strict'}`)
    .replace(/^bypass_used: .*$/m, `bypass_used: ${sach === 'bypass' ? 'true' : 'false'}`)
    .replace(/^verified_commit: .*$/m, `verified_commit: ${verifiedCommit}`)
    .replace(/^human_signoff:.*$/m, `human_signoff:${signoff ? ' ' + signoff : ''}`);
  let t = fm + `\n# Evidence Report: ${slug}\n\n| Eval | Criterion | Executor | Verdict |\n|---|---|---|---|\n| E1 | AC-1 | test | PASS |\n\n` +
    `## Evidence\n- eval: E1\n  run_id: ${slug}-E1-001\n  exit_code: 0\n  verifier: verify.sh\n  verified_at: 2026-08-23T00:00:00Z\n`;
  if (sach === 'uncertain') t += `- eval: E2\n  run_id: ${slug}-E2-001\n  exit_code: 0\n  verifier: verify.sh\n  verdict: UNCERTAIN\n`;
  // Hai mục cuối: tên rút từ CHÍNH khối xanh-sạch của khuôn (mã `sections`), không gõ tay.
  t += '\n## Known limits\n\n' + (sach === 'kl-co' ? '- còn một lỗ\n' : '') + '\n## Ngoài hợp đồng\n\n';
  return t;
}
const runLogText = slug => JSON.stringify({ ts: '2026-08-23T00:00:00Z', kind: 'eval', run_id: `${slug}-E1-001`, exit_code: 0 }) + '\n';

// nguong: 'chua-chot' | 'de-xuat' | 'chot' | 'khong-do-duoc' | 'khong-do-duoc-hai-cham'
function opportunityText(slug, { stage = 'decided', decision = 'build', nguong = 'chot', timebox = null, nguonNgoai = 'du' } = {}) {
  const fm = fileFromTemplate(OPP_TPL, 'OPP-FRONTMATTER-TEMPLATE',
    { slug, feature: `${slug} — fixture`, owner: 'fx@example.com', stage, decision,
      decided_by: decision ? 'Fx' : '', decided_at: decision ? '2026-08-20T00:00:00Z' : '', base_commit: '', disposition: '' }, '');
  const bullets = v => `- Câu hỏi phép đo trả lời: ${v}\n- Kết quả nào là SỐNG: ${v}\n- Kết quả nào là CHẾT: ${v}\n- Timebox: ${timebox ?? v}\n`;
  const ng = nguong === 'chua-chot' ? bullets('…')
    : nguong === 'de-xuat' ? bullets(`${DE_XUAT} ngưỡng máy đề xuất`)
    : nguong === 'chot' ? bullets('ngưỡng thật')
    : nguong === 'khong-do-duoc' ? `${KHONG_DO} vòng nội bộ, không có người dùng cuối\n`
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
  const orderSh = ['= "PASS"', 'bypass_used', 'risk_tier', 'UNCERTAIN', '"Known limits" "Ngoài hợp đồng"'].map(n => fn.indexOf(n));
  if (orderSh.some(i => i < 0) || orderSh.some((v, i) => i > 0 && v < orderSh[i - 1])) errs.push(`thứ tự xanh_sach_check (bash) lệch khối: ${orderSh}`);
  // Chiều đỏ: bản sao khuôn gỡ mục «sections» → reader của chính ca này phải nêu tên mục thiếu.
  const t2 = tmp('rt1-'); const fake = path.join(t2, 'evidence-report-template.md');
  writeFileSync(fake, readFileSync(EVID_TPL, 'utf8').replace(/^sections .*\n/m, ''));
  const xs2 = blockFromTemplate(fake, 'EVIDENCE-XANH-SACH-BLOCK').trim().split('\n').map(l => l.trim().split(/\s+/)[0]);
  const missing = EXPECT_XS.filter(k => !xs2.includes(k));
  if (JSON.stringify(missing) !== JSON.stringify(['sections'])) errs.push(`chiều đỏ khuôn: mong thiếu [sections], thấy ${JSON.stringify(missing)}`);
  rmSync(t2, { recursive: true, force: true });
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
  });
  const lifecycle = readFileSync(HOOK, 'utf8');
  if (!/machine-cleared/.test(lifecycle)) errs.push('dòng lifecycle của hook chưa liệt machine-cleared');
  if (errs.length) fail('RT3', errs.join(' · '));
  else pass('RT3', 'hook: làn V qua; T3/không-vết/draft-nhảy-thẳng chặn ghim câu; lifecycle liệt machine-cleared');
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
  if (errs.length) fail('RT15', errs.join(' · '));
  else pass('RT15', 'machine-cleared × chữ ký: hook chặn hai chiều, lưới chặn, da-veto cùng thông điệp, đối chứng dương qua');
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
  if (errs.length) fail('RT5', errs.join(' · '));
  else pass('RT5', '4 khoá mới có nhãn riêng + bucket đúng; bản đồ và thẻ in chữ từ bảng; thẻ không mời ký hồ sơ máy-thông');
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
  if (errs.length) fail('RT9', errs.join(' · '));
  else pass('RT9', 'ma trận 8 ô ngưỡng × trạng thái; de-xuat là đã điền ở Cổng Đáng; seam hai chấm không nhận');
}

// ── RT12 — archived có ô kết; timebox quá hạn có cờ ─────────────────────────
if (want('RT12')) {
  const errs = [];
  withRepo(root => {
    const KY = { status: 'signed-off', tier: 'T2', approvedBy: 'Fx' };
    mkWs(root, 'ar', { opportunity: { stage: 'archived', decision: 'kill' } });
    for (const [slug, tb] of [['tb1', 'muộn nhất 2000-01-01 → park'], ['tb2', 'muộn nhất 01/01/2000'], ['tb3', 'muộn nhất 2999-12-31'], ['tb4', 'cuối quý']])
      mkWs(root, slug, { contract: KY, evidence: { signoff: 'Fx 2026-08-23' }, opportunity: { nguong: 'chot', timebox: tb } });
    const j = scan(root);
    if (findSlug(j, 'ar')?.stateKey !== 'da-dong-ho-so') errs.push(`archived: ${JSON.stringify(findSlug(j, 'ar'))}`);
    for (const [s, exp] of [['tb1', true], ['tb2', true], ['tb3', false], ['tb4', false]]) {
      const x = findSlug(j, s);
      if (!x || x.grp !== 'gates' || ((x.flags || []).includes('qua-timebox') !== exp)) errs.push(`${s}: mong cờ=${exp}, ${JSON.stringify(x)}`);
    }
  });
  if (errs.length) fail('RT12', errs.join(' · '));
  else pass('RT12', 'archived → đã đóng có hồ sơ; timebox quá hạn hai dạng ngày → cờ; chưa qua/không parse → không cờ');
}

const card = (root, slug, extra = []) => spawnSync(process.execPath, [CARD, '--root', root, '--slug', slug, ...extra], { encoding: 'utf8' });

// ── RT7 — thẻ Cổng Đáng: cổng thứ ba có mặt người ───────────────────────────
if (want('RT7')) {
  const errs = [];
  for (const ng of ['chua-chot', 'de-xuat', 'chot', 'khong-do-duoc']) withRepo(root => {
    mkWs(root, 'o', { opportunity: { stage: 'discovery', decision: '', nguong: ng } });
    const er = card(root, 'o', ['--extract']);
    if (er.status !== 0) { errs.push(`${ng}: extract exit ${er.status}: ${(er.stderr || '').slice(0, 160)}`); return; }
    const ex = JSON.parse(er.stdout); const html = card(root, 'o').stdout || '';
    if (String(ex.gate) !== '0' || ex.cong_dang?.applicable !== true) errs.push(`${ng}: gate=${ex.gate} applicable=${ex.cong_dang?.applicable}`);
    if (ex.cong_dang?.nguong !== ng) errs.push(`${ng}: nguong=${ex.cong_dang?.nguong}`);
    if (JSON.stringify(ex.cong_dang?.loi_ra) !== JSON.stringify(['làm', 'lặp', 'xếp lại', 'dừng'])) errs.push(`${ng}: loi_ra=${JSON.stringify(ex.cong_dang?.loi_ra)}`);
    if (!/Vấn đề/.test(html) || !/Ngưỡng/.test(html)) errs.push(`${ng}: HTML thiếu khối đề bài/ngưỡng`);
    const red = (html.match(/class="flag fred"/g) || []).length;
    if (ng === 'chua-chot' && !(red >= 1 && /thước trang trí/.test(html))) errs.push(`chua-chot: thiếu cờ đỏ thước trang trí (red=${red})`);
    if (ng === 'chot' && red !== 0) errs.push(`chot: có ${red} cờ đỏ (should-NOT-fire)`);
    if (ng === 'de-xuat' && !/máy đề xuất/.test(html)) errs.push('de-xuat: thiếu chip máy đề xuất');
    if (ng === 'khong-do-duoc' && !/khai không đo được/.test(html)) errs.push('khong-do-duoc: thiếu chip khai không đo được');
    // Máy KHÔNG được điền sẵn quyết định của người (ADR 0002).
    if (/decision:\s*(build|iterate|park|kill)/.test(html)) errs.push(`${ng}: thẻ điền sẵn quyết định`);
  });
  // Nguồn ngoài chưa phân loại → đếm + cờ đỏ; đủ phân loại → không cờ (đối chứng)
  withRepo(root => {
    mkWs(root, 'o', { opportunity: { stage: 'discovery', decision: '', nguong: 'chot', nguonNgoai: 'thieu' } });
    const ex = JSON.parse(card(root, 'o', ['--extract']).stdout);
    if (!(ex.cong_dang.nguon_ngoai_chua_phan_loai >= 1)) errs.push(`nguồn ngoài chưa phân loại đếm ${ex.cong_dang.nguon_ngoai_chua_phan_loai}`);
    if (!/class="flag fred"/.test(card(root, 'o').stdout || '')) errs.push('nguồn ngoài chưa phân loại không có cờ đỏ');
  });
  // Cô lập lớp: có hợp đồng rồi thì KHÔNG phải Cổng Đáng, và không cờ nào nhắc cổng đó
  withRepo(root => {
    mkWs(root, 'o', { contract: { status: 'draft' }, opportunity: { nguong: 'chot' } });
    const ex = JSON.parse(card(root, 'o', ['--extract']).stdout);
    if (String(ex.gate) !== '1') errs.push(`có hợp đồng mà gate=${ex.gate}`);
    if (ex.cong_dang) errs.push('thẻ Cổng 1 vẫn trả khối cong_dang');
    const flags = ((card(root, 'o').stdout || '').match(/class="flag[^>]*>[^<]*/g) || []).join('');
    if (/Cổng Đáng/.test(flags)) errs.push('cờ của thẻ Cổng 1 nhắc Cổng Đáng (rò luật)');
  });
  if (errs.length) fail('RT7', errs.join(' · '));
  else pass('RT7', 'thẻ Cổng Đáng: 4 trạng thái ngưỡng, 4 lối ra, cờ đỏ thước-trang-trí/nguồn-ngoài, không điền sẵn quyết định, cô lập lớp');
}

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
function checkMenhDe(rows) {
  const errs = [];
  for (const [ten, file, cutter, re, n] of rows) {
    const full = readRepo(file);
    const c = countIn(cutter(full), re);
    if (n == null ? c < 1 : c !== n) { errs.push(`${ten}: thấy ${c} lần, mong ${n ?? '≥1'}`); continue; }
    // Mutant: gỡ mệnh đề khỏi BẢN SAO → chính bộ đọc này phải đỏ (assert, không mô tả).
    const c2 = countIn(cutter(full.replace(gflag(re), '')), re);
    if (!(n == null ? c2 < 1 : c2 !== n)) errs.push(`${ten}: gỡ mệnh đề mà bộ đọc vẫn xanh`);
  }
  return errs;
}

// ── RT6 — năm văn bản nghi thức biết trạng thái mới ─────────────────────────
if (want('RT6')) {
  const FL = 'feature-loop/skills/feature-loop/SKILL.md';
  const errs = checkMenhDe([
    ['uat-§0 điều kiện vào', 'skills/uat-session/SKILL.md', t => cut(t, /^## 0\. Điều kiện vào/m, /^## 1\./m), /`status: signed-off` hoặc `machine-cleared`/, 1],
    ['uat-§0 ba ca ngưỡng', 'skills/uat-session/SKILL.md', t => cut(t, /^## 0\. Điều kiện vào/m, /^## 1\./m), /Không đo được — /, null],
    ['fl bảng có hàng mới', FL, t => cut(t, /^\| status hiện tại/m, /^\n## /m), /^\| `machine-cleared` \|.*S5/m, 1],
    ['fl hàng verified ghi trạng thái kết', FL, t => cut(t, /^\| `verified` \|/m, /\n/), /set `status: machine-cleared`/, 1],
    ['fl S4 nhánh PASS', FL, t => cut(t, /\(3\) set contract `status: verified`/, /→ Gate 2\./), /set thẳng `status: machine-cleared`/, 1],
    ['acceptance SKILL làn V', 'skills/acceptance/SKILL.md', t => cut(t, /^4b\. \*\*Cổng Bằng chứng xanh-sạch/m, /^5\./m), /`status: machine-cleared`/, 1],
    ['CONTEXT term', 'CONTEXT.md', t => cut(t, /^\*\*Máy đã thông\*\*/m, /^\*\*|^### /m), /_Avoid_: gọi hồ sơ máy-thông là «đã ký»/, 1],
    ['acceptance-status hai trạng thái', 'commands/acceptance-status.md', t => t, /`machine-cleared` là máy đã thông/, 1],
    ['acceptance-report tách hai số', 'commands/acceptance-report.md', t => t, /`machine-cleared` \(máy đã thông, không chữ ký\)/, 1],
  ]);
  // CONTEXT phải có TERM, không chỉ nhắc chuỗi
  if (!/\*\*Máy đã thông\*\* \(`machine-cleared`\)/.test(readRepo('CONTEXT.md'))) errs.push('CONTEXT.md chưa có term «Máy đã thông»');
  if (errs.length) fail('RT6', errs.join(' · '));
  else pass('RT6', 'năm văn bản nghi thức mang mệnh đề machine-cleared đúng phạm vi; gỡ từng mệnh đề → bộ đọc đỏ');
}

// ── RT8 — /approve chế độ Cổng Đáng + ngữ pháp + hết con trỏ chết ───────────
if (want('RT8')) {
  const AP = 'commands/approve.md';
  const scopeAp = t => cut(t, /^## Chế độ Cổng Đáng/m, /^Never:/m);
  const HFL = 'skills/acceptance/references/human-facing-language.md';
  const errs = checkMenhDe([
    ['approve điều kiện nhận', AP, scopeAp, /`contract\.md` VẮNG ∧ `opportunity\.md` có ∧ `decision` rỗng ∧\n`stage ≠ archived`/, 1],
    ['approve bảng map', AP, scopeAp, /làm→build · lặp→iterate · xếp lại→park · dừng→kill/, 1],
    ['approve răng ngưỡng', AP, scopeAp, /\*\*TỪ CHỐI\*\*, in đúng câu\n     cờ đỏ của thẻ/, 1],
    ['approve răng nguồn ngoài', AP, scopeAp, /\*\*TỪ CHỐI\*\* \(luật răng của khuôn/, 1],
    ['approve gỡ đề xuất', AP, scopeAp, /\*\*Gỡ tiền tố `\[đề xuất\]`\*\*/, 1],
    ['approve ghi trường', AP, scopeAp, /`stage: decided`, `decision`, `decided_by`, `decided_at`/, 1],
    ['approve entry gate0', AP, scopeAp, /"type":"gate0"/, 1],
    ['approve vẽ bản đồ', AP, scopeAp, /product-map\.mjs/, 1],
    ['approve bước kế', AP, scopeAp, /`\/feature-loop:feature-loop <slug>`/, 1],
    ['grammar có Cổng Đáng', HFL, t => cut(t, /<<<GATE-ONESHOT-GRAMMAR/, /GATE-ONESHOT-GRAMMAR>>>/), /chế độ Cổng Đáng\*\* \(hồ sơ chưa có hợp\n  đồng\)/, 1],
    ['start bàn giao cổng dang', 'commands/start.md', t => cut(t, /^4\. \*\*MỘT câu hỏi/m, /^5\./m), /riêng cổng `dang`\n     → thẻ Cổng Đáng rồi ký bằng `\/acceptance-gate:approve <slug> <lối>`/, 1],
  ]);
  // Round-trip slot g0: mọi nhãn g0 trong SLOTS phải xuất hiện trong thân lệnh, và ngược lại có ≥1 hàng
  const slots = cut(readRepo(HFL), /<<<GATE-ONESHOT-SLOTS/, /GATE-ONESHOT-SLOTS>>>/)
    .split('\n').filter(l => /^g0 /.test(l)).map(l => l.slice(3).trim());
  if (!slots.length) errs.push('SLOTS không có hàng g0');
  const ap = readRepo(AP);
  for (const s0 of slots) if (!ap.includes(s0)) errs.push(`nhãn g0 «${s0}» không có trong approve.md`);
  if (errs.length) fail('RT8', errs.join(' · '));
  else pass('RT8', `approve chế độ Cổng Đáng đủ 9 mệnh đề; ${slots.length} nhãn g0 round-trip với thân lệnh; start hết con trỏ chết`);
}

// ── RT10 — hai tiền tố: MỘT chỗ khai, năm nơi đọc lại ───────────────────────
if (want('RT10')) {
  const errs = [];
  const u = cut(readRepo('skills/uat-session/SKILL.md'), /^## 0\./m, /^## 1\./m);
  const ap = readRepo('commands/approve.md');
  const st = readRepo('commands/start.md');
  if (!u.includes(KHONG_DO)) errs.push('uat-session §0 không mang đúng tiền tố không-đo-được');
  if (!ap.includes(KHONG_DO)) errs.push('approve.md không mang đúng tiền tố không-đo-được');
  if (!ap.includes(DE_XUAT)) errs.push('approve.md không mang đúng tiền tố [đề xuất]');
  if (!st.includes(DE_XUAT)) errs.push('start.md không mang đúng tiền tố [đề xuất]');
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
  const injected = tplRaw.replace(/(<<<OPP-KHONG-DO-DUOC-PREFIX -->\n)Không đo được —/, '$1Khong do duoc —');
  if (injected === tplRaw) errs.push('lệnh tiêm KHÔNG đổi được dòng nào trong khối marker');
  writeFileSync(fake, injected);
  const k2 = blockFromTemplate(fake, 'OPP-KHONG-DO-DUOC-PREFIX').trim();
  if (k2 === KHONG_DO) errs.push('bản sao khuôn đổi chuỗi mà bộ rút không thấy khác');
  else if (u.includes(k2)) errs.push(`chiều đỏ: uat-session mang chuỗi CŨ «${k2}» lẫn chuỗi khuôn «${KHONG_DO}»`);
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
    const keyOf = j => {
      const m = new Map();
      for (const grp of ['gates', 'inProgress', 'considering', 'done']) for (const x of (j.groups[grp] || [])) m.set(x.slug, x.stateKey);
      for (const b of (j.broken || [])) m.set(b.slug, 'ho-so-hong');
      return m;
    };
    const mOld = keyOf(jOld), mNew = keyOf(jNew);
    for (const [slug, kOld] of mOld) {
      const kNew = mNew.get(slug);
      const kh = KHAC.find(r => r[0] === slug);
      if (kh) { if (kOld !== kh[1] || kNew !== kh[2]) errs.push(`${slug}: khối khai ${kh[1]}→${kh[2]}, thực ${kOld}→${kNew}`); }
      else if (kOld !== kNew) errs.push(`${slug}: lệch ${kOld}→${kNew} mà khối không khai`);
    }
    for (const slug of mNew.keys()) if (!mOld.has(slug)) errs.push(`${slug}: chỉ có ở bản mới`);
  }

  // (iii) CỜ đo bằng QUAN HỆ (đúng ở mọi ngày chạy), không bằng danh sách
  const { section: sec } = require(path.join(ROOT, 'lib', 'md-section.cjs'));
  const all = ['gates', 'inProgress', 'done'].flatMap(grp => (jNew.groups[grp] || []).map(x => ({ grp, ...x })));
  for (const x of all) {
    const op = path.join(ROOT, '_acceptance', x.slug, 'opportunity.md');
    const oTxt = existsSync(op) ? readFileSync(op, 'utf8') : null;
    const lines = oTxt ? sec(oTxt, UAT_H) : [];
    const tb = lines.find(l => /^-\s*Timebox:/.test(l.trim()));
    const d = tb && (tb.match(/\b(\d{4})-(\d{2})-(\d{2})\b/) || tb.match(/\b(\d{2})\/(\d{2})\/(\d{4})\b/));
    const date = d ? (d[0].includes('-') ? Date.UTC(+d[1], +d[2] - 1, +d[3]) : Date.UTC(+d[3], +d[2] - 1, +d[1])) : null;
    const expQua = date != null && date < Date.now();
    if (((x.flags || []).includes('qua-timebox')) !== expQua) errs.push(`${x.slug}: cờ qua-timebox ${expQua ? 'thiếu' : 'thừa'} (ngày ${d ? d[0] : 'không parse'})`);
    const kd = lines.some(l => { const t = l.trim(); return t.startsWith(KHONG_DO) && (t.length === KHONG_DO.length || /\s/.test(t[KHONG_DO.length])); });
    const bul = lines.map(l => l.trim().match(/^[-*]\s+([^:]+):(.*)$/)).filter(Boolean);
    const chot = !kd && bul.length > 0 && bul.every(m => m[2].trim() && !/^(…|\.\.\.)$/.test(m[2].trim())) && !bul.some(m => m[2].trim().startsWith(DE_XUAT));
    const expNg = x.grp === 'gates' && x.gate === 'gia-tri' && !chot;
    if (((x.flags || []).includes('nguong-chua-chot')) !== expNg) errs.push(`${x.slug}: cờ nguong-chua-chot ${expNg ? 'thiếu' : 'thừa'}`);
  }

  // (iv) QUÉT KHÔNG GIAN MỞ: bộ đọc thứ N rẽ nhánh trên `signed-off` mà không ai nhớ
  // Loại vùng KHÔNG phải bộ đọc: hồ sơ, tài liệu người-đọc (đã miễn T1). Danh sách loại
  // là ĐÓNG và khai ở đây — file mới chứa chuỗi vẫn bị nêu tên (fail-closed).
  const NGOAI = [/^_acceptance\//, /^docs\//, /^PRODUCT-MAP\.md$/, /^CHANGELOG\.md$/, /^README\.md$/, /^GUIDE\.md$/, /^QUICKSTART\.md$/];
  const files = execFileSync('git', ['-C', ROOT, 'grep', '-l', 'signed-off'], { encoding: 'utf8' })
    .trim().split('\n').filter(Boolean).filter(f => !NGOAI.some(re => re.test(f)));
  const evalsY = readRepo('_acceptance/ra-co-ten-lam-va-trao/evals.yaml');
  const paths = new Set((evalsY.match(/paths: \[([^\]]+)\]/g) || []).flatMap(l => l.replace(/^paths: \[/, '').replace(/\]$/, '').split(',').map(x => x.trim())));
  for (const f of files) if (!paths.has(f) && !GACH.includes(f)) errs.push(`file lạ chứa "signed-off": ${f} — thêm ca, hoặc khai gạch có lý do trong khối BO-DOC-KHAI-GACH`);
  for (const f of GACH) if (!files.includes(f)) errs.push(`khối gạch khai ${f} nhưng file không còn chứa "signed-off" (dòng chết)`);
  // chiều đỏ của (iv): tiêm một file lạ vào tập → phải bị nêu tên
  { const la = [...files, 'scripts/gia-lap-bo-doc-moi.mjs'].filter(f => !paths.has(f) && !GACH.includes(f));
    if (!la.includes('scripts/gia-lap-bo-doc-moi.mjs')) errs.push('chiều đỏ (iv): tiêm file lạ mà phép so không nêu'); }
  // chiều đỏ của (ii): xoá một dòng khối → slug đó thành «lệch mà không khai»
  if (KHAC.length && jOld) {
    const kh = KHAC[0];
    if (kh[1] === kh[2]) errs.push('chiều đỏ (ii): dòng khối khai cũ==mới, không phân biệt được gì');
  }
  if (errs.length) fail('RT13', errs.join(' · '));
  else pass('RT13', `đọc-cũ: broken rỗng, khác biệt đúng khối; cờ ⇔ điều kiện (đúng mọi ngày chạy); ${files.length} file chứa "signed-off" đều có ca hoặc khai gạch`);
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

const la = only.filter(id => !ALL_IDS.includes(id));
if (la.length) { console.log(`FAIL: id lạ ${la.join(',')} — sửa ALL_IDS hoặc gõ đúng tên`); failures++; }
process.exit(failures ? 1 : 0);
