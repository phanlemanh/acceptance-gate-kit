// tai-may.mjs — dòng tự xưng của bàn đo cho dấu lượt đỏ của làn ghim lại
// (hồ sơ lan-ghim-lai-giu-tron-loi-loi, 03/10/2026).
//
// Vì sao tồn tại: 02/10 ở crm, làn đỏ ở hai bài khác nhau rồi xanh khi chạy lại toàn kho
// ngay sau — máy đo dùng chung đang tải 6–10/14 lõi, swap 4,4/5,1 GB. Nhân quả tải → đỏ
// CHƯA chứng minh; dòng này chỉ ghi số để đọc sau, không quyết gì.
//
// Luật duy nhất: KHÔNG BAO GIỜ ném lỗi ra ngoài. Mọi chỗ đọc hỏng nuốt về `null` và ghi lý
// do vào `nen`. Đọc tải mà làm sập làn thì làn đỏ vì bàn đo — đúng lớp lỗi dòng này đi bắt.
import os from 'node:os';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

// Nguồn đọc swap ở hai nền — hằng đầu tệp để bộ răng tiêm «nguồn không tồn tại» trong bản sao.
export const NGUON_SWAP = { mac: ['sysctl', '-n', 'vm.swapusage'], linux: '/proc/meminfo' };

// Linux: SwapTotal − SwapFree (kB) → MB nguyên. Thiếu một trong hai dòng → null.
export function swapTuMeminfo(text) {
  const kb = (k) => { const m = String(text).match(new RegExp(`^${k}:\\s+(\\d+)\\s*kB`, 'm')); return m ? Number(m[1]) : null; };
  const tot = kb('SwapTotal'); const free = kb('SwapFree');
  if (tot === null || free === null) return null;
  return Math.round((tot - free) / 1024);
}

// macOS: «total = 5120.00M  used = 4423.25M  free = 696.75M  (encrypted)» → MB nguyên.
export function swapTuSysctl(text) {
  const m = String(text).match(/used\s*=\s*([\d.]+)([KMG])/);
  if (!m) return null;
  const v = Number(m[1]); const nhan = { K: 1 / 1024, M: 1, G: 1024 }[m[2]];
  return Math.round(v * nhan);
}

function docSwap() {
  try {
    if (process.platform === 'linux') {
      const mb = swapTuMeminfo(fs.readFileSync(NGUON_SWAP.linux, 'utf8'));
      return mb === null ? { mb: null, nen: `${NGUON_SWAP.linux} thiếu SwapTotal/SwapFree` } : { mb, nen: null };
    }
    if (process.platform === 'darwin') {
      const [cmd, ...args] = NGUON_SWAP.mac;
      const r = spawnSync(cmd, args, { encoding: 'utf8', timeout: 3000 });
      // Lệnh vắng không ném mà trả qua r.error — ném lại để MỌI lỗi đọc đi qua MỘT chốt bắt
      // dưới đây (gỡ chốt ấy là làn sập ở cả hai nền; bộ răng E6 phá đúng chỗ này).
      if (r.error) throw r.error;
      if (r.status !== 0) return { mb: null, nen: `${cmd} thoát ${r.status}` };
      const mb = swapTuSysctl(r.stdout);
      return mb === null ? { mb: null, nen: `${cmd} trả khuôn lạ` } : { mb, nen: null };
    }
    return { mb: null, nen: `nền ${process.platform} chưa có nguồn đọc swap` };
  /* CATCH-SWAP */ } catch (e) {
    return { mb: null, nen: `đọc swap lỗi: ${String((e && e.code) || (e && e.message) || e).split('\n')[0]}` };
  }
}

export function docTai() {
  let load1 = null, load5 = null, ncpu = null, memFree = null;
  try { const l = os.loadavg(); load1 = Math.round(l[0] * 100) / 100; load5 = Math.round(l[1] * 100) / 100; } catch { /* để null */ }
  try { ncpu = os.cpus().length; } catch { /* để null */ }
  try { memFree = Math.round(os.freemem() / 1048576); } catch { /* để null */ }
  const sw = docSwap();
  return { load1, load5, ncpu, mem_free_mb: memFree, swap_used_mb: sw.mb, nen: sw.nen };
}
