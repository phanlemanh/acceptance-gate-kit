// Mức dùng hạn mức (spec workflow §4.5, design DP4 chỗ chọn 2–5) — MỘT bên viết của `han-muc.json`. Ba nguồn
// (mod của gói, công cụ `get_usage` của phiên, dòng trạng thái) đổ vào CÙNG một khuôn lần đọc; bộ phát lịch đọc lần
// đọc hiệu lực mới nhất. Kho không có đợt: không ghi gì (mod gọi CLI này ở mọi phiên của kho).
import fs from 'node:fs';
import path from 'node:path';
import { PHUT_MS } from './cau-hinh.mjs';
import { docJson, ghiJsonNguyenTu, ghiSuKien, timThuMucDot } from './dot.mjs';
import { datPha } from './pha.mjs';
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

// ---------- Đánh giá ngưỡng (design chỗ chọn 4–6) ----------
const lam1 = (x) => Math.round(x * 10) / 10;

// Tốc độ đốt (điểm/phút) của một cửa sổ, đo từ các lần đọc còn tươi cùng giờ đặt lại; null khi chưa đủ hai lần đọc.
export function tocDoDot(tuoi, cuaSo) {
  const ds = tuoi.filter((l) => l.cua_so?.[cuaSo]);
  const moi = ds.at(-1);
  if (!moi) return null;
  const cung = ds.filter((l) => l.cua_so[cuaSo].dat_lai === moi.cua_so[cuaSo].dat_lai);
  if (cung.length < 2) return null;
  const phut = (Date.parse(moi.luc) - Date.parse(cung[0].luc)) / PHUT_MS;
  return phut > 0 ? (moi.cua_so[cuaSo].pct - cung[0].cua_so[cuaSo].pct) / phut : null;
}

// Mức của từng cửa sổ trong lần đọc hiệu lực. Không có lần đọc nguồn mod còn tươi → số chỉ đến theo nhịp thức của
// phiên, nên ngưỡng bàn giao hạ đúng tốc độ đốt × 30′ (sàn là ngưỡng báo trước) — đường lùi §4.5.
export function danhGiaHanMuc({ hanMuc, tuoi, lan, nowMs = null }) {
  const now = bayGio(nowMs);
  const coMod = tuoi.some((l) => l.nguon === 'mod');
  const ra = [];
  for (const ten of CUA_SO) {
    const w = lan?.cua_so?.[ten];
    if (!w) continue;
    if (w.dat_lai && Date.parse(w.dat_lai) <= now) continue; // cửa sổ đã đặt lại — số này hết nghĩa
    const toc = coMod ? null : tocDoDot(tuoi, ten);
    const nguong = toc != null && toc > 0 ? lam1(Math.max(hanMuc.bao_truoc_pct, hanMuc.ban_giao_pct - toc * 30)) : hanMuc.ban_giao_pct;
    ra.push({ ten, pct: w.pct, dat_lai: w.dat_lai, toc_do: toc, nguong_ban_giao: nguong, muc: w.pct >= nguong ? 'cham' : w.pct >= hanMuc.bao_truoc_pct ? 'gan' : 'duoi' });
  }
  return { co_mod: coMod, cua_so: ra };
}

// Một nhịp của bộ phát lịch: MỘT sự kiện cho mức cao nhất mới đạt mỗi cửa sổ mỗi giờ đặt lại; chạm ngưỡng mà sắp đặt
// lại → chờ đặt lại (không cấp lượt, không đổi pha); chạm mà đặt lại còn xa, hoặc có dấu thợ chết vì hạn mức → vào
// bàn giao. Đợt không khai `han_muc` → không làm gì (đường đọc-cũ).
export function xetHanMucNhip(thuMuc, { cfg, cu = {}, nowMs = null, pha }) {
  const hanMuc = cfg?.han_muc;
  if (!hanMuc) return { trang_thai: null, da_bao: cu.han_muc_da_bao ?? [], cho_dat_lai: null, vao_ban_giao: false };
  const now = bayGio(nowMs);
  const daBao = new Set(cu.han_muc_da_bao ?? []);
  const { lan, tuoi } = lanDocHieuLuc(thuMuc, { nowMs: now });
  const dg = danhGiaHanMuc({ hanMuc, tuoi, lan, nowMs: now });
  let choDatLai = null;
  let vao = null;
  for (const w of dg.cua_so) {
    const k = `${w.ten}@${w.dat_lai}`;
    if (w.muc === 'cham') {
      const sapDatLai = w.dat_lai && Date.parse(w.dat_lai) - now <= hanMuc.cho_dat_lai_phut * PHUT_MS;
      if (sapDatLai) {
        choDatLai ??= { cua_so: w.ten, den: w.dat_lai };
        if (!daBao.has(`cho:${k}`)) ghiSuKien(thuMuc, { loai: 'cho-dat-lai', cua_so: w.ten, pct: w.pct, den: w.dat_lai, ly_do: `${w.ten} ${w.pct}% chạm ngưỡng ${w.nguong_ban_giao}%, đặt lại lúc ${w.dat_lai} — tự chờ, không đổi tài khoản`, can_phan: true });
        daBao.add(`cho:${k}`).add(`gan:${k}`);
      } else {
        vao ??= `chạm ngưỡng ${w.ten} ${w.pct}% (ngưỡng ${w.nguong_ban_giao}%)`;
        if (!daBao.has(`cham:${k}`)) ghiSuKien(thuMuc, { loai: 'cham-han-muc', cua_so: w.ten, pct: w.pct, nguong: w.nguong_ban_giao, viec: '/dieu-phoi:ban-giao', can_phan: true });
        daBao.add(`cham:${k}`).add(`gan:${k}`);
      }
    } else if (w.muc === 'gan' && !daBao.has(`gan:${k}`)) {
      ghiSuKien(thuMuc, { loai: 'gan-han-muc', cua_so: w.ten, pct: w.pct, nguong: hanMuc.bao_truoc_pct, can_phan: true });
      daBao.add(`gan:${k}`);
    }
  }
  const dDau = path.join(thuMuc, 'ban-giao', 'dau');
  const dau = fs.existsSync(dDau) ? fs.readdirSync(dDau).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)).sort() : [];
  let vaoBanGiao = false;
  if (!vao && dau.length) {
    vao = `thợ ${dau.join(', ')} chết vì hạn mức`;
    if (pha === 'dang-chay' || pha === 'tam-dung') ghiSuKien(thuMuc, { loai: 'cham-han-muc', ly_do: vao, viec: '/dieu-phoi:ban-giao', can_phan: true });
  }
  if (vao && !choDatLai && (pha === 'dang-chay' || pha === 'tam-dung')) {
    datPha(thuMuc, 'dang-ban-giao', { boi: 'phat-lich', lyDo: vao, nowMs: now });
    vaoBanGiao = true;
  }
  return {
    trang_thai: { lan_doc: lan ? { nguon: lan.nguon, phien: lan.phien, luc: lan.luc } : null, co_mod: dg.co_mod, cua_so: dg.cua_so },
    da_bao: [...daBao],
    cho_dat_lai: choDatLai,
    vao_ban_giao: vaoBanGiao,
  };
}
