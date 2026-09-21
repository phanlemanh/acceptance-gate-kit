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

// Bản sao TRỌN một thư mục của cây đang kiểm (không chép danh sách tệp tay — bài học P150).
function banSao(dirs) {
  const d = mkdtempSync(path.join(TMP, 'bs-'));
  const tar = execFileSync('git', ['-C', KIT, 'archive', 'HEAD', ...dirs], { maxBuffer: 512 * 1024 * 1024 });
  execFileSync('tar', ['-x', '-C', d], { input: tar });
  return d;
}
// Tệp đang sửa có thể CHƯA commit (TDD) — chép đè bản cây làm việc lên bản sao.
function chepCayLamViec(d, rels) { for (const r of rels) cpSync(path.join(KIT, r), path.join(d, r)); }

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
    const d = banSao(['feature-loop']); chepCayLamViec(d, [PL_REL]);
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
    const bs = banSao(['feature-loop']); chepCayLamViec(bs, ['feature-loop/scripts/s4-args.mjs']);
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

// @@AC3@@

rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (ntr-thuoc)`);
process.exit(fail ? 1 : 0);
