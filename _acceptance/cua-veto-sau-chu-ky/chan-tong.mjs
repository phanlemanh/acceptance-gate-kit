// Chân dong-tong (AC-3) — dòng tổng veto-trace chỉ đếm cửa mở THẬT.
// Ba hồ sơ: hai hồ sơ có approved_by (không đi qua khối Cổng 1, nên chỉ dòng
// tổng nói về chúng) và một hồ sơ làn V đã ký.
import * as F from './fixture.mjs';

const repo = F.mkRepo();
F.writeDossier(repo, 'a-chua-ky',  { veto: F.MO, cong1: F.CO_TEN, chuKy: F.o('rong-khuon') });
F.writeDossier(repo, 'b-da-ky',    { veto: F.MO, cong1: F.CO_TEN, chuKy: F.o('that-tran') });
F.writeDossier(repo, 'c-lan-v-ky', { veto: F.MO, cong1: F.RONG,   chuKy: F.o('that-tran') });
F.gitAll(repo, 'ba ho so');

const loi = [];
const { out } = F.runPremerge(repo);
const ten = F.tenDongTong(out);
if (JSON.stringify(ten) !== JSON.stringify(['a-chua-ky']))
  loi.push(`dòng tổng đếm hồ sơ đã ký: [${ten.join(' ')}]`);
const n = F.soDongTong(out);
if (n !== ten.length) loi.push(`N lệch số tên: N=${n}, số tên=${ten.length}`);

// Ca IM: ký nốt hồ sơ còn lại → KHÔNG còn dòng tổng nào (im, như khi không có cửa).
F.writeDossier(repo, 'a-chua-ky', { veto: F.MO, cong1: F.CO_TEN, chuKy: F.o('that-tran') });
F.gitAll(repo, 'ky not');
const sau = F.runPremerge(repo).out;
if (sau.includes(F.DONG_TONG)) loi.push('ký hết mà vẫn in dòng tổng');

// Đối chứng dương của chiều ngược: gỡ chữ ký của một hồ sơ → tên quay lại.
F.writeDossier(repo, 'b-da-ky', { veto: F.MO, cong1: F.CO_TEN, chuKy: F.o('rong-khuon') });
F.gitAll(repo, 'go chu ky');
const lai = F.tenDongTong(F.runPremerge(repo).out);
if (JSON.stringify(lai) !== JSON.stringify(['b-da-ky']))
  loi.push(`gỡ chữ ký mà tên không quay lại dòng tổng: [${lai.join(' ')}]`);

if (loi.length) { console.error(loi.join(' | ')); process.exit(1); }

// ── chiều đỏ trong CÙNG lượt: gỡ dòng rẽ khỏi bản sao lưới ──────────────────
F.writeDossier(repo, 'b-da-ky', { veto: F.MO, cong1: F.CO_TEN, chuKy: F.o('that-tran') });
F.gitAll(repo, 'ky lai');
F.tiem(repo, 'scripts/pre-merge-check.sh',
  'if [ "$vstate" = "mo" ] && signoff_that "$dir"; then vstate="mo-da-ky"; fi',
  ':');
const mutTen = F.tenDongTong(F.runPremerge(repo).out);
if (!mutTen.includes('b-da-ky')) {
  console.error('chiều đỏ KHÔNG chạy: gỡ dòng rẽ mà dòng tổng vẫn bỏ hồ sơ đã ký');
  process.exit(1);
}
console.log('dòng tổng: 1 tên đúng, N khớp số tên, ký hết thì im, gỡ ký thì hiện lại');
console.log(`       [chiều đỏ] gỡ dòng rẽ khỏi bản sao → dòng tổng đếm lại hồ sơ đã ký: [${mutTen.join(' ')}]`);
