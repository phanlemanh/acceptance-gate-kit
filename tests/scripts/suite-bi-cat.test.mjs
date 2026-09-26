// suite-bi-cat.test.mjs — lệnh SUITE bị công cụ cắt output là hạ tầng («không đọc được ở
// đây»), không phải sai hợp đồng: s4-args thử lại CÙNG round, không đốt trần.
//
// Vấp thật: crm `quen-mat-khau` 26/09, S4 round 2 và 3 BLOCKED chỉ vì `bun run test` bị cắt
// output. Agent suite KHAI ĐÚNG cấu trúc (`cannotRun` + `killedByTool`), nhưng bộ chấm bỏ
// `killedByTool` khi ghi sổ chạy và giữ lý do tự do — lib phân nhãn chỉ còn câu tự do để đọc,
// dòng SUITE ra nhãn null, trạng thái khoá, round 3 bị đẩy lên round 4 (quá trần).
//
// Sổ chạy do bộ chấm THẬT sinh (harness tests/workflows, tác tử giả trả đúng hình dạng đã ghi
// ở transcript crm) rồi đưa cho CHÍNH bên đọc: lib/nhan-canh-gay.cjs và s4-args.mjs. Không
// gõ tay dòng sổ theo khuôn bên đọc — đó là cách ca HT-AC4 cũ xanh suốt khi lỗi này sống.
//
//   SBC-mu-*       lý do tự do + killedByTool → dòng sổ mang killed_by_tool, nhãn mu, thử lại cùng round
//   SBC-vat-*      đối chứng: SUITE exit 1 thật → REJECT; cùng lượt với suite bị cắt (hình dạng
//                  round 2 crm, lint exit 1) → nhãn vat giữ khoá, round kế
//   SBC-khong-khai đặc hiệu: cannotRun không khai killedByTool → nhãn null (không đoán từ chữ), round kế
//   SBC-dot-bien   bản sao bộ chấm bỏ trường killed_by_tool → SBC-mu lật sang khoá (phép đo đo thật)
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
const require = createRequire(import.meta.url);
const NCG = require(path.join(KIT, 'lib', 'nhan-canh-gay.cjs'));
const TMP = mkdtempSync(path.join(tmpdir(), 'sbc-'));
let pass = 0; let fail = 0;
const ok = (name, msg = '') => { pass += 1; console.log(`PASS: ${name} ${msg}`.trimEnd() + ' '); };
const bad = (name, msg) => { fail += 1; console.log(`FAIL: ${name} — ${msg}`); };
const CHON = [...process.argv.slice(2), ...(process.env.SBC_CASES ? process.env.SBC_CASES.split(',') : [])];
const want = name => !CHON.length || CHON.some(c => name === c || name.startsWith(c + '-'));
const ca = async (name, fn) => { if (!want(name)) return; try { const m = await fn(); ok(name, m || ''); } catch (e) { bad(name, String(e && e.message || e).split('\n').slice(0, 6).join(' | ')); } };
const assert = (c, m) => { if (!c) throw new Error(m); };
const gitC = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

// Nguyên văn lý do hai lượt ở run-log crm (round 2 · round 3).
const LY_DO_CRM = {
  r2: 'output was cut mid-execution — test suite did not complete. Tool truncated the output while tests were still running in @crm/validation package.',
  r3: "Output bị công cụ cắt giữa chừng trước dòng tổng kết cuối cùng. Dòng cuối cùng hiển thị là '(pass) permittedEvidenceKind > buckets anything else / (pass) permitted(' không hoàn thiện, không có tóm tắt kết quả chung (expected pattern: 'Ran N tests...'). Lệnh bun run test không chạy xong.",
};
const SUITE = 'bun run test';
const LINT = 'bunx turbo run lint --force';
const EV = [{ id: 'E1', criterion: 'AC-1', executor: 'script', cmd: 'cmd-1', ref: 'config:executors.script.cli', expected: 'x' }];
const INVOKED = '2026-09-26T01:16:19Z';
const SHA = 'f'.repeat(40);

// Chạy bộ chấm thật; `suiteTra` là kết quả tác tử suite trả (hình dạng StructuredOutput của crm).
// `them` = {lệnh suite khác: kết quả} chạy cùng lượt.
async function cham(suiteTra, srcOverride, them = {}) {
  const res = (await runWorkflow(WF, {
    slug: 'demo', round: 1, riskTier: 'T2', evals: EV, suiteCommands: [SUITE, ...Object.keys(them)], diffBase: 'main', repoRoot: '/repo',
    personasPath: '/p', templatePath: '/t', invokedAt: INVOKED, invokedSha: SHA,
  }, c => {
    const l = c.label;
    if (l.startsWith('machine:')) { const cmd = l.slice(8); return cmd === SUITE ? suiteTra : (them[cmd] || { exitCode: 0, outputTail: 'ok', runId: 'rid-e1', cannotRun: false }); }
    if (l.startsWith('review:')) return { findings: [] };
    if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: SHA };
    if (l === 'synthesize:report') return { report: '# r', findings: '# f' };
    return null;
  }, srcOverride)).result;
  const suiteDong = res.runLog.map(x => JSON.parse(x)).find(o => o.cmd === SUITE && String(o.evalId || '').startsWith('SUITE-'));
  const canh = NCG.canhGay({ runLogText: res.runLog.join('\n'), verdict: res.verdict, nguon: NCG.NGUON });
  return { res, suiteDong, canh };
}

// Kho cho s4-args: sổ chạy là ĐÚNG sổ bộ chấm vừa sinh; báo cáo có Iterations Round 1.
function khoS4(runLog) {
  const d = mkdtempSync(path.join(TMP, 'k-'));
  const ws = path.join(d, '_acceptance', 'demo');
  mkdirSync(ws, { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main', d]);
  gitC(d, 'config', 'user.email', 't@t.t'); gitC(d, 'config', 'user.name', 'T');
  writeFileSync(path.join(d, '_acceptance', 'config.yaml'), 'schema_version: 1\nexecutors:\n  script:\n    cli: "echo x"\nfeature_loop:\n  suite_keys:\n    - executors.script.cli\n');
  writeFileSync(path.join(ws, 'contract.md'), '---\nschema_version: 1\nslug: demo\nrisk_tier: T2\nstatus: implemented\n---\n');
  writeFileSync(path.join(ws, 'evals.yaml'), 'schema_version: 1\nfeature_slug: demo\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.cli\n    expected: x\n');
  writeFileSync(path.join(d, 'README.md'), 'demo\n');
  gitC(d, 'add', '-A'); gitC(d, 'commit', '-qm', 'goc');
  gitC(d, 'checkout', '-qb', 'vong-nay');
  writeFileSync(path.join(d, 'src-demo.js'), 'x\n');
  writeFileSync(path.join(ws, 'evidence-report.md'), '---\nschema_version: 1\nfeature_slug: demo\nverdict: BLOCKED\n---\n\n# Evidence Report: demo\n\n## Iterations\n\nRound 1 — chấm.\n');
  writeFileSync(path.join(ws, 'run-log.jsonl'), runLog.join('\n') + '\n');
  gitC(d, 'add', '-A'); gitC(d, 'commit', '-qm', 'vat cua vong');
  return d;
}
function s4(runLog) {
  const d = khoS4(runLog);
  const out = path.join(d, 'args.json');
  const r = spawnSync(process.execPath, [S4ARGS, '--slug', 'demo', '--root', d, '--ag-root', KIT, '--out', out, '--diff-base', 'main', '--no-carry'], { encoding: 'utf8' });
  return { rc: r.status, err: r.stderr || '', round: r.status === 0 ? JSON.parse(readFileSync(out, 'utf8')).round : null };
}
const cuoiErr = x => x.err.split('\n').filter(Boolean).pop() || '';

// ── lý do tự do + killedByTool → mu, thử lại cùng round ─────────────────────
for (const [k, lyDo] of Object.entries(LY_DO_CRM)) {
  await ca(`SBC-mu-${k}`, async () => {
    const { res, suiteDong, canh } = await cham({ exitCode: 1, cannotRun: true, killedByTool: true, reason: lyDo, outputTail: '(pass) permitted(', runId: '' });
    assert(res.verdict === 'BLOCKED', `bo cham tra ${res.verdict}, ky vong BLOCKED`);
    assert(suiteDong && suiteDong.cannot_run === true && suiteDong.exit_code === null, `dong SUITE khong mang cannot_run/exit null: ${JSON.stringify(suiteDong)}`);
    assert(suiteDong.killed_by_tool === true, `dong SUITE thieu killed_by_tool: ${JSON.stringify(suiteDong)}`);
    assert(suiteDong.reason === lyDo, 'ly do agent khong giu nguyen van tren dong so');
    assert(canh.muc.length === 1 && canh.muc[0].nhan === 'mu', `canhGay: ${JSON.stringify(canh.muc)}`);
    assert(canh.trangThai === 'mo', `trangThai ${canh.trangThai}, ky vong mo`);
    const x = s4(res.runLog);
    assert(x.round === 1, `s4-args ra round ${x.round} (rc ${x.rc}: ${cuoiErr(x)}), ky vong 1 (thu lai cung round)`);
    assert(x.err.includes('thử lại CÙNG round'), `stderr thieu «thử lại CÙNG round»: ${cuoiErr(x)}`);
    return '(killed_by_tool · mu · mo · round 1)';
  });
}

// ── đối chứng: SUITE exit 1 thật vẫn là vật ─────────────────────────────────
const LINT_DO = { exitCode: 1, cannotRun: false, killedByTool: false, outputTail: 'error: no-unused-vars', runId: '' };
await ca('SBC-vat-reject', async () => {
  const { res, suiteDong } = await cham({ ...LINT_DO, outputTail: '1 fail\nRan 812 tests' });
  assert(suiteDong && suiteDong.exit_code === 1 && !suiteDong.cannot_run && !('killed_by_tool' in suiteDong), `dong SUITE: ${JSON.stringify(suiteDong)}`);
  assert(res.verdict === 'REJECT', `bo cham tra ${res.verdict}, ky vong REJECT`);
  const x = s4(res.runLog);
  assert(x.round === 2, `s4-args ra round ${x.round} (rc ${x.rc}: ${cuoiErr(x)}), ky vong 2`);
  return '(REJECT · round 2)';
});
await ca('SBC-vat-cung-luot-bi-cat', async () => {
  const { res, canh } = await cham({ exitCode: 1, cannotRun: true, killedByTool: true, reason: LY_DO_CRM.r2, outputTail: '', runId: '' }, undefined, { [LINT]: LINT_DO });
  assert(res.verdict === 'BLOCKED', `bo cham tra ${res.verdict}, ky vong BLOCKED`);
  const nhan = canh.muc.map(m => m.nhan).sort().join(',');
  assert(nhan === 'mu,vat', `canhGay muc ${JSON.stringify(canh.muc)}, ky vong mu + vat`);
  assert(canh.trangThai === 'khoa', `trangThai ${canh.trangThai}, ky vong khoa`);
  const x = s4(res.runLog);
  assert(x.round === 2, `s4-args ra round ${x.round} (rc ${x.rc}: ${cuoiErr(x)}), ky vong 2`);
  return '(BLOCKED · mu+vat · khoa · round 2)';
});

// ── đặc hiệu: không khai killedByTool thì không đoán từ chữ ─────────────────
await ca('SBC-khong-khai', async () => {
  const { res, suiteDong, canh } = await cham({ exitCode: 1, cannotRun: true, reason: 'thieu env DATABASE_URL — service local chua chay', outputTail: '', runId: '' });
  assert(res.verdict === 'BLOCKED', `bo cham tra ${res.verdict}`);
  assert(suiteDong && suiteDong.cannot_run === true && !('killed_by_tool' in suiteDong), `dong SUITE: ${JSON.stringify(suiteDong)}`);
  assert(canh.muc.length === 1 && canh.muc[0].nhan === null && canh.trangThai === 'khoa', `canhGay: ${JSON.stringify(canh)}`);
  const x = s4(res.runLog);
  assert(x.round === 2, `s4-args ra round ${x.round} (rc ${x.rc}: ${cuoiErr(x)}), ky vong 2`);
  return '(null · khoa · round 2)';
});

// ── độ nhạy của chính phép đo: bộ chấm không ghi trường → ca mu lật ─────────
await ca('SBC-dot-bien', async () => {
  const src = readFileSync(WF, 'utf8');
  const KIM = /\.\.\.\(m\.cannotRun && m\.killedByTool \? \{ killed_by_tool: true \} : \{\}\),/g;
  const n = (src.match(KIM) || []).length;
  assert(n >= 1, 'bo cham khong con cho ghi killed_by_tool — kim dot bien khong khop');
  const { suiteDong, canh } = await cham({ exitCode: 1, cannotRun: true, killedByTool: true, reason: LY_DO_CRM.r3, outputTail: '', runId: '' }, src.replace(KIM, ''));
  assert(!('killed_by_tool' in suiteDong), 'ban sao van ghi killed_by_tool — dot bien khong an');
  assert(canh.trangThai === 'khoa', `ban sao bo truong ma trangThai van ${canh.trangThai} — phep do khong do truong`);
  return `(${n} cho ghi · bo di → khoa)`;
});

rmSync(TMP, { recursive: true, force: true });
console.log(`suite-bi-cat: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
