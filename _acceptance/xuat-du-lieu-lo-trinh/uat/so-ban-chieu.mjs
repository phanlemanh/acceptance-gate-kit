#!/usr/bin/env node
// Thước Cổng Giá trị của hồ sơ `xuat-du-lieu-lo-trinh` (X1): bản chiếu ngoài kho có hiện đúng trạng thái
// TỪNG hàng như `LO-TRINH.html` cùng lượt vẽ không?
//
//   node so-ban-chieu.mjs so   --trang <LO-TRINH.html> --man <man.json> [--ra <ket-qua.json>] [--mong-do <tep#ma>]
//   node so-ban-chieu.mjs tiem --trang <LO-TRINH.html> --ra <ban-sao.html> --khoa <tep#ma> --nhom <nhom> [--trang-thai <chu>]
//
// `so`: ba vế, không vế nào đọc vế kia —
//   (1) KHỐI: rút bằng `docDuLieu` của chính kit (`scripts/lo-trinh.mjs`, suy từ vị trí tệp này);
//   (2) TRANG KIT: bộ đọc HTML độc lập (chép từ ca LT-111 của kit) đọc phần người xem thấy — chữ trạng
//       thái, màu (lớp `tt giao`/`tt chua`), dấu «theo ghi chép», cờ lệch, thanh tiến độ của thẻ;
//   (3) TRANG CRM: `man.json` do `ban-chieu-crm.dom.tsx` ghi — trạng thái ĐÃ HIỆN trên trang Lộ trình.
// So (3) với (2) từng hàng × mỗi lộ trình; (1) với (2) làm đối chứng rằng khối đọc bằng kit khớp trang.
// `--mong-do <tep#ma>`: chiều đỏ — thoát 0 CHỈ KHI phép so đỏ, có dòng lệch nêu đúng hàng ấy và không
// dòng lệch hàng nào nêu hàng khác.
// `tiem`: chép trang, đổi trạng thái của MỘT hàng trong khối (phần người xem thấy giữ nguyên).
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const { docDuLieu } = await import(pathToFileURL(path.join(HERE, '..', '..', '..', 'scripts', 'lo-trinh.mjs')).href);

const [lenh, ...du] = process.argv.slice(2);
const opt = {}; for (let i = 0; i < du.length; i += 2) opt[du[i].replace(/^--/, '')] = du[i + 1];
const can = k => { if (!opt[k]) { console.error(`thiếu --${k}`); process.exit(2); } return opt[k]; };

const KHOI_RE = /<script type="application\/json" id="lo-trinh-du-lieu">([\s\S]*?)<\/script>/;

if (lenh === 'tiem') {
  const html = readFileSync(can('trang'), 'utf8'); const khoa = can('khoa'); const nhom = can('nhom');
  const o = JSON.parse(html.match(KHOI_RE)[1]); const tep = khoa.slice(0, khoa.indexOf('#')); const ma = khoa.slice(khoa.indexOf('#') + 1);
  const h = o.lo_trinh.find(l => l.tep === tep)?.hang.find(x => x.ma === ma);
  if (!h) { console.error(`không có hàng ${khoa} trong khối`); process.exit(2); }
  const truoc = `${h.trang_thai} / ${h.nhom_trang_thai}`;
  if (opt['trang-thai']) h.trang_thai = opt['trang-thai'];
  h.nhom_trang_thai = nhom;
  const moi = html.replace(KHOI_RE, () => `<script type="application/json" id="lo-trinh-du-lieu">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`);
  writeFileSync(can('ra'), moi);
  console.log(`tiêm ${khoa}: ${truoc} → ${h.trang_thai} / ${h.nhom_trang_thai} (phần người xem thấy giữ nguyên)`);
  process.exit(0);
}
if (lenh !== 'so') { console.error('lệnh: so | tiem'); process.exit(2); }

// ── (2) Bộ đọc HTML độc lập — chép từ tests/scripts/lo-trinh.test.mjs (LT-111), thêm tên lộ trình + màu ──
const giaiMa = s => s.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const chuTron = s => giaiMa(s.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
const cacThe = html => [...html.matchAll(/<section class="the">([\s\S]*?)<\/section>/g)].map(m => m[1]);
const mucLT = (html, i) => { const m = html.match(new RegExp(`<section id="lt${i}">([\\s\\S]*?)</section>`)); return m ? m[1] : null; };
function docTrang(html) {
  const the = cacThe(html); const ra = [];
  for (let i = 1; i <= the.length; i++) {
    const sec = mucLT(html, i) || ''; const tc = chuTron(the[i - 1]);
    const ten = giaiMa((sec.match(/^<h2>([^<]*)<\/h2>/) || [])[1] || '');
    if (sec.includes('<p class="loi">')) { ra.push({ ten, loi: chuTron((sec.match(/<p class="loi">([\s\S]*?)<\/p>/) || [])[1] || ''), hang: [] }); continue; }
    const hang = [...sec.matchAll(/<tr id="[^"]+">([\s\S]*?)<\/tr>/g)].map(m => {
      const tt = (m[1].match(/<td data-nhan="Trạng thái">([\s\S]*?)<\/td>/) || [])[1] || '';
      const s = tt.match(/<span class="tt( giao| chua)?">([^<]*)<\/span>/) || [];
      return { ma: giaiMa((m[1].match(/<td data-nhan="Mã">([^<]*)<\/td>/) || [])[1] || ''), chu: giaiMa(s[2] || ''), lop: (s[1] || '').trim(),
        theo_loi: tt.includes('theo ghi chép, chưa có hồ sơ'), co: [...tt.matchAll(/<span class="co-o">([^<]*)<\/span>/g)].map(x => giaiMa(x[1])) };
    });
    const td = tc.match(/(\d+)\/(\d+) đã giao · (\d+) đang làm · (\d+) chưa bắt đầu(?: · (\d+) việc khác)?/);
    ra.push({ ten, loi: null, hang, tien_do: td ? { tong: +td[2], da_giao: +td[1], dang_lam: +td[3], chua_bat_dau: +td[4], khac: +(td[5] || 0) } : null });
  }
  return ra;
}

// Hợp đồng hiển thị của trang crm, VIẾT SẴN từ thiết kế LT1 (không rút từ mã crm): nhãn nhóm, và những chữ
// trạng thái của kit trang được phép hiện bằng nhãn nhóm mà không kèm chữ phụ.
const NHAN = { 'chua-bat-dau': 'Chưa bắt đầu', 'dang-lam': 'Đang làm', 'da-giao': 'Đã giao', khac: 'Khác' };
const DONG_NGHIA = { 'chua-bat-dau': ['Chưa bắt đầu', 'Chưa mở'], 'dang-lam': ['Đang làm'], 'da-giao': ['Đã giao'], khac: ['Khác'] };
const deq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const html = readFileSync(can('trang'), 'utf8'); const man = JSON.parse(readFileSync(can('man'), 'utf8'));
const lech = []; const dem = { hang_trang: 0, hang_khop: 0, hang_khoi_khop: 0, chi_tiet_khop: 0, ngay_khop: 0, ngay_tong: 0 };
const trang = docTrang(html);
const { duLieu: khoi, canhBao } = docDuLieu(html);

// (1) khối ↔ (2) trang kit
if (!khoi) lech.push(`khối: docDuLieu trả null — ${canhBao.join(' · ')}`);
else {
  if (khoi.lo_trinh.length !== trang.length) lech.push(`khối: ${khoi.lo_trinh.length} lộ trình · trang kit ${trang.length}`);
  khoi.lo_trinh.forEach((L, i) => {
    const P = trang[i]; if (!P) return; const ten = L.ten ?? L.tep;
    if (P.ten !== ten) lech.push(`lộ trình ${i + 1}: tên khối «${ten}» · trang kit «${P.ten}»`);
    const pk = new Map(P.hang.map(r => [r.ma, r]));
    if (L.hang.length !== P.hang.length) lech.push(`lộ trình ${ten}: khối ${L.hang.length} hàng · trang kit ${P.hang.length}`);
    for (const h of L.hang) {
      const r = pk.get(h.ma);
      if (!r) lech.push(`hàng ${ten}#${h.ma}: có trong khối, không có trên trang kit`);
      else if (r.chu !== h.trang_thai || r.theo_loi !== h.theo_loi || !deq(r.co, h.co)) lech.push(`hàng ${ten}#${h.ma}: khối «${h.trang_thai}» · trang kit «${r.chu}»`);
      else dem.hang_khoi_khop += 1;
    }
    if (!deq(L.tien_do, P.tien_do)) lech.push(`lộ trình ${ten}: tiến độ khối ${JSON.stringify(L.tien_do)} · trang kit ${JSON.stringify(P.tien_do)}`);
  });
}

// (3) trang crm ↔ (2) trang kit
const theoTen = new Map(trang.map(P => [P.ten, P]));
const crm = new Map(); const ctiet = new Map((man.chi_tiet || []).map(c => [c.khoa, c]));
for (const r of man.bang || []) {
  const ma = r.khoa.slice(r.khoa.indexOf('#') + 1);
  if (!crm.has(r.lo_ten)) crm.set(r.lo_ten, new Map());
  crm.get(r.lo_ten).set(ma, r);
}
if (man.kieu !== 'co-du-lieu') lech.push(`trang crm: không dựng được dữ liệu (${man.kieu})`);
if ((man.canh_bao || []).length) lech.push(`trang crm: cờ vàng «${man.canh_bao.join(' · ')}»`);
for (const ten of crm.keys()) if (!theoTen.has(ten)) lech.push(`lộ trình ${ten}: có trên trang crm, không có trên trang kit`);
const tong = { tong: 0, da_giao: 0, dang_lam: 0, chua_bat_dau: 0, khac: 0 };
for (const P of trang) {
  const C = crm.get(P.ten) || new Map(); const nhomDem = { tong: 0, da_giao: 0, dang_lam: 0, chua_bat_dau: 0, khac: 0 };
  for (const r of P.hang) {
    const id = `hàng ${P.ten}#${r.ma}`; const c = C.get(r.ma); dem.hang_trang += 1;
    if (!c) { lech.push(`${id}: có trên trang kit, không có trên trang crm`); continue; }
    const nhom = c.cham[0]?.nhom; const sai = [];
    if (!c.cham.length) sai.push('không có chấm trạng thái');
    if (c.cham.some(x => x.nhom !== nhom || x.chu !== NHAN[x.nhom])) sai.push(`chấm ${JSON.stringify(c.cham)}`);
    const hien = c.phu ?? NHAN[nhom];
    if (c.phu != null ? c.phu !== r.chu : !(DONG_NGHIA[nhom] || []).includes(r.chu)) sai.push(`trang crm hiện «${hien}» · trang kit «${r.chu}»`);
    if ((r.lop === 'giao') !== (nhom === 'da-giao') || (r.lop === 'chua' && nhom !== 'chua-bat-dau')) sai.push(`nhóm trang crm ${nhom} · màu trang kit «${r.lop || 'thường'}»`);
    const d = ctiet.get(c.khoa);
    if (!d || !d.mo_duoc) sai.push('khung chi tiết không mở được');
    else {
      if (d.ma !== r.ma || d.cham.some(x => x.nhom !== nhom || x.chu !== NHAN[nhom]) || d.phu !== c.phu) sai.push(`khung chi tiết hiện ${JSON.stringify({ cham: d.cham, phu: d.phu })}`);
      if (d.theo_loi !== r.theo_loi) sai.push(`dấu «theo ghi chép» trang crm ${d.theo_loi} · trang kit ${r.theo_loi}`);
      if (d.lech !== (r.co.length ? r.co.join(' · ') : null)) sai.push(`cờ lệch trang crm «${d.lech}» · trang kit «${r.co.join(' · ')}»`);
      if (!sai.length) dem.chi_tiet_khop += 1;
    }
    if (sai.length) lech.push(`${id}: ${sai.join(' ; ')}`); else dem.hang_khop += 1;
    nhomDem.tong += 1; if (nhom) nhomDem[nhom.replace(/-/g, '_')] = (nhomDem[nhom.replace(/-/g, '_')] ?? 0) + 1;
  }
  for (const ma of C.keys()) if (!P.hang.some(r => r.ma === ma)) lech.push(`hàng ${P.ten}#${ma}: có trên trang crm, không có trên trang kit`);
  if (!deq(nhomDem, P.tien_do)) lech.push(`lộ trình ${P.ten}: nhóm trên trang crm ${JSON.stringify(nhomDem)} · tiến độ trang kit ${JSON.stringify(P.tien_do)}`);
  for (const k of Object.keys(tong)) tong[k] += (P.tien_do || {})[k] || 0;
}
const vd = man.dem_vong_doi || {};
const mongVd = { 'chua-xong': tong.chua_bat_dau + tong.dang_lam, 'da-giao': tong.da_giao, khac: tong.khac, 'tat-ca': tong.tong };
for (const [k, v] of Object.entries(mongVd)) if (vd[k] !== String(v)) lech.push(`đếm vòng đời «${k}»: trang crm ${vd[k]} · trang kit ${v}`);

// Luật so ngày: hàm của trang crm == khối luật trong tài liệu kit, mọi ngày quanh mốc.
for (const s of man.luat_ngay || []) { dem.ngay_tong += 1; if (deq(s.trang, s.kit)) dem.ngay_khop += 1; else lech.push(`luật ngày ${s.tep} ngày ${s.ngay}: trang crm ${JSON.stringify(s.trang)} · tài liệu kit ${JSON.stringify(s.kit)}`); }

const tomTat = {
  trang_sha256: man.sha256, tep_crm_doc: man.tep_doc, so_lo_trinh: trang.length,
  hang_theo_lo_trinh: Object.fromEntries(trang.map(P => [P.ten, P.hang.length])),
  khoi_doc_bang_kit: khoi ? { lo_trinh: khoi.lo_trinh.length, hang: khoi.lo_trinh.reduce((n, l) => n + l.hang.length, 0), canh_bao: canhBao } : null,
  ...dem, dem_vong_doi_crm: vd, so_trang_bang_crm: man.so_trang_bang, lech,
};
if (opt.ra) writeFileSync(opt.ra, `${JSON.stringify(tomTat, null, 1)}\n`);
console.log(`N = ${dem.hang_trang} hàng × ${trang.length} lộ trình (${Object.entries(tomTat.hang_theo_lo_trinh).map(([t, n]) => `${t} ${n}`).join(' · ')})`);
console.log(`trang crm khớp trang kit: ${dem.hang_khop}/${dem.hang_trang} hàng (khung chi tiết ${dem.chi_tiet_khop}/${dem.hang_trang}) · khối (docDuLieu) khớp trang kit: ${dem.hang_khoi_khop}/${dem.hang_trang} · luật ngày ${dem.ngay_khop}/${dem.ngay_tong}`);
for (const l of lech) console.log(`LỆCH ${l}`);

const mong = opt['mong-do'];
if (!mong) process.exit(lech.length ? 1 : 0);
// Chiều đỏ: tên hiển thị của lộ trình chứa hàng tiêm (khoá = tep#ma; trang crm ghi lo_ten cạnh khoá).
const tenMong = (man.bang || []).find(r => r.khoa === mong)?.lo_ten; const ma = mong.slice(mong.indexOf('#') + 1);
const idMong = `hàng ${tenMong}#${ma}:`;
const dongHang = lech.filter(l => l.startsWith('hàng '));
const trung = dongHang.filter(l => l.startsWith(idMong)); const khac = dongHang.filter(l => !l.startsWith(idMong));
const dat = lech.length > 0 && trung.length > 0 && khac.length === 0;
console.log(dat ? `CHIỀU ĐỎ ĐẠT: phép so đỏ đúng ${idMong.slice(0, -1)} (${trung.length} dòng hàng, ${lech.length - dongHang.length} dòng tổng)` : `CHIỀU ĐỎ HỎNG: mong đỏ ở ${idMong.slice(0, -1)} — dòng trúng ${trung.length}, dòng hàng khác ${khac.length}`);
process.exit(dat ? 0 : 1);
