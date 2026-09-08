// fixture.mjs — kho git tạm CODE-SINH cho răng hồ sơ duong-lui-phai-song.
// Một khuôn cho mọi chân (sổ 9010): vendored scripts/lib chép từ KIT (hoặc từ
// opts.vendorFrom = bản base), config.yaml có recheck + suite_keys, một hồ sơ
// `_acceptance/<slug>/` đủ contract/evals/evidence/run-log, commit A (fixture)
// rồi commit B (bằng chứng). Đường dẫn suy từ vị trí file — không hardcode ROOT.
import { mkdtempSync, mkdirSync, writeFileSync, cpSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const KIT = path.resolve(HERE, '..', '..');
export const LIBS = ['evidence-core.cjs', 'gap-probe.cjs', 'workspace-record.cjs', 'ac-line.cjs', 'md-section.cjs', 'eval-yaml.cjs'];

export function evidenceText({ verdict = 'PASS', vc = '', signoff = '', sections, runId = 'fx-E1-001', bypass = 'false' } = {}) {
  const secs = sections === undefined ? '## Known limits\n\n## Ngoài hợp đồng\n' : sections;
  return [
    '---', 'schema_version: 2', 'feature_slug: fx', `verdict: ${verdict}`, 'failed_evals: []', 'verified_by: fixture',
    'enforcement_mode: strict', `bypass_used: ${bypass}`, `verified_commit: ${vc}`, `human_signoff: ${signoff}`, '---', '',
    '# Evidence Report: fx', '', '| Eval | Criterion | Executor | Verdict |', '|---|---|---|---|', `| E1 | AC-1 | script | ${verdict === 'PASS' ? 'PASS' : verdict} |`, '',
    '## Evidence', '', '- eval: E1', `  run_id: ${runId}`, '  exit_code: 0', '  baseline: n-a', '  verifier: config:executors.script.rang_e1',
    '  verified_at: 2026-09-08T00:00:00Z', '  output: |', '    ok', '', secs,
  ].join('\n');
}

export function contractText(c, slug) {
  const fm = ['---', 'schema_version: 1', `feature: fx ${slug}`, `slug: ${slug}`, `risk_tier: ${c.risk_tier}`, 'surfaces: [cli]',
    `status: ${c.status}`, `approved_by: ${c.approved_by}`, 'approved_at:'];
  if (c.veto_state) { fm.push(`veto_state: ${c.veto_state}`); fm.push(`veto_opened_at: ${c.veto_opened_at}`); }
  fm.push('---', '', `# Acceptance Contract: ${slug}`, '', '## Criteria', '', '- AC-1: Given x, When y, Then z.', '', '## Out of scope', '', '- none', '- none', '');
  return fm.join('\n');
}

// opts: { slug, vendorFrom, recheck, contract:{status,risk_tier,approved_by,veto_state,veto_opened_at},
//         vc (undefined = commit A; '' = rỗng; sha = nguyên văn), signoff, sections, verdict,
//         repinLine (bool), commitEvidence (default true), verifyExit (default 0), omit: [rel] (không vendor) }
export function mkRepo(opts = {}) {
  const slug = opts.slug || 'fx';
  const root = mkdtempSync(path.join(tmpdir(), 'dlps-'));
  const git = (...a) => execFileSync('git', ['-C', root, '-c', 'user.email=t@t', '-c', 'user.name=t', '-c', 'commit.gpgsign=false', ...a],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  const from = opts.vendorFrom || KIT;
  mkdirSync(path.join(root, 'scripts'), { recursive: true });
  const omit = opts.omit || []; // rel path KHÔNG vendor — mũi tiêm nằm trong lịch sử từ commit A, cây không bẩn
  for (const rel of ['scripts/pre-merge-check.sh', 'scripts/recheck-evidence.cjs']) if (!omit.includes(rel)) cpSync(path.join(from, rel), path.join(root, rel));
  mkdirSync(path.join(root, 'lib'), { recursive: true });
  for (const f of LIBS) if (!omit.includes(`lib/${f}`)) cpSync(path.join(from, 'lib', f), path.join(root, 'lib', f));
  mkdirSync(path.join(root, 'docs'), { recursive: true });
  writeFileSync(path.join(root, 'docs', 'README.md'), 'docs\n');
  writeFileSync(path.join(root, 'verify.sh'), `#!/bin/sh\nexit ${opts.verifyExit || 0}\n`);
  chmodSync(path.join(root, 'verify.sh'), 0o755);
  writeFileSync(path.join(root, 'src.txt'), 'v1\n');
  const dir = path.join(root, '_acceptance', slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(root, '_acceptance', 'config.yaml'), [
    'schema_version: 1', 'enforcement: strict', `recheck: ${opts.recheck || 'strict'}`, 'gap_probe: advisory',
    'executors:', '  script:', '    rang_e1: bash ./verify.sh',
    'risk_tiers:', '  t1_skip_globs:', '    - "docs/**"', '    - "PRODUCT-MAP.md"', '  t3_paths:', '    - "lib/**"',
    'signoff:', '  required_for: [T2, T3]', '  approvers: ["t"]',
    'feature_loop:', '  suite_keys:', '    - executors.script.rang_e1', '',
  ].join('\n'));
  const c = Object.assign({ status: 'verified', risk_tier: 'T2', approved_by: '', veto_state: 'mo', veto_opened_at: '2026-09-01T00:00:00Z' }, opts.contract || {});
  writeFileSync(path.join(dir, 'contract.md'), contractText(c, slug));
  writeFileSync(path.join(dir, 'evals.yaml'), `schema_version: 1\nslug: ${slug}\n\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.rang_e1\n    expected: ok\n`);
  writeFileSync(path.join(dir, 'decisions.jsonl'), '');
  git('init', '-q'); git('add', '-A'); git('commit', '-q', '-m', 'A: fixture');
  const A = git('rev-parse', 'HEAD');
  const vc = opts.vc === undefined ? A : opts.vc;
  // runId: run_id mà báo cáo cite (mặc định trùng run-log; khác đi = mũi «run_id lạ» cho soi lại)
  // repinSuiteOnly: dòng repin KHÔNG evals_exit + section ### Re-pin cite nó (mũi làn suite-only)
  // section Re-pin đặt TRƯỚC hai mục rỗng: section() đọc tới heading kế, nối sau «Ngoài hợp đồng» là làm mục đó có nội dung
  const secs = opts.sections === undefined ? '## Known limits\n\n## Ngoài hợp đồng\n' : opts.sections;
  const repinSec = opts.repinSuiteOnly ? `### Re-pin lần 1 — 2026-09-08, do fixture\nrun_id: repin-fx-1\nsha: ${vc} · suites: 1 lệnh exit 0\n\n` : '';
  const ev = evidenceText({ vc, signoff: opts.signoff || '', sections: repinSec + secs, verdict: opts.verdict, runId: opts.runId || 'fx-E1-001' });
  writeFileSync(path.join(dir, 'evidence-report.md'), ev);
  const lines = [JSON.stringify({ ts: '2026-09-08T00:00:00Z', round: 1, evalId: 'E1', run_id: 'fx-E1-001', exit_code: 0, cmd: 'bash ./verify.sh' })];
  if (opts.repinLine) lines.push(JSON.stringify({ ts: '2026-09-08T00:00:01Z', kind: 'repin', run_id: 'repin-fx-1', sha: vc, suites_exit: [0], evals_exit: { E1: 0 } }));
  if (opts.repinSuiteOnly) lines.push(JSON.stringify({ ts: '2026-09-08T00:00:01Z', kind: 'repin', run_id: 'repin-fx-1', sha: vc, suites_exit: [0] }));
  writeFileSync(path.join(dir, 'run-log.jsonl'), lines.join('\n') + '\n');
  let B = A;
  if (opts.commitEvidence !== false) { git('add', '-A'); git('commit', '-q', '-m', 'B: evidence'); B = git('rev-parse', 'HEAD'); }
  return { root, slug, dir, git, A, B };
}

// CLI cho bash: node fixture.mjs '<json opts>' → in ba dòng: root · A · B
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const r = mkRepo(JSON.parse(process.argv[2] || '{}'));
  process.stdout.write(`${r.root}\n${r.A}\n${r.B}\n`);
}
