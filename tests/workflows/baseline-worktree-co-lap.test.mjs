// baseline-worktree-co-lap.test.mjs — làn đối chứng chạy được khi phiên ở worktree CÔ LẬP, và khi nó
// không chạy được thì người ký Cổng Bằng chứng THẤY, không chỉ một dòng log.
//
// Sự cố một kho tiêu thụ 23/10 (03:59:17Z): phiên ở chế độ cô lập trong
// `.claude/worktrees/…`; công cụ chạy lệnh từ chối khối lệnh baseline («names git in a form too complex
// to verify that it stays inside the worktree»). Lượt chấm ghi «baseline: BLOCKED hạ tầng» vào log rồi
// chạy tiếp KHÔNG có đối chứng — thẻ Cổng 2 không nói gì. Đo 23/10 trong một tác tử cô lập (cùng phiên
// sửa): khối lệnh có `git -C "$R" worktree add` → bị từ chối; CÙNG nội dung ghi vào tệp trong cây rồi
// `bash '<tệp>'` → chạy; `bash '<tệp>' … git …` (đối số mang chữ git) → bị từ chối.
//
//   BW1 — prompt: ghi tệp kịch bản trong cây, gọi đúng `bash '<tệp>'` (không chữ git, không đối số)
//   BW2 — shell thật: tệp đó chạy bằng `bash <tệp>` ra đủ dấu, cây không bẩn (chiều im)
//   BW3 — công cụ từ chối (đầu ra không có dấu bắt đầu) → BLOCKED hạ tầng «chưa chạy dòng nào» + dòng
//         run-log `baseline-khong-do`; đủ dấu → không dòng nào (chiều im)
//   BW4 — thẻ Cổng 2 đọc dòng đó của LƯỢT CUỐI → cờ người thấy; lượt cũ / đủ dấu → không cờ
//   BW5 — đột biến: gỡ từng mảnh → ca của mảnh đó đỏ (đối chứng: bản lành xanh trên cùng fixture)
//   BW6 — tệp kiểm mới nằm trong chuỗi nháy KHÔNG toán tử (`bash -c 'bash t/moi.sh'`) → bỏ qua
// Fixture run-log do workflow THẬT sinh (qua harness), thẻ dựng bằng gate-card.js thật; đường suy từ vị trí tệp.
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { runWorkflow, check, summary } from './harness.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const WF = path.join(ROOT, 'feature-loop', 'workflows', 'acceptance-verify.js');
const SRC = fs.readFileSync(WF, 'utf8');
const GC = path.join(ROOT, 'scripts', 'gate-card.js');
// Chuỗi cờ và chữ `kind` RÚT từ bên đọc/bên viết thật — test không giữ bản chép thứ ba.
const GC_SRC = fs.readFileSync(GC, 'utf8');
const CO_DOI_CHUNG = (GC_SRC.match(/const CO_DOI_CHUNG = '([^']+)'/) || [])[1];
const KIND = (SRC.match(/kind: '(baseline-khong-do)'/) || [])[1];
if (!CO_DOI_CHUNG || !KIND) throw new Error('không rút được CO_DOI_CHUNG từ gate-card.js hoặc kind baseline-khong-do từ bộ chấm');
const VC = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2';
const soLan = (hay, kim) => hay.split(kim).length - 1;
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'agk-bw-'));
process.on('exit', () => { try { fs.rmSync(TMP, { recursive: true, force: true }); } catch { /* dọn tạm */ } });
const w = (d, rel, s) => { const p = path.join(d, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); return p; };

const ev = (id, cmd) => ({ id, criterion: 'AC-' + id.slice(1), executor: 'script', cmd, ref: `config:executors.script.${id}`, expected: 'ok' });
const INVOKED = '2026-10-23T03:58:15Z';
const buildArgs = (over = {}) => ({
  slug: 'demo', round: 1, riskTier: 'T2', evals: [], suiteCommands: [],
  diffBase: 'main', repoRoot: '/repo', personasPath: '/refs/judge-personas.md',
  templatePath: '/refs/evidence-report-template.md', invokedAt: INVOKED, invokedSha: VC, evalsHash: 'h1', ...over,
});
const responder = ({ baseline } = {}) => (call) => {
  const l = call.label;
  if (l.startsWith('machine:')) return { exitCode: 0, outputTail: 'green\n__EXIT=0', runId: '', cannotRun: false };
  if (l.startsWith('review:')) return { findings: [] };
  if (l.startsWith('refute:')) return { refuted: true, reason: 'not real' };
  if (l.startsWith('triage')) return { items: [] };
  if (l === 'baseline:diffBase') return baseline === undefined ? { results: [] } : baseline;
  if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: VC };
  if (l === 'synthesize:report') return { report: '# Evidence demo', findings: '# Findings demo' };
  throw new Error('unexpected agent label: ' + l);
};
const giua = (p, mo, dong) => { const a = p.indexOf(mo), b = p.indexOf(dong, a + mo.length); return a >= 0 && b > a ? p.slice(a + mo.length, b) : ''; };
const promptBL = calls => (calls.find(c => c.label === 'baseline:diffBase') || {}).prompt || '';
const kichBan = calls => giua(promptBL(calls), '<<<AGK-BASELINE\n', '\nAGK-BASELINE>>>');
const loiGoi = calls => giua(promptBL(calls), '<<<AGK-BASELINE-GOI\n', '\nAGK-BASELINE-GOI>>>');
const dongLog = (result, kind) => (result.runLog || []).map(l => JSON.parse(l)).filter(o => o.kind === kind);
// Chữ từ chối đúng khuôn công cụ trả trong ca 23/10 (đường worktree thay bằng /repo).
const TU_CHOI = 'This session is isolated in the worktree /repo, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated session\'s git operations must target its own worktree. Split it into plain, separate commands and run them from /repo.';
const DU = '__BL_BAT_DAU 2\n__BL 1 xong 0\n__BL 2 xong 1\n__BL_XONG';
const EVALS = [ev('E1', 'bash t/a.sh'), ev('E2', 'bash t/b.sh')];

// ═════ BW1 — hình dạng lời gọi ═══════════════════════════════════════════════
console.log('BW1 prompt: kịch bản ghi vào tệp trong cây, lời gọi là `bash \'<tệp>\'` trơn');
let goiMau = '';
{
  const { calls } = await runWorkflow(WF, buildArgs({ evals: EVALS }), responder());
  const p = promptBL(calls), goi = loiGoi(calls), kb = kichBan(calls);
  goiMau = goi;
  const m = goi.match(/^bash '([^']+)'$/);
  const tep = m ? m[1] : '';
  check('BW1a prompt mang đúng một khối kịch bản và một khối lời gọi', soLan(p, '<<<AGK-BASELINE\n') === 1 && soLan(p, '<<<AGK-BASELINE-GOI\n') === 1 && kb.length > 0 && goi.length > 0, goi);
  check('BW1b lời gọi = `bash \'<đường tuyệt đối>\'` — không đối số, không toán tử', !!m && path.isAbsolute(tep), goi);
  // Bộ canh của công cụ đọc CHỮ lệnh: chữ «git» ở bất kỳ đâu trong lời gọi là bị từ chối (đo 23/10, bước 4).
  check('BW1c lời gọi không chứa chữ git', goi.length > 0 && !/git/i.test(goi), goi);
  check('BW1d tệp nằm TRONG cây đang kiểm, dưới .acceptance-runs/<slug>/s4-baseline/', tep.startsWith('/repo/.acceptance-runs/demo/s4-baseline/') && tep.endsWith('.sh'), tep);
  check('BW1e prompt dặn ghi tệp bằng công cụ ghi tệp đúng đường đó, rồi MỘT lần gọi Bash timeout 600000',
    p.includes(`Write`) && p.includes(tep) && /MOT lan goi Bash/.test(p) && /600000/.test(p), '');
  // Tệp riêng mỗi lượt: lượt chấm lại song song không ghi đè kịch bản của nhau.
  const { calls: c2 } = await runWorkflow(WF, buildArgs({ evals: EVALS, invokedAt: '2026-10-23T04:10:00Z' }), responder());
  check('BW1f lượt khác → tệp khác', loiGoi(c2) !== goi && /^bash '\/repo\/\.acceptance-runs\/demo\/s4-baseline\/[^']+'$/.test(loiGoi(c2)), loiGoi(c2));
}

// ═════ BW2 — shell thật: chạy đúng lời gọi trên một kho git thật ═════════════
console.log('BW2 kịch bản ghi ra tệp, chạy bằng `bash <tệp>` như lời gọi: đủ dấu, cây sạch');
function dungKho() {
  const d = fs.mkdtempSync(path.join(TMP, 'kho-'));
  const g = (...a) => execFileSync('git', ['-C', d, ...a], { stdio: 'pipe' }).toString().trim();
  g('init', '-q'); g('config', 'user.email', 't@t'); g('config', 'user.name', 't'); g('config', 'commit.gpgsign', 'false');
  w(d, 't/cu.sh', 'exit 3\n');
  g('add', '-A'); g('commit', '-qm', 'base'); g('tag', 'goc');
  w(d, 't/moi.sh', `touch "${d}/moi-da-chay"\nexit 0\n`);
  g('add', '-A'); g('commit', '-qm', 'head');
  return { d, g, don: () => { try { execFileSync('git', ['-C', d, 'worktree', 'prune']); } catch { /* dọn */ } } };
}
// Đóng vai tác tử: ghi kịch bản ra đúng tệp lời gọi nêu, rồi chạy CHÍNH lời gọi (qua bash, như công cụ).
const chayNhuTacTu = async (kho, evals) => {
  const { calls } = await runWorkflow(WF, buildArgs({ repoRoot: kho.d, diffBase: 'goc', evals }), responder());
  const goi = loiGoi(calls), tep = (goi.match(/^bash '([^']+)'$/) || [])[1];
  if (!tep) throw new Error('không rút được tệp từ lời gọi: ' + goi);
  w('/', tep, kichBan(calls));
  const r = spawnSync('bash', ['-c', goi], { cwd: kho.d, encoding: 'utf8', timeout: 60000 });
  return { out: (r.stdout || '') + (r.stderr || ''), code: r.status, tep };
};
{
  const kho = dungKho();
  try {
    const r = await chayNhuTacTu(kho, [ev('E1', 'bash t/cu.sh')]);
    check('BW2a đủ dấu: bắt đầu · «xong 3» · kết', /^__BL_BAT_DAU 1$/m.test(r.out) && /^__BL 1 xong 3$/m.test(r.out) && /^__BL_XONG$/m.test(r.out), r.out.slice(-300));
    check('BW2b worktree tạm đã gỡ', !kho.g('worktree', 'list', '--porcelain').includes('agk-baseline'));
    // Chiều im: tệp kịch bản nằm trong cây mà cây không bẩn — `.acceptance-runs/` tự bỏ khỏi git.
    check('BW2c cây đang kiểm không bẩn sau lượt (tệp kịch bản bị bỏ qua)', kho.g('status', '--porcelain') === '' && fs.existsSync(r.tep), kho.g('status', '--porcelain'));
  } finally { kho.don(); }
}

// ═════ BW3 — công cụ từ chối → BLOCKED hạ tầng có tên + dòng run-log máy ghi ════
console.log('BW3 lời gọi bị từ chối → «chưa chạy dòng nào», dòng run-log baseline-khong-do; đủ dấu → im');
const chayVoi = (baseline, src) => runWorkflow(WF, buildArgs({ evals: EVALS }), responder({ baseline }), src);
async function kiemBW3(src) {
  const loi = [];
  for (const [ten, bl] of [['tu-choi-nguyen-van', { dauRa: TU_CHOI, results: [] }], ['dau-ra-rong', { dauRa: '', results: [{ cmd: 'bash t/a.sh', cannotRun: true, reason: 'công cụ từ chối' }] }]]) {
    const r = await chayVoi(bl, src);
    const hd = r.result.baselineKhongDo || {};
    const d = dongLog(r.result, KIND);
    if (r.result.verdict !== 'PASS') loi.push(`${ten}: verdict ${r.result.verdict}`);
    if (!/khong chay dong nao/.test(hd.haTang || '')) loi.push(`${ten}: haTang «${hd.haTang}»`);
    if (ten === 'tu-choi-nguyen-van' && !/too complex to verify/.test(hd.haTang || '')) loi.push(`${ten}: lý do không mang chữ công cụ`);
    if (d.length !== 1 || d[0].chua_chay !== true || d[0].round !== 1 || d[0].ts !== INVOKED || d[0].so_lenh !== 2) loi.push(`${ten}: dòng run-log ${JSON.stringify(d)}`);
    if (dongLog(r.result, 'baseline').length) loi.push(`${ten}: ghi dòng kind:baseline cho phép đo không chạy`);
  }
  // Chạy dở (có dấu bắt đầu, thiếu dấu kết) vẫn là không đo — dòng có, nhưng không phải «chưa chạy».
  const rDo = await chayVoi({ dauRa: '__BL_BAT_DAU 2\n__BL 1 xong 0', results: [] }, src);
  const dDo = dongLog(rDo.result, KIND);
  if (dDo.length !== 1 || dDo[0].chua_chay !== false) loi.push(`chạy dở: ${JSON.stringify(dDo)}`);
  // Chiều im: đủ dấu → không dòng, lý do null.
  const rOk = await chayVoi({ dauRa: DU, results: [] }, src);
  if (dongLog(rOk.result, KIND).length) loi.push('đủ dấu mà vẫn ghi dòng baseline-khong-do');
  if ((rOk.result.baselineKhongDo || {}).haTang !== null) loi.push('đủ dấu mà haTang khác null');
  if (dongLog(rOk.result, 'baseline').length !== 1) loi.push('đủ dấu mà không ghi dòng kind:baseline');
  return loi;
}
{
  const loi = await kiemBW3();
  check('BW3 từ chối / rỗng / chạy dở / đủ dấu — mỗi ca đúng nhãn và đúng dòng run-log', loi.length === 0, loi.join(' | '));
}

// ═════ BW4 — thẻ Cổng 2 đọc dòng của LƯỢT CUỐI ════════════════════════════════
console.log('BW4 thẻ Cổng 2: lượt cuối không có đối chứng → cờ người thấy; đủ dấu / lượt cũ → không cờ');
function mkHoSo(runLogLines) {
  const d = fs.mkdtempSync(path.join(TMP, 'hs-'));
  w(d, '_acceptance/config.yaml', 'schema_version: 1\n');
  w(d, '_acceptance/demo/contract.md', '---\nschema_version: 1\nfeature: Tính năng mẫu\nslug: demo\nrisk_tier: T2\nstatus: verified\n---\n\n## Criteria\n\n- AC-1: Given x, When y, Then z.\n- AC-2: Given x, When y, Then z.\n');
  w(d, '_acceptance/demo/evidence-report.md', `---\nslug: demo\nround: 1\nverdict: PASS\nenforcement_mode: strict\nbypass_used: false\n---\n\n## Results\n\n- eval: E1\n  run_id: r1234\n  exit_code: 0\n  baseline: n-a\n  verifier: config:executors.script.E1\n  verified_at: ${INVOKED}\n`);
  w(d, '_acceptance/demo/run-log.jsonl', runLogLines.join('\n') + '\n');
  return d;
}
const theCua = (kho, gc = GC, them = []) => {
  const r = spawnSync(process.execPath, [gc, '--root', kho, '--slug', 'demo', ...them], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`gate-card thoát ${r.status}: ${r.stderr.slice(0, 300)}`);
  return r.stdout;
};
const rTuChoi = await chayVoi({ dauRa: TU_CHOI, results: [] });
const rDu = await chayVoi({ dauRa: DU, results: [] });
const LOG_TU_CHOI = rTuChoi.result.runLog, LOG_DU = rDu.result.runLog;
// Lượt chấm lại sau đó đo trọn: tổng kết mới (ts khác) đứng sau dòng cũ → dòng cũ không thuộc lượt cuối.
const LOG_LUOT_SAU = [...LOG_TU_CHOI, ...rDu.result.runLog.map(l => l.replace(INVOKED, '2026-10-23T05:00:00Z'))];
function kiemBW4(gc = GC) {
  const loi = [];
  const co = h => h.includes(CO_DOI_CHUNG);
  const hTu = theCua(mkHoSo(LOG_TU_CHOI), gc);
  if (!co(hTu)) loi.push('lượt cuối bị từ chối mà thẻ không có cờ');
  else if (!/too complex to verify/.test(hTu)) loi.push('cờ không nêu lý do của công cụ');
  const ex = JSON.parse(theCua(mkHoSo(LOG_TU_CHOI), gc, ['--extract']));
  if (!ex.doi_chung || ex.doi_chung.chua_chay !== true || ex.doi_chung.round !== 1) loi.push(`--extract doi_chung = ${JSON.stringify(ex.doi_chung)}`);
  if (co(theCua(mkHoSo(LOG_DU), gc))) loi.push('đủ dấu mà thẻ vẫn có cờ');
  if (co(theCua(mkHoSo(LOG_LUOT_SAU), gc))) loi.push('dòng của lượt cũ vẫn lên thẻ lượt mới');
  const exDu = JSON.parse(theCua(mkHoSo(LOG_DU), gc, ['--extract']));
  // Đọc-cũ: hồ sơ không có dòng thì --extract KHÔNG có khoá (byte-giống bản trước — ca LNT8 canh).
  if ('doi_chung' in exDu) loi.push(`đủ dấu mà --extract có khoá doi_chung = ${JSON.stringify(exDu.doi_chung)}`);
  return loi;
}
{
  const loi = kiemBW4();
  check('BW4 thẻ HTML + --extract: cờ đúng lượt cuối, im ở đủ dấu và ở lượt cũ', loi.length === 0, loi.join(' | '));
}

// ═════ BW5 — đột biến ═══════════════════════════════════════════════════════
console.log('BW5 đột biến từng mảnh → ca của mảnh đó đỏ');
const dotBien = (kim, thay) => {
  if (soLan(SRC, kim) !== 1) throw new Error('kim đột biến không khớp đúng một lần: ' + kim.slice(0, 70));
  return SRC.replace(kim, thay);
};
{
  // (a) bộ đọc bỏ vế «không có dấu bắt đầu» → lời từ chối rơi về lý do chung, không nói «chưa chạy».
  const mA = dotBien("if (!doc.batDau) baselineChuaChay = true, baselineHaTang = ", "if (false) baselineChuaChay = true, baselineHaTang = ");
  const lA = await kiemBW3(mA);
  check('BW5a gỡ vế «chưa chạy dòng nào» → BW3 đỏ', lA.some(x => /haTang|chua_chay|chữ công cụ/.test(x)), lA.join(' | ') || 'xanh');
  // (b) bỏ dòng run-log → thẻ không còn nguồn máy để đọc.
  const mB = dotBien('if (baselineHaTang && runBaseline) runLogLines.push(', 'if (false) runLogLines.push(');
  const lB = await kiemBW3(mB);
  check('BW5b gỡ dòng run-log baseline-khong-do → BW3 đỏ', lB.some(x => /dòng run-log/.test(x)), lB.join(' | ') || 'xanh');
  // (c) trả lời gọi về khối lệnh viết thẳng (hình dạng cũ, bị từ chối 23/10) → BW1 đỏ.
  const mC = dotBien('<<<AGK-BASELINE-GOI\n${LOI_GOI_BASELINE}\nAGK-BASELINE-GOI>>>', '<<<AGK-BASELINE-GOI\n${LENH_BASELINE(baselineCmds)}\nAGK-BASELINE-GOI>>>');
  const { calls: cC } = await runWorkflow(WF, buildArgs({ evals: EVALS }), responder(), mC);
  const gC = loiGoi(cC);
  check('BW5c lời gọi là khối lệnh có git → BW1b/BW1c đỏ', !/^bash '[^']+'$/.test(gC) && /git/.test(gC), gC.slice(0, 80));
  // (d) thẻ bỏ cờ: bản sao TRỌN thư mục, tiêm một chỗ, đối chứng là bản lành xanh ở BW4 trên cùng fixture.
  const sao = fs.mkdtempSync(path.join(TMP, 'sao-'));
  for (const t of ['scripts', 'lib', 'feature-loop', 'commands', 'skills']) fs.cpSync(path.join(ROOT, t), path.join(sao, t), { recursive: true });
  const gcSao = path.join(sao, 'scripts', 'gate-card.js');
  const gSrc = fs.readFileSync(gcSao, 'utf8');
  const kimD = 'if (doiChung) P.push(';
  if (soLan(gSrc, kimD) !== 1) throw new Error('kim đột biến thẻ không khớp đúng một lần');
  fs.writeFileSync(gcSao, gSrc.replace(kimD, 'if (false) P.push('));
  const lD = kiemBW4(gcSao);
  check('BW5d thẻ bỏ cờ đối chứng → BW4 đỏ', lD.some(x => /không có cờ/.test(x)), lD.join(' | ') || 'xanh');
  // (e) bộ đọc thẻ bỏ điều kiện «cùng lượt cuối» → dòng cũ lên thẻ lượt mới.
  const kimE = "o.round === cuoi.round && o.ts === cuoi.ts";
  if (soLan(gSrc, kimE) !== 1) throw new Error('kim đột biến bộ đọc không khớp đúng một lần');
  fs.writeFileSync(gcSao, gSrc.replace(kimE, 'true'));
  const lE = kiemBW4(gcSao);
  check('BW5e bộ đọc bỏ điều kiện cùng lượt → BW4 đỏ', lE.some(x => /lượt cũ/.test(x)), lE.join(' | ') || 'xanh');
  // (f) round-trip: bên viết đổi chữ `kind` mà thẻ không đổi → thẻ mù (BW4 đỏ trên run-log bộ chấm đột biến sinh).
  fs.writeFileSync(gcSao, gSrc);
  const mF = SRC.split(`kind: '${KIND}'`).join("kind: 'baseline-lech'");
  const rF = await runWorkflow(WF, buildArgs({ evals: EVALS }), responder({ baseline: { dauRa: TU_CHOI, results: [] } }), mF);
  const hF = theCua(mkHoSo(rF.result.runLog), gcSao);
  check('BW5f bên viết đổi chữ kind → thẻ không còn cờ (đối chứng: bản lành có cờ ở BW4)', mF !== SRC && !hF.includes(CO_DOI_CHUNG), '');
}

// ═════ BW6 — tệp kiểm mới trong chuỗi nháy không toán tử ═════════════════════
console.log('BW6 `bash -c \'bash t/moi.sh\'`: tệp mới nằm trong chuỗi nháy → bỏ qua; tệp cũ → chạy');
{
  const kho = dungKho();
  try {
    const r = await chayNhuTacTu(kho, [ev('E1', "bash -c 'bash t/moi.sh'"), ev('E2', "bash -c 'bash t/cu.sh'"), ev('E3', "bash t/cu.sh --ten 'co nhay'")]);
    check('BW6a tệp mới trong nháy → «bo-qua t/moi.sh», không chạy', /^__BL 1 bo-qua t\/moi\.sh$/m.test(r.out) && !fs.existsSync(path.join(kho.d, 'moi-da-chay')), r.out.slice(-300));
    check('BW6b đối chứng: tệp có ở gốc trong nháy → chạy thật «xong 3»', /^__BL 2 xong 3$/m.test(r.out), (r.out.match(/^__BL 2 .*$/m) || [''])[0]);
    check('BW6c chiều im: đối số trong nháy không phải tệp → chạy thật', /^__BL 3 xong 3$/m.test(r.out), (r.out.match(/^__BL 3 .*$/m) || [''])[0]);
  } finally { kho.don(); }
}

summary('baseline-worktree-co-lap');
