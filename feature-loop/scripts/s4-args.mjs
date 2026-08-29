#!/usr/bin/env node
// s4-args.mjs — sinh TRỌN args cho workflow S4 (acceptance-verify.js) bằng máy.
// Vì sao tồn tại: workflow script không có filesystem nên args phải chuẩn bị
// từ ngoài; bản soạn-tay-theo-văn-xuôi là lớp lỗi có đo (điều tra 29/08 —
// docs/findings/2026-08-29-dieu-tra-luat-hoi-tu.md). Script này fail-CLOSED:
// bất kỳ nguồn nào thiếu/ref nào không giải được → exit 2 kèm tên phần hỏng,
// KHÔNG sinh tệp, KHÔNG đoán.
//
//   node s4-args.mjs --slug <slug> --root <repoRoot> [--round N]
//        [--carry-anchor <sha> | --no-carry] [--diff-base <ref>]
//        [--ag-root <path>] [--out <file>]
//
// exit 0 = tệp args (hoặc stdout) sinh xong · exit 2 = nguồn thiếu/hỏng ·
// exit 3 = usage. Chuỗi lệnh trong args giữ SẠCH (không nướng `cd` — ghim chỗ
// đứng là việc của từng LANE trong acceptance-verify.js; nướng vào lệnh sẽ phá
// lane baseline chạy worktree — xem design doc 2026-08-29, quyết định 2).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KNOWN = new Set(['slug', 'root', 'round', 'carry-anchor', 'no-carry', 'diff-base', 'ag-root', 'out']);

function usage(msg) { console.error(`s4-args: ${msg}\nusage: s4-args.mjs --slug <slug> --root <repoRoot> [--round N] [--carry-anchor <sha>|--no-carry] [--diff-base <ref>] [--ag-root <path>] [--out <file>]`); process.exit(3); }
function die(msg) { console.error(`s4-args: ${msg}`); process.exit(2); }

const flags = {};
{
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i += 1) {
    const tok = argv[i];
    if (!tok.startsWith('--')) usage(`tham số lạ (không phải cờ): ${tok}`);
    const name = tok.slice(2);
    if (!KNOWN.has(name)) usage(`cờ không nhận diện được: ${tok}`);
    if (name === 'no-carry') { flags[name] = true; continue; }
    if (argv[i + 1] === undefined || argv[i + 1].startsWith('--')) usage(`cờ ${tok} thiếu giá trị`);
    flags[name] = argv[i + 1]; i += 1;
  }
}
if (!flags.slug || !flags.root) usage('thiếu --slug hoặc --root');

const root = (() => { try { return fs.realpathSync(flags.root); } catch { return die(`--root không tồn tại: ${flags.root}`); } })();
const ws = path.join(root, '_acceptance', flags.slug);
const readOr = (p, what) => { try { return fs.readFileSync(p, 'utf8'); } catch { return die(`${what} không đọc được: ${p}`); } };
const configText = readOr(path.join(root, '_acceptance', 'config.yaml'), 'config.yaml');
const evalsText = readOr(path.join(ws, 'evals.yaml'), 'evals.yaml');
const contractPath = path.join(ws, 'contract.md');
const contractText = readOr(contractPath, 'contract.md');

// ── resolve acceptance-gate root (self-host: --ag-root; thường: resolve-plugin) ──
const AG_REQUIRES = [
  'skills/acceptance/references/judge-personas.md',
  'skills/acceptance/references/evidence-report-template.md',
  'skills/acceptance/references/tool-kill-rule.md',
  'lib/evidence-core.cjs',
  'lib/eval-yaml.js',
];
let agRoot = flags['ag-root'];
if (!agRoot) {
  try {
    const rp = path.join(HERE, 'resolve-plugin.mjs');
    const out = execFileSync(process.execPath, [rp, '--plugin', 'acceptance-gate', ...AG_REQUIRES.flatMap(r => ['--require', r])], { encoding: 'utf8' });
    agRoot = out.trim().split('\n').pop();
  } catch (e) { die(`không resolve được plugin acceptance-gate: ${String(e.message || e).split('\n')[0]}`); }
}
agRoot = (() => { try { return fs.realpathSync(agRoot); } catch { return die(`--ag-root không tồn tại: ${agRoot}`); } })();
for (const r of AG_REQUIRES) if (!fs.existsSync(path.join(agRoot, r))) die(`acceptance-gate root thiếu ${r} (root: ${agRoot})`);

const require_ = createRequire(import.meta.url);
const { resolveConfigKey, frontmatterField } = require_(path.join(agRoot, 'lib', 'evidence-core.cjs'));
const { parseEvals } = require_(path.join(agRoot, 'lib', 'eval-yaml.js'));

// ── evals: scalar qua parser dùng chung + list fields quét cục bộ ──────────
const evals = parseEvals(evalsText, ['criterion', 'executor', 'cmd', 'expected', 'runs', 'question']);
if (!evals.length) die('evals.yaml không có eval nào (hoặc không parse được)');
{ // list fields: inputs / paths / evidence_required — inline [..] hoặc block "- item"
  const LIST_KEYS = ['inputs', 'paths', 'evidence_required'];
  let cur = null; let pendingList = null;
  const parseInline = s => s.replace(/^\[|\]$/g, '').split(',').map(x => x.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
  for (const raw of evalsText.split('\n')) {
    const line = raw.replace(/\t/g, '  ');
    const idM = line.match(/^\s{0,4}-\s+id:\s*(\S+)/);
    if (idM) { cur = evals.find(e => e.id === idM[1].replace(/^["']|["']$/g, '')) || null; pendingList = null; continue; }
    if (!cur) continue;
    const fieldM = line.match(/^\s{4}([\w-]+):\s*(.*)$/);
    if (fieldM) {
      pendingList = null;
      const [, k, vRaw] = fieldM;
      if (!LIST_KEYS.includes(k)) continue;
      const v = vRaw.replace(/\s+#.*$/, '').trim();
      if (v.startsWith('[')) cur[k] = parseInline(v);
      else if (v === '') { cur[k] = []; pendingList = k; }
      continue;
    }
    if (pendingList) {
      const itemM = line.match(/^\s{6,}-\s+(.*)$/);
      if (itemM) { cur[pendingList].push(itemM[1].trim().replace(/^["']|["']$/g, '')); continue; }
      if (line.trim()) pendingList = null;
    }
  }
}
for (const e of evals) {
  if (e.runs) { const n = parseInt(e.runs, 10); if (Number.isFinite(n) && n > 1) e.runs = n; else delete e.runs; } else delete e.runs;
  if (e.cmd && e.cmd.startsWith('config:')) {
    const ref = e.cmd;
    const val = resolveConfigKey(configText, ref.slice('config:'.length));
    if (!val) die(`ref không giải được trong config.yaml: ${ref} (eval ${e.id})`);
    e.ref = ref; e.cmd = val;
  }
  if (e.executor === 'judgment' && Array.isArray(e.inputs)) e.inputs = e.inputs.map(p => path.isAbsolute(p) ? p : path.resolve(ws, p));
  for (const k of Object.keys(e)) if (e[k] === '' || e[k] == null) delete e[k];
}

// ── suiteCommands từ feature_loop.suite_keys (list reader cục bộ) ──────────
function readListUnder(text, topKey, listKey) {
  const lines = text.split('\n'); const out = [];
  let inTop = false; let inList = false;
  for (const raw of lines) {
    const line = raw.replace(/\t/g, '  ');
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const indent = line.length - line.trimStart().length;
    if (indent === 0) { inTop = line.trim() === `${topKey}:`; inList = false; continue; }
    if (!inTop) continue;
    if (indent === 2) { inList = line.trim() === `${listKey}:`; continue; }
    if (inList && indent >= 4) { const m = line.trim().match(/^-\s+(.*)$/); if (m) out.push(m[1].replace(/\s+#.*$/, '').trim().replace(/^["']|["']$/g, '')); }
  }
  return out;
}
const suiteKeys = readListUnder(configText, 'feature_loop', 'suite_keys');
if (!suiteKeys.length) die('config.yaml thiếu feature_loop.suite_keys (hoặc rỗng) — khai danh sách suite chạy mỗi lượt rồi chạy lại');
const suiteCommands = suiteKeys.map(k => resolveConfigKey(configText, k) || die(`suite_keys trỏ key không giải được: ${k}`));

// ── models (optional block feature_loop.models) ────────────────────────────
const models = (() => {
  const lines = configText.split('\n'); const out = {};
  let inFl = false; let inModels = false;
  for (const raw of lines) {
    const line = raw.replace(/\t/g, '  ');
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const indent = line.length - line.trimStart().length;
    if (indent === 0) { inFl = line.trim() === 'feature_loop:'; inModels = false; continue; }
    if (!inFl) continue;
    if (indent === 2) { inModels = line.trim() === 'models:'; continue; }
    if (inModels && indent >= 4) { const m = line.trim().match(/^([\w-]+):\s*(\S+)/); if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
  }
  return Object.keys(out).length ? out : null;
})();

// ── contract / git facts ───────────────────────────────────────────────────
const riskTier = frontmatterField(contractText, 'risk_tier');
if (!riskTier) die('contract.md thiếu risk_tier trong frontmatter');
const git = (...a) => execFileSync('git', ['-C', root, ...a], { encoding: 'utf8' }).trim();
let mainBranch = null;
try { const m = execFileSync('git', ['-C', root, 'remote', 'show', 'origin'], { encoding: 'utf8' }).match(/HEAD branch:\s*(\S+)/); if (m) mainBranch = m[1]; } catch { /* không có remote — thử tên quen */ }
if (!mainBranch) for (const b of ['main', 'master', 'develop', 'trunk']) { try { git('rev-parse', '--verify', '--quiet', b); mainBranch = b; break; } catch { /* thử tên kế */ } }
let diffBase;
if (flags['diff-base']) diffBase = git('rev-parse', flags['diff-base']);
else if (mainBranch) diffBase = git('merge-base', mainBranch, 'HEAD');
else die('không nhận diện được nhánh chính (không remote, không main/master/develop/trunk) — truyền --diff-base <ref>');
const invokedSha = git('rev-parse', 'HEAD');
const invokedAt = new Date().toISOString().slice(0, 19) + 'Z';

// ── round: đếm từ ## Iterations của evidence-report.md — KHÔNG đoán ────────
let round;
if (flags.round) { round = parseInt(flags.round, 10); if (!Number.isFinite(round) || round < 1) usage('--round phải là số ≥ 1'); }
else {
  const evPath = path.join(ws, 'evidence-report.md');
  if (!fs.existsSync(evPath)) round = 1;
  else {
    const ev = fs.readFileSync(evPath, 'utf8');
    const secM = ev.match(/^##\s+Iterations\s*$([\s\S]*?)(?=^##\s|(?![\s\S]))/m);
    if (!secM) die('evidence-report.md có mặt nhưng không thấy section "## Iterations" — không đếm được round (round sai là mint trùng run_id); sửa report hoặc truyền --round tường minh');
    const nums = [...secM[1].matchAll(/\bround\s+(\d+)/gi)].map(m => parseInt(m[1], 10));
    if (!nums.length) die('section "## Iterations" không chứa dòng "Round <n>" nào — không đếm được round; truyền --round tường minh');
    round = Math.max(...nums) + 1;
  }
}

const args = {
  slug: flags.slug,
  round,
  riskTier,
  evals,
  suiteCommands,
  diffBase,
  repoRoot: root,
  personasPath: path.join(agRoot, 'skills/acceptance/references/judge-personas.md'),
  templatePath: path.join(agRoot, 'skills/acceptance/references/evidence-report-template.md'),
  toolKillRule: fs.readFileSync(path.join(agRoot, 'skills/acceptance/references/tool-kill-rule.md'), 'utf8'),
  contractPath,
  invokedAt,
  invokedSha,
  ...(models ? { models } : {}),
};

const json = JSON.stringify(args, null, 2);
if (flags.out) { fs.writeFileSync(flags.out, json); console.error(`s4-args: đã sinh ${flags.out} (round ${round}, ${evals.length} eval, ${suiteCommands.length} suite)`); }
else process.stdout.write(json + '\n');
