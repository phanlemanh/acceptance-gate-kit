// Đối chứng HAI CHIỀU cho run-log-minted.mjs (AC-7, hồ sơ vu-trang-goal-luc-goi-ten).
// Fixture run-log CODE-SINH theo hợp đồng bên viết acceptance-verify.js (dòng eval · dòng
// vang-mat · dòng memo baseline/round-tally); ca --usage DƯƠNG dùng CHÍNH usage-report.md do
// wf-usage.mjs sinh cho hồ sơ này (round-trip từ writer thật, S4-r2), ca ÂM là chuỗi gõ tay
// «S4 round 1» không có heading bên viết. Mọi assertion âm tính ghim ĐÚNG thông điệp.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
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
const memo = o => JSON.stringify(Object.assign({ ts: '2026-09-03T05:00:00Z', sha: 'a'.repeat(40), round: 1 }, o));
const FULL = [line({ evalId: 'E1', run_id: 'minted-s-E1-r1' }), line({ evalId: 'E2', run_id: 'run-7f3a' }), line({ evalId: 'SUITE-node_scripts_product_map', run_id: 'minted-s-SUITE-node_scripts_product_map-r1' }), memo({ kind: 'baseline', evals_hash: 'x' }), memo({ kind: 'round-tally', verdict: 'PASS' })].join('\n') + '\n';

check('duc: du 2 eval (1 minted, 1 verifier khai) + SUITE + memo -> exit 0', () => {
  const { code, out } = run(ws('s', FULL), 's');
  if (code !== 0 || !/^AC-7 OK: 3 dong, vong r1, 1 lan goi/.test(out)) die(`code=${code} out=${out}`);
});
check('vang run-log -> exit 1 «chua co run-log — AC-7 CHUA do»', () => {
  const { code, out } = run(ws('s', null), 's');
  if (code !== 1 || !out.includes('chua co run-log — AC-7 CHUA do')) die(`code=${code} out=${out}`);
});
check('eval THIEU dong (E1 khong co dong nao vong cuoi) -> exit 1 «thieu dong eval: E1»', () => {
  const { code, out } = run(ws('s', line({ evalId: 'E2', run_id: 'minted-s-E2-r1' }) + '\n'), 's');
  if (code !== 1 || !out.includes('thieu dong eval: E1')) die(`code=${code} out=${out}`);
});
check('dong vang-mat cua ben viet (agent chet, khong run_id) -> exit 1 «run_id rong: E1 (vang-mat)»', () => {
  const r = ws('s', [JSON.stringify({ ts: '2026-09-03T05:00:00Z', sha: 'a'.repeat(40), round: 1, evalId: 'E1', kind: 'vang-mat', reason: 'agent bi skip' }), line({ evalId: 'E2', run_id: 'minted-s-E2-r1' })].join('\n') + '\n');
  const { code, out } = run(r, 's');
  if (code !== 1 || !out.includes('run_id rong: E1 (vang-mat)')) die(`code=${code} out=${out}`);
});
check('dong run-log HONG JSON (bi cat) -> exit 1 «dong run-log hong JSON: 1»', () => {
  const r = ws('s', ['{"ts":"2026-09-03T05:00:00Z","round":1,"evalId":"E1","run_id":"minted-s-E1-r1"', line({ evalId: 'E2', run_id: 'minted-s-E2-r1' })].join('\n') + '\n');
  const { code, out } = run(r, 's');
  if (code !== 1 || !out.includes('dong run-log hong JSON: 1')) die(`code=${code} out=${out}`);
});
check('hai dong cho mot eval trong vong cuoi -> exit 1 «hai dong cho mot eval: E1»', () => {
  const r = ws('s', [line({ evalId: 'E1', run_id: 'minted-s-E1-r1' }), line({ evalId: 'E1', run_id: 'minted-s-E1-r1' }), line({ evalId: 'E2', run_id: 'minted-s-E2-r1' })].join('\n') + '\n');
  const { code, out } = run(r, 's');
  if (code !== 1 || !out.includes('hai dong cho mot eval: E1')) die(`code=${code} out=${out}`);
});
check('evalId E9 chi co trong THAN block expected -> exit 1 (bo doc dung chung, khong quet than)', () => {
  const r = ws('s', [line({ evalId: 'E1', run_id: 'minted-s-E1-r1' }), line({ evalId: 'E2', run_id: 'minted-s-E2-r1' }), line({ evalId: 'E9', run_id: 'minted-s-E9-r1' })].join('\n') + '\n');
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
check('ben viet KHONG ghi sha (invokedSha vang) -> exit 0, bao «sha (ben viet khong ghi)»', () => {
  const noSha = o => { const x = JSON.parse(line(o)); delete x.sha; return JSON.stringify(x); };
  const r = ws('s', [noSha({ evalId: 'E1', run_id: 'minted-s-E1-r1' }), noSha({ evalId: 'E2', run_id: 'minted-s-E2-r1' })].join('\n') + '\n');
  const { code, out } = run(r, 's');
  if (code !== 0 || !out.includes('sha (ben viet khong ghi)')) die(`code=${code} out=${out}`);
});
check('chi xet VONG CUOI: vong 1 thieu + vong 2 du -> exit 0, vong r2', () => {
  const r = ws('s', [line({ evalId: 'E2', run_id: 'minted-s-E2-r1' }), line({ evalId: 'E1', run_id: 'minted-s-E1-r2', round: 2 }), line({ evalId: 'E2', run_id: 'minted-s-E2-r2', round: 2 })].join('\n') + '\n');
  const { code, out } = run(r, 's');
  if (code !== 0 || !out.includes('vong r2')) die(`code=${code} out=${out}`);
});
check('--usage AM: chuoi «S4 round 1» go tay khong co heading ben viet -> exit 1', () => {
  const a = run(ws('s', FULL, { 'usage-report.md': 'S4 round 1 — ghi tay, khong heading\n' }), 's', ['--usage']);
  if (a.code !== 1 || !a.out.includes('usage-report thieu muc S4 round 1 do wf-usage sinh')) die(`code=${a.code} out=${a.out}`);
});
check('--usage DUONG: usage-report THAT do wf-usage.mjs sinh (ho so vu-trang-goal-luc-goi-ten) -> exit 0', () => {
  // Round-trip từ writer thật: file này do `wf-usage.mjs <transcriptDir> --md --title "S4 round 2 …"` sinh.
  const real = path.join(ROOT, '_acceptance', 'vu-trang-goal-luc-goi-ten', 'usage-report.md');
  if (!existsSync(real)) die('thieu usage-report that cua ho so — khong co round-trip');
  const u = readFileSync(real, 'utf8');
  if (!/^### [^\n]*S4 round 2\b/m.test(u)) die('usage-report that khong co muc S4 round 2 — fixture chet');
  const log = [line({ evalId: 'E1', run_id: 'minted-s-E1-r2', round: 2 }), line({ evalId: 'E2', run_id: 'minted-s-E2-r2', round: 2 })].join('\n') + '\n';
  const b = run(ws('s', log, { 'usage-report.md': u }), 's', ['--usage']);
  if (b.code !== 0) die(`code=${b.code} out=${b.out}`);
});

console.log(`\nResults: ${passed} passed, ${failed} failed (run-log-minted)`);
process.exit(failed ? 1 : 0);
