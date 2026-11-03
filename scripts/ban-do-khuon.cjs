#!/usr/bin/env node
// ban-do-khuon.cjs — bộ đọc bản đồ khuôn dùng chung (hồ sơ khuon-loi, hàng KH1).
//
// Kho khai `design/patterns/<nhóm>.md`: mỗi tệp một nhóm màn (hay phần tử), frontmatter YAML theo khuôn
// `skills/acceptance/references/ban-do-khuon-template.md`. Bộ đọc này là MỘT nguồn cho ba bên đọc: bước chấm của kit
// (`design-floor-khuon.mjs --kiem`), lưới ở `s4-args.mjs`, và luật lint của chính kho (nạp qua `createRequire` hay gọi
// CLI `--json`) — hai kho thử mỗi kho tự viết một bộ đọc và hai bộ trôi khỏi nhau.
//
// Không phụ thuộc thư viện nào: YAML đọc theo thụt lề (tập con mà hai kho thử dùng — khối thụt lề và một dòng `{…}`
// `[…]`), mã nguồn đọc theo mẫu chữ (giới hạn đã khai ở design doc §7). Chỉ `require` hàm `lib/evidence-core.cjs` đang
// export — không sửa lib.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { pathGlobToRe, stripYamlComment } = require('../lib/evidence-core.cjs');

const KHOA_LOI = ['nhom', 'doi_tuong', 'khuon', 'nhan_dien', 'mau_dang_chay', 'khe_bat_buoc', 'cam_ngoai_khuon', 'ngoai_le'];
const KHOA_MO_RONG = ['don_vi', 'cam_ho', 'thay_cho', 'khe_tuy_chon', 'luat', 'nhan_viec', 'lop_trinh_bay', 'thanh_phan_tang_ngan'];
const TEN_DANH_RIENG = ['lech-lot.md', 'README.md'];
const THU_MUC = path.join('design', 'patterns');
const KHONG_DOC_SO_DANG_KY = 'nhan_dien dạng sổ đăng ký — thêm nhan_dien.tep: [glob] để bước chấm biết tệp nào thuộc nhóm';
const TEP_CAP_DAU = 'tep cấp đầu không được đọc — glob tệp của nhóm đặt ở nhan_dien.tep';

// ── YAML: scalar và flow `{…}` `[…]` một dòng ────────────────────────────────────────────────────────────────
function boNhay(s) {
  const t = s.trim();
  if (t.length >= 2 && t[0] === '"' && t[t.length - 1] === '"') return t.slice(1, -1).replace(/\\(.)/g, '$1');
  if (t.length >= 2 && t[0] === "'" && t[t.length - 1] === "'") return t.slice(1, -1).replace(/''/g, "'");
  return t;
}
// Đọc một giá trị flow bắt đầu ở s[i]; trả [giá trị, vị trí sau nó].
function docFlow(s, i) {
  while (s[i] === ' ') i++;
  if (s[i] === '[' || s[i] === '{') {
    const laSeq = s[i] === '[';
    const dong = laSeq ? ']' : '}';
    const ra = laSeq ? [] : {};
    i++;
    for (;;) {
      while (s[i] === ' ' || s[i] === ',') i++;
      if (i >= s.length) throw new Error(`thiếu «${dong}»`);
      if (s[i] === dong) return [ra, i + 1];
      if (laSeq) { const [v, j] = docFlow(s, i); ra.push(v); i = j; continue; }
      const m = /^\s*("[^"]*"|'[^']*'|[^:,{}[\]]+?)\s*:\s*/.exec(s.slice(i));
      if (!m) throw new Error(`khoá hỏng ở «${s.slice(i, i + 20)}»`);
      i += m[0].length;
      const [v, j] = docFlow(s, i);
      ra[boNhay(m[1])] = v;
      i = j;
    }
  }
  let j = i;
  if (s[i] === '"' || s[i] === "'") { const q = s[i]; j = i + 1; while (j < s.length && s[j] !== q) j += s[j] === '\\' && q === '"' ? 2 : 1; j++; }
  else while (j < s.length && !',]}'.includes(s[j])) j++;
  return [boNhay(s.slice(i, j)), j];
}
function giaTri(raw) {
  const s = stripYamlComment(raw);
  if (s === '') return null;
  if (s[0] === '[' || s[0] === '{') return docFlow(s, 0)[0];
  return boNhay(s);
}

// ── YAML: khối thụt lề (mapping + danh sách `- `) ─────────────────────────────────────────────────────────────
function docKhoi(dong, tu, thut) {
  // dong: [{thut, chu}] đã bỏ dòng trống/chú thích. Trả [giá trị, chỉ số dòng kế].
  let i = tu;
  if (i < dong.length && dong[i].thut === thut && dong[i].chu.startsWith('- ')) {
    const ra = [];
    while (i < dong.length && dong[i].thut === thut && dong[i].chu.startsWith('- ')) {
      const sau = dong[i].chu.slice(2);
      const thutCon = thut + 2;
      if (/^("[^"]*"|'[^']*'|[\w-]+)\s*:(\s|$)/.test(sau) && !/^[[{]/.test(sau)) {
        // Mục là mapping: dòng đầu là cặp khoá đầu, các khoá sau ở thụt + 2.
        const gia = [{ thut: thutCon, chu: sau }];
        let j = i + 1;
        while (j < dong.length && dong[j].thut >= thutCon) gia.push(dong[j++]);
        ra.push(docKhoi(gia, 0, thutCon)[0]);
        i = j;
      } else { ra.push(giaTri(sau)); i++; }
    }
    return [ra, i];
  }
  const ra = {};
  while (i < dong.length && dong[i].thut === thut) {
    const m = /^("[^"]*"|'[^']*'|[^:]+?)\s*:(?:\s+(.*))?$/.exec(dong[i].chu);
    if (!m) throw new Error(`dòng không đọc được: «${dong[i].chu}»`);
    const khoa = boNhay(m[1]);
    const conLai = m[2] == null ? '' : m[2];
    i++;
    if (stripYamlComment(conLai) !== '') { ra[khoa] = giaTri(conLai); continue; }
    if (i < dong.length && (dong[i].thut > thut || (dong[i].thut === thut && dong[i].chu.startsWith('- ')))) {
      const [v, j] = docKhoi(dong, i, dong[i].thut);
      ra[khoa] = v;
      i = j;
    } else ra[khoa] = null;
  }
  return [ra, i];
}
function tachFrontmatter(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)([\s\S]*)$/.exec(String(text || ''));
  return m ? { fm: m[1], than: m[2] } : null;
}
function docYaml(fm) {
  const dong = fm.split(/\r?\n/)
    .filter(l => l.trim() !== '' && !l.trim().startsWith('#'))
    .map(l => ({ thut: l.length - l.trimStart().length, chu: l.trim() }));
  return dong.length ? docKhoi(dong, 0, dong[0].thut)[0] : {};
}

// ── Chuẩn hoá một nhóm ───────────────────────────────────────────────────────────────────────────────────────
const mang = v => (Array.isArray(v) ? v.map(x => (typeof x === 'string' ? x : x)).filter(x => x !== null && x !== '') : v == null ? [] : [v]);
// `khoi` của một ngoại lệ: một tên hay danh sách tên — mỗi tên thành một mục riêng (lint của kho đọc `khoi` là chuỗi).
// Danh sách rỗng giữ đúng hành vi cũ: một mục `khoi: ''`, không miễn gì.
const khoiCua = v => (Array.isArray(v) && v.length ? v.map(k => String(k == null ? '' : k)) : [Array.isArray(v) || v == null ? '' : String(v)]);
// Tên lớp trình bày: `khuon.lop_trinh_bay` rồi khoá cấp đầu, chuỗi hay danh sách, bỏ trùng và bỏ chính tên khuôn.
const lopTrinhBay = (ten, ...nguon) => [...new Set(nguon.flatMap(v => mang(v)).filter(x => typeof x === 'string' && x !== ten))];
function cauDau(than, nhan) {
  // Nhận «## Dùng khi» (tiêu đề) hay «**Dùng khi:** …» / «Dùng khi: …» (dòng thân) — hai kho thử viết hai kiểu.
  const dong = String(than || '').split(/\r?\n/);
  const reTieuDe = new RegExp(`^#{1,6}\\s*${nhan}\\b`, 'i');
  const reDong = new RegExp(`^\\**${nhan}\\s*:?\\**\\s*:?\\s*(.*)$`, 'i');
  for (let k = 0; k < dong.length; k++) {
    const l = dong[k].trim();
    if (reTieuDe.test(l)) {
      for (let j = k + 1; j < dong.length; j++) { const t = dong[j].trim(); if (t.startsWith('#')) break; if (t) return t.split(/(?<=[.!?])\s/)[0]; }
      return '';
    }
    const m = reDong.exec(l);
    if (m) return m[1].replace(/^\**\s*/, '').split(/(?<=[.!?])\s/)[0];
  }
  return null;
}
function chuanNhanDien(v) {
  if (Array.isArray(v)) return { nhan_dien: mang(v).map(String), khong_doc_duoc: null };
  if (v && typeof v === 'object') {
    if (v.tep != null) return { nhan_dien: mang(v.tep).map(String), khong_doc_duoc: null };
    return { nhan_dien: null, khong_doc_duoc: KHONG_DOC_SO_DANG_KY };
  }
  if (typeof v === 'string' && v) return { nhan_dien: [v], khong_doc_duoc: null };
  return { nhan_dien: [], khong_doc_duoc: null };
}

// docBanDo(text, tep) → { nhom: Nhom|null, sai: string[], canh_bao: string[] }
function docBanDo(text, tep) {
  const sai = [];
  const canh_bao = [];
  const tach = tachFrontmatter(text);
  if (!tach) return { nhom: null, sai: [`${tep}: không có frontmatter YAML`], canh_bao };
  let y;
  try { y = docYaml(tach.fm); } catch (e) { return { nhom: null, sai: [`${tep}: YAML không đọc được — ${e.message}`], canh_bao }; }
  if (!y || typeof y !== 'object' || Array.isArray(y)) return { nhom: null, sai: [`${tep}: frontmatter không phải mapping`], canh_bao };
  for (const k of KHOA_LOI) if (!(k in y)) sai.push(`${tep}: thiếu khoá ${k}`);
  for (const k of Object.keys(y)) {
    if (k === 'tep') canh_bao.push(`${tep}: ${TEP_CAP_DAU}`);
    else if (!KHOA_LOI.includes(k) && !KHOA_MO_RONG.includes(k)) canh_bao.push(`${tep}: khoá lạ: ${k}`);
  }
  const coKhuon = y.khuon && typeof y.khuon === 'object';
  const tenKhuon = coKhuon && y.khuon.ten != null ? String(y.khuon.ten) : '';
  const khuon = {
    ten: tenKhuon,
    nhap: coKhuon && y.khuon.nhap != null ? String(y.khuon.nhap) : '',
    lop_trinh_bay: lopTrinhBay(tenKhuon, coKhuon ? y.khuon.lop_trinh_bay : null, y.lop_trinh_bay),
  };
  if ('khuon' in y && !khuon.ten) sai.push(`${tep}: khuon thiếu ten`);
  const mau = y.mau_dang_chay && typeof y.mau_dang_chay === 'object' ? { tep: y.mau_dang_chay.tep == null ? '' : String(y.mau_dang_chay.tep) } : { tep: y.mau_dang_chay == null ? '' : String(y.mau_dang_chay) };
  const cam = mang(y.cam_ngoai_khuon).map(String);
  const camHo = mang(y.cam_ho).map(String);
  for (const h of camHo) if (!cam.includes(h)) sai.push(`${tep}: cam_ho có tên không nằm trong cam_ngoai_khuon: ${h}`);
  const ngoaiLe = mang(y.ngoai_le).flatMap(x => (x && typeof x === 'object'
    ? khoiCua(x.khoi).map(khoi => ({ tep: String(x.tep || ''), khoi, ly_do: String(x.ly_do || '').trim() }))
    : [{ tep: '', khoi: String(x), ly_do: '' }]));
  for (const n of ngoaiLe) if (!n.ly_do) sai.push(`${tep}: ngoai_le thiếu ly_do (${n.tep || '?'} · ${n.khoi || '?'})`);
  const thay = y.thay_cho && typeof y.thay_cho === 'object' && !Array.isArray(y.thay_cho) ? Object.fromEntries(Object.entries(y.thay_cho).map(([k, v]) => [k, String(v)])) : {};
  const donVi = y.don_vi === 'phan-tu' ? 'phan-tu' : 'man';
  const nd = chuanNhanDien(y.nhan_dien);
  const dungKhi = cauDau(tach.than, 'Dùng khi');
  if (dungKhi == null) canh_bao.push(`${tep}: thiếu «Dùng khi»`);
  if (cauDau(tach.than, 'Không dùng') == null) canh_bao.push(`${tep}: thiếu «Không dùng»`);
  if (y.nhan_viec == null || y.nhan_viec === '') canh_bao.push(`${tep}: thiếu nhan_viec`);
  const nhom = {
    nhom: y.nhom == null ? '' : String(y.nhom),
    doi_tuong: y.doi_tuong == null ? '' : String(y.doi_tuong),
    khuon,
    nhan_dien: nd.nhan_dien,
    khong_doc_duoc: nd.khong_doc_duoc,
    mau_dang_chay: mau,
    khe_bat_buoc: mang(y.khe_bat_buoc).map(String),
    cam_ngoai_khuon: cam,
    cam_ho: camHo,
    thay_cho: thay,
    ngoai_le: ngoaiLe,
    don_vi: donVi,
    nhan_viec: y.nhan_viec == null || y.nhan_viec === '' ? null : (typeof y.nhan_viec === 'string' ? y.nhan_viec : JSON.stringify(y.nhan_viec)),
    dung_khi: dungKhi || null,
    tep,
  };
  return { nhom, sai, canh_bao };
}

// ── Thư mục bản đồ của một kho ────────────────────────────────────────────────────────────────────────────────
function git(root, ...a) { return execFileSync('git', ['-C', root, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); }
function tepNhom(root) {
  const d = path.join(root, THU_MUC);
  if (!fs.existsSync(d) || !fs.statSync(d).isDirectory()) return null;
  return fs.readdirSync(d).filter(f => f.endsWith('.md') && !TEN_DANH_RIENG.includes(f)).sort();
}

// docThuMuc(root, {ghim}) → { co_thu_muc, nhom, sai, canh_bao, doi_sau_ghim }
// ghim = { <nhóm>: <băm blob git> } (từ khuon-nap.json): nhóm đã ghim đọc ở băm ghim; bản trên cây khác băm → tên
// nhóm vào doi_sau_ghim. Nhóm chưa ghim đọc bản trên cây.
function docThuMuc(root, opts) {
  const ra = { co_thu_muc: false, nhom: [], sai: [], canh_bao: [], doi_sau_ghim: [] };
  const ds = tepNhom(root);
  if (!ds) return ra;
  ra.co_thu_muc = true;
  const ghim = (opts && opts.ghim) || {};
  const daThay = new Map();
  for (const f of ds) {
    const rel = path.join(THU_MUC, f).split(path.sep).join('/');
    let text = fs.readFileSync(path.join(root, rel), 'utf8');
    let doc = docBanDo(text, rel);
    const ghimBlob = doc.nhom && ghim[doc.nhom.nhom];
    if (ghimBlob) {
      let bamCay = '';
      try { bamCay = git(root, 'hash-object', rel).trim(); } catch (_) { bamCay = ''; }
      if (bamCay !== ghimBlob) {
        try { text = git(root, 'cat-file', '-p', ghimBlob); doc = docBanDo(text, rel); ra.doi_sau_ghim.push(doc.nhom ? doc.nhom.nhom : f); }
        catch (_) { ra.sai.push(`${rel}: băm ghim ${ghimBlob.slice(0, 12)} không có trong kho`); }
      }
    }
    ra.sai.push(...doc.sai);
    ra.canh_bao.push(...doc.canh_bao);
    if (!doc.nhom) continue;
    const n = doc.nhom;
    if (n.nhom && daThay.has(n.nhom)) ra.sai.push(`${rel}: nhóm «${n.nhom}» trùng với ${daThay.get(n.nhom)}`);
    else if (n.nhom) daThay.set(n.nhom, rel);
    if (n.mau_dang_chay.tep && !fs.existsSync(path.join(root, n.mau_dang_chay.tep))) ra.sai.push(`${rel}: mau_dang_chay.tep không có: ${n.mau_dang_chay.tep}`);
    for (const x of n.ngoai_le) if (x.tep && !fs.existsSync(path.join(root, x.tep))) ra.sai.push(`${rel}: ngoai_le trỏ tệp không có: ${x.tep}`);
    ra.nhom.push(n);
  }
  return ra;
}

// nhomCuaTep(banDo, tep) → Nhom[] — chỉ nhóm có nhan_dien đọc được.
function nhomCuaTep(banDo, tep) {
  return (banDo.nhom || []).filter(n => Array.isArray(n.nhan_dien) && n.nhan_dien.some(g => pathGlobToRe(g).test(tep)));
}

// ── Phép kiểm một tệp theo một nhóm — đọc theo MẪU CHỮ (design doc §7: xuất lại có đổi tên, thẻ qua biến, «ở gốc»
// không thấy; ngưỡng mở bộ đọc cây mã DFK-C1 là một lệch lọt qua đúng các dạng này) ────────────────────────────────
const RE_DONG = /\bimport\s*\(|\brequire\s*\(/;
const thoatRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Khai báo nhập: tên gốc → tên cục bộ ({ X as Y } → X ↦ Y; mặc định X → X ↦ X) và các namespace (`* as ns`).
function phanTichNhap(noi) {
  const goc = new Map();
  const ns = [];
  for (const m of noi.matchAll(/\bimport\s+(?:type\s+)?([^'";]*?)\s+from\s+['"][^'"]+['"]/g)) {
    const spec = m[1].trim();
    const mNs = /\*\s*as\s+([A-Za-z_$][\w$]*)/.exec(spec);
    if (mNs) ns.push(mNs[1]);
    const mTen = /\{([^}]*)\}/.exec(spec);
    if (mTen) for (const p of mTen[1].split(',')) {
      const t = p.trim().replace(/^type\s+/, '');
      if (!t) continue;
      const [g, c] = t.split(/\s+as\s+/).map(x => x.trim());
      goc.set(g, c || g);
    }
    const mMd = /^([A-Za-z_$][\w$]*)\s*(?:,|$)/.exec(spec);
    if (mMd) goc.set(mMd[1], mMd[1]);
  }
  return { goc, ns };
}
const demThe = (noi, ten) => (noi.match(new RegExp(`<${thoatRe(ten)}(?![\\w$.])`, 'g')) || []).length;
// lechTrongTep(nhom, tep, noiDung) → { lech: {tep, khoi, loai, thay?, so}[], khong_do: string[] }
// so = số lần cặp (tệp, khối) xuất hiện — nợ cũ so theo cặp và số lần, không theo dòng đổi.
function lechTrongTep(nhom, tep, noiDung) {
  const noi = String(noiDung || '');
  if (RE_DONG.test(noi)) return { lech: [], khong_do: ['nhập động'] };
  const { goc, ns } = phanTichNhap(noi);
  const laCam = k => nhom.cam_ngoai_khuon.includes(k) || nhom.cam_ho.some(h => new RegExp(`^${thoatRe(h)}[A-Z]`).test(k));
  const dem = new Map();
  const cong = (k, n) => dem.set(k, (dem.get(k) || 0) + n);
  for (const [g, c] of goc) if (laCam(g)) cong(g, Math.max(1, demThe(noi, c)));
  for (const n of ns) {
    const thay = new Map();
    for (const m of noi.matchAll(new RegExp(`\\b${thoatRe(n)}\\.([A-Z][\\w$]*)`, 'g'))) thay.set(m[1], (thay.get(m[1]) || 0) + 1);
    for (const [k, v] of thay) if (laCam(k)) cong(k, v);
  }
  const lech = [...dem].map(([khoi, so]) => ({ tep, khoi, loai: 'cam', so, ...(nhom.thay_cho[khoi] ? { thay: nhom.thay_cho[khoi] } : {}) }));
  const khong_do = [];
  const ten = nhom.khuon.ten;
  // Tệp dựng thẳng lớp trình bày đã khai được tính là theo khuôn (Hỏi-1 của khuon-doc-ban-do-that: miễn đúng tên).
  const tenDung = [ten, ...(nhom.khuon.lop_trinh_bay || [])];
  const cucBo = tenDung.flatMap(t => [...(goc.has(t) ? [goc.get(t)] : []), ...ns.map(n => `${n}.${t}`)]);
  if (nhom.don_vi === 'man') {
    if (!cucBo.some(c => demThe(noi, c) > 0)) lech.push({ tep, khoi: ten, loai: 'khuon', so: 1 });
  } else if (nhom.khe_bat_buoc.length) {
    const thieu = new Map();
    for (const c of cucBo) for (const m of noi.matchAll(new RegExp(`<${thoatRe(c)}(?![\\w$.])([^>]*)>`, 'g'))) {
      const thuocTinh = m[1];
      if (/\{\s*\.\.\./.test(thuocTinh)) { if (!khong_do.includes('thẻ mang spread')) khong_do.push('thẻ mang spread'); continue; }
      const tuDong = /\/\s*$/.test(thuocTinh);
      for (const k of nhom.khe_bat_buoc) {
        const co = k === 'children' ? !tuDong : new RegExp(`(^|\\s)${thoatRe(k)}(\\s*=|\\s|/|$)`).test(thuocTinh);
        if (!co) thieu.set(k, (thieu.get(k) || 0) + 1);
      }
    }
    for (const [k, so] of thieu) lech.push({ tep, khoi: `${ten} thiếu khe ${k}`, loai: 'khe', so });
  }
  return { lech, khong_do };
}

// ── Thẻ Cổng Bằng chứng: chỉ ĐỌC khuon-cham.json (nếp luat-cham.json của luat-san-pham.cjs) ─────────────────────
const CO_CHUA_CHAM = 'Khuôn: chưa chấm khuôn trên bản đã chấm — chạy design-floor-khuon.mjs --kiem --write sau lượt chấm';
// demLechLot(text) — số dòng mục theo khuôn LECH-LOT-TEMPLATE (`- <ngày> · <tệp> · <khối> · <vì sao>`), bỏ dòng mẫu.
function demLechLot(text) {
  return String(text || '').split(/\r?\n/).filter(l => /^- (?!<)\S.* · .+ · .+ · .+/.test(l)).length;
}
const fmGia = (t, k) => { const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(String(t || '')); if (!m) return ''; const mm = new RegExp(`^${k}\\s*:\\s*(.*)$`, 'm').exec(m[1]); return mm ? mm[1].replace(/\s+#.*$/, '').trim() : ''; };
// Tệp mà hồ sơ chạm: merge-base(nhánh chính, den)...den. Không dò được → null (bên gọi coi là chạm: cờ, không im).
function tepHoSo(root, den) {
  let ten = null;
  try { ten = git(root, 'symbolic-ref', '--quiet', '--short', 'refs/remotes/origin/HEAD').trim(); } catch (_) { ten = null; }
  for (const ref of [...(ten ? [ten] : []), 'origin/main', 'origin/master', 'main', 'master']) {
    try {
      const mb = git(root, 'merge-base', den, ref).trim();
      return git(root, 'diff', '--name-only', '-z', `${mb}...${den}`).split('\0').filter(Boolean);
    } catch (_) { /* thử ref kế */ }
  }
  return null;
}
// Dòng người đọc của một mục lệch — MỘT nguồn cho bước chấm (design-floor-khuon.mjs) và thẻ Cổng Bằng chứng (KH2).
function dongLech(x) {
  if (x.loai === 'quan-he') return `lệch: ${x.tep} · thuộc hai nhóm màn: ${x.nhom}`;
  const khoi = x.loai === 'khuon' ? `khuôn ${x.khoi}` : x.khoi;
  return `lệch: ${x.tep} · ${khoi} · nhóm ${x.nhom}${x.thay ? ` · dùng ${x.thay}` : ''}${x.tu > 0 ? ` · tăng ${x.tu} → ${x.den_so}` : ''}`;
}
const docJson = p => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (_) { return null; } };
const chonNap = (root, slug) => { const j = docJson(path.join(root, '_acceptance', slug, 'khuon-nap.json')); return j && j.chon && typeof j.chon === 'object' ? j.chon : null; };

// ── Thẻ Cổng Phạm vi (KH2) ───────────────────────────────────────────────────────────────────────────────────
const CO_CHUA_CHON = 'S1 chưa ghi đã chọn nhóm khuôn nào — chạy bước nạp kèm --nhom';
const CO_DOI_MAU = 'màn mẫu đổi sau khi S1 đọc — đọc lại trước khi duyệt';
const MAT_NGUOI = ['ui', 'web', 'web-ui'];
const TRUONG_THE_VIEC = { 'ai dùng': 'ai_dung', 'việc chính': 'viec_chinh', 'tần suất': 'tan_suat', 'số bản ghi': 'so_ban_ghi', 'thiết bị': 'thiet_bi' };
// docTheViec(designTxt) → null | năm trường của mục «Thẻ việc» (bảng khuôn ux-spec-template.md), đọc theo TÊN trường.
function docTheViec(designTxt) {
  const dong = String(designTxt || '').split(/\r?\n/);
  const i = dong.findIndex(l => /^#{1,6}\s.*Thẻ việc/.test(l.normalize('NFC')));
  if (i < 0) return null;
  const ra = {};
  for (const l of dong.slice(i + 1)) {
    if (/^#{1,6}\s/.test(l)) break;
    const m = /^\|(.*)\|\s*$/.exec(l.trim());
    if (!m) continue;
    const o = m[1].split('|').map(x => x.trim());
    const k = TRUONG_THE_VIEC[(o[0] || '').normalize('NFC').toLowerCase()];
    if (k && o[1] && !o[1].includes('{{')) ra[k] = o[1];
  }
  return Object.values(TRUONG_THE_VIEC).every(k => ra[k]) ? ra : null;
}
const bamTep = (root, rel) => { if (!rel || !fs.existsSync(path.join(root, rel))) return null; return git(root, 'hash-object', '--', rel).trim(); };
// theCong1({root, slug, contractTxt, designTxt, decisionsTxt}) → null (kho không khai bản đồ, hay hồ sơ không chọn và
// không có mặt người nhìn — thẻ y nguyên) | { dong: [chuỗi], co: [chuỗi] }
function theCong1({ root, slug, contractTxt, designTxt, decisionsTxt }) {
  const coBanDo = tepNhom(root);
  if (!coBanDo) return null;
  const chon = chonNap(root, slug);
  const matNguoi = fmGia(contractTxt, 'surfaces').replace(/^\[|\]$/g, '').split(',').map(x => x.trim().replace(/^["']|["']$/g, '')).some(x => MAT_NGUOI.includes(x));
  const dong = [];
  const co = [];
  if (!chon) {
    if (matNguoi) co.push(CO_CHUA_CHON);
    return co.length ? { dong, co } : null;
  }
  if (chon.nhom) {
    const n = docThuMuc(root).nhom.find(x => x.nhom === chon.nhom);
    if (!n) return { dong: [`nhóm ${chon.nhom} không còn trong bản đồ`], co };
    dong.push(`Nhóm: ${n.nhom} — ${n.doi_tuong || '—'}`);
    dong.push(`nhận việc: ${n.nhan_viec || '—'}`);
    const mau = chon.mau || {};
    if (mau.bam == null) dong.push(`Màn mẫu: ${mau.tep || '—'} · màn mẫu không có trên đĩa`);
    else {
      const bamHienTai = bamTep(root, mau.tep);
      const khop = bamHienTai === mau.bam;
      dong.push(`Màn mẫu: ${mau.tep} · ${khop ? 'băm khớp' : 'đã đổi sau khi S1 đọc'}`);
      if (!khop) co.push(CO_DOI_MAU);
    }
  } else if (chon.moi) {
    dong.push(`Nhóm mới: ${chon.moi} (${chon.gan ? `gần: ${chon.gan}` : 'không có nhóm gần'})`);
    const so = String(decisionsTxt || '').split(/\r?\n/).map(l => { try { return JSON.parse(l); } catch (_) { return null; } }).filter(Boolean);
    const coCau = so.some(e => e.stage === 'S1' && e.can_cu && e.can_cu.nguon === 'chi-nguoi' && String(e.decision || '').includes(chon.moi));
    if (!coCau) co.push(`nhóm mới ${chon.moi} chưa thành câu hỏi ở cổng`);
  }
  const tv = docTheViec(designTxt);
  dong.push(tv ? `Thẻ việc: ai dùng ${tv.ai_dung} · việc chính ${tv.viec_chinh} · tần suất ${tv.tan_suat} · số bản ghi ${tv.so_ban_ghi} · thiết bị ${tv.thiet_bi}` : 'Thẻ việc: chưa điền');
  return { dong, co };
}

// theCong2({root, slug, contractTxt, evidenceTxt}) → null (kho không khai bản đồ) | { dong, co, lech, co2 }
function theCong2({ root, slug, contractTxt, evidenceTxt }) {
  if (!tepNhom(root)) return null;
  let cham = null;
  try { cham = JSON.parse(fs.readFileSync(path.join(root, '_acceptance', slug, 'khuon-cham.json'), 'utf8')); } catch (_) { cham = null; }
  let lot = '';
  const lotP = path.join(root, THU_MUC, 'lech-lot.md');
  if (fs.existsSync(lotP)) lot = ` · sổ lệch lọt: ${demLechLot(fs.readFileSync(lotP, 'utf8'))} mục`;
  const dem = k => (Array.isArray(cham && cham[k]) ? cham[k].length : 0);
  const dong = cham ? `Khuôn: ${dem('theo_khuon')} tệp theo khuôn · ${dem('lech_moi')} lệch mới · nợ cũ ${dem('no_cu')} · không đo ${dem('khong_do')}${lot}` : null;
  const W = require('../lib/workspace-record.cjs');
  const daQua = [...W.DA_THONG_CONG_2, ...(W.DA_DONG_THUC_TE || [])].includes(fmGia(contractTxt, 'status').toLowerCase());
  let co = null;
  if (!daQua) {
    const vc = fmGia(evidenceTxt, 'verified_commit') || 'HEAD';
    const chuaCham = !cham || cham.den !== vc;
    const ds = tepHoSo(root, vc);
    const bd = docThuMuc(root);
    const chamVung = ds === null || ds.some(f => !f.startsWith('_acceptance/') && nhomCuaTep(bd, f).length > 0);
    if (chuaCham && chamVung) co = CO_CHUA_CHAM;
  }
  // KH2: tối đa năm dòng lệch mới (đúng chuỗi bước chấm in) + cờ vật chạm nhóm màn khác nhóm S1 đã chọn.
  const lechMoi = Array.isArray(cham && cham.lech_moi) ? cham.lech_moi : [];
  const lech = lechMoi.slice(0, 5).map(dongLech);
  if (lechMoi.length > 5) lech.push(`… và ${lechMoi.length - 5} lệch nữa`);
  const co2 = [];
  const chon = chonNap(root, slug);
  if (cham && chon && chon.nhom) {
    const bd = docThuMuc(root);
    const tep = [...(Array.isArray(cham.theo_khuon) ? cham.theo_khuon : []), ...lechMoi.map(x => x.tep)];
    const khac = [...new Set(tep.flatMap(f => nhomCuaTep(bd, f).filter(n => n.don_vi === 'man' && n.nhom !== chon.nhom).map(n => n.nhom)))];
    if (khac.length) co2.push(`vòng chọn nhóm ${chon.nhom} mà vật chạm nhóm ${khac.join(', ')}`);
  }
  return { dong, co, lech, co2 };
}

module.exports = { KHOA_LOI, KHOA_MO_RONG, TEN_DANH_RIENG, THU_MUC, KHONG_DOC_SO_DANG_KY, docBanDo, docThuMuc, nhomCuaTep, lechTrongTep, tachFrontmatter, theCong1, theCong2, docTheViec, dongLech, demLechLot };

// ── CLI: `--root <kho> --json` in bản đồ đã chuẩn hoá (cho lint của kho) ──────────────────────────────────────
if (require.main === module) {
  const a = process.argv.slice(2);
  const iRoot = a.indexOf('--root');
  const root = iRoot >= 0 ? a[iRoot + 1] : '.';
  if (!a.includes('--json') || (iRoot >= 0 && !root)) { process.stderr.write('dùng: ban-do-khuon.cjs --root <kho> --json\n'); process.exit(2); }
  const bd = docThuMuc(path.resolve(root));
  if (!bd.co_thu_muc) process.exit(0);
  process.stdout.write(JSON.stringify({ nhom: bd.nhom.map(n => ({ ...n })), sai: bd.sai, canh_bao: bd.canh_bao }, null, 2) + '\n');
}
