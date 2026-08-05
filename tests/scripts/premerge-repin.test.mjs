// DV2 (nửa pre-merge) + DV3 (fraud HEAD-đổi → luật stale HIỆN HÀNH) + DV4
// (grandfather trên corpus THẬT + mutant retro-enforce). Luật kit: âm tính có
// đối chứng dương + ghim thông điệp; sanity counter chống 0-hit-giả.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, appendFileSync, readdirSync, existsSync, copyFileSync, chmodSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { mkRepinFixture, SHA_A } from './repin-fixture.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const CHECK = path.join(ROOT, 'scripts', 'pre-merge-check.sh');
const RC = path.join(ROOT, 'scripts', 'recheck-evidence.js');
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };
const runCheck = (script, root) => {
  try { return { code: 0, out: execFileSync('bash', [script, root], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }) }; }
  catch (e) { return { code: e.status, out: String(e.stdout || '') + String(e.stderr || '') }; }
};
const git = (cwd, ...a) => execFileSync('git', ['-C', cwd, '-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

// ── DV2 × pre-merge: 5 nhánh trên fixture code-sinh (không cần git cho 1-5) ──
check('DV2p-5 đối chứng dương: bộ khớp đủ -> pre-merge exit 0, không dòng VIOLATION re-pin', () => {
  const f = mkRepinFixture();
  const r = runCheck(CHECK, f.root);
  assert.equal(r.code, 0, r.out);
  assert.doesNotMatch(r.out, /VIOLATION \[feat-repin\]: re-pin/);
});
check('DV2p-1 thiếu dòng repin khớp -> VIOLATION đích danh', () => {
  const f = mkRepinFixture({ noRepinLine: true });
  const r = runCheck(CHECK, f.root);
  assert.equal(r.code, 1);
  assert.match(r.out, /VIOLATION \[feat-repin\]: re-pin run_id "repin-test-1" cited in ### Re-pin but no \{"kind":"repin"\} line with that run_id in run-log\.jsonl/);
});
check('DV2p-2 sha lệch verified_commit -> VIOLATION đích danh', () => {
  const f = mkRepinFixture({ sha: 'b'.repeat(40), verifiedCommit: SHA_A });
  const r = runCheck(CHECK, f.root);
  assert.equal(r.code, 1);
  assert.match(r.out, /VIOLATION \[feat-repin\]: re-pin line for run_id "repin-test-1" has sha b{40} but verified_commit is a{40} — signature and lane disagree/);
});
check('DV2p-3 suites_exit có phần tử khác 0 -> VIOLATION đích danh', () => {
  const f = mkRepinFixture({ suitesExit: [0, 0, 2, 0] });
  const r = runCheck(CHECK, f.root);
  assert.equal(r.code, 1);
  assert.match(r.out, /VIOLATION \[feat-repin\]: re-pin line for run_id "repin-test-1" has nonzero suites_exit — a red lane cannot back a signature/);
});
check('DV2p-4 run-log vắng file -> VIOLATION đích danh, không skip âm thầm', () => {
  const f = mkRepinFixture({ noRunLog: true });
  const r = runCheck(CHECK, f.root);
  assert.equal(r.code, 1);
  assert.match(r.out, /VIOLATION \[feat-repin\]: re-pin run_id cited in ### Re-pin but _acceptance\/feat-repin\/run-log\.jsonl does not exist/);
});

check('DV2p-6 dòng repin THIẾU hẳn suites_exit → VIOLATION đích danh (fix S4-r1: lane chưa ghi suite không back được chữ ký)', () => {
  const f = mkRepinFixture({ noSuites: true });
  const r = runCheck(CHECK, f.root);
  assert.equal(r.code, 1);
  assert.match(r.out, /VIOLATION \[feat-repin\]: re-pin line for run_id "repin-test-1" has no well-formed suites_exit array/);
});
check('DV2p-7 section dòng trống + run_id dòng sau — pre-merge vẫn enforce (đồng bộ 2 reader)', () => {
  const body = '\nSuite xanh.\nrun_id: repin-test-1\nsha: ' + SHA_A;
  const bad = mkRepinFixture({ noRepinLine: true, sectionBody: body });
  const r = runCheck(CHECK, bad.root);
  assert.equal(r.code, 1);
  assert.match(r.out, /re-pin run_id "repin-test-1" cited in ### Re-pin but no/);
  const good = mkRepinFixture({ sectionBody: body });
  assert.equal(runCheck(CHECK, good.root).code, 0, 'đối chứng dương');
});

// ── DV3: fraud mượn run_id khi HEAD đã đổi → luật stale HIỆN HÀNH bắn ────────
check('DV3 fixture sạch trong git repo: repin hợp lệ tại HEAD -> exit 0 (đối chứng dương)', () => {
  const f = mkRepinFixture();
  git(f.root, 'init', '-q');
  git(f.root, 'add', '-A'); git(f.root, 'commit', '-qm', 'impl');
  const head = git(f.root, 'rev-parse', 'HEAD').trim();
  // ghim lại evidence + repin line vào đúng HEAD thật (fixture code-sinh, sha thật)
  const rep = readFileSync(f.report, 'utf8').replaceAll(SHA_A, head);
  writeFileSync(f.report, rep);
  const log = path.join(f.dir, 'run-log.jsonl');
  writeFileSync(log, readFileSync(log, 'utf8').replaceAll(SHA_A, head));
  git(f.root, 'add', '-A'); git(f.root, 'commit', '-qm', 'evidence');
  // evidence commit chỉ chạm _acceptance/** nên không tính stale
  const r = runCheck(CHECK, f.root);
  assert.equal(r.code, 0, r.out);
  globalThis.__dv3 = f; // dùng tiếp cho nhánh fraud
});
check('DV3 fraud: commit code MỚI sau khi ký -> luật stale hiện hành bắn, không cần luật mới', () => {
  const f = globalThis.__dv3;
  assert.ok(f, 'fixture DV3 chưa dựng được');
  writeFileSync(path.join(f.root, 'src.js'), 'code v2\n');
  git(f.root, 'add', '-A'); git(f.root, 'commit', '-qm', 'new code');
  const r = runCheck(CHECK, f.root);
  assert.equal(r.code, 1);
  assert.match(r.out, /VIOLATION \[feat-repin\]: evidence is stale — code changed after verify/);
});

// ── DV4: grandfather trên corpus THẬT + mutant retro-enforce ─────────────────
check('DV4a recheck MỚI trên MỌI evidence-report thật của repo -> 0 fail (sanity: ≥10 report)', () => {
  const accDir = path.join(ROOT, '_acceptance');
  const reports = readdirSync(accDir).map(s => path.join(accDir, s, 'evidence-report.md')).filter(existsSync);
  assert.ok(reports.length >= 10, `sanity counter: chỉ thấy ${reports.length} report — glob hỏng?`);
  const bad = [];
  for (const r of reports) {
    try { execFileSync('node', [RC, r], { stdio: 'ignore' }); } catch (_) { bad.push(path.basename(path.dirname(r))); }
  }
  assert.deepEqual(bad, [], `grandfather thủng: recheck đỏ trên ${bad.join(', ')}`);
});
check('DV4b sanity: detector NHÌN THẤY section Re-pin cũ trên corpus thật (>0)', () => {
  const accDir = path.join(ROOT, '_acceptance');
  let sections = 0;
  for (const s of readdirSync(accDir)) {
    const p = path.join(accDir, s, 'evidence-report.md');
    if (existsSync(p)) sections += (readFileSync(p, 'utf8').match(/^### Re-pin/gm) || []).length;
  }
  assert.ok(sections > 0, 'corpus không có section Re-pin nào — phép đo grandfather không đo gì');
});
check('DV4m mutant retro-enforce (ép mọi section thành cited) -> fixture kiểu CŨ phải ĐỎ', () => {
  const f = mkRepinFixture({ oldStyleSection: true });
  const clean = runCheck(CHECK, f.root);
  assert.equal(clean.code, 0, `đối chứng dương grandfather: ${clean.out}`);
  const src = readFileSync(CHECK, 'utf8');
  const mutated = src.replace(/^  repin_ids="\$\(awk .*$/m, '  repin_ids="RETRO-ENFORCED"');
  assert.notEqual(mutated, src, 'mutant không áp được — anchor dòng awk đổi rồi?');
  const mpath = path.join(f.root, 'pre-merge-mutant.sh');
  writeFileSync(mpath, mutated); chmodSync(mpath, 0o755);
  const r = runCheck(mpath, f.root);
  assert.equal(r.code, 1, 'mutant retro-enforce mà vẫn xanh — phép đo không phân biệt được grandfather');
  assert.match(r.out, /re-pin run_id "RETRO-ENFORCED"/);
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
