// DV5 — ngưỡng chết O1 thành phép đo máy: diff 2 file cưỡng chế
// (pre-merge-check.sh + recheck-evidence.js) so với base CHỈ được THÊM.
// 3 răng chống 0-hit-giả: (a) base suy từ git lúc chạy, không hardcode sha;
// (b) sanity counter — số dòng luật cũ nhận diện được phải > 0;
// (c) mutant sửa 1 luật cũ → phép đo phải ĐỎ đích danh.
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const FILES = ['scripts/pre-merge-check.sh', 'scripts/recheck-evidence.js'];
const ALLOWED_REMOVALS = []; // ngoại lệ '-' phải liệt kê ĐÍCH DANH từng dòng nguyên văn
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };
const git = (...a) => execFileSync('git', ['-C', ROOT, ...a], { encoding: 'utf8' });

// (a) base suy lúc chạy: origin/main → main → master (merge-base với HEAD)
function resolveBase() {
  for (const ref of ['origin/main', 'main', 'master']) {
    try { execFileSync('git', ['-C', ROOT, 'rev-parse', '--verify', '-q', `${ref}^{commit}`], { stdio: 'ignore' }); }
    catch (_) { continue; }
    return git('merge-base', 'HEAD', ref).trim();
  }
  throw new Error('không resolve được nhánh chính (origin/main|main|master)');
}

// Phép đo dùng CHUNG cho cả leg thật lẫn leg mutant: git diff --no-index,
// trả danh sách dòng luật-cũ bị xoá/sửa (dòng '-' ngoài ALLOWED_REMOVALS).
function measure(baseText, curText) {
  const d = mkdtempSync(path.join(tmpdir(), 'addonly-'));
  const a = path.join(d, 'base'); const b = path.join(d, 'cur');
  writeFileSync(a, baseText); writeFileSync(b, curText);
  let out = '';
  try { execFileSync('git', ['diff', '--no-index', '--', a, b], { encoding: 'utf8' }); }
  catch (e) { out = String(e.stdout || ''); }
  return out.split('\n')
    .filter(l => /^-[^-]/.test(l) || l === '-')
    .map(l => l.slice(1))
    .filter(l => !ALLOWED_REMOVALS.includes(l));
}

const BASE = resolveBase();
for (const f of FILES) {
  check(`DV5 ${f}: diff so với base ${BASE.slice(0, 7)} CHỈ THÊM (0 dòng luật cũ bị xoá/sửa)`, () => {
    const baseText = git('show', `${BASE}:${f}`);
    const curText = execFileSync('cat', [path.join(ROOT, f)], { encoding: 'utf8' });
    // (b) sanity counter: phép nhận diện luật cũ phải thấy > 0 dòng
    const oldRules = baseText.split('\n').filter(l => /VIOLATION|NOTE \[|process\.exit\(1\)/.test(l));
    assert.ok(oldRules.length > 0, `sanity counter: 0 dòng luật cũ nhận diện được trong ${f}@base — phép nhận diện hỏng`);
    const removed = measure(baseText, curText);
    assert.deepEqual(removed, [], `additive-only: existing rule line removed/modified trong ${f}:\n${removed.slice(0, 5).join('\n')}`);
  });
}

check('DV5m mutant: bản sao sửa 1 dòng VIOLATION cũ → phép đo phải ĐỎ đích danh', () => {
  const baseText = git('show', `${BASE}:scripts/pre-merge-check.sh`);
  const target = baseText.split('\n').find(l => l.includes('VIOLATION') && l.includes('stale'));
  assert.ok(target, 'không tìm được dòng luật cũ để mutate — sanity hỏng');
  const mutated = execFileSync('cat', [path.join(ROOT, 'scripts/pre-merge-check.sh')], { encoding: 'utf8' })
    .replace(target, target.replace('VIOLATION', 'RELAXED'));
  const removed = measure(baseText, mutated);
  assert.ok(removed.length > 0, 'mutant nới luật cũ mà phép đo vẫn 0 dòng xoá — additive-only không phân biệt được');
  assert.ok(removed.some(l => l.includes('VIOLATION')), 'phép đo đỏ nhưng không trỏ đúng dòng luật bị nới');
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
