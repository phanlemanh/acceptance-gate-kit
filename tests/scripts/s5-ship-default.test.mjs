// tests/scripts/s5-ship-default.test.mjs — K5 của gom-duc-ket-2-10-0 (AC-7).
// S5 mặc định MỞ PR, không bày menu ba lối; chỉ hỏi khi repo khai `ship_default: ask`.
//   S5D1 khối S5-SHIP-DEFAULT nói đủ luật     S5D2 bốn giá trị SKILL == khuôn config (một nguồn)
//   S5D3 mutant: gỡ khối → đỏ; đổi mặc định thành ask → đỏ
//   S5_CASES=S5D2 node tests/scripts/s5-ship-default.test.mjs
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const SKILL = path.join(ROOT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md');
const INIT = path.join(ROOT, 'commands', 'acceptance-init.md');

const ALL_IDS = ['S5D1', 'S5D2', 'S5D3'];
if (process.argv.includes('--ids')) { console.log(ALL_IDS.join(' ')); process.exit(0); }
const only = (process.env.S5_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => only.length === 0 || only.includes(id);
let failures = 0;
const pass = (id, m) => console.log(`  PASS: ${id} — ${m}`);
const fail = (id, m) => { console.log(`  FAIL: ${id} — ${m}`); failures++; };

const MARK = 'S5-SHIP-DEFAULT';
// Bên ĐỌC của khối — dùng chung cho bản lành và mọi bản sao mutant (không viết hai bản).
const blockOf = txt => {
  const m = txt.match(new RegExp(`<!-- <<<${MARK} -->\\n([\\s\\S]*?)\\n<!-- ${MARK}>>> -->`));
  return m ? m[1] : null;
};
const valuesOfSkill = txt => {
  const b = blockOf(txt); if (!b) return null;
  const m = b.match(/giá trị hợp lệ:\s*(.+)$/m);
  return m ? [...m[1].matchAll(/`([a-z]+)`/g)].map(x => x[1]) : null;
};
const valuesOfInit = txt => {
  const l = txt.split('\n').find(x => /ship_default:/.test(x));
  if (!l) return null;
  const after = l.split('#').slice(1).join('#');
  return [...after.matchAll(/\b(pr|merge|branch|ask)\b/g)].map(x => x[1]).filter((v, i, a) => a.indexOf(v) === i);
};
const defaultOfSkill = txt => { const b = blockOf(txt); const m = b && b.match(/^Mặc định:\s*`([a-z]+)`/mi); return m ? m[1] : null; };

const skill = readFileSync(SKILL, 'utf8');
const init = readFileSync(INIT, 'utf8');

if (want('S5D1')) {
  const id = 'S5D1'; const before = failures;
  const b = blockOf(skill);
  if (!b) fail(id, `SKILL feature-loop thiếu khối marker ${MARK}`);
  else {
    for (const [what, re] of [['mặc định PR', /mặc định[^\n]*PR/i], ['không bày menu', /không bày menu/i], ['khoá config', /ship_default/], ['ca hỏi', /\bask\b/]])
      if (!re.test(b)) fail(id, `khối ${MARK} không nói ${what}`);
    const vals = valuesOfSkill(skill);
    if (!vals || JSON.stringify([...vals].sort()) !== JSON.stringify(['ask', 'branch', 'merge', 'pr'])) fail(id, `bốn giá trị hợp lệ sai/thiếu: ${JSON.stringify(vals)}`);
  }
  if (failures === before) pass(id, 'khối S5-SHIP-DEFAULT: mặc định PR, không menu, bốn giá trị');
}

if (want('S5D2')) {
  const id = 'S5D2'; const before = failures;
  const a = valuesOfSkill(skill); const b = valuesOfInit(init);
  if (!b) fail(id, 'khuôn config trong acceptance-init.md chưa khai ship_default');
  else if (!a) fail(id, 'không rút được giá trị từ SKILL');
  else if (JSON.stringify([...a].sort()) !== JSON.stringify([...b].sort())) fail(id, `SKILL và khuôn config lệch tập giá trị: ${JSON.stringify(a)} vs ${JSON.stringify(b)}`);
  if (failures === before) pass(id, 'bốn giá trị của SKILL == khuôn config (một nguồn)');
}

if (want('S5D3')) {
  const id = 'S5D3'; const before = failures;
  // mutant 1: gỡ khối khỏi BẢN SAO → bên đọc phải đỏ đích danh
  const mut1 = skill.replace(new RegExp(`<!-- <<<${MARK} -->[\\s\\S]*?<!-- ${MARK}>>> -->`), '');
  if (mut1 === skill) fail(id, 'không tiêm được mutant gỡ khối');
  else if (blockOf(mut1) !== null) fail(id, 'bên đọc vẫn thấy khối trên bản sao đã gỡ');
  // mutant 2: đổi mặc định sang ask → phép đo mặc-định phải thấy giá trị khác
  const d0 = defaultOfSkill(skill);
  if (d0 !== 'pr') fail(id, `mặc định trong khối phải là pr, đang là ${JSON.stringify(d0)}`);
  const mut2 = skill.replace(/^(Mặc định:\s*)`pr`/mi, '$1`ask`');
  if (mut2 === skill) fail(id, 'không tiêm được mutant đổi mặc định');
  else if (defaultOfSkill(mut2) !== 'ask') fail(id, 'phép đo mặc-định không phân biệt được pr với ask');
  if (failures === before) pass(id, 'mutant gỡ khối / đổi mặc định đều bị bắt');
}

console.log(failures === 0 ? `s5-ship-default: OK (${ALL_IDS.filter(want).join(', ')})` : `s5-ship-default: ${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
