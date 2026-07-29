// Tests for feature-loop/scripts/claim-scan.mjs — fixture SINH BẰNG CODE,
// assertion âm tính luôn có đối chứng dương + ghim thông điệp (CLAUDE.md).
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SCAN = path.join(HERE, '..', '..', 'feature-loop', 'scripts', 'claim-scan.mjs');
let passed = 0, failed = 0;
function check(name, fn) {
  try { fn(); passed++; console.log(`  PASS: ${name}`); }
  catch (e) { failed++; console.log(`  FAIL: ${name}\n    ${e.message}`); }
}
function run(args, opts = {}) {
  const r = spawnSync('node', [SCAN, ...args], { encoding: 'utf8', ...opts });
  return { code: r.status, out: r.stdout, err: r.stderr };
}
// Fixture builder — code sinh, không chép tay.
function ledgerLine(id, type, extra = {}) {
  return JSON.stringify({ id, type, stage: 'S4-r1', at: '2026-07-20T10:00:00Z',
    decision: `decision-${id}`, impact: `impact-${id}`, ...extra });
}
function gapProbe(at, verdict, rows) {
  const table = ['| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |',
    '|---|---|---|---|---|---|',
    ...rows.map(r => `| ${r.sev} | ${r.artifact} | ${r.gap} | ${r.fail} | ${r.measure} | ${r.disp} |`)].join('\n');
  return `---\nslug: x\nat: ${at}\nverdict: ${verdict}\np0: 0\np1: 1\np2: 0\n---\n\n# Gap-probe\n\n## Findings\n\n${table}\n`;
}
function mkWorkspace(root, slug, { ledger = [], probe = null } = {}) {
  const d = path.join(root, '_acceptance', slug);
  mkdirSync(d, { recursive: true });
  if (ledger.length) writeFileSync(path.join(d, 'decisions.jsonl'), ledger.join('\n') + '\n');
  if (probe) writeFileSync(path.join(d, 'gap-probe.md'), probe);
  return d;
}
const row = (sev, tag) => ({ sev, artifact: 'evals', gap: `gap-${tag}`, fail: `fail-${tag}`, measure: `m-${tag}`, disp: `fixed: ${tag}` });

// ---- CS1: đúng nguồn, đúng loại — kèm đối chứng vắng-mặt ĐƯỢC DỰNG ----
{
  const root = mkdtempSync(path.join(tmpdir(), 'cs1-'));
  mkWorkspace(root, 'feat-a', {
    ledger: [ledgerLine('d-20260720T100000Z-1', 'fix'),
             ledgerLine('d-20260720T100001Z-2', 'descope'),
             ledgerLine('d-20260720T100002Z-3', 'approach'),
             JSON.stringify({ id: 'd-20260720T100003Z-4', type: 'seal', gate: 1, at: '2026-07-20T10:00:03Z' })],
    probe: gapProbe('2026-07-21T10:00:00Z', 'findings', [row('P1', 'af1')]),
  });
  mkWorkspace(root, 'feat-b', { probe: gapProbe('2026-07-22T10:00:00Z', 'clean', [row('P2', 'bf1')]) });
  mkWorkspace(root, 'feat-c', { probe: gapProbe('2026-07-23T10:00:00Z', 'probe-failed', [row('P0', 'cf1')]) });
  const r = run(['--root', root, '--slug', 'brand-new', '--json']);
  const claims = JSON.parse(r.out).claims;
  const ids = claims.map(c => c.id);
  check('CS1 exit 0 + đủ 2 nguồn', () => { assert.equal(r.code, 0);
    assert.ok(ids.includes('d-20260720T100000Z-1')); assert.ok(ids.includes('d-20260720T100001Z-2'));
    assert.ok(ids.includes('feat-a#F1')); });
  check('CS1 đối chứng âm THEO ID: approach/seal vắng', () =>
    { assert.ok(!ids.includes('d-20260720T100002Z-3')); assert.ok(!ids.includes('d-20260720T100003Z-4')); });
  check('CS1 clean/probe-failed CÓ bảng vẫn vắng (đối chứng dương: cùng khuôn ở findings thì có)', () =>
    { assert.ok(!ids.includes('feat-b#F1')); assert.ok(!ids.includes('feat-c#F1')); assert.ok(ids.includes('feat-a#F1')); });
  rmSync(root, { recursive: true, force: true });
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
