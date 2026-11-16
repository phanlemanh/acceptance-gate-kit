#!/usr/bin/env node
// giu-khoa.mjs — thước giữ khoá của hồ sơ phan-du-bo-cuc-moi (design §7; kế hoạch Task 2; E1, E3–E8, E11, E12).
//
//   --cu [--base <ref>]          mỗi tệp kiểm vòng chạm (git diff <bản gốc>..HEAD -- tests/; tệp phụ trợ đi qua tệp kiểm
//                                nạp nó) chạy ở bản gốc và ở HEAD: túi khoá HEAD ⊇ túi khoá bản gốc, mọi ca HEAD xanh;
//                                cộng CU-LT94 (chốt ngày chạy của LT-94 dưới đồng hồ ghim) và CU-DO/CU-DO-DP (phép so tự
//                                phá trên bản sao HEAD; GIU_KHOA_BO_TU_PHA=1 bỏ — tệp kiểm của thước đặt nó). Khoá khớp một
//                                khoá đích «<n>» so ở dạng «<n>» cả hai phía.
//   --moi [--cum <cụm>] [--bien-the i|ii|iii|ca-ba] [--base <ref>]
//                                kho mới dựng từ HEAD — (i) bước 1–3 (`dungKhoMoi` + luật đổi chữ lên tài liệu ở gốc) +
//                                luật đổi tên trên tests/; (ii) như (i) rồi luật chung bước 6 (`buoc6-chep.mjs`, không bảng
//                                vá); (iii) như (ii) nhưng bước 6 bỏ qua các «tệp tự đúng đường» khai ở khối máy
//                                GUI-B2-TU-DUNG của gui-b2.md (sổ d-20261115T044131Z-24). PASS/FAIL và mã thoát theo (iii)
//                                — mặc định; (i), (ii) in dòng «TIN:» (số, không chấm). Mọi khoá đích của các cụm vòng nhận
//                                có mặt và xanh; túi mỗi tệp ⊇ túi bố cục cũ (khoá của khoa-dich.tsv miễn).
//   --chieu-do                   kho mới (iii), bộ dịch thay bằng bản đồng nhất → ca canh mỗi cụm đỏ đúng câu ghim (đối
//                                chứng dương: xanh với bộ dịch thật); GUI-B2: mục vá thừa rút bằng máy khớp gui-b2.md.
// Khoá đích chứa «<n>» (khoa-dich.tsv) khớp khoá chạy có một dãy số ở đúng chỗ ấy; khoá khác so nguyên chữ.
//   --ghi-gui-b2                 rút lại mục vá thừa và ghi vào khối máy của gui-b2.md.
// Bản gốc = merge-base HEAD origin/main (hoặc --base). Mọi cây là bản sao `git clone --shared` của kho ở thư mục tạm
// (lịch sử đủ, origin/main ghim như kho), HOME rỗng; gốc kho suy từ vị trí tệp này; không ghi gì vào cây kit trừ
// --ghi-gui-b2. Thoát: 0 · 1 có dòng FAIL · 2 sai đối số · 3 «HẠ TẦNG: …» (không in PASS nào).
import { execFileSync, spawn } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chuanHoa, doiKhoa, docKhoaDich, gop, locTheoGoc, rutKhoa, soTui, tuiCu } from './tui-khoa.mjs';
import { BX, buoc6BoKiem } from './buoc6-chep.mjs';
import { TEP, THU_MUC, dungKhoMoi, luatDoiChu as luatDoiChuKit } from '../../goi-cheo-loi-dieu-phoi/rang/luat-doi-chu.mjs';

export { chuanHoa };
const HERE = path.dirname(fileURLToPath(import.meta.url));
const GOC = path.resolve(HERE, '..', '..', '..');
const HO_SO = path.resolve(HERE, '..');
const KHOA_DICH = path.join(HO_SO, 'khoa-dich.tsv');
const VA_B2 = path.join(HERE, 'va-bo-kiem-b2.json');
const GUI_B2 = path.join(HO_SO, 'gui-b2.md');
export const VONG = ['K2', 'K3', 'SP', 'K4-SC', 'K4-PL'];
// K4-DN: sáu khoá K4-SC chỉ về được kho mới khi đổi nghĩa (sổ d-20261115T041020Z-23) — tách khỏi K4-SC ngày 15/11, lên
// Cổng Bằng chứng thành mục Ngoài-n; miễn khỏi túi như mọi khoá của khoa-dich.tsv.
export const NGOAI_VONG = ['K4-LT', 'K4-TB', 'K4-DN'];
// Trần một đơn vị chạy. Đo 15/11: bộ scripts trọn (tests/scripts/run-tests.sh) ở hai cây song song chạm 40 phút cả hai.
const HET_GIO_MS = 90 * 60 * 1000;
class HaTang extends Error {}
const CON = new Set(); // tiến trình con đang chạy — giết cả nhóm khi thước bị dừng
const giet = c => { try { process.kill(-c.pid, 'SIGKILL'); } catch { try { c.kill('SIGKILL'); } catch { /* đã chết */ } } };
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const dongCuoi = s => String(s || '').trim().split('\n').filter(Boolean).pop() || '';
// Dòng nói lý do của một lần chạy hỏng: dòng lỗi đầu tiên của stderr (không phải «Node.js vX» cuối vết ngăn xếp), không thì dòng cuối.
const dongLoi = s => String(s || '').split('\n').map(l => l.trim()).find(l => /^(\w*Error\b|Error:|ERR_|HẠ TẦNG)|Cannot find|node lệch/.test(l)) || dongCuoi(s);

// ── git và bản sao ───────────────────────────────────────────────────────────────────────────────────────────────────
const ENV_GIT = { GIT_CONFIG_NOSYSTEM: '1', GIT_AUTHOR_NAME: 'giu-khoa', GIT_AUTHOR_EMAIL: 'giu-khoa@invalid', GIT_COMMITTER_NAME: 'giu-khoa', GIT_COMMITTER_EMAIL: 'giu-khoa@invalid' };
function git(d, ...a) {
  try { return execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', maxBuffer: 1 << 28, env: { ...process.env, ...ENV_GIT }, stdio: ['ignore', 'pipe', 'pipe'] }).trim(); }
  catch (e) { throw new HaTang(`git ${a.slice(0, 3).join(' ')}: ${dongCuoi(e.stderr) || e.message}`); }
}
const gitThu = (d, ...a) => { try { return git(d, ...a); } catch { return null; } };

export function moCtx() {
  const tmp = realpathSync(mkdtempSync(path.join(tmpdir(), 'giu-khoa-')));
  const home = path.join(tmp, 'home'); mkdirSync(home);
  return { tmp, home, originMain: gitThu(GOC, 'rev-parse', '--verify', '-q', 'origin/main'), seq: 0, hang: new Map(), cache: new Map() };
}
const tam = (ctx, ten) => { const d = path.join(ctx.tmp, `${ten}-${++ctx.seq}`); mkdirSync(d, { recursive: true }); return d; };

function nhanBan(ctx, sha, nhan) {
  const d = path.join(ctx.tmp, `${nhan}-${++ctx.seq}`);
  try { execFileSync('git', ['clone', '-q', '--shared', '--no-checkout', GOC, d], { env: { ...process.env, ...ENV_GIT }, stdio: 'ignore' }); }
  catch (e) { throw new HaTang(`nhân bản kho cho ${nhan}: ${e.message}`); }
  git(d, 'checkout', '-q', '--detach', sha);
  if (ctx.originMain) git(d, 'update-ref', 'refs/remotes/origin/main', ctx.originMain);
  return d;
}
const commitHet = (d, tieuDe) => { git(d, 'add', '-A'); git(d, '-c', 'commit.gpgsign=false', 'commit', '-q', '--allow-empty', '-m', tieuDe); };

const laChu = buf => !buf.subarray(0, 8192).includes(0);
const doiChuTep = (p, L) => {
  const buf = readFileSync(p); if (!laChu(buf)) return;
  let nd = buf.toString('utf8'); const g0 = nd;
  for (const l of L) nd = nd.replace(l.re, l.thay);
  if (nd !== g0) writeFileSync(p, nd);
};

// Tài liệu ở gốc mà bước 3 của kịch bản áp luật đổi chữ (ngoài cây plugins/). Nguồn (đọc, không nạp):
// ~/dev/delivery-loop/.claude/worktrees/b2-bo-kiem-xanh-o-kho-moi-3db198/migration/kich-ban/don-nha.mjs `buoc3DoiTen`
// (dòng 142–182: tập = `ls-files plugins` trừ `khong_doi_chu` + `bx.tai_lieu_doi_chu` có thật) và `bang-xep.json`
// `tai_lieu_doi_chu`, nhánh B2 đỉnh c87ff183; đọc 2026-11-15. `luatDuongDoiTen` của bước 3 chỉ áp trong thư mục plugin
// (`chiTrong`) nên không chạm các tệp này.
export const TAI_LIEU_DOI_CHU = ['README.md', 'GUIDE.md', 'QUICKSTART.md', '.claude/settings.json'];

// «Tệp tự đúng đường» — khối máy GUI-B2-TU-DUNG của gui-b2.md (viết tay TRƯỚC khi đo; khai báo, không suy từ kết quả).
const MO_TD = '<!-- <<<GUI-B2-TU-DUNG -->'; const DONG_TD = '<!-- GUI-B2-TU-DUNG>>> -->';
export function docTuDung(t) {
  const i = t.indexOf(MO_TD); const j = t.indexOf(DONG_TD);
  if (i < 0 || j < i) return null;
  return t.slice(i, j).split('\n').map(l => l.trim()).filter(l => l.startsWith('tests/'));
}
function tuDung(sha) {
  const ds = existsSync(GUI_B2) ? docTuDung(readFileSync(GUI_B2, 'utf8')) : null;
  if (!ds || !ds.length) throw new HaTang(`${path.relative(GOC, GUI_B2)} thiếu khối ${MO_TD} (danh sách tệp tự đúng đường của biến thể iii)`);
  const co = new Set(git(GOC, 'ls-tree', '-r', '--name-only', sha, '--', 'tests').split('\n'));
  const vang = ds.filter(t => !co.has(t));
  if (vang.length) throw new HaTang(`tệp tự đúng đường khai ở gui-b2.md không có ở ${sha.slice(0, 8)}: ${vang.join(', ')}`);
  return ds;
}
// Bốn tệp vòng sửa mà vẫn đi bước 6 (gui-b2.md §2): hai runner chỉ sửa một phần khối, lo-trinh.test.mjs chỉ dời ngày LT-94,
// tiep-tuc.test.mjs (thêm sau chữ ký) chỉ cho danh sách chép của DP3-12-do-lb qua boPhan, còn LUAT_MAU và đường lệnh vẫn phẳng.
export const VAN_BUOC6 = ['tests/dieu-phoi/tiep-tuc.test.mjs', 'tests/plugins/run-tests.sh', 'tests/scripts/lo-trinh.test.mjs', 'tests/scripts/run-tests.sh'];
// Luật viết danh sách (gui-b2.md §2), máy giữ: mọi tệp dưới tests/ mà diff bản gốc..HEAD chạm (trừ tệp đã xoá) nằm ở đúng
// một trong hai nơi — khối GUI-B2-TU-DUNG hoặc VAN_BUOC6. Lệch → mỗi tệp một dòng; rỗng là khớp.
export function lechLuatTuDung(sua, td, van = VAN_BUOC6) {
  const T = new Set(td); const V = new Set(van); const S = new Set(sua); const ra = [];
  for (const f of sua) if (!T.has(f) && !V.has(f)) ra.push(`${f}: vòng sửa mà không khai tự đúng đường, cũng không khai còn đi bước 6`);
  for (const f of sua) if (T.has(f) && V.has(f)) ra.push(`${f}: khai cả tự đúng đường lẫn còn đi bước 6`);
  for (const f of td) if (!S.has(f)) ra.push(`${f}: khai tự đúng đường mà vòng không sửa`);
  return ra;
}
export const BIEN_THE = ['i', 'ii', 'iii'];
const CHAM = 'iii'; // biến thể chấm (sổ d-20261115T044131Z-24); các biến thể khác in «TIN:»
const tuyChon = (bt, sha) => ({ ten: true, buoc6: bt !== 'i', boQua: bt === 'iii' ? tuDung(sha) : null });

// Kho mới trên một bản sao (lịch sử KIT đủ; cây mới là con của HEAD): bước 1–3 (gồm luật đổi chữ lên TAI_LIEU_DOI_CHU),
// rồi (ten) `luatDoiChu()` của hồ sơ gọi chéo lên MỌI tệp chữ dưới tests/** — đúng cách đã chứng ở Task 1b —, rồi (buoc6)
// luật chung bước 6 không bảng vá; `boQua` = tệp bước 6 bỏ qua (giữ nguyên nội dung trước bước 6).
export function khoMoi(ctx, sha, nhan, { ten = true, buoc6 = false, boQua = null } = {}) {
  const d = nhanBan(ctx, sha, nhan);
  let dichGoi;
  try {
    const plug = tam(ctx, `plug-${nhan}`);
    ({ dichGoi } = dungKhoMoi(d, plug));
    for (const k of Object.keys(THU_MUC)) rmSync(path.join(d, k), { recursive: true, force: true });
    for (const k of Object.keys(TEP)) rmSync(path.join(d, k), { force: true });
    cpSync(path.join(plug, 'plugins'), path.join(d, 'plugins'), { recursive: true });
    cpSync(path.join(plug, '.claude-plugin', 'marketplace.json'), path.join(d, '.claude-plugin', 'marketplace.json'));
    const L = luatDoiChuKit();
    for (const t of TAI_LIEU_DOI_CHU) if (existsSync(path.join(d, t))) doiChuTep(path.join(d, t), L);
  } catch (e) { throw new HaTang(`dựng kho mới ${nhan}: ${e.message}`); }
  commitHet(d, 'kho mới: bước 1–3');
  if (ten) {
    const L = luatDoiChuKit();
    for (const t of git(d, 'ls-files', '-z', '--', 'tests').split('\0').filter(Boolean)) doiChuTep(path.join(d, t), L);
    commitHet(d, 'kho mới: luật đổi tên trên tests/');
  }
  if (buoc6) {
    const giu = new Map((boQua || []).map(t => [t, readFileSync(path.join(d, t))]));
    try { buoc6BoKiem(d, BX, d, sha, dichGoi); } catch (e) { throw new HaTang(`bước 6 bản chép: ${e.message}`); }
    for (const [t, buf] of giu) writeFileSync(path.join(d, t), buf);
    commitHet(d, `kho mới: luật chung bước 6 (không bảng vá${giu.size ? `; bỏ qua ${giu.size} tệp tự đúng đường` : ''})`);
  }
  return d;
}

// ── đơn vị chạy (một lệnh của bộ kiểm) ───────────────────────────────────────────────────────────────────────────────
const SUITE = bo => (bo === 'dieu-phoi'
  ? { id: 'tests/dieu-phoi/**/*.test.mjs', bo, loai: 'tap', cmd: ['node', '--test', '--test-reporter=tap', 'tests/dieu-phoi/**/*.test.mjs'] }
  : { id: `tests/${bo}/run-tests.sh`, bo, loai: 'bash', cmd: ['bash', `tests/${bo}/run-tests.sh`] });
const PHAN_BASH = bo => (bo === 'scripts'
  ? { id: 'tests/scripts/run-tests.sh --manh bash', bo, loai: 'bash', cmd: ['bash', 'tests/scripts/run-tests.sh', '--manh', 'bash'] }
  : SUITE(bo));
function donViTep(bo, rel) {
  if (bo === 'dieu-phoi') return { id: rel, bo, loai: 'tap', cmd: ['node', '--test', '--test-reporter=tap', rel] };
  // bộ scripts ghi thêm một dòng cho cả tệp (`check "<tên tệp>" 0 $?` của run-tests.sh) — khoá «<tên tệp>».
  const tong = bo === 'scripts' && /\.(test|ca)\.mjs$/.test(rel) ? path.basename(rel) : null;
  return { id: rel, bo, loai: 'bash', cmd: ['node', rel], tong };
}
const lietTep = (d, re) => { const ra = []; const di = p => { if (!existsSync(p)) return; for (const e of readdirSync(p, { withFileTypes: true })) { const q = path.join(p, e.name); if (e.isDirectory()) { if (e.name !== 'fixtures' && e.name !== 'node_modules') di(q); } else if (re.test(e.name)) ra.push(q); } }; di(d); return ra; };

// Một khoá của khoa-dich.tsv → các đơn vị in nó. `goc` = cây để tìm tệp (bố cục cũ).
export function donViCua(bo, tepKiem, khoa, goc) {
  if (tepKiem === '(đầu)') return [SUITE(bo)];
  // Cột tệp = run-tests.sh: ca bash của chính tệp shell (scripts: lượt `--manh bash`), không phải `node <tệp shell>`.
  if (tepKiem === 'run-tests.sh') return [PHAN_BASH(bo)];
  const dir = path.join(goc, 'tests', bo);
  if (tepKiem === '?') {
    const ung = lietTep(dir, /\.(test|ca)\.mjs$/);
    const chu = ung.map(f => [f, readFileSync(f, 'utf8')]);
    let co = chu.filter(([, t]) => ["'", '"', '`'].some(q => t.includes(`${q}${khoa}${q}`)));
    if (!co.length) { const tok = new RegExp(`(^|[^\\w-])${esc(khoa.split(' ')[0])}([^\\w-]|$)`); co = chu.filter(([, t]) => tok.test(t)); }
    return co.map(([f]) => donViTep(bo, path.relative(goc, f)));
  }
  const rel = `tests/${bo}/${tepKiem}`;
  return existsSync(path.join(goc, rel)) ? [donViTep(bo, rel)] : [PHAN_BASH(bo)];
}

// Tệp đổi dưới tests/ → các đơn vị chạy nó (tệp phụ trợ: tệp kiểm nào nhắc tên nó, lần ngược tối đa 3 tầng).
const RE_CHAY = /^tests\/([\w-]+)\/(run-tests\.sh|[^/]+\.(test|ca)\.mjs)$|^tests\/dieu-phoi\/.+\.test\.mjs$/;
function donViChoTep(rel, cays) {
  const m = rel.match(/^tests\/([\w-]+)\//);
  if (m && RE_CHAY.test(rel)) return [/run-tests\.sh$/.test(rel) ? SUITE(m[1]) : donViTep(m[1], rel)];
  const ra = new Map(); const da = new Set([rel]); let mot = [rel];
  for (let tang = 0; tang < 3 && mot.length; tang++) {
    const ke = [];
    for (const cay of cays) {
      for (const f of lietTep(path.join(cay, 'tests'), /\.(mjs|cjs|js|sh|py)$/)) {
        const r = path.relative(cay, f); if (da.has(r)) continue;
        const t = readFileSync(f, 'utf8');
        if (!mot.some(x => t.includes(path.basename(x)))) continue;
        da.add(r);
        if (RE_CHAY.test(r)) { const u = donViChoTep(r, cays)[0]; ra.set(u.id, u); } else ke.push(r);
      }
    }
    mot = ke;
  }
  return [...ra.values()];
}

// ── chạy ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
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
// Mỗi cây một hàng đợi (các bộ kiểm trên cùng cây chạy tuần tự, các cây song song); kết quả nhớ theo (cây, đơn vị, nhãn).
function chay(ctx, goc, u, { nhan = '', them = {} } = {}) {
  const k = `${goc}\0${u.id}\0${nhan}`;
  if (ctx.cache.has(k)) return ctx.cache.get(k);
  const truoc = ctx.hang.get(goc) || Promise.resolve();
  const p = truoc.catch(() => {}).then(async () => {
    process.stderr.write(`giu-khoa: chạy ${u.id}${nhan ? ` [${nhan}]` : ''} ở ${path.basename(goc)}\n`);
    const r = await chayLenh(ctx, goc, u.cmd, { ...(u.them || {}), ...them });
    const kq = rutKhoa(r.stdout, u.loai);
    if (u.tong) { const kk = chuanHoa(u.tong); const t = r.rc === 0 ? kq.dat : kq.do; t.set(kk, (t.get(kk) || 0) + 1); if (r.rc !== 0) kq.dongDo.set(kk, `FAIL: ${u.tong} (expected exit 0, got ${r.rc})`); }
    process.stderr.write(`giu-khoa: xong ${u.id}${nhan ? ` [${nhan}]` : ''} ở ${path.basename(goc)} — thoát ${r.rc}, ${r.giay}s\n`);
    return { ...kq, rc: r.rc, stderr: r.stderr, stdout: r.stdout, giay: r.giay };
  });
  ctx.hang.set(goc, p); ctx.cache.set(k, p);
  return p;
}
// Plan: tuiKhoa(tepKiem, goc, { boChay }) — túi khoá (đa tập: Map) của một tệp kiểm ở một cây.
export async function tuiKhoa(tepKiem, goc, { boChay, khoa = '' } = {}) {
  const ctx = moCtx();
  try { return gop(...await Promise.all(donViCua(boChay, tepKiem, khoa, goc).map(u => chay(ctx, goc, u)))); }
  finally { rmSync(ctx.tmp, { recursive: true, force: true }); }
}

// ── bản đồng nhất của bộ dịch (cho --chieu-do) ──────────────────────────────────────────────────────────────────────
export function banDongNhat() {
  return `// bo-cuc.mjs — BẢN ĐỒNG NHẤT do thước giữ khoá (--chieu-do) sinh trên bản sao kho mới: mọi đường ra nguyên dạng phẳng.
import path from 'node:path';
import { readFileSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const B = JSON.parse(readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures', 'bo-cuc-phang.json'), 'utf8'));
const GOC = { loi: '.' }; const TEN = { loi: 'acceptance-gate' };
for (const [d, v] of Object.entries(B.goi_phang)) { GOC[v] = d; TEN[v] = d; }
export function boCuc() { return { phang: true, goc: { ...GOC }, ten: { ...TEN } }; }
export function duong(rel) { return rel; }
export function tep(rel, cay = {}) { return cay.thuMuc ? path.join(cay.thuMuc, rel) : cay.goiGoc ? path.join(cay.goiGoc, rel) : \`\${cay.ref}:\${rel}\`; }
export function gocGoi(cay, vai) { return path.join(cay.thuMuc, GOC[vai] ?? '.'); }
export function tenGoi(cay, vai) { return TEN[vai] ?? vai; }
export function pathspec(rel) { return rel; }
const MK = '.claude-plugin/marketplace.json';
export function boPhan(ds) { const ra = [...ds]; if (!ra.some(x => x === '.' || x === '.claude-plugin' || x === MK)) ra.push(MK); return [...new Set(ra)]; }
export function tenCho() { return 'acceptance-gate-kit'; }
const laChinh = () => { try { return Boolean(process.argv[1]) && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url)); } catch { return false; } };
if (laChinh()) {
  const [lenh, ...du] = process.argv.slice(2); const i = du.findIndex(x => x.startsWith('--')); const ds = i < 0 ? du : du.slice(0, i);
  if (lenh === 'duong' && ds[0]) process.stdout.write(ds[0] + '\\n');
  else if (lenh === 'bo-phan' && ds.length) process.stdout.write(boPhan(ds).join('\\n') + '\\n');
  else if (lenh === 'ten-cho') process.stdout.write(tenCho() + '\\n');
  else { process.stderr.write('dùng: node tests/bo-cuc.mjs duong <rel> | bo-phan <rel>... | ten-cho\\n'); process.exit(2); }
}
`;
}

// ── tiện ích so ──────────────────────────────────────────────────────────────────────────────────────────────────────
const daDem = (kq, k) => kq.dat.get(k) || 0;
// Khoá đích có «<n>»: khớp khoá chạy có một dãy số ở đúng chỗ ấy (chữ số trôi theo cây — khoa-dich.tsv dòng đầu). Khoá
// khác so nguyên chữ.
const reN = khoa => new RegExp(`^${khoa.split('<n>').map(esc).join('\\d+')}$`);
export const khopKhoa = (khoa, k) => (khoa.includes('<n>') ? reN(khoa).test(k) : khoa === k);
export function demKhoa(m, khoa) {
  if (!khoa.includes('<n>')) return m.get(khoa) || 0;
  let n = 0; for (const [k, c] of m) if (khopKhoa(khoa, k)) n += c; return n;
}
// Túi → túi với mọi khoá khớp một khoá đích «<n>» viết về dạng «<n>» (cho phép so túi và miễn khoá).
export function veDangN(m, khoaN) {
  if (!khoaN.length) return m;
  const r = new Map();
  for (const [k, c] of m) { const kk = khoaN.find(x => khopKhoa(x, k)) || k; r.set(kk, (r.get(kk) || 0) + c); }
  return r;
}
const maNgan = k => { const m = k.match(/^\[?([A-Za-z][\w]*-[\w-]+|[A-Z]+\d+\w*)\]?/); if (m) return m[1]; return k.replace(/\.(test|ca)\.mjs$/, '').slice(0, 40); };
// Đường của một kho tạm của thước → «<kho>» (đọc được, ghim được); phần đường sau gốc kho giữ nguyên.
const cheKho = s => String(s).replace(/(?:\/private)?\/(?:var\/folders|tmp)\/\S*?\/giu-khoa-[^/\s]+\/[^/'"\s]+/g, '<kho>');
const RE_CHI_TIET = /Error\b|ENOENT|No such file|Cannot find/;
// Dòng lý do quanh dòng FAIL của một ca (ba dòng sau, rồi tám dòng trước) — ca in tên ở dòng FAIL, lỗi ở dòng kề.
function chiTiet(stdout, dong) {
  const L = String(stdout).split('\n'); const i = L.findIndex(l => l.trim() === dong);
  if (i < 0) return '';
  for (const j of [i + 1, i + 2, i + 3, i - 1, i - 2, i - 3, i - 4, i - 5, i - 6, i - 7, i - 8]) {
    const l = (L[j] || '').trim();
    if (l && !/^(PASS|FAIL):/.test(l) && RE_CHI_TIET.test(l)) return cheKho(l).slice(0, 200);
  }
  return '';
}
function lyDoDo(kq, re) {
  const d = [...kq.dongDo].find(([k]) => re.test(k));
  if (d) { const ct = chiTiet(kq.stdout, d[1]); return `${cheKho(d[1]).replace(/^(PASS|FAIL):\s*/, '').slice(0, 220)}${ct ? ` — ${ct}` : ''}`; }
  return `vắng khỏi túi đạt (thoát ${kq.rc}: ${(dongLoi(cheKho(kq.stderr)) || dongLoi(cheKho(kq.stdout))).slice(0, 160)})`;
}
const reCa = ca => new RegExp(`^\\[?${esc(ca)}\\]?(?=[\\s:]|$)`);
function khoiMarker(chu, ten) {
  const m = chu.match(new RegExp(`^.*<<<${esc(ten)}(?: -->)?\\s*$[\\s\\S]*?^.*${esc(ten)}>>>.*$`, 'm'));
  return m ? m[0] : null;
}
function banGoc(args) {
  if (args.base) return git(GOC, 'rev-parse', '--verify', `${args.base}^{commit}`);
  const mb = gitThu(GOC, 'merge-base', 'HEAD', 'origin/main');
  if (!mb) throw new HaTang('không tính được merge-base HEAD origin/main (truyền --base <ref>)');
  return mb;
}

// ── --cu ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
const TU_PHA = [
  { id: 'CU-DO', bo: 'scripts', tep: 'tests/scripts/bo-cuc.test.mjs', cu: "  ['tri-thuc/commands/ghi.md', 'plugins/knowledge/commands/ingest.md'],\n", moi: '', mat: 'BC tri-thuc/commands/ghi.md · cây phẳng' },
  { id: 'CU-DO-DP', bo: 'dieu-phoi', tep: 'tests/dieu-phoi/ten-may-mot-luat.test.mjs', cu: "test('TM-1 khu-hoi',", moi: "test.skip('TM-1 khu-hoi',", mat: 'TM-1 khu-hoi' },
];
// CTN-AC6-kit đếm evidence-report.md của mọi hồ sơ trong cây — hồ sơ của chính vòng (báo cáo lượt chấm) làm số tăng
// dù ca không đổi (S4 lượt 1 thử lại: 232 ở bản gốc, 233 ở HEAD → «mất khoá» oan).
export const KHOA_N_CU = [
  'CY2 <n> khoa executors: bo doc cua kit va bo doc chuan noi CUNG mot chuyen',
  'CTN-AC6-kit chieu im tren <n> bao cao kit: chi dong bon khoa o vi tri truong doi',
];
async function cheDoCu(ctx, args, out) {
  const head = git(GOC, 'rev-parse', 'HEAD'); const base = banGoc(args);
  // Khoá mang chữ số trôi (khoá đích «<n>» của khoa-dich.tsv, vd RT13 đếm hồ sơ của cây) so ở dạng «<n>» cả hai phía.
  // Thêm KHOA_N_CU: khoá ngoài khoa-dich.tsv mà chữ số đếm nội dung cây (CY2 đếm khoá executors của
  // _acceptance/config.yaml — vòng thêm 10 executor pdbm_* của chính nó, nên 766 → 776 dù ca không đổi).
  const khoaN = [...new Set([...docKhoaDich(KHOA_DICH).map(h => h.khoa).filter(k => k.includes('<n>')), ...KHOA_N_CU])];
  const doi = git(GOC, 'diff', '--name-status', '--no-renames', base, head, '--', 'tests').split('\n').filter(Boolean).map(d => d.split('\t'));
  const cGoc = nhanBan(ctx, base, 'ban-goc'); const cHead = nhanBan(ctx, head, 'head');
  const donVi = new Map(); let soFail = 0; let mat = 0; let dO = 0;
  for (const [st, rel] of doi) {
    const us = donViChoTep(rel, st === 'D' ? [cGoc] : [cHead, cGoc]);
    if (!us.length) { out.push(`  FAIL: CU ${rel} — không tệp kiểm nào chạy nó`); soFail++; continue; }
    if (!(us.length === 1 && us[0].id === rel)) out.push(`  CU ${rel} chạy qua: ${us.map(u => u.id).join(', ')}`);
    for (const u of us) donVi.set(u.id, u);
  }
  const coTep = (cay, u) => u.cmd.filter(x => x.startsWith('tests/') && !x.includes('*')).every(x => existsSync(path.join(cay, x)));
  const kq = await Promise.all([...donVi.values()].map(u => [u, coTep(cGoc, u) ? chay(ctx, cGoc, u) : null, coTep(cHead, u) ? chay(ctx, cHead, u) : null]).map(async ([u, g, h]) => [u, await g, await h]));
  for (const [u, g, h] of kq) {
    // Hết giờ: túi bị cắt giữa chừng, so ra «mất khoá» là sai — nói thẳng là chưa so được.
    const het = [[g, 'bản gốc'], [h, 'HEAD']].filter(([x]) => x && x.rc === 'hết giờ');
    if (het.length) { soFail++; out.push(`  FAIL: CU ${u.id} — hết giờ ở ${het.map(([x, n]) => `${n} sau ${x.giay}s`).join(', ')}: túi khoá không so được`); continue; }
    const datG = veDangN(g ? g.dat : new Map(), khoaN);
    if (!h) { const ks = [...datG.keys()]; mat += ks.length; soFail++; for (const k of ks) out.push(`  FAIL: CU ${u.id} — mất khoá: ${k}`); if (!ks.length) out.push(`  FAIL: CU ${u.id} — tệp bị xoá ở HEAD`); continue; }
    const s = soTui(datG, veDangN(h.dat, khoaN));
    const doKhoa = [...h.do.keys()];
    const doRc = h.rc !== 0 && !doKhoa.length ? [`thoát ${h.rc}: ${(dongLoi(h.stderr) || dongLoi(h.stdout)).slice(0, 160)}`] : [];
    if (!s.thieu.length && !doKhoa.length && !doRc.length) { out.push(`  PASS: CU ${u.id} — ${s.tong}/${s.tong} khoá bản gốc còn ở HEAD, mọi ca xanh`); continue; }
    soFail++; mat += s.thieu.length; dO += doKhoa.length + doRc.length;
    for (const k of s.thieu) out.push(`  FAIL: CU ${u.id} — mất khoá: ${k}`);
    for (const k of [...doKhoa, ...doRc]) out.push(`  FAIL: CU ${u.id} — đỏ: ${k}`);
  }
  if (process.env.GIU_KHOA_BO_TU_PHA !== '1') {
    for (const p of TU_PHA) {
      const f = path.join(cHead, p.tep); const goc0 = existsSync(f) ? readFileSync(f, 'utf8') : null;
      if (goc0 === null || goc0.split(p.cu).length !== 2) { out.push(`  FAIL: ${p.id} nhát phá không áp: ${p.tep}`); soFail++; continue; }
      const u = donViTep(p.bo, p.tep);
      const lanh = await chay(ctx, cHead, u);
      writeFileSync(f, goc0.replace(p.cu, p.moi));
      let pha; try { pha = await chay(ctx, cHead, u, { nhan: 'phá' }); } finally { writeFileSync(f, goc0); }
      const s = soTui(lanh.dat, pha.dat);
      if (daDem(lanh, p.mat) && s.thieu.includes(p.mat)) out.push(`  PASS: ${p.id} ${p.tep} — xoá ca «${p.mat}» khỏi bản sao HEAD → phép so đỏ: mất khoá ${s.thieu.length}`);
      else { out.push(`  FAIL: ${p.id} phép so không đỏ — ${p.tep} (${daDem(lanh, p.mat) ? 'bản phá vẫn giữ khoá' : 'bản lành không có khoá'} «${p.mat}»)`); soFail++; }
    }
  }
  // CU-LT94 — LT-94 dưới đồng hồ ghim 2026-10-20 (ngày của mốc «Tới» trong fixture) phải đỏ «trang chứa ngày chạy».
  {
    const pin = path.join(tam(ctx, 'dong-ho'), 'dong-ho-2026-10-20.mjs');
    writeFileSync(pin, "const T = new Date('2026-10-20T09:00:00').getTime(); const D = Date; globalThis.Date = class extends D { constructor(...a) { super(...(a.length ? a : [T])); } static now() { return T; } };\n");
    const lt = 'tests/scripts/lo-trinh.test.mjs';
    const ghim = await chay(ctx, cHead, { id: lt, bo: 'scripts', loai: 'bash', cmd: ['node', '--import', pathToFileURL(pin).href, lt] }, { nhan: 'ghim 2026-10-20', them: { LT_CASES: 'LT-94' } });
    const that = await chay(ctx, cHead, { id: lt, bo: 'scripts', loai: 'bash', cmd: ['node', lt] }, { nhan: 'LT-94', them: { LT_CASES: 'LT-94' } });
    const caDo = (ghim.stdout.split('\n').find(l => /FAIL: LT-94 — /.test(l)) || '').trim();
    if (!(that.rc === 0 && daDem(that, 'LT-94'))) { out.push(`  FAIL: CU-LT94 — đồng hồ thật đỏ: ${lyDoDo(that, /^LT-94$/)}`); soFail++; dO++; }
    else if (!(ghim.rc !== 0 && caDo.includes('trang chứa ngày chạy 2026-10-20'))) { out.push(`  FAIL: CU-LT94 chốt ngày chạy đã chết — dưới đồng hồ ghim: thoát ${ghim.rc}, ${caDo || 'không dòng FAIL: LT-94'}`); soFail++; dO++; }
    else out.push('  PASS: CU-LT94 LT-94 chạy dưới đồng hồ ghim ở 2026-10-20 → đỏ «trang chứa ngày chạy» (đối chứng dương: đồng hồ thật xanh)');
  }
  out.push(`giu-khoa --cu: ${donVi.size} tệp, ${mat} khoá mất, ${dO} ca đỏ`);
  return soFail;
}

// ── --moi ────────────────────────────────────────────────────────────────────────────────────────────────────────────
const KHOI_KHAI = [
  ['skills/acceptance/references/human-facing-language.md', ['GATE-INVITE-SITES', 'GATE-ONESHOT-SITES', 'GATE-END-TURN-SITES', 'COMMAND-NAMES']],
  ['skills/design-pass/SKILL.md', ['REACTION-DEFAULT-SITES']],
];
function phuCum(cum, ctx, base, head, cHead, out) {
  if (cum === 'K2') {
    const doi = [];
    for (const [tep, ten] of KHOI_KHAI) {
      const a = gitThu(GOC, 'show', `${base}:${tep}`); const b = gitThu(GOC, 'show', `${head}:${tep}`);
      for (const k of ten) { const x = a && khoiMarker(a, k); const y = b && khoiMarker(b, k); if (!x || !y || x !== y) doi.push(`${tep} (${k}${!x || !y ? ' vắng' : ''})`); }
    }
    if (doi.length) { for (const d of doi) out.push(`  FAIL: MOI K2 khối khai đổi: ${d}`); return 1; }
    out.push('  PASS: MOI K2 khối khai chỗ giữ nguyên từng byte (human-facing-language.md, design-pass/SKILL.md)'); return 0;
  }
  if (cum === 'K3') {
    const ho = [...new Set(git(GOC, 'diff', '--name-only', base, head, '--', '_acceptance').split('\n').filter(Boolean).map(t => t.split('/')).filter(p => p.length >= 3).map(p => p[1]))].filter(h => h !== 'phan-du-bo-cuc-moi');
    if (ho.length) { for (const h of ho) out.push(`  FAIL: K3 chạm hồ sơ đã ký: ${h}`); return 1; }
    out.push('  PASS: K3 hồ sơ đã ký không đổi byte — diff bản gốc..HEAD dưới _acceptance/ chỉ chạm phan-du-bo-cuc-moi'); return 0;
  }
  return 0;
}
// SP: dòng «SP mã nguồn hết chữ…», ma trận 8 ô và SP-NL sống ở tests/scripts/bang-ten-lo-trinh.test.mjs (Task 4) — chạy ở
// bố cục cũ (tệp tự dựng kho mới), chuyển nguyên các dòng «PASS:/FAIL: SP…».
async function phuSP(ctx, cHead, out) {
  const rel = 'tests/scripts/bang-ten-lo-trinh.test.mjs';
  if (!existsSync(path.join(cHead, rel))) { out.push(`  FAIL: SP ${rel} chưa có ở HEAD`); return 1; }
  const r = await chay(ctx, cHead, donViTep('scripts', rel));
  for (const l of r.stdout.split('\n')) if (/^\s*(PASS|FAIL): SP/.test(l)) out.push(`  ${l.trim()}`);
  if (r.rc !== 0) { out.push(`  FAIL: SP ${rel} — thoát ${r.rc}`); return 1; }
  return 0;
}
// K4-SC chốt chống rỗng (AC-7; kế hoạch Task 8 bước 3): bốn ca xanh giả loại (ii) dùng pathspec đã dịch cho git diff/archive
// một commit lịch sử. Mỗi ca một bản sao HEAD (bố cục cũ): đổi đúng đối số pathspec (`cu` → `moi`, phải khớp đúng một lần)
// thành đường không có ở commit → ca rời túi đạt và lỗi mang câu chốt của bộ dịch. Đối chứng dương: cùng ca xanh ở bản sao
// HEAD nguyên vẹn (cHead).
export const CHONG_RONG = [
  { ca: 'ho-so-da-ky-giu-tuoi.test.mjs', tep: 'ho-so-da-ky-giu-tuoi.test.mjs', sua: 'tests/scripts/giu-tuoi-fixture.mjs', cu: 'map(x => pathspec(x, o))', moi: 'map(x => pathspec(`khong-co/${x}`, o))' },
  { ca: 'JR11a', tep: 'core-untouched.test.mjs', sua: 'tests/scripts/core-untouched.test.mjs', cu: 'map(ref => pathspec(d, { kho: ROOT, ref }))', moi: 'map(ref => pathspec(`khong-co/${d}`, { kho: ROOT, ref }))' },
  { ca: 'CC-02 khoi-giu-byte', tep: 'can-cu-s1.ca.mjs', sua: 'tests/scripts/can-cu-s1.ca.mjs', cu: 'tepO(t.goc, pathspec(SKILL_REL, o(t.goc)))', moi: 'tepO(t.goc, pathspec(`khong-co/${SKILL_REL}`, o(t.goc)))' },
  { ca: 'KK-4 quet-lop', tep: 'can-cu-s1.ca.mjs', sua: 'tests/scripts/can-cu-s1.ca.mjs', cu: "pathspec('feature-loop', { kho: ROOT, ref: 'HEAD' })", moi: "pathspec('khong-co/feature-loop', { kho: ROOT, ref: 'HEAD' })" },
];
export const CAU_RONG = 'bo-cuc: pathspec rỗng ở';
const xanhCa = (kq, re) => [...kq.dat.keys()].some(k => re.test(k)) && ![...kq.do.keys()].some(k => re.test(k));
async function phuChongRong(ctx, head, cHead, out) {
  const ket = await Promise.all(CHONG_RONG.map(async (c, i) => {
    const u = donViTep('scripts', `tests/scripts/${c.tep}`); const re = reCa(c.ca);
    const d = nhanBan(ctx, head, `rong-${i}`); const f = path.join(d, c.sua);
    const chu = readFileSync(f, 'utf8'); const n = chu.split(c.cu).length - 1;
    if (n !== 1) throw new HaTang(`chốt chống rỗng ${c.ca}: mẫu tiêm khớp ${n} lần ở ${c.sua} (chờ đúng 1) — «${c.cu}»`);
    writeFileSync(f, chu.replace(c.cu, c.moi)); commitHet(d, `chống rỗng: ${c.ca}`);
    const [lanh, pha] = await Promise.all([chay(ctx, cHead, u), chay(ctx, d, u, { nhan: 'rỗng' })]);
    return { c, re, lanh, pha };
  }));
  const hong = [];
  for (const { c, re, lanh, pha } of ket) {
    if (!xanhCa(lanh, re)) hong.push(`đối chứng dương: ${c.ca} chưa xanh ở HEAD nguyên vẹn (${lyDoDo(lanh, re)})`);
    else if (xanhCa(pha, re)) hong.push(`xanh giả còn: ${c.ca}`);
    else if (!cheKho(`${pha.stdout}\n${pha.stderr}`).includes(CAU_RONG)) hong.push(`${c.ca} đỏ sai thông điệp (thiếu «${CAU_RONG}»): ${lyDoDo(pha, re)}`);
  }
  if (hong.length) { for (const h of hong) out.push(`  FAIL: K4-SC ${h}`); return 1; }
  out.push(`  PASS: K4-SC chốt chống rỗng — ${CHONG_RONG.length}/${CHONG_RONG.length} ca xanh giả (ii) đỏ khi pathspec rỗng (${CHONG_RONG.map(c => maNgan(c.ca)).join(', ')}; «${CAU_RONG} …»; đối chứng dương: xanh ở HEAD nguyên vẹn)`);
  return 0;
}
async function cheDoMoi(ctx, args, out) {
  const cums = args.cum ? [args.cum] : VONG;
  const bts = args.bienThe === 'ca-ba' ? BIEN_THE : [args.bienThe];
  // Biến thể chấm in PASS/FAIL và tính vào mã thoát; biến thể khác in «TIN:» (số để đọc, không chấm).
  const nhanDong = (bt, dat) => (bt === CHAM ? (dat ? 'PASS' : 'FAIL') : 'TIN');
  const cham = (bt, n) => (bt === CHAM ? n : 0);
  out.push(`  ngoài vòng: ${NGOAI_VONG.join(', ')}`);
  const head = git(GOC, 'rev-parse', 'HEAD'); const base = banGoc(args);
  const hang = docKhoaDich(KHOA_DICH);
  const khoaN = [...new Set(hang.map(h => h.khoa).filter(k => k.includes('<n>')))];
  const cHead = nhanBan(ctx, head, 'cu');
  const kho = Object.fromEntries(bts.map(bt => [bt, khoMoi(ctx, head, `moi-${bt}`, tuyChon(bt, head))]));
  const dich = hang.filter(h => cums.includes(h.cum)).map(h => ({ ...h, dv: donViCua(h.bo, h.tepKiem, h.khoa, cHead) }));
  const donVi = new Map(); for (const h of dich) for (const u of h.dv) donVi.set(u.id, u);
  // Tệp còn đi bước 6 ở biến thể chấm (không khai ở GUI-B2-TU-DUNG): túi so với kho mới dựng từ BẢN GỐC (bước 1–3, luật đổi
  // tên, luật chung bước 6 — cũng không bảng vá), vì ca cần bảng vá B2 vắng ở cả hai phía; chỉ ca vòng làm mất mới đỏ.
  let soFail0 = 0;
  const tdHead = bts.includes(CHAM) ? new Set(tuDung(head)) : null;
  if (tdHead) {
    const sua = git(GOC, 'diff', '--name-only', '--diff-filter=d', base, head, '--', 'tests').split('\n').filter(Boolean);
    const lech = lechLuatTuDung(sua, [...tdHead]);
    for (const l of lech) out.push(`  FAIL: MOI luật danh sách tự đúng đường — ${l}`);
    if (lech.length) soFail0 += 1;
    else out.push(`  PASS: MOI luật danh sách tự đúng đường — ${sua.length} tệp vòng sửa dưới tests/ = ${tdHead.size} khai tự đúng đường + ${VAN_BUOC6.length} còn đi bước 6`);
  }
  const diBuoc6 = u => { const f = u.id.split(' ')[0]; return Boolean(tdHead) && !f.includes('*') && !tdHead.has(f); };
  const dv6 = [...donVi.values()].filter(diBuoc6);
  const khoGoc = dv6.length ? khoMoi(ctx, base, 'moi-goc', { ten: true, buoc6: true }) : null;
  const cays = [cHead, ...bts.map(bt => kho[bt])];
  const kq = new Map(await Promise.all([
    ...cays.flatMap(c => [...donVi.values()].map(async u => [`${c}\0${u.id}`, await chay(ctx, c, u)])),
    ...dv6.map(async u => [`${khoGoc}\0${u.id}`, await chay(ctx, khoGoc, u)]),
  ]));
  const lay = (c, u) => kq.get(`${c}\0${u.id}`);
  let soFail = soFail0; const tongThieu = Object.fromEntries(bts.map(bt => [bt, 0]));
  for (const cum of cums) {
    const ds = dich.filter(h => h.cum === cum);
    const can = new Map(); for (const h of ds) { const k = `${h.dv.map(u => u.id).join('|')}\0${h.khoa}`; can.set(k, { h, n: (can.get(k)?.n || 0) + 1 }); }
    for (const bt of bts) {
      const thieu = []; const dO = [];
      for (const { h, n } of can.values()) {
        if (!h.dv.length) { for (let i = 0; i < n; i++) thieu.push(`${h.bo}: ${h.khoa} — không tìm được tệp chạy`); continue; }
        const t = gop(...h.dv.map(u => lay(kho[bt], u)));
        const co = demKhoa(t.dat, h.khoa);
        for (let i = co; i < n; i++) (demKhoa(t.do, h.khoa) > i - co ? dO : thieu).push(`${h.bo}: ${h.khoa}`);
      }
      const ma = [...new Set(ds.map(h => maNgan(h.khoa)))].join(', ');
      const xanh = ds.length - thieu.length - dO.length;
      if (!thieu.length && !dO.length) out.push(`  ${nhanDong(bt, true)}: MOI ${cum} — ${ds.length}/${ds.length} khoá đích có mặt và xanh ở kho mới (biến thể ${bt}): ${ma}`);
      else {
        const nd = nhanDong(bt, false);
        soFail += cham(bt, 1); tongThieu[bt] += thieu.length + dO.length;
        out.push(`  ${nd}: MOI ${cum} — ${xanh}/${ds.length} khoá đích có mặt và xanh ở kho mới (biến thể ${bt}; thiếu ${thieu.length}, đỏ ${dO.length})`);
        for (const k of thieu) out.push(`  ${nd}: MOI ${cum} — thiếu: ${k} (biến thể ${bt})`);
        for (const k of dO) out.push(`  ${nd}: MOI ${cum} — đỏ: ${k} (biến thể ${bt})`);
      }
    }
    soFail += phuCum(cum, ctx, base, head, cHead, out);
    if (cum === 'SP') soFail += await phuSP(ctx, cHead, out);
    if (cum === 'K4-SC') soFail += await phuChongRong(ctx, head, cHead, out);
  }
  // túi mỗi tệp ⊇ bố cục cũ — khoá của khoa-dich.tsv miễn (đo ở dòng MOI <cụm>, hoặc cụm đã dời).
  const doi = doiKhoa(BX._bangTen, BX);
  const tuiDu = Object.fromEntries(bts.map(bt => [bt, 0])); let tuiTong = 0;
  for (const u of donVi.values()) {
    const mien = new Map(); for (const h of hang) if (h.bo === u.bo) mien.set(h.khoa, (mien.get(h.khoa) || 0) + 1);
    tuiTong++;
    for (const bt of bts) {
      const moi = lay(kho[bt], u); const moiDat = veDangN(moi.dat, khoaN);
      const cuDu = veDangN(tuiCu(lay(cHead, u).dat, moi.dat, doi), khoaN);
      const b6 = bt === CHAM && diBuoc6(u);
      const cu = b6 ? locTheoGoc(cuDu, veDangN(lay(khoGoc, u).dat, khoaN)) : cuDu;
      const soGoc = b6 ? [...cuDu.values()].reduce((a, b) => a + b, 0) - [...cu.values()].reduce((a, b) => a + b, 0) : 0;
      const ve = b6 ? `khoá bố cục cũ mà kho mới dựng từ bản gốc cũng có, còn ở kho mới (tệp còn đi bước 6 — ${soGoc} khoá vắng cả ở bản gốc kho mới: cần bảng vá B2; ` : 'khoá bố cục cũ còn ở kho mới (';
      const s = soTui(cu, moiDat, mien);
      const soMien = [...cu].reduce((n, [k, c]) => n + Math.min(c, mien.get(k) || 0), 0);
      // Chốt tập rỗng: tệp còn đi bước 6 mà sau khi lọc theo bản gốc kho mới không còn ca nào để so (trong khi bố cục cũ
      // có ca ngoài phần miễn) — dòng PASS ấy đúng với mọi HEAD, nên nó là FAIL có tên, không phải PASS 0/0.
      if (b6 && s.tong - soMien === 0 && soGoc > 0) { soFail += cham(bt, 1); out.push(`  ${nhanDong(bt, false)}: MOI túi ${u.id} — so rỗng: ${soGoc} khoá bố cục cũ đều vắng ở bản gốc kho mới, không ca nào để so (tệp còn đi bước 6; khai tự đúng đường ở gui-b2.md nếu tệp đã qua bộ dịch; biến thể ${bt})`); continue; }
      if (!s.thieu.length) { tuiDu[bt]++; out.push(`  ${nhanDong(bt, true)}: MOI túi ${u.id} — ${s.tong - soMien}/${s.tong - soMien} ${ve}biến thể ${bt}; miễn ${soMien} khoá của khoa-dich.tsv)`); continue; }
      soFail += cham(bt, 1);
      out.push(`  ${nhanDong(bt, false)}: MOI túi ${u.id} — ${s.tong - soMien - s.thieu.length}/${s.tong - soMien} ${ve}biến thể ${bt})`);
      for (const k of s.thieu) out.push(`  ${nhanDong(bt, false)}: MOI túi ${u.id} — thiếu ở kho mới${b6 ? ' (bản gốc kho mới có)' : ''}: ${k} (biến thể ${bt})`);
    }
  }
  for (const bt of bts.filter(b => b !== CHAM)) out.push(`  TIN: giu-khoa --moi (biến thể ${bt}): thiếu ${tongThieu[bt]} ở ${cums.length} cụm; túi khoá ${tuiDu[bt]}/${tuiTong} tệp ⊇ bố cục cũ`);
  if (bts.includes(CHAM)) out.push(`giu-khoa --moi: thiếu ${tongThieu[CHAM]} ở ${cums.length} cụm; túi khoá ${tuiDu[CHAM]}/${tuiTong} tệp ⊇ bố cục cũ`);
  return soFail;
}

// ── --chieu-do + GUI-B2 ──────────────────────────────────────────────────────────────────────────────────────────────
// Ca canh mỗi cụm; `ghim` = các mảnh chữ (mọi mảnh) phải có trong thông điệp đỏ dưới bản đồng nhất — chép từ lượt
// `--chieu-do` 15/11 (Task 10), phần ổn định của câu (đường kho tạm che thành «<kho>», không sha). Mỗi ca canh nằm ở
// một tệp tự đúng đường (gui-b2.md) hoặc gọi CLI bộ dịch (P161), nên bản đồng nhất trỏ đường phẳng không có ở kho mới.
// SP: CK-4-lib (kế hoạch) đọc tên gói 'road-map' và đường phẳng viết cứng, không qua bộ dịch (bảng vá B2 sửa chúng) — không
// đỏ theo bộ dịch nên không làm ca canh; TH-10-ong (cùng cụm SP, lệnh chấm bản nhân qua bộ dịch) thay.
export const CA_CANH = [
  { cum: 'K2', bo: 'scripts', tep: 'moi-cong-khong-qua-nut.test.mjs', ca: 'MQ-1', ghim: ['vắng khỏi túi đạt', "Cannot find module '<kho>/lib/ho-goi.cjs'"] },
  { cum: 'K3', bo: 'plugins', tep: 'ra-co-ten.test.mjs', ca: 'RT13', ghim: ['vắng khỏi túi đạt', "ERR_MODULE_NOT_FOUND", "<kho>/scripts/khong-can-nguoi.mjs"] },
  { cum: 'SP', bo: 'scripts', tep: 'tin-hieu.test.mjs', ca: 'TH-10-ong', ghim: ['vắng khỏi túi đạt', "Cannot find module '<kho>/lib/workspace-record.cjs'"] },
  { cum: 'K4-SC', bo: 'scripts', tep: 'core-untouched.test.mjs', ca: 'JR11a', ghim: ['JR11a lib/** + hooks/** KHÔNG đổi TRONG PHẠM VI', "ENOENT: no such file or directory, scandir '<kho>/lib'"] },
  // P161: dòng lỗi (Python FileNotFoundError '<kho>/lib') ra stderr của heredoc, không kề dòng FAIL ở stdout — ghim dòng FAIL.
  { cum: 'K4-PL', bo: 'plugins', tep: '(đầu)', ca: 'P161', ghim: ['P161 strip-md giu duong dan + ma tran toan phan'], them: { ONLY_BLOCK: 'P161' } },
];
const thieuGhim = (c, msg) => [].concat(c.ghim || []).filter(g => !msg.includes(g));
// Mục vá thừa theo biến thể chấm (iii): mục trên một tệp tự đúng đường thừa vì bước 6 bỏ qua trọn tệp ấy (không luật
// đường, không bảng vá); mục khác thừa khi sau bước 1–3 + luật chung bước 6 chuỗi `cu` không còn khớp đúng `so_lan` lần.
const LY_TU_DUNG = 'tệp tự đúng đường';
function vaThua(ctx, head) {
  const boQua = tuDung(head);
  const d = khoMoi(ctx, head, 'gui-b2', { ten: false, buoc6: true, boQua });
  const bq = new Set(boQua);
  const va = JSON.parse(readFileSync(VA_B2, 'utf8'));
  const nd = new Map(); const thua = [];
  for (const v of va) {
    if (bq.has(v.tep)) { thua.push({ tep: v.tep, cu: v.cu, so_lan: v.so_lan, ly_do: LY_TU_DUNG }); continue; }
    const p = path.join(d, v.tep);
    const t = nd.get(v.tep) ?? (existsSync(p) ? readFileSync(p, 'utf8') : '');
    const c = t.split(v.cu).length - 1;
    if (c !== v.so_lan) { thua.push({ tep: v.tep, cu: v.cu, so_lan: v.so_lan }); continue; }
    nd.set(v.tep, t.split(v.cu).join(v.moi));
  }
  return { thua, tong: va.length };
}
const MO = '<!-- <<<GUI-B2-VA-THUA -->'; const DONG_KHOI = '<!-- GUI-B2-VA-THUA>>> -->';
// Bên GHI và bên ĐỌC của khối máy ở một chỗ (tệp kiểm đo round-trip): mỗi mục một dòng JSON {tep, cu, so_lan[, ly_do]}.
export function khoiGuiB2(thua, tong) {
  const td = thua.filter(v => v.ly_do === LY_TU_DUNG).length;
  return [MO, `máy ghi: ${thua.length}/${tong} mục của va-bo-kiem-b2.json thừa — ${td} trên tệp tự đúng đường (bước 6 bỏ qua), ${thua.length - td} không còn khớp sau bước 6 (rút từ HEAD lúc ghi)`, '```jsonl', ...thua.map(v => JSON.stringify({ tep: v.tep, cu: v.cu, so_lan: v.so_lan, ...(v.ly_do ? { ly_do: v.ly_do } : {}) })), '```', DONG_KHOI].join('\n');
}
export function docKhoiGuiB2(t) {
  const i = t.indexOf(MO); const j = t.indexOf(DONG_KHOI);
  if (i < 0 || j < i) return null;
  return t.slice(i, j).split('\n').filter(l => l.startsWith('{')).map(l => JSON.parse(l));
}
const docGuiB2 = () => (existsSync(GUI_B2) ? docKhoiGuiB2(readFileSync(GUI_B2, 'utf8')) : null);
const khoaVa = v => `${v.tep}\0${v.cu}`;
const tenVa = v => `${v.tep} · ${v.cu.split('\n')[0].trim().slice(0, 100)}`;
// Hai danh sách mục vá thừa (máy rút, tệp ghi) → các dòng lệch; rỗng = khớp.
export function lechGuiB2(may, ghi) {
  const A = new Map(may.map(v => [khoaVa(v), v])); const B = new Map(ghi.map(v => [khoaVa(v), v]));
  return [...[...A].filter(([k]) => !B.has(k)).map(([, v]) => `máy rút mà tệp không có: ${tenVa(v)}`), ...[...B].filter(([k]) => !A.has(k)).map(([, v]) => `tệp có mà máy không rút: ${tenVa(v)}`)];
}
async function cheDoChieuDo(ctx, args, out) {
  const head = git(GOC, 'rev-parse', 'HEAD');
  const cHead = nhanBan(ctx, head, 'cu');
  const d = khoMoi(ctx, head, `moi-${CHAM}`, tuyChon(CHAM, head));
  const dich = path.join(d, 'tests', 'bo-cuc.mjs');
  if (!existsSync(dich)) throw new HaTang('kho mới không có tests/bo-cuc.mjs để thay');
  let soFail = 0;
  const that = await import(pathToFileURL(dich).href);
  const canh = CA_CANH.map(c => ({ ...c, dv: donViCua(c.bo, c.tep, c.ca, cHead).map(u => ({ ...u, them: c.them })) }));
  const lanh = await Promise.all(canh.map(async c => gop(...await Promise.all(c.dv.map(u => chay(ctx, d, u, { nhan: 'thật' }))))));
  writeFileSync(dich, banDongNhat()); commitHet(d, 'chiều đỏ: bộ dịch đồng nhất');
  const gia = await import(`${pathToFileURL(dich).href}?dong-nhat`);
  const thieuExport = Object.keys(that).filter(k => !(k in gia));
  if (thieuExport.length) { out.push(`  FAIL: DO bản đồng nhất thiếu export: ${thieuExport.join(', ')}`); soFail++; }
  const pha = await Promise.all(canh.map(async c => gop(...await Promise.all(c.dv.map(u => chay(ctx, d, u, { nhan: 'đồng nhất' }))))));
  canh.forEach((c, i) => {
    const re = reCa(c.ca); const L = lanh[i]; const P = pha[i];
    const xanhL = [...L.dat.keys()].some(k => re.test(k)) && ![...L.do.keys()].some(k => re.test(k));
    const xanhP = [...P.dat.keys()].some(k => re.test(k)) && ![...P.do.keys()].some(k => re.test(k));
    const msg = lyDoDo(P, re);
    if (!xanhL) { out.push(`  FAIL: DO ${c.cum} — đối chứng dương: ${c.ca} chưa xanh với bộ dịch thật ở kho mới (${lyDoDo(L, re)})`); soFail++; }
    else if (xanhP) { out.push(`  FAIL: DO ${c.cum} chiều đỏ không đỏ — ${c.ca} vẫn xanh với bộ dịch đồng nhất`); soFail++; }
    else if (!c.ghim) { out.push(`  FAIL: DO ${c.cum} — ${c.ca} đỏ nhưng chưa ghim thông điệp: ${msg}`); soFail++; }
    else if (thieuGhim(c, msg).length) { out.push(`  FAIL: DO ${c.cum} — ${c.ca} đỏ sai thông điệp (thiếu «${thieuGhim(c, msg).join('» · «')}»): ${msg}`); soFail++; }
    else out.push(`  PASS: DO ${c.cum} — ${c.ca} đỏ: ${msg} (đối chứng dương: xanh với bộ dịch thật)`);
  });
  soFail += soGuiB2(ctx, head, out);
  out.push(`giu-khoa --chieu-do: ${CA_CANH.length} cụm, ${soFail} dòng FAIL`);
  return soFail;
}
function soGuiB2(ctx, head, out) {
  const { thua } = vaThua(ctx, head);
  const ghi = docGuiB2();
  if (!ghi) { out.push(`  FAIL: GUI-B2 lệch: ${path.relative(GOC, GUI_B2)} thiếu khối ${MO}`); return 1; }
  const lech = lechGuiB2(thua, ghi);
  if (lech.length) { for (const l of lech) out.push(`  FAIL: GUI-B2 lệch: ${l}`); return 1; }
  out.push(`  PASS: GUI-B2 ${thua.length} mục vá thừa khớp gui-b2.md`); return 0;
}
function ghiGuiB2(ctx, out) {
  const head = git(GOC, 'rev-parse', 'HEAD');
  const { thua, tong } = vaThua(ctx, head);
  if (!existsSync(GUI_B2)) throw new HaTang(`${path.relative(GOC, GUI_B2)} chưa có`);
  let t = readFileSync(GUI_B2, 'utf8');
  if (!t.includes(MO) || !t.includes(DONG_KHOI)) throw new HaTang(`${path.relative(GOC, GUI_B2)} thiếu khối ${MO}`);
  const khoi = khoiGuiB2(thua, tong);
  t = t.slice(0, t.indexOf(MO)) + khoi + t.slice(t.indexOf(DONG_KHOI) + DONG_KHOI.length);
  writeFileSync(GUI_B2, t);
  out.push(`giu-khoa --ghi-gui-b2: ${thua.length} mục vá thừa ghi vào ${path.relative(GOC, GUI_B2)}`);
  return 0;
}

// ── chính ────────────────────────────────────────────────────────────────────────────────────────────────────────────
function docDoiSo(argv) {
  const a = { cheDo: null, cum: null, bienThe: CHAM, base: null };
  for (let i = 0; i < argv.length; i++) {
    const x = argv[i];
    if (['--cu', '--moi', '--chieu-do', '--ghi-gui-b2'].includes(x)) { if (a.cheDo) return null; a.cheDo = x.slice(2); }
    else if (x === '--cum') a.cum = argv[++i];
    else if (x === '--bien-the') a.bienThe = argv[++i];
    else if (x === '--base') a.base = argv[++i];
    else return null;
  }
  if (!a.cheDo || (a.cum && a.cheDo !== 'moi') || ![null, ...VONG].includes(a.cum) || ![...BIEN_THE, 'ca-ba'].includes(a.bienThe)) return null;
  return a;
}
const laChinh = () => { try { return Boolean(process.argv[1]) && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url)); } catch { return false; } };
if (laChinh()) {
  const a = docDoiSo(process.argv.slice(2));
  if (!a) {
    const cum = process.argv.includes('--cum') ? process.argv[process.argv.indexOf('--cum') + 1] : null;
    if (NGOAI_VONG.includes(cum)) process.stderr.write(`giu-khoa: cụm ${cum} ngoài vòng (dời sang vòng kế) — ngoài vòng: ${NGOAI_VONG.join(', ')}\n`);
    process.stderr.write(`dùng: node giu-khoa.mjs --cu [--base <ref>] | --moi [--cum ${VONG.join('|')}] [--bien-the i|ii|iii|ca-ba] [--base <ref>] | --chieu-do | --ghi-gui-b2\n`);
    process.exit(2);
  }
  const ctx = moCtx(); const out = []; const t0 = Date.now();
  for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { for (const c of CON) giet(c); rmSync(ctx.tmp, { recursive: true, force: true }); process.exit(130); });
  let ma;
  try {
    const f = { cu: cheDoCu, moi: cheDoMoi, 'chieu-do': cheDoChieuDo, 'ghi-gui-b2': async (c, _a, o) => ghiGuiB2(c, o) }[a.cheDo];
    ma = (await f(ctx, a, out)) ? 1 : 0;
    process.stdout.write(out.join('\n') + '\n');
  } catch (e) {
    process.stdout.write(`HẠ TẦNG: ${e instanceof HaTang ? '' : 'lỗi thước — '}${String(e.message || e).split('\n')[0]}\n`);
    ma = 3;
  } finally { rmSync(ctx.tmp, { recursive: true, force: true }); }
  process.stderr.write(`giu-khoa --${a.cheDo}: ${Math.round((Date.now() - t0) / 1000)}s\n`);
  process.exitCode = ma;
}
