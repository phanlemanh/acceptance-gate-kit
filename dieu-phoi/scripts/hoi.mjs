// Câu phiên giám sát đang chờ chủ kho (hồ sơ khung-dot-dinh-vi, ADR 0027 bước a). Hook chờ người chỉ ghi cho phiên
// thợ, nên câu giám sát hỏi trong chat không vào sổ nào và khung báo «cần anh 0». Bên ghi là lệnh `hoi`/`hoi-xong`;
// bên đọc là `hoiMo`, dùng ở `xem --json`. Kiểu riêng mang `can_phan:false` TƯỜNG MINH: Monitor của giám sát lọc
// `"can_phan":true`, nên giám sát không tự thức vì câu của chính nó. Đóng câu chỉ bằng `hoi-xong` — không tự đóng
// theo lúc có tin vào phiên giám sát (lịch 30′ và tin liên phiên cũng vào đó); quên đóng thì khung báo DƯ, kèm tuổi câu.
import fs from 'node:fs';
import path from 'node:path';
import { ghiSuKien } from './dot.mjs';
import { bayGio } from './song.mjs';

export const LOAI_HOI = 'hoi-chu-kho';
export const LOAI_HOI_XONG = 'hoi-chu-kho-xong';
const DAI_CAU = 200;

function docSuKien(thuMuc) {
  let tho;
  try {
    tho = fs.readFileSync(path.join(thuMuc, 'su-kien.jsonl'), 'utf8');
  } catch {
    return [];
  }
  const ra = [];
  for (const dong of tho.split('\n')) {
    if (!dong.includes(LOAI_HOI)) continue;
    try {
      ra.push(JSON.parse(dong));
    } catch {}
  }
  return ra;
}

// Câu mở theo thứ tự ghi: {id, cau, phien, luc}. Dòng hỏng bỏ qua.
export function hoiMo(thuMuc) {
  const mo = new Map();
  for (const e of docSuKien(thuMuc)) {
    if (e?.loai === LOAI_HOI && typeof e.id === 'string') mo.set(e.id, { id: e.id, cau: String(e.cau ?? ''), phien: e.phien ?? null, luc: e.luc ?? null });
    else if (e?.loai === LOAI_HOI_XONG) mo.delete(e.id);
  }
  return [...mo.values()];
}

const gonUtc = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

// Ghi một câu; trả id. `<n>` = số câu đã ghi + 1, nên hai câu cùng giây vẫn khác id. Câu rỗng → lỗi mã 2.
export function ghiHoi(thuMuc, { cau, phien = null, nowMs = null }) {
  const c = String(cau ?? '').trim();
  if (!c) throw Object.assign(new Error('hoi: câu rỗng — không ghi gì'), { ma: 2 });
  const n = docSuKien(thuMuc).filter((e) => e?.loai === LOAI_HOI).length + 1;
  const luc = new Date(bayGio(nowMs));
  const id = `h-${gonUtc(luc)}-${n}`;
  ghiSuKien(thuMuc, { luc: luc.toISOString(), loai: LOAI_HOI, id, cau: c.slice(0, DAI_CAU), phien, can_phan: false });
  return id;
}

// Đóng một câu đang mở. Mã chưa từng có hay đã đóng → lỗi mã 2, không ghi byte nào.
export function dongHoi(thuMuc, id, { phien = null, nowMs = null } = {}) {
  if (!hoiMo(thuMuc).some((h) => h.id === id)) throw Object.assign(new Error(`hoi-xong: không có câu mở mang mã ${id}`), { ma: 2 });
  ghiSuKien(thuMuc, { luc: new Date(bayGio(nowMs)).toISOString(), loai: LOAI_HOI_XONG, id, phien, can_phan: false });
  return id;
}
