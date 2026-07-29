// SKILL.md là VẬT ĐƯỢC GIAO của tích hợp S1#7 — assert 4 mệnh đề + 3 ràng
// buộc prompt, kèm đối chứng đột biến (xoá mệnh đề → detector phải đỏ).
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SKILL = readFileSync(path.join(HERE, '..', '..', 'feature-loop', 'skills', 'feature-loop', 'SKILL.md'), 'utf8');
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };
const CLAUSES = [
  [/claim-scan\.mjs.*--slug/s, 'chạy claim-scan trước probe'],
  [/input thứ 5/, 'truyền input thứ 5 khi có claim'],
  [/[Cc]orpus rỗng.*KHÔNG truyền/s, 'không truyền khi corpus rỗng'],
  [/claims_input: failed/, 'scan-fail: có cờ claims_input'],
  [/probe VẪN chạy với 4 input/i, 'scan-fail: probe vẫn chạy 4 input'],
];
const PROMPT_RULES = [
  [/ADVISORY/i, 'claims là advisory'],
  [/KHÔNG dùng claim để lật.*(seal|descope)/is, 'không lật seal/descope'],
  [/cite\s*`?\[<id>\]`?\s*nguyên văn/s, 'cite [<id>] nguyên văn'],
];
for (const [re, name] of CLAUSES) check(`CS7 SKILL có mệnh đề: ${name}`, () => assert.match(SKILL, re));
for (const [re, name] of PROMPT_RULES) check(`CS8 prompt có ràng buộc: ${name}`, () => assert.match(SKILL, re));
check('CS7b chống mâu thuẫn nội tại (finding S4-r2): đếm ý phải là 7, và "CHỈ 4 file" phải kèm ngoại lệ input 5', () => {
  assert.doesNotMatch(SKILL, /Prompt giữ đủ 6 ý/, 'còn câu đếm 6 ý cạnh danh sách 7 ý');
  assert.match(SKILL, /Prompt giữ đủ 7 ý/);
  assert.match(SKILL, /CHỈ 4 file[^\n]*CỘNG file claims làm input thứ 5/s, '"CHỈ 4 file" đứng trơ không ngoại lệ');
});
check('CS7/8 đối chứng đột biến: xoá đoạn claims khỏi bản sao → detector đỏ', () => {
  const mutated = SKILL.replace(/claims_input: failed/g, '').replace(/input thứ 5/g, '').replace(/ADVISORY/gi, '');
  assert.ok([...CLAUSES, ...PROMPT_RULES].some(([re]) => !re.test(mutated)), 'detector không phân biệt được bản bị xoá');
});
console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
