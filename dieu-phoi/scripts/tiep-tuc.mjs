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
import { docDau } from './dau.mjs';
import { hangKeTuTiep } from './lich.mjs';
import { bayGio, conSong, coThuMucSong, laMaPhien, nhipCuaPhien, nhipMoiNhatCua } from './song.mjs';
import { loiGiaoViec, suyLoiGiaoDot } from './tin-giao.mjs';
import { docVai, ghiHookThieu, ghiThucLuc, laGiamSat, nhanVaiGiamSat } from './vai.mjs';

// Bảy hành động của một dãy — MỘT nguồn cho chẩn đoán, tiep-tuc và thân lệnh người.
export const HANH_DONG = {
  khong: 'khong',
  nhanGiangLai: 'nhan-giang-lai',
  moChip: 'mo-chip',
  worktreeMat: 'worktree-mat',
  choNguoi: 'cho-nguoi',
  chuaBiet: 'chua-biet',
  khongHang: 'khong-hang',
};

export const VIEC_HANH_DONG = {
  khong: 'dãy có phiên sống hoặc đang giữ khoá — không làm gì',
  'nhan-giang-lai': 'dãy có phiên sống nhưng còn đơn, khoá hay yêu cầu chờ — nhắn dãy «tiếp tục: giăng lại lệnh chờ»',
  'mo-chip': 'dãy không còn phiên sống — mở chip với lời ghi danh, rồi chờ người bấm chip (chẩn đoán không mời mở lại)',
  'worktree-mat': 'worktree của dãy không còn — người quyết dựng lại hay cho dãy nghỉ',
  'cho-nguoi': 'phiên của dãy đang đứng chờ người — không mở chip, đưa vào việc chờ anh',
  'chua-biet': 'đợt chưa có nhịp sống (hook bản cũ, hoặc phiên chưa nạp lại gói) — kiểm thanh bên trước khi mở chip',
  'khong-hang': 'dãy không có hàng để giao lúc này (nghỉ · hết hàng · chờ phụ thuộc hay Cổng Đáng) — không mở chip',
};

// Trạng thái chẩn đoán của mục `day:<id>` theo hành động — MỘT nguồn cho `chan-doan` (hồ sơ
// dieu-phoi-sua-truoc-dot-thu, D4). `thieu` = phiên còn việc phải làm. `mo-chip` là `du`: việc của phiên (mở chip)
// làm MỘT lần ở bước 6 của mo-dot hay bước 4 của tiep-tuc, sau đó chỉ còn người bấm — xếp `thieu` thì vòng kiểm
// cuối mở chip lần hai. `nhan-giang-lai` giữ `thieu`: dạng `--nhe` nhắn lại dãy ở bước 5 qua đúng mục này.
export const TRANG_THAI_HANH_DONG = {
  khong: 'du',
  'mo-chip': 'du',
  'khong-hang': 'du',
  'nhan-giang-lai': 'thieu',
  'worktree-mat': 'thieu',
  'cho-nguoi': 'thieu',
  'chua-biet': 'thieu',
};

// Dấu «dãy chưa ghi danh» (DP8): bên viết là `ghiDauChoGhiDanh`/`ghiDanhWorktree` của hang.mjs.
export const THU_MUC_CHO_GHI_DANH = 'cho-ghi-danh';

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

// Hành động của MỘT dãy. Thứ tự xét: worktree mất → giữ khoá → chờ người → nhịp sống → không có hàng → đợt chưa
// có nhịp → chip. Hàng kế đọc bằng `hangKeTuTiep` (lich.mjs): dãy nghỉ, hết hàng hay đang chờ không được mời chip.
// DP4 (design chỗ chọn 12): `bgGan` = bàn giao gần nhất; nhịp của các phiên đã bàn giao dãy không tính là phiên sống.
function xetDay(thuMuc, d, { hangViec, coSong, khoaGiu, nowMs, bgGan = null }) {
  const mucBg = bgGan?.day?.find((m) => m.id === d.id) ?? null;
  // Phiên đã bàn giao dãy: phiên báo xong, và phiên chết vì hạn mức (dấu đã lưu hay đang mở). Chỉ bỏ nhịp ghi tới lúc
  // tiếp tục — nhịp ghi sau đó là phiên sống lại thật (review I1).
  const phienCu = new Set([
    ...(mucBg?.ban_giao === 'xong' ? mucBg.phien_cu ?? [] : []),
    ...[...(bgGan?.dau ?? []), ...docDau(thuMuc)].filter((x) => x?.day === d.id && x.phien).map((x) => x.phien),
  ]);
  const moc = bgGan?.tiep_tuc_luc ? Date.parse(bgGan.tiep_tuc_luc) : null;
  const nhip = nhipMoiNhatCua(thuMuc, d.worktree, { boQua: phienCu, denLuc: moc });
  const nen = { day: d.id, worktree: d.worktree, song: conSong(nhip, nowMs) ? nhip.phien : null };
  const giuKhoa = khoaGiu.has(d.id);
  const conCho = coTep(thuMuc, 'xin', `${d.id}-`).length > 0
    || coTep(thuMuc, 'yeu-cau', `${d.id}-`).some((f) => !fs.existsSync(path.join(thuMuc, 'tra-loi', f)));
  // DP8 (design chỗ chọn 2c): worktree không phải thư mục mà dãy mang dấu chưa ghi danh (chỗ giữ của gói) → đi tiếp như
  // dãy không phiên sống; không dấu (đã ghi danh rồi mất, hay đợt mở bằng bản gói cũ) → worktree-mat như cũ.
  const chuaGhiDanh = !laThuMuc(d.worktree) && fs.existsSync(path.join(thuMuc, THU_MUC_CHO_GHI_DANH, `${d.id}.json`));
  if (!laThuMuc(d.worktree) && !chuaGhiDanh) return { ...nen, hanh_dong: HANH_DONG.worktreeMat };
  if (giuKhoa) return { ...nen, hanh_dong: conCho ? HANH_DONG.nhanGiangLai : HANH_DONG.khong };
  if (fs.existsSync(path.join(thuMuc, 'cho-nguoi', `${d.id}.json`))) return { ...nen, hanh_dong: HANH_DONG.choNguoi };
  if (nen.song) return { ...nen, hanh_dong: conCho ? HANH_DONG.nhanGiangLai : HANH_DONG.khong };
  const ke = hangKeTuTiep(docJson(path.join(thuMuc, 'tiep', `${d.id}.json`), null), hangViec, d.id);
  if (!ke.hang) return { ...nen, hanh_dong: HANH_DONG.khongHang, ly_do: ke.ly_do };
  if (!coSong) return { ...nen, hanh_dong: HANH_DONG.chuaBiet };
  // Lời ghi danh dựng từ MỘT hàm mục dãy (git + thư mục đợt, dùng chung với ban-giao.json), cộng lớp phủ bàn giao.
  const m = mucDay(thuMuc, d, { hangViec, maBanGiao: bgGan?.ma ?? null });
  const slug = m.slug;
  // Lời giao sáu trường (hồ sơ vong-mo-co-chu-giu, AC-9): MỘT hàm với `tin GIAO`; thiếu Kết quả thì không mở chip.
  const lg = suyLoiGiaoDot(thuMuc, hangViec, d.id, { hang: slug, tronHang: true });
  if (lg.loi) return { ...nen, hanh_dong: HANH_DONG.khongHang, ly_do: `lời giao thiếu Kết quả — ${lg.loi}` };
  const phu = mucBg ? ` · bàn giao ${bgGan.ma}: ${mucBg.ban_giao}${mucBg.co_wip ? ' (có commit WIP)' : ''}` : '';
  return {
    ...nen,
    hanh_dong: HANH_DONG.moChip,
    da_ban_giao: phienCu.size > 0,
    muc: m,
    // DP8 (chỗ chọn 2d): chip luôn dựng worktree MỚI, nên mọi lời ghi danh mang lệnh `ghi-danh` của lõi đợt.
    ghi_danh: `thư mục đợt ${thuMuc} · dãy ${d.id} · việc đầu tiên, từ worktree của chip: node ${path.join(thuMuc, 'loi', 'dieu-phoi.mjs')} ghi-danh ${d.id} · ${chuaGhiDanh ? 'worktree chưa ghi danh' : `worktree ${d.worktree} · nhánh ${m.nhanh ?? '?'} @ ${(m.dinh ?? '').slice(0, 7)}`}${slug ? ` · hồ sơ ${slug} (${m.trang_thai_ho_so ?? 'chưa có'})` : ''}${phu} · đọc LUAT.md trước S1 · ${slug ? `/feature-loop:feature-loop ${slug}` : 'dãy chưa có hàng kế — hỏi giám sát'}\n${loiGiaoViec(lg.truong)}`,
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
  const hook = xetHookPhien(thuMuc, phien, { nowMs });
  return { dot: thuMuc, thoi_vai: false, vai_doi: vaiDoi, pha, phat_lich: phatLich, ...thongTinRoi, ...hook, ke_hoach: keHoachDay(thuMuc, { nowMs }) };
}

// Hook của gói có nạp trong phiên giám sát không (TC1). Lệnh chạy trong Bash của chính phiên nên `CLAUDE_CODE_SESSION_ID`
// là mã CLI của nó; lời dặn đặt bước đọc hạn mức (một lời gọi công cụ) trước lệnh này, nên hook đã nạp thì tệp nhịp đã có.
// Ngoài app (biến vắng) không xét gì.
export const CAU_HOOK_THIEU = 'hook của gói chưa nạp trong phiên này — mở phiên giám sát mới rồi chạy /dieu-phoi:tiep-tuc';
function xetHookPhien(thuMuc, phien, { nowMs = null, phienCli = process.env.CLAUDE_CODE_SESSION_ID } = {}) {
  if (!laMaPhien(phienCli)) return {};
  const gs = docVai(thuMuc)?.giam_sat;
  if (gs?.phien !== phien) return {};
  if (nhipCuaPhien(thuMuc, { phien, phienCli })) {
    if (gs.hook_thieu_luc) ghiHookThieu(thuMuc, phien, null);
    return {};
  }
  if (!gs.hook_thieu_luc) ghiHookThieu(thuMuc, phien, new Date(bayGio(nowMs)).toISOString());
  return { hook_thieu: true, hook_thieu_cau: CAU_HOOK_THIEU };
}
