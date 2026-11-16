#!/usr/bin/env node
// giu-khoa-3.mjs — thước giữ khoá của hồ sơ phan-du-bo-cuc-moi-vong-ba (design §3.4; E2, E4–E10).
//
//   --tinh                 LUẬT TĨNH, vài giây, chạy đầu MỌI chế độ (đỏ → dừng trước khi chạy tệp kiểm nào):
//                          (1) tệp vòng sửa dưới tests/ (git diff GOC_VONG..HEAD, trừ NGHI_THUC) = khối tự đúng đường của
//                          gui-b2.md ∪ VAN_BUOC6_3; (2) mỗi khoá đích của các cụm vòng nhận có tệp nguồn ở HEAD;
//                          (3) bộ tự kiểm `giu-khoa-3.test.mjs` xanh; (4) gui-b2.md đủ bốn mục, khối vá thừa khớp máy rút.
//   --cu                   mỗi tệp kiểm vòng chạm ở GOC_VONG (ghim, KHÔNG merge-base) và ở HEAD: túi HEAD ⊇ túi gốc, mọi
//                          ca HEAD xanh; CU-DO tự phá (xoá một ca trên bản sao HEAD của một tệp CÓ ở GOC_VONG) đi qua CÙNG
//                          hàm so `soCuTep` với lượt thật và phải đỏ «mất khoá».
//   --moi [--cum <cụm>]    kho mới từ HEAD (bước 1–3 + luật đổi tên + luật chung bước 6, bỏ qua tự đúng đường vòng hai ∪ vòng
//                          ba, không bảng vá) → mọi khoá đích của cụm có mặt và xanh; túi mỗi tệp ⊇ túi bố cục cũ.
//   --sau-gop              bản sao HEAD có origin/main = HEAD → MỌI tệp gọi merge-base (grep lúc chạy, GOC_VONG ∪ HEAD) mà
//                          bộ chạy thường trực nhặt: xanh, hoặc đỏ Y HỆT ở đối chứng trước gộp trong cùng môi trường bản sao
//                          (origin/main thật — đỏ do môi trường, không do gộp: TIN có tên ca); RA-LOP: tập tệp gọi
//                          merge-base = tập trong bảng, HAI chiều; RA-LOP-DONG: mỗi dòng căn cứ có chữ merge-base;
//                          RA-LOP-A: tệp nhóm A xanh sau gộp không nhờ miễn; SAU-GOP-DO: bang-ten-lo-trinh ở GOC_VONG
//                          sau gộp đỏ ở ca SP đúng câu «bản gốc in road-map@».
//   --chieu-do             kho mới, HAI lượt thay tách nhau: bộ dịch thay bằng bản đồng nhất (ca canh K4-LT · K4-TB ·
//                          K4-RG) · haiCay thay bằng bản luôn bung cây đang chạy, bộ dịch THẬT (ca canh K4-MP) → ca canh đỏ
//                          đúng câu ghim (đối chứng dương: xanh với bản thật); AC-1: bản sao HEAD bố cục cũ, bản gốc ghim
//                          của bang-ten-lo-trinh đổi sang HEAD → ô «cũ · thiếu» đỏ «bản gốc in road-map@…, ma trận viết
//                          trước null» (cột bản gốc viết trước không còn khớp bản gốc ghim).
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
import { apDuongDoiTen } from './buoc3-duong-chep.mjs';
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

// Khoá đích B2 viết theo tên KHO MỚI (`doiKhoa` của tên ở cây cũ). Ca tự đúng đường in tên gốc ở kho mới; B2 nhận cả
// hai dạng (`tuiCu`: «tên đổi không có ở kho mới còn tên nguyên chữ thì có → giữ tên nguyên»). Đếm theo đúng luật ấy.
export function demKhop(m, khoa, doi) {
  let n = demKhoa(m, khoa);
  for (const [k, c] of m) if (k !== khoa && doi(k) !== k && (doi(k) === khoa || (khoa.includes('<n>') && demKhoa(new Map([[doi(k), 1]]), khoa)))) n += c;
  return n;
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
    if (u.tong) { const kk = chuanHoa(u.tong); kq.khoaTep = kk; const t = r.rc === 0 ? kq.dat : kq.do; t.set(kk, (t.get(kk) || 0) + 1); if (r.rc !== 0) kq.dongDo.set(kk, `FAIL: ${u.tong} (expected exit 0, got ${r.rc})`); }
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

// Một tệp sau gộp: xanh · 'moi-truong' khi đối chứng trước gộp (cùng bản sao, origin/main thật) đỏ Y HỆT (cùng mã thoát,
// cùng tập ca đỏ, không rỗng) — đỏ ấy không do gộp · còn lại 'do'. Khoá CẤP TỆP (`kq.khoaTep`, `chay()` chèn khi thoát ≠ 0)
// không phải một ca: bỏ nó trước khi so, nên tệp sập trước khi in ca nào ở cả hai bên vẫn là 'do', không lọt thành TIN.
const caDo = kq => [...kq.do.keys()].filter(k => k !== kq.khoaTep).sort();
export function phanSauGop(sau, truoc) {
  const doS = caDo(sau);
  if (sau.rc === 0 && !sau.do.size) return 'xanh';
  if (!truoc || truoc.rc !== sau.rc) return 'do';
  const doT = caDo(truoc);
  return doT.length && doT.join('\n') === doS.join('\n') ? 'moi-truong' : 'do';
}
// RA-LOP dòng căn cứ: mỗi số ở cột «Dòng» phải trỏ một dòng có chữ `merge-base` ở GOC_VONG hoặc HEAD của chính tệp ấy —
// bảng gắn vào mã, không chỉ có tên tệp. `ban(f)` trả mảng nội dung các phiên bản (null = vắng). Trả danh sách lệch.
export function docRaLopDong(t) {
  const m = new Map();
  for (const l of t.split('\n')) { const x = l.match(/^\|\s*`(tests\/[^`]+)`\s*\|\s*([ABC])\s*\|([^|]*)\|/); if (x) m.set(x[1], { nhom: x[2], dong: (x[3].match(/\d+/g) || []).map(Number) }); }
  return m;
}
export function lechDongRaLop(bangDong, ban) {
  const lech = [];
  for (const [f, { dong }] of bangDong) {
    const vs = ban(f).filter(Boolean).map(v => v.split('\n'));
    if (!dong.length) { lech.push(`${f}: cột Dòng rỗng`); continue; }
    for (const n of dong) if (!vs.some(v => n > 0 && n <= v.length && v[n - 1].includes('merge-base'))) lech.push(`${f}:${n} không có chữ merge-base ở ${GOC_VONG.slice(0, 8)} lẫn HEAD`);
  }
  return lech;
}
// RA-LOP hai chiều: tệp của tập mà bảng không xếp (thiếu) · dòng bảng không thuộc tập (thừa — xếp tệp đã thôi gọi merge-base).
export function lechRaLop(tap, bang) {
  const t = new Set(tap);
  return { thieu: tap.filter(f => !bang.has(f)), thua: [...bang.keys()].filter(f => !t.has(f)) };
}
// So một tệp ở bản gốc ghim (`g`, null = tệp mới) và ở HEAD (`hh`) — lượt --cu thật và ca tự phá CU-DO dùng CHUNG hàm này.
export function soCuTep(g, hh, khoaN) {
  const s = soTui(veDangN(g ? g.dat : new Map(), khoaN), veDangN(hh.dat, khoaN));
  const doKhoa = [...hh.do.keys()];
  const doRc = hh.rc !== 0 && !doKhoa.length ? [`thoát ${hh.rc}: ${dongLoi(hh.stderr + hh.stdout).slice(0, 160)}`] : [];
  return { tong: s.tong, thieu: s.thieu, doKhoa, doRc, xanh: !s.thieu.length && !doKhoa.length && !doRc.length };
}
// CHONG-RONG (AC-6): mỗi lệnh đọc một commit lịch sử trong tệp kiểm phải giải đường qua `pathspec(` của bộ dịch (rỗng →
// «bo-cuc: pathspec rỗng ở») hoặc là đường bất biến giữa hai bố cục (tests/ · _acceptance/, kể cả qua một hằng chuỗi cùng
// tệp). Bắt MỌI dạng, không chỉ khuôn argv: `'archive'` là một phần tử argv · `git … archive` trong chuỗi (`bash -c '…'`,
// template) · `'show', \`\${ref}:<đường>\`` · `git … show` trong chuỗi. Dòng không phải chú thích có chữ `archive` hay
// `git … show` mà không khớp dạng nào → lệnh «dạng lạ», ok=false: dạng mới phải được dạy cho bộ quét chứ không lọt im.
const BAT_BIEN = /^(tests|_acceptance)\//;
export function lenhLichSu(src) {
  const ra = [];
  const hang = ten => { const m = src.match(new RegExp(`const ${ten}\\s*=\\s*(['"\`])([^'"\`]*)\\1`)); return m ? m[2] : null; };
  src.split('\n').forEach((l, i) => {
    const t = l.trim(); if (t.startsWith('//') || t.startsWith('*')) return;
    const qua = l.includes('pathspec(');
    if (l.includes("'archive'")) ra.push({ dong: i + 1, loai: 'archive', ok: qua, ly_do: 'git archive không qua pathspec' });
    else if (/\bgit\b[^\n]*\barchive\b/.test(l)) ra.push({ dong: i + 1, loai: 'archive-chuoi', ok: qua, ly_do: 'git archive trong chuỗi lệnh không qua pathspec' });
    else if (/\barchive\b/.test(l)) ra.push({ dong: i + 1, loai: 'la', ok: false, ly_do: 'chữ archive ở dạng bộ quét chưa biết — dạy bộ quét dạng này' });
    if (!/'show',/.test(l) && /\bgit\b[^\n]*\bshow\b/.test(l)) ra.push({ dong: i + 1, loai: 'show-chuoi', ok: qua, ly_do: 'git show trong chuỗi lệnh không qua pathspec' });
    for (const m of l.matchAll(/'show',\s*(`[^`]*`|\S+)/g)) {
      const x = m[1].match(/^`\$\{[^}]+\}:(.*)`$/);
      if (!x) { ra.push({ dong: i + 1, loai: 'show', ok: false, ly_do: 'git show không đọc được dạng <ref>:<đường>' }); continue; }
      const d = x[1]; const id = d.match(/^\$\{(\w+)\}$/);
      const ok = d.startsWith('${pathspec(') || BAT_BIEN.test(d) || Boolean(id && BAT_BIEN.test(hang(id[1]) || ''));
      ra.push({ dong: i + 1, loai: 'show', ok, ly_do: `git show đường «${d.slice(0, 60)}» không qua pathspec, không bất biến` });
    }
  });
  return ra;
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
  // Tệp CÓ ở GOC_VONG (bản gốc ghim chạy thật) — tệp mới thì túi gốc rỗng, phép so không thể đỏ.
  { id: 'CU-DO', tep: 'tests/scripts/recheck-goc-goi-loi.test.mjs', cu: "check('RG-2b ", moi: "void ('RG-2b ", mat: /^RG-2b /, goc: true },
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
    const s = soCuTep(g, hh, khoaN);
    if (s.xanh) { out.push(`  PASS: CU ${u.id} — ${s.tong}/${s.tong} khoá bản gốc còn ở HEAD, mọi ca xanh${g ? '' : ' (tệp mới)'}`); continue; }
    soFail++; mat += s.thieu.length; dO += s.doKhoa.length + s.doRc.length;
    for (const k of s.thieu) out.push(`  FAIL: CU ${u.id} — mất khoá: ${k}`);
    for (const k of [...s.doKhoa, ...s.doRc]) out.push(`  FAIL: CU ${u.id} — đỏ: ${k}`);
  }
  for (const p of TU_PHA) {
    const f = path.join(cHead, p.tep); const t0 = existsSync(f) ? readFileSync(f, 'utf8') : null;
    const dong = kq.find(([u]) => u.id === p.tep);
    if (t0 === null || t0.split(p.cu).length !== 2) { soFail++; out.push(`  FAIL: ${p.id} nhát phá không áp: ${p.tep}`); continue; }
    if (!dong || !dong[1]) { soFail++; out.push(`  FAIL: ${p.id} ${p.tep} không có lượt bản gốc ghim — phép so không thể đỏ`); continue; }
    const [u, g, lanh] = dong;
    writeFileSync(f, t0.replace(p.cu, p.moi));
    let pha; try { pha = await chay(ctx, cHead, u, { nhan: 'phá' }); } finally { writeFileSync(f, t0); }
    const sl = soCuTep(g, lanh, khoaN); const sp = soCuTep(g, pha, khoaN);
    const matCa = sp.thieu.filter(k => p.mat.test(k));
    if (sl.xanh && matCa.length) out.push(`  PASS: ${p.id} ${p.tep} — bỏ một ca trên bản sao HEAD → cùng phép so của --cu đỏ «mất khoá: ${matCa[0].slice(0, 60)}»; bản lành xanh`);
    else { soFail++; out.push(`  FAIL: ${p.id} phép so không đỏ — ${p.tep}${sl.xanh ? '' : ' (bản lành không xanh)'}`); }
  }
  out.push(`giu-khoa-3 --cu: ${donVi.length} tệp, ${mat} khoá mất, ${dO} ca đỏ`);
  return soFail;
}

// Khoá cấp tệp («<tên tệp>», dòng bộ chạy ghi khi tệp thoát 0) đỏ CHỈ vì các ca đỏ khác trong tệp đều là khoá đích của cụm
// NGOÀI vòng (K4-DN, B2, K4-PL — lời giao) → trả danh sách ấy (miễn có tên); có một ca đỏ nào khác → null (vẫn FAIL).
export function chanNgoaiVong(r, t, hang, doi) {
  if (r.khoa !== r.tepKiem) return null;
  const doKhac = [...t.do.keys()].filter(k => k !== r.khoa);
  if (!doKhac.length) return null;
  const ngoai = hang.filter(h => NGOAI_VONG.includes(h.cum) && h.tepKiem === r.tepKiem);
  const la = doKhac.filter(k => !ngoai.some(h => demKhop(new Map([[k, 1]]), h.khoa, doi)));
  return la.length ? null : doKhac.join(' · ');
}

// ── --moi ────────────────────────────────────────────────────────────────────────────────────────────────────────────
function donViKhoa(r, cay) {
  const t = tepNguon(r);
  if (t) return existsSync(path.join(cay, t)) ? [donViTep(t)] : [];
  const dir = path.join(cay, 'tests', r.bo); const ten = r.khoa.split(' ')[0];
  return readdirSync(dir).filter(f => /\.(test|ca)\.mjs$/.test(f)).filter(f => readFileSync(path.join(dir, f), 'utf8').includes(ten)).map(f => donViTep(`tests/${r.bo}/${f}`));
}
// Kho mới của thước = khoMoi vòng hai + luật đường đổi tên của bước 3 kịch bản (bản chép vòng hai thiếu — buoc3-duong-chep.mjs).
// Rồi bảng vá B2 (ảnh chụp va-bo-kiem-b2.json) cho các tệp CÒN ĐI bước 6 — đúng như kịch bản thật áp sau luật chung bước 6.
// Mục vá trên tệp tự đúng đường (vòng hai ∪ vòng ba) là mục thừa, không áp. Mục không khớp đúng `so_lan` lần → ghi vào
// `ctx.vaLech` (in TIN), không áp — kịch bản thật dừng ở «vá không khớp», thước báo thay vì đoán.
export function apVa(nd, v) { const n = nd.split(v.cu).length - 1; return n === v.so_lan ? nd.split(v.cu).join(v.moi) : null; }
function khoMoi3(ctx, h, nhan) {
  const bq = new Set([...tuDung2(), ...tuDung3()]);
  const d = khoMoi(ctx, h, nhan, { ten: true, buoc6: true, boQua: [...bq] });
  if (apDuongDoiTen(d)) { git(d, 'add', '-A'); git(d, '-c', 'commit.gpgsign=false', 'commit', '-q', '-m', 'kho mới: luật đường đổi tên của bước 3'); }
  ctx.vaLech = ctx.vaLech || [];
  if (existsSync(VA_B2)) {
    const nd = new Map(); let so = 0;
    for (const v of JSON.parse(readFileSync(VA_B2, 'utf8'))) {
      if (bq.has(v.tep)) continue;
      const p = path.join(d, v.tep); const cu = nd.get(v.tep) ?? (existsSync(p) ? readFileSync(p, 'utf8') : null);
      if (cu === null) { ctx.vaLech.push(`${v.tep}: tệp không có`); continue; }
      const moi = apVa(cu, v);
      if (moi === null) { ctx.vaLech.push(`${v.tep}: «${v.cu.split('\n')[0].slice(0, 80)}» không khớp ${v.so_lan} lần`); continue; }
      nd.set(v.tep, moi); so++;
    }
    for (const [f, c] of nd) writeFileSync(path.join(d, f), c);
    if (so) { git(d, 'add', '-A'); git(d, '-c', 'commit.gpgsign=false', 'commit', '-q', '-m', `kho mới: bảng vá B2 (${so} mục) cho tệp còn đi bước 6`); }
  }
  return d;
}
async function cheDoMoi(ctx, args, out) {
  const cums = args.cum ? [args.cum] : VONG; const h = head();
  const hang = docKhoaDich(KHOA_DICH);
  const khoaN = [...new Set(hang.map(r => r.khoa).filter(k => k.includes('<n>')))];
  const cHead = nhanBan(ctx, h, 'cu'); const moi = khoMoi3(ctx, h, 'moi');
  const dich = hang.filter(r => cums.includes(r.cum)).map(r => ({ ...r, dv: donViKhoa(r, cHead) }));
  const donVi = new Map(); for (const r of dich) for (const u of r.dv) donVi.set(u.id, u);
  const kq = new Map(await Promise.all([cHead, moi].flatMap(c => [...donVi.values()].map(async u => [`${c}\0${u.id}`, await chay(ctx, c, u)]))));
  const lay = (c, u) => kq.get(`${c}\0${u.id}`);
  const doi = doiKhoa(BX._bangTen, BX);
  let soFail = 0;
  for (const cum of cums) {
    const ds = dich.filter(r => r.cum === cum); const thieu = []; const dO = []; let tin = 0;
    const can = new Map(); for (const r of ds) { const k = `${r.dv.map(u => u.id).join('|')}\0${r.khoa}`; can.set(k, { r, n: (can.get(k)?.n || 0) + 1 }); }
    for (const { r, n } of can.values()) {
      if (!r.dv.length) { for (let i = 0; i < n; i++) thieu.push(`${r.bo}: ${r.khoa} — không tìm được tệp chạy`); continue; }
      const t = gop(...r.dv.map(u => lay(moi, u)));
      const co = demKhop(t.dat, r.khoa, doi);
      if (co < n) { const ch = chanNgoaiVong(r, t, hang, doi); if (ch) { tin += n; out.push(`  TIN: MOI ${cum} — ${r.bo}: ${r.khoa} đỏ CHỈ vì khoá cụm ngoài vòng trong cùng tệp: ${ch}`); continue; } }
      for (let i = co; i < n; i++) (demKhop(t.do, r.khoa, doi) > i - co ? dO : thieu).push(`${r.bo}: ${r.khoa}`);
    }
    if (!thieu.length && !dO.length) out.push(`  PASS: MOI ${cum} — ${ds.length - tin}/${ds.length} khoá đích có mặt và xanh ở kho mới${tin ? `; ${tin} khoá cấp tệp chặn bởi cụm ngoài vòng (TIN)` : ''}`);
    else {
      soFail++;
      out.push(`  FAIL: MOI ${cum} — ${ds.length - thieu.length - dO.length}/${ds.length} khoá đích có mặt và xanh ở kho mới (thiếu ${thieu.length}, đỏ ${dO.length})`);
      for (const k of thieu) out.push(`  FAIL: MOI ${cum} — thiếu: ${k}`);
      for (const k of dO) out.push(`  FAIL: MOI ${cum} — đỏ: ${k}`);
    }
  }
  for (const u of donVi.values()) {
    const m = lay(moi, u); const cu = veDangN(tuiCu(lay(cHead, u).dat, m.dat, doi), khoaN);
    const mien = new Map(); for (const r of hang) if (r.bo === u.bo) mien.set(r.khoa, (mien.get(r.khoa) || 0) + 1);
    const s = soTui(cu, veDangN(m.dat, khoaN), mien);
    if (!s.thieu.length) out.push(`  PASS: MOI túi ${u.id} — khoá bố cục cũ còn ở kho mới`);
    else { soFail++; for (const k of s.thieu) out.push(`  FAIL: MOI túi ${u.id} — thiếu ở kho mới: ${k}`); }
  }
  if (cums.includes('K4-TB')) {
    const tep = [...new Set(dich.filter(r => r.cum === 'K4-TB').flatMap(r => r.dv.map(u => u.id)))].sort();
    const lenh = tep.flatMap(f => lenhLichSu(readFileSync(path.join(cHead, f), 'utf8')).map(x => ({ ...x, f })));
    const hong = lenh.filter(x => !x.ok);
    if (!lenh.length) { soFail++; out.push('  FAIL: CHONG-RONG không tìm thấy lệnh đọc commit lịch sử nào ở K4-TB — phép quét mù'); }
    else if (hong.length) { soFail++; for (const x of hong) out.push(`  FAIL: CHONG-RONG ${x.f}:${x.dong} — ${x.ly_do}`); }
    else out.push(`  PASS: CHONG-RONG ${lenh.length} lệnh đọc commit lịch sử ở ${new Set(lenh.map(x => x.f)).size}/${tep.length} tệp K4-TB giải đường qua pathspec của bộ dịch (rỗng → «bo-cuc: pathspec rỗng ở») hoặc đường bất biến tests/ · _acceptance/; ca chạy xanh ở kho mới nên không pathspec nào rỗng`);
  }
  for (const l of (ctx.vaLech || [])) out.push(`  TIN: MOI vá B2 không áp — ${l}`);
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
  const rl = lechRaLop(tap, bang);
  if (rl.thieu.length || rl.thua.length) { soFail++; for (const f of rl.thieu) out.push(`  FAIL: RA-LOP thiếu ${f}`); for (const f of rl.thua) out.push(`  FAIL: RA-LOP thừa ${f} — không gọi merge-base ở ${GOC_VONG.slice(0, 8)} lẫn HEAD`); }
  else out.push(`  PASS: RA-LOP ${tap.length}/${tap.length} tệp đã xếp nhóm, bảng không thừa dòng (${tap.filter(f => bang.get(f) === 'A').length} A)`);
  const banTep = f => [GOC_VONG, h].map(ref => { try { return git(GOC, 'show', `${ref}:${f}`); } catch { return null; } });
  const lechD = lechDongRaLop(docRaLopDong(readFileSync(RA_LOP, 'utf8')), banTep);
  if (lechD.length) { soFail++; for (const l of lechD) out.push(`  FAIL: RA-LOP-DONG ${l}`); }
  else out.push(`  PASS: RA-LOP-DONG mọi số ở cột «Dòng» của ${bang.size} dòng bảng trỏ một dòng có chữ merge-base ở ${GOC_VONG.slice(0, 8)} hoặc HEAD`);
  for (const f of tap.filter(f => !chayDuoc(f))) out.push(`  TIN: SAU-GOP bỏ ${f} — ngoài bộ chạy thường trực`);
  const ds = tap.filter(chayDuoc);
  const sua = new Set(tepVongSua(diffTests(h), diffNT(h)));
  const sau = nhanBan(ctx, h, 'sau-gop', h);
  const nhanh = nhanBan(ctx, h, 'nhanh');
  // Đối chứng trước gộp (cùng môi trường bản sao, origin/main thật): chạy cho tệp vòng chạm (so túi) và cho tệp đỏ sau gộp.
  const kq = await Promise.all(ds.map(async f => { const r = await chay(ctx, sau, donViTep(f)); const can = sua.has(f) || phanSauGop(r, null) !== 'xanh'; return [f, r, can ? await chay(ctx, nhanh, donViTep(f)) : null]; }));
  let moiTruong = 0; const nhomA = [];
  for (const [f, r, n] of kq) {
    const doK = [...r.do.keys()]; const loai = phanSauGop(r, n);
    // Nhóm A (kỳ vọng tuyệt đối theo mốc): xanh sau gộp mà KHÔNG nhờ miễn môi trường — đó là quan hệ nhóm↔mã đo được:
    // tệp A đọc bản gốc từ merge-base thì sau gộp (merge-base = HEAD) đỏ, như bang-ten-lo-trinh ở GOC_VONG (SAU-GOP-DO).
    if (bang.get(f) === 'A') { nhomA.push(f); if (loai !== 'xanh') { soFail++; out.push(`  FAIL: RA-LOP-A ${f} — nhóm A không xanh sau gộp (${loai}); bản gốc còn đọc từ merge-base?`); } }
    if (loai === 'xanh') out.push(`  PASS: SAU-GOP ${f} — ${[...r.dat.values()].reduce((a, b) => a + b, 0)} ca xanh khi origin/main = HEAD`);
    else if (loai === 'moi-truong') { moiTruong++; out.push(`  TIN: SAU-GOP ${f} — đỏ Y HỆT ở đối chứng trước gộp cùng bản sao (thoát ${r.rc}; ${doK.slice(0, 5).join(' · ')}) — môi trường bản sao, không do gộp`); }
    else { soFail++; out.push(`  FAIL: SAU-GOP ${f} — thoát ${r.rc}${doK.length ? `; đỏ: ${doK.slice(0, 5).join(' · ')}` : `: ${dongLoi(r.stderr + r.stdout).slice(0, 160)}`}${n ? ` (đối chứng trước gộp: thoát ${n.rc}, đỏ ${[...n.do.keys()].length})` : ''}`); }
    if (!sua.has(f)) continue;
    const a = soTui(n.dat, r.dat); const b = soTui(r.dat, n.dat);
    if (!a.thieu.length && !b.thieu.length) out.push(`  PASS: SAU-GOP-TUI ${f} — túi khoá sau gộp bằng túi trên nhánh (${a.tong})`);
    else { soFail++; out.push(`  FAIL: SAU-GOP-TUI ${f} — lệch: sau gộp thiếu ${a.thieu.slice(0, 3).join(' · ') || '0'}; sau gộp thừa ${b.thieu.slice(0, 3).join(' · ') || '0'}`); }
  }
  if (nhomA.length) out.push(`  PASS: RA-LOP-A ${nhomA.length}/${[...bang.values()].filter(x => x === 'A').length} tệp nhóm A xanh sau gộp (origin/main = HEAD) không nhờ miễn — bản gốc không đọc từ merge-base của nhánh`);
  else { soFail++; out.push('  FAIL: RA-LOP-A không tệp nhóm A nào chạy sau gộp'); }
  // Chiều đỏ: lỗi đã biết — bang-ten-lo-trinh ở GOC_VONG, sau gộp (origin/main = GOC_VONG) phải đỏ ở ca SP.
  const g = nhanBan(ctx, GOC_VONG, 'sau-gop-goc', GOC_VONG);
  const r = await chay(ctx, g, donViTep('tests/scripts/bang-ten-lo-trinh.test.mjs'), { nhan: 'sau-gop-do' });
  if (r.rc !== 0 && [...r.do.keys()].some(k => /^SP /.test(k)) && lyDo(r, /^SP /).includes('bản gốc in road-map@')) out.push(`  PASS: SAU-GOP-DO bang-ten-lo-trinh ở ${GOC_VONG.slice(0, 8)} sau gộp đỏ: ${lyDo(r, /^SP /)}`);
  else { soFail++; out.push(`  FAIL: SAU-GOP-DO phép mô phỏng sau gộp không đỏ đúng câu «bản gốc in road-map@» trên lỗi đã biết (thoát ${r.rc}: ${lyDo(r, /^SP /)})`); }
  out.push(`giu-khoa-3 --sau-gop: ${ds.length} tệp, ${moiTruong} đỏ do môi trường bản sao (TIN), ${soFail} dòng FAIL`);
  return soFail;
}

// ── --chieu-do ───────────────────────────────────────────────────────────────────────────────────────────────────────
// Ca canh mỗi cụm; `ghim` = các mảnh chữ phải có trong thông điệp đỏ dưới bản thay thế (bộ dịch đồng nhất trả đường phẳng;
// haiCay luôn bung cây đang chạy) — phần ổn định của câu, đường kho tạm che «<kho>». Mỗi ca canh nằm ở một tệp tự đúng đường
// của vòng ba, nên bản thay thế trỏ đường phẳng không có ở kho mới.
export const CA_CANH = [
  // K4-MP: cây đang chạy đã dọn nhà mà bị coi là phẳng → dựng kho mới từ nó → đúng lỗi B2 đo ở lượt 7.
  // Lượt thay RIÊNG haiCay, bộ dịch THẬT (bộ dịch đồng nhất làm tệp rẽ sang nhánh cây phẳng, không gọi haiCay).
  { cum: 'K4-MP', thay: 'haiCay', tep: 'tests/scripts/bang-ten-lo-trinh.test.mjs', ca: 'SP chan-lo-trinh · cũ · có', ghim: ['vắng khỏi túi đạt', 'source lạ: ./plugins/acceptance-gate'] },
  // K4-RG: bộ kiểm lại bằng chứng nạp theo đường phẳng → không có ở kho mới.
  { cum: 'K4-RG', thay: 'dich', tep: 'tests/scripts/recheck-goc-goi-loi.test.mjs', ca: 'RG-1', ghim: ['mong exit 0, được exit 1', 'node:internal/modules/cjs/loader'] },
  { cum: 'K4-LT', thay: 'dich', tep: 'tests/scripts/lo-trinh-du-lieu-ngay.test.mjs', ca: 'ND-1', ghim: ['ERR_MODULE_NOT_FOUND', "Cannot find module '<kho>/scripts/lo-trinh.mjs'"] },
  { cum: 'K4-TB', thay: 'dich', tep: 'tests/scripts/khoi-khuon-tren-the-cong.test.mjs', ca: 'KK-1', ghim: ['vắng khỏi túi đạt', "ENOENT: no such file or directory, lstat '<kho>/skills'"] },
];
export const banHaiCayCu = () => `// hai-bo-cuc.mjs — BẢN LUÔN BUNG CÂY ĐANG CHẠY do thước (--chieu-do) sinh: hành vi trước vòng ba.
export * from './hai-bo-cuc.that.mjs';
import { haiCay as that } from './hai-bo-cuc.that.mjs';
export function haiCay(kho, tmp, o = {}) { return that(kho, tmp, { ...o, epPhang: true }); }
`;
// AC-1: bản gốc ghim của ma trận bang-ten đổi sang HEAD trên bản sao HEAD (bố cục cũ) → ô «cũ · thiếu» đỏ: cột bản gốc viết
// trước (null) không còn khớp đầu ra của bản gốc bị đổi.
export const PHA_GHIM = [
  { id: 'AC-1', tep: 'tests/scripts/bang-ten-lo-trinh.test.mjs', cu: "const MOC_MA_TRAN = '644e9b49af3d24de3fe284304d765ea388304b89';", moi: h => `const MOC_MA_TRAN = '${h}';`, ca: 'SP chan-lo-trinh · cũ · thiếu', ghim: ['bản gốc in road-map@', 'ma trận viết trước null'] },
];
async function cheDoChieuDo(ctx, out) {
  if (!CA_CANH.length) throw new HaTang('CA_CANH rỗng — chiều đỏ chưa khai ca canh');
  const h = head(); const d = khoMoi3(ctx, h, 'moi-do');
  const lanh = await Promise.all(CA_CANH.map(c => chay(ctx, d, { ...donViTep(c.tep), them: c.them }, { nhan: 'thật' })));
  const dich = path.join(d, 'tests', 'bo-cuc.mjs'); const hc = path.join(d, 'tests', 'hai-bo-cuc.mjs');
  if (!existsSync(dich) || !existsSync(hc)) throw new HaTang('kho mới thiếu tests/bo-cuc.mjs hay tests/hai-bo-cuc.mjs để thay');
  const dichThat = readFileSync(dich); const hcThat = readFileSync(hc);
  // Hai lượt thay TÁCH nhau, mỗi lượt chỉ một thứ: ca canh của lượt nào đỏ thì đỏ vì đúng thứ bị thay.
  const pha = new Array(CA_CANH.length);
  for (const thay of ['dich', 'haiCay']) {
    writeFileSync(dich, thay === 'dich' ? banDongNhat() : dichThat);
    if (thay === 'haiCay') { writeFileSync(path.join(d, 'tests', 'hai-bo-cuc.that.mjs'), hcThat); writeFileSync(hc, banHaiCayCu()); } else writeFileSync(hc, hcThat);
    git(d, 'add', '-A'); git(d, '-c', 'commit.gpgsign=false', 'commit', '-q', '--allow-empty', '-m', `chiều đỏ: thay ${thay === 'dich' ? 'bộ dịch bằng bản đồng nhất' : 'haiCay bằng bản bung cây đang chạy'}`);
    const ds = CA_CANH.map((c, i) => [c, i]).filter(([c]) => c.thay === thay);
    const kq = await Promise.all(ds.map(([c]) => chay(ctx, d, { ...donViTep(c.tep), them: c.them }, { nhan: `thay-${thay}` })));
    ds.forEach(([, i], j) => { pha[i] = kq[j]; });
  }
  let soFail = 0;
  for (const c of CA_CANH) if (!['dich', 'haiCay'].includes(c.thay)) throw new HaTang(`ca canh ${c.cum} không khai lượt thay`);
  CA_CANH.forEach((c, i) => {
    const re = reCa(c.ca); const msg = `${lyDo(pha[i], re)}\n${cheKho(pha[i].stdout)}`;
    const thieuG = c.ghim.filter(g => !msg.includes(g));
    if (!xanhCa(lanh[i], re)) { soFail++; out.push(`  FAIL: DO ${c.cum} — đối chứng dương hỏng: ${c.ca} chưa xanh ở kho mới (${lyDo(lanh[i], re)})`); }
    else if (xanhCa(pha[i], re)) { soFail++; out.push(`  FAIL: DO ${c.cum} — chiều đỏ không đỏ: ${c.ca}`); }
    else if (thieuG.length) { soFail++; out.push(`  FAIL: DO ${c.cum} — ${c.ca} đỏ sai thông điệp (thiếu «${thieuG.join('» · «')}»): ${lyDo(pha[i], re)}`); }
    else out.push(`  PASS: DO ${c.cum} — ${c.ca} đỏ đúng câu «${c.ghim.join('» · «')}» khi CHỈ ${c.thay === 'dich' ? 'bộ dịch' : 'haiCay'} bị thay; xanh với bản thật — ${lyDo(pha[i], re).slice(0, 200)}`);
  });
  const cH = nhanBan(ctx, h, 'ghim-do');
  for (const p of PHA_GHIM) {
    const f = path.join(cH, p.tep); const t0 = existsSync(f) ? readFileSync(f, 'utf8') : null;
    if (t0 === null || t0.split(p.cu).length !== 2) { soFail++; out.push(`  FAIL: DO ${p.id} nhát phá không áp: ${p.tep}`); continue; }
    const u = donViTep(p.tep); const re = reCa(p.ca); const lanhG = await chay(ctx, cH, u, { nhan: 'ghim-that' });
    writeFileSync(f, t0.replace(p.cu, p.moi(h)));
    let phaG; try { phaG = await chay(ctx, cH, u, { nhan: 'ghim-head' }); } finally { writeFileSync(f, t0); }
    const msg = `${lyDo(phaG, re)}\n${cheKho(phaG.stdout)}`; const thieuG = p.ghim.filter(g => !msg.includes(g));
    if (!xanhCa(lanhG, re)) { soFail++; out.push(`  FAIL: DO ${p.id} — đối chứng dương hỏng: ${p.ca} chưa xanh với bản gốc ghim (${lyDo(lanhG, re)})`); }
    else if (xanhCa(phaG, re)) { soFail++; out.push(`  FAIL: DO ${p.id} — chiều đỏ không đỏ: bản gốc ghim = HEAD mà ${p.ca} vẫn xanh`); }
    else if (thieuG.length) { soFail++; out.push(`  FAIL: DO ${p.id} — ${p.ca} đỏ sai thông điệp (thiếu «${thieuG.join('» · «')}»): ${lyDo(phaG, re)}`); }
    else out.push(`  PASS: DO ${p.id} — bản gốc ghim đổi sang HEAD trên bản sao → ${p.ca} đỏ đúng câu «${p.ghim.join('» · «')}»; xanh với bản gốc ghim`);
  }
  out.push(`giu-khoa-3 --chieu-do: ${CA_CANH.length} ca canh + ${PHA_GHIM.length} chiều đỏ bản gốc ghim, ${soFail} dòng FAIL`);
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
