// hai-bo-cuc.mjs — cây phẳng VÀ cây bố cục mới của cùng một mã, cho bất kỳ commit nào (hồ sơ phan-du-bo-cuc-moi-vong-ba,
// AC-3; design §3.2). Bộ kiểm cần cả hai cây để so một hành vi ở hai bố cục; trước vòng ba chúng dựng «cây mới» bằng cách
// bung cây đang chạy rồi dọn nhà — chỉ đúng khi cây đang chạy còn phẳng (ở cây đã dọn nhà: «mục chợ … có source lạ»).
//
//   haiCay(kho, tmp, { ref = 'HEAD', epPhang = false })
//     → { phang, moi, hienTai: 'phang' | 'moi', refPhang, dichGoi }   (phang, moi: thư mục dưới `tmp`; refPhang: sha cây
//       phẳng; dichGoi: tên gói phẳng → thư mục ở bố cục mới, như `dungKhoMoi` trả)
//   - `ref` phẳng (bộ dịch đọc từ tệp khai chợ): phang = `git archive ref` TRỌN cây, moi = `dungKhoMoi(phang)`.
//   - `ref` bố cục mới: moi = `git archive ref` TRỌN cây; phang = `git archive` của CHA commit MỚI NHẤT đưa plugin.json lõi
//     vào chỗ hiện tại (đường suy bằng bộ dịch, không viết chữ) — ở lượt đo của kho kế nhiệm và ở ngày cắt sang, đó là đỉnh
//     kho cũ, tức chính mã này ở bố cục cũ. Cha ấy không phẳng → lỗi «hai-bo-cuc: cha của commit dọn nhà <sha> không phẳng».
//   - `epPhang` (chỉ cho phép đo chiều đỏ): coi `ref` là phẳng bất kể bố cục — đúng hành vi trước vòng ba.
//   chaDonNha(kho, ref) → sha cây phẳng của mã ở `ref` (chính `ref` khi nó phẳng).
//
// Giới hạn đã khai (hợp đồng, Notes; chủ kho chọn ở Hỏi-2): sau ngày cắt sang, cây phẳng là mã ĐÓNG BĂNG ở ngày ấy, không
// phải mã đang kiểm. Ngưỡng mở lại: ≥ 1 commit kho mới chạm lib/ hay scripts/ của lõi sau commit dọn nhà.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { boCuc, duong } from './bo-cuc.mjs';
import { dungKhoMoi } from '../_acceptance/goi-cheo-loi-dieu-phoi/rang/luat-doi-chu.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BANG = JSON.parse(readFileSync(path.join(HERE, 'fixtures', 'bo-cuc-phang.json'), 'utf8'));
const PLUGIN_LOI = BANG.tep_khai.plugin; // plugin.json của gói lõi, viết theo bố cục phẳng — bộ dịch đưa về chỗ thật
const loi = m => new Error(`hai-bo-cuc: ${m}`);
const git = (kho, ...a) => execFileSync('git', ['-C', kho, ...a], { encoding: 'utf8', maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const sha = (kho, ref) => { try { return git(kho, 'rev-parse', '--verify', `${ref}^{commit}`); } catch { throw loi(`${ref} không phải commit ở ${kho}`); } };
const laPhang = (kho, ref) => boCuc({ kho, ref }).phang;
function bung(kho, ref, dich) {
  mkdirSync(dich, { recursive: true });
  execFileSync('bash', ['-c', 'set -o pipefail; git -C "$1" archive "$2" | tar -x -C "$3"', '_', kho, ref, dich]);
  return dich;
}

export function chaDonNha(kho, ref = 'HEAD') {
  const s = sha(kho, ref);
  if (laPhang(kho, s)) return s;
  const rel = duong(PLUGIN_LOI, { kho, ref: s });
  const them = git(kho, 'log', '--diff-filter=A', '--format=%H', '-1', s, '--', rel);
  if (!them) throw loi(`không tìm thấy commit đưa ${rel} vào ${s.slice(0, 8)}`);
  const cha = git(kho, 'rev-parse', `${them}^`);
  if (!laPhang(kho, cha)) throw loi(`cha của commit dọn nhà ${cha} không phẳng`);
  return cha;
}

export function haiCay(kho, tmp, { ref = 'HEAD', epPhang = false } = {}) {
  const s = sha(kho, ref);
  if (epPhang || laPhang(kho, s)) {
    const phang = bung(kho, s, path.join(tmp, 'phang'));
    const moi = path.join(tmp, 'moi'); const { dichGoi } = dungKhoMoi(phang, moi);
    return { phang, moi, hienTai: 'phang', refPhang: s, dichGoi };
  }
  const refPhang = chaDonNha(kho, s);
  const phang = bung(kho, refPhang, path.join(tmp, 'phang'));
  const { dichGoi } = dungKhoMoi(phang, path.join(tmp, 'moi-dung')); // chỉ để lấy bảng thư mục đích, cây thật là `moi`
  return { phang, moi: bung(kho, s, path.join(tmp, 'moi')), hienTai: 'moi', refPhang, dichGoi };
}
