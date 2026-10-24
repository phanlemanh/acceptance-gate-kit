import { NHIP } from './cau-hinh.mjs';
import { khopMot } from './glob.mjs';
import { CAU_DA_GHI, LOI_GUI_LAI } from './cua-tin-hieu.mjs';

const MOT_NGAY_MS = NHIP.motNgayMs;

export function xetYeuCau(yc, nguCanh, cfg) {
  switch (yc.loai) {
    case 'cham-tep':
      return xetChamTep(yc, nguCanh, cfg);
    case 'viec-phu':
    case 'hang-moi':
      return xetYMoi(yc, nguCanh);
    case 's4-gom': {
      const uoc = yc.noi_dung?.uoc_phut;
      if (Number.isFinite(uoc) && uoc <= cfg.s4_tran_gom_phut) {
        return { ket_qua: 'duyet', boi: 'may', ly_do: `trong trần ${cfg.s4_tran_gom_phut}′` };
      }
      return { ket_qua: 'can_phan', ly_do: `ước ${uoc ?? '?'}′ vượt trần ${cfg.s4_tran_gom_phut}′` };
    }
    case 'gia-han':
      return xetGiaHan(yc, nguCanh, cfg);
    case 'can-nguoi':
      return { ket_qua: 'can_phan', dich: 'owner', ly_do: 'việc chỉ người làm được' };
    default:
      return { ket_qua: 'can_phan', ly_do: `loại ${yc.loai} cần phán` };
  }
}

function xetChamTep(yc, nguCanh, cfg) {
  const tep = yc.noi_dung?.tep ?? [];
  if (!Array.isArray(tep) || !tep.every((t) => typeof t === 'string')) return { ket_qua: 'can_phan', ly_do: 'tep phải là danh sách đường dẫn' };
  if (tep.length === 0) return { ket_qua: 'can_phan', ly_do: 'yêu cầu không nêu tệp' };
  const baoVe = [...cfg.bao_ve, ...nguCanh.hangViec.hang.flatMap((h) => h.chung_chi_them ?? [])];
  const nhanhMinh = nguCanh.nhanhCua(yc.phien);
  const daNoi = Object.entries(nguCanh.ranhGioiThem ?? {}).filter(([phien]) => phien !== yc.phien);
  for (const t of tep) {
    if (khopMot(baoVe, t)) return { ket_qua: 'can_phan', ly_do: `${t} thuộc danh sách bảo vệ` };
    const chu = nguCanh.hangViec.hang.find((h) => h.day !== yc.phien && khopMot(h.ranh_gioi ?? [], t));
    if (chu) return { ket_qua: 'can_phan', ly_do: `${t} thuộc ranh giới ${chu.day}` };
    const nguoiNoi = daNoi.find(([, ds]) => ds.includes(t));
    if (nguoiNoi) return { ket_qua: 'can_phan', ly_do: `${t} đã được duyệt cho ${nguoiNoi[0]}` };
    const nhanh = (nguCanh.nhanhChamTep.get(t) ?? []).filter((b) => b !== nhanhMinh);
    if (nhanh.length > 0) return { ket_qua: 'can_phan', ly_do: `${t} đang được nhánh ${nhanh.join(', ')} sửa` };
  }
  // Không dò được nhánh mở thì «không nhánh nào chạm» là điều chưa kiểm (hạt giống 10/10 lỗ 1) — giám sát phán.
  if (nguCanh.nhanhLoi) return { ket_qua: 'can_phan', ly_do: `không dò được nhánh mở (${nguCanh.nhanhLoi}) — chưa kiểm được ai đang sửa ${tep.join(', ')}` };
  return { ket_qua: 'duyet', boi: 'may', ly_do: 'không ai giữ, không nhánh mở nào chạm, không thuộc danh sách bảo vệ' };
}

function xetGiaHan(yc, nguCanh, cfg) {
  const uoc = yc.noi_dung?.uoc_phut;
  if (!(Number.isFinite(uoc) && uoc > 0 && uoc <= cfg.s4_tran_gom_phut)) {
    return { ket_qua: 'can_phan', ly_do: `ước ${uoc ?? '?'}′ vượt trần ${cfg.s4_tran_gom_phut}′` };
  }
  const dangGiu = nguCanh.khoaCua(yc.phien);
  const muon = yc.noi_dung?.tai_nguyen;
  if (dangGiu.length === 0) return { ket_qua: 'can_phan', ly_do: `${yc.phien} không giữ khoá nào` };
  if (muon !== undefined && !dangGiu.includes(muon)) return { ket_qua: 'can_phan', ly_do: `${yc.phien} không giữ khoá ${muon}` };
  if (muon === undefined && dangGiu.length > 1) {
    return { ket_qua: 'can_phan', ly_do: `${yc.phien} giữ ${dangGiu.join(', ')} — nêu noi_dung.tai_nguyen` };
  }
  const taiNguyen = muon ?? dangGiu[0];
  return { ket_qua: 'duyet', boi: 'may', ly_do: `trong trần ${cfg.s4_tran_gom_phut}′, giữ khoá ${taiNguyen}`, tai_nguyen: taiNguyen };
}

const chuanHoa = (s) => (s ?? '').toLowerCase().replace(/\s+/g, ' ').trim();
// Tiêu đề của một ý: cùng thứ tự rơi với bộ đọc tín hiệu của kit (`tieuDeCua` trong scripts/tin-hieu.mjs — gói này
// được chép phẳng vào thư mục đợt nên mang bản chép). Tiêu đề rỗng thì không bao giờ là «trùng».
function tieuDeCua(nd) {
  if (typeof nd === 'string') return nd.trim();
  if (nd && typeof nd === 'object') for (const k of ['tieu_de', 'viec', 'cau_giao']) if (typeof nd[k] === 'string' && nd[k].trim()) return nd[k].trim();
  return '';
}
const tieuDeYc = (nd) => chuanHoa(tieuDeCua(nd));

const truocDo = (c, yc) => {
  const lc = Date.parse(c.luc);
  const ly = Date.parse(yc.luc);
  return lc < ly || (lc === ly && String(c.id) < String(yc.id));
};

// Việc phụ / việc mới giữa đợt (hồ sơ cua-tin-hieu-giua-chien-dich, B′ §10). Kho không có cửa tín hiệu → đường cũ
// nguyên vẹn, từng byte. Có cửa: chỉ ý khai chặn (`noi_dung.chan: true`) được phán giữa chừng; ý trùng trong 24 giờ
// gộp; còn lại máy trả «đã ghi» và nhịp xét chép yêu cầu vào cửa (`chuyenVaoCua`).
function xetYMoi(yc, nguCanh) {
  if (!nguCanh.cua) return yc.loai === 'viec-phu' ? xetViecPhu(yc, nguCanh) : { ket_qua: 'can_phan', ly_do: `loại ${yc.loai} cần phán` };
  const ten = yc.loai === 'viec-phu' ? 'việc phụ' : 'việc mới';
  if (yc.noi_dung?.chan === true) return { ket_qua: 'can_phan', ly_do: `${ten} chặn việc đang chạy` };
  const trung = timTrung(yc, nguCanh);
  if (trung) return { ket_qua: 'gop', boi: 'may', ly_do: `trùng yêu cầu ${trung.id}`, voi: trung.id };
  return { ket_qua: 'ghi', boi: 'may', ly_do: `${CAU_DA_GHI} — ${LOI_GUI_LAI}` };
}

function timTrung(yc, nguCanh) {
  const luc = Date.parse(yc.luc);
  const tepMoi = yc.noi_dung?.tep ?? [];
  const td = tieuDeYc(yc.noi_dung);
  return nguCanh.yeuCauGanDay.find(
    (c) =>
      c.loai === yc.loai &&
      c.id !== yc.id &&
      truocDo(c, yc) &&
      luc - Date.parse(c.luc) < MOT_NGAY_MS &&
      c.noi_dung?.kho === yc.noi_dung?.kho &&
      ((td !== '' && tieuDeYc(c.noi_dung) === td) || (c.noi_dung?.tep ?? []).some((t) => tepMoi.includes(t))),
  );
}

function xetViecPhu(yc, nguCanh) {
  const luc = Date.parse(yc.luc);
  const tepMoi = yc.noi_dung?.tep ?? [];
  const trung = nguCanh.yeuCauGanDay.find(
    (c) =>
      c.loai === 'viec-phu' &&
      c.id !== yc.id &&
      truocDo(c, yc) &&
      luc - Date.parse(c.luc) < MOT_NGAY_MS &&
      c.noi_dung?.kho === yc.noi_dung?.kho &&
      (chuanHoa(c.noi_dung?.tieu_de) === chuanHoa(yc.noi_dung?.tieu_de) ||
        (c.noi_dung?.tep ?? []).some((t) => tepMoi.includes(t))),
  );
  if (trung) return { ket_qua: 'gop', boi: 'may', ly_do: `trùng yêu cầu ${trung.id}`, voi: trung.id };
  return { ket_qua: 'can_phan', ly_do: 'việc phụ mới' };
}
