// Ca của hồ sơ ngoai-n-tu-dinh-tuyen (NT1–NT10): máy tự định tuyến mục Ngoài-n mà chính máy đề
// xuất known-limits / wont-fix.
//
// Fixture do CODE sinh trong lượt: hợp đồng rút từ CONTRACT-FRONTMATTER-TEMPLATE, mục ngoài hợp
// đồng rút từ OOC-ITEM-TEMPLATE của feature-loop/workflows/acceptance-verify.js (bên viết thật của
// review-findings), báo cáo dựng từ EVIDENCE-SECTIONS-TEMPLATE + JUDGMENT-BLOCK-TEMPLATE. Dòng máy
// do bên ghi THẬT viết; bên đọc là chính khong-can-nguoi.mjs, pre-merge-check.sh, gate-card.js.
// Mỗi ca đỏ (`-do`) chạy CHÍNH lệnh đo trên bản sao bị tiêm, SAU khi bản lành xanh trên cùng
// fixture, và ghim thông điệp. Đường dẫn suy từ vị trí tệp này.
//
// Chạy một phần: NT_CASES=NT1,NT4 node tests/scripts/ngoai-n-tu-dinh-tuyen.test.mjs
// Bộ lọc có SÀN ĐẾM: tên không khớp ca nào → exit 1.
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, copyFileSync, existsSync, readdirSync, symlinkSync, cpSync } from 'node:fs';
import { spawnSync, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const require = createRequire(import.meta.url);
const { fileFromTemplate, blockFromTemplate } = await import(path.join(ROOT, 'tests', 'fixtures', 'from-template.mjs'));
const CONTRACT_TPL = path.join(ROOT, 'skills', 'acceptance', 'references', 'contract-template.md');
const EVID_TPL = path.join(ROOT, 'skills', 'acceptance', 'references', 'evidence-report-template.md');
const SCRIPT = path.join(ROOT, 'scripts', 'dinh-tuyen-may.cjs');
const KCN = path.join(ROOT, 'scripts', 'khong-can-nguoi.mjs');
const CARD = path.join(ROOT, 'scripts', 'gate-card.js');
const PREMERGE = path.join(ROOT, 'scripts', 'pre-merge-check.sh');
const SKILL = path.join(ROOT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md');
const GUIDE = path.join(ROOT, 'GUIDE.md');
const ooc = require(path.join(ROOT, 'lib', 'out-of-contract.cjs'));
const GLOSS = ooc.OOC_GLOSS_NGUOI;

let failures = 0, passes = 0, matched = 0;
const only = (process.env.NT_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => { const w = only.length === 0 || only.includes(id); if (w) matched++; return w; };
const pass = (id, name) => { passes++; console.log(`PASS: ${id} ${name}`); };
const fail = (id, msg) => { failures++; console.log(`FAIL: ${id} ${msg}`); };
const ca = (id, name, fn) => { try { const e = fn(); if (e) fail(`${id} ${name}`, e); else pass(id, name); } catch (err) { fail(`${id} ${name}`, `ném: ${String(err && err.stack || err).split('\n').slice(0, 3).join(' | ')}`); } };

// ─── Khuôn bên viết ──────────────────────────────────────────────────────────
const OOC_TPL = (() => {
  const wf = readFileSync(path.join(ROOT, 'feature-loop', 'workflows', 'acceptance-verify.js'), 'utf8');
  const m = wf.match(/<<<OOC-ITEM-TEMPLATE\\n([\s\S]*?)OOC-ITEM-TEMPLATE>>>/);
  if (!m) throw new Error('khong rut duoc OOC-ITEM-TEMPLATE');
  return m[1].replace(/\\n/g, '\n').replace(/\\`/g, '`');
})();
const mucOoc = ({ title, plain, file, proposal, severity = 'low', boDeXuat = false }) => {
  let t = OOC_TPL.replace(/\{(\w+)\}/g, (_, k) => ({ title, plain, file, severity, proposal }[k]));
  if (boDeXuat) t = t.split('\n').filter(l => !/^\s+Đề xuất:/.test(l)).join('\n');
  return t;
};
const HEAD_OOC = '## Ngoài hợp đồng — người quyết ở Gate 2\n\n';
const findingsText = items => HEAD_OOC + items.map(mucOoc).join('\n') + '\n';
const muc = (i, proposal, extra = {}) => ({ title: `loi so ${i}`, plain: `Người dùng thấy lỗi số ${i}.`, file: `src/a${i}.js`, proposal, ...extra });
const SECTIONS = blockFromTemplate(EVID_TPL, 'EVIDENCE-SECTIONS-TEMPLATE');
const JUDG = blockFromTemplate(EVID_TPL, 'JUDGMENT-BLOCK-TEMPLATE');
const XANH_SACH_MA = blockFromTemplate(EVID_TPL, 'EVIDENCE-XANH-SACH-BLOCK').split('\n').map(l => l.trim().split(/\s+/)[0]).filter(Boolean);

function contractText(slug, { status = 'verified', tier = 'T2', notes = true } = {}) {
  const body = `# Contract: ${slug}\n\n## Criteria\n\n- AC-1: fixture\n\n## Out of scope\n\n- khong co\n`
    + (notes ? '\n## Notes\n\n- ghi chú có sẵn\n\n## Phụ lục\n\n- sau Notes\n' : '');
  return fileFromTemplate(CONTRACT_TPL, 'CONTRACT-FRONTMATTER-TEMPLATE',
    { feature: `${slug} — fixture`, slug, owner: 'fixture@example.com', risk_tier: tier, surfaces: 'cli', status }, body)
    .replace(/^approved_by:.*$/m, 'approved_by: fixture').replace(/^approved_at:.*$/m, 'approved_at: 2026-10-01');
}
function evidenceText(slug, { verdict = 'PASS', bypass = 'false', enf = 'strict', triage = false, uncertain = false, verifiedCommit = '0'.repeat(40) } = {}) {
  return `---\nschema_version: 1\nfeature_slug: ${slug}\nverdict: ${verdict}\nverified_commit: ${verifiedCommit}\n`
    + `enforcement_mode: ${enf}\nbypass_used: ${bypass}\n${triage ? 'triage_failed: true\n' : ''}human_signoff:\n---\n\n`
    + `# Evidence Report: ${slug}\n\n## Evidence\n- eval: E1\n  run_id: ${slug}-E1-001\n  exit_code: 0\n  verifier: verify.sh\n  verified_at: 2026-10-01\n`
    + (uncertain ? JUDG : '') + '\n' + SECTIONS;
}
const CONFIG = { vang: 'schema_version: 1\n', false: 'schema_version: 1\nfeature_loop:\n  ngoai_n_tu_dinh_tuyen: false\n',
  true: 'schema_version: 1\nfeature_loop:\n  ngoai_n_tu_dinh_tuyen: true\n', sai: 'schema_version: 1\nfeature_loop:\n  ngoai_n_tu_dinh_tuyen: yes\n' };
const gate2Nguoi = (q, extra = {}) => JSON.stringify({ id: 'd-20261001T000000Z-9', type: 'revisit', stage: 'gate2', at: '2026-10-01T00:00:00Z', decision: q, decided_by: 'fixture', ...extra });
const gate2May = (n, tieu_de) => JSON.stringify({ id: `d-20261001T000000Z-${n}`, type: 'revisit', stage: 'gate2', at: '2026-10-01T00:00:00Z', decision: `Ngoài-${n}: ${GLOSS['known-limits']}`, why: 'x', cost_if_wrong: 'x', may: 'dinh-tuyen-ngoai-n', tieu_de, dao: 'x' });
const LEDGER_SAN = [JSON.stringify({ id: 'd-20261001T000000Z-1', type: 'approach', stage: 'S1', at: '2026-10-01T00:00:00Z', decision: 'x', why: 'x', cost_if_wrong: 'x' }),
  JSON.stringify({ id: 'd-20261001T000000Z-2', type: 'seal', gate: 1, at: '2026-10-01T00:00:00Z' })].join('\n') + '\n';

const tmpRoots = [];
function hoSo(slug, o = {}) {
  const R = mkdtempSync(path.join(tmpdir(), 'nt-')); tmpRoots.push(R);
  const d = path.join(R, '_acceptance', slug); mkdirSync(d, { recursive: true });
  writeFileSync(path.join(R, '_acceptance', 'config.yaml'), CONFIG[o.khoa || 'true']);
  writeFileSync(path.join(d, 'contract.md'), contractText(slug, o.contract));
  if (o.evidence !== null) writeFileSync(path.join(d, 'evidence-report.md'), evidenceText(slug, o.evidence));
  if (o.findings !== null) writeFileSync(path.join(d, 'review-findings.md'), o.findings != null ? o.findings : findingsText([muc(1, 'known-limits'), muc(2, 'known-limits')]));
  writeFileSync(path.join(d, 'decisions.jsonl'), o.ledger != null ? o.ledger : LEDGER_SAN);
  writeFileSync(path.join(d, 'run-log.jsonl'), '{"kind":"verify","run_id":"x"}\n');
  return { R, d, slug };
}
const NAM_TEP = ['contract.md', 'decisions.jsonl', 'evidence-report.md', 'run-log.jsonl', 'review-findings.md'];
const bam = d => NAM_TEP.map(f => { const p = path.join(d, f); return existsSync(p) ? createHash('sha256').update(readFileSync(p)).digest('hex') : 'vang'; }).join(',');
const run = (script, h, mode = '--write') => { const r = spawnSync(process.execPath, [script, mode, '--root', h.R, '--slug', h.slug], { encoding: 'utf8' }); return { status: r.status, out: (r.stdout || '').trim(), err: (r.stderr || '').trim() }; };
const so = h => readFileSync(path.join(h.d, 'decisions.jsonl'), 'utf8').split('\n').filter(l => l.trim());
const dongMay = h => so(h).map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(e => e && e.may === 'dinh-tuyen-ngoai-n');
const goiTen = (h, n) => dongMay(h).filter(e => new RegExp(`^Ngoài-${n}:`).test(e.decision));

// Bản sao bị tiêm: chép NGUYÊN thư mục scripts/ (require theo realpath — symlink tệp sẽ trỏ về bản
// lành), symlink lib/ skills/ feature-loop/. Tiêm phải ĐỔI được nguồn, không thì ca nói rõ.
// Bản sao tiêm vào LIB (hàm gỡ nhãn sống ở lib/out-of-contract.cjs từ hồ sơ dinh-tuyen-theo-ma-muc):
// chép cả scripts/ lẫn lib/ — require theo realpath, symlink lib sẽ trỏ về bản lành.
function banSaoLib(tep, tu, thanh) {
  const T = mkdtempSync(path.join(tmpdir(), 'nt-mut-')); tmpRoots.push(T);
  for (const d of ['scripts', 'lib']) cpSync(path.join(ROOT, d), path.join(T, d), { recursive: true });
  for (const d of ['skills', 'feature-loop']) symlinkSync(path.join(ROOT, d), path.join(T, d));
  const p = path.join(T, 'lib', tep), goc = readFileSync(p, 'utf8');
  const moi = goc.split(tu).join(thanh);
  if (moi === goc) throw new Error(`đột biến không áp được vào lib/${tep}: không thấy «${tu.slice(0, 60)}»`);
  writeFileSync(p, moi);
  return path.join(T, 'scripts');
}
function banSao(tep, tu, thanh) {
  const T = mkdtempSync(path.join(tmpdir(), 'nt-mut-')); tmpRoots.push(T);
  mkdirSync(path.join(T, 'scripts'));
  for (const f of readdirSync(path.join(ROOT, 'scripts'))) copyFileSync(path.join(ROOT, 'scripts', f), path.join(T, 'scripts', f));
  for (const d of ['lib', 'skills', 'feature-loop']) symlinkSync(path.join(ROOT, d), path.join(T, d));
  const p = path.join(T, 'scripts', tep), goc = readFileSync(p, 'utf8');
  const moi = goc.split(tu).join(thanh);
  if (moi === goc) throw new Error(`đột biến không áp được vào ${tep}: không thấy «${tu.slice(0, 60)}»`);
  writeFileSync(p, moi);
  return path.join(T, 'scripts');
}

// Ca chiều đỏ (AC-14): bản lành chạy TRƯỚC trên cùng fixture; ca chỉ PASS khi đầu ra THẬT của lệnh đo
// trên bản đột biến chứa mọi chuỗi ghim, và in nguyên văn đoạn đã khớp. Không kết luận từ mã thoát một mình.
let doChay = 0, doGhim = 0;
const doan = (s, g) => { const i = s.indexOf(g); return i < 0 ? '' : s.slice(Math.max(0, i - 30), i + g.length + 60).replace(/\s+/g, ' '); };
function doCa(id, name, { lanh, dot, ghim }) {
  doChay++;
  ca(id, name, () => {
    const L = lanh(); if (!L.ok) return `bản lành không xanh trên fixture: ${String(L.out).slice(0, 200)}`;
    const D = String(dot()); const thieu = ghim.filter(g => !D.includes(g));
    if (thieu.length) return `đột biến không bị bắt — đầu ra không chứa ${thieu.map(g => `«${g}»`).join(', ')}: ${D.slice(0, 240)}`;
    doGhim++;
    console.log(`  · ${id} ${name}: lành «${String(L.out).replace(/\s+/g, ' ').slice(0, 100)}» · ghim «${ghim.map(g => doan(D, g)).join(' … ')}»`);
  });
}
const raNoi = r => `${r.out}\n${r.err}`;

// ─── NT1 — khoá kho ──────────────────────────────────────────────────────────
if (want('NT1')) {
  for (const k of ['vang', 'false']) ca('NT1', `khoa-${k}`, () => {
    const h = hoSo('nt1', { khoa: k }); const b = bam(h.d); const r = run(SCRIPT, h);
    if (r.status !== 0) return `thoát ${r.status} (${r.err})`;
    if (r.out.split('\n').length !== 1 || !r.out.includes('tắt')) return `stdout không phải một dòng chứa «tắt»: ${r.out}`;
    if (bam(h.d) !== b) return 'băm năm tệp đổi';
  });
  ca('NT1', 'khoa-sai', () => {
    const h = hoSo('nt1', { khoa: 'sai' }); const b = bam(h.d); const r = run(SCRIPT, h);
    if (r.status !== 2) return `thoát ${r.status}, mong 2`;
    if (!r.err.includes('feature_loop.ngoai_n_tu_dinh_tuyen') || !r.err.includes('true | false')) return `stderr không gọi tên khoá + hai giá trị: ${r.err}`;
    if (bam(h.d) !== b) return 'băm năm tệp đổi';
  });
  ca('NT1', 'khoa-true', () => {
    const h = hoSo('nt1'); const r = run(SCRIPT, h);
    if (r.status !== 0) return `thoát ${r.status} (${r.err})`;
    if (dongMay(h).length !== 2) return `sổ có ${dongMay(h).length} dòng máy, mong 2`;
  });
  doCa('NT1-do', 'vang-la-bat', {
    lanh: () => { const h = hoSo('nt1', { khoa: 'vang' }); const r = run(SCRIPT, h); return { ok: r.status === 0 && dongMay(h).length === 0 && r.out.includes('tắt'), out: r.out }; },
    dot: () => { const m = banSao('dinh-tuyen-may.cjs', 'if (v == null) return { bat: false };', 'if (v == null) return { bat: true };'); return raNoi(run(path.join(m, 'dinh-tuyen-may.cjs'), hoSo('nt1', { khoa: 'vang' }))); },
    ghim: ['dinh-tuyen-may: 2 mục'],
  });
}

// ─── NT2 — ba dòng máy đúng khuôn ─────────────────────────────────────────────
const BA_MUC = () => findingsText([muc(1, 'known-limits'), muc(2, 'wont-fix'), muc(3, 'known-limits — vì chú thích đuôi')]);
const frontmatter = t => (t.match(/^---\n[\s\S]*?\n---\n/) || [''])[0];
if (want('NT2')) {
  const dt = require(SCRIPT);
  const KHOA_KHUON = Object.keys(JSON.parse(dt.KHUON_DONG)).sort().join(',');
  const srcCo = /<<<DINH-TUYEN-MAY-LINE[\s\S]*KHUON_DONG[\s\S]*DINH-TUYEN-MAY-LINE>>>/.test(readFileSync(SCRIPT, 'utf8'));
  const h = hoSo('nt2', { findings: BA_MUC() });
  const tr = { c: frontmatter(readFileSync(path.join(h.d, 'contract.md'), 'utf8')), e: readFileSync(path.join(h.d, 'evidence-report.md'), 'utf8'), r: readFileSync(path.join(h.d, 'run-log.jsonl'), 'utf8'), f: readFileSync(path.join(h.d, 'review-findings.md'), 'utf8') };
  const r = run(SCRIPT, h);
  ca('NT2', 'ba-dong', () => {
    if (!srcCo) return 'khuôn KHUON_DONG không nằm giữa marker DINH-TUYEN-MAY-LINE';
    if (r.status !== 0) return `thoát ${r.status} (${r.err})`;
    const lines = so(h); const m = dongMay(h);
    if (lines.length !== 5 || m.length !== 3) return `sổ ${lines.length} dòng / ${m.length} dòng máy, mong 5 / 3`;
    console.log(`  · tập khoá khuôn: ${KHOA_KHUON}`);
    const mong = [`Ngoài-1: ${GLOSS['known-limits']}`, `Ngoài-2: ${GLOSS['wont-fix']}`, `Ngoài-3: ${GLOSS['known-limits']}`];
    for (let i = 0; i < 3; i++) {
      const e = m[i];
      if (Object.keys(e).sort().join(',') !== KHOA_KHUON) return `dòng ${i + 1} khoá ${Object.keys(e).sort().join(',')} ≠ khuôn`;
      if ('decided_by' in e) return 'dòng máy mang decided_by';
      if (e.decision !== mong[i]) return `decision dòng ${i + 1} = «${e.decision}», mong «${mong[i]}»`;
      const id = /^d-\d{8}T\d{6}Z-(\d+)$/.exec(e.id); if (!id || Number(id[1]) !== i + 3) return `id dòng ${i + 1} = ${e.id}, mong số thứ tự ${i + 3}`;
      if (e.tieu_de !== `loi so ${i + 1}`) return `tieu_de dòng ${i + 1} = ${e.tieu_de}`;
      if (e.dao !== `/acceptance-gate:signoff nt2 Ngoài-${i + 1}: mở hợp đồng mới; Ký`) return `dao dòng ${i + 1} = ${e.dao}`;
      if (e.stage !== 'gate2' || e.type !== 'revisit') return `stage/type dòng ${i + 1} sai`;
    }
  });
  ca('NT2', 'notes', () => {
    const c = readFileSync(path.join(h.d, 'contract.md'), 'utf8');
    const ln = c.split('\n'); const i = ln.findIndex(l => /^## Notes/.test(l)); const j = ln.findIndex((l, k) => k > i && /^## /.test(l));
    const vung = ln.slice(i + 1, j); const gach = vung.filter(l => /^- Ngoài-/.test(l));
    if (gach.length !== 2) return `mục Notes có ${gach.length} gạch máy, mong 2`;
    if (!gach[0].includes('Ngoài-1') || !gach[0].includes('Người dùng thấy lỗi số 1.')) return `gạch 1 sai: ${gach[0]}`;
    if (!gach[1].includes('Ngoài-3') || !gach[1].includes('Người dùng thấy lỗi số 3.')) return `gạch 2 sai: ${gach[1]}`;
    if (c.includes('- Ngoài-2')) return 'có gạch cho mục wont-fix';
    if (ln[j] !== '## Phụ lục') return 'gạch không nằm giữa ## Notes và heading kế';
  });
  ca('NT2', 'khong-cham', () => {
    if (frontmatter(readFileSync(path.join(h.d, 'contract.md'), 'utf8')) !== tr.c) return 'frontmatter hợp đồng đổi';
    if (readFileSync(path.join(h.d, 'evidence-report.md'), 'utf8') !== tr.e) return 'evidence-report.md đổi';
    if (readFileSync(path.join(h.d, 'run-log.jsonl'), 'utf8') !== tr.r) return 'run-log.jsonl đổi';
    if (readFileSync(path.join(h.d, 'review-findings.md'), 'utf8') !== tr.f) return 'review-findings.md đổi';
  });
  ca('NT2', 'stdout', () => {
    if (r.out.split('\n').length !== 1 || !r.out.startsWith('dinh-tuyen-may: 3 mục (known-limits 2 · wont-fix 1)')) return `stdout: ${r.out}`;
  });
  ca('NT2', 'notes-vang', () => {
    const h2 = hoSo('nt2b', { findings: BA_MUC(), contract: { notes: false } });
    if (run(SCRIPT, h2).status !== 0) return 'thoát khác 0';
    const c = readFileSync(path.join(h2.d, 'contract.md'), 'utf8'); const i = c.lastIndexOf('## Notes');
    if (i < 0) return 'không tạo mục Notes';
    if ((c.slice(i).match(/^- Ngoài-/gm) || []).length !== 2) return 'mục Notes mới không có đúng hai gạch';
  });
  ca('NT2', 'check', () => {
    const h3 = hoSo('nt2', { findings: BA_MUC() }); const b = bam(h3.d); const c = run(SCRIPT, h3, '--check');
    if (c.status !== 0 || c.out.split(' — đảo')[0] !== r.out.split(' — đảo')[0]) return `--check in khác: ${c.out}`;
    if (bam(h3.d) !== b) return '--check ghi đĩa';
  });
  doCa('NT2-do', 'decided-by', {
    lanh: () => { const h4 = hoSo('nt2', { findings: BA_MUC() }); run(SCRIPT, h4); const m = dongMay(h4); return { ok: m.length === 3 && m.every(e => Object.keys(e).sort().join(',') === KHOA_KHUON), out: Object.keys(m[0] || {}).sort().join(',') }; },
    dot: () => { const h4 = hoSo('nt2', { findings: BA_MUC() }); const m = banSao('dinh-tuyen-may.cjs', 'may: DAU_MAY, tieu_de', "decided_by: 'may', may: DAU_MAY, tieu_de"); run(path.join(m, 'dinh-tuyen-may.cjs'), h4); return readFileSync(path.join(h4.d, 'decisions.jsonl'), 'utf8'); },
    ghim: ['"decided_by":"may"'],
  });
}

// ─── NT3 — mục không được ghi + chạy lại + nhãn theo số ──────────────────────
const MA_TRAN_NT3 = [
  ['new-contract', { items: [muc(1, 'new-contract')] }],
  ['chu-nguoi-o-cho-token', { items: [muc(1, 'ghi Known limits')] }],
  ['thieu-de-xuat', { items: [muc(1, 'known-limits', { boDeXuat: true })] }],
  ['da-co-dong-nguoi', { items: [muc(1, 'known-limits')], ledger: [gate2Nguoi('Ngoài-1: ghi Known limits')] }],
  ['da-co-khoang-nguoi', { items: [muc(1, 'known-limits'), muc(2, 'wont-fix')], ledger: [gate2Nguoi('Ngoài-1 đến Ngoài-2: ghi Known limits')] }],
  ['da-co-dong-may-khop', { items: [muc(1, 'wont-fix')], ledger: [gate2May(1, 'loi so 1')] }],
];
const hoSoNT3 = (row, slug = 'nt3') => {
  const items = [...row.items, muc(9, 'known-limits')];
  return { h: hoSo(slug, { findings: findingsText(items), ledger: LEDGER_SAN + (row.ledger || []).map(l => l + '\n').join('') }), nDc: items.length, nHang: row.items.length };
};
function chamNT3(script) {
  const loi = [], log = [];
  for (const [ten, row] of MA_TRAN_NT3) {
    const { h, nDc, nHang } = hoSoNT3(row);
    const truoc = Array.from({ length: nHang }, (_, k) => goiTen(h, k + 1).length);
    const r = run(script, h);
    const sau = Array.from({ length: nHang }, (_, k) => goiTen(h, k + 1).length);
    const moi = dongMay(h).length - (row.ledger || []).filter(l => l.includes('dinh-tuyen-ngoai-n')).length;
    const ok = r.status === 0 && moi === 1 && goiTen(h, nDc).length === 1 && sau.every((v, k) => v === truoc[k])
      && r.out.startsWith('dinh-tuyen-may: 1 mục (known-limits 1 · wont-fix 0)');
    log.push(`${ten}: thoát ${r.status}, dòng máy mới ${moi}, đối chứng ${goiTen(h, nDc).length}, mục hàng ${truoc.join('/')}→${sau.join('/')}`);
    if (!ok) loi.push(ten);
  }
  return { loi, log };
}
const MUOI_MOT = () => {
  const items = Array.from({ length: 11 }, (_, i) => muc(i + 1, 'known-limits'));
  return hoSo('nt3m', { findings: findingsText(items), ledger: LEDGER_SAN + [gate2May(1, 'loi so 1'), gate2Nguoi('Ngoài-2 đến Ngoài-10: ghi Known limits'), gate2May(11, 'loi so 11')].map(l => l + '\n').join('') });
};
if (want('NT3')) {
  ca('NT3', 'ma-tran', () => {
    const { loi, log } = chamNT3(SCRIPT);
    for (const l of log) console.log(`  · ${l}`);
    console.log(`  · số hàng chạy: ${MA_TRAN_NT3.length}`);
    if (MA_TRAN_NT3.length !== 6) return `ma trận ${MA_TRAN_NT3.length} hàng, khai 6`;
    if (loi.length) return `hàng sai: ${loi.join(', ')}`;
  });
  ca('NT3', 'chay-lai', () => {
    const h = hoSo('nt3r', { findings: BA_MUC() });
    if (run(SCRIPT, h).status !== 0) return 'lần một thoát khác 0';
    const b = bam(h.d); const r = run(SCRIPT, h);
    if (bam(h.d) !== b) return 'lần hai ghi đĩa';
    if (r.out !== 'dinh-tuyen-may: 0 mục') return `stdout lần hai: ${r.out}`;
  });
  ca('NT3', 'khong-co-tep', () => {
    const h = hoSo('nt3k', { findings: null }); const b = bam(h.d); const r = run(SCRIPT, h);
    if (r.status !== 0 || r.out !== 'dinh-tuyen-may: 0 mục' || bam(h.d) !== b) return `thoát ${r.status}, stdout ${r.out}`;
  });
  ca('NT3', 'muoi-mot-muc', () => {
    const h = MUOI_MOT(); const r = run(SCRIPT, h);
    if (r.status !== 0 || r.out !== 'dinh-tuyen-may: 0 mục') return `thoát ${r.status}, stdout «${r.out}», stderr «${r.err}»`;
  });
  doCa('NT3-do', 'bo-hoi-so', {
    lanh: () => { const r = run(SCRIPT, hoSoNT3(MA_TRAN_NT3[3][1]).h); return { ok: r.status === 0 && r.out.startsWith('dinh-tuyen-may: 1 mục'), out: r.out }; },
    // Bên ghi hỏi bộ phân giải của lib (hồ sơ dinh-tuyen-theo-ma-muc): bỏ câu hỏi «mục đã định tuyến chưa».
    dot: () => { const m = banSao('dinh-tuyen-may.cjs', 'if (!g.gan[i] && TOKEN_MAY.includes(f.proposal))', 'if (TOKEN_MAY.includes(f.proposal))'); return raNoi(run(path.join(m, 'dinh-tuyen-may.cjs'), hoSoNT3(MA_TRAN_NT3[3][1]).h)); },
    ghim: ['dinh-tuyen-may: 2 mục'],
  });
  doCa('NT3-do', 'thoat-som', {
    lanh: () => { const c = chamNT3(SCRIPT); return { ok: c.loi.length === 0, out: `số hàng đỏ ${c.loi.length}` }; },
    dot: () => { const m = banSao('dinh-tuyen-may.cjs', '  if (k.tat) {', '  process.exit(1); if (k.tat) {'); const c = chamNT3(path.join(m, 'dinh-tuyen-may.cjs')); return `số hàng đỏ ${c.loi.length}\n${c.log.join('\n')}`; },
    ghim: ['số hàng đỏ 6', 'thoát 1, dòng máy mới 0, đối chứng 0'],
  });
  // Đọc số của dòng NGƯỜI chỉ số sống ở lib từ hồ sơ dinh-tuyen-theo-ma-muc (dòng máy khớp theo mã,
  // không còn nhạy với lớp này): dòng «Ngoài-11» đọc kiểu chuỗi-con sẽ nuốt luôn Ngoài-1.
  const MUOI_MOT_NGUOI = () => hoSo('nt3n', { findings: findingsText(Array.from({ length: 11 }, (_, i) => muc(i + 1, 'known-limits'))), ledger: LEDGER_SAN + gate2Nguoi('Ngoài-11: ghi Known limits') + '\n' });
  doCa('NT3-do', 'chuoi-con', {
    lanh: () => { const r = run(SCRIPT, MUOI_MOT_NGUOI()); return { ok: r.status === 0 && r.out.startsWith('dinh-tuyen-may: 10 mục'), out: r.out }; },
    dot: () => { const m = banSaoLib('out-of-contract.cjs', 'const soCuaDong = d => {', "const soCuaDong = d => Array.from({ length: 30 }, (_, i) => i + 1).filter(i => String(d).includes('Ngoài-' + i)); const soCuaDongGoc = d => {"); return raNoi(run(path.join(m, 'dinh-tuyen-may.cjs'), MUOI_MOT_NGUOI())); },
    ghim: ['dinh-tuyen-may: 9 mục'],
  });
}

// ─── NT4 — điều kiện hồ sơ ───────────────────────────────────────────────────
const KL2 = findingsText([muc(1, 'known-limits'), muc(2, 'known-limits')]);
const MA_TRAN_NT4 = [
  ['doi-chung-du', {}, null],
  ['implemented', { contract: { status: 'implemented' } }, 'status implemented'],
  ['T3', { contract: { tier: 'T3' } }, 'hạng T3'],
  ['pending', { evidence: { verdict: 'PENDING-JUDGMENT' } }, 'verdict=PENDING-JUDGMENT'],
  ['uncertain', { evidence: { uncertain: true } }, 'có mục UNCERTAIN'],
  ['bypass', { evidence: { bypass: 'true' } }, 'bypass_used=true'],
  ['enf-off', { evidence: { enf: 'off' } }, 'enforcement_mode=off'],
  ['triage-failed', { evidence: { triage: true } }, 'triage_failed: true'],
  ['findings-sai-khuon', { findings: HEAD_OOC + '- **sai khuon** khong truong\n' }, 'sai khuôn OOC-ITEM-TEMPLATE'],
  ['chua-phan-loai', { findings: KL2 + '\n## Chưa phân loại (triage-failed)\n\n- một mục\n' }, 'Chưa phân loại'],
];
const VI_PHAN = ['pending', 'bypass', 'enf-off', 'T3', 'uncertain'];
if (want('NT4')) {
  const chamNT4 = script => {
    const loi = [];
    for (const [ten, o, ghim] of MA_TRAN_NT4) {
      const h = hoSo('nt4', { findings: KL2, ...o }); const b = bam(h.d); const r = run(script, h);
      if (ghim == null) { if (r.status !== 0 || dongMay(h).length !== 2) loi.push(`${ten} (đối chứng không ghi hai dòng)`); continue; }
      const ok = r.status === 0 && bam(h.d) === b && r.out.split('\n').length === 1 && r.out.startsWith('không định tuyến:') && r.out.includes(ghim);
      console.log(`  · ${ten}: ${r.out}`);
      if (!ok) loi.push(ten);
    }
    return loi;
  };
  ca('NT4', 'ma-tran', () => {
    console.log(`  · số hàng chạy: ${MA_TRAN_NT4.length}`);
    if (MA_TRAN_NT4.length !== 10) return `ma trận ${MA_TRAN_NT4.length} hàng, khai 10`;
    const loi = chamNT4(SCRIPT); if (loi.length) return `hàng sai: ${loi.join(', ')}`;
  });
  ca('NT4', 'vi-phan', () => {
    const loi = [];
    for (const ten of VI_PHAN) {
      const [, o, ghim] = MA_TRAN_NT4.find(x => x[0] === ten);
      const h = hoSo('nt4v', { findings: KL2, ...o });
      const w = run(SCRIPT, h, '--check');
      const k = spawnSync(process.execPath, [KCN, '--check', '--root', h.R, '--slug', h.slug], { encoding: 'utf8' });
      console.log(`  · ${ten}: bên ghi «${w.out}» · khong-can-nguoi «${(k.stderr || '').trim()}»`);
      if (k.status !== 2 || !(k.stderr || '').includes(ghim) || !w.out.includes(ghim)) loi.push(ten);
    }
    if (loi.length) return `hai bộ đọc nói khác vế ở: ${loi.join(', ')}`;
  });
  ca('NT4', 'mot-nguon', () => {
    const ma = new Set(require(SCRIPT).VE.map(v => v.ma)); const can = XANH_SACH_MA.filter(m => m !== 'sections');
    console.log(`  · khối: ${XANH_SACH_MA.join(',')} · bên ghi: ${[...ma].join(',')}`);
    if (can.length !== 5) return `khối EVIDENCE-XANH-SACH-BLOCK rút ra ${can.length} mã, mong 5`;
    const thieu = can.filter(m => !ma.has(m)); if (thieu.length) return `bên ghi thiếu vế: ${thieu.join(', ')}`;
  });
  doCa('NT4-do', 'bo-T2', {
    lanh: () => { const r = run(SCRIPT, hoSo('nt4', { findings: KL2, contract: { tier: 'T3' } })); return { ok: r.status === 0 && r.out.includes('hạng T3'), out: r.out }; },
    dot: () => { const m = banSao('dinh-tuyen-may.cjs', "return t === 'T2' ? null", 'return true ? null'); return raNoi(run(path.join(m, 'dinh-tuyen-may.cjs'), hoSo('nt4', { findings: KL2, contract: { tier: 'T3' } }))); },
    ghim: ['dinh-tuyen-may: 2 mục'],
  });
}

// ─── NT5 — mở làn V ở lưới thật ──────────────────────────────────────────────
function khoGit(slug, findings) {
  const R = mkdtempSync(path.join(tmpdir(), 'nt-git-')); tmpRoots.push(R);
  const git = (...a) => execFileSync('git', ['-c', 'user.name=nt', '-c', 'user.email=nt@x', '-C', R, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  mkdirSync(path.join(R, 'src'), { recursive: true }); mkdirSync(path.join(R, '_acceptance'), { recursive: true });
  git('init', '-q');
  writeFileSync(path.join(R, '_acceptance', 'config.yaml'), 'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n    - "*.md"\nfeature_loop:\n  ngoai_n_tu_dinh_tuyen: true\n');
  writeFileSync(path.join(R, 'src', 'app.js'), 'code v1\n'); writeFileSync(path.join(R, 'verify.sh'), '#!/bin/sh\nexit 0\n');
  mkdirSync(path.join(R, 'lib'), { recursive: true }); mkdirSync(path.join(R, 'scripts'), { recursive: true });
  for (const f of ['evidence-core.cjs', 'gap-probe.cjs', 'workspace-record.cjs', 'ac-line.cjs', 'md-section.cjs', 'out-of-contract.cjs'])
    copyFileSync(path.join(ROOT, 'lib', f), path.join(R, 'lib', f));
  copyFileSync(path.join(ROOT, 'scripts', 'recheck-evidence.cjs'), path.join(R, 'scripts', 'recheck-evidence.cjs'));
  git('add', '-A'); git('commit', '-qm', 'c1'); git('branch', 'basepoint');
  writeFileSync(path.join(R, 'src', 'app.js'), 'code v2\n');
  const d = path.join(R, '_acceptance', slug); mkdirSync(d, { recursive: true });
  writeFileSync(path.join(d, 'contract.md'), contractText(slug));
  git('add', '-A'); git('commit', '-qm', 'c2'); const c2 = git('rev-parse', 'HEAD').trim();
  writeFileSync(path.join(d, 'evidence-report.md'), evidenceText(slug, { verifiedCommit: c2 }));
  writeFileSync(path.join(d, 'review-findings.md'), findings); writeFileSync(path.join(d, 'decisions.jsonl'), LEDGER_SAN);
  git('add', '-A'); git('commit', '-qm', 'c3');
  return { R, d, slug, git };
}
const kcn = h => { const r = spawnSync(process.execPath, [KCN, '--check', '--root', h.R, '--slug', h.slug], { encoding: 'utf8' }); return { status: r.status, err: (r.stderr || '') }; };
const luoi = h => { const env = { ...process.env }; delete env.PRE_MERGE_BASE; const r = spawnSync('bash', [PREMERGE, h.R, '--base', 'basepoint'], { encoding: 'utf8', env }); return new RegExp(`^VIOLATION \\[${h.slug}\\]`, 'm').test((r.stdout || '') + '\n' + (r.stderr || '')); };
const BIEN_A = () => findingsText([muc(1, 'known-limits'), muc(2, 'wont-fix')]);
const BIEN_B = () => findingsText([muc(1, 'known-limits'), muc(2, 'wont-fix'), muc(3, 'new-contract')]);
if (want('NT5')) {
  const ha = khoGit('nt5a', BIEN_A()), hb = khoGit('nt5b', BIEN_B());
  ca('NT5', 'truoc', () => {
    for (const h of [ha, hb]) { const k = kcn(h); if (k.status !== 2) return `${h.slug}: --check thoát ${k.status}`; if (!luoi(h)) return `${h.slug}: lưới không VIOLATION`; }
  });
  const ghiVaCommit = (script, h) => { const r = run(script, h); h.git('add', '-A'); h.git('commit', '-qm', 'c4', '--allow-empty'); return r; };
  ghiVaCommit(SCRIPT, ha); ghiVaCommit(SCRIPT, hb);
  ca('NT5', 'sau-a', () => { const k = kcn(ha); if (k.status !== 0) return `--check thoát ${k.status}: ${k.err}`; if (luoi(ha)) return 'lưới vẫn VIOLATION'; });
  ca('NT5', 'sau-b', () => {
    const k = kcn(hb); if (k.status !== 2) return `--check thoát ${k.status}`;
    if (!k.err.includes('Ngoài-3') || k.err.includes('Ngoài-1')) return `lý do không nêu đúng Ngoài-3: ${k.err}`;
    if (!luoi(hb)) return 'lưới không VIOLATION';
  });
  doCa('NT5-do', 'thieu-nhan', {
    lanh: () => { const h = khoGit('nt5a', BIEN_A()); ghiVaCommit(SCRIPT, h); const k = kcn(h); return { ok: k.status === 0, out: `khong-can-nguoi thoát ${k.status}` }; },
    // Dòng máy được bộ đọc nhận qua HAI đường (số trong decision · mã tieu_de — hồ sơ dinh-tuyen-theo-ma-muc):
    // đột biến gỡ cả hai thì làn V phải mù.
    dot: () => { const m = banSao('dinh-tuyen-may.cjs', 'decision: `Ngoài-${g.n}: ', 'decision: `'); const p = path.join(m, 'dinh-tuyen-may.cjs'); const s = readFileSync(p, 'utf8'); if (!s.includes('may: DAU_MAY, tieu_de: g.f.title, dao:')) throw new Error('không thấy tieu_de trong dòng máy'); writeFileSync(p, s.replace('may: DAU_MAY, tieu_de: g.f.title, dao:', 'may: DAU_MAY, dao:')); const h = khoGit('nt5a', BIEN_A()); ghiVaCommit(p, h); return kcn(h).err; },
    ghim: ['chưa người định tuyến: Ngoài-1, Ngoài-2'],
  });
}

// ─── Thẻ Cổng 2 ──────────────────────────────────────────────────────────────
const the = (h, card = CARD) => {
  const x = spawnSync(process.execPath, [card, '--root', h.R, '--slug', h.slug, '--extract'], { encoding: 'utf8' });
  const html = spawnSync(process.execPath, [card, '--root', h.R, '--slug', h.slug], { encoding: 'utf8' });
  if (x.status !== 0) throw new Error(`--extract thoát ${x.status}: ${(x.stderr || '').slice(0, 200)}`);
  return { j: JSON.parse(x.stdout), html: html.stdout || '' };
};
if (want('NT6')) {
  const h = hoSo('nt6', { findings: BA_MUC() }); run(SCRIPT, h);
  const f = readFileSync(path.join(h.d, 'review-findings.md'), 'utf8');
  writeFileSync(path.join(h.d, 'review-findings.md'), findingsText([muc(2, 'wont-fix'), muc(1, 'known-limits'), muc(3, 'known-limits — vì chú thích đuôi')]));
  if (f === readFileSync(path.join(h.d, 'review-findings.md'), 'utf8')) fail('NT6 lech', 'không đảo được thứ tự');
  ca('NT6', 'lech', () => {
    const b = bam(h.d); const r = run(SCRIPT, h); const c = run(SCRIPT, h, '--check');
    if (r.status !== 2 || c.status !== 2) return `thoát ${r.status}/${c.status}, mong 2/2`;
    if (!r.err.includes('Ngoài-1') || !r.err.includes('loi so 1') || !r.err.includes('loi so 2')) return `stderr thiếu nhãn/tiêu đề: ${r.err}`;
    if (bam(h.d) !== b) return 'băm năm tệp đổi';
  });
  ca('NT6', 'the', () => {
    const { j, html } = the(h);
    if (j.routing.bao.includes('Ngoài-1')) return 'Ngoài-1 lệch mà vẫn ở routing.bao';
    if (!html.includes('dòng máy trỏ mục đã đổi')) return 'HTML không có cờ «dòng máy trỏ mục đã đổi»';
  });
  doCa('NT6-do', 'bo-so-tieu-de', {
    lanh: () => { const r = run(SCRIPT, h); return { ok: r.status === 2 && r.err.includes('dòng máy trỏ mục đã đổi'), out: r.err }; },
    // Bộ phân giải dời về lib (hồ sơ dinh-tuyen-theo-ma-muc): bỏ phép so tiêu đề = bỏ danh sách lệch, mục
    // mồ côi rơi về «chưa định tuyến» nên máy ghi đè đề xuất của chính nó lên hai mục đã đảo.
    dot: () => { const m = banSao('dinh-tuyen-may.cjs', 'const lech = g.moCoi.filter(m => m.may === DAU_MAY)', 'const lech = [].filter(m => m)'); return raNoi(run(path.join(m, 'dinh-tuyen-may.cjs'), h)); },
    ghim: ['dinh-tuyen-may: 2 mục'],
  });
}
if (want('NT7')) {
  const h = hoSo('nt7', { findings: BA_MUC() }); run(SCRIPT, h);
  const mays = dongMay(h);
  let T; try { T = the(h); } catch (e) { fail('NT7', e.message); }
  if (T) {
    const { j, html } = T; const N = ['Ngoài-1', 'Ngoài-2', 'Ngoài-3'];
    ca('NT7', 'routing', () => {
      if (!N.every(n => j.routing.bao.includes(n))) return `routing.bao = ${j.routing.bao}`;
      if (N.some(n => j.routing.hoi.includes(n))) return `routing.hoi còn nhãn máy: ${j.routing.hoi}`;
      if (!String(j.one_shot || '').includes(`Ngoài-1: ${GLOSS['known-limits']}`)) return `one_shot: ${j.one_shot}`;
    });
    ca('NT7', 'extract', () => {
      const d = (j.out_of_contract || {}).dinh_tuyen_may;
      if (!Array.isArray(d) || d.length !== 3) return `dinh_tuyen_may = ${JSON.stringify(d)}`;
      for (let i = 0; i < 3; i++) {
        const tok = i === 1 ? 'wont-fix' : 'known-limits';
        if (d[i].nhan !== N[i] || d[i].id !== mays[i].id || d[i].dao !== mays[i].dao || d[i].de_xuat !== tok) return `phần tử ${i + 1} lệch: ${JSON.stringify(d[i])}`;
      }
    });
    ca('NT7', 'dao', () => {
      for (const e of mays) {
        const ve = e.dao.replace(/^\/acceptance-gate:signoff\s+\S+\s+/, '').split(';').map(s => s.trim());
        const n = /^Ngoài-(\d+):/.exec(e.decision)[1];
        if (ve.length !== 2 || ve[0] !== `Ngoài-${n}: ${GLOSS['new-contract']}` || ve[1] !== 'Ký') return `dao tách sai: ${JSON.stringify(ve)}`;
      }
    });
    ca('NT7', 'html', () => {
      const k = (html.match(/Máy đã định tuyến/g) || []).length; if (k !== 3) return `«Máy đã định tuyến» xuất hiện ${k} lần`;
      if (!mays.every(e => html.includes(e.dao))) return 'HTML thiếu lệnh đảo của một mục';
      const treo = html.slice(html.indexOf('Quyết định CHƯA duyệt'));
      if ((treo.match(/máy định tuyến/g) || []).length < 3) return 'khối CHƯA duyệt không có ba mục «máy định tuyến»';
    });
    ca('NT7', 'nguoi-thang', () => {
      const h2 = hoSo('nt7', { findings: BA_MUC() }); run(SCRIPT, h2);
      writeFileSync(path.join(h2.d, 'decisions.jsonl'), readFileSync(path.join(h2.d, 'decisions.jsonl'), 'utf8') + gate2Nguoi(`Ngoài-2: ${GLOSS['new-contract']}`) + '\n');
      const { j: j2 } = the(h2); const nh = (j2.out_of_contract.dinh_tuyen_may || []).map(x => x.nhan);
      if (nh.includes('Ngoài-2') || !j2.routing.hoi.includes('Ngoài-2')) return `Ngoài-2 chưa về người: ${nh} / ${j2.routing.hoi}`;
      if (!j2.routing.bao.includes('Ngoài-1') || !j2.routing.bao.includes('Ngoài-3')) return 'Ngoài-1/3 rời routing.bao';
    });
    ca('NT7', 'muoi-mot-muc', () => {
      const { j: j3, html: h3 } = the(MUOI_MOT());
      if (!j3.routing.bao.includes('Ngoài-1') || !j3.routing.bao.includes('Ngoài-11')) return `routing.bao = ${j3.routing.bao}`;
      if (h3.includes('dòng máy trỏ mục đã đổi')) return 'cờ lệch oan';
    });
    const h4 = hoSo('nt7', { findings: BA_MUC() }); run(SCRIPT, h4);
    writeFileSync(path.join(h4.d, 'decisions.jsonl'), readFileSync(path.join(h4.d, 'decisions.jsonl'), 'utf8') + gate2Nguoi(`Ngoài-2: ${GLOSS['new-contract']}`) + '\n');
    const nhanMay = card => JSON.stringify((the(h4, card).j.out_of_contract.dinh_tuyen_may || []).map(x => x.nhan));
    doCa('NT7-do', 'dong-dau', {
      lanh: () => { const o = nhanMay(CARD); return { ok: o === '["Ngoài-1","Ngoài-3"]', out: o }; },
      // «Dòng sau thắng» sống ở bộ phân giải của lib từ hồ sơ dinh-tuyen-theo-ma-muc: đột biến cho dòng ĐẦU thắng.
      dot: () => nhanMay(path.join(banSaoLib('out-of-contract.cjs', 'if (n >= 1 && n <= L.length) gan[n - 1] =', 'if (n >= 1 && n <= L.length && !gan[n - 1]) gan[n - 1] ='), 'gate-card.js')),
      ghim: ['"Ngoài-2"'],
    });
  }
}
if (want('NT8')) {
  ca('NT8', 'doc-cu', () => {
    const h = hoSo('nt8'); const { j, html } = the(h);
    const d = (j.out_of_contract || {}).dinh_tuyen_may;
    if (!Array.isArray(d) || d.length) return `dinh_tuyen_may = ${JSON.stringify(d)}, mong []`;
    if (!j.routing.hoi.includes('Ngoài-1') || !j.routing.hoi.includes('Ngoài-2')) return `routing.hoi = ${j.routing.hoi}`;
    if (html.includes('Máy đã định tuyến')) return 'HTML có «Máy đã định tuyến» trên hồ sơ không dòng máy';
  });
}

// ─── NT9 — khối SKILL chạy được ──────────────────────────────────────────────
const khoiSkill = t => { const m = t.match(/<!-- <<<DINH-TUYEN-MAY -->\n([\s\S]*?)<!-- DINH-TUYEN-MAY>>> -->/); return m ? m[1] : null; };
function chayKhoi(khoi) {
  const lenh = (khoi.match(/^AG=.*dinh-tuyen-ma\w*\.cjs.*$/m) || [])[0];
  if (!lenh) return { status: -1, loi: 'khối không có dòng lệnh AG=… dinh-tuyen-may' };
  const h = hoSo('nt9', { findings: BA_MUC() });
  const cmd = lenh.replace(/^AG=\$\([^)]*\)/, `AG='${ROOT}'`).replace(/<slug>/g, h.slug);
  const r = spawnSync('bash', ['-c', cmd], { cwd: h.R, encoding: 'utf8' });
  return { status: r.status, may: dongMay(h).length, err: r.stderr };
}
if (want('NT9')) {
  const k = khoiSkill(readFileSync(SKILL, 'utf8'));
  ca('NT9', 'round-trip', () => {
    if (k == null) return 'SKILL không có khối DINH-TUYEN-MAY';
    const r = chayKhoi(k); if (r.status !== 0 || r.may !== 3) return `lệnh trong khối: thoát ${r.status}, ${r.may} dòng máy (${r.loi || r.err})`;
  });
  ca('NT9', 'thu-tu', () => {
    if (k == null) return 'SKILL không có khối DINH-TUYEN-MAY';
    const a = k.indexOf('dinh-tuyen-may.cjs'), b = k.indexOf('khong-can-nguoi');
    if (a < 0 || b < 0 || a > b) return `vị trí dinh-tuyen-may ${a}, khong-can-nguoi ${b}`;
  });
  if (k != null) doCa('NT9-do', 'ten-sai', {
    lanh: () => { const r = chayKhoi(k); return { ok: r.status === 0 && r.may === 3, out: `thoát ${r.status}, ${r.may} dòng máy` }; },
    dot: () => chayKhoi(k.split('dinh-tuyen-may.cjs').join('dinh-tuyen-mai.cjs')).err,
    ghim: ['dinh-tuyen-mai.cjs'],
  });
}

// ─── NT10 — GUIDE khai khoá ──────────────────────────────────────────────────
function soiGuide(t) {
  const m = t.match(/<!-- <<<NGOAI-N-TU-DINH-TUYEN -->\n([\s\S]*?)<!-- NGOAI-N-TU-DINH-TUYEN>>> -->/);
  if (!m) return 'GUIDE không có khối NGOAI-N-TU-DINH-TUYEN';
  const { KHOA } = require(SCRIPT);
  for (const s of [KHOA, 'true | false', 'mặc định tắt', 'đảo', 'Ngoài-<n>: mở hợp đồng mới; Ký', 'tieu_de', 'dinh-tuyen-may.cjs --soat-lech'])
    if (!m[1].includes(s)) return `khối GUIDE thiếu «${s}»`;
  return null;
}
if (want('NT10')) {
  const g = readFileSync(GUIDE, 'utf8');
  ca('NT10', 'guide', () => soiGuide(g));
  doCa('NT10-do', 'doi-chu', {
    lanh: () => { const e = soiGuide(g); return { ok: e === null, out: e === null ? 'khối GUIDE đủ' : e }; },
    dot: () => soiGuide(g.split('ngoai_n_tu_dinh_tuyen').join('ngoai_n_tu_dinh_tuyem')) || '',
    ghim: ['feature_loop.ngoai_n_tu_dinh_tuyen'],
  });
}

// ─── NT11 — soát lệch toàn kho (ngưỡng đếm được) ─────────────────────────────
function khoSoat({ coLech = true } = {}) {
  const R = mkdtempSync(path.join(tmpdir(), 'nt-soat-')); tmpRoots.push(R);
  mkdirSync(path.join(R, '_acceptance'), { recursive: true });
  writeFileSync(path.join(R, '_acceptance', 'config.yaml'), CONFIG.vang);
  const mk = (slug, status, ledgerExtra, ev = {}) => {
    const d = path.join(R, '_acceptance', slug); mkdirSync(d, { recursive: true });
    writeFileSync(path.join(d, 'contract.md'), contractText(slug, { status }));
    writeFileSync(path.join(d, 'evidence-report.md'), evidenceText(slug, ev).replace(/^human_signoff:.*$/m, ev.ky ? 'human_signoff: fixture 2026-10-01' : 'human_signoff:'));
    writeFileSync(path.join(d, 'review-findings.md'), findingsText([muc(1, 'known-limits'), muc(2, 'known-limits')]));
    writeFileSync(path.join(d, 'decisions.jsonl'), LEDGER_SAN + ledgerExtra.map(l => l + '\n').join(''));
  };
  if (coLech) mk('a-may-thong-lech', 'machine-cleared', [gate2May(1, 'tieu de cu khac'), gate2May(2, 'loi so 2')]);
  mk('b-da-ky-khop', 'verified', [gate2May(1, 'loi so 1'), gate2May(2, 'loi so 2')], { ky: true });
  mk('c-khong-dong-may', 'verified', []);
  return R;
}
const bamCay = R => { const h = createHash('sha256'); const di = d => { for (const e of readdirSync(d, { withFileTypes: true }).sort((x, y) => x.name.localeCompare(y.name))) { const p = path.join(d, e.name); if (e.isDirectory()) di(p); else h.update(p + readFileSync(p)); } }; di(path.join(R, '_acceptance')); return h.digest('hex'); };
const soat = (script, R) => { const r = spawnSync(process.execPath, [script, '--soat-lech', '--root', R], { encoding: 'utf8' }); return { status: r.status, out: (r.stdout || '').trim(), err: (r.stderr || '').trim() }; };
if (want('NT11')) {
  ca('NT11', 'soat-lech', () => {
    const R = khoSoat(); const b = bamCay(R); const r = soat(SCRIPT, R); const l = r.out.split('\n');
    console.log(`  · ${r.out.replace(/\n/g, ' | ')}`);
    if (r.status !== 2) return `thoát ${r.status}, mong 2`;
    if (l[0] !== 'dinh-tuyen-may: 1 hồ sơ có dòng máy lệch mục') return `dòng đầu: ${l[0]}`;
    if (!l[1] || !l[1].includes('a-may-thong-lech') || !l[1].includes('Ngoài-1') || !l[1].includes('tieu de cu khac') || !l[1].includes('loi so 1')) return `dòng hai thiếu slug/nhãn/tiêu đề: ${l[1]}`;
    if (bamCay(R) !== b) return 'soát lệch ghi vào _acceptance/';
  });
  ca('NT11', 'soat-sach', () => {
    const r = soat(SCRIPT, khoSoat({ coLech: false }));
    if (r.status !== 0 || r.out !== 'dinh-tuyen-may: 0 hồ sơ có dòng máy lệch mục') return `thoát ${r.status}: ${r.out}`;
  });
  ca('NT11', 'guide-lenh', () => {
    const m = readFileSync(GUIDE, 'utf8').match(/<!-- <<<NGOAI-N-TU-DINH-TUYEN -->\n([\s\S]*?)<!-- NGOAI-N-TU-DINH-TUYEN>>> -->/);
    if (!m || !m[1].includes('dinh-tuyen-may.cjs --soat-lech')) return 'khối GUIDE không đếm ngưỡng bằng --soat-lech';
  });
  doCa('NT11-do', 'qua-dieu-kien', {
    lanh: () => { const r = soat(SCRIPT, khoSoat()); return { ok: r.status === 2 && r.out.startsWith('dinh-tuyen-may: 1 hồ sơ'), out: r.out.split('\n')[0] }; },
    dot: () => { const m = banSao('dinh-tuyen-may.cjs', '    // (soát lệch KHÔNG xét điều kiện hồ sơ)', "    if (veTruot({ contract: doc(path.join(goc, slug, 'contract.md')), evidence: doc(path.join(goc, slug, 'evidence-report.md')), findings: doc(path.join(goc, slug, 'review-findings.md')) })) continue;"); return raNoi(soat(path.join(m, 'dinh-tuyen-may.cjs'), khoSoat())); },
    ghim: ['dinh-tuyen-may: 0 hồ sơ có dòng máy lệch mục'],
  });
}

// ─── NT12 — nhãn lượt mang sang không phải mục đã đổi ─────────────────────────
// Mục mang sang dựng bằng khuôn OOC-ITEM-TEMPLATE rồi chèn nhãn lượt theo HAI cách bộ đọc lib nhận
// (trong hai dấu sao — máy chèn; ngoài hai dấu sao — tác tử tổng hợp viết), cộng một tiêu đề khác thật.
const MA_TRAN_NT12 = [
  ['trong-sao', '- **loi so 1 (r1)**', true],
  ['ngoai-sao', '- **loi so 1** (r1)', true],
  ['tep-doi', '- **loi so 1 (r1 · tệp đã đổi)**', true],
  ['khac-that', '- **loi khac han (r1)**', false],
];
const hoSoNT12 = dong => {
  const f = findingsText([muc(1, 'known-limits'), muc(2, 'known-limits')]);
  if (!f.includes('- **loi so 1**\n')) throw new Error('khuôn mục không còn dòng tiêu đề «- **…**»');
  return hoSo('nt12', { findings: f.replace('- **loi so 1**\n', dong + '\n'), ledger: LEDGER_SAN + [gate2May(1, 'loi so 1'), gate2May(2, 'loi so 2')].map(l => l + '\n').join('') });
};
if (want('NT12')) {
  ca('NT12', 'ma-tran', () => {
    const loi = [];
    for (const [ten, td, cung] of MA_TRAN_NT12) {
      const h = hoSoNT12(td);
      const tieuDoc = ooc.parse(readFileSync(path.join(h.d, 'review-findings.md'), 'utf8')).findings[0].title;
      const r = run(SCRIPT, h); const { j, html } = the(h); const s = soat(SCRIPT, h.R);
      const ok = cung
        ? r.status === 0 && r.out === 'dinh-tuyen-may: 0 mục' && j.routing.bao.includes('Ngoài-1') && !html.includes('dòng máy trỏ mục đã đổi') && s.out.startsWith('dinh-tuyen-may: 0 hồ sơ')
        : r.status === 2 && html.includes('dòng máy trỏ mục đã đổi') && s.out.startsWith('dinh-tuyen-may: 1 hồ sơ');
      console.log(`  · ${ten}: tiêu đề đọc «${tieuDoc}» · bên ghi thoát ${r.status} · thẻ bao ${j.routing.bao.includes('Ngoài-1')} · soát «${s.out.split('\n')[0]}»`);
      if (!ok) loi.push(ten);
    }
    console.log(`  · số hàng chạy: ${MA_TRAN_NT12.length}`);
    if (loi.length) return `hàng sai: ${loi.join(', ')}`;
  });
  ca('NT12', 'mot-ham', () => {
    const src = readFileSync(CARD, 'utf8');
    // Một nguồn từ hồ sơ dinh-tuyen-theo-ma-muc: bộ phân giải + hàm gỡ nhãn sống ở lib; thẻ và bên ghi gọi lại.
    if (!/ganDinhTuyen\(/.test(src)) return 'gate-card.js không gọi bộ phân giải ganDinhTuyen của lib';
    if (/NHAN_LUOT_RE\s*=|tieuDeGoc\s*=/.test(src)) return 'gate-card.js tự định nghĩa hàm gỡ nhãn';
    if (/NHAN_LUOT_RE\s*=|tieuDeGoc\s*=/.test(readFileSync(SCRIPT, 'utf8'))) return 'dinh-tuyen-may.cjs tự định nghĩa hàm gỡ nhãn';
  });
  doCa('NT12-do', 'bo-go-nhan', {
    lanh: () => { const r = run(SCRIPT, hoSoNT12('- **loi so 1 (r1)**')); return { ok: r.status === 0 && r.out === 'dinh-tuyen-may: 0 mục', out: r.out }; },
    dot: () => { const m = banSaoLib('out-of-contract.cjs', "const tieuDeGoc = s => String(s == null ? '' : s).replace(NHAN_LUOT_RE, '').trim();", "const tieuDeGoc = s => String(s == null ? '' : s).trim();"); return raNoi(run(path.join(m, 'dinh-tuyen-may.cjs'), hoSoNT12('- **loi so 1 (r1)**'))); },
    ghim: ['dòng máy trỏ mục đã đổi', 'loi so 1 (r1)'],
  });
}

// ─── NT13 — nhánh mã thoát khác 0/2 là nhánh có thật ──────────────────────────
if (want('NT13')) {
  const RES = path.join(ROOT, 'feature-loop', 'scripts', 'resolve-plugin.mjs');
  ca('NT13', 'resolver-thieu', () => {
    const co = spawnSync(process.execPath, [RES, '--plugin', 'acceptance-gate', '--require', 'scripts/dinh-tuyen-may.cjs', '--root', ROOT], { encoding: 'utf8' });
    const thieu = spawnSync(process.execPath, [RES, '--plugin', 'acceptance-gate', '--require', 'scripts/dinh-tuyen-may-khong-co.cjs', '--root', ROOT], { encoding: 'utf8' });
    console.log(`  · bộ giải: có tệp → thoát ${co.status} · thiếu tệp → thoát ${thieu.status}`);
    if (co.status !== 0) return `đối chứng dương thoát ${co.status}`;
    if (thieu.status === 0 || thieu.status === 2) return `thiếu tệp thoát ${thieu.status} — trùng mã của nhánh đã có`;
  });
  ca('NT13', 'khoi-co-nhanh', () => {
    const k = khoiSkill(readFileSync(SKILL, 'utf8'));
    if (!k || !k.includes('khác 0 và 2')) return 'khối DINH-TUYEN-MAY không có nhánh «khác 0 và 2»';
  });
}

// ─── NT14 — mọi ca chiều đỏ có ghim ──────────────────────────────────────────
if (want('NT14')) ca('NT14', 'dem-ghim', () => {
  console.log(`  · ca -do đã chạy ${doChay} · ca -do in dòng ghim ${doGhim}`);
  if (only.length === 0 && doChay < 13) return `chỉ ${doChay} ca -do chạy, mong ≥ 13`;
  if (doGhim !== doChay) return `${doChay - doGhim} ca -do không ghim được đầu ra`;
});

for (const R of tmpRoots) rmSync(R, { recursive: true, force: true });
if (only.length && matched === 0) { console.log(`FAIL: NT_CASES=${only.join(',')} không khớp ca nào`); process.exit(1); }
console.log(`NT Results: ${passes} PASS · ${failures} FAIL`);
process.exit(failures ? 1 : 0);
