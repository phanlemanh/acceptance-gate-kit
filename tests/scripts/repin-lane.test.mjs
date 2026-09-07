// LN — làn re-pin bằng MÁY (feature-loop/scripts/repin-lane.mjs), đo trên một
// kho git CODE-SINH trong chính lần chạy. Chiều xanh: làn ghi dòng + section,
// chính reader (recheck + pre-merge) nhận. Chiều đỏ «phá vật thật»: xoá tiền đề
// mà eval của hồ sơ đo → làn ĐỎ, KHÔNG ghi gì — đúng ca crm-onehub 07/09 mà
// nghi thức cũ (chỉ suite) đã cho qua. Writer ↔ khuôn SKILL ↔ reader ghim
// bằng tập khoá của dòng repin.
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { evalsYamlWith } from './repin-fixture.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const LANE = path.join(ROOT, 'feature-loop', 'scripts', 'repin-lane.mjs');
const RC = path.join(ROOT, 'scripts', 'recheck-evidence.cjs');
const CHECK = path.join(ROOT, 'scripts', 'pre-merge-check.sh');
const SKILL = readFileSync(path.join(ROOT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md'), 'utf8');
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };

// ── kho git code-sinh: 1 suite + 1 hồ sơ có eval máy đo một TIỀN ĐỀ thật ──
const R = mkdtempSync(path.join(tmpdir(), 'repin-lane-'));
const git = (...a) => execFileSync('git', ['-C', R, '-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const WS = path.join(R, '_acceptance', 'feat-lane');
mkdirSync(WS, { recursive: true });
writeFileSync(path.join(R, '_acceptance', 'config.yaml'),
  'schema_version: 1\nenforcement: strict\nrecheck: strict\ngap_probe: off\nfeature_loop:\n  suite_keys:\n    - executors.test.suite\nexecutors:\n  test:\n    suite: "sh suite.sh"\n  script:\n    rang_e1: "sh rang-e1.sh"\n');
writeFileSync(path.join(R, 'suite.sh'), 'exit 0\n');
writeFileSync(path.join(R, 'rang-e1.sh'), 'test -f tien-de.txt\n'); // eval đo tiền đề: file phải tồn tại
writeFileSync(path.join(R, 'tien-de.txt'), 'tien de\n');
writeFileSync(path.join(R, 'src.js'), 'v1\n');
writeFileSync(path.join(WS, 'contract.md'), '---\nschema_version: 1\nfeature: feat-lane\nslug: feat-lane\nrisk_tier: T2\nsurfaces: [api]\nstatus: signed-off\napproved_by: Manh Phan\n---\n');
writeFileSync(path.join(WS, 'evals.yaml'), evalsYamlWith(['E1']).replace('slug: feat-repin', 'slug: feat-lane'));
git('init', '-q'); git('add', '-A'); git('commit', '-qm', 'impl');
const HEAD1 = git('rev-parse', 'HEAD');
writeFileSync(path.join(WS, 'run-log.jsonl'), JSON.stringify({ ts: '2026-09-01T00:00:00Z', kind: 'eval', run_id: 'r1-E1', sha: HEAD1, eval: 'E1', exit_code: 0 }) + '\n');
writeFileSync(path.join(WS, 'evidence-report.md'),
  `---\nschema_version: 1\nfeature_slug: feat-lane\nverdict: PASS\nverified_commit: ${HEAD1}\nhuman_signoff: Manh 2026-09-01\n---\n\n## Evidence\n- eval: E1\n  run_id: r1-E1\n  exit_code: 0\n  verifier: config:executors.script.rang_e1\n  verified_at: 2026-09-01\n\n## Iterations\n\nRound 1 — PASS.\n`);
git('add', '-A'); git('commit', '-qm', 'evidence');
const HEAD_E = git('rev-parse', 'HEAD'); // HEAD lúc làn chạy (commit evidence chỉ chạm _acceptance/ nên không stale)
const REPORT = path.join(WS, 'evidence-report.md');
const LOG = path.join(WS, 'run-log.jsonl');
const lane = (...a) => spawnSync(process.execPath, [LANE, '--root', R, '--ag-root', ROOT, ...a], { encoding: 'utf8' });
const rc = () => spawnSync(process.execPath, [RC, REPORT], { encoding: 'utf8' });
const pm = () => spawnSync('bash', [CHECK, R], { encoding: 'utf8' });
const repinLines = () => readFileSync(LOG, 'utf8').split('\n').filter(l => l.includes('"kind":"repin"'));
const vcOf = () => readFileSync(REPORT, 'utf8').match(/^verified_commit:\s*(\S+)/m)[1];

check('LN0 làn xanh KHÔNG --write: exit 0, JSON có evals_exit {E1:0} + sha = HEAD, không ghi gì', () => {
  const r = lane('--slug', 'feat-lane');
  assert.equal(r.status, 0, r.stderr);
  const o = JSON.parse(r.stdout);
  assert.equal(o.sha, HEAD_E, 'sha của làn phải là HEAD lúc chạy');
  assert.deepEqual(o.slugs['feat-lane'].evals_exit, { E1: 0 });
  assert.deepEqual(JSON.parse(o.slugs['feat-lane'].line).suites_exit, [0]);
  assert.equal(repinLines().length, 0, 'không --write mà run-log đã có dòng repin');
});

check('LN1 --write: run-log +1 dòng repin, section Re-pin lần 1 với evals: 1 eval máy, recheck + pre-merge xanh', () => {
  const r = lane('--slug', 'feat-lane', '--reason', 'kiểm làn', '--write');
  assert.equal(r.status, 0, r.stderr);
  assert.equal(repinLines().length, 1);
  const line = JSON.parse(repinLines()[0]);
  assert.equal(line.sha, HEAD_E); assert.deepEqual(line.evals_exit, { E1: 0 });
  assert.equal(vcOf(), HEAD_E, 'verified_commit phải nhảy tới sha của làn');
  const rep = readFileSync(REPORT, 'utf8');
  assert.match(rep, /### Re-pin lần 1 — \d{4}-\d{2}-\d{2}, do kiểm làn\nrun_id: repin-\S+\nsha: [0-9a-f]{40} · suites: 1 lệnh exit 0 · evals: 1 eval máy exit 0/);
  assert.match(r.stderr, /recheck-evidence xanh/, 'làn phải tự kiểm bằng reader sau khi ghi');
  assert.equal(rc().status, 0, rc().stderr);
  const p = pm(); assert.equal(p.status, 0, p.stdout + p.stderr);
  assert.doesNotMatch(p.stdout, /suite-only/);
  git('add', '-A'); git('commit', '-qm', 're-pin 1');
});

check('LN2 PHÁ VẬT THẬT: hợp nhất xoá tiền đề của E1 → suite vẫn xanh nhưng làn ĐỎ gọi tên feat-lane/E1, KHÔNG ghi gì', () => {
  rmSync(path.join(R, 'tien-de.txt')); writeFileSync(path.join(R, 'src.js'), 'v2\n');
  git('add', '-A'); git('commit', '-qm', 'merge 88 commit: mất tiền đề');
  const before = { lines: repinLines().length, vc: vcOf(), rep: readFileSync(REPORT, 'utf8') };
  const r = lane('--slug', 'feat-lane', '--reason', 'sau hợp nhất', '--write');
  assert.equal(r.status, 1, `nghi thức cũ sẽ ghim xanh ở đây (suite xanh) — làn mới phải đỏ:\n${r.stderr}`);
  assert.match(r.stderr, /LÀN ĐỎ — không ghi gì \(suite \[0\]; eval đỏ: feat-lane\/E1=1\)/);
  assert.equal(repinLines().length, before.lines, 'làn đỏ mà run-log vẫn nhận dòng');
  assert.equal(vcOf(), before.vc, 'làn đỏ mà verified_commit vẫn nhảy');
  assert.equal(readFileSync(REPORT, 'utf8'), before.rep, 'làn đỏ mà report vẫn bị sửa');
  const o = JSON.parse(r.stdout); assert.deepEqual(o.slugs['feat-lane'].evals_exit, { E1: 1 });
});

check('LN3 khôi phục tiền đề, commit → làn xanh: run-log +1, verified_commit → HEAD mới, Re-pin lần 2, hai reader xanh', () => {
  writeFileSync(path.join(R, 'tien-de.txt'), 'tien de\n'); git('add', '-A'); git('commit', '-qm', 'khôi phục');
  const HEAD3 = git('rev-parse', 'HEAD');
  const r = lane('--slug', 'feat-lane', '--reason', 'sau khôi phục', '--write');
  assert.equal(r.status, 0, r.stderr);
  assert.equal(repinLines().length, 2);
  assert.equal(vcOf(), HEAD3);
  assert.match(readFileSync(REPORT, 'utf8'), /### Re-pin lần 2 — /);
  assert.equal(rc().status, 0, rc().stderr);
  const p = pm(); assert.equal(p.status, 0, p.stdout + p.stderr);
  git('add', '-A'); git('commit', '-qm', 're-pin 2');
});

check('LN4 cây bẩn ngoài _acceptance/ → exit 2 gọi tên file; --allow-dirty đi tiếp (không ghi)', () => {
  writeFileSync(path.join(R, 'src.js'), 'v3-chua-commit\n');
  const r = lane('--slug', 'feat-lane');
  assert.equal(r.status, 2); assert.match(r.stderr, /cây bẩn ngoài _acceptance\/.*src\.js/);
  const r2 = lane('--slug', 'feat-lane', '--allow-dirty');
  assert.equal(r2.status, 0, r2.stderr); assert.match(r2.stderr, /CẢNH BÁO --allow-dirty/);
  git('checkout', '--', 'src.js');
});

check('LN5 khoá dòng repin của SCRIPT == khoá khuôn REPIN-TEMPLATE trong SKILL (writer máy ↔ khuôn không trôi)', () => {
  const m = SKILL.match(/<!-- <<<REPIN-TEMPLATE -->\s*```\n([\s\S]*?)```\s*<!-- REPIN-TEMPLATE>>> -->/);
  assert.ok(m, 'không thấy marker REPIN-TEMPLATE');
  const tl = m[1].split('\n').find(l => l.includes('"kind":"repin"'));
  const filled = tl.replaceAll('<ISO>', '2026-09-09T00:00:00Z').replaceAll('<id>', 'x').replaceAll('<40-hex>', 'a'.repeat(40)).replaceAll('"<E>"', '"E1"');
  const tKeys = Object.keys(JSON.parse(filled));
  const sKeys = Object.keys(JSON.parse(repinLines()[0]));
  assert.deepEqual(sKeys, tKeys, 'script viết khoá khác khuôn SKILL');
  assert.ok(tKeys.includes('evals_exit'), 'khuôn SKILL chưa có evals_exit');
});

check('LN6 usage/nguồn hỏng: cờ lạ → exit 3; config thiếu suite_keys → exit 2 gọi tên; hồ sơ không evals.yaml → exit 2', () => {
  assert.equal(lane('--slug', 'feat-lane', '--bogus').status, 3);
  const cfg = path.join(R, '_acceptance', 'config.yaml'); const saved = readFileSync(cfg, 'utf8');
  writeFileSync(cfg, saved.replace(/feature_loop:[\s\S]*?executors:/, 'executors:'));
  const r = lane('--slug', 'feat-lane'); assert.equal(r.status, 2); assert.match(r.stderr, /suite_keys/);
  writeFileSync(cfg, saved);
  const r2 = lane('--slug', 'khong-co'); assert.equal(r2.status, 2); assert.match(r2.stderr, /khong-co: không có evidence-report\.md/);
  git('checkout', '--', '.');
  assert.ok(existsSync(path.join(WS, 'evals.yaml')));
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
