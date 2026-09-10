// fixture.mjs — kho tạm CODE-SINH cho răng hồ sơ eval-khai-ma-thoat-mong-doi.
// Không viết tay evals.yaml/evidence-report.md theo khuôn bên đọc: mọi shape
// (khai n hợp lệ · khai 0 tường minh · vắng trường · khai sai luật) được RENDER
// ở đây từ tham số, và mọi báo cáo "thật" (dùng cho luat-ghim/l1-nhat-quan) được
// RÚT từ prompt mà CHÍNH feature-loop/workflows/acceptance-verify.js sinh ra khi
// chạy qua tests/workflows/harness.mjs — không phải fixture viết tay đúng khuôn
// bên đọc (lớp lỗi round-trip mà hồ sơ 09/09 sinh ra để giết).
//
// Đường dẫn suy từ vị trí file — không hardcode ROOT.
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const KIT = path.resolve(HERE, '..', '..');
export const HARNESS = path.join(KIT, 'tests', 'workflows', 'harness.mjs');
export const WF = path.join(KIT, 'feature-loop', 'workflows', 'acceptance-verify.js');

// ── evals.yaml render ───────────────────────────────────────────────────────
// spec: { id, criterion, executor, cmd, expectedExitLine (undefined = KHÔNG
// khai trường; chuỗi = khai nguyên văn giá trị đó), expected, question, steps }
export function evalYamlBlock(spec) {
  const lines = [
    `  - id: ${spec.id}`,
    `    criterion: ${spec.criterion || 'AC-1'}`,
    `    executor: ${spec.executor || 'script'}`,
    `    cmd: ${spec.cmd}`,
  ];
  if (spec.expected !== undefined) lines.push(`    expected: ${spec.expected}`);
  if (spec.question !== undefined) lines.push(`    question: ${spec.question}`);
  if (Array.isArray(spec.steps)) { lines.push('    steps:'); for (const s of spec.steps) lines.push(`      - ${s}`); }
  if (spec.expectedExitLine !== undefined) lines.push(`    expected_exit: ${spec.expectedExitLine}`);
  return lines.join('\n');
}
export function evalsYamlText(specs, slug = 'fx') {
  return ['schema_version: 1', `slug: ${slug}`, '', 'evals:', ...specs.map(evalYamlBlock), ''].join('\n');
}

// Bốn shape chuẩn dùng xuyên chân mot-nguon: valid(2) · zero(0 tường minh) ·
// absent(vắng trường) · invalid("hai" — khai sai luật).
export const SHAPES = {
  valid: '2',
  zero: '0',
  absent: undefined,
  invalid: 'hai',
};

// ── config.yaml render ──────────────────────────────────────────────────────
// executors: { key: cmd }; suiteKeys: [ 'executors.script.<key>', ... ] (mặc
// định = mọi key của executors).
export function configYamlText(opts = {}) {
  const executors = opts.executors || { e1: 'exit 0' };
  const execLines = Object.entries(executors).map(([k, v]) => `    ${k}: ${v}`);
  const suiteKeys = opts.suiteKeys || Object.keys(executors).map(k => `executors.script.${k}`);
  return [
    'schema_version: 1', 'enforcement: strict', `recheck: ${opts.recheck || 'strict'}`, 'gap_probe: advisory',
    'executors:', '  script:', ...execLines,
    'risk_tiers:', '  t1_skip_globs:', '    - "docs/**"',
    'signoff:', '  required_for: [T2, T3]', '  approvers: ["t"]',
    'feature_loop:', '  suite_keys:', ...suiteKeys.map(k => `    - ${k}`), '',
  ].join('\n');
}

// ── contract.md render ───────────────────────────────────────────────────────
export function contractText(opts = {}) {
  const c = Object.assign({ status: 'verified', risk_tier: 'T2', approved_by: '' }, opts);
  return [
    '---', 'schema_version: 1', 'feature: fx', 'slug: fx', `risk_tier: ${c.risk_tier}`, 'surfaces: [cli]',
    `status: ${c.status}`, `approved_by: ${c.approved_by}`, 'approved_at:', '---', '',
    '# Acceptance Contract: fx', '', '## Criteria', '', '- AC-1: Given x, When y, Then z.', '',
  ].join('\n');
}

// ── evidence-report.md render (fixture tĩnh — dùng cho lan-ghim / mot-nguon,
// KHÔNG dùng cho luat-ghim/l1-nhat-quan: hai chân đó bắt buộc round-trip) ─────
// evalBlocks: [{ id, criterion, executor, exitCode, verifier, runId }]
export function evidenceReportText(opts = {}) {
  const { verdict = 'PASS', vc = '0000000000000000000000000000000000000000', signoff = '', evalBlocks = [], sections } = opts;
  const secs = sections === undefined ? '## Known limits\n\n## Ngoài hợp đồng\n- none\n' : sections;
  const table = evalBlocks.map(b => `| ${b.id} | ${b.criterion || 'AC-1'} | ${b.executor || 'script'} | ${verdict} |`).join('\n');
  const body = evalBlocks.map(b => [
    `- eval: ${b.id}`,
    `  run_id: ${b.runId || `fx-${b.id}-001`}`,
    `  exit_code: ${b.exitCode}`,
    '  baseline: n-a',
    `  verifier: ${b.verifier}`,
    '  verified_at: 2026-09-09T00:00:00Z',
    '  output: |',
    '    ok',
    '',
  ].join('\n')).join('\n');
  return [
    '---', 'schema_version: 2', 'feature_slug: fx', `verdict: ${verdict}`, 'failed_evals: []', 'verified_by: fixture',
    'enforcement_mode: strict', 'bypass_used: false', `verified_commit: ${vc}`, `human_signoff: ${signoff}`, '---', '',
    '# Evidence Report: fx', '', '| Eval | Criterion | Executor | Verdict |', '|---|---|---|---|', table, '',
    '## Evidence', '', body, secs,
  ].join('\n');
}

// ── kho git tạm cho readers CLI-thật (s4-args.mjs, repin-lane.mjs) ──────────
// opts: { slug, config:{executors,suiteKeys,recheck}, contract:{...},
//         evals:[spec...], evidence:false|{...evidenceReportText opts},
//         runLogLines:[obj...] }
export function mkRepo(opts = {}) {
  const slug = opts.slug || 'fx';
  const root = mkdtempSync(path.join(tmpdir(), 'ekmt-'));
  const git = (...a) => execFileSync('git', ['-C', root, '-c', 'user.email=t@t', '-c', 'user.name=t', '-c', 'commit.gpgsign=false', ...a],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  const ws = path.join(root, '_acceptance', slug);
  mkdirSync(ws, { recursive: true });
  writeFileSync(path.join(root, '_acceptance', 'config.yaml'), configYamlText(opts.config || {}));
  writeFileSync(path.join(ws, 'contract.md'), contractText(opts.contract || {}));
  writeFileSync(path.join(ws, 'evals.yaml'), evalsYamlText(opts.evals || [], slug));
  if (opts.evidence !== false) writeFileSync(path.join(ws, 'evidence-report.md'), evidenceReportText(opts.evidence || {}));
  if (opts.runLogLines) writeFileSync(path.join(ws, 'run-log.jsonl'), opts.runLogLines.map(l => JSON.stringify(l)).join('\n') + '\n');
  git('init', '-q', '-b', 'main');
  git('add', '-A'); git('commit', '-q', '-m', 'A: fixture');
  const sha = git('rev-parse', 'HEAD');
  return { root, slug, ws, git, sha };
}

// ── evals.yaml-only dir (không git) cho lời gọi trực tiếp checkRepinEvals /
// evaluateEvidence({fileDir}) — hai bộ đọc đó chỉ cần đọc evals.yaml đứng cạnh.
export function writeEvalsDir(specs, slug = 'fx') {
  const dir = mkdtempSync(path.join(tmpdir(), 'ekmt-ey-'));
  writeFileSync(path.join(dir, 'evals.yaml'), evalsYamlText(specs, slug));
  return dir;
}

// ── round-trip: rút { } / [ ] cân bằng ngoặc ngay sau `marker` trong `text` ──
export function extractBracketed(text, marker) {
  const idx = text.indexOf(marker);
  if (idx === -1) return null;
  let i = idx + marker.length;
  while (i < text.length && text[i] !== '[' && text[i] !== '{') i++;
  if (i >= text.length) return null;
  const open = text[i]; const close = open === '[' ? ']' : '}';
  let depth = 0; const start = i;
  for (; i < text.length; i++) {
    if (text[i] === open) depth++;
    else if (text[i] === close) { depth--; if (depth === 0) { i++; break; } }
  }
  try { return JSON.parse(text.slice(start, i)); } catch { return null; }
}

// ── round-trip writer: rút giá trị THẬT mà chính acceptance-verify.js đã tính
// (machineForReportB, evalRunIds, verdict, provenance, Known limits) từ prompt
// của agent "synthesize:report", rồi RENDER report theo shape L1 SHAPE/L1
// CONSISTENCY thật — không viết tay theo khuôn bên đọc.
// fieldName cho phép chân luat-ghim mô phỏng "writer đổi tên trường mà reader
// không đổi" (mặc định 'exit_code', đúng tên trường EXIT_LINE_RE của reader).
export function buildReportFromPrompt(prompt, opts = {}) {
  const slug = opts.slug || 'fx';
  const fieldName = opts.fieldName || 'exit_code';
  const verdict = (prompt.match(/Verdict DA TINH SAN \(khong tu thay doi\): (\S+)/) || [])[1] || 'PASS';
  const vcM = prompt.match(/"verified_commit: ([0-9a-fA-F]{7,40})"/);
  const vc = vcM ? vcM[1] : '0000000000000000000000000000000000000000';
  const em = (prompt.match(/"enforcement_mode: ([^"]*)"/) || [])[1] || 'strict';
  const bu = (prompt.match(/"bypass_used: ([^"]*)"/) || [])[1] || 'false';
  const machineForReportB = extractBracketed(prompt, 'Ket qua may (') || [];
  const evalRunIds = extractBracketed(prompt, 'TUYET DOI KHONG tu mint/doi/rut gon run_id: ') || {};
  const klMatch = prompt.match(/KHONG gop dong:\n([\s\S]*?)\nVoi cac eval nay:/);
  const knownLimitLines = klMatch ? klMatch[1].split('\n').filter(Boolean) : [];
  const ghkMatch = prompt.match(/GIOI HAN DA KHAI KHONG CON — chep NGUYEN VAN vao muc "## Known limits":\n([\s\S]*?)\nNETWORK TRUTH/);
  const gioiHetLines = ghkMatch ? ghkMatch[1].split('\n').filter(Boolean) : [];

  const blocks = [];
  for (const m of machineForReportB) {
    for (const id of (m.evals || [])) {
      blocks.push([
        `- eval: ${id}`,
        `  run_id: ${evalRunIds[id] || ''}`,
        `  ${fieldName}: ${m.exitCode}`,
        `  verifier: config:executors.script.e1`,
        '  verified_at: 2026-09-09T00:00:00Z',
        '  output: |',
        `    ${String(m.outputTail || 'ok').split('\n')[0] || 'ok'}`,
        '',
      ].join('\n'));
    }
  }
  const knownSec = `## Known limits\n${knownLimitLines.length ? knownLimitLines.join('\n') + '\n' : ''}${gioiHetLines.length ? gioiHetLines.join('\n') + '\n' : ''}`;
  return {
    text: [
      '---', 'schema_version: 2', `feature_slug: ${slug}`, `verdict: ${verdict}`, 'failed_evals: []', 'verified_by: fixture',
      `enforcement_mode: ${em}`, `bypass_used: ${bu}`, `verified_commit: ${vc}`, 'human_signoff: ', '---', '',
      `# Evidence Report: ${slug}`, '',
      '## Evidence', '', blocks.join('\n'),
      knownSec,
      '## Ngoài hợp đồng', '- none', '',
    ].join('\n'),
    verdict, vc, knownLimitLines, gioiHetLines, machineForReportB, evalRunIds,
  };
}

// CLI: node fixture.mjs mkRepo '<json opts>' → in 4 dòng: root · slug · ws · sha
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [, , cmd, argJson] = process.argv;
  if (cmd === 'mkRepo') {
    const r = mkRepo(JSON.parse(argJson || '{}'));
    process.stdout.write(`${r.root}\n${r.slug}\n${r.ws}\n${r.sha}\n`);
  } else if (cmd === 'writeEvalsDir') {
    const { specs, slug } = JSON.parse(argJson || '{}');
    process.stdout.write(writeEvalsDir(specs, slug) + '\n');
  } else {
    process.stderr.write(`fixture.mjs: lenh la (khong biet '${cmd}')\n`); process.exit(3);
  }
}
