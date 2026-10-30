#!/usr/bin/env node
// do-vong.mjs — đo giờ máy, giờ chờ và token thật của MỘT vòng từ bản ghi phiên Claude Code (hồ sơ lo-trinh-gio-may, AC-6/7).
// Design: docs/superpowers/specs/2026-10-15-lo-trinh-gio-may-design.md.
//
//   node scripts/do-vong.mjs --root <kho> --slug <s> [--write] [--projects <dir>] [--den <ISO>]
//     In MỘT dòng JSON `kind:"gio-may"`; `--write` nối nó vào _acceptance/<s>/run-log.jsonl.
//   node scripts/do-vong.mjs --doc-han-muc <0..100> --dat-lai <ISO>
//     Ghi một lần đọc hạn mức tuần (phiên lấy từ get_usage) vào tệp cục bộ của máy — sự kiện của tài khoản, không của kho.
//
// Bản ghi: mọi *.jsonl dưới `--projects` (mặc định $CLAUDE_PROJECTS_DIR hoặc ~/.claude/projects). Một PHIÊN = tệp
// <dự án>/<mã>.jsonl cùng mọi *.jsonl dưới <dự án>/<mã>/ (tác tử con, workflow). Phiên chạm vòng khi một dòng bất kỳ của
// nó nhắc `_acceptance/<slug>/`. Chỉ sự kiện trong cửa sổ vòng (từ ngày quyết của ô, hoặc commit đầu của hồ sơ, tới
// `--den` / bây giờ) vào giờ lẫn token. Giờ máy = độ dài HỢP các khoảng hoạt động trên dòng thời gian gộp: hai sự kiện
// liên tiếp cách ≤ 600 giây (trần một lệnh của công cụ) là hoạt động — tác tử song song không cộng trùng.
// Mã thoát: 0 = in/ghi xong · 2 = lỗi dùng (cờ sai, giá trị sai, hồ sơ không có).
import { readFileSync, readdirSync, statSync, existsSync, appendFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';

export const KHOANG_HOAT_DONG_GIAY = 600;
// Giá niêm yết tương đối ($ / 1M token: vào · ra · đọc bộ đệm · ghi bộ đệm hạn ngắn), bảng giá công bố 10/2026. Token quy
// đổi = $ tương đương API; % hạn mức tuần hiệu chuẩn trên CÙNG đơn vị nên chỉ tỉ lệ giữa các ô là quan trọng.
// Ghi bộ đệm lấy 1,25 × vào; Haiku 5.5 đọc bộ đệm lấy 0,1 × vào (bảng không công bố). Model lạ → hàng `khac` (giá Opus 5.5).
export const TRONG_SO = [
  [/^claude-(fable|mythos)-5/, [10, 50, 0.25, 12.5]],
  [/^claude-opus-5-5/, [4, 20, 0.2, 5]],
  [/^claude-opus-(5|4)/, [5, 25, 0.5, 6.25]],
  [/^claude-sonnet-5/, [2, 10, 0.2, 2.5]],
  [/^claude-sonnet-4/, [3, 15, 0.3, 3.75]],
  [/^claude-haiku-5/, [0.1, 0.5, 0.01, 0.125]],
  [/^claude-haiku-4/, [1, 5, 0.1, 1.25]],
];
const KHAC = [4, 20, 0.2, 5];
export const giaCua = model => (TRONG_SO.find(([re]) => re.test(String(model || ''))) || [null, KHAC])[1];
export const quyDoi = (model, t) => { const g = giaCua(model); return (t.vao * g[0] + t.ra * g[1] + t.doc_dem * g[2] + t.ghi_dem * g[3]) / 1e6; };

export const LY_DO = {
  motLan: 'chưa đủ hai lần đọc hạn mức tuần — % không quy đổi được',
  khacMoc: 'hai lần đọc hạn mức khác mốc đặt lại (đổi tài khoản hoặc sang tuần mới) — % không quy đổi được',
  giam: 'phần trăm hạn mức giảm giữa hai lần đọc (đổi tài khoản) — % không quy đổi được',
  khongDung: 'không có lượng dùng nào giữa hai lần đọc — % không quy đổi được',
  duoiPhanGiai: 'hạn mức tuần chưa nhích giữa hai lần đọc (dưới 1 %, độ phân giải của công cụ đọc) — % không quy đổi được',
};

const doc = p => { try { return readFileSync(p, 'utf8'); } catch { return null; } };
const thuMucProjects = () => process.env.CLAUDE_PROJECTS_DIR || path.join(os.homedir(), '.claude', 'projects');
export const tepHanMuc = () => process.env.HAN_MUC_TEP || path.join(os.homedir(), '.claude', 'acceptance-gate', 'han-muc.jsonl');
const tron2 = x => Math.round(x * 100) / 100;

// Mọi *.jsonl dưới thư mục (bỏ tool-results), đệ quy.
function jsonlDuoi(d) {
  const ra = [];
  let ds; try { ds = readdirSync(d, { withFileTypes: true }); } catch { return ra; }
  for (const e of ds) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (e.name !== 'tool-results') ra.push(...jsonlDuoi(p)); } else if (e.name.endsWith('.jsonl')) ra.push(p);
  }
  return ra;
}
// Các phiên: [{ chinh, tep: [đường] }] — chinh là <dự án>/<mã>.jsonl, tep gồm chính nó và mọi bản ghi con.
export function cacPhien(goc) {
  const ra = [];
  let duAn; try { duAn = readdirSync(goc, { withFileTypes: true }).filter(e => e.isDirectory()); } catch { return ra; }
  for (const da of duAn) {
    const dDa = path.join(goc, da.name);
    for (const e of readdirSync(dDa, { withFileTypes: true })) {
      if (!e.isFile() || !e.name.endsWith('.jsonl')) continue;
      const ma = e.name.slice(0, -6); const chinh = path.join(dDa, e.name);
      ra.push({ chinh, tep: [chinh, ...jsonlDuoi(path.join(dDa, ma))] });
    }
  }
  return ra;
}
// Đọc một bản ghi: sự kiện có `timestamp` (ms), lời nhắn có `usage`, và bản ghi có nhắc chuỗi `can` không. Dòng hỏng bỏ.
// Bản ghi không sửa từ `tuMs` trở đi thì không có sự kiện nào trong cửa sổ — bỏ qua không đọc (máy có hàng GB bản ghi).
const moiTu = (p, tuMs) => { try { return statSync(p).mtimeMs >= tuMs; } catch { return false; } };
function docBanGhi(p, can = null) {
  const ev = []; const loi = []; const txt = doc(p) || '';
  for (const l of txt.split('\n')) {
    if (!l.trim()) continue;
    let o; try { o = JSON.parse(l); } catch { continue; }
    const t = Date.parse(o && o.timestamp); if (!Number.isFinite(t)) continue;
    ev.push(t);
    const m = o.message; const u = m && typeof m === 'object' ? m.usage : null;
    if (u && typeof u === 'object') loi.push({ t, ma: m.id || o.uuid || `${p}:${t}`, model: m.model || '', u });
  }
  return { ev, loi, cham: can != null && txt.includes(can) };
}
// Tổng token theo model × loại của các lời nhắn trong [tu, den], mỗi mã một lần. Lời nhắn model «<synthetic>» do Claude Code tự
// sinh (thông báo hạn mức, ngắt lượt…), không phải việc của model: bỏ khỏi token; mốc thời gian của nó vẫn vào giờ máy như mọi sự kiện.
const MODEL_TU_SINH = '<synthetic>';
function congToken(loiDs, tu, den) {
  const thay = new Set(); const theoModel = {};
  for (const x of loiDs) {
    if (x.t < tu || x.t > den || thay.has(x.ma)) continue;
    if (x.model === MODEL_TU_SINH) continue;
    thay.add(x.ma);
    const k = theoModel[x.model] || (theoModel[x.model] = { vao: 0, ra: 0, doc_dem: 0, ghi_dem: 0 });
    k.vao += x.u.input_tokens || 0; k.ra += x.u.output_tokens || 0;
    k.doc_dem += x.u.cache_read_input_tokens || 0; k.ghi_dem += x.u.cache_creation_input_tokens || 0;
  }
  return theoModel;
}
const tongQuyDoi = tm => Object.entries(tm).reduce((a, [m, t]) => a + quyDoi(m, t), 0);
// Giờ hoạt động trên dòng thời gian gộp: tổng các khoảng liên tiếp ≤ ngưỡng.
export function gioHoatDong(evMs) {
  const s = [...evMs].sort((a, b) => a - b); let g = 0;
  for (let i = 1; i < s.length; i++) { const d = (s[i] - s[i - 1]) / 1000; if (d <= KHOANG_HOAT_DONG_GIAY) g += d; }
  return g / 3600;
}
// Cửa sổ vòng: `decided_at` của ô cơ hội; vắng → commit đầu chạm thư mục hồ sơ; vắng nữa → null.
function batDauVong(root, slug) {
  const o = doc(path.join(root, '_acceptance', slug, 'opportunity.md')) || '';
  const m = o.match(/^decided_at:\s*([0-9T:.\-+Z]+)/m);
  if (m && Number.isFinite(Date.parse(m[1]))) return Date.parse(m[1]);
  try {
    const g = execFileSync('git', ['-C', root, 'log', '--reverse', '--format=%cI', '--', path.join('_acceptance', slug)], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).split('\n').find(Boolean);
    if (g && Number.isFinite(Date.parse(g))) return Date.parse(g);
  } catch { /* không phải kho git */ }
  return null;
}
// Mốc đặt lại so theo PHÚT: công cụ đọc hạn mức trả cùng một mốc lệch vài mili-giây giữa hai lần đọc (đo 15/10:
// 02:00:00.324Z rồi 01:59:59.754Z).
export const phutCua = s => new Date(Math.round(Date.parse(s) / 60e3) * 60e3).toISOString();
// Hai lần đọc gần nhất → tỉ lệ % trên mỗi đơn vị quy đổi, hoặc lý do loại.
export function tiLe(docDs, phien) {
  if (docDs.length < 2) return { ly_do: LY_DO.motLan };
  const [a, b] = docDs.slice(-2);
  const khoang = { tu: a.ts, den: b.ts, phan_tram: [a.phan_tram, b.phan_tram] };
  if (phutCua(a.dat_lai) !== phutCua(b.dat_lai)) return { ly_do: LY_DO.khacMoc, khoang };
  if (b.phan_tram < a.phan_tram) return { ly_do: LY_DO.giam, khoang };
  if (b.phan_tram === a.phan_tram) return { ly_do: LY_DO.duoiPhanGiai, khoang };
  const tu = Date.parse(a.ts); const den = Date.parse(b.ts);
  const tm = congToken(phien.flatMap(p => p.loi), tu, den);
  const q = tongQuyDoi(tm);
  if (!(q > 0)) return { ly_do: LY_DO.khongDung, khoang };
  return { ty_le: (b.phan_tram - a.phan_tram) / q, khoang };
}
export function docLanDoc(p = tepHanMuc()) {
  return (doc(p) || '').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return null; } })
    .filter(o => o && typeof o.phan_tram === 'number' && typeof o.dat_lai === 'string' && Number.isFinite(Date.parse(o.ts)));
}

export function doVong({ root, slug, projects = thuMucProjects(), denMs = Date.now(), lanDoc = docLanDoc() }) {
  const can = `_acceptance/${slug}/`;
  const tuMs = batDauVong(root, slug);
  const phien = cacPhien(projects);
  const phienDoc = tuMs == null ? [] : phien.filter(p => p.tep.some(x => moiTu(x, tuMs))).map(p => ({ ...p, ban: p.tep.filter(x => moiTu(x, tuMs)).map(x => ({ t: x, ...docBanGhi(x, can) })) }));
  const cham = phienDoc.filter(p => p.ban.some(b => b.cham));
  const dong = { ts: new Date(denMs).toISOString(), kind: 'gio-may', cua_so: { tu: tuMs == null ? null : new Date(tuMs).toISOString(), den: new Date(denMs).toISOString() } };
  if (!cham.length || tuMs == null) {
    return { ...dong, nguon: 'khong-co-ban-ghi', gio_may: null, gio_cho: null, token: null, phan_tram_tuan: null, ly_do: tuMs == null ? 'không xác định được lúc vòng bắt đầu' : 'không có bản ghi phiên nào chạm hồ sơ trên máy này' };
  }
  const ban = cham.flatMap(p => p.ban);
  const ev = ban.flatMap(b => b.ev).filter(t => t >= tuMs && t <= denMs);
  const gioMay = gioHoatDong(ev);
  const gioCuaSo = Math.max(0, (denMs - tuMs) / 3600e3);
  const tm = congToken(ban.flatMap(b => b.loi), tuMs, denMs);
  const token = Object.fromEntries(Object.entries(tm).sort(([a], [b]) => a.localeCompare(b)));
  // Tỉ lệ cần lượng dùng của CẢ máy giữa hai lần đọc — chỉ đọc khi có đủ hai lần đọc, và chỉ bản ghi sửa từ lần đọc đầu.
  const docTu = lanDoc.length >= 2 ? Date.parse(lanDoc[lanDoc.length - 2].ts) : null;
  const tatCa = docTu == null ? [] : phien.flatMap(p => p.tep).filter(x => moiTu(x, docTu)).map(x => ({ loi: docBanGhi(x).loi }));
  const tl = tiLe(lanDoc, tatCa);
  const nguon = ban.filter(b => b.ev.some(t => t >= tuMs && t <= denMs)).map(b => path.relative(projects, b.t)).sort();
  return {
    ...dong, nguon, gio_may: tron2(gioMay), gio_cho: tron2(Math.max(0, gioCuaSo - gioMay)), token,
    quy_doi: Math.round(tongQuyDoi(tm) * 1e4) / 1e4,
    phan_tram_tuan: tl.ty_le != null ? tron2(tl.ty_le * tongQuyDoi(tm)) : null,
    ...(tl.ty_le != null ? { ty_le: tl.ty_le } : { ly_do: tl.ly_do }),
    ...(tl.khoang ? { khoang_doc: tl.khoang } : {}),
  };
}

const isMain = (() => { try { return import.meta.url === new URL(`file://${path.resolve(process.argv[1])}`).href; } catch { return false; } })();
if (isMain) {
  const a = process.argv.slice(2); const bail = m => { process.stderr.write(`do-vong: ${m}\n`); process.exit(2); };
  const f = {}; const co = new Set(['write']);
  for (let i = 0; i < a.length; i++) {
    if (!a[i].startsWith('--')) bail(`tham số lạ ${a[i]}`);
    const k = a[i].slice(2);
    if (co.has(k)) { f[k] = true; continue; }
    if (!['root', 'slug', 'projects', 'den', 'doc-han-muc', 'dat-lai'].includes(k)) bail(`tham số lạ ${a[i]} — chỉ nhận --root --slug [--write] [--projects] [--den] | --doc-han-muc <0..100> --dat-lai <ISO>`);
    const v = a[i + 1]; if (v == null || v.startsWith('--')) bail(`--${k} cần một giá trị`); f[k] = v; i++;
  }
  if (f['doc-han-muc'] !== undefined) {
    const pt = Number(f['doc-han-muc']);
    if (!Number.isFinite(pt) || pt < 0 || pt > 100) bail(`--doc-han-muc phải là phần trăm 0..100 (đang là «${f['doc-han-muc']}»)`);
    if (!f['dat-lai'] || !/^\d{4}-\d{2}-\d{2}T/.test(f['dat-lai']) || !Number.isFinite(Date.parse(f['dat-lai']))) bail(`--dat-lai phải là thời điểm ISO (đang là «${f['dat-lai'] ?? ''}»)`);
    const p = tepHanMuc(); mkdirSync(path.dirname(p), { recursive: true });
    const o = { ts: new Date().toISOString(), phan_tram: pt, dat_lai: phutCua(f['dat-lai']) };
    appendFileSync(p, JSON.stringify(o) + '\n'); process.stdout.write(JSON.stringify(o) + '\n'); process.exit(0);
  }
  if (!f.root || !f.slug) bail('cần --root <kho> --slug <s> (hoặc --doc-han-muc <phần trăm> --dat-lai <ISO>)');
  const root = path.resolve(f.root);
  if (!existsSync(path.join(root, '_acceptance', f.slug)) || !statSync(path.join(root, '_acceptance', f.slug)).isDirectory()) bail(`không có hồ sơ _acceptance/${f.slug}`);
  const denMs = f.den ? Date.parse(f.den) : Date.now(); if (!Number.isFinite(denMs)) bail(`--den phải là thời điểm ISO`);
  const dong = doVong({ root, slug: f.slug, projects: f.projects || thuMucProjects(), denMs });
  const txt = JSON.stringify(dong);
  if (f.write) appendFileSync(path.join(root, '_acceptance', f.slug, 'run-log.jsonl'), txt + '\n');
  process.stdout.write(txt + '\n');
}
