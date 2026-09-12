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
const mut = F.mkRepo();
F.writeDossier(mut, 'ky-reject', { veto: F.MO, cong1: F.RONG, chuKy: F.o('that-tran'), verdict: 'REJECT' });
F.gitAll(mut, 'ky reject');
F.tiem(mut, 'scripts/pre-merge-check.sh',
  ': cửa veto đã đóng bằng chữ ký"',
  ': cửa veto đã đóng bằng chữ ký"; continue');
const vMut = F.dongViPham(F.runPremerge(mut).out);
const vLanh = F.dongViPham(F.runPremerge(mut, cayBase).out);
if (vMut.length >= vLanh.length) {
  console.error(`chiều đỏ 1 KHÔNG chạy: cho nhánh đã-ký continue mà tập VIOLATION không giảm (${vLanh.length} → ${vMut.length})`);
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
console.log(`       [chiều đỏ 1] cho nhánh đã-ký continue → tập VIOLATION tụt ${vLanh.length} → ${vMut.length}`);
console.log('       [chiều đỏ 2] neo trên kho chưa có câu ghim → thoát 97 «LỖI HẠ TẦNG: base không hợp lệ»');
