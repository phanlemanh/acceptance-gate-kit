// JR11 (judge-required-evidence, AC-11) — lõi bằng chứng bất động + đường
// đọc-cũ: lib/** và hooks/** không đổi so với base; recheck strict trên corpus
// thật == baseline viết-trước (0 fail); đối chứng dương: tiêm 1 vi phạm biết
// trước vào BẢN SAO → recheck ĐỎ đúng thông điệp — lưới thật sự chạy.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, readdirSync, existsSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };
const git = (...a) => execFileSync('git', ['-C', ROOT, ...a], { encoding: 'utf8' });

function base() {
  for (const ref of ['origin/main', 'main', 'master']) {
    try { execFileSync('git', ['-C', ROOT, 'rev-parse', '--verify', '-q', `${ref}^{commit}`], { stdio: 'ignore' }); }
    catch (_) { continue; }
    return git('merge-base', 'HEAD', ref).trim();
  }
  throw new Error('không resolve được nhánh chính');
}

check('JR11a lib/** + hooks/** KHÔNG đổi so với base (sanity: 2 thư mục có file)', () => {
  for (const d of ['lib', 'hooks']) {
    assert.ok(readdirSync(path.join(ROOT, d)).length > 0, `sanity: ${d}/ rỗng`);
    const diff = git('diff', '--name-only', base(), 'HEAD', '--', d).trim();
    assert.equal(diff, '', `lõi ${d}/ bị chạm:\n${diff}`);
  }
});

check('JR11b recheck strict trên corpus thật == baseline viết-trước (0 fail)', () => {
  const acc = path.join(ROOT, '_acceptance');
  const reports = readdirSync(acc).map(s => path.join(acc, s, 'evidence-report.md')).filter(existsSync);
  assert.ok(reports.length >= 10, `sanity: chỉ ${reports.length} report`);
  const bad = [];
  for (const r of reports) {
    try { execFileSync('node', [path.join(ROOT, 'scripts/recheck-evidence.js'), r], { stdio: 'ignore' }); }
    catch (_) { bad.push(path.basename(path.dirname(r))); }
  }
  assert.deepEqual(bad, [], `baseline vỡ (viết trước: 0 fail): ${bad.join(', ')}`);
});

check('JR11c đối chứng dương: tiêm token cấm vào BẢN SAO 1 report → recheck ĐỎ đúng thông điệp', () => {
  const acc = path.join(ROOT, '_acceptance');
  const src = readdirSync(acc).map(s => path.join(acc, s)).find(d => existsSync(path.join(d, 'evidence-report.md')));
  assert.ok(src, 'không có workspace nào để sao');
  const t = mkdtempSync(path.join(tmpdir(), 'jr11-'));
  const dir = path.join(t, '_acceptance', path.basename(src));
  mkdirSync(path.dirname(dir), { recursive: true });
  cpSync(src, dir, { recursive: true });
  const rp = path.join(dir, 'evidence-report.md');
  writeFileSync(rp, readFileSync(rp, 'utf8') + '\nghi chu tiem: verdict: FAIL\n');
  let err = '';
  try { execFileSync('node', [path.join(ROOT, 'scripts/recheck-evidence.js'), rp], { stdio: ['ignore', 'ignore', 'pipe'] }); }
  catch (e) { err = String(e.stderr || ''); }
  assert.ok(err, 'bản tiêm vẫn xanh — lưới không chạy thật');
  assert.match(err, /CONSISTENCY/, `đỏ nhưng sai thông điệp: ${err.slice(0, 120)}`);
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
