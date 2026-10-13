#!/usr/bin/env node
'use strict';
/* yaml-chuan.cjs — bộ dò `evals.yaml` KHÔNG phải YAML chuẩn (hồ sơ bo-doc-ho-so-khoan-dung, gốc crm-onehub#375).
 *
 * Kit đọc evals.yaml THEO DÒNG (lib/eval-yaml.cjs, lib/evidence-core.cjs evalListsOf) và cố ý không dùng thư viện
 * YAML — nên một tệp Bun.YAML/PyYAML từ chối vẫn được kit đọc tiếp mà không ai nói gì. Tệp này KHÔNG đổi cách kit
 * đọc: nó chỉ NÓI RA chỗ không chuẩn — cờ vàng trên thẻ hai cổng (scripts/gate-card.js) và một lệnh kiểm kho tự
 * bật trong CI. Không chặn gì mặc định, không đổi phán quyết nào.
 *
 * Sáu lớp rút từ đặc tả YAML 1.2, mỗi lớp có ca thật ở bảy kho đo 13/10/2026 (design §2). Đây là danh sách lớp
 * trên một không gian mở — giới hạn đã khai: lớp thứ bảy lọt im. Thước của nó là răng
 * `_acceptance/bo-doc-ho-so-khoan-dung/rang/bay-kho.mjs` (vi phân với PyYAML trên bảy kho, theo tệp VÀ dòng).
 *
 * Hàm thuần: không đọc đĩa, không ném. Lệnh (khi chạy trực tiếp):
 *   node scripts/yaml-chuan.cjs --root <kho> [--base <ref>]
 *   in mỗi chỗ một dòng `<slug>/evals.yaml:<dòng> — <chữ lớp>`; thoát 0 sạch · 1 có chỗ · 2 không chạy được.
 *   --base: chỉ xét hồ sơ có tệp đổi từ ĐIỂM RẼ (git merge-base <ref> HEAD) — hồ sơ cũ đã ký không chặn ai.
 */

// Mã lớp → chữ trên thẻ / dòng lệnh (tiếng sản phẩm). Thứ tự = thứ tự bảng design §4.
const LOP_YAML = {
  'chu-sau-nhay-dong': 'chữ đứng sau nháy đóng',
  'thoat-sai-nhay-kep': 'thoát sai trong nháy kép',
  'ngoac-trong-muc-tran': 'ngoặc trong mục không nháy của danh sách một dòng',
  'khoi-chu-thut-lui': 'dòng của khối chữ thụt lùi dưới dòng đầu',
  'hai-cham-trong-gia-tri-tran': '«: » trong giá trị không nháy',
  'dong-goc-khong-phai-khoa': 'dòng ở lề không phải khoá',
};

// Bộ thoát nháy kép của đặc tả YAML 1.2 (c-ns-esc-char), cộng `\` cuối dòng (nối dòng).
const THOAT_HOP_LE = /^(?:[0abt\tnvfre "/\\N_LP ]|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/;
const BLOCK_HDR = /^[|>](?:[1-9][+-]?|[+-][1-9]?)?\s*(?:#.*)?$/;
const KHOA = /^([^\s#'"\[\]{},&*!|>%@`-][^:#]*?|-[^\s:#][^:#]*?):(?:\s+|$)/;
const chiChuThich = s => /^\s*(?:#.*)?$/.test(s);

// Quét thân một vô hướng có nháy từ s[tu] (đã ở TRONG nháy). Trả { dong: chỉ số sau nháy đóng | -1, thoatSai }.
function quetTu(s, tu, nhay) {
  let thoatSai = false;
  for (let j = tu; j < s.length; j++) {
    const c = s[j];
    if (nhay === '"' && c === '\\') {
      if (j + 1 >= s.length) return { dong: -1, thoatSai }; // `\` cuối dòng: nối dòng
      if (!THOAT_HOP_LE.test(s.slice(j + 1))) thoatSai = true;
      j += 1; continue;
    }
    if (c === nhay) {
      if (nhay === "'" && s[j + 1] === "'") { j += 1; continue; }
      return { dong: j + 1, thoatSai };
    }
  }
  return { dong: -1, thoatSai };
}
// Vô hướng có nháy mở ở s[i].
const quetNhay = (s, i, nhay) => quetTu(s, i + 1, nhay);

function yamlKhongChuan(text) {
  const out = [];
  const ghi = (dong, loai) => out.push({ dong, loai, mo_ta: LOP_YAML[loai] });
  let lines;
  try { lines = String(text == null ? '' : text).replace(/\r\n?/g, '\n').split('\n'); } catch (_) { return out; }
  let blk = null;     // khối chữ đang mở: { cotKhoa, cotNoiDung|null }
  let nhay = null;    // vô hướng có nháy nhiều dòng đang mở: { kieu, thoatSaiDaGhi }
  let tran = null;    // vô hướng trần có thể nối dòng: { cot }
  let gocSai = false; // đã ghi dong-goc, chờ một khoá gốc hợp lệ
  for (let k = 0; k < lines.length; k++) {
    const dong = k + 1;
    const raw = lines[k];
    if (nhay) {
      const r = quetTu(raw, 0, nhay.kieu);
      if (r.thoatSai && !nhay.thoatSaiDaGhi) { ghi(dong, 'thoat-sai-nhay-kep'); nhay.thoatSaiDaGhi = true; }
      if (r.dong < 0) continue;
      const sau = raw.slice(r.dong);
      nhay = null;
      if (!chiChuThich(sau) && !/^\s*:(?:\s|$)/.test(sau)) ghi(dong, 'chu-sau-nhay-dong');
      continue;
    }
    if (!raw.trim()) continue;
    const cot = raw.search(/\S/);
    if (blk) {
      if (blk.cotNoiDung == null) {
        if (cot > blk.cotKhoa) { blk.cotNoiDung = cot; continue; }
      } else {
        if (cot >= blk.cotNoiDung) continue;
        if (cot > blk.cotKhoa && !raw.trim().startsWith('#')) { ghi(dong, 'khoi-chu-thut-lui'); continue; }
      }
      blk = null;
    }
    if (raw.trim().startsWith('#')) { tran = null; continue; }
    if (tran) {
      if (cot > tran.cot) { // dòng nối của vô hướng trần
        const t = boChuThich(raw.trim());
        if (/:\s|:$/.test(t)) ghi(dong, 'hai-cham-trong-gia-tri-tran');
        continue;
      }
      tran = null;
    }
    if (cot === 0) {
      const t = raw.trim();
      const hopLe = /^(?:---|\.\.\.)(?:\s|$)/.test(t) || /^-(?:\s|$)/.test(t) || KHOA.test(t) || /^["'][^]*?["']\s*:(?:\s|$)/.test(t) || /^%/.test(t);
      if (!hopLe) { if (!gocSai) ghi(dong, 'dong-goc-khong-phai-khoa'); gocSai = true; continue; }
      gocSai = false;
    }
    // Bóc các gạch đầu dòng `- ` (kể cả `- - `); cột của nội dung sau gạch.
    let i = cot;
    while (raw[i] === '-' && (raw[i + 1] === ' ' || raw[i + 1] === undefined)) { i += 1; while (raw[i] === ' ') i += 1; }
    const coGach = i > cot;
    const phan = raw.slice(i);
    if (!phan.trim()) continue;
    const km = phan.match(KHOA);
    let cotGoc, v, viTri;
    if (km) { cotGoc = i; viTri = i + km[0].length; v = raw.slice(viTri); }
    else if (coGach) { cotGoc = cot; viTri = i; v = phan; }
    else {
      // Không khoá, không gạch, ở trong một ánh xạ: khoá có nháy (`"k": v`) hoặc dòng lạ — để đường nháy xử.
      cotGoc = cot; viTri = i; v = phan;
      if (!/^["']/.test(v)) continue;
    }
    xetGiaTri(v, viTri);

    function xetGiaTri(val, at) {
      let s = val.replace(/^\s+/, '');
      const lech = val.length - s.length;
      // neo / thẻ đứng trước giá trị
      for (;;) {
        const m = s.match(/^([&!][^\s]*)\s*/);
        if (!m || !m[1]) break;
        s = s.slice(m[0].length);
      }
      if (!s || s.startsWith('#')) return;
      if (s[0] === '*') return;
      if (s[0] === '|' || s[0] === '>') {
        if (BLOCK_HDR.test(s)) {
          const d = s.match(/^[|>][+-]?([1-9])?/);
          blk = { cotKhoa: cotGoc, cotNoiDung: d && d[1] ? cotGoc + Number(d[1]) : null };
        }
        return;
      }
      if (s[0] === '"' || s[0] === "'") {
        const r = quetNhay(s, 0, s[0]);
        if (r.thoatSai) ghi(dong, 'thoat-sai-nhay-kep');
        if (r.dong < 0) { nhay = { kieu: s[0], thoatSaiDaGhi: r.thoatSai }; return; }
        const sau = s.slice(r.dong);
        if (/^\s*:(?:\s|$)/.test(sau)) { xetGiaTri(sau.replace(/^\s*:/, ''), at + lech + r.dong + 1); return; }
        if (!chiChuThich(sau)) ghi(dong, 'chu-sau-nhay-dong');
        return;
      }
      if (s[0] === '[') { xetLuong(s); return; }
      if (s[0] === '{') return;
      const t = boChuThich(s);
      if (/:\s|:$/.test(t)) ghi(dong, 'hai-cham-trong-gia-tri-tran');
      tran = { cot: cotGoc };
    }

    // Danh sách luồng một dòng: mục trần không được chứa `[ ] { }` (ns-plain-safe(c) của ngữ cảnh luồng).
    function xetLuong(s) {
      let j = 1; let muc = '';
      while (j < s.length) {
        const c = s[j];
        if (c === '"' || c === "'") {
          if (muc.trim()) { muc += c; j += 1; continue; }
          const r = quetNhay(s, j, c);
          if (r.thoatSai) ghi(dong, 'thoat-sai-nhay-kep');
          if (r.dong < 0) return;
          j = r.dong; muc = 'x';
          continue;
        }
        if (c === ',') { muc = ''; j += 1; continue; }
        if (c === ']') return;
        if ((c === '[' || c === '{' || c === '}') && muc.trim()) { ghi(dong, 'ngoac-trong-muc-tran'); return; }
        if (c === '[' || c === '{') return; // lồng — ngoài sáu lớp, để yên
        if (c === '#' && /\s/.test(s[j - 1] || '')) return;
        muc += c; j += 1;
      }
    }
  }
  return out;
}

// Cắt chú thích của một vô hướng trần: `#` mở chú thích khi có khoảng trắng đứng trước.
function boChuThich(s) { return String(s).replace(/(^|\s)#.*$/, '').trim(); }

module.exports = { yamlKhongChuan, LOP_YAML };

// ── Lệnh kiểm kho ─────────────────────────────────────────────────────────────────────────────────────────────
if (require.main === module) {
  const fs = require('fs');
  const path = require('path');
  const { execFileSync } = require('child_process');
  const a = process.argv.slice(2);
  const thoat2 = m => { process.stderr.write(`yaml-chuan: ${m}\n`); process.exit(2); };
  let root = null; let base = null;
  for (let i = 0; i < a.length; i++) {
    if (a[i] === '--root') root = a[++i];
    else if (a[i] === '--base') base = a[++i];
    else thoat2(`tham số lạ ${a[i]} — chỉ nhận --root <kho> [--base <ref>]`);
  }
  if (!root) thoat2('thiếu --root <kho>');
  root = path.resolve(root);
  const git = (...x) => execFileSync('git', ['-C', root, ...x], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  try { if (git('rev-parse', '--is-inside-work-tree').trim() !== 'true') throw new Error(); } catch (_) { thoat2(`không phải kho git: ${root}`); }
  let chiXet = null;
  if (base != null) {
    let mb;
    try { mb = git('merge-base', base, 'HEAD').trim(); } catch (_) { thoat2(`không có ref «${base}» (hoặc không có điểm rẽ chung với HEAD)`); }
    const doi = new Set();
    const them = s => s.split('\n').forEach(f => { const m = f.match(/^_acceptance\/([^/]+)\//); if (m) doi.add(m[1]); });
    them(git('diff', '--name-only', mb));
    them(git('ls-files', '--others', '--exclude-standard', '--', '_acceptance'));
    chiXet = doi;
  }
  const acc = path.join(root, '_acceptance');
  const slugs = fs.existsSync(acc) ? fs.readdirSync(acc, { withFileTypes: true }).filter(e => e.isDirectory()).map(e => e.name).sort() : [];
  let co = 0;
  for (const s of slugs) {
    if (chiXet && !chiXet.has(s)) continue;
    const p = path.join(acc, s, 'evals.yaml');
    if (!fs.existsSync(p)) continue;
    for (const m of yamlKhongChuan(fs.readFileSync(p, 'utf8'))) { co += 1; process.stdout.write(`${s}/evals.yaml:${m.dong} — ${m.mo_ta}\n`); }
  }
  process.exit(co ? 1 : 0);
}
