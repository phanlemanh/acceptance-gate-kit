// phan-loai.test.mjs — thuoc-co-cua AC-10 (E12): MỘT nguồn phân bốn lớp
// ngoài · thước · hồ sơ · vật (`feature-loop/scripts/lib/phan-loai.mjs`).
//
//   PL1 ma trận viết-trước: mỗi vế của từng lớp một đường mẫu; số khẳng định = số hàng.
//   PL4 tệp máy ghi của hồ sơ, gọi tên đích danh → «hồ sơ»; bản ghi mốc định tuyến
//       máy sinh dưới thư mục ca mà repo khai t1 → «ngoài», không «thước».
//   PL2 chiều đỏ: gỡ TỪNG vế của lớp thước trong bản sao → đúng ô của vế ấy lật,
//       không ô nào khác lật.
//   PL3 một nguồn: bộ sinh args nạp CHÍNH module — bản sao cây với module rỗng mẫu thì
//       vùng vật và danh sách tệp đo của tệp args đổi theo.
// Fixture code-sinh; bản sao chép TRỌN thư mục; mọi đường dẫn suy từ vị trí tệp này.
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync, readFileSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.join(HERE, '..', '..');
const MODULE = path.join(KIT, 'feature-loop', 'scripts', 'lib', 'phan-loai.mjs');
const S4ARGS = path.join(KIT, 'feature-loop', 'scripts', 's4-args.mjs');
let pass = 0, fail = 0;
const ok = m => { console.log(`  PASS: ${m}`); pass += 1; };
const bad = (m, d) => { console.log(`  FAIL: ${m}${d ? ` (${d})` : ''}`); fail += 1; };
const git = (cwd, ...a) => execFileSync('git', ['-C', cwd, ...a], { encoding: 'utf8' }).trim();
const loi = e => String((e && (e.stderr || e.message)) || e).split('\n').filter(Boolean).slice(-3).join(' | ');
const TMP = mkdtempSync(path.join(tmpdir(), 'phan-loai-'));

const { phanLoai } = await import(pathToFileURL(MODULE).href);

// ── Ma trận viết-trước: [đường, lớp mong đợi, t1SkipGlobs] ─────────────────
const PL1_MATRAN = [
  // Test của KHO là vật từ vòng nhan-trang-thai-va-reality (21/09, Đ1).
  ['tests/scripts/a.test.mjs', 'vat'],
  ['src/x.spec.ts', 'vat'],
  ['pkg/__tests__/b.js', 'vat'],
  ['_acceptance/config.yaml', 'thuoc'],
  ['_acceptance/demo/evals.yaml', 'thuoc'],
  ['_acceptance/demo/rang/a.mjs', 'thuoc'],
  ['_acceptance/demo/rang/mau.json', 'thuoc'],   // vế thư mục răng, không nhờ đuôi script
  ['_acceptance/demo/rang.sh', 'thuoc'],         // vế đuôi script, không nhờ thư mục răng
  ['_acceptance/demo/contract.md', 'ho-so'],
  ['docs/x.md', 'ngoai', ['docs/**']],
  ['src/a.js', 'vat'],
  ['scripts/gate-card.js', 'vat'],
];
const PL4_MATRAN = [
  ['_acceptance/demo/run-log.jsonl', 'ho-so'],
  ['_acceptance/demo/decisions.jsonl', 'ho-so'],
  ['_acceptance/demo/s4-args.json', 'ho-so'],
  ['_acceptance/demo/evidence/E3-1.png', 'ho-so'],
  ['_acceptance/demo/card.html', 'ho-so'],
  ['_acceptance/demo/figures/a.png', 'ho-so'],
  ['_acceptance/demo/duong-nen.md', 'ho-so'],
  ['_acceptance/demo/usage-report.md', 'ho-so'],
  ['tests/scripts/fixtures/routing-baseline.txt', 'ngoai', ['tests/scripts/fixtures/routing-baseline.txt']],
];

function chayMaTran(fn, maTran) {
  const sai = [];
  let n = 0;
  for (const [p, mong, t1] of maTran) {
    n += 1;
    const that = fn(p, { t1SkipGlobs: t1 || [] });
    if (that !== mong) sai.push(`${p}: mong ${mong}, that ${that}`);
  }
  return { n, sai };
}

// ── PL1 ─────────────────────────────────────────────────────────────────────
{
  const { n, sai } = chayMaTran(phanLoai, PL1_MATRAN);
  if (n !== PL1_MATRAN.length) bad('PL1 so khang dinh khac so hang', `${n}/${PL1_MATRAN.length}`);
  else if (sai.length) bad('PL1 ma tran viet-truoc sai', sai.join(' ; '));
  else ok(`PL1 ma tran viet-truoc — ${n}/${PL1_MATRAN.length} hang tra dung lop`);
}

// ── PL4 ─────────────────────────────────────────────────────────────────────
{
  const { n, sai } = chayMaTran(phanLoai, PL4_MATRAN);
  if (n !== PL4_MATRAN.length) bad('PL4 so khang dinh khac so hang', `${n}/${PL4_MATRAN.length}`);
  else if (sai.length) bad('PL4 tep may ghi cua ho so phan lop sai', sai.join(' ; '));
  else ok(`PL4 tep may ghi cua ho so — ${n}/${PL4_MATRAN.length} hang: ho so tra «ho-so», moc dinh tuyen khai t1 tra «ngoai»`);
}

// ── PL2 (chiều đỏ): gỡ từng vế của lớp thước trong bản sao ─────────────────
{
  const TAT_CA = [...PL1_MATRAN, ...PL4_MATRAN];
  // [tên vế, kim trong nguồn module, ô phải lật]
  const VE = [
    ['ve _acceptance/config.yaml', "p === '_acceptance/config.yaml'", ['_acceptance/config.yaml']],
    ['ve evals.yaml', "path.posix.basename(p) === 'evals.yaml'", ['_acceptance/demo/evals.yaml']],
    ['ve thu muc rang', "p.includes('/rang/')", ['_acceptance/demo/rang/mau.json']],
    ['ve duoi script', 'SCRIPT_DO_RE.test(p)', ['_acceptance/demo/rang.sh']],
  ];
  const goc = new Map(TAT_CA.map(([p, , t1]) => [p, phanLoai(p, { t1SkipGlobs: t1 || [] })]));
  const loiVe = [];
  for (const [i, [ten, kim, oLat]] of VE.entries()) {
    try {
      const d = path.join(TMP, `pl2-${i}`);
      cpSync(path.join(KIT, 'feature-loop', 'scripts'), path.join(d, 'scripts'), { recursive: true });
      const f = path.join(d, 'scripts', 'lib', 'phan-loai.mjs');
      const src = readFileSync(f, 'utf8');
      const n = src.split(kim).length - 1;
      if (n !== 1) throw new Error(`kim «${kim}» khop ${n} lan (can dung 1)`);
      writeFileSync(f, src.replace(kim, 'false'));
      const { phanLoai: pl } = await import(pathToFileURL(f).href);
      const lat = TAT_CA.filter(([p, , t1]) => pl(p, { t1SkipGlobs: t1 || [] }) !== goc.get(p)).map(([p]) => p);
      if (JSON.stringify([...lat].sort()) !== JSON.stringify([...oLat].sort()))
        loiVe.push(`${ten}: lat ${JSON.stringify(lat)}, mong ${JSON.stringify(oLat)}`);
    } catch (e) { loiVe.push(`${ten}: ${loi(e)}`); }
  }
  const saiGoc = TAT_CA.filter(([p, mong]) => goc.get(p) !== mong);
  if (saiGoc.length) bad('PL2 doi chung duong: ban goc khong tra dung ma tran — khong tin duoc chieu do', saiGoc.map(([p]) => p).join(','));
  else if (loiVe.length) bad('PL2 go tung ve cho ket qua sai', loiVe.join(' ; '));
  else ok(`PL2 go tung ve — dung o cua ve ay lat, khong o nao khac (${VE.length} ve)`);
}

// ── PL3 (một nguồn): bản sao trọn feature-loop/, module rỗng hai tập mẫu ─────
function buildRepo() {
  const d = path.join(TMP, 'r-' + Math.random().toString(36).slice(2));
  mkdirSync(path.join(d, '_acceptance', 'demo'), { recursive: true });
  mkdirSync(path.join(d, 'tests'), { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main', d]);
  git(d, 'config', 'user.email', 't@t.t'); git(d, 'config', 'user.name', 'T');
  writeFileSync(path.join(d, '_acceptance', 'config.yaml'),
    'schema_version: 1\nexecutors:\n  test:\n    api: "echo x"\nfeature_loop:\n  suite_keys:\n    - executors.test.api\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'contract.md'),
    '---\nschema_version: 1\nslug: demo\nrisk_tier: T2\nstatus: implemented\n---\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'evals.yaml'),
    'schema_version: 1\nfeature_slug: demo\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: config:executors.test.api\n    expected: x\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'ghi-chu.md'), 'cu\n');
  writeFileSync(path.join(d, 'tests', 'x.test.mjs'), 'cu\n');
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'base');
  git(d, 'checkout', '-qb', 'feat');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'ghi-chu.md'), 'moi\n');
  writeFileSync(path.join(d, 'tests', 'x.test.mjs'), 'moi\n');
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'feat');
  return d;
}
const runArgs = (script, d) => {
  const out = path.join(d, `args-${Math.random().toString(36).slice(2)}.json`);
  execFileSync(process.execPath, [script, '--slug', 'demo', '--root', d, '--ag-root', KIT, '--out', out, '--diff-base', 'main'],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  return JSON.parse(readFileSync(out, 'utf8'));
};
{
  try {
    const d = buildRepo();
    const that = runArgs(S4ARGS, d);
    const m = path.join(TMP, 'pl3');
    cpSync(path.join(KIT, 'feature-loop'), path.join(m, 'feature-loop'), { recursive: true });
    const f = path.join(m, 'feature-loop', 'scripts', 'lib', 'phan-loai.mjs');
    let src = readFileSync(f, 'utf8');
    for (const re of [/export const DO_GLOBS = \[[^\]]*\];/g, /export const HO_SO_VAN_BAN_GLOBS = \[[^\]]*\];/g]) {
      const n = (src.match(re) || []).length;
      if (n !== 1) throw new Error(`kim ${re} khop ${n} lan (can dung 1)`);
      src = src.replace(re, s => s.replace(/\[[^\]]*\]/, '[]'));
    }
    writeFileSync(f, src);
    const dot = runArgs(path.join(m, 'feature-loop', 'scripts', 's4-args.mjs'), d);
    const GC = '_acceptance/demo/ghi-chu.md';
    const TC = 'tests/x.test.mjs';
    if ((that.vungVat || []).includes(GC) || !(that.fileDoTrongDiff || []).includes(TC))
      bad('PL3 doi chung duong: cay that phai loai ghi-chu.md khoi vung vat va giu tep ca trong fileDoTrongDiff',
        `${JSON.stringify(that.vungVat)} · ${JSON.stringify(that.fileDoTrongDiff)}`);
    else if (!(dot.vungVat || []).includes(GC)) bad('PL3 module rong mau ma vungVat khong them ghi-chu.md — s4-args khong nap module', JSON.stringify(dot.vungVat));
    else if ((dot.fileDoTrongDiff || []).includes(TC)) bad('PL3 module rong mau ma fileDoTrongDiff van giu tep ca', JSON.stringify(dot.fileDoTrongDiff));
    else ok('PL3 mot nguon — bo sinh args nap chinh module: doi module thi vung vat va tep do cua tep args doi theo');
  } catch (e) { bad('PL3 loi', loi(e)); }
}

rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (phan-loai)`);
process.exit(fail ? 1 : 0);
