// buoc3-duong-chep.mjs — luật ĐƯỜNG đổi tên của bước 3 kịch bản chuyển nhà, áp lên kho mới mà thước dựng.
//
// CHÉP (không nạp) `luatDuongDoiTen` + vòng áp của `buoc3DoiTen` từ kho kế nhiệm, worktree B2
// `~/dev/delivery-loop/.claude/worktrees/b2-bo-kiem-xanh-o-kho-moi-3db198/migration/kich-ban/don-nha.mjs` dòng 128–139 và
// 160–175, commit `86669ccd` (16/11). Bản chép bước 1–3 mà thước vòng hai dùng (`goi-cheo-loi-dieu-phoi/rang/luat-doi-chu.mjs`,
// chép ở `5192aff2`) THIẾU luật này, nên kho mới của thước lệch kịch bản thật đúng ở mã sản phẩm trỏ tới skill/lệnh đã đổi
// tên bằng đường (`path.join(…, 'skills', 'cat-luot', …)` trong `scripts/co-hop-dong.cjs` — đo 16/11: LT-142 trio đỏ ở kho mới
// của thước, xanh ở cây B2). Mỗi luật chỉ áp trong thư mục của chính plugin ấy. Rủi ro trôi: đo chéo ở lượt đo của B2.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { LENH, THU_MUC } from '../../goi-cheo-loi-dieu-phoi/rang/luat-doi-chu.mjs';

const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Thư mục đích của từng plugin theo tên cũ (`acceptance-gate` là lõi ở gốc kho phẳng).
const dichPlugin = pc => (pc === 'acceptance-gate' ? 'plugins/acceptance-gate' : THU_MUC[pc]);

export function luatDuongDoiTen() {
  const L = [];
  for (const [cu, moi] of Object.entries(LENH)) {
    const [pc, lc] = cu.split(':'); const lm = moi.split(':')[1]; const D = dichPlugin(pc);
    if (!D) continue;
    L.push({ chiTrong: D, re: new RegExp(`(['"])skills\\1(\\s*,\\s*)(['"])${esc(lc)}\\3`, 'g'), thay: `$1skills$1$2$3${lm}$3` });
    L.push({ chiTrong: D, re: new RegExp(`(?<![\\w-])skills/${esc(lc)}(?=/)`, 'g'), thay: `skills/${lm}` });
    L.push({ chiTrong: D, re: new RegExp(`(?<![\\w-])commands/${esc(lc)}\\.md(?![\\w-])`, 'g'), thay: `commands/${lm}.md` });
  }
  return L;
}

const laChu = buf => !buf.subarray(0, 8192).includes(0);
// Áp lên mọi tệp chữ đang theo dõi dưới plugins/ của kho `d`; trả số chỗ đổi. Người gọi commit.
export function apDuongDoiTen(d) {
  const L = luatDuongDoiTen(); let n = 0;
  const ds = execFileSync('git', ['-C', d, 'ls-files', '-z', 'plugins'], { encoding: 'utf8', maxBuffer: 1 << 28 }).split('\0').filter(Boolean);
  for (const t of ds) {
    const p = path.join(d, t); const buf = readFileSync(p); if (!laChu(buf)) continue;
    let nd = buf.toString('utf8'); const goc = nd;
    for (const l of L) { if (!t.startsWith(`${l.chiTrong}/`)) continue; const k = (nd.match(l.re) || []).length; if (k) { nd = nd.replace(l.re, l.thay); n += k; } }
    if (nd !== goc) writeFileSync(p, nd);
  }
  return n;
}
