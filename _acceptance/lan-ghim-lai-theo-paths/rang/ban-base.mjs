// Bản base cho ca vi phân: lấy TRỌN thư mục scripts + lib + feature-loop/scripts tại
// merge-base với nhánh chính bằng `git archive` — không chép danh sách tệp tay (P150, 23/08).
import { execFileSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { KIT } from './kho-mau.mjs';

export function banBase(ref = process.env.LGTP_BASE_REF || 'origin/main') {
  const D = mkdtempSync(path.join(tmpdir(), 'lgtp-base-'));
  const mb = execFileSync('git', ['-C', KIT, 'merge-base', 'HEAD', ref], { encoding: 'utf8' }).trim();
  execFileSync('bash', ['-c', `git -C "$1" archive "$2" scripts lib feature-loop | tar -x -C "$3"`, '_', KIT, mb, D]);
  return D;
}
