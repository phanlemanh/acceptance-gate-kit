// anh-ho-so.cjs — LUẬT DUY NHẤT trả lời «giá trị `screenshot:` này có phải một ảnh CÓ THẬT trong hồ sơ không».
//
// Vì sao một chỗ: thẻ Cổng Bằng chứng (gate-card.js) tính eval ui-check «đạt — xem frame ở trang bằng chứng», và trang
// bằng chứng (evidence-page.js) in ảnh. Trước hồ sơ anh-co-that-trong-ho-so thẻ chỉ kiểm chuỗi khác rỗng còn trang lọc
// hình dạng rồi in <img> dù tệp không có — hai bên đọc nói hai điều khác nhau về cùng một ảnh, và người ký ký trên lời
// «có ảnh» mà trang không hiện ảnh nào (một kho tiêu thụ 22/10: 2 hồ sơ đã ký, 26/293 đường ra ngoài hồ sơ). Ai thêm bên
// đọc ảnh thứ ba thì GỌI khungAnh, đừng chép luật.
//
// Ảnh được tính khi và chỉ khi: đường tương đối trong `evidence/` của CHÍNH hồ sơ (`evidence/<tên>`, `./evidence/<tên>`,
// hoặc `<tên>` trần — đường đọc-cũ của safeShot), không thư mục con, đuôi ảnh, tệp thường > 0 byte, và đường thật
// (sau liên kết mềm) vẫn nằm dưới `evidence/` của hồ sơ. Ảnh ở `.acceptance-runs/` hay worktree máy chấm KHÔNG được tính
// dù có thật trên máy này: trang đọc theo đường tương đối của hồ sơ, `.acceptance-runs/` nằm trong .gitignore.
'use strict';
const fs = require('fs');
const path = require('path');

// Chuỗi nguyên nhân — bảng luật trong design doc của hồ sơ chép đúng sáu chuỗi này (ca LNT7 so hai bên).
const LY_DO = {
  tuyetDoi: 'đường tuyệt đối',
  luotCham: 'thư mục lượt chấm (.acceptance-runs/)',
  ngoai: 'ngoài evidence/ của hồ sơ',
  duoi: 'không phải tệp ảnh',
  khongCo: 'tệp không có trong evidence/ của hồ sơ',
  rong: 'tệp rỗng',
};
const DUOI_ANH = /\.(png|jpe?g|gif|webp)$/i;

// Bỏ chú thích cuối dòng (` # …`) và nháy bao — khuôn UI-CHECK-BLOCK-TEMPLATE có một chú thích như vậy.
function giaTriSach(v) {
  let s = String(v == null ? '' : v).trim();
  const q = s[0];
  if (q === '"' || q === "'") { const end = s.indexOf(q, 1); return (end > 0 ? s.slice(1, end) : s.slice(1)).trim(); }
  return s.replace(/\s+#.*$/, '').trim();
}

// Tuyệt đối xét bằng MẪU, không bằng path.isAbsolute của máy đang chạy (C:\… trên macOS không «tuyệt đối»).
const laTuyetDoi = s => /^(\/|~|[A-Za-z]:[\\/]|\\\\)/.test(s);

// Một giá trị → { ok: true, rel } | { ok: false, gia_tri, ly_do }. dir = thư mục hồ sơ (_acceptance/<slug>).
function xetAnh(dir, giaTri) {
  const g = giaTriSach(giaTri);
  const thieu = ly_do => ({ ok: false, gia_tri: g, ly_do });
  if (laTuyetDoi(g)) return thieu(LY_DO.tuyetDoi);
  if (/^(\.\/)?\.acceptance-runs[\\/]/.test(g)) return thieu(LY_DO.luotCham);
  const ten = g.replace(/^\.\//, '').replace(/^evidence\//, '');
  if (!ten || /[\\/:]/.test(ten) || ten.split('.').every(p => p === '') || ten === '..') return thieu(LY_DO.ngoai);
  if (!DUOI_ANH.test(ten)) return thieu(LY_DO.duoi);
  const evDir = path.join(dir, 'evidence');
  const p = path.join(evDir, ten);
  let st;
  try { st = fs.statSync(p); } catch (_) { return thieu(LY_DO.khongCo); }
  if (!st.isFile()) return thieu(LY_DO.khongCo);
  try {
    const that = fs.realpathSync(p), goc = fs.realpathSync(evDir);
    if (!that.startsWith(goc + path.sep)) return thieu(LY_DO.ngoai);
  } catch (_) { return thieu(LY_DO.khongCo); }
  if (st.size === 0) return thieu(LY_DO.rong);
  return { ok: true, rel: 'evidence/' + ten };
}

// Khung ảnh của một eval: ảnh khai ở `screenshot:` (nếu đạt) + mọi evidence/<id>[-_.]*.<đuôi ảnh> có thật, sắp theo tên
// → { frames: [rel…], thieu: [{gia_tri, ly_do}] }. Ảnh theo id cũng qua xetAnh — không tệp nào được tính mà không xét.
function khungAnh(dir, id, giaTri) {
  const frames = [], thieu = [];
  if (giaTriSach(giaTri)) {
    const r = xetAnh(dir, giaTri);
    if (r.ok) frames.push(r.rel); else thieu.push({ gia_tri: r.gia_tri, ly_do: r.ly_do });
  }
  let ds = [];
  try { ds = fs.readdirSync(path.join(dir, 'evidence')); } catch (_) {}
  const re = new RegExp('^' + String(id).replace(/[^\w]/g, '') + '[-_.].*' + DUOI_ANH.source, 'i');
  ds.filter(f => re.test(f)).sort().forEach(f => {
    const r = xetAnh(dir, f);
    if (r.ok && frames.indexOf(r.rel) < 0) frames.push(r.rel);
  });
  return { frames, thieu };
}

module.exports = { LY_DO, giaTriSach, xetAnh, khungAnh };
