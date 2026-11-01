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
const KHONG_DOC_SO_DANG_KY = 'nhan_dien dạng sổ đăng ký — thêm tep: [glob] để bước chấm biết tệp nào thuộc nhóm';

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
  for (const k of Object.keys(y)) if (!KHOA_LOI.includes(k) && !KHOA_MO_RONG.includes(k)) canh_bao.push(`${tep}: khoá lạ: ${k}`);
  const khuon = y.khuon && typeof y.khuon === 'object' ? { ten: y.khuon.ten == null ? '' : String(y.khuon.ten), nhap: y.khuon.nhap == null ? '' : String(y.khuon.nhap) } : { ten: '', nhap: '' };
  if ('khuon' in y && !khuon.ten) sai.push(`${tep}: khuon thiếu ten`);
  const mau = y.mau_dang_chay && typeof y.mau_dang_chay === 'object' ? { tep: y.mau_dang_chay.tep == null ? '' : String(y.mau_dang_chay.tep) } : { tep: y.mau_dang_chay == null ? '' : String(y.mau_dang_chay) };
  const cam = mang(y.cam_ngoai_khuon).map(String);
  const camHo = mang(y.cam_ho).map(String);
  for (const h of camHo) if (!cam.includes(h)) sai.push(`${tep}: cam_ho có tên không nằm trong cam_ngoai_khuon: ${h}`);
  const ngoaiLe = mang(y.ngoai_le).map(x => (x && typeof x === 'object' ? { tep: String(x.tep || ''), khoi: String(x.khoi || ''), ly_do: String(x.ly_do || '').trim() } : { tep: '', khoi: String(x), ly_do: '' }));
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

module.exports = { KHOA_LOI, KHOA_MO_RONG, TEN_DANH_RIENG, THU_MUC, KHONG_DOC_SO_DANG_KY, docBanDo, docThuMuc, nhomCuaTep, tachFrontmatter };

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
