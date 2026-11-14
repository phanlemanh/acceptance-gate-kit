// goc-loi-tu-host.mjs — gốc gói lõi (acceptance-gate) khi feature-loop chạy từ BẢN KÉO kit (tự host), ở mọi bố cục
// (hồ sơ goi-cheo-loi-dieu-phoi). Đi ngược từ thư mục cho trước tới tệp khai chợ `.claude-plugin/marketplace.json` đầu
// tiên, lấy `source` của mục `acceptance-gate`: bố cục hôm nay `./` (lõi = gốc kho), bố cục mới `./plugins/acceptance-gate`.
// Bên gọi giữ đường cũ (`HERE/../..`) làm ứng viên ĐẦU; bộ giải này là ứng viên kế, rồi mới tới `resolve-plugin` (bản cài).
// Không thấy tệp khai chợ, không có mục lõi, hoặc gốc thiếu tệp `can` → null (không đoán).
import fs from 'node:fs';
import path from 'node:path';

const TEN_LOI = 'acceptance-gate';
const TRAN_CAP = 12;

export function gocLoiTuHost(tuThuMuc, { can = [] } = {}) {
  let cur = path.resolve(tuThuMuc);
  for (let i = 0; i < TRAN_CAP; i += 1) {
    const mk = path.join(cur, '.claude-plugin', 'marketplace.json');
    if (fs.existsSync(mk)) {
      let j;
      try { j = JSON.parse(fs.readFileSync(mk, 'utf8')); } catch { return null; }
      const p = (Array.isArray(j.plugins) ? j.plugins : []).find(x => x && x.name === TEN_LOI);
      if (!p || typeof p.source !== 'string') return null;
      const goc = path.resolve(cur, p.source);
      return can.every(r => fs.existsSync(path.join(goc, r))) ? goc : null;
    }
    const len = path.dirname(cur);
    if (len === cur) return null;
    cur = len;
  }
  return null;
}
