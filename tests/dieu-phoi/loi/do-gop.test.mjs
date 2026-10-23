// Hồ sơ ky-den-gop — thước «ký → gộp». Lịch sử git THẬT với giờ commit đặt tay: ký 11:48, gộp 15:03 (ca phiếu hai cột),
// một lần gộp nhánh chính vào nhánh giữa chừng, một lượt ghim lại trước và một sau chữ ký.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { soDoGop } from '../../../dieu-phoi/scripts/do-gop.mjs';
import { DA_THONG, motNhip } from '../../../dieu-phoi/scripts/phat-lich.mjs';
import { demDot } from '../../../dieu-phoi/scripts/dem.mjs';
import { CFG_PHAT_LICH as CFG_GOC } from './mau-thu.mjs';

const CFG_PHAT_LICH = { ...CFG_GOC, nhanh_chinh: 'main' };

const tam = () => fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'dp-dg-')));
const git = (cwd, luc, ...a) =>
  execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, GIT_COMMITTER_DATE: luc, GIT_AUTHOR_DATE: luc } }).trim();
const commit = (k, luc, tep, noi) => {
  fs.mkdirSync(path.dirname(path.join(k, tep)), { recursive: true });
  fs.writeFileSync(path.join(k, tep), noi);
  git(k, luc, 'add', '-A');
  git(k, luc, 'commit', '-q', '-m', tep);
};

// `daCoTruoc`: hồ sơ đã lên nhánh chính từ trước giờ ký (ô chờ Cổng Đáng gộp sớm) — commit đầu chạm hợp đồng trên lối
// cha-đầu là commit cũ ấy, không phải commit gộp mang chữ ký.
function lichSu({ squash = false, daCoTruoc = false } = {}) {
  const goc = tam();
  const origin = path.join(goc, 'o.git');
  git(goc, '2026-10-23T08:00:00Z', 'init', '-q', '--bare', '-b', 'main', origin);
  const k = path.join(goc, 'k');
  git(goc, '2026-10-23T08:00:00Z', 'clone', '-q', origin, k);
  git(k, '2026-10-23T08:00:00Z', 'checkout', '-q', '-b', 'main');
  commit(k, '2026-10-23T08:00:00Z', 'a.ts', '1');
  if (daCoTruoc) commit(k, '2026-10-22T16:00:00Z', '_acceptance/s/contract.md', '---\nstatus: discovery\n---\n');
  git(k, '2026-10-23T08:00:00Z', 'checkout', '-q', '-b', 'feat');
  commit(k, '2026-10-23T09:00:00Z', '_acceptance/s/contract.md', '---\nstatus: implemented\n---\n');
  git(k, '2026-10-23T09:30:00Z', 'checkout', '-q', 'main');
  commit(k, '2026-10-23T09:30:00Z', 'b.ts', '1');
  git(k, '2026-10-23T10:00:00Z', 'checkout', '-q', 'feat');
  git(k, '2026-10-23T10:00:00Z', 'merge', '-q', '--no-ff', '-m', 'gop main vao nhanh', 'main');
  commit(k, '2026-10-23T11:48:00Z', '_acceptance/s/contract.md', '---\nstatus: machine-cleared\n---\n');
  git(k, '2026-10-23T15:03:00Z', 'checkout', '-q', 'main');
  if (squash) {
    git(k, '2026-10-23T15:03:00Z', 'merge', '-q', '--squash', 'feat');
    git(k, '2026-10-23T15:03:00Z', 'commit', '-q', '-m', 'squash');
  } else git(k, '2026-10-23T15:03:00Z', 'merge', '-q', '--no-ff', '-m', 'Merge PR', 'feat');
  git(k, '2026-10-23T15:03:00Z', 'push', '-q', 'origin', 'main', 'feat');
  git(k, '2026-10-23T15:03:00Z', 'fetch', '-q', 'origin');
  return k;
}
const ioGit = (k) => ({ chay: (cmd, args) => execFileSync(cmd, args, { cwd: k, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }) });

test('DG-1 soDoGop: ký 11:48 → gộp 15:03 = 195 phút, một lần gộp nhánh chính vào nhánh; squash → không đo được giờ ký', () => {
  const k = lichSu();
  const so = soDoGop(ioGit(k), CFG_PHAT_LICH, 's', DA_THONG);
  assert.deepEqual(so, { ky_luc: '2026-10-23T11:48:00.000Z', gop_luc: '2026-10-23T15:03:00.000Z', ky_den_gop_phut: 195, gop_vao_nhanh: 1 });
  const q = soDoGop(ioGit(lichSu({ squash: true })), CFG_PHAT_LICH, 's', DA_THONG);
  assert.deepEqual([q.ky_luc, q.ky_den_gop_phut, q.gop_vao_nhanh], [null, null, null]);
  // Đối chứng chiều đỏ của bộ lọc trạng thái: danh sách đã thông thiếu trạng thái hồ sơ dùng → không thấy commit ký.
  // (Tệp ca viết `machine-cleared`, không chuỗi trạng thái ký người — lưới RT13.)
  assert.equal(soDoGop(ioGit(k), CFG_PHAT_LICH, 's', DA_THONG.filter((x) => x !== 'machine-cleared')).ky_luc, null);
});

test('DG-2 bộ phát lịch + lệnh đếm: hàng gộp mang giờ ký/gộp; dem trừ ra 195′, đếm ghim lại SAU ký (bỏ lượt trước ký)', async () => {
  const k = lichSu();
  const d = tam();
  fs.writeFileSync(path.join(d, 'dieu-phoi.config.json'), JSON.stringify({ ...CFG_PHAT_LICH, goc_kho: k }));
  fs.writeFileSync(path.join(d, 'hang-viec.json'), JSON.stringify({ dot: 't', day: [{ id: 'P1', worktree: k }], hang: [{ slug: 's', day: 'P1' }] }));
  for (const x of ['khoa', 'xin', 'yeu-cau', 'tra-loi', 'cho-nguoi', 'tiep']) fs.mkdirSync(path.join(d, x));
  // Nhịp đầu: chưa có trang-thai → sự kiện đếm ghi bình thường (đợt mới, không phải nâng cấp).
  fs.writeFileSync(
    path.join(d, 'su-kien.jsonl'),
    [
      { luc: '2026-10-23T11:00:00Z', loai: 'cap', tai_nguyen: 's4', phien: 'P1', slug: 's', don: 'ghim-lai' },
      { luc: '2026-10-23T13:10:00Z', loai: 'cap', tai_nguyen: 's4', phien: 'P1', slug: 's', don: 'ghim-lai' },
      { luc: '2026-10-23T13:40:00Z', loai: 'cap', tai_nguyen: 's4', phien: 'P1', slug: 's', don: 's4' },
    ].map((x) => JSON.stringify(x)).join('\n') + '\n',
  );
  const io = {
    nowMs: () => Date.parse('2026-10-23T15:10:00Z'),
    chay: (cmd, args) => {
      if (cmd === 'sysctl' && args[0] === 'vm.swapusage') return 'total = 24576.00M  used = 1024.00M  free = 1.00M';
      if (cmd === 'sysctl' && args.includes('kern.memorystatus_vm_pressure_level')) return '1';
      if (cmd === 'sysctl') return '{ 3.00 2.00 1.00 }';
      if (cmd === 'ps') return '102400 node\n';
      if (cmd === 'gh') return '[]';
      if (cmd === 'git') return execFileSync('git', args, { cwd: k, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      return '';
    },
  };
  await motNhip(d, io);
  const gop = fs.readFileSync(path.join(d, 'su-kien.jsonl'), 'utf8').trim().split('\n').map((x) => JSON.parse(x)).filter((s) => s.loai === 'hang-gop');
  assert.deepEqual(gop.map((s) => [s.hang, s.ky_den_gop_phut, s.gop_vao_nhanh]), [['s', 195, 1]]);
  const dem = demDot(d);
  assert.deepEqual(dem.ky_den_gop, { so: 1, trung_vi_phut: 195, lon_nhat_phut: 195, theo_hang: { s: 195 }, chua_do: [] });
  assert.deepEqual(dem.gop_vao_nhanh, { tong: 1, theo_hang: { s: 1 } });
  assert.deepEqual(dem.ghim_lai_sau_ky, { tong: 1, theo_hang: { s: 1 } });
});

test('DG-3 lệnh đếm: trung vị trên nhiều hàng, hàng thiếu giờ ký vào chua_do, lối của lệnh gộp được đếm', () => {
  const d = tam();
  const sk = [
    { loai: 'hang-gop', hang: 'a', ky_luc: '2026-10-23T10:00:00Z', ky_den_gop_phut: 30, gop_vao_nhanh: 0 },
    { loai: 'hang-gop', hang: 'b', ky_luc: '2026-10-23T10:00:00Z', ky_den_gop_phut: 200, gop_vao_nhanh: 3 },
    { loai: 'hang-gop', hang: 'c', ky_luc: '2026-10-23T10:00:00Z', ky_den_gop_phut: 90, gop_vao_nhanh: 1 },
    { loai: 'hang-gop', hang: 'q', ky_luc: null, ky_den_gop_phut: null, gop_vao_nhanh: null },
    { loai: 'gop', duong: 'khong-trung' },
    { loai: 'gop', duong: 'khong-trung' },
    { loai: 'gop', duong: 'cu' },
  ];
  fs.writeFileSync(path.join(d, 'su-kien.jsonl'), sk.map((x) => JSON.stringify({ luc: '2026-10-23T12:00:00Z', ...x })).join('\n') + '\n');
  const dem = demDot(d);
  assert.deepEqual([dem.ky_den_gop.so, dem.ky_den_gop.trung_vi_phut, dem.ky_den_gop.lon_nhat_phut, dem.ky_den_gop.chua_do], [3, 90, 200, ['q']]);
  assert.equal(dem.gop_vao_nhanh.tong, 4);
  assert.deepEqual(dem.gop, { 'khong-trung': 2, cu: 1 });
});

test('DG-4 hồ sơ đã lên nhánh chính từ trước giờ ký → giờ gộp là commit gộp MANG chữ ký vào (15:03), không phải commit cũ 22/10', () => {
  const so = soDoGop(ioGit(lichSu({ daCoTruoc: true })), CFG_PHAT_LICH, 's', DA_THONG);
  assert.deepEqual(so, { ky_luc: '2026-10-23T11:48:00.000Z', gop_luc: '2026-10-23T15:03:00.000Z', ky_den_gop_phut: 195, gop_vao_nhanh: 1 });
});
