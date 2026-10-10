// Nguồn hàng từ lộ trình của kho (spec workflow §14 chỗ nối 1). Lộ trình là KẾ HOẠCH (một nguồn cho mã,
// câu giao, slug, mốc); đợt chỉ giữ phần thi công theo mã. Gói không nạp mã của kit:
// · (ma, slug, mốc) đọc từ TỆP lộ trình của kho; slug vắng → luật suySlug của kit (bản chép dưới);
// · nhóm kế hoạch (nhom_trang_thai) đọc từ khối `lo-trinh-du-lieu` của LO-TRINH.html bằng bản chép của
//   docDuLieu — khối ấy không mang slug, nên không dùng nó làm nguồn hàng.
// Ca DP2-08 round-trip so cả hai bản chép với bản gốc của kit trên cùng tệp.
import fs from 'node:fs';
import path from 'node:path';

// Slug suy TẤT ĐỊNH từ câu giao: bỏ dấu, đ→d, chữ thường, ký tự khác chữ-số thành «-», sáu từ đầu.
export function suySlug(cauGiao) {
  const tu = String(cauGiao || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd')
    .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(/\s+/).filter(Boolean);
  return tu.slice(0, 6).join('-');
}

// Một mục nguồn: «<tệp>:<mã>» (một hàng) hoặc «<tệp>@<ngày mốc>» (mọi hàng của mốc mang ngày ấy).
function tachNguon(muc) {
  const iMoc = muc.lastIndexOf('@');
  const iMa = muc.lastIndexOf(':');
  if (iMoc > iMa && iMoc > 0) return { tep: muc.slice(0, iMoc), ngay: muc.slice(iMoc + 1) };
  if (iMa > 0) return { tep: muc.slice(0, iMa), ma: muc.slice(iMa + 1) };
  return { loi: `mục nguồn «${muc}» không phải <tệp>:<mã> hay <tệp>@<ngày>` };
}

// Trả {hang:[{ma, slug}], loi}. `loi` khác null → bên gọi dùng hàng khai tay và nói ra một dòng.
export function docHangLoTrinh(gocKho, nguon) {
  const ra = [];
  const daThay = new Set();
  const tepDaDoc = new Map();
  for (const muc of nguon) {
    const n = tachNguon(muc);
    if (n.loi) return { hang: [], loi: n.loi };
    if (!tepDaDoc.has(n.tep)) {
      try {
        tepDaDoc.set(n.tep, JSON.parse(fs.readFileSync(path.resolve(gocKho, n.tep), 'utf8')));
      } catch (e) {
        return { hang: [], loi: `không đọc được tệp lộ trình ${n.tep} (${e.code ?? e.message})` };
      }
    }
    const data = tepDaDoc.get(n.tep);
    const hang = (Array.isArray(data.hang) ? data.hang : []).filter((r) => r && typeof r === 'object');
    let ma;
    if (n.ma !== undefined) ma = [n.ma];
    else {
      const moc = (Array.isArray(data.moc) ? data.moc : []).filter((m) => m && m.ngay === n.ngay);
      if (moc.length === 0) return { hang: [], loi: `${n.tep} không có mốc ngày ${n.ngay}` };
      ma = moc.flatMap((m) => (Array.isArray(m.hang) ? m.hang : []));
    }
    for (const m of ma) {
      const r = hang.find((h) => h.ma === m);
      if (!r) return { hang: [], loi: `${n.tep} không có hàng ${m}` };
      if (daThay.has(m)) continue;
      daThay.add(m);
      ra.push({ ma: m, slug: r.slug || suySlug(r.cau_giao) });
    }
  }
  return { hang: ra, loi: null };
}

// <<<DOC-DU-LIEU-CHEP — bản chép NGUYÊN VĂN `docDuLieu` của scripts/lo-trinh.mjs (kit). Hàm tự đủ; ca
// DP2-08 round-trip so đầu ra với bản gốc trên cùng trang.
export function docDuLieu(html) {
  const ID = 'lo-trinh-du-lieu'; const PHIEN_BAN = 1;
  const KHUON = {
    goc: ['khuon', 'phien_ban', 'nguon', 'lo_trinh', 'ngoai_lo_trinh'],
    lo_trinh: ['tep', 'ten', 'loi', 'hang_ke', 'can_sua', 'tien_do', 'hang', 'moc', 'da_bac'],
    hang_ke: ['ma', 'cau_giao', 'lenh'],
    can_sua: ['ma', 'chu'],
    tien_do: ['tong', 'da_giao', 'dang_lam', 'chua_bat_dau', 'khac'],
    hang: ['ma', 'cau_giao', 'hang', 'nhom', 'dung_tren', 'trang_thai', 'nhom_trang_thai', 'ho_so', 'theo_loi', 'co', 'bat_khi', 'vi_sao'],
    moc: ['ten', 'ngay', 'hang', 'con_viec'],
    da_bac: ['ma', 'ly_do'],
  };
  const MANG = ['nguon', 'lo_trinh', 'ngoai_lo_trinh', 'can_sua', 'hang', 'moc', 'da_bac', 'dung_tren', 'co'];
  const BOOL = ['theo_loi', 'con_viec']; const SO = ['phien_ban', 'tong', 'da_giao', 'dang_lam', 'chua_bat_dau', 'khac'];
  const NUL = ['ten', 'loi', 'hang_ke', 'lenh', 'ho_so'];
  const rong = k => (MANG.includes(k) ? [] : BOOL.includes(k) ? false : SO.includes(k) ? 0 : NUL.includes(k) ? null
    : k === 'tien_do' ? { tong: 0, da_giao: 0, dang_lam: 0, chua_bat_dau: 0, khac: 0 } : '');
  const va = (o, cap) => {
    if (o == null || typeof o !== 'object' || Array.isArray(o)) return o;
    const ra = { ...o };
    for (const k of KHUON[cap]) if (!(k in ra)) ra[k] = rong(k);
    return ra;
  };
  const m = String(html ?? '').match(new RegExp(`<script type="application/json" id="${ID}">([\\s\\S]*?)</script>`));
  if (!m) return { duLieu: null, canhBao: ['trang chưa mang dữ liệu lộ trình — vẽ lại bằng bộ kit từ 2.27'] };
  let o;
  try { o = JSON.parse(m[1]); } catch (e) { return { duLieu: null, canhBao: [`khối dữ liệu lộ trình không phải JSON hợp lệ: ${e.message}`] }; }
  if (o == null || typeof o !== 'object' || Array.isArray(o) || o.khuon !== ID) return { duLieu: null, canhBao: [`khối mang khuôn «${o && o.khuon}», không phải ${ID}`] };
  const canhBao = [];
  if (Number(o.phien_ban) > PHIEN_BAN) canhBao.push(`khuôn phiên bản ${o.phien_ban} mới hơn bộ đọc (${PHIEN_BAN}) — đọc phần biết`);
  const g = va(o, 'goc');
  g.lo_trinh = (Array.isArray(g.lo_trinh) ? g.lo_trinh : []).map(t => {
    const x = va(t, 'lo_trinh');
    if (x == null || typeof x !== 'object') return x;
    if (x.hang_ke != null) x.hang_ke = va(x.hang_ke, 'hang_ke');
    x.tien_do = va(x.tien_do, 'tien_do');
    for (const cap of ['can_sua', 'hang', 'moc', 'da_bac']) x[cap] = (Array.isArray(x[cap]) ? x[cap] : []).map(v => va(v, cap));
    return x;
  });
  return { duLieu: g, canhBao };
}
// DOC-DU-LIEU-CHEP>>>

// Nhóm kế hoạch theo mã (chỗ nối 3): Map<ma, nhom_trang_thai>. Trang vắng/hỏng → Map rỗng, không lỗi.
export function docNhomKeHoach(gocKho) {
  let html;
  try {
    html = fs.readFileSync(path.join(gocKho, 'LO-TRINH.html'), 'utf8');
  } catch {
    return new Map();
  }
  const { duLieu } = docDuLieu(html);
  const ra = new Map();
  for (const t of duLieu?.lo_trinh ?? []) for (const h of t?.hang ?? []) if (h?.ma) ra.set(h.ma, h.nhom_trang_thai);
  return ra;
}
