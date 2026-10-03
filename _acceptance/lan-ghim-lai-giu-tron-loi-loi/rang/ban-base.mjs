// Bản base cho vi phân: TRỌN `scripts lib feature-loop` bằng `git archive` (không chép danh sách
// tệp tay — P150) tại MỐC GHIM của vòng: commit nhánh chính lúc vòng mở (ad7a9df8, 02/10). Ghim chứ
// không lấy merge-base(HEAD, origin/main): sau khi gộp, merge-base = HEAD và bản base thành chính cây
// đang kiểm (lượt chấm 1, phát hiện t2). Bản base chạy với CHÍNH bộ máy của nó (--ag-root = base),
// không lai lib mới với làn cũ.
import { execFileSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { KIT } from './kho-mau.mjs';
export const MOC_BASE = 'ad7a9df8f02fdb10c69bec3220b838a44cf75db8';
export function banBase(ref = process.env.GTLL_BASE_REF || MOC_BASE) {
  const D = mkdtempSync(path.join(tmpdir(), 'gtll-base-'));
  execFileSync('bash', ['-c', 'git -C "$1" archive "$2" scripts lib feature-loop | tar -x -C "$3"', '_', KIT, ref, D]);
  return D;
}
