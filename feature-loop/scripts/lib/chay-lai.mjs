// chay-lai.mjs — quyết có chạy lại một lệnh đỏ của làn ghim lại không (hồ sơ gia-lan-ghim-lai, AC-1),
// và rút tên ca từ nhật ký lần đỏ. Hàm thuần — bảng chân trị viết trước ở dưới là thứ ca AC1 lặp qua.
//
// Chạy lại ở mức LỆNH, không mức ca: chọn một ca là cú pháp riêng của từng bộ chạy test, còn kit là
// bộ máy cho mọi kho. Không chạy lại eval gọi model thật: với một eval chấm theo ngưỡng trên model
// ngẫu nhiên, chạy lại là chọn lượt rút tốt hơn trong hai — bằng chứng tự dối.
export const TRAN_LAN_DAU_MS = 30 * 60 * 1000;

export function coChayLai({ khoa, lech, laModel, msLanDau, conLaiMs }) {
  if (!lech) return { chay: false, ly_do: 'không lệch kỳ vọng' };
  if (!khoa) return { chay: false, ly_do: 'khoá repin_retry vắng hoặc 0' };
  if (laModel) return { chay: false, ly_do: 'eval model thật — chạy lại là chọn lượt rút tốt hơn' };
  if (msLanDau > TRAN_LAN_DAU_MS) return { chay: false, ly_do: 'lần đầu dài hơn 30 phút' };
  if (conLaiMs != null && conLaiMs < msLanDau) return { chay: false, ly_do: 'trần còn lại ít hơn thời lượng lần đầu' };
  return { chay: true, ly_do: 'chạy lại một lần, một mình' };
}

export const BANG_CHAN_TRI = [
  { vao: { khoa: 0, lech: true, laModel: false, msLanDau: 1000, conLaiMs: null }, ra: false },
  { vao: { khoa: 1, lech: true, laModel: true, msLanDau: 1000, conLaiMs: null }, ra: false },
  { vao: { khoa: 1, lech: true, laModel: false, msLanDau: TRAN_LAN_DAU_MS + 1, conLaiMs: null }, ra: false },
  { vao: { khoa: 1, lech: true, laModel: false, msLanDau: 5000, conLaiMs: 4000 }, ra: false },
  { vao: { khoa: 1, lech: false, laModel: false, msLanDau: 1000, conLaiMs: null }, ra: false },
  { vao: { khoa: 1, lech: true, laModel: false, msLanDau: 5000, conLaiMs: 60000 }, ra: true },
  { vao: { khoa: 1, lech: true, laModel: false, msLanDau: 5000, conLaiMs: null }, ra: true },
];

export const KHUON_TEN_CA = [
  { ten: 'bun', re: /^\s*\(fail\)\s+(.+?)(?:\s+\[[\d.]+m?s\])?\s*$/ },
  { ten: 'playwright', re: /^\s*✘\s+\d+\s+(.+?)(?:\s+\(\d+(?:\.\d+)?m?s\))?\s*$/ },
  { ten: 'vitest-jest', re: /^\s*[✗×]\s+(.+?)\s*$/ },
  { ten: 'node-test', re: /^\s*not ok\s+\d+\s+-\s+(.+?)\s*$/ },
];

export function rutTenCa(text) {
  const ra = [];
  for (const l of String(text || '').split('\n')) {
    for (const k of KHUON_TEN_CA) { const m = l.match(k.re); if (m) { ra.push(m[1].trim()); break; } }
    if (ra.length >= 10) break;
  }
  return ra.length ? ra : ['không rút được tên ca'];
}
