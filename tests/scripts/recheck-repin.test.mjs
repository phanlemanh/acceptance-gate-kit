// DV2 (nửa recheck) — luật re-pin T1 trong recheck-evidence.js: 5 nhánh gian
// lận/lương thiện + nhánh grandfather. Âm tính ghim ĐÚNG thông điệp; dương
// tính cùng harness (luật kit: âm-tính-một-mình là assertion không sống).
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { mkRepinFixture, SHA_A } from './repin-fixture.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RC = path.join(HERE, '..', '..', 'scripts', 'recheck-evidence.js');
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };
const run = (report) => {
  try { execFileSync('node', [RC, report], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); return { code: 0, err: '' }; }
  catch (e) { return { code: e.status, err: String(e.stderr || '') }; }
};

check('DV2-5 đối chứng dương: bộ khớp đủ (run_id + sha + suites toàn 0) -> exit 0', () => {
  const f = mkRepinFixture();
  const r = run(f.report);
  assert.equal(r.code, 0, `expected clean, got exit ${r.code}: ${r.err}`);
});

check('DV2-1 run-log không có dòng repin khớp run_id -> exit 1 + thông điệp đích danh', () => {
  const f = mkRepinFixture({ noRepinLine: true });
  const r = run(f.report);
  assert.equal(r.code, 1);
  assert.match(r.err, /REPIN x run_id "repin-test-1" cited in ### Re-pin but no \{"kind":"repin"\} line with that run_id in run-log\.jsonl/);
  assert.match(r.err, /do not hand-mint run_ids/);
});

check('DV2-2 sha dòng repin khác verified_commit -> exit 1 + thông điệp đích danh', () => {
  const f = mkRepinFixture({ sha: 'b'.repeat(40), verifiedCommit: SHA_A });
  const r = run(f.report);
  assert.equal(r.code, 1);
  assert.match(r.err, new RegExp(`REPIN x repin line for run_id "repin-test-1" has sha b{40} but report verified_commit is a{40}`));
  assert.match(r.err, /signature and lane disagree/);
});

check('DV2-3 suites_exit có phần tử khác 0 (lane đỏ vẫn ký) -> exit 1 + thông điệp đích danh', () => {
  const f = mkRepinFixture({ suitesExit: [1, 0, 0, 0] });
  const r = run(f.report);
  assert.equal(r.code, 1);
  assert.match(r.err, /REPIN x repin line for run_id "repin-test-1" has nonzero suites_exit \[1,0,0,0\]/);
  assert.match(r.err, /a red lane cannot back a signature/);
});

check('DV2-4 run-log.jsonl VẮNG file mà report cite run_id -> exit 1, không skip âm thầm', () => {
  const f = mkRepinFixture({ noRunLog: true });
  const r = run(f.report);
  assert.equal(r.code, 1);
  assert.match(r.err, /REPIN x report cites repin run_id "repin-test-1" but _acceptance\/feat-repin\/run-log\.jsonl does not exist/);
});

check('DV2-6 grandfather: section Re-pin kiểu CŨ (không run_id:) -> exit 0, không luật mới nào áp', () => {
  const f = mkRepinFixture({ oldStyleSection: true });
  const r = run(f.report);
  assert.equal(r.code, 0, `old-style section must stay clean, got ${r.code}: ${r.err}`);
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
