// Lưới THƯỜNG TRỰC cho luật «chữ ký Cổng Bằng chứng đóng cửa veto».
//
// Răng hồ sơ (_acceptance/cua-veto-sau-chu-ky/rang.sh) chết theo hồ sơ khi mốc
// phát hành khép; ca này ở lại. Ba ca trên fixture CODE-SINH, cộng một lượt
// phá-thử để màu xanh không bao giờ là «thước chưa từng chạy».
//
// Fixture dùng chung với răng hồ sơ (một khuôn, hai bên đọc) — khi hồ sơ khép,
// quyết chuyển fixture.mjs về tests/ hay nhân bản: sổ quyết định d-20260912T024254Z-14.
// Hồ sơ phan-du-bo-cuc-moi chọn NHÂN BẢN: ca đọc bản ở tests/fixtures/ (gốc gói lõi qua bộ dịch tests/bo-cuc.mjs, chạy
// được ở mọi bố cục); bản trong hồ sơ đã ký giữ nguyên từng byte. CVS-BAN ghim hai bản chỉ khác đúng các dòng viết dưới.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gocGoi, tep } from '../bo-cuc.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const CAY = { thuMuc: ROOT };
const BAN_TESTS = path.join(HERE, '..', 'fixtures', 'cua-veto-sau-chu-ky.mjs');
const BAN_HO_SO = path.join(ROOT, '_acceptance', 'cua-veto-sau-chu-ky', 'fixture.mjs');
const F = await import(BAN_TESTS);
// Kho thử chép TRỌN gốc gói lõi (bố cục gói, không bố cục kho): đường tiêm tính từ gốc gói.
const trongGoi = rel => path.relative(gocGoi(CAY, 'loi'), tep(rel, CAY));

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
F.tiem(khoMut, trongGoi('scripts/pre-merge-check.sh'), 'elif signoff_that "$dir"; then', 'elif false; then');
const outMut = F.runPremerge(khoMut).out;
ok('CVS4 chiều đỏ: gỡ nhánh mới → lưới nói lại «cửa veto mở» cho hồ sơ đã ký (chữ ký không đóng cửa)',
  !outMut.includes(F.CAU_GHIM) && outMut.split('\n').some(l => l.startsWith('NOTE [s]') && l.includes(F.CAU_MO)),
  'bản sao bị gỡ nhánh mà vẫn im — phép đo không sống');

// ── CVS-BAN: bản ở tests/ chỉ khác bản trong hồ sơ đúng các dòng VIẾT TRƯỚC ở đây ───────────────────────
// Hai bản không đi qua luật đổi chữ của kịch bản (dưới fixtures/) nên phép so cùng nghĩa ở mọi bố cục. Mỗi dòng khác
// phải nằm trong danh sách, đúng thứ tự, đúng phía; dòng lạ (một phép sửa bản ở tests/ không khai ở đây) → đỏ.
const BAN_THEM = [
  '//',
  '// BẢN NHÂN Ở tests/fixtures/ (hồ sơ phan-du-bo-cuc-moi; sổ d-20260912T024254Z-14 «chuyển hay nhân bản»): bản trong hồ',
  '// sơ đã ký giữ nguyên từng byte. Khác bản ấy đúng hai chỗ, ca CVS-BAN ghim: nạp bộ dịch, và ROOT là gốc gói lõi.',
  "import { gocGoi } from '../bo-cuc.mjs';",
  '// Gốc GÓI LÕI, không phải gốc kho: mọi đường bên dưới tính từ gốc gói. Ở bố cục phẳng hai gốc trùng nhau; ở kho mới',
  '// gói lõi nằm trong thư mục con — bộ dịch đọc bố cục từ tệp khai chợ của chính cây (gốc kho suy từ vị trí tệp này).',
  "export const ROOT = gocGoi({ thuMuc: path.resolve(HERE, '..', '..') }, 'loi');",
];
const BAN_BOT = ["export const ROOT = path.resolve(HERE, '..', '..');"];
// Khác biệt theo dòng (dãy con chung dài nhất): { them: dòng chỉ ở b, bot: dòng chỉ ở a }, giữ thứ tự.
const khacDong = (a, b) => {
  const A = a.split('\n'); const B = b.split('\n');
  const L = Array.from({ length: A.length + 1 }, () => new Int32Array(B.length + 1));
  for (let i = A.length - 1; i >= 0; i--) for (let j = B.length - 1; j >= 0; j--)
    L[i][j] = A[i] === B[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const them = []; const bot = []; let i = 0; let j = 0;
  while (i < A.length && j < B.length) {
    if (A[i] === B[j]) { i++; j++; } else if (L[i + 1][j] >= L[i][j + 1]) bot.push(A[i++]); else them.push(B[j++]);
  }
  return { them: [...them, ...B.slice(j)], bot: [...bot, ...A.slice(i)] };
};
const dungKhai = (goc, ban) => {
  const k = khacDong(goc, ban);
  return JSON.stringify(k.them) === JSON.stringify(BAN_THEM) && JSON.stringify(k.bot) === JSON.stringify(BAN_BOT) ? null : k;
};
const goc = readFileSync(BAN_HO_SO, 'utf8');
const banTests = readFileSync(BAN_TESTS, 'utf8');
const lech = dungKhai(goc, banTests);
// Đối chứng: một dòng lạ chèn vào bản ở tests/ (sau dòng khuôn đầu tiên) phải làm phép so đỏ, nêu đúng dòng ấy.
const LA = '// dòng lạ CVS-BAN';
const banLa = banTests.replace('\nexport function templateSignoffLine() {\n', `\n${LA}\nexport function templateSignoffLine() {\n`);
const lechLa = banLa === banTests ? null : dungKhai(goc, banLa);
ok('CVS-BAN bản ở tests/fixtures/ chỉ khác bản trong hồ sơ đúng các dòng viết trước (thêm một dòng lạ → đỏ)',
  !lech && Boolean(lechLa) && lechLa.them.includes(LA),
  lech ? `khác ngoài danh sách — thêm: ${JSON.stringify(lech.them)} · bớt: ${JSON.stringify(lech.bot)}`
    : `đối chứng: ${banLa === banTests ? 'lệnh chèn không đổi được bản sao' : 'chèn dòng lạ mà phép so vẫn im'}`);

// Sàn đếm: 0 assert nghĩa là ca chưa bao giờ chạy.
if (assert === 0) { console.log('  FAIL: sàn đếm — 0 assertion'); process.exit(1); }
console.log(`Results: ${assert - fail} passed, ${fail} failed (cua-veto-sau-chu-ky)`);
process.exit(fail === 0 ? 0 : 1);
