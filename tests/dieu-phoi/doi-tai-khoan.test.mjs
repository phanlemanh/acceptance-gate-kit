// Ca đo của hồ sơ dieu-phoi-doi-tai-khoan (DP4). Tên ca bắt đầu «DP4-». Kho thử do mã sinh, có worktree LIÊN KẾT
// thật (git worktree add) cho từng dãy; đường suy từ vị trí tệp; đồng hồ giả qua tham số hoặc biến DIEU_PHOI_NOW_MS
// (hook và CLI là tiến trình con). Mỗi ca đỏ chạy CHÍNH hàm đo trên bản sao bị tiêm, sau khi bản lành xanh trên cùng
// fixture, kiểm bước tiêm đã áp, và ghim dấu hiệu của đúng lỗi được tiêm. Khung kho thử chép từ tiep-tuc.test.mjs
// (không import tệp test đã ký: import chạy lại mọi ca của nó — sổ DP4 d-…-24).
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

const MAY_TAM = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'dp4-may-')));
process.env.DIEU_PHOI_MAY_DIR = MAY_TAM;

const canDon = [MAY_TAM];
after(() => {
  for (const d of canDon) fs.rmSync(d, { recursive: true, force: true });
});
const tam = (tienTo = 'dp4-') => {
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
const bamTep = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
function bamCay(goc) {
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
function chayCli(cwd, doiSo, { gocGoi = GOI, env = {} } = {}) {
  const r = spawnSync(process.execPath, [CLI(gocGoi), ...doiSo], { cwd, env: { ...ENV, ...env }, encoding: 'utf8' });
  return { ma: r.status, out: r.stdout, err: r.stderr };
}
const PHUT = 60_000;
const GIO = Date.parse('2026-10-11T08:00:00Z');

// Kho thử + hai worktree liên kết thật cho P1, P2 + gói đợt khai qua cấu hình + đợt «thu» mở bằng CLI thật rồi đặt
// pha dang-chay. `cauHinh` ghi đè từng khoá của khuôn cấu hình đợt. Trả đường đã realpath.
function khoLienKet({ gocGoi = GOI, hang = null, cauHinh = {} } = {}) {
  const kho = tam('dp4-kho-');
  git(kho, 'init', '-q', '-b', 'main');
  git(kho, 'commit', '-q', '--allow-empty', '-m', 'goc');
  const cha = tam('dp4-wt-');
  const w1 = path.join(cha, 'p1');
  const w2 = path.join(cha, 'p2');
  git(kho, 'worktree', 'add', '-q', '-b', 'p1', w1);
  git(kho, 'worktree', 'add', '-q', '-b', 'p2', w2);
  for (const w of [kho, w1, w2]) {
    execFileSync('git', ['config', 'user.name', 't'], { cwd: w, env: ENV });
    execFileSync('git', ['config', 'user.email', 't@t'], { cwd: w, env: ENV });
  }
  const dir = path.join(kho, 'goi', 'dot-thu');
  ghiJ(path.join(dir, 'dieu-phoi.config.json'), { ...docJ(path.join(GOI, 'scripts', 'mau', 'dieu-phoi.config.json')), ...cauHinh });
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
  assert.equal(chayCli(kho, ['pha', 'dang-chay', '--boi', 't', '--ly-do', 'thu'], { gocGoi }).ma, 0);
  const dot = fs.realpathSync(path.join(kho, '.acceptance-runs', 'dieu-phoi-hien-tai'));
  return { kho, dot, w1: fs.realpathSync(w1), w2: fs.realpathSync(w2) };
}

// Lệnh hook của gói, rút từ hooks.json (thay ${CLAUDE_PLUGIN_ROOT}).
function lenhHook(gocGoi, suKien, matcher = null) {
  const hj = docJ(path.join(gocGoi, 'hooks', 'hooks.json'));
  const muc = hj.hooks[suKien].find((m) => matcher == null || m.matcher === matcher);
  return muc.hooks[0].command.split('${CLAUDE_PLUGIN_ROOT}').join(gocGoi);
}
function chayHook(suKien, dauVao, { cwd, nowMs = null, gocGoi = GOI } = {}) {
  const env = { ...ENV };
  if (nowMs != null) env.DIEU_PHOI_NOW_MS = String(nowMs);
  return spawnSync('sh', ['-c', lenhHook(gocGoi, suKien)], { cwd, env, input: JSON.stringify({ cwd, hook_event_name: suKien, ...dauVao }), encoding: 'utf8' });
}
const ioGia = (nowMs) => ({
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
async function motNhip(dot, nowMs, gocGoi = GOI) {
  const { taoVong } = await nap(gocGoi, 'phat-lich.mjs');
  await taoVong(dot, ioGia(nowMs), () => nowMs)();
}
const suKienCua = (dot) => (fs.existsSync(path.join(dot, 'su-kien.jsonl')) ? fs.readFileSync(path.join(dot, 'su-kien.jsonl'), 'utf8').split('\n').filter(Boolean).map((d) => JSON.parse(d)) : []);

// Đặt thẳng ô xuất phát của một ca (fixture, không phải vật đo): pha + khối ban_giao khi là pha ★.
const PHA_SAO_THU = new Set(['dang-ban-giao', 'cho-tiep-tuc']);
function datTruc(dot, pha, { phaTruoc = 'dang-chay', vaoLuc = '2026-10-11T07:50:00.000Z' } = {}) {
  const p = path.join(dot, 'dieu-khien.json');
  const dk = docJ(p);
  const { ban_giao: _bo, ...con } = dk;
  ghiJ(p, {
    ...con,
    pha,
    ...(PHA_SAO_THU.has(pha) ? { ban_giao: { ma: 'bg-20261011T075000Z', pha_truoc: phaTruoc, vao_luc: vaoLuc, ly_do: 'thu', boi: 'thu' } } : {}),
    lich_su: [{ pha, dat_boi: 'thu', dat_luc: vaoLuc, ly_do: 'thu' }],
  });
}

// ---------- DP4-01: hai pha ★ trong bảng chuyển (AC-1, E1) ----------
const PHA6 = ['nhap', 'dang-chay', 'tam-dung', 'dang-dong', 'dang-ban-giao', 'cho-tiep-tuc'];
// Chép từ AC-1 — KHÔNG rút từ CHUYEN của mã.
const CANH_AC1 = new Set([
  'nhap>dang-chay', 'dang-chay>tam-dung', 'dang-chay>dang-dong', 'tam-dung>dang-chay', 'tam-dung>dang-dong',
  'dang-chay>dang-ban-giao', 'tam-dung>dang-ban-giao', 'dang-ban-giao>cho-tiep-tuc',
  'cho-tiep-tuc>dang-chay', 'cho-tiep-tuc>tam-dung', 'cho-tiep-tuc>dang-dong',
]);

test('DP4-01 bang-chuyen', () => {
  const { kho, dot } = khoLienKet();
  const p = path.join(dot, 'dieu-khien.json');
  const dong = [];
  for (const tu of PHA6) {
    for (const sang of PHA6) {
      datTruc(dot, tu);
      const bam = bamTep(p);
      const dai = docJ(p).lich_su.length;
      const r = chayCli(kho, ['pha', sang, '--boi', 't']);
      const mong = tu === sang ? 'cheo' : CANH_AC1.has(`${tu}>${sang}`) ? 'hop-le' : 'tu-choi';
      let thuc;
      if (r.ma === 0) {
        const n = docJ(p).lich_su.length;
        thuc = n === dai + 1 && docJ(p).pha === sang ? 'hop-le' : n === dai && bamTep(p) === bam ? 'cheo' : `la(${n})`;
      } else thuc = bamTep(p) === bam ? 'tu-choi' : 'tu-choi-nhung-ghi';
      dong.push(`${tu}>${sang} · ${mong} · ${thuc}`);
    }
  }
  console.log(dong.map((d) => `  ${d}`).join('\n'));
  assert.equal(dong.length, 36);
  assert.deepEqual(dong.filter((d) => { const [, m, t] = d.split(' · '); return m !== t; }), []);
});

test('DP4-01 vao-ban-giao', () => {
  const { kho, dot } = khoLienKet();
  const r = chayCli(kho, ['pha', 'dang-ban-giao', '--boi', 't', '--ly-do', 'đổi tài khoản']);
  assert.equal(r.ma, 0, r.err);
  const dk = docJ(path.join(dot, 'dieu-khien.json'));
  console.log(`  ban_giao: ${JSON.stringify(dk.ban_giao)}`);
  assert.match(dk.ban_giao?.ma ?? '', /^bg-\d{8}T\d{6}Z$/);
  assert.equal(dk.ban_giao.pha_truoc, 'dang-chay');
  assert.equal(dk.ban_giao.ly_do, 'đổi tài khoản');
  assert.equal(chayCli(kho, ['pha', 'cho-tiep-tuc', '--boi', 't']).ma, 0);
  assert.equal(docJ(path.join(dot, 'dieu-khien.json')).ban_giao?.ma, dk.ban_giao.ma, 'cho-tiep-tuc giữ khối ban_giao');
  assert.equal(chayCli(kho, ['pha', 'dang-chay', '--boi', 't']).ma, 0);
  assert.equal(docJ(path.join(dot, 'dieu-khien.json')).ban_giao, undefined, 'rời pha ★ gỡ khối ban_giao');
});

// Một nhịp thật ở pha `pha` với một đơn s4 lành chờ: trả lỗi khi khoá được cấp hoặc đơn bị đụng.
export async function kiemKhongCap(gocGoi, pha) {
  process.env.DIEU_PHOI_MAY_DIR = tam('dp4-may-'); // khoá s4 cấp máy riêng cho ca này
  const { dot, w1 } = khoLienKet({ gocGoi });
  const r = chayCli(w1, ['xin', 's4'], { gocGoi });
  assert.equal(r.ma, 0, r.err);
  datTruc(dot, pha);
  const bamXin = bamCay(path.join(dot, 'xin'));
  await motNhip(dot, Date.now(), gocGoi);
  const loi = [];
  if (fs.existsSync(path.join(dot, 'khoa', 's4', 'chu.json'))) loi.push(`${pha}: nhịp cấp khoá s4`);
  if (bamCay(path.join(dot, 'xin')) !== bamXin) loi.push(`${pha}: đơn trong xin/ bị đụng`);
  return loi;
}

test('DP4-01 khong-cap', async () => {
  for (const pha of ['dang-ban-giao', 'cho-tiep-tuc']) assert.deepEqual(await kiemKhongCap(GOI, pha), [], pha);
  const doiChung = await kiemKhongCap(GOI, 'dang-chay');
  console.log(`  đối chứng dang-chay: ${doiChung.join(' · ')}`);
  assert.deepEqual(doiChung, ['dang-chay: nhịp cấp khoá s4', 'dang-chay: đơn trong xin/ bị đụng'], 'đối chứng dương: dang-chay phải cấp');
});

test('DP4-01-do cap-o-ban-giao', async () => {
  const sao = tam('dp4-goi-');
  fs.cpSync(GOI, sao, { recursive: true });
  const p = path.join(sao, 'scripts', 'phat-lich.mjs');
  const goc = fs.readFileSync(p, 'utf8');
  const tiem = goc.replace("(pha, taiNguyen) => pha === 'dang-chay' ||", "(pha, taiNguyen) => pha === 'dang-chay' || pha === 'dang-ban-giao' ||");
  assert.notEqual(tiem, goc, 'bước tiêm không áp được');
  fs.writeFileSync(p, tiem);
  const loi = await kiemKhongCap(sao, 'dang-ban-giao');
  console.log(`  bản tiêm: ${loi.join(' · ')}`);
  assert.ok(loi.includes('dang-ban-giao: nhịp cấp khoá s4'), loi.join(' | '));
});
