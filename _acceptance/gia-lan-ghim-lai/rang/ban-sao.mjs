// ban-sao.mjs — mốc và bản sao cho bộ răng hồ sơ gia-lan-ghim-lai.
// BASE-GIA (engine trước vòng) ghim trong contract; SAU-GIA = commit mới nhất mang dấu
// «(gia-lan-ghim-lai)» trong thông điệp — cố định sau khi gộp, nên hồ sơ đã ký còn ghim lại được
// ở mọi HEAD sau này (chiều đỏ và phép vi phân không so HEAD). Bản sao lấy TRỌN thư mục bằng
// `git archive`, không chép danh sách tệp tay (bài học P150).
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(HERE, '..', '..', '..');
// Chạy trong bản sao (không phải kho git) thì chan.mjs truyền gốc kho thật qua GG_REPO.
export const REPO = process.env.GG_REPO || ROOT;
const git = (...a) => execFileSync('git', ['-C', REPO, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

export const BASE_GIA = 'bf79fdb11fe6e69b12efa1b4c9c7cf40fbb36e1d';
export function baseGia() {
  const c = path.join(ROOT, '_acceptance', 'gia-lan-ghim-lai', 'contract.md');
  if (existsSync(c) && !readFileSync(c, 'utf8').includes(BASE_GIA)) throw new Error('BASE-GIA trong bộ răng lệch với contract');
  return BASE_GIA;
}
// chiLan: true → chỉ commit chạm feature-loop/scripts (định nghĩa SAU-GIA của AC-7);
// false → commit mang dấu mới nhất bất kỳ (cây trọn cho chiều đỏ — có cả ca bền mới nhất).
export function sauGia({ chiLan = false } = {}) {
  const sha = git('log', '--format=%H', '-n', '1', '--fixed-strings', '--grep=(gia-lan-ghim-lai)', ...(chiLan ? ['--', 'feature-loop/scripts'] : []));
  if (!/^[0-9a-f]{40}$/.test(sha)) throw new Error('không tìm thấy commit lõi (SAU-GIA) — chưa có commit nào mang dấu (gia-lan-ghim-lai)');
  return sha;
}
export const THU_MUC_CAY = ['feature-loop', 'tests/scripts', 'lib', 'scripts', 'commands', 'skills', 'GUIDE.md', '_acceptance/gia-lan-ghim-lai'];
export const THU_MUC_BAN_MAY = ['feature-loop/scripts', 'lib', 'scripts'];
export function banSao(sha, thuMuc) {
  const d = mkdtempSync(path.join(tmpdir(), `gg-ban-sao-${sha.slice(0, 7)}-`));
  execFileSync('bash', ['-c', `git -C "$1" archive "$2" -- "\${@:4}" | tar -x -C "$3"`, '_', REPO, sha, d, ...thuMuc], { stdio: ['ignore', 'pipe', 'pipe'] });
  return d;
}
