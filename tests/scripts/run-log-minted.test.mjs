// Đối chứng HAI CHIỀU cho run-log-minted.mjs (AC-7, hồ sơ vu-trang-goal-luc-goi-ten):
// fixture CODE-SINH; assertion âm tính ghim ĐÚNG thông điệp; đối chứng dương cùng harness.
// S4-r1 sửa: bỏ giả định «mọi run_id đều minted-» và «một ts/vòng» — bên viết có nhánh
// verifier khai run_id và vòng chạy lại cùng round có nhiều ts; id đọc qua lib/eval-yaml.js.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const SCRIPT = path.join(HERE, 'run-log-minted.mjs');
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };
const die = m => { throw new Error(m); };

const EVALS = 'evals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: config:executors.test.scripts\n    expected: >\n      than block co dong\n      - id: E9\n      khong duoc quet\n  - id: E2\n    criterion: AC-2\n    executor: test\n    cmd: config:executors.test.hooks\n';
function ws(slug, log, extra = {}) {
  // --root phải là repo có lib/eval-yaml.js → dựng workspace trong bản sao lib của repo thật.
  const r = mkdtempSync(path.join(tmpdir(), 'rlm-'));
  mkdirSync(path.join(r, 'lib'), { recursive: true });
  writeFileSync(path.join(r, 'lib', 'eval-yaml.js'), `module.exports = require(${JSON.stringify(path.join(ROOT, 'lib', 'eval-yaml.js'))});`);
  mkdirSync(path.join(r, '_acceptance', slug), { recursive: true });
  writeFileSync(path.join(r, '_acceptance', slug, 'evals.yaml'), EVALS);
  if (log !== null) writeFileSync(path.join(r, '_acceptance', slug, 'run-log.jsonl'), log);
  for (const [f, t] of Object.entries(extra)) writeFileSync(path.join(r, '_acceptance', slug, f), t);
  return r;
}
const run = (r, slug, extra = []) => { const p = spawnSync('node', [SCRIPT, '--slug', slug, '--root', r, ...extra], { encoding: 'utf8' }); return { code: p.status, out: (p.stdout + p.stderr).trim() }; };
const line = o => JSON.stringify(Object.assign({ ts: '2026-09-03T05:00:00Z', sha: 'a'.repeat(40), round: 1, exit_code: 0, cmd: 'x' }, o));

check('duc: 2 eval (1 minted, 1 verifier khai) + 1 SUITE, cung sha -> exit 0', () => {
  const r = ws('s', [line({ evalId: 'E1', run_id: 'minted-s-E1-r1' }), line({ evalId: 'E2', run_id: 'run-7f3a' }), line({ evalId: 'SUITE-node_scripts_product_map', run_id: 'minted-s-SUITE-node_scripts_product_map-r1' })].join('\n') + '\n');
  const { code, out } = run(r, 's');
  if (code !== 0 || !/^AC-7 OK: 3 dong, vong r1, 1 lan goi/.test(out)) die(`code=${code} out=${out}`);
});
check('vang run-log -> exit 1 «chua co run-log — AC-7 CHUA do»', () => {
  const { code, out } = run(ws('s', null), 's');
  if (code !== 1 || !out.includes('chua co run-log — AC-7 CHUA do')) die(`code=${code} out=${out}`);
});
check('run_id RONG -> exit 1 «run_id rong: E1»', () => {
  const r = ws('s', [line({ evalId: 'E1', run_id: '' }), line({ evalId: 'E2', run_id: 'minted-s-E2-r1' })].join('\n') + '\n');
  const { code, out } = run(r, 's');
  if (code !== 1 || !out.includes('run_id rong: E1')) die(`code=${code} out=${out}`);
});
check('evalId E9 chi co trong THAN block expected -> exit 1 (bo doc dung chung, khong quet than)', () => {
  const r = ws('s', line({ evalId: 'E9', run_id: 'minted-s-E9-r1' }) + '\n');
  const { code, out } = run(r, 's');
  if (code !== 1 || !out.includes('run_id doi id ngoai evals.yaml: E9')) die(`code=${code} out=${out}`);
});
check('hai ts trong mot vong (workflow goi lai cung round) -> VAN exit 0, bao 2 lan goi', () => {
  const r = ws('s', [line({ evalId: 'E1', run_id: 'minted-s-E1-r1' }), line({ evalId: 'E2', run_id: 'minted-s-E2-r1', ts: '2026-09-03T05:00:09Z' })].join('\n') + '\n');
  const { code, out } = run(r, 's');
  if (code !== 0 || !out.includes('2 lan goi')) die(`code=${code} out=${out}`);
});
check('hai sha trong mot vong -> exit 1 «sha lech trong mot vong»', () => {
  const r = ws('s', [line({ evalId: 'E1', run_id: 'minted-s-E1-r1' }), line({ evalId: 'E2', run_id: 'minted-s-E2-r1', sha: 'b'.repeat(40) })].join('\n') + '\n');
  const { code, out } = run(r, 's');
  if (code !== 1 || !out.includes('sha lech trong mot vong')) die(`code=${code} out=${out}`);
});
check('chi xet VONG CUOI: vong 1 loi + vong 2 sach -> exit 0, vong r2', () => {
  const r = ws('s', [line({ evalId: 'E1', run_id: '' }), line({ evalId: 'E1', run_id: 'minted-s-E1-r2', round: 2 }), line({ evalId: 'E2', run_id: 'minted-s-E2-r2', round: 2 })].join('\n') + '\n');
  const { code, out } = run(r, 's');
  if (code !== 0 || !out.includes('vong r2')) die(`code=${code} out=${out}`);
});
check('--usage: thieu usage-report -> exit 1; co muc «S4 round 1» -> exit 0', () => {
  const log = [line({ evalId: 'E1', run_id: 'minted-s-E1-r1' })].join('\n') + '\n';
  const a = run(ws('s', log), 's', ['--usage']);
  if (a.code !== 1 || !a.out.includes('usage-report thieu muc S4 round 1')) die(`thieu: code=${a.code} out=${a.out}`);
  const b = run(ws('s', log, { 'usage-report.md': '## S4 round 1\n| model | agents |\n' }), 's', ['--usage']);
  if (b.code !== 0) die(`co: code=${b.code} out=${b.out}`);
});

console.log(`\nResults: ${passed} passed, ${failed} failed (run-log-minted)`);
process.exit(failed ? 1 : 0);
