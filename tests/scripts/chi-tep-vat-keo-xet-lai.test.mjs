// chi-tep-vat-keo-xet-lai.test.mjs — hồ sơ chi-tep-vat-keo-xet-lai (vòng vá 2.36.2, issue #468).
// Tên ca = «TV<k> <tên>»; chiều đỏ «TV<k>-do <tên>», đối chứng «TV<k>-doi-chung <tên>». Ca đỏ chạy CHÍNH lưới trước
// gộp trên bản gốc thật (main 115100b6, dựng trọn thư mục bằng git archive) hoặc trên bản sao bị tiêm ở nhánh
// STALE-TEP-CHU-GUARD — SAU khi bản chưa tiêm xanh trên cùng kho — và ghim thông điệp.
//   TV1  PR chỉ sửa tệp chữ của hồ sơ cũ — không xét bằng chứng cũ, một dòng NOTE đích danh
//   TV2  PR sửa tệp vật (hay tệp lạ) của hồ sơ cũ — vẫn VIOLATION «evidence is stale»
//   TV3  hồ sơ tươi — xanh ở cả hai ca
//   TV4  paths của eval phủ tệp chữ (hay không đọc được) — tệp chữ thành vật; đối chứng paths không phủ
//   TV5  gap-probe và soi lại vẫn xét hồ sơ chỉ sửa tệp chữ
//   TV6  bộ phân tệp không phân được (hàm vắng · đầu ra hỏng) — lùi về tệp vật, xét lại như trước vòng
// Kho thử do CODE SINH trong lượt; đường dẫn suy từ vị trí tệp.
// Chọn ca: đối số dòng lệnh (`node chi-tep-vat-keo-xet-lai.test.mjs TV1 TV4`) hoặc TV_CASES=a,b.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const TMP = mkdtempSync(path.join(tmpdir(), 'tv-'));
let pass = 0; let fail = 0;
const ok = (name, msg = '') => { pass += 1; console.log(`PASS: ${name} ${msg}`.trimEnd() + ' '); };
const bad = (name, msg) => { fail += 1; console.log(`FAIL: ${name} — ${msg}`); };
const loi = e => String((e && (e.stderr || e.message)) || e).split('\n').slice(0, 4).join(' | ');
const CHON = [...process.argv.slice(2), ...(process.env.TV_CASES ? process.env.TV_CASES.split(',') : [])];
const want = name => !CHON.length || CHON.includes(name) || CHON.includes(name.split(' ')[0]);
const ca = async (name, fn) => { if (!want(name)) return; try { const r = await fn(); if (r && r.loi) bad(name, r.loi); else ok(name, r && r.msg ? r.msg : ''); } catch (e) { bad(name, loi(e)); } };
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 256 * 1024 * 1024 }).trim();

// Thông điệp ghim nguyên văn.
const MSG_STALE = 'evidence is stale';
const MSG_NOTE = 'sửa tệp chữ, không xét bằng chứng cũ — PR chỉ đổi ';
const MSG_GAP = 'chưa qua phản biện context sạch (gap-probe)';
const MSG_RECHECK = 'committed evidence fails re-check (recheck: strict)';
// Bản gốc thật: main ngay trước vòng. CI của kit checkout fetch-depth: 0.
const GOC_SHA = '115100b6';

// ── Kho thử ─────────────────────────────────────────────────────────────────────────────────────────────
// Hồ sơ `old` (đã ký) ghim commit đầu; mã `src/app.js` đổi ở nhánh chính SAU lần ghim → basepoint. PR là các
// commit sau basepoint. opts: sau (đặt _acceptance/ dưới `pkg/`), staleScope ('paths'), evals (nội dung evals.yaml
// của old, cam kết từ đầu), cfg (dòng config thêm), runLogKhac (run-log.jsonl mang run_id khác báo cáo), tuoi
// (hồ sơ `fresh` ghim đỉnh basepoint).
function kho(opts = {}) {
  const R = mkdtempSync(path.join(TMP, 'k-'));
  execFileSync('git', ['init', '-q', '-b', 'main', R]); git(R, 'config', 'user.email', 'x@y.z'); git(R, 'config', 'user.name', 'x');
  const G = opts.sau ? path.join(R, 'pkg') : R;
  const A = path.join(G, '_acceptance');
  const slugs = opts.tuoi ? ['fresh'] : ['old'];
  for (const s of slugs) mkdirSync(path.join(A, s), { recursive: true });
  const cfg = ['schema_version: 1', ...(opts.cfg || []), 'risk_tiers:', '  t1_skip_globs:', '    - "docs/**"'];
  if (opts.staleScope) cfg.push(`  stale_scope: ${opts.staleScope}`);
  writeFileSync(path.join(A, 'config.yaml'), cfg.join('\n') + '\n');
  writeFileSync(path.join(G, 'verify.sh'), '#!/bin/sh\nexit 0\n');
  mkdirSync(path.join(G, 'src'), { recursive: true }); writeFileSync(path.join(G, 'src', 'app.js'), 'v1\n');
  for (const s of slugs) {
    const d = path.join(A, s);
    writeFileSync(path.join(d, 'contract.md'), `---\nschema_version: 1\nfeature: ${s}\nslug: ${s}\nrisk_tier: T2\nsurfaces: [api]\nstatus: signed-off\napproved_by: Manh Phan\napproved_at: 2026-06-10\n---\n\n# ${s}\n`);
    writeFileSync(path.join(d, 'opportunity.md'), `---\nslug: ${s}\n---\n\n- Timebox: 2026-11-01\n`);
    writeFileSync(path.join(d, 'decisions.jsonl'), '');
    mkdirSync(path.join(d, 'rang'), { recursive: true }); writeFileSync(path.join(d, 'rang', 'do.mjs'), '// v1\n');
    if (opts.evals) writeFileSync(path.join(d, 'evals.yaml'), opts.evals.replaceAll('<slug>', s));
  }
  git(R, 'add', '-A'); git(R, 'commit', '-qm', 'c1');
  const c1 = git(R, 'rev-parse', 'HEAD');
  for (const s of slugs) {
    const d = path.join(A, s);
    writeFileSync(path.join(d, 'evidence-report.md'), `---\nschema_version: 1\nfeature_slug: ${s}\nverdict: PASS\nverified_commit: ${opts.tuoi ? '<pin>' : c1}\nhuman_signoff: Manh 2026-08-01\n---\n\n## Evidence\n- eval: E1\n  run_id: ${s}-E1-001\n  exit_code: 0\n  verifier: verify.sh\n  verified_at: 2026-08-01\n`);
    if (opts.runLogKhac) writeFileSync(path.join(d, 'run-log.jsonl'), '{"run_id":"khac-001","kind":"eval"}\n');
  }
  git(R, 'add', '-A'); git(R, 'commit', '-qm', 'c2-evidence');
  writeFileSync(path.join(G, 'src', 'app.js'), 'v2\n');
  git(R, 'add', '-A'); git(R, 'commit', '-qm', 'c3-ma-troi');
  if (opts.tuoi) {
    const p = path.join(A, 'fresh', 'evidence-report.md');
    writeFileSync(p, readFileSync(p, 'utf8').replace('<pin>', git(R, 'rev-parse', 'HEAD')));
    git(R, 'add', '-A'); git(R, 'commit', '-qm', 'c4-ghim-lai');
  }
  git(R, 'branch', 'basepoint');
  return { R, G, A };
}
// PR: sửa các tệp nêu tên (đường tương đối thư mục hồ sơ) rồi commit.
function pr(k, slug, tep) {
  for (const t of tep) {
    const p = path.join(k.A, slug, t);
    mkdirSync(path.dirname(p), { recursive: true });
    const cu = existsSync(p) ? readFileSync(p, 'utf8') : '';
    writeFileSync(p, cu + (t.endsWith('.jsonl') ? '{"id":"d-1","type":"approach"}\n' : t.endsWith('.yaml') ? '# sửa\n' : '- sửa chữ\n'));
  }
  git(k.R, 'add', '-A'); git(k.R, 'commit', '-qm', 'pr');
  return k;
}
function luoi(k, may = KIT) {
  const o = spawnSync('bash', [path.join(may, 'scripts', 'pre-merge-check.sh'), k.G, '--base', 'basepoint'],
    { cwd: TMP, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, env: { ...process.env, PRE_MERGE_BASE: '' } });
  return { status: o.status, out: (o.stdout || '') + (o.stderr || '') };
}
const dong = (o, slug) => o.out.split('\n').filter(l => l.includes(`[${slug}]`));
const coStale = (o, slug) => dong(o, slug).some(l => l.startsWith(`VIOLATION [${slug}]: ${MSG_STALE}`)) && o.out.includes('src/app.js');
const noteChu = (o, slug) => dong(o, slug).filter(l => l.startsWith(`NOTE [${slug}]: ${MSG_NOTE}`));
const tomTat = (o, slug) => `thoat ${o.status}: ${dong(o, slug).slice(0, 4).map(l => l.slice(0, 120)).join(' | ')}`;
// Im đúng = mã 0, không stale, đúng MỘT dòng NOTE tệp chữ chứa tên mọi tệp chữ đã đổi.
const imDung = (o, slug, tep) => {
  const n = noteChu(o, slug);
  return o.status === 0 && !coStale(o, slug) && n.length === 1 && tep.every(t => n[0].includes(t));
};
// Đỏ đúng = mã ≠ 0, stale nêu src/app.js, không dòng NOTE tệp chữ.
const doDung = (o, slug) => o.status !== 0 && coStale(o, slug) && noteChu(o, slug).length === 0;

const THU_MUC_MAY = ['scripts', 'lib', 'skills', 'commands'];
// Bản sao máy (trọn thư mục): tiem = [[rel, neo, thay]]; mỗi neo khớp đúng một lần, bản tiêm khác bản gốc.
function banSaoMay(tiem = []) {
  const cp = mkdtempSync(path.join(TMP, 'may-'));
  for (const d of THU_MUC_MAY) cpSync(path.join(KIT, d), path.join(cp, d), { recursive: true });
  for (const [rel, neo, thay] of tiem) {
    const p = path.join(cp, rel); const src = readFileSync(p, 'utf8');
    const k = src.split(neo).length - 1;
    if (k !== 1) throw new Error(`neo mutant khop ${k} lan trong ${rel}: «${neo.slice(0, 80)}»`);
    const moi = src.replace(neo, thay);
    if (moi === src) throw new Error(`ban tiem trung ban goc: ${rel}`);
    writeFileSync(p, moi);
  }
  return cp;
}
let _goc = null;
function banGoc() {
  if (!_goc) {
    try { git(KIT, 'cat-file', '-e', `${GOC_SHA}^{commit}`); } catch { throw new Error(`khong co commit ban goc ${GOC_SHA} trong lich su (checkout nong?)`); }
    _goc = mkdtempSync(path.join(TMP, 'goc-'));
    execFileSync('bash', ['-c', `git -C "$1" archive ${GOC_SHA} ${THU_MUC_MAY.join(' ')} | tar -x -C "$2"`, '_', KIT, _goc]);
    if (!existsSync(path.join(_goc, 'scripts', 'pre-merge-check.sh'))) throw new Error('ban goc thieu scripts/pre-merge-check.sh');
  }
  return _goc;
}

// ── Ma trận viết trước ─────────────────────────────────────────────────────────────────────────────────
const O_IM = [
  ['opportunity', {}, ['opportunity.md']],
  ['decisions', {}, ['decisions.jsonl']],
  ['ca-hai', {}, ['opportunity.md', 'decisions.jsonl']],
  ['kho-sau', { sau: true }, ['opportunity.md']],
  ['stale-scope-paths', { staleScope: 'paths', evals: 'schema_version: 1\nfeature_slug: <slug>\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: verify.sh\n    paths: ["src/**"]\n' }, ['opportunity.md']],
];
const O_DO = [
  ['evals', {}, ['evals.yaml']],
  ['contract', {}, ['contract.md']],
  ['evidence-report', {}, ['evidence-report.md']],
  ['run-log', {}, ['run-log.jsonl']],
  ['rang-con', {}, ['rang/do.mjs']],
  ['rang-trung-ten', {}, ['rang/opportunity.md']],
  ['tep-la', {}, ['note.md']],
  ['chu-va-vat', {}, ['opportunity.md', 'evals.yaml']],
  ['kho-sau-evals', { sau: true }, ['evals.yaml']],
];
const evalsPaths = p => `schema_version: 1\nfeature_slug: <slug>\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: verify.sh\n    paths: ${p}\n`;
const O_PHU = [
  ['glob-ho-so', evalsPaths('["_acceptance/<slug>/**"]')],
  ['dung-ten', evalsPaths('["src/**", "_acceptance/<slug>/opportunity.md"]')],
  ['bi-danh', 'schema_version: 1\nfeature_slug: <slug>\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: verify.sh\n    paths: *p\n'],
  // Lượt chấm 1 (t1–t3): ba dạng bộ đọc paths từng bỏ im — `./` ở đầu · id không đứng đầu mục · trùng id.
  ['cham-dau', evalsPaths('["./_acceptance/<slug>/opportunity.md"]')],
  ['id-sau', 'schema_version: 1\nfeature_slug: <slug>\nevals:\n  - criterion: AC-1\n    id: E1\n    executor: script\n    cmd: verify.sh\n    paths: ["_acceptance/<slug>/**"]\n'],
  ['trung-id', evalsPaths('["src/**"]') + '  - id: E1\n    criterion: AC-2\n    executor: script\n    cmd: verify.sh\n    paths: ["_acceptance/<slug>/opportunity.md"]\n'],
  // Lượt chấm 2 (t2): ngoặc nhọn — cú pháp glob kit không hiểu — không được đọc thành «không phủ».
  ['ngoac-nhon', evalsPaths('["_acceptance/<slug>/{opportunity.md,x.md}"]')],
];
// Đối chứng: paths không phủ tệp chữ — kể cả viết `./` ở đầu (bỏ `./` không được biến «không phủ» thành «phủ»).
const O_KHONG_PHU = [
  ['rang-va-src', evalsPaths('["_acceptance/<slug>/rang/**", "src/**"]')],
  ['cham-dau-src', evalsPaths('["./src/**"]')],
  // `[…]` là chữ thật trong tên đường (hình dạng crm): không được biến thành «không đọc được».
  ['ngoac-vuong-crm', evalsPaths('["apps/app/app/(app)/[slug]/okr/**"]')],
];

await ca('TV1 chi-tep-chu', () => {
  const sai = [];
  for (const [ten, o, tep] of O_IM) {
    const k = kho(o);
    // Trục B của từng ô: bốn ô đầu KHÔNG có evals.yaml, ô stale-scope-paths có (đo trên kho code sinh).
    if (existsSync(path.join(k.A, 'old', 'evals.yaml')) !== Boolean(o.evals)) { sai.push(`${ten} — kho thu sai truc B`); continue; }
    const r = luoi(pr(k, 'old', tep)); if (!imDung(r, 'old', tep)) sai.push(`${ten} — ${tomTat(r, 'old')}`);
  }
  return sai.length ? { loi: sai.join(' ;; ') } : { msg: `${O_IM.length}/${O_IM.length}` };
});
await ca('TV1-do ban-goc', () => {
  const sai = []; const g = banGoc();
  for (const [ten, o, tep] of O_IM) { const r = luoi(pr(kho(o), 'old', tep), g); if (!(r.status !== 0 && coStale(r, 'old'))) sai.push(`${ten} — ${tomTat(r, 'old')}`); }
  return sai.length ? { loi: sai.join(' ;; ') } : { msg: `${O_IM.length}/${O_IM.length}` };
});
await ca('TV1-do go-ve-chu', () => {
  const k = pr(kho(), 'old', ['opportunity.md']);
  const lanh = luoi(k, banSaoMay());
  if (!imDung(lanh, 'old', ['opportunity.md'])) return { loi: `ban sao chua tiem khong xanh — ${tomTat(lanh, 'old')}` };
  const src = readFileSync(path.join(KIT, 'scripts', 'pre-merge-check.sh'), 'utf8');
  const m = src.match(/^ *elif .*# STALE-TEP-CHU-GUARD$/m);
  if (!m) return { loi: 'khong thay dong elif # STALE-TEP-CHU-GUARD' };
  const r = luoi(k, banSaoMay([['scripts/pre-merge-check.sh', m[0], '  elif false; then # STALE-TEP-CHU-GUARD']]));
  return doDung(r, 'old') ? { msg: 'ban tiem do' } : { loi: `ban tiem khong do — ${tomTat(r, 'old')}` };
});
await ca('TV2 tep-vat', () => {
  const sai = [];
  for (const [ten, o, tep] of O_DO) { const r = luoi(pr(kho(o), 'old', tep)); if (!doDung(r, 'old')) sai.push(`${ten} — ${tomTat(r, 'old')}`); }
  return sai.length ? { loi: sai.join(' ;; ') } : { msg: `${O_DO.length}/${O_DO.length}` };
});
await ca('TV3 ho-so-tuoi', () => {
  const sai = [];
  for (const tep of [['opportunity.md'], ['evals.yaml']]) {
    const r = luoi(pr(kho({ tuoi: true }), 'fresh', tep));
    const d = dong(r, 'fresh');
    if (!(r.status === 0 && d.some(l => l.startsWith('OK [fresh]')) && !d.some(l => l.startsWith('VIOLATION')))) sai.push(`${tep[0]} — ${tomTat(r, 'fresh')}`);
  }
  return sai.length ? { loi: sai.join(' ;; ') } : { msg: '2/2' };
});
await ca('TV4 paths-phu-chu', () => {
  const sai = [];
  for (const [ten, ev] of O_PHU) { const r = luoi(pr(kho({ evals: ev }), 'old', ['opportunity.md'])); if (!doDung(r, 'old')) sai.push(`${ten} — ${tomTat(r, 'old')}`); }
  return sai.length ? { loi: sai.join(' ;; ') } : { msg: `${O_PHU.length}/${O_PHU.length}` };
});
await ca('TV4-doi-chung paths-khong-phu', () => {
  const sai = [];
  for (const [ten, ev] of O_KHONG_PHU) { const r = luoi(pr(kho({ evals: ev }), 'old', ['opportunity.md'])); if (!imDung(r, 'old', ['opportunity.md'])) sai.push(`${ten} — ${tomTat(r, 'old')}`); }
  return sai.length ? { loi: sai.join(' ;; ') } : { msg: `${O_KHONG_PHU.length}/${O_KHONG_PHU.length}` };
});
await ca('TV5 hai-luat-giu', () => {
  const k = pr(kho({ cfg: ['recheck: strict', 'gap_probe: required'], runLogKhac: true, evals: evalsPaths('["src/**"]') }), 'old', ['opportunity.md']);
  const r = luoi(k); const d = dong(r, 'old');
  const du = r.status !== 0 && d.some(l => l.startsWith(`VIOLATION [old]: ${MSG_GAP}`)) && d.some(l => l.startsWith(`VIOLATION [old]: ${MSG_RECHECK}`))
    && noteChu(r, 'old').length === 1 && !r.out.includes(MSG_STALE);
  return du ? {} : { loi: tomTat(r, 'old') };
});

await ca('TV6 lui-ve-vat', () => {
  const k = pr(kho(), 'old', ['opportunity.md']);
  const lanh = luoi(k, banSaoMay());
  if (!imDung(lanh, 'old', ['opportunity.md'])) return { loi: `ban sao chua tiem khong xanh — ${tomTat(lanh, 'old')}` };
  const lib = readFileSync(path.join(KIT, 'lib', 'evidence-core.cjs'), 'utf8');
  const dinh = lib.match(/^function phanTepHoSo\(.*$/m);
  if (!dinh) return { loi: 'khong thay dinh nghia phanTepHoSo trong lib' };
  const sai = [];
  for (const [ten, tiem] of [
    ['ham-vang', [['lib/evidence-core.cjs', '  phanTepHoSo,', '  phanTepHoSoX: phanTepHoSo,']]],
    // Hàm ném (trả chuỗi thay vì đối tượng): node thoát ≠ 0 — nhánh `|| return 0`.
    ['ham-nem', [['lib/evidence-core.cjs', dinh[0], dinh[0] + ' return "rac{";']]],
    // Đầu ra hỏng mà node thoát 0: lib tự in rác trước kết quả — chạm nhánh mặc định của `case "$_tv"`
    // (lượt chấm 1, t4: hai ô cũ cùng thoát ở `|| return 0`, nhánh này chưa ai đo).
    ['dau-ra-hong', [['lib/evidence-core.cjs', dinh[0], dinh[0] + ' process.stdout.write("rac{");']]],
  ]) { const r = luoi(k, banSaoMay(tiem)); if (!doDung(r, 'old')) sai.push(`${ten} — ${tomTat(r, 'old')}`); }
  return sai.length ? { loi: sai.join(' ;; ') } : { msg: '3/3' };
});

console.log(`Results: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
