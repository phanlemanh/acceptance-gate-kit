// ban-sao.mjs — mốc và bản sao cho bộ răng hồ sơ eval-goi-model-that-khong-chay (khuôn mượn từ hồ sơ
// gia-lan-ghim-lai, chép — không nạp chéo hồ sơ đã ký). BASE_G3 (merge-base trước vòng) ghim trong
// contract; SAU-G3 = commit không-gộp mới nhất mang dấu «(eval-goi-model-that-khong-chay)» VÀ chạm
// feature-loop/scripts — commit ký và commit ghim lại không chạm thư mục đó nên SAU-G3 cố định sau khi
// gộp. Bản sao lấy TRỌN thư mục bằng `git archive`, không chép danh sách tệp tay (bài học P150).
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(HERE, '..', '..', '..');
export const SLUG = 'eval-goi-model-that-khong-chay';
const git = (...a) => execFileSync('git', ['-C', ROOT, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

export const BASE_G3 = '08ba287d30ad96a89e3103436822f298c2684296';
export function baseG3() {
  const c = path.join(ROOT, '_acceptance', SLUG, 'contract.md');
  if (!existsSync(c) || !readFileSync(c, 'utf8').includes(BASE_G3)) throw new Error('BASE_G3 trong bộ răng lệch với contract');
  git('cat-file', '-e', `${BASE_G3}^{commit}`);
  return BASE_G3;
}
export function sauG3() {
  const sha = git('log', '-n', '1', '--no-merges', '--format=%H', '--fixed-strings', `--grep=(${SLUG})`, '--', 'feature-loop/scripts');
  if (!/^[0-9a-f]{40}$/.test(sha)) throw new Error(`không tìm thấy commit lõi SAU-G3 — chưa có commit nào mang dấu (${SLUG}) chạm feature-loop/scripts`);
  return sha;
}
export const THU_MUC_CAY = ['feature-loop', 'tests/scripts', 'lib', 'scripts', 'commands', 'skills', 'GUIDE.md'];
export const THU_MUC_BAN_MAY = ['feature-loop/scripts', 'lib', 'scripts'];
export function banSao(sha, thuMuc) {
  const d = mkdtempSync(path.join(tmpdir(), `egm-ban-sao-${sha.slice(0, 7)}-`));
  execFileSync('bash', ['-c', `git -C "$1" archive "$2" -- "\${@:4}" | tar -x -C "$3"`, '_', ROOT, sha, d, ...thuMuc], { stdio: ['ignore', 'pipe', 'pipe'] });
  return d;
}
// Băm cây của một thư mục ở một commit — hai nguồn so vi phân phải KHÁC nhau.
export const cayCua = (sha, rel) => git('rev-parse', `${sha}:${rel}`);
