// Bản base cho vi phân: TRỌN feature-loop/ tại merge-base với nhánh chính bằng `git archive`
// (không chép danh sách tệp tay — P150). Bộ máy lib vẫn là KIT: vòng này không sửa lib.
import { execFileSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { KIT } from './kho-mau.mjs';
export function banBase(ref = process.env.GTLL_BASE_REF || 'origin/main') {
  const D = mkdtempSync(path.join(tmpdir(), 'gtll-base-'));
  const mb = execFileSync('git', ['-C', KIT, 'merge-base', 'HEAD', ref], { encoding: 'utf8' }).trim();
  execFileSync('bash', ['-c', 'git -C "$1" archive "$2" feature-loop | tar -x -C "$3"', '_', KIT, mb, D]);
  return D;
}
