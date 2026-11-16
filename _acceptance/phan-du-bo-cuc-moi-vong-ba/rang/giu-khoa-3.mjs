#!/usr/bin/env node
// giu-khoa-3.mjs — thước giữ khoá của hồ sơ phan-du-bo-cuc-moi-vong-ba (design §3.4; E2, E4–E10).
//
//   --tinh                 LUẬT TĨNH, vài giây, chạy đầu MỌI chế độ (đỏ → dừng trước khi chạy tệp kiểm nào):
//                          (1) tệp vòng sửa dưới tests/ (git diff GOC_VONG..HEAD, trừ NGHI_THUC) = khối tự đúng đường của
//                          gui-b2.md ∪ VAN_BUOC6_3; (2) mỗi khoá đích của các cụm vòng nhận có tệp nguồn ở HEAD;
//                          (3) bộ tự kiểm `giu-khoa-3.test.mjs` xanh; (4) gui-b2.md đủ bốn mục, khối vá thừa khớp máy rút.
//   --cu                   mỗi tệp kiểm vòng chạm ở GOC_VONG (ghim, KHÔNG merge-base) và ở HEAD: túi HEAD ⊇ túi gốc, mọi
//                          ca HEAD xanh; CU-DO tự phá (xoá một ca trên bản sao HEAD) phải làm phép so đỏ.
//   --moi [--cum <cụm>]    kho mới từ HEAD (bước 1–3 + luật đổi tên + luật chung bước 6, bỏ qua tự đúng đường vòng hai ∪ vòng
//                          ba, không bảng vá) → mọi khoá đích của cụm có mặt và xanh; túi mỗi tệp ⊇ túi bố cục cũ.
//   --sau-gop              bản sao HEAD có origin/main = HEAD → tệp nhóm A của rang/ra-lop-merge-base.md và tệp vòng chạm
//                          có gọi merge-base xanh; RA-LOP: tập tệp gọi merge-base (grep lúc chạy) = tập trong bảng;
//                          SAU-GOP-DO: bang-ten-lo-trinh ở GOC_VONG sau gộp phải đỏ (lỗi đã biết).
//   --chieu-do             kho mới, bộ dịch thay bằng bản đồng nhất và haiCay thay bằng bản luôn bung cây đang chạy → ca
//                          canh mỗi cụm đỏ đúng câu ghim (đối chứng dương: xanh với bản thật).
//   --ghi-gui-b2           rút mục vá thừa (ảnh chụp va-bo-kiem-b2.json) và ghi khối máy của gui-b2.md.
//
// Dùng lại hàm xuất của thước vòng hai (`khoMoi`, `moCtx`, `docTuDung`, `lechLuatTuDung`, `banDongNhat`, `khoiGuiB2`,
// `docKhoiGuiB2`, `lechGuiB2`, `demKhoa`, `veDangN`, `khopKhoa`) và `tui-khoa.mjs` — không sửa byte nào của hồ sơ đã ký;
// phần chạy (spawn, hàng đợi theo cây) chép từ giu-khoa.mjs vòng hai vì nó không được xuất.
// Mọi cây là bản sao `git clone --shared` ở thư mục tạm, HOME rỗng; gốc kho suy từ vị trí tệp này; không ghi vào cây kit
// trừ --ghi-gui-b2. Thoát: 0 · 1 có FAIL · 2 sai đối số · 3 «HẠ TẦNG: …» (không in PASS nào).
import { execFileSync, spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chuanHoa, docKhoaDich, doiKhoa, gop, rutKhoa, soTui, tuiCu } from '../../phan-du-bo-cuc-moi/rang/tui-khoa.mjs';
import { BX } from '../../phan-du-bo-cuc-moi/rang/buoc6-chep.mjs';
import {
  banDongNhat, demKhoa, docKhoiGuiB2, docTuDung, khoMoi, khoiGuiB2, lechGuiB2, lechLuatTuDung, moCtx, veDangN,
} from '../../phan-du-bo-cuc-moi/rang/giu-khoa.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const GOC = path.resolve(HERE, '..', '..', '..');
const HO_SO = path.resolve(HERE, '..');
const KHOA_DICH = path.join(HO_SO, 'khoa-dich.tsv');
const GUI_B2 = path.join(HO_SO, 'gui-b2.md');
const GUI_B2_HAI = path.join(GOC, '_acceptance', 'phan-du-bo-cuc-moi', 'gui-b2.md');
const VA_B2 = path.join(HERE, 'va-bo-kiem-b2.json');
const RA_LOP = path.join(HERE, 'ra-lop-merge-base.md');
// Bản gốc GHIM: đỉnh nhánh chính lúc mở vòng (16/11). Không dùng merge-base — sau gộp merge-base trùng HEAD (lớp lỗi vòng này sửa).
export const GOC_VONG = '795baf966a78c4d72e9726024ff724076c23e8a6';
// Tệp nghi thức ký ghi (bước 7a-bis của lệnh ký thêm MỘT dòng `<slug>\t…` của hồ sơ). Tệp chỉ được bỏ khỏi tập vòng sửa khi
// mọi dòng đổi của nó là dòng THÊM mở đầu bằng slug của vòng (`dongNghiThuc`); sửa dòng khác thì tệp tính là vòng sửa.
export const NGHI_THUC = ['tests/scripts/fixtures/routing-baseline.txt'];
export const SLUG = 'phan-du-bo-cuc-moi-vong-ba';
// Tệp vòng sửa mà vẫn đi bước 6 (không tự đúng đường). Khai trước khi đo.
export const VAN_BUOC6_3 = [];
export const VONG = ['K4-MP', 'K4-LT', 'K4-TB', 'K4-RG'];
export const NGOAI_VONG = ['K4-DN', 'B2', 'K4-PL'];
const HET_GIO_MS = 90 * 60 * 1000;

class HaTang extends Error {}
const CON = new Set();
const giet = c => { try { process.kill(-c.pid, 'SIGKILL'); } catch { try { c.kill('SIGKILL'); } catch { /* đã chết */ } } };
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const dongCuoi = s => String(s || '').trim().split('\n').filter(Boolean).pop() || '';
const dongLoi = s => String(s || '').split('\n').map(l => l.trim()).find(l => /^(\w*Error\b|Error:|ERR_|HẠ TẦNG)|Cannot find|node lệch/.test(l)) || dongCuoi(s);
const ENV_GIT = { GIT_CONFIG_NOSYSTEM: '1', GIT_AUTHOR_NAME: 'giu-khoa-3', GIT_AUTHOR_EMAIL: 'giu-khoa-3@invalid', GIT_COMMITTER_NAME: 'giu-khoa-3', GIT_COMMITTER_EMAIL: 'giu-khoa-3@invalid' };
function git(d, ...a) {
  try { return execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', maxBuffer: 1 << 28, env: { ...process.env, ...ENV_GIT }, stdio: ['ignore', 'pipe', 'pipe'] }).trim(); }
  catch (e) { throw new HaTang(`git ${a.slice(0, 3).join(' ')}: ${dongCuoi(e.stderr) || e.message}`); }
}
const tam = (ctx, ten) => { const d = path.join(ctx.tmp, `${ten}-${++ctx.seq}`); mkdirSync(d, { recursive: true }); return d; };
// Bản sao kho ở `sha`; `originMain` = sha mà refs/remotes/origin/main trỏ (mặc định: như kho thật; --sau-gop: chính sha).
function nhanBan(ctx, sha, nhan, originMain = ctx.originMain) {
  const d = path.join(ctx.tmp, `${nhan}-${++ctx.seq}`);
  try { execFileSync('git', ['clone', '-q', '--shared', '--no-checkout', GOC, d], { env: { ...process.env, ...ENV_GIT }, stdio: 'ignore' }); }
  catch (e) { throw new HaTang(`nhân bản kho cho ${nhan}: ${e.message}`); }
  git(d, 'checkout', '-q', '--detach', sha);
  if (originMain) git(d, 'update-ref', 'refs/remotes/origin/main', originMain);
  return d;
}

// ── tập tệp vòng sửa + luật tĩnh (phần thuần — tự kiểm đo trực tiếp) ─────────────────────────────────────────────────
// `diffNghiThuc`: tệp nghi thức → đoạn `git diff -U0` của nó (GOC_VONG..HEAD). Bỏ tệp ấy chỉ khi `dongNghiThuc` đúng.
export function dongNghiThuc(diff, slug = SLUG) {
  const doi = String(diff || '').split('\n').filter(l => /^[+-]/.test(l) && !/^(\+\+\+|---) /.test(l));
  return doi.length > 0 && doi.every(l => l.startsWith(`+${slug}\t`));
}
export const tepVongSua = (dsDiff, diffNghiThuc = {}) => dsDiff.filter(t => t && !(NGHI_THUC.includes(t) && dongNghiThuc(diffNghiThuc[t])));
const diffNT = h => Object.fromEntries(NGHI_THUC.map(f => [f, git(GOC, 'diff', '-U0', GOC_VONG, h, '--', f)]));
export const MUC_GUI_B2 = ['## 1. Mục vá thừa', '## 2. Tệp tự đúng đường', '## 3. Cấu hình kịch bản phải đổi', '## 4. Ca đổi nghĩa'];
export const thieuMuc = t => MUC_GUI_B2.filter(m => !t.split('\n').some(l => l.startsWith(m)));
// Một khoá đích → tệp nguồn ở cây `goc` (bố cục cũ): `tests/<bộ>/<tệp>`; «run-tests.sh» và «(đầu)» là runner của bộ.
export function tepNguon(h) {
  if (h.tepKiem === '(đầu)' || h.tepKiem === 'run-tests.sh') return `tests/${h.bo}/run-tests.sh`;
  if (h.tepKiem === '?') return null;
  return `tests/${h.bo}/${h.tepKiem}`;
}
// Bảng rà lớp (rang/ra-lop-merge-base.md): dòng «| `tests/…` | A|B|C | …» → Map tệp → nhóm.
export function docRaLop(t) {
  const m = new Map();
  for (const l of t.split('\n')) { const x = l.match(/^\|\s*`(tests\/[^`]+)`\s*\|\s*([ABC])\s*\|/); if (x) m.set(x[1], x[2]); }
  return m;
}

// ── chạy (chép từ giu-khoa.mjs vòng hai: moiTruong / chayLenh / chay, không xuất ở đó) ─────────────────────────────────
function moiTruong(ctx, them = {}) {
  const e = { ...process.env, ...ENV_GIT };
  for (const k of ['NODE_TEST_CONTEXT', 'LT_CASES', 'ONLY_BLOCK', 'SCRIPTS_SHARD', 'SCRIPTS_SHARD_LIST', 'PLUGINS_SHARD', 'PLUGINS_SHARD_EMIT', 'GITHUB_ACTIONS', 'GITHUB_STEP_SUMMARY', 'NODE_OPTIONS']) delete e[k];
  e.PATH = `${path.dirname(process.execPath)}${path.delimiter}${process.env.PATH || ''}`;
  e.HOME = ctx.home;
  const t = tam(ctx, 't'); e.TMPDIR = t; e.THOI_GIAN_CA_DIR = path.join(t, 'tg');
  return { ...e, ...them };
}
function chayLenh(ctx, goc, cmd, them = {}) {
  return new Promise((res, rej) => {
    const t0 = Date.now();
    const [c, ...a] = cmd; const p = spawn(c === 'node' ? process.execPath : c, a, { cwd: goc, env: moiTruong(ctx, them), stdio: ['ignore', 'pipe', 'pipe'], detached: true });
    let out = ''; let err = ''; let het = false;
    const hg = setTimeout(() => { het = true; giet(p); }, HET_GIO_MS);
    CON.add(p);
    p.stdout.on('data', b => { out += b; }); p.stderr.on('data', b => { err += b; });
    p.on('error', e => { clearTimeout(hg); rej(new HaTang(`chạy ${cmd.join(' ')}: ${e.message}`)); });
    p.on('close', rc => {
      clearTimeout(hg); CON.delete(p);
      if (rc === 3 && /node lệch|chưa khai phiên bản Node/.test(err + out)) { rej(new HaTang(`node: ${dongCuoi(err) || dongCuoi(out)}`)); return; }
      res({ rc: het ? 'hết giờ' : rc, stdout: out, stderr: err, giay: Math.round((Date.now() - t0) / 1000) });
    });
  });
}
// Đơn vị chạy của một tệp kiểm (bộ scripts ghi thêm một dòng cho cả tệp — khoá «<tên tệp>»).
export function donViTep(rel) {
  const bo = rel.split('/')[1];
  if (bo === 'dieu-phoi') return { id: rel, bo, loai: 'tap', cmd: ['node', '--test', '--test-reporter=tap', rel] };
  if (/run-tests\.sh$/.test(rel)) return { id: rel, bo, loai: 'bash', cmd: ['bash', rel] };
  const tong = bo === 'scripts' && /\.(test|ca)\.mjs$/.test(rel) ? path.basename(rel) : null;
  return { id: rel, bo, loai: 'bash', cmd: ['node', rel], tong };
}
function chay(ctx, goc, u, { nhan = '', them = {} } = {}) {
  const k = `${goc}\0${u.id}\0${nhan}`;
  if (ctx.cache.has(k)) return ctx.cache.get(k);
  const truoc = ctx.hang.get(goc) || Promise.resolve();
  const p = truoc.catch(() => {}).then(async () => {
    process.stderr.write(`giu-khoa-3: chạy ${u.id}${nhan ? ` [${nhan}]` : ''} ở ${path.basename(goc)}\n`);
    const r = await chayLenh(ctx, goc, u.cmd, { ...(u.them || {}), ...them });
    const kq = rutKhoa(r.stdout, u.loai);
    if (u.tong) { const kk = chuanHoa(u.tong); const t = r.rc === 0 ? kq.dat : kq.do; t.set(kk, (t.get(kk) || 0) + 1); if (r.rc !== 0) kq.dongDo.set(kk, `FAIL: ${u.tong} (expected exit 0, got ${r.rc})`); }
    process.stderr.write(`giu-khoa-3: xong ${u.id}${nhan ? ` [${nhan}]` : ''} ở ${path.basename(goc)} — thoát ${r.rc}, ${r.giay}s\n`);
    return { ...kq, rc: r.rc, stderr: r.stderr, stdout: r.stdout, giay: r.giay };
  });
  ctx.hang.set(goc, p); ctx.cache.set(k, p);
  return p;
}
const cheKho = s => String(s).replace(/(?:\/private)?\/(?:var\/folders|tmp)\/\S*?\/giu-khoa-[^/\s]+\/[^/'"\s]+/g, '<kho>');
function lyDo(kq, re) {
  const d = [...kq.dongDo].find(([k]) => re.test(k));
  if (d) return cheKho(d[1]).replace(/^(PASS|FAIL):\s*/, '').slice(0, 220);
  return `vắng khỏi túi đạt (thoát ${kq.rc}: ${(dongLoi(cheKho(kq.stderr)) || dongLoi(cheKho(kq.stdout))).slice(0, 160)})`;
}
const reCa = ca => new RegExp(`^\\[?${esc(ca)}\\]?(?=[\\s:—]|$)`);
const xanhCa = (kq, re) => [...kq.dat.keys()].some(k => re.test(k)) && ![...kq.do.keys()].some(k => re.test(k));

// ── tập tệp ──────────────────────────────────────────────────────────────────────────────────────────────────────────
const head = () => git(GOC, 'rev-parse', 'HEAD');
const diffTests = h => git(GOC, 'diff', '--name-only', '--diff-filter=d', GOC_VONG, h, '--', 'tests').split('\n').filter(Boolean);
const tuDung2 = () => docTuDung(readFileSync(GUI_B2_HAI, 'utf8')) || [];
function tuDung3() {
  const ds = existsSync(GUI_B2) ? docTuDung(readFileSync(GUI_B2, 'utf8')) : null;
  if (!ds) throw new HaTang(`${path.relative(GOC, GUI_B2)} thiếu khối GUI-B2-TU-DUNG`);
  return ds;
}
// Tệp kiểm chạy được (tệp phụ trợ như tests/hai-bo-cuc.mjs đi qua tệp kiểm nạp nó — phải có ít nhất một trong tập sửa).
const chayDuoc = rel => /^tests\/[\w-]+\/(run-tests\.sh|[^/]+\.(test|ca)\.mjs)$/.test(rel) || /^tests\/dieu-phoi\/.+\.test\.mjs$/.test(rel);
export function donViSua(sua, docTep) {
  const chay0 = sua.filter(chayDuoc); const loi = [];
  for (const f of sua.filter(x => !chayDuoc(x))) {
    if (/\/fixtures\//.test(f)) continue;
    const ten = path.basename(f);
    if (!chay0.some(c => (docTep(c) || '').includes(ten))) loi.push(`${f}: không tệp kiểm vòng sửa nào nạp nó`);
  }
  return { donVi: chay0.map(donViTep), loi };
}

// ── --tinh ───────────────────────────────────────────────────────────────────────────────────────────────────────────
async function cheDoTinh(ctx, out) {
  const h = head(); let soFail = 0;
  const sua = tepVongSua(diffTests(h), diffNT(h));
  const td = tuDung3();
  const lech = lechLuatTuDung(sua, td, VAN_BUOC6_3);
  if (lech.length) { soFail++; for (const l of lech) out.push(`  FAIL: TINH ${l}`); }
  else out.push(`  PASS: TINH tệp vòng sửa = khối khai (${td.length} tự đúng đường + ${VAN_BUOC6_3.length} vẫn đi bước 6; loại ${NGHI_THUC.length} tệp nghi thức ký)`);
  const thieu = [];
  for (const r of docKhoaDich(KHOA_DICH).filter(r => VONG.includes(r.cum))) {
    const t = tepNguon(r); if (t && !existsSync(path.join(GOC, t))) thieu.push(`${r.cum} ${t} (${r.khoa})`);
  }
  if (thieu.length) { soFail++; for (const t of [...new Set(thieu)].slice(0, 20)) out.push(`  FAIL: TINH khoá đích không có tệp nguồn ở HEAD: ${t}`); }
  else out.push('  PASS: TINH khoá đích có tệp nguồn ở HEAD');
  const tk = spawnSync(process.execPath, [path.join(HERE, 'giu-khoa-3.test.mjs')], { encoding: 'utf8', cwd: GOC });
  const dong = (tk.stdout || '').trim().split('\n').pop();
  if (tk.status !== 0) { soFail++; out.push(`  FAIL: TINH tự kiểm thước thoát ${tk.status}: ${dongLoi(tk.stdout + tk.stderr)}`); }
  else out.push(`  PASS: TINH tự kiểm thước — ${dong}`);
  const g = existsSync(GUI_B2) ? readFileSync(GUI_B2, 'utf8') : '';
  const tm = thieuMuc(g);
  const ghi = docKhoiGuiB2(g);
  if (tm.length) { soFail++; out.push(`  FAIL: TINH gui-b2.md thiếu mục: ${tm.join(' · ')}`); }
  else if (!ghi) { soFail++; out.push('  FAIL: TINH gui-b2.md thiếu khối GUI-B2-VA-THUA'); }
  else {
    const may = vaThua(td);
    const l2 = lechGuiB2(may.thua, ghi);
    if (l2.length) { soFail++; for (const l of l2.slice(0, 10)) out.push(`  FAIL: TINH gui-b2 lệch: ${l}`); }
    else out.push(`  PASS: TINH gui-b2.md bốn mục; mục vá thừa máy rút khớp khối đã ghi (${may.thua.length}/${may.tong})`);
  }
  return soFail;
}
// Mục vá thừa: mục trên một tệp vòng ba khai tự đúng đường (bước 6 bỏ qua tệp ấy — không luật đường, không bảng vá).
// Ảnh chụp bảng vá của B2 ở rang/va-bo-kiem-b2.json (nguồn ghi ở đầu gui-b2.md).
export function vaThuaTu(va, td) {
  const bq = new Set(td);
  return { thua: va.filter(v => bq.has(v.tep)).map(v => ({ tep: v.tep, cu: v.cu, so_lan: v.so_lan, ly_do: 'tệp tự đúng đường' })), tong: va.length };
}
function vaThua(td) {
  if (!existsSync(VA_B2)) throw new HaTang(`${path.relative(GOC, VA_B2)} chưa có (ảnh chụp bảng vá B2)`);
  return vaThuaTu(JSON.parse(readFileSync(VA_B2, 'utf8')), td);
}

// ── --cu ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
export const TU_PHA = [
  { id: 'CU-DO', tep: 'tests/scripts/hai-bo-cuc.test.mjs', cu: "ok('HC cây phẳng'", moi: "void ('HC cây phẳng'", mat: 'HC cây phẳng' },
];
async function cheDoCu(ctx, out) {
  const h = head(); const sua = tepVongSua(diffTests(h), diffNT(h));
  const cGoc = nhanBan(ctx, GOC_VONG, 'ban-goc'); const cHead = nhanBan(ctx, h, 'head');
  const { donVi, loi } = donViSua(sua, f => (existsSync(path.join(cHead, f)) ? readFileSync(path.join(cHead, f), 'utf8') : null));
  let soFail = 0; let mat = 0; let dO = 0;
  for (const l of loi) { soFail++; out.push(`  FAIL: CU ${l}`); }
  const khoaN = [...new Set(docKhoaDich(KHOA_DICH).map(r => r.khoa).filter(k => k.includes('<n>')))];
  const kq = await Promise.all(donVi.map(async u => [u, existsSync(path.join(cGoc, u.id)) ? await chay(ctx, cGoc, u) : null, await chay(ctx, cHead, u)]));
  for (const [u, g, hh] of kq) {
    if ([g, hh].some(x => x && x.rc === 'hết giờ')) { soFail++; out.push(`  FAIL: CU ${u.id} — hết giờ: túi khoá không so được`); continue; }
    const s = soTui(veDangN(g ? g.dat : new Map(), khoaN), veDangN(hh.dat, khoaN));
    const doKhoa = [...hh.do.keys()];
    const doRc = hh.rc !== 0 && !doKhoa.length ? [`thoát ${hh.rc}: ${dongLoi(hh.stderr + hh.stdout).slice(0, 160)}`] : [];
    if (!s.thieu.length && !doKhoa.length && !doRc.length) { out.push(`  PASS: CU ${u.id} — ${s.tong}/${s.tong} khoá bản gốc còn ở HEAD, mọi ca xanh${g ? '' : ' (tệp mới)'}`); continue; }
    soFail++; mat += s.thieu.length; dO += doKhoa.length + doRc.length;
    for (const k of s.thieu) out.push(`  FAIL: CU ${u.id} — mất khoá: ${k}`);
    for (const k of [...doKhoa, ...doRc]) out.push(`  FAIL: CU ${u.id} — đỏ: ${k}`);
  }
  for (const p of TU_PHA) {
    const f = path.join(cHead, p.tep); const t0 = existsSync(f) ? readFileSync(f, 'utf8') : null;
    if (t0 === null || t0.split(p.cu).length !== 2) { soFail++; out.push(`  FAIL: ${p.id} nhát phá không áp: ${p.tep}`); continue; }
    const u = donViTep(p.tep); const lanh = await chay(ctx, cHead, u);
    writeFileSync(f, t0.replace(p.cu, p.moi));
    let pha; try { pha = await chay(ctx, cHead, u, { nhan: 'phá' }); } finally { writeFileSync(f, t0); }
    const s = soTui(lanh.dat, pha.dat);
    if ((lanh.dat.get(p.mat) || 0) && s.thieu.includes(p.mat)) out.push(`  PASS: ${p.id} ${p.tep} — bỏ ca «${p.mat}» trên bản sao HEAD → phép so đỏ: mất khoá ${s.thieu.length}`);
    else { soFail++; out.push(`  FAIL: ${p.id} phép so không đỏ — ${p.tep}`); }
  }
  out.push(`giu-khoa-3 --cu: ${donVi.length} tệp, ${mat} khoá mất, ${dO} ca đỏ`);
  return soFail;
}

// ── --moi ────────────────────────────────────────────────────────────────────────────────────────────────────────────
function donViKhoa(r, cay) {
  const t = tepNguon(r);
  if (t) return existsSync(path.join(cay, t)) ? [donViTep(t)] : [];
  const dir = path.join(cay, 'tests', r.bo); const ten = r.khoa.split(' ')[0];
  return readdirSync(dir).filter(f => /\.(test|ca)\.mjs$/.test(f)).filter(f => readFileSync(path.join(dir, f), 'utf8').includes(ten)).map(f => donViTep(`tests/${r.bo}/${f}`));
}
const khoMoi3 = (ctx, h, nhan) => khoMoi(ctx, h, nhan, { ten: true, buoc6: true, boQua: [...new Set([...tuDung2(), ...tuDung3()])] });
async function cheDoMoi(ctx, args, out) {
  const cums = args.cum ? [args.cum] : VONG; const h = head();
  const hang = docKhoaDich(KHOA_DICH);
  const khoaN = [...new Set(hang.map(r => r.khoa).filter(k => k.includes('<n>')))];
  const cHead = nhanBan(ctx, h, 'cu'); const moi = khoMoi3(ctx, h, 'moi');
  const dich = hang.filter(r => cums.includes(r.cum)).map(r => ({ ...r, dv: donViKhoa(r, cHead) }));
  const donVi = new Map(); for (const r of dich) for (const u of r.dv) donVi.set(u.id, u);
  const kq = new Map(await Promise.all([cHead, moi].flatMap(c => [...donVi.values()].map(async u => [`${c}\0${u.id}`, await chay(ctx, c, u)]))));
  const lay = (c, u) => kq.get(`${c}\0${u.id}`);
  let soFail = 0;
  for (const cum of cums) {
    const ds = dich.filter(r => r.cum === cum); const thieu = []; const dO = [];
    const can = new Map(); for (const r of ds) { const k = `${r.dv.map(u => u.id).join('|')}\0${r.khoa}`; can.set(k, { r, n: (can.get(k)?.n || 0) + 1 }); }
    for (const { r, n } of can.values()) {
      if (!r.dv.length) { for (let i = 0; i < n; i++) thieu.push(`${r.bo}: ${r.khoa} — không tìm được tệp chạy`); continue; }
      const t = gop(...r.dv.map(u => lay(moi, u)));
      const co = demKhoa(t.dat, r.khoa);
      for (let i = co; i < n; i++) (demKhoa(t.do, r.khoa) > i - co ? dO : thieu).push(`${r.bo}: ${r.khoa}`);
    }
    if (!thieu.length && !dO.length) out.push(`  PASS: MOI ${cum} — ${ds.length}/${ds.length} khoá đích có mặt và xanh ở kho mới`);
    else {
      soFail++;
      out.push(`  FAIL: MOI ${cum} — ${ds.length - thieu.length - dO.length}/${ds.length} khoá đích có mặt và xanh ở kho mới (thiếu ${thieu.length}, đỏ ${dO.length})`);
      for (const k of thieu) out.push(`  FAIL: MOI ${cum} — thiếu: ${k}`);
      for (const k of dO) out.push(`  FAIL: MOI ${cum} — đỏ: ${k}`);
    }
  }
  const doi = doiKhoa(BX._bangTen, BX);
  for (const u of donVi.values()) {
    const m = lay(moi, u); const cu = veDangN(tuiCu(lay(cHead, u).dat, m.dat, doi), khoaN);
    const mien = new Map(); for (const r of hang) if (r.bo === u.bo) mien.set(r.khoa, (mien.get(r.khoa) || 0) + 1);
    const s = soTui(cu, veDangN(m.dat, khoaN), mien);
    if (!s.thieu.length) out.push(`  PASS: MOI túi ${u.id} — khoá bố cục cũ còn ở kho mới`);
    else { soFail++; for (const k of s.thieu) out.push(`  FAIL: MOI túi ${u.id} — thiếu ở kho mới: ${k}`); }
  }
  out.push(`giu-khoa-3 --moi: ${cums.join(', ')} — ${soFail} dòng FAIL`);
  return soFail;
}

// ── --sau-gop ────────────────────────────────────────────────────────────────────────────────────────────────────────
const goiMergeBaseO = sha => git(GOC, 'grep', '-l', 'merge-base', sha, '--', 'tests').split('\n').map(l => l.replace(/^[0-9a-f]+:/, '')).filter(f => f && !/\/fixtures\//.test(f));
async function cheDoSauGop(ctx, out) {
  const h = head(); let soFail = 0;
  if (!existsSync(RA_LOP)) throw new HaTang(`${path.relative(GOC, RA_LOP)} chưa có (bảng rà lớp)`);
  const bang = docRaLop(readFileSync(RA_LOP, 'utf8'));
  // Tập chạy: MỌI tệp gọi merge-base ở GOC_VONG hoặc ở HEAD — không dựa vào bảng xếp đúng hay sai (tệp B xanh rỗng sau
  // gộp, nên tệp nào đỏ là xếp sai hoặc lỗi thật). Tệp .mjs trần ngoài bộ chạy thường trực: in TIN, không chạy.
  const tap = [...new Set([...goiMergeBaseO(GOC_VONG), ...goiMergeBaseO(h)])].sort();
  const thieu = tap.filter(f => !bang.has(f));
  if (thieu.length) { soFail++; for (const f of thieu) out.push(`  FAIL: RA-LOP thiếu ${f}`); }
  else out.push(`  PASS: RA-LOP ${tap.length}/${tap.length} tệp đã xếp nhóm (${[...bang.values()].filter(n => n === 'A').length} A)`);
  for (const f of tap.filter(f => !chayDuoc(f))) out.push(`  TIN: SAU-GOP bỏ ${f} — ngoài bộ chạy thường trực`);
  const ds = tap.filter(chayDuoc);
  const sua = new Set(tepVongSua(diffTests(h), diffNT(h)));
  const sau = nhanBan(ctx, h, 'sau-gop', h);
  const nhanh = nhanBan(ctx, h, 'nhanh');
  const kq = await Promise.all(ds.map(async f => [f, await chay(ctx, sau, donViTep(f)), sua.has(f) ? await chay(ctx, nhanh, donViTep(f)) : null]));
  for (const [f, r, n] of kq) {
    const doK = [...r.do.keys()];
    if (r.rc === 0 && !doK.length) out.push(`  PASS: SAU-GOP ${f} — ${[...r.dat.values()].reduce((a, b) => a + b, 0)} ca xanh khi origin/main = HEAD`);
    else { soFail++; out.push(`  FAIL: SAU-GOP ${f} — thoát ${r.rc}${doK.length ? `; đỏ: ${doK.slice(0, 5).join(' · ')}` : `: ${dongLoi(r.stderr + r.stdout).slice(0, 160)}`}`); }
    if (!n) continue;
    const a = soTui(n.dat, r.dat); const b = soTui(r.dat, n.dat);
    if (!a.thieu.length && !b.thieu.length) out.push(`  PASS: SAU-GOP-TUI ${f} — túi khoá sau gộp bằng túi trên nhánh (${a.tong})`);
    else { soFail++; out.push(`  FAIL: SAU-GOP-TUI ${f} — lệch: sau gộp thiếu ${a.thieu.slice(0, 3).join(' · ') || '0'}; sau gộp thừa ${b.thieu.slice(0, 3).join(' · ') || '0'}`); }
  }
  // Chiều đỏ: lỗi đã biết — bang-ten-lo-trinh ở GOC_VONG, sau gộp (origin/main = GOC_VONG) phải đỏ ở ca SP.
  const g = nhanBan(ctx, GOC_VONG, 'sau-gop-goc', GOC_VONG);
  const r = await chay(ctx, g, donViTep('tests/scripts/bang-ten-lo-trinh.test.mjs'), { nhan: 'sau-gop-do' });
  if (r.rc !== 0 && [...r.do.keys()].some(k => /^SP /.test(k))) out.push(`  PASS: SAU-GOP-DO bang-ten-lo-trinh ở ${GOC_VONG.slice(0, 8)} sau gộp đỏ: ${lyDo(r, /^SP /)}`);
  else { soFail++; out.push(`  FAIL: SAU-GOP-DO phép mô phỏng sau gộp không đỏ trên lỗi đã biết (thoát ${r.rc})`); }
  out.push(`giu-khoa-3 --sau-gop: ${ds.length} tệp, ${soFail} dòng FAIL`);
  return soFail;
}

// ── --chieu-do ───────────────────────────────────────────────────────────────────────────────────────────────────────
// Ca canh mỗi cụm; `ghim` = các mảnh chữ phải có trong thông điệp đỏ dưới bản thay thế. Điền ở S3 (Task chiều đỏ).
export const CA_CANH = [];
export const banHaiCayCu = () => `// hai-bo-cuc.mjs — BẢN LUÔN BUNG CÂY ĐANG CHẠY do thước (--chieu-do) sinh: hành vi trước vòng ba.
export * from './hai-bo-cuc.that.mjs';
import { haiCay as that } from './hai-bo-cuc.that.mjs';
export function haiCay(kho, tmp, o = {}) { return that(kho, tmp, { ...o, epPhang: true }); }
`;
async function cheDoChieuDo(ctx, out) {
  if (!CA_CANH.length) throw new HaTang('CA_CANH rỗng — chiều đỏ chưa khai ca canh');
  const h = head(); const d = khoMoi3(ctx, h, 'moi-do');
  const lanh = await Promise.all(CA_CANH.map(c => chay(ctx, d, { ...donViTep(c.tep), them: c.them }, { nhan: 'thật' })));
  const dich = path.join(d, 'tests', 'bo-cuc.mjs'); const hc = path.join(d, 'tests', 'hai-bo-cuc.mjs');
  if (!existsSync(dich) || !existsSync(hc)) throw new HaTang('kho mới thiếu tests/bo-cuc.mjs hay tests/hai-bo-cuc.mjs để thay');
  writeFileSync(dich, banDongNhat());
  writeFileSync(path.join(d, 'tests', 'hai-bo-cuc.that.mjs'), readFileSync(hc)); writeFileSync(hc, banHaiCayCu());
  git(d, 'add', '-A'); git(d, '-c', 'commit.gpgsign=false', 'commit', '-q', '-m', 'chiều đỏ: bộ dịch đồng nhất + haiCay bung cây đang chạy');
  const pha = await Promise.all(CA_CANH.map(c => chay(ctx, d, { ...donViTep(c.tep), them: c.them }, { nhan: 'thay' })));
  let soFail = 0;
  CA_CANH.forEach((c, i) => {
    const re = reCa(c.ca); const msg = `${lyDo(pha[i], re)}\n${cheKho(pha[i].stdout)}`;
    const thieuG = c.ghim.filter(g => !msg.includes(g));
    if (!xanhCa(lanh[i], re)) { soFail++; out.push(`  FAIL: DO ${c.cum} — đối chứng dương hỏng: ${c.ca} chưa xanh ở kho mới (${lyDo(lanh[i], re)})`); }
    else if (xanhCa(pha[i], re)) { soFail++; out.push(`  FAIL: DO ${c.cum} — chiều đỏ không đỏ: ${c.ca}`); }
    else if (thieuG.length) { soFail++; out.push(`  FAIL: DO ${c.cum} — ${c.ca} đỏ sai thông điệp (thiếu «${thieuG.join('» · «')}»): ${lyDo(pha[i], re)}`); }
    else out.push(`  PASS: DO ${c.cum} — ${c.ca} đỏ đúng câu «${c.ghim.join('» · «')}»; xanh với bản thật`);
  });
  out.push(`giu-khoa-3 --chieu-do: ${CA_CANH.length} ca canh, ${soFail} dòng FAIL`);
  return soFail;
}

// ── --ghi-gui-b2 ─────────────────────────────────────────────────────────────────────────────────────────────────────
const MO = '<!-- <<<GUI-B2-VA-THUA -->'; const DONG = '<!-- GUI-B2-VA-THUA>>> -->';
function ghiGuiB2(out) {
  const { thua, tong } = vaThua(tuDung3());
  let t = readFileSync(GUI_B2, 'utf8');
  if (!t.includes(MO) || !t.includes(DONG)) throw new HaTang('gui-b2.md thiếu khối GUI-B2-VA-THUA');
  t = t.slice(0, t.indexOf(MO)) + khoiGuiB2(thua, tong) + t.slice(t.indexOf(DONG) + DONG.length);
  writeFileSync(GUI_B2, t);
  out.push(`giu-khoa-3 --ghi-gui-b2: ${thua.length}/${tong} mục vá thừa ghi vào ${path.relative(GOC, GUI_B2)}`);
  return 0;
}

// ── chính ────────────────────────────────────────────────────────────────────────────────────────────────────────────
const CHE_DO = ['tinh', 'cu', 'moi', 'sau-gop', 'chieu-do', 'ghi-gui-b2'];
export function docDoiSo(argv) {
  const a = { cheDo: null, cum: null };
  for (let i = 0; i < argv.length; i++) {
    const x = argv[i];
    if (CHE_DO.includes(x.slice(2)) && x.startsWith('--')) { if (a.cheDo) return null; a.cheDo = x.slice(2); }
    else if (x === '--cum') { a.cum = argv[++i]; if (!a.cum) return null; }
    else return null;
  }
  if (!a.cheDo || (a.cum && a.cheDo !== 'moi') || (a.cum && !VONG.includes(a.cum))) return null;
  return a;
}
const laChinh = () => { try { return Boolean(process.argv[1]) && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url)); } catch { return false; } };
if (laChinh()) {
  const a = docDoiSo(process.argv.slice(2));
  if (!a) { process.stderr.write(`dùng: node giu-khoa-3.mjs --tinh | --cu | --moi [--cum ${VONG.join('|')}] | --sau-gop | --chieu-do | --ghi-gui-b2\n`); process.exit(2); }
  const ctx = moCtx(); ctx.originMain = (() => { try { return git(GOC, 'rev-parse', '--verify', '-q', 'origin/main'); } catch { return null; } })();
  const out = []; const t0 = Date.now();
  for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { for (const c of CON) giet(c); rmSync(ctx.tmp, { recursive: true, force: true }); process.exit(130); });
  let ma;
  try {
    // Luật tĩnh đi TRƯỚC mọi phép đo dài; đỏ → dừng, không chạy tệp kiểm nào (bẫy vòng hai: luật vài giây nằm trong phép đo 3 giờ).
    const tinh = a.cheDo === 'ghi-gui-b2' ? 0 : await cheDoTinh(ctx, out);
    if (tinh && a.cheDo !== 'tinh') { out.push(`giu-khoa-3 --${a.cheDo}: DỪNG — luật tĩnh đỏ (${tinh} dòng FAIL), không chạy phép đo nào`); ma = 1; }
    else {
      const f = { tinh: async () => 0, cu: cheDoCu, moi: cheDoMoi, 'sau-gop': cheDoSauGop, 'chieu-do': cheDoChieuDo, 'ghi-gui-b2': async (_c, _a, o) => ghiGuiB2(o) }[a.cheDo];
      const n = a.cheDo === 'cu' || a.cheDo === 'sau-gop' || a.cheDo === 'chieu-do' ? await f(ctx, out) : await f(ctx, a, out);
      ma = (tinh || n) ? 1 : 0;
    }
    process.stdout.write(out.join('\n') + '\n');
  } catch (e) {
    process.stdout.write(`HẠ TẦNG: ${e instanceof HaTang ? '' : 'lỗi thước — '}${String(e.message || e).split('\n')[0]}\n`);
    ma = 3;
  } finally { rmSync(ctx.tmp, { recursive: true, force: true }); }
  process.stderr.write(`giu-khoa-3 --${a.cheDo}: ${Math.round((Date.now() - t0) / 1000)}s\n`);
  process.exitCode = ma;
}
