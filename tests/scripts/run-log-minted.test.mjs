// Đối chứng HAI CHIỀU cho run-log-minted.mjs (AC-7, hồ sơ vu-trang-goal-luc-goi-ten):
// fixture CODE-SINH trong chính lần chạy; mọi assertion âm tính ghim ĐÚNG thông điệp
// và đi kèm đối chứng dương cùng harness.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT = path.join(HERE, 'run-log-minted.mjs');
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };
const die = m => { throw new Error(m); };

const EVALS = 'evals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: config:executors.test.scripts\n  - id: E2\n    criterion: AC-2\n    executor: test\n    cmd: config:executors.test.hooks\n';
function ws(slug, log, evals = EVALS) {
  const r = mkdtempSync(path.join(tmpdir(), 'rlm-'));
  mkdirSync(path.join(r, '_acceptance', slug), { recursive: true });
  writeFileSync(path.join(r, '_acceptance', slug, 'evals.yaml'), evals);
  if (log !== null) writeFileSync(path.join(r, '_acceptance', slug, 'run-log.jsonl'), log);
  return r;
}
const run = (r, slug) => { const p = spawnSync('node', [SCRIPT, '--slug', slug, '--root', r], { encoding: 'utf8' }); return { code: p.status, out: (p.stdout + p.stderr).trim() }; };
const line = o => JSON.stringify(Object.assign({ ts: '2026-09-03T05:00:00Z', sha: 'a'.repeat(40), round: 1, exit_code: 0, cmd: 'x' }, o));

// Đối chứng DƯƠNG trước: run-log đúng hình dạng workflow đúc → xanh.
check('duc: 2 eval + 1 SUITE, cung ts -> exit 0, thong diep OK', () => {
  const r = ws('s', [line({ evalId: 'E1', run_id: 'minted-s-E1-r1' }), line({ evalId: 'E2', run_id: 'minted-s-E2-r1' }), line({ evalId: 'SUITE-node_scripts_product_map', run_id: 'minted-s-SUITE-node_scripts_product_map-r1' })].join('\n') + '\n');
  const { code, out } = run(r, 's');
  if (code !== 0 || !/^AC-7 OK: 3 dong, vong r1, 1 ts/.test(out)) die(`code=${code} out=${out}`);
});
check('vang run-log -> exit 1 «chua co run-log — AC-7 CHUA do»', () => {
  const { code, out } = run(ws('s', null), 's');
  if (code !== 1 || !out.includes('chua co run-log — AC-7 CHUA do')) die(`code=${code} out=${out}`);
});
check('run-log TAY (lmcms-E1-r1) -> exit 1 «run_id khong do workflow duc»', () => {
  const r = ws('s', [line({ evalId: 'E1', run_id: 'lmcms-E1-r1' }), line({ evalId: 'E2', run_id: 'minted-s-E2-r1' })].join('\n') + '\n');
  const { code, out } = run(r, 's');
  if (code !== 1 || !out.includes('run_id khong do workflow duc: lmcms-E1-r1')) die(`code=${code} out=${out}`);
});
check('hai ts trong mot vong -> exit 1 «hai ts trong mot vong»', () => {
  const r = ws('s', [line({ evalId: 'E1', run_id: 'minted-s-E1-r1' }), line({ evalId: 'E2', run_id: 'minted-s-E2-r1', ts: '2026-09-03T05:00:09Z' })].join('\n') + '\n');
  const { code, out } = run(r, 's');
  if (code !== 1 || !out.includes('hai ts trong mot vong')) die(`code=${code} out=${out}`);
});
check('chi xet VONG CUOI: vong 1 tay + vong 2 duc -> exit 0', () => {
  const r = ws('s', [line({ evalId: 'E1', run_id: 'lmcms-E1-r1' }), line({ evalId: 'E1', run_id: 'minted-s-E1-r2', round: 2, ts: '2026-09-03T06:00:00Z' }), line({ evalId: 'E2', run_id: 'minted-s-E2-r2', round: 2, ts: '2026-09-03T06:00:00Z' })].join('\n') + '\n');
  const { code, out } = run(r, 's');
  if (code !== 0 || !out.includes('vong r2')) die(`code=${code} out=${out}`);
});
check('id ngoai evals.yaml (E9) du dang minted -> exit 1 (tap id rut tu evals, khong tin tien to)', () => {
  const r = ws('s', line({ evalId: 'E9', run_id: 'minted-s-E9-r1' }) + '\n');
  const { code, out } = run(r, 's');
  if (code !== 1 || !out.includes('run_id khong do workflow duc: minted-s-E9-r1')) die(`code=${code} out=${out}`);
});

console.log(`\nResults: ${passed} passed, ${failed} failed (run-log-minted)`);
process.exit(failed ? 1 : 0);
