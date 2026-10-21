import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { GB, GOI, MAY, banSaoTiem, chuKhoa, docJ, dungDot, hangMoi, inMaTran, nap, soTai, suKien, taoIo, trangThai, xin } from './suc-khoe-chung.mjs';

const T0 = Date.parse('2026-10-21T03:00:00Z');
const GIAY = 1000;
const iso = (ms) => new Date(ms).toISOString();
const nhip = async (goi, dot, so) => (await nap(goi, 'phat-lich.mjs')).motNhip(dot, taoIo(so));
const soMoi = (may, them = {}) => ({ now: T0, apLuc: 1, muc: may.muc, ram: may.ram, swapTongM: may.swapTongM, swapDungM: may.swapDungM, swapins: 0, ...them });
const MAY_100 = { muc: 50, ram: 100 * GB, swapTongM: 1024, swapDungM: 0 };
const dem = (dot, loai) => suKien(dot).filter((e) => e.loai === loai);
const xem = async (goi, dot) => {
  const { moHinh, veXem } = await nap(goi, 'mo-hinh.mjs');
  return veXem(moHinh(trangThai(dot)));
};
const bang = (dot) => fs.readFileSync(path.join(dot, 'bang.html'), 'utf8');
const nha = async (goi, w, tn, opts) => (await nap(goi, 'ghi.mjs')).nhaKhoa(w, tn, opts);

// ---------- AC-1: swap cũ không làm giảm tải ----------
async function doSK01(goi) {
  const hang = [];
  for (const ten of ['m5', 'mbp']) {
    for (const apLuc of [1, 2]) {
      const { dot, k1 } = dungDot(goi);
      xin(dot, 'P1', 's4', k1.w, 'a');
      await nhip(goi, dot, soMoi(MAY[ten], { apLuc }));
      const tt = trangThai(dot);
      const ten2 = `(${ten}, áp lực ${apLuc})`;
      if (apLuc === 1) {
        const swap = ten === 'm5' ? '9.7/11.0 GB' : '12.0/13.0 GB';
        hang.push(hangMoi(ten2, `dang-chay · s4 P1 · giam-tai 0 · ghi ${swap} · lý do 0`, `${tt.trang_thai} · s4 ${chuKhoa(dot, 's4')?.phien ?? 'vắng'} · giam-tai ${dem(dot, 'giam-tai').length} · ghi ${tt.suc_khoe.ghi?.swap} · lý do ${tt.suc_khoe.lyDo.length}`));
      } else {
        hang.push(hangMoi(ten2, 'giam-tai · áp lực bộ nhớ mức 2', `${tt.trang_thai} · ${tt.suc_khoe.lyDo.join('; ')}`));
      }
    }
  }
  return hang;
}
const TIEM_SWAP = ['suc-khoe.mjs', '  if (Number.isFinite(apLuc) && apLuc >= n.ap_luc_muc) lyDo.push(`áp lực bộ nhớ mức ${apLuc}`);\n', '  if (Number.isFinite(apLuc) && apLuc >= n.ap_luc_muc) lyDo.push(`áp lực bộ nhớ mức ${apLuc}`);\n  if ((swap?.dungGb ?? 0) > 8) lyDo.push(`swap ${swap.dungGb.toFixed(1)}/${swap.tongGb.toFixed(1)} GB`);\n'];

test('SK-01 swap-cu-khong-giam-tai', async () => {
  const hang = await doSK01(GOI);
  assert.equal(hang.length, 4);
  assert.deepEqual(inMaTran('SK-01', hang), []);
});
test('SK-01-do luat-swap-cu', async () => {
  assert.deepEqual(inMaTran('SK-01 (gói lành)', await doSK01(GOI)), [], 'đối chứng dương');
  const hang = await doSK01(banSaoTiem([TIEM_SWAP]));
  assert.deepEqual(inMaTran('SK-01 (tiêm)', hang), ['(m5, áp lực 1)', '(m5, áp lực 2)', '(mbp, áp lực 1)', '(mbp, áp lực 2)']);
  for (const h of hang.filter((x) => x.hang.endsWith('áp lực 1)'))) assert.match(h.thuc_te, /^giam-tai · s4 vắng · /);
  for (const h of hang.filter((x) => x.hang.endsWith('áp lực 2)'))) assert.match(h.thuc_te, /^giam-tai · áp lực bộ nhớ mức 2; swap \d+\.\d\/\d+\.\d GB$/);
});

// ---------- AC-2: áp lực giảm tải, chỉ merge ----------
async function doSK02(goi) {
  const hang = [];
  for (const muc of [2, 4]) {
    const { dot, k1, k2 } = dungDot(goi);
    xin(dot, 'P1', 's4', k1.w, 'a');
    xin(dot, 'P2', 'ghim-lai', k2.w, 'b');
    xin(dot, 'P1', 'duong-nen', k1.w, 'a');
    xin(dot, 'P2', 'merge', k2.w, 'b');
    const so = soMoi(MAY.mbp, { apLuc: muc });
    for (let i = 0; i < 3; i++) {
      await nhip(goi, dot, so);
      so.now += 5 * GIAY;
    }
    const giu = ['s4', 'duong-nen', 'merge'].filter((tn) => chuKhoa(dot, tn));
    const lyDo = trangThai(dot).suc_khoe.lyDo.join('; ');
    const gt = dem(dot, 'giam-tai').filter((e) => e.can_phan === true).length;
    so.apLuc = 1;
    await nhip(goi, dot, so);
    hang.push(hangMoi(`mức ${muc}`, `khoá merge · áp lực bộ nhớ mức ${muc} · giam-tai 1 · het-giam-tai 1 · dang-chay`, `khoá ${giu.join('+')} · ${lyDo} · giam-tai ${gt} · het-giam-tai ${dem(dot, 'het-giam-tai').length} · ${trangThai(dot).trang_thai}`));
  }
  const { dot, k1, k2 } = dungDot(goi);
  xin(dot, 'P1', 's4', k1.w, 'a');
  xin(dot, 'P2', 'merge', k2.w, 'b');
  await nhip(goi, dot, soMoi(MAY.mbp));
  hang.push(hangMoi('mức 1 từ đầu', 'giam-tai 0 · s4 có · merge có', `giam-tai ${dem(dot, 'giam-tai').length} · s4 ${chuKhoa(dot, 's4') ? 'có' : 'vắng'} · merge ${chuKhoa(dot, 'merge') ? 'có' : 'vắng'}`));
  return hang;
}
test('SK-02 ap-luc-giam-tai', async () => {
  const hang = await doSK02(GOI);
  assert.equal(hang.length, 3);
  assert.deepEqual(inMaTran('SK-02', hang), []);
});
test('SK-02-do bo-ap-luc', async () => {
  assert.deepEqual(inMaTran('SK-02 (gói lành)', await doSK02(GOI)), [], 'đối chứng dương');
  const hang = await doSK02(banSaoTiem([['suc-khoe.mjs', '  if (Number.isFinite(apLuc) && apLuc >= n.ap_luc_muc) lyDo', '  if (false && Number.isFinite(apLuc) && apLuc >= n.ap_luc_muc) lyDo']]));
  assert.deepEqual(inMaTran('SK-02 (tiêm)', hang), ['mức 2', 'mức 4']);
  for (const h of hang.filter((x) => !x.dat)) assert.match(h.thuc_te, / · dang-chay$/);
});

// ---------- AC-3: thiếu chỗ cho đúng loại lượt ----------
const CHUOI_THIEU = 'thiếu chỗ: cần 18.0 GB, trống 16.6 GB';
async function doSK03(goi) {
  const sk = { dinh_lan_gb: { s4: 12 }, he_so_cho: 1.5 };
  const hang = [];
  {
    const { dot, k1, k2 } = dungDot(goi, { sucKhoe: sk });
    xin(dot, 'P1', 's4', k1.w, 'a');
    xin(dot, 'P2', 'ghim-lai', k2.w, 'b');
    xin(dot, 'P1', 'merge', k1.w, 'a');
    await nhip(goi, dot, soMoi(MAY.mbp));
    const tt = trangThai(dot);
    const cho = tt.hang_cho.find((h) => h.phien === 'P1' && h.loai === 's4')?.cho ?? 'không lý do';
    hang.push(hangMoi('(level 46)', `khoá s4 cấp cho đơn ghim-lai · merge có · ${CHUOI_THIEU} · dang-chay · bảng có · xem có`, `khoá s4 cấp cho đơn ${chuKhoa(dot, 's4')?.loai ?? 'không ai'} · merge ${chuKhoa(dot, 'merge') ? 'có' : 'vắng'} · ${cho} · ${tt.trang_thai} · bảng ${bang(dot).includes(CHUOI_THIEU) ? 'có' : 'không'} · xem ${(await xem(goi, dot)).includes(CHUOI_THIEU) ? 'có' : 'không'}`));
  }
  {
    const { dot, k1, k2 } = dungDot(goi, { sucKhoe: sk });
    xin(dot, 'P1', 's4', k1.w, 'a');
    xin(dot, 'P2', 'merge', k2.w, 'b');
    const so = soMoi(MAY.mbp);
    for (let i = 0; i < 3; i++) {
      await nhip(goi, dot, so);
      so.now += 5 * GIAY;
    }
    const tc = dem(dot, 'thieu-cho');
    hang.push(hangMoi('(ba nhịp level 46)', 'thieu-cho 1 · can_phan false', `thieu-cho ${tc.length} · can_phan ${tc.map((e) => e.can_phan).join(',')}`));
  }
  {
    const { dot, k1, k2 } = dungDot(goi, { sucKhoe: sk });
    xin(dot, 'P1', 's4', k1.w, 'a');
    xin(dot, 'P2', 'merge', k2.w, 'b');
    await nhip(goi, dot, soMoi(MAY.mbp, { muc: 51 }));
    const coChuoi = [JSON.stringify(trangThai(dot)), bang(dot), await xem(goi, dot)].some((s) => s.includes('thiếu chỗ'));
    hang.push(hangMoi('(level 51)', 'khoá s4 cấp cho đơn s4 · thiếu chỗ vắng', `khoá s4 cấp cho đơn ${chuKhoa(dot, 's4')?.loai ?? 'không ai'} · thiếu chỗ ${coChuoi ? 'có' : 'vắng'}`));
  }
  return hang;
}
test('SK-03 thieu-cho', async () => {
  const hang = await doSK03(GOI);
  assert.equal(hang.length, 3);
  assert.deepEqual(inMaTran('SK-03', hang), []);
});
test('SK-03-do bo-xet-cho', async () => {
  assert.deepEqual(inMaTran('SK-03 (gói lành)', await doSK03(GOI)), [], 'đối chứng dương');
  const hang = await doSK03(banSaoTiem([['suc-khoe.mjs', "if (loai === 'merge' || ", "if (true || loai === 'merge' || "]]));
  assert.deepEqual(inMaTran('SK-03 (tiêm)', hang), ['(level 46)', '(ba nhịp level 46)']);
  assert.match(hang[0].thuc_te, /^khoá s4 cấp cho đơn s4 · /);
});

// ---------- AC-4: RSS chỉ ghi ----------
async function doSK04(goi) {
  const { dot, k1 } = dungDot(goi);
  xin(dot, 'P1', 's4', k1.w, 'a');
  await nhip(goi, dot, soMoi(MAY.mbp, { ps: '19922944 /opt/model/server\n102400 node\n' }));
  const x = await xem(goi, dot);
  const rss = trangThai(dot).suc_khoe.ghi?.rss_lon_nhat;
  return [
    hangMoi('sự kiện can-nguoi', 0, dem(dot, 'can-nguoi').length),
    hangMoi('bảng «Cần anh»', 'không', bang(dot).includes('Cần anh') ? 'có' : 'không'),
    hangMoi('xem «Cần anh»', 'không', x.includes('Cần anh') || x.includes('giữ 19.0 GB') ? 'có' : 'không'),
    hangMoi('ghi rss', '/opt/model/server 19', `${rss?.lenh} ${rss?.gb}`),
  ];
}
test('SK-04 rss-chi-ghi', async () => {
  assert.deepEqual(inMaTran('SK-04', await doSK04(GOI)), []);
});
test('SK-04-do rss-goi-nguoi', async () => {
  assert.deepEqual(inMaTran('SK-04 (gói lành)', await doSK04(GOI)), [], 'đối chứng dương');
  const hang = await doSK04(banSaoTiem([['suc-khoe.mjs', 'canNguoi: null,', 'canNguoi: rssLonNhat && rssLonNhat.gb > 8 ? `${rssLonNhat.lenh} giữ ${rssLonNhat.gb.toFixed(1)} GB RSS` : null,']]));
  assert.deepEqual(inMaTran('SK-04 (tiêm)', hang), ['sự kiện can-nguoi', 'bảng «Cần anh»']);
  assert.equal(hang[0].thuc_te, '1');
});

// ---------- AC-5: nhãn dưới tải ----------
async function luotDuoiTai(goi, { sucKhoe = null, buoc }) {
  const { dot, k1 } = dungDot(goi, { sucKhoe });
  xin(dot, 'P1', 's4', k1.w, 'a');
  const so = soMoi(MAY_100);
  await nhip(goi, dot, so);
  for (const b of buoc) {
    so.now += 30 * GIAY;
    Object.assign(so, b(so));
    await nhip(goi, dot, so);
  }
  const d = docJ(path.join(dot, 'do-dang-chay', 's4.json'));
  return d?.duoi_tai ? `có nhãn: ${d.duoi_tai.ly_do} · ${d.duoi_tai.tu}` : 'không nhãn';
}
const lap = (n, f) => Array.from({ length: n }, () => f);
async function doSK05(goi) {
  const ap = (n) => () => ({ apLuc: n });
  const tang = () => (so) => ({ swapins: so.swapins + 4000, apLuc: 1 });
  return [
    hangMoi('(áp lực 2 liền 5 nhịp = 120 giây)', `có nhãn: áp lực bộ nhớ mức 2 · ${iso(T0 + 30 * GIAY)}`, await luotDuoiTai(goi, { buoc: lap(5, ap(2)) })),
    hangMoi('(áp lực 2 một nhịp rồi 1)', 'không nhãn', await luotDuoiTai(goi, { buoc: [ap(2), ...lap(5, ap(1))] })),
    hangMoi('(swapin_mb_phut 50, 125 MB/phút liền 5 nhịp)', `có nhãn: swapin 125.0 MB/phút · ${iso(T0 + 30 * GIAY)}`, await luotDuoiTai(goi, { sucKhoe: { swapin_mb_phut: 50 }, buoc: lap(5, tang()) })),
    hangMoi('(cùng tốc độ, không đặt swapin_mb_phut)', 'không nhãn', await luotDuoiTai(goi, { buoc: lap(5, tang()) })),
    hangMoi('(áp lực 2 liền 3 nhịp = 60 giây)', 'không nhãn', await luotDuoiTai(goi, { buoc: [...lap(3, ap(2)), ap(1)] })),
  ];
}
test('SK-05 nhan-duoi-tai', async () => {
  const hang = await doSK05(GOI);
  assert.equal(hang.length, 5);
  assert.deepEqual(inMaTran('SK-05', hang), []);
});
test('SK-05-do bo-dong-ho', async () => {
  assert.deepEqual(inMaTran('SK-05 (gói lành)', await doSK05(GOI)), [], 'đối chứng dương');
  const hang = await doSK05(banSaoTiem([['do-lan.mjs', 'nowMs - d.dong_ho_tu >= n.duoi_tai_phut * PHUT_MS', 'true']]));
  assert.deepEqual(inMaTran('SK-05 (tiêm)', hang), ['(áp lực 2 một nhịp rồi 1)', '(áp lực 2 liền 3 nhịp = 60 giây)']);
  for (const h of hang.filter((x) => !x.dat)) assert.match(h.thuc_te, /^có nhãn: áp lực bộ nhớ mức 2 · /);
});

// ---------- AC-6: thử lại một lần cho mỗi commit ----------
async function doSK06(goi) {
  const { dot, k1 } = dungDot(goi);
  const so = soMoi(MAY_100);
  const buoc = async () => {
    so.now += 30 * GIAY;
    await nhip(goi, dot, so);
  };
  const luot = async (coNhan) => {
    const truoc = dem(dot, 'luot-duoi-tai').length;
    xin(dot, 'P1', 's4', k1.w, 'a');
    so.apLuc = 1;
    await buoc();
    so.apLuc = coNhan ? 2 : 1;
    for (let i = 0; i < 5; i++) await buoc();
    so.apLuc = 1;
    await nha(goi, k1.w, 's4');
    await buoc();
    const moi = dem(dot, 'luot-duoi-tai').slice(truoc);
    return moi.length === 0 ? 'không sự kiện' : moi.map((e) => `${e.phien} ${e.slug} ${e.tai_nguyen} ${e.commit === k1.dinh() ? 'commit hiện tại' : e.commit} ${e.duoc_thu_lai}`).join(' | ');
  };
  const hang = [];
  hang.push(hangMoi('lượt 1', 'P1 a s4 commit hiện tại true', await luot(true)));
  hang.push(hangMoi('lượt 2', 'P1 a s4 commit hiện tại false', await luot(true)));
  k1.commit('B');
  hang.push(hangMoi('lượt 3', 'P1 a s4 commit hiện tại true', await luot(true)));
  hang.push(hangMoi('lượt 4', 'không sự kiện', await luot(false)));
  hang.push(hangMoi('tổng sự kiện', 3, dem(dot, 'luot-duoi-tai').length));
  return hang;
}
test('SK-06 thu-lai-mot-lan', async () => {
  assert.deepEqual(inMaTran('SK-06', await doSK06(GOI)), []);
});
test('SK-06-do thu-lai-mai', async () => {
  assert.deepEqual(inMaTran('SK-06 (gói lành)', await doSK06(GOI)), [], 'đối chứng dương');
  const hang = await doSK06(banSaoTiem([['do-lan.mjs', 'return !so.some(', 'return true || !so.some(']]));
  assert.deepEqual(inMaTran('SK-06 (tiêm)', hang), ['lượt 2']);
  assert.match(hang[1].thuc_te, / true$/);
});
test('SK-06-do bo-commit', async () => {
  const hang = await doSK06(banSaoTiem([['do-lan.mjs', ' && r.commit === row.commit', '']]));
  assert.deepEqual(inMaTran('SK-06 (tiêm)', hang), ['lượt 3']);
  assert.match(hang[2].thuc_te, / false$/);
});

// ---------- AC-7: sổ đo cấp máy ----------
const KHOA_SO = ['kho', 'loai', 'phien', 'slug', 'commit', 'cap_luc', 'xong_luc', 'trong_luc_cap_gb', 'nguon_nhu_cau', 'nhu_cau_gb', 'ap_luc_max', 'swapin_mb_phut_max', 'duoi_tai', 'chong', 'ket_thuc', 'ma', 'ha_tang'];
async function doSK07(goi) {
  const { docSoDo } = await nap(goi, 'do-lan.mjs');
  const hang = [];
  const bien = [
    ['(nhả không cờ)', 'nha · ma null · ha_tang false', (k1) => nha(goi, k1.w, 's4')],
    ['(nhả --ma 137)', 'nha · ma 137 · ha_tang true', (k1) => execFileSync(process.execPath, [path.join(goi, 'scripts', 'dieu-phoi.mjs'), 'nha', 's4', '--ma', '137'], { cwd: k1.w, stdio: 'ignore' })],
    ['(nhả --ma 1)', 'nha · ma 1 · ha_tang false', (k1) => nha(goi, k1.w, 's4', { ma: 1 })],
    ['(nhả --ha-tang "ENOMEM")', 'nha · ma null · ha_tang true ENOMEM', (k1) => nha(goi, k1.w, 's4', { haTang: 'ENOMEM' })],
    ['(hết hạn thuê, thu hồi)', 'thu-hoi · ma null · ha_tang true', (k1, dot) => {
      const p = path.join(dot, 'khoa', 's4', 'chu.json');
      fs.writeFileSync(p, JSON.stringify({ ...docJ(p), han_thue_den: iso(T0 - 1000) }));
    }],
  ];
  for (const [ten, kv, khep] of bien) {
    const { dot, k1, mayDir } = dungDot(goi);
    xin(dot, 'P1', 's4', k1.w, 'a');
    const so = soMoi(MAY_100, { muc: 20 });
    await nhip(goi, dot, so);
    for (const muc of [14, 17]) {
      so.now += 30 * GIAY;
      so.muc = muc;
      await nhip(goi, dot, so);
    }
    await khep(k1, dot);
    so.now += 30 * GIAY;
    await nhip(goi, dot, so);
    const tho = soTai(dot);
    const doc = docSoDo(dot);
    const may = soTai(mayDir).length;
    const r = doc[0] ?? {};
    const thieu = KHOA_SO.filter((k) => !(k in r));
    const tep = fs.existsSync(path.join(dot, 'do-dang-chay', 's4.json')) ? 'còn' : 'xoá';
    hang.push(hangMoi(ten, `1 dòng · ${kv} · cấp 20 · nhu cầu 6 · chong false · nguồn chua · đủ khoá · tệp xoá · đọc lại khớp · máy 0`, `${tho.length} dòng · ${r.ket_thuc} · ma ${r.ma} · ha_tang ${r.ha_tang}${r.ha_tang_ly_do ? ` ${r.ha_tang_ly_do}` : ''} · cấp ${r.trong_luc_cap_gb} · nhu cầu ${r.nhu_cau_gb} · chong ${r.chong} · nguồn ${r.nguon_nhu_cau} · ${thieu.length ? `thiếu ${thieu.join(',')}` : 'đủ khoá'} · tệp ${tep} · đọc lại ${JSON.stringify(doc) === JSON.stringify(tho) ? 'khớp' : 'lệch'} · máy ${may}`));
  }
  {
    const { dot, k1, k2, mayDir } = dungDot(goi);
    xin(dot, 'P1', 's4', k1.w, 'a');
    xin(dot, 'P2', 'duong-nen', k2.w, 'b');
    const so = soMoi(MAY_100);
    await nhip(goi, dot, so);
    so.now += 30 * GIAY;
    await nhip(goi, dot, so);
    await nha(goi, k1.w, 's4');
    await nha(goi, k2.w, 'duong-nen');
    so.now += 30 * GIAY;
    await nhip(goi, dot, so);
    const rows = soTai(dot);
    hang.push(hangMoi('(s4 và duong-nen chồng thời gian)', '2 dòng · chong true,true', `${rows.length} dòng · chong ${rows.map((x) => x.chong).join(',')}`));
  }
  {
    const { dot, k1, mayDir } = dungDot(goi);
    fs.mkdirSync(path.join(dot, 'khoa', 's4'));
    fs.writeFileSync(path.join(dot, 'khoa', 's4', 'chu.json'), JSON.stringify({ phien: 'P1', slug: 'a', loai: 's4', worktree: k1.w, cap_luc: iso(T0 - 60_000), han_thue_den: iso(T0 + 3_600_000) }));
    const so = soMoi(MAY_100);
    await nhip(goi, dot, so);
    await nha(goi, k1.w, 's4');
    so.now += 30 * GIAY;
    await nhip(goi, dot, so);
    hang.push(hangMoi('(khoá có từ trước gói, không có do-dang-chay)', '0 dòng', `${soTai(dot).length + soTai(mayDir).length} dòng`));
  }
  {
    const { dot, k1, mayDir } = dungDot(goi, { tuGoi: true });
    xin(dot, 'P1', 's4', k1.w, 'a');
    const so = soMoi(MAY_100);
    await nhip(goi, dot, so);
    await nha(goi, k1.w, 's4');
    so.now += 30 * GIAY;
    await nhip(goi, dot, so);
    hang.push(hangMoi('(đợt mở từ gói → sổ cấp máy)', 'máy 1 · đợt 0', `máy ${soTai(mayDir).length} · đợt ${soTai(dot).length}`));
  }
  return hang;
}
test('SK-07 so-do-lan', async () => {
  const hang = await doSK07(GOI);
  assert.equal(hang.length, 8);
  assert.deepEqual(inMaTran('SK-07', hang), []);
});
test('SK-07-do bo-ghi-so', async () => {
  assert.deepEqual(inMaTran('SK-07 (gói lành)', await doSK07(GOI)), [], 'đối chứng dương');
  const hang = await doSK07(banSaoTiem([['do-lan.mjs', '  ghiDongSo(thuMuc, row);\n', '  void row;\n']]));
  const do_ = inMaTran('SK-07 (tiêm)', hang);
  assert.deepEqual(do_, [...hang.slice(0, 6), hang[7]].map((h) => h.hang));
  for (const h of hang.slice(0, 5)) assert.match(h.thuc_te, /^0 dòng · /);
});

// ---------- AC-8: nhu cầu từ sổ, cấu hình, hay chưa ----------
const dong = (kho, nhu, them = {}) => ({ kho, loai: 's4', phien: 'P1', slug: 'a', commit: null, cap_luc: iso(T0), xong_luc: iso(T0), trong_luc_cap_gb: 30, nguon_nhu_cau: 'chua', nhu_cau_gb: nhu, ap_luc_max: 1, swapin_mb_phut_max: null, duoi_tai: null, chong: false, ket_thuc: 'nha', ma: null, ha_tang: false, ...them });
const sach20 = (kho = '/kho-thu') => Array.from({ length: 20 }, (_, i) => dong(kho, i + 1));
const ban6 = () => [dong('/kho-thu', 30, { duoi_tai: { tu: iso(T0), ly_do: 'x' } }), dong('/kho-thu', 30, { duoi_tai: { tu: iso(T0), ly_do: 'x' } }), dong('/kho-thu', 30, { ha_tang: true }), dong('/kho-thu', 30, { ha_tang: true }), dong('/kho-thu', 30, { chong: true }), dong('/kho-thu', 30, { chong: true })];
async function doSK08(goi) {
  const { nhuCau, docSoDo } = await nap(goi, 'do-lan.mjs');
  const cfg3 = { suc_khoe: { ap_luc_muc: 2, dinh_lan_gb: { s4: 3 } } };
  const kq = (so, cfg) => {
    const n = nhuCau({ kho: '/kho-thu', loai: 's4', cfg, so });
    return `${n.gb} · ${n.nguon}`;
  };
  const hang = [
    hangMoi('(20 dòng s4 sạch)', '19 · so', kq(sach20(), cfg3)),
    hangMoi('(20 dòng s4 sạch + 6 dòng bẩn)', '19 · so', kq([...sach20(), ...ban6()], cfg3)),
    hangMoi('(4 dòng sạch + 6 dòng bẩn, cấu hình 3)', '3 · cau-hinh', kq([...sach20().slice(0, 4), ...ban6()], cfg3)),
    hangMoi('(20 dòng kho khác, cấu hình 3)', '3 · cau-hinh', kq(sach20('/kho-khac'), cfg3)),
  ];
  const { dot, k1 } = dungDot(goi);
  xin(dot, 'P1', 's4', k1.w, 'a');
  await nhip(goi, dot, soMoi(MAY_100));
  hang.push(hangMoi('(0 dòng, không cấu hình)', 'null · chua · chua_hieu_chuan s4,ghim-lai,duong-nen', `${kq([], { suc_khoe: { ap_luc_muc: 2 } })} · chua_hieu_chuan ${(trangThai(dot).chua_hieu_chuan ?? []).join(',')}`));
  fs.writeFileSync(path.join(dot, 'do-lan.jsonl'), `${sach20().map((x) => JSON.stringify(x)).join('\n')}\nrác{\n`);
  hang.push(hangMoi('(sổ có một dòng rác)', '20 dòng đọc được', `${docSoDo(dot).length} dòng đọc được`));
  return hang;
}
test('SK-08 nguon-nhu-cau', async () => {
  const hang = await doSK08(GOI);
  assert.equal(hang.length, 6);
  assert.deepEqual(inMaTran('SK-08', hang), []);
});
test('SK-08-do p95-thanh-max', async () => {
  assert.deepEqual(inMaTran('SK-08 (gói lành)', await doSK08(GOI)), [], 'đối chứng dương');
  const hang = await doSK08(banSaoTiem([['do-lan.mjs', 'Math.ceil(0.95 * s.length) - 1', 's.length - 1']]));
  assert.deepEqual(inMaTran('SK-08 (tiêm)', hang), ['(20 dòng s4 sạch)', '(20 dòng s4 sạch + 6 dòng bẩn)']);
  assert.equal(hang[0].thuc_te, '20 · so');
});
test('SK-08 lenh-hieu-chuan', () => {
  const { k1, dot: thuMuc } = dungDot(GOI);
  const dot = [...sach20(), dong('/kho-thu', 40, { phien: 'P2', slug: 'b', ket_thuc: 'thu-hoi', ha_tang: true, trong_luc_cap_gb: 9.5, ap_luc_luc_cap: 1 })];
  fs.writeFileSync(path.join(thuMuc, 'do-lan.jsonl'), `${dot.map((x) => JSON.stringify(x)).join('\n')}\n`);
  const ra = execFileSync(process.execPath, [path.join(GOI, 'scripts', 'dieu-phoi.mjs'), 'hieu-chuan'], { cwd: k1.w, encoding: 'utf8' });
  console.log(ra.replace(/^/gm, '  '));
  const dongRa = ra.trim().split('\n');
  assert.ok(dongRa.includes('s4 · 20 lượt · p95 19.0 GB · nguồn sổ'), 'dòng s4');
  assert.ok(dongRa.includes('ghim-lai · 0 lượt · p95 — · nguồn chưa hiệu chuẩn'), 'dòng ghim-lai');
  assert.ok(dongRa.includes('hạ tầng đốt: P2 b · trống 9.5 GB · áp lực 1'), 'dòng hạ tầng đốt');
  assert.equal(dongRa.filter((d) => d.startsWith('hạ tầng đốt:')).length, 1);
});

// ---------- AC-9: số đo hỏng đi về phía hiện trạng ----------
test('SK-09 so-do-hong-khong-chan', async () => {
  const { dot, k1 } = dungDot(GOI, { sucKhoe: { dinh_lan_gb: { s4: 12 } } });
  xin(dot, 'P1', 's4', k1.w, 'a');
  await nhip(GOI, dot, soMoi(MAY.mbp, { mucText: 'lỗi\n' }));
  const tt = trangThai(dot);
  const hang = [hangMoi('chỗ trống null', 'null · s4 P1 · thieu-cho 0 · dang-chay', `${tt.suc_khoe.choTrongGb} · s4 ${chuKhoa(dot, 's4')?.phien ?? 'vắng'} · thieu-cho ${dem(dot, 'thieu-cho').length} · ${tt.trang_thai}`)];
  assert.deepEqual(inMaTran('SK-09', hang), []);
});
