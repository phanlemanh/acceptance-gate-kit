// Khoá S4 CẤP MÁY (spec workflow §16 T6): nhiều kho trên một máy (mỗi kho tiêu thụ, cả lượt chấm của
// kit) mỗi kho một khoá s4 thì hai lượt chấm có thể chồng nhau. Khoá máy nằm cạnh khoá của kho; bộ phát lịch của
// đợt mở từ gói xét cả hai trước khi cấp s4. Đợt dựng tay và đợt cũ không chạm khoá máy (design DP2 §3).
// Giữ khoá = mkdir nguyên tử, nên hai kho xin cùng nhịp thì chỉ một bên thắng.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { docJson, ghiJsonNguyenTu, TEN_LIEN_KET } from './dot.mjs';

const KHOA_TRONG_MS = 60_000;

export const thuMucMay = () => process.env.DIEU_PHOI_MAY_DIR || path.join(os.homedir(), '.claude', 'dieu-phoi', 'may');
const dirS4 = () => path.join(thuMucMay(), 's4');
export const docChuMay = () => docJson(path.join(dirS4(), 'chu.json'), null);

const thuc = (p) => {
  try {
    return fs.realpathSync(p);
  } catch {
    return null;
  }
};

export function giuMay(thuMuc, { kho, phien }) {
  const dot = thuc(thuMuc) ?? thuMuc;
  fs.mkdirSync(thuMucMay(), { recursive: true });
  try {
    fs.mkdirSync(dirS4());
  } catch (e) {
    if (e.code !== 'EEXIST') throw e;
    const chu = docChuMay();
    return { duoc: chu?.dot === dot, chu };
  }
  ghiJsonNguyenTu(path.join(dirS4(), 'chu.json'), { kho, dot, phien, cap_luc: new Date().toISOString() });
  return { duoc: true, chu: docChuMay() };
}

// Chỉ chủ mới gỡ được.
export function nhaMay(thuMuc) {
  const chu = docChuMay();
  if (chu && chu.dot === (thuc(thuMuc) ?? thuMuc)) {
    fs.rmSync(dirS4(), { recursive: true, force: true });
    return true;
  }
  return false;
}

// Khoá của một đợt không còn chạy: thư mục đợt vắng, hoặc symlink đợt hiện tại của kho ấy không còn trỏ
// đợt đó (đợt đã đóng mà bộ phát lịch dừng trước khi gỡ). Thư mục khoá rỗng quá 60″ (một bên chết giữa
// mkdir và ghi chủ) cũng thu hồi. Trả chủ cũ, hoặc null khi không thu gì.
export function thuHoiMayChet(nowMs = Date.now()) {
  if (!fs.existsSync(dirS4())) return null;
  const chu = docChuMay();
  if (!chu) {
    if (nowMs - fs.statSync(dirS4()).mtimeMs > KHOA_TRONG_MS) {
      fs.rmSync(dirS4(), { recursive: true, force: true });
      return { kho: null, dot: null, ly_do: 'thư mục khoá máy rỗng quá 60″' };
    }
    return null;
  }
  const conDot = fs.existsSync(chu.dot);
  const dangTro = thuc(path.join(chu.kho ?? '', '.acceptance-runs', TEN_LIEN_KET));
  if (conDot && dangTro === chu.dot) return null;
  fs.rmSync(dirS4(), { recursive: true, force: true });
  return { ...chu, ly_do: conDot ? 'đợt giữ khoá máy đã đóng' : 'thư mục đợt giữ khoá máy đã vắng' };
}
