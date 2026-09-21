// phan-loai.mjs — MỘT nguồn phân một đường dẫn (tính từ gốc kho) vào bốn lớp:
//
//   'ngoai'  — repo khai trong `risk_tiers.t1_skip_globs`: chạm nó không phải hành vi.
//   'thuoc'  — mã đo CỦA HỒ SƠ: `_acceptance/config.yaml` (nơi mọi `cmd` của eval sống) ·
//              dưới `_acceptance/<slug>/`: `evals.yaml`, mọi thứ trong thư mục `rang/`, mọi
//              tệp đuôi script. Test của KHO (khớp DO_GLOBS) KHÔNG còn là thước từ vòng
//              nhan-trang-thai-va-reality (21/09, Đ1): nó là vật — chiều đỏ của nó nằm trong
//              lịch sử TDD của kho, và đếm nó là «nhát sửa thước» phạt đúng đường TDD.
//              `DO_GLOBS` vẫn xuất khẩu: ảnh chụp thước chỉ-đọc trong lượt chấm
//              (chup-ho-so-da-thong.mjs) và `fileDoTrongDiff` của s4-args dùng nó.
//   'ho-so'  — mọi đường khác dưới `_acceptance/`: văn bản hồ sơ và tệp máy ghi (run-log,
//              sổ quyết định, tệp args, bằng chứng, thẻ, hình, đường nền, báo cáo token).
//   'vat'    — còn lại: vật được giao.
//
// Vì sao một chỗ (thuoc-co-cua AC-10): bộ sinh args (`s4-args.mjs`) và bộ đếm vật ·
// thước · nhát (`thuoc-vat.mjs`) phải trả lời CÙNG câu «tệp này là thước hay vật?».
// Hai bản mẫu là hai khuôn sẽ trôi — lớp lỗi writer/reader kit đã dẫm ba lần ở vùng vật.
// `globToRe` nhập từ bên viết sẵn có (`carry-plan.mjs`), không chép bản thứ ba.
import path from 'node:path';
import { globToRe } from '../carry-plan.mjs';

export const DO_GLOBS = ['tests/**', '**/*.test.*', '**/*.spec.*', '**/spec/**', '**/__tests__/**'];
export const HO_SO_VAN_BAN_GLOBS = ['_acceptance/*/**/*.md', '_acceptance/*/**/*.jsonl'];
export const SCRIPT_DO_RE = /\.(sh|mjs|cjs|js|py)$/;

const HO_SO_RE = /^_acceptance\/[^/]+\//;

// Mỗi vế một dòng: phép đo PL2 gỡ TỪNG vế trong bản sao và đòi đúng ô của vế ấy lật.
function laThuoc(p) {
  if (p === '_acceptance/config.yaml') return true;
  if (!HO_SO_RE.test(p)) return false;
  if (path.posix.basename(p) === 'evals.yaml') return true;
  if (p.includes('/rang/')) return true;
  if (SCRIPT_DO_RE.test(p)) return true;
  return false;
}

export function phanLoai(p, { t1SkipGlobs = [] } = {}) {
  const f = String(p).split(path.sep).join('/');
  if (t1SkipGlobs.some(g => globToRe(g).test(f))) return 'ngoai';
  if (laThuoc(f)) return 'thuoc';
  if (f.startsWith('_acceptance/')) return 'ho-so';
  return 'vat';
}
