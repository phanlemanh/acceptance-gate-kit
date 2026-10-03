// Bản base cho ca vi phân: TRỌN `scripts lib feature-loop` bằng `git archive` (không chép danh sách
// tệp tay — P150) tại MỐC GHIM: `main` lúc S3 của vòng bắt đầu (8ac65451, 03/10 — sau khi vòng
// lan-ghim-lai-giu-tron-loi-loi gộp). Ghim chứ không lấy merge-base(HEAD, origin/main): sau khi gộp,
// merge-base = HEAD và bản base thành chính cây đang kiểm (bài học lượt chấm vòng chị em, t2).
import { execFileSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { KIT } from './kho-mau.mjs';
export const MOC_BASE = '8ac6545162f029e1e0cda1dfb31f98ec5037ed09';
export function banBase(ref = process.env.LGTP_BASE_REF || MOC_BASE) {
  const D = mkdtempSync(path.join(tmpdir(), 'lgtp-base-'));
  execFileSync('bash', ['-c', 'git -C "$1" archive "$2" scripts lib feature-loop | tar -x -C "$3"', '_', KIT, ref, D]);
  return D;
}
