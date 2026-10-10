// Kiểm môi trường của «tiếp tục» (spec workflow §16 T12, design DP3 §3 chỗ chọn 7). Kho tự khai phần riêng
// (.env, Docker, bun…) bằng khoá `kiem_moi_truong` của cấu hình đợt: mỗi lệnh chạy ở gốc kho, có trần. Cộng
// mục `ban-goi`: bản gói đang cài khác bản lõi đợt đã chép → chỉ báo, không tự chép (đổi lõi giữa đợt là
// quyết định của người).
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { docJson } from './dot.mjs';

const DAY = path.dirname(fileURLToPath(import.meta.url));
export const TRAN_MAC_DINH_MS = 30_000;

export function kiemMoiTruong(thuMuc, { gocKho, tranMs = TRAN_MAC_DINH_MS } = {}) {
  const ra = [];
  const cfg = docJson(path.join(thuMuc, 'dieu-phoi.config.json'), {}) ?? {};
  for (const { ten, lenh } of Array.isArray(cfg.kiem_moi_truong) ? cfg.kiem_moi_truong : []) {
    const r = spawnSync('sh', ['-c', lenh], { cwd: gocKho, timeout: tranMs, encoding: 'utf8' });
    const muc = `moi-truong:${ten}`;
    if (r.error?.code === 'ETIMEDOUT' || r.signal) ra.push({ muc, trang_thai: 'thieu', viec: `\`${lenh}\` quá ${Math.round(tranMs / 1000)}″` });
    else if (r.status !== 0) ra.push({ muc, trang_thai: 'thieu', viec: `\`${lenh}\`: ${(r.stderr ?? '').trim().split('\n')[0] || `thoát ${r.status}`}` });
    else ra.push({ muc, trang_thai: 'du', viec: lenh });
  }
  const loi = docJson(path.join(thuMuc, 'loi', 'PHIEN-BAN.json'), null);
  const goi = docJson(path.join(DAY, '..', '.claude-plugin', 'plugin.json'), null);
  if (loi && goi?.version) {
    ra.push(loi.phien_ban === goi.version
      ? { muc: 'ban-goi', trang_thai: 'du', viec: goi.version }
      : { muc: 'ban-goi', trang_thai: 'thieu', viec: `lõi đợt bản ${loi.phien_ban}, gói đang cài bản ${goi.version} — chạy \`chay\` sau khi dừng bộ phát lịch nếu muốn dùng lõi mới` });
  }
  return ra;
}
