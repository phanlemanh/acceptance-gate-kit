// Chân khong-noi (AC-7) — bản sửa chỉ đổi LỜI, không đổi CHẶN.
// So lưới BASE (cha của commit mang câu ghim) với lưới HEAD trên CÙNG kho fixture:
// mã thoát và tập dòng VIOLATION phải giống hệt; chỉ dòng NOTE được khác.
import { execFileSync } from 'node:child_process';
import * as F from './fixture.mjs';
import { baseAnchor, mkBaseTree } from './base-anchor.mjs';

const b = baseAnchor();                 // thoát 97 nếu tự kiểm hỏng
const cayBase = mkBaseTree(b);

const o = F.cells();
const repo = F.mkRepo();
for (const c of o) F.writeDossier(repo, c.ten, { veto: c.veto, cong1: c.cong1, chuKy: c.chuKy });
// Hai hồ sơ ĐÃ KÝ mà vẫn phải bị CHẶN — nếu nhánh mới nuốt luôn phần bằng chứng
// thì đúng hai hồ sơ này mất VIOLATION, và đó là điều chân đi bắt.
F.writeDossier(repo, 'ky-reject', { veto: F.MO, cong1: F.RONG, chuKy: F.o('that-tran'), verdict: 'REJECT' });
F.writeDossier(repo, 'ky-t3', { veto: F.MO, cong1: F.RONG, chuKy: F.o('that-tran'), tier: 'T3' });
F.gitAll(repo, 'ma tran + hai ho so bi chan');

const head = F.runPremerge(repo);
const base = F.runPremerge(repo, cayBase);
const loi = [];
if (head.code !== base.code) loi.push(`bản sửa đổi luật chặn: mã thoát base=${base.code} head=${head.code}`);
const vHead = F.dongViPham(head.out), vBase = F.dongViPham(base.out);
const chiHead = vHead.filter(l => !vBase.includes(l));
const chiBase = vBase.filter(l => !vHead.includes(l));
for (const l of chiHead) loi.push(`bản sửa đổi luật chặn: THÊM «${l.slice(0, 90)}»`);
for (const l of chiBase) loi.push(`bản sửa đổi luật chặn: MẤT «${l.slice(0, 90)}»`);
// Hai bản phải THẬT SỰ khác nhau ở lời — nếu không, phép so đang so một bản với chính nó.
const nHead = F.dongNote(head.out), nBase = F.dongNote(base.out);
const khacNote = nHead.filter(l => !nBase.includes(l)).length + nBase.filter(l => !nHead.includes(l)).length;
if (khacNote === 0) loi.push('phép so vô nghĩa: base và head cho CÙNG tập dòng NOTE — bản base có đúng là bản trước khi sửa không?');
if (loi.length) { console.error(loi.slice(0, 8).join(' | ')); process.exit(1); }

// ── chiều đỏ 1: cho nhánh đã-ký continue trước các chốt bằng chứng ──────────
// S4-r4 sửa LỚP: bản cũ so vLanh = lưới BASE chạy trên chính kho ĐÃ tiêm, và chỉ
// so SỐ LƯỢNG VIOLATION. Ba lỗ cùng lúc: (a) một bản sao CHẾT (tiêm hỏng cú pháp,
// thiếu tệp, node lỗi) cho vMut=[] nên 0 < vLanh.length tự tuyên «đã chạy»;
// (b) không ghim dòng nào phải mất; (c) mã thoát bị bỏ. Nay: đối chứng dương trên
// bản LÀNH cùng fixture + bằng chứng bản tiêm CHẠY TRỌN + ghim đích danh dòng.
const GHIM_KN = 'verdict=REJECT (must be PASS to merge)';
const DA_CHAY = 'rules ran=';
const dungKho = () => {
  const r = F.mkRepo();
  F.writeDossier(r, 'ky-reject', { veto: F.MO, cong1: F.RONG, chuKy: F.o('that-tran'), verdict: 'REJECT' });
  F.gitAll(r, 'ky reject');
  return r;
};
const lanhKN = F.runPremerge(dungKho());
if (lanhKN.code === 0 || !lanhKN.out.includes(GHIM_KN)) {
  console.error(`chiều đỏ 1 KHÔNG chạy — đối chứng dương hỏng: bản lành phải ĐỎ kèm «${GHIM_KN}», nhận mã ${lanhKN.code}`);
  process.exit(1);
}
const mut = dungKho();
F.tiem(mut, 'scripts/pre-merge-check.sh',
  ': cửa veto đã đóng bằng chữ ký"',
  ': cửa veto đã đóng bằng chữ ký"; continue');
const sauTiem = F.runPremerge(mut);
if (!sauTiem.out.includes(DA_CHAY)) {
  console.error(`chiều đỏ 1 KHÔNG chạy: bản tiêm không tới được dòng tổng «${DA_CHAY}» — bản sao CHẾT, không phải đột biến`);
  process.exit(1);
}
if (sauTiem.out.includes(GHIM_KN) || sauTiem.code === lanhKN.code) {
  console.error(`chiều đỏ 1 KHÔNG chạy: cho nhánh đã-ký continue mà «${GHIM_KN}» vẫn còn hoặc mã thoát không đổi (${lanhKN.code} → ${sauTiem.code})`);
  process.exit(1);
}

// ── chiều đỏ 2: neo sai phải thành LỖI HẠ TẦNG (97), không xanh không đỏ ────
// Chạy chính bộ neo trên một kho KHÔNG có câu ghim: bản base đúng bằng một kho
// git tạm dựng từ cây base (chưa có câu ghim) → git log -S trả rỗng.
execFileSync('bash', ['-c',
  `cd "${cayBase}" && git init -q . && git add -A && git -c user.email=t@t -c user.name=T commit -qm base`]);
const r = execFileSync('bash', ['-c',
  `node "${F.ROOT}/_acceptance/cua-veto-sau-chu-ky/neo-thu.mjs" "${cayBase}" 2>&1; echo "__MA__$?"`],
  { encoding: 'utf8' });
const ma = Number(r.slice(r.lastIndexOf('__MA__') + 6).trim());
if (ma !== 97 || !r.includes('LỖI HẠ TẦNG')) {
  console.error(`chiều đỏ 2 KHÔNG chạy: neo trên kho chưa có câu ghim phải thoát 97 kèm «LỖI HẠ TẦNG», nhận mã ${ma}`);
  process.exit(1);
}

console.log(`không nới: base=${b.slice(0, 8)} · mã thoát base=${base.code} head=${head.code} · VIOLATION ${vBase.length}=${vHead.length} khớp từng dòng · NOTE khác nhau ${khacNote} dòng`);
console.log(`       [chiều đỏ 1] cho nhánh đã-ký continue → mất «${GHIM_KN}», mã thoát ${lanhKN.code} → ${sauTiem.code}, bản tiêm vẫn chạy trọn`);
console.log('       [chiều đỏ 2] neo trên kho chưa có câu ghim → thoát 97 «LỖI HẠ TẦNG: base không hợp lệ»');
