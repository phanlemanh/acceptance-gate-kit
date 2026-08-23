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
const ALL_IDS = ['RT1', 'RT2', 'RT3', 'RT15'];
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
  let fm = body.slice(0, body.indexOf('\n---\n', 4) + 5);
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

const la = only.filter(id => !ALL_IDS.includes(id));
if (la.length) { console.log(`FAIL: id lạ ${la.join(',')} — sửa ALL_IDS hoặc gõ đúng tên`); failures++; }
process.exit(failures ? 1 : 0);
