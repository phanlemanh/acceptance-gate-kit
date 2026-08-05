// DV7/DV8/DV9 — carry-plan.mjs: ma trận P1 VIẾT-TRƯỚC cho round fix (khuôn
// P105: số assert = số phần tử của lớp, không tuyên khống). Fixture code-sinh,
// đường dẫn suy từ vị trí test.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CP = path.join(HERE, '..', '..', 'feature-loop', 'scripts', 'carry-plan.mjs');
const SHA = 'd'.repeat(40);
let passed = 0, failed = 0;
const check = (n, f, detail = '') => {
  try {
    const ok = typeof f === 'function' ? (f(), true) : Boolean(f);
    if (!ok) throw new Error(detail || 'assertion false');
    passed++; console.log(`  PASS: ${n}`);
  } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); }
};

// mkFix: dựng workspace tạm — evals 4 cái phủ 4 nhánh + 1 cặp cross-layer.
function mkFix({ withSha = true, prevExit = {}, carriedFrom = {} } = {}) {
  const d = mkdtempSync(path.join(tmpdir(), 'carry-'));
  writeFileSync(path.join(d, 'contract.md'), [
    '---', 'slug: demo', 'risk_tier: T2', '---', '', '## Criteria', '',
    '- AC-1: Given a, When b, Then c.',
    '- AC-2: Given a, When b, Then c.',
    '- AC-3: (cross-layer) Given a, When b, Then qua backend.',
    '',
  ].join('\n'));
  writeFileSync(path.join(d, 'evals.yaml'), [
    'evals:',
    '  - id: E1', '    criterion: AC-1', '    executor: test', '    cmd: "pnpm test"', '    paths: ["src/a/**"]',
    '  - id: E2', '    criterion: AC-1', '    executor: test', '    cmd: "pnpm test"', '    paths: ["src/b/**"]',
    '  - id: E3', '    criterion: AC-2', '    executor: test', '    cmd: "pnpm test"',
    '  - id: E4', '    criterion: AC-3', '    executor: ui-check', '    cmd: "ui"', '    paths: ["ui/**"]',
    '  - id: E5', '    criterion: AC-3', '    executor: test', '    cmd: "api"', '    paths: ["api/**"]',
    '',
  ].join('\n'));
  const lines = ['E1', 'E2', 'E3', 'E4', 'E5'].map(id => JSON.stringify({
    ts: '2026-08-05T00:00:00Z', round: 1, evalId: id, run_id: `minted-demo-${id}-r1`,
    exit_code: prevExit[id] ?? 0, cmd: 'pnpm test',
    ...(withSha ? { sha: SHA } : {}),
    ...(carriedFrom[id] ? { carried_from_round: carriedFrom[id] } : {}),
  }));
  writeFileSync(path.join(d, 'run-log.jsonl'), lines.join('\n') + '\n');
  return d;
}

function run(d, delta, round = 2) {
  try {
    const out = execFileSync('node', [CP,
      '--run-log', path.join(d, 'run-log.jsonl'), '--evals', path.join(d, 'evals.yaml'),
      '--contract', path.join(d, 'contract.md'), '--delta-files', delta, '--round', String(round),
    ], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { code: 0, json: JSON.parse(out) };
  } catch (e) { return { code: e.status, err: String(e.stderr || '') }; }
}

console.log('DV7 ma trận carry 5 nhánh (AC-7)');
{
  // nhánh 1: paths không chạm + exit 0 → carried, giữ run_id gốc
  const d = mkFix();
  const r = run(d, 'src/b/x.js');
  check('DV7-1 không chạm diff + round trước xanh → carried {runId gốc, fromRound=1}', (() => {
    assert.equal(r.code, 0, r.err);
    const c = r.json.carriedEvals.find(x => x.id === 'E1');
    assert.ok(c, `E1 phải carried: ${JSON.stringify(r.json)}`);
    assert.equal(c.runId, 'minted-demo-E1-r1'); assert.equal(c.fromRound, 1);
    return true;
  })());
  check('DV7-2 paths CHẠM diff → rerun', r.json.rerun.includes('E2') && !r.json.carriedEvals.some(x => x.id === 'E2'));
  check('DV7-4 thiếu paths → rerun (mặc định an toàn)', r.json.rerun.includes('E3'));
  // nhánh 3: round trước đỏ → rerun
  const d3 = mkFix({ prevExit: { E1: 1 } });
  const r3 = run(d3, 'nowhere/z.js');
  check('DV7-3 round trước exit≠0 → rerun dù không chạm diff', r3.json.rerun.includes('E1') && !r3.json.carriedEvals.some(x => x.id === 'E1'));
  // nhánh 5: dòng carried round trước carry tiếp → fromRound giữ gốc
  const d5 = mkFix({ carriedFrom: { E1: 1 } });
  writeFileSync(path.join(d5, 'run-log.jsonl'),
    JSON.stringify({ ts: '2026-08-05T00:00:00Z', round: 1, evalId: 'E1', run_id: 'minted-demo-E1-r1', exit_code: 0, cmd: 'pnpm test', sha: SHA }) + '\n' +
    JSON.stringify({ ts: '2026-08-06T00:00:00Z', round: 2, evalId: 'E1', run_id: 'minted-demo-E1-r1', exit_code: 0, cmd: 'pnpm test', sha: SHA, carried_from_round: 1 }) + '\n' +
    ['E2', 'E3', 'E4', 'E5'].map(id => JSON.stringify({ ts: '2026-08-06T00:00:00Z', round: 2, evalId: id, run_id: `minted-demo-${id}-r2`, exit_code: 0, cmd: 'pnpm test', sha: SHA })).join('\n') + '\n');
  const r5 = run(d5, 'nowhere/z.js', 3);
  check('DV7-5 carry chuỗi: fromRound giữ 1, verifiedAt = ts dòng round GỐC', (() => {
    const c = r5.json.carriedEvals.find(x => x.id === 'E1');
    assert.ok(c, JSON.stringify(r5.json));
    assert.equal(c.fromRound, 1); assert.equal(c.verifiedAt, '2026-08-05T00:00:00Z');
    return true;
  })());
}

console.log('DV8 mặc định an toàn không-sha (AC-8)');
{
  const d = mkFix({ withSha: false });
  const r = run(d, 'nowhere/z.js');
  check('DV8 run-log không có sha → exit 3 (full re-run), không carry', r.code === 3, `code=${r.code}`);
  const d2 = mkFix({ withSha: true });
  const r2 = run(d2, 'nowhere/z.js');
  check('DV8+ đối chứng dương: CÙNG kịch bản có sha → exit 0 + có carried + anchorSha đúng',
    r2.code === 0 && r2.json.carriedEvals.length > 0 && r2.json.anchorSha === SHA, JSON.stringify(r2.json || r2.err));
}

console.log('DV9 atomic-pair cross-layer (AC-9)');
{
  const d = mkFix();
  const r = run(d, 'ui/screen.tsx'); // chạm E4 (ui) — E5 (api) không chạm nhưng phải rerun theo cặp
  check('DV9 một thành viên chạm → CẢ CẶP rerun', r.json.rerun.includes('E4') && r.json.rerun.includes('E5')
    && !r.json.carriedEvals.some(x => x.id === 'E5'), JSON.stringify(r.json));
  const r2 = run(d, 'nowhere/z.js');
  check('DV9+ đối chứng dương: cả cặp không chạm → cả cặp carried',
    r2.json.carriedEvals.some(x => x.id === 'E4') && r2.json.carriedEvals.some(x => x.id === 'E5'), JSON.stringify(r2.json));
}

console.log('DV9c parser cross-layer đồng bộ chuẩn (fix S4-r1: parser thứ hai lệch → atomic-pair tắt im lặng)');
{
  // bullet `*`, thụt lề, dấu `.`, tag Hoa-thường nằm ở DÒNG NỐI — parser chuẩn
  // (eval-coverage-lint parseACs) công nhận tất cả các hình dạng này.
  const d = mkFix();
  writeFileSync(path.join(d, 'contract.md'), [
    '---', 'slug: demo', '---', '', '## Criteria', '',
    '- AC-1: Given a, When b, Then c.',
    '- AC-2: Given a, When b, Then c.',
    '  * AC-3. Given a, When b, Then qua backend',
    '    (Cross-Layer) — bằng chứng hai lớp phải cùng round.',
    '',
  ].join('\n'));
  const r = run(d, 'ui/screen.tsx');
  check('DV9c tag hoa thường ở dòng nối + bullet * thụt lề → cặp VẪN bị ép chạy lại',
    r.json.rerun.includes('E4') && r.json.rerun.includes('E5') && !r.json.carriedEvals.some(x => x.id === 'E5'),
    JSON.stringify(r.json));
  const r2 = run(d, 'nowhere/z.js');
  check('DV9c+ đối chứng dương: không chạm → cả cặp vẫn carried',
    r2.json.carriedEvals.some(x => x.id === 'E4') && r2.json.carriedEvals.some(x => x.id === 'E5'), JSON.stringify(r2.json));
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
