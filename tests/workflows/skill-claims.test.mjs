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
// DV1/DV10 (delta-verify-repin): nghi thức re-pin 1-lane + khuôn REPIN-TEMPLATE
// + minh bạch carry round fix — mỗi mệnh đề một mutant (đủ số phần tử của lớp).
const REPIN_CLAUSES = [
  [/một sự kiện re-pin = dispatch \*\*1 agent tươi\*\*/, 'DV1a: 1 sự kiện = 1 agent tươi'],
  [/"kind":"repin"/, 'DV1b1: khuôn dòng kind:repin'],
  [/run-log\.jsonl CỦA TỪNG slug/, 'DV1b2: append per-slug'],
  [/cite `run_id` nguyên văn/, 'DV1c1: section cite run_id nguyên văn'],
  [/`verified_commit` == `sha`/, 'DV1c2: verified_commit == sha'],
  [/exit ≠ 0 → DỪNG: KHÔNG append dòng repin, KHÔNG sửa evidence[^\n]*lane MỚI/, 'DV1d: lane fail → không ký mù, lane mới'],
  [/round fix có carry → danh sách eval carried \(P1\) phải nằm RÕ trong báo cáo user và gói Cổng 2/, 'DV10: carry round fix minh bạch'],
];
for (const [re, name] of REPIN_CLAUSES) check(`DV1/10 SKILL có mệnh đề: ${name}`, () => assert.match(SKILL, re));
check('DV1e cặp marker REPIN-TEMPLATE bao đúng khuôn (dòng jsonl + section)', () => {
  const m = SKILL.match(/<!-- <<<REPIN-TEMPLATE -->([\s\S]*?)<!-- REPIN-TEMPLATE>>> -->/);
  assert.ok(m, 'thiếu cặp marker REPIN-TEMPLATE');
  assert.match(m[1], /"kind":"repin"/, 'khuôn giữa marker thiếu kind:repin');
  assert.match(m[1], /"suites_exit"/, 'khuôn giữa marker thiếu suites_exit');
  assert.match(m[1], /### Re-pin lần <N>/, 'khuôn giữa marker thiếu khuôn section');
  assert.match(m[1], /run_id: <id>/, 'khuôn section thiếu dòng run_id:');
});
for (const [re, name] of REPIN_CLAUSES) check(`DV1m mutant xoá mệnh đề → detector đỏ: ${name}`, () => {
  const hit = SKILL.match(re);
  assert.ok(hit, `mệnh đề "${name}" không tồn tại để mutate`);
  const mutated = SKILL.replace(hit[0], '');
  assert.ok(!re.test(mutated), 'detector không phân biệt được bản bị xoá');
});
console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
