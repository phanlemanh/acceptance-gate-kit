// Mức dùng hạn mức (spec workflow §4.5, design DP4 chỗ chọn 2–5) — MỘT bên viết của `han-muc.json`. Ba nguồn
// (mod của gói, công cụ `get_usage` của phiên, dòng trạng thái) đổ vào CÙNG một khuôn lần đọc; bộ phát lịch đọc lần
// đọc hiệu lực mới nhất. Kho không có đợt: không ghi gì (mod gọi CLI này ở mọi phiên của kho).
import path from 'node:path';
import { PHUT_MS } from './cau-hinh.mjs';
import { docJson, ghiJsonNguyenTu, timThuMucDot } from './dot.mjs';
import { bayGio } from './song.mjs';
import { docVai } from './vai.mjs';

export const TEP_HAN_MUC = 'han-muc.json';
export const GIU_TOI_DA = 20;
export const TUOI_TOI_DA_MS = 35 * PHUT_MS;
export const CUA_SO = ['five_hour', 'seven_day'];
export const NGUON = ['mod', 'get-usage', 'statusline'];
export const MAC_DINH_HAN_MUC = { bao_truoc_pct: 80, ban_giao_pct: 90, cho_ban_giao_phut: 20, cho_dat_lai_phut: 45 };

const pct = (x) => (Number.isFinite(x) && x >= 0 ? Math.round(x * 10) / 10 : null);
const iso = (v) => {
  if (typeof v === 'number' && Number.isFinite(v)) return new Date(v < 1e12 ? v * 1000 : v).toISOString();
  if (typeof v === 'string' && Number.isFinite(Date.parse(v))) return new Date(Date.parse(v)).toISOString();
  return null;
};
const muc = (p, datLai) => ({ pct: p, dat_lai: iso(datLai) });

// Một bộ chuẩn hoá mỗi nguồn. mod: mảng `SessionRateLimit` ({kind, percentUsed, resetsAt}) của Claude Code 2.1.295.
// get-usage: `windows` theo nhãn («5-hour limit», «Weekly · all models»; cửa sổ tuần theo model bị bỏ — §4.5 chỉ
// xét hai cửa sổ). statusline: `rate_limits.<cửa sổ>` đọc khoan dung (used_percentage | percentUsed | percent).
const CHUAN_HOA = {
  mod: (du) => (Array.isArray(du)
    ? Object.fromEntries(du.filter((r) => CUA_SO.includes(r?.kind) && pct(r.percentUsed) != null).map((r) => [r.kind, muc(pct(r.percentUsed), r.resetsAt)]))
    : null),
  'get-usage': (du) => {
    const ws = Array.isArray(du) ? du : du?.windows ?? du?.plan?.windows;
    if (!Array.isArray(ws)) return null;
    const ra = {};
    for (const w of ws) {
      const nhan = String(w?.label ?? '');
      const k = /^5-hour\b/i.test(nhan) ? 'five_hour' : /^weekly\s*·\s*all models$/i.test(nhan) ? 'seven_day' : null;
      if (k && pct(w.percentUsed) != null) ra[k] = muc(pct(w.percentUsed), w.resetsAt);
    }
    return ra;
  },
  statusline: (du) => {
    const rl = du?.rate_limits ?? du;
    if (!rl || typeof rl !== 'object') return null;
    const ra = {};
    for (const k of CUA_SO) {
      const w = rl[k];
      const p = pct(w?.used_percentage ?? w?.percentUsed ?? w?.percent);
      if (p != null) ra[k] = muc(p, w.resets_at ?? w.resetsAt);
    }
    return ra;
  },
};

export function chuanHoa(nguon, du) {
  if (!CHUAN_HOA[nguon]) throw new Error(`han-muc: nguồn «${nguon}» không thuộc ${NGUON.join(', ')}`);
  const cs = CHUAN_HOA[nguon](du);
  if (!cs || Object.keys(cs).length === 0) throw new Error(`han-muc: đầu vào nguồn ${nguon} không ra cửa sổ nào (${CUA_SO.join(', ')})`);
  return cs;
}

export function ghiLanDoc(cwd, { nguon, phien, doc, nowMs = null }) {
  const thuMuc = timThuMucDot(cwd);
  if (!thuMuc) return { ghi: false, ly_do: 'khong-co-dot' };
  if (!CHUAN_HOA[nguon]) throw new Error(`han-muc: nguồn «${nguon}» không thuộc ${NGUON.join(', ')}`);
  if (typeof phien !== 'string' || phien === '') throw new Error('han-muc: cần --phien <mã phiên đọc>');
  let du;
  try {
    du = typeof doc === 'string' ? JSON.parse(doc) : doc;
  } catch {
    throw new Error(`han-muc: --doc của nguồn ${nguon} không phải JSON`);
  }
  const lan = { nguon, phien, luc: new Date(bayGio(nowMs)).toISOString(), cua_so: chuanHoa(nguon, du) };
  const p = path.join(thuMuc, TEP_HAN_MUC);
  let cu = null;
  try {
    cu = docJson(p, null);
  } catch {
    cu = null;
  }
  ghiJsonNguyenTu(p, { doc: [...(Array.isArray(cu?.doc) ? cu.doc : []), lan].slice(-GIU_TOI_DA) });
  return { ghi: true, lan };
}

const hopLe = (l) => l && NGUON.includes(l.nguon) && typeof l.phien === 'string' && Number.isFinite(Date.parse(l.luc)) && l.cua_so && typeof l.cua_so === 'object';
export function docLanDoc(thuMuc) {
  let du = null;
  try {
    du = docJson(path.join(thuMuc, TEP_HAN_MUC), null);
  } catch {
    du = null;
  }
  return Array.isArray(du?.doc) ? du.doc.filter(hopLe) : [];
}

// Lần đọc còn tươi (≤ 35′) của tài khoản hiện tại: đọc sau `nhan_luc` của giám sát, hoặc do CHÍNH giám sát đọc
// (design chỗ chọn 3 — bước đọc mức dùng của tiep-tuc đứng trước bước nhận vai). `lan` là lần mới nhất trong số đó.
export function lanDocHieuLuc(thuMuc, { nowMs = null, vai = docVai(thuMuc) } = {}) {
  const now = bayGio(nowMs);
  const gs = vai?.giam_sat ?? null;
  const nhan = gs?.nhan_luc ? Date.parse(gs.nhan_luc) : null;
  const tuoi = docLanDoc(thuMuc)
    .filter((l) => now - Date.parse(l.luc) <= TUOI_TOI_DA_MS)
    .filter((l) => nhan == null || Date.parse(l.luc) >= nhan || l.phien === gs?.phien)
    .sort((a, b) => Date.parse(a.luc) - Date.parse(b.luc));
  return { lan: tuoi.at(-1) ?? null, tuoi };
}
