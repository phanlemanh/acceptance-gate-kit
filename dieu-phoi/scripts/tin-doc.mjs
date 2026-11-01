// Lõi thuần của «vòng mở có chủ giữ» (hồ sơ vong-mo-co-chu-giu, GT1): bộ đọc dòng đầu và gấp sổ vòng mở theo thang
// chín nấc. Không đọc tệp, không gọi mạng — nơi chứa (thư mục đợt, kênh issue) đưa dòng vào, đồng hồ đưa qua tham số.
// Máy CHỈ đọc dòng đầu: thân tin từ dòng hai không bao giờ được phân loại (ca 16/10, #453 gộp vì khớp trên thân).

// Một nguồn cho bộ đọc, LUAT.md và README. `MỞ LẠI` là khẩu lệnh duy nhất có hai từ.
export const KHAU_LENH = Object.freeze(['GIAO', 'HỎI', 'BÁO', 'NHẬN', 'XONG', 'KẸT', 'TRẢ', 'HUỶ', 'MỞ LẠI']);
const BI_DANH = { HỦY: 'HUỶ' };
export const KHAU_LENH_MO = Object.freeze(['GIAO', 'HỎI']);
export const NAC = Object.freeze({ 'chua-den': 1, 'da-den': 2, 'da-nhan': 5, 'mo-lai': 5, ket: 6, 'cho-chap-nhan': 7, 'da-chap-nhan': 8 });
export const HAN_NHAN_MAC_DINH_PHUT = 30;
const PHUT = 60_000;

const chuan = (s) => String(s ?? '').normalize('NFC');

// Luật tên máy — MỘT nguồn (hồ sơ ten-may-mot-luat, #464): nhận vai, bên viết trên kênh và tiền tố mã tin cùng rút từ
// đây. Bên đọc dòng đầu giữ khoan dung (\S+); quan hệ viết→đọc do ca khứ hồi TM-1 giữ.
export const TEN_MAY_NGUON = '[A-Za-z0-9]+';
export const TEN_MAY_RE = new RegExp(`^${TEN_MAY_NGUON}$`, 'u');
export const LUAT_TEN_MAY = 'tên máy chỉ gồm chữ và số (thành tiền tố mã tin)';
// null khi hợp lệ; không thì câu báo nêu luật, kèm gợi ý bỏ khoảng trắng khi gợi ý ấy qua luật.
export function loiTenMay(ten, vai) {
  const t = String(ten ?? '');
  if (TEN_MAY_RE.test(t)) return null;
  const goiY = t.replace(/\s+/gu, '');
  return `${vai} «${t}» không hợp lệ — ${LUAT_TEN_MAY}${TEN_MAY_RE.test(goiY) ? `; thử «${goiY}»` : ''}`;
}
const MA_RE = new RegExp(`^${TEN_MAY_NGUON}-\\d{4}-\\d+$`, 'u');

// Khẩu lệnh dài nhất trước, để «MỞ LẠI» không bị đọc thành «MỞ».
const THEO_DO_DAI = [...KHAU_LENH, ...Object.keys(BI_DANH)].sort((a, b) => b.length - a.length);

export function vietDongDau({ khau_lenh: kl, ma, tu, den }) {
  if (!KHAU_LENH.includes(kl)) throw new Error(`khẩu lệnh lạ «${kl}» — hợp lệ: ${KHAU_LENH.join(', ')}`);
  return `${kl} ${ma} · ${tu} → ${den}`;
}

export function docDongDau(text) {
  const dau = chuan(text).split('\n')[0].replace(/\s+/gu, ' ').trim();
  if (!dau) return null;
  if (/^\[[^\]]*\]/u.test(dau)) return { cu: true };
  for (const k of THEO_DO_DAI) {
    if (!dau.startsWith(`${k} `)) continue;
    const m = /^(\S+) · (\S+) → (\S+)$/u.exec(dau.slice(k.length + 1));
    if (!m || !MA_RE.test(m[1])) return null;
    return { khau_lenh: BI_DANH[k] ?? k, ma: m[1], tu: m[2], den: m[3] };
  }
  return null;
}

// Trường «Nhãn: giá trị» trong thân (do chính lệnh `tin` viết). Thân không quyết loại tin — chỉ mang dữ kiện.
export function truongThan(than, nhan) {
  const re = new RegExp(`^${nhan}:\\s*(.*)$`, 'mu');
  const m = re.exec(chuan(than));
  return m ? m[1].trim() : null;
}
const soPhut = (s) => {
  const m = /^(\d+)\s*phút/u.exec(s ?? '');
  return m ? Number(m[1]) : null;
};

// dong: [{text, luc} (nguyên văn tin: dòng đầu + thân) | {may: 'da-den'|'chap-nhan'|'ket-luot-chua-nhan', ma, luc} | {yeu_cau, phien, luc, da_tra_loi}]
// tuyChon: {nowMs, choCong: Set<ma> (hồ sơ của vòng đang chờ cổng người → đồng hồ hạn xong ngừng)}
export function gapSo(dong, { nowMs = Date.now(), choCong = new Set() } = {}) {
  const vong = new Map();
  const lay = (ma) => vong.get(ma);
  const theoGio = [...dong].sort((a, b) => Date.parse(a.luc) - Date.parse(b.luc));
  for (const d of theoGio) {
    if (d.yeu_cau) {
      vong.set(d.yeu_cau, { ma: d.yeu_cau, khau_lenh_mo: 'HỎI', tu: d.phien, den: 'G', mo_luc: d.luc, trang_thai: d.da_tra_loi ? 'dong' : 'chua-den', yeu_cau_cu: true, han_nhan_phut: HAN_NHAN_MAC_DINH_PHUT });
      continue;
    }
    if (d.may) {
      const v = lay(d.ma);
      if (!v) continue;
      if (d.may === 'da-den' && v.trang_thai === 'chua-den') v.trang_thai = 'da-den';
      if (d.may === 'chap-nhan' && v.trang_thai === 'cho-chap-nhan') Object.assign(v, { trang_thai: 'da-chap-nhan', chap_nhan_luc: d.luc });
      if (d.may === 'ket-luot-chua-nhan') v.ket_luot_chua_nhan = true;
      continue;
    }
    const dd = docDongDau(d.text);
    if (!dd || dd.cu) continue;
    const than = chuan(d.text).split('\n').slice(1).join('\n');
    if (KHAU_LENH_MO.includes(dd.khau_lenh)) {
      if (vong.has(dd.ma)) continue;
      vong.set(dd.ma, {
        ma: dd.ma, khau_lenh_mo: dd.khau_lenh, tu: dd.tu, den: dd.den, mo_luc: d.luc, trang_thai: 'chua-den',
        han_nhan_phut: soPhut(truongThan(than, 'Hạn nhận')) ?? HAN_NHAN_MAC_DINH_PHUT,
        han_xong_khoang: soPhut(truongThan(than, 'Hạn xong')), y_dinh: truongThan(than, 'Ý định'),
        chan: truongThan(than, 'Chặn') === 'có', slug: /hồ sơ (\S+)/u.exec(truongThan(than, 'Kết quả') ?? '')?.[1] ?? null,
        ranh_gioi_kho: /^kho (\S+)/u.exec(truongThan(than, 'Ranh giới') ?? '')?.[1] ?? null,
      });
      continue;
    }
    const v = lay(dd.ma);
    if (!v) continue;
    const k = dd.khau_lenh;
    if (k === 'NHẬN') {
      const han = truongThan(than, 'Hạn xong');
      Object.assign(v, { trang_thai: 'da-nhan', nhan_luc: d.luc, se_giao: truongThan(than, 'Sẽ giao'), han_xong: han && !Number.isNaN(Date.parse(han)) ? han : null, sha_nhan: truongThan(than, 'Sha lúc nhận') });
    } else if (k === 'KẸT') v.trang_thai = 'ket';
    else if (k === 'XONG') Object.assign(v, { trang_thai: 'cho-chap-nhan', xong_luc: d.luc, sha_xong_cuoi: /^sha (\S+)/u.exec(truongThan(than, 'Vật') ?? '')?.[1] ?? v.sha_xong_cuoi ?? null });
    else if (k === 'TRẢ' || k === 'HUỶ') v.trang_thai = 'dong';
    else if (k === 'MỞ LẠI') {
      const khoang = v.han_xong_khoang;
      Object.assign(v, { trang_thai: 'mo-lai', mo_lai_luc: d.luc, han_xong: khoang != null ? new Date(Date.parse(d.luc) + khoang * PHUT).toISOString() : v.han_xong });
    }
  }
  const muc = [];
  for (const v of vong.values()) {
    v.nac = NAC[v.trang_thai] ?? null;
    const chuaNhan = v.trang_thai === 'chua-den' || v.trang_thai === 'da-den';
    const tuoi = (nowMs - Date.parse(v.mo_luc)) / PHUT;
    v.qua_han_nhan = !chuaNhan ? 0 : tuoi > 2 * v.han_nhan_phut ? 2 : tuoi > v.han_nhan_phut ? 1 : 0;
    const dangLam = v.trang_thai === 'da-nhan' || v.trang_thai === 'mo-lai' || v.trang_thai === 'ket';
    if (dangLam && v.han_xong && !choCong.has(v.ma)) {
      const han = Date.parse(v.han_xong);
      const khoang = (han - Date.parse(v.mo_lai_luc ?? v.nhan_luc ?? v.mo_luc)) / PHUT;
      const qua = (nowMs - han) / PHUT;
      v.qua_han_xong = qua > khoang ? 2 : qua > 0 ? 1 : 0;
    } else v.qua_han_xong = 0;
    v.ket_luot_chua_nhan = Boolean(v.ket_luot_chua_nhan);
    muc.push(v);
  }
  return muc.sort((a, b) => Date.parse(a.mo_luc) - Date.parse(b.mo_luc));
}

// Mã mới của người gửi: <người gửi>-<ddmm UTC>-<n>, n = lớn nhất cùng tiền tố trong nơi chứa + 1.
export function maMoi(dong, minh, nowMs) {
  const d = new Date(nowMs);
  const tien = `${minh}-${String(d.getUTCDate()).padStart(2, '0')}${String(d.getUTCMonth() + 1).padStart(2, '0')}-`;
  let max = 0;
  for (const x of dong) {
    const dd = x.text ? docDongDau(x.text) : null;
    if (dd?.ma?.startsWith(tien)) max = Math.max(max, Number(dd.ma.slice(tien.length)) || 0);
  }
  return `${tien}${max + 1}`;
}

// Sổ MỞ: bỏ vòng đã chấp nhận, đã trả, đã huỷ, và yêu cầu cũ đã có trả lời.
export const soMo = (muc) => muc.filter((v) => v.trang_thai !== 'da-chap-nhan' && v.trang_thai !== 'dong');
