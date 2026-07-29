// Tests for feature-loop/scripts/claim-scan.mjs — fixture SINH BẰNG CODE,
// assertion âm tính luôn có đối chứng dương + ghim thông điệp (CLAUDE.md).
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
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
  // + 1 probe TRỘN hàng hỏng/lành (fix S4-r1: giữ hàng lành, id theo hàng VẬT LÝ)
  mkWorkspace(root, 'bad-led', { ledger: ['{not-json', ...goodLedger.map(l => l.replace(/Z-1/g, 'Z-2')), '"trailing'] });
  const badTable = gapProbe('2026-07-21T09:30:00Z', 'findings', [row('P2', 'bt')]).replace('| m-bt |', '|'); // lệch cột
  mkWorkspace(root, 'bad-tbl', { probe: badTable });
  mkWorkspace(root, 'bad-at', { probe: gapProbe('X', 'findings', [row('P2', 'ba')]).replace(/^at: X\n/m, '') });
  const mixTable = gapProbe('2026-07-21T09:45:00Z', 'findings', [row('P1', 'mx1'), row('P2', 'mx2')])
    .replace('| m-mx1 |', '|'); // hàng 1 lệch cột, hàng 2 lành
  mkWorkspace(root, 'mix', { probe: mixTable });
  const r = run(['--root', root, '--slug', 'z', '--json']);
  const ids = JSON.parse(r.out).claims.map(c => c.id);
  check('CS2 nguồn lành còn nguyên + exit 0', () => { assert.equal(r.code, 0);
    assert.ok(ids.includes('d-20260720T100000Z-10') && ids.includes('ok-a#F1')); });
  check('CS2 ghim thông điệp skip per-file/per-row', () => {
    assert.match(r.err, /claim-scan: skipped 2 malformed lines in .*bad-led.*decisions\.jsonl/);
    assert.match(r.err, /claim-scan: skipped 1 malformed rows in .*bad-tbl.*gap-probe\.md/);
    assert.match(r.err, /claim-scan: skipped .*bad-at.*gap-probe\.md \(missing at\)/);
    assert.match(r.err, /claim-scan: skipped 1 malformed rows in .*mix.*gap-probe\.md/); });
  check('CS2 hàng hỏng không lọt, hàng lành trong bảng trộn GIỮ id theo hàng vật lý (#F2, không phải #F1)', () => {
    assert.ok(!ids.includes('bad-tbl#F1') && !ids.includes('bad-at#F1'));
    assert.ok(!ids.includes('mix#F1'), 'hàng hỏng vật lý số 1 không được emit');
    assert.ok(ids.includes('mix#F2'), 'hàng lành phải giữ số hàng thật để cite đúng'); });
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
  // CS4e (fix S4-r1 isMain): script nằm ở path CÓ KHOẢNG TRẮNG vẫn là CLI thật
  {
    const spaceDir = path.join(root, 'dir with space');
    mkdirSync(spaceDir, { recursive: true });
    const scanCopy = path.join(spaceDir, 'claim-scan.mjs');
    writeFileSync(scanCopy, readFileSync(SCAN));
    const bad = spawnSync('node', [scanCopy, '--root', path.join(root, 'khong-ton-tai'), '--slug', 'z'], { encoding: 'utf8' });
    check('CS4e path có khoảng trắng: root sai vẫn NỔ exit 2 (không no-op exit 0)', () =>
      { assert.equal(bad.status, 2); assert.match(bad.stderr, /root not found/); });
    const good = spawnSync('node', [scanCopy, '--root', root, '--slug', 'z', '--json'], { encoding: 'utf8' });
    check('CS4e đối chứng dương: cùng path đó, corpus hợp lệ chạy bình thường', () =>
      { assert.equal(good.status, 0); assert.ok(JSON.parse(good.stdout).claims !== undefined); });
  }
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

// ---- CS5b: sàn đa dạng nguồn — sev không được đuổi sạch ledger khỏi cap ----
{
  const root = mkdtempSync(path.join(tmpdir(), 'cs5b-'));
  // 12 finding CÓ sev + 4 ledger KHÔNG sev → top-10 thuần sev sẽ 0 ledger
  mkWorkspace(root, 'f1', { probe: gapProbe('2026-07-28T00:00:00Z', 'findings',
    Array.from({ length: 6 }, (_, i) => row('P1', `f1-${i}`))) });
  mkWorkspace(root, 'f2', { probe: gapProbe('2026-07-27T00:00:00Z', 'findings',
    Array.from({ length: 6 }, (_, i) => row('P2', `f2-${i}`))) });
  mkWorkspace(root, 'led', { ledger: Array.from({ length: 4 }, (_, i) =>
    ledgerLine(`d-20260726T00000${i}Z-8${i}`, 'fix', { at: `2026-07-26T00:00:0${i}Z` })) });
  const claims = JSON.parse(run(['--root', root, '--slug', 'z', '--json']).out).claims;
  const bySrc = (s) => claims.filter(c => c.source === s).length;
  check('CS5b cap 10 vẫn giữ ≥3 ledger + ≥3 gap-probe (đối chứng: ledger sev-null lẽ ra bị đuổi hết)', () => {
    assert.equal(claims.length, 10);
    assert.ok(bySrc('ledger') >= 3, `ledger được ${bySrc('ledger')}`);
    assert.ok(bySrc('gap-probe') >= 3, `gap-probe được ${bySrc('gap-probe')}`); });
  rmSync(root, { recursive: true, force: true });
}

// ---- CS5c (fix S4-r2): entry thiếu `at` xếp CUỐI nhóm cùng sev, không phải đầu ----
{
  const root = mkdtempSync(path.join(tmpdir(), 'cs5c-'));
  const noAt = JSON.parse(ledgerLine('d-20260720T140000Z-90', 'fix')); delete noAt.at;
  mkWorkspace(root, 'atnull', { ledger: [
    JSON.stringify(noAt),
    ledgerLine('d-20260720T140001Z-91', 'fix', { at: '2026-07-28T00:00:00Z' }),
    ledgerLine('d-20260720T140002Z-92', 'fix', { at: '2026-07-27T00:00:00Z' })] });
  const ids = JSON.parse(run(['--root', root, '--slug', 'z', '--json']).out).claims.map(c => c.id);
  check('CS5c at-null không chiếm chỗ đầu (String(null)="null" từng thắng mọi ISO date)', () => {
    assert.deepEqual(ids, ['d-20260720T140001Z-91', 'd-20260720T140002Z-92', 'd-20260720T140000Z-90']); });
  rmSync(root, { recursive: true, force: true });
}

// ---- CS6: schema 10 trường + id đúng khuôn regex đo lường ----
{
  const root = mkdtempSync(path.join(tmpdir(), 'cs6-'));
  mkWorkspace(root, 'sch', { ledger: [ledgerLine('d-20260720T120000Z-60', 'fix', { serves: ['AC-4'] })],
    probe: gapProbe('2026-07-25T00:00:00Z', 'findings', [row('P1', 'sc')]) });
  const claims = JSON.parse(run(['--root', root, '--slug', 'z', '--json']).out).claims;
  const ID_RE = /^(d-[0-9TZ]+-[0-9]+|[a-z0-9-]+#F[0-9]+)$/;
  check('CS6 đủ 10 trường mọi claim', () => claims.forEach(c =>
    ['id','source','slug','kind','stage','sev','at','claim','lesson','pointer']
      .forEach(k => assert.ok(k in c, `${c.id} thiếu ${k}`))));
  check('CS6 id khớp regex đo lường + serves giữ nguyên', () => {
    claims.forEach(c => assert.match(c.id, ID_RE));
    assert.deepEqual(claims.find(c => c.id === 'd-20260720T120000Z-60').serves, ['AC-4']); });
  check('CS6 meta: regex còn sống — id sai khuôn phải trượt regex', () =>
    assert.doesNotMatch('D-XYZ#bogus', ID_RE));
  rmSync(root, { recursive: true, force: true });
}

// ---- CS10: KHÔNG đọc nguồn V2 (poison marker) — đối chứng dương ở ledger ----
{
  const root = mkdtempSync(path.join(tmpdir(), 'cs10-'));
  const POISON = 'POISON-MARKER-9f3a';
  const d = mkWorkspace(root, 'v2src', { ledger: [ledgerLine('d-20260720T130000Z-70', 'fix', { decision: `has ${POISON}` })] });
  writeFileSync(path.join(d, 'review-findings.md'), `# RF\n- ${POISON}-rf\n`);
  writeFileSync(path.join(d, 'run-log.jsonl'), JSON.stringify({ evalId: `${POISON}-rl` }) + '\n');
  const r = run(['--root', root, '--slug', 'z', '--json']);
  check('CS10 marker trong review-findings/run-log VẮNG; trong ledger CÓ (đối chứng dương)', () => {
    assert.ok(!r.out.includes(`${POISON}-rf`) && !r.out.includes(`${POISON}-rl`));
    assert.ok(r.out.includes(`has ${POISON}`)); });
  check('CS10 markdown mode: bullet mang [id] để cite', () => {
    const md = run(['--root', root, '--slug', 'z']);
    assert.match(md.out, /^## Bài học từ feature trước \(advisory\)/m);
    assert.match(md.out, /- \[d-20260720T130000Z-70\] \(v2src/); });
  rmSync(root, { recursive: true, force: true });
}

// ---- CS9: smoke trên corpus thật của repo (assert khoảng, không ghim số) ----
{
  const repoRoot = path.join(HERE, '..', '..');
  const t0 = Date.now();
  const r = run(['--root', repoRoot, '--slug', 'cross-feature-claim-index', '--json']);
  const dt = Date.now() - t0;
  check('CS9 corpus thật: exit 0, 1..10 claim, có id d-… và id #F, <5s', () => {
    assert.equal(r.code, 0);
    const ids = JSON.parse(r.out).claims.map(c => c.id);
    assert.ok(ids.length >= 1 && ids.length <= 10, `được ${ids.length}`);
    assert.ok(ids.some(i => i.startsWith('d-')), 'thiếu id ledger');
    assert.ok(ids.some(i => /#F\d+$/.test(i)), 'thiếu id gap-probe');
    assert.ok(dt < 5000, `${dt}ms`); });
}

// ==== PH — parser hardening (claim-scan-parser-hardening) ====

// ---- PH1: bảng SAU section Findings không được thành claim ma ----
{
  const root = mkdtempSync(path.join(tmpdir(), 'ph1-'));
  const tail = `\n## Notes\n\n| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |\n|---|---|---|---|---|---|\n| P0 | evals | ghost-gap | ghost-fail | ghost-m | ghost-disp |\n`;
  const base = gapProbe('2026-07-25T00:00:00Z', 'findings', [row('P1', 'real')]);
  mkWorkspace(root, 'with-tail', { probe: base + tail });
  mkWorkspace(root, 'no-tail', { probe: base });
  const a = run(['--root', root, '--slug', 'zz', '--json']);
  const withTail = JSON.parse(a.out).claims.filter(c => c.slug === 'with-tail');
  const noTail = JSON.parse(a.out).claims.filter(c => c.slug === 'no-tail');
  check('PH1 section sau Findings sinh ZERO claim — dãy id giống hệt đối chứng dương không-đuôi', () => {
    assert.equal(a.code, 0);
    assert.deepEqual(withTail.map(c => c.id.split('#')[1]), noTail.map(c => c.id.split('#')[1]));
    assert.equal(withTail.length, 1); assert.equal(withTail[0].id, 'with-tail#F1');
    assert.ok(!a.out.includes('ghost-gap'), 'claim ma từ bảng đuôi lọt vào output'); });
  rmSync(root, { recursive: true, force: true });
}

// ---- PH2: id vắng/sai khuôn nổ to, không biến mất câm ----
{
  const root = mkdtempSync(path.join(tmpdir(), 'ph2-'));
  mkWorkspace(root, 'badid', { ledger: [
    JSON.stringify({ type: 'fix', stage: 'S1', at: '2026-07-20T10:00:00Z', decision: 'no-id-entry', impact: 'x' }),
    ledgerLine('BAD ID', 'fix'),
    ledgerLine('d-20260720T100000Z-90', 'fix')] });
  const r = run(['--root', root, '--slug', 'zz', '--json']);
  const ids = JSON.parse(r.out).claims.map(c => c.id);
  check('PH2 entry chuẩn còn (đối chứng dương), id hỏng vắng, warn đếm 2, exit 0', () => {
    assert.equal(r.code, 0);
    assert.deepEqual(ids, ['d-20260720T100000Z-90']);
    assert.match(r.err, /claim-scan: dropped 2 claims with invalid id in badid/); });
  rmSync(root, { recursive: true, force: true });
}

// ---- PH3: id trùng — khác slug CẢNH, cùng slug IM, corpus sạch IM ----
{
  const root = mkdtempSync(path.join(tmpdir(), 'ph3-'));
  const DUP = 'd-20260720T110000Z-77';
  mkWorkspace(root, 'slug-a', { ledger: [ledgerLine(DUP, 'fix')] });
  mkWorkspace(root, 'slug-b', { ledger: [ledgerLine(DUP, 'descope')] });
  const a = run(['--root', root, '--slug', 'zz', '--json']);
  check('PH3a khác slug: giữ claim gặp trước + warn duplicate + exit 0', () => {
    assert.equal(a.code, 0);
    const dups = JSON.parse(a.out).claims.filter(c => c.id === DUP);
    assert.equal(dups.length, 1); assert.equal(dups[0].slug, 'slug-a');
    assert.match(a.err, new RegExp(`claim-scan: duplicate id ${DUP} across features \\(kept first\\)`)); });
  const root2 = mkdtempSync(path.join(tmpdir(), 'ph3b-'));
  mkWorkspace(root2, 'clean-a', { ledger: [ledgerLine('d-20260720T110001Z-78', 'fix')] });
  const b = run(['--root', root2, '--slug', 'zz', '--json']);
  check('PH3b corpus sạch: KHÔNG dòng duplicate (đối chứng âm)', () =>
    assert.ok(!b.err.includes('duplicate id')));
  const root3 = mkdtempSync(path.join(tmpdir(), 'ph3c-'));
  mkWorkspace(root3, 'same', { ledger: [ledgerLine(DUP, 'fix'), ledgerLine(DUP, 'descope')] });
  const c = run(['--root', root3, '--slug', 'zz', '--json']);
  check('PH3c trùng trong CÙNG slug: dedupe im lặng chủ đích — không warn', () => {
    assert.equal(JSON.parse(c.out).claims.filter(x => x.id === DUP).length, 1);
    assert.ok(!c.err.includes('duplicate id')); });
  for (const d of [root, root2, root3]) rmSync(d, { recursive: true, force: true });
}

// ---- PH4: frontmatter không đọc được ≠ clean hợp lệ ----
{
  const root = mkdtempSync(path.join(tmpdir(), 'ph4-'));
  const good = gapProbe('2026-07-25T00:00:00Z', 'findings', [row('P1', 'g')]);
  mkWorkspace(root, 'no-fm', { probe: good.replace(/^---\n/, '') });          // mất --- mở
  mkWorkspace(root, 'no-verdict', { probe: good.replace(/^verdict: findings\n/m, '') }); // thiếu key verdict
  mkWorkspace(root, 'is-clean', { probe: gapProbe('2026-07-25T00:00:00Z', 'clean', [row('P2', 'c')]) });
  const r = run(['--root', root, '--slug', 'zz', '--json']);
  check('PH4 unreadable frontmatter nổ to (cả 2 kiểu), exit 0', () => {
    assert.equal(r.code, 0);
    assert.match(r.err, /claim-scan: skipped .*no-fm.*gap-probe\.md \(unreadable frontmatter\)/);
    assert.match(r.err, /claim-scan: skipped .*no-verdict.*gap-probe\.md \(unreadable frontmatter\)/); });
  check('PH4 đối chứng: verdict clean hợp lệ bỏ qua IM LẶNG — phân biệt được', () =>
    assert.ok(!r.err.includes('is-clean')));
  rmSync(root, { recursive: true, force: true });
}

// ---- PH5: entry thiếu decision/impact — không emit rỗng, đếm vào malformed ----
{
  const root = mkdtempSync(path.join(tmpdir(), 'ph5-'));
  mkWorkspace(root, 'hollow', { ledger: [
    JSON.stringify({ id: 'd-20260720T120000Z-95', type: 'fix', stage: 'S1', at: '2026-07-20T12:00:00Z', impact: 'only-impact' }),
    JSON.stringify({ id: 'd-20260720T120001Z-96', type: 'fix', stage: 'S1', at: '2026-07-20T12:00:01Z', decision: 'only-decision' }),
    ledgerLine('d-20260720T120002Z-97', 'fix')] });
  const r = run(['--root', root, '--slug', 'zz', '--json']);
  const claims = JSON.parse(r.out).claims;
  check('PH5 entry rỗng ruột không emit, đếm vào malformed, entry đủ vẫn ra (đối chứng dương), exit 0', () => {
    assert.equal(r.code, 0);
    assert.deepEqual(claims.map(c => c.id), ['d-20260720T120002Z-97']);
    assert.ok(claims.every(c => c.claim.length > 0 && c.lesson.length > 0));
    assert.match(r.err, /claim-scan: skipped 2 malformed lines in .*hollow.*decisions\.jsonl/); });
  rmSync(root, { recursive: true, force: true });
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
