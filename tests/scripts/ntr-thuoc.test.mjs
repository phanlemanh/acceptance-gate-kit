// ntr-thuoc.test.mjs — hồ sơ nhan-trang-thai-va-reality, mảnh A (thước thôi phạt vật).
// AC-1 (E1): test của kho là VẬT; thước còn đúng config · evals.yaml · rang/ · tệp script
//   dưới hồ sơ. AC-2 (E2): s4-args thôi dừng ở trần nhát; bộ đếm vẫn đếm. AC-3 (E3): thước
//   chỉ-đọc trong lượt chấm — chụp trước, so sau.
// Tên ca = mã AC (khối ĐỊNH VỊ CLAUDE.md). Mọi đường suy từ vị trí tệp này; fixture là kho git
// do code sinh trong thư mục tạm; bản sao đột biến lấy TRỌN thư mục bằng `git archive`.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync, cpSync, utimesSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dungKho, buoc, TEP, SLUG } from './thuoc-vat-fixture.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const TMP = mkdtempSync(path.join(tmpdir(), 'ntr-thuoc-'));
let pass = 0; let fail = 0;
const ok = (name, msg = '') => { pass += 1; console.log(`PASS: ${name} ${msg}`.trimEnd() + ' '); };
const bad = (name, msg) => { fail += 1; console.log(`FAIL: ${name} — ${msg}`); };
const loi = e => String((e && (e.stderr || e.message)) || e).split('\n').slice(0, 3).join(' | ');
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const want = name => !process.env.NTR_CASES || process.env.NTR_CASES.split(',').includes(name);

// Bản sao TRỌN một thư mục của CÂY ĐANG KIỂM (không chép danh sách tệp tay — bài học P150;
// chép cây làm việc chứ không `git archive HEAD` để bản sao mang cả vật chưa commit).
function banSao(dirs) {
  const d = mkdtempSync(path.join(TMP, 'bs-'));
  for (const r of dirs) cpSync(path.join(KIT, r), path.join(d, r), { recursive: true });
  return d;
}

// ── AC-1 ────────────────────────────────────────────────────────────────────
const MT = [
  ['tests/scripts/a.test.mjs', 'vat'], ['apps/api/test/x.spec.ts', 'vat'], ['pkg/__tests__/b.js', 'vat'], ['src/spec/c.rb', 'vat'],
  ['_acceptance/config.yaml', 'thuoc'], ['_acceptance/s/evals.yaml', 'thuoc'], ['_acceptance/s/rang/r.mjs', 'thuoc'], ['_acceptance/s/do.sh', 'thuoc'],
];
const chayMT = pl => { const sai = []; let n = 0; for (const [p, mong] of MT) { n += 1; const t = pl(p, {}); if (t !== mong) sai.push(`${p}: mong ${mong}, that ${t}`); } return { n, sai }; };
const PL_REL = 'feature-loop/scripts/lib/phan-loai.mjs';

if (want('NT-AC1')) {
  try {
    const { phanLoai } = await import(pathToFileURL(path.join(KIT, PL_REL)).href);
    const { n, sai } = chayMT(phanLoai);
    if (n !== MT.length) bad('NT-AC1', `so khang dinh ${n} khac so phan tu ${MT.length}`);
    else if (sai.length) bad('NT-AC1', `ma tran sai: ${sai.join(' ; ')}`);
    else ok('NT-AC1', `— ${n}/${MT.length}: test kho ra vat, thuoc that ra thuoc`);
  } catch (e) { bad('NT-AC1', loi(e)); }
}

if (want('NT-AC1-dot-bien')) {
  try {
    const d = banSao(['feature-loop']);
    const f = path.join(d, PL_REL);
    const goc = readFileSync(f, 'utf8');
    const KIM_EVALS = "  if (path.posix.basename(p) === 'evals.yaml') return true;\n";
    if (goc.split(KIM_EVALS).length !== 2) throw new Error('kim ve evals.yaml khong khop dung 1 lan');
    // Bản A: gỡ vế evals.yaml → đúng MỘT ô lật.
    const fa = path.join(d, 'scripts-a.mjs');
    writeFileSync(fa, goc.replace(KIM_EVALS, '').replace("from '../carry-plan.mjs'", `from '${pathToFileURL(path.join(d, 'feature-loop/scripts/carry-plan.mjs')).href}'`));
    if (readFileSync(fa, 'utf8') === goc) throw new Error('ban A khong doi byte');
    const { phanLoai: plA } = await import(pathToFileURL(fa).href);
    const latA = MT.filter(([p, mong]) => plA(p, {}) !== mong).map(([p]) => p);
    // Bản B: gắn lại vế DO_GLOBS → đúng bốn ô test lật về thuoc.
    const KIM_DAU = 'function laThuoc(p) {\n';
    if (goc.split(KIM_DAU).length !== 2) throw new Error('kim dau laThuoc khong khop dung 1 lan');
    const fb = path.join(d, 'scripts-b.mjs');
    writeFileSync(fb, goc.replace(KIM_DAU, KIM_DAU + '  if (DO_GLOBS.map(globToRe).some(re => re.test(p))) return true;\n')
      .replace("from '../carry-plan.mjs'", `from '${pathToFileURL(path.join(d, 'feature-loop/scripts/carry-plan.mjs')).href}'`));
    const { phanLoai: plB } = await import(pathToFileURL(fb).href);
    const latB = MT.filter(([p, mong]) => plB(p, {}) !== mong).map(([p]) => p).sort();
    const mongB = MT.filter(([, m]) => m === 'vat').map(([p]) => p).sort();
    if (JSON.stringify(latA) !== JSON.stringify(['_acceptance/s/evals.yaml'])) bad('NT-AC1-dot-bien', `ban A lat ${JSON.stringify(latA)}, mong dung evals.yaml`);
    else if (JSON.stringify(latB) !== JSON.stringify(mongB)) bad('NT-AC1-dot-bien', `ban B lat ${JSON.stringify(latB)}, mong bon o test`);
    else ok('NT-AC1-dot-bien', '— go ve evals.yaml lat dung 1 o; gan lai DO_GLOBS lat dung 4 o test');
  } catch (e) { bad('NT-AC1-dot-bien', loi(e)); }
}

// ── AC-2 ────────────────────────────────────────────────────────────────────
const S4ARGS = path.join(KIT, 'feature-loop', 'scripts', 's4-args.mjs');
const THUOC_VAT = path.join(KIT, 'feature-loop', 'scripts', 'thuoc-vat.mjs');
const chayS4 = (d, script = S4ARGS) => {
  const out = path.join(d, '.args-' + Math.random().toString(36).slice(2) + '.json');
  const r = spawnSync(process.execPath, [script, '--slug', SLUG, '--root', d, '--ag-root', KIT, '--out', out, '--diff-base', 'main'], { encoding: 'utf8' });
  return { ...r, out };
};
const khoBaNhat = () => dungKho(mkdtempSync(path.join(TMP, 'kho-')), ['vat', 'implemented', 'thuoc', 'thuoc', 'thuoc']);

if (want('NT-AC2')) {
  try {
    const { d } = khoBaNhat();
    const r = chayS4(d);
    const dem = JSON.parse(execFileSync(process.execPath, [THUOC_VAT, '--root', d, '--slug', SLUG, '--json'], { encoding: 'utf8' }));
    if (dem.nhat !== 3) bad('NT-AC2', `doi chung: bo dem phai thay 3 nhat, thay ${dem.nhat} — fixture khong dung hinh`);
    else if (r.status !== 0) bad('NT-AC2', `s4-args thoat ${r.status}, mong 0 — ${String(r.stderr).split('\n').slice(0, 3).join(' | ')}`);
    else if (!existsSync(r.out)) bad('NT-AC2', 'thoat 0 ma khong sinh tep args');
    else if (/tran nhat sua thuoc/.test(r.stderr) || /Ba loi/.test(r.stderr)) bad('NT-AC2', 'stderr van in tran/ba loi');
    else ok('NT-AC2', '— 3 nhat o implemented: args sinh, thoat 0, khong tran; bo dem van dem 3');
  } catch (e) { bad('NT-AC2', loi(e)); }
}

if (want('NT-AC2-dem-loi')) {
  try {
    const { d } = khoBaNhat();
    const bs = banSao(['feature-loop']);
    const tv = path.join(bs, 'feature-loop', 'scripts', 'thuoc-vat.mjs');
    const KIM = 'export function demThuocVat({ root, slug, t1SkipGlobs = [], frontmatterField }) {\n';
    const src = readFileSync(tv, 'utf8');
    if (src.split(KIM).length !== 2) throw new Error('kim demThuocVat khong khop dung 1 lan');
    writeFileSync(tv, src.replace(KIM, KIM + "  throw new Error('dot bien bo dem');\n"));
    const r = chayS4(d, path.join(bs, 'feature-loop', 'scripts', 's4-args.mjs'));
    const lanh = chayS4(d, path.join(bs, 'feature-loop', 'scripts', 's4-args.mjs').replace(bs, KIT));
    if (lanh.status !== 0) bad('NT-AC2-dem-loi', `doi chung: ban lanh tren cung kho thoat ${lanh.status}`);
    else if (r.status === 0) bad('NT-AC2-dem-loi', 'bo dem nem loi ma s4-args van thoat 0 — hong lang');
    else if (!r.stderr.includes('bộ đếm nhát sửa thước lỗi')) bad('NT-AC2-dem-loi', `thoat ${r.status} nhung thieu thong diep ghim: ${String(r.stderr).slice(0, 200)}`);
    else ok('NT-AC2-dem-loi', `— bo dem nem loi: s4-args thoat ${r.status}, thong diep «bộ đếm nhát sửa thước lỗi»; ban lanh thoat 0`);
  } catch (e) { bad('NT-AC2-dem-loi', loi(e)); }
}

// ── AC-3 ────────────────────────────────────────────────────────────────────
// Kho: vật + hợp đồng implemented + một test kho tracked. s4-args sinh args vào <ws>/s4-args.json
// (đúng đường SKILL dùng), rồi một mũi tiêm, rồi thuoc-vat --write như bước sau-lượt của SKILL.
const WS = d => path.join(d, '_acceptance', SLUG);
function khoAC3() {
  const { d } = dungKho(mkdtempSync(path.join(TMP, 'k3-')), ['vat', 'implemented']);
  mkdirSync(path.join(d, 'tests'), { recursive: true });
  writeFileSync(path.join(d, 'tests', 'k.test.mjs'), '// test kho\n');
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'test kho');
  const r = spawnSync(process.execPath, [S4ARGS, '--slug', SLUG, '--root', d, '--ag-root', KIT, '--out', path.join(WS(d), 's4-args.json'), '--diff-base', 'main'], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`s4-args thoat ${r.status}: ${String(r.stderr).split('\n')[0]}`);
  return d;
}
const chayTV = d => spawnSync(process.execPath, [THUOC_VAT, '--root', d, '--slug', SLUG, '--ag-root', KIT, '--write'], { encoding: 'utf8' });
const dongLech = d => readFileSync(path.join(WS(d), 'run-log.jsonl'), 'utf8').split('\n').filter(l => /"kind"\s*:\s*"thuoc-lech"/.test(l)).map(l => JSON.parse(l));
// Khoá dòng RÚT từ khối marker của bên viết — không gõ literal.
const khoaMarker = () => {
  const src = readFileSync(THUOC_VAT, 'utf8');
  const m = src.match(/<<<THUOC-LECH-LINE\n([\s\S]*?)THUOC-LECH-LINE>>>/);
  if (!m) throw new Error('khong rut duoc khoi marker THUOC-LECH-LINE tu thuoc-vat.mjs');
  return [...m[1].matchAll(/"([a-z_]+)":/g)].map(x => x[1]).filter((k, i, a) => a.indexOf(k) === i && k !== 'doi');
};
const doiByte = (f, them) => { const t = readFileSync(f, 'utf8'); writeFileSync(f, t + them); if (readFileSync(f, 'utf8') === t) throw new Error(`tiem khong doi byte: ${f}`); };

if (want('NT-AC3-lanh')) {
  try {
    const d = khoAC3();
    const args = JSON.parse(readFileSync(path.join(WS(d), 's4-args.json'), 'utf8'));
    const r = chayTV(d);
    if (!args.thuocChup || !args.thuocChup.tep || !Object.keys(args.thuocChup.tep).length) bad('NT-AC3-lanh', 'tep args khong mang thuocChup co ban do bam');
    else if (!Object.keys(args.thuocChup.tep).includes('tests/k.test.mjs')) bad('NT-AC3-lanh', `anh chup thieu test kho: ${Object.keys(args.thuocChup.tep).join(',')}`);
    else if (r.status !== 0) bad('NT-AC3-lanh', `khong doi gi ma thoat ${r.status}: ${r.stderr}`);
    else if (dongLech(d).length) bad('NT-AC3-lanh', 'khong doi gi ma co dong thuoc-lech');
    else ok('NT-AC3-lanh', `— anh chup ${Object.keys(args.thuocChup.tep).length} tep, khong doi gi: thoat 0, 0 dong lech`);
  } catch (e) { bad('NT-AC3-lanh', loi(e)); }
}

if (want('NT-AC3-do')) {
  // Ma trận viết trước: [tên mũi, hàm tiêm, đường mong gọi, đường mong KHÔNG gọi]
  const MUI = [
    ['evals.yaml', d => doiByte(path.join(WS(d), 'evals.yaml'), '# tiem\n'), `_acceptance/${SLUG}/evals.yaml`],
    ['rang', d => doiByte(path.join(d, TEP.thuoc), '// tiem\n'), TEP.thuoc],
    ['config', d => doiByte(path.join(d, '_acceptance', 'config.yaml'), '# tiem\n'), '_acceptance/config.yaml'],
    ['test kho', d => doiByte(path.join(d, 'tests', 'k.test.mjs'), '// tiem\n'), 'tests/k.test.mjs'],
    // Hình dạng ca thật crm dieu-phoi lượt D 21/09 (508ed3f7): tác nhân chấm COMMIT giữa lượt,
    // chạm test kho lẫn vật → gọi đúng tệp test, KHÔNG gọi tệp vật (vật ngoài tập thước).
    ['commit giua luot', d => { doiByte(path.join(d, 'tests', 'k.test.mjs'), '// tac nhan\n'); doiByte(path.join(d, TEP.vat), '// tac nhan\n'); git(d, 'add', '-A'); git(d, 'commit', '-qm', 'tac nhan cham'); }, 'tests/k.test.mjs', TEP.vat],
  ];
  const sai = [];
  let n = 0;
  let khoa;
  try { khoa = khoaMarker(); } catch (e) { sai.push(loi(e)); }
  for (const [ten, tiem, mong, khong] of MUI) {
    n += 1;
    try {
      const d = khoAC3(); tiem(d);
      const r = chayTV(d); const L = dongLech(d);
      if (r.status !== 5) { sai.push(`${ten}: thoat ${r.status}, mong 5`); continue; }
      if (!r.stderr.includes('thuoc lech trong luot cham')) { sai.push(`${ten}: thieu thong diep ghim`); continue; }
      if (L.length !== 1) { sai.push(`${ten}: ${L.length} dong thuoc-lech, mong 1`); continue; }
      const thieuKhoa = (khoa || []).filter(k => !(k in L[0]));
      if (thieuKhoa.length) { sai.push(`${ten}: dong thieu khoa marker ${thieuKhoa.join(',')}`); continue; }
      const tep = L[0].tep.map(x => x.tep);
      if (!tep.includes(mong)) sai.push(`${ten}: tep ${JSON.stringify(tep)} khong goi ${mong}`);
      else if (khong && tep.includes(khong)) sai.push(`${ten}: goi ca tep vat ${khong}`);
    } catch (e) { sai.push(`${ten}: ${loi(e)}`); }
  }
  if (n !== MUI.length) bad('NT-AC3-do', `so mui ${n} khac ${MUI.length}`);
  else if (sai.length) bad('NT-AC3-do', sai.join(' ; '));
  else ok('NT-AC3-do', `— ${n}/${MUI.length} mui: thoat 5, thong diep ghim, dong dung khuon, goi dung tep`);
}

if (want('NT-AC3-im')) {
  try {
    const d = khoAC3();
    const f = path.join(WS(d), 'evals.yaml');
    writeFileSync(f, readFileSync(f));
    const t = new Date(Date.now() + 3600e3); utimesSync(f, t, t);
    doiByte(path.join(WS(d), 'contract.md'), '\n<!-- ghi chu -->\n');
    const r = chayTV(d);
    if (r.status !== 0) bad('NT-AC3-im', `ghi lai cung byte + doi contract.md ma thoat ${r.status}: ${r.stderr}`);
    else if (dongLech(d).length) bad('NT-AC3-im', 'co dong thuoc-lech khi chi cham thu khong phai thuoc');
    else ok('NT-AC3-im', '— mtime doi cung byte + contract.md doi: thoat 0, 0 dong lech');
  } catch (e) { bad('NT-AC3-im', loi(e)); }
}

rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (ntr-thuoc)`);
process.exit(fail ? 1 : 0);
