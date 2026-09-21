// ntr-the-canh-gay.test.mjs — hồ sơ nhan-trang-thai-va-reality, mảnh B + dòng ý định.
// AC-4 (E4) thước lệch khoá thẻ · AC-5 (E5) chỗ mù vì bàn đo mở ô ký kèm ba lối + giá ·
// AC-6 (E6) REJECT / BLOCKED không phân loại được giữ NGUYÊN từng byte · AC-7 (E7) hệ thống chết
// lần đầu khoá, đã thử lại thì mở · AC-12 (E12) khối ý định trích nguyên văn.
// Sổ chạy của fixture do CHÍNH bộ chấm sinh: harness tests/workflows chạy acceptance-verify.js
// với tác tử giả, ta ghi nguyên `result.runLog` — dòng eval, dòng vang-mat, dòng round-tally
// đều là đầu ra của bên viết thật (round-trip), không dựng tay. Bản thẻ «trước vòng» lấy TRỌN
// scripts/ lib/ skills/ bằng `git archive` ở cha của commit đầu đưa chuỗi NHAN-CANH-GAY vào
// scripts/gate-card.js — sha là đầu ra lệnh; không tìm ra → ca ĐỎ có tên.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runWorkflow } from '../workflows/harness.mjs';
import { dungKho, SLUG as SLUG_TV } from './thuoc-vat-fixture.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const WF = path.join(KIT, 'feature-loop', 'workflows', 'acceptance-verify.js');
const GC = path.join(KIT, 'scripts', 'gate-card.js');
const TMP = mkdtempSync(path.join(tmpdir(), 'ntr-the-'));
let pass = 0; let fail = 0;
const ok = (name, msg = '') => { pass += 1; console.log(`PASS: ${name} ${msg}`.trimEnd() + ' '); };
const bad = (name, msg) => { fail += 1; console.log(`FAIL: ${name} — ${msg}`); };
const loi = e => String((e && (e.stderr || e.message)) || e).split('\n').slice(0, 3).join(' | ');
const want = name => !process.env.NTR_CASES || process.env.NTR_CASES.split(',').includes(name);
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const SLUG = 's';

// ── bộ chấm thật với tác tử giả ────────────────────────────────────────────
const EVALS = [
  { id: 'E1', criterion: 'AC-1', executor: 'script', cmd: 'cmd-e1', ref: 'config:executors.script.e1', expected: 'x' },
  { id: 'E2', criterion: 'AC-2', executor: 'script', cmd: 'cmd-e2', ref: 'config:executors.script.e2', expected: 'x' },
];
const argsCham = (over = {}) => ({
  slug: SLUG, round: 1, riskTier: 'T2', evals: EVALS, suiteCommands: ['npm run build'], diffBase: 'main', repoRoot: '/repo',
  personasPath: '/refs/judge-personas.md', templatePath: '/refs/evidence-report-template.md', invokedAt: '2026-09-21T10:00:00Z', ...over,
});
const traLoi = (e2) => (call) => {
  const l = call.label;
  if (l === 'machine:cmd-e2') return typeof e2 === 'function' ? e2(call) : e2;
  if (l.startsWith('machine:')) return { exitCode: 0, outputTail: 'ok', runId: '', cannotRun: false };
  if (l.startsWith('review:')) return { findings: [] };
  if (l.startsWith('refute:')) return { refuted: true, reason: 'x' };
  if (l.startsWith('baseline:')) return { results: [] };
  if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: 'a'.repeat(40) };
  if (l === 'synthesize:report') return { report: '# r', findings: '# f' };
  return null;
};
const cham = async (e2, over, e1) => {
  const resp = traLoi(e2);
  const r = await runWorkflow(WF, argsCham(over), e1 ? (c => (c.label === 'machine:cmd-e1' ? e1 : resp(c))) : resp);
  return r.result;
};

// ── hồ sơ fixture ───────────────────────────────────────────────────────────
function hoSo({ verdict, runLog = [], opportunity = null, duongNen = null, root = null, slug = SLUG }) {
  const d = root || mkdtempSync(path.join(TMP, 'hs-'));
  const ws = path.join(d, '_acceptance', slug);
  mkdirSync(ws, { recursive: true });
  if (!existsSync(path.join(d, '_acceptance', 'config.yaml'))) writeFileSync(path.join(d, '_acceptance', 'config.yaml'), 'schema_version: 1\nexecutors:\n  script:\n    e1: "true"\n    e2: "true"\n');
  writeFileSync(path.join(ws, 'contract.md'), `---\nschema_version: 1\nfeature: Tinh nang mau\nslug: ${slug}\nrisk_tier: T2\nsurfaces: [cli]\nstatus: verified\napproved_by: T\napproved_at: 2026-09-21T00:00:00Z\n---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n- AC-2: Given d, When e, Then f.\n`);
  writeFileSync(path.join(ws, 'evals.yaml'), `schema_version: 1\nfeature_slug: ${slug}\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.e1\n    expected: x\n  - id: E2\n    criterion: AC-2\n    executor: script\n    cmd: config:executors.script.e2\n    expected: x\n`);
  const v2 = verdict === 'PASS' ? 'PASS' : verdict === 'REJECT' ? 'FAIL' : 'BLOCKED';
  writeFileSync(path.join(ws, 'evidence-report.md'), `---\nschema_version: 2\nfeature_slug: ${slug}\nverdict: ${verdict}\nreason: ${verdict === 'BLOCKED' ? 'xem so chay' : ''}\nverified_by: fresh-context verification subagent\nenforcement_mode: strict\nbypass_used: false\nverified_commit: ${'a'.repeat(40)}\nhuman_signoff:\n---\n\n# Evidence Report: ${slug}\n\n| Eval | Criterion | Executor | Verdict |\n|---|---|---|---|\n| E1 | AC-1 | script | PASS |\n| E2 | AC-2 | script | ${v2} |\n\n## Evidence\n\n- eval: E1\n  run_id: run-e1-1\n  exit_code: 0\n  verifier: config:executors.script.e1\n  verified_at: 2026-09-21T10:00:00Z\n\n## Known limits\n\n## Ngoài hợp đồng\n\n## Iterations\n\nRound 1: xem so chay.\n`);
  if (runLog.length || !existsSync(path.join(ws, 'run-log.jsonl'))) writeFileSync(path.join(ws, 'run-log.jsonl'), runLog.map(x => x + '\n').join(''));
  if (opportunity) writeFileSync(path.join(ws, 'opportunity.md'), opportunity);
  if (duongNen) writeFileSync(path.join(ws, 'duong-nen.md'), duongNen);
  return { d, ws };
}
const the = (d, slug = SLUG, gc = GC) => {
  const h = spawnSync(process.execPath, [gc, '--root', d, '--slug', slug], { encoding: 'utf8' });
  const x = spawnSync(process.execPath, [gc, '--root', d, '--slug', slug, '--extract'], { encoding: 'utf8' });
  let j = null; try { j = JSON.parse(x.stdout); } catch (_) { /* bản cũ / lỗi */ }
  return { html: h.stdout, st: h.status, err: h.stderr, j };
};
const bam = f => createHash('sha256').update(readFileSync(f)).digest('hex');
const ONE_SHOT_SIGNOFF = (() => { const m = readFileSync(GC, 'utf8').match(/const ONE_SHOT_CMD_SIGNOFF = '([^']+)'/); if (!m) throw new Error('khong rut duoc ONE_SHOT_CMD_SIGNOFF'); return m[1]; })();
const DEAD = (() => { const m = readFileSync(WF, 'utf8').match(/blocked\.push\(\{ cmd, reason: '(agent bi skip\/chet)/); if (!m) throw new Error('khong rut duoc cau agent chet tu acceptance-verify.js'); return m[1]; })();

// ── bản thẻ trước vòng ──────────────────────────────────────────────────────
const TRUOC = (() => {
  try {
    const shas = git(KIT, 'log', '--format=%H', '--reverse', '-S', 'NHAN-CANH-GAY', '--', 'scripts/gate-card.js').split('\n').filter(Boolean);
    if (!shas.length) return { loi: 'khong tim thay commit dua NHAN-CANH-GAY vao scripts/gate-card.js' };
    const d = mkdtempSync(path.join(TMP, 'truoc-'));
    const tar = execFileSync('git', ['-C', KIT, 'archive', `${shas[0]}^`, 'scripts', 'lib', 'skills'], { maxBuffer: 512 * 1024 * 1024 });
    execFileSync('tar', ['-x', '-C', d], { input: tar });
    return { gc: path.join(d, 'scripts', 'gate-card.js'), sha: shas[0] };
  } catch (e) { return { loi: loi(e) }; }
})();
// Khối không-ký-được = từ `<div class="gc">` tới hết (bản cũ in trọn thẻ trong nhánh đó).
const khoiKhoa = html => { const i = html.indexOf('<div class="gc">'); return i < 0 ? html : html.slice(i); };

// ── AC-4 ────────────────────────────────────────────────────────────────────
if (want('NC-AC4') || want('NC-AC4-cu')) {
  try {
    // Dòng thuoc-lech do thuoc-vat.mjs --write THẬT sinh sau một mũi tiêm (kho code sinh).
    const { d } = dungKho(mkdtempSync(path.join(TMP, 'k4-')), ['vat', 'implemented']);
    const ws = path.join(d, '_acceptance', SLUG_TV);
    const r1 = spawnSync(process.execPath, [path.join(KIT, 'feature-loop/scripts/s4-args.mjs'), '--slug', SLUG_TV, '--root', d, '--ag-root', KIT, '--out', path.join(ws, 's4-args.json'), '--diff-base', 'main'], { encoding: 'utf8' });
    if (r1.status !== 0) throw new Error('s4-args: ' + r1.stderr.split('\n')[0]);
    writeFileSync(path.join(ws, 'evals.yaml'), readFileSync(path.join(ws, 'evals.yaml'), 'utf8') + '# tiem\n');
    const r2 = spawnSync(process.execPath, [path.join(KIT, 'feature-loop/scripts/thuoc-vat.mjs'), '--root', d, '--slug', SLUG_TV, '--ag-root', KIT, '--write'], { encoding: 'utf8' });
    if (r2.status !== 5) throw new Error(`thuoc-vat --write thoat ${r2.status}, mong 5`);
    const logLech = readFileSync(path.join(ws, 'run-log.jsonl'), 'utf8').split('\n').filter(Boolean);
    // Đặt dòng ấy (nguyên văn) vào hồ sơ PASS.
    const coLech = hoSo({ verdict: 'PASS', runLog: logLech });
    const t = the(coLech.d);
    if (want('NC-AC4')) {
      if (!t.j) bad('NC-AC4', `extract loi: ${t.err}`);
      else if (t.j.approvable !== false || t.j.one_shot !== null) bad('NC-AC4', `thuoc lech ma approvable=${t.j.approvable} one_shot=${t.j.one_shot}`);
      else if (!t.html.includes('thước lệch')) bad('NC-AC4', 'HTML thieu nhan «thước lệch»');
      else if (!t.html.includes(`_acceptance/${SLUG_TV}/evals.yaml`)) bad('NC-AC4', 'HTML khong liet duong tep bi tiem');
      else if (t.html.includes(ONE_SHOT_SIGNOFF)) bad('NC-AC4', 'HTML van moi ky');
      else ok('NC-AC4', '— dong thuoc-lech that: the khoa, nhan «thước lệch», liet evals.yaml, khong moi ky');
    }
    if (want('NC-AC4-cu')) {
      if (TRUOC.loi) bad('NC-AC4-cu', TRUOC.loi);
      else {
        const khong = hoSo({ verdict: 'PASS', runLog: logLech.filter(l => !/"thuoc-lech"/.test(l)) });
        const moi = the(khong.d); const cu = the(khong.d, SLUG, TRUOC.gc);
        if (moi.html !== cu.html) bad('NC-AC4-cu', 'bo dong thuoc-lech ma HTML khac ban truoc vong');
        else ok('NC-AC4-cu', `— khong dong thuoc-lech: HTML bang ban truoc vong (${TRUOC.sha.slice(0, 8)}^) tung byte`);
      }
    }
  } catch (e) { if (want('NC-AC4')) bad('NC-AC4', loi(e)); if (want('NC-AC4-cu')) bad('NC-AC4-cu', loi(e)); }
}

// ── AC-5 ────────────────────────────────────────────────────────────────────
const CA_MU = [
  ['exit 97', { exitCode: 97, outputTail: '', runId: '', cannotRun: false }],
  ['exit 127', { exitCode: 127, outputTail: '', runId: '', cannotRun: false }],
  ['tool-kill', { exitCode: 1, outputTail: '', runId: '', cannotRun: false, killedByTool: true }],
  ['cannotRun eval', { exitCode: 0, outputTail: '', runId: '', cannotRun: true, reason: 'thieu bien moi truong DB' }],
];
if (want('NC-AC5')) {
  const sai = []; let n = 0;
  for (const [ten, e2] of CA_MU) {
    n += 1;
    try {
      const r = await cham(e2);
      if (r.verdict !== 'BLOCKED') { sai.push(`${ten}: bo cham tra ${r.verdict}, mong BLOCKED`); continue; }
      const { d, ws } = hoSo({ verdict: 'BLOCKED', runLog: r.runLog });
      const h0 = bam(path.join(ws, 'evidence-report.md'));
      const t = the(d);
      const h1 = bam(path.join(ws, 'evidence-report.md'));
      if (!t.j || t.j.approvable !== true) { sai.push(`${ten}: approvable ${t.j && t.j.approvable}`); continue; }
      if (!/Mù-1/.test(t.j.one_shot || '') || !/ký hay trả: ___$/.test(t.j.one_shot || '')) { sai.push(`${ten}: one_shot ${t.j.one_shot}`); continue; }
      const thieu = ['không đọc được ở đây', 'E2', 'AC-2', 'ghi hạn chế rồi ship', 'dựng bàn đo rồi chấm lại', 'trả lại'].filter(x => !t.html.includes(x));
      const soGia = (t.html.match(/— giá: /g) || []).length;
      if (thieu.length) sai.push(`${ten}: HTML thieu ${thieu.join(',')}`);
      else if (soGia !== 3) sai.push(`${ten}: ${soGia} dong gia, mong 3`);
      else if (h0 !== h1) sai.push(`${ten}: dung the lam doi bao cao`);
    } catch (e) { sai.push(`${ten}: ${loi(e)}`); }
  }
  if (n !== CA_MU.length) bad('NC-AC5', `so ca ${n}/${CA_MU.length}`);
  else if (sai.length) bad('NC-AC5', sai.join(' ; '));
  else ok('NC-AC5', `— ${n}/${CA_MU.length} ca ban do (sổ chạy do bộ chấm thật sinh): ô ký mở, Mù-1, ba lối, ba giá, báo cáo không đổi`);
}
if (want('NC-AC5-nen')) {
  try {
    const r = await cham(CA_MU[1][1]);
    // duong-nen.md do duong-nen.mjs THẬT sinh trên một kho có chân suite đỏ đúng khoá của E2.
    const kho = mkdtempSync(path.join(TMP, 'nen-'));
    execFileSync('git', ['init', '-q', '-b', 'main', kho]); git(kho, 'config', 'user.email', 't@t.t'); git(kho, 'config', 'user.name', 'T');
    mkdirSync(path.join(kho, '_acceptance', SLUG), { recursive: true });
    writeFileSync(path.join(kho, '_acceptance', 'config.yaml'), 'schema_version: 1\nexecutors:\n  script:\n    e1: "true"\n    e2: "exit 127"\nfeature_loop:\n  suite_keys:\n    - executors.script.e2\n');
    git(kho, 'add', '-A'); git(kho, 'commit', '-qm', 'goc');
    spawnSync(process.execPath, [path.join(KIT, 'feature-loop/scripts/duong-nen.mjs'), '--root', kho, '--slug', SLUG, '--ag-root', KIT], { encoding: 'utf8' });
    const nenTxt = readFileSync(path.join(kho, '_acceptance', SLUG, 'duong-nen.md'), 'utf8');
    if (!nenTxt.includes('executors.script.e2')) throw new Error('duong-nen.mjs khong ghi chan do cho executors.script.e2 — fixture khong dung hinh');
    const coNen = hoSo({ verdict: 'BLOCKED', runLog: r.runLog, duongNen: nenTxt });
    const khongNen = hoSo({ verdict: 'BLOCKED', runLog: r.runLog });
    const a = the(coNen.d); const b = the(khongNen.d);
    if (!a.html.includes('đỏ từ trước vòng')) bad('NC-AC5-nen', 'co duong-nen do trung E2 ma khong co cau «đỏ từ trước vòng»');
    else if (b.html.includes('đỏ từ trước vòng')) bad('NC-AC5-nen', 'khong co duong-nen ma van in cau');
    else ok('NC-AC5-nen', '— đường nền thật đỏ cùng khoá E2: khối chỗ mù có «đỏ từ trước vòng»; vắng tệp thì không');
  } catch (e) { bad('NC-AC5-nen', loi(e)); }
}

// ── AC-6 ────────────────────────────────────────────────────────────────────
if (want('NC-AC6')) {
  if (TRUOC.loi) bad('NC-AC6', TRUOC.loi);
  else {
    const sai = []; let n = 0;
    const CA = [
      ['REJECT exit 1', async () => cham({ exitCode: 1, outputTail: 'fail', runId: '', cannotRun: false })],
      ['BLOCKED evals khai thieu', async () => cham(null, { evals: [{ id: 'E1', criterion: 'AC-1', executor: 'script', ref: 'config:executors.script.e1', expected: 'x' }] })],
      ['BLOCKED hai ma thoat mong doi', async () => cham(null, { evals: [{ ...EVALS[0], cmd: 'cmd-x', expected_exit: 2 }, { ...EVALS[1], cmd: 'cmd-x', expected_exit: 3 }] })],
    ];
    for (const [ten, fn] of CA) {
      n += 1;
      try {
        const r = await fn();
        const { d } = hoSo({ verdict: r.verdict, runLog: r.runLog });
        const moi = the(d); const cu = the(d, SLUG, TRUOC.gc);
        if (!['REJECT', 'BLOCKED'].includes(r.verdict)) sai.push(`${ten}: bo cham tra ${r.verdict}`);
        else if (moi.j && moi.j.approvable !== false) sai.push(`${ten}: HEAD approvable ${moi.j.approvable}`);
        else if (khoiKhoa(moi.html) !== khoiKhoa(cu.html)) sai.push(`${ten}: khoi khoa khac ban truoc vong`);
      } catch (e) { sai.push(`${ten}: ${loi(e)}`); }
    }
    // Đối chứng dương: ca exit 127 PHẢI khác bản trước vòng — phép so không hằng đúng.
    let doiChung = false;
    try { const r = await cham(CA_MU[1][1]); const { d } = hoSo({ verdict: 'BLOCKED', runLog: r.runLog }); doiChung = the(d).html !== the(d, SLUG, TRUOC.gc).html; } catch (_) { doiChung = false; }
    if (!doiChung) bad('NC-AC6', 'doi chung duong: ca exit 127 cho HTML bang ban truoc vong — phep so hang dung, khong tin duoc');
    else if (n !== CA.length || sai.length) bad('NC-AC6', sai.join(' ; ') || `so ca ${n}`);
    else ok('NC-AC6', `— ${n}/${CA.length} ca khoa bang ban truoc vong tung byte; doi chung exit 127 khac`);
  }
}

// ── AC-7 (+ ca trộn thật crm dieu-phoi lượt D 21/09) ─────────────────────────
if (want('NC-AC7-mot') || want('NC-AC7-hai') || want('NC-AC7-tron')) {
  try {
    const lan1 = await cham(() => null, { invokedAt: '2026-09-21T10:00:00Z' });
    const lan2 = await cham(() => null, { invokedAt: '2026-09-21T11:00:00Z' });
    const lan2Round2 = await cham(() => null, { invokedAt: '2026-09-21T11:00:00Z', round: 2 });
    if (!lan1.runLog.some(l => l.includes(DEAD))) throw new Error('bo cham khong ghi dong co cau agent chet — fixture khong dung hinh');
    if (want('NC-AC7-mot')) {
      const t = the(hoSo({ verdict: 'BLOCKED', runLog: lan1.runLog }).d);
      if (!t.j || t.j.approvable !== false) bad('NC-AC7-mot', `mot luot chet ma approvable ${t.j && t.j.approvable}`);
      else if (!t.html.includes('hệ thống chết') || !t.html.includes('thử lại một lần')) bad('NC-AC7-mot', 'HTML thieu «hệ thống chết» / «thử lại một lần»');
      else ok('NC-AC7-mot', '— mot luot chet: khoa, «hệ thống chết», máy thử lại một lần');
    }
    if (want('NC-AC7-hai')) {
      const t = the(hoSo({ verdict: 'BLOCKED', runLog: [...lan1.runLog, ...lan2.runLog] }).d);
      const dc = the(hoSo({ verdict: 'BLOCKED', runLog: [...lan1.runLog, ...lan2Round2.runLog] }).d);
      if (!t.j || t.j.approvable !== true) bad('NC-AC7-hai', `hai luot chet cung round ma approvable ${t.j && t.j.approvable}`);
      else if (!t.html.includes('hệ thống chết') || !t.html.includes('ghi hạn chế rồi ship')) bad('NC-AC7-hai', 'HTML thieu nhan / ba loi');
      else if (!dc.j || dc.j.approvable !== false) bad('NC-AC7-hai', 'doi chung: lan hai o round 2 ma van mo o ky');
      else ok('NC-AC7-hai', '— hai luot chet cung round: o ky mo, «hệ thống chết», ba loi; lan hai o round khac thi van khoa');
    }
    if (want('NC-AC7-tron')) {
      const vat = { exitCode: 1, outputTail: 'fail', runId: '', cannotRun: false };
      const t1 = await cham(() => null, { invokedAt: '2026-09-21T10:00:00Z' }, vat);
      const t2 = await cham(() => null, { invokedAt: '2026-09-21T11:00:00Z' }, vat);
      const t = the(hoSo({ verdict: 'BLOCKED', runLog: [...t1.runLog, ...t2.runLog] }).d);
      if (!t.j || t.j.approvable !== false) bad('NC-AC7-tron', `chet + do vi vat ma approvable ${t.j && t.j.approvable}`);
      else if (!/sai hợp đồng — E1/.test(t.html) || !/hệ thống chết — E2/.test(t.html)) bad('NC-AC7-tron', 'HTML khong goi hai nhan tren hai dong');
      else ok('NC-AC7-tron', '— E2 chet + E1 do vi vat, da thu lai: van khoa, hai nhan hai dong');
    }
  } catch (e) { for (const c of ['NC-AC7-mot', 'NC-AC7-hai', 'NC-AC7-tron']) if (want(c)) bad(c, loi(e)); }
}

// ── AC-12 ───────────────────────────────────────────────────────────────────
const OPP = n => `---\nschema_version: 1\nslug: ${SLUG}\nfeature: Y dinh mau <co ky tu & dac biet>\nstage: decided\ndecision: build\n---\n\n## Vấn đề & ai gặp\n\n${Array.from({ length: n }, (_, i) => `Dong van de so ${i + 1} — nguoi dung <${i}>`).join('\n')}\n\n## Giả định chốt sinh tử\n\n1. x\n`;
const escH = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
if (want('NC-AC12-co') || want('NC-AC12-dai') || want('NC-AC12-khong')) {
  try {
    const rPass = (await cham({ exitCode: 0, outputTail: 'ok', runId: '', cannotRun: false })).runLog;
    const cot = (opp) => { const t = readFileSync(path.join(opp, 'opportunity.md'), 'utf8'); const fe = t.match(/^feature: (.*)$/m)[1]; const body = t.split('## Vấn đề & ai gặp')[1].split('\n## ')[0].split('\n').filter(l => l.trim()); return { fe, body }; };
    if (want('NC-AC12-co')) {
      const { d, ws } = hoSo({ verdict: 'PASS', runLog: rPass, opportunity: OPP(5) });
      const { fe, body } = cot(ws); const t = the(d);
      const thieu = [fe, ...body].filter(x => !t.html.includes(escH(x)));
      if (thieu.length) bad('NC-AC12-co', `HTML thieu ${thieu.length} dong nguyen van: ${thieu[0]}`);
      else ok('NC-AC12-co', `— feature + ${body.length} dong «Vấn đề & ai gặp» nguyen van tren the`);
    }
    if (want('NC-AC12-dai')) {
      const { d, ws } = hoSo({ verdict: 'PASS', runLog: rPass, opportunity: OPP(13) });
      const { body } = cot(ws); const t = the(d);
      const thieu12 = body.slice(0, 12).filter(x => !t.html.includes(escH(x)));
      if (thieu12.length) bad('NC-AC12-dai', `thieu ${thieu12.length} trong 12 dong dau`);
      else if (t.html.includes(escH(body[12]))) bad('NC-AC12-dai', 'dong thu 13 van co mat');
      else if (!t.html.includes('xem opportunity.md')) bad('NC-AC12-dai', 'thieu «xem opportunity.md»');
      else ok('NC-AC12-dai', '— than 13 dong: 12 dong dau co mat, dong 13 vang, co «xem opportunity.md»');
    }
    if (want('NC-AC12-khong')) {
      const co = the(hoSo({ verdict: 'PASS', runLog: rPass, opportunity: OPP(5) }).d);
      const khong = the(hoSo({ verdict: 'PASS', runLog: rPass }).d);
      const coFlag = (co.html.match(/class="flag /g) || []).length; const khongFlag = (khong.html.match(/class="flag /g) || []).length;
      if (khong.html.includes('Ý định (nguyên văn Cổng Đáng)')) bad('NC-AC12-khong', 'khong opportunity.md ma van co khoi y dinh');
      else if (khongFlag > coFlag) bad('NC-AC12-khong', `vang opportunity.md them co (${khongFlag} > ${coFlag})`);
      else ok('NC-AC12-khong', '— vang opportunity.md: khong khoi, khong them co');
    }
  } catch (e) { for (const c of ['NC-AC12-co', 'NC-AC12-dai', 'NC-AC12-khong']) if (want(c)) bad(c, loi(e)); }
}

rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (ntr-the-canh-gay)`);
process.exit(fail ? 1 : 0);
