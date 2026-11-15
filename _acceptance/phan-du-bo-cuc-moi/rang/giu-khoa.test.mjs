// giu-khoa.test.mjs — ca tự phá của thước giữ khoá (hồ sơ phan-du-bo-cuc-moi, kế hoạch Task 2; E1, E12).
//
//   DO-TU-KIEM — bản đồng nhất mà `--chieu-do` thay cho tests/bo-cuc.mjs: đủ export của bộ dịch thật, và ra KHÁC bộ dịch
//                thật ở kho mới (bản tiêm phải khác bản gốc — không thì chiều đỏ đo cái không đổi gì).
//   CU-DO      — `--cu` trên một bản sao kho: commit «hỏng» xoá một dòng của ma trận tests/scripts/bo-cuc.test.mjs (mất
//                các ca «BC <đường> · <cây>» của dòng ấy) → «FAIL: CU tests/scripts/bo-cuc.test.mjs — mất khoá: …», mã 1.
//   CU-DO-DP   — cùng hình trên tests/dieu-phoi/ten-may-mot-luat.test.mjs (bộ dieu-phoi đọc TAP tầng ngoài): ca
//                «TM-1 khu-hoi» thành test.skip → mất khỏi túi đạt → «… mất khoá: TM-1 khu-hoi», mã 1.
//   GUI-B2-SO  — khối máy của gui-b2.md: bên ghi và bên đọc round-trip; phép so lệch hai chiều có tên, khớp thì rỗng.
// Mỗi ca CU có ĐỐI CHỨNG DƯƠNG trên cùng fixture: commit «lành» chỉ thêm một dòng chú thích vào cùng tệp → «PASS: CU <tệp>
// — …», mã 0. Fixture do mã sinh: bản sao `git clone --shared` của kho (lịch sử đủ — ca bộ dịch đọc `git log`), phủ các tệp
// đang viết của rang/ rồi commit «gốc»; gốc kho suy từ vị trí tệp này; không ghi gì vào cây kit. Hạ tầng hỏng → mã 3.
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..', '..');
const REL_RANG = path.relative(KIT, HERE);
const ENV = { ...process.env, GIT_CONFIG_NOSYSTEM: '1', GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t', GIU_KHOA_BO_TU_PHA: '1' };
delete ENV.NODE_TEST_CONTEXT;
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', env: ENV, stdio: ['ignore', 'pipe', 'pipe'] }).trim();

let pass = 0; let fail = 0;
const ok = (id, m) => { pass += 1; console.log(`  PASS: ${id} — ${m}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };
const dongCuoi = s => String(s || '').trim().split('\n').filter(Boolean).slice(-3).join(' | ');

let TMP;
try {
  TMP = realpathSync(mkdtempSync(path.join(tmpdir(), 'giu-khoa-test-')));
} catch (e) { console.log(`HẠ TẦNG: thư mục tạm — ${e.message}`); process.exit(3); }
const ketThuc = (ma) => { rmSync(TMP, { recursive: true, force: true }); process.exit(ma); };

// ── DO-TU-KIEM ──────────────────────────────────────────────────────────────────────────────────────────────────────
try {
  const GK = await import(pathToFileURL(path.join(HERE, 'giu-khoa.mjs')).href);
  const { dungKhoMoi } = await import(pathToFileURL(path.join(KIT, '_acceptance', 'goi-cheo-loi-dieu-phoi', 'rang', 'luat-doi-chu.mjs')).href);
  const phang = path.join(TMP, 'phang'); const moi = path.join(TMP, 'moi');
  execFileSync('bash', ['-c', 'mkdir -p "$2" && set -o pipefail && git -C "$1" archive HEAD | tar -x -C "$2"', '_', KIT, phang]);
  dungKhoMoi(phang, moi);
  const that = await import(pathToFileURL(path.join(phang, 'tests', 'bo-cuc.mjs')).href);
  const dn = path.join(phang, 'tests', 'bo-cuc-dong-nhat.mjs');
  writeFileSync(dn, GK.banDongNhat());
  const gia = await import(pathToFileURL(dn).href);
  const thieu = Object.keys(that).filter(k => !(k in gia));
  const vao = 'scripts/lo-trinh.mjs';
  const raThat = that.duong(vao, { thuMuc: moi }); const raGia = gia.duong(vao, { thuMuc: moi });
  if (thieu.length) bad('DO-TU-KIEM', `bản đồng nhất thiếu export: ${thieu.join(', ')}`);
  else if (raThat === raGia) bad('DO-TU-KIEM', `bản đồng nhất ra BẰNG bộ dịch thật ở kho mới (${raThat}) — chiều đỏ không đo gì`);
  else if (raGia !== vao) bad('DO-TU-KIEM', `bản đồng nhất ra ${raGia}, chờ ${vao}`);
  else ok('DO-TU-KIEM', `bản đồng nhất đủ ${Object.keys(that).length} export; ở kho mới ra ${raGia}, bộ dịch thật ra ${raThat}`);
} catch (e) { console.log(`HẠ TẦNG: DO-TU-KIEM — ${String(e.message || e).split('\n')[0]}`); ketThuc(3); }

// ── GUI-B2-SO — khối máy của gui-b2.md: bên ghi và bên đọc round-trip; phép so khớp thì rỗng, lệch hai chiều thì có tên ──
try {
  const GK = await import(pathToFileURL(path.join(HERE, 'giu-khoa.mjs')).href);
  const va = JSON.parse(readFileSync(path.join(HERE, 'va-bo-kiem-b2.json'), 'utf8'));
  const mau = [va[0], va.find(v => v.cu.includes('\n')) || va[1], va.find(v => v.cu.includes('`')) || va[2]].map(v => ({ tep: v.tep, cu: v.cu, so_lan: v.so_lan }));
  const doc = GK.docKhoiGuiB2(`# x\n\n${GK.khoiGuiB2(mau, va.length)}\n\n## sau\n{"tep":"ngoai-khoi","cu":"x"}\n`);
  const sai = [];
  if (JSON.stringify(doc) !== JSON.stringify(mau)) sai.push(`round-trip lệch: ghi ${mau.length} mục, đọc ${doc ? doc.length : 'null'}`);
  if (GK.lechGuiB2(mau, doc || []).length) sai.push('đối chứng: hai danh sách bằng nhau mà vẫn lệch');
  const thieu = GK.lechGuiB2(mau, mau.slice(1)); const thua = GK.lechGuiB2(mau.slice(1), mau);
  if (!(thieu.length === 1 && thieu[0].startsWith(`máy rút mà tệp không có: ${mau[0].tep} · `))) sai.push(`chiều đỏ (tệp thiếu mục): ${JSON.stringify(thieu)}`);
  if (!(thua.length === 1 && thua[0].startsWith(`tệp có mà máy không rút: ${mau[0].tep} · `))) sai.push(`chiều đỏ (tệp thừa mục): ${JSON.stringify(thua)}`);
  if (GK.docKhoiGuiB2('# không có khối\n') !== null) sai.push('tệp không có khối mà bộ đọc không trả null');
  sai.length ? bad('GUI-B2-SO', sai.join(' · ')) : ok('GUI-B2-SO', `ghi→đọc ${mau.length} mục (có mục nhiều dòng) giữ nguyên; khớp → 0 lệch; thiếu/thừa một mục → đúng một dòng lệch có tên`);
} catch (e) { console.log(`HẠ TẦNG: GUI-B2-SO — ${String(e.message || e).split('\n')[0]}`); ketThuc(3); }

// ── fixture kho cho CU-DO / CU-DO-DP ────────────────────────────────────────────────────────────────────────────────
let F; let GOC;
try {
  F = path.join(TMP, 'kho');
  execFileSync('git', ['clone', '-q', '--shared', '--no-checkout', KIT, F], { env: ENV, stdio: 'ignore' });
  git(F, 'checkout', '-q', '--detach', git(KIT, 'rev-parse', 'HEAD'));
  for (const t of readdirSync(HERE)) cpSync(path.join(HERE, t), path.join(F, REL_RANG, t), { recursive: true });
  git(F, 'add', '-A'); git(F, 'commit', '-q', '--allow-empty', '-m', 'gốc: tệp đang viết của rang/');
  GOC = git(F, 'rev-parse', 'HEAD');
} catch (e) { console.log(`HẠ TẦNG: dựng bản sao kho — ${String(e.message || e).split('\n')[0]}`); ketThuc(3); }

const giuKhoa = () => spawnSync(process.execPath, [path.join(F, REL_RANG, 'giu-khoa.mjs'), '--cu', '--base', GOC], { cwd: F, encoding: 'utf8', env: ENV, maxBuffer: 1 << 26 });
function commitTren(tep, doi, tieuDe) {
  git(F, 'checkout', '-q', '--detach', GOC);
  const p = path.join(F, tep); const t = readFileSync(p, 'utf8'); const t2 = doi(t);
  if (t2 === null) return false;
  writeFileSync(p, t2); git(F, 'commit', '-q', '-am', tieuDe);
  return true;
}

function caCu(id, tep, cuNhat, moiNhat, khoaMat) {
  // đối chứng dương: cùng tệp, đổi một dòng chú thích → túi khoá giữ nguyên, mã 0
  commitTren(tep, t => `${t}\n// lành: ${id}\n`, `lành ${id}`);
  const lanh = giuKhoa();
  if (/HẠ TẦNG/.test(lanh.stdout)) { console.log(`HẠ TẦNG: ${id} lần lành — ${dongCuoi(lanh.stdout)}`); ketThuc(3); }
  const dongLanh = `PASS: CU ${tep} — `;
  if (lanh.status !== 0 || !lanh.stdout.includes(dongLanh)) { bad(`${id}-LANH`, `bản lành: mã ${lanh.status}, chờ 0 và «${dongLanh}…»; ${dongCuoi(lanh.stdout)} ${dongCuoi(lanh.stderr)}`); return; }
  ok(`${id}-LANH`, `bản lành của ${tep} → mã 0, «${lanh.stdout.split('\n').find(l => l.includes(dongLanh)).trim()}»`);
  // phá: xoá một ca khỏi bản sao HEAD → phép so phải đỏ đúng câu
  const ap = commitTren(tep, t => (t.split(cuNhat).length === 2 ? t.replace(cuNhat, moiNhat) : null), `hỏng ${id}`);
  if (!ap) { bad(id, `nhát phá không áp: ${tep} không có đúng một chỗ «${cuNhat}»`); return; }
  const hong = giuKhoa();
  if (/HẠ TẦNG/.test(hong.stdout)) { console.log(`HẠ TẦNG: ${id} lần phá — ${dongCuoi(hong.stdout)}`); ketThuc(3); }
  const cau = `FAIL: CU ${tep} — mất khoá: ${khoaMat}`;
  if (hong.status === 1 && hong.stdout.includes(cau)) ok(id, `xoá ca khỏi bản sao HEAD → mã 1, «${cau}»`);
  else bad(id, `${id} phép so không đỏ: mã ${hong.status}, chờ 1 và «${cau}»; ${dongCuoi(hong.stdout)}`);
}

caCu('CU-DO', 'tests/scripts/bo-cuc.test.mjs',
  "  ['tri-thuc/commands/ghi.md', 'plugins/knowledge/commands/ingest.md'],\n", '',
  'BC tri-thuc/commands/ghi.md · cây phẳng');
caCu('CU-DO-DP', 'tests/dieu-phoi/ten-may-mot-luat.test.mjs',
  "test('TM-1 khu-hoi',", "test.skip('TM-1 khu-hoi',",
  'TM-1 khu-hoi');

console.log(`\ngiu-khoa.test: ${pass} passed, ${fail} failed`);
ketThuc(fail ? 1 : 0);
