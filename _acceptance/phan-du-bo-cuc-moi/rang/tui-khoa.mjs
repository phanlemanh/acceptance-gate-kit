// tui-khoa.mjs — phần thuần của thước giữ khoá (hồ sơ phan-du-bo-cuc-moi): rút khoá từ đầu ra một bộ kiểm, túi khoá
// (đa tập), đổi khoá bố cục cũ sang tên/đường kho mới, so hai túi, đọc khoa-dich.tsv.
//
// Luật rút khoá CHÉP (không nạp) từ thước giữ khoá của B2 — ~/dev/delivery-loop/.claude/worktrees/
// b2-bo-kiem-xanh-o-kho-moi-3db198/migration/kich-ban/giu-khoa.mjs, nhánh B2 đỉnh c87ff183 theo phiên giữ đợt, chép
// 2026-11-15: `chuanHoa`, `doiKhoa`, `tuiCu`, `soTui` (bỏ phần danh sách bỏ/sổ). Cách B2 đọc ba bộ (chay-bo-kiem.sh +
// doc-gate.mjs + tests/bo-chay.sh của kit):
//   bash (scripts, plugins…) — mỗi dòng stdout mà sau khoảng trắng đầu dòng là «PASS:»/«FAIL:», ở mọi tầng, cắt 160 ký tự
//                              (bc_tg_ca); PASS là đạt.
//   tap  (dieu-phoi)         — mỗi dòng `ok N - <tên>` / `not ok N - <tên>` ở TẦNG NGOÀI; `# SKIP`/`# TODO` không đạt.
// Khoá = «<dòng bỏ tiền tố, cắt ở « — » hoặc « (», che đường thư mục tạm và mã 7–40 hex>»; bộ (scripts:/plugins:/
// dieu-phoi:) là tiền tố ở khoa-dich.tsv, ở đây túi đi theo bộ chạy nên khoá không mang tiền tố.
import fs from 'node:fs';

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&');

export function chuanHoa(dong) {
  let s = dong.replace(/^\s*(PASS|FAIL)\s*:\s*/, '');
  s = s.split(/ — | \(/)[0];
  s = s.replace(/(?:\/private)?\/(?:var\/folders|tmp)\/\S+/g, '<tmp>');
  s = s.replace(/\b[0-9a-f]{7,40}\b/g, '<sha>');
  return s.trim();
}

const them = (t, k, n = 1) => t.set(k, (t.get(k) || 0) + n);

// Đầu ra một lần chạy → { dat: Map<khoá, n>, do: Map<khoá, n>, dongDo: Map<khoá, dòng thô đầu tiên> }.
export function rutKhoa(stdout, loai) {
  const dat = new Map(); const dO = new Map(); const dongDo = new Map();
  for (const h of String(stdout).split('\n')) {
    if (loai === 'tap') {
      const m = h.match(/^(not ok|ok) \d+ - (.*?)(\s+#\s*(SKIP|TODO)\b.*)?$/);
      if (!m) continue;
      const k = chuanHoa(m[2]);
      if (m[1] === 'ok' && !m[3]) them(dat, k);
      else if (m[1] === 'not ok') { them(dO, k); if (!dongDo.has(k)) dongDo.set(k, h.trim()); }
      continue;
    }
    const t = h.replace(/^\s+/, '');
    if (!/^(PASS|FAIL):/.test(t)) continue;
    const ca = t.slice(0, 160);
    const k = chuanHoa(ca);
    if (/^PASS\s*:/.test(ca)) them(dat, k);
    else { them(dO, k); if (!dongDo.has(k)) dongDo.set(k, t); }
  }
  return { dat, do: dO, dongDo };
}

// Gộp túi của nhiều lần chạy; mã thoát = mã khác 0 đầu tiên (hoặc 0), đầu ra nối theo thứ tự.
export function gop(...tui) {
  const r = { dat: new Map(), do: new Map(), dongDo: new Map(), rc: 0, stdout: '', stderr: '' };
  for (const x of tui) {
    for (const [k, n] of x.dat) them(r.dat, k, n);
    for (const [k, n] of x.do) them(r.do, k, n);
    for (const [k, d] of x.dongDo || []) if (!r.dongDo.has(k)) r.dongDo.set(k, d);
    if (r.rc === 0 && x.rc !== undefined && x.rc !== 0) r.rc = x.rc;
    r.stdout += x.stdout || ''; r.stderr += x.stderr || '';
  }
  return r;
}

// Phép đổi khoá bố cục cũ sang tên và đường của kho mới (bảng tên + bảng xếp). Chép từ B2.
export function doiKhoa(bangTen, bangXep) {
  const L = [];
  for (const [c, m] of Object.entries(bangTen.lenh || {})) L.push([new RegExp(`(?<![\\w-])${esc(c)}(?![\\w-])`, 'g'), m]);
  for (const [c, m] of Object.entries(bangTen.plugin || {})) {
    L.push([new RegExp(`(?<![\\w-])${esc(c)}:(?=[a-z])`, 'g'), `${m}:`]);
    L.push([new RegExp(`(?<![\\w-])${esc(c)}@`, 'g'), `${m}@`]);
  }
  L.push([/acceptance-gate-kit(?![\w-])/g, 'delivery-loop']);
  const goc = Object.keys(bangXep.thu_muc || {}).sort((a, b) => b.length - a.length);
  if (goc.length) L.push([new RegExp(`(?<![\\w./-])(${goc.map(esc).join('|')})/`, 'g'), (_, g) => `${bangXep.thu_muc[g]}/`]);
  return (k) => L.reduce((s, [re, m]) => s.replace(re, m), k);
}

// Túi bố cục cũ theo tên kho mới; khoá mà tên đã đổi không có ở kho mới còn tên nguyên chữ thì có → giữ tên nguyên (B2).
export function tuiCu(datA, datB, doi) {
  const cu = new Map();
  for (const [k, n] of datA) { const m = doi(k); const t = m !== k && !datB.has(m) && datB.has(k) ? k : m; cu.set(t, (cu.get(t) || 0) + n); }
  return cu;
}

// So hai túi: mọi khoá của `cu` (đếm cả số lần) phải có ở `moi`; `bo` = túi khoá được miễn (đa tập).
export function soTui(cu, moi, bo = new Map()) {
  const thieu = []; const thua = [];
  for (const [k, n] of cu) { const con = (moi.get(k) || 0) + (bo.get(k) || 0); for (let i = con; i < n; i++) thieu.push(k); }
  for (const [k, n] of moi) for (let i = cu.get(k) || 0; i < n; i++) thua.push(k);
  const tong = [...cu.values()].reduce((a, b) => a + b, 0);
  return { tong, thieu, thua };
}

// Túi `cu` chỉ giữ phần mà túi `goc` cũng có (đếm cả số lần) — cho tệp còn đi bước 6: ca bố cục cũ mà kho mới dựng từ
// bản gốc cũng vắng (cần bảng vá B2) không phải việc vòng này làm mất; ca kho mới bản gốc có thì kho mới HEAD phải còn.
export function locTheoGoc(cu, goc) {
  const r = new Map();
  for (const [k, n] of cu) { const m = Math.min(n, goc.get(k) || 0); if (m) r.set(k, m); }
  return r;
}

// khoa-dich.tsv → [{ cum, lop, tepKiem, bo, khoa }] (dòng chú thích «#» và tiêu đề bỏ qua).
export function docKhoaDich(tep) {
  const ra = [];
  for (const d of fs.readFileSync(tep, 'utf8').split('\n')) {
    if (!d.trim() || d.startsWith('#')) continue;
    const [cum, lop, tepKiem, khoa] = d.split('\t');
    if (cum === 'cum') continue;
    const m = String(khoa || '').match(/^([\w-]+): (.*)$/);
    if (!m) throw new Error(`khoa-dich.tsv: dòng không đọc được: ${d}`);
    ra.push({ cum, lop, tepKiem, bo: m[1], khoa: m[2] });
  }
  return ra;
}
