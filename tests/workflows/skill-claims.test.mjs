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
// MM1/MM2 (matrix-measure-law): 4 câu đối chiếu lớp-đo-lường trong ý (4) của
// prompt gap-probe — cả hai harness, mutant per-clause (khuôn DV1).
const CODEX_SKILL = readFileSync(path.join(HERE, '..', '..', 'codex', 'feature-loop-codex', 'skills', 'feature-loop-codex', 'SKILL.md'), 'utf8');
const MEASURE_CLAUSES_VI = [
  [/mỗi eval tuyên quét LỚP có ma trận toàn phần viết-trước không \(số assert = số phần tử\)/, 'MM1a: ma trận viết-trước'],
  [/assertion âm tính nào thiếu đối chứng dương hoặc không ghim thông điệp/, 'MM1b: âm tính + đối chứng + thông điệp'],
  [/fixture nào viết tay đúng khuôn bên đọc/, 'MM1c: fixture viết tay'],
  [/fixture nào \(kể cả code-sinh\) tự dựng đúng khuôn bên đọc mà không round-trip rút-từ-writer-thật/, 'MM1c2: round-trip từ writer thật'],
  [/assert nào đo chuỗi-có-mặt trong khi lời hứa là quan hệ/, 'MM1d: từ-vựng vs quan hệ'],
  [/eval nào đo CHỈ DẪN\/tài liệu hướng dẫn thay vì ĐẦU RA thật của code/, 'MM1e2: chỉ dẫn vs đầu ra'],
  [/đường dẫn nào trong phép đo\/script sinh fixture hardcode ROOT thay vì suy từ vị trí script/, 'MM1f: hardcode ROOT'],
];
const MEASURE_CLAUSES_EN = [
  [/every[\s\S]{0,20}eval that claims to sweep a CLASS[\s\S]{0,60}full matrix written in advance[\s\S]{0,20}\(assert count = element count\)/i, 'MM2a: full matrix'],
  [/negative assertion lacks a positive[\s\S]{0,10}control or a pinned message/i, 'MM2b: positive control + pinned message'],
  [/fixture is hand-written to the reader'?s[\s\S]{0,10}shape/i, 'MM2c: hand-written fixture'],
  [/fixture \(even a code-generated one\) builds itself to the[\s\S]{0,10}reader'?s shape without a round-trip pulled from the real writer/i, 'MM2c2: round-trip from real writer'],
  [/measures[\s\S]{0,10}string-presence while the promise is a relationship/i, 'MM2d: vocabulary vs relationship'],
  [/measures INSTRUCTIONS\/docs instead of the code'?s real OUTPUT/i, 'MM2e: instructions vs output'],
  [/hardcodes ROOT instead of[\s\S]{0,10}deriving it from the script location/i, 'MM2f: hardcode ROOT'],
];
for (const [re, name] of MEASURE_CLAUSES_VI) check(`MM1 SKILL có câu: ${name}`, () => assert.match(SKILL, re));
check('MM1e câu đếm "đủ 7 ý" GIỮ NGUYÊN (mở rộng trong ý 4, không thêm ý)', () => {
  assert.match(SKILL, /Prompt giữ đủ 7 ý/);
  assert.doesNotMatch(SKILL, /Prompt giữ đủ 8 ý/);
});
for (const [re, name] of MEASURE_CLAUSES_EN) check(`MM2 codex SKILL có câu: ${name}`, () => assert.match(CODEX_SKILL, re));
for (const [re, name] of MEASURE_CLAUSES_VI) check(`MM1m mutant xoá → đỏ: ${name}`, () => {
  const hit = SKILL.match(re); assert.ok(hit, 'câu không tồn tại để mutate');
  assert.ok(!re.test(SKILL.replace(hit[0], '')), 'detector không phân biệt bản bị xoá');
});
for (const [re, name] of MEASURE_CLAUSES_EN) check(`MM2m mutant xoá → đỏ: ${name}`, () => {
  const hit = CODEX_SKILL.match(re); assert.ok(hit, 'câu không tồn tại để mutate');
  assert.ok(!re.test(CODEX_SKILL.replace(hit[0], '')), 'detector không phân biệt bản bị xoá');
});


// JR6 (judge-required-evidence): round fix đọc required_evidence trước, cấm đoán mò
const JRE_CLAUSES = [
  [SKILL, /bước ĐẦU của round fix là đọc `required_evidence` từ dòng `kind:panel`/, 'JR6-VI: đọc required_evidence trước'],
  [SKILL, /CẤM đoán-mò nguyên nhân judgment khi danh sách tồn tại/, 'JR6-VI: cấm đoán mò'],
  [CODEX_SKILL, /FIRST step of the fix round is reading `required_evidence`/, 'JR6-EN: đọc trước'],
  [CODEX_SKILL, /guessing at the judgment's cause while the[\s\S]{0,10}list exists is forbidden/, 'JR6-EN: cấm đoán mò'],
];
for (const [txt, re, name] of JRE_CLAUSES) check(`JR6 SKILL có mệnh đề: ${name}`, () => assert.match(txt, re));
for (const [txt, re, name] of JRE_CLAUSES) check(`JR6m mutant xoá → đỏ: ${name}`, () => {
  const hit = txt.match(re); assert.ok(hit, 'câu không tồn tại');
  assert.ok(!re.test(txt.replace(hit[0], '')), 'detector không phân biệt');
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
