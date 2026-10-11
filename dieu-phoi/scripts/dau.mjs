// Vòng đời dấu «thợ chết vì hạn mức» (`ban-giao/dau/<dãy>.json`, do hook StopFailure ghi) và tập phiên đã bàn giao —
// MỘT nơi đọc cho bộ phát lịch, kế hoạch dãy, `tiep-tuc` và hook (review DP4 C1, I1). Dấu sinh một lần, được tiêu thụ
// khi `tiep-tuc` chuyển nó vào lịch sử bàn giao, và hết hiệu lực khi: phiên của nó đã thuộc lần tiếp tục gần nhất, hoặc
// có lần đọc mức dùng MỚI HƠN dấu cho thấy mọi cửa sổ dưới ngưỡng báo trước (tài khoản đã hồi).
import fs from 'node:fs';
import path from 'node:path';
import { docJson } from './dot.mjs';

export const DIR_DAU = path.join('ban-giao', 'dau');

export function docDau(thuMuc) {
  const d = path.join(thuMuc, DIR_DAU);
  if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d).filter((f) => f.endsWith('.json')).sort().flatMap((f) => {
    try {
      const du = docJson(path.join(d, f), null);
      return du && typeof du.day === 'string' && Number.isFinite(Date.parse(du.luc)) ? [du] : [];
    } catch {
      return [];
    }
  });
}

// Bản lịch sử bàn giao mới nhất (theo `tiep_tuc_luc`) — null khi chưa tiếp tục lần nào.
export function lichSuMoiNhat(thuMuc) {
  const d = path.join(thuMuc, 'ban-giao', 'lich-su');
  if (!fs.existsSync(d)) return null;
  let moi = null;
  for (const f of fs.readdirSync(d).filter((x) => x.endsWith('.json'))) {
    let du = null;
    try {
      du = docJson(path.join(d, f), null);
    } catch {
      du = null;
    }
    if (du?.ma && Array.isArray(du.day) && (!moi || String(du.tiep_tuc_luc ?? '') > String(moi.tiep_tuc_luc ?? ''))) moi = du;
  }
  return moi;
}

// Phiên đã biết ở lần tiếp tục gần nhất: mọi phiên có nhịp sống trước lúc tiếp tục và phiên của các dấu đã tiêu thụ.
export const phienDaBiet = (thuMuc) => new Set(lichSuMoiNhat(thuMuc)?.phien_da_biet ?? []);

// Dấu còn hiệu lực. `tuoi` = các lần đọc còn tươi (lanDocHieuLuc), `baoTruoc` = ngưỡng báo trước của đợt.
export function dauHieuLuc(thuMuc, { tuoi = [], baoTruoc = null } = {}) {
  const daBiet = phienDaBiet(thuMuc);
  return docDau(thuMuc).filter((x) => {
    if (x.phien && daBiet.has(x.phien)) return false;
    if (baoTruoc == null) return true;
    const sau = tuoi.filter((l) => Date.parse(l.luc) > Date.parse(x.luc));
    const daHoi = sau.length > 0 && Object.values(sau.at(-1).cua_so ?? {}).every((w) => w.pct < baoTruoc);
    return !daHoi;
  });
}
