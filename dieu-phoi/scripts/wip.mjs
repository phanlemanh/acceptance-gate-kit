// Commit WIP của bàn giao — MỘT đường cho lưới cuối (hook StopFailure) và `ban-giao-xong --wip` (review DP4 I4, I5).
// Không commit giữa một thao tác git nhiều bước (merge, rebase, cherry-pick, revert dở): commit lúc đó khép thao tác
// thay thợ. Commit lỗi thì trả index về đúng bản trước `add -A` — phần thợ đã stage có chủ ý không bị gỡ. Luôn
// `git commit` thường: không bỏ hook của kho.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const THAO_TAC_DO = ['MERGE_HEAD', 'rebase-merge', 'rebase-apply', 'CHERRY_PICK_HEAD', 'REVERT_HEAD'];
const dongDau = (r) => `${r.stderr ?? ''}${r.stdout ?? ''}`.split('\n').map((x) => x.trim()).find(Boolean) ?? null;

// Tên dấu của thao tác git đang dở ở worktree, null khi không có. `--git-path` trỏ đúng thư mục git của worktree liên kết.
export function thaoTacDo(wt) {
  for (const ten of THAO_TAC_DO) {
    const r = spawnSync('git', ['rev-parse', '--git-path', ten], { cwd: wt, encoding: 'utf8' });
    const p = (r.stdout ?? '').trim();
    if (r.status === 0 && p && fs.existsSync(path.resolve(wt, p))) return ten;
  }
  return null;
}

// → { ket: 'sach' } · { ket: 'commit', sha } · { ket: 'bo', ly_do } (không thử commit) · { ket: 'loi', ly_do } (commit lỗi,
// index đã trả lại). `timeoutMs` chặn hook pre-commit treo vượt hạn của hook gọi nó.
export function commitWip(wt, thongDiep, { timeoutMs = null } = {}) {
  const ban = (spawnSync('git', ['status', '--porcelain'], { cwd: wt, encoding: 'utf8' }).stdout ?? '').trim() !== '';
  if (!ban) return { ket: 'sach' };
  const dang = thaoTacDo(wt);
  if (dang) return { ket: 'bo', ly_do: `đang dở ${dang} — không commit giữa một thao tác git` };
  const cay = spawnSync('git', ['write-tree'], { cwd: wt, encoding: 'utf8' });
  if (cay.status !== 0) return { ket: 'bo', ly_do: `index chưa ghi được cây — ${dongDau(cay) ?? `mã ${cay.status}`}` };
  spawnSync('git', ['add', '-A'], { cwd: wt });
  const c = spawnSync('git', ['commit', '-q', '-m', thongDiep], { cwd: wt, encoding: 'utf8', ...(timeoutMs ? { timeout: timeoutMs } : {}) });
  if (c.status === 0) return { ket: 'commit', sha: (spawnSync('git', ['rev-parse', 'HEAD'], { cwd: wt, encoding: 'utf8' }).stdout ?? '').trim() || null };
  spawnSync('git', ['read-tree', cay.stdout.trim()], { cwd: wt }); // index về bản trước `add -A`; tệp trên đĩa không đổi
  return { ket: 'loi', ly_do: c.error?.code === 'ETIMEDOUT' ? `commit quá ${Math.round(timeoutMs / 1000)}″` : dongDau(c) ?? `mã ${c.status}` };
}
