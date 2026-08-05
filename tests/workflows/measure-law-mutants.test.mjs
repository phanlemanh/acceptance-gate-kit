// MM6 — 2 finder cũ nguyên vẹn TỪNG CHỮ, pin neo git (không tin chép tay);
// MM7 — ma trận mutation toàn phần viết-trước 14 phần tử (6 shape + 4 câu
// SKILL feature-loop + 4 câu SKILL codex). Chính là hình dạng 5 áp cho bản
// thân feature (số mutant = số phần tử, không mutant gộp).
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { measureShapes } from './measure-pins.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const WF = path.join(ROOT, 'feature-loop', 'workflows', 'acceptance-verify.js');
const SKILL_P = path.join(ROOT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md');
const CODEX_P = path.join(ROOT, 'codex', 'feature-loop-codex', 'skills', 'feature-loop-codex', 'SKILL.md');
// sha TRƯỚC feature (commit Cổng 1 duyệt matrix-measure-law nằm ngay sau sha này)
const PRE_SHA = 'dc49fe7cae2e525b352b0cd85ebd501c652b8bad';
let passed = 0, failed = 0;
const check = (n, f, detail = '') => {
  try {
    const ok = typeof f === 'function' ? (f(), true) : Boolean(f);
    if (!ok) throw new Error(detail || 'assertion false');
    passed++; console.log(`  PASS: ${n}`);
  } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); }
};

const SRC = readFileSync(WF, 'utf8');
const SKILL = readFileSync(SKILL_P, 'utf8');
const CODEX = readFileSync(CODEX_P, 'utf8');

console.log('MM6 finder cũ nguyên vẹn từng chữ — pin neo git show ' + PRE_SHA.slice(0, 7));
{
  let pre = '';
  try { pre = execFileSync('git', ['-C', ROOT, 'show', `${PRE_SHA}:feature-loop/workflows/acceptance-verify.js`], { encoding: 'utf8' }); }
  catch (_) { /* sha unreachable → fail rõ bên dưới */ }
  check('MM6 nguồn pin resolve được (sha trước feature còn trong clone)', pre.length > 0, `git show ${PRE_SHA} thất bại — không có nguồn để so, KHÔNG được coi là pass`);
  // rút 2 prompt cũ TỪ BẢN TRƯỚC (không chép tay): reviewer conventions (nhánh
  // không reviewSkillPath) + bugs — mỗi prompt là template literal 1 dòng.
  const grab = (txt, key) => {
    const m = txt.match(new RegExp(`key: '${key}', prompt: \`([^\`]+)\``));
    return m ? m[1] : null;
  };
  for (const key of ['conventions', 'bugs']) {
    const old = grab(pre, key), cur = grab(SRC, key);
    check(`MM6 prompt '${key}' hiện tại == bản trước từng chữ`, old !== null && cur !== null && old === cur,
      old === null ? 'không rút được prompt từ bản trước' : (cur === null ? 'không rút được prompt hiện tại' : 'prompt đã bị sửa — AC-6 vỡ'));
  }
  // Đo QUAN HỆ thật (fix S4-r1): đếm MỌI phần tử trong block mảng REVIEWERS,
  // không đếm 3 tên key đã biết — thêm reviewer thứ 4 key lạ phải làm đỏ.
  const revBlock = SRC.match(/const REVIEWERS = \[([\s\S]*?)\n\]/);
  check('MM6 block REVIEWERS parse được', !!revBlock);
  // Phần tử của mảng mở ở mức thụt 2 cách (phần tử đầu là ternary nên mở bằng
  // `args.`); nhánh ternary thụt sâu hơn — không đếm nhầm nhánh làm phần tử.
  const countElems = (blockBody) => (blockBody.match(/^  (?:\{ key: '|args\.)/gm) || []).length;
  check('MM6 REVIEWERS có ĐÚNG 3 phần tử (đếm phần tử mảng thật, không whitelist tên)',
    !!revBlock && countElems(revBlock[1]) === 3,
    revBlock ? String(countElems(revBlock[1])) : 'no block');
  check('MM6m2 mutant thêm reviewer thứ 4 key lạ → phép đếm đỏ', (() => {
    const mutated = SRC.replace(/(\n)\]\n\n\/\/ ---- Machine/, "$1  { key: 'style', prompt: `nit` },\n]\n\n// ---- Machine");
    const mb = mutated.match(/const REVIEWERS = \[([\s\S]*?)\n\]/);
    return !!mb && countElems(mb[1]) !== 3;
  })(), 'thêm phần tử thứ 4 mà phép đếm vẫn ra 3');
  // mutant: sửa 1 chữ prompt cũ trên BẢN SAO → phép so phải đỏ
  const oldBugs = grab(pre, 'bugs');
  const mutated = SRC.replace('tim correctness bugs', 'tim correctness bug');
  check('MM6m mutant sửa 1 chữ prompt cũ → phép so đỏ đích danh', grab(mutated, 'bugs') !== oldBugs, 'phép so không phân biệt được bản bị sửa');
}

console.log('MM7 ma trận 18 mutant viết-trước (6 shape + 6 câu VI + 6 câu EN)');
{
  // 6 mutant shape: xoá từng phần tử const trên bản sao script → measureShapes đỏ đúng phần tử
  const constM = SRC.match(/const MEASUREMENT_SHAPES = \[([\s\S]*?)\]/);
  check('MM7 sanity: const MEASUREMENT_SHAPES tồn tại để mutate', !!constM);
  const shapeLines = constM ? constM[1].split('\n').filter(l => l.trim().startsWith("'")) : [];
  check('MM7 sanity: đủ 6 dòng shape để mutate', shapeLines.length === 6, String(shapeLines.length));
  // Đối chứng dương TỰ CHỨA (fix S4-r1): bản nguyên vẹn phải XANH trước khi
  // tin bản bị tiêm là ĐỎ.
  check('MM7+ đối chứng dương: bản nguyên vẹn đo ba-chiều XANH', measureShapes(SRC, null).ok, (measureShapes(SRC, null).why || ''));
  shapeLines.forEach((line, i) => {
    const mutated = SRC.replace(line + '\n', '');
    const r = measureShapes(mutated, null);
    const pinHead = (line.match(/'((?:[^'\\]|\\.)*)'/) || [, ''])[1].replace(/\\'/g, "'").slice(0, 40);
    check(`MM7s${i + 1} xoá shape ${i + 1} → đỏ ĐÍCH DANH phần tử đó`, !r.ok && (r.why || '').includes(pinHead), `why=${r.why || 'vẫn xanh'} · cần chứa: ${pinHead}`);
  });
  // 4 mutant SKILL feature-loop + 4 mutant codex: xoá từng câu → regex MM1/MM2 đỏ
  const VI = [
    /mỗi eval tuyên quét LỚP có ma trận toàn phần viết-trước không \(số assert = số phần tử\)/,
    /assertion âm tính nào thiếu đối chứng dương hoặc không ghim thông điệp/,
    /fixture nào viết tay đúng khuôn bên đọc thay vì code-sinh\/round-trip/,
    /assert nào đo chuỗi-có-mặt trong khi lời hứa là quan hệ/,
    /eval nào đo CHỈ DẪN\/tài liệu hướng dẫn thay vì ĐẦU RA thật của code/,
    /đường dẫn nào trong phép đo\/script sinh fixture hardcode ROOT thay vì suy từ vị trí script/,
  ];
  const EN = [
    /every[\s\S]{0,20}eval that claims to sweep a CLASS[\s\S]{0,60}full matrix written in advance[\s\S]{0,20}\(assert count = element count\)/i,
    /negative assertion lacks a positive[\s\S]{0,10}control or a pinned message/i,
    /fixture is hand-written to the reader'?s[\s\S]{0,10}shape instead of code-generated\/round-trip/i,
    /measures[\s\S]{0,10}string-presence while the promise is a relationship/i,
    /measures INSTRUCTIONS\/docs instead of the code'?s real OUTPUT/i,
    /hardcodes ROOT instead of[\s\S]{0,10}deriving it from the script location/i,
  ];
  VI.forEach((re, i) => {
    const hit = SKILL.match(re);
    check(`MM7v${i + 1} xoá câu VI ${i + 1} → đỏ đích danh`, !!hit && !re.test(SKILL.replace(hit[0], '')), hit ? 'detector không phân biệt' : 'câu không tồn tại');
  });
  EN.forEach((re, i) => {
    const hit = CODEX.match(re);
    check(`MM7e${i + 1} xoá câu EN ${i + 1} → đỏ đích danh`, !!hit && !re.test(CODEX.replace(hit[0], '')), hit ? 'detector không phân biệt' : 'câu không tồn tại');
  });
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
