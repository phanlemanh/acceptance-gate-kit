#!/usr/bin/env node
// giu-khoa-4.mjs — thước giữ khoá của hồ sơ phan-du-bo-cuc-moi-vong-bon (design §3.5; E1, E3, E4, E6–E9).
//
//   --tinh                    LUẬT TĨNH, vài giây, chạy đầu MỌI chế độ (đỏ → dừng trước khi chạy tệp kiểm nào): TEP_VONG ⊆
//                             khối tự đúng đường vòng hai ∪ vòng ba; trên nhánh riêng, tệp tests/ CHÍNH nhánh đổi (từ
//                             merge-base với origin/main) = TEP_VONG (routing-baseline.txt theo luật dòng nghi thức);
//                             HEAD đã ở trên origin/main → TIN; mỗi khoá đích có tệp nguồn ở HEAD; gui-b2.md đủ bốn mục;
//                             bộ tự kiểm giu-khoa-4.test.mjs xanh.
//   --cu                      mỗi tệp TEP_VONG ở GOC_VONG và ở HEAD (bố cục cũ): túi HEAD ⊇ túi gốc, mọi ca HEAD xanh; CU-DO
//                             tự phá đi qua CÙNG hàm so.
//   --moi --nhom tb|dv5|so-that|lt
//                             kho mới từ HEAD × hai chỗ đặt bản gốc merge-base (MOC_CU = ảnh kit trước #503 như bản sao đo
//                             của B2 · nguồn = HEAD): khoá đích của nhóm có mặt và xanh, luật B2 (`tuiCu` + `soTui`) thiếu
//                             0 trên mỗi tệp của nhóm; chiều đỏ CÙNG kho mới (MOC_CU): bản GOC_VONG của tệp kiểm (qua cùng
//                             luật đổi chữ của kho mới) đỏ đúng câu ghim.
//   --mp                      túi thô bo-cuc.test.mjs hai cây bằng nhau; luật B2 hiện tại thiếu đúng tập K4-MP; luật đề nghị
//                             (`tui-cu-suc-chua.mjs`) thiếu 0; đối chứng xoá hai tên; vi phân hai luật trên mọi tệp vòng.
//
// Dùng lại hàm xuất của thước vòng hai (`khoMoi`, `moCtx`, `docTuDung`, `demKhoa`, `veDangN`) và vòng ba (`soCuTep`,
// `donViTep`, `dongNghiThuc`, `thieuMuc`, `apVa`) — không sửa byte nào của hồ sơ đã ký; phần chạy chép từ vòng ba (không
// xuất ở đó). Mọi cây là bản sao `git clone --shared` ở thư mục tạm, HOME rỗng; gốc kho suy từ vị trí tệp này; không ghi
// vào cây kit. Thoát: 0 · 1 có FAIL · 2 sai đối số · 3 «HẠ TẦNG: …» (không in PASS nào).
import { execFileSync, spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chuanHoa, docKhoaDich, doiKhoa, rutKhoa, soTui, tuiCu } from '../../phan-du-bo-cuc-moi/rang/tui-khoa.mjs';
import { BX } from '../../phan-du-bo-cuc-moi/rang/buoc6-chep.mjs';
import { demKhoa, docTuDung, khoMoi, moCtx, veDangN } from '../../phan-du-bo-cuc-moi/rang/giu-khoa.mjs';
import { apVa, dongNghiThuc, donViTep, soCuTep, thieuMuc } from '../../phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs';
import { apDuongDoiTen } from '../../phan-du-bo-cuc-moi-vong-ba/rang/buoc3-duong-chep.mjs';
import { luatDoiChu as luatDoiChuKit } from '../../goi-cheo-loi-dieu-phoi/rang/luat-doi-chu.mjs';
import { hinhKhoa, tuiCuSucChua } from './tui-cu-suc-chua.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const GOC = path.resolve(HERE, '..', '..', '..');
const HO_SO = path.resolve(HERE, '..');
const KHOA_DICH = path.join(HO_SO, 'khoa-dich.tsv');
const GUI_B2 = path.join(HO_SO, 'gui-b2.md');
const GUI_B2_HAI = path.join(GOC, '_acceptance', 'phan-du-bo-cuc-moi', 'gui-b2.md');
const GUI_B2_BA = path.join(GOC, '_acceptance', 'phan-du-bo-cuc-moi-vong-ba', 'gui-b2.md');
const VA_B2 = path.join(GOC, '_acceptance', 'phan-du-bo-cuc-moi-vong-ba', 'rang', 'va-bo-kiem-b2.json');
export const SLUG = 'phan-du-bo-cuc-moi-vong-bon';
// Đỉnh nhánh chính lúc mở vòng (17/11) — bản gốc ghim của --cu và «bản trước vòng» của chiều đỏ.
export const GOC_VONG = '3341b8dce56e85405c73ee59faf743675da257e7';
// `origin/main` của hai bản sao đo B2 (lượt 17/11): ảnh kit ở #499, trước #503 (design §2).
export const MOC_CU = '909dffd8b7df648ffc41625e9582fe9042ae6f89';
export const NGHI_THUC = ['tests/scripts/fixtures/routing-baseline.txt'];
// Tệp vòng khai — danh sách ĐÓNG, viết trước khi đo (hợp đồng, thuật ngữ «tệp vòng khai»).
export const TEP_VONG = [
  'tests/scripts/additive-only.test.mjs',
  'tests/scripts/can-cu-s1.ca.mjs',
  'tests/scripts/cua-tin-hieu-giua-chien-dich.test.mjs',
  'tests/scripts/kho-moi-cai-goi-road-map.test.mjs',
  'tests/scripts/khoi-khuon-tren-the-cong.test.mjs',
  'tests/scripts/khuon-loi.test.mjs',
];
const BO_CUC_TEST = 'tests/scripts/bo-cuc.test.mjs';
// Nhóm của --moi: hàng khoá đích nào, tệp nào, chiều đỏ nào (câu ghim = câu đã thấy ở nhật ký B2).
export const NHOM = {
  tb: { loc: r => r.cum === 'K4-TB', do: [
    { tep: 'tests/scripts/khoi-khuon-tren-the-cong.test.mjs', ca: 'KK-6', ten: '[KK-6]', ghim: 'thẻ đổi khi kho không khai bản đồ' },
    { tep: 'tests/scripts/khuon-loi.test.mjs', ca: 'KL-8', ten: '[KL-8]', ghim: 'khác bản trước vòng' },
  ] },
  dv5: { loc: r => r.tepKiem === 'additive-only.test.mjs', do: [
    { tep: 'tests/scripts/additive-only.test.mjs', ca: 'DV5', ten: 'DV5', ghim: 'additive-only: existing rule line removed/modified' },
  ] },
  'so-that': { loc: r => r.tepKiem === 'can-cu-s1.ca.mjs', do: [
    { tep: 'tests/scripts/can-cu-s1.ca.mjs', ca: 'KK-6 so-that', ten: 'KK-6 so-that', ghim: 'thiếu dòng trên thẻ' },
  ] },
  lt: { loc: r => ['K4-LT', 'B2'].includes(r.cum), do: [
    { tep: 'tests/scripts/kho-moi-cai-goi-road-map.test.mjs', ca: 'KM-1', ten: 'KM-1', ghim: 'thiếu dòng «kho chưa cài road-map' },
    { tep: 'tests/scripts/cua-tin-hieu-giua-chien-dich.test.mjs', ca: 'CT-10-do', ten: 'CT-10-do', ghim: 'Cannot find module' },
  ] },
};
const HET_GIO_MS = 60 * 60 * 1000;

class HaTang extends Error {}
const CON = new Set();
const giet = c => { try { process.kill(-c.pid, 'SIGKILL'); } catch { try { c.kill('SIGKILL'); } catch { /* đã chết */ } } };
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const dongCuoi = s => String(s || '').trim().split('\n').filter(Boolean).pop() || '';
const dongLoi = s => String(s || '').split('\n').map(l => l.trim()).find(l => /^(\w*Error\b|Error:|ERR_|HẠ TẦNG)|Cannot find|node lệch/.test(l)) || dongCuoi(s);
const ENV_GIT = { GIT_CONFIG_NOSYSTEM: '1', GIT_AUTHOR_NAME: 'giu-khoa-4', GIT_AUTHOR_EMAIL: 'giu-khoa-4@invalid', GIT_COMMITTER_NAME: 'giu-khoa-4', GIT_COMMITTER_EMAIL: 'giu-khoa-4@invalid' };
export function git(d, ...a) {
  try { return execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', maxBuffer: 1 << 28, env: { ...process.env, ...ENV_GIT }, stdio: ['ignore', 'pipe', 'pipe'] }).trim(); }
  catch (e) { throw new HaTang(`git ${a.slice(0, 3).join(' ')}: ${dongCuoi(e.stderr) || e.message}`); }
}
const gitThu = (d, ...a) => { try { return git(d, ...a); } catch { return null; } };
const commitHet = (d, tieuDe) => { git(d, 'add', '-A'); git(d, '-c', 'commit.gpgsign=false', 'commit', '-q', '--allow-empty', '-m', tieuDe); };
const tam = (ctx, ten) => { const d = path.join(ctx.tmp, `${ten}-${++ctx.seq}`); mkdirSync(d, { recursive: true }); return d; };
export function nhanBan(ctx, sha, nhan, originMain = ctx.originMain, nguon = GOC) {
  const d = path.join(ctx.tmp, `${nhan}-${++ctx.seq}`);
  try { execFileSync('git', ['clone', '-q', '--shared', '--no-checkout', nguon, d], { env: { ...process.env, ...ENV_GIT }, stdio: 'ignore' }); }
  catch (e) { throw new HaTang(`nhân bản kho cho ${nhan}: ${e.message}`); }
  git(d, 'checkout', '-q', '--detach', sha);
  if (originMain) git(d, 'update-ref', 'refs/remotes/origin/main', originMain);
  return d;
}

// ── phần thuần (bộ tự kiểm đo trực tiếp) ─────────────────────────────────────────────────────────────────────────────
// Tệp tests/ mà CHÍNH nhánh đổi: diff từ merge-base với origin/main tới HEAD (gộp nhánh chính vào nhánh không làm phình
// tập này), trừ tệp nghi thức khi mọi dòng đổi là dòng THÊM mở đầu bằng slug của vòng. null = HEAD đã ở trên origin/main.
export function tepNhanhDoi(kho, slug = SLUG) {
  const om = gitThu(kho, 'rev-parse', '--verify', '-q', 'origin/main');
  if (!om) throw new HaTang('không có origin/main để tính merge-base');
  const h = git(kho, 'rev-parse', 'HEAD'); const mb = git(kho, 'merge-base', h, om);
  if (mb === h) return null;
  const ds = git(kho, 'diff', '--name-only', '--diff-filter=d', mb, h, '--', 'tests').split('\n').filter(Boolean);
  return ds.filter(t => !(NGHI_THUC.includes(t) && dongNghiThuc(git(kho, 'diff', '-U0', mb, h, '--', t), slug)));
}
// Lệch giữa tập nhánh đổi và tập vòng khai — mỗi tệp một dòng; rỗng là khớp.
export function lechNhanh(doi, khai = TEP_VONG) {
  const D = new Set(doi); const K = new Set(khai);
  return [...doi.filter(t => !K.has(t)).map(t => `${t}: nhánh sửa mà vòng không khai`), ...khai.filter(t => !D.has(t)).map(t => `${t}: vòng khai mà nhánh không sửa`)];
}
// Đoạn đầu ra của một ca đỏ: dòng FAIL của nó cùng các dòng sau tới dòng PASS/FAIL kế (thông điệp nằm ở dòng thụt sau).
export function doanCa(stdout, re) {
  const L = String(stdout).split('\n'); const i = L.findIndex(l => /^\s*FAIL:/.test(l) && re.test(chuanHoa(l)));
  if (i < 0) return null;
  let j = i + 1; while (j < L.length && !/^\s*(PASS|FAIL):/.test(L[j])) j++;
  return L.slice(i, j).join('\n');
}
export const reCa = ca => new RegExp(`^\\[?${esc(ca)}\\]?(?=[\\s:—]|$)`);
// So khoá theo luật B2: túi cây cũ đổi sang tên kho mới bằng `tuiCu` (hoặc luật khác truyền vào), rồi `soTui`.
export const soLuat = (cu, moi, doi, luat = tuiCu) => soTui(luat(cu, moi, doi), moi);
// Xoá một lần xuất hiện của tên `k` khỏi túi (bản sao).
export const boMot = (m, k) => { const r = new Map(m); const n = (r.get(k) || 0) - 1; if (n > 0) r.set(k, n); else r.delete(k); return r; };

// ── chạy (chép từ giu-khoa-3.mjs: moiTruong / chayLenh / chay) ─────────────────────────────────────────────────────────
function moiTruong(ctx, them = {}) {
  const e = { ...process.env, ...ENV_GIT };
  for (const k of ['NODE_TEST_CONTEXT', 'LT_CASES', 'ONLY_BLOCK', 'SCRIPTS_SHARD', 'SCRIPTS_SHARD_LIST', 'PLUGINS_SHARD', 'PLUGINS_SHARD_EMIT', 'GITHUB_ACTIONS', 'GITHUB_STEP_SUMMARY', 'NODE_OPTIONS']) delete e[k];
  e.PATH = `${path.dirname(process.execPath)}${path.delimiter}${process.env.PATH || ''}`;
  e.HOME = ctx.home;
  const t = tam(ctx, 't'); e.TMPDIR = t; e.THOI_GIAN_CA_DIR = path.join(t, 'tg');
  return { ...e, ...them };
}
function chayLenh(ctx, goc, cmd) {
  return new Promise((res, rej) => {
    const t0 = Date.now();
    const [c, ...a] = cmd; const p = spawn(c === 'node' ? process.execPath : c, a, { cwd: goc, env: moiTruong(ctx), stdio: ['ignore', 'pipe', 'pipe'], detached: true });
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
function chay(ctx, goc, u, { nhan = '' } = {}) {
  const k = `${goc}\0${u.id}\0${nhan}`;
  if (ctx.cache.has(k)) return ctx.cache.get(k);
  const truoc = ctx.hang.get(goc) || Promise.resolve();
  const p = truoc.catch(() => {}).then(async () => {
    process.stderr.write(`giu-khoa-4: chạy ${u.id}${nhan ? ` [${nhan}]` : ''} ở ${path.basename(goc)}\n`);
    const r = await chayLenh(ctx, goc, u.cmd);
    if (r.rc === 'hết giờ') throw new HaTang(`${u.id} ở ${path.basename(goc)} hết giờ (${HET_GIO_MS / 60000} phút)`);
    const kq = rutKhoa(r.stdout, u.loai);
    if (u.tong) { const kk = chuanHoa(u.tong); kq.khoaTep = kk; const t = r.rc === 0 ? kq.dat : kq.do; t.set(kk, (t.get(kk) || 0) + 1); if (r.rc !== 0) kq.dongDo.set(kk, `FAIL: ${u.tong} (expected exit 0, got ${r.rc})`); }
    process.stderr.write(`giu-khoa-4: xong ${u.id}${nhan ? ` [${nhan}]` : ''} ở ${path.basename(goc)} — thoát ${r.rc}, ${r.giay}s\n`);
    return { ...kq, rc: r.rc, stderr: r.stderr, stdout: r.stdout, giay: r.giay };
  });
  ctx.hang.set(goc, p); ctx.cache.set(k, p);
  return p;
}
const cheKho = s => String(s).replace(/(?:\/private)?\/(?:var\/folders|tmp)\/\S*?\/giu-khoa-[^/\s]+\/[^/'"\s]+/g, '<kho>');

// ── kho mới ──────────────────────────────────────────────────────────────────────────────────────────────────────────
const tuDung = t => { const ds = existsSync(t) ? docTuDung(readFileSync(t, 'utf8')) : null; if (!ds) throw new HaTang(`${path.relative(GOC, t)} thiếu khối GUI-B2-TU-DUNG`); return ds; };
const tuDungHaiBa = () => [...new Set([...tuDung(GUI_B2_HAI), ...tuDung(GUI_B2_BA)])];
// Kho mới như vòng ba (khoMoi vòng hai + luật đường đổi tên bước 3 + bảng vá B2 cho tệp còn đi bước 6), là con của `h`.
function khoMoi4(ctx, h, nhan) {
  const bq = new Set(tuDungHaiBa());
  const d = khoMoi(ctx, h, nhan, { ten: true, buoc6: true, boQua: [...bq] });
  if (apDuongDoiTen(d)) commitHet(d, 'kho mới: luật đường đổi tên của bước 3');
  if (existsSync(VA_B2)) {
    const nd = new Map(); let so = 0;
    for (const v of JSON.parse(readFileSync(VA_B2, 'utf8'))) {
      if (bq.has(v.tep)) continue;
      const p = path.join(d, v.tep); const cu = nd.get(v.tep) ?? (existsSync(p) ? readFileSync(p, 'utf8') : null);
      if (cu === null) continue;
      const moi = apVa(cu, v); if (moi === null) continue;
      nd.set(v.tep, moi); so++;
    }
    for (const [f, c] of nd) writeFileSync(path.join(d, f), c);
    if (so) commitHet(d, `kho mới: bảng vá B2 (${so} mục) cho tệp còn đi bước 6`);
  }
  return d;
}
// Bản một tệp kiểm ở `sha` của kit, qua CÙNG luật đổi chữ mà kho mới áp lên tests/** (để «bản cũ ở kho mới» so được).
function banCuQuaLuat(sha, rel) {
  let nd = git(GOC, 'show', `${sha}:${rel}`) + '\n';
  for (const l of luatDoiChuKit()) nd = nd.replace(l.re, l.thay);
  return nd;
}
const NHAN_GOC = { [MOC_CU]: MOC_CU.slice(0, 8) };
const nhanGoc = (sha, h) => (sha === h ? 'nguồn' : NHAN_GOC[sha] || sha.slice(0, 8));

// ── --tinh ───────────────────────────────────────────────────────────────────────────────────────────────────────────
async function cheDoTinh(_ctx, out) {
  let soFail = 0;
  const bq = new Set(tuDungHaiBa());
  const ngoai = TEP_VONG.filter(t => !bq.has(t));
  if (ngoai.length) { soFail++; for (const t of ngoai) out.push(`  FAIL: TINH ${t}: tệp vòng khai không ở khối tự đúng đường vòng hai ∪ vòng ba`); }
  else out.push(`  PASS: TINH tệp vòng khai — ${TEP_VONG.length} tệp, tất cả ở khối tự đúng đường vòng hai ∪ vòng ba`);
  const doi = tepNhanhDoi(GOC);
  if (doi === null) out.push('  TIN: TINH nhánh — HEAD đã ở trên origin/main, không còn nhánh để so');
  else {
    const l = lechNhanh(doi);
    if (l.length) { soFail++; for (const x of l) out.push(`  FAIL: TINH ${x}`); }
    else out.push('  PASS: TINH nhánh — tệp tests/ nhánh đổi (từ merge-base với origin/main) = tệp vòng khai');
  }
  const hang = docKhoaDich(KHOA_DICH);
  const vang = hang.filter(r => !existsSync(path.join(GOC, 'tests', r.bo, r.tepKiem))).map(r => `${r.cum} tests/${r.bo}/${r.tepKiem}`);
  if (vang.length) { soFail++; for (const t of [...new Set(vang)]) out.push(`  FAIL: TINH khoá đích không có tệp nguồn ở HEAD: ${t}`); }
  else out.push(`  PASS: TINH khoá đích — ${hang.length} dòng, tệp nguồn có ở HEAD`);
  const tm = thieuMuc(existsSync(GUI_B2) ? readFileSync(GUI_B2, 'utf8') : '');
  if (tm.length) { soFail++; out.push(`  FAIL: TINH gui-b2.md thiếu mục: ${tm.join(' · ')}`); }
  else out.push('  PASS: TINH gui-b2 — đủ bốn mục');
  const tk = spawnSync(process.execPath, [path.join(HERE, 'giu-khoa-4.test.mjs')], { encoding: 'utf8', cwd: GOC });
  const m = (tk.stdout || '').match(/Results: (\d+) passed, (\d+) failed/);
  if (tk.status !== 0 || !m) { soFail++; out.push(`  FAIL: TINH tự kiểm thước thoát ${tk.status}: ${dongLoi((tk.stdout || '').split('\n').filter(l => /FAIL/.test(l)).join('\n') + tk.stderr)}`); }
  else out.push(`  PASS: TINH tự kiểm — ${m[1]} ca`);
  return soFail;
}

// ── --cu ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
export const TU_PHA = [
  { id: 'CU-DO', tep: 'tests/scripts/additive-only.test.mjs', cu: "check('DV5u: ", moi: "void ('DV5u: ", mat: /^DV5u: / },
];
async function cheDoCu(ctx, out) {
  const h = git(GOC, 'rev-parse', 'HEAD');
  const cGoc = nhanBan(ctx, GOC_VONG, 'ban-goc'); const cHead = nhanBan(ctx, h, 'head');
  const khoaN = [...new Set(docKhoaDich(KHOA_DICH).map(r => r.khoa).filter(k => k.includes('<n>')))];
  const kq = await Promise.all(TEP_VONG.map(async t => { const u = donViTep(t); return [u, existsSync(path.join(cGoc, t)) ? await chay(ctx, cGoc, u) : null, await chay(ctx, cHead, u)]; }));
  let soFail = 0;
  for (const [u, g, hh] of kq) {
    const s = soCuTep(g, hh, khoaN);
    if (s.xanh) { out.push(`  PASS: CU ${u.id} — ${s.tong} khoá ở ${GOC_VONG.slice(0, 8)} còn đủ ở HEAD, mọi ca HEAD xanh`); continue; }
    soFail++;
    for (const k of s.thieu) out.push(`  FAIL: CU ${u.id} — mất khoá: ${k}`);
    for (const k of [...s.doKhoa, ...s.doRc]) out.push(`  FAIL: CU ${u.id} — đỏ: ${k}`);
  }
  for (const p of TU_PHA) {
    const f = path.join(cHead, p.tep); const t0 = readFileSync(f, 'utf8');
    const dong = kq.find(([u]) => u.id === p.tep);
    if (t0.split(p.cu).length !== 2 || !dong || !dong[1]) { soFail++; out.push(`  FAIL: ${p.id} nhát phá không áp hoặc không có lượt bản gốc: ${p.tep}`); continue; }
    const [u, g, lanh] = dong;
    writeFileSync(f, t0.replace(p.cu, p.moi));
    let pha; try { pha = await chay(ctx, cHead, u, { nhan: 'phá' }); } finally { writeFileSync(f, t0); }
    const sl = soCuTep(g, lanh, khoaN); const sp = soCuTep(g, pha, khoaN);
    const mat = sp.thieu.filter(k => p.mat.test(k));
    if (sl.xanh && mat.length) out.push(`  PASS: ${p.id} ${p.tep} — xoá một ca trên bản sao HEAD → «mất khoá: ${mat[0].slice(0, 70)}»; bản lành xanh`);
    else { soFail++; out.push(`  FAIL: ${p.id} phép so không đỏ — ${p.tep}${sl.xanh ? '' : ' (bản lành không xanh)'}`); }
  }
  out.push(`giu-khoa-4 --cu: ${TEP_VONG.length} tệp, ${soFail} dòng FAIL`);
  return soFail;
}

// ── --moi ────────────────────────────────────────────────────────────────────────────────────────────────────────────
const DONG_CHU_THICH = '# cổng không cờ (ca AC-8 của tests/scripts/hang-pr.test.mjs canh).';
// Bước 4 của kịch bản (con trỏ sang kho cũ) mà kho mới của thước không có — áp đúng phép đổi ấy lên dòng chú thích.
function moPhongBuoc4(d, h) {
  const f = path.join(d, 'plugins', 'acceptance-gate', 'scripts', 'pre-merge-check.sh');
  const t = readFileSync(f, 'utf8');
  if (t.split(DONG_CHU_THICH).length !== 2) throw new HaTang('kho mới: dòng chú thích của pre-merge-check.sh không khớp đúng một lần');
  writeFileSync(f, t.replace(DONG_CHU_THICH, DONG_CHU_THICH.replace('tests/scripts/hang-pr.test.mjs', `https://github.com/phanlemanh/acceptance-gate-kit/blob/${h}/tests/scripts/hang-pr.test.mjs`)));
  commitHet(d, 'kho mới: mô phỏng bước 4 — con trỏ sang kho cũ ở dòng chú thích');
}
async function cheDoMoi(ctx, args, out) {
  const nh = NHOM[args.nhom]; const h = git(GOC, 'rev-parse', 'HEAD');
  const hang = docKhoaDich(KHOA_DICH).filter(nh.loc);
  if (!hang.length) throw new HaTang(`nhóm ${args.nhom}: không khoá đích nào`);
  const tep = [...new Set(hang.map(r => `tests/${r.bo}/${r.tepKiem}`))].sort();
  const doi = doiKhoa(BX._bangTen, BX);
  const cHead = nhanBan(ctx, h, 'cu');
  let soFail = 0;
  const kho = {};
  for (const sha of [MOC_CU, h]) {
    const d = khoMoi4(ctx, h, `moi-${nhanGoc(sha, h)}`);
    if (args.nhom === 'dv5') moPhongBuoc4(d, h);
    git(d, 'update-ref', 'refs/remotes/origin/main', sha);
    kho[sha] = d;
  }
  if (args.nhom === 'dv5') out.push('  TIN: MOI dv5 — kho mới của thước áp phép «con trỏ sang kho cũ» của bước 4 lên dòng chú thích (mô phỏng, 1 dòng)');
  const kqCu = new Map(await Promise.all(tep.map(async t => [t, await chay(ctx, cHead, donViTep(t))])));
  for (const sha of [MOC_CU, h]) {
    const d = kho[sha]; const nhan = nhanGoc(sha, h);
    const kq = new Map(await Promise.all(tep.map(async t => [t, await chay(ctx, d, donViTep(t))])));
    const loi = [];
    for (const r of hang) {
      const t = kq.get(`tests/${r.bo}/${r.tepKiem}`);
      if (demKhoa(t.dat, r.khoa) < 1) loi.push(`thiếu: ${r.khoa}`);
      else if (demKhoa(t.do, r.khoa) > 0) loi.push(`đỏ: ${r.khoa}`);
    }
    for (const t of tep) { const s = soLuat(kqCu.get(t).dat, kq.get(t).dat, doi); for (const k of s.thieu) loi.push(`luật B2 thiếu ở ${path.basename(t)}: ${k}`); }
    if (!loi.length) out.push(`  PASS: MOI ${args.nhom} · bản gốc ${nhan} — ${hang.length}/${hang.length} khoá đích có mặt và xanh; luật B2 thiếu 0 trên ${tep.length} tệp`);
    else { soFail++; for (const l of loi) out.push(`  FAIL: MOI ${args.nhom} · bản gốc ${nhan} — ${l}`); }
    if (args.nhom === 'so-that') {
      const t = kq.get('tests/scripts/can-cu-s1.ca.mjs');
      if (!(demKhoa(t.dat, 'KK-6-do so-that') > 0)) { soFail++; out.push(`  FAIL: MOI so-that · bản gốc ${nhan} — KK-6-do so-that vắng khỏi túi đạt`); }
      if (sha === h) {
        const m = t.stdout.match(/gốc đọc sổ: cây phẳng lịch sử ([0-9a-f]{40})/);
        if (m && m[1] === h) out.push(`  PASS: MOI so-that gốc đọc sổ — «cây phẳng lịch sử ${h.slice(0, 8)}» với sha = HEAD nguồn (cha commit dọn nhà của kho mới)`);
        else { soFail++; out.push(`  FAIL: MOI so-that gốc đọc sổ — ${m ? `sha ${m[1].slice(0, 8)} ≠ HEAD nguồn ${h.slice(0, 8)}` : 'ca không in «gốc đọc sổ: cây phẳng lịch sử <sha>»'}`); }
      }
    }
  }
  // Chiều đỏ trên CÙNG kho mới (bản gốc MOC_CU): bản GOC_VONG của tệp kiểm chép đè.
  const d = kho[MOC_CU];
  for (const c of nh.do) {
    const f = path.join(d, c.tep); const t0 = readFileSync(f, 'utf8');
    writeFileSync(f, banCuQuaLuat(GOC_VONG, c.tep));
    let r; try { r = await chay(ctx, d, donViTep(c.tep), { nhan: 'ban-goc-vong' }); } finally { writeFileSync(f, t0); }
    const doan = doanCa(cheKho(r.stdout), reCa(c.ca));
    if (doan && doan.includes(c.ghim)) out.push(`  PASS: DO ${args.nhom} ${path.basename(c.tep)} — bản ${GOC_VONG.slice(0, 8)} đỏ ${c.ten} đúng câu «${c.ghim}»`);
    else { soFail++; out.push(`  FAIL: DO ${args.nhom} ${path.basename(c.tep)} — bản ${GOC_VONG.slice(0, 8)} ${doan ? `đỏ ${c.ten} sai câu: ${doan.replace(/\s+/g, ' ').slice(0, 200)}` : `không đỏ ${c.ten} (thoát ${r.rc})`}`); }
  }
  if (args.nhom === 'so-that') {
    // Mã được đo là mã CÂY ĐANG KIỂM: phá gate-card.js của kho mới (bỏ một dòng máy đã quyết) → KK-6 so-that đỏ.
    const f = path.join(d, 'plugins', 'acceptance-gate', 'scripts', 'gate-card.js'); const t0 = readFileSync(f, 'utf8');
    const tu = 'const ccMayQuyet = cc.da_quyet;';
    if (t0.split(tu).length !== 2) throw new HaTang('kho mới: mũi phá gate-card.js không khớp đúng một lần');
    writeFileSync(f, t0.replace(tu, 'const ccMayQuyet = cc.da_quyet.slice(1);'));
    let r; try { r = await chay(ctx, d, donViTep('tests/scripts/can-cu-s1.ca.mjs'), { nhan: 'pha-the' }); } finally { writeFileSync(f, t0); }
    const doan = doanCa(cheKho(r.stdout), reCa('KK-6 so-that'));
    if (doan && doan.includes('thiếu dòng trên thẻ')) out.push('  PASS: DO so-that mã thẻ — phá gate-card.js CỦA KHO MỚI (bỏ một dòng máy đã quyết) → KK-6 so-that đỏ «thiếu dòng trên thẻ»');
    else { soFail++; out.push(`  FAIL: DO so-that mã thẻ — phá mã cây đang kiểm mà ca ${doan ? `đỏ sai câu: ${doan.replace(/\s+/g, ' ').slice(0, 160)}` : 'vẫn xanh'}`); }
  }
  out.push(`giu-khoa-4 --moi --nhom ${args.nhom}: ${hang.length} khoá đích, ${tep.length} tệp, ${soFail} dòng FAIL`);
  return soFail;
}

// ── --mp ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
const bang = m => [...m].flatMap(([k, n]) => Array(n).fill(k)).sort();
async function cheDoMp(ctx, out) {
  const h = git(GOC, 'rev-parse', 'HEAD'); const doi = doiKhoa(BX._bangTen, BX);
  const cHead = nhanBan(ctx, h, 'cu'); const d = khoMoi4(ctx, h, 'moi-mp');
  git(d, 'update-ref', 'refs/remotes/origin/main', h);
  const tep = [BO_CUC_TEST, ...TEP_VONG];
  const kq = new Map(await Promise.all(tep.map(async t => [t, [await chay(ctx, cHead, donViTep(t)), await chay(ctx, d, donViTep(t))]])));
  let soFail = 0;
  const [bc, bm] = kq.get(BO_CUC_TEST);
  const a = soTui(bc.dat, bm.dat); const ten = [...bc.dat.values()].reduce((x, y) => x + y, 0);
  if (!a.thieu.length && !a.thua.length && bc.rc === 0 && bm.rc === 0) out.push(`  PASS: MP túi thô — ${ten} tên ca, bố cục cũ và kho mới bằng nhau từng tên và từng số lần`);
  else { soFail++; for (const k of a.thieu) out.push(`  FAIL: MP túi thô — chỉ ở bố cục cũ: ${k}`); for (const k of a.thua) out.push(`  FAIL: MP túi thô — chỉ ở kho mới: ${k}`); if (bc.rc || bm.rc) out.push(`  FAIL: MP túi thô — thoát ${bc.rc}/${bm.rc}`); }
  const dich = bang(new Map(docKhoaDich(KHOA_DICH).filter(r => r.cum === 'K4-MP').reduce((m, r) => m.set(r.khoa, (m.get(r.khoa) || 0) + 1), new Map())));
  const hien = soLuat(bc.dat, bm.dat, doi).thieu.sort();
  if (JSON.stringify(hien) === JSON.stringify(dich)) out.push(`  PASS: MP luật B2 hiện tại — thiếu đúng ${dich.length} khoá = tập K4-MP của khoa-dich.tsv (tái hiện số B2)`);
  else { soFail++; out.push(`  FAIL: MP luật B2 hiện tại — lệch khoa-dich: thiếu ${hien.length}, khoá đích ${dich.length}; chỉ ở lần đo: ${hien.filter(k => !dich.includes(k)).slice(0, 3).join(' · ') || '—'}; chỉ ở khoa-dich: ${dich.filter(k => !hien.includes(k)).slice(0, 3).join(' · ') || '—'}`); }
  const de = soLuat(bc.dat, bm.dat, doi, tuiCuSucChua);
  if (!de.thieu.length) out.push('  PASS: MP luật đề nghị — thiếu 0');
  else { soFail++; for (const k of de.thieu) out.push(`  FAIL: MP luật đề nghị — thiếu: ${k}`); }
  const phang = [...bm.dat.keys()].find(k => /^BC (?!plugins\/)/.test(k) && doi(k) !== k && bm.dat.has(doi(k)));
  const goi = [...bm.dat.keys()].find(k => /^BC plugins\//.test(k));
  for (const [x, dang] of [[phang, 'dạng phẳng'], [goi, 'dạng plugins/…']]) {
    if (!x) { soFail++; out.push(`  FAIL: MP đối chứng — không tìm được tên ${dang} trong túi kho mới`); continue; }
    const s = soLuat(bc.dat, boMot(bm.dat, x), doi, tuiCuSucChua).thieu;
    if (s.length === 1 && s[0] === x) out.push(`  PASS: MP đối chứng — xoá «${x}» khỏi túi kho mới → luật đề nghị thiếu đúng tên ấy`);
    else { soFail++; out.push(`  FAIL: MP đối chứng — xoá «${x}» (${dang}) → luật đề nghị thiếu ${JSON.stringify(s)}`); }
  }
  let lech = []; const hinh = { 'khong-doi': 0, 'doi-thuong': 0, 'nguyen-chu': 0, vang: 0 };
  for (const t of tep) {
    const [c, m] = kq.get(t);
    const s1 = soLuat(c.dat, m.dat, doi).thieu; const s2 = [...soLuat(c.dat, m.dat, doi, tuiCuSucChua).thieu];
    for (const k of s1) { const i = s2.indexOf(k); if (i >= 0) s2.splice(i, 1); else lech.push(k); }
    lech = lech.concat(s2.map(k => `(chỉ ở luật đề nghị) ${k}`));
    for (const [k, n] of c.dat) hinh[hinhKhoa(k, m.dat, doi)] += n;
  }
  const lechSx = lech.sort();
  const du = hinh['khong-doi'] > 0 && hinh['doi-thuong'] > 0 && hinh['nguyen-chu'] > 0;
  if (JSON.stringify(lechSx) === JSON.stringify(dich) && du) out.push(`  PASS: MP vi phân — trên túi thật của ${tep.length} tệp (${TEP_VONG.length} tệp vòng khai + bo-cuc.test.mjs), hai luật lệch đúng ${dich.length} khoá K4-MP; ba hình có mặt: không đổi ${hinh['khong-doi']} · đổi thường ${hinh['doi-thuong']} · chỉ còn tên nguyên chữ ${hinh['nguyen-chu']}`);
  else { soFail++; out.push(`  FAIL: MP vi phân — hai luật lệch ${lechSx.length} khoá (khoá đích ${dich.length})${lechSx.filter(k => !dich.includes(k)).slice(0, 3).map(k => `; lạ: ${k}`).join('')}; ba hình: không đổi ${hinh['khong-doi']} · đổi thường ${hinh['doi-thuong']} · chỉ còn tên nguyên chữ ${hinh['nguyen-chu']}`); }
  out.push(`giu-khoa-4 --mp: ${tep.length} tệp, ${soFail} dòng FAIL`);
  return soFail;
}

// ── chính ────────────────────────────────────────────────────────────────────────────────────────────────────────────
const CHE_DO = ['tinh', 'cu', 'moi', 'mp'];
export function docDoiSo(argv) {
  const a = { cheDo: null, nhom: null };
  for (let i = 0; i < argv.length; i++) {
    const x = argv[i];
    if (x.startsWith('--') && CHE_DO.includes(x.slice(2))) { if (a.cheDo) return null; a.cheDo = x.slice(2); }
    else if (x === '--nhom') { a.nhom = argv[++i]; if (!a.nhom) return null; }
    else return null;
  }
  if (!a.cheDo || (a.cheDo === 'moi') !== Boolean(a.nhom) || (a.nhom && !NHOM[a.nhom])) return null;
  return a;
}
const laChinh = () => { try { return Boolean(process.argv[1]) && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url)); } catch { return false; } };
if (laChinh()) {
  const a = docDoiSo(process.argv.slice(2));
  if (!a) { process.stderr.write(`dùng: node giu-khoa-4.mjs --tinh | --cu | --moi --nhom ${Object.keys(NHOM).join('|')} | --mp\n`); process.exit(2); }
  const ctx = moCtx(); ctx.originMain = gitThu(GOC, 'rev-parse', '--verify', '-q', 'origin/main');
  const out = []; const t0 = Date.now();
  for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { for (const c of CON) giet(c); rmSync(ctx.tmp, { recursive: true, force: true }); process.exit(130); });
  let ma;
  try {
    // Luật tĩnh đi TRƯỚC mọi phép đo dài; đỏ → dừng, không chạy tệp kiểm nào.
    const tinh = await cheDoTinh(ctx, out);
    if (tinh && a.cheDo !== 'tinh') { out.push(`giu-khoa-4 --${a.cheDo}: DỪNG — luật tĩnh đỏ (${tinh} dòng FAIL), không chạy phép đo nào`); ma = 1; }
    else {
      const n = a.cheDo === 'tinh' ? 0 : a.cheDo === 'cu' ? await cheDoCu(ctx, out) : a.cheDo === 'mp' ? await cheDoMp(ctx, out) : await cheDoMoi(ctx, a, out);
      ma = (tinh || n) ? 1 : 0;
    }
    process.stdout.write(out.join('\n') + '\n');
  } catch (e) {
    process.stdout.write(`HẠ TẦNG: ${e instanceof HaTang ? '' : 'lỗi thước — '}${String(e.message || e).split('\n')[0]}\n`);
    ma = 3;
  } finally { if (process.env.GIU_KHOA_4_GIU === '1') process.stderr.write(`giu-khoa-4: giữ thư mục tạm ${ctx.tmp}\n`); else rmSync(ctx.tmp, { recursive: true, force: true }); }
  process.stderr.write(`giu-khoa-4 --${a.cheDo}: ${Math.round((Date.now() - t0) / 1000)}s\n`);
  process.exitCode = ma;
}
