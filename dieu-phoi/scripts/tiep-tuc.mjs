// Phần tất định của «tiếp tục» (spec workflow §4.2, design DP3 §3): nhận vai giám sát, ghi lúc thức, chạy
// lại bộ phát lịch nếu đã chết, và kế hoạch từng dãy. Phiên chỉ làm việc của app theo đúng hành động CLI
// trả — không tự suy. KHÔNG đổi `pha` (chỗ chọn 5: hai trạng thái ★ thuộc DP4).
import fs from 'node:fs';
import path from 'node:path';
import { docJson, timThuMucDot } from './dot.mjs';
import { docHangViec } from './hinh-dang.mjs';
import { docPha } from './pha.mjs';
import { banGiaoGanNhat, roiBanGiao } from './ban-giao.mjs';
import { mucDay } from './muc-day.mjs';
import { conSong, coThuMucSong, nhipMoiNhatCua } from './song.mjs';
import { ghiThucLuc, laGiamSat, nhanVaiGiamSat } from './vai.mjs';

// Sáu hành động của một dãy — MỘT nguồn cho chẩn đoán, tiep-tuc và thân lệnh người.
export const HANH_DONG = {
  khong: 'khong',
  nhanGiangLai: 'nhan-giang-lai',
  moChip: 'mo-chip',
  worktreeMat: 'worktree-mat',
  choNguoi: 'cho-nguoi',
  chuaBiet: 'chua-biet',
};

export const VIEC_HANH_DONG = {
  khong: 'dãy có phiên sống hoặc đang giữ khoá — không làm gì',
  'nhan-giang-lai': 'dãy có phiên sống nhưng còn đơn, khoá hay yêu cầu chờ — nhắn dãy «tiếp tục: giăng lại lệnh chờ»',
  'mo-chip': 'dãy không còn phiên sống — mở chip với lời ghi danh',
  'worktree-mat': 'worktree của dãy không còn — người quyết dựng lại hay cho dãy nghỉ',
  'cho-nguoi': 'phiên của dãy đang đứng chờ người — không mở chip, đưa vào việc chờ anh',
  'chua-biet': 'đợt chưa có nhịp sống (hook bản cũ, hoặc phiên chưa nạp lại gói) — kiểm thanh bên trước khi mở chip',
};

const coTep = (thuMuc, ten, tienTo) => {
  const d = path.join(thuMuc, ten);
  return fs.existsSync(d) ? fs.readdirSync(d).filter((f) => f.startsWith(tienTo) && f.endsWith('.json')) : [];
};
const laThuMuc = (p) => {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
};

// Hành động của MỘT dãy. Thứ tự xét: worktree mất → giữ khoá → chờ người → nhịp sống → đợt chưa có nhịp → chip.
// DP4 (design chỗ chọn 12): `bgGan` = bàn giao gần nhất; nhịp của các phiên đã bàn giao dãy không tính là phiên sống.
function xetDay(thuMuc, d, { hangViec, coSong, khoaGiu, nowMs, bgGan = null }) {
  const mucBg = bgGan?.day?.find((m) => m.id === d.id) ?? null;
  const phienCu = new Set(mucBg?.ban_giao === 'xong' ? mucBg.phien_cu ?? [] : []);
  const nhip = nhipMoiNhatCua(thuMuc, d.worktree, { boQua: phienCu });
  const nen = { day: d.id, worktree: d.worktree, song: conSong(nhip, nowMs) ? nhip.phien : null };
  const giuKhoa = khoaGiu.has(d.id);
  const conCho = coTep(thuMuc, 'xin', `${d.id}-`).length > 0
    || coTep(thuMuc, 'yeu-cau', `${d.id}-`).some((f) => !fs.existsSync(path.join(thuMuc, 'tra-loi', f)));
  if (!laThuMuc(d.worktree)) return { ...nen, hanh_dong: HANH_DONG.worktreeMat };
  if (giuKhoa) return { ...nen, hanh_dong: conCho ? HANH_DONG.nhanGiangLai : HANH_DONG.khong };
  if (fs.existsSync(path.join(thuMuc, 'cho-nguoi', `${d.id}.json`))) return { ...nen, hanh_dong: HANH_DONG.choNguoi };
  if (nen.song) return { ...nen, hanh_dong: conCho ? HANH_DONG.nhanGiangLai : HANH_DONG.khong };
  if (!coSong) return { ...nen, hanh_dong: HANH_DONG.chuaBiet };
  // Lời ghi danh dựng từ MỘT hàm mục dãy (git + thư mục đợt, dùng chung với ban-giao.json), cộng lớp phủ bàn giao.
  const m = mucDay(thuMuc, d, { hangViec, maBanGiao: bgGan?.ma ?? null });
  const slug = m.slug;
  const phu = mucBg ? ` · bàn giao ${bgGan.ma}: ${mucBg.ban_giao}${mucBg.co_wip ? ' (có commit WIP)' : ''}` : '';
  return {
    ...nen,
    hanh_dong: HANH_DONG.moChip,
    da_ban_giao: phienCu.size > 0,
    muc: m,
    ghi_danh: `thư mục đợt ${thuMuc} · dãy ${d.id} · worktree ${d.worktree} · nhánh ${m.nhanh ?? '?'} @ ${(m.dinh ?? '').slice(0, 7)}${slug ? ` · hồ sơ ${slug} (${m.trang_thai_ho_so ?? 'chưa có'})` : ''}${phu} · đọc LUAT.md trước S1 · ${slug ? `/feature-loop:feature-loop ${slug}` : 'dãy chưa có hàng kế — hỏi giám sát'}`,
  };
}

// Kế hoạch từng dãy — MỘT hàm cho chẩn đoán (mục day:<id>) và tiep-tuc (ke_hoach).
export function keHoachDay(thuMuc, { nowMs = null } = {}) {
  const hangViec = docHangViec(thuMuc);
  const khoaGiu = new Set();
  const dKhoa = path.join(thuMuc, 'khoa');
  if (fs.existsSync(dKhoa)) {
    for (const tn of fs.readdirSync(dKhoa)) {
      const chu = docJson(path.join(dKhoa, tn, 'chu.json'), null);
      if (chu?.phien) khoaGiu.add(chu.phien);
    }
  }
  const nguCanh = { hangViec, coSong: coThuMucSong(thuMuc), khoaGiu, nowMs, bgGan: banGiaoGanNhat(thuMuc) };
  return hangViec.day.map((d) => {
    const ket = xetDay(thuMuc, d, nguCanh);
    return { ...ket, viec: VIEC_HANH_DONG[ket.hanh_dong] };
  });
}

// `chay(cwd)` do CLI truyền vào (hàm chayPhatLich) để mô-đun này không nạp CLI.
export function tiepTuc(cwd, { phien, nhe = false, nowMs = null, chay = null }) {
  const thuMuc = timThuMucDot(cwd);
  if (!thuMuc) throw new Error('tiep-tuc: không có đợt nào đang chạy');
  if (typeof phien !== 'string' || phien.trim() === '') throw new Error('tiep-tuc: cần --phien <mã phiên này>');
  if (nhe) {
    if (laGiamSat(thuMuc, phien) === false) return { dot: thuMuc, thoi_vai: true };
    ghiThucLuc(thuMuc, phien, { nowMs });
  }
  const vaiDoi = nhe ? false : nhanVaiGiamSat(thuMuc, { phien, worktree: cwd, nowMs }).doi;
  // DP4 (§4.2 bước 1, 6): rời hai pha ★ khi có lần đọc mức dùng của chính phiên này và tài khoản chưa vượt ngưỡng báo trước.
  const roi = nhe ? {} : roiBanGiao(thuMuc, { phien, nowMs });
  const pha = docPha(thuMuc).pha;
  const phatLich = pha === 'nhap' || !chay ? 'khong-chay' : chay(cwd);
  const { pha: _p, ...thongTinRoi } = roi;
  return { dot: thuMuc, thoi_vai: false, vai_doi: vaiDoi, pha, phat_lich: phatLich, ...thongTinRoi, ke_hoach: keHoachDay(thuMuc, { nowMs }) };
}
