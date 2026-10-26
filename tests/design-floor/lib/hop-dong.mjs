// Bên ĐỌC duy nhất của khối máy trong hợp đồng nhập design-floor.
// Bộ đo hành vi (hop-dong.mjs), rào đóng kín (rao-dong.mjs) và phép thử đỏ (tu-thu.mjs)
// đều rút mã thoát, lệnh, danh sách cấm, trần và giới hạn đã khai từ ĐÂY — văn xuôi của
// hợp đồng giải thích, khối máy quyết. Đường dẫn suy từ vị trí tệp, không hardcode.
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const GOC_KIT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
export const DUONG_HOP_DONG = join(GOC_KIT, 'design-floor/HOP-DONG-NHAP.md');
export const DUONG_KHOA = join(GOC_KIT, 'design-floor/upstream.lock.json');

const MO = '<!-- <<<DESIGN-FLOOR-HOP-DONG -->';
const DONG = '<!-- DESIGN-FLOOR-HOP-DONG>>> -->';

export function docHopDong(duong = DUONG_HOP_DONG) {
  const md = readFileSync(duong, 'utf8');
  const a = md.indexOf(MO);
  const b = md.indexOf(DONG);
  if (a < 0 || b < a) throw new Error(`${duong}: thiếu khối máy DESIGN-FLOOR-HOP-DONG`);
  const m = /```json\n([\s\S]*?)\n```/.exec(md.slice(a + MO.length, b));
  if (!m) throw new Error(`${duong}: khối DESIGN-FLOOR-HOP-DONG không chứa khối \`\`\`json`);
  return JSON.parse(m[1]);
}

// Đối số dòng lệnh chung: --hop-dong <md> · --khoa <json> · --chi <ID,ID>.
export function docDoiSo(argv) {
  const out = { hopDong: DUONG_HOP_DONG, khoa: DUONG_KHOA, chi: null, ghi: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--hop-dong') out.hopDong = resolve(argv[++i]);
    else if (a === '--khoa') out.khoa = resolve(argv[++i]);
    else if (a === '--chi') out.chi = new Set(argv[++i].split(','));
    else if (a === '--write') out.ghi = true;
    else throw new Error(`đối số lạ: ${a}`);
  }
  return out;
}

// Phán xử MỘT phép đo theo giới hạn đã khai — xfail CHẶT:
//   xanh, không khai  → PASS      · đỏ, đã khai, đúng chữ ký → XFAIL (giới hạn sống)
//   đỏ, không khai    → FAIL      · đỏ, đã khai, sai chữ ký  → FAIL (đỏ vì lý do khác — phân loại lại)
//   xanh mà đã khai   → XPASS = FAIL (upstream đã sửa? gỡ giới hạn để phép đo canh lại)
// Đối chứng hỏng (`hong`) luôn là FAIL: phép đo không phân biệt được «bắt đúng» với «chưa chạy».
export function phanXu(hd, id, kq) {
  const gh = (hd.gioi_han || []).find((g) => g.id === id);
  if (kq.hong) return { nhan: 'FAIL', loi: `đối chứng hỏng — ${kq.hong}` };
  if (gh && (!gh.can_upstream || !gh.pr_upstream)) {
    return { nhan: 'FAIL', loi: `giới hạn ${id} thiếu can_upstream/pr_upstream — giới hạn không có đường ra` };
  }
  if (!kq.do) {
    return gh
      ? { nhan: 'XPASS', loi: `đã khai là giới hạn mà phép đo XANH — gỡ ${id} khỏi gioi_han (upstream đã sửa?)` }
      : { nhan: 'PASS' };
  }
  if (!gh) return { nhan: 'FAIL', loi: kq.chi_tiet };
  if (gh.vi_pham) {
    const khai = new Set(gh.vi_pham);
    const thay = new Set(kq.danh_sach || []);
    const moi = [...thay].filter((x) => !khai.has(x));
    const mat = [...khai].filter((x) => !thay.has(x));
    if (moi.length || mat.length) {
      return {
        nhan: 'FAIL',
        loi: [moi.length && `vi phạm CHƯA khai: ${moi.join(', ')}`, mat.length && `đã khai mà KHÔNG còn: ${mat.join(', ')}`]
          .filter(Boolean)
          .join(' · '),
      };
    }
    return { nhan: 'XFAIL', gh };
  }
  if (!new RegExp(gh.chu_ky_do).test(kq.chi_tiet)) {
    return { nhan: 'FAIL', loi: `đỏ khác chữ ký đã khai /${gh.chu_ky_do}/: ${kq.chi_tiet}` };
  }
  return { nhan: 'XFAIL', gh };
}

export function inKetQua(id, ten, px, chiTiet) {
  if (px.nhan === 'PASS') console.log(`  PASS: ${id} ${ten}`);
  else if (px.nhan === 'XFAIL') {
    console.log(`  XFAIL: ${id} ${ten} — giới hạn đã khai, chờ upstream (${px.gh.pr_upstream}): ${px.gh.can_upstream}`);
    if (chiTiet) console.log(`         đo: ${chiTiet}`);
  } else console.log(`  ${px.nhan === 'XPASS' ? 'XPASS→FAIL' : 'FAIL'}: ${id} ${ten} — ${px.loi}`);
  return px.nhan === 'PASS' || px.nhan === 'XFAIL';
}
