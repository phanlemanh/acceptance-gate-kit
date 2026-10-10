// Vai của đợt (spec workflow §6) — bên viết của `vai.json`: phiên giám sát hiện tại và các dãy thợ.
// DP2 ghi lúc mở đợt; DP3 thêm «nhận vai giám sát» (lịch sử nhận vai nằm ở `lich_su`) và lúc thức.
import path from 'node:path';
import { docJson, ghiJsonNguyenTu } from './dot.mjs';
import { bayGio } from './song.mjs';

export const TEP_VAI = 'vai.json';

export function ghiVai(thuMuc, { phien = null, worktree = null, day = [] }) {
  ghiJsonNguyenTu(path.join(thuMuc, TEP_VAI), {
    giam_sat: { phien, worktree, nhan_luc: new Date().toISOString() },
    lich_su: [],
    day: day.map((d) => ({ id: d.id, worktree: d.worktree, phien: null })),
  });
}

export const docVai = (thuMuc) => docJson(path.join(thuMuc, TEP_VAI), null);

// true/false khi vai.json ghi một giám sát; null khi không có ai để so (đợt cũ, đợt dựng tay chưa nhận vai).
export function laGiamSat(thuMuc, phien) {
  const hienTai = docVai(thuMuc)?.giam_sat?.phien;
  if (!hienTai) return null;
  return hienTai === phien;
}

const voVai = (thuMuc) => docVai(thuMuc) ?? { giam_sat: null, lich_su: [], day: [] };

// Nhận vai giám sát. Cùng phiên → chỉ cập nhật lúc thức. Khác → mục cũ vào lịch sử kèm lúc thôi.
export function nhanVaiGiamSat(thuMuc, { phien, worktree = null, nowMs = null }) {
  const vai = voVai(thuMuc);
  const luc = new Date(bayGio(nowMs)).toISOString();
  const cu = vai.giam_sat;
  if (cu?.phien === phien) {
    ghiJsonNguyenTu(path.join(thuMuc, TEP_VAI), { ...vai, giam_sat: { ...cu, thuc_luc: luc } });
    return { doi: false };
  }
  const lichSu = [...(vai.lich_su ?? [])];
  if (cu?.phien) lichSu.push({ ...cu, thoi_luc: luc });
  ghiJsonNguyenTu(path.join(thuMuc, TEP_VAI), { ...vai, giam_sat: { phien, worktree, nhan_luc: luc, thuc_luc: luc }, lich_su: lichSu });
  return { doi: true };
}

export function ghiThucLuc(thuMuc, phien, { nowMs = null } = {}) {
  const vai = voVai(thuMuc);
  if (vai.giam_sat?.phien !== phien) return false;
  ghiJsonNguyenTu(path.join(thuMuc, TEP_VAI), { ...vai, giam_sat: { ...vai.giam_sat, thuc_luc: new Date(bayGio(nowMs)).toISOString() } });
  return true;
}
