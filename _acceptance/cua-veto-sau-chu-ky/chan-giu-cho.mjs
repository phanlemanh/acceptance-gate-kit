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

// (a) lưới bỏ phép thử giữ-chỗ trong vị từ
F.tiem(kho2, 'scripts/pre-merge-check.sh',
  '  placeholder_signoff "$s" && return 1',
  '  # đột biến: bỏ phép thử giữ-chỗ');
const tenMut = F.tenDongTong(F.runPremerge(kho2).out);
const sotLuoi = mau.map((p, i) => F.slugGiuCho(p, i)).filter(s => !tenMut.includes(s));
if (sotLuoi.length === 0) { console.error('chiều đỏ (a) KHÔNG chạy: bỏ phép thử giữ-chỗ mà lưới vẫn liệt đủ'); process.exit(1); }

// (b) máy quét bỏ MỘT mẫu khỏi bảng JS — mẫu đầu tiên khớp theo tiền tố
const mauTienTo = mau.find(p => p.tienTo && /^[a-z]/i.test(p.mau));
F.tiem(kho2, 'scripts/start-scan.mjs', `${mauTienTo.mau}|`, '');
const dsMut = F.runScan(kho2).vetoOpenUnsigned || [];
const iMau = mau.indexOf(mauTienTo);
const slugMau = F.slugGiuCho(mauTienTo, iMau);
if (dsMut.includes(slugMau)) { console.error(`chiều đỏ (b) KHÔNG chạy: bỏ mẫu ${mauTienTo.mau} khỏi bảng JS mà máy quét vẫn coi là chưa ký`); process.exit(1); }

console.log(`giữ-chỗ: ${mau.length} mẫu × 2 bộ đọc = ${assert} assert, cả hai bộ đọc giữ cửa MỞ`);
console.log(`       [chiều đỏ a] bỏ phép thử giữ-chỗ khỏi lưới → lưới coi ${sotLuoi.length}/${mau.length} mẫu là chữ ký: ${sotLuoi.join(' ')}`);
console.log(`       [chiều đỏ b] bỏ mẫu «${mauTienTo.mau}» khỏi bảng JS → máy quét coi giữ-chỗ ${F.giaTriGiuCho(mauTienTo)} là chữ ký`);
