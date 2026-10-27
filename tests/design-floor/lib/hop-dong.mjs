// Bên ĐỌC duy nhất của hai khối máy của design-floor: hợp đồng nhập (HOP-DONG-NHAP.md) và sổ bản vá
// cục bộ (LOCAL-PATCHES.md). Bộ đo hành vi (hop-dong.mjs), rào đóng kín (rao-dong.mjs), công cụ đồng bộ
// (dong-bo.mjs) và phép thử đỏ (tu-thu.mjs) đều rút mã thoát, lệnh, đường vendored, danh sách cấm, trần,
// giới hạn và bản vá từ ĐÂY — văn xuôi giải thích, khối máy quyết. Đường dẫn suy từ vị trí tệp, không hardcode.
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const GOC_KIT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
export const DUONG_HOP_DONG = join(GOC_KIT, 'design-floor/HOP-DONG-NHAP.md');
export const DUONG_KHOA = join(GOC_KIT, 'design-floor/upstream.lock.json');

function docKhoi(duong, ten) {
  const mo = `<!-- <<<${ten} -->`;
  const dong = `<!-- ${ten}>>> -->`;
  const md = readFileSync(duong, 'utf8');
  const a = md.indexOf(mo);
  const b = md.indexOf(dong);
  if (a < 0 || b < a) throw new Error(`${duong}: thiếu khối máy ${ten}`);
  const m = /```json\n([\s\S]*?)\n```/.exec(md.slice(a + mo.length, b));
  if (!m) throw new Error(`${duong}: khối ${ten} không chứa khối \`\`\`json`);
  return JSON.parse(m[1]);
}

export function docHopDong(duong = DUONG_HOP_DONG) {
  return docKhoi(duong, 'DESIGN-FLOOR-HOP-DONG');
}

export function docSoVa(duong) {
  return docKhoi(duong, 'DESIGN-FLOOR-LOCAL-PATCHES');
}

// Đối số dòng lệnh chung: --hop-dong <md> · --khoa <json> · --goc <gốc kit> · --ui <bản gói> · --chi <ID,ID>.
// --goc thay gốc mà các đường của khối `vendor` (bản vendored, vỏ, bản gói, sổ vá) và tệp vá suy từ đó —
// tu-thu.mjs dựng một bản sao bố cục kit rồi trỏ bộ đo vào nó.
export function docDoiSo(argv) {
  const out = { hopDong: DUONG_HOP_DONG, khoa: DUONG_KHOA, goc: GOC_KIT, ui: null, chi: null, ghi: false, kiem: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--hop-dong') out.hopDong = resolve(argv[++i]);
    else if (a === '--khoa') out.khoa = resolve(argv[++i]);
    else if (a === '--goc') out.goc = resolve(argv[++i]);
    else if (a === '--ui') out.ui = resolve(argv[++i]);
    else if (a === '--chi') out.chi = new Set(argv[++i].split(','));
    else if (a === '--write') out.ghi = true;
    else if (a === '--kiem') out.kiem = true;
    else throw new Error(`đối số lạ: ${a}`);
  }
  return out;
}

export function soVaTai(hd, goc) {
  return docSoVa(join(goc, hd.vendor.so_va));
}

// Phán xử MỘT phép đo theo giới hạn đã khai — xfail CHẶT:
//   xanh, không khai  → PASS      · đỏ, đã khai, đúng chữ ký → XFAIL (giới hạn sống)
//   đỏ, không khai    → FAIL      · đỏ, đã khai, sai chữ ký  → FAIL (đỏ vì lý do khác — phân loại lại)
//   xanh mà đã khai   → XPASS = FAIL (bản vá đã sửa? gỡ giới hạn để phép đo canh lại)
// Mỗi giới hạn phải có đường ra: `can_upstream` (sửa đổi nó chờ) và `ban_va` — mã một dòng CHỜ VÁ của sổ
// LOCAL-PATCHES. Con trỏ vắng, chết, hay trỏ bản vá đã áp đều là FAIL: kit không gửi PR upstream, nên một
// giới hạn chỉ sống chừng nào có một bản vá cục bộ có tên đang chờ gỡ nó.
// Đối chứng hỏng (`hong`) luôn là FAIL: phép đo không phân biệt được «bắt đúng» với «chưa chạy».
export function phanXu(hd, id, kq, so) {
  const gh = (hd.gioi_han || []).find((g) => g.id === id);
  if (kq.hong) return { nhan: 'FAIL', loi: `đối chứng hỏng — ${kq.hong}` };
  if (gh) {
    if (!gh.can_upstream || !gh.ban_va) {
      return { nhan: 'FAIL', loi: `giới hạn ${id} thiếu can_upstream/ban_va — giới hạn không có đường ra` };
    }
    const dong = (so?.ban_va || []).find((d) => d.id === gh.ban_va);
    if (!dong) return { nhan: 'FAIL', loi: `giới hạn ${id}: ban_va «${gh.ban_va}» là con trỏ chết — sổ LOCAL-PATCHES không có dòng ${gh.ban_va}` };
    if (dong.trang_thai !== 'cho-va') {
      return { nhan: 'FAIL', loi: `giới hạn ${id}: ban_va «${gh.ban_va}» trỏ bản vá đã áp — bản vá đã áp mà giới hạn còn sống; gỡ giới hạn hoặc trỏ một bản vá chờ` };
    }
  }
  if (!kq.do) {
    return gh
      ? { nhan: 'XPASS', loi: `đã khai là giới hạn mà phép đo XANH — gỡ ${id} khỏi gioi_han (bản vá đã sửa?)` }
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
  if (px.nhan === 'PASS') {
    console.log(`  PASS: ${id} ${ten}`);
    if (chiTiet) console.log(`         đo: ${chiTiet}`);
  } else if (px.nhan === 'XFAIL') {
    console.log(`  XFAIL: ${id} ${ten} — giới hạn đã khai, chờ bản vá ${px.gh.ban_va}: ${px.gh.can_upstream}`);
    if (chiTiet) console.log(`         đo: ${chiTiet}`);
  } else console.log(`  ${px.nhan === 'XPASS' ? 'XPASS→FAIL' : 'FAIL'}: ${id} ${ten} — ${px.loi}`);
  return px.nhan === 'PASS' || px.nhan === 'XFAIL';
}
