// dinh-tuyen-theo-ma-muc.test.mjs — hồ sơ dinh-tuyen-theo-ma-muc (vòng vá DP11, gốc crm-onehub#375).
// Tên ca = «DM<k> <tên>»; chiều đỏ «DM<k>-do <tên>». Ca đỏ chạy CHÍNH lệnh đo trên bản sao bị tiêm, SAU khi
// bản lành xanh trên cùng fixture, và ghim thông điệp.
//   DM1  dòng có mã khớp đúng mục khi mục đổi số (CLI khong-can-nguoi)
//   DM2  ca crm them-buoc-bao-dung: dòng chỉ số ghi trước lượt chấm → chưa định tuyến
//   DM3  ma trận bộ phân giải (lib) — 14 hàng AC-3 + 4 hàng Review Focus
//   DM4  lưới trước-gộp × bộ quét — đẳng thức hai bản dựng
//   DM5  mọi bên gọi luật xanh-sạch truyền runLog
//   DM6  máy định tuyến: khớp dòng máy theo mã, dừng trước dòng người đã cũ
//   DM7  thẻ Cổng 2: cờ dòng cũ
//   DM8  khuôn dòng sổ người của signoff — khứ hồi bên viết → bên đọc
//   DM9  vi phân trên cây _acceptance/ thật của kit, mốc cố định
// Fixture do CODE SINH trong lượt: mục rút OOC-ITEM-TEMPLATE của feature-loop/workflows/acceptance-verify.js,
// khoá round-tally rút ROUND-TALLY-SCHEMA cùng tệp, hợp đồng rút CONTRACT-FRONTMATTER-TEMPLATE, dòng sổ người
// rút NGOAI-N-GATE2-LINE của commands/signoff.md. Đường dẫn suy từ vị trí tệp.
// Chọn ca: đối số dòng lệnh (`node dinh-tuyen-theo-ma-muc.test.mjs DM3 DM1`) hoặc DM_CASES=a,b.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, cpSync, existsSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const TMP = mkdtempSync(path.join(tmpdir(), 'dm-'));
const require = createRequire(import.meta.url);
let pass = 0; let fail = 0;
const ok = (name, msg = '') => { pass += 1; console.log(`PASS: ${name} ${msg}`.trimEnd() + ' '); };
const bad = (name, msg) => { fail += 1; console.log(`FAIL: ${name} — ${msg}`); };
const loi = e => String((e && (e.stderr || e.message)) || e).split('\n').slice(0, 4).join(' | ');
const CHON = [...process.argv.slice(2), ...(process.env.DM_CASES ? process.env.DM_CASES.split(',') : [])];
const want = (...names) => !CHON.length || names.some(n => CHON.includes(n) || CHON.includes(n.split(' ')[0]));
const ca = async (name, fn) => { if (!want(name)) return; try { const r = await fn(); if (r && r.loi) bad(name, r.loi); else ok(name, r && r.msg ? r.msg : ''); } catch (e) { bad(name, loi(e)); } };
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 512 * 1024 * 1024 }).trim();
const bam = t => createHash('sha256').update(t == null ? '' : t).digest('hex');

// ── Khuôn rút từ bên VIẾT ────────────────────────────────────────────────────
const AV = readFileSync(path.join(KIT, 'feature-loop', 'workflows', 'acceptance-verify.js'), 'utf8');
const OOC_TPL = (() => {
  const m = AV.match(/<<<OOC-ITEM-TEMPLATE\\n([\s\S]*?)OOC-ITEM-TEMPLATE>>>/);
  if (!m) throw new Error('khong rut duoc OOC-ITEM-TEMPLATE tu acceptance-verify.js');
  return m[1].replace(/\\n/g, '\n').replace(/\\`/g, '`');
})();
const KHOA_TALLY = (() => {
  const m = AV.match(/<<<ROUND-TALLY-SCHEMA([\s\S]*?)ROUND-TALLY-SCHEMA>>>/);
  if (!m) throw new Error('khong rut duoc ROUND-TALLY-SCHEMA tu acceptance-verify.js');
  const k = [...m[1].matchAll(/"(\w+)":/g)].map(x => x[1]);
  for (const c of ['round', 'kind', 'verdict']) if (!k.includes(c)) throw new Error(`ROUND-TALLY-SCHEMA thieu khoa ${c}`);
  return k;
})();
const tally = (ts, round = 2) => JSON.stringify(Object.fromEntries([['ts', ts], ...KHOA_TALLY.map(k => [k, { round, kind: 'round-tally', verdict: 'PASS', expected: 1, returned: 1, blocked: 0 }[k] ?? 0])]));
const runLog = (...ts) => ts.map((t, i) => tally(t, i + 1)).join('\n') + '\n';
const NHAN_SIGNOFF = (() => {
  const s = readFileSync(path.join(KIT, 'commands', 'signoff.md'), 'utf8');
  return s;
})();
function khuonSignoff(src) {
  const m = src.match(/<!-- <<<NGOAI-N-GATE2-LINE -->([\s\S]*?)<!-- NGOAI-N-GATE2-LINE>>> -->/);
  if (!m) throw new Error('không rút được khối NGOAI-N-GATE2-LINE từ commands/signoff.md');
  const l = m[1].split('\n').map(x => x.trim()).filter(x => x && !x.startsWith('```'));
  if (l.length !== 1) throw new Error(`khối NGOAI-N-GATE2-LINE có ${l.length} dòng nội dung, cần đúng 1`);
  return l[0];
}

// Mục: tiêu đề «loi that so <i>», tệp «src/a<i>.js:1»; nhan = nhãn lượt (vd «(r1)»).
const mucOoc = (i, o = {}) => OOC_TPL.replace(/\{(\w+)\}/g, (_, k) => ({ title: `loi that so ${i}${o.nhan ? ' ' + o.nhan : ''}`, plain: `Người dùng thấy lỗi ${i}.`, file: o.file || `src/a${i}.js:1`, severity: 'low', proposal: o.proposal || 'known-limits' }[k]));
const FINDINGS = muc => '# Review findings\n\n## Trong hợp đồng\n\n## Ngoài hợp đồng — người quyết ở Gate 2\n\nCác lỗi dưới đây nằm ngoài phạm vi đã duyệt.\n\n' + muc.join('\n') + '\n';
const dong = (n, o = {}) => JSON.stringify({ id: `d-20261013T060000Z-${n}`, type: 'revisit', stage: 'gate2', at: '2026-10-13T06:00:00Z', decision: `Ngoài-${n}: ghi Known limits`, why: 'x', cost_if_wrong: 'x', ...o });
const dongMa = (n, i, o = {}) => dong(n, { tieu_de: `loi that so ${i}`, tep: `src/a${i}.js:1`, ...o });
const so = (...l) => l.join('\n') + '\n';
const nh = (...n) => n.map(x => `Ngoài-${x}`);
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, k) => a + k);
const OOC = require(path.join(KIT, 'lib', 'out-of-contract.cjs'));

// ── DM3: ma trận viết trước. [tên, findingsText, ledgerText, runLogText, chua kỳ vọng] ────────────────────
const T03 = '2026-10-13T03:00:00Z', T08 = '2026-10-13T08:00:00Z', T09 = '2026-10-13T09:00:00Z';
const MA_TRAN = [
  ['1 ma-dung-so', FINDINGS([mucOoc(1), mucOoc(2)]), so(dongMa(1, 1), dongMa(2, 2)), '', []],
  ['2 ma-cu-doi-so', FINDINGS([mucOoc(9), mucOoc(1, { nhan: '(r1)' }), mucOoc(2, { nhan: '(r1)' })]), so(dongMa(1, 1), dongMa(2, 2)), runLog(T03, T08), nh(1)],
  ['3 ma-mat-muc', FINDINGS([mucOoc(3)]), so(dongMa(1, 1)), runLog(T03, T08), nh(1)],
  ['4 trung-ma', FINDINGS([mucOoc(1, { nhan: '(r1)' }), mucOoc(1, { nhan: '(r1)' })]), so(dongMa(1, 1), dongMa(2, 1)), runLog(T03, T08), nh(1, 2)],
  ['5 so-lech-tieu-de', FINDINGS([mucOoc(1), mucOoc(2), mucOoc(3)]), so(dongMa(1, 2), dongMa(3, 3)), '', nh(1, 2)],
  ['6 tuoi-cung-ma', FINDINGS([mucOoc(9), mucOoc(1)]), so(dongMa(1, 1)), runLog(T03, T08), nh(1, 2)],
  ['7 so-sau-luot', FINDINGS([mucOoc(1), mucOoc(2)]), so(dong(1), dong(2)), runLog(T03), []],
  ['8 so-truoc-luot', FINDINGS([mucOoc(1), mucOoc(2)]), so(dong(1), dong(2)), runLog(T03, T08), nh(1, 2)],
  ['9 so-at-hong', FINDINGS([mucOoc(1), mucOoc(2)]), so(dong(1, { id: 'd-hong-1', at: '' }), dong(2, { id: 'd-hong-2', at: 'hom qua' })), runLog(T03), nh(1, 2)],
  ['10 so-khong-tally', FINDINGS([mucOoc(1), mucOoc(2)]), so(dong(1), dong(2)), JSON.stringify({ kind: 'thuoc-vat', ts: T08 }) + '\n', []],
  ['11 khoang-cu', FINDINGS([mucOoc(1), mucOoc(2)]), so(dong(1, { decision: 'Ngoai-1 den Ngoai-2: ghi Known limits' })), runLog(T03, T08), nh(1, 2)],
  ['12 ma-sau-so-cu', FINDINGS([mucOoc(1, { nhan: '(r1)' }), mucOoc(2, { nhan: '(r1)' })]), so(dong(1), dong(2), dongMa(1, 1, { id: 'd-20261013T090000Z-3', at: T09 }), dongMa(2, 2, { id: 'd-20261013T090000Z-4', at: T09 })), runLog(T03, T08), []],
  ['13 at-muon-id-som', FINDINGS([mucOoc(1)]), so(dong(1, { id: 'd-20261013T095800Z-1', at: '2026-10-13T11:00:00Z' })), runLog(T03, '2026-10-13T10:30:00Z'), nh(1)],
  ['14 at-mui-gio', FINDINGS([mucOoc(1)]), so(dong(1, { id: 'd-20261013T120000Z-1', at: '2026-10-13T16:00:00+07:00' })), runLog(T03, '2026-10-13T10:00:00Z'), nh(1)],
  ['15 dao-thu-tu', FINDINGS([mucOoc(1, { nhan: '(r1)' }), mucOoc(2, { nhan: '(r1)' })]), so(dongMa(1, 1, { id: 'd-20261013T090000Z-1', at: T09 }), dongMa(2, 2, { id: 'd-20261013T090000Z-2', at: T09 }), dong(1, { id: 'd-20261013T060000Z-3' }), dong(2, { id: 'd-20261013T060000Z-4' })), runLog(T03, T08), []],
  ['16 vang', null, so(dong(1)), runLog(T03, T08), []],
  ['17 ts-rong', FINDINGS([mucOoc(1)]), so(dong(1)), tally('') + '\n{hong\n', []],
  ['18 tep-dong-khac', FINDINGS([mucOoc(1, { file: 'src/a1.js:14' })]), so(dongMa(1, 1, { tep: 'src/a1.js:12' })), '', []],
];
const SO_HANG_AC3 = 14;
function chayMaTran(lib) {
  const sai = []; let n = 0;
  for (const [ten, f, l, r, ky] of MA_TRAN) {
    n++;
    const c = lib.mucChuaDinhTuyen(f, l, r).chua;
    if (JSON.stringify([...c].sort()) !== JSON.stringify([...ky].sort())) sai.push(`hàng ${ten}: ra ${JSON.stringify(c)}, khai ${JSON.stringify(ky)}`);
  }
  return { sai, n };
}
function banSaoLib(tu, thanh) {
  const d = mkdtempSync(path.join(TMP, 'lib-'));
  cpSync(path.join(KIT, 'lib'), path.join(d, 'lib'), { recursive: true });
  const p = path.join(d, 'lib', 'out-of-contract.cjs'); const src = readFileSync(p, 'utf8');
  const k = src.split(tu).length - 1;
  if (k !== 1) throw new Error(`neo mutant khop ${k} lan trong lib/out-of-contract.cjs: «${tu.slice(0, 70)}»`);
  writeFileSync(p, src.replace(tu, thanh));
  return require(p);
}
// Bản sao scripts + lib + skills (khuôn banSaoMay của hskt): tiêm = [[rel, neo, thay]].
function banSaoMay(tiem = []) {
  const cp = mkdtempSync(path.join(TMP, 'may-'));
  for (const d of ['scripts', 'lib', 'skills', 'commands']) cpSync(path.join(KIT, d), path.join(cp, d), { recursive: true });
  for (const [rel, neo, thay] of tiem) {
    const p = path.join(cp, rel); const src = readFileSync(p, 'utf8');
    const k = src.split(neo).length - 1;
    if (k !== 1) throw new Error(`neo mutant khop ${k} lan trong ${rel}: «${neo.slice(0, 70)}»`);
    writeFileSync(p, src.replace(neo, thay));
  }
  return cp;
}

// S4-r1 t7: E3 ghim «14/14 hàng» — số hàng AC-3 in RIÊNG, đếm riêng; bốn hàng Review Focus in sau.
await ca('DM3 ma-tran', () => {
  const { sai, n } = chayMaTran(OOC);
  const ac3 = MA_TRAN.slice(0, SO_HANG_AC3).filter(([ten]) => !sai.some(s => s.startsWith(`hàng ${ten}:`))).length;
  console.log(`  · số hàng chạy: ${n} (AC-3: ${SO_HANG_AC3} · Review Focus: ${n - SO_HANG_AC3})`);
  if (n !== MA_TRAN.length || MA_TRAN.length !== 18 || SO_HANG_AC3 !== 14) return { loi: `so hang ${n}, khai truoc 18 (AC-3 14)` };
  if (sai.length) return { loi: sai.join(' ; ') };
  return { msg: `— ${ac3}/${SO_HANG_AC3} hàng AC-3 · ${n - SO_HANG_AC3}/${n - SO_HANG_AC3} hàng Review Focus` };
});
const doMaTran = (name, tu, thanh, hang) => ca(name, () => {
  const lanh = chayMaTran(OOC);
  if (lanh.sai.length) return { loi: `ban lanh do truoc: ${lanh.sai.join(' ; ')}` };
  const { sai } = chayMaTran(banSaoLib(tu, thanh));
  const doDung = hang.filter(h => sai.some(s => s.startsWith(`hàng ${h}:`)));
  if (doDung.length !== hang.length) return { loi: `mutant khong lam do du hang ${hang.join(', ')}: ${JSON.stringify(sai)}` };
  return { msg: `— bản sao đỏ đúng hàng ${doDung.join(', ')}` };
});
await doMaTran('DM3-do mo-coi', "if (i >= 0) gan[i] = { dong: e, cach: 'ma' }; else", "if (i < 0 && so[0]) i = so[0] - 1; if (i >= 0) gan[i] = { dong: e, cach: 'ma' }; else", ['3 ma-mat-muc', '4 trung-ma']);
await doMaTran('DM3-do so-tieu-de', 'const k = so.find(n => ung.includes(n - 1));', 'const k = so[0];', ['5 so-lech-tieu-de']);
await doMaTran('DM3-do thoi-diem', 'if (m) t.push(', 'if (false) t.push(', ['13 at-muon-id-som']);

// ── Kho thử làn V (khuôn khoLanV của hskt) ─────────────────────────────────────────────────────────────
const { fileFromTemplate } = await import(pathToFileURL(path.join(KIT, 'tests', 'fixtures', 'from-template.mjs')).href);
const CONTRACT_TPL = path.join(KIT, 'skills', 'acceptance', 'references', 'contract-template.md');
const hopDongV = (slug, status = 'verified') => {
  const t = fileFromTemplate(CONTRACT_TPL, 'CONTRACT-FRONTMATTER-TEMPLATE',
    { feature: `${slug} — fixture`, slug, owner: 'fixture@example.com', risk_tier: 'T2', surfaces: 'cli', status },
    `# Contract: ${slug}\n\n## Criteria\n\n- AC-1: fixture\n\n## Out of scope\n\n- khong co\n\n## Notes\n`);
  return t.replace(/^approved_at:.*$/m, m => [m, 'veto_state: mo', 'veto_opened_at: 2026-08-21T09:00:00Z'].join('\n'));
};
const baoCaoV = (slug, vc, ky = '') => `---\nschema_version: 1\nfeature_slug: ${slug}\nverdict: PASS\nverified_commit: ${vc}\nenforcement_mode: strict\nbypass_used: false\nhuman_signoff: ${ky}\n---\n\n# Evidence Report: ${slug}\n\n## Evidence\n- eval: E1\n  run_id: ${slug}-E1-001\n  exit_code: 0\n  verifier: verify.sh\n  verified_at: 2026-08-21\n\n## Known limits\n\n## Ngoài hợp đồng\n\n`;
function khoLanV(slug, { findings, ledger, rl, status = 'verified', ky = '', config = '' } = {}) {
  const R = mkdtempSync(path.join(TMP, 'k-'));
  execFileSync('git', ['init', '-q', '-b', 'main', R]); git(R, 'config', 'user.email', 'x@y.z'); git(R, 'config', 'user.name', 'x');
  mkdirSync(path.join(R, '_acceptance', slug), { recursive: true });
  writeFileSync(path.join(R, '_acceptance', 'config.yaml'), 'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n    - "*.md"\n' + config);
  writeFileSync(path.join(R, 'verify.sh'), '#!/bin/sh\nexit 0\n');
  mkdirSync(path.join(R, 'src'), { recursive: true }); writeFileSync(path.join(R, 'src', 'app.js'), 'v1\n');
  cpSync(path.join(KIT, 'lib'), path.join(R, 'lib'), { recursive: true });
  mkdirSync(path.join(R, 'scripts'), { recursive: true });
  cpSync(path.join(KIT, 'scripts', 'recheck-evidence.cjs'), path.join(R, 'scripts', 'recheck-evidence.cjs'));
  git(R, 'add', '-A'); git(R, 'commit', '-qm', 'c1'); git(R, 'branch', 'basepoint');
  writeFileSync(path.join(R, 'src', 'app.js'), 'v2\n');
  const d = path.join(R, '_acceptance', slug);
  writeFileSync(path.join(d, 'contract.md'), hopDongV(slug, status));
  git(R, 'add', '-A'); git(R, 'commit', '-qm', 'c2');
  const c2 = git(R, 'rev-parse', 'HEAD');
  writeFileSync(path.join(d, 'evidence-report.md'), baoCaoV(slug, c2, ky));
  if (findings != null) writeFileSync(path.join(d, 'review-findings.md'), findings);
  if (ledger) writeFileSync(path.join(d, 'decisions.jsonl'), ledger);
  if (rl) writeFileSync(path.join(d, 'run-log.jsonl'), rl);
  git(R, 'add', '-A'); git(R, 'commit', '-qm', 'c3');
  return R;
}
const kcn = (R, slug, may = KIT) => { const o = spawnSync(process.execPath, [path.join(may, 'scripts', 'khong-can-nguoi.mjs'), '--check', '--root', R, '--slug', slug], { encoding: 'utf8' }); return { status: o.status, out: (o.stdout || '').trim(), err: (o.stderr || '').trim() }; };

// Ca gốc crm them-buoc-bao-dung (origin aa57e00f8): round-tally r3 02:31:28Z, 8 dòng chỉ số 06:07:54Z.
const R3 = '2026-10-13T02:31:28Z', R4 = '2026-10-13T08:00:00Z';
const CRM_SO = so(...range(1, 8).map(n => dong(n, { id: `d-20261013T060754Z-${17 + n}`, at: '2026-10-13T06:07:54Z', type: 'scope' })));
const CRM_8 = FINDINGS(range(1, 8).map(i => mucOoc(i)));
const CRM_9 = FINDINGS([mucOoc(9), ...range(1, 8).map(i => mucOoc(i, { nhan: '(r3)' }))]);
// Đổi thứ tự không đổi số mục: một mục cũ mất, một mục mới vào đầu — luật cũ coi cả 8 là đã quyết.
const DOI_8 = FINDINGS([mucOoc(9), ...range(1, 7).map(i => mucOoc(i, { nhan: '(r3)' }))]);
const MA_8 = so(...range(1, 8).map(n => dongMa(n, n)));
const MA_9 = FINDINGS([mucOoc(9), ...range(1, 8).map(i => mucOoc(i, { nhan: '(r1)' }))]);

await ca('DM1 doi-chung', () => {
  const r = kcn(khoLanV('dm1a', { findings: CRM_8, ledger: MA_8, rl: runLog(T03) }), 'dm1a');
  return r.status === 0 && r.out.includes('sẽ machine-cleared') ? { msg: `— 8 mục, 8 dòng có mã: thoát 0 «${r.out}»` } : { loi: `thoat ${r.status}: ${r.err || r.out}` };
});
const kiemDoiSo = (findings, may = KIT) => {
  const r = kcn(khoLanV('dm1b', { findings, ledger: MA_8, rl: runLog(T03, T08) }), 'dm1b', may);
  if (r.status !== 2 || !r.err.includes('chưa người định tuyến: Ngoài-1') || r.err.includes('Ngoài-2')) return `thoat ${r.status}: ${r.err || r.out}`;
  return null;
};
await ca('DM1 doi-so', () => { const e = kiemDoiSo(MA_9); return e ? { loi: e } : { msg: '— mục mới chèn đầu là mục DUY NHẤT chưa định tuyến' }; });
await ca('DM1 nhan-luot', () => { const e = kiemDoiSo(FINDINGS([mucOoc(9), ...range(1, 8).map(i => mucOoc(i, { nhan: '(r1 · tệp đã đổi)' }))])); return e ? { loi: e } : { msg: '— nhãn «(r1 · tệp đã đổi)» vẫn khớp' }; });
await ca('DM1 tuoi', () => {
  const f = FINDINGS([mucOoc(3), ...range(1, 8).map(i => mucOoc(i, { nhan: '(r1)' }))]);
  const r = kcn(khoLanV('dm1c', { findings: f, ledger: MA_8, rl: runLog(T03, T08) }), 'dm1c');
  return r.status === 2 && r.err.includes('chưa người định tuyến: Ngoài-1') && !r.err.includes('Ngoài-4') ? { msg: '— mục tươi cùng mã với mục đã quyết vẫn hỏi lại' } : { loi: `thoat ${r.status}: ${r.err || r.out}` };
});
await ca('DM1-do theo-so', () => {
  if (kiemDoiSo(MA_9)) return { loi: 'ban lanh do truoc' };
  const may = banSaoMay([['lib/out-of-contract.cjs', '    if (td) {', '    if (false) {']]);
  const e = kiemDoiSo(MA_9, may);
  return e ? { msg: `— bỏ mã, khớp theo số: «${e.slice(0, 140)}» (khớp theo số coi mục mới là đã quyết)` } : { loi: 'mutant van xanh' };
});

const kiemCrm = (may = KIT) => {
  const r = kcn(khoLanV('dm2', { findings: CRM_9, ledger: CRM_SO, rl: runLog(R3, R4) }), 'dm2', may);
  const thieu = range(1, 9).filter(n => !r.err.includes(`Ngoài-${n}`));
  if (r.status !== 2 || thieu.length || !r.err.includes('ghi trước lượt chấm')) return `thoat ${r.status}, thieu Ngoài-${thieu.join(',')}: ${r.err || r.out}`;
  return null;
};
await ca('DM2 doc-cu', () => {
  const r = kcn(khoLanV('dm2a', { findings: CRM_8, ledger: CRM_SO, rl: runLog(R3) }), 'dm2a');
  return r.status === 0 ? { msg: '— 8 dòng chỉ số ghi sau lượt chấm cuối: đi như hôm nay' } : { loi: `thoat ${r.status}: ${r.err}` };
});
await ca('DM2 ca-crm', () => { const e = kiemCrm(); return e ? { loi: e } : { msg: '— cả 9 mục chưa định tuyến, nêu «ghi trước lượt chấm»' }; });
await ca('DM2-do bo-thoi-diem', () => {
  if (kiemCrm()) return { loi: 'ban lanh do truoc' };
  const may = banSaoMay([['lib/out-of-contract.cjs', 'laCu = cu(e);', 'laCu = false;']]);
  const r = kcn(khoLanV('dm2b', { findings: CRM_9, ledger: CRM_SO, rl: runLog(R3, R4) }), 'dm2b', may);
  return r.status === 2 && r.err.includes('Ngoài-9') && !r.err.includes('ghi trước lượt chấm') ? { msg: '— bỏ phép so giờ: chỉ còn Ngoài-9 (dòng cũ vẫn được tin)' } : { loi: `mutant: thoat ${r.status} ${r.err}` };
});

// ── DM4: lưới × bộ quét trên 14 hàng AC-3 ──────────────────────────────────────────────────────────────
const luoi = (R, may = KIT) => { const o = spawnSync('bash', [path.join(may, 'scripts', 'pre-merge-check.sh'), R, '--base', 'basepoint'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }); return { status: o.status, out: (o.stdout || '') + (o.stderr || '') }; };
const quet = (R, may = KIT) => JSON.parse(execFileSync(process.execPath, [path.join(may, 'scripts', 'start-scan.mjs'), '--root', R], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
await ca('DM4 luoi', () => {
  const sai = []; let chan = 0, qua = 0;
  MA_TRAN.slice(0, SO_HANG_AC3).forEach(([ten, f, l, r, ky], i) => {
    const slug = `dm4-${i + 1}`; const R = khoLanV(slug, { findings: f, ledger: l, rl: r });
    const o = luoi(R); const c = new RegExp(`^VIOLATION \\[${slug}\\]`, 'm').test(o.out); const nv = new RegExp(`^NOTE \\[${slug}\\]: làn V — máy đi trước`, 'm').test(o.out);
    if (o.status == null || o.status === 2) sai.push(`${ten}: luoi exit ${o.status}`);
    else if (ky.length && !c) sai.push(`${ten}: ky vong VIOLATION`);
    else if (!ky.length && (c || !nv)) sai.push(`${ten}: ky vong NOTE lan V — ${o.out.split('\n').filter(x => x.includes(slug)).slice(0, 2).join(' | ')}`);
    const d = (quet(R).groups.done || []).find(x => x.slug === slug);
    if (c && d && /^may-di-tiep/.test(d.stateKey)) sai.push(`${ten}: luoi chan ma bo quet xep ${d.stateKey}`);
    if (!c && !(d && /^may-di-tiep/.test(d.stateKey))) sai.push(`${ten}: luoi qua ma bo quet khong xep may-di-tiep`);
    c ? chan++ : qua++;
  });
  console.log(`  · lưới chặn ${chan} hàng · NOTE làn V ${qua} hàng`);
  return sai.length ? { loi: sai.join(' ; ') } : { msg: `— ${SO_HANG_AC3}/${SO_HANG_AC3} hàng: lưới và bộ quét cùng câu trả lời` };
});
await ca('DM4 machine-cleared', () => {
  const o = luoi(khoLanV('dm4mc', { findings: CRM_9, ledger: CRM_SO, rl: runLog(R3, R4), status: 'machine-cleared' }));
  const l = o.out.split('\n').find(x => x.startsWith('VIOLATION [dm4mc]: status machine-cleared')) || '';
  return l.includes('chưa người định tuyến') ? { msg: '— hồ sơ máy-thông đứng trên dòng cũ bị chặn có tên' } : { loi: `khong co VIOLATION machine-cleared: ${o.out.split('\n').filter(x => x.includes('dm4mc')).join(' | ')}` };
});
await ca('DM4 da-ky', () => {
  const o = luoi(khoLanV('dm4ky', { findings: CRM_9, ledger: CRM_SO, rl: runLog(R3, R4), ky: 'manh 2026-10-13' }));
  const l = o.out.split('\n').filter(x => x.startsWith('VIOLATION [dm4ky]') && x.includes('chưa người định tuyến'));
  return l.length ? { loi: l.join(' | ') } : { msg: '— hồ sơ đã ký không đổi màu' };
});
// S4-r1 t1/t3: người định tuyến lại THEO MÃ sau khi mục đổi số — bản mjs (ba đối số) cho sạch; lưới phải cho
// CÙNG câu trả lời (NOTE làn V) và bộ quét xếp máy-đi-tiếp. Lượt 1: khối lưới cũ gọi hai đối số → chặn oan.
const DINH_LAI = { findings: FINDINGS([mucOoc(9), mucOoc(1, { nhan: '(r1)' })]), ledger: so(dongMa(1, 1, { id: 'd-20261013T100000Z-1', at: '2026-10-13T10:00:00Z' }), dongMa(1, 9, { id: 'd-20261013T120000Z-2', at: '2026-10-13T12:00:00Z' })), rl: runLog(T03, '2026-10-13T11:00:00Z') };
await ca('DM4 dinh-lai-theo-ma', () => {
  const R = khoLanV('dm4dl', DINH_LAI); const o = luoi(R);
  const nv = /^NOTE \[dm4dl\]: làn V — máy đi trước/m.test(o.out), c = /^VIOLATION \[dm4dl\]/m.test(o.out);
  const d = (quet(R).groups.done || []).find(x => x.slug === 'dm4dl');
  const mjs = kcn(R, 'dm4dl');
  if (c || !nv) return { loi: `luoi: ${o.out.split('\n').filter(x => x.includes('dm4dl')).slice(0, 2).join(' | ')}` };
  if (!(d && /^may-di-tiep/.test(d.stateKey)) || mjs.status !== 0) return { loi: `bo quet ${d ? d.stateKey : '-'} · mjs thoat ${mjs.status}` };
  return { msg: '— lưới NOTE làn V · bộ quét máy-đi-tiếp · khong-can-nguoi thoát 0: ba bên cùng một câu trả lời' };
});
await ca('DM4-do dinh-lai-hai-doi-so', () => {
  const R = khoLanV('dm4dl2', DINH_LAI);
  if (/^VIOLATION \[dm4dl2\]/m.test(luoi(R).out)) return { loi: 'ban lanh chan' };
  const may = banSaoMay([['scripts/pre-merge-check.sh', '      const m=mucChuaDinhTuyen(a[0],a[1],a[2]);', '      const m=mucChuaDinhTuyen(a[0],a[1]);']]);
  const l = luoi(R, may).out.split('\n').find(x => x.startsWith('VIOLATION [dm4dl2]')) || '';
  return l.includes('chưa người định tuyến: Ngoài-2') ? { msg: `— lưới hai đối số chặn oan: «${l.slice(0, 120)}»` } : { loi: `mutant khong chan dung: ${l}` };
});
await ca('DM4-do luoi-khong-truyen-runlog', () => {
  const R = khoLanV('dm4do', { findings: DOI_8, ledger: CRM_SO, rl: runLog(R3, R4) });
  if (!/^VIOLATION \[dm4do\]/m.test(luoi(R).out)) return { loi: 'ban lanh khong chan doi-thu-tu' };
  const may = banSaoMay([['scripts/pre-merge-check.sh', '"$_cdir/decisions.jsonl" "$_cdir/run-log.jsonl"', '"$_cdir/decisions.jsonl" "$_cdir/khong-co.jsonl"']]);
  return /^NOTE \[dm4do\]: làn V — máy đi trước/m.test(luoi(R, may).out) ? { msg: '— bỏ truyền run-log: hồ sơ đổi thứ tự thành NOTE làn V (lưới mù dòng cũ)' } : { loi: 'mutant van chan' };
});

// ── DM5: bên gọi luật xanh-sạch ────────────────────────────────────────────────────────────────────────
const BEN_GOI_RE = /\b(xanhSach|khongCanNguoi)\(/;
const benGoi = () => readdirSync(path.join(KIT, 'scripts')).filter(f => /\.(mjs|cjs|js)$/.test(f)).filter(f => BEN_GOI_RE.test(readFileSync(path.join(KIT, 'scripts', f), 'utf8'))).sort();
const CA_DM5 = {
  'khong-can-nguoi.mjs': may => { const r = kcn(khoLanV('b5c', { findings: DOI_8, ledger: CRM_SO, rl: runLog(R3, R4) }), 'b5c', may); return r.status === 2 && /chưa người định tuyến/.test(r.err) ? null : `CLI thoat ${r.status}: ${r.err}`; },
  'start-scan.mjs': may => { const j = quet(khoLanV('b5q', { findings: DOI_8, ledger: CRM_SO, rl: runLog(R3, R4) }), may); const d = (j.groups.done || []).find(x => x.slug === 'b5q'); return d && /^may-di-tiep/.test(d.stateKey) ? `bo quet xep ${d.stateKey}` : null; },
  'product-map.mjs': async may => { const R = khoLanV('b5m', { findings: DOI_8, ledger: CRM_SO, rl: runLog(R3, R4), status: 'machine-cleared' }); const { renderProductMap } = await import(pathToFileURL(path.join(may, 'scripts', 'product-map.mjs')).href + `?v=${Math.random()}`); return /`b5m` — không đọc được hồ sơ/.test(renderProductMap(R)) ? null : 'ban do khong goi b5m la ho so hong'; },
};
await ca('DM5 thieu-khoa', async () => {
  const KCN = await import(pathToFileURL(path.join(KIT, 'scripts', 'khong-can-nguoi.mjs')).href);
  try { KCN.xanhSach(hopDongV('x'), baoCaoV('x', '0'.repeat(40)), { findings: null, ledger: null }); } catch (e) { return /runLog/.test(e.message) ? { msg: `— «${e.message.slice(0, 90)}»` } : { loi: `nem sai thong diep: ${e.message}` }; }
  return { loi: 'khong nem khi thieu runLog' };
});
await ca('DM5 ben-goi', async () => {
  const ds = benGoi(); const sai = [];
  if (ds.length < 3) sai.push(`quet ra ${ds.length} ben goi — phep rut hong`);
  for (const f of ds) { if (!CA_DM5[f]) { sai.push(`ben goi chua co ca: ${f}`); continue; } const e = await CA_DM5[f](KIT); if (e) sai.push(`${f}: ${e}`); }
  return sai.length ? { loi: sai.join(' ; ') } : { msg: `— ${ds.length} bên gọi (${ds.join(', ')}) đều ra «còn cần người»` };
});
await ca('DM5-do', async () => {
  const ds = benGoi().filter(f => CA_DM5[f]); const sai = [];
  for (const f of ds) {
    if (await CA_DM5[f](KIT)) { sai.push(`${f}: ban lanh do truoc`); continue; }
    const src = readFileSync(path.join(KIT, 'scripts', f), 'utf8');
    const k = src.split("'run-log.jsonl'").length - 1;
    if (k !== 1) { sai.push(`${f}: chuoi 'run-log.jsonl' xuat hien ${k} lan`); continue; }
    if (!(await CA_DM5[f](banSaoMay([[`scripts/${f}`, "'run-log.jsonl'", "'khong-co.jsonl'"]])))) sai.push(`${f}: mutant bo truyen runLog ma ca van xanh`);
  }
  return sai.length ? { loi: sai.join(' ; ') } : { msg: `— ${ds.length} mutant (mỗi bên gọi bỏ run-log) đều đỏ` };
});

// ── DM6: máy định tuyến ───────────────────────────────────────────────────────────────────────────────
const CFG_BAT = 'feature_loop:\n  ngoai_n_tu_dinh_tuyen: true\n';
const dtm = (R, slug, may = KIT) => { const o = spawnSync(process.execPath, [path.join(may, 'scripts', 'dinh-tuyen-may.cjs'), '--write', '--root', R, '--slug', slug], { encoding: 'utf8' }); return { status: o.status, out: (o.stdout || '').trim(), err: (o.stderr || '').trim() }; };
const docHs = (R, slug, f) => { try { return readFileSync(path.join(R, '_acceptance', slug, f), 'utf8'); } catch { return null; } };
await ca('DM6 may-doi-so', () => {
  const dm = JSON.stringify({ id: 'd-20261013T060000Z-1', type: 'revisit', stage: 'gate2', at: '2026-10-13T06:00:00Z', decision: 'Ngoài-1: ghi Known limits', why: 'may', cost_if_wrong: 'x', may: 'dinh-tuyen-ngoai-n', tieu_de: 'loi that so 1', dao: 'x' }) + '\n';
  const R = khoLanV('dm6a', { findings: FINDINGS([mucOoc(9), mucOoc(1, { nhan: '(r1)' })]), ledger: dm, rl: runLog(T03, T08), config: CFG_BAT });
  const r = dtm(R, 'dm6a');
  const moi = (docHs(R, 'dm6a', 'decisions.jsonl') || '').trim().split('\n').slice(1).map(x => JSON.parse(x));
  if (r.status !== 0 || r.err.includes('dòng máy trỏ mục đã đổi')) return { loi: `thoat ${r.status}: ${r.err}` };
  if (moi.length !== 1 || moi[0].decision !== 'Ngoài-1: ghi Known limits' || moi[0].tieu_de !== 'loi that so 9') return { loi: `so them ${JSON.stringify(moi)}` };
  return { msg: '— dòng máy cũ khớp mục đã đổi số; đúng 1 dòng mới cho mục mới' };
});
const NGUOI_CU = so(dong(1), dong(2));
const kiemNguoiCu = (may = KIT) => {
  const R = khoLanV('dm6b', { findings: FINDINGS([mucOoc(9), mucOoc(1, { nhan: '(r1)' }), mucOoc(2, { nhan: '(r1)' })]), ledger: NGUOI_CU, rl: runLog(T03, T08), config: CFG_BAT });
  const truoc = [bam(docHs(R, 'dm6b', 'decisions.jsonl')), bam(docHs(R, 'dm6b', 'contract.md'))];
  const r = dtm(R, 'dm6b', may);
  const sau = [bam(docHs(R, 'dm6b', 'decisions.jsonl')), bam(docHs(R, 'dm6b', 'contract.md'))];
  return { r, giu: truoc.join() === sau.join() };
};
await ca('DM6 nguoi-cu', () => {
  const { r, giu } = kiemNguoiCu();
  return r.status === 2 && r.err.startsWith('dinh-tuyen-may:') && r.err.includes('ghi trước lượt chấm') && giu ? { msg: `— «${r.err.slice(0, 110)}», 0 byte đổi` } : { loi: `thoat ${r.status} giu=${giu}: ${r.err || r.out}` };
});
await ca('DM6-do bo-chan-cu', () => {
  const l = kiemNguoiCu(); if (l.r.status !== 2) return { loi: 'ban lanh khong chan' };
  const may = banSaoMay([['scripts/dinh-tuyen-may.cjs', 'if (g.soCu.length && chuaCo) return', 'if (false) return']]);
  const { r, giu } = kiemNguoiCu(may);
  return r.status === 0 && !giu ? { msg: '— bỏ chặn: máy ghè lên quyết định theo số cũ (sổ đổi)' } : { loi: `mutant thoat ${r.status} giu=${giu}` };
});

// ── DM7: thẻ Cổng 2 ────────────────────────────────────────────────────────────────────────────────────
const the = (R, slug, may = KIT, ex = false) => execFileSync(process.execPath, [path.join(may, 'scripts', 'gate-card.js'), '--root', R, '--slug', slug, ...(ex ? ['--extract'] : [])], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const kiemCoVang = (may = KIT) => {
  const R = khoLanV('dm7', { findings: CRM_9, ledger: CRM_SO, rl: runLog(R3, R4) });
  const html = the(R, 'dm7', may); const j = JSON.parse(the(R, 'dm7', may, true));
  const co = html.split('\n').find(x => x.includes('ghi trước lượt chấm')) || '';
  const thieu = range(2, 9).filter(n => !co.includes(`Ngoài-${n}`));
  if (!co || thieu.length || !co.includes(R4)) return `co «${co.slice(0, 200)}» thieu Ngoài-${thieu.join(',')}`;
  const hoiThieu = range(1, 9).filter(n => !j.routing.hoi.includes(`Ngoài-${n}`));
  return hoiThieu.length ? `routing.hoi thieu ${hoiThieu.join(',')}` : null;
};
await ca('DM7 co-vang', () => { const e = kiemCoVang(); return e ? { loi: e } : { msg: '— cờ nêu nhãn + giờ lượt chấm; 9 mục là ô hỏi' }; });
await ca('DM7 khong-co', () => {
  const R = khoLanV('dm7b', { findings: CRM_8, ledger: MA_8, rl: runLog(T03) });
  return the(R, 'dm7b').includes('ghi trước lượt chấm') ? { loi: 'the co co khi khong co dong cu' } : { msg: '— không dòng cũ, không cờ' };
});
await ca('DM7-do', () => {
  if (kiemCoVang()) return { loi: 'ban lanh do truoc' };
  const may = banSaoMay([['scripts/gate-card.js', 'if (dtmCu) P.push(', 'if (false) P.push(']]);
  const e = kiemCoVang(may);
  return e ? { msg: `— bỏ cờ: ${e.slice(0, 80)} (thẻ im về dòng cũ)` } : { loi: 'mutant van xanh' };
});

// ── DM8: khứ hồi khuôn signoff → bộ phân giải ─────────────────────────────────────────────────────────
const KHOA_DM8 = ['id', 'type', 'stage', 'at', 'decision', 'tieu_de', 'tep'];
function khuHoi(src) {
  const kh = khuonSignoff(src);
  const p = OOC.parse(CRM_8).findings;
  const dongs = p.map((f, i) => `{"id":"d-20261013T060000Z-${i + 1}",` + kh.replace(/<([^>]+)>/g, (_, k) => ({ ISO: '2026-10-13T06:00:00Z', n: String(i + 1), 'chữ người': 'ghi Known limits', 'vì sao, 1 câu': 'nguoi chon', 'giá, 1 câu': 'x', 'tiêu đề mục': f.title, 'file của mục': f.file }[k] ?? `<${k}>`)) + '}');
  const doc = dongs.map(x => JSON.parse(x));
  const thieu = KHOA_DM8.filter(k => !(k in doc[0]));
  const c = OOC.mucChuaDinhTuyen(MA_9.replace(/\(r1\)/g, '(r1)'), dongs.join('\n') + '\n', runLog(T03, T08)).chua;
  return { c, thieu };
}
await ca('DM8 khu-hoi', () => {
  const { c, thieu } = khuHoi(NHAN_SIGNOFF);
  if (thieu.length) return { loi: `dong dien thieu khoa ${thieu.join(',')}` };
  return JSON.stringify(c) === JSON.stringify(['Ngoài-1']) ? { msg: '— 8 dòng theo khuôn signoff, mục mới đầu: chỉ Ngoài-1 chưa định tuyến' } : { loi: `chua=${JSON.stringify(c)}` };
});
await ca('DM8-do bo-tieu-de', () => {
  const NEO = ',"tieu_de":"<tiêu đề mục>"';
  if (NHAN_SIGNOFF.split(NEO).length - 1 !== 1) return { loi: 'neo mutant khong khop dung 1 lan trong signoff.md' };
  const { c } = khuHoi(NHAN_SIGNOFF.replace(NEO, ''));
  return c.length === 9 ? { msg: '— khuôn không mang mã: cả 9 mục chưa định tuyến' } : { loi: `mutant chua=${JSON.stringify(c)}` };
});

// ── DM9: vi phân trên cây kit, mốc cố định ──────────────────────────────────────────────────────────────
const TAP_KHAI = ['tac-tu-cham-chi-cham-khong'];
const MOC = (() => {
  try {
    const dau = git(KIT, 'log', '--reverse', '--format=%H', '-S', 'ganDinhTuyen', '--', 'lib/out-of-contract.cjs').split('\n').filter(Boolean)[0];
    return dau ? git(KIT, 'rev-parse', `${dau}^`) : null;
  } catch { return null; }
})();
const cayMoc = () => {
  const d = mkdtempSync(path.join(TMP, 'moc-'));
  execFileSync('tar', ['-x', '-C', d], { input: execFileSync('git', ['-C', KIT, 'archive', MOC, '_acceptance', 'lib'], { maxBuffer: 1024 * 1024 * 1024 }) });
  return d;
};
function tapDoi(libA, libB, goc) {
  const out = [];
  for (const s of readdirSync(path.join(goc, '_acceptance')).sort()) {
    const d = path.join(goc, '_acceptance', s);
    const rd = f => { try { return readFileSync(path.join(d, f), 'utf8'); } catch { return null; } };
    const f = rd('review-findings.md'); if (f == null || /^human_signoff:[ \t]*\S/m.test(rd('evidence-report.md') || '')) continue;
    const a = libA.mucChuaDinhTuyen(f, rd('decisions.jsonl'), rd('run-log.jsonl')).chua, b = libB.mucChuaDinhTuyen(f, rd('decisions.jsonl'), rd('run-log.jsonl')).chua;
    if (JSON.stringify(a) !== JSON.stringify(b)) out.push(s);
  }
  return out;
}
await ca('DM9 chon-moc', () => {
  if (!MOC) return { loi: 'khong rut duoc moc (commit dau dua ganDinhTuyen vao lib)' };
  if (MOC === git(KIT, 'rev-parse', 'HEAD')) return { loi: 'moc trung HEAD' };
  const libMoc = execFileSync('git', ['-C', KIT, 'show', `${MOC}:lib/out-of-contract.cjs`], { encoding: 'utf8' });
  return libMoc.includes('ganDinhTuyen') ? { loi: 'lib cua moc da co ganDinhTuyen' } : { msg: `— mốc ${MOC.slice(0, 12)}` };
});
await ca('DM9 vi-phan', () => {
  const g = cayMoc(); const libMoc = require(path.join(g, 'lib', 'out-of-contract.cjs'));
  const doi = tapDoi(OOC, libMoc, g);
  console.log(`  · tập đổi: ${JSON.stringify(doi)} · tập khai: ${JSON.stringify(TAP_KHAI)}`);
  return JSON.stringify(doi) === JSON.stringify(TAP_KHAI) ? { msg: '— tập đổi == tập khai' } : { loi: `tap doi ${JSON.stringify(doi)} != khai ${JSON.stringify(TAP_KHAI)}` };
});
await ca('DM9 luoi-cay', () => {
  const R = mkdtempSync(path.join(TMP, 'cay-'));
  execFileSync('git', ['init', '-q', '-b', 'main', R]); git(R, 'config', 'user.email', 'x@y.z'); git(R, 'config', 'user.name', 'x');
  mkdirSync(path.join(R, '_acceptance'), { recursive: true });
  writeFileSync(path.join(R, '_acceptance', 'config.yaml'), 'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n');
  cpSync(path.join(KIT, 'lib'), path.join(R, 'lib'), { recursive: true });
  for (const s of TAP_KHAI) cpSync(path.join(KIT, '_acceptance', s), path.join(R, '_acceptance', s), { recursive: true });
  git(R, 'add', '-A'); git(R, 'commit', '-qm', 'c');
  const o = spawnSync('bash', [path.join(KIT, 'scripts', 'pre-merge-check.sh'), R], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const l = ((o.stdout || '') + (o.stderr || '')).split('\n').filter(x => /^VIOLATION \[/.test(x) && x.includes('chưa người định tuyến') && TAP_KHAI.some(s => x.includes(`[${s}]`)));
  return l.length ? { loi: l.join(' | ') } : { msg: `— ${TAP_KHAI.length} hồ sơ tập khai không bị chặn vì «chưa người định tuyến»` };
});
await ca('DM9-do', () => {
  const g = cayMoc(); const libMoc = require(path.join(g, 'lib', 'out-of-contract.cjs'));
  const doi = tapDoi(libMoc, libMoc, g);
  return doi.length === 0 ? { msg: '— lib mốc tự so: tập đổi rỗng ≠ tập khai (phép vi phân phân biệt được)' } : { loi: `tu so ra ${JSON.stringify(doi)}` };
});

rmSync(TMP, { recursive: true, force: true });
console.log(`DM Results: ${pass} pass, ${fail} fail`);
process.exit(fail ? 1 : 0);
