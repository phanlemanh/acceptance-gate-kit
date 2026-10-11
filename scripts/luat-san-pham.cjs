#!/usr/bin/env node
'use strict';
// luat-san-pham.cjs — luật sản phẩm của kho tiêu thụ (hồ sơ bat-bien-san-pham, ADR 0023).
// Tệp luật ở gốc kho, tên cố định PRODUCT-INVARIANTS.md; tệp là CỦA KHO — mô-đun này chỉ ĐỌC.
// Khuôn tệp: khối marker PRODUCT-INVARIANTS-TEMPLATE trong skills/acceptance/references/product-invariants-template.md
// (bộ kiểm rút đúng khối đó để dựng tệp thử — đổi nhãn một phía là ca LS-01 đỏ).
// Người dùng: bộ xếp lớp căn cứ (can-cu-s1.cjs) · thẻ (gate-card.js) · vị từ còn-cần-người (khong-can-nguoi.mjs,
// start-scan.mjs) · bộ kiểm (tests/scripts/luat-san-pham.ca.mjs).
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const TEP_LUAT = 'PRODUCT-INVARIANTS.md';
const MA_RE = /^SP-\d+$/;
const TIEU_DE_RE = /^##\s+(SP-\d+)\s+·\s+(.+?)\s*$/;
const TRUONG_RE = /^-\s+(Mức|Chủ luật|Giữ bằng|Dấu hiệu|Phạm vi|Vì sao):\s*(.*)$/;
const MUC = { 'thường': 'thuong', 'khó đảo': 'kho-dao' };
const MUC_CHU = { thuong: 'thường', 'kho-dao': 'khó đảo' };

// Băm kiểu git blob — khớp `git hash-object`, tính được không cần git (thẻ không chạm git ở đây).
function banLuat(text) {
  const b = Buffer.from(String(text), 'utf8');
  return crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
}

function docLuat(text) {
  const t = String(text == null ? '' : text).replace(/^﻿/, '').replace(/\r\n?/g, '\n');
  const khoi = []; let cur = null;
  t.split('\n').forEach((l, i) => {
    const h = l.match(TIEU_DE_RE);
    if (h) { cur = { ma: h[1], cau: h[2], dong: i + 1, tr: {} }; khoi.push(cur); return; }
    if (/^#{1,2}\s/.test(l)) { cur = null; return; }
    const f = cur && l.match(TRUONG_RE);
    if (f && !(f[1] in cur.tr)) cur.tr[f[1]] = f[2].trim();
  });
  const luat = [], sai_khuon = [], daCo = new Set();
  for (const k of khoi) {
    const sai = ly_do => sai_khuon.push({ ma: k.ma, dong: k.dong, ly_do });
    if (daCo.has(k.ma)) { sai('mã trùng'); continue; }
    if (!k.tr['Chủ luật']) { sai('thiếu Chủ luật'); continue; }
    const muc = MUC[String(k.tr['Mức'] || '').toLowerCase()];
    if (!muc) { sai(`mức lạ: ${k.tr['Mức'] || '(trống)'}`); continue; }
    let re = null, nguon = null;
    if (k.tr['Dấu hiệu']) {
      nguon = k.tr['Dấu hiệu'].replace(/^`(.*)`$/, '$1');
      try { re = new RegExp(nguon); } catch (_) { sai('dấu hiệu không biên dịch được'); continue; }
      if (re.test('')) { sai('dấu hiệu khớp chuỗi rỗng'); continue; }
    }
    const pham_vi = String(k.tr['Phạm vi'] || '').split(',').map(s => s.trim().replace(/^`(.*)`$/, '$1')).filter(Boolean);
    daCo.add(k.ma);
    luat.push({ ma: k.ma, cau: k.cau, muc, chu: k.tr['Chủ luật'], giu: k.tr['Giữ bằng'] || '', dau_hieu: re, dau_hieu_nguon: nguon, pham_vi, vi_sao: k.tr['Vì sao'] || '' });
  }
  return { luat, sai_khuon };
}

// Đọc tệp luật ở cây làm việc (ref vắng) hoặc ở một ref git. Vắng tệp → co_tep:false.
function docTepLuat(root, ref) {
  let text = null;
  if (ref) {
    const r = spawnSync('git', ['-C', root, 'show', `${ref}:${TEP_LUAT}`], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
    text = r.status === 0 ? r.stdout : null;
  } else {
    try { text = fs.readFileSync(path.join(root, TEP_LUAT), 'utf8'); } catch (_) { text = null; }
  }
  if (text === null) return { co_tep: false, text: null, ban: null, luat: [], sai_khuon: [] };
  return Object.assign({ co_tep: true, text, ban: banLuat(text) }, docLuat(text));
}

// ── Bước thiết kế: dòng sổ S1 mang `can_cu.pham_luat` (phạm một luật đã khai) ──────────────────────────
// Ba luật đỏ, thông điệp ghim một nguồn ở đây; can-cu-s1.cjs gộp chúng vào bảng LY_DO của nó và gọi
// xetPhamLuat ngay sau kiểm nguồn lạ. Trả null khi dòng không phạm luật hoặc phạm hợp lệ (chỉ-người,
// đúng nhãn khó-đảo) — lúc đó bộ xếp lớp A2 xếp tiếp như mọi câu chỉ-người.
const LY_DO_LUAT = {
  'pham-luat-may-quyet': 'phạm luật sản phẩm là câu hỏi cho người',
  'luat-vang': 'mã luật không có trong tệp luật sản phẩm',
  'luat-kho-dao': 'luật khó đảo phải mang nhãn khó-đảo',
};
function xetPhamLuat(c, layTep) {
  if (!c || typeof c !== 'object' || typeof c.pham_luat !== 'string') return null;
  const l = (layTep().luat || []).find(x => x.ma === c.pham_luat);
  const them = { luat_ma: c.pham_luat };
  if (!l) return { lop: 'do', ma: 'luat-vang', them };
  if (c.nguon !== 'chi-nguoi') return { lop: 'do', ma: 'pham-luat-may-quyet', them };
  if (l.muc === 'kho-dao' && c.kho_dao !== true) return { lop: 'do', ma: 'luat-kho-dao', them };
  return null;
}
// Mã luật mà một câu trích thuộc về (câu trích nằm trong câu luật, so sau khi gom khoảng trắng). Không có → null.
const gomKt = s => String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
function maTheoTrich(luat, trich) {
  const t = gomKt(trich); if (!t) return null;
  const l = (luat || []).find(x => gomKt(x.cau).includes(t) || t.includes(gomKt(x.cau)));
  return l ? l.ma : null;
}

module.exports = { TEP_LUAT, MA_RE, MUC_CHU, LY_DO_LUAT, banLuat, docLuat, docTepLuat, xetPhamLuat, maTheoTrich };
