// Lưới THƯỜNG TRỰC cho luật «chữ ký Cổng Bằng chứng đóng cửa veto».
//
// Răng hồ sơ (_acceptance/cua-veto-sau-chu-ky/rang.sh) chết theo hồ sơ khi mốc
// phát hành khép; ca này ở lại. Ba ca trên fixture CODE-SINH, cộng một lượt
// phá-thử để màu xanh không bao giờ là «thước chưa từng chạy».
//
// Fixture dùng chung với răng hồ sơ (một khuôn, hai bên đọc) — khi hồ sơ khép,
// quyết chuyển fixture.mjs về tests/ hay nhân bản: sổ quyết định d-20260912T024254Z-14.
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const F = await import(path.join(HERE, '..', '..', '_acceptance', 'cua-veto-sau-chu-ky', 'fixture.mjs'));

let assert = 0, fail = 0;
const ok = (ten, dieu, chiTiet = '') => {
  assert++;
  if (dieu) console.log(`  PASS: ${ten}`);
  else { console.log(`  FAIL: ${ten}${chiTiet ? ` — ${chiTiet}` : ''}`); fail++; }
};

// ── CVS1 · CVS2: cặp hai chiều trên CÙNG fixture, chỉ đổi dòng human_signoff ──
const kho = F.mkRepo();
const doHoSo = chuKy => {
  F.writeDossier(kho, 's', { veto: F.MO, cong1: F.RONG, chuKy });
  F.gitAll(kho, `ho so ${chuKy.ten}`);
  const { out } = F.runPremerge(kho);
  return {
    dong: out.includes(F.CAU_GHIM),
    mo: out.split('\n').some(l => l.startsWith('NOTE [s]') && l.includes(F.CAU_MO)),
    tong: F.tenDongTong(out).includes('s'),
  };
};

const ky = doHoSo(F.o('that-tran'));
ok('CVS1 hồ sơ làn V ĐÃ KÝ → lưới nói «cửa veto đã đóng bằng chữ ký», không nói «cửa veto mở»',
  ky.dong && !ky.mo && !ky.tong, `dong=${ky.dong} mo=${ky.mo} tong=${ky.tong}`);

const chuaKy = doHoSo(F.o('rong-khuon'));
ok('CVS2 hồ sơ làn V CHƯA ký → vẫn «cửa veto mở» và vẫn có tên ở dòng tổng',
  chuaKy.mo && chuaKy.tong && !chuaKy.dong, `dong=${chuaKy.dong} mo=${chuaKy.mo} tong=${chuaKy.tong}`);

// ── CVS3: hai bộ đọc nói cùng một tập ───────────────────────────────────────
const kho3 = F.mkRepo();
F.writeDossier(kho3, 'a-chua-ky', { veto: F.MO, cong1: F.RONG, chuKy: F.o('rong-khuon') });
F.writeDossier(kho3, 'b-da-ky', { veto: F.MO, cong1: F.RONG, chuKy: F.o('that-tran') });
F.writeDossier(kho3, 'c-giu-cho', { veto: F.MO, cong1: F.RONG, chuKy: F.o('giu-cho-tran') });
F.gitAll(kho3, 'ba ho so');
const tenLuoi = F.tenDongTong(F.runPremerge(kho3).out);
const tenQuet = (F.runScan(kho3).vetoOpenUnsigned || []).slice().sort();
ok('CVS3 vetoOpenUnsigned của máy quét BẰNG tập tên dòng tổng của lưới',
  JSON.stringify(tenLuoi) === JSON.stringify(tenQuet) && JSON.stringify(tenLuoi) === JSON.stringify(['a-chua-ky', 'c-giu-cho']),
  `lưới=[${tenLuoi.join(' ')}] máy quét=[${tenQuet.join(' ')}]`);

// ── chiều đỏ: gỡ nhánh mới khỏi BẢN SAO lưới → CVS1 phải ĐỎ ─────────────────
const khoMut = F.mkRepo();
F.writeDossier(khoMut, 's', { veto: F.MO, cong1: F.RONG, chuKy: F.o('that-tran') });
F.gitAll(khoMut, 'ho so da ky');
F.tiem(khoMut, 'scripts/pre-merge-check.sh', 'elif signoff_that "$dir"; then', 'elif false; then');
const outMut = F.runPremerge(khoMut).out;
ok('CVS4 chiều đỏ: gỡ nhánh mới → lưới nói lại «cửa veto mở» cho hồ sơ đã ký (chữ ký không đóng cửa)',
  !outMut.includes(F.CAU_GHIM) && outMut.split('\n').some(l => l.startsWith('NOTE [s]') && l.includes(F.CAU_MO)),
  'bản sao bị gỡ nhánh mà vẫn im — phép đo không sống');

// Sàn đếm: 0 assert nghĩa là ca chưa bao giờ chạy.
if (assert === 0) { console.log('  FAIL: sàn đếm — 0 assertion'); process.exit(1); }
console.log(`Results: ${assert - fail} passed, ${fail} failed (cua-veto-sau-chu-ky)`);
process.exit(fail === 0 ? 0 : 1);
