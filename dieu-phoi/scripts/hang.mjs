// Đổi kế hoạch trong đợt (spec workflow §4.6) — bên viết duy nhất của `hang-viec.json` sau khi mở đợt.
// Đây là lớp phủ của đợt; đổi kế hoạch lâu dài là PR vào tệp lộ trình (§14 chỗ nối 5). Mỗi lần đổi thật
// thêm đúng một dòng Nhật ký và một sự kiện; chạy lại cùng lệnh là việc không làm gì.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { docJson, ghiJsonNguyenTu, ghiSuKien, gocKhoChinh, timThuMucDot } from './dot.mjs';
import { docHangViec } from './hinh-dang.mjs';
import { suySlug } from './nguon-hang.mjs';
import { HANH_DONG, keHoachDay, THU_MUC_CHO_GHI_DANH } from './tiep-tuc.mjs';

const TIEU_DE_NHAT_KY = '## Nhật ký';

// Chèn một dòng ngay dưới tiêu đề Nhật ký của LUAT.md (thiếu tiêu đề thì thêm vào cuối).
export function ghiNhatKy(thuMuc, cau) {
  const p = path.join(thuMuc, 'LUAT.md');
  const cu = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
  const dong = `- ${new Date().toISOString()} ${cau}`;
  const dsDong = cu.split('\n');
  const i = dsDong.findIndex((d) => d.trim() === TIEU_DE_NHAT_KY);
  if (i < 0) fs.writeFileSync(p, `${cu.replace(/\s*$/, '')}\n\n${TIEU_DE_NHAT_KY}\n${dong}\n`);
  else {
    dsDong.splice(i + 1, 0, dong);
    fs.writeFileSync(p, dsDong.join('\n'));
  }
}

// Khoá vắng (`undefined`) từng khớp mọi hàng không mang `ma` — S4-r1 lượt 2. Đối số phải là chuỗi có chữ.
const coChu = (x) => typeof x === 'string' && x.trim() !== '';
const can = (x, ten) => {
  if (!coChu(x)) throw new Error(`hang: thiếu ${ten}`);
};
const timHang = (hv, khoa) => (coChu(khoa) ? hv.hang.find((h) => h.ma === khoa || h.slug === khoa) : undefined);
const luu = (thuMuc, hv, cau, suKien) => {
  ghiJsonNguyenTu(path.join(thuMuc, 'hang-viec.json'), hv);
  ghiNhatKy(thuMuc, cau);
  ghiSuKien(thuMuc, { loai: 'doi-ke-hoach', ...suKien });
};

// Khoá ghi của `hang-viec.json` (DP8, design chỗ chọn 2e): tám chip bấm gần nhau thì tám `ghi-danh` cùng đọc-sửa-ghi.
// Mọi bên viết của tệp này bọc đọc-sửa-ghi (kể cả dòng Nhật ký) trong khoá thư mục `hang-viec.khoa`: mkdir nguyên tử,
// chờ tối đa 10″, khoá cũ hơn 30″ là của tiến trình đã chết. `DIEU_PHOI_TRE_GHI_MS` chỉ ca đo đặt: trễ giữa đọc và
// ghi để ép tranh chấp.
export const TEP_KHOA_HANG_VIEC = 'hang-viec.khoa';
const CHO_KHOA_MS = 10_000;
const KHOA_BO_ROI_MS = 30_000;
const ngu = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
const treThu = () => {
  const ms = Number(process.env.DIEU_PHOI_TRE_GHI_MS);
  if (ms > 0) ngu(ms);
};

export function voiKhoaHangViec(thuMuc, viec) {
  const d = path.join(thuMuc, TEP_KHOA_HANG_VIEC);
  const het = Date.now() + CHO_KHOA_MS;
  for (;;) {
    try {
      fs.mkdirSync(d);
      break;
    } catch (e) {
      if (e.code !== 'EEXIST') throw e;
    }
    let tuoi = 0;
    try {
      tuoi = Date.now() - fs.statSync(d).mtimeMs;
    } catch {
      continue;
    }
    if (tuoi > KHOA_BO_ROI_MS) {
      fs.rmSync(d, { recursive: true, force: true });
      continue;
    }
    if (Date.now() > het) throw new Error(`hang: hang-viec.json đang bị khoá quá ${CHO_KHOA_MS / 1000}″ (${d}) — thử lại`);
    ngu(25);
  }
  try {
    return viec();
  } finally {
    fs.rmSync(d, { recursive: true, force: true });
  }
}

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

export function themHang(thuMuc, khoa, day) {
  can(khoa, 'mã hoặc việc cần thêm');
  can(day, '--day <dãy>');
  return voiKhoaHangViec(thuMuc, () => themHangTrongKhoa(thuMuc, khoa, day));
}

function themHangTrongKhoa(thuMuc, khoa, day) {
  const hv = docHangViec(thuMuc);
  treThu();
  if (!hv.day.some((d) => d.id === day)) throw new Error(`hang: không có dãy ${day}`);
  const slug = timHang(hv, khoa)?.slug ?? suySlug(khoa);
  if (!slug) throw new Error(`hang: không suy được slug từ «${khoa}»`);
  if (hv.hang.some((h) => h.day === day && (h.slug === slug || h.ma === khoa))) return { doi: false };
  hv.hang.push({ slug, day });
  luu(thuMuc, hv, `thêm việc ${khoa} cho ${day}`, { kieu: 'them', hang: slug, day });
  return { doi: true, slug };
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
