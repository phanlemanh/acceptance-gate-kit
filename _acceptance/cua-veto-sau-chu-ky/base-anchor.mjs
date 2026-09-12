// Neo BASE cho hai chân so-với-bản-cũ (AC-7 · AC-10).
//
// base = CHA của commit ĐẦU TIÊN đưa CÂU GHIM vào scripts/pre-merge-check.sh,
// tìm bằng `git log -S` NGAY TRONG LƯỢT CHẠY. Không bao giờ gõ tay một sha
// (29 pin-phantom 07/08: sha phải là đầu ra lệnh), và KHÔNG neo origin/main:
// main trôi giữa lượt chấm, và sau khi hồ sơ gộp thì main đã mang bản sửa nên
// hai chân tự chết ở chiến dịch ghim lại ([release-2-10-0#F1]).
//
// Tự kiểm hai vế trước khi trả về; sai một vế → thoát 97 (mã hạ tầng, khối
// INFRA-EXIT-CODES của acceptance-verify.js): không xanh, cũng không đỏ trên vật.
import { execFileSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { ROOT, CAU_GHIM } from './fixture.mjs';

const LUOI = 'scripts/pre-merge-check.sh';
const haTang = msg => { console.error(`LỖI HẠ TẦNG: base không hợp lệ — ${msg}`); process.exit(97); };

// `root` nhận tham số để chính bộ neo được đo trên một kho KHÁC (chiều đỏ 2 chạy
// nó trên một kho chưa có câu ghim và đòi thoát 97).
export function baseAnchor(root = ROOT) {
  const git = a => execFileSync('git', ['-C', root, ...a], { encoding: 'utf8' }).trim();
  let c;
  try { c = git(['log', '--reverse', '--format=%H', '-S', CAU_GHIM, '--', LUOI]).split('\n')[0]; }
  catch (e) { haTang(`git log -S hỏng (${e.message.split('\n')[0]})`); }
  if (!c) haTang('chưa có commit nào mang câu ghim vào lưới');
  let b;
  try { b = git(['rev-parse', `${c}^`]); } catch { haTang(`commit ${c.slice(0, 8)} không có cha`); }
  let banBase;
  try { banBase = execFileSync('git', ['-C', root, 'show', `${b}:${LUOI}`], { encoding: 'utf8', maxBuffer: 1e8 }); }
  catch { haTang(`không đọc được ${LUOI} ở base ${b.slice(0, 8)}`); }
  if (banBase.includes(CAU_GHIM)) haTang(`bản base ${b.slice(0, 8)} ĐÃ mang câu ghim`);
  if (git(['rev-parse', `${b}:${LUOI}`]) === git(['rev-parse', `HEAD:${LUOI}`]))
    haTang(`base ${b.slice(0, 8)} trùng HEAD trên ${LUOI}`);
  return b;
}

// Bản base dựng bằng `git archive` TRỌN thư mục scripts + lib (P150: chép danh
// sách file tay thì vật được đo gọi thêm một script mới là bản base thiếu file,
// và phép so đỏ vì HẠ TẦNG chứ không vì vật).
export function mkBaseTree(b) {
  const d = mkdtempSync(path.join(tmpdir(), 'cvsck-base-'));
  execFileSync('bash', ['-c', `git -C "${ROOT}" archive "${b}" scripts lib | tar -x -C "${d}"`]);
  return d;
}
