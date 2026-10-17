#!/usr/bin/env node
// giu-tuoi.mjs — lệnh GIỮ TƯƠI theo khoảng gộp (hồ sơ ho-so-da-ky-giu-tuoi, hàng K-A, AC-1/3/4/5/10).
//
// Vì sao tồn tại: một PR gộp vào nhánh chính làm hoá cũ hồ sơ đã ký của người khác; cái đỏ lộ ra ở vòng KẾ
// TIẾP tình cờ chạm vào, không tới PR gây ra (onehub 17/10: 8 hồ sơ cũ sau hai gộp, ≈4 giờ máy ghim lại).
// Lệnh này, cho một khoảng gộp <từ>..<đến>, chọn hồ sơ đã ký hoá cũ VÌ khoảng ấy, ghim lại trên đỉnh, và quy
// mỗi cái đỏ về PR gây ra — hoặc nói rõ vì sao không quy được.
//
//   node giu-tuoi.mjs --root <kho> --tu <ref> [--den <ref>=HEAD] [--write] [--json] [--ag-root <path>]
//
// Năm bước (thiết kế §1–§5, docs/superpowers/specs/2026-10-17-ho-so-da-ky-giu-tuoi-design.md):
//   1. CHỌN bằng hai lượt của CHÍNH lưới trước-gộp (pre-merge-check.sh của bộ máy, không --base): trên đỉnh và
//      trên một cây tạm tách ở <từ>. Chọn = cũ-ở-đỉnh − cũ-ở-từ (hồ sơ chưa có / chưa ký ở <từ> tính tươi);
//      cũ ở cả hai = TỒN ĐỌNG: chỉ đếm và in tên, không ghim. Không viết lại luật «cũ» bằng mã thứ hai.
//   2. GHIM bằng repin-lane.mjs --tung-ho-so (kèm --write khi lệnh có --write): suite chung một lần, hồ sơ nào
//      mọi eval đạt thì được ghim, hồ sơ có eval đỏ nhận `repin-do`. Tập chọn rỗng → không gọi lượt ghim.
//   3. QUY VỀ PR cho hồ sơ đỏ: lớp hạ tầng (mã 126/127, ≥ 128 hay bị ngắt, mã hạ tầng của nhan-canh-gay, hoặc
//      chạy lại lệnh đỏ trên đỉnh thì xanh) → `ha-tang`, không gọi tên PR nào; chạy lại ĐÚNG lệnh đỏ trong cây
//      tạm ở <từ> (nối thư mục phụ thuộc git bỏ qua của kho bằng symlink): lỗi môi trường ở <từ> (mã 126/127,
//      thiếu mô-đun/lệnh/tệp mà đỉnh không thiếu) → `ha-tang` «không chạy lại được ở đầu khoảng»; đỏ cùng băm
//      thông điệp → `do-san-truoc-khoang`; còn lại → ứng viên = commit cha-đầu trong
//      <từ>..<đến> có tệp đổi giao với `paths` của eval đỏ (eval không khai paths → mọi commit có tệp ngoài
//      _acceptance/, kèm ghi chú). Một ứng viên → `do-khoang`; nhiều → `nhieu-pr`. Không chia đôi.
//   4. --write → đúng MỘT dòng `kind: "nen-do"` mỗi hồ sơ đỏ vào run-log.jsonl của nó — bên VIẾT của bằng chứng
//      mà nhãn «đỏ sẵn trên nền» trích (luật đọc: lib/do-san-tren-nen.cjs kiemDoSan). `lenh_do` + `dinh_nghia`
//      CHÉP từ dòng `repin-do` của chính lượt ghim — băm thông điệp là của làn, không tính lại ở đây.
//   5. Bảng tiếng sản phẩm (hoặc --json). Lệnh KHÔNG commit, KHÔNG đổi nhánh; cây tạm được dọn ở mọi lối thoát.
//
// exit 0 = xong (kể cả có hồ sơ đỏ) · 1 = suite chung đỏ (hay lượt ghim đỏ vì lý do chung) · 2 = cây bẩn ngoài
// _acceptance/, ref sai, thiếu nguồn bộ máy · 3 = usage.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { rutTenCa } from './lib/chay-lai.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const LANE = path.join(HERE, 'repin-lane.mjs');
const RESOLVER = path.join(HERE, 'resolve-plugin.mjs');
const KNOWN = new Set(['root', 'tu', 'den', 'write', 'json', 'ag-root']);
const BOOL = new Set(['write', 'json']);
const tBatDau = Date.now();

function usage(msg) { console.error(`giu-tuoi: ${msg}\nusage: giu-tuoi.mjs --root <kho> --tu <ref> [--den <ref>] [--write] [--json] [--ag-root <path>]`); process.exit(3); }
function die(msg) { console.error(`giu-tuoi: ${msg}`); process.exit(2); }
const log = (s) => process.stderr.write(`[giu-tuoi] ${s}\n`);

const flags = {};
{
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i += 1) {
    const tok = argv[i];
    if (!tok.startsWith('--')) usage(`tham số lạ (không phải cờ): ${tok}`);
    const name = tok.slice(2);
    if (!KNOWN.has(name)) usage(`cờ không nhận diện được: ${tok}`);
    if (BOOL.has(name)) { flags[name] = true; continue; }
    if (argv[i + 1] === undefined || argv[i + 1].startsWith('--')) usage(`cờ ${tok} thiếu giá trị`);
    flags[name] = argv[i + 1];
    i += 1;
  }
}
if (!flags.root || !flags.tu) usage('thiếu --root hoặc --tu');
const root = (() => { try { return fs.realpathSync(flags.root); } catch { return die(`--root không tồn tại: ${flags.root}`); } })();

// ── bộ máy: --ag-root · cây kit chứa chính script này (tự host) · plugin acceptance-gate đã cài ─────────────
// Lưới trước-gộp là bản CỦA ĐỈNH bộ máy cho cả hai lượt (đỉnh và <từ>): khác gốc kho, cùng luật.
const AG_REQUIRES = ['scripts/pre-merge-check.sh', 'lib/evidence-core.cjs', 'lib/do-san-tren-nen.cjs', 'lib/nhan-canh-gay.cjs'];
let agRoot = flags['ag-root'];
if (!agRoot && AG_REQUIRES.every(r => fs.existsSync(path.join(HERE, '..', '..', r)))) agRoot = path.join(HERE, '..', '..');
if (!agRoot) {
  try {
    const out = execFileSync(process.execPath, [RESOLVER, '--plugin', 'acceptance-gate', ...AG_REQUIRES.flatMap(r => ['--require', r])], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    agRoot = out.trim().split('\n').pop();
  } catch (e) { die(`không tìm được bộ máy acceptance-gate (thiếu nguồn): ${String(e.message || e).split('\n')[0]} — truyền --ag-root`); }
}
agRoot = (() => { try { return fs.realpathSync(agRoot); } catch { return die(`--ag-root không tồn tại: ${agRoot}`); } })();
const vang = AG_REQUIRES.filter(r => !fs.existsSync(path.join(agRoot, r)));
if (vang.length) die(`bộ máy (${agRoot}) thiếu nguồn: ${vang.join(', ')}`);
const require_ = createRequire(import.meta.url);
const nap = (rel) => { try { return require_(path.join(agRoot, rel)); } catch (e) { return die(`không nạp được ${rel} (${agRoot}): ${String((e && e.message) || e).split('\n')[0]}`); } };
const core = nap('lib/evidence-core.cjs');
const ds = nap('lib/do-san-tren-nen.cjs');
const ncg = nap('lib/nhan-canh-gay.cjs');
for (const [m, ten] of [[core, 'evalPathsOf'], [core, 'pathGlobToRe'], [ds, 'bamThongDiep'], [ncg, 'nguonNhan']]) {
  if (typeof m[ten] !== 'function') die(`bộ máy (${agRoot}) thiếu hàm ${ten} — thiếu nguồn, dùng bộ máy cùng đời với lệnh này`);
}
const PM = path.join(agRoot, 'scripts', 'pre-merge-check.sh');

// ── git ─────────────────────────────────────────────────────────────────────────────────────────────────
const gitOr = (...a) => { try { return execFileSync('git', ['-C', root, '-c', 'core.quotepath=false', ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 30 }).trim(); } catch { return null; } };
if (gitOr('rev-parse', '--git-dir') === null) die(`--root không phải kho git: ${root}`);
const giai = (ref, co) => gitOr('rev-parse', '--verify', '--quiet', `${ref}^{commit}`) || die(`ref sai: ${co} ${ref} không giải được thành commit trong ${root}`);
const tuSha = giai(flags.tu, '--tu');
const denSha = giai(flags.den || 'HEAD', '--den');
const headSha = giai('HEAD', 'HEAD');
const ngan = (s) => s.slice(0, 7);
// Lượt ghim ghim trên CÂY ĐANG ĐỨNG; lệnh không đổi nhánh — nên <đến> phải là HEAD.
if (denSha !== headSha) die(`ref sai: --den ${flags.den} (${ngan(denSha)}) không phải HEAD của --root (${ngan(headSha)}) — lệnh ghim trên cây đang đứng và không đổi nhánh; checkout <đến> trước`);
if (tuSha !== denSha && gitOr('merge-base', '--is-ancestor', tuSha, denSha) === null) die(`ref sai: --tu ${flags.tu} (${ngan(tuSha)}) không phải tổ tiên của <đến> ${ngan(denSha)}`);
{
  // Cùng luật cây sạch với lượt ghim (repin-lane.mjs): porcelain v1, bỏ tệp chưa theo dõi, chỉ _acceptance/ được bẩn.
  const raw = execFileSync('git', ['-C', root, 'status', '--porcelain', '--untracked-files=no'], { encoding: 'utf8' });
  const ban = raw.split('\n').filter(Boolean).map(l => l.replace(/^.{2}\s/, '').replace(/^.* -> /, '').trim()).filter(p => !p.startsWith('_acceptance/'));
  if (ban.length) die(`cây bẩn ngoài _acceptance/ — ${ban.slice(0, 5).join(', ')}${ban.length > 5 ? ' …' : ''} (commit trước rồi chạy lại)`);
}

const phut = (ms) => Math.round(ms / 600) / 100;
const vietSo = (x, n) => x.toFixed(n).replace('.', ',');
const gioMay = () => Math.round((Date.now() - tBatDau) / 36000) / 100000;
const dongCuoi = (soTon) => `tồn đọng ${soTon} hồ sơ không ghim · tổng giờ máy ${vietSo((Date.now() - tBatDau) / 3600000, 2)} giờ (${vietSo((Date.now() - tBatDau) / 60000, 1)} phút)`;
const khoang = `${ngan(tuSha)}..${ngan(denSha)}`;

// Khoảng rỗng: không quét, không ghim (Review Focus).
if (tuSha === denSha) {
  if (flags.json) process.stdout.write(JSON.stringify({ tu: tuSha, den: denSha, ho_so: [], ton_dong: [], gio_may: gioMay(), ghi_chu: 'khoảng rỗng — không quét' }, null, 2) + '\n');
  else process.stdout.write(`giữ tươi ${khoang} — 0 hồ sơ cũ vì khoảng (khoảng rỗng — không quét, không ghim)\n`);
  process.exit(0);
}

// ── cây tạm ở <từ> — dọn ở MỌI lối thoát (exit thường, die, tín hiệu) ─────────────────────────────────
const tmpGoc = fs.mkdtempSync(path.join(os.tmpdir(), 'giu-tuoi-'));
const wt = path.join(tmpGoc, 'tu');
let daDon = false;
const lienKetPhuThuoc = []; // symlink tạo trong cây tạm — gỡ TRƯỚC khi gỡ cây, để không lệnh dọn nào đi theo vào thư mục thật
function donCay() {
  if (daDon) return; daDon = true;
  for (const l of lienKetPhuThuoc) { try { if (fs.lstatSync(l).isSymbolicLink()) fs.unlinkSync(l); } catch { /* đã gỡ */ } }
  try { execFileSync('git', ['-C', root, 'worktree', 'remove', '--force', wt], { stdio: 'ignore' }); } catch { /* chưa tạo / đã gỡ */ }
  try { fs.rmSync(tmpGoc, { recursive: true, force: true }); } catch { /* */ }
  try { execFileSync('git', ['-C', root, 'worktree', 'prune'], { stdio: 'ignore' }); } catch { /* */ }
}
process.on('exit', donCay);
for (const [sig, so] of [['SIGINT', 2], ['SIGTERM', 15], ['SIGHUP', 1]]) process.on(sig, () => process.exit(128 + so));
try { execFileSync('git', ['-C', root, 'worktree', 'add', '--detach', '--quiet', wt, tuSha], { stdio: ['ignore', 'ignore', 'pipe'] }); }
catch (e) { die(`không tách được cây tạm ở ${ngan(tuSha)}: ${String(e.stderr || e.message).trim().split('\n')[0]}`); }

// ── 1. chọn ─────────────────────────────────────────────────────────────────────────────────────────────
function cuO(dir, nhan) {
  const r = spawnSync('bash', [PM, dir], { cwd: dir, encoding: 'utf8', maxBuffer: 1 << 30 });
  if (r.status !== 0 && r.status !== 1) die(`lưới trước-gộp không chạy được ở ${nhan} (mã ${r.status}): ${String(r.stderr || '').trim().split('\n').slice(-1)[0] || 'không lời'}`);
  const cu = new Set();
  for (const l of String(r.stdout).split('\n')) { const m = l.match(/^VIOLATION \[([^\]]+)\]: evidence is stale/); if (m) cu.add(m[1]); }
  return cu;
}
const cuDinh = cuO(root, `đỉnh ${ngan(denSha)}`);
const cuTu = cuO(wt, `<từ> ${ngan(tuSha)}`);
const chon = [...cuDinh].filter(s => !cuTu.has(s)).sort();
const tonDong = [...cuDinh].filter(s => cuTu.has(s)).sort();
log(`khoảng ${khoang}: cũ ở đỉnh ${cuDinh.size} · cũ ở <từ> ${cuTu.size} → ${chon.length} hồ sơ cũ vì khoảng, ${tonDong.length} tồn đọng`);

// ── 2. ghim ─────────────────────────────────────────────────────────────────────────────────────────────
let laneOut = null;
let laneMs = 0;
if (chon.length) {
  const t = Date.now();
  const r = spawnSync(process.execPath, [LANE, '--root', root, '--ag-root', agRoot, '--tung-ho-so', '--reason', `giữ tươi ${khoang}`,
    ...(flags.write ? ['--write'] : []), ...chon.flatMap(s => ['--slug', s])], { encoding: 'utf8', maxBuffer: 1 << 30 });
  laneMs = Date.now() - t;
  if (r.stderr) process.stderr.write(r.stderr);
  if (r.status === 1 && String(r.stderr).includes('suite chung đỏ — không ghim hồ sơ nào')) { console.error('giu-tuoi: suite chung đỏ — không ghim hồ sơ nào'); process.exit(1); }
  if (r.status === 2 || r.status === 3) die(`lượt ghim lại dừng vì nguồn (mã ${r.status}) — xem dòng repin-lane ở trên`);
  if (r.status !== 0) { console.error(`giu-tuoi: lượt ghim lại đỏ (mã ${r.status === null ? `tín hiệu ${r.signal}` : r.status}) — không quy được về PR; xem dòng repin-lane ở trên`); process.exit(1); }
  try { laneOut = JSON.parse(r.stdout); } catch { console.error('giu-tuoi: không đọc được kết quả của lượt ghim lại'); process.exit(1); }
}

// ── phụ thuộc của kho cho cây tạm ───────────────────────────────────────────────────────────────────────
// Cây tạm do `git worktree add` chỉ có tệp git theo dõi; thư viện cài sẵn (node_modules, .venv, vendor) thì git bỏ
// qua nên vắng — chạy lại ở <từ> mà thiếu chúng thì mọi eval đỏ đều «đỏ khác» và bị quy nhầm về một PR (S4 lượt 1,
// ngoài hợp đồng; AC-4 ô 5). Với mỗi tên trong danh sách có ở gốc kho mà git BỎ QUA (`git check-ignore`), tạo một
// symlink trong cây tạm trỏ về thư mục ấy — không chép. Tên đã có trong cây tạm (git theo dõi ở <từ>) thì để nguyên.
// Phụ thuộc ở đường khác danh sách không được phủ: lần chạy lại khi ấy lỗi môi trường và bước dưới nói rõ «không
// chạy lại được ở đầu khoảng» thay vì gọi tên PR.
const THU_MUC_PHU_THUOC = ['node_modules', '.venv', 'vendor'];
let _daNoiPhuThuoc = false;
function noiPhuThuoc() {
  if (_daNoiPhuThuoc) return; _daNoiPhuThuoc = true;
  for (const ten of THU_MUC_PHU_THUOC) {
    const nguon = path.join(root, ten);
    let laThuMuc = false;
    try { laThuMuc = fs.statSync(nguon).isDirectory(); } catch { /* vắng */ }
    if (!laThuMuc || gitOr('check-ignore', '-q', ten) === null) continue;
    const dich = path.join(wt, ten);
    if (fs.existsSync(dich)) continue;
    try { fs.symlinkSync(nguon, dich, 'dir'); lienKetPhuThuoc.push(dich); log(`cây tạm dùng ${ten}/ của kho (symlink)`); }
    catch (e) { log(`không nối được ${ten}/ vào cây tạm: ${String((e && e.message) || e).split('\n')[0]}`); }
  }
}
// Lỗi MÔI TRƯỜNG ở lần chạy lại tại <từ>: mã 126/127 (hay mọi mã hạ tầng / bị ngắt), hoặc nhật ký có dòng thiếu
// mô-đun / lệnh / tệp mà nhật ký ở đỉnh KHÔNG có (so sau chuẩn hoá — cùng dòng ở đỉnh là cùng một cái đỏ thật).
const LOI_MOI_TRUONG = /Cannot find module|ERR_MODULE_NOT_FOUND|command not found|No such file or directory/;
const dongMoiTruong = (loi) => new Set(String(loi).split('\n').filter(l => LOI_MOI_TRUONG.test(l)).map(l => ds.chuanHoa(l)));
function loiMoiTruongOTu(tu, dinh) {
  if (tu.exit === 126 || tu.exit === 127 || laHaTang(tu.exit)) return true;
  const oDinh = dongMoiTruong(dinh.loi);
  return [...dongMoiTruong(tu.loi)].some(l => !oDinh.has(l));
}

// ── 3. quy về PR ────────────────────────────────────────────────────────────────────────────────────────
// Mã hạ tầng: 126/127 (không chạy được lệnh), ≥ 128 (bị ngắt), mã hạ tầng của bảng nhãn dùng chung (lib/nhan-canh-gay).
const MA_HA_TANG = new Set([126, 127, ...((ncg.nguonNhan() || {}).infraExits || [])]);
const laHaTang = (x) => x == null || MA_HA_TANG.has(x) || x >= 128;
function chay(cmd, cwd) {
  const t = Date.now();
  const r = spawnSync('bash', ['-c', cmd], { cwd, encoding: 'utf8', maxBuffer: 1 << 30, stdio: ['ignore', 'pipe', 'pipe'] });
  const exit = r.status === null ? null : r.status;
  // Băm trên `${out}\n${err}` — đúng vật làn băm (repin-lane bóc khung nhật ký về đúng chuỗi này).
  const loi = `${r.stdout || ''}\n${r.stderr || ''}`;
  return { exit, ms: Date.now() - t, loi, bam: ds.bamThongDiep(loi, rutTenCa(loi)) };
}
const datKyVong = (e, x) => x === e.expected || (e.expected !== 0 && x === 0);

// Commit cha-đầu trong khoảng: tệp đổi so cha đầu + số PR rút từ tiêu đề (gộp thường hoặc nén).
let _cm;
function commitKhoang() {
  if (_cm) return _cm;
  const ds_ = (gitOr('rev-list', '--first-parent', '--reverse', `${tuSha}..${denSha}`) || '').split('\n').filter(Boolean);
  _cm = ds_.map(c => {
    const cha = gitOr('rev-parse', `${c}^1`);
    const tep = (gitOr('diff', '--name-only', '--no-renames', cha, c) || '').split('\n').filter(Boolean);
    const tieuDe = gitOr('log', '-1', '--format=%s', c) || '';
    const m = tieuDe.match(/Merge pull request #(\d+)/) || tieuDe.match(/\(#(\d+)\)\s*$/);
    return { sha: c, cha, tep, pr: m ? Number(m[1]) : null };
  });
  return _cm;
}
const coGlob = (g) => /[*?]|\[\[\]|\[\]\]/.test(g);
const boKhop = (globs) => globs.map(g => (coGlob(g) ? ((re) => (f) => re.test(f))(core.pathGlobToRe(g)) : (f) => f === g || f.startsWith(g.replace(/\/$/, '') + '/')));
const coMa = (c) => c.tep.some(f => !f.startsWith('_acceptance/'));

const hoSo = [];
for (const s of chon) {
  const o = laneOut && laneOut.slugs ? laneOut.slugs[s] : null;
  const chung = chon.length ? laneMs / chon.length : 0;
  if (!o || o.ket_cuc !== 'do') {
    const veNhan = o && o.do_san ? ` (đỏ sẵn trên nền: ${Object.keys(o.do_san).join(', ')})` : '';
    hoSo.push({ slug: s, ket_cuc: 'tuoi-lai', quy_ve: [], ms: chung, veNhan });
    continue;
  }
  const evalsText = (() => { try { return fs.readFileSync(path.join(root, '_acceptance', s, 'evals.yaml'), 'utf8'); } catch { return ''; } })();
  let ms = chung;
  const lop = []; // {id, lop}
  for (const e of o.lech || []) {
    if (laHaTang(e.exit)) { lop.push({ id: e.id, lop: 'ha-tang' }); continue; }
    const dinh = chay(e.cmd, root); ms += dinh.ms;
    if (datKyVong(e, dinh.exit) || laHaTang(dinh.exit)) { lop.push({ id: e.id, lop: 'ha-tang' }); continue; }
    noiPhuThuoc();
    const tu = chay(e.cmd, wt); ms += tu.ms;
    if (!datKyVong(e, tu.exit) && tu.bam !== dinh.bam && loiMoiTruongOTu(tu, dinh)) { lop.push({ id: e.id, lop: 'ha-tang-tu' }); continue; }
    lop.push({ id: e.id, lop: !datKyVong(e, tu.exit) && tu.bam === dinh.bam ? 'do-san-truoc-khoang' : 'khoang' });
  }
  const doKhoang = lop.filter(x => x.lop === 'khoang');
  let ket = 'ha-tang', quyVe = [], ghiChu;
  if (doKhoang.length) {
    const ungVien = new Map();
    let khongPaths = false;
    for (const x of doKhoang) {
      const gl = core.evalPathsOf(evalsText, x.id);
      if (!gl) khongPaths = true;
      const khop = gl ? boKhop(gl) : null;
      for (const c of commitKhoang()) if (khop ? c.tep.some(f => khop.some(k => k(f))) : coMa(c)) ungVien.set(c.sha, c);
    }
    if (khongPaths) ghiChu = 'eval không khai paths — mọi gộp có mã trong khoảng là ứng viên';
    if (!ungVien.size) {
      // Đỏ vì khoảng mà không gộp nào chạm paths đã khai — paths thiếu vật thật; không đoán một tên.
      for (const c of commitKhoang()) if (coMa(c)) ungVien.set(c.sha, c);
      ghiChu = 'không gộp nào trong khoảng chạm paths của eval đỏ — mọi gộp có mã là ứng viên';
    }
    quyVe = [...ungVien.values()].map(c => Object.assign({ pr: c.pr, sha_truoc: c.cha, sha_sau: c.sha }, khongPaths ? { ly_do: 'eval không khai paths' } : {}));
    ket = quyVe.length === 1 ? 'do-khoang' : 'nhieu-pr';
  } else if (lop.some(x => x.lop === 'ha-tang-tu')) ghiChu = 'không chạy lại được ở đầu khoảng';
  else if (lop.some(x => x.lop === 'do-san-truoc-khoang')) ket = 'do-san-truoc-khoang';
  else if (!lop.length) ghiChu = 'lượt ghim báo đỏ mà không nêu eval nào';
  hoSo.push(Object.assign({ slug: s, ket_cuc: ket, quy_ve: quyVe, ms }, ghiChu ? { ghi_chu: ghiChu } : {}));
}

// ── 4. dòng nền đỏ ──────────────────────────────────────────────────────────────────────────────────────
if (flags.write) {
  const ts = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  for (const h of hoSo.filter(x => x.ket_cuc !== 'tuoi-lai')) {
    const p = path.join(root, '_acceptance', h.slug, 'run-log.jsonl');
    const truoc = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
    const dauDo = truoc.split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return null; } })
      .filter(x => x && x.kind === 'repin-do' && x.lan_id === laneOut.run_id).pop();
    if (!dauDo || !Array.isArray(dauDo.lenh_do)) { console.error(`giu-tuoi: ${h.slug}: không thấy dòng đỏ của lượt ghim ${laneOut.run_id} — không ghi dòng nền`); continue; }
    // `dinh_nghia` là khoá luật nhãn đọc; `evals_hash` mang cùng giá trị dưới tên hợp đồng AC-3 dùng.
    const dong = Object.assign({ ts, kind: 'nen-do', run_id: laneOut.run_id, sha: denSha, tu: tuSha, ket_cuc: h.ket_cuc, lenh_do: dauDo.lenh_do, quy_ve: h.quy_ve },
      dauDo.dinh_nghia ? { dinh_nghia: dauDo.dinh_nghia, evals_hash: dauDo.dinh_nghia } : {},
      h.ghi_chu ? { ghi_chu: h.ghi_chu } : {});
    fs.writeFileSync(p, truoc + (truoc && !truoc.endsWith('\n') ? '\n' : '') + JSON.stringify(dong) + '\n');
    log(`${h.slug}: ghi dòng nền đỏ (${h.ket_cuc})`);
  }
}

// ── 5. bảng ─────────────────────────────────────────────────────────────────────────────────────────────
const tenPr = (q) => (q.pr != null ? `#${q.pr}` : `gộp ${ngan(q.sha_sau)}`);
function chuKetCuc(h) {
  const them = h.ghi_chu ? ` — ${h.ghi_chu}` : '';
  switch (h.ket_cuc) {
    case 'tuoi-lai': return `tươi lại${h.veNhan || ''}`;
    case 'do-khoang': return `đỏ do ${h.quy_ve[0].pr != null ? `PR #${h.quy_ve[0].pr}` : `gộp ${ngan(h.quy_ve[0].sha_sau)}`}${them}`;
    case 'nhieu-pr': return `nhiều PR cùng chạm (${h.quy_ve.map(tenPr).join(', ')})${them}`;
    case 'do-san-truoc-khoang': return `đỏ sẵn trước khoảng${them}`;
    default: return `không quy được — hạ tầng (${khoang})${them}`;
  }
}
if (flags.json) {
  process.stdout.write(JSON.stringify({
    tu: tuSha, den: denSha,
    ho_so: hoSo.map(h => Object.assign({ slug: h.slug, ket_cuc: h.ket_cuc, quy_ve: h.quy_ve, phut: phut(h.ms) }, h.ghi_chu ? { ghi_chu: h.ghi_chu } : {})),
    ton_dong: tonDong, gio_may: gioMay(),
  }, null, 2) + '\n');
} else {
  const dong = [`giữ tươi ${khoang} — ${hoSo.length} hồ sơ cũ vì khoảng`];
  for (const h of hoSo) dong.push(`${h.slug} · ${chuKetCuc(h)} · ${vietSo(phut(h.ms), 2)} phút`);
  if (tonDong.length) dong.push(`tồn đọng (cũ từ trước khoảng, không ghim): ${tonDong.join(', ')}`);
  dong.push(dongCuoi(tonDong.length));
  process.stdout.write(dong.join('\n') + '\n');
}
process.exit(0);
