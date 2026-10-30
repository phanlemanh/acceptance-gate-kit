import { PHUT_MS } from './cau-hinh.mjs';

export const TAI_NGUYEN = { s4: 's4', 'ghim-lai': 's4', 'duong-nen': 'duong-nen', merge: 'merge' };
const MOC_XA = '9999-12-31';

const mocCua = (hangViec, slug) => hangViec?.hang?.find((h) => h.slug === slug)?.moc ?? MOC_XA;
export const PHIEN_MANG_MOC = new Set(['kiem-cheo']);
const mocDon = (d, hangViec) => (PHIEN_MANG_MOC.has(d.phien) && d.moc) || mocCua(hangViec, d.slug);

export function xepHang(donXin, hangViec) {
  const khoa = (d) => [d.loai === 'ghim-lai' && d.mo_merge ? 0 : 1, mocDon(d, hangViec), d.luc];
  return [...donXin].sort((a, b) => {
    const ka = khoa(a);
    const kb = khoa(b);
    for (let i = 0; i < ka.length; i++) {
      if (ka[i] < kb[i]) return -1;
      if (ka[i] > kb[i]) return 1;
    }
    return 0;
  });
}

export function capLuot({ donXin, dangGiu, giamTai, hangViec, vua = () => ({ duoc: true }) }) {
  const cap = [];
  const ban = new Set(Object.entries(dangGiu).filter(([, chu]) => chu).map(([tn]) => tn));
  for (const don of xepHang(donXin, hangViec)) {
    const tn = TAI_NGUYEN[don.loai];
    if (!tn || ban.has(tn)) continue;
    if (giamTai && tn !== 'merge') continue;
    if (!vua(don).duoc) continue;
    cap.push({ taiNguyen: tn, don });
    ban.add(tn);
  }
  return cap;
}

export function xetHanThue({ chu, nhipTuoiPhut, nowMs, cfg }) {
  if (nowMs <= Date.parse(chu.han_thue_den)) return { hanhDong: 'giu' };
  if (nhipTuoiPhut !== null && nhipTuoiPhut < cfg.nhip_cu_phut) {
    const them = cfg.han_thue_phut[chu.loai] * PHUT_MS;
    return { hanhDong: 'gia-han', hanMoi: new Date(nowMs + them).toISOString() };
  }
  return { hanhDong: 'thu-hoi' };
}

export function hanGiaHan({ hanCu, nowMs, phut }) {
  return new Date(Math.max(Date.parse(hanCu), nowMs) + phut * PHUT_MS).toISOString();
}

// `quyet` (hồ sơ dieu-phoi-sua-truoc-dot-thu, B1): bảng slug → 'da-quyet' | 'cho' | 'khong-build' do bộ phát
// lịch dựng mỗi nhịp bằng `bangQuyet` (the.mjs — một nguồn với thẻ khởi tạo và thợ). Hàng chưa bắt đầu chỉ được
// giao khi đã quyết; vắng bảng (ca đơn vị cũ) thì mọi hàng coi là đã quyết.
// `trung` (hồ sơ ky-den-gop, hạng C): hàm hàng → {trung: [...]} (`xetTrungTep`). Hàng sẵn sàng mà trùng tệp với việc
// đang dở ở chỗ khác thì bị bỏ qua; hàng sau nó không trùng thì được giao. Trả `trung` liệt các hàng đã bỏ qua để bộ
// phát lịch ghi phụ thuộc `sau`; mọi hàng sẵn sàng đều trùng → `cho: 'trung-tep'`. Vắng hàm thì như cũ.
export function chonHangKe(hangViec, phien, tienDo, quyet = null, trung = null) {
  // Dãy được cho nghỉ (§4.6 «Cho P4 nghỉ») không nhận hàng kế nào.
  if (hangViec.day?.find((d) => d.id === phien)?.nghi === true) return { hang: null, cho: 'nghi' };
  const cua = hangViec.hang.filter((h) => h.day === phien);
  const dangLam = cua.find((h) => tienDo.get(h.slug) === 'dang');
  if (dangLam) return { hang: dangLam.slug, moi: false };
  const quyetCua = (h) => quyet?.get(h.slug) ?? 'da-quyet';
  const chua = (h) => (tienDo.get(h.slug) ?? 'chua') === 'chua';
  const duPhuThuoc = (h) =>
    (h.sau ?? []).every((ma) => {
      const truoc = hangViec.hang.find((x) => x.ma === ma) ?? hangViec.hang.find((x) => x.ma === undefined && x.slug === ma);
      return truoc !== undefined && tienDo.get(truoc.slug) === 'gop';
    });
  const coThe = cua.filter((h) => chua(h) && duPhuThuoc(h));
  const sanSang = coThe.filter((h) => quyetCua(h) === 'da-quyet').sort((a, b) => (a.uu_tien ?? 99) - (b.uu_tien ?? 99));
  const boQua = [];
  for (const h of sanSang) {
    const voi = trung ? trung(h).trung : [];
    if (voi.length === 0) return { hang: h.slug, moi: true, ...(boQua.length ? { trung: boQua } : {}) };
    boQua.push({ hang: h.slug, voi });
  }
  if (boQua.length > 0) return { hang: null, cho: 'trung-tep', trung: boQua };
  // Hàng chưa bắt đầu mà ô đã quyết khác build không vào đợt — không tính là việc còn lại của dãy.
  const conViec = cua.some((h) => !(chua(h) && quyetCua(h) === 'khong-build') && !['ky', 'gop'].includes(tienDo.get(h.slug) ?? 'chua'));
  if (!conViec) return { hang: null, xong: true };
  return { hang: null, cho: coThe.some((h) => quyetCua(h) === 'cho') ? 'cong-dang' : 'phu-thuoc' };
}

// Bên đọc của `tiep/<dãy>.json` (bên viết: `capNhatHangKe` của bộ phát lịch ghi `ke` do `chonHangKe` trả) — MỘT
// chỗ cho lời ghi danh của `tiep-tuc`/`chan-doan` (hồ sơ dieu-phoi-sua-truoc-dot-thu, D1). Trả `{hang}` hoặc
// `{hang: null, ly_do}`. Tệp vắng (bộ phát lịch chưa chạy nhịp nào) → hàng ưu tiên đầu của dãy, như trước.
export function hangKeTuTiep(tiep, hangViec, id) {
  if (hangViec.day?.find((d) => d.id === id)?.nghi === true) return { hang: null, ly_do: 'nghi' };
  if (tiep) return tiep.hang ? { hang: tiep.hang } : { hang: null, ly_do: tiep.xong ? 'xong' : tiep.cho ?? 'cho' };
  const dau = (hangViec.hang ?? []).filter((h) => h.day === id).sort((a, b) => (a.uu_tien ?? 99) - (b.uu_tien ?? 99))[0];
  return dau ? { hang: dau.slug } : { hang: null, ly_do: 'khong-co-hang' };
}
