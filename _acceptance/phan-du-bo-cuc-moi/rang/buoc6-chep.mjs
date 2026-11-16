// buoc6-chep.mjs — bước 6 «bộ kiểm theo bố cục mới» của kịch bản chuyển nhà, cho biến thể (ii) của thước giữ khoá
// (hồ sơ phan-du-bo-cuc-moi, design §7; kế hoạch Task 2).
//
// CHÉP, KHÔNG NẠP. Nguồn: ~/dev/delivery-loop/.claude/worktrees/b2-bo-kiem-xanh-o-kho-moi-3db198/migration/kich-ban/
//   don-nha.mjs   — `buoc6BoKiem` (dòng 298–382) và các hằng/hàm nó gọi: `git`, `Dung`/`dung`, `esc`, `laChu`,
//                   `luatDoiChu` (dòng 113–126), `dichSau` (dòng 183–192);
//   bang-xep.json — các trường bước 6 và các hàm trên đọc (`thu_muc`, `tep`, `cho_moi`, `luat_cho`, `bo_kiem`);
//   ../chay-thu-phien/bang-ten.json — `plugin`, `lenh` (bảng tên, `_bangTen`).
// Nhánh B2 đỉnh c87ff183 theo phiên giữ đợt; chép ngày 2026-11-15. Chép vì CI kho này không có kho kế nhiệm (tiền lệ
// `_acceptance/goi-cheo-loi-dieu-phoi/rang/luat-doi-chu.mjs`); rủi ro trôi khai ở design §7, bù bằng đo chéo cuối vòng.
//
// Khác bản gốc, có chủ ý: BỎ phần áp bảng vá (`va-bo-kiem.json`, don-nha.mjs dòng 370–378) — thước đo «luật chung bước
// 6, không bảng vá» (ô cơ hội). Bảng vá chép nguyên ở `va-bo-kiem-b2.json` cạnh tệp này; thước giữ khoá đọc nó riêng cho
// phép so GUI-B2. `bx._dir` (chỉ dùng để tìm bảng vá) vì thế không có. Mọi dòng khác giữ nguyên chữ.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

export class Dung extends Error {}
const dung = (lyDo) => { throw new Dung(lyDo); };

const git = (cwd, args, env) => execFileSync('git', ['-C', cwd, ...args], {
  encoding: 'utf8', maxBuffer: 1 << 30, env: env ? { ...process.env, ...env } : process.env, stdio: ['ignore', 'pipe', 'pipe'],
});

// bang-xep.json (các trường bước 6 đọc) + bang-ten.json làm `_bangTen` — đúng chữ của nguồn.
export const BX = {
  cho_moi: { ten_cu: 'acceptance-gate-kit', ten_moi: 'delivery-loop' },
  luat_cho: { mau: 'acceptance-gate-kit(?![\\w-])', thay: 'delivery-loop' },
  thu_muc: {
    skills: 'plugins/acceptance-gate/skills',
    commands: 'plugins/acceptance-gate/commands',
    hooks: 'plugins/acceptance-gate/hooks',
    scripts: 'plugins/acceptance-gate/scripts',
    lib: 'plugins/acceptance-gate/lib',
    vendor: 'plugins/acceptance-gate/vendor',
    evals: 'plugins/acceptance-gate/evals',
    'design-floor': 'plugins/acceptance-gate/design-floor',
    'feature-loop': 'plugins/feature-loop',
    'diagram-design': 'plugins/diagram-design',
    'dieu-phoi': 'plugins/dispatch',
    'road-map': 'plugins/roadmap',
    'tri-thuc': 'plugins/knowledge',
  },
  tep: { '.claude-plugin/plugin.json': 'plugins/acceptance-gate/.claude-plugin/plugin.json' },
  bo_kiem: {
    tap: 'tests/',
    tru: '/fixtures/',
    duoi: ['.sh', '.mjs', '.js', '.cjs', '.py', '.ts', '.yml', '.yaml'],
    tep_goc: ['.github/workflows/', 'Makefile', '_acceptance/config.yaml'],
    bien_goc: ['KIT', 'ROOT', 'GOC', 'SELF_ROOT', 'repoRoot', 'ROOT_REAL', 'ROOT_REAL_GC', 'PMROOT', 'REPO', 'REPO_ROOT'],
    bien_goc_va: ['kit', 'goc', 'may'],
  },
  _bangTen: {
    plugin: { 'dieu-phoi': 'dispatch', 'road-map': 'roadmap', 'tri-thuc': 'knowledge' },
    lenh: {
      'dieu-phoi:mo-dot': 'dispatch:open',
      'dieu-phoi:dong-dot': 'dispatch:close',
      'dieu-phoi:tiep-tuc': 'dispatch:resume',
      'dieu-phoi:ban-giao': 'dispatch:handoff',
      'dieu-phoi:xem': 'dispatch:status',
      'road-map:xem': 'roadmap:status',
      'road-map:ghim': 'roadmap:pin',
      'road-map:bo-ghim': 'roadmap:unpin',
      'road-map:tra-lai': 'roadmap:undo',
      'road-map:gui': 'roadmap:suggest',
      'tri-thuc:ghi': 'knowledge:ingest',
      'tri-thuc:kiem': 'knowledge:health',
      'acceptance-gate:cat-luot': 'acceptance-gate:scope-slice',
      'acceptance-gate:gom-tin-hieu': 'acceptance-gate:signal-intake',
    },
  },
};

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const laChu = (buf) => !buf.subarray(0, 8192).includes(0);

// Luật đổi chữ theo thứ tự áp. `khoa` = mục của bảng tên mà luật phục vụ (để đếm «0 chỗ»).
export function luatDoiChu(bx) {
  const L = [];
  for (const [cu, moi] of Object.entries(bx._bangTen.lenh)) L.push({ khoa: cu, re: new RegExp(`(?<![\\w-])${esc(cu)}(?![\\w-])`, 'g'), thay: moi });
  for (const [p, q] of Object.entries(bx._bangTen.plugin)) {
    L.push({ khoa: p, re: new RegExp(`(?<![\\w-])${esc(p)}:(?=[a-z])`, 'g'), thay: `${q}:` });
    L.push({ khoa: p, re: new RegExp(`(?<![\\w-])${esc(p)}@`, 'g'), thay: `${q}@` });
    L.push({ khoa: p, re: new RegExp(`--plugin ${esc(p)}(?![\\w-])`, 'g'), thay: `--plugin ${q}` });
    // Tên tự khai của chính plugin trong mã mod: khoá trạng thái (atom) và khoá kiểu (types/index.d.ts).
    L.push({ khoa: p, re: new RegExp(`plugin: '${esc(p)}'`, 'g'), thay: `plugin: '${q}'` });
    L.push({ khoa: p, re: new RegExp(`'${esc(p)}': \\{`, 'g'), thay: `'${q}': {` });
  }
  L.push({ khoa: bx.cho_moi.ten_cu, re: new RegExp(bx.luat_cho.mau, 'g'), thay: bx.luat_cho.thay });
  return L;
}

// Đích của một tệp NGUỒN sau bước 1 và bước 3 (đổi tên tệp lệnh, thư mục skill).
export function dichSau(t, bx, dichPlugin) {
  const dau = t.split('/')[0];
  let d = bx.tep[t] || (bx.thu_muc[dau] ? bx.thu_muc[dau] + t.slice(dau.length) : t);
  for (const [cu, moi] of Object.entries(bx._bangTen.lenh)) {
    const [pc, lc] = cu.split(':'); const lm = moi.split(':')[1]; const D = dichPlugin[pc]; if (!D) continue;
    if (d === `${D}/commands/${lc}.md`) d = `${D}/commands/${lm}.md`;
    else if (d.startsWith(`${D}/skills/${lc}/`)) d = `${D}/skills/${lm}/` + d.slice(`${D}/skills/${lc}/`.length);
  }
  return d;
}

// ── Bước 6: bộ kiểm theo bố cục mới (B2 bo-kiem-xanh-o-kho-moi, THIET-KE-B2.md §3) ───────────────────────────────
// Đổi đường dẫn tới thư mục sản phẩm và tên theo bảng tên trong tệp mã kiểm (tests/ trừ fixtures/) và các tệp chạy bộ
// kiểm ở gốc; rồi áp bảng vá theo tệp (mỗi mục ghim số lần khớp). Chỉ phép thay cơ học — sửa ý nghĩa ca đi về kho cũ.
export function buoc6BoKiem(wt, bx, kho, S, dichPlugin) {
  const k = bx.bo_kiem;
  if (!k) return [];
  const cu = new Set(git(kho, ['ls-tree', '-r', '--name-only', S]).split('\n').filter(Boolean));
  const thuMucCu = new Set();
  for (const t of cu) { const p = t.split('/'); for (let i = 1; i < p.length; i++) thuMucCu.add(p.slice(0, i).join('/')); }
  const coCu = (q) => cu.has(q) || thuMucCu.has(q);
  const dauCu = [...new Set([...thuMucCu].map(d => d.split('/')[0]))];
  // Mơ hồ = cùng đường ấy cũng có dưới một thư mục gốc khác (vd hooks/hooks.json ở gốc và dieu-phoi/hooks/hooks.json).
  const moHo = (q) => dauCu.some(d => d !== q.split('/')[0] && coCu(`${d}/${q}`));
  // Tiền tố dài nhất, từ HAI đoạn trở lên, có ở nguồn — một chữ gốc trần (tên bộ «hooks») không bao giờ là đường.
  const tienTo = (p) => { const s = p.replace(/\/+$/, '').split('/'); for (let i = s.length; i >= 2; i--) { const q = s.slice(0, i).join('/'); if (coCu(q)) return q; } return null; };
  const dichQ = (q) => bx.tep[q] || (cu.has(q) ? dichSau(q, bx, dichPlugin) : dichSau(`${q}/`, bx, dichPlugin).slice(0, -1));
  const goc = Object.keys(bx.thu_muc);
  const G = goc.map(esc).join('|');
  const T = Object.keys(bx.tep).map(esc).join('|');
  const bien = new Set(k.bien_goc);
  const BIEN = k.bien_goc.map(esc).join('|');
  const RE_DUONG = new RegExp(`(^|[\\s"'\`(=\\[,{]|\\$\\{?\\w+\\}?/|\\$\\([^)]*\\)/|(?:\\.\\./)+|HEAD:)((?:${G})/[A-Za-z0-9_.\\-/]*|(?:${T})(?![\\w.-]))`, 'gm');
  const RE_MANG = new RegExp(`\\[\\s*(?:(['"])[\\w.\\-/]+\\1\\s*,\\s*)*(['"])(?:${G})\\2(?:\\s*,\\s*(['"])[\\w.\\-/]+\\3)*\\s*\\]`, 'g');
  const RE_DOI_SO = new RegExp(`(\\b(?:${BIEN})\\s*,\\s*)(['"])(${G})\\2(\\s*[,)])`, 'g');
  // Cặp phần tử `'<gốc>', '<tên>'` ở mọi chỗ (sau '..', sau biến bản sao kit…): đổi khi <gốc>/<tên> có ở nguồn và không mơ hồ.
  const RE_CAP = new RegExp(`(['"])(${G})\\1(\\s*,\\s*|\\s*/\\s*)(['"])([\\w.\\-]+)\\4`, 'g');   // `,` (path.join) hoặc `/` (pathlib)
  // Gốc plugin lõi: ở bố cục cũ gốc kho cũng là gốc plugin lõi (kit tự host); bố cục mới thì là plugins/acceptance-gate.
  const GOC_LOI = path.posix.dirname(path.posix.dirname(bx.tep['.claude-plugin/plugin.json']));
  const RE_GOC_JS = new RegExp(`(['"]--ag-root['"]\\s*,\\s*|CLAUDE_PLUGIN_ROOT:\\s*)(${BIEN})\\b(?!\\s*[.\\[(])`, 'g');
  const RE_GOC_SH = new RegExp(`(--ag-root[ =]|CLAUDE_PLUGIN_ROOT=)"\\$(\\{?)(${BIEN})(\\}?)"`, 'g');
  // Luật đổi chữ của bước 3, riêng luật tên chợ thêm neo phía trước: trong bộ kiểm, «…-acceptance-gate-kit/» là tên thư mục
  // (bản ghi phiên của kho cũ), không phải tên chợ.
  const L = luatDoiChu(bx).map(l => (l.khoa === bx.cho_moi.ten_cu ? { ...l, re: new RegExp(`(?<![\\w-])(?:${l.re.source})`, 'g') } : l));
  const thuocTap = (t) => (t.startsWith(k.tap) && !t.includes(k.tru) && k.duoi.some(d => t.endsWith(d)))
    || k.tep_goc.some(g => (g.endsWith('/') ? t.startsWith(g) : t === g));
  const so = [];
  const dem = { duong: 0, mang: 0, 'doi-so': 0, cap: 0, 'goc-plugin': 0, ten: 0, va: 0 };
  const tep = git(wt, ['ls-files', '-z']).split('\0').filter(t => t && thuocTap(t));
  const noiDung = new Map();
  for (const t of tep) {
    const buf = fs.readFileSync(path.join(wt, t)); if (!laChu(buf)) continue;
    let nd = buf.toString('utf8'); const goc0 = nd; const thu = path.dirname(path.join(wt, t));
    const n = { duong: 0, mang: 0, 'doi-so': 0, cap: 0, 'goc-plugin': 0, ten: 0 };
    nd = nd.replace(RE_DUONG, (m, truoc, p) => {
      const q = bx.tep[p] ? p : tienTo(p);
      if (!q) return m;
      const bienM = truoc.match(/^\$\{?(\w+)\}?\/$/);
      if ((bienM && !bien.has(bienM[1]) || /^\$\(/.test(truoc)) && moHo(q)) return m;     // biến không phải gốc kho + đường mơ hồ
      if (!/\.\.\/|^\$|^HEAD:/.test(truoc) && fs.existsSync(path.join(thu, q.split('/')[0]))) return m; // trùng thư mục cạnh tệp kiểm
      n.duong++; return truoc + dichQ(q) + p.slice(q.length);
    });
    nd = nd.replace(RE_MANG, (m) => {
      const ten = [...m.matchAll(/(['"])([\w.\-/]+)\1/g)].map(x => x[2]);
      if (!ten.every(x => goc.includes(x) || ['tests', '.claude-plugin', '_acceptance', 'docs'].includes(x) || x.startsWith('_acceptance/'))) return m;
      n.mang++; return m.replace(/(['"])([\w.\-]+)\1/g, (z, q, x) => (goc.includes(x) ? q + bx.thu_muc[x] + q : z));
    });
    // Cặp phần tử trước (đổi được cả tên skill / lệnh đi kèm), rồi mới tới đối số đơn sau biến gốc kho.
    nd = nd.replace(RE_CAP, (m, q1, g, sep, q2, ten, off, chuoi) => {
      const p = `${g}/${ten}`;
      if (!coCu(p)) return m;
      const truoc = chuoi.slice(Math.max(0, off - 40), off);
      const chac = /'\.\.'\s*,\s*$/.test(truoc) || new RegExp(`\\b(?:${BIEN})\\s*,\\s*$`).test(truoc);
      if (!chac && moHo(p)) return m;
      const d = dichQ(p); const i = d.lastIndexOf('/');
      n.cap++; return `${q1}${d.slice(0, i)}${q1}${sep}${q2}${d.slice(i + 1)}${q2}`;
    });
    nd = nd.replace(RE_DOI_SO, (m, a, q, g, z) => { n['doi-so']++; return `${a}${q}${bx.thu_muc[g]}${q}${z}`; });
    nd = nd.replace(RE_GOC_JS, (m, a, v) => { n['goc-plugin']++; return a + '`${' + v + '}/' + GOC_LOI + '`'; });
    // Giữ nguyên dạng ngoặc: "${X}" có thể nằm trong template literal của JS — bỏ ngoặc là biến thành chữ trần.
    nd = nd.replace(RE_GOC_SH, (m, a, mo, v, dong) => { n['goc-plugin']++; return a + '"$' + mo + v + dong + '/' + GOC_LOI + '"'; });
    for (const l of L) { const c = (nd.match(l.re) || []).length; if (c) { nd = nd.replace(l.re, l.thay); n.ten += c; } }
    for (const [lop, c] of Object.entries(n)) if (c) { dem[lop] += c; so.push([lop, t, c]); }
    if (nd !== goc0) noiDung.set(t, nd);
  }
  if (!dem.duong && !dem.mang && !dem['doi-so'] && !dem.cap) dung('luật bộ kiểm không khớp chỗ nào');
  // [bỏ ở bản chép: áp bảng vá `k.va` — don-nha.mjs dòng 370–378]
  for (const [t, nd] of noiDung) fs.writeFileSync(path.join(wt, t), nd);
  return so;
}
