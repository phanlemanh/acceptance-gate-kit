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
  const dir = path.join(kho, 'goi', 'dot-thu');
  ghiJ(path.join(dir, 'dieu-phoi.config.json'), docJ(path.join(GOI, 'scripts', 'mau', 'dieu-phoi.config.json')));
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
  return { kho, dot, w1: fs.realpathSync(w1), w2: fs.realpathSync(w2) };
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

test('DP3-02 tep-hong', async () => {
  const { dot, w1 } = khoLienKet();
  hookNhip({ session_id: 's-p1' }, { cwd: w1, nowMs: GIO });
  fs.writeFileSync(path.join(dot, 'song', 's-hong.json'), '{ hong');
  const { docNhipSong } = await nap(GOI, 'song.mjs');
  assert.deepEqual(docNhipSong(dot).map((n) => n.phien), ['s-p1']);
});
