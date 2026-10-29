// Ca đo của hồ sơ dieu-phoi-tiep-tuc-mot-lenh (DP3). Tên ca bắt đầu «DP3-». Kho thử do mã sinh, có worktree
// LIÊN KẾT thật (git worktree add) cho từng dãy; đường suy từ vị trí tệp; đồng hồ giả qua tham số hoặc
// biến DIEU_PHOI_NOW_MS (hook là tiến trình con). Mỗi ca đỏ chạy CHÍNH hàm đo trên bản sao bị tiêm, sau
// khi bản lành xanh trên cùng fixture, kiểm bước tiêm đã áp, và ghim dấu hiệu của đúng lỗi được tiêm.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MA_TRAN_THUC } from './ma-tran-thuc.mjs';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(DAY, '..', '..');
const GOI = path.join(KIT, 'dieu-phoi');

const MAY_TAM = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'dp3-may-')));
process.env.DIEU_PHOI_MAY_DIR = MAY_TAM;

const canDon = [MAY_TAM];
after(() => {
  for (const d of canDon) fs.rmSync(d, { recursive: true, force: true });
});
const tam = (tienTo = 'dp3-') => {
  const d = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), tienTo)));
  canDon.push(d);
  return d;
};
const chep = (nguon, dich) => fs.cpSync(nguon, dich, { recursive: true });
const docJ = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const ghiJ = (p, du) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, `${JSON.stringify(du, null, 2)}\n`);
};
const ENV = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_') && k !== 'NODE_TEST_CONTEXT'));
export function bamCay(goc) {
  const h = crypto.createHash('sha256');
  const di = (d) => {
    for (const ten of fs.readdirSync(d).sort()) {
      const p = path.join(d, ten);
      const st = fs.lstatSync(p);
      const rel = path.relative(goc, p);
      if (st.isSymbolicLink()) h.update(`L ${rel} ${fs.readlinkSync(p)}\n`);
      else if (st.isDirectory()) {
        if (d === goc && ten === '.git') continue;
        h.update(`D ${rel}\n`);
        di(p);
      } else h.update(`F ${rel} `).update(fs.readFileSync(p)).update('\n');
    }
  };
  di(goc);
  return h.digest('hex');
}
const nap = (gocGoi, tep) => import(`${path.join(gocGoi, 'scripts', tep)}?v=${Math.random()}`);

const git = (cwd, ...a) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { cwd, env: ENV, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
const CLI = (gocGoi = GOI) => path.join(gocGoi, 'scripts', 'dieu-phoi.mjs');
export function chayCli(cwd, doiSo, { gocGoi = GOI, env = {} } = {}) {
  const r = spawnSync(process.execPath, [CLI(gocGoi), ...doiSo], { cwd, env: { ...ENV, ...env }, encoding: 'utf8' });
  return { ma: r.status, out: r.stdout, err: r.stderr };
}

// Kho thử + hai worktree liên kết thật cho P1, P2 + gói đợt khai qua cấu hình + đợt «thu» mở bằng CLI
// thật rồi đặt pha dang-chay. Trả đường đã realpath.
export function khoLienKet({ gocGoi = GOI, hang = null, chayPha = true } = {}) {
  const kho = tam('dp3-kho-');
  git(kho, 'init', '-q', '-b', 'main');
  git(kho, 'commit', '-q', '--allow-empty', '-m', 'goc');
  const cha = tam('dp3-wt-');
  const w1 = path.join(cha, 'p1');
  const w2 = path.join(cha, 'p2');
  git(kho, 'worktree', 'add', '-q', '-b', 'p1', w1);
  git(kho, 'worktree', 'add', '-q', '-b', 'p2', w2);
  const w3 = path.join(cha, 'ngoai');
  git(kho, 'worktree', 'add', '-q', '-b', 'ngoai', w3);
  const dir = path.join(kho, 'goi', 'dot-thu');
  // Khuôn cấu hình lấy từ CÙNG bản gói dựng đợt (hàng (g) của DP3-03 dựng bằng bản merge-base) — hồ sơ DP4 thêm
  // khoá han_muc vào khuôn, bản gói cũ không biết khoá đó.
  ghiJ(path.join(dir, 'dieu-phoi.config.json'), docJ(path.join(gocGoi, 'scripts', 'mau', 'dieu-phoi.config.json')));
  ghiJ(path.join(dir, 'hang-viec.json'), {
    dot: '',
    day: [{ id: 'P1', worktree: fs.realpathSync(w1) }, { id: 'P2', worktree: fs.realpathSync(w2) }],
    hang: hang ?? [
      { ma: 'A', slug: 'hang-a', day: 'P1', uu_tien: 1 },
      { ma: 'B', slug: 'hang-b', day: 'P2', uu_tien: 1 },
    ],
    ngoai_hang_merge: [],
  });
  fs.writeFileSync(path.join(dir, 'LUAT-rieng.md'), '# Luật riêng\n');
  fs.mkdirSync(path.join(kho, '_acceptance'), { recursive: true });
  fs.writeFileSync(path.join(kho, '_acceptance', 'config.yaml'), 'schema_version: 1\ndieu_phoi:\n  goi_dot: goi/dot-{ten}\n');
  const mo = chayCli(kho, ['mo', 'thu', '--phien', 's-gs'], { gocGoi });
  assert.equal(mo.ma, 0, mo.err);
  if (chayPha) assert.equal(chayCli(kho, ['pha', 'dang-chay', '--boi', 't', '--ly-do', 'thu'], { gocGoi }).ma, 0);
  const dot = fs.realpathSync(path.join(kho, '.acceptance-runs', 'dieu-phoi-hien-tai'));
  return { kho, dot, w1: fs.realpathSync(w1), w2: fs.realpathSync(w2), w3: fs.realpathSync(w3) };
}

// Chạy CHÍNH lệnh hook PostToolUse của gói, rút từ hooks.json (thay ${CLAUDE_PLUGIN_ROOT}).
export function lenhHook(gocGoi, suKien, matcher = null) {
  const hj = docJ(path.join(gocGoi, 'hooks', 'hooks.json'));
  const muc = hj.hooks[suKien].find((m) => matcher == null || m.matcher === matcher);
  return muc.hooks[0].command.split('${CLAUDE_PLUGIN_ROOT}').join(gocGoi);
}
export function hookNhip(dauVao, { cwd, nowMs = null, gocGoi = GOI } = {}) {
  const env = { ...ENV };
  if (nowMs != null) env.DIEU_PHOI_NOW_MS = String(nowMs);
  const r = spawnSync('sh', ['-c', lenhHook(gocGoi, 'PostToolUse')], { cwd, env, input: JSON.stringify({ cwd, ...dauVao }), encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  return r;
}
const tepSong = (dot, phien) => path.join(dot, 'song', `${phien}.json`);
const GIO = Date.parse('2026-10-11T08:00:00Z');

// ---------- DP3-02: nhịp sống (AC-2, E2) ----------
test('DP3-02 ghi-nhip', () => {
  const { kho, dot, w1 } = khoLienKet();
  hookNhip({ session_id: 's-p1' }, { cwd: w1, nowMs: GIO });
  hookNhip({ session_id: 's-gs' }, { cwd: kho, nowMs: GIO });
  const p1 = docJ(tepSong(dot, 's-p1'));
  const gs = docJ(tepSong(dot, 's-gs'));
  console.log(`  song/s-p1: day=${p1.day} · song/s-gs: day=${gs.day}`);
  assert.deepEqual({ phien: p1.phien, day: p1.day, worktree: p1.worktree }, { phien: 's-p1', day: 'P1', worktree: w1 });
  assert.deepEqual({ phien: gs.phien, day: gs.day, worktree: gs.worktree }, { phien: 's-gs', day: null, worktree: fs.realpathSync(kho) });
  assert.equal(p1.luc, new Date(GIO).toISOString());
});

test('DP3-02 30-giay', () => {
  const { dot, w1 } = khoLienKet();
  hookNhip({ session_id: 's-p1' }, { cwd: w1, nowMs: GIO });
  const p = tepSong(dot, 's-p1');
  const truoc = fs.readFileSync(p, 'utf8');
  hookNhip({ session_id: 's-p1' }, { cwd: w1, nowMs: GIO + 29_000 });
  assert.equal(fs.readFileSync(p, 'utf8'), truoc, 'trong 30″ không ghi lại');
  hookNhip({ session_id: 's-p1' }, { cwd: w1, nowMs: GIO + 31_000 });
  assert.equal(docJ(p).luc, new Date(GIO + 31_000).toISOString(), 'sau 30″ ghi lại');
});

test('DP3-02 round-trip', async () => {
  const { kho, dot, w1 } = khoLienKet();
  hookNhip({ session_id: 's-p1' }, { cwd: w1, nowMs: GIO });
  const { docNhipSong } = await nap(GOI, 'song.mjs');
  const ds = docNhipSong(dot);
  assert.deepEqual(ds.map((n) => [n.phien, n.day]), [['s-p1', 'P1']]);
  assert.ok(kho);
});

test('DP3-02-do khong-dot', () => {
  const kho = tam('dp3-trong-');
  git(kho, 'init', '-q', '-b', 'main');
  git(kho, 'commit', '-q', '--allow-empty', '-m', 'goc');
  const truoc = bamCay(kho);
  hookNhip({ session_id: 's-x' }, { cwd: kho, nowMs: GIO });
  assert.equal(bamCay(kho), truoc, 'kho không đợt: hook không tạo gì');
  const { dot, w1 } = khoLienKet();
  hookNhip({ session_id: 's-x' }, { cwd: w1, nowMs: GIO });
  assert.ok(fs.existsSync(tepSong(dot, 's-x')), 'đối chứng: kho có đợt thì tệp được tạo');
});

test('DP3-02 thieu-session', () => {
  const { dot, w1 } = khoLienKet();
  hookNhip({}, { cwd: w1, nowMs: GIO });
  hookNhip({ session_id: '../ngoai' }, { cwd: w1, nowMs: GIO });
  assert.equal(fs.existsSync(path.join(dot, 'song')) ? fs.readdirSync(path.join(dot, 'song')).length : 0, 0);
});

// ---------- DP3-14: việc chờ + mục giám sát (AC-14, E14) ----------
export function hookChoNguoi(cwd, { gocGoi = GOI } = {}) {
  const lenh = lenhHook(gocGoi, 'Notification');
  const r = spawnSync('sh', ['-c', lenh], { cwd, env: ENV, input: JSON.stringify({ cwd, hook_event_name: 'Notification', notification_type: 'idle_prompt', message: 'chờ' }), encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
}
const ngu = (ms) => new Promise((x) => setTimeout(x, ms));
const chanDoanJson = (kho, doiSo, tuyChon) => {
  const r = chayCli(kho, ['chan-doan', '--json', '--chi-tiet', ...doiSo], tuyChon);
  assert.equal(r.ma, 0, r.err);
  return JSON.parse(r.out);
};
const mucCua = (ds, muc) => ds.find((m) => m.muc === muc);

// Dựng đợt có bốn nguồn: một sự kiện can_phan TRƯỚC lần thức của giám sát (đã xử), rồi một yêu cầu
// chưa trả lời, một tệp chờ người do hook thật ghi, một sự kiện can_phan mới. Trả danh sách viết sẵn.
async function dotViecCho(gocGoi = GOI) {
  // Lúc thức đặt bằng lệnh `vai` (không chạy bộ phát lịch nền); sự kiện cũ và sự kiện mới đều do bộ
  // phát lịch THẬT ghi (thu hồi thư mục khoá rỗng · khoá không nhịp sống). Người gọi phải `dong` đợt.
  const { kho, dot, w1, w2 } = khoLienKet({ gocGoi });
  const { taoVong } = await nap(gocGoi, 'phat-lich.mjs');
  hookNhip({ session_id: 's-gs' }, { cwd: kho, gocGoi });
  await canPhanThat(dot, gocGoi);
  await ngu(5);
  assert.equal(chayCli(kho, ['vai', '--giam-sat', 's-gs'], { gocGoi }).ma, 0);
  await ngu(5);
  assert.equal(chayCli(w1, ['yeu-cau', 'khac', '--hang', 'hang-a'], { gocGoi }).out.trim(), 'P1-1');
  await ngu(5);
  hookChoNguoi(w2, { gocGoi });
  assert.equal(chayCli(w1, ['xin', 's4'], { gocGoi }).ma, 0);
  await ngu(5);
  const T = Date.now();
  await taoVong(dot, ioGia(T), () => T)();
  await taoVong(dot, ioGia(T + 11 * PHUT), () => T + 11 * PHUT)();
  assert.equal(suKienCua(dot).filter((e) => e.loai === 'khoa-khong-nhip').length, 1, 'fixture: bộ phát lịch thật ghi khoa-khong-nhip');
  return { kho, dot, canCo: ['yeu-cau:P1-1', 'cho-nguoi:P2', 'su-kien:khoa-khong-nhip'] };
}
export function kiemViecCho(ds, canCo) {
  const muc = mucCua(ds, 'viec-cho');
  if (!muc) return ['thiếu mục viec-cho'];
  const co = (muc.chi_tiet?.ds ?? []).map((v) => `${v.loai}:${v.id.split('@')[0]}`);
  const loi = [];
  if (JSON.stringify(co) !== JSON.stringify(canCo)) loi.push(`viec-cho = [${co.join(', ')}], cần [${canCo.join(', ')}]`);
  if (co.some((v) => v.startsWith('su-kien:thu-hoi'))) loi.push('sự kiện trước thuc_luc có mặt thừa');
  return loi;
}

test('DP3-14 viec-cho', async () => {
  const { kho, canCo } = await dotViecCho();
  const ds = chanDoanJson(kho, ['--phien', 's-gs']);
  console.log(`  viec-cho: ${(mucCua(ds, 'viec-cho')?.chi_tiet?.ds ?? []).map((v) => v.loai).join(' · ')}`);
  assert.deepEqual(kiemViecCho(ds, canCo), []);
  assert.equal(mucCua(ds, 'viec-cho').trang_thai, 'thieu');
  chayCli(kho, ['dong']);
});

test('DP3-14 giam-sat', async () => {
  const { kho, dot } = khoLienKet();
  hookNhip({ session_id: 's-gs' }, { cwd: kho });
  const dung = chanDoanJson(kho, ['--phien', 's-gs']);
  assert.equal(mucCua(dung, 'giam-sat').trang_thai, 'du');
  assert.equal(mucCua(dung, 'hook-phien').trang_thai, 'du');
  const khac = chanDoanJson(kho, ['--phien', 's-khac']);
  assert.equal(mucCua(khac, 'giam-sat').trang_thai, 'thieu');
  assert.match(mucCua(khac, 'giam-sat').viec, /\/dieu-phoi:tiep-tuc/);
  fs.rmSync(path.join(dot, 'song', 's-gs.json'));
  assert.equal(mucCua(chanDoanJson(kho, ['--phien', 's-gs']), 'hook-phien').trang_thai, 'thieu');
  const tron = JSON.parse(chayCli(kho, ['chan-doan', '--json']).out);
  for (const m of tron) assert.deepEqual(Object.keys(m).sort(), ['muc', 'trang_thai', 'viec'], `${m.muc}: khuôn DP2 giữ khi không --chi-tiet`);
});

test('DP3-14-do bo-moc-thuc', async () => {
  const sao = path.join(tam(), 'dieu-phoi');
  chep(GOI, sao);
  const lanh = await dotViecCho(sao);
  assert.deepEqual(kiemViecCho(chanDoanJson(lanh.kho, ['--phien', 's-gs'], { gocGoi: sao }), lanh.canCo), [], 'đối chứng dương: bản sao lành');
  chayCli(lanh.kho, ['dong'], { gocGoi: sao });
  const p = path.join(sao, 'scripts', 'viec-cho.mjs');
  const goc = fs.readFileSync(p, 'utf8');
  const tiem = goc.replace('if (thucMs != null && Date.parse(e.luc) <= thucMs) continue;\n', '');
  assert.notEqual(tiem, goc, 'bước tiêm không áp được');
  fs.writeFileSync(p, tiem);
  const { kho, canCo } = await dotViecCho(sao);
  const loi = kiemViecCho(chanDoanJson(kho, ['--phien', 's-gs'], { gocGoi: sao }), canCo);
  chayCli(kho, ['dong'], { gocGoi: sao });
  assert.ok(loi.includes('sự kiện trước thuc_luc có mặt thừa'), `phải nêu sự kiện cũ thừa: ${loi.join(' | ')}`);
});

// ---------- DP3-03: kế hoạch từng dãy (AC-3, E3) ----------
const PHUT = 60_000;
let goiMergeBase = null;
function goiTaiMergeBase() {
  if (goiMergeBase) return goiMergeBase;
  let mb = null;
  for (const nhanh of ['origin/main', 'main']) {
    try {
      mb = execFileSync('git', ['merge-base', 'HEAD', nhanh], { cwd: KIT, env: ENV, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
      break;
    } catch {}
  }
  assert.ok(mb, 'không tìm được merge-base');
  const dir = tam('dp3-goc-');
  execFileSync('tar', ['-x', '-C', dir], { input: execFileSync('git', ['archive', mb, 'dieu-phoi'], { cwd: KIT, env: ENV, maxBuffer: 1 << 28 }) });
  goiMergeBase = path.join(dir, 'dieu-phoi');
  return goiMergeBase;
}
// Mỗi hàng: một đợt mới, dãy P1 ở đúng trạng thái; giám sát ghi một nhịp để thư mục song/ có (trừ (g)).
export const MA_TRAN_DAY = [
  ['a', 'khong', ({ dot, w1, kho }) => {
    hookNhip({ session_id: 's-gs' }, { cwd: kho, nowMs: GIO });
    hookNhip({ session_id: 's-p1' }, { cwd: w1, nowMs: GIO - 3 * PHUT });
    assert.ok(dot);
  }],
  ['b', 'nhan-giang-lai', ({ dot, w1, kho }) => {
    hookNhip({ session_id: 's-gs' }, { cwd: kho, nowMs: GIO });
    hookNhip({ session_id: 's-p1' }, { cwd: w1, nowMs: GIO - 3 * PHUT });
    ghiJ(path.join(dot, 'xin', 'P1-s4.json'), { phien: 'P1', slug: 'hang-a', loai: 's4', luc: new Date(GIO).toISOString(), worktree: w1, uoc_phut: 20 });
  }],
  ['c', 'mo-chip', ({ w1, kho }) => {
    hookNhip({ session_id: 's-gs' }, { cwd: kho, nowMs: GIO });
    hookNhip({ session_id: 's-p1' }, { cwd: w1, nowMs: GIO - 25 * PHUT });
  }],
  ['d', 'khong', ({ dot, w1, kho }) => {
    hookNhip({ session_id: 's-gs' }, { cwd: kho, nowMs: GIO });
    ghiJ(path.join(dot, 'khoa', 's4', 'chu.json'), { phien: 'P1', worktree: w1, cap_luc: new Date(GIO - 30 * PHUT).toISOString() });
  }],
  ['e', 'worktree-mat', ({ w1, kho }) => {
    hookNhip({ session_id: 's-gs' }, { cwd: kho, nowMs: GIO });
    fs.rmSync(w1, { recursive: true, force: true });
  }],
  ['f', 'cho-nguoi', ({ w1, kho }) => {
    hookNhip({ session_id: 's-gs' }, { cwd: kho, nowMs: GIO });
    hookNhip({ session_id: 's-p1' }, { cwd: w1, nowMs: GIO - 30 * PHUT });
    hookChoNguoi(w1);
  }],
  ['g', 'chua-biet', () => {}, { banCu: true }],
];

async function hanhDongMaTran(gocGoi = GOI) {
  const ra = [];
  for (const [hang, can, dung, tuy = {}] of MA_TRAN_DAY) {
    const dot = khoLienKet({ gocGoi: tuy.banCu ? goiTaiMergeBase() : GOI, chayPha: false });
    dung(dot);
    const env = { DIEU_PHOI_NOW_MS: String(GIO) };
    const cd = JSON.parse(chayCli(dot.kho, ['chan-doan', '--json', '--chi-tiet'], { gocGoi, env }).out);
    const tt = chayCli(dot.kho, ['tiep-tuc', '--phien', 's-gs', '--nhe', '--json'], { gocGoi, env });
    assert.equal(tt.ma, 0, tt.err);
    const keHoach = JSON.parse(tt.out).ke_hoach ?? [];
    const muc = cd.find((m) => m.muc === 'day:P1');
    ra.push({ hang, can, cd: muc?.chi_tiet?.hanh_dong ?? null, tt: keHoach.find((k) => k.day === 'P1')?.hanh_dong ?? null, muc, kh: keHoach.find((k) => k.day === 'P1') });
  }
  return ra;
}
export const loiMaTran = (kq) => kq.flatMap((r) => [
  ...(r.cd !== r.can ? [`(${r.hang}): ${r.cd}, cần ${r.can}`] : []),
  ...(r.tt !== r.cd ? [`(${r.hang}): tiep-tuc ${r.tt} ≠ chan-doan ${r.cd}`] : []),
]);

test('DP3-03 ma-tran', async () => {
  const kq = await hanhDongMaTran();
  console.log(`  số hàng ma trận: ${kq.length} · ${kq.map((r) => `${r.hang}=${r.cd}`).join(' ')}`);
  assert.equal(kq.length, MA_TRAN_DAY.length);
  assert.deepEqual(loiMaTran(kq), []);
  const c = kq.find((r) => r.hang === 'c');
  assert.match(c.kh.ghi_danh, /LUAT\.md/);
  assert.match(c.kh.ghi_danh, /\/feature-loop:feature-loop hang-a/);
  assert.match(c.kh.ghi_danh, /\.acceptance-runs\/dieu-phoi-thu/);
  assert.match(kq.find((r) => r.hang === 'g').muc.viec, /kiểm thanh bên/);
  assert.equal(kq.find((r) => r.hang === 'a').muc.trang_thai, 'du');
  // Dãy mo-chip là «chờ người bấm chip» (du), không phải việc phiên còn thiếu — hồ sơ dieu-phoi-sua-truoc-dot-thu
  // (D4): xếp thieu thì vòng kiểm cuối của mo-dot mở chip lần hai.
  assert.equal(c.muc.trang_thai, 'du');
});

async function maTranTrenBanSao(thay) {
  const sao = path.join(tam(), 'dieu-phoi');
  chep(GOI, sao);
  const p = path.join(sao, 'scripts', 'tiep-tuc.mjs');
  const goc = fs.readFileSync(p, 'utf8');
  const tiem = goc.replace(thay, '');
  assert.notEqual(tiem, goc, 'bước tiêm không áp được');
  fs.writeFileSync(p, tiem);
  return loiMaTran(await hanhDongMaTran(sao));
}

test('DP3-03-do bo-khoa', async () => {
  const loi = await maTranTrenBanSao('  if (giuKhoa) return { ...nen, hanh_dong: conCho ? HANH_DONG.nhanGiangLai : HANH_DONG.khong };\n');
  assert.deepEqual(loi, ['(d): mo-chip, cần khong']);
});

test('DP3-03-do bo-chua-biet', async () => {
  const loi = await maTranTrenBanSao('  if (!coSong) return { ...nen, hanh_dong: HANH_DONG.chuaBiet };\n');
  assert.deepEqual(loi, ['(g): mo-chip, cần chua-biet']);
});

test('DP3-03 dong-ho-lui', async () => {
  const dot = khoLienKet({ chayPha: false });
  hookNhip({ session_id: 's-p1' }, { cwd: dot.w1, nowMs: GIO + 5 * PHUT });
  const cd = JSON.parse(chayCli(dot.kho, ['chan-doan', '--json', '--chi-tiet'], { env: { DIEU_PHOI_NOW_MS: String(GIO) } }).out);
  assert.equal(cd.find((m) => m.muc === 'day:P1').chi_tiet.hanh_dong, 'khong', 'nhịp có giờ tương lai coi như vừa xong');
});

// ---------- DP3-04, DP3-05: nhận vai, tiep-tuc, dạng nhẹ (AC-4, AC-5) ----------
const pidPhatLich = (dot) => Number(fs.existsSync(path.join(dot, 'phat-lich.pid')) ? fs.readFileSync(path.join(dot, 'phat-lich.pid'), 'utf8') : 0);
const conChay = (pid) => {
  if (!pid) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
};
async function choPid(dot) {
  for (let i = 0; i < 60; i++) {
    if (conChay(pidPhatLich(dot))) return pidPhatLich(dot);
    await ngu(50);
  }
  return 0;
}
const docVai = (dot) => docJ(path.join(dot, 'vai.json'));

test('DP3-04 nhan-vai', async () => {
  const { kho, dot } = khoLienKet();
  try {
    assert.equal(docVai(dot).giam_sat.phien, 's-gs');
    assert.equal(conChay(pidPhatLich(dot)), false, 'fixture: bộ phát lịch đã chết');
    const r1 = chayCli(kho, ['tiep-tuc', '--phien', 's-b', '--json'], { env: { DIEU_PHOI_NOW_MS: String(GIO) } });
    assert.equal(r1.ma, 0, r1.err);
    const v1 = docVai(dot);
    assert.equal(v1.giam_sat.phien, 's-b');
    assert.equal(v1.giam_sat.thuc_luc, new Date(GIO).toISOString());
    assert.equal(v1.lich_su.length, 1);
    assert.equal(v1.lich_su[0].phien, 's-gs');
    assert.ok(v1.lich_su[0].thoi_luc);
    const pid1 = await choPid(dot);
    assert.ok(pid1, 'bộ phát lịch chạy lại');
    const r2 = chayCli(kho, ['tiep-tuc', '--phien', 's-b', '--json'], { env: { DIEU_PHOI_NOW_MS: String(GIO + 60_000) } });
    assert.equal(r2.ma, 0, r2.err);
    const v2 = docVai(dot);
    console.log(`  lần hai: lich_su ${v2.lich_su.length} · pid ${pidPhatLich(dot) === pid1 ? 'giữ' : 'đổi'}`);
    assert.equal(v2.lich_su.length, 1, 'lần hai không thêm lịch sử');
    assert.equal(pidPhatLich(dot), pid1, 'lần hai không thêm tiến trình');
    assert.ok(Date.parse(v2.giam_sat.thuc_luc) > Date.parse(v1.giam_sat.thuc_luc));
  } finally {
    chayCli(kho, ['dung']);
  }
});

test('DP3-04-do khong-dot', () => {
  const kho = tam('dp3-trong-');
  git(kho, 'init', '-q', '-b', 'main');
  git(kho, 'commit', '-q', '--allow-empty', '-m', 'goc');
  const r = chayCli(kho, ['tiep-tuc', '--phien', 's-b']);
  assert.equal(r.ma, 1);
  assert.match(r.err, /không có đợt/);
  const { kho: coDot } = khoLienKet({ chayPha: false });
  assert.equal(chayCli(coDot, ['tiep-tuc', '--phien', 's-b']).ma, 0, 'đối chứng: kho có đợt thì chạy');
});

// Kịch bản AC-5 trên một gói: pha dang-chay, bộ phát lịch chết. Thôi vai mà ghi gì (kể cả chạy lại bộ
// phát lịch) thì băm thư mục đợt đổi.
async function kiemNhe(gocGoi = GOI) {
  const { kho, dot } = khoLienKet({ gocGoi });
  const loi = [];
  try {
    const env = { DIEU_PHOI_NOW_MS: String(GIO) };
    assert.equal(chayCli(kho, ['tiep-tuc', '--phien', 's-gs', '--nhe', '--json'], { gocGoi, env }).ma, 0);
    await choPid(dot);
    chayCli(kho, ['dung'], { gocGoi });
    await ngu(200);
    const v0 = docVai(dot);
    const env2 = { DIEU_PHOI_NOW_MS: String(GIO + 120_000) };
    const r1 = chayCli(kho, ['tiep-tuc', '--phien', 's-gs', '--nhe', '--json'], { gocGoi, env: env2 });
    const v1 = docVai(dot);
    if (r1.ma !== 0) loi.push(`nhe đúng phiên: mã ${r1.ma}`);
    if (v1.giam_sat.thuc_luc !== new Date(GIO + 120_000).toISOString()) loi.push('nhe đúng phiên không ghi thuc_luc');
    if (v1.giam_sat.phien !== 's-gs' || v1.lich_su.length !== v0.lich_su.length) loi.push('nhe đúng phiên đổi vai');
    await choPid(dot);
    chayCli(kho, ['dung'], { gocGoi });
    await ngu(200);
    const truoc = bamCay(dot);
    const r2 = chayCli(kho, ['tiep-tuc', '--phien', 's-c', '--nhe', '--json'], { gocGoi, env: env2 });
    await ngu(300);
    if (r2.ma !== 0) loi.push(`thôi vai: mã ${r2.ma}`);
    else if (JSON.parse(r2.out).thoi_vai !== true) loi.push('thôi vai: thiếu thoi_vai');
    if (bamCay(dot) !== truoc) loi.push('thư mục đợt đổi khi thôi vai');
  } finally {
    chayCli(kho, ['dung'], { gocGoi });
  }
  return loi;
}

test('DP3-05 nhe', async () => {
  assert.deepEqual(await kiemNhe(), []);
});

test('DP3-05-do ghi-khi-thoi', async () => {
  const sao = path.join(tam(), 'dieu-phoi');
  chep(GOI, sao);
  const p = path.join(sao, 'scripts', 'tiep-tuc.mjs');
  const goc = fs.readFileSync(p, 'utf8');
  const tiem = goc.replace('    if (laGiamSat(thuMuc, phien) === false) return { dot: thuMuc, thoi_vai: true };\n', '');
  assert.notEqual(tiem, goc, 'bước tiêm không áp được');
  fs.writeFileSync(p, tiem);
  const loi = await kiemNhe(sao);
  assert.ok(loi.includes('thư mục đợt đổi khi thôi vai'), `phải nêu thư mục đổi: ${loi.join(' | ')}`);
});

// ---------- DP3-09: đánh thức giám sát (AC-9, E9) ----------
export const ioGia = (nowMs) => ({
  nowMs: () => nowMs,
  chay: (cmd, args = []) => {
    if (cmd === 'sysctl' && args[0] === 'vm.swapusage') return 'total = 24576.00M  used = 0.00M  free = 1.00M';
    if (cmd === 'sysctl' && args.includes('kern.memorystatus_vm_pressure_level')) return '1';
    if (cmd === 'sysctl') return '{ 1.00 1.00 1.00 }';
    if (cmd === 'ps') return '102400 node\n';
    if (cmd === 'gh') return '[]';
    if (cmd === 'git' && args[0] === 'show') throw new Error('khong co');
    return '';
  },
});
// Bộ phát lịch thật ghi một sự kiện can_phan: thư mục khoá rỗng quá 60″ bị thu hồi.
async function canPhanThat(dot, gocGoi = GOI) {
  const d = path.join(dot, 'khoa', 'merge');
  fs.mkdirSync(d, { recursive: true });
  const cu = new Date(Date.now() - 5 * PHUT);
  fs.utimesSync(d, cu, cu);
  const { taoVong } = await nap(gocGoi, 'phat-lich.mjs');
  await taoVong(dot, ioGia(Date.now()), () => Date.now())();
}
export { MA_TRAN_THUC };
async function chayMaTranThuc(gocGoi = GOI) {
  const ra = [];
  for (const [hang, can, thucPhut, nhipPhut, viec] of MA_TRAN_THUC) {
    const T0 = Date.now();
    let kho;
    let dot = null;
    if (viec === 'khong-dot') {
      kho = tam('dp3-trong-');
      git(kho, 'init', '-q', '-b', 'main');
      git(kho, 'commit', '-q', '--allow-empty', '-m', 'goc');
    } else {
      ({ kho, dot } = khoLienKet({ gocGoi, chayPha: false }));
      assert.equal(chayCli(kho, ['tiep-tuc', '--phien', 's-gs', '--nhe'], { gocGoi, env: { DIEU_PHOI_NOW_MS: String(T0 - thucPhut * PHUT) } }).ma, 0);
      if (nhipPhut != null) hookNhip({ session_id: 's-gs' }, { cwd: kho, nowMs: T0 - nhipPhut * PHUT, gocGoi });
      if (viec === 'yeu-cau') ghiJ(path.join(dot, 'yeu-cau', 'P1-1.json'), { phien: 'P1', loai: 'khac', hang: 'hang-a', noi_dung: {}, luc: new Date(T0).toISOString() });
      if (viec === 'su-kien') await canPhanThat(dot, gocGoi);
    }
    const truoc = dot ? bamCay(dot) : null;
    const r = chayCli(kho, ['danh-thuc', '--json'], { gocGoi, env: { DIEU_PHOI_NOW_MS: String(T0 + 1000) } });
    assert.equal(r.ma, 0, r.err);
    ra.push({ hang, can, kq: JSON.parse(r.out), doiCay: dot ? bamCay(dot) !== truoc : false });
  }
  return ra;
}
const loiThuc = (kq) => kq.flatMap((r) => [
  ...(r.kq.hanh_dong !== r.can ? [`(${r.hang}): ${r.kq.hanh_dong}, cần ${r.can}`] : []),
  ...(r.doiCay ? [`(${r.hang}): danh-thuc ghi vào thư mục đợt`] : []),
]);

test('DP3-09 ma-tran', async () => {
  const kq = await chayMaTranThuc();
  console.log(`  số hàng ma trận: ${kq.length} · ${kq.map((r) => `${r.hang}=${r.kq.hanh_dong}`).join(' ')}`);
  assert.equal(kq.length, MA_TRAN_THUC.length);
  assert.deepEqual(loiThuc(kq), []);
  for (const h of ['b', 'g']) {
    const r = kq.find((x) => x.hang === h).kq;
    assert.equal(r.phien, 's-gs');
    assert.match(r.cau, /\/dieu-phoi:tiep-tuc --nhe/);
  }
  assert.match(kq.find((x) => x.hang === 'd').kq.cau, /\/dieu-phoi:tiep-tuc/);
});

test('DP3-09-do bo-viec-cho', async () => {
  const sao = path.join(tam(), 'dieu-phoi');
  chep(GOI, sao);
  const p = path.join(sao, 'scripts', 'danh-thuc.mjs');
  const goc = fs.readFileSync(p, 'utf8');
  const tiem = goc.replace("  if (ds.length === 0) return kq(DANH_THUC.khong, 'không có việc chờ');\n", '');
  assert.notEqual(tiem, goc, 'bước tiêm không áp được');
  fs.writeFileSync(p, tiem);
  assert.deepEqual(loiThuc(await chayMaTranThuc(sao)), ['(c): bao-chu-kho, cần khong', '(f): bao-chu-kho, cần khong']);
});

// ---------- DP3-06, DP3-07: lệnh con ghi (AC-6, AC-7) ----------
const suKienCua = (dot) => (fs.existsSync(path.join(dot, 'su-kien.jsonl')) ? fs.readFileSync(path.join(dot, 'su-kien.jsonl'), 'utf8').split('\n').filter(Boolean).map((d) => JSON.parse(d)) : []);
async function motNhipThat(dot) {
  const { taoVong } = await nap(GOI, 'phat-lich.mjs');
  const bay = Date.now();
  await taoVong(dot, ioGia(bay), () => bay)();
}

test('DP3-06 round-trip', async () => {
  const { dot, w1 } = khoLienKet();
  const { kiemDon } = await nap(GOI, 'hinh-dang.mjs');
  const x = chayCli(w1, ['xin', 's4', '--uoc-phut', '20']);
  assert.equal(x.ma, 0, x.err);
  const don = docJ(path.join(dot, 'xin', 'P1-s4.json'));
  kiemDon(don);
  assert.deepEqual([don.phien, don.loai, don.uoc_phut, don.slug], ['P1', 's4', 20, 'hang-a']);
  await motNhipThat(dot);
  assert.equal(docJ(path.join(dot, 'khoa', 's4', 'chu.json')).phien, 'P1', 'nhịp thật cấp s4 cho P1');
  const n = chayCli(w1, ['nha', 's4']);
  assert.equal(n.ma, 0, n.err);
  assert.equal(fs.existsSync(path.join(dot, 'khoa', 's4')), false, 'nha gỡ khoá');
  const y = chayCli(w1, ['yeu-cau', 'cham-tep', '--tep', 'a.txt']);
  assert.equal(y.ma, 0, y.err);
  assert.equal(y.out.trim(), 'P1-1');
  await motNhipThat(dot);
  assert.ok(suKienCua(dot).some((e) => e.loai === 'yeu-cau' && e.id === 'P1-1'), 'nhịp kế xử yêu cầu P1-1');
});

test('DP3-06 doc-cu', async () => {
  const { kho, dot, w2 } = khoLienKet();
  ghiJ(path.join(dot, 'xin', 'P2-s4.json'), { phien: 'P2', slug: 'hang-b', loai: 's4', luc: new Date().toISOString(), worktree: w2, uoc_phut: 20 });
  try {
    await motNhipThat(dot);
    assert.equal(docJ(path.join(dot, 'khoa', 's4', 'chu.json')).phien, 'P2', 'đơn ghi tay theo khuôn cũ vẫn được cấp');
  } finally {
    chayCli(kho, ['dong']);
  }
});

// [mô tả, cwd ('w1'|'kho'), đối số, thông điệp ghim]
export const SAI_KHUON = [
  ['loại đơn lạ', 'w1', ['xin', 'la'], /loai la không thuộc/],
  ['cham-tep không --tep', 'w1', ['yeu-cau', 'cham-tep'], /noi_dung\.tep phải là danh sách/],
  ['xin từ gốc kho', 'kho', ['xin', 's4'], /^dieu-phoi: xin: cwd không thuộc dãy nào/m],
  ['nha từ gốc kho', 'kho', ['nha', 's4'], /^dieu-phoi: nha: cwd không thuộc dãy nào/m],
  ['yeu-cau từ gốc kho', 'kho', ['yeu-cau', 'khac'], /^dieu-phoi: yeu-cau: cwd không thuộc dãy nào/m],
  ['tra-loi khoá lạ', 'kho', ['tra-loi', 'P1-1', '--ket-qua', 'duyet', '--phien', 's-gs', '--them', '{"la":1}'], /khoá lạ la/],
];
test('DP3-06-do sai-khuon', () => {
  const { kho, dot, w1 } = khoLienKet();
  const loi = [];
  for (const [ten, noi, doiSo, thongDiep] of SAI_KHUON) {
    const truoc = bamCay(dot);
    const r = chayCli(noi === 'w1' ? w1 : kho, doiSo);
    if (r.ma !== 1) loi.push(`${ten}: mã ${r.ma}`);
    if (!thongDiep.test(r.err)) loi.push(`${ten}: thông điệp «${r.err.trim()}»`);
    if (bamCay(dot) !== truoc) loi.push(`${ten}: thư mục đợt đổi`);
  }
  console.log(`  số lời gọi sai: ${SAI_KHUON.length}`);
  assert.deepEqual(loi, []);
});

// [lệnh, đối số, tệp đích tương đối thư mục đợt]
export const LENH_GIAM_SAT = [
  ['tra-loi', ['tra-loi', 'P1-1', '--ket-qua', 'duyet'], 'tra-loi/P1-1.json'],
  ['pha', ['pha', 'tam-dung', '--ly-do', 'thu'], 'dieu-khien.json'],
  ['vai', ['vai', '--giam-sat', 's-x'], 'vai.json'],
  ['nhat-ky', ['nhat-ky', 'một dòng'], 'LUAT.md'],
];
test('DP3-07 chi-giam-sat', () => {
  const loi = [];
  let soAssert = 0;
  for (const [ten, doiSo, dich] of LENH_GIAM_SAT) {
    for (const [phien, noi, can] of [['s-c', 'kho', 'tu-choi'], ['s-gs', 'kho', 'ghi'], ['s-gs', 'w3', 'ghi']]) {
      soAssert++;
      const d = khoLienKet();
      const p = path.join(d.dot, dich);
      const truoc = bamCay(d.dot);
      const tepTruoc = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
      const r = chayCli(noi === 'kho' ? d.kho : d.w3, [...doiSo, '--phien', phien]);
      const nhan = `${ten} --phien ${phien} từ ${noi}`;
      if (can === 'tu-choi') {
        if (r.ma !== 1) loi.push(`${nhan}: mã ${r.ma}`);
        if (!r.err.includes('s-c') || !r.err.includes('s-gs')) loi.push(`${nhan}: thông điệp «${r.err.trim()}»`);
        if (bamCay(d.dot) !== truoc) loi.push(`${nhan}: thư mục đợt đổi`);
      } else {
        if (r.ma !== 0) loi.push(`${nhan}: mã ${r.ma} ${r.err.trim()}`);
        const sau = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
        if (sau === tepTruoc) loi.push(`${nhan}: ${dich} không đổi`);
      }
    }
  }
  console.log(`  số ô lệnh × cách gọi: ${soAssert}`);
  assert.equal(soAssert, 12);
  assert.deepEqual(loi, []);
  const d = khoLienKet();
  assert.equal(chayCli(d.kho, ['pha', 'tam-dung', '--ly-do', 'thu']).ma, 0, 'vắng --phien chạy như DP2');
  const t = chayCli(d.w3, ['tiep-tuc', '--nhe', '--phien', 's-gs', '--json']);
  assert.equal(t.ma, 0, t.err);
  assert.equal(JSON.parse(t.out).thoi_vai, false);
  chayCli(d.kho, ['dung']);
});

// ---------- DP3-08: kiểm môi trường (AC-8, E8) ----------
const khaiMoiTruong = (dot, ds) => {
  const p = path.join(dot, 'dieu-phoi.config.json');
  ghiJ(p, { ...docJ(p), kiem_moi_truong: ds });
};
const mucMoiTruong = (ds) => ds.filter((m) => m.muc.startsWith('moi-truong:'));

test('DP3-08 kiem-moi-truong', () => {
  const { kho, dot } = khoLienKet({ chayPha: false });
  assert.equal(mucMoiTruong(JSON.parse(chayCli(kho, ['chan-doan', '--json']).out)).length, 0, 'không khai → không mục nào');
  khaiMoiTruong(dot, [
    { ten: 'xanh', lenh: 'true' },
    { ten: 'do', lenh: 'echo "thieu env" >&2; exit 1' },
    { ten: 'treo', lenh: 'sleep 5' },
    { ten: 'vang', lenh: 'lenh-khong-co-tren-may-nay-dp3' },
  ]);
  const ds = mucMoiTruong(JSON.parse(chayCli(kho, ['chan-doan', '--json', '--tran-giay', '1']).out));
  console.log(`  mục môi trường: ${ds.map((m) => `${m.muc}=${m.trang_thai}`).join(' ')}`);
  assert.deepEqual(ds.map((m) => [m.muc, m.trang_thai]), [['moi-truong:xanh', 'du'], ['moi-truong:do', 'thieu'], ['moi-truong:treo', 'thieu'], ['moi-truong:vang', 'thieu']]);
  assert.match(ds[1].viec, /thieu env/);
  assert.match(ds[2].viec, /quá 1″/);
  assert.match(ds[3].viec, /not found|không tìm thấy|command/i);
});

test('DP3-08 ban-goi', async () => {
  const { kho, dot } = khoLienKet({ chayPha: false });
  const { chepLoi } = await nap(GOI, 'dieu-phoi.mjs');
  chepLoi(dot);
  const ban = () => JSON.parse(chayCli(kho, ['chan-doan', '--json']).out).find((m) => m.muc === 'ban-goi');
  assert.equal(ban().trang_thai, 'du', 'lõi vừa chép bằng bản gói');
  const p = path.join(dot, 'loi', 'PHIEN-BAN.json');
  ghiJ(p, { ...docJ(p), phien_ban: '0.0.1' });
  assert.equal(ban().trang_thai, 'thieu');
  assert.match(ban().viec, /0\.0\.1/);
});

test('DP3-08-do kieu', async () => {
  const { kiemCauHinh } = await nap(GOI, 'hinh-dang.mjs');
  const mau = docJ(path.join(GOI, 'scripts', 'mau', 'dieu-phoi.config.json'));
  assert.doesNotThrow(() => kiemCauHinh({ ...mau, kiem_moi_truong: [{ ten: 'a', lenh: 'true' }] }), 'đối chứng: danh sách hợp lệ');
  assert.throws(() => kiemCauHinh({ ...mau, kiem_moi_truong: 'true' }), /kiem_moi_truong/);
  assert.throws(() => kiemCauHinh({ ...mau, kiem_moi_truong: [{ ten: 'a' }] }), /kiem_moi_truong/);
});

// ---------- DP3-10: khoá không nhịp sống (AC-10, E10) ----------
// Bốn kịch bản trên bộ phát lịch thật (đồng hồ giả qua io): cấp s4 cho P1 ở T, rồi nhịp ở T+11′ và T+12′.
async function kichBanKhoa(kieu, gocGoi = GOI) {
  const { kho, dot, w1 } = khoLienKet({ gocGoi });
  const { taoVong } = await nap(gocGoi, 'phat-lich.mjs');
  const nhip = (ms) => taoVong(dot, ioGia(ms), () => ms)();
  // Đơn ghi bằng giờ thật, nên đồng hồ giả của nhịp phải đi SAU nó.
  assert.equal(chayCli(w1, ['xin', 's4'], { gocGoi }).ma, 0);
  await ngu(5);
  const T = Date.now();
  if (kieu !== 'khong-song') hookNhip({ session_id: 's-gs' }, { cwd: kho, nowMs: T, gocGoi });
  try {
    await nhip(T);
    assert.equal(docJ(path.join(dot, 'khoa', 's4', 'chu.json')).phien, 'P1', 'fixture: P1 giữ s4');
    if (kieu === 'co-nhip') hookNhip({ session_id: 's-p1' }, { cwd: w1, nowMs: T + 5 * PHUT, gocGoi });
    if (kieu === 'phien-khac') hookNhip({ session_id: 's-khac' }, { cwd: w1, nowMs: T + 5 * PHUT, gocGoi });
    await nhip(T + 11 * PHUT);
    const sau11 = suKienCua(dot).filter((e) => e.loai === 'khoa-khong-nhip').length;
    await nhip(T + 12 * PHUT);
    const sau12 = suKienCua(dot).filter((e) => e.loai === 'khoa-khong-nhip').length;
    return { sau11, sau12, canPhan: suKienCua(dot).find((e) => e.loai === 'khoa-khong-nhip')?.can_phan };
  } finally {
    chayCli(kho, ['dong'], { gocGoi }); // nhả khoá s4 cấp máy cho kịch bản kế
  }
}

test('DP3-10 khoa-khong-nhip', async () => {
  const khong = await kichBanKhoa('khong-nhip');
  assert.deepEqual([khong.sau11, khong.sau12, khong.canPhan], [1, 1, true]);
  assert.deepEqual([(await kichBanKhoa('co-nhip')).sau12], [0]);
  assert.deepEqual([(await kichBanKhoa('khong-song')).sau12], [0]);
  const khac = await kichBanKhoa('phien-khac');
  console.log(`  giới hạn: nhịp theo worktree — phiên khác cùng worktree → ${khac.sau12} sự kiện`);
  assert.equal(khac.sau12, 0);
});

test('DP3-10-do bo-dieu-kien', async () => {
  const sao = path.join(tam(), 'dieu-phoi');
  chep(GOI, sao);
  // DP10: hook thật ghi cả nhịp khoá, và nhịp khoá nay cứu khoá của dãy — tắt chamNhip của hook trong bản sao để kịch bản
  // co-nhip chỉ còn nhịp phiên, nhánh nhịp phiên giữ chiều đỏ riêng.
  const ph = path.join(sao, 'scripts', 'hook-nhip.mjs');
  const hook = fs.readFileSync(ph, 'utf8');
  const tat = hook.replace('    chamNhip(dauVao);\n', '');
  assert.notEqual(tat, hook, 'bước tắt chamNhip không áp được');
  fs.writeFileSync(ph, tat);
  assert.equal((await kichBanKhoa('co-nhip', sao)).sau12, 0, 'đối chứng dương: bản sao lành (chỉ nhịp phiên)');
  const p = path.join(sao, 'scripts', 'phat-lich.mjs');
  const goc = fs.readFileSync(p, 'utf8');
  const tiem = goc.replace('    if (nhip && Date.parse(nhip.luc) >= Date.parse(chu.cap_luc)) continue;\n', '');
  assert.notEqual(tiem, goc, 'bước tiêm không áp được');
  fs.writeFileSync(p, tiem);
  const co = await kichBanKhoa('co-nhip', sao);
  assert.equal(co.sau12, 1, 'có nhịp mà vẫn báo');
});

// ---------- DP3-11: LUAT.md dạy lệnh con (AC-11, E11) ----------
export function kiemLuat(text) {
  const muc = /## Cách xin tài nguyên\n([\s\S]*?)\n## /.exec(text)?.[1] ?? '';
  const loi = [];
  if (!muc) loi.push('thiếu mục «Cách xin tài nguyên»');
  for (const lenh of ['xin', 'nha', 'yeu-cau']) if (!muc.includes(`<thư mục đợt>/loi/dieu-phoi.mjs ${lenh}`)) loi.push(`thiếu lệnh con ${lenh} qua lõi đợt`);
  for (const cam of ['ghi `xin/', 'ghi `yeu-cau/', 'rm -rf']) if (text.includes(cam)) loi.push(`còn «${cam}»`);
  return loi;
}

test('DP3-11 luat', () => {
  const { dot } = khoLienKet({ chayPha: false });
  const luat = fs.readFileSync(path.join(dot, 'LUAT.md'), 'utf8');
  assert.deepEqual(kiemLuat(luat), []);
  const khuon = fs.readFileSync(path.join(GOI, 'scripts', 'mau', 'LUAT.md'), 'utf8');
  assert.ok(luat.startsWith(khuon.replace(/\s*$/, '')), 'LUAT.md của đợt vẫn mở bằng khuôn nguyên văn (ca DP2-02)');
});

// Khuôn «cũ» neo vào LỊCH SỬ, không vào merge-base sống (sửa 11/10 ở vòng DP7, sổ DP3): commit gần nhất
// đụng chữ «rm -rf» trong khuôn là commit GỠ nó (DP3 AC-11) — bản cha của commit đó là khuôn cũ. merge-base
// của HEAD với origin/main dời theo nhánh: sau khi DP3 gộp, nó là bản MỚI ở mọi nhánh kể cả main.
const LUAT_MAU = 'dieu-phoi/scripts/mau/LUAT.md';
const gitKit = (...a) => execFileSync('git', a, { cwd: KIT, env: ENV, encoding: 'utf8' });
const khuonNeoLichSu = () => {
  const bo = gitKit('log', '-1', '--format=%H', '-S', 'rm -rf', '--', LUAT_MAU).trim();
  assert.ok(bo, 'không tìm được commit gỡ «rm -rf» khỏi khuôn LUAT.md');
  return gitKit('show', `${bo}^:${LUAT_MAU}`);
};
const khuonMergeBaseSong = () => gitKit('show', `${gitKit('merge-base', 'HEAD', 'origin/main').trim()}:${LUAT_MAU}`);
const kiemKhuonCu = (layKhuon) => {
  const loi = kiemLuat(layKhuon());
  return loi.includes('còn «rm -rf»') ? [] : [`khuôn của nhánh chính phải bị nêu «rm -rf»: ${loi.join(' | ')}`];
};

test('DP3-11-do khuon-cu', () => {
  assert.deepEqual(kiemKhuonCu(khuonNeoLichSu), []);
});

// Chiều đỏ của chính phép đo trên: cách lấy cũ (merge-base sống) trên cây sau khi DP3 gộp ra bản mới.
test('DP3-11-do khuon-cu merge-base-song', () => {
  const loi = kiemKhuonCu(khuonMergeBaseSong);
  assert.ok(loi.some((l) => l.startsWith('khuôn của nhánh chính phải bị nêu «rm -rf»')), `cách lấy merge-base sống phải đỏ: ${loi.join(' | ')}`);
});

// ---------- DP3-01: trình tự lệnh người tiep-tuc (AC-1, E1) ----------
export async function kiemTiepTucMd(gocGoi = GOI) {
  const t = fs.readFileSync(path.join(gocGoi, 'commands', 'tiep-tuc.md'), 'utf8');
  const { HANH_DONG } = await nap(gocGoi, 'tiep-tuc.mjs');
  const body = t.slice(Math.max(0, t.indexOf('\nCác bước')));
  const loi = [];
  const vi = {
    cli: body.indexOf('dieu-phoi.mjs" tiep-tuc --phien'),
    thoiVai: body.indexOf('thoi_vai: true'),
    monitor: body.indexOf('Giăng Monitor'),
    chip: body.indexOf('mở chip'),
  };
  if (Object.values(vi).some((x) => x < 0) || !(vi.cli < vi.thoiVai && vi.thoiVai < vi.monitor && vi.cli < vi.chip)) {
    loi.push(`tiep-tuc.md: trình tự phải là CLI → thôi vai → Monitor, CLI trước chip (vị trí ${vi.cli} · ${vi.thoiVai} · ${vi.monitor} · ${vi.chip})`);
  }
  if (!body.includes('`--nhe`')) loi.push('tiep-tuc.md: thiếu dạng --nhe');
  for (const hd of Object.values(HANH_DONG)) if (!body.includes(`\`${hd}\`:`)) loi.push(`tiep-tuc.md: thiếu dòng xử lý hành động ${hd}`);
  if (/^disable-model-invocation:/m.test(t)) loi.push('tiep-tuc.md: không được khoá model-invocation');
  return loi;
}

test('DP3-01 trinh-tu', async () => {
  const { HANH_DONG } = await nap(GOI, 'tiep-tuc.mjs');
  console.log(`  hành động phải có dòng xử lý: ${Object.values(HANH_DONG).join(' · ')}`);
  assert.deepEqual(await kiemTiepTucMd(), []);
});

test('DP3-01-do dao-buoc', async () => {
  const sao = path.join(tam(), 'dieu-phoi');
  chep(GOI, sao);
  assert.deepEqual(await kiemTiepTucMd(sao), [], 'đối chứng dương: bản sao lành');
  const p = path.join(sao, 'commands', 'tiep-tuc.md');
  const goc = fs.readFileSync(p, 'utf8');
  const lenh = '`node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" tiep-tuc --phien <mã phiên này> --json $ARGUMENTS`';
  assert.ok(goc.includes(lenh), 'bước tiêm không áp được');
  fs.writeFileSync(p, `${goc.replace(lenh, 'lệnh ở cuối tệp')}\nLệnh: ${lenh}\n`);
  const loi = await kiemTiepTucMd(sao);
  assert.ok(loi.some((l) => l.startsWith('tiep-tuc.md: trình tự')), `phải nêu trình tự: ${loi.join(' | ')}`);
});

// ---------- DP3-12: tài liệu, từ điển, bảng tên lệnh (AC-12, E12) ----------
const DONG_LENH = '| tiep-tuc | /dieu-phoi:tiep-tuc | command |';
export function kiemTaiLieu(goc) {
  const loi = [];
  const dong = fs.readFileSync(path.join(goc, 'CONTEXT.md'), 'utf8').split('\n');
  const i = dong.findIndex((l) => l.startsWith('**Nhịp sống của phiên**:'));
  if (i < 0) loi.push('CONTEXT.md thiếu mục «Nhịp sống của phiên»');
  else {
    let co = false;
    for (let j = i + 1; j < dong.length && !/^\*\*[^*]+\*\*:\s*$/.test(dong[j]) && !/^#{1,6} /.test(dong[j]); j++) if (dong[j].startsWith('_Avoid_')) co = true;
    if (!co) loi.push('CONTEXT.md mục «Nhịp sống của phiên» thiếu _Avoid_');
  }
  const guide = fs.readFileSync(path.join(goc, 'GUIDE.md'), 'utf8');
  const s66 = /^### 6\.6 [^\n]*\n([\s\S]*?)(?=\n## )/m.exec(guide)?.[1] ?? '';
  if (!s66.includes('/dieu-phoi:tiep-tuc')) loi.push('GUIDE §6.6 thiếu /dieu-phoi:tiep-tuc');
  if (!fs.readFileSync(path.join(goc, 'QUICKSTART.md'), 'utf8').includes('/dieu-phoi:tiep-tuc')) loi.push('QUICKSTART thiếu /dieu-phoi:tiep-tuc');
  const hfl = fs.readFileSync(path.join(goc, 'skills', 'acceptance', 'references', 'human-facing-language.md'), 'utf8');
  if (!hfl.split('\n').includes(DONG_LENH)) loi.push('COMMAND-NAMES thiếu dòng tiep-tuc');
  return loi;
}

test('DP3-12 tai-lieu', () => {
  assert.deepEqual(kiemTaiLieu(KIT), []);
});

function caySaoLb() {
  const sao = tam('dp3-lb-');
  for (const rel of ['lib', 'skills', 'commands', 'feature-loop/skills', 'tests/fixtures', 'tests/plugins/lenh-bam-duoc.test.mjs',
    'scripts/gate-card.js', 'scripts/evidence-page.js', 'QUICKSTART.md', 'README.md', 'GUIDE.md'])
    fs.cpSync(path.join(KIT, rel), path.join(sao, rel), { recursive: true });
  return sao;
}
const chayLb2 = (goc) => spawnSync(process.execPath, [path.join(goc, 'tests', 'plugins', 'lenh-bam-duoc.test.mjs')], { encoding: 'utf8', env: { ...ENV, LB_CASES: 'LB2' } });

test('DP3-12-do-lb', () => {
  const sao = caySaoLb();
  const lanh = chayLb2(sao);
  assert.equal(lanh.status, 0, `đối chứng dương: ${lanh.stdout}${lanh.stderr}`);
  assert.match(lanh.stdout, /PASS: \[LB2\]/);
  const hfl = path.join(sao, 'skills', 'acceptance', 'references', 'human-facing-language.md');
  const goc = fs.readFileSync(hfl, 'utf8');
  const tiem = goc.replace(`${DONG_LENH}\n`, '');
  assert.notEqual(tiem, goc, 'bước tiêm không áp được');
  fs.writeFileSync(hfl, tiem);
  const r = chayLb2(sao);
  assert.notEqual(r.status, 0);
  assert.match(r.stdout, /FAIL: \[LB2\].*\/dieu-phoi:tiep-tuc/);
});

// ---------- DP3-13: ca DP1 và lõi nguyên vẹn (AC-13, E13) ----------
// DP3-13 neo vào TẬP THAY ĐỔI của chính PR hồ sơ này (#303): hai cha của commit gộp PR, thay vì merge-base — mốc
// đó dời mỗi lần gộp nên ca chặn mọi vòng sau chạm hợp lệ vào ca DP1 (hồ sơ DP4 dieu-phoi-doi-tai-khoan, dòng sổ revisit).
// Commit gộp tìm bằng lệnh theo tiêu đề, không gõ sha.
export function kiemDp1NguyenTrongPr(goc, soPr, duong = ['tests/dieu-phoi/dong-goi.test.mjs', 'tests/dieu-phoi/loi']) {
  let sha = '';
  try {
    sha = execFileSync('git', ['log', '--merges', '--format=%H', `--grep=^Merge pull request #${soPr} `, 'HEAD'], { cwd: goc, env: ENV, encoding: 'utf8' }).trim().split('\n')[0];
  } catch {
    sha = '';
  }
  if (!sha) return [`không tìm được commit gộp của PR #${soPr}`];
  const r = spawnSync('git', ['diff', '--quiet', `${sha}^1`, `${sha}^2`, '--', ...duong], { cwd: goc, env: ENV });
  return r.status === 0 ? [] : [`PR #${soPr} (${sha.slice(0, 8)}) sửa ca DP1 hoặc lõi: ${duong.join(' · ')}`];
}
// Kho thử: nhánh chính có tệp ca DP1; PR #303 gộp vào (sửa hoặc không sửa tệp đó), sau đó một PR khác sửa tệp đó.
function khoPrThu(prSua) {
  const kho = tam('dp1-pr-');
  const g = (...a) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { cwd: kho, env: ENV, stdio: 'ignore' });
  const ghi = (rel, nd) => { fs.mkdirSync(path.dirname(path.join(kho, rel)), { recursive: true }); fs.writeFileSync(path.join(kho, rel), nd); };
  g('init', '-q', '-b', 'main');
  ghi('tests/dieu-phoi/dong-goi.test.mjs', 'goc\n');
  g('add', '-A'); g('commit', '-q', '-m', 'goc');
  g('checkout', '-q', '-b', 'pr');
  ghi(prSua ? 'tests/dieu-phoi/dong-goi.test.mjs' : 'khac.txt', 'pr\n');
  g('add', '-A'); g('commit', '-q', '-m', 'pr');
  g('checkout', '-q', 'main');
  g('merge', '-q', '--no-ff', '-m', `Merge pull request #303 from x/pr`, 'pr');
  ghi('tests/dieu-phoi/dong-goi.test.mjs', 'vong sau\n');
  g('add', '-A'); g('commit', '-q', '-m', 'vong sau sua ca DP1');
  return kho;
}

test('DP3-13 dp1-nguyen', () => {
  const loi = kiemDp1NguyenTrongPr(KIT, 303);
  console.log(`  PR #303: ${loi.length ? loi.join(' | ') : 'không sửa ca DP1 hay lõi'}`);
  assert.deepEqual(loi, []);
});

test('DP3-13-do pr-co-doi-dp1', () => {
  assert.deepEqual(kiemDp1NguyenTrongPr(khoPrThu(false), 303), [], 'đối chứng dương: PR không sửa tệp DP1, vòng sau sửa → vẫn xanh');
  const loi = kiemDp1NguyenTrongPr(khoPrThu(true), 303);
  assert.ok(loi.some((l) => l.startsWith('PR #303 (') && l.includes('sửa ca DP1 hoặc lõi')), loi.join(' | '));
});

test('DP3-02 tep-hong', async () => {
  const { dot, w1 } = khoLienKet();
  hookNhip({ session_id: 's-p1' }, { cwd: w1, nowMs: GIO });
  fs.writeFileSync(path.join(dot, 'song', 's-hong.json'), '{ hong');
  const { docNhipSong } = await nap(GOI, 'song.mjs');
  assert.deepEqual(docNhipSong(dot).map((n) => n.phien), ['s-p1']);
});
