// Ca đo của hồ sơ vong-mo-co-chu-giu (hàng GT1 — vòng mở có chủ giữ). Tên ca bắt đầu «GT-». Mỗi phép đo là một hàm
// trả danh sách lỗi trên MỘT gốc gói; ca đỏ chạy CHÍNH hàm ấy trên bản sao bị tiêm (kiểm bước tiêm áp), SAU khi gói
// thật xanh trên cùng fixture, và ghim thông điệp của đúng lỗi được tiêm. Ma trận viết sẵn: số assert = số hàng, in ra.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { DAY, GOI, banSao, docJ, donDep, inMaTran, nap } from './tin-kho-thu.mjs';

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
  const goc = banSao('tin-doc.mjs', "else if (k === 'XONG') Object.assign(v, { trang_thai: 'cho-chap-nhan', xong_luc: d.luc });", "else if (k === 'XONG') Object.assign(v, { trang_thai: 'da-chap-nhan', xong_luc: d.luc });");
  const { loi } = await kiemGapSo(goc);
  assert.ok(loi.some((l) => l.includes('G-1810-5')), `chấp nhận một phía phải làm mục cho-chap-nhan mất, nhận: ${loi.join(' | ')}`);
  console.log('  chấp nhận một phía bị bắt');
});
