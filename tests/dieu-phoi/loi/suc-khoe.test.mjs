import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { CFG_BIEN } from './mau-thu.mjs';
import { FIXTURE, GB, GOI, banSaoTiem, hangMoi, inMaTran, MAY, nap, phanFixture } from './suc-khoe-chung.mjs';

const sao = (x) => JSON.parse(JSON.stringify(x));
const loi = (f) => {
  try {
    f();
    return 'qua';
  } catch (e) {
    return String(e);
  }
};

test('SK-09 doc-van-ban-that', async () => {
  const sk = await nap(GOI, 'suc-khoe.mjs');
  const vb = phanFixture();
  const swap = sk.docSwap(vb['sysctl vm.swapusage']);
  assert.deepEqual(swap, { tongGb: 13, dungGb: 11879.19 / 1024 });
  assert.equal(sk.docMucTrong(vb['sysctl -n kern.memorystatus_level']), 53);
  assert.equal(sk.docRamGb(vb['sysctl -n hw.memsize']), 38654705664 / GB);
  assert.equal(sk.docRamGb(vb['sysctl -n hw.memsize']), 36);
  const swapinsTep = Number(vb.vm_stat.match(/^Swapins:\s+(\d+)\./m)[1]);
  assert.deepEqual(sk.docVmStat(vb.vm_stat), { coTrang: 16384, swapins: swapinsTep });
  const hong = [
    ['rỗng', () => sk.docMucTrong(''), null],
    ['lỗi', () => sk.docMucTrong('lỗi'), null],
    ['level > 100', () => sk.docMucTrong('101\n'), null],
    ['memsize chữ', () => sk.docRamGb('nhiều'), null],
    ['thiếu page size', () => sk.docVmStat(vb.vm_stat.replace(/page size of \d+ bytes/, 'page size unknown')).coTrang, null],
    ['Swapins không số', () => sk.docVmStat(vb.vm_stat.replace(/^Swapins:.*$/m, 'Swapins: nhiều')).swapins, null],
  ];
  const hang = hong.map(([ten, f, kv]) => hangMoi(ten, kv, f()));
  assert.equal(hang.length, 6);
  assert.deepEqual(inMaTran('SK-09', hang), []);
});

test('SK-05 toc-do-vm-stat', async () => {
  const sk = await nap(GOI, 'suc-khoe.mjs');
  const vb = phanFixture()['vm_stat'];
  const truoc = { luc: 0, ...sk.docVmStat(vb) };
  const sau = { luc: 60_000, ...sk.docVmStat(vb.replace(/^(Swapins:\s+)(\d+)\./m, (_, a, n) => `${a}${Number(n) + 6400}.`)) };
  assert.equal(sau.swapins - truoc.swapins, 6400);
  assert.equal(sk.tocDoSwapinMbPhut(truoc, sau), 100);
  assert.equal(sk.tocDoSwapinMbPhut(null, sau), null, 'thiếu mẫu nhịp trước');
  assert.equal(sk.tocDoSwapinMbPhut(sau, { ...truoc, luc: 120_000 }), null, 'bộ đếm tụt (máy khởi động lại) không ra số âm');
  assert.equal(sk.tocDoSwapinMbPhut(truoc, { ...sau, swapins: null }), null);
});

// Hàm đo của AC-10, chạy trên gói `goi` (gói đang kiểm hoặc bản sao bị tiêm).
async function doCauHinh(goi) {
  const { kiemCauHinh } = await nap(goi, 'hinh-dang.mjs');
  const { danhGiaSucKhoe } = await nap(goi, 'suc-khoe.mjs');
  const mbp = { swap: { tongGb: MAY.mbp.swapTongM / 1024, dungGb: MAY.mbp.swapDungM / 1024 }, apLuc: 1, load: 4, rssLonNhat: null, mucTrong: MAY.mbp.muc, ramGb: 36 };
  const hang = [];
  for (const [s, r] of [[8, 8], [11, 8], [16, 8]]) {
    const c = sao(CFG_BIEN);
    c.suc_khoe = { swap_gb: s, ap_luc_muc: 2, rss_gb: r };
    const kq = loi(() => kiemCauHinh(c));
    hang.push(hangMoi(`đời trước swap_gb ${s} rss_gb ${r}`, 'qua · không giảm tải', `${kq} · ${danhGiaSucKhoe(mbp, c).giamTai ? 'giảm tải' : 'không giảm tải'}`));
  }
  const sai = [
    ['thiếu ap_luc_muc', (k) => { delete k.ap_luc_muc; }, 'suc_khoe.ap_luc_muc phải là số'],
    ['he_so_cho 1', (k) => { k.he_so_cho = 1; }, 'suc_khoe.he_so_cho phải là số lớn hơn 1'],
    ['dinh_lan_gb.s4 0', (k) => { k.dinh_lan_gb = { s4: 0 }; }, 'suc_khoe.dinh_lan_gb.s4 phải là số GB dương'],
    ['dinh_lan_gb khoá lạ bay', (k) => { k.dinh_lan_gb = { bay: 3 }; }, 'suc_khoe.dinh_lan_gb khoá lạ bay'],
    ['swapin_mb_phut -1', (k) => { k.swapin_mb_phut = -1; }, 'suc_khoe.swapin_mb_phut phải là số dương'],
    ['duoi_tai_phut 0', (k) => { k.duoi_tai_phut = 0; }, 'suc_khoe.duoi_tai_phut phải là số phút dương'],
    ['mau_hieu_chuan 2.5', (k) => { k.mau_hieu_chuan = 2.5; }, 'suc_khoe.mau_hieu_chuan phải là số nguyên dương'],
  ];
  for (const [ten, sua, tb] of sai) {
    const c = sao(CFG_BIEN);
    sua(c.suc_khoe);
    hang.push(hangMoi(ten, `Error: dieu-phoi.config.json: ${tb}`, loi(() => kiemCauHinh(c))));
  }
  const mau = JSON.parse(fs.readFileSync(path.join(goi, 'scripts', 'mau', 'dieu-phoi.config.json'), 'utf8'));
  const khoaCu = ['swap_gb', 'rss_gb'].filter((k) => k in (mau.suc_khoe ?? {}));
  hang.push(hangMoi('mẫu của gói', 'qua · không khoá swap_gb, rss_gb', `${loi(() => kiemCauHinh({ ...mau, goc_kho: '/kho' }, { canGocKho: true })).replace(/^Error: dieu-phoi\.config\.json: /, '')} · ${khoaCu.length ? `có ${khoaCu.join(', ')}` : 'không khoá swap_gb, rss_gb'}`));
  return hang;
}

test('SK-10 cau-hinh', async () => {
  const hang = await doCauHinh(GOI);
  assert.equal(hang.length, 11);
  console.log(`  SK-10 · ${hang.length} hàng`);
  assert.deepEqual(inMaTran('SK-10', hang), []);
});

test('SK-10-do bat-buoc-swap', async () => {
  assert.deepEqual(inMaTran('SK-10 (gói lành)', await doCauHinh(GOI)), [], 'đối chứng dương');
  const goi = banSaoTiem([['hinh-dang.mjs', "const KHOA_SUC_KHOE = ['ap_luc_muc'];", "const KHOA_SUC_KHOE = ['ap_luc_muc', 'swap_gb'];"]]);
  const hang = await doCauHinh(goi);
  assert.deepEqual(inMaTran('SK-10 (tiêm)', hang), ['mẫu của gói']);
  assert.match(hang.find((h) => h.hang === 'mẫu của gói').thuc_te, /^suc_khoe\.swap_gb phải là số · /);
});

test('SK-09 so-do-song', { skip: process.platform !== 'darwin' ? 'SK-09 cần macOS' : false }, async () => {
  const sk = await nap(GOI, 'suc-khoe.mjs');
  const chay = (c, a) => execFileSync(c, a, { encoding: 'utf8', maxBuffer: 64 << 20 });
  const vm = sk.docVmStat(chay('vm_stat', []));
  const so = {
    swap: sk.docSwap(chay('sysctl', ['vm.swapusage'])),
    apLuc: sk.docApLuc(chay('sysctl', ['-n', 'kern.memorystatus_vm_pressure_level'])),
    load: sk.docLoad(chay('sysctl', ['-n', 'vm.loadavg'])),
    rssLonNhat: sk.docRssLonNhat(chay('ps', ['-axo', 'rss=,comm='])),
    mucTrong: sk.docMucTrong(chay('sysctl', ['-n', 'kern.memorystatus_level'])),
    ramGb: sk.docRamGb(chay('sysctl', ['-n', 'hw.memsize'])),
  };
  const mau = JSON.parse(fs.readFileSync(path.join(GOI, 'scripts', 'mau', 'dieu-phoi.config.json'), 'utf8'));
  const kq = sk.danhGiaSucKhoe(so, mau);
  console.log(`  SK-09 số đo sống · áp lực ${so.apLuc} · khả dụng ${so.mucTrong} % · RAM ${so.ramGb} GB · swap ${kq.ghi.swap} · trống ${kq.choTrongGb?.toFixed(1)} GB · trang page ${vm.coTrang}`);
  for (const k of ['apLuc', 'mucTrong', 'ramGb']) assert.ok(Number.isFinite(so[k]), `${k} đọc được trên máy thật`);
  if (so.apLuc === 1) assert.equal(kq.giamTai, false);
  else assert.equal(kq.giamTai, so.apLuc >= mau.suc_khoe.ap_luc_muc);
});
