// Hồ sơ sua-loi-dau-chu-dong-vao (issue #477, đợt dau-chu-dong-vao của onehub-quy-hang). Ca «SD-<n>» = AC-<n>.
// Đợt thử và kho thử do code sinh trong lượt (git init trong thư mục tạm; SD-5 thêm origin trần, chỉ gh là giả). CLI
// `dieu-phoi.mjs` chạy thật bằng tiến trình con. Mỗi ca có đối chứng dương trên CÙNG fixture; chiều đỏ nằm trong lịch sử
// (commit ca đứng trước commit vật). Đường dẫn suy từ vị trí tệp.
//   node --test --test-name-pattern=SD-4 tests/dieu-phoi/sua-loi-dau-chu-dong-vao.test.mjs
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chonHangKe, hangKeTuTiep } from '../../dieu-phoi/scripts/lich.mjs';
import { gop } from '../../dieu-phoi/scripts/gop.mjs';
import { motNhip } from '../../dieu-phoi/scripts/phat-lich.mjs';
import { CFG_PHAT_LICH, hangViecHai } from './loi/mau-thu.mjs';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const GOI = path.resolve(DAY, '..', '..', 'dieu-phoi');
const CLI = path.join(GOI, 'scripts', 'dieu-phoi.mjs');
const canDon = [];
after(() => {
  for (const d of canDon) fs.rmSync(d, { recursive: true, force: true });
});
const tam = () => {
  const d = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'sd-')));
  canDon.push(d);
  return d;
};
const docJ = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const ghiJ = (p, du) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(du));
};
const moiTruongSach = () => Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_') && k !== 'NODE_TEST_CONTEXT'));
const git = (cwd, ...a) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { cwd, env: moiTruongSach(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const suKien = (dot) => fs.readFileSync(path.join(dot, 'su-kien.jsonl'), 'utf8').trim().split('\n').map((d) => JSON.parse(d));

// io giả của bộ phát lịch: số đo máy cố định; `git show origin/<nhánh chính>:_acceptance/<slug>/contract.md` trả hợp đồng
// đã thông cho slug trong `gop`, ném cho slug khác (chưa gộp).
const NOW = Date.parse('2026-10-05T12:00:00Z');
const ioLich = (nhanh, gopSlugs = []) => ({
  nowMs: () => NOW,
  chay: (cmd, args) => {
    if (cmd === 'sysctl' && args[0] === 'vm.swapusage') return 'total = 24576.00M  used = 1024.00M  free = 1.00M';
    if (cmd === 'sysctl' && args.includes('kern.memorystatus_vm_pressure_level')) return '1';
    if (cmd === 'sysctl') return '{ 3.00 2.00 1.00 }';
    if (cmd === 'ps') return '102400 node\n';
    if (cmd === 'gh') return '[]';
    if (cmd === 'git' && args[0] === 'show') {
      const s = gopSlugs.find((x) => args[1] === `origin/${nhanh}:_acceptance/${x}/contract.md`);
      if (s) return `---\nslug: ${s}\nstatus: signed-off\n---\n`;
      throw new Error('not found');
    }
    return '';
  },
});
// Đợt của bộ phát lịch (khuôn phat-lich.test.mjs): hai dãy, hàng a (P1) và b (P2); `sauA` gắn vào hàng a.
function dotLich({ sauA = null } = {}) {
  const dot = tam();
  const w1 = tam();
  const w2 = tam();
  const hv = hangViecHai({ dot: 'thu', w1, w2 });
  if (sauA) hv.hang[0].sau = sauA;
  ghiJ(path.join(dot, 'dieu-phoi.config.json'), CFG_PHAT_LICH);
  ghiJ(path.join(dot, 'hang-viec.json'), hv);
  for (const t of ['khoa', 'xin', 'yeu-cau', 'tra-loi', 'cho-nguoi', 'tiep']) fs.mkdirSync(path.join(dot, t), { recursive: true });
  return { dot, w1 };
}

// ── SD-1, SD-2: bộ chọn hàng kế ─────────────────────────────────────────────────────────────────────────────────────
const hv = (sauC) => ({
  day: [{ id: 'P1' }, { id: 'P2' }],
  hang: [
    { ma: 'B', slug: 'b', day: 'P2', uu_tien: 1 },
    { ma: 'C', slug: 'c', day: 'P1', uu_tien: 1, sau: sauC },
  ],
});

test('SD-1 sau trỏ SLUG của hàng mang mã — hàng trước gộp thì hàng sau được giao', () => {
  const gop = new Map([['b', 'gop']]);
  assert.deepEqual(chonHangKe(hv(['b']), 'P1', gop), { hang: 'c', moi: true });
  // Đối chứng cùng fixture: hàng trước chưa gộp → chờ phụ thuộc.
  assert.deepEqual(chonHangKe(hv(['b']), 'P1', new Map([['b', 'ky']])), { hang: null, cho: 'phu-thuoc' });
  // Lối cũ không đổi: sau khai bằng mã.
  assert.deepEqual(chonHangKe(hv(['B']), 'P1', gop), { hang: 'c', moi: true });
});

test('SD-2 sau trỏ hàng không tồn tại — phán quyết không đổi, cờ vàng đi qua tiep/<dãy>.json', async () => {
  const { dot } = dotLich({ sauA: ['zzz'] });
  await motNhip(dot, ioLich(CFG_PHAT_LICH.nhanh_chinh));
  const tiep = docJ(path.join(dot, 'tiep', 'P1.json'));
  assert.equal(tiep.hang, null);
  assert.equal(tiep.cho, 'phu-thuoc');
  assert.deepEqual(tiep.sau_khong_co, ['a→zzz']);
  const ke = hangKeTuTiep(tiep, docJ(path.join(dot, 'hang-viec.json')), 'P1');
  assert.equal(ke.hang, null);
  assert.match(ke.ly_do, /sau trỏ hàng không có: a→zzz/);
  // Đối chứng: sau trỏ hàng có thật mà chưa gộp → chờ phụ thuộc, không cờ.
  const kq = chonHangKe(hv(['b']), 'P1', new Map());
  assert.equal(kq.cho, 'phu-thuoc');
  assert.equal(kq.sau_khong_co, undefined);
});

// ── SD-3, SD-4: xin / nha qua CLI thật ─────────────────────────────────────────────────────────────────────────────
function dotThu() {
  const k = tam();
  git(k, 'init', '-q', '-b', 'main');
  const d = path.join(k, '.acceptance-runs', 'dot-thu');
  for (const t of ['khoa', 'xin', 'yeu-cau', 'tra-loi', 'cho-nguoi', 'tiep']) fs.mkdirSync(path.join(d, t), { recursive: true });
  fs.symlinkSync(d, path.join(k, '.acceptance-runs', 'dieu-phoi-hien-tai'));
  ghiJ(path.join(d, 'dieu-phoi.config.json'), { ...CFG_PHAT_LICH, nhanh_chinh: 'main' });
  ghiJ(path.join(d, 'hang-viec.json'), { dot: 'thu', day: [{ id: 'P1', worktree: k }], hang: [{ slug: 's', day: 'P1' }] });
  return { k, d: fs.realpathSync(d) };
}
const cli = (cwd, ...a) => {
  const r = spawnSync(process.execPath, [CLI, ...a], { cwd, env: moiTruongSach(), encoding: 'utf8' });
  return { ma: r.status, out: r.stdout, err: r.stderr };
};
const giuKhoa = (d, tn, k, loai = tn) => ghiJ(path.join(d, 'khoa', tn, 'chu.json'), { phien: 'P1', slug: 's', loai, worktree: k });

test('SD-3 xin in lệnh chờ đã giải tài nguyên — đúng thư mục bộ phát lịch cấp', async () => {
  const { k, d } = dotThu();
  const r = cli(k, 'xin', 'ghim-lai', '--slug', 's');
  assert.equal(r.ma, 0, `xin ghim-lai: ${r.err}`);
  assert.ok(!r.out.includes('khoa/ghim-lai'), `xin ghim-lai không được canh khoa/ghim-lai: ${r.out}`);
  const cho = r.out.match(/(\S+\/khoa\/[\w-]+\/chu\.json)/)?.[1];
  assert.equal(cho, path.join(d, 'khoa', 's4', 'chu.json'), `lệnh chờ phải trỏ khoa/s4: ${r.out}`);
  // Round-trip: trước nhịp đường chờ vắng; bộ phát lịch thật cấp đơn; sau nhịp đường ấy có và mang đúng dãy.
  assert.equal(fs.existsSync(cho), false);
  await motNhip(d, ioLich('main'));
  assert.deepEqual([docJ(cho).phien, docJ(cho).loai], ['P1', 'ghim-lai']);
  for (const [loai, tn] of [['s4', 's4'], ['merge', 'merge']]) {
    const x = cli(k, 'xin', loai, '--slug', 's');
    assert.equal(x.ma, 0, `xin ${loai}: ${x.err}`);
    assert.ok(x.out.includes(path.join(d, 'khoa', tn, 'chu.json')), `xin ${loai} phải in lệnh chờ khoa/${tn}: ${x.out}`);
  }
  const luat = fs.readFileSync(path.join(GOI, 'scripts', 'mau', 'LUAT.md'), 'utf8');
  assert.ok(!luat.includes('khoa/<tài nguyên>/chu.json'), 'LUAT còn dặn thợ tự điền khoa/<tài nguyên>');
  assert.ok(luat.includes('lệnh chờ mà `xin` in'), 'LUAT phải bảo chép lệnh chờ mà `xin` in');
});

test('SD-4 nha nhận cả loại lẫn tài nguyên; tên lạ thoát 1; khoá vắng vẫn vô hại', () => {
  const { k, d } = dotThu();
  giuKhoa(d, 's4', k, 'ghim-lai');
  const r = cli(k, 'nha', 'ghim-lai');
  assert.equal(r.ma, 0, r.err);
  assert.match(r.out, /nha: đã nhả s4/);
  assert.equal(fs.existsSync(path.join(d, 'khoa', 's4')), false, 'khoa/s4 phải được nhả');
  // Tên lạ: thoát 1, gọi tên, khoá đang giữ còn nguyên.
  giuKhoa(d, 's4', k);
  const la = cli(k, 'nha', 'khoa-la');
  assert.equal(la.ma, 1);
  assert.match(la.err, /«khoa-la» không phải loại hay tài nguyên/);
  assert.match(la.err, /s4, ghim-lai, duong-nen, merge/);
  assert.equal(docJ(path.join(d, 'khoa', 's4', 'chu.json')).phien, 'P1');
  // Khoá đứng tên dãy khác: bộ giải không cho với tới khoá người khác.
  ghiJ(path.join(d, 'khoa', 's4', 'chu.json'), { phien: 'P2', slug: 'x', loai: 's4', worktree: k });
  const khac = cli(k, 'nha', 'ghim-lai');
  assert.equal(khac.ma, 1);
  assert.match(khac.err, /không do P1 giữ \(P2\)/);
  assert.equal(docJ(path.join(d, 'khoa', 's4', 'chu.json')).phien, 'P2');
  // Đối chứng: tên hợp lệ mà khoá vắng → như cũ.
  const vang = cli(k, 'nha', 'merge');
  assert.equal(vang.ma, 0, vang.err);
  assert.match(vang.out, /không có — không làm gì/);
});

// ── SD-5: gop tự nhả khoá merge ────────────────────────────────────────────────────────────────────────────────────
const PHIEU = 'apps/web/phieu.tsx';
const KY = '---\nslug: s\nstatus: machine-cleared\n---\n';
function khoGop({ tien }) {
  const goc = tam();
  const origin = path.join(goc, 'origin.git');
  git(goc, 'init', '-q', '--bare', '-b', 'main', origin);
  const k = path.join(goc, 'kho');
  git(goc, 'clone', '-q', origin, k);
  const commit = (tep, noi, msg) => {
    fs.mkdirSync(path.dirname(path.join(k, tep)), { recursive: true });
    fs.writeFileSync(path.join(k, tep), noi);
    git(k, 'add', '-A');
    git(k, 'commit', '-q', '-m', msg);
  };
  git(k, 'checkout', '-q', '-b', 'main');
  commit(PHIEU, 'v1\n', 'goc');
  git(k, 'push', '-q', 'origin', 'main');
  git(k, 'checkout', '-q', '-b', 'feat');
  commit(PHIEU, 'v2\n', 'phieu');
  commit('_acceptance/s/contract.md', KY, 'ky');
  git(k, 'push', '-q', 'origin', 'feat');
  const sha = git(k, 'rev-parse', 'HEAD');
  git(k, 'checkout', '-q', 'main');
  commit(tien, 'khac\n', 'tien');
  git(k, 'push', '-q', 'origin', 'main');
  git(k, 'checkout', '-q', 'feat');
  const d = path.join(k, '.acceptance-runs', 'dot-thu');
  fs.mkdirSync(path.join(d, 'khoa', 'merge'), { recursive: true });
  fs.symlinkSync(d, path.join(k, '.acceptance-runs', 'dieu-phoi-hien-tai'));
  ghiJ(path.join(d, 'dieu-phoi.config.json'), { ...CFG_PHAT_LICH, nhanh_chinh: 'main', gop_khong_chay_lai_ci: true });
  ghiJ(path.join(d, 'hang-viec.json'), { dot: 'thu', day: [{ id: 'P1', worktree: k }], hang: [{ slug: 's', day: 'P1' }] });
  ghiJ(path.join(d, 'dieu-khien.json'), { pha: 'dang-chay', tu_merge: true, lich_su: [] });
  ghiJ(path.join(d, 'khoa', 'merge', 'chu.json'), { phien: 'P1', slug: 's', loai: 'merge', worktree: k });
  const io = {
    chay: (cmd, args) => {
      if (cmd !== 'gh') return execFileSync(cmd, args, { cwd: k, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      if (args[0] === 'run') return '[]';
      if (args[0] === 'pr' && args[1] === 'view') return JSON.stringify({ number: 7, state: 'OPEN', isDraft: false, mergeable: 'MERGEABLE', headRefOid: sha, headRefName: 'feat', baseRefName: 'main', statusCheckRollup: [{ name: 'gate', status: 'COMPLETED', conclusion: 'SUCCESS' }] });
      return '';
    },
  };
  return { k, d, io };
}

test('SD-5 gop gộp thành công thì tự nhả khoá merge; không gộp thì khoá giữ nguyên', () => {
  const a = khoGop({ tien: 'apps/api/khac.ts' });
  const kq = gop(a.k, '7', { io: a.io });
  assert.equal(kq.da_gop, true);
  assert.equal(fs.existsSync(path.join(a.d, 'khoa', 'merge')), false, 'khoa/merge phải được nhả sau gộp');
  const sk = suKien(a.d).filter((s) => s.loai === 'gop');
  assert.equal(sk.at(-1).nha_merge, true);
  // Đối chứng cùng fixture: nhánh chính tiến bằng chính tệp PR → lối cu, không gộp, khoá còn.
  const b = khoGop({ tien: PHIEU });
  const kqb = gop(b.k, '7', { io: b.io });
  assert.equal(kqb.da_gop, false);
  assert.equal(docJ(path.join(b.d, 'khoa', 'merge', 'chu.json')).phien, 'P1');
});

// ── SD-6: bộ phát lịch thu hồi khoá có trước lúc hồ sơ gộp ─────────────────────────────────────────────────────────
// `nhipPhut`: tuổi tệp nhịp so với NOW; `hanPhut`: hạn thuê còn lại (âm = đã qua); `gopTruoc`: sổ gop_da_bao của nhịp trước.
function dotKhoa({ nhipPhut, hanPhut, gopTruoc = [] }) {
  const { dot, w1 } = dotLich();
  const chu = { phien: 'P1', slug: 'a', loai: 's4', worktree: w1, cap_luc: new Date(NOW - 100 * 60_000).toISOString(), han_thue_den: new Date(NOW + hanPhut * 60_000).toISOString() };
  ghiJ(path.join(dot, 'khoa', 's4', 'chu.json'), chu);
  const nhip = path.join(dot, 'khoa', 's4', 'nhip');
  fs.writeFileSync(nhip, 'x');
  const luc = new Date(NOW - nhipPhut * 60_000);
  fs.utimesSync(nhip, luc, luc);
  ghiJ(path.join(dot, 'do-dang-chay', 's4.json'), { phien: 'P1', slug: 'a', loai: 's4', commit: null, cap_luc: chu.cap_luc, ket_thuc: null, ma: null });
  if (gopTruoc.length) ghiJ(path.join(dot, 'trang-thai.json'), { nhip_cuoi: new Date(NOW - 5000).toISOString(), gop_da_bao: gopTruoc });
  return dot;
}
const soDo = (dot) => fs.readFileSync(path.join(dot, 'do-lan.jsonl'), 'utf8').trim().split('\n').map((x) => JSON.parse(x)).filter((r) => r.slug === 'a');
const NH = CFG_PHAT_LICH.nhanh_chinh;

test('SD-6 khoá có trước lúc hồ sơ gộp → thu hồi, không phải sự cố, lượt đo khép thường', async () => {
  const a = dotKhoa({ nhipPhut: 1, hanPhut: 60 });
  await motNhip(a, ioLich(NH, ['a']));
  assert.equal(fs.existsSync(path.join(a, 'khoa', 's4')), false, 'khoa/s4 của hồ sơ vừa gộp phải bị thu hồi');
  const th = suKien(a).filter((s) => s.loai === 'thu-hoi');
  assert.equal(th.length, 1);
  assert.equal(th[0].ly_do, 'hồ sơ a đã gộp trên nhánh chính');
  assert.equal(th[0].can_phan, false);
  assert.deepEqual(soDo(a).map((r) => r.ket_thuc), ['nha']);
  // (i) chưa gộp → khoá còn.
  const b = dotKhoa({ nhipPhut: 1, hanPhut: 60 });
  await motNhip(b, ioLich(NH));
  assert.equal(docJ(path.join(b, 'khoa', 's4', 'chu.json')).phien, 'P1');
  // (ii) gộp từ nhịp trước (khoá cấp cố ý sau lúc gộp) → khoá còn.
  const c = dotKhoa({ nhipPhut: 1, hanPhut: 60, gopTruoc: ['a'] });
  await motNhip(c, ioLich(NH, ['a']));
  assert.equal(docJ(path.join(c, 'khoa', 's4', 'chu.json')).phien, 'P1');
  // (iii) đối chứng dương của sổ đo: chưa gộp, hết hạn, nhịp cũ → thu hồi kiểu cũ, lượt đo MANG thu-hoi.
  const e = dotKhoa({ nhipPhut: 60, hanPhut: -5 });
  await motNhip(e, ioLich(NH));
  assert.equal(fs.existsSync(path.join(e, 'khoa', 's4')), false);
  assert.deepEqual(soDo(e).map((r) => r.ket_thuc), ['thu-hoi']);
});
