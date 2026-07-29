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

// ---- CS2: hỏng từng phần — skip loud, nguồn lành nguyên vẹn ----
{
  const root = mkdtempSync(path.join(tmpdir(), 'cs2-'));
  const goodLedger = [ledgerLine('d-20260720T100000Z-10', 'fix'), ledgerLine('d-20260720T100001Z-11', 'fix')];
  mkWorkspace(root, 'ok-a', { ledger: goodLedger, probe: gapProbe('2026-07-21T09:00:00Z', 'findings', [row('P1', 'ok1')]) });
  const clean = run(['--root', root, '--slug', 'z', '--json']);
  check('CS2 đối chứng dương: fixture nguyên vẹn ra đủ claim 2 nguồn', () => {
    const ids = JSON.parse(clean.out).claims.map(c => c.id);
    assert.equal(clean.code, 0);
    assert.ok(ids.includes('d-20260720T100000Z-10') && ids.includes('ok-a#F1')); });
  // tiêm hỏng: 2 dòng JSONL rác + 1 probe lệch cột + 1 probe thiếu at
  mkWorkspace(root, 'bad-led', { ledger: ['{not-json', ...goodLedger.map(l => l.replace(/Z-1/g, 'Z-2')), '"trailing'] });
  const badTable = gapProbe('2026-07-21T09:30:00Z', 'findings', [row('P2', 'bt')]).replace('| m-bt |', '|'); // lệch cột
  mkWorkspace(root, 'bad-tbl', { probe: badTable });
  mkWorkspace(root, 'bad-at', { probe: gapProbe('X', 'findings', [row('P2', 'ba')]).replace(/^at: X\n/m, '') });
  const r = run(['--root', root, '--slug', 'z', '--json']);
  const ids = JSON.parse(r.out).claims.map(c => c.id);
  check('CS2 nguồn lành còn nguyên + exit 0', () => { assert.equal(r.code, 0);
    assert.ok(ids.includes('d-20260720T100000Z-10') && ids.includes('ok-a#F1')); });
  check('CS2 ghim thông điệp skip per-file', () => {
    assert.match(r.err, /claim-scan: skipped 2 malformed lines in .*bad-led.*decisions\.jsonl/);
    assert.match(r.err, /claim-scan: skipped .*bad-tbl.*gap-probe\.md \(malformed table\)/);
    assert.match(r.err, /claim-scan: skipped .*bad-at.*gap-probe\.md \(missing at\)/); });
  check('CS2 claim từ file hỏng không lọt', () =>
    assert.ok(!ids.includes('bad-tbl#F1') && !ids.includes('bad-at#F1')));
  rmSync(root, { recursive: true, force: true });
}

// ---- CS4: corpus rỗng OK · thiếu tham số nổ to ----
{
  const root = mkdtempSync(path.join(tmpdir(), 'cs4-'));
  const a = run(['--root', root, '--slug', 'z', '--json']);
  check('CS4a corpus rỗng: exit 0 + claims []', () =>
    { assert.equal(a.code, 0); assert.deepEqual(JSON.parse(a.out).claims, []); });
  const oldWs = mkWorkspace(root, 'old-ws', {});
  writeFileSync(path.join(oldWs, 'contract.md'), '---\nstatus: draft\n---\n');
  const b = run(['--root', root, '--slug', 'z', '--json']);
  check('CS4b workspace kiểu pre-1.14 (chỉ contract): exit 0, bỏ qua êm', () =>
    { assert.equal(b.code, 0); assert.deepEqual(JSON.parse(b.out).claims, []); });
  const c = run(['--root', path.join(root, 'khong-ton-tai'), '--slug', 'z']);
  check('CS4c root sai: exit 2 + thông điệp', () =>
    { assert.equal(c.code, 2); assert.match(c.err, /root not found/); });
  const d = run(['--root', root]);
  check('CS4d thiếu --slug: exit 2 + usage (KHÔNG giả dạng corpus rỗng)', () =>
    { assert.equal(d.code, 2); assert.match(d.err, /^usage: claim-scan --root <dir> --slug <slug>/); });
  rmSync(root, { recursive: true, force: true });
}

// ---- CS3: exclude-self có đối chứng dương ----
{
  const root = mkdtempSync(path.join(tmpdir(), 'cs3-'));
  mkWorkspace(root, 'self-x', { ledger: [ledgerLine('d-20260720T110000Z-30', 'fix')] });
  mkWorkspace(root, 'other-y', { ledger: [ledgerLine('d-20260720T110001Z-31', 'fix')] });
  const asX = JSON.parse(run(['--root', root, '--slug', 'self-x', '--json']).out).claims.map(c => c.id);
  const asZ = JSON.parse(run(['--root', root, '--slug', 'nobody', '--json']).out).claims.map(c => c.id);
  check('CS3 --slug self-x: claim của self-x VẮNG, của other-y có', () =>
    { assert.ok(!asX.includes('d-20260720T110000Z-30')); assert.ok(asX.includes('d-20260720T110001Z-31')); });
  check('CS3 đối chứng dương: --slug khác thì claim self-x CÓ mặt', () =>
    assert.ok(asZ.includes('d-20260720T110000Z-30')));
  rmSync(root, { recursive: true, force: true });
}

// ---- CS5: sort sev→recency, cap 10, truncate 250, không trùng id ----
{
  const root = mkdtempSync(path.join(tmpdir(), 'cs5-'));
  // 12 ledger claim at khác nhau + 2 finding P0/P1 → 14 ứng viên
  const led = Array.from({ length: 12 }, (_, i) =>
    ledgerLine(`d-20260701T0000${String(i).padStart(2, '0')}Z-5${i}`, 'fix',
      { at: `2026-07-0${(i % 9) + 1}T00:00:0${i % 10}Z`, decision: 'x'.repeat(300) }));
  mkWorkspace(root, 'many', { ledger: led });
  mkWorkspace(root, 'sev', { probe: gapProbe('2026-07-28T00:00:00Z', 'findings',
    [row('P0', 's0'), row('P1', 's1')]) });
  const claims = JSON.parse(run(['--root', root, '--slug', 'z', '--json']).out).claims;
  check('CS5 cap đúng 10 (ứng viên 14 — claim 11+ bị suppress)', () => assert.equal(claims.length, 10));
  check('CS5 sort: P0 rồi P1 đứng đầu, phần còn lại recency giảm dần', () => {
    assert.equal(claims[0].id, 'sev#F1'); assert.equal(claims[1].id, 'sev#F2');
    const rest = claims.slice(2).map(c => c.at);
    assert.deepEqual(rest, [...rest].sort().reverse()); });
  check('CS5 truncate 250 + "…" và không id trùng', () => {
    const long = claims.find(c => c.claim.startsWith('xxx'));
    assert.equal(long.claim.length, 251); assert.ok(long.claim.endsWith('…'));
    assert.equal(new Set(claims.map(c => c.id)).size, claims.length); });
  rmSync(root, { recursive: true, force: true });
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
