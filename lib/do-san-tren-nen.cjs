// do-san-tren-nen.cjs — MỘT nguồn luật của nhãn trạng thái «đỏ sẵn trên nền» (hồ sơ ho-so-da-ky-giu-tuoi,
// hàng K-A). Bên viết nhãn (feature-loop/scripts/repin-lane.mjs) và bên đọc (checkRepinEvals trong
// evidence-core.cjs — lưới trước-gộp và recheck-evidence.cjs cùng gọi) dùng CHÍNH các hàm dưới; ai thêm bên
// đọc thứ ba thì gọi hàm này — hai bản luật là hai khuôn sẽ trôi.
//
// Nhãn KHÔNG phải ĐẠT: eval vẫn mang mã khác 0 trong dòng ghim; nhãn chỉ thôi chặn một vòng KHÁC khi cái đỏ ấy
// đã được ghi trên nhánh chính (dòng `kind: "nen-do"` do lệnh giữ tươi ghi) với ĐÚNG eval, ĐÚNG ca và thông
// điệp lỗi, ĐÚNG định nghĩa eval, và dòng nền là tổ tiên của cây đang xét. Thiếu bất kỳ vế nào → đỏ như cũ.
// Khoá `feature_loop.do_san_tren_nen` vắng/false → tắt: mọi bên đọc cư xử như trước vòng.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const KHOA = 'feature_loop.do_san_tren_nen';
const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');

// ── khoá ────────────────────────────────────────────────────────────────────────
// Nạp muộn: evidence-core.cjs nạp lib này, nên nạp ngược lúc gọi để khỏi vòng nạp lúc khởi động.
function khoaTuText(configText) {
  const core = require('./evidence-core.cjs');
  const v = configText == null ? null : core.resolveConfigKey(configText, KHOA);
  if (v == null) return false;
  const s = String(v).trim().toLowerCase();
  if (s === 'true') return true;
  if (s === 'false') return false;
  const e = new Error(`${KHOA}: "${v}" không hợp lệ — dùng true | false`);
  e.khoa = KHOA;
  throw e;
}
function docKhoaDoSan(root) {
  const p = path.join(root, '_acceptance', 'config.yaml');
  return khoaTuText(fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null);
}

// ── thông điệp đỏ ───────────────────────────────────────────────────────────────
// Chuẩn hoá: bỏ thứ đổi giữa hai lần chạy cùng một lỗi — dấu giờ, thời lượng, đường dẫn tuyệt đối, số
// dòng:cột, chuỗi hex dài (sha, id tạm), số cổng/pid. Thông điệp lỗi giữ nguyên chữ.
function chuanHoa(dong) {
  return String(dong)
    .replace(/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z?/g, '<gio>')
    .replace(/\[?\d+(\.\d+)?\s?(ms|s)\]?(?![a-z])/gi, '<tg>')
    .replace(/(^|[\s(=:'"])\/[^\s:'")]+/g, '$1<duong>')
    .replace(/:\d+(:\d+)?\b/g, ':<so>')
    .replace(/\b[0-9a-f]{7,}\b/gi, '<hex>')
    .replace(/\bpid\s*\d+/gi, 'pid <so>')
    .replace(/\s+/g, ' ')
    .trim();
}
const laDongCa = (dong, tenCa) => tenCa.some(t => dong.includes(t));
// Đoạn lỗi của một ca = các dòng nằm giữa dòng ca trước và dòng ca sau (tối đa 6 dòng mỗi phía), cộng chính
// dòng ca. Bộ chạy in lỗi TRƯỚC dòng «(fail)» (bun) hoặc SAU dòng «not ok» (node) — lấy cả hai phía.
function doanCa(dongs, i, moc) {
  const truoc = moc.filter(j => j < i).pop();
  const sau = moc.find(j => j > i);
  const tu = Math.max(truoc === undefined ? 0 : truoc + 1, i - 6);
  const den = Math.min(sau === undefined ? dongs.length - 1 : sau - 1, i + 6);
  return dongs.slice(tu, den + 1);
}
function catDongs(logText) { return String(logText || '').split('\n').map(s => s.replace(/\r$/, '')).filter(s => s.trim()); }
function cacMocCa(dongs, tenCa) {
  const moc = [];
  dongs.forEach((d, i) => { if (/\((pass|fail|skip)\)|^\s*(not )?ok \d+|✓|✗|PASS|FAIL/.test(d) || laDongCa(d, tenCa)) moc.push(i); });
  return moc;
}
function bamThongDiep(logText, tenCa) {
  const dongs = catDongs(logText);
  const ca = Array.isArray(tenCa) ? tenCa.filter(t => t && t !== 'không rút được tên ca') : [];
  if (!ca.length) return sha256(dongs.slice(-20).map(chuanHoa).join('\n'));
  const moc = cacMocCa(dongs, ca);
  const cap = [];
  for (const t of ca) {
    const i = dongs.findIndex(d => d.includes(t));
    const doan = i < 0 ? [] : doanCa(dongs, i, moc).filter(d => !laDongCa(d, ca));
    cap.push(`${t}\t${doan.map(chuanHoa).join(' | ')}`);
  }
  return sha256(cap.sort().join('\n'));
}
function trichThongDiep(logText, tenCa) {
  const dongs = catDongs(logText);
  const ca = Array.isArray(tenCa) ? tenCa.filter(t => t && t !== 'không rút được tên ca') : [];
  const lay = ca.length ? dongs.filter(d => laDongCa(d, ca)).slice(0, 2) : [];
  if (ca.length) {
    const i = dongs.findIndex(d => d.includes(ca[0]));
    const loi = i < 0 ? [] : doanCa(dongs, i, cacMocCa(dongs, ca)).filter(d => !laDongCa(d, ca));
    if (loi.length) lay.push(loi[0]);
  } else lay.push(...dongs.slice(-3));
  return lay.slice(0, 3).map(d => d.trim().slice(0, 200)).join('\n');
}

// ── định nghĩa eval ─────────────────────────────────────────────────────────────
// Băm khối `- id: <E>` của evals.yaml (tới khối eval kế, bỏ dòng chú thích và khoảng trắng cuối dòng).
function bamDinhNghia(evalsText, evalId) {
  const dongs = String(evalsText || '').split('\n');
  const dau = dongs.findIndex(d => new RegExp(`^(\\s*)- id:\\s*${evalId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`).test(d));
  if (dau < 0) return null;
  const thut = dongs[dau].match(/^(\s*)/)[1].length;
  const khoi = [dongs[dau]];
  for (let i = dau + 1; i < dongs.length; i++) {
    const d = dongs[i];
    if (d.trim() && d.match(/^(\s*)/)[1].length <= thut) break;
    khoi.push(d);
  }
  return sha256(khoi.filter(d => !/^\s*#/.test(d)).map(d => d.replace(/\s+$/, '')).filter(Boolean).join('\n'));
}

// ── dòng nền ────────────────────────────────────────────────────────────────────
function docDongNen(root, slug, ref) {
  const rel = `_acceptance/${slug}/run-log.jsonl`;
  let text = '';
  try {
    text = ref
      ? execFileSync('git', ['-C', root, 'show', `${ref}:${rel}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 256 * 1024 * 1024 })
      : fs.readFileSync(path.join(root, rel), 'utf8');
  } catch (_) { return []; }
  const ra = [];
  for (const l of text.split('\n')) {
    if (!l.trim()) continue;
    try { const e = JSON.parse(l); if (e && e.kind === 'nen-do' && Array.isArray(e.lenh_do)) ra.push(e); } catch (_) { /* dòng hỏng: bỏ qua */ }
  }
  return ra;
}
function laToTien(root, a, b) {
  try { execFileSync('git', ['-C', root, 'merge-base', '--is-ancestor', a, b], { stdio: 'ignore' }); return true; } catch (_) { return false; }
}

const CAU = {
  'khoa-tat': `khoá ${KHOA} tắt — nhãn không áp`,
  'khong-co-dong-nen': 'không có dòng nền đỏ nào ghi eval này (đúng lượt nền được trỏ) trên nhánh chính',
  'khac-ca-hoac-thong-diep': 'eval đỏ ở ca khác hoặc với thông điệp lỗi khác dòng nền — một cái đỏ mới',
  'doi-dinh-nghia': 'định nghĩa eval trong evals.yaml đã đổi so với lúc ghi dòng nền',
  'nen-khong-tren-nhanh-chinh': 'dòng nền đỏ không nằm trên lịch sử của cây đang xét',
};
const cauVeHong = (ve) => CAU[ve] || ve;

// Kiểm một eval đỏ có được nhãn không. Đọc dòng nền ở `baseRef` (bên viết: merge-base với nhánh chính) hay
// ở cây làm việc (bên đọc: baseRef null). `runId` có → khớp đúng lượt nền ấy (bên đọc trích từ `do_san`).
function kiemDoSan({ root, slug, evalId, bam, dinhNghia, headRef = 'HEAD', baseRef = null, runId = null, khoa }) {
  if (!khoa) return { dat: false, veHong: 'khoa-tat' };
  const dongs = docDongNen(root, slug, baseRef)
    .filter(e => (!runId || e.run_id === runId) && e.lenh_do.some(x => x && x.eval === evalId));
  if (!dongs.length) return { dat: false, veHong: 'khong-co-dong-nen' };
  const nen = dongs[dongs.length - 1];
  const muc = nen.lenh_do.filter(x => x && x.eval === evalId).pop();
  if (!bam || muc.thong_diep_bam !== bam) return { dat: false, veHong: 'khac-ca-hoac-thong-diep' };
  const dnNen = nen.dinh_nghia && nen.dinh_nghia[evalId];
  if (!dinhNghia || !dnNen || dnNen !== dinhNghia) return { dat: false, veHong: 'doi-dinh-nghia' };
  if (typeof nen.sha !== 'string' || !laToTien(root, nen.sha, headRef)) return { dat: false, veHong: 'nen-khong-tren-nhanh-chinh' };
  return { dat: true, veHong: null, runId: nen.run_id, pr: (nen.quy_ve || []).map(q => q && q.pr).filter(n => n != null) };
}

module.exports = { KHOA, khoaTuText, docKhoaDoSan, chuanHoa, bamThongDiep, trichThongDiep, bamDinhNghia, docDongNen, kiemDoSan, cauVeHong };
