// lo-trinh-khoa.cjs — MỘT hàm đọc khoá ổ cắm lộ trình (`lo_trinh.tep`) cho mọi bên đọc: bộ vẽ bản
// đồ, bộ quét thẻ start, và chính scripts/lo-trinh.mjs. Tách riêng để bộ vẽ và bộ quét biết «ổ cắm
// vắng» mà KHÔNG nạp mô-đun lộ trình (hồ sơ viec-ke-theo-plan AC-1: kho không khai thì mã lộ trình
// không chạy, và kho tiêu thụ chép thiếu tệp vẫn sống). Đọc bằng bộ đọc config dùng chung.
const path = require('node:path');
const { resolveConfigKey } = require(path.join(__dirname, '..', 'lib', 'evidence-core.cjs'));

const KHOA = 'lo_trinh.tep';
const NULLISH = new Set(['~', 'null', 'Null', 'NULL']);
function khoaTuConfig(cfgText) {
  const v = resolveConfigKey(String(cfgText || ''), KHOA);
  if (v == null) return null;
  const s = String(v).trim().replace(/^["']|["']$/g, '').trim();
  return s && !NULLISH.has(s) ? s : null;
}
module.exports = { KHOA, khoaTuConfig };
