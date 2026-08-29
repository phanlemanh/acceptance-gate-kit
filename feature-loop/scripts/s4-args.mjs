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
import { createHash } from 'node:crypto';
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

// ── Bảng trường bắt buộc: RÚT TỪ CHÍNH BÊN ĐỌC, không gõ tay ──────────────
// Bên viết (script này) và bên đọc (acceptance-verify.js) từng trôi khỏi nhau:
// danh sách field gõ tay ở đây thiếu `steps`, nên hồ sơ có eval ui-check sinh
// ra args mà workflow chắc chắn BLOCK — script vẫn exit 0 (S4-r1, AC-1). Nay
// đọc khối marker EVAL-REQUIRED-FIELDS của workflow làm nguồn DUY NHẤT.
const wfPath = path.join(HERE, '..', 'workflows', 'acceptance-verify.js');
const EVAL_REQUIRED = (() => {
  let src; try { src = fs.readFileSync(wfPath, 'utf8'); } catch { return die(`không đọc được ${wfPath} để rút bảng trường bắt buộc`); }
  const lines = src.split('\n');
  const a = lines.findIndex(l => l.includes('<<<EVAL-REQUIRED-FIELDS'));
  const b = lines.findIndex(l => l.includes('EVAL-REQUIRED-FIELDS>>>'));
  if (a === -1 || b === -1 || b <= a) die(`không rút được khối marker EVAL-REQUIRED-FIELDS trong ${wfPath} — bên đọc đổi khuôn, KHÔNG đoán`);
  const out = {};
  for (const l of lines.slice(a + 1, b)) {
    const m = l.match(/^\s*'([\w-]+)':\s*\{\s*str:\s*\[([^\]]*)\],\s*arr:\s*\[([^\]]*)\]/);
    if (!m) continue;
    const pick = s => s.split(',').map(x => x.trim().replace(/^'|'$/g, '')).filter(Boolean);
    out[m[1]] = { str: pick(m[2]), arr: pick(m[3]) };
  }
  if (!Object.keys(out).length) die(`khối EVAL-REQUIRED-FIELDS rỗng trong ${wfPath}`);
  return out;
})();
const uniq = a => [...new Set(a)];
const REQ_STR = uniq(Object.values(EVAL_REQUIRED).flatMap(v => v.str)).filter(k => k !== 'id');
const REQ_ARR = uniq(Object.values(EVAL_REQUIRED).flatMap(v => v.arr));

// ── evals: scalar qua parser dùng chung + list fields quét cục bộ ──────────
const evals = parseEvals(evalsText, uniq([...REQ_STR, 'executor', 'expected', 'runs']));
if (!evals.length) die('evals.yaml không có eval nào (hoặc không parse được)');
{ // list fields: bắt buộc theo bảng bên đọc + field vận hành — inline [..] hoặc block "- item"
  const LIST_KEYS = uniq([...REQ_ARR, 'inputs', 'paths', 'evidence_required']);
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
// Fail-CLOSED theo ĐÚNG bảng của bên đọc: sinh tệp thiếu trường bắt buộc là
// đẩy một lượt BLOCKED chắc chắn xuống workflow, trong khi SKILL cấm soạn tay
// — tức ngõ cụt đốt round. Thà exit 2 có tên ngay ở đây.
for (const e of evals) {
  const need = EVAL_REQUIRED[e.executor];
  if (!need) die(`eval ${e.id}: executor "${e.executor || '(vắng)'}" không có trong bảng EVAL-REQUIRED-FIELDS của workflow (${Object.keys(EVAL_REQUIRED).join(' | ')})`);
  for (const k of need.str) if (typeof e[k] !== 'string' || !e[k].trim()) die(`eval ${e.id} (${e.executor}): thiếu trường bắt buộc "${k}" — workflow sẽ BLOCKED, không sinh tệp`);
  for (const k of need.arr) if (!Array.isArray(e[k]) || !e[k].length || e[k].some(x => typeof x !== 'string' || !x.trim())) die(`eval ${e.id} (${e.executor}): thiếu/hỏng trường mảng bắt buộc "${k}" — workflow sẽ BLOCKED, không sinh tệp`);
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
// Trần thời gian cho lệnh git CÓ MẠNG (hỏi remote chạy mỗi lần sinh args):
// remote sau tường lửa bị nuốt gói sẽ treo, và bước chuẩn bị args treo theo cho
// tới khi công cụ giết — đúng lớp REJECT-giả. 10 giây đủ cho remote lành.
const REMOTE_TIMEOUT_MS = 10_000;
// Mọi lệnh git đi qua MỘT cửa fail-closed: ref hỏng phải cho exit 2 kèm tên
// phần hỏng như mọi nguồn khác, không phải stack trace Node + exit 1 (mã không
// nằm trong bảng script tự khai, và SKILL bắt trình NGUYÊN VĂN cho người) — S4-r2.
const git = (...a) => {
  try { return execFileSync('git', ['-C', root, ...a], { encoding: 'utf8' }).trim(); }
  catch (e) { return die(`lệnh git thất bại: git ${a.join(' ')} — ${String((e && e.stderr) || (e && e.message) || '').split('\n')[0].trim() || 'không rõ nguyên nhân'}`); }
};
// HAI VAI của một lệnh git, hai hàm có tên riêng. `git()` ở trên là ĐỌC BẮT
// BUỘC: hỏng thì die() → thoát tiến trình. `gitTry()` dưới đây là phép DÒ:
// hỏng là chuyện bình thường, trả null và đi tiếp. Trộn hai vai chính là lỗi
// đã nổ: vòng dò gọi `git()` trong try/catch, mà thoát-tiến-trình KHÔNG ném,
// nên catch là mã chết và danh sách tên chỉ còn hiệu lực cho tên đầu.
const gitTry = (...a) => {
  try { return execFileSync('git', ['-C', root, ...a], { encoding: 'utf8', timeout: REMOTE_TIMEOUT_MS }).trim(); }
  catch { return null; }
};
// <<<MAIN-BRANCH-CANDIDATES
const MAIN_BRANCH_CANDIDATES = ['main', 'master', 'develop', 'trunk'];
// MAIN-BRANCH-CANDIDATES>>>
// <<<PROBE-REGION
// Vùng DÒ tên nhánh chính. Mọi lời gọi git trong vùng này PHẢI là gitTry —
// phép đo neo vào chính hai marker này, không vào hình dạng mã quanh nó.
let mainBranch = null;
let mainBranchSource = 'none';
let remoteDeclared = null;
{
  const out = gitTry('remote', 'show', 'origin');
  const m = out && out.match(/HEAD branch:\s*(\S+)/);
  // Tên remote khai chỉ dùng được khi nó GIẢI ĐƯỢC ở cây này. Checkout
  // single-branch/shallow (mặc định của nhiều bộ CI) chỉ có ref nhánh feature:
  // `refs/heads/main` vắng dù remote vẫn khai «HEAD branch: main». Đưa thẳng tên
  // đó vào phép đọc bắt buộc là chết với ĐÚNG thông điệp mà AC-2 gọi là sai loại.
  if (m && m[1] !== '(unknown)') {
    remoteDeclared = m[1];
    for (const cand of [m[1], `origin/${m[1]}`]) {
      if (gitTry('rev-parse', '--verify', '--quiet', cand) !== null) { mainBranch = cand; mainBranchSource = 'remote'; break; }
    }
  }
}
// Vòng dò tên quen chỉ chạy khi remote KHÔNG khai gì. Remote đã khai một tên mà
// tên đó không giải được ⇒ nhận bừa tên khác là đổi một tiếng kêu to thành một
// câu trả lời SAI êm ru: mốc so sánh lấy từ nhánh không liên quan, exit 0, và cả
// lượt chấm chạy trên diff sai. Hồi quy do chính S4-r1/r2 đẻ ra, đóng ở S4-r4.
if (!mainBranch && !remoteDeclared) {
  for (const b of MAIN_BRANCH_CANDIDATES) {
    if (gitTry('rev-parse', '--verify', '--quiet', b) !== null) { mainBranch = b; mainBranchSource = 'fallback'; break; }
  }
}
// PROBE-REGION>>>
let diffBase;
if (flags['diff-base']) diffBase = git('rev-parse', flags['diff-base']);
else if (mainBranch) diffBase = git('merge-base', mainBranch, 'HEAD');
else if (remoteDeclared) die(`remote khai nhánh chính «${remoteDeclared}» nhưng cây này không giải được ref đó (thử cả «origin/${remoteDeclared}») — KHÔNG đoán sang tên khác; truyền --diff-base <ref>`);
else die(`không nhận diện được nhánh chính (không remote, không ${MAIN_BRANCH_CANDIDATES.join('/')}) — truyền --diff-base <ref>`);
const invokedSha = git('rev-parse', 'HEAD');
// Nguồn giải được tên nhánh chính — vật để phép đo phân biệt đường remote với
// đường dò tên quen (không có nó, hai đường cho cùng kết quả nên không đo được).
// Nguồn giải được tên nhánh đi VÀO ĐẦU RA (args + một dòng khai trên stderr):
// biến chỉ gán rồi chết là lời hứa không có vật, và phép đo bám vào nó sẽ phải
// đo fixture thay vì đo đầu ra. Trường optional — bên đọc đời cũ bỏ qua.
const mainBranchInfo = { branch: mainBranch, source: mainBranchSource };
console.error(`s4-args: nhánh chính «${mainBranch}» giải bằng ${mainBranchSource}`);
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

// ── carry-forward: bước GỌI nằm trong máy, không còn là bước tay ───────────
// round ≥2 phải KHAI đường carry tường minh — «quên» không phải trạng thái lặng.
const sha256 = s => createHash('sha256').update(s).digest('hex');
const runLogPath = path.join(ws, 'run-log.jsonl');
const runLogLines = fs.existsSync(runLogPath)
  ? fs.readFileSync(runLogPath, 'utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean)
  : [];
let carriedEvals;
if (round >= 2 && !flags['carry-anchor'] && !flags['no-carry']) {
  die(`round ${round} (≥2) phải khai tường minh: --carry-anchor <sha dòng round trước> (tính carry P1) hoặc --no-carry (full re-run) — «quên carry» đốt round là lớp lỗi có đo`);
}
if (flags['carry-anchor']) {
  const anchor = git('rev-parse', flags['carry-anchor']);
  const deltaFiles = git('diff', '--name-only', `${anchor}..HEAD`).split('\n').filter(f => f && !f.startsWith('_acceptance/'));
  const cpArgs = ['--run-log', runLogPath, '--evals', path.join(ws, 'evals.yaml'), '--contract', contractPath, '--round', String(round)];
  cpArgs.push(...(deltaFiles.length ? ['--delta-files', deltaFiles.join(',')] : ['--no-delta']));
  try {
    const out = execFileSync(process.execPath, [path.join(HERE, 'carry-plan.mjs'), ...cpArgs], { encoding: 'utf8' });
    const plan = JSON.parse(out);
    if (Array.isArray(plan.carriedEvals) && plan.carriedEvals.length) carriedEvals = plan.carriedEvals;
  } catch (e) {
    const code = e && typeof e.status === 'number' ? e.status : null;
    if (code === 3) console.error('s4-args: carry-plan exit 3 — run-log cũ chưa có sha, full re-run (mặc định an toàn)');
    else die(`carry-plan.mjs lỗi (exit ${code}): ${String(e.stderr || e.message || '').split('\n')[0]}`);
  }
}
// P2 (mọi round): baseline-once theo evalsHash
const evalsHash = sha256(evalsText);
const lastBaseline = [...runLogLines].reverse().find(l => l.kind === 'baseline');
let runBaseline; let carriedAnalyst;
if (lastBaseline && lastBaseline.evals_hash === evalsHash) {
  runBaseline = false;
  carriedAnalyst = { fromRound: lastBaseline.carried_from_round ?? lastBaseline.round, nonDiscriminating: lastBaseline.non_discriminating || [] };
} else runBaseline = true;
// P3 (round ≥2): panel memo theo inputsHash — file input thiếu → hash mới, judge fresh
let carriedPanels;
if (round >= 2) {
  for (const e of evals) {
    if (e.executor !== 'judgment') continue;
    let blob = String(e.question || '');
    let readable = true;
    for (const p of e.inputs || []) { try { blob += fs.readFileSync(p, 'utf8'); } catch { readable = false; } }
    const ih = readable ? sha256(blob) : sha256(blob + ':inputs-missing:' + invokedAt);
    const lastPanel = [...runLogLines].reverse().find(l => l.kind === 'panel' && l.evalId === e.id);
    if (readable && lastPanel && lastPanel.inputs_hash === ih) {
      (carriedPanels = carriedPanels || []).push({ evalId: e.id, proposal: lastPanel.proposal, votes: lastPanel.votes, fromRound: lastPanel.carried_from_round ?? lastPanel.round, inputsHash: ih });
    } else e.inputsHash = ih;
  }
}

const args = {
  generated_at: invokedAt,
  generated_sha: invokedSha,
  mainBranchInfo,
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
  evalsHash,
  runBaseline,
  ...(carriedAnalyst ? { carriedAnalyst } : {}),
  ...(carriedEvals ? { carriedEvals } : {}),
  ...(carriedPanels ? { carriedPanels } : {}),
  ...(models ? { models } : {}),
};

const json = JSON.stringify(args, null, 2);
if (flags.out) { fs.writeFileSync(flags.out, json); console.error(`s4-args: đã sinh ${flags.out} (round ${round}, ${evals.length} eval, ${suiteCommands.length} suite)`); }
else process.stdout.write(json + '\n');
