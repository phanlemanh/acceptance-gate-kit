'use strict';
// scripts/han-quet.cjs — hạn và lý do của lượt gọi bộ quét trạng thái (start-scan.mjs) từ thẻ cổng
// (hồ sơ quet-het-han-khong-moi-ky, issue #463). Ba hàm thuần, không đọc gì ngoài cây `_acceptance/`.
//
// Vì sao tách khỏi gate-card.js: gate-card là script chạy ngay khi nạp, không có hàm nào ca đo gọi được; lý do
// «exit null» (ca crm 7/7) sinh ra đúng ở chỗ một hình dạng kết quả tiến trình con không ai liệt — hàm thuần dưới
// đây liệt đủ và ca QH-3 đo từng hình dạng.
const fs = require('fs');
const path = require('path');

// Sàn 20 giây = hạn cũ, nên kho dưới 134 hồ sơ giữ nguyên hành vi. crm 380 hồ sơ quét 19–22 giây (~55 ms/hồ sơ);
// 150 ms/hồ sơ cho biên ~2,7 lần.
const HAN_SAN_MS = 20000;
const HAN_MOI_HO_SO_MS = 150;
const BIEN_HAN = 'ACCEPTANCE_SCAN_TIMEOUT_MS';
// Lệnh chạy lại in trên thẻ phải chạy xong thật, kể cả khi hạn vừa dùng bị ép rất nhỏ.
const HAN_CHAY_LAI_TOI_THIEU_MS = 120000;

function soHoSo(root) {
  try { return fs.readdirSync(path.join(root, '_acceptance'), { withFileTypes: true }).filter(d => d.isDirectory()).length; }
  catch (_) { return 0; }
}

// Biến môi trường là số nguyên dương thì thắng; giá trị hỏng (0, âm, chữ, rỗng) bị bỏ qua.
function hanQuet(root, env = process.env) {
  const v = env[BIEN_HAN];
  if (typeof v === 'string' && /^\d+$/.test(v.trim()) && Number(v) > 0) return Number(v);
  return Math.max(HAN_SAN_MS, HAN_MOI_HO_SO_MS * soHoSo(root));
}

const giay = ms => String(ms / 1000).replace('.', ',');
const hetHan = r => !!(r && r.error && r.error.code === 'ETIMEDOUT');

// Kết quả spawnSync hỏng → một câu cho người đọc thẻ. Không hình dạng nào được rơi về `exit ${r.status}`:
// hết hạn và bị ngắt đều có status null.
function lyDoQuet(r, han) {
  if (hetHan(r)) return `bộ quét hết hạn sau ${giay(han)} giây`;
  if (r.error) return `không chạy được bộ quét: ${r.error.message}`;
  if (r.status === null) {
    if (r.signal) return `bộ quét bị ngắt (${r.signal})`;
    return 'bộ quét dừng mà không có mã thoát';
  }
  return (r.stderr || '').trim().slice(0, 200) || `bộ quét thoát mã ${r.status}`;
}

const q = s => `'${String(s).replace(/'/g, `'\\''`)}'`;
function lenhChayLai({ card, root, slug, han }) {
  return `${BIEN_HAN}=${Math.max(2 * han, HAN_CHAY_LAI_TOI_THIEU_MS)} node ${q(card)} --root ${q(path.resolve(root))} --slug ${q(slug)}`;
}

module.exports = { hanQuet, lyDoQuet, hetHan, lenhChayLai, soHoSo, HAN_SAN_MS, HAN_MOI_HO_SO_MS, BIEN_HAN };
