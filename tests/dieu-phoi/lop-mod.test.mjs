// Ca đo của hồ sơ dieu-phoi-lop-mod (DP6, phần lõi Node). Tên ca bắt đầu «DP6-». Kho thử do mã sinh, có
// worktree LIÊN KẾT thật cho từng dãy; đường suy từ vị trí tệp. Mỗi ca đỏ chạy CHÍNH hàm đo trên bản sao gói
// bị tiêm, sau khi bản lành xanh trên cùng fixture, kiểm bước tiêm đã áp, và so tập ô đỏ BẰNG tập rút bằng code
// từ ma trận (không gõ số). Ma trận viết sẵn: số assert = số ô, in ra. Helpers chép theo khuôn
// tiep-tuc.test.mjs — không import tệp test DP3 (import sẽ đăng ký lại các ca DP3).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DANH_SACH, TEP_CA, rut } from './rut-lenh-that.mjs';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(DAY, '..', '..');
const GOI = path.join(KIT, 'dieu-phoi');

const MAY_TAM = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'dp6-may-')));
process.env.DIEU_PHOI_MAY_DIR = MAY_TAM;

const canDon = [MAY_TAM];
after(() => {
  for (const d of canDon) fs.rmSync(d, { recursive: true, force: true });
});
const tam = (tienTo = 'dp6-') => {
  const d = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), tienTo)));
  canDon.push(d);
  return d;
};
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
export function chayCli(cwd, doiSo, { gocGoi = GOI, env = {} } = {}) {
  const r = spawnSync(process.execPath, [path.join(gocGoi, 'scripts', 'dieu-phoi.mjs'), ...doiSo], { cwd, env: { ...ENV, ...env }, encoding: 'utf8' });
  return { ma: r.status, out: r.stdout, err: r.stderr };
}

// Kho thử + worktree liên kết thật cho P1, P2 (và một worktree ngoài dãy) + gói đợt khai qua cấu hình + đợt
// «thu» mở bằng CLI thật rồi đặt pha dang-chay. `duongCha`: thư mục chứa kho (để dựng đường có ký tự đặc biệt).
export function khoLienKet({ gocGoi = GOI, chayPha = true, duongCha = null } = {}) {
  const cha = duongCha ?? tam('dp6-kho-');
  const kho = path.join(cha, 'kho');
  fs.mkdirSync(kho);
  git(kho, 'init', '-q', '-b', 'main');
  git(kho, 'commit', '-q', '--allow-empty', '-m', 'goc');
  const wt = path.join(cha, 'wt');
  const w1 = path.join(wt, 'p1');
  const w2 = path.join(wt, 'p2');
  const w3 = path.join(wt, 'ngoai');
  git(kho, 'worktree', 'add', '-q', '-b', 'p1', w1);
  git(kho, 'worktree', 'add', '-q', '-b', 'p2', w2);
  git(kho, 'worktree', 'add', '-q', '-b', 'ngoai', w3);
  const dir = path.join(kho, 'goi', 'dot-thu');
  ghiJ(path.join(dir, 'dieu-phoi.config.json'), docJ(path.join(gocGoi, 'scripts', 'mau', 'dieu-phoi.config.json')));
  ghiJ(path.join(dir, 'hang-viec.json'), {
    dot: '',
    day: [
      { id: 'P1', worktree: fs.realpathSync(w1) },
      { id: 'P2', worktree: fs.realpathSync(w2) },
    ],
    hang: [
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
  return { kho: fs.realpathSync(kho), dot, w1: fs.realpathSync(w1), w2: fs.realpathSync(w2), w3: fs.realpathSync(w3) };
}

// Lệnh hook THẬT của gói, rút từ hooks.json (thay ${CLAUDE_PLUGIN_ROOT}).
export function lenhHook(gocGoi, suKien) {
  const hj = docJ(path.join(gocGoi, 'hooks', 'hooks.json'));
  return hj.hooks[suKien][0].hooks[0].command.split('${CLAUDE_PLUGIN_ROOT}').join(gocGoi);
}
export function chayHookChanS4(dauVao, { cwd, gocGoi = GOI } = {}) {
  const r = spawnSync('sh', ['-c', lenhHook(gocGoi, 'PreToolUse')], { cwd, env: ENV, input: JSON.stringify({ cwd, ...dauVao }), encoding: 'utf8' });
  return { ma: r.status, err: r.stderr };
}
export function chayHookChoNguoi(cwd, loai, { gocGoi = GOI, tin = 'chờ' } = {}) {
  const r = spawnSync('sh', ['-c', lenhHook(gocGoi, 'Notification')], { cwd, env: ENV, input: JSON.stringify({ cwd, hook_event_name: 'Notification', notification_type: loai, message: tin }), encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
}
const giuKhoa = (dot, phien, worktree) => ghiJ(path.join(dot, 'khoa', 's4', 'chu.json'), { phien, worktree, cap_luc: new Date().toISOString() });

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
export async function motNhipThat(dot, gocGoi = GOI) {
  const { taoVong } = await nap(gocGoi, 'phat-lich.mjs');
  const bay = Date.now();
  await taoVong(dot, ioGia(bay), () => bay)();
}

let goiMergeBase = null;
export function goiTaiMergeBase() {
  if (goiMergeBase) return goiMergeBase;
  let mb = null;
  for (const nhanh of ['origin/main', 'main']) {
    try {
      mb = execFileSync('git', ['merge-base', 'HEAD', nhanh], { cwd: KIT, env: ENV, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
      break;
    } catch {}
  }
  assert.ok(mb, 'không tìm được merge-base');
  const dir = tam('dp6-goc-');
  execFileSync('tar', ['-x', '-C', dir], { input: execFileSync('git', ['archive', mb, 'dieu-phoi'], { cwd: KIT, env: ENV, maxBuffer: 1 << 28 }) });
  goiMergeBase = path.join(dir, 'dieu-phoi');
  return goiMergeBase;
}
export function saoGoi(goc = GOI) {
  const d = path.join(tam('dp6-sao-'), 'dieu-phoi');
  fs.cpSync(goc, d, { recursive: true });
  return d;
}
// Tiêm: thay đúng MỘT đoạn văn bản trong tệp của bản sao; ném khi đoạn không có (bước tiêm không áp).
export function tiem(gocGoi, tep, cu, moi) {
  const p = path.join(gocGoi, 'scripts', tep);
  const t = fs.readFileSync(p, 'utf8');
  assert.equal(t.split(cu).length - 1, 1, `bước tiêm không áp được ở ${tep}: «${cu.slice(0, 40)}»`);
  fs.writeFileSync(p, t.replace(cu, moi));
}
export const docTepCa = () => fs.readFileSync(TEP_CA, 'utf8').split('\n').filter(Boolean).map((d) => JSON.parse(d));

// ---------- DP6-03: chín lời gọi thật rút từ bản ghi (AC-3, E3) ----------
test('DP6-03 tep-ca', () => {
  const ds = docTepCa();
  console.log(`  tệp ca: ${ds.length} lời gọi thật`);
  assert.equal(ds.length, 9);
  for (const x of ds) assert.deepEqual(Object.keys(x).sort(), ['hinh', 'lenh', 'nhan', 'tep', 'tool_use_id']);
  assert.equal(new Set(ds.map((x) => x.tool_use_id)).size, 9);
  assert.equal(ds.filter((x) => x.nhan !== null).length, 3);
  assert.equal(ds.filter((x) => x.nhan === null).length, 6);
  const user = os.userInfo().username;
  for (const x of ds) {
    assert.ok(!x.lenh.includes(user), `${x.tool_use_id} còn tên người dùng`);
    assert.ok(!x.lenh.includes('/private/tmp/claude-'), `${x.tool_use_id} còn đường scratchpad`);
  }
});

// Kiểm nguồn: rút lại chín lời gọi từ bản ghi và so với tệp ca. Thiếu thư mục bản ghi HAY thiếu một tệp nguồn
// (máy khác, bản ghi bị dọn) → 'bo-qua' kèm số tệp vắng, không ném.
export function tepNguonVang(projects, user = os.userInfo().username) {
  if (!fs.existsSync(projects)) return DANH_SACH.length;
  return DANH_SACH.filter((m) => !fs.existsSync(path.join(projects, m.tep.replace('<u>', user)))).length;
}
test('DP6-03 nguon-thieu-tep', () => {
  const gia = tam('dp6-projects-');
  const m = DANH_SACH[0];
  const p = path.join(gia, m.tep.replace('<u>', os.userInfo().username));
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, '');
  assert.equal(tepNguonVang(path.join(gia, 'khong-co')), DANH_SACH.length, 'thiếu thư mục: mọi tệp vắng');
  const canVang = DANH_SACH.filter((x) => x.tep !== m.tep).length;
  assert.ok(canVang > 0 && canVang < DANH_SACH.length);
  assert.equal(tepNguonVang(gia), canVang, 'có thư mục mà thiếu tệp nguồn: đếm đúng số lời gọi vắng');
});

test('DP6-03 nguon', async () => {
  const projects = path.join(os.homedir(), '.claude', 'projects');
  const vang = tepNguonVang(projects);
  if (vang > 0) {
    console.log(`  bỏ qua: không có bản ghi hội thoại (${vang}/${DANH_SACH.length} tệp nguồn vắng)`);
    return;
  }
  const a = await rut(projects);
  const b = await rut(projects);
  assert.equal(a, b, 'hai lần rút phải giống hệt');
  assert.equal(a, fs.readFileSync(TEP_CA, 'utf8'), 'tệp ca đã commit phải bằng đầu ra script');
  console.log(`  nguồn: ${DANH_SACH.length} lời gọi rút lại khớp tệp ca`);
});

// ---------- DP6-01: vỏ bọc mang cờ (AC-1, E1) ----------
const SCRIPT = [
  ['repin-lane.mjs', 's4'],
  ['s4-args.mjs', 's4'],
  ['duong-nen.mjs', 'duong-nen'],
];
// 41 dạng của design §4 C1 — `<L>` là chỗ lệnh thật `node x/<script> --root .`
export const DANG_VO_BOC = [
  'timeout 900 <L>', 'timeout -s KILL 900 <L>', 'timeout --signal=KILL 900 <L>', 'timeout -k 10 900 <L>',
  'timeout --kill-after=10 900 <L>', 'timeout -f 900 <L>', 'timeout --foreground 900 <L>', 'timeout -p 900 <L>',
  'timeout --preserve-status 900 <L>', 'timeout -v 900 <L>',
  'env A=1 <L>', 'env -i A=1 <L>', 'env -0 A=1 <L>', 'env -u UV_PYTHON <L>', 'env --unset=UV_PYTHON <L>',
  'env -C /tmp <L>', 'env --chdir=/tmp <L>', 'env -P /opt/x <L>', 'env -v <L>', "env -S '<L>'", "env --split-string='<L>'",
  'nice <L>', 'nice -n 10 <L>', 'nice --adjustment=10 <L>',
  'time <L>', 'time -p <L>',
  'nohup <L>',
  'command <L>', 'command -p <L>',
  'exec <L>', 'exec -a ten <L>', 'exec -c <L>', 'exec -l <L>',
  'caffeinate <L>', 'caffeinate -d <L>', 'caffeinate -i <L>', 'caffeinate -m <L>', 'caffeinate -s <L>',
  'caffeinate -u <L>', 'caffeinate -t 3600 <L>', 'caffeinate -w 4242 <L>',
];
const LONG = ['nohup nice -n 5 timeout 900 <L>', 'env -u X caffeinate -i <L>'];
export function maTranVoBoc() {
  const o = [];
  for (const d of [...DANG_VO_BOC, ...LONG]) for (const [s, tn] of SCRIPT) o.push({ ten: `${d} × ${s}`, lenh: d.replace('<L>', `node x/${s} --root .`), ky_vong: tn });
  for (const x of docTepCa().filter((x) => x.nhan !== null)) o.push({ ten: `that:${x.tool_use_id}`, lenh: x.lenh, ky_vong: x.nhan });
  return o;
}
// Tên các ô mà bộ phân loại trả khác kỳ vọng.
const chayMaTran = (phanLoaiLenh, ds) => ds.filter((o) => phanLoaiLenh(o.lenh) !== o.ky_vong).map((o) => o.ten);

test('DP6-01 vo-boc', async () => {
  assert.equal(DANG_VO_BOC.length, 41);
  const ds = maTranVoBoc();
  console.log(`  ma trận vỏ bọc: ${ds.length} ô`);
  assert.equal(ds.length, 132);
  const { phanLoaiLenh } = await nap(GOI, 'phan-loai-s4.mjs');
  assert.deepEqual(chayMaTran(phanLoaiLenh, ds), []);
});

test('DP6-01 hook-chan', () => {
  const { dot, w1, w2 } = khoLienKet();
  const s4 = maTranVoBoc().filter((o) => o.ky_vong === 's4');
  giuKhoa(dot, 'P2', w2);
  const loiKhac = s4.filter((o) => chayHookChanS4({ tool_name: 'Bash', tool_input: { command: o.lenh } }, { cwd: w1 }).ma !== 2).map((o) => o.ten);
  giuKhoa(dot, 'P1', w1);
  const loiMinh = s4.filter((o) => chayHookChanS4({ tool_name: 'Bash', tool_input: { command: o.lenh } }, { cwd: w1 }).ma !== 0).map((o) => o.ten);
  console.log(`  hook thật: ${s4.length} ô s4 — khoá của P2 chặn, khoá của P1 cho qua`);
  assert.deepEqual(loiKhac, [], 'khoá của dãy khác: phải thoát 2');
  assert.deepEqual(loiMinh, [], 'khoá của chính dãy: phải thoát 0 (đối chứng)');
});

test('DP6-01-do bo-timeout', async () => {
  const ds = maTranVoBoc();
  const { phanLoaiLenh: lanh } = await nap(GOI, 'phan-loai-s4.mjs');
  assert.deepEqual(chayMaTran(lanh, ds), [], 'bản lành phải xanh trước');
  const sao = saoGoi();
  tiem(sao, 'phan-loai-s4.mjs', '  timeout: {', '  _timeout_go: {');
  const { phanLoaiLenh } = await nap(sao, 'phan-loai-s4.mjs');
  const can = ds.filter((o) => /(^|[\s;&|])timeout\s/.test(o.lenh)).map((o) => o.ten);
  console.log(`  ô chứa timeout: ${can.length}/${ds.length}`);
  assert.ok(can.length > 0 && can.length < ds.length);
  assert.deepEqual(chayMaTran(phanLoaiLenh, ds), can);
});

test('DP6-01-do caffeinate-t-tran', async () => {
  const ds = maTranVoBoc();
  const { phanLoaiLenh: lanh } = await nap(GOI, 'phan-loai-s4.mjs');
  assert.deepEqual(chayMaTran(lanh, ds), [], 'bản lành phải xanh trước');
  const sao = saoGoi();
  tiem(sao, 'phan-loai-s4.mjs', "caffeinate: { giaTri: ['-t', '-w']", "caffeinate: { giaTri: ['-w']");
  const { phanLoaiLenh } = await nap(sao, 'phan-loai-s4.mjs');
  const can = ds.filter((o) => o.lenh.includes('caffeinate -t')).map((o) => o.ten);
  console.log(`  ô chứa caffeinate -t: ${can.length}`);
  assert.ok(can.length > 0 && can.length < ds.length);
  assert.deepEqual(chayMaTran(phanLoaiLenh, ds), can);
});

// ---------- DP6-02: thân heredoc, cờ chỉ đọc (AC-2, E2) ----------
const HEREDOC = [
  ['nhay-don', (s) => `cat > a.txt <<'EOF'\nnode x/${s} --root .\nEOF`, false],
  ['nhay-kep', (s) => `python3 - <<"PY"\nnode x/${s} --root .\nPY`, false],
  ['tab', (s) => `cat <<-EOF\n\tnode x/${s} --root .\n\tEOF`, false],
  ['thieu-dong', (s) => `cat <<'EOF'\nnode x/${s} --root .`, false],
  ['khong-nhay-thay-lenh', (s) => `cat <<EOF\n$(node x/${s} --root .)\nEOF`, true],
];
const AM_CU = ['grep -n s4-args feature-loop/scripts/*.mjs', 'cat feature-loop/scripts/repin-lane.mjs', 'node --test tests/scripts/repin-lane-lop-cu.test.mjs', 'git grep repin-lane'];
export function maTranChiDoc() {
  const o = [];
  for (const [s, tn] of SCRIPT) {
    o.push({ ten: `--check × ${s}`, lenh: `node --check x/${s}`, ky_vong: null });
    o.push({ ten: `-c × ${s}`, lenh: `node -c x/${s}`, ky_vong: null });
    o.push({ ten: `--help × ${s}`, lenh: `node x/${s} --help`, ky_vong: null });
    for (const [h, f, chay] of HEREDOC) o.push({ ten: `heredoc:${h} × ${s}`, lenh: f(s), ky_vong: chay ? tn : null });
    o.push({ ten: `check-roi-chay × ${s}`, lenh: `node --check x/${s} && node x/${s} --write`, ky_vong: tn });
  }
  for (const x of docTepCa().filter((x) => x.nhan === null)) o.push({ ten: `that:${x.hinh}:${x.tool_use_id}`, lenh: x.lenh, ky_vong: null });
  for (const l of AM_CU) o.push({ ten: `am:${l}`, lenh: l, ky_vong: null });
  return o;
}

test('DP6-02 chi-doc-heredoc', async () => {
  const ds = maTranChiDoc();
  console.log(`  ma trận chỉ đọc + heredoc: ${ds.length} ô`);
  assert.equal(ds.length, 37);
  const { phanLoaiLenh } = await nap(GOI, 'phan-loai-s4.mjs');
  assert.deepEqual(chayMaTran(phanLoaiLenh, ds), []);
  // `<<` trong số học không phải heredoc: không được nuốt các dòng sau.
  assert.equal(phanLoaiLenh('echo $((1<<2))\nnode x/repin-lane.mjs --write'), 's4');
});

test('DP6-02 hook-im', () => {
  const { dot, w1, w2 } = khoLienKet();
  giuKhoa(dot, 'P2', w2);
  const im = maTranChiDoc().filter((o) => o.ky_vong === null);
  const loi = im.filter((o) => {
    const r = chayHookChanS4({ tool_name: 'Bash', tool_input: { command: o.lenh } }, { cwd: w1 });
    return r.ma !== 0 || r.err !== '';
  }).map((o) => o.ten);
  console.log(`  hook thật im với ${im.length} ô chỉ đọc`);
  assert.deepEqual(loi, []);
  for (const [s] of SCRIPT) assert.equal(chayHookChanS4({ tool_name: 'Bash', tool_input: { command: `node x/${s} --root .` } }, { cwd: w1 }).ma, 2, `đối chứng: ${s} trần phải bị chặn`);
});

test('DP6-02 tien-de-help', () => {
  for (const [s] of SCRIPT) {
    const kho = tam('dp6-help-');
    git(kho, 'init', '-q', '-b', 'main');
    git(kho, 'commit', '-q', '--allow-empty', '-m', 'goc');
    const truoc = bamCay(kho);
    const r = spawnSync(process.execPath, [path.join(KIT, 'feature-loop', 'scripts', s), '--root', kho, '--help'], { cwd: kho, env: ENV, encoding: 'utf8' });
    assert.notEqual(r.status, 0, s);
    assert.match(r.stderr, /cờ không nhận diện được/, s);
    assert.equal(bamCay(kho), truoc, `${s} đổi cây kho thử`);
  }
});

async function doDotBien(tep, cu, moi, loc) {
  const ds = maTranChiDoc();
  const { phanLoaiLenh: lanh } = await nap(GOI, 'phan-loai-s4.mjs');
  assert.deepEqual(chayMaTran(lanh, ds), [], 'bản lành phải xanh trước');
  const sao = saoGoi();
  tiem(sao, tep, cu, moi);
  const { phanLoaiLenh } = await nap(sao, 'phan-loai-s4.mjs');
  const can = ds.filter(loc).map((o) => o.ten);
  console.log(`  ô kỳ vọng đỏ: ${can.length}/${ds.length}`);
  assert.ok(can.length > 0 && can.length < ds.length);
  assert.deepEqual(chayMaTran(phanLoaiLenh, ds), can);
}
test('DP6-02-do bo-check', () =>
  doDotBien('phan-loai-s4.mjs', "if (t === '--check' || t === '-c') return null;", '', (o) => /^(--check|-c) × /.test(o.ten) || /^that:chan-nham:check:/.test(o.ten)));
test('DP6-02-do bo-heredoc', () =>
  doDotBien('phan-loai-s4.mjs', 'if (m) {\n        choHeredoc.push(', 'if (false) {\n        choHeredoc.push(', (o) => (o.ten.startsWith('heredoc:') && o.ky_vong === null) || /^that:chan-nham:heredoc:/.test(o.ten)));
test('DP6-02-do bo-thay-lenh', () =>
  doDotBien('phan-loai-s4.mjs', 'if (!h.nhay) for (const con of thayLenhTrong(', 'if (false) for (const con of thayLenhTrong(', (o) => o.ten.startsWith('heredoc:khong-nhay-thay-lenh')));

// ---------- DP6-03: bản cũ sai đúng chín lời gọi thật, bản mới đúng cả chín ----------
test('DP6-03 lech-o-goc', async () => {
  const ds = docTepCa();
  const { phanLoaiLenh: goc } = await nap(goiTaiMergeBase(), 'phan-loai-s4.mjs');
  const { phanLoaiLenh: moi } = await nap(GOI, 'phan-loai-s4.mjs');
  const saiOGoc = ds.filter((x) => goc(x.lenh) !== x.nhan).length;
  const dungBanMoi = ds.filter((x) => moi(x.lenh) === x.nhan).length;
  console.log(`  merge-base sai ${saiOGoc}/${ds.length} · bản mới đúng ${dungBanMoi}/${ds.length}`);
  assert.equal(saiOGoc, 9);
  assert.equal(dungBanMoi, 9);
});

// ---------- DP6-04: lời chặn nêu lệnh xin lượt (AC-4, E4) ----------
const LENH_S4 = { tool_name: 'Bash', tool_input: { command: 'node x/repin-lane.mjs --write' } };
const XIN = /Lệnh xin lượt \(chạy nguyên văn từ worktree của dãy\): (node .+ xin s4)$/m;
function dotCoLoi() {
  const cha = path.join(tam('dp6-'), 'kho $x');
  fs.mkdirSync(cha);
  const k = khoLienKet({ duongCha: cha });
  assert.equal(chayCli(k.kho, ['chay']).ma, 0);
  assert.equal(chayCli(k.kho, ['dung']).ma, 0);
  assert.ok(fs.existsSync(path.join(k.dot, 'loi', 'dieu-phoi.mjs')), 'chay phải chép lõi vào đợt');
  giuKhoa(k.dot, 'P2', k.w2);
  return k;
}

test('DP6-04 loi-chan', () => {
  const { kho, dot, w1 } = dotCoLoi();
  const p1 = chayHookChanS4(LENH_S4, { cwd: w1 });
  assert.equal(p1.ma, 2);
  // Tiền tố cũ và câu «chờ lượt» của DP7 (AC-6) giữ nguyên; DP6 nối thêm đúng lệnh xin lượt.
  assert.match(p1.err, /^chan-s4: khoá s4 đang thuộc P2\. Ghi đơn xin\/<phiên>-s4\.json .* Trong đợt đây là chờ lượt của dãy P1/);
  const m = XIN.exec(p1.err);
  assert.ok(m, `phải nêu lệnh xin lượt: ${p1.err}`);
  assert.ok(m[1].includes(path.join(dot, 'loi', 'dieu-phoi.mjs')), `lệnh phải trỏ lõi của đợt: ${m[1]}`);
  const goc = chayHookChanS4(LENH_S4, { cwd: kho });
  assert.equal(goc.ma, 2);
  assert.match(goc.err, /^chan-s4: khoá s4 đang thuộc P2\. Ghi đơn xin\/<phiên>-s4\.json/);
  assert.ok(!goc.err.includes('Lệnh xin lượt'), 'ngoài dãy không nêu lệnh xin');
});

test('DP6-04 round-trip', async () => {
  const { dot, w1 } = dotCoLoi();
  const lenh = XIN.exec(chayHookChanS4(LENH_S4, { cwd: w1 }).err)[1];
  const r = spawnSync('bash', ['-c', lenh], { cwd: w1, env: ENV, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(fs.readdirSync(path.join(dot, 'xin')), ['P1-s4.json']);
  const { kiemDon } = await nap(GOI, 'hinh-dang.mjs');
  kiemDon(docJ(path.join(dot, 'xin', 'P1-s4.json')));
});

test('DP6-04 khong-loi', () => {
  const { dot, w1, w2 } = khoLienKet();
  assert.ok(!fs.existsSync(path.join(dot, 'loi')), 'đợt chưa chay: chưa có lõi');
  giuKhoa(dot, 'P2', w2);
  const lenh = XIN.exec(chayHookChanS4(LENH_S4, { cwd: w1 }).err)?.[1];
  assert.ok(lenh?.includes(path.join(GOI, 'scripts', 'dieu-phoi.mjs')), `lệnh phải trỏ lõi gói: ${lenh}`);
  const r = spawnSync('bash', ['-c', lenh], { cwd: w1, env: ENV, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  assert.ok(fs.existsSync(path.join(dot, 'xin', 'P1-s4.json')));
});

test('DP6-04 hang-viec-hong', () => {
  const { dot, w1, w2 } = khoLienKet();
  giuKhoa(dot, 'P2', w2);
  fs.rmSync(path.join(dot, 'hang-viec.json'));
  const r = chayHookChanS4(LENH_S4, { cwd: w1 });
  assert.equal(r.ma, 2);
  // `xin` cần hang-viec.json để biết dãy, nên lời chặn giữ lời dặn cũ, không nêu lệnh xin — và `xin` thật sự từ chối ở đây.
  assert.match(r.err, /^chan-s4: khoá s4 đang thuộc P2\. Ghi đơn xin\/<phiên>-s4\.json/);
  assert.ok(!r.err.includes('Lệnh xin lượt'), r.err);
  assert.notEqual(chayCli(w1, ['xin', 's4']).ma, 0, 'đối chứng: lệnh xin không chạy được khi hang-viec.json vắng');
});

test('DP6-04 duong-dau-cach', () => {
  // Đường chỉ có dấu cách (không ký tự đặc biệt) vẫn phải được bọc nháy để lệnh in ra chạy được.
  const cha = path.join(tam('dp6-'), 'kho x');
  fs.mkdirSync(cha);
  const { kho, dot, w1, w2 } = khoLienKet({ duongCha: cha });
  assert.equal(chayCli(kho, ['chay']).ma, 0);
  assert.equal(chayCli(kho, ['dung']).ma, 0);
  giuKhoa(dot, 'P2', w2);
  const lenh = XIN.exec(chayHookChanS4(LENH_S4, { cwd: w1 }).err)?.[1];
  const r = spawnSync('bash', ['-c', lenh], { cwd: w1, env: ENV, encoding: 'utf8' });
  assert.equal(r.status, 0, `${lenh} → ${r.stderr}`);
  assert.ok(fs.existsSync(path.join(dot, 'xin', 'P1-s4.json')));
});

// ---------- DP6-05: hộp xin quyền luôn thành việc chờ người (AC-5, E5) ----------
const MA_TRAN_CHO = [
  ['permission_prompt', 'khong', true],
  ['permission_prompt', 'don', true],
  ['permission_prompt', 'yeu-cau', true],
  ['idle_prompt', 'khong', true],
  ['idle_prompt', 'don', false],
  ['idle_prompt', 'yeu-cau', false],
];
async function chayMaTranCho(gocGoi = GOI) {
  const sai = [];
  for (const [loai, trangThai, canGhi] of MA_TRAN_CHO) {
    const { dot, w1 } = khoLienKet({ gocGoi });
    if (trangThai === 'don') ghiJ(path.join(dot, 'xin', 'P1-s4.json'), { phien: 'P1', slug: 'hang-a', loai: 's4', luc: new Date().toISOString(), worktree: w1 });
    if (trangThai === 'yeu-cau') ghiJ(path.join(dot, 'yeu-cau', 'P1-1.json'), { phien: 'P1', loai: 'cham-tep', hang: null, noi_dung: { tep: ['a'] }, luc: new Date().toISOString() });
    chayHookChoNguoi(w1, loai, { gocGoi });
    if (fs.existsSync(path.join(dot, 'cho-nguoi', 'P1.json')) !== canGhi) sai.push(`(${loai}, ${trangThai})`);
  }
  return sai;
}
test('DP6-05 ma-tran', async () => {
  console.log(`  ma trận chờ người: ${MA_TRAN_CHO.length} hàng`);
  assert.equal(MA_TRAN_CHO.length, 6);
  assert.deepEqual(await chayMaTranCho(), []);
});
test('DP6-05-do tra-som', async () => {
  assert.deepEqual(await chayMaTranCho(), [], 'bản lành phải xanh trước');
  const sao = saoGoi();
  tiem(sao, 'hook-cho-nguoi.mjs', "if (dauVao.notification_type !== 'permission_prompt') {", 'if (true) {');
  assert.deepEqual(await chayMaTranCho(sao), ['(permission_prompt, don)', '(permission_prompt, yeu-cau)']);
});

// ---------- DP6-06: sự kiện cho-nguoi mang can_phan — Monitor thức (AC-6, E6) ----------
// Bộ lọc Monitor rút nguyên văn từ thân lệnh người — không chép tay.
export function boLocMonitor(gocGoi = GOI) {
  const ra = [];
  for (const tep of ['mo-dot.md', 'tiep-tuc.md']) {
    const t = fs.readFileSync(path.join(gocGoi, 'commands', tep), 'utf8');
    for (const m of t.matchAll(/tail -n0 -F [^|`]*\| grep --line-buffered '([^']+)'/g)) ra.push({ tep, mau: m[1] });
  }
  return ra;
}
const khopGrep = (mau, dong) => spawnSync('grep', ['--line-buffered', mau], { input: `${dong}\n`, encoding: 'utf8' }).status === 0;
const dongChoNguoi = (dot) =>
  (fs.existsSync(path.join(dot, 'su-kien.jsonl')) ? fs.readFileSync(path.join(dot, 'su-kien.jsonl'), 'utf8').split('\n') : []).filter((d) => d.includes('"loai":"cho-nguoi"'));

// Hook thật → nhịp thật → dòng su-kien; trả danh sách lỗi (rỗng = đạt).
async function roundTripChoNguoi(gocGoi = GOI) {
  const loi = [];
  const { dot, w1 } = khoLienKet({ gocGoi });
  chayHookChoNguoi(w1, 'permission_prompt', { gocGoi, tin: 'x'.repeat(300) });
  await motNhipThat(dot, gocGoi);
  await motNhipThat(dot, gocGoi);
  const dong = dongChoNguoi(dot);
  if (dong.length !== 1) return [`số dòng cho-nguoi ${dong.length}, cần 1`];
  const e = JSON.parse(dong[0]);
  if (e.phien !== 'P1') loi.push(`phien ${e.phien}`);
  if (e.loai_cho !== 'permission_prompt') loi.push(`loai_cho ${e.loai_cho}`);
  if (typeof e.tin !== 'string' || e.tin.length > 200) loi.push(`tin dài ${e.tin?.length}`);
  const bl = boLocMonitor(gocGoi);
  if (bl.length !== 2) loi.push(`rút được ${bl.length} bộ lọc Monitor, cần 2`);
  for (const { tep, mau } of bl) if (!khopGrep(mau, dong[0])) loi.push(`bộ lọc Monitor không khớp: ${tep}`);
  const { viecCho } = await nap(gocGoi, 'viec-cho.mjs');
  const cho = viecCho(dot).filter((v) => v.loai === 'cho-nguoi');
  if (cho.length !== 1 || cho[0].id !== 'P1') loi.push(`viecCho: ${JSON.stringify(cho)}`);
  return loi;
}

test('DP6-06 round-trip', async () => {
  assert.deepEqual(await roundTripChoNguoi(), []);
});

test('DP6-06 nang-cap', async () => {
  const goc = goiTaiMergeBase();
  const { dot, w2 } = khoLienKet({ gocGoi: goc });
  chayHookChoNguoi(w2, 'permission_prompt', { gocGoi: goc });
  await motNhipThat(dot, goc);
  const n0 = dongChoNguoi(dot).length;
  const t0 = docJ(path.join(dot, 'trang-thai.json')).nhip_cuoi;
  await new Promise((x) => setTimeout(x, 5));
  await motNhipThat(dot);
  const t1 = docJ(path.join(dot, 'trang-thai.json')).nhip_cuoi;
  console.log(`  bản cũ báo ${n0} dòng · nhịp ${t0} → ${t1}`);
  assert.ok(Date.parse(t1) > Date.parse(t0), 'nhịp bản mới phải tiến');
  assert.equal(dongChoNguoi(dot).length, n0, 'tệp bản cũ đã báo không được báo lại');
  fs.rmSync(path.join(dot, 'cho-nguoi', 'P2.json'));
  await motNhipThat(dot);
  chayHookChoNguoi(w2, 'permission_prompt');
  await motNhipThat(dot);
  const dong = dongChoNguoi(dot);
  assert.equal(dong.length, n0 + 1, 'tệp chờ người mới phải sinh đúng một dòng');
  const e = JSON.parse(dong.at(-1));
  assert.deepEqual([e.can_phan, e.phien], [true, 'P2']);
});

test('DP6-06-do bo-can-phan', async () => {
  assert.deepEqual(await roundTripChoNguoi(), [], 'bản lành phải xanh trước');
  const sao = saoGoi();
  tiem(sao, 'phat-lich.mjs', 'can_phan: true,\n        loai_cho', 'loai_cho');
  const loi = await roundTripChoNguoi(sao);
  assert.ok(loi.includes('bộ lọc Monitor không khớp: mo-dot.md'), loi.join(' | '));
  assert.ok(loi.includes('bộ lọc Monitor không khớp: tiep-tuc.md'), loi.join(' | '));
});

// ---------- DP6-07: không vỡ hàng trước, lõi không đổi, kho không đợt im (AC-7, E7) ----------
const mergeBase = () => {
  for (const nhanh of ['origin/main', 'main']) {
    try {
      return execFileSync('git', ['merge-base', 'HEAD', nhanh], { cwd: KIT, env: ENV, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    } catch {}
  }
  assert.fail('không tìm được merge-base');
};
const TEN_CA = /\btest\(\s*['"`](DP[1-9]-[^'"`]+)['"`]/g;
function tenCaKhai(doc) {
  const ra = new Set();
  for (const tep of doc.danhSach()) for (const m of doc.noiDung(tep).matchAll(TEN_CA)) ra.add(m[1]);
  return ra;
}

test('DP6-07 ten-ca-cu', () => {
  const mb = mergeBase();
  const ds = (ref) => execFileSync('git', ['ls-tree', '-r', '--name-only', ref, 'tests/dieu-phoi'], { cwd: KIT, env: ENV, encoding: 'utf8' }).split('\n').filter((p) => p.endsWith('.test.mjs'));
  const cu = tenCaKhai({ danhSach: () => ds(mb), noiDung: (p) => execFileSync('git', ['show', `${mb}:${p}`], { cwd: KIT, env: ENV, encoding: 'utf8', maxBuffer: 1 << 26 }) });
  const moi = tenCaKhai({ danhSach: () => ds('HEAD').concat(['tests/dieu-phoi/lop-mod.test.mjs']), noiDung: (p) => fs.readFileSync(path.join(KIT, p), 'utf8') });
  console.log(`  tên ca DP ở merge-base: ${cu.size} · ở cây hiện tại: ${moi.size}`);
  assert.ok(cu.size > 0, 'rút 0 tên ca ở merge-base — phép rút hỏng');
  assert.deepEqual([...cu].filter((t) => !moi.has(t)), []);
});

test('DP6-07 loi-nguyen', () => {
  const r = spawnSync('git', ['diff', '--quiet', mergeBase(), '--', 'tests/dieu-phoi/loi/', 'tests/dieu-phoi/dong-goi.test.mjs'], { cwd: KIT, env: ENV });
  assert.equal(r.status, 0, 'tests/dieu-phoi/loi/ và dong-goi.test.mjs phải không đổi so với merge-base');
});

test('DP6-07 khong-dot', () => {
  const kho = tam('dp6-trong-');
  git(kho, 'init', '-q', '-b', 'main');
  git(kho, 'commit', '-q', '--allow-empty', '-m', 'goc');
  const truoc = bamCay(kho);
  const chan = chayHookChanS4(LENH_S4, { cwd: kho });
  const r = spawnSync('sh', ['-c', lenhHook(GOI, 'Notification')], { cwd: kho, env: ENV, input: JSON.stringify({ cwd: kho, hook_event_name: 'Notification', notification_type: 'permission_prompt', message: 'x' }), encoding: 'utf8' });
  assert.deepEqual([chan.ma, chan.err, r.status, r.stderr], [0, '', 0, '']);
  assert.equal(bamCay(kho), truoc, 'kho không đợt: hook không tạo gì');
  const { dot, w1, w2 } = khoLienKet();
  giuKhoa(dot, 'P2', w2);
  assert.equal(chayHookChanS4(LENH_S4, { cwd: w1 }).ma, 2, 'đối chứng: kho có đợt và khoá của dãy khác thì chặn');
});

// ---------- DP6-02 khong-lot: luật heredoc không mở lối lọt mới (soát toàn nhánh, lượt sửa) ----------
// Mỗi ô là một lời gọi S4/đường nền THẬT mà bộ phân loại ở merge-base chặn được; luật heredoc không được làm nó lọt.
export const MA_TRAN_KHONG_LOT = [
  ['here-string', 'read a <<<"$x"\nnode x/repin-lane.mjs --write', 's4'],
  ['here-string-chu', 'cat <<< hello\nnode x/repin-lane.mjs', 's4'],
  ['bash-nhay', "bash <<'EOF'\nnode x/repin-lane.mjs --write\nEOF", 's4'],
  ['bash-khong-nhay', 'bash <<EOF\nnode x/repin-lane.mjs\nEOF', 's4'],
  ['sh-s', 'sh -s <<EOF\nnode x/s4-args.mjs\nEOF', 's4'],
  ['ong-bash', "cat <<'EOF' | bash\nnode x/duong-nen.mjs\nEOF", 'duong-nen'],
  ['node-stdin', "node --input-type=module <<'EOF'\nimport('./repin-lane.mjs')\nEOF", 's4'],
  ['so-hoc-gan', 'x=$((1<<n))\nnode x/repin-lane.mjs', 's4'],
  ['so-hoc-lenh', '(( m = 1 << shift ))\nnode x/repin-lane.mjs', 's4'],
  ['chu-thich', '# dùng <<EOF ở dưới\nnode x/repin-lane.mjs', 's4'],
  ['dau-dong-gach', 'cat <<EOF-X\nhello\nEOF-X\nnode x/repin-lane.mjs', 's4'],
  ['bash-co-tep', "bash chay.sh <<'EOF'\nnode x/repin-lane.mjs\nEOF", null],
  ['bash-o-pipefail', "bash -o pipefail <<'EOF'\nnode x/repin-lane.mjs\nEOF", 's4'],
  ['bash-euo', 'bash -euo pipefail <<EOF\nnode x/s4-args.mjs\nEOF', 's4'],
  ['bash-rcfile', "bash --rcfile r.sh <<'EOF'\nnode x/duong-nen.mjs\nEOF", 'duong-nen'],
];
const maTranKhongLot = () => MA_TRAN_KHONG_LOT.map(([ten, lenh, ky_vong]) => ({ ten, lenh, ky_vong }));

test('DP6-02 khong-lot', async () => {
  const ds = maTranKhongLot();
  console.log(`  ma trận chống lọt: ${ds.length} ô`);
  assert.equal(ds.length, 15);
  const { phanLoaiLenh } = await nap(GOI, 'phan-loai-s4.mjs');
  assert.deepEqual(chayMaTran(phanLoaiLenh, ds), []);
  // Ô dương của ma trận là lời gọi bộ phân loại ở merge-base cũng chặn (luật mới không được kém hơn).
  const { phanLoaiLenh: goc } = await nap(goiTaiMergeBase(), 'phan-loai-s4.mjs');
  assert.deepEqual(ds.filter((o) => o.ky_vong !== null && goc(o.lenh) !== o.ky_vong).map((o) => o.ten), []);
});

async function doDotBienKhongLot(cu, moi, can) {
  const ds = maTranKhongLot();
  const { phanLoaiLenh: lanh } = await nap(GOI, 'phan-loai-s4.mjs');
  assert.deepEqual(chayMaTran(lanh, ds), [], 'bản lành phải xanh trước');
  const sao = saoGoi();
  tiem(sao, 'phan-loai-s4.mjs', cu, moi);
  const { phanLoaiLenh } = await nap(sao, 'phan-loai-s4.mjs');
  assert.deepEqual(chayMaTran(phanLoaiLenh, ds), can);
}
test('DP6-02-do bo-here-string', () =>
  doDotBienKhongLot("if (c === '<' && lenh[i + 1] === '<' && lenh[i + 2] === '<') {", "if (false) {", ['here-string-chu']));
test('DP6-02-do bo-trinh-thong-dich', () =>
  doDotBienKhongLot('const dt = doThongDich(doan.slice(dauDong));', 'const dt = null;', ['bash-nhay', 'bash-khong-nhay', 'sh-s', 'ong-bash', 'node-stdin', 'bash-o-pipefail', 'bash-euo', 'bash-rcfile']));
test('DP6-02-do bo-so-hoc', () =>
  doDotBienKhongLot("if (c === '(' && lenh[i + 1] === '(') {", "if (false) {", ['so-hoc-gan', 'so-hoc-lenh']));
