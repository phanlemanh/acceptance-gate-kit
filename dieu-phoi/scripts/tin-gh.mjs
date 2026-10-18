// MỘT chỗ gọi `gh` cho lệnh `tin` (hồ sơ vong-mo-co-chu-giu). Lệnh lấy từ DIEU_PHOI_GH (test thay bằng gh giả), mọi lời
// gọi có trần thời gian: hết trần thì giết tiến trình con và trả «quá trần», không treo phiên.
import { spawnSync } from 'node:child_process';

export const lenhGh = () => process.env.DIEU_PHOI_GH || 'gh';

// Trả {ma, out, err}. ma = 0 khi thành công; khác 0 kèm err có tên khi lỗi, không chạy được, hay quá trần.
export function goiGh(doiSo, { tranMs = 15_000, cwd = undefined, input = undefined } = {}) {
  const r = spawnSync(lenhGh(), doiSo, { cwd, input, encoding: 'utf8', timeout: tranMs, killSignal: 'SIGKILL', maxBuffer: 64 * 1024 * 1024 });
  if (r.error?.code === 'ENOENT') return { ma: 127, out: '', err: `không chạy được gh (${lenhGh()}): không có lệnh` };
  if (r.error?.code === 'ETIMEDOUT' || r.signal === 'SIGKILL') return { ma: 124, out: r.stdout ?? '', err: `gh quá trần ${tranMs} ms` };
  if (r.error) return { ma: 1, out: '', err: `không chạy được gh: ${r.error.message}` };
  return { ma: r.status ?? 1, out: r.stdout ?? '', err: (r.stderr ?? '').trim() };
}
