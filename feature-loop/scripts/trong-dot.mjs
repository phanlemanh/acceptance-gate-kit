#!/usr/bin/env node
// Nhận biết đợt Điều phối – Thợ cho feature-loop (hồ sơ dieu-phoi-feature-loop-trong-dot, khối TRONG-DOT của
// SKILL) — CHỈ ĐỌC. Kho không có đợt: thoát 0, KHÔNG in byte nào, không gọi lệnh nào của gói dieu-phoi.
// Có đợt: gọi `tho --json` của BẢN LÕI trong thư mục đợt (mã bộ phát lịch đang chạy, chép bằng `chay`) và in
// JSON khi phiên thuộc một dãy; phiên không thuộc dãy (giám sát) → không in gì.
// Gốc kho chính giải bằng --git-common-dir: trong một worktree, --show-toplevel trả gốc của worktree, nơi
// không có symlink đợt. Tên symlink bằng TEN_LIEN_KET của dieu-phoi/scripts/dot.mjs (ca DP7-01 so hai chuỗi).
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const TEN_LIEN_KET = 'dieu-phoi-hien-tai';

export function nhanBiet(root, slug = null) {
  let chung;
  try {
    chung = execFileSync('git', ['rev-parse', '--path-format=absolute', '--git-common-dir'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
  let thuMuc;
  try {
    thuMuc = fs.realpathSync(path.join(path.dirname(chung), '.acceptance-runs', TEN_LIEN_KET));
  } catch {
    return '';
  }
  const ten = path.basename(thuMuc).replace(/^dieu-phoi-/, '');
  const cli = path.join(thuMuc, 'loi', 'dieu-phoi.mjs');
  if (!fs.existsSync(cli)) return `trong-dot: đợt ${ten} chưa có bản lõi (loi/) — khối Trong đợt không bật; chạy lại \`chay\` của đợt\n`;
  const r = spawnSync(process.execPath, [cli, 'tho', '--json', ...(slug ? ['--slug', slug] : [])], { cwd: root, encoding: 'utf8' });
  let kq = null;
  try {
    kq = r.status === 0 ? JSON.parse(r.stdout) : null;
  } catch {
    kq = null;
  }
  if (!kq) return `trong-dot: lõi của đợt ${ten} chưa có lệnh tho — khối Trong đợt không bật\n`;
  return kq.trong_dot ? `${JSON.stringify(kq)}\n` : '';
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  const a = process.argv.slice(2);
  const lay = (k) => (a.includes(k) ? a[a.indexOf(k) + 1] : null);
  process.stdout.write(nhanBiet(path.resolve(lay('--root') ?? '.'), lay('--slug')));
}
