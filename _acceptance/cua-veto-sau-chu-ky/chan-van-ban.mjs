// Chân van-ban (AC-11) — văn bản đi cùng vật.
// (a) hai thân lệnh dặn CHÉP vetoOpenUnsigned, không tự lọc vetoOpen;
// (b) khối START-SCAN-KEYS khai ba khoá mới VÀ ca P99 round-trip vẫn xanh;
// (c) CONTEXT.md mang luật kèm _Avoid_.
// Giới hạn đã khai: (a) đo CHỈ DẪN; danh sách tên thẻ in ra do E6 đo trên đầu ra máy.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import * as F from './fixture.mjs';

// GỐC đang đo — đổi được, để chiều đỏ chạy CHÍNH phép đo trên bản sao thay vì một
// bản chép tay của phép đo (S4-r4: hình dạng «thước không gắn vào vật»).
let GOC = F.ROOT;
const doc = rel => readFileSync(path.join(GOC, rel), 'utf8');
const doTren = (goc, ten) => { const cu = GOC; GOC = goc; try { return vat[ten](); } finally { GOC = cu; } };
// `vetoOpenUnsigned` khai KHÔNG có `[]`: P99 quy ước `[]` chỉ dành cho MẢNG BẢN
// GHI (còn đi sâu vào khoá con); mảng giá trị thô là một lá.
const KHOA = ['vetoOpen[].humanSignoff', 'vetoOpen[].signoffWarn', 'vetoOpenUnsigned'];

const vat = {
  'start.md chép danh sách': () => {
    const t = doc('commands/start.md');
    return t.includes('`vetoOpenUnsigned` có phần tử') && t.includes('KHÔNG tự lọc `vetoOpen`');
  },
  'acceptance-status.md chép danh sách': () => {
    const t = doc('commands/acceptance-status.md');
    return t.includes('`vetoOpenUnsigned` có phần tử') && t.includes('KHÔNG tự lọc `vetoOpen`');
  },
  'START-SCAN-KEYS khai ba khoá': () => {
    const m = doc('commands/start.md').match(/<<<START-SCAN-KEYS([\s\S]*?)START-SCAN-KEYS>>>/);
    return Boolean(m) && KHOA.every(k => m[1].includes(k));
  },
  // Mỏ neo NGẮN: văn CONTEXT.md gói dòng ở 80 cột nên một câu dài bị cắt giữa
  // chừng — tìm nguyên câu là phép đo tự chết theo cách gói dòng.
  'CONTEXT.md mang luật + _Avoid_': () => {
    const t = doc('CONTEXT.md');
    const i = t.indexOf('ĐÓNG cửa veto');
    return i > 0 && t.slice(i, i + 1200).includes('_Avoid_');
  },
};

const loi = [];
for (const [ten, ok] of Object.entries(vat)) if (!ok()) loi.push(`thiếu vật: ${ten}`);

// P99 round-trip: khoá KHAI trong thân lệnh phải CÓ THẬT trong đầu ra máy quét.
let p99 = '';
try {
  p99 = execFileSync('bash', ['-c',
    `cd "${F.ROOT}" && ONLY_BLOCK=P99 bash tests/plugins/run-tests.sh 2>&1`],
    { encoding: 'utf8', maxBuffer: 1e8 });
} catch (e) { p99 = (e.stdout || '') + (e.stderr || ''); }
if (!p99.includes('PASS: P99')) loi.push(`ca P99 không xanh: ${p99.split('\n').filter(l => l.includes('P99')).slice(0, 2).join(' / ') || '(không thấy dòng P99)'}`);
if (loi.length) { console.error(loi.join(' | ')); process.exit(1); }

// ── ba chiều đỏ: gỡ từng vật trên BẢN SAO, ba thông điệp khác nhau ──────────
const chepDoc = () => {
  const d = mkdtempSync(path.join(tmpdir(), 'cvsck-doc-'));
  execFileSync('bash', ['-c', `mkdir -p "${d}/commands"`]);
  for (const rel of ['commands/start.md', 'commands/acceptance-status.md', 'CONTEXT.md'])
    writeFileSync(path.join(d, rel), readFileSync(path.join(F.ROOT, rel), 'utf8'));
  return d;
};

// `vatKey` trỏ vào CHÍNH vị từ ở bảng `vat` — không chép lại luật. Làm yếu một vị từ
// ở trên thì chiều đỏ tương ứng phải đỏ theo; bản cũ tự viết lại `ktr` nên hai bên
// trôi khỏi nhau (d3 chỉ kiểm 'ĐÓNG cửa veto' còn vị từ thật kiểm cả `_Avoid_`).
const goVat = (nhan, vatKey, rel, tim) => {
  const d = chepDoc();
  const p = path.join(d, rel);
  const t = readFileSync(p, 'utf8');
  if (!t.includes(tim)) { console.error(`chiều đỏ «${nhan}» KHÔNG chạy: bản sao không chứa chuỗi cần gỡ`); process.exit(1); }
  if (!doTren(d, vatKey)) { console.error(`chiều đỏ «${nhan}» KHÔNG chạy — đối chứng dương hỏng: bản sao CHƯA gỡ mà vị từ «${vatKey}» đã thấy thiếu`); process.exit(1); }
  writeFileSync(p, t.split(tim).join(''));
  if (doTren(d, vatKey)) { console.error(`chiều đỏ «${nhan}» KHÔNG chạy: gỡ vật mà CHÍNH vị từ «${vatKey}» vẫn thấy đủ`); process.exit(1); }
  return nhan;
};

const d1 = goVat('start.md mất câu chép', 'start.md chép danh sách',
  'commands/start.md', 'KHÔNG tự lọc `vetoOpen`');
const d2 = goVat('START-SCAN-KEYS mất khoá', 'START-SCAN-KEYS khai ba khoá',
  'commands/start.md', '\n   vetoOpenUnsigned\n');
const d3 = goVat('CONTEXT.md mất luật', 'CONTEXT.md mang luật + _Avoid_',
  'CONTEXT.md', 'ĐÓNG cửa veto');
// Vế `_Avoid_` trước đây KHÔNG có chiều đỏ nào: gỡ sạch mục _Avoid_ mà chân vẫn xanh.
const d4 = goVat('CONTEXT.md mất vế _Avoid_', 'CONTEXT.md mang luật + _Avoid_',
  'CONTEXT.md', '_Avoid_');

console.log(`văn bản: ${Object.keys(vat).length} vật đủ · ca P99 xanh`);
console.log(`       [chiều đỏ 1] ${d1}`);
console.log(`       [chiều đỏ 2] ${d2}`);
console.log(`       [chiều đỏ 3] ${d3}`);
console.log(`       [chiều đỏ 4] ${d4}`);
