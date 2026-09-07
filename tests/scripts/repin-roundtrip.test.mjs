// DV12 — round-trip writer↔reader (AC-16, fix gap-probe P1-1, cite
// [context-ladder#F1]): fixture dòng repin + section Re-pin RÚT TỪ khuôn giữa
// marker REPIN-TEMPLATE trong SKILL (không chép tay) → parse bằng CHÍNH
// recheck-evidence.cjs. Writer/reader không thể trôi mà test vẫn xanh.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { mkRepinFixture, SHA_A, TS_NEW, evalsYamlWith } from './repin-fixture.mjs';
import { execFileSync as ex2 } from 'node:child_process';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const RC = path.join(ROOT, 'scripts', 'recheck-evidence.cjs');
const SKILL = readFileSync(path.join(ROOT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md'), 'utf8');
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };
const run = (report) => {
  try { execFileSync('node', [RC, report], { stdio: ['ignore', 'ignore', 'pipe'] }); return { code: 0, err: '' }; }
  catch (e) { return { code: e.status, err: String(e.stderr || '') }; }
};

// Rút khuôn từ marker (thiếu marker = FAIL đích danh, không fallback)
function template() {
  const m = SKILL.match(/<!-- <<<REPIN-TEMPLATE -->\s*```\n([\s\S]*?)```\s*<!-- REPIN-TEMPLATE>>> -->/);
  assert.ok(m, 'không tìm thấy cặp marker REPIN-TEMPLATE trong SKILL');
  const lines = m[1].split('\n').filter(l => l.trim());
  const jsonlLine = lines.find(l => l.includes('"kind":"repin"'));
  assert.ok(jsonlLine, 'khuôn giữa marker không có dòng kind:repin');
  const secStart = lines.findIndex(l => l.startsWith('### Re-pin'));
  assert.ok(secStart >= 0, 'khuôn giữa marker không có khuôn section');
  return { jsonlLine, sectionLines: lines.slice(secStart) };
}

// Thay placeholder của khuôn bằng giá trị thật — SINH từ khuôn, không chép tay
const fill = (s, v) => s
  .replaceAll('<ISO>', v.iso).replaceAll('<id>', v.id).replaceAll('<40-hex>', v.sha)
  .replaceAll('[0,0,0,0]', JSON.stringify(v.suites))
  .replaceAll('{"<E>":0}', JSON.stringify(v.evals || {})).replaceAll('<m>', String(Object.keys(v.evals || {}).length))
  .replaceAll('<N>', '1').replaceAll('<ngày>', '2026-08-05')
  .replaceAll('<lý do 1 dòng>', 'round-trip test').replaceAll('<k>', String(v.suites.length));

// Khuôn từ 07/09/2026 luôn mang evals_exit (writer là script), nên fixture
// mặc định có evals.yaml với E1 và điền {E1:0}; vOverride/fx cho ca khác.
function buildFromTemplate(mutateLine, vOverride = {}, fx = {}) {
  const t = template();
  const v = { iso: '2026-08-05T00:00:00Z', id: 'repin-rt-1', sha: SHA_A, suites: [0, 0, 0, 0], evals: { E1: 0 }, ...vOverride };
  let line = fill(t.jsonlLine, v);
  if (mutateLine) line = mutateLine(line);
  const section = t.sectionLines.map(l => fill(l, v)).join('\n');
  // dựng workspace bằng helper rồi THAY dòng repin + section bằng bản sinh-từ-khuôn
  const f = mkRepinFixture({ runId: v.id, sectionBody: '__PLACEHOLDER__', evalsYaml: evalsYamlWith(['E1']), ...fx });
  const logPath = path.join(f.dir, 'run-log.jsonl');
  const log = readFileSync(logPath, 'utf8').split('\n').filter(l => l && !l.includes('"kind":"repin"'));
  log.push(line);
  writeFileSync(logPath, log.join('\n') + '\n');
  writeFileSync(f.report, readFileSync(f.report, 'utf8')
    .replace(/### Re-pin lần 1[^\n]*\n__PLACEHOLDER__/, section));
  return f;
}

check('DV12 round-trip: fixture SINH TỪ khuôn REPIN-TEMPLATE → recheck clean', () => {
  const f = buildFromTemplate();
  const r = run(f.report);
  assert.equal(r.code, 0, `khuôn writer không qua được reader: ${r.err}`);
});

check('DV12m đột biến khuôn (suites_exit → suites) → recheck ĐỎ đích danh', () => {
  const f = buildFromTemplate(l => l.replace('"suites_exit"', '"suites"'));
  const r = run(f.report);
  assert.equal(r.code, 1, 'dòng repin mất field suites_exit mà reader vẫn nhận');
  assert.match(r.err, /REPIN x repin line for run_id "repin-rt-1" has nonzero suites_exit undefined/);
});

check('DV12+ đối chứng dương lặp lại sau đột biến: khuôn nguyên vẹn vẫn clean', () => {
  const f = buildFromTemplate();
  assert.equal(run(f.report).code, 0);
});

const CHECK = path.join(ROOT, 'scripts', 'pre-merge-check.sh');
const runPm = (root) => {
  try { return { code: 0, out: ex2('bash', [CHECK, root], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }) }; }
  catch (e) { return { code: e.status, out: String(e.stdout || '') + String(e.stderr || '') }; }
};

check('DV12p round-trip qua READER THỨ HAI (pre-merge): fixture sinh-từ-khuôn → clean', () => {
  const f = buildFromTemplate();
  const r = runPm(f.root);
  assert.equal(r.code, 0, `khuôn writer không qua được pre-merge: ${r.out}`);
});

check('DV12pm đột biến khuôn (suites_exit → suites) → pre-merge cũng ĐỎ (fix S4-r1: 2 reader không được lệch nhau)', () => {
  const f = buildFromTemplate(l => l.replace('"suites_exit"', '"suites"'));
  const r = runPm(f.root);
  assert.equal(r.code, 1, 'mutant thiếu suites_exit lọt qua pre-merge trong khi recheck chặn — hai reader lệch');
  assert.match(r.out, /has no well-formed suites_exit array/);
});

check('DV12b biến thể writer hợp lý: dòng trống sau heading — cả hai reader vẫn đọc được (fix S4-r1 fail-open)', () => {
  const t = template();
  const v = { iso: '2026-08-05T00:00:00Z', id: 'repin-rt-1', sha: SHA_A, suites: [0, 0, 0, 0], evals: { E1: 0 } };
  const line = fill(t.jsonlLine, v);
  const section = t.sectionLines.map(l => fill(l, v)).join('\n').replace('\n', '\n\n'); // chèn dòng trống sau heading
  const f = mkRepinFixture({ runId: v.id, sectionBody: '__PLACEHOLDER__', evalsYaml: evalsYamlWith(['E1']) });
  const logPath = path.join(f.dir, 'run-log.jsonl');
  const log = readFileSync(logPath, 'utf8').split('\n').filter(l => l && !l.includes('"kind":"repin"'));
  log.push(line);
  writeFileSync(logPath, log.join('\n') + '\n');
  writeFileSync(f.report, readFileSync(f.report, 'utf8').replace(/### Re-pin lần 1[^\n]*\n__PLACEHOLDER__/, section));
  assert.equal(run(f.report).code, 0, 'recheck đỏ oan trên dòng trống');
  assert.equal(runPm(f.root).code, 0, 'pre-merge đỏ oan trên dòng trống');
});

// ── Đời mới (repin-chay-lai-eval): khuôn có evals_exit — round-trip qua CẢ HAI reader ──
check('DV12e đời mới: khuôn điền evals_exit {E1:0} + evals.yaml có E1 → recheck + pre-merge clean', () => {
  const f = buildFromTemplate(null, { iso: TS_NEW, evals: { E1: 0 } }, { evalsYaml: evalsYamlWith(['E1']) });
  const r = run(f.report); assert.equal(r.code, 0, `khuôn đời mới không qua reader: ${r.err}`);
  const p = runPm(f.root); assert.equal(p.code, 0, `khuôn đời mới không qua pre-merge: ${p.out}`);
  assert.doesNotMatch(p.out, /suite-only/, 'khuôn đời mới bị xếp nhầm vào sử liệu');
});
check('DV12em đột biến khuôn đời mới (evals_exit → evals) → CẢ HAI reader ĐỎ đích danh (writer/reader không được trôi ở khoá mới)', () => {
  const f = buildFromTemplate(l => l.replace('"evals_exit"', '"evals"'), { iso: TS_NEW, evals: { E1: 0 } }, { evalsYaml: evalsYamlWith(['E1']) });
  const r = run(f.report); assert.equal(r.code, 1, 'reader nhận khoá lạ như đủ bộ');
  assert.match(r.err, /REPIN x re-pin lane "repin-rt-1" \(ts 2026-09-09T00:00:00Z\) backs verified_commit a{40} but recorded no evals_exit/);
  const p = runPm(f.root); assert.equal(p.code, 1);
  assert.match(p.out, /VIOLATION \[feat-repin\]: re-pin lane "repin-rt-1" .*recorded no evals_exit/);
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
