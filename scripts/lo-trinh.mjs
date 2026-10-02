#!/usr/bin/env node
// lo-trinh.mjs — ổ cắm ĐỌC tệp ý định của kho (lộ trình) + suy trạng thái từ hồ sơ + vẽ trang.
// Hồ sơ: _acceptance/viec-ke-theo-plan/ · design: docs/superpowers/specs/2026-10-02-viec-ke-theo-plan-design.md
//
// Hai lớp, không gộp: Ý ĐỊNH do người ghi (tệp JSON trong kho, đổi bằng PR) và TRẠNG THÁI do máy
// suy từ `_acceptance/` bằng ĐÚNG hàm xếp ô của bản đồ sản phẩm (`classify` của product-map.mjs,
// nhận qua tham số — mô-đun này không import bản đồ, nên không có vòng import và kho chưa khai
// ổ cắm không bao giờ nạp nó). Kit KHÔNG BAO GIỜ ghi vào tệp ý định: mọi hàm ở đây chỉ đọc.
//
// Trang tất định: không ngày chạy, không «hôm nay» — `--check` so byte. Ngày chỉ vào `hangTre`,
// thứ chỉ thẻ start in.
import { readFileSync, readdirSync, existsSync, statSync, realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { frontmatterField } = require(path.join(__dirname, '..', 'lib', 'evidence-core.cjs'));

const { KHOA: KHOA_, khoaTuConfig: khoaTuConfig_ } = require(path.join(__dirname, 'lo-trinh-khoa.cjs'));
export const KHOA = KHOA_;
export const TEP_TRANG = 'LO-TRINH.html';
export const CHUA_MO = 'Chưa mở';
export const KHONG_SUY = 'Không suy được';
export const TIN_THEO_LOI = 'tin theo lời';
// Ô bản đồ nào là «đã giao» và «chưa làm» — tra bằng KHOÁ ô, chữ rút từ SECTIONS của bản đồ.
export const DA_GIAO_O = ['cho-nghiem-thu', 'da-ship', 'da-nghiem-thu'];
export const CHUA_LAM_O = ['can-nhac', 'sap-mo'];
const BAT_BUOC = ['ma', 'cau_giao'];
const SLUG_RE = /^[A-Za-z0-9][A-Za-z0-9_.-]*$/;

const doc = p => { try { return readFileSync(p, 'utf8'); } catch { return null; } };
const chuoi = v => (v == null ? '' : String(v).trim());
const so = s => chuoi(s).toLowerCase();

// ── Khoá ổ cắm ────────────────────────────────────────────────────────────────
// MỘT hàm cho mọi bên đọc (scripts/lo-trinh-khoa.cjs). Rỗng / null của YAML → vắng.
export const khoaTuConfig = khoaTuConfig_;
export function docKhoa(root) {
  return khoaTuConfig(doc(path.join(root, '_acceptance', 'config.yaml')));
}

// ── Đọc tệp ───────────────────────────────────────────────────────────────────
// Mọi lỗi của TỆP KHO là một câu có tên, không bao giờ là stack trace: tệp hỏng của kho không
// được làm CI của kho đỏ, nhưng cũng không được im — trang và thẻ in đúng câu này.
export function docTep(root, tep) {
  const goc = path.resolve(root);
  const dich = path.resolve(goc, tep);
  const rel = path.relative(goc, dich);
  if (path.isAbsolute(tep) || rel.startsWith('..') || path.isAbsolute(rel))
    return { loi: `tệp ý định phải nằm trong kho: ${tep}`, data: null };
  if (!existsSync(dich) || !statSync(dich).isFile())
    return { loi: `tệp ý định không tồn tại: ${tep}`, data: null };
  let txt;
  try { txt = readFileSync(dich, 'utf8'); } catch (e) { return { loi: `tệp ý định không đọc được: ${tep} (${e.code || e.message})`, data: null }; }
  if (txt.charCodeAt(0) === 0xfeff) txt = txt.slice(1);
  let data;
  try { data = JSON.parse(txt); } catch (e) { return { loi: `tệp ý định không phải JSON hợp lệ: ${e.message}`, data: null }; }
  if (data == null || typeof data !== 'object' || Array.isArray(data))
    return { loi: 'gốc tệp ý định phải là một object', data: null };
  return { loi: null, data };
}

// ── Kiểm khuôn ────────────────────────────────────────────────────────────────
// Bắt buộc: ma · cau_giao. Mọi trường khác tuỳ chọn hoặc tự do — giữ nguyên, không cờ.
export function kiemKhuon(data) {
  const co = [];
  const hangVao = Array.isArray(data.hang) ? data.hang : [];
  if (data.hang !== undefined && !Array.isArray(data.hang)) co.push('khối hang phải là một mảng');
  const hang = [];
  const daThay = new Set(); const trung = [];
  hangVao.forEach((r, i) => {
    if (r == null || typeof r !== 'object' || Array.isArray(r)) { co.push(`hàng #${i + 1} không phải object`); return; }
    const ma = chuoi(r.ma);
    const nhan = ma || `#${i + 1}`;
    for (const f of BAT_BUOC) if (!chuoi(r[f])) co.push(`hàng ${nhan} thiếu ${f}`);
    // Trường kit đọc lấy NGHĨA mà sai kiểu thì nói ra — coi như rỗng là để hàng còn chờ hiện thành hàng kế.
    if (r.dung_tren !== undefined && !Array.isArray(r.dung_tren)) co.push(`hàng ${nhan}: dung_tren phải là một mảng`);
    if (ma) { if (daThay.has(ma) && !trung.includes(ma)) trung.push(ma); daThay.add(ma); }
    hang.push({ ...r, _nhan: nhan, _ma: ma });
  });
  for (const m of trung) co.push(`mã trùng: ${m}`);
  const moc = (Array.isArray(data.moc) ? data.moc : []).filter(m => m && typeof m === 'object');
  for (const m of moc) if (m.hang !== undefined && !Array.isArray(m.hang)) co.push(`mốc ${chuoi(m.ten) || chuoi(m.ngay) || '?'}: hang phải là một mảng`);
  const daBac = (Array.isArray(data.da_bac) ? data.da_bac : []).filter(m => m && typeof m === 'object');
  // Từ vựng tự khai của KHO: chữ riêng của kho → tên trạng thái của kit. Kho khai, kit chỉ đọc.
  const tuVung = {};
  if (data.tu_vung !== undefined) {
    if (data.tu_vung == null || typeof data.tu_vung !== 'object' || Array.isArray(data.tu_vung)) co.push('khối tu_vung phải là một object');
    else for (const [k, v] of Object.entries(data.tu_vung)) tuVung[so(k)] = chuoi(v);
  }
  return { ten: chuoi(data.ten), hang, moc, daBac, tuVung, co };
}

// ── Suy trạng thái ────────────────────────────────────────────────────────────
// `classify(dir, slug) → { key }` và `sections: [[key, title]…]` của bản đồ, nhận qua tham số.
export function suyTrangThai({ root, khuon, classify, sections }) {
  const TEN = Object.fromEntries(sections);
  const tuVung = new Map([...sections.map(([, t]) => t), CHUA_MO].map(t => [so(t), t]));
  const daGiao = new Set(DA_GIAO_O.map(k => TEN[k]));
  const chuaLam = new Set([CHUA_MO, ...CHUA_LAM_O.map(k => TEN[k])]);
  const acc = path.join(root, '_acceptance');
  const cache = new Map();
  const xep = slug => {
    if (!cache.has(slug)) cache.set(slug, classify(path.join(acc, slug), slug));
    return cache.get(slug);
  };
  const co = [...khuon.co];
  const tuVungKho = khuon.tuVung || {};
  for (const [k, v] of Object.entries(tuVungKho)) if (!tuVung.has(so(v))) co.push(`tu_vung: «${k}» trỏ «${v}» — không phải tên trạng thái`);
  let tuKhaiNgoai = 0;
  const dong = khuon.hang.map(r => {
    const coHang = [];
    const slug = chuoi(r.slug);
    const tuKhai = chuoi(r.trang_thai);
    const quyDoi = tuKhai && tuVungKho[so(tuKhai)] !== undefined ? tuVungKho[so(tuKhai)] : tuKhai;
    const khaiChuan = quyDoi ? tuVung.get(so(quyDoi)) : undefined;
    if (tuKhai && !khaiChuan) tuKhaiNgoai += 1;
    let chu; let tinTheoLoi = false; let coHoSo = false;
    if (slug && !SLUG_RE.test(slug)) {
      coHang.push(`hàng ${r._nhan}: slug không hợp lệ: ${slug}`);
      chu = CHUA_MO;
    } else if (slug && existsSync(path.join(acc, slug)) && statSync(path.join(acc, slug)).isDirectory()) {
      coHoSo = true;
      chu = TEN[xep(slug).key];
    } else if (slug) {
      chu = CHUA_MO;
    } else {
      tinTheoLoi = true;
      // Tự khai không quy đổi được thì KHÔNG đoán: «Chưa mở» sẽ biến một hàng đã xong thành hàng
      // kế (đo trên crm OKR 02/10, hàng «0» khai «xong»).
      chu = khaiChuan || (tuKhai ? KHONG_SUY : CHUA_MO);
    }
    // Chỉ so khi CÓ hồ sơ: slug dự kiến chưa có thư mục thì không có gì để «khác» (bảng design §Trạng thái).
    if (coHoSo && khaiChuan && khaiChuan !== chu)
      coHang.push(`hàng ${r._nhan}: tệp khai khác hồ sơ: khai ${tuKhai}${quyDoi !== tuKhai ? ` (${khaiChuan})` : ''}, hồ sơ ${chu}`);
    if (coHoSo && chuoi(r.hang)) {
      const c = doc(path.join(acc, slug, 'contract.md'));
      const t = c == null ? '' : chuoi(frontmatterField(c, 'risk_tier'));
      if (t && t !== chuoi(r.hang)) coHang.push(`hàng ${r._nhan}: hạng tệp ${chuoi(r.hang)}, hồ sơ ${t}`);
    }
    return { ...r, slug: slug || undefined, chu, tinTheoLoi, coHoSo, tuKhai: tuKhai || null, khaiNgoai: !!(tuKhai && !khaiChuan), coHang };
  });
  const theoMa = new Map();
  for (const d of dong) if (d._ma && !theoMa.has(d._ma)) theoMa.set(d._ma, d);
  for (const d of dong) {
    for (const x of (Array.isArray(d.dung_tren) ? d.dung_tren : []).map(chuoi)) {
      if (!theoMa.has(x)) d.coHang.push(`hàng ${d._nhan}: đứng trên mã không có: ${x}`);
    }
  }
  // Vòng trong dung_tren: không treo, nêu một lần mỗi vòng.
  const trangThaiDfs = new Map(); const vongDaNeu = new Set();
  const dfs = (ma, duong) => {
    trangThaiDfs.set(ma, 1);
    const d = theoMa.get(ma);
    for (const x of (Array.isArray(d?.dung_tren) ? d.dung_tren : []).map(chuoi)) {
      if (!theoMa.has(x)) continue;
      if (trangThaiDfs.get(x) === 1) {
        const i = duong.indexOf(x); const vong = [...duong.slice(i), x];
        const khoaVong = [...vong.slice(0, -1)].sort().join('|');
        if (!vongDaNeu.has(khoaVong)) { vongDaNeu.add(khoaVong); co.push(`đứng trên tạo vòng: ${vong.join(' → ')}`); }
      } else if (!trangThaiDfs.get(x)) dfs(x, [...duong, x]);
    }
    trangThaiDfs.set(ma, 2);
  };
  for (const ma of theoMa.keys()) if (!trangThaiDfs.get(ma)) dfs(ma, [ma]);
  for (const d of dong) co.push(...d.coHang);

  const daGiaoMa = ma => { const d = theoMa.get(ma); return !!d && daGiao.has(d.chu); };
  const duDieuKien = d => {
    if (d.dung_tren !== undefined && !Array.isArray(d.dung_tren)) return false;
    return (Array.isArray(d.dung_tren) ? d.dung_tren : []).map(chuoi).every(x => theoMa.has(x) && daGiaoMa(x));
  };
  const ke = dong.find(d => chuaLam.has(d.chu) && duDieuKien(d)) || null;
  const hangKe = ke ? { ma: ke._nhan, cauGiao: chuoi(ke.cau_giao) || '(hàng chưa có câu giao)', dungTren: (Array.isArray(ke.dung_tren) ? ke.dung_tren : []).map(chuoi).map(x => ({ ma: x, chu: theoMa.get(x)?.chu || null })) } : null;

  // Vòng ngoài lộ trình: hồ sơ không hàng nào trỏ — đếm, không cờ.
  const troi = new Set(dong.map(d => d.slug).filter(Boolean));
  const ngoaiLoTrinh = existsSync(acc)
    ? readdirSync(acc, { withFileTypes: true }).filter(e => e.isDirectory() && !troi.has(e.name)).map(e => e.name).sort()
    : [];
  // Hàng sống qua Cổng Đáng: mỗi slug một lần; n = hồ sơ có opportunity đã decided.
  let n = 0; let k = 0;
  for (const s of [...troi].sort()) {
    const o = doc(path.join(acc, s, 'opportunity.md'));
    if (o == null) continue;
    if (so(frontmatterField(o, 'stage')) !== 'decided') continue;
    n += 1;
    if (['build', 'iterate'].includes(so(frontmatterField(o, 'decision')))) k += 1;
  }
  const demTheoO = {};
  for (const d of dong) demTheoO[d.chu] = (demTheoO[d.chu] || 0) + 1;
  return {
    ten: khuon.ten, dong, co, hangKe, ngoaiLoTrinh, songQuaCongDang: { k, n }, tuKhaiNgoai,
    tinTheoLoi: { n: dong.filter(d => d.tinTheoLoi).length, tong: dong.length },
    moc: khuon.moc, daBac: khuon.daBac, demTheoO, daGiao,
  };
}

// Hàng trễ: mốc có ngày < hôm nay, hàng gắn mốc chưa giao. CHỈ thẻ start dùng (trang tất định).
export function hangTre(kq, today) {
  const ra = []; const daCo = new Set();
  const theoMa = new Map(kq.dong.filter(d => d._ma).map(d => [d._ma, d]));
  for (const m of kq.moc) {
    const ngay = chuoi(m.ngay);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(ngay) || !(ngay < today)) continue;
    for (const ma of (Array.isArray(m.hang) ? m.hang : []).map(chuoi)) {
      const d = theoMa.get(ma);
      if (!d || kq.daGiao.has(d.chu) || daCo.has(ma)) continue;
      daCo.add(ma); ra.push({ ma, moc: chuoi(m.ten), ngay });
    }
  }
  return ra;
}

// ── Trang ─────────────────────────────────────────────────────────────────────
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const CSS = `:root{--bg:#fbfaf7;--fg:#1d1d1b;--mu:#6b6862;--ln:#e3e0d8;--ac:#2f5d8a;--wa:#8a5a00;--wabg:#fff4dc;--ok:#2e6b3a}
@media (prefers-color-scheme:dark){:root{--bg:#171715;--fg:#ecebe6;--mu:#a19e96;--ln:#34332f;--ac:#8fb6dd;--wa:#f0c36a;--wabg:#33290f;--ok:#8fcf9a}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:1100px;margin:0 auto;padding:24px 16px 48px}h1{font-size:22px;margin:0 0 4px}h2{font-size:16px;margin:28px 0 8px}
.mu{color:var(--mu)}.tom{display:flex;flex-wrap:wrap;gap:6px 14px;margin:10px 0}.tom span{white-space:nowrap}
table{width:100%;border-collapse:collapse;font-size:14px}th,td{text-align:left;vertical-align:top;padding:6px 8px;border-bottom:1px solid var(--ln)}
th{font-weight:600;color:var(--mu)}.wrap{overflow-x:auto}.chu{font-weight:600}.giao{color:var(--ok)}
.co{background:var(--wabg);color:var(--wa);border-radius:6px;padding:2px 6px;display:inline-block;margin:2px 0;font-size:13px}
.ke{border:1px solid var(--ac);border-radius:8px;padding:10px 14px}ul{margin:4px 0;padding-left:20px}`;

function khung(tieuDe, than) {
  return `<!doctype html>\n<html lang="vi">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>${esc(tieuDe)}</title>\n<style>\n${CSS}\n</style>\n</head>\n<body>\n<main>\n${than}\n</main>\n</body>\n</html>\n`;
}

export function renderLoi(tep, loi) {
  return khung('Lộ trình', `<h1>Lộ trình</h1>\n<p class="mu">Vẽ từ tệp ý định <code>${esc(tep)}</code> và hồ sơ trong <code>_acceptance/</code> — đừng sửa tay.</p>\n<p class="co">Không đọc được tệp ý định: ${esc(loi)}</p>`);
}

export function renderTrang(kq, tep) {
  const ten = kq.ten || 'Lộ trình';
  const P = [];
  P.push(`<h1>${esc(ten)}</h1>`);
  P.push(`<p class="mu">Vẽ từ tệp ý định <code>${esc(tep)}</code> và hồ sơ trong <code>_acceptance/</code> mỗi lần bản đồ sản phẩm được vẽ lại — đừng sửa tay. Trạng thái lấy từ hồ sơ; hàng không có slug là tin theo lời.</p>`);
  const dem = Object.entries(kq.demTheoO).map(([c, n]) => `<span>${esc(c)}: <b>${n}</b></span>`).join('');
  P.push(`<div class="tom">${dem}<span>Tin theo lời: <b>${kq.tinTheoLoi.n}/${kq.tinTheoLoi.tong}</b></span><span>Hàng sống qua Cổng Đáng: <b>${kq.songQuaCongDang.k}/${kq.songQuaCongDang.n}</b></span></div>`);
  if (kq.tuKhaiNgoai > 0) P.push(`<p class="co">${kq.tuKhaiNgoai} hàng tự khai ngoài từ vựng — không so được với hồ sơ</p>`);
  P.push('<h2>Hàng kế</h2>');
  if (kq.hangKe) {
    const dt = kq.hangKe.dungTren.length
      ? `<p>Đủ điều kiện vì mọi hàng nó đứng trên đã giao: ${kq.hangKe.dungTren.map(x => `${esc(x.ma)} (${esc(x.chu)})`).join(' · ')}</p>`
      : '<p>Đủ điều kiện: không đứng trên hàng nào.</p>';
    P.push(`<div class="ke"><p><b>${esc(kq.hangKe.ma)}</b> — ${esc(kq.hangKe.cauGiao)}</p>${dt}</div>`);
  } else P.push('<p class="mu">Chưa có hàng đủ điều kiện mở.</p>');
  P.push('<h2>Các hàng</h2>');
  const rows = kq.dong.map(d => {
    const chu = `<span class="chu${kq.daGiao.has(d.chu) ? ' giao' : ''}">${esc(d.chu)}</span>${d.tinTheoLoi ? ` <span class="mu">(${TIN_THEO_LOI})</span>` : ''}`;
    const khai = d.khaiNgoai ? `<div class="mu">tự khai: ${esc(d.tuKhai)}</div>` : '';
    const cos = d.coHang.map(c => `<div class="co">${esc(c)}</div>`).join('');
    const dt = (Array.isArray(d.dung_tren) ? d.dung_tren : []).map(chuoi).join(', ');
    return `<tr><td>${esc(d._nhan)}</td><td>${esc(chuoi(d.cau_giao))}${d.slug ? `<div class="mu"><code>${esc(d.slug)}</code></div>` : ''}</td><td>${esc(chuoi(d.hang))}</td><td>${esc(dt)}</td><td>${chu}${khai}${cos}</td><td>${esc(chuoi(d.bat_khi))}</td><td>${esc(chuoi(d.vi_sao))}</td></tr>`;
  });
  P.push(`<div class="wrap"><table><thead><tr><th>Mã</th><th>Câu giao</th><th>Hạng</th><th>Đứng trên</th><th>Trạng thái</th><th>Bật khi</th><th>Vì sao</th></tr></thead><tbody>\n${rows.join('\n')}\n</tbody></table></div>`);
  P.push('<h2>Mốc</h2>');
  P.push(kq.moc.length
    ? `<ul>${kq.moc.map(m => `<li>${esc(chuoi(m.ngay))} · ${esc(chuoi(m.ten))}${chuoi(m.loai) ? ` · ${esc(chuoi(m.loai))}` : ''}${Array.isArray(m.hang) && m.hang.length ? ` · hàng ${esc(m.hang.map(chuoi).join(', '))}` : ''}</li>`).join('')}</ul>`
    : '<p class="mu">Không có mốc.</p>');
  P.push('<h2>Đã bác</h2>');
  P.push(kq.daBac.length
    ? `<ul>${kq.daBac.map(b => `<li>${esc(chuoi(b.ma))} — ${esc(chuoi(b.ly_do))}</li>`).join('')}</ul>`
    : '<p class="mu">Không có mục đã bác.</p>');
  P.push('<h2>Vòng ngoài lộ trình</h2>');
  P.push(kq.ngoaiLoTrinh.length
    ? `<p>${kq.ngoaiLoTrinh.length} hồ sơ không hàng nào trỏ tới — hợp lệ (sửa lỗi, sự cố, việc ship thẳng):</p><ul>${kq.ngoaiLoTrinh.map(s => `<li><code>${esc(s)}</code></li>`).join('')}</ul>`
    : '<p class="mu">Không có.</p>');
  P.push('<h2>Cờ</h2>');
  P.push(kq.co.length ? `<ul>${kq.co.map(c => `<li class="co">${esc(c)}</li>`).join('')}</ul>` : '<p class="mu">Không có cờ.</p>');
  return khung(ten, P.join('\n'));
}

// ── Hai lối vào cho hai bên đọc ───────────────────────────────────────────────
// Bản đồ: trang của kho (hoặc null khi ổ cắm vắng). Thẻ start: khoá `loTrinh` (null khi vắng).
export function phanTich({ root, classify, sections }) {
  const tep = docKhoa(root);
  if (tep == null) return null;
  const { loi, data } = docTep(root, tep);
  if (loi) return { tep, loi, kq: null };
  return { tep, loi: null, kq: suyTrangThai({ root, khuon: kiemKhuon(data), classify, sections }) };
}
export function veTrang(opts) {
  const p = phanTich(opts);
  if (p == null) return null;
  return p.loi ? renderLoi(p.tep, p.loi) : renderTrang(p.kq, p.tep);
}
export function loTrinhThe({ root, classify, sections, today }) {
  const p = phanTich({ root, classify, sections });
  if (p == null) return null;
  if (p.loi) return { tep: p.tep, ten: null, loi: p.loi, hangKe: null, hangTre: [], tinTheoLoi: { n: 0, tong: 0 }, tuKhaiNgoai: 0, co: [] };
  const kq = p.kq;
  return {
    tep: p.tep, ten: kq.ten || null, loi: null,
    hangKe: kq.hangKe ? { ma: kq.hangKe.ma, cauGiao: kq.hangKe.cauGiao } : null,
    hangTre: hangTre(kq, today), tinTheoLoi: kq.tinTheoLoi, tuKhaiNgoai: kq.tuKhaiNgoai, co: kq.co,
  };
}

// ── CLI: feature-loop S0 nhận một hàng ────────────────────────────────────────
const isMain = (() => {
  if (!process.argv[1]) return false;
  try { return realpathSync(process.argv[1]) === realpathSync(__filename); } catch { return path.resolve(process.argv[1]) === __filename; }
})();
if (isMain) {
  const a = process.argv.slice(2);
  const bail = m => { process.stderr.write(`lo-trinh: ${m}\n`); process.exit(2); };
  let root = '.'; let ma = null;
  for (let i = 0; i < a.length; i++) {
    if (a[i] === '--root' || a[i] === '--hang') {
      const v = a[i + 1];
      if (v == null || v === '' || v.startsWith('--')) bail(`${a[i]} cần một giá trị ngay sau nó`);
      if (a[i] === '--root') root = v; else ma = v;
      i++;
    } else bail(`tham số lạ ${a[i]} — chỉ nhận --root <thư-mục> --hang <mã>`);
  }
  if (ma == null) bail('thiếu --hang <mã>');
  root = path.resolve(root);
  const tep = docKhoa(root);
  if (tep == null) { process.stderr.write(`lo-trinh: kho chưa khai ${KHOA} trong _acceptance/config.yaml\n`); process.exit(1); }
  const { loi, data } = docTep(root, tep);
  if (loi) { process.stderr.write(`lo-trinh: ${loi}\n`); process.exit(1); }
  const r = kiemKhuon(data).hang.find(h => h._ma === ma);
  if (!r) { process.stderr.write(`lo-trinh: không có hàng ${ma} trong ${tep}\n`); process.exit(1); }
  const { _nhan, _ma, ...hang } = r;
  process.stdout.write(JSON.stringify(hang) + '\n');
}
