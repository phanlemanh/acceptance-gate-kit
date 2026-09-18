// tests/scripts/loi-b-hat-giong.test.mjs — hồ sơ o-chi-mo-khi-co-neo-ngoai, AC-5.
// Lối (b) «mở hợp đồng mới» đổi HÀNH ĐỘNG: ghi hạt giống có Gốc, KHÔNG tạo ô.
// Đo QUAN HỆ chứ không đo từ vựng: rút KHỐI giữa marker OOC-LOI-B rồi đòi câu mới có mặt
// VÀ câu cũ vắng — bản đo chuỗi-có-mặt trên cả tệp xanh cả khi câu cũ còn nằm ngay dưới
// (gap-probe P2). Fixture code-sinh; chuỗi ghim RÚT từ hằng của gate-card.js.
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { ROOT, SRC, mkWs, card, G2, ITEM, OOC } from './gate-fixture.mjs';

let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`PASS: ${n} `); } catch (e) { failed++; console.log(`FAIL: ${n}\n  ${e.message}`); } };
const die = m => { throw new Error(m); };
const pick = name => {
  const m = SRC.match(new RegExp(`^const ${name}\\s*=\\s*'([^']*)';`, 'm'));
  if (!m) die('gate-card.js không khai hằng ' + name);
  return m[1];
};
const MSG = pick('MSG_OOC_HAT_GIONG');
const CAU_CU = ['tách thành một việc riêng', 'tạo thư mục'];
const DOCS = ['feature-loop/skills/feature-loop/SKILL.md', 'commands/acceptance-card.md', 'commands/signoff.md'];
const blk = txt => { const m = txt.match(/<<<OOC-LOI-B -->([\s\S]*?)<!-- OOC-LOI-B>>>/); return m ? m[1] : null; };

check('LB1 the Cong 2 voi finding new-contract in cau hat giong (doi chung duong)', () => {
  const r = mkWs('s', G2(OOC(ITEM('new-contract'))));
  const out = card(r, 's').stdout;
  if (!out.includes(MSG)) die('thẻ không in câu mới: ' + MSG);
  for (const cu of CAU_CU) if (out.includes(cu)) die('thẻ còn câu cũ: ' + cu);
  // đối chứng: mục known-limits KHÔNG bị đổi lây
  const r2 = mkWs('s', G2(OOC(ITEM('known-limits'))));
  if (!card(r2, 's').stdout.includes('Máy đề xuất: ghi vào hạn chế đã biết rồi ship.')) die('nhánh known-limits bị đổi lây');
});

check('LB2 chieu do: ban sao gate-card doi hang -> LB1 do', () => {
  const d = mkdtempSync(path.join(tmpdir(), 'lb-'));
  for (const x of ['scripts', 'lib', 'skills']) cpSync(path.join(ROOT, x), path.join(d, x), { recursive: true });
  const gc = path.join(d, 'scripts', 'gate-card.js');
  const src = readFileSync(gc, 'utf8');
  if (!src.includes(MSG)) die('bản sao không mang hằng — phép tiêm hụt');
  writeFileSync(gc, src.replace(MSG, 'Máy đề xuất: tách thành một việc riêng.'));
  const r = mkWs('s', G2(OOC(ITEM('new-contract'))));
  const out = spawnSync('node', [gc, '--root', r, '--slug', 's'], { encoding: 'utf8' }).stdout;
  if (out.includes(MSG)) die('bản tiêm vẫn in câu mới — LB1 không đỏ được');
  if (!out.includes('tách thành một việc riêng')) die('bản tiêm không chạy tới nhánh đó (đỏ vì lý do khác)');
});

check('LB3 ba tai lieu: khoi OOC-LOI-B co cau moi, KHONG co cau cu', () => {
  for (const f of DOCS) {
    const txt = readFileSync(path.join(ROOT, f), 'utf8');
    const b = blk(txt);
    if (b === null) die(`${f}: thiếu marker OOC-LOI-B`);
    for (const need of ['hat-giong-<slug>.md', 'Gốc:', 'KHÔNG tạo `_acceptance/<slug>/`'])
      if (!b.includes(need)) die(`${f}: khối thiếu «${need}»`);
    for (const cu of CAU_CU) if (b.includes(cu)) die(`${f}: khối còn câu cũ «${cu}»`);
    const nhan = f.endsWith('SKILL.md') ? 'mở contract mới' : 'mở hợp đồng mới';
    if (!txt.includes(nhan)) die(`${f}: mất nhãn nguyên văn «${nhan}»`);
  }
  // chiều đỏ: chèn câu cũ VÀO TRONG khối của một bản sao → phép đo phải bắt
  const d = mkdtempSync(path.join(tmpdir(), 'lb-'));
  const f = path.join(d, 'x.md');
  writeFileSync(f, readFileSync(path.join(ROOT, DOCS[1]), 'utf8').replace('<!-- OOC-LOI-B>>>', 'tách thành một việc riêng<!-- OOC-LOI-B>>>'));
  const mutant = blk(readFileSync(f, 'utf8'));
  if (mutant === null) die('bản tiêm mất marker — phép tiêm hỏng');
  if (!CAU_CU.some(cu => mutant.includes(cu))) die('chèn câu cũ vào khối mà bộ rút khối KHÔNG thấy — phép đo mù');
});

console.log(`Results: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
