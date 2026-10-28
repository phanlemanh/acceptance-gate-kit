// Đổi kế hoạch trong đợt (spec workflow §4.6) — bên viết duy nhất của `hang-viec.json` sau khi mở đợt.
// Đây là lớp phủ của đợt; đổi kế hoạch lâu dài là PR vào tệp lộ trình (§14 chỗ nối 5). Mỗi lần đổi thật
// thêm đúng một dòng Nhật ký và một sự kiện; chạy lại cùng lệnh là việc không làm gì.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { docJson, ghiJsonNguyenTu, ghiSuKien, gocKhoChinh, timThuMucDot } from './dot.mjs';
import { docHangViec } from './hinh-dang.mjs';
import { suySlug, timHangLoTrinh } from './nguon-hang.mjs';
import { HANH_DONG, keHoachDay, THU_MUC_CHO_GHI_DANH } from './tiep-tuc.mjs';
import { coThuMucTinh, docChupNhanhMo, xetTrungTep } from './trung-tep.mjs';
import { ghiNhatKy, luu, TEP_KHOA_HANG_VIEC, treThu, voiKhoaHangViec } from './khoa-hang-viec.mjs';

export { ghiNhatKy, TEP_KHOA_HANG_VIEC, voiKhoaHangViec };
export { themSau } from './khoa-hang-viec.mjs';

// Khoá vắng (`undefined`) từng khớp mọi hàng không mang `ma` — S4-r1 lượt 2. Đối số phải là chuỗi có chữ.
const coChu = (x) => typeof x === 'string' && x.trim() !== '';
const can = (x, ten) => {
  if (!coChu(x)) throw new Error(`hang: thiếu ${ten}`);
};
const timHang = (hv, khoa) => (coChu(khoa) ? hv.hang.find((h) => h.ma === khoa || h.slug === khoa) : undefined);

export function dayLen(thuMuc, khoa, truocKhoa) {
  can(khoa, 'mã hàng cần đẩy');
  can(truocKhoa, '--truoc <mã>');
  return voiKhoaHangViec(thuMuc, () => dayLenTrongKhoa(thuMuc, khoa, truocKhoa));
}

function dayLenTrongKhoa(thuMuc, khoa, truocKhoa) {
  const hv = docHangViec(thuMuc);
  treThu();
  const h = timHang(hv, khoa);
  if (!h) throw new Error(`hang: không có hàng ${khoa}`);
  const truoc = timHang(hv, truocKhoa);
  if (!truoc) throw new Error(`hang: không có hàng ${truocKhoa}`);
  const mucTruoc = truoc.uu_tien ?? 99;
  if ((h.uu_tien ?? 99) < mucTruoc) return { doi: false };
  h.uu_tien = mucTruoc - 1;
  luu(thuMuc, hv, `đẩy ${khoa} lên trước ${truocKhoa}`, { kieu: 'day-len', hang: h.slug, truoc: truoc.slug, uu_tien: h.uu_tien });
  return { doi: true };
}

export function themHang(thuMuc, khoa, day, { ranhGioi = null } = {}) {
  can(khoa, 'mã hoặc việc cần thêm');
  can(day, '--day <dãy>');
  return voiKhoaHangViec(thuMuc, () => themHangTrongKhoa(thuMuc, khoa, day, ranhGioi));
}

// Lịch biết tệp (hồ sơ ky-den-gop, hạng C): hàng mới gán vào dãy được so vùng tệp với việc đang dở ở dãy khác — đọc
// từ trang-thai.json của bộ phát lịch (hàng của mỗi dãy + tiến độ, bản chụp PR đang mở). Trùng hàng → tự thêm `sau`
// (hàng kia gộp xong mới bắt đầu); trùng PR ngoài đợt → báo, bộ phát lịch giữ hàng tới khi PR ấy đóng. Hàng không
// khai vùng tệp → một dòng cảnh báo, không chặn.
function trungLucThem(thuMuc, hv, hangMoi) {
  const tt = docJson(path.join(thuMuc, 'trang-thai.json'), {}) ?? {};
  const tienDo = new Map();
  const keCua = new Map();
  for (const d of tt.day ?? []) {
    if (!d.hang) continue;
    keCua.set(d.id, d.hang);
    if (['dang', 'ky'].includes(d.tien_do)) tienDo.set(d.hang, d.tien_do);
  }
  return xetTrungTep(hangMoi, { hangViec: hv, tienDo, keCua, nhanhMo: docChupNhanhMo(tt.nhanh_mo), nhanhCuaDay: new Map(Object.entries(tt.nhanh_mo?.nhanh_day ?? {})) });
}

// Mã của một hàng lộ trình mà đợt chưa có (hồ sơ vung-giao-viec-tu-cat-luot): vùng mã dự kiến của hàng ấy làm vùng tệp.
// Đợt không khai nguồn hàng, hay mã không có ở đúng một tệp lộ trình → null, như trước.
function vungLoTrinh(thuMuc, khoa) {
  const cfg = docJson(path.join(thuMuc, 'dieu-phoi.config.json'), {}) ?? {};
  if (!Array.isArray(cfg.nguon_hang) || typeof cfg.goc_kho !== 'string') return null;
  return timHangLoTrinh(cfg.goc_kho, cfg.nguon_hang, khoa)?.vung ?? null;
}

function themHangTrongKhoa(thuMuc, khoa, day, ranhGioi) {
  const hv = docHangViec(thuMuc);
  treThu();
  if (!hv.day.some((d) => d.id === day)) throw new Error(`hang: không có dãy ${day}`);
  const goc = timHang(hv, khoa);
  const slug = goc?.slug ?? suySlug(khoa);
  if (!slug) throw new Error(`hang: không suy được slug từ «${khoa}»`);
  if (hv.hang.some((h) => h.day === day && (h.slug === slug || h.ma === khoa))) return { doi: false };
  const rg = ranhGioi ?? goc?.ranh_gioi ?? (goc ? null : vungLoTrinh(thuMuc, khoa));
  const hangMoi = { slug, day, ...(rg?.length ? { ranh_gioi: rg } : {}) };
  const { vang, trung } = trungLucThem(thuMuc, hv, hangMoi);
  const sau = [...new Set(trung.filter((t) => t.voi === 'hang').map((t) => t.khoa))];
  if (sau.length) hangMoi.sau = sau;
  hv.hang.push(hangMoi);
  luu(thuMuc, hv, `thêm việc ${khoa} cho ${day}${sau.length ? ` — sau ${sau.join(', ')} (trùng tệp)` : ''}`, { kieu: 'them', hang: slug, day, ...(sau.length ? { sau, trung } : {}) });
  const canhBao = [];
  if (vang) canhBao.push(`hang them: ${slug} không khai ranh_gioi — lịch không so được tệp; thêm --ranh-gioi <glob,glob> để máy xếp tránh trùng`);
  for (const t of trung.filter((x) => x.voi === 'pr')) canhBao.push(`hang them: ${slug} trùng tệp PR mở ${t.nhanh} (${t.tep.slice(0, 3).join(', ')}) — bộ phát lịch giữ hàng tới khi PR ấy đóng`);
  return { doi: true, slug, sau, canhBao };
}

// Khai vùng ở Cổng Phạm vi (hồ sơ vung-giao-viec-tu-cat-luot): phiên thợ GỘP thư mục mã mà thiết kế chạm vào vùng tệp của
// hàng (vùng cũ giữ nguyên — thà báo trùng thừa còn hơn lọt). Glob không có thư mục tĩnh bị từ chối trước khi ghi byte nào.
// Hàng chưa bắt đầu ở dãy khác do bộ phát lịch so lại ở nhịp kế (có thể nhận `sau`); hàng đang làm hay đã ký ở dãy khác mà
// chồng vùng mới thì chỉ BÁO — một sự kiện `trung-tep` (luc cong-pham-vi) mỗi hàng, không ghi `sau`, không đụng khoá.
export function khaiVung(thuMuc, khoa, vung) {
  can(khoa, 'mã hoặc slug của hàng');
  const ds = (Array.isArray(vung) ? vung : []).map((g) => String(g).trim()).filter(Boolean);
  if (!ds.length) throw new Error('hang vung: thiếu --vung <glob,glob>');
  const rong = ds.filter((g) => !coThuMucTinh(g));
  if (rong.length) throw new Error(`hang vung: ${rong.map((g) => `«${g}»`).join(', ')} không có thư mục tĩnh trước ký tự đại diện — chồng mọi hàng; ghi thư mục mã của màn`);
  return voiKhoaHangViec(thuMuc, () => khaiVungTrongKhoa(thuMuc, khoa, ds));
}

function khaiVungTrongKhoa(thuMuc, khoa, ds) {
  const hv = docHangViec(thuMuc);
  treThu();
  const h = timHang(hv, khoa);
  if (!h) throw new Error(`hang vung: không có hàng ${khoa}`);
  const cu = h.ranh_gioi ?? [];
  const moi = ds.filter((g) => !cu.includes(g));
  if (!moi.length) return { doi: false, canhBao: [] };
  h.ranh_gioi = [...cu, ...moi];
  luu(thuMuc, hv, `${h.slug} khai thêm vùng ở Cổng Phạm vi: ${moi.join(', ')}`, { kieu: 'vung', hang: h.slug, day: h.day, them: moi });
  const tt = docJson(path.join(thuMuc, 'trang-thai.json'), {}) ?? {};
  const tienDo = new Map((tt.day ?? []).filter((d) => d.hang && ['dang', 'ky'].includes(d.tien_do)).map((d) => [d.hang, d.tien_do]));
  const { trung } = xetTrungTep(h, { hangViec: hv, tienDo });
  const canhBao = [];
  for (const t of trung.filter((x) => x.voi === 'hang')) {
    ghiSuKien(thuMuc, { loai: 'trung-tep', luc: 'cong-pham-vi', hang: h.slug, phien: h.day, voi: 'hang', khoa: t.khoa, voi_hang: t.hang, mau: t.mau, can_phan: false });
    canhBao.push(`hang vung: ${h.slug} chồng vùng với ${t.hang} (${t.day}, ${tienDo.get(t.hang) === 'ky' ? 'đã ký' : 'đang làm'}) — ${t.mau.join(' × ')}; chỉ báo, hai hàng vẫn chạy`);
  }
  return { doi: true, them: moi, canhBao };
}

export function choNghi(thuMuc, day) {
  can(day, 'dãy cần cho nghỉ');
  return voiKhoaHangViec(thuMuc, () => choNghiTrongKhoa(thuMuc, day));
}

function choNghiTrongKhoa(thuMuc, day) {
  const hv = docHangViec(thuMuc);
  treThu();
  const d = hv.day.find((x) => x.id === day);
  if (!d) throw new Error(`hang: không có dãy ${day}`);
  if (d.nghi === true) return { doi: false };
  d.nghi = true;
  luu(thuMuc, hv, `cho ${day} nghỉ`, { kieu: 'nghi', day });
  return { doi: true };
}

// Dấu «dãy chưa ghi danh» (DP8, design chỗ chọn 2c): lúc mở đợt từ gói, dãy có `worktree` không phải thư mục (chỗ
// giữ — chip của app dựng worktree tên ngẫu nhiên nên gói không biết trước) nhận `cho-ghi-danh/<dãy>.json`.
// `keHoachDay` đọc dấu: dãy chưa ghi danh được mời chip, không xếp `worktree-mat`. `ghiDanhWorktree` xoá dấu.
const laThuMuc = (p) => {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
};
export function ghiDauChoGhiDanh(thuMuc, hangViec, { nowMs = Date.now() } = {}) {
  for (const d of hangViec.day) {
    if (!laThuMuc(d.worktree)) ghiJsonNguyenTu(path.join(thuMuc, THU_MUC_CHO_GHI_DANH, `${d.id}.json`), { day: d.id, worktree_goi: d.worktree, luc: new Date(nowMs).toISOString() });
  }
}

// Phiên thợ tự ghi danh worktree của mình vào dãy (DP8, #301 điểm 2; design chỗ chọn 2a, 2b). Bốn lời từ chối cố
// định; còn lại «dãy còn phiên» đọc từ MỘT nguồn với tiep-tuc/chan-doan (`keHoachDay`): bất biến «máy mời chip cho
// dãy ⇔ phiên chip ghi danh được». Đơn chờ của dãy đổi sang worktree mới, giữ giờ xin.
const HANH_DONG_CON_PHIEN = [HANH_DONG.khong, HANH_DONG.nhanGiangLai, HANH_DONG.choNguoi];
const thuc = (p) => {
  try {
    return fs.realpathSync(p);
  } catch {
    return p;
  }
};
export function ghiDanhWorktree(cwd, id, { nowMs = null } = {}) {
  can(id, 'dãy cần ghi danh — dùng: ghi-danh <dãy>');
  const thuMuc = timThuMucDot(cwd);
  if (!thuMuc) throw new Error('ghi-danh: không có đợt nào đang chạy');
  let w;
  try {
    w = fs.realpathSync(execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim());
  } catch {
    throw new Error('ghi-danh: cwd không nằm trong một worktree git');
  }
  if (w === thuc(gocKhoChinh(cwd))) throw new Error(`ghi-danh: ${w} là gốc kho chính, không phải worktree của phiên thợ — chạy từ worktree của chip`);
  return voiKhoaHangViec(thuMuc, () => {
    const hv = docHangViec(thuMuc);
    const d = hv.day.find((x) => x.id === id);
    if (!d) throw new Error(`ghi-danh: không có dãy ${id} trong đợt (có: ${hv.day.map((x) => x.id).join(', ')})`);
    if (thuc(d.worktree) === w) return { doi: false, day: id, worktree: w };
    const khac = hv.day.find((x) => x.id !== id && thuc(x.worktree) === w);
    if (khac) throw new Error(`ghi-danh: ${w} đã là worktree của dãy ${khac.id}`);
    const cu = d.worktree;
    const conCu = laThuMuc(cu);
    if (conCu) {
      const kh = keHoachDay(thuMuc, { nowMs }).find((k) => k.day === id);
      if (kh && HANH_DONG_CON_PHIEN.includes(kh.hanh_dong)) throw new Error(`ghi-danh: dãy ${id} còn phiên ở ${cu} (${kh.hanh_dong}) — không đè; hỏi giám sát`);
    }
    treThu();
    d.worktree = w;
    const dXin = path.join(thuMuc, 'xin');
    const doiDon = [];
    for (const f of fs.existsSync(dXin) ? fs.readdirSync(dXin).filter((x) => x.startsWith(`${id}-`) && x.endsWith('.json')).sort() : []) {
      const don = docJson(path.join(dXin, f), null);
      if (don?.phien !== id) continue;
      ghiJsonNguyenTu(path.join(dXin, f), { ...don, worktree: w });
      doiDon.push(f);
    }
    luu(thuMuc, hv, `ghi danh ${id} → ${w} (thay ${cu})`, { kieu: 'ghi-danh', day: id, worktree: w, thay: cu, ...(doiDon.length ? { doi_don: doiDon } : {}) });
    fs.rmSync(path.join(thuMuc, THU_MUC_CHO_GHI_DANH, `${id}.json`), { force: true });
    const nhac = conCu ? `nhánh cũ còn checkout ở ${cu} — gỡ worktree cũ (\`git worktree remove ${cu}\`, sau khi chắc không còn thay đổi chưa commit) rồi \`git switch <nhánh>\` ở worktree này` : null;
    return { doi: true, day: id, worktree: w, thay: cu, nhac };
  });
}
