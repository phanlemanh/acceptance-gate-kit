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
import { globToRe } from './carry-plan.mjs';
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
  'lib/eval-yaml.cjs',
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
const { resolveConfigKey, resolveConfigList, frontmatterField, parseFlowValue, machineEvalIdsSkipped } = require_(path.join(agRoot, 'lib', 'evidence-core.cjs'));
if (typeof resolveConfigList !== 'function') die('acceptance-gate quá cũ: lib/evidence-core.cjs không có resolveConfigList (cần ≥ 2.9.0) — cập nhật plugin');
if (typeof machineEvalIdsSkipped !== 'function') die('acceptance-gate quá cũ: lib/evidence-core.cjs không có machineEvalIdsSkipped (cần ≥ 2.12.0) — cập nhật plugin');
// MỘT bộ bóc nháy dùng chung cho mọi đường giá-trị-bị-thi-hành (hồ sơ
// release-2-11-0). Thiếu hàm = plugin cũ hơn 2.11.0: fail-CLOSED có tên, KHÔNG
// rơi về mệnh đề cũ — rơi về nó chính là đường xanh-giả vòng này đóng.
// MỘT cổng tách token dùng chung cho mọi giá trị YAML một dòng (hồ sơ
// release-2-11-0, đường A). Thiếu nó = plugin cũ hơn 2.11.0: fail-CLOSED có
// tên, KHÔNG rơi về biểu thức tự viết — rơi về đó chính là khuôn sai mà
// STOP-PATCHING đã bắt.
if (typeof parseFlowValue !== 'function') die('acceptance-gate quá cũ: lib/evidence-core.cjs không có parseFlowValue (cần ≥ 2.11.0) — cập nhật plugin');
const { parseEvals, expectedExits } = require_(path.join(agRoot, 'lib', 'eval-yaml.cjs'));

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
// ── ô tự khai `status: not-run`: CÙNG hàm với làn ghim lại và bên đọc pin
// (lib/evidence-core.cjs). Lượt chấm không thi hành ô ấy; tệp args GỌI TÊN nó để
// báo cáo nói ra, không im. Khoá vắng hẳn khi không ô nào khai (cùng luật evals_not_run).
const evalsNotRun = machineEvalIdsSkipped(evalsText);
if (evalsNotRun === null) die('không đọc được lời khai not-run: lib/eval-yaml.cjs vắng ở gốc acceptance-gate — KHÔNG đoán');
if (evalsNotRun.length) {
  for (let i = evals.length - 1; i >= 0; i--) if (evalsNotRun.includes(evals[i].id)) evals.splice(i, 1);
  if (!evals.length) die('mọi eval đều khai status: not-run — không còn gì để chấm');
  console.error(`s4-args: không chạy theo hồ sơ: ${evalsNotRun.join(', ')}`);
}

// ── kỳ vọng mã thoát: nguồn DUY NHẤT là expectedExits (lib/eval-yaml.cjs).
// Workflow chạy không có filesystem nên không tự đọc evals.yaml được — script
// này là nơi RÚT kỳ vọng và mang vào tệp args, dưới tên đã đổi dạng
// `expectedExit` trên từng phần tử `evals[]`. errs không rỗng → fail-CLOSED
// ngay, không đoán, không sinh tệp.
const { byId: expById, errs: expErrs } = expectedExits(evalsText);
if (expErrs.length) {
  console.error(`s4-args: evals.yaml khai mã thoát mong đợi sai luật —\n  ${expErrs.join('\n  ')}`);
  process.exit(2);
}
for (const e of evals) e.expectedExit = expById.get(e.id) || 0;
{ // list fields: bắt buộc theo bảng bên đọc + field vận hành — inline [..] hoặc block "- item"
  const LIST_KEYS = uniq([...REQ_ARR, 'inputs', 'paths', 'evidence_required']);
  let cur = null; let pendingList = null;
  // MỌI giá trị đi qua CỔNG CHUNG, không bộ đọc nào tự nhận-biết-vỏ nữa.
  for (const raw of evalsText.split('\n')) {
    const line = raw.replace(/\t/g, '  ');
    const idM = line.match(/^\s{0,4}-\s+id:\s*(\S+)/);
    if (idM) { cur = evals.find(e => e.id === parseFlowValue(idM[1]).value) || null; pendingList = null; continue; }
    if (!cur) continue;
    const fieldM = line.match(/^\s{4}([\w-]+):\s*(.*)$/);
    if (fieldM) {
      pendingList = null;
      const [, k, vRaw] = fieldM;
      if (!LIST_KEYS.includes(k)) continue;
      const pv = parseFlowValue(vRaw);
      if (pv.kind === 'seq') cur[k] = pv.items;
      else if (pv.value === '') { cur[k] = []; pendingList = k; }
      continue;
    }
    if (pendingList) {
      const itemM = line.match(/^\s{6,}-\s+(.*)$/);
      if (itemM) { cur[pendingList].push(parseFlowValue(itemM[1]).value); continue; }
      if (line.trim()) pendingList = null;
    }
  }
}
// `inputs` của judgment tính từ GỐC KHO — cùng gốc với `paths` và mọi đường dẫn
// khác trong evals.yaml. Bản cũ giải theo thư mục hồ sơ `_acceptance/<slug>/`
// trong khi skill sinh evals viết theo gốc kho: args sinh xong, exit 0, mà mọi
// input trỏ vào file không có, hội đồng đọc file rỗng (crm, 05/09). Input vắng
// trên đĩa là lỗi hồ sơ → exit 2 gọi tên, KHÔNG sinh tệp; nếu file lại có ở
// đường cũ (theo hồ sơ) thì nói luôn cách viết lại — máy suy được thì máy điền.
// Ngoại lệ duy nhất: bằng chứng của CHÍNH hồ sơ đang chấm (`_acceptance/<slug>/
// evidence/…`) do ui-check sinh TRONG lúc chấm nên chưa có lúc sinh args — vẫn
// giải thành đường tuyệt đối, khai một dòng; vắng lúc chấm thì hội đồng trả
// UNCERTAIN theo luật sẵn có. Hồ sơ khác không sinh gì trong vòng này: vắng là
// lỗi thật. Đường tồn tại mà là thư mục cũng là lỗi thật — hội đồng không đọc
// được thư mục, và khối P3 sẽ băm lại mỗi vòng mà không ai biết vì sao.
const EVIDENCE_PREFIX = path.posix.join('_acceptance', flags.slug, 'evidence') + '/';
function resolveJudgmentInput(e, p) {
  const abs = path.isAbsolute(p) ? p : path.resolve(root, p);
  const st = fs.statSync(abs, { throwIfNoEntry: false });
  if (st && st.isFile()) return abs;
  if (st) return die(`eval ${e.id} (judgment): input là thư mục, không phải file: ${p} (${abs}) — hội đồng không đọc được thư mục, KHÔNG sinh tệp`);
  const norm = path.posix.normalize(p.split(path.sep).join('/'));
  if (!path.isAbsolute(p) && norm.startsWith(EVIDENCE_PREFIX)) {
    console.error(`s4-args: eval ${e.id}: input ${p} chưa có — nằm trong evidence/ của chính hồ sơ, được phép sinh trong lúc chấm; vắng lúc chấm thì hội đồng trả UNCERTAIN`);
    return abs;
  }
  const legacy = path.isAbsolute(p) ? null : path.resolve(ws, p);
  const hint = legacy && fs.existsSync(legacy)
    ? ` — file này CÓ ở ${legacy}: inputs tính từ GỐC KHO như paths, viết lại thành «${path.relative(root, legacy)}»`
    : '';
  return die(`eval ${e.id} (judgment): input không tồn tại trên đĩa: ${p} (tìm ở ${abs})${hint} — hội đồng sẽ đọc file rỗng, KHÔNG sinh tệp`);
}
for (const e of evals) {
  if (e.runs) { const n = parseInt(e.runs, 10); if (Number.isFinite(n) && n > 1) e.runs = n; else delete e.runs; } else delete e.runs;
  if (e.cmd && e.cmd.startsWith('config:')) {
    const ref = e.cmd;
    const val = resolveConfigKey(configText, ref.slice('config:'.length));
    if (!val) die(`ref không giải được trong config.yaml: ${ref} (eval ${e.id})`);
    e.ref = ref; e.cmd = val;
  }
  if (e.executor === 'judgment' && Array.isArray(e.inputs)) e.inputs = e.inputs.map(p => resolveJudgmentInput(e, p));
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

// ── suiteCommands từ feature_loop.suite_keys — reader dùng chung với làn re-pin
// (resolveConfigList trong evidence-core): hai làn không được đọc suite_keys khác nhau.
const suiteKeys = resolveConfigList(configText, 'feature_loop.suite_keys');
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
    if (inModels && indent >= 4) { const m = line.trim().match(/^([\w-]+):\s*(.*)$/); if (m) out[m[1]] = parseFlowValue(m[2]).value; }   // `(.*)$` cả phần còn lại — `(\S+)` cắt `"sonnet 4.6"` thành `"sonnet` còn nháy MỞ; cắt chú thích là việc của cổng chung
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

// ── T2 (khoi-tim-loi-tra-phi-theo-vat): VÙNG VẬT — tên máy đọc cho «vật được giao» ──
// <<<NGOAI-VAT
// Ngoài-vật = lời khai `risk_tiers.t1_skip_globs` của repo («tệp mà một thay đổi chỉ
// chạm nó thì không phải hành vi» — chính là phần bù của vùng vật) + VĂN BẢN hồ sơ
// vòng (.md/.jsonl trong thư mục hồ sơ). KHÔNG thêm khoá config nào.
//
// Ở LẠI vùng vật, có chủ đích:
//   · mã răng trong thư mục hồ sơ, evals.yaml, config.yaml — «thước tự dối» là lớp lỗi
//     tỉ lệ cao nhất kit đo được; 17/94 finding trong hợp đồng của crm-onehub nằm trên
//     mã răng, và chỉ 2 trong số đó đến từ lens đo.
//   · MỌI tệp được khai trong `paths` của một eval, bất kể đuôi — một fixture văn bản
//     là ĐẦU VÀO CỦA THƯỚC. Loại nó khỏi delta thì sửa fixture xong eval vẫn được carry
//     màu xanh CŨ, và chiều đỏ mà eval tự hứa không bao giờ nổ (chiều FAIL-OPEN,
//     gap-probe 14/09 bắt trên chính hồ sơ này).
//
// MỘT hàm cho CẢ `vungVat` LẪN `deltaFiles`: trước T2 hai chỗ lọc bằng hai mệnh đề
// khác nhau (`deltaFiles` lọc thô theo tiền tố `_acceptance/`), và hai khuôn thì trôi.
const HO_SO_VAN_BAN_GLOBS = ['_acceptance/*/**/*.md', '_acceptance/*/**/*.jsonl'];
const t1SkipGlobs = (() => {
  try { const v = resolveConfigList(configText, 'risk_tiers.t1_skip_globs'); return Array.isArray(v) ? v : []; }
  catch { return []; }   // repo không khai → chỉ bỏ văn bản hồ sơ
})();
const ngoaiVatGlobs = [...t1SkipGlobs, ...HO_SO_VAN_BAN_GLOBS];
const ngoaiVatRes = ngoaiVatGlobs.map(globToRe);
const pathsKhaiRes = evals.flatMap(e => (Array.isArray(e.paths) ? e.paths : [])).map(globToRe);
const laNgoaiVat = f => !pathsKhaiRes.some(re => re.test(f)) && ngoaiVatRes.some(re => re.test(f));
// NGOAI-VAT>>>
const diffTatCa = git('diff', '--name-only', `${diffBase}..HEAD`).split('\n').filter(Boolean);
const vungVat = diffTatCa.filter(f => !laNgoaiVat(f));
// ── ĐỔI KHUÔN (owner quyết 14/09, STOP-PATCHING) ────────────────────────────
// Lớp «writer/reader trôi» tái phát BA lần trong hai lượt sửa: `laNgoaiVat` thiếu vế
// eval.paths ở bên đọc · hai bản `globToRe` trôi ở ký tự `?` · `laFileDo` bỏ quên
// `_acceptance/config.yaml`. Gốc chung: bên VIẾT đã tính xong vùng vật rồi vẫn chỉ
// truyền MẪU GLOB, buộc bên ĐỌC chép hàm khớp và DỰNG LẠI vị từ — mỗi vế mới thêm ở
// đây là một cơ hội bên kia không theo.
//
// Nay truyền KẾT QUẢ ĐÃ TÍNH: bên đọc chỉ kiểm thuộc-tập, không khớp glob nữa.
// `ngoaiVatFiles` = tệp TRONG DIFF bị loại.
//
// SỬA KHUNG (owner quyết 14/09 sau DỪNG-VÁ lần hai, lượt chấm 3). Bản ĐỔI KHUÔN đầu
// nói «finding ở tệp NGOÀI diff tự nhiên đi tiếp — không cần vế miễn trừ nào». Sai:
// nó gộp hai lớp khác hẳn nhau. Tệp SẢN PHẨM ngoài diff PHẢI đi tiếp (lớp liên-file);
// tệp KHÔNG-PHẢI-VẬT ngoài diff (docs/**, CLAUDE.md, gap-probe.md chưa commit) phải
// IM — và một TẬP tính trên diff không trả lời được câu hỏi đó, vì miền câu hỏi là MỞ
// (finder báo được bất kỳ đường dẫn nào).
//
// Nên chia theo MIỀN, không theo cơ chế: miền ĐÓNG (tệp có trong diff) trả lời bằng
// KẾT QUẢ đã tính — không có vị từ nào để trôi; miền MỞ (mọi đường dẫn khác) trả lời
// bằng MẪU. Rủi ro trôi writer/reader mà ĐỔI KHUÔN sinh ra để chặn nay đã có răng
// canh: VV4b so hai bản khớp glob trên ma trận 9 ô, VV4 rút hàm của bên đọc từ nguồn.
// `diffFiles` là thứ cho bên đọc biết mình đang ở miền nào.
const ngoaiVatFiles = diffTatCa.filter(laNgoaiVat);
// `fileDoTrongDiff` = tệp trong vùng vật được coi là MÃ ĐO. Định nghĩa sống ở ĐÂY, một
// chỗ: mẫu tệp kiểm thử repo khai (hoặc mặc định engine) · mã trong thư mục hồ sơ ·
// `_acceptance/config.yaml` (nơi mọi `cmd` của eval thật sự sống) · tệp trong eval.paths.
// KHONG co khoa config cho tap nay — hop dong vong nay khai dich danh «khoa config moi
// cho vung vat» la Out of scope, va toi da mo lai no trong mot luot SUA (luot cham 2 bat).
// Mau co dinh trong engine; kho tieu thu dat rang o cho la van duoc phu boi hai ve duoi
// (moi tep khong .md/.jsonl trong thu muc ho so · tep khai trong eval.paths).
const DO_GLOBS = ['tests/**', '**/*.test.*', '**/*.spec.*', '**/spec/**', '**/__tests__/**'];
const doRes = DO_GLOBS.map(globToRe);
const laFileDo = f => doRes.some(re => re.test(f))
  || f === '_acceptance/config.yaml'
  || (/^_acceptance\/[^/]+\//.test(f) && !/\.(md|jsonl)$/.test(f))
  || pathsKhaiRes.some(re => re.test(f));
const fileDoTrongDiff = vungVat.filter(laFileDo);
// `coverageFiles` = tệp (trong diff) được ÍT NHẤT một eval khai `paths`. Cùng phép chia
// miền như trên: bên đọc dùng tập này cho tệp TRONG diff và khớp `eval.paths` cho tệp
// ngoài diff. Không chia miền thì một finding trên tệp ĐÃ được eval phủ nhưng ngoài
// diff bị đếm là «ngoài vùng phủ», và cờ cụm bật GIẢ — một lượt gọi người giả ở Cổng
// Bằng chứng (lượt chấm 3 dính đúng ca này: cụm 3/12, cả ba tệp đều ngoài diff).
const coverageFiles = diffTatCa.filter(f => pathsKhaiRes.some(re => re.test(f)));
const coEvalPaths = evals.some(e => Array.isArray(e.paths) && e.paths.length);
console.error(`s4-args: vùng vật ${vungVat.length}/${diffTatCa.length} tệp (ngoài-vật: ${ngoaiVatGlobs.length} mẫu khớp, trong đó ${t1SkipGlobs.length} do repo khai)`);
// Hai ca «vùng vật rỗng» KHÁC HẲN nhau và phải nói ra khác nhau — nếu không, một mốc
// so SAI trông y hệt một vòng chỉ-đổi-tài-liệu, và làn chấm bỏ finder vì lý do sai:
//   · diff TỔNG rỗng  → mốc so trùng HEAD (hay gặp khi làm thẳng trên nhánh chính,
//     vì merge-base(main, HEAD) = HEAD). Đây là HẠ TẦNG neo sai, không phải sự thật
//     về vật — fail-LOUD, người truyền --diff-base tường minh rồi chạy lại.
//   · diff tổng KHÁC rỗng mà vùng vật rỗng → vòng chỉ chạm tài liệu/hồ sơ. Hợp lệ.
if (!diffTatCa.length) {
  // Phân biệt AI nói ra mốc so. Người KHAI tường minh `--diff-base` là hành động có chủ
  // đích (ca thật: bộ đo chỉ cần tệp args để rút chuỗi lệnh, không cần vật) → nói một
  // dòng rồi đi tiếp. Mốc TỰ TÍNH từ merge-base mà ra rỗng thì không ai chọn nó cả —
  // đó là hạ tầng neo sai, fail-LOUD.
  if (flags['diff-base']) {
    console.error(`s4-args: diff rỗng — mốc so «${diffBase}» do người khai tường minh trùng HEAD; làn tìm-lỗi sẽ không có vật để soi.`);
  } else {
    console.error(`s4-args: DIFF RỖNG — mốc so TỰ TÍNH «${diffBase}» trùng HEAD, nên không có vật nào để chấm.`);
    console.error('s4-args: làm thẳng trên nhánh chính thì merge-base(nhánh-chính, HEAD) = HEAD — truyền --diff-base <mốc trước vòng> rồi chạy lại.');
    process.exit(2);
  }
}
if (!vungVat.length) console.error(`s4-args: vùng vật rỗng nhưng diff có ${diffTatCa.length} tệp — vòng này chỉ chạm tài liệu/hồ sơ; làn tìm-lỗi sẽ không spawn (đúng thiết kế).`);
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
let carriedFindings;
let deltaForArgs;
if (round >= 2 && !flags['carry-anchor'] && !flags['no-carry']) {
  die(`round ${round} (≥2) phải khai tường minh: --carry-anchor <sha dòng round trước> (tính carry P1) hoặc --no-carry (full re-run) — «quên carry» đốt round là lớp lỗi có đo`);
}
if (flags['carry-anchor']) {
  const anchor = git('rev-parse', flags['carry-anchor']);
  // T2: CÙNG bộ lọc với vungVat. Bản trước lọc thô theo tiền tố `_acceptance/` nên mã
  // răng và fixture khai trong eval.paths rơi khỏi delta → eval của chúng được carry
  // màu xanh cũ dù vật đo đã đổi (fail-open).
  const deltaFiles = git('diff', '--name-only', `${anchor}..HEAD`).split('\n').filter(f => f && !laNgoaiVat(f));
  // K8 (gom-duc-ket-2-10-0, AC-10): danh sách này cũng là thứ làn review «conventions» cần —
  // file CHỮ không đổi so round trước thì không phải chấm lại (13/34 finding của một vòng là
  // góp ý về chữ lặp lại mỗi round). Cùng MỘT nguồn với carry-forward P1, không tính lần hai.
  deltaForArgs = deltaFiles;
  const cpArgs = ['--run-log', runLogPath, '--evals', path.join(ws, 'evals.yaml'), '--contract', contractPath, '--round', String(round), '--ag-root', agRoot];
  cpArgs.push(...(deltaFiles.length ? ['--delta-files', deltaFiles.join(',')] : ['--no-delta']));
  try {
    const out = execFileSync(process.execPath, [path.join(HERE, 'carry-plan.mjs'), ...cpArgs], { encoding: 'utf8' });
    const plan = JSON.parse(out);
    if (Array.isArray(plan.carriedEvals) && plan.carriedEvals.length) carriedEvals = plan.carriedEvals;
    if (Array.isArray(plan.carriedFindings) && plan.carriedFindings.length) carriedFindings = plan.carriedFindings;  // T5
  } catch (e) {
    const code = e && typeof e.status === 'number' ? e.status : null;
    if (code === 3) {
      // Exit 3 = «EVAL không carry», KHÔNG phải «không có gì để đọc». carry-plan vẫn in
      // JSON trên stdout vì carry FINDING (T5) không dựa vào sha — bản trước bỏ luôn cả
      // hai, nên một sổ thiếu sha làm mọi finding ngoài hợp đồng bị chấm lại từ đầu.
      let nFinding = 0;
      try {
        const p3 = JSON.parse(String(e.stdout || ''));
        if (Array.isArray(p3.carriedFindings) && p3.carriedFindings.length) { carriedFindings = p3.carriedFindings; nFinding = p3.carriedFindings.length; }
      } catch { /* stdout rỗng (carry-plan đời cũ) → không carry finding, đúng mặc định an toàn */ }
      console.error(`s4-args: carry-plan exit 3 — run-log cũ chưa có sha, EVAL chạy lại toàn bộ (mặc định an toàn); carry finding vẫn giữ: ${nFinding}`);
    }
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
// P3 (round ≥2): panel memo theo inputsHash — input có trên đĩa mà không đọc được (thư mục, quyền) → hash mới, judge fresh
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
  ...(evalsNotRun.length ? { evalsNotRun } : {}),
  suiteCommands,
  diffBase,
  repoRoot: root,
  personasPath: path.join(agRoot, 'skills/acceptance/references/judge-personas.md'),
  templatePath: path.join(agRoot, 'skills/acceptance/references/evidence-report-template.md'),
  toolKillRule: fs.readFileSync(path.join(agRoot, 'skills/acceptance/references/tool-kill-rule.md'), 'utf8'),
  contractPath,
  invokedAt,
  invokedSha,
  vungVat,
  ngoaiVatGlobs,        // giữ để người đọc hồ sơ biết mẫu nào đang áp (KHÔNG còn là đầu vào phép khớp của bên đọc)
  ngoaiVatFiles,
  diffFiles: diffTatCa,
  fileDoTrongDiff,
  coverageFiles,
  coEvalPaths,
  evalsHash,
  runBaseline,
  ...(carriedAnalyst ? { carriedAnalyst } : {}),
  ...(carriedEvals ? { carriedEvals } : {}),
  ...(carriedFindings ? { carriedFindings } : {}),
  ...(deltaForArgs && deltaForArgs.length ? { deltaFiles: deltaForArgs } : {}),
  ...(carriedPanels ? { carriedPanels } : {}),
  ...(models ? { models } : {}),
};

const json = JSON.stringify(args, null, 2);
if (flags.out) { fs.writeFileSync(flags.out, json); console.error(`s4-args: đã sinh ${flags.out} (round ${round}, ${evals.length} eval, ${suiteCommands.length} suite)`); }
else process.stdout.write(json + '\n');
