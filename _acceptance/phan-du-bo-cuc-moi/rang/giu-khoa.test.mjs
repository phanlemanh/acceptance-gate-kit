// giu-khoa.test.mjs — ca tự phá của thước giữ khoá (hồ sơ phan-du-bo-cuc-moi, kế hoạch Task 2; E1, E12).
//
//   DO-TU-KIEM — bản đồng nhất mà `--chieu-do` thay cho tests/bo-cuc.mjs: đủ export của bộ dịch thật, và ra KHÁC bộ dịch
//                thật ở kho mới (bản tiêm phải khác bản gốc — không thì chiều đỏ đo cái không đổi gì).
//   CU-DO      — `--cu` trên một bản sao kho: commit «hỏng» xoá một dòng của ma trận tests/scripts/bo-cuc.test.mjs (mất
//                các ca «BC <đường> · <cây>» của dòng ấy) → «FAIL: CU tests/scripts/bo-cuc.test.mjs — mất khoá: …», mã 1.
//   CU-DO-DP   — cùng hình trên tests/dieu-phoi/ten-may-mot-luat.test.mjs (bộ dieu-phoi đọc TAP tầng ngoài): ca
//                «TM-1 khu-hoi» thành test.skip → mất khỏi túi đạt → «… mất khoá: TM-1 khu-hoi», mã 1.
//   GUI-B2-SO  — khối máy của gui-b2.md: bên ghi và bên đọc round-trip; phép so lệch hai chiều có tên, khớp thì rỗng.
//   RTS        — cột tệp «run-tests.sh» của khoa-dich.tsv chạy lượt bash của tệp shell (scripts: `--manh bash`), không `node`.
//   KHOA-N     — khoá đích mang «<n>» (RT13) khớp khoá chạy có một dãy số đúng chỗ; khoá khác so nguyên chữ.
//   TUI-B6     — tệp còn đi bước 6: túi so với kho mới bản gốc (locTheoGoc); K4-DN tách sáu khoá khỏi K4-SC.
//   BT-III     — biến thể (iii): bước 6 bỏ đúng các tệp khai ở khối GUI-B2-TU-DUNG của gui-b2.md, tệp khác bằng (ii).
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

// ── RTS — cột tệp «run-tests.sh» chạy lượt bash của chính tệp shell, không `node <tệp shell>` (đối chứng: tệp .test.mjs) ─
try {
  const GK = await import(pathToFileURL(path.join(HERE, 'giu-khoa.mjs')).href);
  const u = GK.donViCua('scripts', 'run-tests.sh', 'RL13fix', KIT);
  const p = GK.donViCua('plugins', 'run-tests.sh', 'x', KIT);
  const dc = GK.donViCua('scripts', 'bo-cuc.test.mjs', 'BC-DU', KIT);
  const sai = [];
  if (!(u.length === 1 && JSON.stringify(u[0].cmd) === JSON.stringify(['bash', 'tests/scripts/run-tests.sh', '--manh', 'bash']))) sai.push(`scripts: ${JSON.stringify(u.map(x => x.cmd))}`);
  if (!(p.length === 1 && JSON.stringify(p[0].cmd) === JSON.stringify(['bash', 'tests/plugins/run-tests.sh']))) sai.push(`plugins: ${JSON.stringify(p.map(x => x.cmd))}`);
  if (!(dc.length === 1 && dc[0].cmd[0] === 'node' && dc[0].cmd[1] === 'tests/scripts/bo-cuc.test.mjs')) sai.push(`đối chứng .test.mjs: ${JSON.stringify(dc.map(x => x.cmd))}`);
  sai.length ? bad('RTS', sai.join(' · ')) : ok('RTS', 'run-tests.sh (scripts) → «bash tests/scripts/run-tests.sh --manh bash», (plugins) → «bash tests/plugins/run-tests.sh»; đối chứng: bo-cuc.test.mjs → «node …»');
} catch (e) { console.log(`HẠ TẦNG: RTS — ${String(e.message || e).split('\n')[0]}`); ketThuc(3); }

// ── KHOA-N — khoá đích «<n>» khớp một dãy số ở đúng chỗ ấy; khoá khác so nguyên chữ ───────────────────────────────────
try {
  const GK = await import(pathToFileURL(path.join(HERE, 'giu-khoa.mjs')).href);
  const { docKhoaDich } = await import(pathToFileURL(path.join(HERE, 'tui-khoa.mjs')).href);
  const rt = docKhoaDich(path.join(HERE, '..', 'khoa-dich.tsv')).filter(h => h.khoa.startsWith('[RT13]'));
  const N = '[RT13] đọc-cũ: broken rỗng, khác biệt đúng khối; hồ sơ sinh sau mốc: <n>';
  const m = new Map([['[RT13] đọc-cũ: broken rỗng, khác biệt đúng khối; hồ sơ sinh sau mốc: 248', 1], ['[RT13] đọc-cũ: broken rỗng; hồ sơ sinh sau mốc: 248', 1], ['X: 248', 1]]);
  const sai = [];
  if (!(rt.length === 1 && rt[0].khoa === N)) sai.push(`khoa-dich.tsv RT13: ${JSON.stringify(rt.map(h => h.khoa))}`);
  if (GK.demKhoa(m, N) !== 1) sai.push(`khoá «<n>» khớp ${GK.demKhoa(m, N)} khoá chạy, chờ 1 (đúng chữ quanh số)`);
  if (GK.demKhoa(new Map([['[RT13] đọc-cũ: broken rỗng, khác biệt đúng khối; hồ sơ sinh sau mốc: ', 1]]), N) !== 0) sai.push('«<n>» khớp cả chỗ không có số');
  if (GK.demKhoa(m, 'X: 247') !== 0) sai.push('khoá không «<n>» mà số khác vẫn khớp (chuẩn hoá lan sang khoá khác)');
  if (GK.demKhoa(m, 'X: 248') !== 1) sai.push('đối chứng: khoá nguyên chữ không khớp chính nó');
  const v = GK.veDangN(m, [N]);
  if (!(v.get(N) === 1 && v.get('X: 248') === 1 && v.size === 3)) sai.push(`túi về dạng «<n>» (cho --cu, túi --moi): ${JSON.stringify([...v])}`);
  // KHOA_N_CU: CTN-AC6-kit đếm báo cáo của cây — 232 ở bản gốc, 233 ở HEAD phải so bằng nhau; mất hẳn ca vẫn đỏ.
  const { soTui } = await import(pathToFileURL(path.join(HERE, 'tui-khoa.mjs')).href);
  const ctn = (n) => `CTN-AC6-kit chieu im tren ${n} bao cao kit: chi dong bon khoa o vi tri truong doi`;
  if (!GK.KHOA_N_CU.some(k => GK.khopKhoa(k, ctn(233)))) sai.push('KHOA_N_CU không có khoá CTN-AC6-kit');
  const sCtn = soTui(GK.veDangN(new Map([[ctn(232), 1]]), GK.KHOA_N_CU), GK.veDangN(new Map([[ctn(233), 1]]), GK.KHOA_N_CU));
  if (sCtn.thieu.length) sai.push(`CTN-AC6-kit 232→233 vẫn «mất khoá»: ${sCtn.thieu.join(', ')}`);
  const sMat = soTui(GK.veDangN(new Map([[ctn(232), 1]]), GK.KHOA_N_CU), GK.veDangN(new Map([['CTN-AC6-dot-bien x', 1]]), GK.KHOA_N_CU));
  if (sMat.thieu.length !== 1) sai.push('chiều đỏ: CTN-AC6-kit mất hẳn ở HEAD mà phép so không báo thiếu');
  sai.length ? bad('KHOA-N', sai.join(' · ')) : ok('KHOA-N', 'RT13 ở khoa-dich.tsv mang «<n>»; khớp «…: 248», không khớp chữ khác hay chỗ trống số; khoá thường «X: 247» không khớp «X: 248»; túi về dạng «<n>» chỉ đổi khoá RT13');
} catch (e) { console.log(`HẠ TẦNG: KHOA-N — ${String(e.message || e).split('\n')[0]}`); ketThuc(3); }

// ── TUI-B6 — tệp còn đi bước 6: túi cũ chỉ giữ ca mà kho mới bản gốc cũng có; ca vòng làm mất vẫn đỏ ──────────────────
// Đối chứng dương: ca cần bảng vá (vắng ở cả bản gốc kho mới và HEAD kho mới) không đỏ. Chiều đỏ: ca bản gốc kho mới có mà
// HEAD kho mới mất → «thiếu». Đặc hiệu: ca thêm ở HEAD không đòi. Thêm: K4-DN tách đúng sáu khoá khỏi K4-SC.
try {
  const { locTheoGoc, soTui, docKhoaDich } = await import(pathToFileURL(path.join(HERE, 'tui-khoa.mjs')).href);
  const GK = await import(pathToFileURL(path.join(HERE, 'giu-khoa.mjs')).href);
  const cu = new Map([['P30', 1], ['P61', 1], ['RT13', 2], ['moi-them', 1]]);
  const goc = new Map([['P61', 1], ['RT13', 2]]);
  const sai = [];
  const lanh = soTui(locTheoGoc(cu, goc), new Map([['P61', 1], ['RT13', 2]]));
  if (lanh.thieu.length) sai.push(`đối chứng dương: ca cần bảng vá vẫn đòi — ${lanh.thieu.join(', ')}`);
  const hong = soTui(locTheoGoc(cu, goc), new Map([['RT13', 1]]));
  if (hong.thieu.join(',') !== 'P61,RT13') sai.push(`chiều đỏ: chờ thiếu «P61,RT13», được «${hong.thieu.join(',')}»`);
  if (soTui(cu, new Map([['P61', 1], ['RT13', 2]])).thieu.length !== 2) sai.push('đối chứng: túi không lọc phải thiếu P30 và moi-them');
  const h = docKhoaDich(path.join(HERE, '..', 'khoa-dich.tsv'));
  const dn = h.filter(x => x.cum === 'K4-DN');
  if (dn.length !== 6 || !GK.NGOAI_VONG.includes('K4-DN') || GK.VONG.includes('K4-DN')) sai.push(`K4-DN: ${dn.length} khoá, ngoài vòng ${GK.NGOAI_VONG.includes('K4-DN')}`);
  if (h.filter(x => x.cum === 'K4-SC').length !== 71) sai.push(`K4-SC còn ${h.filter(x => x.cum === 'K4-SC').length}, chờ 71`);
  // Luật danh sách tự đúng đường trên dữ liệu thật (đối chứng dương: khớp, rỗng) và trên bản bớt một tệp (chiều đỏ: tên tệp).
  const base = git(KIT, 'merge-base', 'HEAD', 'origin/main');
  const sua = git(KIT, 'diff', '--name-only', '--diff-filter=d', base, '--', 'tests').split('\n').filter(Boolean);
  const td = GK.docTuDung(readFileSync(path.join(HERE, '..', 'gui-b2.md'), 'utf8'));
  const that = GK.lechLuatTuDung(sua, td);
  if (that.length) sai.push(`luật danh sách lệch trên dữ liệu thật: ${that.join(' · ')}`);
  const bot = td.find(f => f.endsWith('kho-cam-ket-co-lo-trinh.test.mjs'));
  const pha = GK.lechLuatTuDung(sua, td.filter(f => f !== bot));
  if (!(pha.length === 1 && pha[0].startsWith(`${bot}: vòng sửa mà không khai tự đúng đường`))) sai.push(`chiều đỏ luật danh sách: ${JSON.stringify(pha)}`);
  sai.length ? bad('TUI-B6', sai.join(' · ')) : ok('TUI-B6', `ca vắng ở cả bản gốc kho mới không đòi; ca bản gốc kho mới có mà HEAD mất → thiếu (đếm cả số lần); K4-DN 6 khoá ngoài vòng, K4-SC 71; luật danh sách: ${sua.length} tệp vòng sửa = ${td.length} tự đúng đường + ${GK.VAN_BUOC6.length} còn đi bước 6, bớt ${path.basename(bot)} → một dòng có tên`);
} catch (e) { console.log(`HẠ TẦNG: TUI-B6 — ${String(e.message || e).split('\n')[0]}`); ketThuc(3); }

// ── BT-III — biến thể (iii): bước 6 bỏ đúng các tệp khai ở gui-b2.md, mọi tệp khác như (ii) ────────────────────────────
// Không rỗng: có tệp khai mà (ii) viết khác (i) (bỏ qua thật sự đổi gì), có tệp không khai mà (ii) viết khác (i) (bước 6
// vẫn chạy). Ba kho mới dựng từ HEAD của kit trong thư mục tạm.
try {
  const GK = await import(pathToFileURL(path.join(HERE, 'giu-khoa.mjs')).href);
  const ds = GK.docTuDung(readFileSync(path.join(HERE, '..', 'gui-b2.md'), 'utf8'));
  if (!ds || !ds.length) bad('BT-III', 'gui-b2.md không có khối GUI-B2-TU-DUNG');
  else {
    const ctx = GK.moCtx(); const head = git(KIT, 'rev-parse', 'HEAD');
    try {
      const k = { i: GK.khoMoi(ctx, head, 't-i', { ten: true }), ii: GK.khoMoi(ctx, head, 't-ii', { ten: true, buoc6: true }), iii: GK.khoMoi(ctx, head, 't-iii', { ten: true, buoc6: true, boQua: ds }) };
      const doc = (d, t) => { try { return readFileSync(path.join(d, t), 'utf8'); } catch { return null; } };
      const tep = git(k.ii, 'ls-files', '--', 'tests').split('\n').filter(Boolean);
      const bq = new Set(ds); const sai = []; let khaiDoi = 0; let ngoaiDoi = 0;
      for (const t of tep) {
        const [a, b, c] = ['i', 'ii', 'iii'].map(x => doc(k[x], t));
        if (bq.has(t)) { if (c !== a) sai.push(`tệp khai bị bước 6 viết: ${t}`); if (b !== a) khaiDoi++; }
        else { if (c !== b) sai.push(`tệp không khai lệch (ii): ${t}`); if (b !== a) ngoaiDoi++; }
      }
      if (!khaiDoi) sai.push('không tệp khai nào bị bước 6 viết ở (ii) — bỏ qua không đo gì');
      if (!ngoaiDoi) sai.push('không tệp ngoài danh sách nào bị bước 6 viết — bước 6 không chạy');
      sai.length ? bad('BT-III', sai.slice(0, 5).join(' · ')) : ok('BT-III', `${ds.length} tệp khai giữ bản (i) (${khaiDoi} trong số đó bước 6 viết khác ở (ii)); ${tep.length - ds.length} tệp còn lại bằng (ii) (${ngoaiDoi} bước 6 có viết)`);
    } finally { rmSync(ctx.tmp, { recursive: true, force: true }); }
  }
} catch (e) { console.log(`HẠ TẦNG: BT-III — ${String(e.message || e).split('\n')[0]}`); ketThuc(3); }

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
