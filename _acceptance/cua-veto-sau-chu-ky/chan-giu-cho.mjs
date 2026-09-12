// Chân giu-cho (AC-4) — chữ ký giữ-chỗ KHÔNG đóng cửa, đo trên CẢ HAI bộ đọc.
// Mẫu RÚT lúc chạy từ chính hàm placeholder_signoff của lưới; số assert = 2 × số mẫu.
import * as F from './fixture.mjs';

const mau = F.placeholderPatterns();          // ném lỗi nếu rút hụt (< 3 mẫu)
const repo = F.mkRepo();
mau.forEach((p, i) =>
  F.writeDossier(repo, F.slugGiuCho(p, i), {
    veto: F.MO, cong1: F.RONG,
    chuKy: { ten: 'giu-cho', dong: `human_signoff: ${F.giaTriGiuCho(p)}`, dung: true },
  }));
// Đối chứng dương cùng fixture: chữ ký THẬT thì cả hai bộ đọc nói đã đóng.
F.writeDossier(repo, 'that', { veto: F.MO, cong1: F.RONG, chuKy: F.o('that-tran') });
F.gitAll(repo, 'ma tran giu cho');

const { out } = F.runPremerge(repo);
const j = F.runScan(repo);
const ten = F.tenDongTong(out), ds = j.vetoOpenUnsigned || [];
const loi = [];
let assert = 0;

mau.forEach((p, i) => {
  const slug = F.slugGiuCho(p, i);
  assert += 2;
  if (!ten.includes(slug)) loi.push(`giữ-chỗ đóng cửa: lưới bỏ ${slug} (${F.giaTriGiuCho(p)})`);
  if (!ds.includes(slug)) loi.push(`máy quét coi giữ-chỗ ${F.giaTriGiuCho(p)} là chữ ký`);
});
if (assert !== 2 * mau.length) loi.push(`số ô lệch: ${assert} vs ${2 * mau.length}`);
if (ten.includes('that') || ds.includes('that'))
  loi.push('đối chứng dương hỏng: chữ ký THẬT vẫn bị coi là cửa mở');
// VIOLATION giữ-chỗ của luật chữ ký phải còn nguyên — luật này không bị nới.
if (!out.includes('is a placeholder, not a signature'))
  loi.push('mất VIOLATION giữ-chỗ của luật chữ ký');

if (loi.length) { console.error(loi.join(' | ')); process.exit(1); }

// ── hai chiều đỏ, hai thông điệp khác nhau ─────────────────────────────────
const kho2 = F.mkRepo();
mau.forEach((p, i) =>
  F.writeDossier(kho2, F.slugGiuCho(p, i), {
    veto: F.MO, cong1: F.RONG,
    chuKy: { ten: 'giu-cho', dong: `human_signoff: ${F.giaTriGiuCho(p)}`, dung: true },
  }));
F.gitAll(kho2, 'ma tran giu cho 2');

// Đổi khuôn S4-r2: bảng giữ-chỗ ở MỘT NGUỒN, nên chiều đỏ tiêm vào NGUỒN và đòi
// CẢ HAI bộ đọc cùng đổi — đó vừa là chiều đỏ, vừa là bằng chứng hai bên thật sự
// hỏi chung một chỗ (nếu một bên còn bảng riêng, bên đó không đổi và chân ĐỎ).
const mauTienTo = mau.find(p => p.tienTo && /^[a-z]/i.test(p.mau));
const iMau = mau.indexOf(mauTienTo);
const slugMau = F.slugGiuCho(mauTienTo, iMau);
F.tiem(kho2, 'lib/evidence-core.cjs',
  `{ mau: '${mauTienTo.mau}', tienTo: true },`, '');
const tenMut = F.tenDongTong(F.runPremerge(kho2).out);
const dsMut = F.runScan(kho2).vetoOpenUnsigned || [];
if (tenMut.includes(slugMau))
  { console.error(`chiều đỏ KHÔNG chạy ở LƯỚI: gỡ mẫu ${mauTienTo.mau} khỏi nguồn mà lưới vẫn coi nó là giữ-chỗ — lưới đang đọc bảng nào khác?`); process.exit(1); }
if (dsMut.includes(slugMau))
  { console.error(`chiều đỏ KHÔNG chạy ở MÁY QUÉT: gỡ mẫu ${mauTienTo.mau} khỏi nguồn mà máy quét vẫn coi nó là giữ-chỗ — máy quét đang đọc bảng nào khác?`); process.exit(1); }

console.log(`giữ-chỗ: ${mau.length} mẫu × 2 bộ đọc = ${assert} assert, cả hai bộ đọc giữ cửa MỞ`);
console.log(`       [chiều đỏ] gỡ mẫu «${mauTienTo.mau}» khỏi BẢNG Ở NGUỒN → cả lưới lẫn máy quét cùng coi giữ-chỗ ${F.giaTriGiuCho(mauTienTo)} là chữ ký (hồ sơ ${slugMau} rời cả hai danh sách)`);
