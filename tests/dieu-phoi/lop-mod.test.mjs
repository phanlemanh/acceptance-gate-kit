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

test('DP6-03 nguon', async () => {
  const projects = path.join(os.homedir(), '.claude', 'projects');
  if (!fs.existsSync(projects)) {
    console.log('  bỏ qua: không có bản ghi hội thoại');
    return;
  }
  const a = await rut(projects);
  const b = await rut(projects);
  assert.equal(a, b, 'hai lần rút phải giống hệt');
  assert.equal(a, fs.readFileSync(TEP_CA, 'utf8'), 'tệp ca đã commit phải bằng đầu ra script');
  console.log(`  nguồn: ${DANH_SACH.length} lời gọi rút lại khớp tệp ca`);
});
