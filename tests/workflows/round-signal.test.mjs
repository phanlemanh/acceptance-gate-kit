// round-signal.test.mjs — hồ sơ cham-dung-cay-dung-cho-dung (AC-8, AC-9, AC-12).
// Vắng mặt là tín hiệu (dòng vang-mat + verdict không sạch), mỗi lượt một dòng
// round-tally máy-đọc-được (round-trip qua bộ đọc THẬT round-tally-read.mjs),
// và hạ-tầng-hỏng (cd-fail / exit 127) đi nhánh BLOCKED chứ không giả dạng FAIL
// sản phẩm — trong khi exit 1 thường vẫn là FAIL thật (phân loại không nuốt lỗi).
import { fileURLToPath } from 'node:url';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { runWorkflow, check, summary } from './harness.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WF = path.join(HERE, '..', '..', 'feature-loop', 'workflows', 'acceptance-verify.js');
const READER = path.join(HERE, '..', '..', 'feature-loop', 'scripts', 'round-tally-read.mjs');
const VC = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2';

const baseArgs = (over = {}) => ({
  slug: 'demo',
  round: 1,
  riskTier: 'T2',
  evals: [
    { id: 'E1', criterion: 'AC-1', executor: 'test', cmd: 'pnpm test', ref: 'config:executors.test.api', expected: 'pass' },
    { id: 'E2', criterion: 'AC-2', executor: 'test', cmd: 'pnpm test', ref: 'config:executors.test.api', expected: 'pass' },
  ],
  suiteCommands: ['npm run build'],
  diffBase: 'main',
  repoRoot: '/repo',
  personasPath: '/refs/judge-personas.md',
  templatePath: '/refs/evidence-report-template.md',
  invokedAt: '2026-08-29T10:00:00Z',
  invokedSha: VC,
  ...over,
});

function responder(overrides = {}) {
  return (call) => {
    const l = call.label;
    for (const [prefix, v] of Object.entries(overrides)) {
      if (l.startsWith(prefix)) return typeof v === 'function' ? v(call) : v;
    }
    if (l.startsWith('machine:')) return { exitCode: 0, outputTail: 'all green', runId: '', cannotRun: false };
    if (l.startsWith('judge:')) return { verdict: 'PASS', rationale: 'ok' };
    if (l.startsWith('review:')) return { findings: [] };
    if (l.startsWith('refute:')) return { refuted: true, reason: 'not real' };
    if (l.startsWith('baseline:')) return { results: [] };
    if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: VC };
    if (l === 'synthesize:report') return { report: '# Evidence demo', findings: '# Findings demo' };
    throw new Error('unexpected agent label: ' + l);
  };
}
const logLines = (result) => (result.runLog || []).map(l => JSON.parse(l));

console.log('RS1 vang-mat: agent chet phai DE LAI DONG va verdict khong sach');
{
  // moi agent cua lenh 'pnpm test' chet (null) — 2 eval E1/E2 mat ket qua
  const { result } = await runWorkflow(WF, baseArgs(), responder({ 'machine:pnpm test': () => null }));
  const vm = logLines(result).filter(l => l.kind === 'vang-mat');
  check('RS1 verdict BLOCKED (khong PASS sach)', result.verdict === 'BLOCKED', result.verdict);
  check('RS1 dong vang-mat cho E1+E2 mang round', vm.length === 2 && vm.every(l => l.round === 1) && ['E1', 'E2'].every(id => vm.some(l => l.evalId === id)), JSON.stringify(vm));
  check('RS1 dong vang-mat co reason', vm.every(l => typeof l.reason === 'string' && l.reason.length > 0));
  // doi chung duong: du ket qua → 0 dong vang-mat, verdict nhu cu
  const { result: r2 } = await runWorkflow(WF, baseArgs(), responder());
  check('RS1 doi chung: du ket qua → 0 vang-mat + PASS', r2.verdict === 'PASS' && logLines(r2).every(l => l.kind !== 'vang-mat'));
}

console.log('RS2 round-trip TOAN PHAN: MOI duong sinh dong tally deu phai doc duoc bang reader THAT');
{
  // Liet ke duong bang CODE tu chinh nguon (khong go tay danh sach): moi lan
  // goi tallyLine trong workflow la mot duong sinh dong. S4-r2: ban truoc chi
  // round-trip ca hanh phuc, nen duong hong-som sinh round:null lot luoi va lam
  // cam bo doc cua ca ho so.
  const src = readFileSync(WF, 'utf8');
  const sites = (src.match(/tallyLine\(/g) || []).length;
  check('RS2 co it nhat 2 duong sinh dong tally trong nguon', sites >= 2, String(sites));

  const paths = [
    ['sach', () => runWorkflow(WF, baseArgs(), responder())],
    ['lech-1-agent-chet', () => runWorkflow(WF, baseArgs(), responder({ 'machine:pnpm test': () => null }))],
    ['hong-som:args-sai', () => runWorkflow(WF, {}, responder())],
    ['hong-som:thieu-toolKillRule', () => runWorkflow(WF, baseArgs({ toolKillRule: '' }), responder())],
    ['hong-som:khong-co-gi-verify', () => runWorkflow(WF, baseArgs({ evals: [], suiteCommands: [] }), responder())],
    ['hong-som:evals-khai-thieu', () => runWorkflow(WF, baseArgs({ evals: [{ id: 'EU', criterion: 'AC-1', executor: 'ui-check', expected: 'x' }] }), responder())],
  ];
  const tmp = mkdtempSync(path.join(tmpdir(), 'tally-all-'));
  const allLines = [];
  for (const [name, run] of paths) {
    const { result } = await run();
    const lines = (result.runLog || []).map(l => JSON.parse(l)).filter(l => l.kind === 'round-tally');
    check(`RS2 duong "${name}": dung MOT dong tally`, lines.length === 1, JSON.stringify(lines));
    allLines.push(...(result.runLog || []));
  }
  // MOI dong vua sinh di qua reader THAT trong CUNG lan chay
  const logPath = path.join(tmp, 'run-log.jsonl');
  writeFileSync(logPath, allLines.join('\n') + '\n');
  let out = '', code = 0;
  try { out = execFileSync(process.execPath, [READER, '--run-log', logPath], { encoding: 'utf8' }); }
  catch (e) { out = String(e.stdout || ''); code = e.status; }
  let parsed = null; try { parsed = JSON.parse(out); } catch {}
  check('RS2 reader doc TRON moi duong, 0 dong hong', code === 0 && parsed && parsed.tallies.length === paths.length && parsed.malformed.length === 0,
    `exit=${code} tallies=${parsed ? parsed.tallies.length : '?'} malformed=${parsed ? JSON.stringify(parsed.malformed) : '?'}`);
  // so LECH duoc: ca sach vs ca lech
  const sach = parsed && parsed.tallies[0];
  const lech = parsed && parsed.tallies[1];
  check('RS2 ca sach: expected=returned, blocked=0', sach && sach.expected === 2 && sach.returned === 2 && sach.blocked === 0, JSON.stringify(sach));
  check('RS2 ca lech: expected>returned, blocked>=1', lech && lech.expected > lech.returned && lech.blocked >= 1, JSON.stringify(lech));
  check('RS2 duong args-sai khai round null (su that, khong bia so); duong hong-som CO args van giu round that', parsed && parsed.tallies[2] && parsed.tallies[2].round === null && parsed.tallies.slice(3).every(t => t.round === 1), JSON.stringify(parsed && parsed.tallies.map(t => t.round)));

  // Chieu do 1: mot dong hong KHONG duoc lam cam ca ho so (dong lanh van doc duoc)
  const poisoned = [...allLines, JSON.stringify({ kind: 'round-tally', round: 1, verdict: 'PASS', expected: 'hai', returned: 2, blocked: 0 })];
  writeFileSync(logPath, poisoned.join('\n') + '\n');
  let out2 = '', code2 = 0, err2 = '';
  try { out2 = execFileSync(process.execPath, [READER, '--run-log', logPath], { encoding: 'utf8' }); }
  catch (e) { out2 = String(e.stdout || ''); err2 = String(e.stderr || ''); code2 = e.status; }
  let p2 = null; try { p2 = JSON.parse(out2); } catch {}
  check('RS2 chieu do: dong hong -> exit 2 + ghim ten khoa, NHUNG dong lanh van tra ve',
    code2 === 2 && p2 && p2.tallies.length === paths.length && p2.malformed.length === 1 && /expected/.test(p2.malformed[0].why),
    `exit=${code2} tallies=${p2 ? p2.tallies.length : '?'} err=${err2.slice(0, 100)}`);
  // Chieu do 2: doi KHUON o ben VIET -> ben DOC phai doi theo (mot nguon that su)
  const mutWF = path.join(tmp, 'mut-verify.js');
  writeFileSync(mutWF, src.replace('"blocked": number', '"blocked": string'));
  writeFileSync(logPath, allLines.join('\n') + '\n');
  let code3 = 0, out3 = '';
  try { out3 = execFileSync(process.execPath, [READER, '--run-log', logPath, '--wf', mutWF], { encoding: 'utf8' }); }
  catch (e) { out3 = String(e.stdout || ''); code3 = e.status; }
  const p3 = (() => { try { return JSON.parse(out3); } catch { return null; } })();
  check('RS2 chieu do mot-nguon: doi kieu trong khuon nguon -> reader doi theo (moi dong thanh hong)',
    code3 === 2 && p3 && p3.malformed.length === paths.length, `exit=${code3} malformed=${p3 ? p3.malformed.length : '?'}`);
}

console.log('RS3 ha-tang-hong: ma tran 3 o — cd-fail | exit 127 | exit 1 thuong');
{
  // (a) cd that bai → wrapper `cd "..." || exit 97` tra MA THOAT 97 (tin hieu CAU
  // TRUC, khong con do chu trong output — S4-r2 doi khuon)
  const cdFail = { exitCode: 97, outputTail: 'sh: cd: khong vao duoc', runId: '', cannotRun: false };
  const { result: ra } = await runWorkflow(WF, baseArgs(), responder({ 'machine:pnpm test': cdFail }));
  check('RS3a exit 97 (cho dung hong) → BLOCKED + reason ghim ma', ra.verdict === 'BLOCKED' && ra.blocked.some(b => /97/.test(b.reason)) && ra.failedEvals.length === 0, `${ra.verdict} ${JSON.stringify(ra.blocked)} ${JSON.stringify(ra.failedEvals)}`);
  // (b) exit 127 → BLOCKED
  const notFound = { exitCode: 127, outputTail: 'zsh: command not found: pnpm', runId: '', cannotRun: false };
  const { result: rb } = await runWorkflow(WF, baseArgs(), responder({ 'machine:pnpm test': notFound }));
  check('RS3b exit 127 → BLOCKED + reason ghim 127', rb.verdict === 'BLOCKED' && rb.blocked.some(b => /127/.test(b.reason)) && rb.failedEvals.length === 0, `${rb.verdict}`);
  // (c) exit 1 thuong → van la FAIL san pham (phan loai khong nuot loi that)
  const realFail = { exitCode: 1, outputTail: 'AssertionError: expected 2 got 3', runId: '', cannotRun: false };
  const { result: rc } = await runWorkflow(WF, baseArgs(), responder({ 'machine:pnpm test': realFail }));
  check('RS3c exit 1 thuong → REJECT voi failedEvals', rc.verdict === 'REJECT' && rc.failedEvals.includes('E1'), `${rc.verdict} ${JSON.stringify(rc.failedEvals)}`);
  // chieu do (mutant): go nhanh phan loai ha tang → o (a) tro thanh REJECT gia
  const src = readFileSync(WF, 'utf8');
  const mut = src.replace(/const normInfra = r => \{[\s\S]*?\n\}/, 'const normInfra = r => r');
  if (mut === src) check('RS3 mutant ap dung duoc (site normInfra ton tai)', false, 'khong tim thay normInfra de mutate');
  else {
    const { result: rm } = await runWorkflow(WF, baseArgs(), responder({ 'machine:pnpm test': cdFail }), mut);
    check('RS3 mutant bi bat: go phan loai → cd-fail giả dạng REJECT (test phan biet duoc)', rm.verdict === 'REJECT');
  }
}

console.log('RS5 phan loai ha tang KHONG do chu: loi san pham in chuoi cd van la REJECT (AC-12, S4-r2)');
{
  // Ca that tren chinh kho nay: ca do cua RS3 in nguyen van chuoi "cd: ... No such
  // file or directory" trong reason. Ban do-chu nuot no thanh BLOCKED va nguoi di
  // chua ha tang cho mot loi san pham.
  const sanPhamDo = { exitCode: 1, outputTail: 'FAIL: RS3a ... Dau vet: sh: line 0: cd: /repo: No such file or directory', runId: '', cannotRun: false };
  const { result } = await runWorkflow(WF, baseArgs(), responder({ 'machine:pnpm test': sanPhamDo }));
  check('RS5 output co chuoi cd nhung exit 1 -> van REJECT (khong bi nuot)', result.verdict === 'REJECT' && result.failedEvals.includes('E1'), result.verdict);
  // va nguon KHONG con bo do chu nao
  const src = readFileSync(WF, 'utf8');
  check('RS5 nguon da bo han bo do chu CD_FAIL_RE', !/CD_FAIL_RE/.test(src));
  const block = src.split('// <<<INFRA-EXIT-CODES')[1]?.split('// INFRA-EXIT-CODES>>>')[0] || '';
  check('RS5 bang ma thoat ha tang o MOT khoi marker, co 97 va 127', /97:/.test(block) && /127:/.test(block), block.slice(0, 80));
  // ba lane deu dung CUNG mot guard rut tu khoi do
  const guards = (src.match(/CD_GUARD\(/g) || []).length;
  check('RS5 ca ba lane deu goi CD_GUARD (may + UI + baseline)', guards === 3, String(guards));
  check('RS5 duong dan trong guard duoc dat trong nhay', /CD_GUARD\(`"\$\{args\.repoRoot\}"`\)/.test(src) && /CD_GUARD\('"\$WT"'\)/.test(src));
}

console.log('RS6 ba ngan OOC dung MOT nguon cho schema + prompt triage + prompt synthesize (AC-10, S4-r1)');
{
  const src = readFileSync(WF, 'utf8');
  const block = src.split('// <<<OOC-PROPOSAL-VALUES')[1]?.split('// OOC-PROPOSAL-VALUES>>>')[0] || '';
  const values = [...block.matchAll(/\['([\w-]+)',/g)].map(m => m[1]);
  check('RS6 khoi marker khai du 3 ngan', values.length === 3 && values.includes('wont-fix'), JSON.stringify(values));
  // khong ben nao duoc go tay danh sach ngan: chi hang moi duoc liet ke gia tri
  const outside = src.replace(block, '');
  const hardcoded = [...outside.matchAll(/'known-limits'\s*,\s*'new-contract'/g)].length;
  check('RS6 khong con danh sach ngan go tay ngoai khoi marker', hardcoded === 0, String(hardcoded));
  // chieu do: xoa mot ngan khoi NGUON -> ca ba ben deu mat gia tri do
  const mut = src.replace(/\s*\['wont-fix'[^\]]*\],?\n/, '\n');
  if (mut === src) check('RS6 mutant ap dung duoc', false, 'khong xoa duoc dong wont-fix trong nguon');
  else {
    const mBlock = mut.split('// <<<OOC-PROPOSAL-VALUES')[1]?.split('// OOC-PROPOSAL-VALUES>>>')[0] || '';
    check('RS6 chieu do: xoa ngan khoi nguon -> khoi marker mat gia tri (mot nguon that su)', !mBlock.includes('wont-fix'));
  }
}

summary('round-signal (cham-dung-cay-dung-cho-dung AC-8/AC-9/AC-10/AC-12)');
