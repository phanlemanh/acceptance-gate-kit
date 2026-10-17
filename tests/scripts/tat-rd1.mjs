// tat-rd1.mjs — bộ NHÁT TẮT của hồ sơ road-map-de-dung (vòng RD1): mỗi nhát thay ĐÚNG MỘT khúc vòng này thêm hay đổi trong
// scripts/lo-trinh.mjs · scripts/gio-may.mjs bằng khúc tương ứng của v2.32.0 (khớp đúng một lần — bản sao ném nếu lệch).
// Các ca «giống từng byte bộ máy gốc» của hồ sơ đã ký so trên bản sao TẮT đúng các khối mới — cùng nếp TAT_MC / TAT_GM: lời hứa
// gốc (phần còn lại không đổi) giữ nguyên nghĩa; khối mới do tests/scripts/road-map-de-dung.test.mjs đo. Ca RD-tat tự kiểm: bản
// tắt cho trang, khối dữ liệu, bản xem chữ và thẻ khởi động giống từng byte bộ máy v2.32.0 trên dữ liệu crm thật.
// Sinh MỘT lần từ diff lúc dựng vòng; sửa khúc nào của vòng thì sửa nhát tương ứng (RD-tat đỏ nêu nhát lệch).
import { cpSync, readFileSync, writeFileSync, mkdtempSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

export const TAT_RD1 = [
 [
  "scripts/lo-trinh.mjs",
  "    kq.co.push(...luatChiPhatTrien(data));\n",
  ""
 ],
 [
  "scripts/lo-trinh.mjs",
  "      // Mục trỏ một mốc thuộc cờ gom dung-tren-moc của luatChiPhatTrien — không in thêm «mã không có» cho cùng mục.\n      if (!theoMa.has(x) && !khuon.moc.some(m => chuoi(m.ma) === x || chuoi(m.ten).normalize('NFC') === x.normalize('NFC'))) d.coHang.push(`hàng ${d._nhan}: đứng trên mã không có: ${x}`);\n",
  "      if (!theoMa.has(x)) d.coHang.push(`hàng ${d._nhan}: đứng trên mã không có: ${x}`);\n"
 ],
 [
  "scripts/lo-trinh.mjs",
  "\n.moc .dau b{font-weight:600}.moc .dem{color:var(--fg);font-weight:600}.moc .dem.xong{color:var(--ok)}.viec{list-style:none;padding:0 4px 0 0;margin:4px 0 8px;min-width:0}.viec details{margin:0}.viec .dong{display:flex;flex-wrap:wrap;align-items:center;gap:6px;padding:4px 0}.viec summary{display:flex;flex-wrap:wrap;align-items:center;gap:6px;font-weight:400;color:var(--fg);min-height:44px}.viec .ten{font-weight:600}.viec .ma{margin-left:auto;flex-shrink:0;padding:0 4px;font-size:13px;color:var(--mu);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.viec details p{margin:0 0 6px}details.chua-hen>summary{font-size:13px;color:var(--mu)}",
  ""
 ],
 [
  "scripts/lo-trinh.mjs",
  "  if (kq.moc.length) {\n    // Khối Mốc vẽ TỪ mô hình hiển thị chung (AC-11) — không tự lọc: mốc hiện khi có việc; mỗi việc chưa giao một dòng\n    // «tên — trạng thái», mã là chữ phụ (liên kết tới hàng); việc đã giao gập; mốc chưa gắn việc chỉ còn số đếm ở tiêu đề.\n    const mh = moHinhHienThi(kq); const mocs = mocTheoNgay(kq).filter(m => mh.moc.get(m).hien);\n    const an = kq.moc.length - mocs.length;\n    const conViec = m => conViecMoc(m, kq);\n    const viec = x => {\n      const d = mh.viec.get(x); const giao = kq.daGiao.has(d.chu);\n      const ma = theoNhan.has(x) ? `<a class=\"ma\" href=\"#${theoNhan.get(x)}\">${esc(x)}</a>` : `<span class=\"ma\">${esc(x)}</span>`;\n      // Việc có hồ sơ: dòng mở ra được (tên hồ sơ); chưa có hồ sơ: dòng chữ thường — không nút mở ra rỗng.\n      const dau = `<span class=\"ten\">${esc(tenHienThi(d))}</span> <span class=\"tt${giao ? ' giao' : (d.chu === CHUA_MO ? ' chua' : '')}\">${esc(d.chu)}</span> ${ma}`;\n      return d.slug ? `<details><summary>${dau}</summary><p class=\"mu nho\">Hồ sơ <code>${esc(d.slug)}</code></p></details>` : `<div class=\"dong\">${dau}</div>`;\n    };\n    // Việc đã giao chỉ còn số đếm trên dòng mốc (danh sách đủ ở bảng «việc đã giao») — giữ lời hứa độ dài của trang.\n    const mocLi = m => {\n      const o = mh.moc.get(m); const mo = o.viec_hien.filter(x => !kq.daGiao.has(mh.viec.get(x).chu)); const xong = o.viec_hien.length - mo.length;\n      const dem = mo.length ? `<span class=\"dem\">còn ${mo.length}/${o.viec_hien.length} việc</span>${xong ? ` · ${xong} đã giao` : ''}` : `<span class=\"dem xong\">đã giao đủ ${xong} việc</span>`;\n      return `<li data-ngay=\"${esc(chuoi(m.ngay))}\" data-ten=\"${esc(chuoi(m.ten))}\"${conViec(m) ? ' data-con-viec' : ''}><div class=\"dau\"><span class=\"ngay\">${esc(ngayVN(m.ngay))}</span><b>${esc(chuoi(m.ten))}</b><span class=\"con\"></span></div><div class=\"mu nho\">${dem}${gioMayMoc(kq, m)}</div>${mo.length ? `<div class=\"viec\">${mo.map(viec).join('')}</div>` : ''}</li>`;\n    };\n    P.push(`<h3>Mốc${an ? ` <span class=\"mu nho\">— ${an}/${kq.moc.length} mốc chưa gắn việc nào, không hiện</span>` : ''}</h3>${mocs.length ? `<ol class=\"moc\" data-the=\"lt${i}-moc-ke\">${mocs.map(mocLi).join('')}</ol>` : '<p class=\"mu\">Chưa mốc nào gắn việc.</p>'}`);\n    if (mh.chua_hen_moc.length) P.push(`<details class=\"chua-hen\"><summary>${mh.chua_hen_moc.length} việc chưa hẹn mốc</summary><div class=\"viec\">${mh.chua_hen_moc.map(viec).join('')}</div></details>`);\n  }\n",
  "  if (kq.moc.length) {\n    const mocs = mocTheoNgay(kq); const gan = ganMoc;\n    // Mốc còn việc chưa giao: script trên trang tô «đã qua — còn việc chưa giao» khi ngày đã qua.\n    const conViec = m => conViecMoc(m, kq);\n    const mk = mocKhongHang(kq);\n    P.push(`<h3>Mốc${mk.k ? ` <span class=\"mu nho\">— ${mk.k}/${mk.n} mốc chưa gắn việc nào</span>` : ''}</h3><ol class=\"moc\" data-the=\"lt${i}-moc-ke\">${mocs.map(m => `<li data-ngay=\"${esc(chuoi(m.ngay))}\" data-ten=\"${esc(chuoi(m.ten))}\"${conViec(m) ? ' data-con-viec' : ''}><span class=\"ngay\">${esc(ngayVN(m.ngay))}</span>${esc(chuoi(m.ten))}<span class=\"con\"></span>${gioMayMoc(kq, m)}${gan(m).length ? ` <span class=\"mu nho\">· việc ${gan(m).map(x => (theoNhan.has(x) ? `<a href=\"#${theoNhan.get(x)}\">${esc(x)}</a>` : esc(x))).join(', ')}</span>` : '<span class=\"trong\">chưa gắn việc</span>'}</li>`).join('')}</ol>`);\n  }\n"
 ],
 [
  "scripts/lo-trinh.mjs",
  "        ten_hien_thi: tenHienThi(d),\n",
  ""
 ],
 [
  "scripts/lo-trinh.mjs",
  "          ...mh.moc.get(m),\n",
  ""
 ],
 [
  "scripts/lo-trinh.mjs",
  "      chua_hen_moc: mh.chua_hen_moc,\n",
  ""
 ],
 [
  "scripts/lo-trinh.mjs",
  "moc: [], da_bac: [], chua_hen_moc: [] };",
  "moc: [], da_bac: [] };"
 ],
 [
  "scripts/lo-trinh.mjs",
  "  if (thieuMoHinh) canhBao.push('trang vẽ bằng bộ kit chưa có luật hiển thị trong khối — khối chưa mang mô hình hiển thị (ten_hien_thi, hien, con_lai null; viec_hien, chua_hen_moc rỗng); vẽ lại bằng bộ kit mới');\n",
  ""
 ],
 [
  "scripts/lo-trinh.mjs",
  "    for (const c of t.co) { const d = dichCo(c); if (CO_PHAT_TRIEN.includes(d.ten)) dong.push(`  ! ${d.chu}`); }\n",
  ""
 ],
 [
  "scripts/lo-trinh.mjs",
  "    // Luật «chỉ việc phát triển» (AC-8): cờ của bộ đọc chung đứng TRƯỚC khối Rà soát — khối Rà soát và Tự áp liền nhau.\n    for (const c of kq.co) { const d = dichCo(c); if (CO_PHAT_TRIEN.includes(d.ten)) ra.push(`  ! ${d.chu}`); }\n",
  ""
 ],
 [
  "scripts/lo-trinh.mjs",
  "    ra.push(...dongMocXem(kq));\n",
  ""
 ],
 [
  "scripts/lo-trinh.mjs",
  "    ra.push(...dongGioMayXem(kq, nhom, today, nhieu));",
  "    ra.push(...dongGioMayXem(kq, nhom, today));"
 ],
 [
  "scripts/lo-trinh.mjs",
  "  return dong.length ? [nhieu ? 'Giờ máy theo mốc (mỗi lộ trình một làn, tính riêng):' : 'Giờ máy theo mốc:', ...dong] : [];",
  "  return dong.length ? ['Giờ máy theo mốc:', ...dong] : [];"
 ],
 [
  "scripts/lo-trinh.mjs",
  "  // Cùng thứ tự với làn của gio-may.duBao: mốc có ngày theo ngày, mốc không ngày đứng cuối, cùng ngày giữ thứ tự tệp.\n  const coNgay = i => NGAY_RE.test(chuoi(kq.moc[i].ngay));\n  const thuTu = kq.moc.map((m, i) => i).sort((a, b) => (coNgay(a) ? 0 : 1) - (coNgay(b) ? 0 : 1) || chuoi(kq.moc[a].ngay).localeCompare(chuoi(kq.moc[b].ngay)) || a - b);\n",
  "  const thuTu = kq.moc.map((m, i) => i).sort((a, b) => chuoi(kq.moc[a].ngay).localeCompare(chuoi(kq.moc[b].ngay)) || a - b);\n"
 ],
 [
  "scripts/lo-trinh.mjs",
  "    // Luật moc-chua-khep (hồ sơ road-map-de-dung, AC-9; hạt giống 2026-10-17-hat-giong-ra-soat-khong-xet-moc-qua-ngay): mốc có\n    // ngày hợp lệ đã qua, chưa ghi ngày khép (`that`), và không còn việc mở (không gắn việc, hoặc mọi việc đã giao) → MỘT dòng\n    // gom, ≤ 5 tên rồi «…». Mốc còn việc mở giữ luật moc-qua-ngay; mốc ngoài đã có cờ của bộ đọc chung. Phụ thuộc hôm nay nên\n    // chỉ ở bản xem chữ và thẻ khởi động, không lên trang.\n    const theoNhanRs = new Map(kq.dong.map(d => [String(d._nhan), d]));\n    const khep = kq.moc.filter(m => chuoi(m.loai) !== 'ngoai' && NGAY_RE.test(chuoi(m.ngay)) && chuoi(m.ngay) < today && !chuoi(m.that)\n      && ganMoc(m).map(x => theoNhanRs.get(x)).filter(Boolean).every(d => daGiao.has(d.chu))).map(tenNganMoc);\n    // Tên ngắn (AC-5, chủ kho «Rà soát cảnh báo hàng thiếu ten_ngan»): tên phiên và nhóm thanh bên rút từ `ten_ngan`; vắng thì\n    // rút gọn câu giao — một dòng gom ở khối Rà soát (≤ 8 mã rồi «…»), không lên trang. Chỉ nhắc kho ĐÃ dùng tên ngắn (≥ 1 việc\n    // có) mà còn sót — kho chưa từng dùng không bị nhắc (luật cân trên mọi kho).\n    const thieuTen = kq.dong.some(d => chuoi(d.ten_ngan)) ? kq.dong.filter(d => !chuoi(d.ten_ngan)).map(d => String(d._nhan)) : [];\n    if (thieuTen.length) { const u = [...new Set(thieuTen)]; canh.push(`${u.length} việc chưa có tên ngắn — tên phiên đang rút gọn tên việc: ${u.slice(0, 8).join(', ')}${u.length > 8 ? ', …' : ''}`); }\n    if (khep.length) { const u = [...new Set(khep)]; canh.push(`${u.length} mốc đã qua ngày, chưa ghi ngày khép: ${u.slice(0, 5).join(', ')}${u.length > 5 ? ', …' : ''}`); }\n",
  ""
 ],
 [
  "scripts/gio-may.mjs",
  "  for (const i of thuTu) {\n    const r = kq.get(i); if (!r || r.vong || !r.mo) continue;",
  "  for (const i of []) {\n    const r = kq.get(i); if (!r || r.vong || !r.mo) continue;"
 ],
 [
  "scripts/gio-may.mjs",
  "    + (r.gioChoDo ? '' : ' (chưa có giờ chờ đo)') + NHAN_24;",
  "    + (r.gioChoDo ? '' : ' (chưa có giờ chờ đo)');"
 ],
 [
  "scripts/lo-trinh.mjs",
  "\n// Khối «Mốc:» của bản xem chữ (hồ sơ road-map-de-dung, AC-11): CÙNG mô hình hiển thị với trang và khối dữ liệu — mốc hiện,\n// còn k/n, từng việc chưa giao «tên (trạng thái) [mã]», số việc chưa hẹn mốc. Không tự lọc.\nexport function dongMocXem(kq) {\n  if (!kq.moc.length && !kq.dong.length) return [];\n  const mh = moHinhHienThi(kq); const ra = [];\n  for (const m of mocTheoNgay(kq)) {\n    const o = mh.moc.get(m); if (!o.hien) continue;\n    const mo = o.viec_hien.filter(x => !kq.daGiao.has(mh.viec.get(x).chu));\n    ra.push(`  · ${tenNganMoc(m)} — ${mo.length ? `còn ${mo.length}/${o.viec_hien.length} việc` : `đã giao đủ ${o.viec_hien.length} việc`}`);\n    for (const x of mo) { const d = mh.viec.get(x); ra.push(`      – ${tenHienThi(d)} (${d.chu}) [${x}]`); }\n  }\n  if (mh.chua_hen_moc.length) ra.push(`  · ${mh.chua_hen_moc.length} việc chưa hẹn mốc`);\n  return ra.length ? ['Mốc:', ...ra] : [];\n}",
  ""
 ],
 [
  "scripts/lo-trinh.mjs",
  "\n  lo_trinh: ['tep', 'ten', 'loi', 'hang_ke', 'can_sua', 'tien_do', 'hang', 'moc', 'da_bac', 'chua_hen_moc'],",
  "\n  lo_trinh: ['tep', 'ten', 'loi', 'hang_ke', 'can_sua', 'tien_do', 'hang', 'moc', 'da_bac'],"
 ],
 [
  "scripts/lo-trinh.mjs",
  "\n  hang: ['ma', 'cau_giao', 'hang', 'nhom', 'dung_tren', 'trang_thai', 'nhom_trang_thai', 'ho_so', 'theo_loi', 'co', 'bat_khi', 'vi_sao', 'tom_tat', 'gio_may', 'ten_hien_thi'],",
  "\n  hang: ['ma', 'cau_giao', 'hang', 'nhom', 'dung_tren', 'trang_thai', 'nhom_trang_thai', 'ho_so', 'theo_loi', 'co', 'bat_khi', 'vi_sao', 'tom_tat', 'gio_may'],"
 ],
 [
  "scripts/lo-trinh.mjs",
  "\n  moc: ['ten', 'ngay', 'hang', 'con_viec', 'gio_may', 'du_kien', 'qua_tai', 'hien', 'viec_hien', 'con_lai'],",
  "\n  moc: ['ten', 'ngay', 'hang', 'con_viec', 'gio_may', 'du_kien', 'qua_tai'],"
 ],
 [
  "scripts/lo-trinh.mjs",
  "\n    lo_trinh: ['tep', 'ten', 'loi', 'hang_ke', 'can_sua', 'tien_do', 'hang', 'moc', 'da_bac', 'chua_hen_moc'],",
  "\n    lo_trinh: ['tep', 'ten', 'loi', 'hang_ke', 'can_sua', 'tien_do', 'hang', 'moc', 'da_bac'],"
 ],
 [
  "scripts/lo-trinh.mjs",
  "\n    hang: ['ma', 'cau_giao', 'hang', 'nhom', 'dung_tren', 'trang_thai', 'nhom_trang_thai', 'ho_so', 'theo_loi', 'co', 'bat_khi', 'vi_sao', 'tom_tat', 'gio_may', 'ten_hien_thi'],",
  "\n    hang: ['ma', 'cau_giao', 'hang', 'nhom', 'dung_tren', 'trang_thai', 'nhom_trang_thai', 'ho_so', 'theo_loi', 'co', 'bat_khi', 'vi_sao', 'tom_tat', 'gio_may'],"
 ],
 [
  "scripts/lo-trinh.mjs",
  "\n    moc: ['ten', 'ngay', 'hang', 'con_viec', 'gio_may', 'du_kien', 'qua_tai', 'hien', 'viec_hien', 'con_lai'],",
  "\n    moc: ['ten', 'ngay', 'hang', 'con_viec', 'gio_may', 'du_kien', 'qua_tai'],"
 ],
 [
  "scripts/lo-trinh.mjs",
  "  const MANG = ['nguon', 'lo_trinh', 'ngoai_lo_trinh', 'can_sua', 'hang', 'moc', 'da_bac', 'dung_tren', 'co', 'viec_hien', 'chua_hen_moc'];",
  "  const MANG = ['nguon', 'lo_trinh', 'ngoai_lo_trinh', 'can_sua', 'hang', 'moc', 'da_bac', 'dung_tren', 'co'];"
 ],
 [
  "scripts/lo-trinh.mjs",
  "  const NUL = ['ten', 'loi', 'hang_ke', 'lenh', 'ho_so', 'tom_tat', 'moi_nguoi', 'chu_kho', 'gio_may', 'du_kien', 'qua_tai', 'ten_hien_thi', 'hien', 'con_lai'];",
  "  const NUL = ['ten', 'loi', 'hang_ke', 'lenh', 'ho_so', 'tom_tat', 'moi_nguoi', 'chu_kho', 'gio_may', 'du_kien', 'qua_tai'];"
 ]
];
const cache = new Map();
// Bản sao trọn `scripts lib skills` (cùng các thư mục gói nếu có) của `goc` với mọi nhát (cộng `them`) áp — ném nếu nhát nào không khớp đúng một lần.
export function tatRD1(goc, them = []) {
  const khoa = `${goc}|${JSON.stringify(them)}`; if (cache.has(khoa)) return cache.get(khoa);
  const c = mkdtempSync(path.join(tmpdir(), 'tat-rd1-'));
  for (const d of ['scripts', 'lib', 'skills', 'commands', 'feature-loop', 'road-map', 'dieu-phoi', '.claude-plugin']) if (existsSync(path.join(goc, d))) cpSync(path.join(goc, d), path.join(c, d), { recursive: true });
  for (const f of ['GUIDE.md']) if (existsSync(path.join(goc, f))) cpSync(path.join(goc, f), path.join(c, f));
  for (const [tep, cu, moi] of [...TAT_RD1, ...them]) {
    const p = path.join(c, tep); const s = readFileSync(p, 'utf8'); const k = s.split(cu).length - 1;
    if (k !== 1) throw new Error(`nhát tắt RD1 vào ${tep} khớp ${k} lần (cần 1): ${cu.slice(0, 70)}`);
    writeFileSync(p, s.replace(cu, () => moi));
  }
  cache.set(khoa, c); return c;
}
