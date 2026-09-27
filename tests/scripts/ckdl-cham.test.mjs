// ckdl-cham.test.mjs — hồ sơ cham-khong-tu-dot-luot, làn A (bộ chấm). Tên ca = tên AC.
// Sổ chạy do BỘ CHẤM THẬT sinh (harness tests/workflows) rồi đưa cho chính lib/s4-args.
import { spawnSync, execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { runWorkflow } from '../workflows/harness.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const WF = path.join(KIT, 'feature-loop', 'workflows', 'acceptance-verify.js');
const S4ARGS = path.join(KIT, 'feature-loop', 'scripts', 's4-args.mjs');
const LIB = path.join(KIT, 'lib', 'nhan-canh-gay.cjs');
const require = createRequire(import.meta.url);
const NCG = require(LIB);
const TMP = mkdtempSync(path.join(tmpdir(), 'ckdl-cham-'));
let pass = 0; let fail = 0;
const ok = (n, m = '') => { pass += 1; console.log(`PASS: ${n} ${m}`.trimEnd() + ' '); };
const bad = (n, m) => { fail += 1; console.log(`FAIL: ${n} — ${m}`); };
const CHON = [...process.argv.slice(2), ...(process.env.CKDL_CASES ? process.env.CKDL_CASES.split(',') : [])];
const want = n => !CHON.length || CHON.some(c => n === c || n.startsWith(c + '-'));
const ca = async (n, fn) => { if (!want(n)) return; try { ok(n, (await fn()) || ''); } catch (e) { bad(n, String(e && e.message || e).split('\n').slice(0, 6).join(' | ')); } };
const assert = (c, m) => { if (!c) throw new Error(m); };
const gitC = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const SRC = readFileSync(WF, 'utf8');
const INVOKED = '2026-09-26T01:16:19Z';
const SHA = 'f'.repeat(40);
// Chạy bộ chấm thật với tác tử giả: tra[cmd] = kết quả tác tử machine; uiTra[id] = kết quả tác tử ui.
async function cham({ evals, suite = [], tra = {}, uiTra = {}, prov, invokedSha = SHA, src } = {}) {
  const calls = [];
  const res = (await runWorkflow(WF, {
    slug: 'demo', round: 1, riskTier: 'T2', evals, suiteCommands: suite, diffBase: 'main', repoRoot: '/repo',
    personasPath: '/p', templatePath: '/t', invokedAt: INVOKED, ...(invokedSha ? { invokedSha } : {}),
  }, c => {
    calls.push(c);
    const l = c.label;
    if (l.startsWith('machine:')) { const cmd = l.slice(8).replace(/#\d+$/, ''); const k = Object.keys(tra).find(x => x.slice(0, 40) === cmd); return typeof tra[k] === 'function' ? tra[k](c) : (tra[k] || { exitCode: 0, outputTail: 'ok\n__EXIT=0', runId: '', cannotRun: false }); }
    if (l.startsWith('ui:')) return uiTra[l.slice(3)] || null;
    if (l.startsWith('review:')) return { findings: [] };
    if (l === 'capture:provenance') return prov || { bypass_used: false, enforcement_mode: 'strict', verified_commit: SHA };
    if (l === 'synthesize:report') return { report: '# r', findings: '# f' };
    return null;
  }, src)).result;
  return { res, calls, dong: res.runLog.map(x => JSON.parse(x)) };
}
// Kho git do code sinh cho s4-args, sổ chạy = ĐÚNG sổ bộ chấm vừa sinh (khuôn khoS4 của htkd).
function s4(runLog) {
  const d = mkdtempSync(path.join(TMP, 'k-'));
  const ws = path.join(d, '_acceptance', 'demo');
  mkdirSync(ws, { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main', d]);
  gitC(d, 'config', 'user.email', 't@t.t'); gitC(d, 'config', 'user.name', 'T');
  writeFileSync(path.join(d, '_acceptance', 'config.yaml'), 'schema_version: 1\nexecutors:\n  script:\n    cli: "echo x"\nfeature_loop:\n  suite_keys:\n    - executors.script.cli\n');
  writeFileSync(path.join(ws, 'contract.md'), '---\nschema_version: 1\nslug: demo\nrisk_tier: T2\nstatus: implemented\n---\n');
  writeFileSync(path.join(ws, 'evals.yaml'), 'schema_version: 1\nfeature_slug: demo\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.cli\n    expected: x\n');
  writeFileSync(path.join(d, 'README.md'), 'demo\n');
  gitC(d, 'add', '-A'); gitC(d, 'commit', '-qm', 'goc'); gitC(d, 'checkout', '-qb', 'vong-nay');
  writeFileSync(path.join(d, 'src-demo.js'), 'x\n');
  writeFileSync(path.join(ws, 'evidence-report.md'), '---\nschema_version: 1\nfeature_slug: demo\nverdict: BLOCKED\n---\n\n# Evidence Report: demo\n\n## Iterations\n\nRound 1 — chấm.\n');
  writeFileSync(path.join(ws, 'run-log.jsonl'), runLog.join('\n') + '\n');
  gitC(d, 'add', '-A'); gitC(d, 'commit', '-qm', 'vat');
  const out = path.join(d, 'args.json');
  const r = spawnSync(process.execPath, [S4ARGS, '--slug', 'demo', '--root', d, '--ag-root', KIT, '--out', out, '--diff-base', 'main', '--no-carry'], { encoding: 'utf8' });
  return { rc: r.status, err: r.stderr || '', round: r.status === 0 ? JSON.parse(readFileSync(out, 'utf8')).round : null };
}
const canh = (res, src) => (src ? src : NCG).canhGay({ runLogText: res.runLog.join('\n'), verdict: res.verdict, nguon: NCG.NGUON });
const EV = [{ id: 'E1', criterion: 'AC-1', executor: 'script', cmd: 'cmd-1', ref: 'config:executors.script.cli', expected: 'x' }];
const SUITE = 'bun run test';
const LY_DO_CRM = {
  r2: 'output was cut mid-execution — test suite did not complete. Tool truncated the output while tests were still running in @crm/validation package.',
  r3: "Output bị công cụ cắt giữa chừng trước dòng tổng kết cuối cùng. Dòng cuối cùng hiển thị là '(pass) permittedEvidenceKind > buckets anything else / (pass) permitted(' không hoàn thiện, không có tóm tắt kết quả chung (expected pattern: 'Ran N tests...'). Lệnh bun run test không chạy xong.",
};

// ── Task A1 (AC-3, AC-4): B12 nhập + B12+ ──
for (const [k, lyDo] of Object.entries(LY_DO_CRM)) {
  await ca(`CK-AC3-${k}`, async () => {
    const { res, dong } = await cham({ evals: EV, suite: [SUITE], tra: { [SUITE]: { exitCode: 1, cannotRun: true, killedByTool: true, reason: lyDo, outputTail: '(pass) permitted(', runId: '' } } });
    const s = dong.find(o => o.cmd === SUITE && String(o.evalId).startsWith('SUITE-'));
    assert(res.verdict === 'BLOCKED', `verdict ${res.verdict}`);
    assert(s && s.cannot_run === true && s.exit_code === null && s.killed_by_tool === true && s.reason === lyDo, `dong SUITE: ${JSON.stringify(s)}`);
    const c = canh(res);
    assert(c.muc.length === 1 && c.muc[0].nhan === 'mu' && c.trangThai === 'mo', `canhGay ${JSON.stringify(c)}`);
    const x = s4(res.runLog);
    assert(x.round === 1 && x.err.includes('thử lại CÙNG round'), `s4 round ${x.round}: ${x.err.split('\n').pop()}`);
    return '(killed_by_tool · mu · round 1)';
  });
}
await ca('CK-AC3-dot-bien', async () => {
  const KIM = /\.\.\.\(m\.cannotRun && m\.killedByTool \? \{ killed_by_tool: true \} : \{\}\),/g;
  const n = (SRC.match(KIM) || []).length;
  assert(n === 2, `kim killed_by_tool khop ${n} lan (khai 2)`);
  const { res } = await cham({ evals: EV, suite: [SUITE], tra: { [SUITE]: { exitCode: 1, cannotRun: true, killedByTool: true, reason: LY_DO_CRM.r3, outputTail: '', runId: '' } }, src: SRC.replace(KIM, '') });
  // Sau AC-4 nhãn không phụ thuộc cờ (sổ S2 «AC-3 chiều đỏ đo sự vắng trường») — ghim TRƯỜNG, không ghim trạng thái.
  const sDong = res.runLog.map(l => JSON.parse(l)).find(o => String(o.evalId).startsWith('SUITE-'));
  assert(!('killed_by_tool' in sDong), 'ban sao van ghi killed_by_tool tren dong SUITE');
  const r2 = await cham({ evals: EV, tra: { 'cmd-1': { exitCode: 1, cannotRun: true, killedByTool: true, reason: '', outputTail: '', runId: '' } }, src: SRC.replace(KIM, '') });
  const e = r2.dong.find(o => o.evalId === 'E1');
  assert(!('killed_by_tool' in e), 'ban sao van ghi killed_by_tool');
  return '(2 cho ghi · bo di → dong eval mat co)';
});
await ca('CK-AC4', async () => {
  const hang = [];
  { const { res } = await cham({ evals: EV, suite: [SUITE], tra: { [SUITE]: { exitCode: 1, cannotRun: true, reason: 'thieu env DATABASE_URL — service local chua chay', outputTail: '', runId: '' } } });
    const c = canh(res); if (!(c.muc[0].nhan === 'mu' && c.trangThai === 'mo' && s4(res.runLog).round === 1)) hang.push(`ly do tu do: ${c.trangThai}`); }
  { const { res } = await cham({ evals: EV, suite: [SUITE], tra: { [SUITE]: { exitCode: 1, cannotRun: true, reason: 'x', outputTail: '', runId: '' } } });
    const rl = res.runLog.map(l => { const o = JSON.parse(l); if (String(o.evalId).startsWith('SUITE-')) delete o.reason; return JSON.stringify(o); });
    const c = NCG.canhGay({ runLogText: rl.join('\n'), verdict: 'BLOCKED', nguon: NCG.NGUON }); if (!(c.muc[0].nhan === null && c.trangThai === 'khoa')) hang.push(`ly do rong: ${c.trangThai}`); }
  { const { res } = await cham({ evals: EV, suite: [SUITE], tra: { [SUITE]: { exitCode: 1, cannotRun: false, outputTail: '1 fail\n__EXIT=1', runId: '' } } });
    if (!(res.verdict === 'REJECT' && s4(res.runLog).round === 2)) hang.push(`exit 1 that: ${res.verdict}`); }
  { const LINT = 'bunx turbo run lint --force';
    const { res } = await cham({ evals: EV, suite: [SUITE, LINT], tra: { [SUITE]: { exitCode: 1, cannotRun: true, killedByTool: true, reason: LY_DO_CRM.r2, outputTail: '', runId: '' }, [LINT]: { exitCode: 1, cannotRun: false, outputTail: 'lint\n__EXIT=1', runId: '' } } });
    const c = canh(res); if (!(c.muc.map(m => m.nhan).sort().join(',') === 'mu,vat' && c.trangThai === 'khoa' && s4(res.runLog).round === 2)) hang.push(`tron: ${JSON.stringify(c.muc.map(m => m.nhan))}`); }
  assert(!hang.length, hang.join(' · '));
  return '(4 hang)';
});
await ca('CK-AC4-dot-bien', async () => {
  const lsrc = readFileSync(LIB, 'utf8');
  const KIM = "  return 'mu';\n}";
  assert(lsrc.split(KIM).length - 1 === 1, 'kim nhanLyDo khong khop dung 1 lan');
  const sao = path.join(TMP, 'ncg-sao.cjs'); writeFileSync(sao, lsrc.replace(KIM, "  return laEval ? 'mu' : null;\n}").replace(/__filename/g, JSON.stringify(LIB)));
  const B = require(sao);
  const { res } = await cham({ evals: EV, suite: [SUITE], tra: { [SUITE]: { exitCode: 1, cannotRun: true, reason: 'thieu env', outputTail: '', runId: '' } } });
  const c = B.canhGay({ runLogText: res.runLog.join('\n'), verdict: res.verdict, nguon: B.NGUON });
  assert(c.trangThai === 'khoa', `ban sao khoi phuc nhanh SUITE→null ma hang ly do tu do van ${c.trangThai}`);
  return '(hang ly do tu do → khoa)';
});

// ── Task A2 (AC-1): khung bọc EXIT-MARK ──
const khoiMark = () => { const m = SRC.match(/\/\/ <<<EXIT-MARK\n([\s\S]*?)\/\/ EXIT-MARK>>>/g); assert(m && m.length === 1, `khoi EXIT-MARK khop ${m ? m.length : 0} lan`); return m[0]; };
const bocTu = src => { const k = src.match(/\/\/ <<<EXIT-MARK\n([\s\S]*?)\/\/ EXIT-MARK>>>/)[1]; return new Function(`${k}; return BOC_LENH;`)(); };
const chayBoc = (boc, lenh) => { const r = spawnSync('bash', ['-c', boc(lenh)], { encoding: 'buffer', maxBuffer: 1 << 26 }); return { buf: r.stdout, txt: r.stdout.toString('utf8') }; };
await ca('CK-AC1', async () => {
  khoiMark();
  const tra = { 'cmd-1': { exitCode: 0, outputTail: 'ok\n__EXIT=0', runId: '', cannotRun: false }, [SUITE]: { exitCode: 0, outputTail: 'ok\n__EXIT=0', runId: '', cannotRun: false } };
  const moi = await cham({ evals: EV, suite: [SUITE], tra });
  const dongNhat = SRC.replace(/(\/\/ <<<EXIT-MARK\n)[\s\S]*?(\/\/ EXIT-MARK>>>)/, "$1const EXIT_MARK = '__EXIT='\nconst BOC_LENH = (lenh) => lenh\n$2");
  const cu = await cham({ evals: EV, suite: [SUITE], tra, src: dongNhat });
  const mach = x => x.calls.filter(c => c.label.startsWith('machine:'));
  assert(mach(cu).length === 2, `doi chung: ${mach(cu).length} tac tu machine (khai 2)`);
  const boc = bocTu(SRC);
  for (const c of mach(moi)) { const cmd = c.label.startsWith('machine:cmd-1') ? 'cmd-1' : SUITE; assert(c.prompt.includes(boc(`cd "/repo" || exit 97 && ${cmd}`)), `prompt ${c.label} thieu khung boc`); }
  const khoa = x => JSON.stringify({ l: mach(x).map(c => c.label).sort(), r: x.dong.filter(o => o.evalId).map(o => [o.evalId, o.run_id, o.cmd]).sort() });
  assert(khoa(moi) === khoa(cu), `nhan/run_id/cmd lech: ${khoa(moi)} ≠ ${khoa(cu)}`);
  return '(khung trong prompt · khoa bang nhau)';
});
await ca('CK-AC1-khung', async () => {
  const boc = bocTu(SRC);
  const d = mkdtempSync(path.join(TMP, 'boc-'));
  const MA = [['true', 0], ['false', 1], ['exit 3 # chu thich', 3], ['khong-co-lenh-nay-xyz', 127], [`cd "${path.join(d, 'vang')}" || exit 97 && true`, 97]];
  const sai = MA.map(([l, m]) => { const t = chayBoc(boc, l).txt.trimEnd().split('\n').pop(); return t === `__EXIT=${m}` ? null : `${l} → ${t}`; }).filter(Boolean);
  assert(sai.length === 0 && MA.length === 5, sai.join(' · '));
  const to = chayBoc(boc, `node -e 'process.stdout.write("x".repeat(76000))'`);
  const vi = chayBoc(boc, `node -e 'for(let i=0;i<40;i++)console.log("Đường dẫn tiếng Việt có dấu ".repeat(11))'`);
  for (const [ten, o] of [['ascii', to], ['tieng-viet', vi]]) {
    assert(o.buf.length <= 8000, `dau ra vuot tran: ${o.buf.length} (${ten})`);
    assert(/^__EXIT=0\s*$/m.test(o.txt), `mat dau __EXIT (${ten})`);
  }
  return `(5 ma · ${to.buf.length}B · ${vi.buf.length}B)`;
});
await ca('CK-AC1-dot-bien', async () => {
  const k = khoiMark();
  const d1 = k.replace(/ \| tail -c 6000/, '');
  assert(d1 !== k, 'kim tail -c khong khop');
  const o = chayBoc(bocTu(SRC.replace(k, d1)), `node -e 'for(let i=0;i<40;i++)console.log("Đường dẫn tiếng Việt có dấu ".repeat(11))'`);
  assert(o.buf.length > 8000, `ban sao bo gioi han ma dau ra van ${o.buf.length}B — phep do khong do`);
  const d2 = k.replace(/; printf [^;]*EXIT_MARK[^;]*;/, ';');
  assert(d2 !== k, 'kim printf khong khop');
  const o2 = chayBoc(bocTu(SRC.replace(k, d2)), 'true');
  assert(!/__EXIT=/.test(o2.txt), 'ban sao bo printf ma van co dau');
  return '(dau ra vuot tran · mat dau __EXIT)';
});

rmSync(TMP, { recursive: true, force: true });
console.log(`ckdl-cham: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
