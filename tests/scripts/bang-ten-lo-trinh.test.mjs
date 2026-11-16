// bang-ten-lo-trinh.test.mjs — hồ sơ phan-du-bo-cuc-moi, Task 4 (AC-4, AC-12; eval E4, E13 ghim các dòng «PASS: SP …»).
// Luật chặn lộ trình (`lib/chan-lo-trinh.cjs`) và khởi tạo lộ trình (`scripts/lo-trinh-khoi-tao.mjs`) lấy tên gói lộ trình
// từ bảng tên `lib/ho-goi.cjs`, kể cả khi bản cài gói không mang `marketplace.json` cạnh nó; luật chặn nạp bảng tên LƯỜI.
//
// Ma trận viết TRƯỚC (`MA_TRAN`): 2 lệnh × {cũ, mới} × {tệp khai có, thiếu} = 8 ô. Mỗi ô dựng MỘT bản cài gói lõi (thư
// mục `lib/`, `scripts/` và `.claude-plugin/plugin.json` của `gocGoi(cây, 'loi')`, chép ra tmp) — «có» đặt thêm
// `marketplace.json` của gốc cây vào `.claude-plugin/` của bản cài, «thiếu» thì không — rồi gọi `khoaBat()` mặc định
// trong một tiến trình con và giải khoá trên một kho thử bật đúng khoá mong đợi. Mỗi ô kiểm: (1) khoá ra đúng chuỗi viết
// trước và giải được; (2) BẢN GỐC (cùng ô dựng trên bản gốc) in đúng giá trị viết trước, ô «bằng» thì từng byte; (3) một
// nhát đổi trên bản sao của bản cài kéo khoá theo — «có»: đổi tên chợ trong tệp khai; «thiếu»: đổi `CHO` trong bảng tên
// (chứng nhánh nào thật sự chạy). Số dòng «PASS: SP <lệnh> · <bố cục> · <tệp khai>» phải bằng 8.
//
// SP-NL / SP-NL-DU: một kho tiêu thụ giả chép `lib/chan-lo-trinh.cjs` (bản chép CI); đối chứng dương có `lib/ho-goi.cjs`
// cạnh nó, ca âm gỡ tệp ấy trên cùng kho. SP-CHU: mã nguồn khởi tạo lộ trình không còn chữ tên gói viết cứng.
//
// Fixture do mã sinh trong lần chạy, dưới `mkdtemp(os.tmpdir())`: bản gốc = `git archive <merge-base HEAD origin/main>`
// TRỌN cây; cây cũ = cây đang đứng; kho mới = `dungKhoMoi` của hồ sơ gọi chéo trên `layCay` của cây đang đứng (và trên bản
// gốc cho cột bản gốc). Mọi đường suy từ vị trí tệp này; không ca nào ghi vào cây kit. Hạ tầng hỏng → «HẠ TẦNG: …», mã 3.
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { gocGoi } from '../bo-cuc.mjs';
import { dungKhoMoi, layCay } from '../../_acceptance/goi-cheo-loi-dieu-phoi/rang/luat-doi-chu.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const CAU_THIEU = 'chan-lo-trinh: thiếu lib/ho-goi.cjs cạnh luật chặn';
const TEP_KHOI_TAO = 'scripts/lo-trinh-khoi-tao.mjs';
const CHU_CUNG = ['roadmap@delivery-loop', 'road-map@acceptance-gate-kit'];

let pass = 0; let fail = 0;
const ok = (id, m = '') => { pass += 1; console.log(`  PASS: ${id}${m ? ` — ${m}` : ''}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };
const dong1 = s => String(s || '').trim().split('\n')[0];

// ── Ma trận viết trước ──────────────────────────────────────────────────────────────────────────────────────────────
// Khoá mong đợi theo bố cục (tên gói lộ trình @ tên chợ của bảng tên cây ấy).
const MONG = { 'cũ': 'road-map@acceptance-gate-kit', 'mới': 'roadmap@delivery-loop' };
// [lệnh, bố cục, tệp khai, bản gốc in (khoá), quan hệ với bản gốc]. Cột bản gốc là số đo trên merge-base 644e9b49 viết
// sẵn: luật chặn ở bản gốc KHÔNG có nhánh dự phòng (thiếu tệp khai → null), khởi tạo lộ trình đã có (#503).
const MA_TRAN = [
  ['chan-lo-trinh', 'cũ', 'có', MONG['cũ'], 'bang'],
  ['chan-lo-trinh', 'cũ', 'thiếu', null, 'khac-ten'],
  ['chan-lo-trinh', 'mới', 'có', MONG['mới'], 'bang'],
  ['chan-lo-trinh', 'mới', 'thiếu', null, 'khac-ten'],
  ['lo-trinh-khoi-tao', 'cũ', 'có', MONG['cũ'], 'bang'],
  ['lo-trinh-khoi-tao', 'cũ', 'thiếu', MONG['cũ'], 'bang'],
  ['lo-trinh-khoi-tao', 'mới', 'có', MONG['mới'], 'bang'],
  ['lo-trinh-khoi-tao', 'mới', 'thiếu', MONG['mới'], 'bang'],
];

// ── Fixture ─────────────────────────────────────────────────────────────────────────────────────────────────────────
let TMP; let banGoc; let khoMoi; let gocMoi;
let seq = 0;
try {
  TMP = realpathSync(mkdtempSync(path.join(tmpdir(), 'bang-ten-lt-')));
  const goc = execFileSync('git', ['-C', KIT, 'merge-base', 'HEAD', 'origin/main'], { encoding: 'utf8' }).trim();
  banGoc = path.join(TMP, 'goc'); mkdirSync(banGoc);
  execFileSync('bash', ['-c', 'set -o pipefail; git -C "$1" archive "$2" | tar -x -C "$3"', '_', KIT, goc, banGoc]);
  const nguon = path.join(TMP, 'nguon');
  layCay(KIT, nguon);
  khoMoi = path.join(TMP, 'moi'); dungKhoMoi(nguon, khoMoi);
  gocMoi = path.join(TMP, 'goc-moi'); dungKhoMoi(banGoc, gocMoi);
} catch (e) {
  console.log(`HẠ TẦNG: dựng fixture hỏng — ${dong1(e.message || e)}`);
  if (TMP) rmSync(TMP, { recursive: true, force: true });
  process.exit(3);
}
const CAY = { 'cũ': { cay: KIT, goc: banGoc }, 'mới': { cay: khoMoi, goc: gocMoi } };

// Bản cài gói lõi của một cây: lib/, scripts/, .claude-plugin/plugin.json; «có» thêm marketplace.json của gốc cây.
function banCai(cay, tepKhai) {
  const loi = gocGoi({ thuMuc: cay }, 'loi');
  const d = path.join(TMP, `cai${++seq}`);
  for (const m of ['lib', 'scripts']) cpSync(path.join(loi, m), path.join(d, m), { recursive: true });
  mkdirSync(path.join(d, '.claude-plugin'));
  cpSync(path.join(loi, '.claude-plugin', 'plugin.json'), path.join(d, '.claude-plugin', 'plugin.json'));
  if (tepKhai === 'có') cpSync(path.join(cay, '.claude-plugin', 'marketplace.json'), path.join(d, '.claude-plugin', 'marketplace.json'));
  return d;
}

// Kho thử bật đúng khoá: settings.json của đội bật `khoa`, config khai lo_trinh.chan: true.
function khoBat(khoa, { chan = true } = {}) {
  const d = path.join(TMP, `kho${++seq}`);
  mkdirSync(path.join(d, '.claude'), { recursive: true }); mkdirSync(path.join(d, '_acceptance'));
  writeFileSync(path.join(d, '.claude', 'settings.json'), JSON.stringify({ enabledPlugins: { [khoa]: true } }));
  writeFileSync(path.join(d, '_acceptance', 'config.yaml'), `schema_version: 1\n${chan ? 'lo_trinh:\n  chan: true\n' : ''}`);
  return d;
}

// Gọi khoaBat() mặc định của một lệnh trong bản cài, rồi giải khoá ra trên `kho`. → stdout (JSON một dòng).
const MA_CON = {
  'chan-lo-trinh': (cai, kho) => ['-e', `const l = require(${JSON.stringify(path.join(cai, 'lib', 'chan-lo-trinh.cjs'))});
const k = l.khoaBat(); const kho = ${JSON.stringify(kho)};
process.stdout.write(JSON.stringify({ khoa: k, bat: k ? l.docBat(kho, k).bat : null, tt: l.trangThaiChan(kho) }));`],
  'lo-trinh-khoi-tao': (cai, kho) => ['--input-type=module', '-e', `const m = await import(${JSON.stringify(pathToFileURL(path.join(cai, TEP_KHOI_TAO)).href)});
const k = m.khoaBat(); const kho = ${JSON.stringify(kho)};
process.stdout.write(JSON.stringify({ khoa: k, bat: k ? m.docBat(kho, k).bat : null }));`],
};
function chayO(lenh, cai, kho) {
  const r = spawnSync(process.execPath, MA_CON[lenh](cai, kho), { encoding: 'utf8', cwd: TMP });
  if (r.status !== 0) throw new Error(`tiến trình con thoát ${r.status}: ${dong1(r.stderr)}`);
  return r.stdout;
}

// Nhát đổi trên bản sao bản cài: khớp đúng một lần, không thì hạ tầng hỏng.
function doiMot(p, re, thay) {
  const t = readFileSync(p, 'utf8'); const n = (t.match(new RegExp(re.source, 'g')) || []).length;
  if (n !== 1) throw new Error(`nhát đổi ${re} khớp ${n} lần ở ${p} (cần 1)`);
  writeFileSync(p, t.replace(re, thay));
}
function doThu(lenh, cay, tepKhai, ten) {
  const cai = banCai(cay, tepKhai);
  if (tepKhai === 'có') {
    const p = path.join(cai, '.claude-plugin', 'marketplace.json'); const j = JSON.parse(readFileSync(p, 'utf8'));
    j.name = 'cho-thu'; writeFileSync(p, JSON.stringify(j, null, 2));
  } else doiMot(path.join(cai, 'lib', 'ho-goi.cjs'), /const CHO = '[^']*';/, "const CHO = 'cho-thu';");
  const khoa = `${ten}@cho-thu`;
  return { khoa, ra: JSON.parse(chayO(lenh, cai, khoBat(khoa))).khoa };
}

function kiemO([lenh, boCuc, tepKhai, gocIn, quanHe]) {
  const mong = MONG[boCuc]; const ten = mong.split('@')[0];
  const kho = khoBat(mong);
  const ra = chayO(lenh, banCai(CAY[boCuc].cay, tepKhai), kho);
  const raG = chayO(lenh, banCai(CAY[boCuc].goc, tepKhai), kho);
  const o = JSON.parse(ra); const g = JSON.parse(raG);
  if (o.khoa !== mong) return `khoá ${o.khoa} ≠ ${mong}`;
  if (o.bat !== true) return `khoá ${o.khoa} không giải được trên kho bật nó (docBat ${o.bat})`;
  if (lenh === 'chan-lo-trinh' && JSON.stringify(o.tt) !== '{"bat":true}') return `trangThaiChan ${JSON.stringify(o.tt)} ≠ {"bat":true}`;
  if (g.khoa !== gocIn) return `bản gốc in ${g.khoa}, ma trận viết trước ${gocIn}`;
  if (quanHe === 'bang' && ra !== raG) return `khác bản gốc: ${raG} → ${ra}`;
  if (quanHe === 'khac-ten' && ra === raG) return 'bằng bản gốc — mong khác đúng chữ tên gói';
  const t = doThu(lenh, CAY[boCuc].cay, tepKhai, ten);
  if (t.ra !== t.khoa) return `${tepKhai === 'có' ? 'tệp khai' : 'bảng tên'} đổi chợ mà khoá ra ${t.ra} ≠ ${t.khoa}`;
  const nguon = tepKhai === 'có' ? 'từ tệp khai' : 'từ bảng tên';
  const soGoc = quanHe === 'bang' ? 'bằng bản gốc từng byte' : `khác bản gốc đúng chữ tên gói (bản gốc in ${g.khoa})`;
  return { m: `${mong} ${nguon}, khoá bật giải được; ${soGoc}; ${tepKhai === 'có' ? 'tệp khai' : 'bảng tên'} đổi chợ → ${t.khoa}` };
}

for (const o of MA_TRAN) {
  const id = `SP ${o[0]} · ${o[1]} · ${o[2]}`;
  try { const r = kiemO(o); if (typeof r === 'string') bad(id, r); else ok(id, r.m); } catch (e) { bad(id, dong1(e.message || e)); }
}

// ── SP-CHU — mã nguồn khởi tạo lộ trình không còn tên gói viết cứng (cây đang đứng và bản ở kho mới) ────────────────
{
  const tim = [];
  const xet = (p, nhan, chu) => readFileSync(p, 'utf8').split('\n').forEach((l, i) => {
    for (const c of chu) if (l.includes(c)) tim.push(`${nhan}:${i + 1}: ${c}`);
  });
  try {
    xet(path.join(KIT, TEP_KHOI_TAO), TEP_KHOI_TAO, CHU_CUNG);
    const moi = path.join(gocGoi({ thuMuc: khoMoi }, 'loi'), TEP_KHOI_TAO);
    xet(moi, path.relative(khoMoi, moi), [MONG['mới']]);
    if (tim.length) { fail += 1; console.log(`  FAIL: SP còn chữ viết cứng — ${tim.join(' ; ')}`); }
    else { pass += 1; console.log('  PASS: SP mã nguồn hết chữ roadmap@delivery-loop (scripts/lo-trinh-khoi-tao.mjs)'); }
  } catch (e) { fail += 1; console.log(`  FAIL: SP còn chữ viết cứng — không đọc được mã nguồn: ${dong1(e.message)}`); }
}

// ── SP-NL-DU / SP-NL — kho tiêu thụ chép luật chặn; đủ bảng tên rồi gỡ bảng tên trên cùng kho ──────────────────────
const NAP = (lib, tat, bat) => ['-e', `let l;
try { l = require(${JSON.stringify(lib)}); } catch (e) { process.stdout.write('NAP-SAP ' + String(e.message).split('\\n')[0]); process.exit(0); }
const kq = { nap: true };
try { kq.ttTat = l.trangThaiChan(${JSON.stringify(tat)}); } catch (e) { kq.ttTat = 'NEM ' + e.message; }
try { kq.docBat = l.docBat(${JSON.stringify(bat)}, null).bat; } catch (e) { kq.docBat = 'NEM ' + e.message; }
try { kq.tt = l.trangThaiChan(${JSON.stringify(bat)}); } catch (e) { kq.tt = 'NEM ' + e.message; }
process.stdout.write(JSON.stringify(kq));`];
function chayNL(tieuThu, khoTat) {
  const lib = path.join(tieuThu, 'lib', 'chan-lo-trinh.cjs');
  const r = spawnSync(process.execPath, NAP(lib, khoTat, tieuThu), { encoding: 'utf8', cwd: TMP });
  if (r.status !== 0) return { sap: `tiến trình con thoát ${r.status}: ${dong1(r.stderr)}` };
  if (r.stdout.startsWith('NAP-SAP ')) return { sap: r.stdout.slice(8) };
  const cli = spawnSync(process.execPath, [lib, '--root', tieuThu, '--khong-base'], { encoding: 'utf8', cwd: TMP });
  return { ...JSON.parse(r.stdout), cli };
}
{
  let tieuThu; let khoTat; let duXanh = false;
  try {
    tieuThu = khoBat(MONG['cũ']); khoTat = khoBat(MONG['cũ'], { chan: false });
    mkdirSync(path.join(tieuThu, 'lib'));
    for (const f of ['chan-lo-trinh.cjs', 'ho-goi.cjs']) cpSync(path.join(KIT, 'lib', f), path.join(tieuThu, 'lib', f));
  } catch (e) {
    console.log(`HẠ TẦNG: dựng kho tiêu thụ hỏng — ${dong1(e.message || e)}`);
    rmSync(TMP, { recursive: true, force: true });
    process.exit(3);
  }
  const DONG_NOTE = 'NOTE: luật chặn lộ trình NOT ENFORCED';
  const du = chayNL(tieuThu, khoTat);
  if (du.sap) bad('SP-NL-DU', `nạp sập: ${du.sap}`);
  else if (du.docBat !== true || JSON.stringify(du.tt) !== '{"bat":true}') bad('SP-NL-DU', `khoá bật không giải được: docBat ${JSON.stringify(du.docBat)}, trangThaiChan ${JSON.stringify(du.tt)}`);
  else if (du.cli.status !== 0 || !du.cli.stdout.startsWith(DONG_NOTE)) bad('SP-NL-DU', `dòng lệnh thoát ${du.cli.status}: ${dong1(du.cli.stdout || du.cli.stderr)}`);
  else { duXanh = true; ok('SP-NL-DU kho đủ tệp → khoá bật giải được', 'docBat + trangThaiChan {bat:true}; dòng lệnh --khong-base in NOTE, thoát 0'); }

  unlinkSync(path.join(tieuThu, 'lib', 'ho-goi.cjs'));
  const nl = chayNL(tieuThu, khoTat);
  const lech = [];
  if (!nl.sap) {
    if (JSON.stringify(nl.ttTat) !== '{"bat":false}') lech.push(`kho chưa khai chặn: trangThaiChan ${JSON.stringify(nl.ttTat)}`);
    if (nl.docBat !== `NEM ${CAU_THIEU}`) lech.push(`docBat: ${nl.docBat}`);
    if (JSON.stringify(nl.tt) !== JSON.stringify({ loi: `${CAU_THIEU} (lo_trinh.chan đang khai)` })) lech.push(`trangThaiChan: ${JSON.stringify(nl.tt)}`);
    const dongCli = `VIOLATION [config]: ${CAU_THIEU} (lo_trinh.chan đang khai)`;
    if (nl.cli.status !== 1 || nl.cli.stdout.trim() !== dongCli) lech.push(`dòng lệnh thoát ${nl.cli.status}: ${dong1(nl.cli.stdout || nl.cli.stderr)}`);
  }
  const hong = m => { fail += 1; console.log(`  FAIL: SP-NL ${m}`); };
  if (!duXanh) hong('đối chứng dương hỏng: SP-NL-DU không xanh — không tin được ca âm');
  else if (nl.sap) hong(`nạp sập: ${nl.sap}`);
  else if (lech.length) hong(`thông điệp lệch: ${lech[0]}`);
  else ok(`SP-NL kho tiêu thụ thiếu lib/ho-goi.cjs → nạp luật chặn thoát êm; chỗ cần bảng tên in «${CAU_THIEU}»`);
}

rmSync(TMP, { recursive: true, force: true });
console.log(`bang-ten-lo-trinh: ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
