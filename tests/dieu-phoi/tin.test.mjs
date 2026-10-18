// Ca đo của hồ sơ vong-mo-co-chu-giu (hàng GT1 — vòng mở có chủ giữ). Tên ca bắt đầu «GT-». Mỗi phép đo là một hàm
// trả danh sách lỗi trên MỘT gốc gói; ca đỏ chạy CHÍNH hàm ấy trên bản sao bị tiêm (kiểm bước tiêm áp), SAU khi gói
// thật xanh trên cùng fixture, và ghim thông điệp của đúng lỗi được tiêm. Ma trận viết sẵn: số assert = số hàng, in ra.
import { test, after } from 'node:test';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import { DAY, GOI, bamCay, banSao, docJ, donDep, ghGia, ghiJ, git, hoSo, inMaTran, khoDot, nap, tin } from './tin-kho-thu.mjs';

after(donDep);
const CA_THAT = docJ(path.join(DAY, 'fixtures', 'tin', 'ca-that.json'));
const T0 = Date.parse('2026-10-18T08:00:00Z');
const PHUT = 60_000;
const iso = (ms) => new Date(ms).toISOString();

// ---------- AC-4: bộ đọc dòng đầu ----------
async function kiemDongDau(gocGoi) {
  const { docDongDau, vietDongDau, gapSo } = await nap(gocGoi, 'tin-doc.mjs');
  const loi = [];
  const hang = [];
  const so = (ten, ky, thuc, dung) => {
    hang.push({ hang: ten, ky_vong: ky, thuc_te: JSON.stringify(thuc) });
    if (!dung) loi.push(`${ten}: mong ${ky}, nhận ${JSON.stringify(thuc)}`);
  };
  // (a) thân có «XONG MBP-1710-1» mà dòng đầu là BÁO → vòng vẫn mở.
  const giao = { text: `${vietDongDau({ khau_lenh: 'GIAO', ma: 'MBP-1710-1', tu: 'MBP', den: 'M5' })}\nÝ định: thử`, luc: iso(T0) };
  const bao = { text: `${vietDongDau({ khau_lenh: 'BÁO', ma: 'M5-1710-1', tu: 'M5', den: 'MBP' })}\nXONG MBP-1710-1 · M5 → MBP\nđã làm`, luc: iso(T0 + PHUT) };
  const v = gapSo([giao, bao], { nowMs: T0 + 2 * PHUT }).find((x) => x.ma === 'MBP-1710-1');
  so('(a)', 'vòng MBP-1710-1 vẫn chua-den', v?.trang_thai, v?.trang_thai === 'chua-den');
  // (b) dòng đầu thật 16/10 «#453 chưa gọi lượt» → không khẩu lệnh nào (khuôn cũ).
  const b = docDongDau(CA_THAT.chua_goi_luot_16_10.body);
  so('(b)', 'không khẩu lệnh', b, !b?.khau_lenh);
  // (c) viết thường.
  const c = docDongDau('xong MBP-1710-1 · M5 → MBP');
  so('(c)', 'null', c, c === null);
  // (d) NHẬN dạng NFD.
  const d = docDongDau('NHẬN MBP-1710-1 · M5 → MBP'.normalize('NFD'));
  so('(d)', 'NHẬN', d?.khau_lenh, d?.khau_lenh === 'NHẬN');
  // (e) HỦY → HUỶ.
  const e = docDongDau('HỦY MBP-1710-1 · MBP → M5');
  so('(e)', 'HUỶ', e?.khau_lenh, e?.khau_lenh === 'HUỶ');
  // (f) dòng đầu khuôn cũ thật trên #308.
  const f = docDongDau(CA_THAT.khuon_cu_308_17_10.body);
  so('(f)', 'cu: true', f, f?.cu === true);
  // (g) tin rỗng.
  let g;
  try {
    g = docDongDau('');
  } catch (x) {
    g = `ném: ${x.message}`;
  }
  so('(g)', 'null', g, g === null);
  // (h) MỞ LẠI: NFC, NFD, hai dấu cách, «MỞ» một mình.
  const h1 = docDongDau('MỞ LẠI G-1810-1 · G → P2');
  so('(h) NFC', 'MỞ LẠI', h1?.khau_lenh, h1?.khau_lenh === 'MỞ LẠI');
  const h2 = docDongDau('MỞ LẠI G-1810-1 · G → P2'.normalize('NFD'));
  so('(h) NFD', 'MỞ LẠI', h2?.khau_lenh, h2?.khau_lenh === 'MỞ LẠI');
  const h3 = docDongDau('MỞ  LẠI G-1810-1 · G → P2');
  so('(h) hai dấu cách', 'MỞ LẠI', h3?.khau_lenh, h3?.khau_lenh === 'MỞ LẠI');
  const h4 = docDongDau('MỞ G-1810-1 · G → P2');
  so('(h) MỞ một mình', 'null', h4, h4 === null);
  return { loi, hang };
}

test('GT-04 dong-dau', async () => {
  const { loi, hang } = await kiemDongDau(GOI);
  inMaTran('GT-04', hang);
  assert.equal(hang.length, 11);
  assert.deepEqual(loi, []);
});

test('GT-04-do doc-than', async () => {
  const goc = banSao('tin-doc.mjs', "const dau = chuan(text).split('\\n')[0]", "const dau = chuan(text).split('\\n').find((l) => /^(XONG|NHẬN) /u.test(l)) ?? chuan(text).split('\\n')[0]");
  const { loi } = await kiemDongDau(goc);
  assert.ok(loi.some((l) => l.startsWith('(a):')), `bản tiêm phân loại trên thân phải làm (a) đỏ, nhận: ${loi.join(' | ')}`);
});

test('GT-04-do mot-tu', async () => {
  const goc = banSao('tin-doc.mjs', 'const THEO_DO_DAI = [...KHAU_LENH, ...Object.keys(BI_DANH)].sort((a, b) => b.length - a.length);', "const THEO_DO_DAI = [...KHAU_LENH, ...Object.keys(BI_DANH)].map((k) => k.split(' ')[0]);");
  const { loi } = await kiemDongDau(goc);
  assert.ok(loi.some((l) => l.startsWith('(h)')), `bản tiêm chỉ lấy từ đầu phải làm (h) đỏ, nhận: ${loi.join(' | ')}`);
});

// ---------- AC-3 (phần thuần): gấp sổ theo thang chín nấc ----------
export async function kiemGapSo(gocGoi) {
  const { vietDongDau, gapSo, soMo } = await nap(gocGoi, 'tin-doc.mjs');
  const loi = [];
  const hang = [];
  const so = (ten, ky, thuc) => {
    const dung = JSON.stringify(thuc) === JSON.stringify(ky);
    hang.push({ hang: ten, ky_vong: JSON.stringify(ky), thuc_te: JSON.stringify(thuc) });
    if (!dung) loi.push(`${ten}: mong ${JSON.stringify(ky)}, nhận ${JSON.stringify(thuc)}`);
  };
  const t = (kl, ma, tu, den, than, ms) => ({ text: `${vietDongDau({ khau_lenh: kl, ma, tu, den })}\n${than}`, luc: iso(ms) });
  // Bảng trạng thái — mỗi vòng dừng ở một nấc.
  const dong = [
    t('GIAO', 'G-1810-1', 'G', 'P1', 'Ý định: một\nHạn xong: 60 phút sau khi nhận', T0),
    t('GIAO', 'G-1810-2', 'G', 'P2', 'Ý định: hai', T0 + 1 * PHUT),
    { may: 'da-den', ma: 'G-1810-2', luc: iso(T0 + 2 * PHUT) },
    t('GIAO', 'G-1810-3', 'G', 'P2', 'Ý định: ba', T0 + 3 * PHUT),
    t('NHẬN', 'G-1810-3', 'P2', 'G', 'Sẽ giao: một bản sửa nhỏ\nHạn xong: chưa có hạn', T0 + 4 * PHUT),
    t('GIAO', 'G-1810-4', 'G', 'P2', 'Ý định: bốn', T0 + 5 * PHUT),
    t('NHẬN', 'G-1810-4', 'P2', 'G', 'Sẽ giao: x y z', T0 + 6 * PHUT),
    t('KẸT', 'G-1810-4', 'P2', 'G', 'Cần: quyền', T0 + 7 * PHUT),
    t('GIAO', 'G-1810-5', 'G', 'P2', 'Ý định: năm', T0 + 8 * PHUT),
    t('NHẬN', 'G-1810-5', 'P2', 'G', 'Sẽ giao: x y z', T0 + 9 * PHUT),
    t('XONG', 'G-1810-5', 'P2', 'G', 'Vật: abc', T0 + 10 * PHUT),
    t('GIAO', 'G-1810-6', 'G', 'P2', 'Ý định: sáu', T0 + 11 * PHUT),
    t('NHẬN', 'G-1810-6', 'P2', 'G', 'Sẽ giao: x y z', T0 + 12 * PHUT),
    t('XONG', 'G-1810-6', 'P2', 'G', 'Vật: abc', T0 + 13 * PHUT),
    { may: 'chap-nhan', ma: 'G-1810-6', luc: iso(T0 + 14 * PHUT) },
    t('GIAO', 'G-1810-7', 'G', 'P2', 'Ý định: bảy', T0 + 15 * PHUT),
    t('TRẢ', 'G-1810-7', 'P2', 'G', 'Lý do: không phải việc tôi\nChuyển: không ai', T0 + 16 * PHUT),
    t('BÁO', 'G-1810-8', 'G', 'P2', 'chỉ báo', T0 + 17 * PHUT),
    { yeu_cau: 'P1-7', phien: 'P1', luc: iso(T0 + 18 * PHUT), da_tra_loi: false },
  ];
  const now = T0 + 20 * PHUT;
  const tat = gapSo(dong, { nowMs: now });
  const nac = Object.fromEntries(tat.map((v) => [v.ma, [v.trang_thai, v.nac]]));
  so('trạng thái + nấc', {
    'G-1810-1': ['chua-den', 1], 'G-1810-2': ['da-den', 2], 'G-1810-3': ['da-nhan', 5], 'G-1810-4': ['ket', 6],
    'G-1810-5': ['cho-chap-nhan', 7], 'G-1810-6': ['da-chap-nhan', 8], 'G-1810-7': ['dong', null], 'P1-7': ['chua-den', 1],
  }, nac);
  so('sổ mở (cũ trước, BÁO vắng, đóng vắng)', ['G-1810-1', 'G-1810-2', 'G-1810-3', 'G-1810-4', 'G-1810-5', 'P1-7'], soMo(tat).map((v) => v.ma));
  // Yêu cầu cũ có trả lời → biến khỏi sổ mở.
  const daTra = soMo(gapSo([{ yeu_cau: 'P1-7', phien: 'P1', luc: iso(T0), da_tra_loi: true }], { nowMs: now })).map((v) => v.ma);
  so('yêu cầu cũ có tra-loi', [], daTra);
  // Ma trận quá hạn nhận (hạn mặc định 30′; --han 10).
  const mot = (than, phut, nhan = false) => {
    const d = [t('GIAO', 'G-1810-9', 'G', 'P1', than, T0)];
    if (nhan) d.push(t('NHẬN', 'G-1810-9', 'P1', 'G', 'Sẽ giao: x y z', T0 + PHUT));
    return gapSo(d, { nowMs: T0 + phut * PHUT })[0].qua_han_nhan;
  };
  so('quá hạn nhận phút 29', 0, mot('Ý định: x', 29));
  so('quá hạn nhận phút 31', 1, mot('Ý định: x', 31));
  so('quá hạn nhận phút 61', 2, mot('Ý định: x', 61));
  so('quá hạn nhận --han 10 phút 11', 1, mot('Ý định: x\nHạn nhận: 10 phút', 11));
  so('quá hạn nhận --han 10 phút 21', 2, mot('Ý định: x\nHạn nhận: 10 phút', 21));
  so('đã NHẬN phút 61', 0, mot('Ý định: x', 61, true));
  so('đã NHẬN phút 200', 0, mot('Ý định: x', 200, true));
  // Quá hạn xong.
  const nhanLuc = T0 + PHUT;
  const voiHan = (phut, { choCong = false, moLai = false } = {}) => {
    const d = [
      t('GIAO', 'G-1810-10', 'G', 'P1', 'Ý định: x\nHạn xong: 60 phút sau khi nhận', T0),
      t('NHẬN', 'G-1810-10', 'P1', 'G', `Sẽ giao: x y z\nHạn xong: ${iso(nhanLuc + 60 * PHUT)}`, nhanLuc),
    ];
    if (moLai) {
      d.push(t('XONG', 'G-1810-10', 'P1', 'G', 'Vật: a', nhanLuc + 10 * PHUT));
      d.push({ may: 'chap-nhan', ma: 'G-1810-10', luc: iso(nhanLuc + 11 * PHUT) });
      d.push(t('MỞ LẠI', 'G-1810-10', 'G', 'P1', 'Vì sao: chưa đạt', nhanLuc + 100 * PHUT));
    }
    return gapSo(d, { nowMs: nhanLuc + phut * PHUT, choCong: new Set(choCong ? ['G-1810-10'] : []) })[0].qua_han_xong;
  };
  so('quá hạn xong phút 59', 0, voiHan(59));
  so('quá hạn xong phút 61', 1, voiHan(61));
  so('quá hạn xong phút 121', 2, voiHan(121));
  so('quá hạn xong khi chờ cổng người', 0, voiHan(121, { choCong: true }));
  so('vòng mo-lai dùng hạn mới (phút 130 = 30′ sau MỞ LẠI)', 0, voiHan(130, { moLai: true }));
  const khongHan = gapSo([t('GIAO', 'G-1810-11', 'G', 'P1', 'Ý định: x', T0), t('NHẬN', 'G-1810-11', 'P1', 'G', 'Sẽ giao: x y z\nHạn xong: chưa có hạn', T0 + PHUT)], { nowMs: T0 + 9999 * PHUT })[0].qua_han_xong;
  so('vòng không hạn', 0, khongHan);
  return { loi, hang };
}

test('GT-03 so-vong-mo', async () => {
  const { loi, hang } = await kiemGapSo(GOI);
  inMaTran('GT-03 gấp sổ', hang);
  assert.equal(hang.length, 16);
  assert.deepEqual(loi, []);
});

test('GT-03-do ket-dong-vong', async () => {
  const goc = banSao('tin-doc.mjs', "else if (k === 'KẸT') v.trang_thai = 'ket';", "else if (k === 'KẸT') v.trang_thai = 'dong';");
  const { loi } = await kiemGapSo(goc);
  assert.ok(loi.some((l) => l.startsWith('trạng thái + nấc') && l.includes('G-1810-4')), `KẸT đóng vòng phải làm mục ket mất, nhận: ${loi.join(' | ')}`);
});

test('GT-03-do chap-nhan-mot-phia', async () => {
  const goc = banSao('tin-doc.mjs', "else if (k === 'XONG') Object.assign(v, { trang_thai: 'cho-chap-nhan',", "else if (k === 'XONG') Object.assign(v, { trang_thai: 'da-chap-nhan',");
  const { loi } = await kiemGapSo(goc);
  assert.ok(loi.some((l) => l.includes('G-1810-5')), `chấp nhận một phía phải làm mục cho-chap-nhan mất, nhận: ${loi.join(' | ')}`);
  console.log('  chấp nhận một phía bị bắt');
});

// ---------- AC-1: gửi — giao một câu, máy điền năm trường ----------
const NHAN6 = ['Ý định:', 'Kết quả:', 'Ranh giới:', 'Quyền:', 'Điểm phải hỏi:', 'Báo về:'];
const ddmm = (ms) => { const d = new Date(ms); return `${String(d.getUTCDate()).padStart(2, '0')}${String(d.getUTCMonth() + 1).padStart(2, '0')}`; };
const thuTuNhan = (text) => NHAN6.map((n) => text.split('\n').findIndex((l) => l.startsWith(n)));

export async function kiemGui(gocGoi) {
  const loi = [];
  const hang = [];
  const so = (ten, ky, thuc, dung) => {
    hang.push({ hang: ten, ky_vong: ky, thuc_te: String(thuc).slice(0, 160) });
    if (!dung) loi.push(`${ten}: mong ${ky}, nhận ${String(thuc).slice(0, 300)}`);
  };
  const k = khoDot({ gocGoi });
  const o = { gocGoi, nowMs: T0 };
  const D = ddmm(T0);
  const cau = 'crm cần đọc lộ trình nhiều kho trước 22/10';
  // (a)
  const a = tin(k.kho, ['GIAO', 'P2', cau], o);
  const tt = thuTuNhan(a.out);
  const dong = (n) => a.out.split('\n').find((l) => l.startsWith(n)) ?? '';
  so('(a) mã + dòng đầu', `GIAO G-${D}-1 · G → P2`, a.out.split('\n')[0], a.ma === 0 && a.out.split('\n')[0] === `GIAO G-${D}-1 · G → P2`);
  so('(a) sáu nhãn đúng thứ tự', 'tăng dần, không -1', tt.join(','), tt.every((x, i) => x >= 0 && (i === 0 || x > tt[i - 1])));
  so('(a) Ý định', cau, dong('Ý định:'), dong('Ý định:') === `Ý định: ${cau}`);
  so('(a) Kết quả', 'hang-b + main', dong('Kết quả:'), dong('Kết quả:').includes('hang-b') && dong('Kết quả:').includes('main'));
  const rg = dong('Ranh giới:');
  so('(a) Ranh giới', 'thu/kho-a + worktree P2 + ranh_gioi', rg, rg.includes('thu/kho-a') && rg.includes(k.w2) && rg.includes('src/b/**') && rg.includes('tests/b/**'));
  so('(a) Quyền', 'không tự gộp', dong('Quyền:'), dong('Quyền:').includes('không tự gộp'));
  so('(a) Báo về', 's-gs', dong('Báo về:'), dong('Báo về:').includes('s-gs'));
  so('(a) chạm', '1', a.cham, a.cham === 1);
  // (b)
  const b = tin(k.kho, ['GIAO', 'P2', cau], o);
  so('(b)', `G-${D}-2`, b.out.split('\n')[0], b.out.startsWith(`GIAO G-${D}-2 `));
  // (e) thiếu ý định
  const bam = () => bamCay(k.dot);
  let h0 = bam();
  const e = tin(k.kho, ['GIAO', 'P2'], o);
  so('(e)', 'thoát 1 «thiếu ý định», 0 byte', `${e.ma} ${e.err}`, e.ma === 1 && e.err.includes('thiếu ý định') && bam() === h0);
  // (i) chuẩn bị: yêu cầu cũ P1-7
  ghiJ(`${k.dot}/yeu-cau/P1-7.json`, { phien: 'P1', loai: 'khac', hang: null, noi_dung: {}, luc: new Date(T0).toISOString() });
  // (f) HỎI
  const f1 = tin(k.w1, ['HỎI', 'G', 'cần chen một lượt gộp không?'], o);
  const f2 = tin(k.w1, ['HỎI', 'G', 'có giữ tệp mo-dot không?', '--chan'], o);
  const soJ = JSON.parse(tin(k.kho, ['so', '--json'], o).out || '[]');
  const v1 = soJ.find((v) => v.ma === `P1-${D}-1`);
  const v2 = soJ.find((v) => v.ma === `P1-${D}-2`);
  so('(f) HỎI mã + chặn', `P1-${D}-1 chan false · P1-${D}-2 chan true`, `${f1.out.split('\n')[0]} ${v1?.chan} ${v2?.chan}`, f1.ma === 0 && f2.ma === 0 && v1?.chan === false && v2?.chan === true && f1.cham === 1);
  // (g) khẩu lệnh lạ
  h0 = bam();
  const g = tin(k.kho, ['DUYỆT', 'P2', 'x'], o);
  const du9 = ['GIAO', 'HỎI', 'BÁO', 'NHẬN', 'XONG', 'KẸT', 'TRẢ', 'HUỶ', 'MỞ LẠI'].every((x) => g.err.includes(x));
  so('(g)', 'thoát 1, đủ chín khẩu lệnh, 0 byte', `${g.ma} ${g.err}`, g.ma === 1 && du9 && bam() === h0);
  // (h) ngoài đợt
  h0 = bam();
  const hh = tin(k.w3, ['GIAO', 'P2', cau], o);
  so('(h)', 'thoát 1 «không thuộc đợt», 0 byte', `${hh.ma} ${hh.err}`, hh.ma === 1 && hh.err.includes('không thuộc đợt') && bam() === h0);
  // (i)
  const maF = f1.out.split('\n')[0].split(' ')[1];
  so('(i)', 'ba khúc, khác P1-7', maF, maF.split('-').length === 3 && maF !== 'P1-7');
  // (j) nguồn suy — kho riêng: P2 có hang-a (ưu tiên 1) và hang-b (ưu tiên 2)
  const k2 = khoDot({ gocGoi, hang: [{ ma: 'A', slug: 'hang-a', day: 'P2', uu_tien: 1 }, { ma: 'B', slug: 'hang-b', day: 'P2', uu_tien: 2, ranh_gioi: ['src/b/**'] }] });
  hoSo(k2.w2, 'hang-a', { status: 'implemented' });
  // Hàng kế của dãy đã trỏ hang-b (bộ phát lịch) trong khi hang-a còn dở — hai lối cho hai đáp số khác nhau.
  ghiJ(`${k2.dot}/tiep/P2.json`, { hang: 'hang-b' });
  const kq = (r) => r.out.split('\n').find((l) => l.startsWith('Kết quả:')) ?? r.err;
  const j1 = tin(k2.kho, ['GIAO', 'P2', 'sửa ca đỏ trong PR hiện tại'], o);
  so('(j) đang giữa hang-a', 'hang-a', kq(j1), kq(j1).includes('hồ sơ hang-a '));
  const j4 = tin(k2.kho, ['GIAO', 'P2', 'làm trước hàng sau', '--hang', 'hang-b'], o);
  so('(j) --hang hang-b khi giữa hang-a', 'hang-b', kq(j4), kq(j4).includes('hồ sơ hang-b '));
  const j5 = tin(k2.kho, ['GIAO', 'P2', 'việc riêng', '--ket-qua', 'một bảng số trong kênh'], o);
  so('(j) --ket-qua', 'đúng câu', kq(j5), kq(j5) === 'Kết quả: một bảng số trong kênh');
  fs.rmSync(`${k2.w2}/_acceptance/hang-a/contract.md`);
  git(k2.w2, 'commit', '-qam', 'bo hop dong');
  ghiJ(`${k2.dot}/tiep/P2.json`, { hang: 'hang-b' });
  const j2 = tin(k2.kho, ['GIAO', 'P2', 'bắt đầu hàng kế'], o);
  so('(j) chưa vào hàng', 'hang-b', kq(j2), kq(j2).includes('hồ sơ hang-b '));
  ghiJ(`${k2.dot}/tiep/P2.json`, { hang: null, xong: true });
  const j3 = tin(k2.kho, ['GIAO', 'P2', 'còn gì nữa không'], o);
  so('(j) hết hàng', 'thoát 1 «không suy được Kết quả»', `${j3.ma} ${j3.err}`, j3.ma === 1 && j3.err.includes('không suy được Kết quả'));
  // (k) hạn xong — một khuôn
  const k3 = khoDot({ gocGoi, hang: [{ ma: 'B', slug: 'hang-b', day: 'P2', uu_tien: 1 }, { ma: 'C', slug: 'hang-c', day: 'P2', uu_tien: 2 }] });
  hoSo(k3.w2, 'hang-b', { gioMay: [4, 7] });
  hoSo(k3.w2, 'hang-c');
  const han = (r) => r.out.split('\n').find((l) => l.startsWith('Hạn xong:')) ?? r.err;
  const k1 = tin(k3.kho, ['GIAO', 'P2', 'làm trọn hàng b', '--hang', 'hang-b'], o);
  so('(k) trọn hàng có giờ máy', 'Hạn xong: 420 phút sau khi nhận', han(k1), han(k1) === 'Hạn xong: 420 phút sau khi nhận');
  const kc = tin(k3.kho, ['GIAO', 'P2', 'làm trọn hàng c', '--hang', 'hang-c'], o);
  so('(k) trọn hàng không giờ máy', 'chưa có hạn', han(kc), han(kc) === 'Hạn xong: chưa có hạn');
  const kl = tin(k3.kho, ['GIAO', 'P2', 'chạy lại E7 rồi báo'], o);
  so('(k) việc lẻ', 'chưa có hạn', han(kl), han(kl) === 'Hạn xong: chưa có hạn');
  const k90 = tin(k3.kho, ['GIAO', 'P2', 'chạy lại E7 rồi báo', '--han-xong', '90'], o);
  so('(k) việc lẻ --han-xong 90', 'Hạn xong: 90 phút sau khi nhận', han(k90), han(k90) === 'Hạn xong: 90 phút sau khi nhận');
  return { loi, hang, k };
}

test('GT-01 gui-mot-cau', async () => {
  const { loi, hang } = await kiemGui(GOI);
  inMaTran('GT-01', hang);
  assert.equal(hang.length, 23);
  assert.deepEqual(loi, []);
});

test('GT-01-do bo-ranh-gioi', async () => {
  const goc = banSao('tin-giao.mjs', "export const NHAN_LOI_GIAO = ['Ý định', 'Kết quả', 'Ranh giới', 'Quyền', 'Điểm phải hỏi', 'Báo về'];", "export const NHAN_LOI_GIAO = ['Ý định', 'Kết quả', 'Quyền', 'Điểm phải hỏi', 'Báo về', 'Ghi chú'];");
  const { loi } = await kiemGui(goc);
  assert.ok(loi.some((l) => l.includes('Ranh giới')), `bỏ dòng Ranh giới phải đỏ nêu «Ranh giới», nhận: ${loi.join(' | ')}`);
});

test('GT-01-do luon-hang-ke', async () => {
  const goc = banSao('tin-giao.mjs', '  if (dangChay) return dangChay;', '  if (false) return dangChay;');
  const { loi } = await kiemGui(goc);
  assert.ok(loi.some((l) => l.startsWith('(j) đang giữa hang-a')), `luôn lấy hàng kế phải làm hàng «đang giữa hang-a» đỏ, nhận: ${loi.join(' | ')}`);
});

// ---------- AC-2: đáp — nhận kèm một câu, xong tự đính vật, MỞ LẠI (hàng đợt; hàng kênh ở việc 3) ----------
export async function kiemDap(gocGoi) {
  const loi = [];
  const hang = [];
  const so = (ten, ky, thuc, dung) => {
    hang.push({ hang: ten, ky_vong: ky, thuc_te: String(thuc).slice(0, 160) });
    if (!dung) loi.push(`${ten}: mong ${ky}, nhận ${String(thuc).slice(0, 300)}`);
  };
  const k = khoDot({ gocGoi });
  const D = ddmm(T0);
  const gh = ghGia({ pr: { p2: 'https://github.com/thu/kho-a/pull/7' } });
  const o = (phut = 0) => ({ gocGoi, nowMs: T0 + phut * PHUT, gh: gh.lenh });
  const bam = () => bamCay(k.dot);
  tin(k.kho, ['GIAO', 'P2', 'việc một cho P2'], o(0)); // G-1
  tin(k.kho, ['GIAO', 'P2', 'việc hai cho P2'], o(0)); // G-2
  tin(k.kho, ['GIAO', 'P2', 'việc ba cho P2', '--han-xong', '90'], o(0)); // G-3
  tin(k.w1, ['HỎI', 'G', 'có giữ tệp mo-dot không?'], o(0)); // P1-1
  // (a′) câu «sẽ giao» — bốn hàng thoát 1 trên G-2
  for (const [ten, du] of [['không câu', []], ['"ok"', ['ok']], ['chỉ «sẽ giao»', ['sẽ giao']], ['hai câu', ['sẽ giao bản sửa lệnh tin. Rồi làm thêm bảng số.']]]) {
    const h0 = bam();
    const r = tin(k.w2, ['NHẬN', `G-${D}-2`, ...du], o(1));
    so(`(a′) ${ten}`, 'thoát 1 «sẽ giao», 0 byte', `${r.ma} ${r.err}`, r.ma === 1 && r.err.includes('sẽ giao') && bam() === h0);
  }
  // (a) NHẬN kèm câu
  const a = tin(k.w2, ['NHẬN', `G-${D}-1`, 'sẽ giao bản sửa lệnh tin cho đợt'], o(1));
  so('(a) dòng đầu', `NHẬN G-${D}-1 · P2 → G`, a.out.split('\n')[0], a.ma === 0 && a.out.split('\n')[0] === `NHẬN G-${D}-1 · P2 → G`);
  so('(a) Sẽ giao', 'bản sửa lệnh tin cho đợt', a.out, a.out.includes('Sẽ giao: bản sửa lệnh tin cho đợt'));
  so('(a) chạm', '1', a.cham, a.cham === 1);
  const muc1 = JSON.parse(tin(k.kho, ['so', '--json'], o(1)).out).find((v) => v.ma === `G-${D}-1`);
  so('(a) sổ G: Sẽ giao cạnh Ý định', 'y_dinh + se_giao', `${muc1?.y_dinh} | ${muc1?.se_giao}`, muc1?.y_dinh === 'việc một cho P2' && muc1?.se_giao === 'bản sửa lệnh tin cho đợt');
  const a3 = tin(k.w2, ['NHẬN', `G-${D}-3`, 'sẽ giao việc ba đúng hạn'], o(2));
  so('(a) Hạn xong từ lời giao', new Date(T0 + 92 * PHUT).toISOString(), a3.out, a3.out.includes(`Hạn xong: ${new Date(T0 + 92 * PHUT).toISOString()}`));
  const xl = '2026-10-18T16:00:00.000Z';
  const a2 = tin(k.w2, ['NHẬN', `G-${D}-2`, 'sẽ giao việc hai trước bốn giờ', '--xong-luc', xl], o(2));
  so('(a′) --xong-luc', xl, a2.out, a2.out.includes(`Hạn xong: ${xl}`));
  const ah = tin(k.kho, ['NHẬN', `P1-${D}-1`], o(2));
  so('(a′) NHẬN HỎI không câu', 'thoát 0', `${ah.ma} ${ah.err}`, ah.ma === 0);
  // (e) thiếu điều kiện tự đính — chưa có commit mới, rồi cây bẩn
  let h0 = bam();
  const e1 = tin(k.w2, ['XONG', `G-${D}-1`], o(3));
  so('(e) chưa có commit mới', 'thoát 1 đòi --vat', `${e1.ma} ${e1.err}`, e1.ma === 1 && e1.err.includes('chưa có commit mới') && e1.err.includes('--vat') && bam() === h0);
  fs.writeFileSync(`${k.w2}/ban.txt`, 'chưa commit\n');
  h0 = bam();
  const e2 = tin(k.w2, ['XONG', `G-${D}-1`], o(3));
  so('(e) cây chưa sạch', 'thoát 1', `${e2.ma} ${e2.err}`, e2.ma === 1 && e2.err.includes('cây chưa sạch') && bam() === h0);
  // (d) không có PR — làm TRƯỚC (c) để giữa lần XONG của G-1 và lần MỞ LẠI không có commit nào khác.
  gh.dat({ pr: {} });
  git(k.w2, 'add', '-A');
  git(k.w2, 'commit', '-qm', 'viec ba');
  const d = tin(k.w2, ['XONG', `G-${D}-3`], o(4));
  so('(d) không PR', 'sha + nhánh, không PR', `${d.ma} ${d.out}`, d.ma === 0 && d.out.includes('· nhánh p2') && !d.out.includes('PR '));
  // (c) commit mới, cây sạch, có PR
  gh.dat({ pr: { p2: 'https://github.com/thu/kho-a/pull/7' } });
  fs.writeFileSync(`${k.w2}/b.txt`, 'b\n');
  git(k.w2, 'add', '-A');
  git(k.w2, 'commit', '-qm', 'viec mot');
  const head = git(k.w2, 'rev-parse', 'HEAD');
  const c = tin(k.w2, ['XONG', `G-${D}-1`], o(5));
  so('(c) vật tự đính', `sha ${head} · nhánh p2 · PR …/pull/7`, c.out, c.ma === 0 && c.out.includes(`Vật: sha ${head} · nhánh p2 · PR https://github.com/thu/kho-a/pull/7`));
  so('(c) chạm', '0', c.cham, c.cham === 0);
  // (e) --vat
  const ev = tin(k.w2, ['XONG', `G-${D}-2`, '--vat', 'bảng số đã dán vào kênh'], o(5));
  so('(e) --vat', 'Vật: đúng câu', ev.out, ev.ma === 0 && ev.out.includes('Vật: bảng số đã dán vào kênh'));
  // (f) XONG HỎI
  h0 = bam();
  const f0 = tin(k.kho, ['XONG', `P1-${D}-1`], o(6));
  so('(f) thiếu câu trả lời', 'thoát 1', `${f0.ma} ${f0.err}`, f0.ma === 1 && f0.err.includes('câu trả lời') && bam() === h0);
  const f1 = tin(k.kho, ['XONG', `P1-${D}-1`, 'không giữ, cứ chạm'], o(6));
  so('(f) có câu', 'thoát 0', `${f1.ma} ${f1.err}`, f1.ma === 0);
  // (g) (h) người không đúng vai — vòng G-4 mới
  tin(k.kho, ['GIAO', 'P2', 'việc bốn cho P2'], o(7));
  h0 = bam();
  const g = tin(k.w1, ['XONG', `G-${D}-4`, '--vat', 'x'], o(7));
  so('(g) không phải người nhận', 'thoát 1', `${g.ma} ${g.err}`, g.ma === 1 && g.err.includes('không phải người nhận') && bam() === h0);
  const hh = tin(k.w2, ['HUỶ', `G-${D}-4`, 'không cần nữa'], o(7));
  so('(h) chỉ người giao', 'thoát 1', `${hh.ma} ${hh.err}`, hh.ma === 1 && hh.err.includes('chỉ người giao') && bam() === h0);
  // (i) mã không có
  const i = tin(k.w2, ['NHẬN', 'P9-0101-1', 'sẽ giao một việc không có'], o(7));
  so('(i)', 'thoát 1 «không có vòng»', `${i.ma} ${i.err}`, i.ma === 1 && i.err.includes('không có vòng') && bam() === h0);
  // (j) KẸT sau XONG
  const j = tin(k.w2, ['KẸT', `G-${D}-1`, 'cần quyền'], o(8));
  so('(j)', 'thoát 1 «đã giao» + «MỞ LẠI là của người giao»', `${j.ma} ${j.err}`, j.ma === 1 && j.err.includes('đã giao') && j.err.includes('MỞ LẠI là của người giao') && bam() === h0);
  // (k) (l)
  const kk = tin(k.w2, ['KẸT', `G-${D}-4`], o(8));
  so('(k)', 'thoát 1 «cần gì»', `${kk.ma} ${kk.err}`, kk.ma === 1 && kk.err.includes('cần gì') && bam() === h0);
  const l = tin(k.w2, ['TRẢ', `G-${D}-4`, 'không phải việc tôi'], o(8));
  so('(l)', 'thoát 1 «--chuyen»', `${l.ma} ${l.err}`, l.ma === 1 && l.err.includes('--chuyen') && bam() === h0);
  // (m) MỞ LẠI sau chấp nhận
  fs.appendFileSync(`${k.dot}/tin.jsonl`, `${JSON.stringify({ may: 'chap-nhan', ma: `G-${D}-1`, luc: new Date(T0 + 9 * PHUT).toISOString() })}\n`);
  const m0 = tin(k.kho, ['MỞ', 'LẠI', `G-${D}-1`], o(10));
  so('(m) không câu', 'thoát 1 «vì sao»', `${m0.ma} ${m0.err}`, m0.ma === 1 && m0.err.includes('vì sao'));
  const mp = tin(k.w2, ['MỞ', 'LẠI', `G-${D}-1`, 'tự thấy chưa đạt'], o(10));
  so('(m) P2 gõ', 'thoát 1 «chỉ người giao»', `${mp.ma} ${mp.err}`, mp.ma === 1 && mp.err.includes('chỉ người giao'));
  const m24 = tin(k.kho, ['MỞ', 'LẠI', `G-${D}-1`, 'chưa đạt'], { ...o(0), nowMs: T0 + 9 * PHUT + 25 * 60 * PHUT });
  so('(m) quá 24 giờ', 'thoát 1 «quá 24 giờ»', `${m24.ma} ${m24.err}`, m24.ma === 1 && m24.err.includes('quá 24 giờ'));
  const m = tin(k.kho, ['MỞ', 'LẠI', `G-${D}-1`, 'bản sửa chưa chạy được trên crm'], o(11));
  const sauMo = JSON.parse(tin(k.kho, ['so', '--json'], o(11)).out).find((v) => v.ma === `G-${D}-1`);
  so('(m) mở lại', 'thoát 0, trạng thái mo-lai', `${m.ma} ${sauMo?.trang_thai}`, m.ma === 0 && sauMo?.trang_thai === 'mo-lai');
  h0 = bam();
  const mx = tin(k.w2, ['XONG', `G-${D}-1`], o(12));
  so('(m) XONG sau MỞ LẠI mà HEAD chưa đổi', 'thoát 1 «chưa có commit mới»', `${mx.ma} ${mx.err}`, mx.ma === 1 && mx.err.includes('chưa có commit mới') && bam() === h0);
  fs.writeFileSync(`${k.w2}/c.txt`, 'c\n');
  git(k.w2, 'add', '-A');
  git(k.w2, 'commit', '-qm', 'sua sau mo lai');
  const my = tin(k.w2, ['XONG', `G-${D}-1`], o(13));
  so('(m) commit mới rồi XONG', 'thoát 0', `${my.ma} ${my.err}`, my.ma === 0);
  // (n) hai phiên ghi cùng lúc: 25 BÁO từ G và 25 từ P1, song song — sổ đọc đủ 50, không dòng hỏng.
  const truoc = fs.readFileSync(`${k.dot}/tin.jsonl`, 'utf8').trim().split('\n').length;
  const mot = (cwd, i) => new Promise((ok) => {
    const c = spawn(process.execPath, [`${gocGoi}/scripts/tin.mjs`, 'BÁO', cwd === k.kho ? 'P1' : 'G', `báo số ${i}`], { cwd, env: { ...process.env, DIEU_PHOI_NOW_MS: String(T0 + 20 * PHUT) } });
    c.on('close', ok);
  });
  await Promise.all([...Array(25).keys()].flatMap((i) => [mot(k.kho, i), mot(k.w1, i)]));
  const sau = fs.readFileSync(`${k.dot}/tin.jsonl`, 'utf8').trim().split('\n');
  const hong = sau.filter((l) => { try { JSON.parse(l); return false; } catch { return true; } }).length;
  so('(n) ghi đồng thời', '+50 dòng, 0 hỏng', `+${sau.length - truoc}, hỏng ${hong}`, sau.length - truoc === 50 && hong === 0);
  // (o) khẩu lệnh ở dạng NFD trên argv.
  const maNam = tin(k.kho, ['GIAO', 'P2', 'việc năm cho P2'], o(21)).out.split(' ')[1];
  const nfd = tin(k.w2, ['NHẬN'.normalize('NFD'), maNam, 'sẽ giao việc năm trong hôm nay'.normalize('NFD')], o(21));
  so('(o) argv NFD', 'thoát 0', `${nfd.ma} ${nfd.err}`, nfd.ma === 0);
  return { loi, hang };
}

test('GT-02 dap-khong-kem', async () => {
  const { loi, hang } = await kiemDap(GOI);
  inMaTran('GT-02', hang);
  assert.equal(hang.length, 33);
  assert.deepEqual(loi, []);
});

test('GT-02-do bo-commit-moi', async () => {
  const goc = banSao('tin.mjs', "if (!head || head === moc) thieu.push('chưa có commit mới');", "if (!head) thieu.push('chưa có commit mới');");
  const { loi } = await kiemDap(goc);
  assert.ok(loi.some((l) => l.startsWith('(e) chưa có commit mới')), `bỏ kiểm commit mới phải đỏ, nhận: ${loi.join(' | ')}`);
});

test('GT-02-do giu-moc-cu', async () => {
  const goc = banSao('tin.mjs', 'const moc = muc.mo_lai_luc ? muc.sha_xong_cuoi : muc.sha_nhan;', 'const moc = muc.sha_nhan;');
  const { loi } = await kiemDap(goc);
  assert.ok(loi.some((l) => l.startsWith('(m) XONG sau MỞ LẠI')), `không đổi mốc sau MỞ LẠI phải làm (m) đỏ, nhận: ${loi.join(' | ')}`);
});

test('GT-02-do chi-co-mat', async () => {
  const goc = banSao('tin.mjs', "  return cauCon.length === 1 && CAU_SE_GIAO.test(cauCon[0]);", "  return c.length > 0;");
  const { loi } = await kiemDap(goc);
  assert.ok(loi.some((l) => l.startsWith('(a′) "ok"')), `chỉ kiểm có mặt phải làm hàng "ok" đỏ, nhận: ${loi.join(' | ')}`);
});

test('GT-02-do bo-nguoi-nhan', async () => {
  const goc = banSao('tin.mjs', "    if (minh !== muc.den) loi(`${minh} không phải người nhận của ${ma} (người nhận: ${muc.den})`);", '');
  const { loi } = await kiemDap(goc);
  assert.ok(loi.some((l) => l.startsWith('(g)')), `bỏ kiểm người nhận phải làm (g) đỏ, nhận: ${loi.join(' | ')}`);
});
