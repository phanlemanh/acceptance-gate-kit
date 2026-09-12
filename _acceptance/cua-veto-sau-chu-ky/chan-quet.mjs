// Chân nhan-khong-dong (AC-5) + nửa máy quét của AC-4.
// Nhãn `status: signed-off` KHÔNG đóng cửa veto; chỉ chữ ký THẬT mới đóng.
import * as F from './fixture.mjs';

const repo = F.mkRepo();
const dat = (slug, chuKy, status) => F.writeDossier(repo, slug, { veto: F.MO, cong1: F.RONG, chuKy, status });
dat('nhan-rong', F.o('rong-khuon'),   'signed-off');   // nhãn đã ký, chữ ký rỗng
dat('nhan-vang', F.o('bao-cao-vang'), 'signed-off');   // nhãn đã ký, báo cáo vắng
dat('da-ky',     F.o('that-tran'),    'verified');     // chữ ký thật
const mau = F.placeholderPatterns();
mau.forEach((p, i) =>
  F.writeDossier(repo, F.slugGiuCho(p, i),
    { veto: F.MO, cong1: F.RONG, status: 'verified',
      chuKy: { ten: 'giu-cho', dong: `human_signoff: ${F.giaTriGiuCho(p)}`, dung: true } }));
F.gitAll(repo, 'ho so');

const j = F.runScan(repo);
const map = new Map((j.vetoOpen || []).map(v => [v.slug, v]));
const ds = j.vetoOpenUnsigned || [];
const loi = [];
let assert = 0;

for (const [slug, mongKy] of [['nhan-rong', false], ['nhan-vang', false], ['da-ky', true]]) {
  assert++;
  const v = map.get(slug);
  if (!v) { loi.push(`vetoOpen thiếu ${slug} — tập phần tử KHÔNG được đổi`); continue; }
  if (typeof v.humanSignoff !== 'boolean') loi.push(`${slug}: humanSignoff không phải boolean`);
  if (typeof v.signoffWarn !== 'string') loi.push(`${slug}: signoffWarn phải LUÔN có mặt (chuỗi)`);
  if (v.humanSignoff !== mongKy) loi.push(`nhãn status đóng cửa: ${slug} humanSignoff=${v.humanSignoff}, mong ${mongKy}`);
  if (ds.includes(slug) === mongKy)
    loi.push(`nhãn status đóng cửa: ${slug} ${mongKy ? 'vẫn nằm trong' : 'vắng khỏi'} vetoOpenUnsigned`);
}
const tenGiuCho = new Set();
mau.forEach((p, i) => {
  assert++;
  const slug = F.slugGiuCho(p, i);
  tenGiuCho.add(slug);
  if (!ds.includes(slug)) loi.push(`máy quét coi giữ-chỗ ${F.giaTriGiuCho(p)} là chữ ký`);
});
// Chống fixture tự nuốt: mỗi mẫu PHẢI có hồ sơ riêng, không hai mẫu chung tên.
if (tenGiuCho.size !== mau.length)
  loi.push(`fixture trùng tên: ${tenGiuCho.size} hồ sơ cho ${mau.length} mẫu`);
if (assert !== 3 + mau.length) loi.push(`sàn đếm: ${assert} assert, mong ${3 + mau.length}`);

if (loi.length) { console.error(loi.join(' | ')); process.exit(1); }

// ── chiều đỏ trong CÙNG lượt: bỏ bảng giữ-chỗ khỏi bản sao máy quét ──────────
// Đổi khuôn S4-r2: bảng giữ-chỗ sống ở MỘT NGUỒN, nên đột biến tiêm vào nguồn.
// Đây cũng là vế chứng máy quét THẬT SỰ hỏi nguồn: gỡ bảng ở lib thì máy quét đổi
// kết luận — nếu nó còn giữ bảng riêng thì bản sao vẫn xanh và chân ĐỎ ở dòng dưới.
F.tiem(repo, 'lib/evidence-core.cjs',
  '  if (laGiuCho(s)) return ket({ value: s, placeholder: true, warn });',
  '  // đột biến: nguồn thôi nhận giữ-chỗ');
const dsMut = F.runScan(repo).vetoOpenUnsigned || [];
const sot = mau.map((p, i) => F.slugGiuCho(p, i)).filter(s => !dsMut.includes(s));
if (sot.length === 0) {
  console.error('chiều đỏ KHÔNG chạy: gỡ bảng giữ-chỗ mà máy quét vẫn coi mọi giữ-chỗ là chưa ký');
  process.exit(1);
}
console.log(`máy quét: ${assert} assert · vetoOpenUnsigned=[${ds.join(' ')}]`);
console.log(`       [chiều đỏ] gỡ bảng giữ-chỗ khỏi bản sao → máy quét coi giữ-chỗ là chữ ký ở ${sot.length}/${mau.length} mẫu: ${sot.join(' ')}`);
