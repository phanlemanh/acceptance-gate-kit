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

// AC-3 phần lệnh: `tin so` và `xem` trên kho thử — cùng mục mức 2, yêu cầu cũ chỉ đọc.
export async function kiemSoXem(gocGoi) {
  const { CLI_DP, chayNode } = await import('./tin-kho-thu.mjs');
  const loi = [];
  const hang = [];
  const so = (ten, ky, thuc, dung) => {
    hang.push({ hang: ten, ky_vong: ky, thuc_te: String(thuc).slice(0, 160) });
    if (!dung) loi.push(`${ten}: mong ${ky}, nhận ${String(thuc).slice(0, 300)}`);
  };
  const k = khoDot({ gocGoi });
  const D = ddmm(T0);
  ghiJ(`${k.dot}/yeu-cau/P1-7.json`, { phien: 'P1', loai: 'khac', hang: null, noi_dung: {}, luc: new Date(T0).toISOString() });
  const bamYc = () => `${bamCay(`${k.dot}/yeu-cau`)}|${bamCay(`${k.dot}/tra-loi`)}`;
  const h0 = bamYc();
  tin(k.kho, ['GIAO', 'P2', 'việc cần nhận'], { gocGoi, nowMs: T0 });
  const env = { DIEU_PHOI_NOW_MS: String(T0 + 61 * PHUT) };
  const so61 = JSON.parse(tin(k.kho, ['so', '--json'], { gocGoi, nowMs: T0 + 61 * PHUT }).out);
  const mT = so61.find((v) => v.ma === `G-${D}-1`);
  const xj = JSON.parse(chayNode([CLI_DP(gocGoi), 'xem', '--json'], { cwd: k.kho, env }).out);
  const mX = xj.tin?.qua_han_2?.find((v) => v.ma === `G-${D}-1`);
  so('xem --json: mục mức 2 bằng mục tin so', 'deepEqual, qua_han_nhan 2', `${mT?.qua_han_nhan} ${JSON.stringify(mX) === JSON.stringify(mT)}`, mT?.qua_han_nhan === 2 && JSON.stringify(mX) === JSON.stringify(mT));
  const xc = chayNode([CLI_DP(gocGoi), 'xem'], { cwd: k.kho, env }).out;
  so('xem chữ chứa mã', `chứa G-${D}-1`, xc, xc.includes(`G-${D}-1`));
  const cuYc = so61.find((v) => v.ma === 'P1-7');
  so('yêu cầu cũ chưa trả lời → HỎI P1-7 · P1 → G', 'HỎI P1 → G', `${cuYc?.khau_lenh_mo} ${cuYc?.tu} → ${cuYc?.den}`, cuYc?.khau_lenh_mo === 'HỎI' && cuYc?.tu === 'P1' && cuYc?.den === 'G');
  ghiJ(`${k.dot}/tra-loi/P1-7.json`, { ket_qua: 'duyet', boi: 'giam-sat', ly_do: 'x', luc: new Date(T0).toISOString() });
  const h1 = bamYc();
  const sau = JSON.parse(tin(k.kho, ['so', '--json'], { gocGoi, nowMs: T0 + 62 * PHUT }).out);
  so('có tra-loi → mục biến mất, tệp yêu cầu không đổi', 'vắng, băm bằng', `${sau.some((v) => v.ma === 'P1-7')} ${bamYc() === h1}`, !sau.some((v) => v.ma === 'P1-7') && bamYc() === h1 && h0 !== '');
  return { loi, hang };
}

test('GT-03 so-vong-mo', async () => {
  const r1 = await kiemGapSo(GOI);
  const r2 = await kiemSoXem(GOI);
  const hang = [...r1.hang, ...r2.hang];
  inMaTran('GT-03', hang);
  assert.equal(hang.length, 20);
  assert.deepEqual([...r1.loi, ...r2.loi], []);
});

test('GT-03-do xem-bo-tin', async () => {
  const goc = banSao('dieu-phoi.mjs', '  if (tin) dong = `${dong}\\n${dongTin(tin).join(\'\\n\')}`;', '');
  const { loi } = await kiemSoXem(goc);
  assert.ok(loi.some((l) => l.startsWith('xem chữ chứa mã')), `bỏ nhánh đọc tin trong xem phải đỏ nêu mã, nhận: ${loi.join(' | ')}`);
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

async function kiemGuiKenh(gocGoi) {
  const { KENH, khoKenh } = await thuKenh();
  const loi = [];
  const hang = [];
  const so = (ten, ky, thuc, dung) => {
    hang.push({ hang: ten, ky_vong: ky, thuc_te: String(thuc).slice(0, 160) });
    if (!dung) loi.push(`${ten}: mong ${ky}, nhận ${String(thuc).slice(0, 300)}`);
  };
  const gh = ghGia({ nextId: 500 });
  const mbp = khoKenh({ gocGoi, may: 'MBP', gh: gh.lenh });
  const D = ddmm(T0);
  gh.xoaNhatKy();
  const c = tin(mbp, ['GIAO', 'M5', 'crm cần đọc lộ trình nhiều kho', '--hang', 'GT1', '--kenh', KENH], { gocGoi, nowMs: T0, gh: gh.lenh });
  const ghi = gh.nhatKy().filter((x) => x.lenh === 'ghi').length;
  const kq = c.out.split('\n').find((l) => l.startsWith('Kết quả:')) ?? '';
  so('(c) GIAO --kenh', `GIAO MBP-${D}-1 · MBP → M5, 1 bình luận, slug GT1`, `${c.out.split('\n')[0]} ghi=${ghi} ${c.err}`, c.ma === 0 && c.out.split('\n')[0] === `GIAO MBP-${D}-1 · MBP → M5` && ghi === 1 && kq.includes('vong-mo-co-chu-giu'));
  const truoc = fs.readFileSync(`${gh.dir}/ca.json`, 'utf8');
  const d = tin(mbp, ['GIAO', 'M5', 'một việc lẻ trên kênh', '--kenh', KENH], { gocGoi, nowMs: T0, gh: gh.lenh });
  so('(d) GIAO --kenh không --hang', 'thoát 1 «không suy được Kết quả», kênh không đổi', `${d.ma} ${d.err}`, d.ma === 1 && d.err.includes('không suy được Kết quả') && fs.readFileSync(`${gh.dir}/ca.json`, 'utf8') === truoc);
  return { loi, hang };
}

test('GT-01 gui-mot-cau', async () => {
  const r1 = await kiemGui(GOI);
  const r2 = await kiemGuiKenh(GOI);
  const loi = [...r1.loi, ...r2.loi];
  const hang = [...r1.hang, ...r2.hang];
  inMaTran('GT-01', hang);
  assert.equal(hang.length, 25);
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

export async function kiemDapKenh(gocGoi) {
  const { KENH, khoKenh } = await thuKenh();
  const loi = [];
  const hang = [];
  const so = (ten, ky, thuc, dung) => {
    hang.push({ hang: ten, ky_vong: ky, thuc_te: String(thuc).slice(0, 160) });
    if (!dung) loi.push(`${ten}: mong ${ky}, nhận ${String(thuc).slice(0, 300)}`);
  };
  const gh = ghGia({ nextId: 700 });
  const o = (phut) => ({ gocGoi, nowMs: T0 + phut * PHUT, gh: gh.lenh });
  const mbp = khoKenh({ gocGoi, may: 'MBP', gh: gh.lenh });
  const m5a = khoKenh({ gocGoi, may: 'M5', gh: gh.lenh, loTrinh: false }); // M5 đứng ở kho-a (worktree giữ kênh)
  const m5b = khoKenh({ gocGoi, may: 'M5', gh: gh.lenh, remote: 'https://github.com/thu/kho-b.git', loTrinh: false });
  const g = tin(mbp, ['GIAO', 'M5', 'làm bộ đọc ở kho b', '--hang', 'GT1', '--kenh', KENH, '--kho', 'thu/kho-b'], o(0));
  const ma = g.out.split(' ')[1];
  const truoc = fs.readFileSync(`${gh.dir}/ca.json`, 'utf8');
  const sai = tin(m5a, ['NHẬN', ma, 'sẽ giao bộ đọc ở kho b', '--kenh', KENH], o(1));
  so('(b) NHẬN ở kho lệch', 'thoát 1, nêu hai kho và tin KẸT, kênh không đổi', `${sai.ma} ${sai.err}`, sai.ma === 1 && sai.err.includes('thu/kho-a') && sai.err.includes('thu/kho-b') && sai.err.includes('tin KẸT') && fs.readFileSync(`${gh.dir}/ca.json`, 'utf8') === truoc);
  const dung = tin(m5b, ['NHẬN', ma, 'sẽ giao bộ đọc ở kho b', '--kenh', KENH], o(2));
  const v = JSON.parse(tin(m5b, ['so', '--kenh', KENH, '--json'], o(2)).out).find((x) => x.ma === ma);
  so('(b) NHẬN ở đúng kho', 'thoát 0, Ranh giới thu/kho-b', `${dung.ma} ${v?.ranh_gioi_kho} ${dung.err}`, dung.ma === 0 && v?.ranh_gioi_kho === 'thu/kho-b');
  const truoc2 = fs.readFileSync(`${gh.dir}/ca.json`, 'utf8');
  const x = tin(m5a, ['XONG', ma, '--kenh', KENH], o(3));
  so('(e) XONG từ worktree giữ kênh, kho lệch', 'thoát 1 «kho lệch», kênh không đổi', `${x.ma} ${x.err}`, x.ma === 1 && x.err.includes('kho lệch') && x.err.includes('--vat') && fs.readFileSync(`${gh.dir}/ca.json`, 'utf8') === truoc2);
  return { loi, hang };
}

test('GT-02 dap-khong-kem', async () => {
  const r1 = await kiemDap(GOI);
  const r2 = await kiemDapKenh(GOI);
  const loi = [...r1.loi, ...r2.loi];
  const hang = [...r1.hang, ...r2.hang];
  inMaTran('GT-02', hang);
  assert.equal(hang.length, 36);
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

// ---------- AC-5: kênh liên máy — phân trang, con trỏ, round-trip hai máy, cửa sổ đo ngưỡng ----------
const thuKenh = () => import('./tin-kho-thu.mjs');
const binh = (id, phut, body) => {
  const luc = new Date(T0 + phut * PHUT).toISOString().replace(/\.\d+Z$/u, 'Z');
  return { id, created_at: luc, updated_at: luc, body };
};
const dd = (kl, ma, tu, den) => `${kl} ${ma} · ${tu} → ${den}`;

export async function kiemKenh(gocGoi) {
  const { KENH, khoKenh, tepKenhCua, binhLuanSan, docLuot } = await thuKenh();
  const loi = [];
  const hang = [];
  const so = (ten, ky, thuc, dung) => {
    hang.push({ hang: ten, ky_vong: ky, thuc_te: String(thuc).slice(0, 160) });
    if (!dung) loi.push(`${ten}: mong ${ky}, nhận ${String(thuc).slice(0, 300)}`);
  };
  const gh = ghGia({ comments: binhLuanSan(35, T0), nextId: 100 });
  const o = (phut = 0) => ({ gocGoi, nowMs: T0 + phut * PHUT, gh: gh.lenh });
  const mbp = khoKenh({ gocGoi, may: 'MBP', gh: gh.lenh });
  const m5 = khoKenh({ gocGoi, may: 'M5', gh: gh.lenh, remote: 'https://github.com/thu/kho-b.git', loTrinh: false });
  // Gửi đăng đúng một bình luận.
  gh.xoaNhatKy();
  const g = tin(mbp, ['GIAO', 'M5', 'crm cần đọc lộ trình nhiều kho trước 22/10', '--hang', 'GT1', '--kenh', KENH, '--kho', 'thu/kho-b'], o(0));
  const ghi = gh.nhatKy().filter((x) => x.lenh === 'ghi').length;
  so('GIAO --kenh đăng một bình luận', '1', `${ghi} ${g.err}`, g.ma === 0 && ghi === 1);
  const maG = g.out.split('\n')[0].split(' ')[1];
  // Lượt một của máy M5 (chưa có con trỏ): đọc đủ 36 qua phân trang.
  gh.xoaNhatKy();
  tin(m5, ['so', '--kenh', KENH], o(1));
  const l1 = docLuot(gh).reduce((t, x) => t + x.so_muc, 0);
  so('lượt một đọc 36', '36', l1, l1 === 36);
  // Thêm 2 bình luận rồi lượt hai: chỉ xin từ mốc con trỏ.
  const ca = gh.ca();
  gh.dat({ comments: [...ca.comments, binh(200, 2, 'ghi chú mới một'), binh(201, 3, 'ghi chú mới hai')] });
  gh.xoaNhatKy();
  const c2 = tin(m5, ['canh', '--kenh', KENH], o(4));
  const l2 = docLuot(gh);
  const traL2 = l2.reduce((t, x) => t + x.so_muc, 0);
  so('lượt hai: sổ đọc mới 2', 'đọc mới 2', c2.out, c2.ma === 0 && /đọc mới 2$/u.test(c2.out.trim()));
  so('lượt hai: xin từ mốc con trỏ (since), gh trả 2 mới + 1 ở mốc', '3', `${traL2} since=${l2.some((x) => x.doi_so.some((a) => a.includes('since=')))}`, traL2 === 3 && l2.every((x) => x.doi_so.some((a) => a.includes('since='))));
  const tt5 = docJ(tepKenhCua(m5));
  so('con trỏ = bình luận cuối', '201', tt5.con_tro, tt5.con_tro === 201);
  // Round-trip: M5 nhận ở kho-b, commit, xong — sổ M5 nấc 7; MBP mở lại → M5 thấy mo-lai.
  const n = tin(m5, ['NHẬN', maG, 'sẽ giao bộ đọc lộ trình nhiều kho cho crm', '--kenh', KENH], o(5));
  so('M5 NHẬN ở kho-b', 'thoát 0', `${n.ma} ${n.err}`, n.ma === 0);
  fs.writeFileSync(`${m5}/a.txt`, 'a\n');
  git(m5, 'add', '-A');
  git(m5, 'commit', '-qm', 'viec');
  const x = tin(m5, ['XONG', maG, '--kenh', KENH], o(6));
  const v5 = JSON.parse(tin(m5, ['so', '--kenh', KENH, '--tat-ca', '--json'], o(7)).out).find((v) => v.ma === maG);
  so('M5 XONG → sổ M5 nấc 7', 'cho-chap-nhan 7', `${x.ma} ${v5?.trang_thai} ${v5?.nac} ${x.err}`, x.ma === 0 && v5?.trang_thai === 'cho-chap-nhan' && v5?.nac === 7);
  const { chayHook } = await import('./tin-kho-thu.mjs');
  const vM1 = JSON.parse(tin(mbp, ['so', '--kenh', KENH, '--tat-ca', '--json'], o(7)).out).find((v) => v.ma === maG);
  so('MBP: trước khi đến phiên → cho-chap-nhan', 'cho-chap-nhan', vM1?.trang_thai, vM1?.trang_thai === 'cho-chap-nhan');
  gh.xoaNhatKy();
  chayHook(gocGoi, 'PostToolUse', { cwd: mbp, tool_name: 'Bash' }, { nowMs: T0 + 7 * PHUT + 30_000, gh: gh.lenh });
  const goiTrongHook = gh.nhatKy().length;
  const vM2 = JSON.parse(tin(mbp, ['so', '--kenh', KENH, '--tat-ca', '--json'], o(8)).out).find((v) => v.ma === maG);
  so('MBP: hook đưa XONG → da-chap-nhan, 0 lời gọi gh trong hook', 'da-chap-nhan · 0', `${vM2?.trang_thai} · ${goiTrongHook}`, vM2?.trang_thai === 'da-chap-nhan' && goiTrongHook === 0);
  gh.xoaNhatKy();
  const ml = tin(mbp, ['MỞ', 'LẠI', maG, 'bộ đọc chưa chạy trên crm', '--kenh', KENH], o(8));
  const ghi2 = gh.nhatKy().filter((x2) => x2.lenh === 'ghi').length;
  const v5b = JSON.parse(tin(m5, ['so', '--kenh', KENH, '--json'], o(9)).out).find((v) => v.ma === maG);
  so('MBP MỞ LẠI --kenh → một bình luận, M5 thấy mo-lai', 'ghi 1 · mo-lai', `${ghi2} ${v5b?.trang_thai} ${ml.err}`, ml.ma === 0 && ghi2 === 1 && v5b?.trang_thai === 'mo-lai');
  // Một hàm phân loại cho hai nơi chứa: ma trận văn bản AC-4 qua đợt và qua kênh cho cùng sổ.
  const matran = [dd('GIAO', 'Q-1810-1', 'Q', 'P1'), `${dd('BÁO', 'Q-1810-2', 'Q', 'P1')}\nXONG Q-1810-1 · P1 → Q`, CA_THAT.chua_goi_luot_16_10.body, 'xong Q-1810-1 · P1 → Q', CA_THAT.khuon_cu_308_17_10.body, ''];
  const ghM = ghGia({ comments: matran.map((b, i) => binh(10 + i, i, b)) });
  const kM = khoKenh({ gocGoi, may: 'P1', gh: ghM.lenh });
  const quaKenh = JSON.parse(tin(kM, ['so', '--kenh', KENH, '--tat-ca', '--json'], { gocGoi, nowMs: T0 + 10 * PHUT, gh: ghM.lenh }).out);
  const kD = khoDot({ gocGoi });
  for (const [i, b] of matran.entries()) fs.appendFileSync(`${kD.dot}/tin.jsonl`, `${JSON.stringify({ text: b, luc: new Date(T0 + i * PHUT).toISOString() })}\n`);
  const quaDot = JSON.parse(tin(kD.kho, ['so', '--tat-ca', '--json'], { gocGoi, nowMs: T0 + 10 * PHUT }).out).filter((v) => !v.yeu_cau_cu);
  const gon = (ds) => JSON.stringify(ds.map((v) => [v.ma, v.trang_thai, v.nac]));
  so('một hàm phân loại cho hai nơi chứa', gon(quaDot), gon(quaKenh), gon(quaDot) === gon(quaKenh));
  // Cửa sổ đo ngưỡng 2: chín loại bình luận.
  const cs = [
    binh(1, -200, dd('GIAO', 'X-1810-9', 'X', 'Y')),
    binh(2, -60, dd('GIAO', 'X-1810-1', 'X', 'Y')), binh(3, -59, `${dd('NHẬN', 'X-1810-1', 'Y', 'X')}\nSẽ giao: a b c`), binh(4, -58, `${dd('XONG', 'X-1810-1', 'Y', 'X')}\nVật: a`),
    binh(5, -57, dd('GIAO', 'X-1810-2', 'X', 'Y')), binh(6, -56, `${dd('NHẬN', 'X-1810-2', 'Y', 'X')}\nSẽ giao: a b c`), binh(7, -55, `${dd('XONG', 'X-1810-2', 'Y', 'X')}\nVật: a`), binh(8, -54, `${dd('MỞ LẠI', 'X-1810-2', 'X', 'Y')}\nVì sao: chưa`),
    binh(9, -53, dd('GIAO', 'X-1810-3', 'X', 'Y')), binh(10, -52, `${dd('NHẬN', 'X-1810-3', 'Y', 'X')}\nSẽ giao: a b c`), binh(11, -51, `${dd('KẸT', 'X-1810-3', 'Y', 'X')}\nCần: quyền`),
    binh(12, -70, dd('GIAO', 'X-1810-4', 'X', 'Y')),
    binh(13, -5, dd('GIAO', 'X-1810-5', 'X', 'Y')),
    binh(14, -4, `${dd('BÁO', 'X-1810-6', 'X', 'Y')}\nchỉ báo`),
    binh(15, -3, '[Mac Studio — r2 → MacBook Pro] xin gọi lượt #500'),
    binh(16, -2, 'ok'),
  ];
  const tu = new Date(T0 - 100 * PHUT).toISOString();
  const cua = async (comments, tuNgay) => {
    const g2 = ghGia({ comments });
    const k2 = khoKenh({ gocGoi, may: 'Z', gh: g2.lenh });
    return JSON.parse(tin(k2, ['so', '--kenh', KENH, '--tu', tuNgay, '--json'], { gocGoi, nowMs: T0, gh: g2.lenh }).out);
  };
  const w = await cua(cs, tu);
  const { phan_quyet: pq, ...soCua } = w;
  so('cửa sổ: năm trường', JSON.stringify({ vong_da_dong: 1, vong_mo_qua_han_2: 1, vong_mo_chua_qua_han: 3, khuon_cu_co_dich: 1, bo_qua: 1, bo_qua_ma: [16] }), JSON.stringify(soCua), JSON.stringify(soCua) === JSON.stringify({ vong_da_dong: 1, vong_mo_qua_han_2: 1, vong_mo_chua_qua_han: 3, khuon_cu_co_dich: 1, bo_qua: 1, bo_qua_ma: [16] }));
  so('phán quyết CHẾT', 'CHẾT', pq, pq === 'CHẾT');
  const w2 = await cua(cs.filter((c) => ![12, 15].includes(c.id)), tu);
  so('phán quyết cần đếm tay', 'cần đếm tay 1 bình luận', w2.phan_quyet, w2.phan_quyet === 'cần đếm tay 1 bình luận');
  const w3 = await cua(cs.filter((c) => [2, 3, 4].includes(c.id)), tu);
  so('phán quyết SỐNG', 'SỐNG', w3.phan_quyet, w3.phan_quyet === 'SỐNG');
  const w4 = await cua(cs, new Date(T0 + 10 * PHUT).toISOString());
  so('phán quyết VÔ HIỆU', 'VÔ HIỆU', w4.phan_quyet, w4.phan_quyet === 'VÔ HIỆU');
  return { loi, hang };
}

test('GT-05 kenh-con-tro', async () => {
  const { loi, hang } = await kiemKenh(GOI);
  inMaTran('GT-05', hang);
  assert.equal(hang.length, 16);
  assert.deepEqual(loi, []);
});

test('GT-05-do bo-con-tro', async () => {
  const goc = banSao('tin-kenh.mjs', 'const tuCon = tt.con_tro != null ? tt.dong.find((d) => d.id === tt.con_tro) : null;', 'const tuCon = null;');
  const { loi } = await kiemKenh(goc);
  assert.ok(loi.some((l) => l.startsWith('lượt hai: xin từ mốc') && l.includes('38')), `bỏ con trỏ phải làm lượt hai đọc 38, nhận: ${loi.join(' | ')}`);
});

test('GT-05-do bo-phan-trang', async () => {
  const goc = banSao('tin-kenh.mjs', "const r = goiGh(['api', '--paginate', `${DUONG_DS(k)}${q}`", "const r = goiGh(['api', `${DUONG_DS(k)}${q}`");
  const { loi } = await kiemKenh(goc);
  assert.ok(loi.some((l) => l.startsWith('lượt một đọc 36') && l.includes('nhận 30')), `bỏ phân trang phải làm lượt một đọc 30, nhận: ${loi.join(' | ')}`);
});

test('GT-05-do dem-moi-ma', async () => {
  const goc = banSao('tin-kenh.mjs', "if (['cho-chap-nhan', 'da-chap-nhan', 'dong'].includes(v.trang_thai)) kq.vong_da_dong++;\n        else if (v.qua_han_nhan === 2 || v.qua_han_xong === 2) kq.vong_mo_qua_han_2++;", 'if (false) kq.vong_da_dong++;\n        else if (true) kq.vong_mo_qua_han_2++;');
  const { loi } = await kiemKenh(goc);
  assert.ok(loi.some((l) => l.startsWith('cửa sổ: năm trường')), `đếm mọi bình luận có mã phải làm ô vòng đã đóng đỏ, nhận: ${loi.join(' | ')}`);
});

test('GT-02-do bo-so-kho', async () => {
  const goc = banSao('tin.mjs', 'if (ctx.loai === \'kenh\' && muc.ranh_gioi_kho && khoCwd !== muc.ranh_gioi_kho) {', 'if (false) {');
  const { loi } = await kiemDapKenh(goc);
  assert.ok(loi.some((l) => l.startsWith('(b) NHẬN ở kho lệch')), `bỏ so kho phải làm (b) đỏ, nhận: ${loi.join(' | ')}`);
  // Đối chứng: bỏ kiểm danh tính mà giữ so kho → (b) vẫn xanh, tức (b) đo đúng bước so kho.
  const goc2 = banSao('tin.mjs', "    if (minh !== muc.den) loi(`${minh} không phải người nhận của ${ma} (người nhận: ${muc.den})`);", '');
  const r2 = await kiemDapKenh(goc2);
  assert.ok(!r2.loi.some((l) => l.startsWith('(b) NHẬN ở kho lệch')), `đối chứng: (b) phải xanh khi chỉ bỏ kiểm danh tính, nhận: ${r2.loi.join(' | ')}`);
});

// ---------- AC-6: bộ canh có chiều đỏ ----------
const chayCanhNen = (cwd, gh, env = {}) => new Promise((ok) => {
  const t0 = Date.now();
  const c = spawn(process.execPath, [`${GOI}/scripts/tin.mjs`, 'canh', '--kenh', 'thu/kenh#308', '--cho'], { cwd, env: { ...process.env, DIEU_PHOI_GH: gh, DIEU_PHOI_TIN_NHIP_MS: '300', DIEU_PHOI_TIN_TRAN_MS: '3000', ...env } });
  let out = '';
  let err = '';
  c.stdout.on('data', (b) => { out += b; });
  c.stderr.on('data', (b) => { err += b; });
  c.on('close', (ma) => ok({ ma, out, err, ms: Date.now() - t0 }));
});

export async function kiemCanh(gocGoi) {
  const { KENH, khoKenh, tepKenhCua } = await thuKenh();
  const loi = [];
  const hang = [];
  const so = (ten, ky, thuc, dung) => {
    hang.push({ hang: ten, ky_vong: ky, thuc_te: String(thuc).slice(0, 160) });
    if (!dung) loi.push(`${ten}: mong ${ky}, nhận ${String(thuc).slice(0, 300)}`);
  };
  const moi = () => {
    const gh = ghGia({ comments: [binh(1, -3, 'ghi chú một'), binh(2, -2, `${dd('GIAO', 'X-1810-1', 'X', 'Z')}\nÝ định: a`)], nextId: 50 });
    const kho = khoKenh({ gocGoi, may: 'Z', gh: gh.lenh });
    const r0 = tin(kho, ['canh', '--kenh', KENH], { gocGoi, gh: gh.lenh });
    return { gh, kho, r0 };
  };
  const env = { DIEU_PHOI_TIN_TRAN_MS: '3000' };
  const a = moi();
  const ra = tin(a.kho, ['canh', '--kenh', KENH], { gocGoi, gh: a.gh.lenh, env });
  so('(a) tin cuối còn nguyên', 'thoát 0 «canh: bắt lại 2»', `${ra.ma} ${ra.out}`, a.r0.ma === 0 && ra.ma === 0 && ra.out.includes('canh: bắt lại 2'));
  const b = moi();
  b.gh.dat({ comments: b.gh.ca().comments.filter((c) => c.id !== 2) });
  const rb = tin(b.kho, ['canh', '--kenh', KENH], { gocGoi, gh: b.gh.lenh, env });
  so('(b) tin cuối bị xoá', 'thoát 3, stderr bắt đầu «canh: không bắt lại được tin cuối»', `${rb.ma} ${rb.err}`, rb.ma === 3 && rb.err.startsWith('canh: không bắt lại được tin cuối'));
  const c = moi();
  c.gh.dat({ comments: c.gh.ca().comments.map((x) => (x.id === 2 ? { ...x, body: 'đã sửa dòng đầu' } : x)) });
  const rc = tin(c.kho, ['canh', '--kenh', KENH], { gocGoi, gh: c.gh.lenh, env });
  so('(c) dòng đầu tin cuối bị sửa', 'thoát 3 «dòng đầu khác»', `${rc.ma} ${rc.err}`, rc.ma === 3 && rc.err.includes('dòng đầu khác'));
  const d = moi();
  d.gh.dat({ loi: true });
  const rd = tin(d.kho, ['canh', '--kenh', KENH], { gocGoi, gh: d.gh.lenh, env });
  so('(d) gh lỗi', 'thoát 3 «gh giả: lỗi tiêm»', `${rd.ma} ${rd.err}`, rd.ma === 3 && rd.err.includes('gh giả: lỗi tiêm'));
  const e = moi();
  setTimeout(() => e.gh.dat({ comments: [...e.gh.ca().comments, binh(3, 1, `${dd('HỎI', 'X-1810-2', 'X', 'Z')}\nHỏi: có không?`)] }), 700);
  const re = await chayCanhNen(e.kho, e.gh.lenh);
  so('(e) --cho thấy tin gửi máy mình', `thoát 0, «${dd('HỎI', 'X-1810-2', 'X', 'Z')}»`, `${re.ma} ${re.out.trim()} ${re.err}`, re.ma === 0 && re.out.trim() === dd('HỎI', 'X-1810-2', 'X', 'Z'));
  const f = moi();
  setTimeout(() => f.gh.dat({ loi: true }), 500);
  const rf = await chayCanhNen(f.kho, f.gh.lenh);
  so('(f) --cho khi gh lỗi giữa chừng', 'thoát 3 trong ≤ 2 nhịp sau lỗi (< 1500 ms)', `${rf.ma} ${rf.ms}ms ${rf.err}`, rf.ma === 3 && rf.ms < 1500);
  const g = moi();
  g.gh.dat({ treo: true });
  const t0 = Date.now();
  const rg = tin(g.kho, ['canh', '--kenh', KENH], { gocGoi, gh: g.gh.lenh, env: { DIEU_PHOI_TIN_TRAN_MS: '2000' } });
  const ms = Date.now() - t0;
  so('(g) gh treo', 'thoát 3 «quá trần», < 30 s', `${rg.ma} ${ms}ms ${rg.err}`, rg.ma === 3 && rg.err.includes('quá trần') && ms < 30_000);
  const h = moi();
  const rh = tin(h.kho, ['canh', '--kenh', KENH], { gocGoi, gh: '/khong/co/gh', env });
  so('(h) gh không cài', 'thoát 3 «không chạy được gh»', `${rh.ma} ${rh.err}`, rh.ma === 3 && rh.err.includes('không chạy được gh'));
  for (const r of [ra, rb, rc, rd, rg, rh]) if (r.ma === 0 && !r.out.trim()) loi.push('có hàng thoát 0 mà stdout rỗng');
  void tepKenhCua;
  return { loi, hang };
}

test('GT-06 canh-chieu-do', async () => {
  const { loi, hang } = await kiemCanh(GOI);
  inMaTran('GT-06', hang);
  assert.equal(hang.length, 8);
  assert.deepEqual(loi, []);
});

test('GT-06-do nuot-loi-gh', async () => {
  const goc = banSao('tin-gh.mjs', "  return { ma: r.status ?? 1, out: r.stdout ?? '', err: (r.stderr ?? '').trim() };", "  return { ma: 0, out: r.status === 0 ? r.stdout ?? '' : '', err: '' };");
  const { loi } = await kiemCanh(goc);
  assert.ok(loi.some((l) => l.startsWith('(d)')), `nuốt lỗi gh phải làm (d) đỏ, nhận: ${loi.join(' | ')}`);
});

// ---------- AC-7: tin tự đến trong hai hook đã có ----------
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import { execFileSync } from 'node:child_process';

const BAN_CU = '3745b3e9';
function banCuGoi() {
  const d = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'gt-bancu-')));
  execFileSync('sh', ['-c', `git -C '${path.resolve(DAY, '..', '..')}' archive ${BAN_CU} dieu-phoi | tar -x -C '${d}'`]);
  return path.join(d, 'dieu-phoi');
}
const trungVi = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };

export async function kiemTuDen(gocGoi, { doNhanh = true } = {}) {
  const { chayHook, KENH, khoKenh, tepKenhCua } = await import('./tin-kho-thu.mjs');
  const loi = [];
  const hang = [];
  const so = (ten, ky, thuc, dung) => {
    hang.push({ hang: ten, ky_vong: ky, thuc_te: String(thuc).slice(0, 160) });
    if (!dung) loi.push(`${ten}: mong ${ky}, nhận ${String(thuc).slice(0, 300)}`);
  };
  const k = khoDot({ gocGoi });
  const D = ddmm(T0);
  const o = (p) => ({ gocGoi, nowMs: T0 + p * PHUT });
  const hk = (cwd, p, them = {}) => chayHook(gocGoi, 'PostToolUse', { cwd, tool_name: 'Bash', ...them }, { nowMs: T0 + p * PHUT });
  const soCua = (cwd, p, ma) => JSON.parse(tin(cwd, ['so', '--tat-ca', '--json'], o(p)).out).find((v) => v.ma === ma);
  tin(k.kho, ['GIAO', 'P2', 'việc một cho P2'], o(0));
  const ma1 = `G-${D}-1`;
  // (g) tác tử con trước: không đưa, sổ vẫn chua-den
  const g = hk(k.w2, 1, { agent_id: 'tac-tu-con-1', agent_type: 'cham-lenh' });
  so('(g) tác tử con', 'stdout rỗng, sổ chua-den', `${g.out.trim()} ${soCua(k.kho, 1, ma1)?.trang_thai}`, g.out.trim() === '' && soCua(k.kho, 1, ma1)?.trang_thai === 'chua-den');
  // (a) phiên chính
  const a = hk(k.w2, 2);
  so('(a) đưa tin vào ngữ cảnh', `chứa ${ma1}, dòng đầu, thân, lệnh NHẬN`, a.ctx, Boolean(a.ctx) && a.ctx.includes(`GIAO ${ma1} · G → P2`) && a.ctx.includes('Ý định: việc một cho P2') && a.ctx.includes(`tin NHẬN ${ma1}`));
  so('(a) sổ da-den', 'da-den', soCua(k.kho, 2, ma1)?.trang_thai, soCua(k.kho, 2, ma1)?.trang_thai === 'da-den');
  const b = hk(k.w2, 3);
  so('(b) lần hai không đưa lại', `không chứa ${ma1}`, b.ctx ?? '', !(b.ctx ?? '').includes(ma1));
  const c = hk(k.w1, 3);
  so('(c) cwd P1', 'stdout rỗng', c.out.trim(), c.out.trim() === '');
  // UserPromptSubmit cũng đưa tin
  tin(k.kho, ['GIAO', 'P2', 'việc hai cho P2'], o(4));
  const up = chayHook(gocGoi, 'UserPromptSubmit', { cwd: k.w2, prompt: 'tiếp' }, { nowMs: T0 + 5 * PHUT });
  so('(a) lời nhắc cũng đưa tin', `chứa G-${D}-2`, up.ctx, (up.ctx ?? '').includes(`GIAO G-${D}-2`) && up.json?.hookSpecificOutput?.hookEventName === 'UserPromptSubmit');
  // (e) tự nhắc một lần — vòng G gửi P1, quá hạn nhận ở phút 31
  tin(k.kho, ['GIAO', 'P1', 'việc cho P1'], o(6));
  const maP1 = `G-${D}-3`;
  hk(k.kho, 6 + 31);
  hk(k.kho, 6 + 32);
  const baoNhac = fs.readFileSync(`${k.dot}/tin.jsonl`, 'utf8').split('\n').filter((l) => l.includes(`nhắc ${maP1}`)).length;
  so('(e) tự nhắc một lần trong đợt', '1 BÁO nhắc', baoNhac, baoNhac === 1);
  // (j) XONG của P2 → chấp nhận khi đến phiên G
  tin(k.w2, ['NHẬN', ma1, 'sẽ giao bản sửa cho việc một'], o(40));
  fs.writeFileSync(`${k.w2}/x.txt`, 'x\n');
  git(k.w2, 'add', '-A');
  git(k.w2, 'commit', '-qm', 'x');
  tin(k.w2, ['XONG', ma1], o(41));
  const truoc = soCua(k.kho, 41, ma1)?.trang_thai;
  const jg = hk(k.kho, 42);
  const sau = soCua(k.kho, 42, ma1);
  so('(j) trước khi đến phiên G', 'cho-chap-nhan', truoc, truoc === 'cho-chap-nhan');
  so('(j) đến phiên G → chấp nhận', 'ngữ cảnh có XONG + MỞ LẠI, sổ da-chap-nhan', `${sau?.trang_thai} ${(jg.ctx ?? '').slice(0, 80)}`, (jg.ctx ?? '').includes(`XONG ${ma1}`) && (jg.ctx ?? '').includes('MỞ LẠI') && sau?.trang_thai === 'da-chap-nhan' && Boolean(sau?.chap_nhan_luc));
  so('(j) NHẬN về G kèm câu sẽ giao', 'Sẽ giao: bản sửa cho việc một', jg.ctx ?? '', (jg.ctx ?? '').includes('Sẽ giao: bản sửa cho việc một'));
  // (k) MỞ LẠI đến phiên P2 đúng một lần
  tin(k.kho, ['MỞ', 'LẠI', ma1, 'chưa chạy được trên crm'], o(43));
  const k1 = hk(k.w2, 44);
  const k2 = hk(k.w2, 45);
  so('(k) MỞ LẠI đến P2 một lần', 'lần một có, lần hai không', `${(k1.ctx ?? '').includes(`MỞ LẠI ${ma1}`)} ${(k2.ctx ?? '').includes(`MỞ LẠI ${ma1}`)}`, (k1.ctx ?? '').includes(`MỞ LẠI ${ma1}`) && (k1.ctx ?? '').includes('Vì sao: chưa chạy được trên crm') && (k1.ctx ?? '').includes(`tin XONG ${ma1}`) && !(k2.ctx ?? '').includes(`MỞ LẠI ${ma1}`));
  // (d) (f) kênh: chỉ đọc bản đã đồng bộ, không gọi mạng
  const gh = ghGia({ nextId: 900 });
  const mbp = khoKenh({ gocGoi, may: 'MBP', gh: gh.lenh });
  const m5 = khoKenh({ gocGoi, may: 'M5', gh: gh.lenh, loTrinh: false });
  tin(m5, ['GIAO', 'MBP', 'xin chen một lượt gộp', '--ket-qua', 'một lượt gộp', '--kenh', KENH], { gocGoi, nowMs: T0, gh: gh.lenh });
  tin(mbp, ['GIAO', 'M5', 'kiểm bản cài', '--ket-qua', 'bảng kiểm', '--kenh', KENH], { gocGoi, nowMs: T0, gh: gh.lenh });
  tin(mbp, ['canh', '--kenh', KENH], { gocGoi, nowMs: T0, gh: gh.lenh });
  gh.xoaNhatKy();
  const d = chayHook(gocGoi, 'PostToolUse', { cwd: mbp, tool_name: 'Bash' }, { nowMs: T0 + PHUT, gh: gh.lenh });
  so('(d) kênh: đưa tin gửi MBP, 0 lời gọi gh', 'ngữ cảnh có GIAO M5-…, nhật ký 0', `${(d.ctx ?? '').slice(0, 60)} gh=${gh.nhatKy().length}`, (d.ctx ?? '').includes('· M5 → MBP') && gh.nhatKy().length === 0);
  const f = chayHook(gocGoi, 'PostToolUse', { cwd: mbp, tool_name: 'Bash' }, { nowMs: T0 + 31 * PHUT, gh: gh.lenh });
  so('(f) kênh quá hạn: gợi ý tin nhac, 0 lời gọi ghi', 'ngữ cảnh có «tin nhac», ghi 0', `${(f.ctx ?? '').slice(0, 80)} ghi=${gh.nhatKy().filter((x) => x.lenh === 'ghi').length}`, (f.ctx ?? '').includes('tin nhac MBP-') && gh.nhatKy().filter((x) => x.lenh === 'ghi').length === 0);
  void tepKenhCua;
  // (i) hỏng không lan — dữ liệu
  const ki = khoDot({ gocGoi });
  tin(ki.kho, ['GIAO', 'P2', 'việc thử hỏng'], o(0));
  fs.appendFileSync(`${ki.dot}/tin.jsonl`, '{dòng hỏng\n');
  const sys = [];
  for (let i = 0; i < 3; i++) {
    const r = chayHook(gocGoi, 'PostToolUse', { cwd: ki.w2, tool_name: 'Bash', session_id: 's-hong' }, { nowMs: T0 + (i + 1) * PHUT });
    if (r.sys) sys.push(r.sys);
    if (r.ctx && r.ctx.includes('GIAO')) sys.push('ĐƯA TIN DÙ HỎNG');
  }
  const coNhip = fs.existsSync(`${ki.dot}/song/s-hong.json`);
  so('(i) dòng hỏng', 'nhịp vẫn ghi, đúng 1 cảnh báo «không đọc được hộp tin»', `nhịp=${coNhip} ${sys.join(' | ')}`, coNhip && sys.length === 1 && sys[0].includes('không đọc được hộp tin'));
  const dongs = fs.readFileSync(`${ki.dot}/tin.jsonl`, 'utf8').split('\n').filter((l) => l && l !== '{dòng hỏng');
  fs.writeFileSync(`${ki.dot}/tin.jsonl`, `${dongs.join('\n')}\n`);
  const sua = chayHook(gocGoi, 'PostToolUse', { cwd: ki.w2, tool_name: 'Bash' }, { nowMs: T0 + 5 * PHUT });
  so('(i) sửa tệp → đưa tin lại', 'có GIAO', sua.ctx ?? '', (sua.ctx ?? '').includes('GIAO'));
  fs.chmodSync(`${ki.dot}/tin.jsonl`, 0o000);
  const sys2 = [];
  for (let i = 0; i < 3; i++) {
    const r = chayHook(gocGoi, 'PostToolUse', { cwd: ki.w2, tool_name: 'Bash', session_id: 's-khoa' }, { nowMs: T0 + (6 + i) * PHUT });
    if (r.sys) sys2.push(r.sys);
  }
  fs.chmodSync(`${ki.dot}/tin.jsonl`, 0o644);
  so('(i) hộp tin không đọc được', 'nhịp vẫn ghi, đúng 1 cảnh báo', `nhịp=${fs.existsSync(`${ki.dot}/song/s-khoa.json`)} ${sys2.join(' | ')}`, fs.existsSync(`${ki.dot}/song/s-khoa.json`) && sys2.length === 1 && sys2[0].includes('không đọc được hộp tin'));
  // (i) hỏng không lan — lúc nạp: bản sao gói có phần tin ném khi nạp, và bản sao thiếu một tệp phần tin nhập.
  for (const [ten, goc2] of [
    ['tin-dua ném lúc nạp', banSao('tin-dua.mjs', "const bam = (s) =>", "throw new Error('nạp hỏng');\nconst bam = (s) =>")],
    ['thiếu tệp tin-doc.mjs', (() => { const g3 = banSao('tin-dua.mjs', "const LOI_BAO = 'không đọc được hộp tin';", "const LOI_BAO = 'không đọc được hộp tin'; "); fs.rmSync(`${g3}/scripts/tin-doc.mjs`); return g3; })()],
  ]) {
    const kn2 = khoDot({ gocGoi });
    tin(kn2.kho, ['GIAO', 'P2', 'việc thử nạp hỏng'], o(0));
    const s3 = [];
    let coCtxTin = false;
    for (let i = 0; i < 3; i++) {
      const r = chayHook(goc2, 'PostToolUse', { cwd: kn2.w2, tool_name: 'Bash', session_id: `s-nap-${i}` }, { nowMs: T0 + (i + 1) * PHUT });
      if (r.sys) s3.push(r.sys);
      if ((r.ctx ?? '').includes('GIAO')) coCtxTin = true;
    }
    const nhip = [0, 1, 2].every((i) => fs.existsSync(`${kn2.dot}/song/s-nap-${i}.json`));
    so(`(i) ${ten}`, 'nhịp vẫn ghi cả ba lần, không đưa tin, đúng 1 cảnh báo', `nhịp=${nhip} ctx=${coCtxTin} ${s3.join(' | ')}`, nhip && !coCtxTin && s3.length === 1 && s3[0].includes('không đọc được hộp tin'));
  }
  // (h) nhanh khi không có tin — so trọn hook-nhip với bản cũ, xen kẽ, mỗi lần một tiến trình mới
  if (doNhanh) {
    const cu = banCuGoi();
    const kn = khoDot({ gocGoi });
    const khongDot = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'gt-khongdot-')));
    git(khongDot, 'init', '-q', '-b', 'main');
    for (const cwd of [kn.w2, khongDot]) {
      const doLuot = () => {
        const moi = [];
        const cuMs = [];
        for (let i = 0; i < 30; i++) {
          for (const [g2, mang] of [[cu, cuMs], [gocGoi, moi]]) {
            const t = process.hrtime.bigint();
            spawnSync(process.execPath, [`${g2}/scripts/hook-nhip.mjs`], { cwd, input: JSON.stringify({ cwd, session_id: 's-do', hook_event_name: 'PostToolUse', tool_name: 'Bash' }), env: { ...process.env, DIEU_PHOI_GH: '/khong/co' } });
            mang.push(Number(process.hrtime.bigint() - t) / 1e6);
          }
        }
        return { moi: trungVi(moi), cu: trungVi(cuMs) };
      };
      let r = doLuot();
      let chenh = r.moi - r.cu;
      if (chenh > 20 && chenh <= 30) {
        const r2 = doLuot();
        if (r2.moi - r2.cu < chenh) { r = r2; chenh = r2.moi - r2.cu; }
      }
      so(`(h) nhanh: ${cwd === khongDot ? 'kho không đợt' : 'đợt không tin'}`, 'chênh trung vị ≤ 20 ms', `mới ${r.moi.toFixed(1)} · cũ ${r.cu.toFixed(1)} · chênh ${chenh.toFixed(1)} ms`, chenh <= 20);
    }
    // Hộp tin 5 000 dòng không gửi phiên đo: lần gọi thường (không tin mới) vẫn trong trần.
    const k5 = khoDot({ gocGoi });
    let s5 = '';
    for (let i = 0; i < 5000; i++) s5 += `${JSON.stringify({ text: `BÁO G-0101-${i + 1} · G → P1\nbáo ${i}`, luc: new Date(T0 - 3600_000 + i * 100).toISOString() })}\n`;
    fs.writeFileSync(`${k5.dot}/tin.jsonl`, s5);
    const moi5 = [];
    const cu5 = [];
    for (let i = 0; i < 30; i++) {
      for (const [g2, mang] of [[cu, cu5], [gocGoi, moi5]]) {
        const t = process.hrtime.bigint();
        spawnSync(process.execPath, [`${g2}/scripts/hook-nhip.mjs`], { cwd: k5.w2, input: JSON.stringify({ cwd: k5.w2, session_id: 's-5k', hook_event_name: 'PostToolUse', tool_name: 'Bash' }) });
        mang.push(Number(process.hrtime.bigint() - t) / 1e6);
      }
    }
    const c5 = trungVi(moi5) - trungVi(cu5);
    so('(h) nhanh: hộp tin 5 000 dòng', 'chênh trung vị ≤ 20 ms', `mới ${trungVi(moi5).toFixed(1)} · cũ ${trungVi(cu5).toFixed(1)} · chênh ${c5.toFixed(1)} ms`, c5 <= 20);
  }
  return { loi, hang };
}

test('GT-07 tin-tu-den', async () => {
  const { loi, hang } = await kiemTuDen(GOI);
  inMaTran('GT-07', hang);
  assert.equal(hang.length, 21);
  assert.deepEqual(loi, []);
});

test('GT-07-do dua-lan-hai', async () => {
  const goc = banSao('tin-dua.mjs', 'if (!dd || dd.cu || dd.den !== ten.minh || daDua.has(khoaDong(d))) continue;', 'if (!dd || dd.cu || dd.den !== ten.minh) continue;');
  const { loi } = await kiemTuDen(goc, { doNhanh: false });
  assert.ok(loi.some((l) => l.startsWith('(b)') || l.startsWith('(k)')), `bỏ dấu đã đưa phải đỏ «đưa lần hai», nhận: ${loi.join(' | ')}`);
});

test('GT-07-do tac-tu-con', async () => {
  const goc = banSao('tin-dua.mjs', "export const laTacTuCon = (dauVao) => typeof dauVao?.agent_id === 'string' && dauVao.agent_id !== '';", 'export const laTacTuCon = () => false;');
  const { loi } = await kiemTuDen(goc, { doNhanh: false });
  assert.ok(loi.some((l) => l.startsWith('(g)')), `bỏ kiểm tác tử con phải làm (g) đỏ, nhận: ${loi.join(' | ')}`);
});

test('GT-07-do cham', async () => {
  const goc = banSao('hook-nhip.mjs', "  if (!dauVao?.cwd) return { ngu_canh: null, canh_bao: null };", "  { const t = Date.now(); while (Date.now() - t < 50); }\n  if (!dauVao?.cwd) return { ngu_canh: null, canh_bao: null };");
  const { loi } = await kiemTuDen(goc);
  assert.ok(loi.some((l) => l.startsWith('(h) nhanh')), `thêm 50 ms phải làm (h) đỏ nêu số đo, nhận: ${loi.join(' | ')}`);
});

test('GT-07-do bao-moi-lan', async () => {
  const goc = banSao('tin-dua.mjs', '  if (fs.existsSync(p)) return null;\n  fs.mkdirSync(path.dirname(p), { recursive: true });\n  fs.writeFileSync(p, `${JSON.stringify({ worktree, ly_do: lyDo', '  fs.mkdirSync(path.dirname(p), { recursive: true });\n  fs.writeFileSync(p, `${JSON.stringify({ worktree, ly_do: lyDo');
  const { loi } = await kiemTuDen(goc, { doNhanh: false });
  assert.ok(loi.some((l) => l.startsWith('(i) dòng hỏng') || l.startsWith('(i) hộp tin không đọc được')), `báo mỗi lần phải làm (i) đỏ, nhận: ${loi.join(' | ')}`);
});

test('GT-07-do nhap-tinh', async () => {
  // Bản tiêm nhập phần tin tĩnh ở đầu hook-nhip; với phần tin ném lúc nạp, hook chết trước khi ghi nhịp.
  const goc = banSao('hook-nhip.mjs', "import { bayGio, ghiNhipSong } from './song.mjs';", "import { bayGio, ghiNhipSong } from './song.mjs';\nimport './tin-dua.mjs';");
  const p = `${goc}/scripts/tin-dua.mjs`;
  fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace('const bam = (s) =>', "throw new Error('nạp hỏng');\nconst bam = (s) =>"));
  const { chayHook } = await import('./tin-kho-thu.mjs');
  const kn = khoDot({ gocGoi: goc });
  tin(kn.kho, ['GIAO', 'P2', 'việc thử'], { gocGoi: GOI, nowMs: T0 });
  chayHook(goc, 'PostToolUse', { cwd: kn.w2, tool_name: 'Bash', session_id: 's-tinh' }, { nowMs: T0 + PHUT });
  assert.ok(!fs.existsSync(`${kn.dot}/song/s-tinh.json`), 'nhập tĩnh phải làm hook chết trước khi ghi nhịp (chứng tỏ nạp động là cần)');
  console.log('  nhập tĩnh: nhịp không được ghi — đối chứng cho hàng nạp lỗi của (i)');
});

test('GT-07-do chap-nhan-truoc', async () => {
  const goc = banSao('tin.mjs', "  await nc.them({ text, luc: new Date(nowMs).toISOString() });\n  return text;\n}\n\n// Hồ sơ của vòng", "  await nc.them({ text, luc: new Date(nowMs).toISOString() });\n  if (kl === 'XONG') await nc.them({ may: 'chap-nhan', ma, luc: new Date(nowMs + 1).toISOString() });\n  return text;\n}\n\n// Hồ sơ của vòng");
  const { loi } = await kiemTuDen(goc, { doNhanh: false });
  assert.ok(loi.some((l) => l.startsWith('(j) trước khi đến phiên G')), `chấp nhận trước khi nghe phải làm (j) đỏ, nhận: ${loi.join(' | ')}`);
});

// ---------- AC-8: hook dừng — chặn một lần, lối thoát, kho không dùng thì im ----------
export async function kiemDung(gocGoi, { doTreo = true } = {}) {
  const { chayHook, KENH, khoKenh, tepKenhCua } = await import('./tin-kho-thu.mjs');
  const loi = [];
  const hang = [];
  const so = (ten, ky, thuc, dung) => {
    hang.push({ hang: ten, ky_vong: ky, thuc_te: String(thuc).slice(0, 160) });
    if (!dung) loi.push(`${ten}: mong ${ky}, nhận ${String(thuc).slice(0, 300)}`);
  };
  const D = ddmm(T0);
  const o = (p) => ({ gocGoi, nowMs: T0 + p * PHUT });
  const dung = (cwd, p, them = {}, gh = null) => chayHook(gocGoi, 'Stop', { cwd, ...them }, { nowMs: T0 + p * PHUT, gh });
  const k = khoDot({ gocGoi });
  ghiJ(`${k.dot}/yeu-cau/P1-7.json`, { phien: 'P1', loai: 'khac', hang: null, noi_dung: {}, luc: new Date(T0).toISOString() });
  // (i) chỉ có yêu cầu cũ, chưa có tin → giám sát không bị chặn
  const i = dung(k.kho, 0);
  so('(i) yêu cầu cũ không làm chặn', 'stdout rỗng', i.out.trim(), i.ma === 0 && i.out.trim() === '');
  tin(k.kho, ['GIAO', 'P2', 'việc một cho P2'], o(1));
  const ma1 = `G-${D}-1`;
  tin(k.w1, ['HỎI', 'G', 'có giữ tệp không?'], o(1));
  // (a) chặn
  const a = dung(k.w2, 2);
  so('(a) chặn khi còn GIAO chưa nhận', `block, nêu ${ma1} và tin NHẬN`, a.out, a.json?.decision === 'block' && a.json.reason.includes(`GIAO ${ma1} · G → P2`) && a.json.reason.includes(`tin NHẬN ${ma1}`));
  // (f) lần hai cùng tập → cho qua, sổ ghi kết lượt khi chưa nhận
  const f = dung(k.w2, 3);
  const vf = JSON.parse(tin(k.kho, ['so', '--json'], o(3)).out).find((v) => v.ma === ma1);
  so('(f) lần hai cùng tập mã', 'stdout rỗng, ket_luot_chua_nhan true', `${f.out.trim()} ${vf?.ket_luot_chua_nhan}`, f.out.trim() === '' && vf?.ket_luot_chua_nhan === true);
  const { CLI_DP, chayNode } = await import('./tin-kho-thu.mjs');
  const xf = JSON.parse(chayNode([CLI_DP(gocGoi), 'xem', '--json'], { cwd: k.kho, env: { DIEU_PHOI_NOW_MS: String(T0 + 3 * PHUT) } }).out);
  so('(f) xem --json đếm kết lượt khi chưa nhận', '1', xf.tin?.ket_luot_chua_nhan, xf.tin?.ket_luot_chua_nhan === 1);
  // (g) stop_hook_active
  tin(k.kho, ['GIAO', 'P2', 'việc hai cho P2'], o(4));
  const g = dung(k.w2, 4, { stop_hook_active: true });
  so('(g) stop_hook_active', 'stdout rỗng', g.out.trim(), g.out.trim() === '');
  // (h) tin mới → chặn lại, nêu mã mới  (mã G-2 đã bị cho qua ở (g) nên gửi G-3)
  tin(k.kho, ['GIAO', 'P2', 'việc ba cho P2'], o(5));
  const h = dung(k.w2, 5);
  so('(h) tin mới chặn lại', `block nêu G-${D}-3`, h.out, h.json?.decision === 'block' && h.json.reason.includes(`G-${D}-3`));
  // (b) đã nhận hết → không chặn
  for (const m of [ma1, `G-${D}-2`, `G-${D}-3`]) tin(k.w2, ['NHẬN', m, 'sẽ giao việc được giao đúng hạn'], o(6));
  const b = dung(k.w2, 7);
  so('(b) đã nhận hết', 'stdout rỗng', b.out.trim(), b.out.trim() === '');
  // (c) P1 chỉ có HỎI mình gửi → không chặn
  const c = dung(k.w1, 7);
  so('(c) P1 chỉ có HỎI của mình', 'stdout rỗng', c.out.trim(), c.out.trim() === '');
  // (l) công tắc tắt
  tin(k.kho, ['GIAO', 'P2', 'việc bốn cho P2'], o(8));
  const tat = tin(k.w2, ['tat'], o(8));
  const l1 = dung(k.w2, 9);
  const l2 = chayHook(gocGoi, 'PostToolUse', { cwd: k.w2, tool_name: 'Bash' }, { nowMs: T0 + 9 * PHUT });
  const l3 = chayHook(gocGoi, 'UserPromptSubmit', { cwd: k.w2, prompt: 'x' }, { nowMs: T0 + 9 * PHUT });
  const conSo = JSON.parse(tin(k.kho, ['so', '--json'], o(9)).out).some((v) => v.ma === `G-${D}-4`);
  const xl = JSON.parse(chayNode([CLI_DP(gocGoi), 'xem', '--json'], { cwd: k.kho, env: { DIEU_PHOI_NOW_MS: String(T0 + 9 * PHUT) } }).out);
  so('(l) xem --json liệt P2 đang tắt', '[P2]', JSON.stringify(xl.tin?.day_tat), JSON.stringify(xl.tin?.day_tat) === '["P2"]');
  so('(l) tắt: ba chỗ hook im, sổ vẫn ghi', 'stdout rỗng ×3, sổ có G-4', `${tat.ma} [${l1.out.trim()}][${l2.out.trim()}][${l3.out.trim()}] ${conSo}`, tat.ma === 0 && !l1.out.trim() && !l2.out.trim() && !l3.out.trim() && conSo);
  tin(k.w2, ['bat'], o(10));
  const l4 = dung(k.w2, 10);
  so('(l) bật lại: chặn như thường', 'block', l4.out, l4.json?.decision === 'block');
  // (d) (e) (f′) kênh
  const gh = ghGia({ nextId: 1500 });
  const mbp = khoKenh({ gocGoi, may: 'MBP', gh: gh.lenh });
  const m5 = khoKenh({ gocGoi, may: 'M5', gh: gh.lenh, loTrinh: false });
  const gk = tin(m5, ['GIAO', 'MBP', 'xin chen một lượt gộp', '--ket-qua', 'một lượt gộp', '--kenh', KENH], { gocGoi, nowMs: T0, gh: gh.lenh });
  const maK = gk.out.split(' ')[1];
  const d = dung(mbp, 1, {}, gh.lenh);
  so('(d) kênh: chặn khi còn GIAO gửi MBP', `block nêu ${maK}`, d.out, d.json?.decision === 'block' && d.json.reason.includes(maK) && d.json.reason.includes('--kenh'));
  gh.xoaNhatKy();
  const d2 = dung(mbp, 2, {}, gh.lenh);
  const vk = JSON.parse(tin(mbp, ['so', '--kenh', KENH, '--json'], { gocGoi, nowMs: T0 + 2 * PHUT, gh: gh.lenh }).out).find((v) => v.ma === maK);
  const ghiK = gh.nhatKy().filter((x) => x.lenh === 'ghi').length;
  so('(f′) kênh lần hai: cho qua, ghi sổ, 0 lời gọi ghi', 'stdout rỗng · true · 0', `${d2.out.trim()} · ${vk?.ket_luot_chua_nhan} · ${ghiK}`, d2.out.trim() === '' && vk?.ket_luot_chua_nhan === true && ghiK === 0);
  gh.dat({ loi: true });
  const e1 = dung(mbp, 3, {}, gh.lenh);
  const e2 = dung(mbp, 4, {}, gh.lenh);
  so('(e) kênh lỗi: chặn một lần, lần hai trong 30′ cho qua', 'block «không đọc được kênh» + «tin canh», rồi rỗng', `${e1.json?.decision} | ${e2.out.trim()}`, e1.json?.decision === 'block' && e1.json.reason.includes('không đọc được kênh') && e1.json.reason.includes('tin canh') && e2.out.trim() === '');
  if (doTreo) {
    const gh2 = ghGia({ nextId: 1700 });
    const mbp2 = khoKenh({ gocGoi, may: 'MBP', gh: gh2.lenh });
    gh2.dat({ treo: true });
    const t0 = Date.now();
    const et = dung(mbp2, 1, {}, gh2.lenh);
    const ms = Date.now() - t0;
    so('(e) kênh treo: xong ≤ 6 s, cùng nhánh lỗi', 'block «không đọc được kênh», ≤ 6000 ms', `${ms}ms ${et.json?.decision}`, ms <= 6000 && et.json?.decision === 'block' && et.json.reason.includes('không đọc được kênh'));
  }
  void tepKenhCua;
  // (j) kho không đợt, không kênh: ba khối hook tin im, không tạo tệp
  const kj = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'gt-khongdung-')));
  git(kj, 'init', '-q', '-b', 'main');
  const h0 = bamCay(kj);
  const r1 = chayHook(gocGoi, 'PostToolUse', { cwd: kj, tool_name: 'Bash' });
  const r2 = chayHook(gocGoi, 'UserPromptSubmit', { cwd: kj, prompt: 'x' });
  const r3 = chayHook(gocGoi, 'Stop', { cwd: kj });
  const im = [r1, r2, r3].every((r) => r.ma === 0 && r.out === '' && r.err === '');
  so('(j) kho không dùng: im, không tạo tệp', 'thoát 0, stdout/stderr rỗng, băm bằng', `${im} ${bamCay(kj) === h0}`, im && bamCay(kj) === h0);
  // (k) hooks.json: mục cũ giữ nguyên, thứ mới duy nhất là khối Stop gọi hook-tin
  const cu = JSON.parse(execFileSync('git', ['-C', path.resolve(DAY, '..', '..'), 'show', `${BAN_CU}:dieu-phoi/hooks/hooks.json`], { encoding: 'utf8' }));
  const moi = docJ(`${gocGoi}/hooks/hooks.json`);
  const cuGiu = Object.entries(cu.hooks).every(([kk, v]) => JSON.stringify(moi.hooks[kk]) === JSON.stringify(v)) && JSON.stringify(moi.modules) === JSON.stringify(cu.modules);
  const them = Object.keys(moi.hooks).filter((kk) => !(kk in cu.hooks));
  so('(k) hooks.json', 'mục cũ bằng sâu, chỉ thêm Stop → hook-tin.mjs', `${cuGiu} ${them.join(',')}`, cuGiu && them.length === 1 && them[0] === 'Stop' && JSON.stringify(moi.hooks.Stop).includes('hook-tin.mjs'));
  return { loi, hang };
}

test('GT-08 hook-dung', async () => {
  const { loi, hang } = await kiemDung(GOI);
  inMaTran('GT-08', hang);
  assert.equal(hang.length, 17);
  assert.deepEqual(loi, []);
});

test('GT-08-do chan-mai', async () => {
  const goc = banSao('hook-tin.mjs', 'if (dauVao.stop_hook_active === true || ma.every((x) => daChan.has(x))) {', 'if (dauVao.stop_hook_active === true) {');
  const { loi } = await kiemDung(goc, { doTreo: false });
  assert.ok(loi.some((l) => l.startsWith('(f) lần hai')), `chặn mãi phải làm «chặn lần hai» đỏ, nhận: ${loi.join(' | ')}`);
});

test('GT-08-do chan-mai-kenh', async () => {
  const goc = banSao('hook-tin.mjs', '      ghiJsonNguyenTu(ten.tep, { ...(docJson(ten.tep, null) ?? {}), chan: moiDau });', '');
  const { loi } = await kiemDung(goc, { doTreo: false });
  assert.ok(loi.some((l) => l.startsWith('(f′) kênh lần hai')), `bỏ dấu ở nhánh kênh phải làm «chặn lần hai kênh» đỏ, nhận: ${loi.join(' | ')}`);
});

test('GT-08-do bo-tran', async () => {
  const goc = banSao('hook-tin.mjs', 'const TRAN_KENH_MS = 5000;', 'const TRAN_KENH_MS = 60000;');
  const { loi } = await kiemDung(goc);
  assert.ok(loi.some((l) => l.startsWith('(e) kênh treo')), `bỏ trần phải làm (e) đỏ, nhận: ${loi.join(' | ')}`);
});

test('GT-08-do bo-tat', async () => {
  const goc = banSao('hook-tin.mjs', '    if (daTat(goc, ten.worktree)) continue;\n    let kenhTen = null;', '    let kenhTen = null;');
  const { loi } = await kiemDung(goc, { doTreo: false });
  assert.ok(loi.some((l) => l.startsWith('(l) tắt')), `bỏ kiểm dấu tắt ở khối Stop phải làm (l) đỏ, nhận: ${loi.join(' | ')}`);
});
