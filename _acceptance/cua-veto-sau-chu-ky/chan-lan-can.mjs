// Chân luat-lan-can (AC-8) — năm luật CHẶN vẫn nổ nguyên văn trên hồ sơ ĐÃ KÝ.
// Chữ ký chỉ đổi LỜI của cửa veto; nó không được mở đường vòng cho luật nào.
import * as F from './fixture.mjs';

const KY = F.o('that-tran');          // MỌI ca đều mang chữ ký THẬT
const loi = [];
let assert = 0;

// Mỗi ca trả { out, ghim } — `ghim` là chuỗi VIOLATION phải có mặt.
const ca = {
  'da-veto-chua-xu': () => {
    const r = F.mkRepo();
    F.writeDossier(r, 'x', { veto: F.VETO_CELLS[2], cong1: F.CO_TEN, chuKy: KY });
    F.gitAll(r, 'da-veto');
    return { out: F.runPremerge(r).out, ghim: 'veto_state=da-veto chưa xử' };
  },
  'ghi-nguoc': () => {
    const r = F.mkRepo();
    F.writeDossier(r, 'x', { veto: F.VETO_CELLS[2], cong1: F.CO_TEN, chuKy: KY });
    F.gitAll(r, 'da-veto');
    const base = F.headSha(r);
    F.writeDossier(r, 'x', { veto: F.MO, cong1: F.CO_TEN, chuKy: KY });   // lật về mo, không entry sổ
    F.gitAll(r, 'lat ve mo');
    return { out: F.runPremergeBase(r, base).out, ghim: 'da-veto -> mo mà KHÔNG có entry sổ' };
  },
  'go-khoa': () => {
    const r = F.mkRepo();
    F.writeDossier(r, 'x', { veto: F.MO, cong1: F.CO_TEN, chuKy: KY });
    F.gitAll(r, 'co khoa');
    const base = F.headSha(r);
    F.writeDossier(r, 'x', { veto: F.VETO_CELLS[0], cong1: F.CO_TEN, chuKy: KY });   // gỡ hẳn khoá
    F.gitAll(r, 'go khoa');
    return { out: F.runPremergeBase(r, base).out, ghim: 'khoá veto_state biến mất' };
  },
  'lan-v-t3': () => {
    const r = F.mkRepo();
    F.writeDossier(r, 'x', { veto: F.MO, cong1: F.RONG, chuKy: KY, tier: 'T3' });
    F.gitAll(r, 'T3 lan V');
    return { out: F.runPremerge(r).out, ghim: 'làn V chỉ T2' };
  },
  'vet-hong': () => {
    const r = F.mkRepo();
    F.writeDossier(r, 'x', { veto: { veto: 'mo', opened: 'hom-qua' }, cong1: F.RONG, chuKy: KY });
    F.gitAll(r, 'vet hong');
    return { out: F.runPremerge(r).out, ghim: 'veto_opened_at' };
  },
};

for (const [ten, chay] of Object.entries(ca)) {
  assert++;
  const { out, ghim } = chay();
  const co = out.split('\n').some(l => l.startsWith('VIOLATION ') && l.includes(ghim));
  if (!co) loi.push(`chữ ký mở đường vòng cho luật ${ten}: mất VIOLATION «${ghim}»`);
}
if (assert !== 5) loi.push(`số assert lệch: ${assert}, mong 5`);

// Đối chứng dương: cùng khuôn nhưng ĐÃ GỠ LỖI → không VIOLATION nào của năm luật.
const lanh = F.mkRepo();
F.writeDossier(lanh, 'ok-t2', { veto: F.MO, cong1: F.RONG, chuKy: KY });
F.writeDossier(lanh, 'ok-co-ten', { veto: F.MO, cong1: F.CO_TEN, chuKy: KY });
F.gitAll(lanh, 'ban lanh');
const outLanh = F.runPremerge(lanh).out;
for (const ghim of ['veto_state=da-veto chưa xử', 'da-veto -> mo mà KHÔNG có entry sổ',
                    'khoá veto_state biến mất', 'làn V chỉ T2', 'veto_opened_at']) {
  if (outLanh.includes(ghim)) loi.push(`fixture dựng sai, không đo được luật: bản lành vẫn nổ «${ghim}»`);
}
if (loi.length) { console.error(loi.join(' | ')); process.exit(1); }

// ── chiều đỏ: cho hồ sơ ĐÃ KÝ đi vòng qua trọn khối cửa veto ────────────────
// S4-r4 sửa LỚP: bản cũ kết luận CHỈ từ vắng mặt («không thấy dòng ghim» → đỏ đã
// chạy). Một bản sao CHẾT cho đúng màu ấy — assertion âm-tính-một-mình mà
// CLAUDE.md cấm. Nay hai chốt đứng trước phép vắng mặt: bản LÀNH cùng fixture
// phải NỔ dòng ghim, và bản tiêm phải chạy tới dòng tổng.
const GHIM_LV = 'làn V chỉ T2';
const dungT3 = () => {
  const r = F.mkRepo();
  F.writeDossier(r, 'x', { veto: F.MO, cong1: F.RONG, chuKy: KY, tier: 'T3' });
  F.gitAll(r, 'T3 lan V');
  return r;
};
const lanhLV = F.runPremerge(dungT3());
if (!lanhLV.out.includes(GHIM_LV)) {
  console.error(`chiều đỏ KHÔNG chạy — đối chứng dương hỏng: bản lành cùng fixture phải nổ «${GHIM_LV}», nhận mã ${lanhLV.code}`);
  process.exit(1);
}
const mut = dungT3();
F.tiem(mut, 'scripts/pre-merge-check.sh',
  'if [ "$_vst" = "mo" ]; then',
  'if [ "$_vst" = "mo" ] && ! signoff_that "$dir"; then');
const rMut = F.runPremerge(mut);
if (!rMut.out.includes('rules ran=')) {
  console.error('chiều đỏ KHÔNG chạy: bản tiêm không tới được dòng tổng «rules ran=» — bản sao CHẾT, không phải đột biến');
  process.exit(1);
}
const outMut = rMut.out;
if (outMut.includes(GHIM_LV)) {
  console.error(`chiều đỏ KHÔNG chạy: cho hồ sơ đã ký đi vòng mà luật «${GHIM_LV}» vẫn nổ`);
  process.exit(1);
}
console.log(`năm luật lân cận: ${assert}/5 luật vẫn nổ trên hồ sơ ĐÃ KÝ; bản lành im`);
console.log(`       [chiều đỏ] bản lành nổ «${GHIM_LV}»; cho hồ sơ đã ký đi vòng → mất đúng dòng ấy, bản tiêm vẫn chạy trọn`);
