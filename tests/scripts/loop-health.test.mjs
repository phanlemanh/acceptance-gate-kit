// tests/scripts/loop-health.test.mjs — K6 của gom-duc-ket-2-10-0 (AC-8).
//   LH1 ba dòng số trên fixture git code-sinh (giờ commit dựng bằng GIT_COMMITTER_DATE)
//   LH2 vòng bị hạ-tầng đốt = round BLOCKED + làn ghim lại
//   LH3 mốc cùng hạng theo tier khớp số DỰNG (round · token · repin · fix)
//   LH4 --json == text; mutant xoá một section S4 → round/token đổi (phép đo phân biệt được)
//   LH_CASES=LH3 node tests/scripts/loop-health.test.mjs
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const LH = path.join(ROOT, 'scripts', 'loop-health.mjs');

const ALL_IDS = ['LH1', 'LH2', 'LH3', 'LH4'];
if (process.argv.includes('--ids')) { console.log(ALL_IDS.join(' ')); process.exit(0); }
const only = (process.env.LH_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => only.length === 0 || only.includes(id);
let failures = 0;
const pass = (id, m) => console.log(`  PASS: ${id} — ${m}`);
const fail = (id, m) => { console.log(`  FAIL: ${id} — ${m}`); failures++; };
const W = (root, rel, s) => { const p = path.join(root, rel); mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, s); return p; };
const git = (cwd, env, ...a) => spawnSync('git', ['-c', 'user.email=t@test.local', '-c', 'user.name=tester', '-c', 'commit.gpgsign=false', '-C', cwd, ...a],
  { encoding: 'utf8', env: { ...process.env, ...env } });
const run = (...a) => spawnSync(process.execPath, [LH, ...a], { encoding: 'utf8' });

// ── fixture: 3 hồ sơ, số dựng BIẾT TRƯỚC ────────────────────────────────────
// s-a T2: 2 round usage (12k+8k tok/round qua dòng per-model), Iterations 2, 1 fix, 0 repin,
//         implemented→signed-off cách 90 phút, human_calls: 3
// s-b T3: 4 round usage, Iterations 4, 1 BLOCKED, 1 repin, 1 fix, không khai human_calls
// s-c T2: không usage-report (đường đọc-cũ) — không được kéo TB xuống
const usageSection = (n, out, inn, cr, cc) => [
  `### S4 round ${n} — wf_x (2 agent, ${out} out-tok)`, '',
  '| label | model | calls | out | in | cache_read | s |',
  '|---|---|--:|--:|--:|--:|--:|',
  `| machine:x | claude-haiku-4-5 | 2 | ${out} | ${inn} | ${cr} | 3 |`, '',
  `- **claude-haiku-4-5**: 1 agent · 2 calls · out ${out} · in ${inn} · cache_read ${cr} · cache_create ${cc}`, '',
].join('\n');
const contractOf = (slug, tier, extra = '') => ['---', 'schema_version: 1', `feature: ${slug}`, `slug: ${slug}`,
  `risk_tier: ${tier}`, 'surfaces: [api]', 'status: implemented', 'approved_by: Manh Phan', 'approved_at: 2026-09-01',
  extra, '---', '', '## Criteria', '', '- AC-1: Given a, When b, Then c.', ''].filter(Boolean).join('\n');

function mkFixture() {
  const R = mkdtempSync(path.join(tmpdir(), 'loop-health-'));
  git(R, {}, 'init', '-q');
  W(R, '_acceptance/config.yaml', 'schema_version: 1\n');
  // vòng 1: implemented
  W(R, '_acceptance/s-a/contract.md', contractOf('s-a', 'T2', 'human_calls: 3'));
  W(R, '_acceptance/s-b/contract.md', contractOf('s-b', 'T3'));
  W(R, '_acceptance/s-c/contract.md', contractOf('s-c', 'T2'));
  git(R, {}, 'add', '-A');
  git(R, { GIT_COMMITTER_DATE: '2026-09-01T10:00:00Z', GIT_AUTHOR_DATE: '2026-09-01T10:00:00Z' }, 'commit', '-qm', 'impl');
  // bằng chứng + usage + sổ
  W(R, '_acceptance/s-a/evidence-report.md', '---\nverdict: PASS\n---\n\n## Iterations\n\nRound 1: chạy.\nRound 2: PASS.\n');
  W(R, '_acceptance/s-a/usage-report.md', usageSection(1, 1000, 100, 10000, 900) + usageSection(2, 500, 50, 7000, 450));
  W(R, '_acceptance/s-a/decisions.jsonl', '{"id":"d-1","type":"fix","stage":"S4-r1","decision":"x"}\n');
  W(R, '_acceptance/s-b/evidence-report.md', '---\nverdict: PASS\n---\n\n## Iterations\n\nRound 1: BLOCKED vì agent chết.\nRound 2: chạy.\nRound 3: chạy.\nRound 4: PASS.\n');
  W(R, '_acceptance/s-b/usage-report.md', [1, 2, 3, 4].map(n => usageSection(n, 1000, 0, 4000, 0)).join(''));
  W(R, '_acceptance/s-b/run-log.jsonl', '{"ts":"2026-09-02T00:00:00Z","kind":"repin","run_id":"r-1","sha":"deadbeef","suites_exit":[0]}\n');
  W(R, '_acceptance/s-b/decisions.jsonl', '{"id":"d-2","type":"fix","stage":"S4-r2","decision":"y"}\n');
  W(R, '_acceptance/s-c/evidence-report.md', '---\nverdict: PASS\n---\n\n## Iterations\n\nRound 1: PASS.\n');
  git(R, {}, 'add', '-A');
  git(R, { GIT_COMMITTER_DATE: '2026-09-01T11:00:00Z', GIT_AUTHOR_DATE: '2026-09-01T11:00:00Z' }, 'commit', '-qm', 'evidence');
  // chữ ký: s-a lúc 11:30 (90 phút sau implemented)
  for (const s of ['s-a', 's-b', 's-c']) {
    const p = path.join(R, '_acceptance', s, 'contract.md');
    writeFileSync(p, String(spawnSync('cat', [p], { encoding: 'utf8' }).stdout).replace('status: implemented', 'status: signed-off'));
  }
  git(R, {}, 'add', '-A');
  git(R, { GIT_COMMITTER_DATE: '2026-09-01T11:30:00Z', GIT_AUTHOR_DATE: '2026-09-01T11:30:00Z' }, 'commit', '-qm', 'signoff');
  return R;
}

const R = mkFixture();
const text = run('--root', R).stdout;
const js = (() => { try { return JSON.parse(run('--root', R, '--json').stdout); } catch (e) { return null; } })();

if (want('LH1')) {
  const id = 'LH1'; const before = failures;
  if (!js) fail(id, '--json không parse được');
  else {
    const a = js.rows.find(r => r.slug === 's-a');
    if (!a || a.minutes !== 90) fail(id, `làm-xong→quyết-được của s-a phải 90′, got ${a && a.minutes}`);
    if (!a || a.human_calls !== 3) fail(id, `human_calls đọc từ frontmatter phải 3, got ${a && a.human_calls}`);
    const b = js.rows.find(r => r.slug === 's-b');
    if (!b || b.human_calls !== null) fail(id, 'hồ sơ không khai human_calls phải trả null (in «đếm tay»)');
    if (!/đếm tay|s-a 3/.test(text)) fail(id, 'bản chữ không nói rõ dòng lượt-gọi-người');
  }
  if (failures === before) pass(id, 'ba dòng số: 90′ từ giờ commit, human_calls khai/không khai');
}

if (want('LH2')) {
  const id = 'LH2'; const before = failures;
  const b = js && js.rows.find(r => r.slug === 's-b');
  if (!b) fail(id, 'không thấy s-b');
  else if (b.infra_burned !== 2) fail(id, `vòng bị hạ-tầng đốt của s-b phải 2 (1 BLOCKED + 1 repin), got ${b.infra_burned}`);
  const a = js && js.rows.find(r => r.slug === 's-a');
  if (a && a.infra_burned !== 0) fail(id, `s-a không có BLOCKED/repin nhưng đếm ${a.infra_burned}`);
  if (failures === before) pass(id, 'hạ-tầng đốt = BLOCKED + ghim lại, hồ sơ sạch thì 0');
}

if (want('LH3')) {
  const id = 'LH3'; const before = failures;
  if (!js) fail(id, 'không có json');
  else {
    // s-a: (1000+100+10000+900) + (500+50+7000+450) = 20000
    const a = js.rows.find(r => r.slug === 's-a');
    if (a.token_s4 !== 20000) fail(id, `token S4 của s-a phải 20000 (cộng cả cache_create), got ${a.token_s4}`);
    if (a.rounds_usage !== 2 || a.rounds_iter !== 2) fail(id, `round của s-a phải 2/2, got ${a.rounds_usage}/${a.rounds_iter}`);
    // s-b: 4 × (1000+0+4000+0) = 20000
    const b = js.rows.find(r => r.slug === 's-b');
    if (b.token_s4 !== 20000) fail(id, `token S4 của s-b phải 20000, got ${b.token_s4}`);
    if (b.rounds_usage !== 4 || b.rounds_iter !== 4) fail(id, `round của s-b phải 4/4, got ${b.rounds_usage}/${b.rounds_iter}`);
    // tier: T2 chỉ tính hồ sơ CÓ usage (s-c không có → không kéo TB xuống)
    if (js.tiers.T2.round_usage !== 2) fail(id, `T2 round_usage phải 2 (s-c không usage), got ${js.tiers.T2.round_usage}`);
    if (js.tiers.T2.token_s4 !== 20000) fail(id, `T2 token TB phải 20000, got ${js.tiers.T2.token_s4}`);
    if (js.tiers.T3.round_usage !== 4) fail(id, `T3 round_usage phải 4, got ${js.tiers.T3.round_usage}`);
    if (js.tiers.T2.fix_s4 !== 1 || js.tiers.T3.fix_s4 !== 1) fail(id, `fix S4 phải 1/1, got ${js.tiers.T2.fix_s4}/${js.tiers.T3.fix_s4}`);
    if (js.tiers.T3.repin !== 1) fail(id, `ghim lại T3 phải 1, got ${js.tiers.T3.repin}`);
  }
  if (failures === before) pass(id, 'mốc cùng hạng theo tier khớp số dựng (round · token có cache_create · repin · fix)');
}

if (want('LH4')) {
  const id = 'LH4'; const before = failures;
  // --json và text cùng một nguồn số
  if (js && !text.includes(String(js.tiers.T2.round_usage))) fail(id, 'bản chữ không in cùng số với --json');
  // mutant: xoá MỘT section S4 của s-b → round và token phải đổi (phép đo phân biệt được)
  const up = path.join(R, '_acceptance', 's-b', 'usage-report.md');
  const orig = String(spawnSync('cat', [up], { encoding: 'utf8' }).stdout);
  writeFileSync(up, orig.replace(/### S4 round 4[\s\S]*$/, ''));
  const mut = (() => { try { return JSON.parse(run('--root', R, '--json').stdout); } catch (_) { return null; } })();
  writeFileSync(up, orig);
  if (!mut) fail(id, 'mutant không chạy được');
  else {
    const b = mut.rows.find(r => r.slug === 's-b');
    if (b.rounds_usage !== 3) fail(id, `mutant xoá 1 section mà round vẫn ${b.rounds_usage} (phép đo không phân biệt)`);
    if (b.token_s4 !== 15000) fail(id, `mutant token phải 15000, got ${b.token_s4}`);
  }
  if (failures === before) pass(id, '--json == text; mutant xoá section S4 bị bắt (round + token)');
}

rmSync(R, { recursive: true, force: true });
console.log(failures === 0 ? `loop-health: OK (${ALL_IDS.filter(want).join(', ')})` : `loop-health: ${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
