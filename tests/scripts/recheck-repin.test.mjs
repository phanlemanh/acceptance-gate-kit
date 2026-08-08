// DV2 (nửa recheck) — luật re-pin T1 trong recheck-evidence.cjs: 5 nhánh gian
// lận/lương thiện + nhánh grandfather. Âm tính ghim ĐÚNG thông điệp; dương
// tính cùng harness (luật kit: âm-tính-một-mình là assertion không sống).
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { mkRepinFixture, SHA_A } from './repin-fixture.mjs';
import * as fsx from 'node:fs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RC = path.join(HERE, '..', '..', 'scripts', 'recheck-evidence.cjs');
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
  assert.match(r.err, /REPIN x none of the cited re-pin lane\(s\) matches verified_commit a{40}/);
  assert.match(r.err, /the current pin has no backing lane/);
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

check('DV2-7 section có DÒNG TRỐNG + văn xuôi trước run_id: fraud vẫn bị bắt (fix S4-r1 fail-open)', () => {
  const body = '\nSuite chạy lại xanh tại HEAD.\nrun_id: repin-test-1\nsha: ' + SHA_A;
  const bad = mkRepinFixture({ noRepinLine: true, sectionBody: body });
  const r = run(bad.report);
  assert.equal(r.code, 1, 'run_id sau dòng trống bị grandfather âm thầm — regex vẫn fail-open');
  assert.match(r.err, /REPIN x run_id "repin-test-1" cited in ### Re-pin/);
  const good = mkRepinFixture({ sectionBody: body });
  assert.equal(run(good.report).code, 0, 'đối chứng dương: section hợp lệ có dòng trống phải clean');
});

check('DV2-8 dòng `run_id: X · ghi chú` — recheck cùng ngữ nghĩa với awk pre-merge (vẫn là citation)', () => {
  const body = 'run_id: repin-test-1 · sha: ' + SHA_A + ' · suites: 4 lệnh exit 0';
  const bad = mkRepinFixture({ noRepinLine: true, sectionBody: body });
  const r = run(bad.report);
  assert.equal(r.code, 1, 'run_id có đuôi · bị recheck bỏ qua trong khi pre-merge enforce — hai reader lệch nhau');
  assert.match(r.err, /REPIN x run_id "repin-test-1"/, 'phải là luật repin bắt, không phải luật khác che');
  // Writer lệch khuôn (run_id không đứng riêng dòng): luật repin MỚI clean,
  // nhưng luật đối chiếu run_id CŨ (evidence-core, own-line template) vẫn đỏ
  // — fail-CLOSED đúng hướng, và AC-5 cấm nới luật cũ. Ghim đúng ngữ nghĩa đó:
  const good = mkRepinFixture({ sectionBody: body });
  const rg = run(good.report);
  assert.doesNotMatch(rg.err, /REPIN x/, 'luật repin mới không được báo oan trên bộ khớp đủ');
  assert.match(rg.err, /run-log\.jsonl/, 'luật cũ own-line phải là bên bắt (fail-closed), không im lặng');
});

check('DV2-9 suites_exit RỖNG [] — lane không ghi suite nào không back được chữ ký', () => {
  const f = mkRepinFixture({ suitesExit: [] });
  const r = run(f.report);
  assert.equal(r.code, 1);
  assert.match(r.err, /nonzero suites_exit \[\]/);
});

check('DV2-10 sub-heading #### trong body — recheck vẫn enforce (ngữ pháp ranh giới thống nhất 2 reader)', () => {
  const body = '#### chi tiết lane\nrun_id: repin-test-1\nsha: ' + SHA_A;
  const bad = mkRepinFixture({ noRepinLine: true, sectionBody: body });
  assert.equal(run(bad.report).code, 1);
  const good = mkRepinFixture({ sectionBody: body });
  assert.equal(run(good.report).code, 0, 'đối chứng dương');
});

check('DV2-11 eval block MƯỢN run_id của dòng repin → đỏ đích danh (AC-11, fix S4-r2 L2-bypass)', () => {
  const { readFileSync: rf, writeFileSync: wf } = fsx;
  const f = mkRepinFixture();
  // evidence eval E1 đổi run_id thành id của dòng repin (id ĐANG có trong log)
  wf(f.report, rf(f.report, 'utf8').replace('run_id: feat-repin-E1-001', 'run_id: repin-test-1'));
  const r = run(f.report);
  assert.equal(r.code, 1, 'eval block mượn repin id mà provenance vẫn xanh — lazy fabrication lọt');
  assert.match(r.err, /re-pin lane run_id/i, 'phải là thông điệp đích danh về mượn lane id');
});

check('DV2-12 HAI sự kiện re-pin nối tiếp (section cũ sha cũ + section mới khớp vc) -> clean (fix hotfix: luật per-section sang quan-hệ ít-nhất-một-khớp)', () => {
  const f = mkRepinFixture({ secondEvent: { runId: 'repin-test-2', sha: 'b'.repeat(40) } });
  const r = run(f.report);
  assert.equal(r.code, 0, `sự kiện thứ hai làm section cũ bị báo oan: ${r.err}`);
});

check('DV2-13 fraud: hai section nhưng KHÔNG dòng lane nào khớp verified_commit -> VIOLATION đích danh', () => {
  const f = mkRepinFixture({ secondEvent: { runId: 'repin-test-2', sha: 'b'.repeat(40), line: false } });
  const r = run(f.report);
  assert.equal(r.code, 1, 'verified_commit không có lane chống lưng mà vẫn xanh');
  assert.match(r.err, /REPIN x/);
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
