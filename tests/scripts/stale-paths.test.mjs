// tests/scripts/stale-paths.test.mjs — K4 của gom-duc-ket-2-10-0 (AC-6).
// Luật: hồ sơ mà MỌI eval máy/ui khai `paths:` thì chỉ hoá cũ khi file đổi KHỚP ∪paths;
// thiếu paths ở một eval, hoặc thiếu node/lib → LUẬT CŨ (cả cây) — fail-safe về phía chặt.
//   SP1 đủ paths + đổi ngoài ∪paths → không stale      SP2 cùng fixture, đổi TRONG paths → stale
//   SP3 một eval thiếu paths → luật cũ                 SP4 thiếu lib → luật cũ + NOTE
//   SP5 staleScope/pathsOf (đơn vị, hai dạng YAML)     SP6 câu luật trong SKILL feature-loop
// Fixture git code-sinh trong chính lần chạy; bản sao kit chép TRỌN thư mục.
//   SP_CASES=SP2 node tests/scripts/stale-paths.test.mjs
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const require = createRequire(import.meta.url);

const ALL_IDS = ['SP1', 'SP2', 'SP3', 'SP4', 'SP5', 'SP6'];
if (process.argv.includes('--ids')) { console.log(ALL_IDS.join(' ')); process.exit(0); }
const only = (process.env.SP_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => only.length === 0 || only.includes(id);
let failures = 0;
const pass = (id, m) => console.log(`  PASS: ${id} — ${m}`);
const fail = (id, m) => { console.log(`  FAIL: ${id} — ${m}`); failures++; };
const tmp = () => mkdtempSync(path.join(tmpdir(), 'stale-paths-'));
const W = (root, rel, s) => { const p = path.join(root, rel); mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, s); return p; };
const git = (cwd, ...a) => spawnSync('git', ['-c', 'user.email=t@test.local', '-c', 'user.name=tester', '-c', 'commit.gpgsign=false', '-C', cwd, ...a], { encoding: 'utf8' });

const EV_FULL = [
  'evals:',
  '  - id: E1',
  '    criterion: AC-1',
  '    executor: test',
  '    cmd: config:executors.test.api',
  '    paths: [src/**]',
  '    expected: "x"',
  '  - id: E2',
  '    criterion: AC-2',
  '    executor: script',
  '    cmd: config:executors.script.lint',
  '    paths:',
  '      - lib/**',
  '    expected: "y"',
  '',
].join('\n');
// E2 thiếu `paths:` → hồ sơ rơi về luật cũ (đường đọc-cũ)
const EV_MISSING = EV_FULL.replace('    paths:\n      - lib/**\n', '');

// repo git: src/app.js + lib/core.js + tests/khac.sh, hồ sơ đã ký pin verified_commit
function mkRepo(evalsText) {
  const R = tmp();
  W(R, '_acceptance/config.yaml', 'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n');
  W(R, 'src/app.js', 'code v1\n');
  W(R, 'lib/core.js', 'lib v1\n');
  W(R, 'tests/khac.sh', '#!/bin/sh\nexit 0\n');
  W(R, 'verify.sh', '#!/bin/sh\nexit 0\n');
  W(R, '_acceptance/x/contract.md', ['---', 'schema_version: 1', 'feature: x', 'slug: x', 'risk_tier: T2',
    'surfaces: [api]', 'status: signed-off', 'approved_by: Manh Phan', 'approved_at: 2026-09-08', '---', '',
    '## Criteria', '', '- AC-1: Given a, When b, Then c.', '- AC-2: Given d, When e, Then f.', '',
    '## Out of scope', '', '- x', ''].join('\n'));
  W(R, '_acceptance/x/evals.yaml', evalsText);
  git(R, 'init', '-q'); git(R, 'add', '-A'); git(R, 'commit', '-qm', 'impl');
  const vc = git(R, 'rev-parse', 'HEAD').stdout.trim();
  W(R, '_acceptance/x/evidence-report.md', `---\nschema_version: 1\nfeature_slug: x\nverdict: PASS\nverified_commit: ${vc}\nhuman_signoff: Manh 2026-09-08\n---\n\n## Evidence\n- eval: E1\n  run_id: x-E1-001\n  exit_code: 0\n  verifier: verify.sh\n  verified_at: 2026-09-08\n`);
  git(R, 'add', '-A'); git(R, 'commit', '-qm', 'evidence');
  return R;
}
const touch = (R, rel, body) => { W(R, rel, body); git(R, 'add', '-A'); git(R, 'commit', '-qm', 'change ' + rel); };
const mkKit = () => { const m = tmp(); cpSync(path.join(ROOT, 'lib'), path.join(m, 'lib'), { recursive: true }); cpSync(path.join(ROOT, 'scripts'), path.join(m, 'scripts'), { recursive: true }); return m; };
const check = (kit, R) => spawnSync('bash', [path.join(kit, 'scripts', 'pre-merge-check.sh'), R], { encoding: 'utf8' });
const staleLine = out => (String(out).split('\n').find(l => /VIOLATION \[x\]:.*stale/.test(l)) || '');

// ─── SP1 + SP2 — CÙNG fixture, hai chiều ─────────────────────────────────────
if (want('SP1') || want('SP2')) {
  const kit = mkKit();
  if (want('SP1')) {
    const id = 'SP1'; const before = failures;
    const R = mkRepo(EV_FULL);
    touch(R, 'tests/khac.sh', '#!/bin/sh\nexit 0\n# doi\n');   // ngoài ∪paths, ngoài t1
    const r = check(kit, R);
    if (staleLine(r.stdout)) fail(id, `đổi NGOÀI ∪paths mà vẫn stale: ${staleLine(r.stdout)}`);
    if (!/rules ran=/.test(r.stdout)) fail(id, 'thiếu dấu hiệu quét (rules ran=) — cổng có chạy không?');
    rmSync(R, { recursive: true, force: true });
    if (failures === before) pass(id, 'đủ paths + đổi ngoài ∪paths → không stale');
  }
  if (want('SP2')) {
    const id = 'SP2'; const before = failures;
    const R = mkRepo(EV_FULL);
    touch(R, 'src/app.js', 'code v2\n');                        // TRONG paths của E1
    const r = check(kit, R);
    const line = staleLine(r.stdout);
    if (!line) fail(id, `đổi TRONG paths mà không stale (fail-open): ${r.stdout.slice(-300)}`);
    else if (!/src\/app\.js/.test(r.stdout)) fail(id, 'stale không nêu file đổi');
    rmSync(R, { recursive: true, force: true });
    if (failures === before) pass(id, 'cùng fixture, đổi trong ∪paths → stale nêu file');
  }
  rmSync(kit, { recursive: true, force: true });
}

// ─── SP3 — một eval thiếu paths → luật cũ ────────────────────────────────────
if (want('SP3')) {
  const id = 'SP3'; const before = failures;
  const kit = mkKit(); const R = mkRepo(EV_MISSING);
  touch(R, 'tests/khac.sh', '#!/bin/sh\nexit 0\n# doi\n');
  const r = check(kit, R);
  if (!staleLine(r.stdout)) fail(id, `hồ sơ thiếu paths phải đi LUẬT CŨ (cả cây) nhưng không stale: ${r.stdout.slice(-300)}`);
  rmSync(R, { recursive: true, force: true }); rmSync(kit, { recursive: true, force: true });
  if (failures === before) pass(id, 'một eval thiếu paths → luật cũ, đổi tests/ vẫn stale (đọc-cũ)');
}

// ─── SP4 — thiếu lib → luật cũ + NOTE (không fail-open) ──────────────────────
if (want('SP4')) {
  const id = 'SP4'; const before = failures;
  const kit = mkKit();
  rmSync(path.join(kit, 'lib', 'evidence-core.cjs'), { force: true });
  const R = mkRepo(EV_FULL);
  touch(R, 'tests/khac.sh', '#!/bin/sh\nexit 0\n# doi\n');
  const r = check(kit, R);
  if (!staleLine(r.stdout)) fail(id, `thiếu lib mà bỏ qua stale (fail-open): ${r.stdout.slice(-300)}`);
  if (!/NOTE \[x\]:.*luật cũ/.test(r.stdout)) fail(id, 'thiếu NOTE nói rõ đang chạy luật cũ');
  rmSync(R, { recursive: true, force: true }); rmSync(kit, { recursive: true, force: true });
  if (failures === before) pass(id, 'thiếu lib → luật cũ + NOTE có tên, không fail-open');
}

// ─── SP5 — staleScope + pathsOf (đơn vị) ─────────────────────────────────────
if (want('SP5')) {
  const id = 'SP5'; const before = failures;
  const core = require(path.join(ROOT, 'lib', 'evidence-core.cjs'));
  const ey = require(path.join(ROOT, 'lib', 'eval-yaml.cjs'));
  if (typeof ey.pathsOf !== 'function') fail(id, 'lib/eval-yaml.cjs chưa xuất pathsOf');
  else {
    const inline = ey.pathsOf('evals:\n  - id: E1\n    executor: test\n    paths: [a/**, "b/c.js"]\n');
    const block = ey.pathsOf('evals:\n  - id: E1\n    executor: test\n    paths:\n      - a/**\n      - b/c.js\n');
    if (JSON.stringify(inline) !== JSON.stringify(block)) fail(id, `pathsOf hai dạng YAML khác nhau: ${JSON.stringify(inline)} vs ${JSON.stringify(block)}`);
    if (JSON.stringify(inline.E1) !== JSON.stringify(['a/**', 'b/c.js'])) fail(id, `pathsOf inline sai: ${JSON.stringify(inline)}`);
  }
  if (typeof core.staleScope !== 'function') fail(id, 'lib/evidence-core.cjs chưa xuất staleScope');
  else {
    const full = core.staleScope(EV_FULL);
    const miss = core.staleScope(EV_MISSING);
    if (!Array.isArray(full) || JSON.stringify([...full].sort()) !== JSON.stringify(['lib/**', 'src/**'])) fail(id, `staleScope đủ paths sai: ${JSON.stringify(full)}`);
    if (miss !== null) fail(id, `staleScope phải trả null khi một eval máy thiếu paths, got ${JSON.stringify(miss)}`);
    // judgment KHÔNG cần paths (không chạy bằng máy trên cây)
    const withJudgment = EV_FULL + '  - id: E3\n    criterion: AC-2\n    executor: judgment\n    expected: "z"\n';
    if (core.staleScope(withJudgment) === null) fail(id, 'eval judgment không khai paths mà làm hồ sơ rơi về luật cũ');
  }
  if (failures === before) pass(id, 'pathsOf hai dạng YAML == nhau; staleScope null khi thiếu, bỏ qua judgment');
}

// ─── SP6 — câu luật trong SKILL feature-loop ─────────────────────────────────
if (want('SP6')) {
  const id = 'SP6'; const before = failures;
  const skill = readFileSync(path.join(ROOT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md'), 'utf8');
  const i = skill.indexOf('Staleness guard');
  const seg = i < 0 ? '' : skill.slice(i, i + 2000);
  if (!seg) fail(id, 'SKILL không có đoạn Staleness guard');
  else {
    if (!/paths:/.test(seg)) fail(id, 'Staleness guard không nêu luật theo paths:');
    if (!/cả cây/i.test(seg)) fail(id, 'Staleness guard không nêu đường đọc-cũ (thiếu paths → cả cây)');
    if (!/require|import/.test(seg)) fail(id, 'Staleness guard không dặn liệt file được require (paths không bắc cầu)');
  }
  if (failures === before) pass(id, 'SKILL nêu luật paths + đường đọc-cũ + dặn không bắc cầu');
}

console.log(failures === 0 ? `stale-paths: OK (${ALL_IDS.filter(want).join(', ')})` : `stale-paths: ${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
