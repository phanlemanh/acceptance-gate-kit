// Ma trận bộ đọc mục «Ngoài hợp đồng» (hồ sơ loi-moi-cong-may-sinh, AC-5/AC-6).
// Fixture CODE-SINH trong chính lần chạy; khuôn mục RÚT từ marker
// OOC-ITEM-TEMPLATE trong feature-loop/workflows/acceptance-verify.js — không
// viết tay khuôn của bên đọc (luật round-trip rút-từ-writer, mẫu P55).
// Mọi assertion âm tính có đối chứng dương cùng harness.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const ooc = createRequire(import.meta.url)(path.join(ROOT, 'lib', 'out-of-contract.js'));
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };
const die = m => { throw new Error(m); };

// Khuôn mục rút từ bên VIẾT (acceptance-verify.js dạy S4 viết đúng khuôn này).
const wf = readFileSync(path.join(ROOT, 'feature-loop', 'workflows', 'acceptance-verify.js'), 'utf8');
const m = wf.match(/<<<OOC-ITEM-TEMPLATE\\n([\s\S]*?)\\nOOC-ITEM-TEMPLATE>>>/);
if (!m) die('KHONG rut duoc OOC-ITEM-TEMPLATE tu acceptance-verify.js');
const TPL = m[1].replace(/\\n/g, '\n').replace(/\\`/g, '`');
const item = (title, proposal) => TPL
  .replace('{title}', title).replace('{plain}', 'nguoi thay X')
  .replace('{file}', 'a.js').replace('{severity}', 'medium').replace('{proposal}', proposal);
const doc = body => `# Review\n\n## Ngoài hợp đồng\n\nCác lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.\n\n${body}\n\n## Known limits\n`;

// MA TRẬN viết trước — số assert = số phần tử (7 ô).
const M = [
  ['dung-khuon-token-hop-le', doc(item('A', 'known-limits')),
    r => r.findings.length === 1 && r.findings[0].proposal === 'known-limits' && r.suspect_empty === false],
  ['van-xuoi-0-finding-NGO', doc('**N1 — Bat bien X khong nam trong luoi thuong truc.** Chi tiet dai hon bon muoi ky tu de khong bi coi la rong.'),
    r => r.findings.length === 0 && r.suspect_empty === true],
  ['muc-rong-that-KHONG-ngo', doc(''),
    r => r.findings.length === 0 && r.suspect_empty === false],
  ['loi-khai-rong-KHONG-ngo', doc('(không có — vòng này không phát hiện lỗi nào ngoài phạm vi đã duyệt ở Cổng 1.)'),
    r => r.findings.length === 0 && r.suspect_empty === false],
  ['token-la-giu-nguyen-van', doc(item('B', 'ghi Known limits')),
    r => r.findings.length === 1 && r.findings[0].proposal === '' && r.findings[0].proposal_raw === 'ghi Known limits'],
  ['token-hop-le-co-duoi-chu-thich', doc(item('C', 'known-limits — vì chi phí sửa lớn hơn lợi ích')),
    r => r.findings[0].proposal === 'known-limits' && /vì chi phí/.test(r.findings[0].proposal_raw)],
  ['ba-token-hop-le', doc(item('D', 'new-contract') + '\n' + item('E', 'wont-fix')),
    r => r.findings.map(f => f.proposal).join(',') === 'new-contract,wont-fix'],
];
for (const [n, text, ok] of M) check(n, () => { const r = ooc.parse(text); if (!ok(r)) die(JSON.stringify(r)); });

check('PROPOSALS + GLOSS xuat qua marker (mot nguon)', () => {
  const src = readFileSync(path.join(ROOT, 'lib', 'out-of-contract.js'), 'utf8');
  if (!/<<<OOC-PROPOSALS[\s\S]*OOC-PROPOSALS>>>/.test(src)) die('thieu marker OOC-PROPOSALS');
  if (JSON.stringify(ooc.PROPOSALS) !== JSON.stringify(['known-limits', 'new-contract', 'wont-fix'])) die('PROPOSALS lech: ' + JSON.stringify(ooc.PROPOSALS));
  // Từ vựng NGƯỜI phải phủ đủ ba token — thẻ in chữ này, thân lệnh signoff dạy chữ này.
  for (const t of ooc.PROPOSALS) if (!ooc.OOC_GLOSS_NGUOI[t]) die('OOC_GLOSS_NGUOI thieu token: ' + t);
});

check('doi chung duong: file KHONG co heading -> present=false, khong ngo', () => {
  const r = ooc.parse('# Review\n\nchi la van xuoi, khong heading Ngoai hop dong.\n');
  if (r.present !== false || r.suspect_empty !== false) die(JSON.stringify(r));
});

console.log(`\nResults: ${passed} passed, ${failed} failed (out-of-contract)`);
process.exit(failed ? 1 : 0);
