// run-id-danh-sach-cho-phep.test.mjs — hồ sơ run-id-danh-sach-cho-phep (issue #467, vòng vá 2.36.2).
// crm rang-hang-cong-cu E9: tác tử chạy lệnh trả `runId` là một dấu huyền «`» khi lệnh không in run_id;
// bên viết chỉ bóc nháy nên giữ nó, run-log ghi «`», rồi carry-plan mang nguyên mã hỏng sang lượt 2.
// Nghiệm: MỘT luật hình dạng mã (danh sách CHO PHÉP, khối RUN-ID-HINH của bộ chấm) — mã không đạt thì
// máy đúc mã như khi trống; carry-plan rút CÙNG khối ấy, gặp dòng cũ sai hình dạng thì cho eval chạy lại
// kèm một dòng lý do.
// Tên nhóm RH<n> = AC-<n>.
//
// Fixture: dòng run-log do bộ chấm THẬT dựng (harness vm); kế hoạch mang sang do carry-plan / s4-args
// THẬT tính trên kho git do code sinh. Bản «gốc» = main 115100b6 (trước vòng, mang lỗi) dựng TRỌN
// bốn thư mục bằng `git archive` trong lượt — để mỗi ca chiều đỏ chứng được fixture TÁI HIỆN lỗi trên
// bản gốc. Đột biến chạy trên bản sao (bộ nhớ hay thư mục tạm); kim khớp đúng một lần trước khi tin.
// Mọi đường suy từ vị trí tệp này.
//
//   node tests/scripts/run-id-danh-sach-cho-phep.test.mjs [RH1 RH4 …]   (hoặc RH_CASES=RH1,RH4)
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { runWorkflow } from '../workflows/harness.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const WF = path.join(KIT, 'feature-loop', 'workflows', 'acceptance-verify.js');
const SRC = readFileSync(WF, 'utf8');
const { extractRunIds } = createRequire(import.meta.url)(path.join(KIT, 'lib', 'evidence-core.cjs'));
const TMP = mkdtempSync(path.join(tmpdir(), 'rh-'));
const CHON = (() => {
  const a = process.argv.slice(2).filter(x => /^RH\d/.test(x));
  if (a.length) return a;
  return process.env.RH_CASES ? process.env.RH_CASES.split(',') : null;
})();
const want = g => !CHON || CHON.includes(g);
let pass = 0, fail = 0;
const ok = (name, msg = '') => { pass += 1; console.log(`PASS: ${name} ${msg}`.trimEnd() + ' '); };
const bad = (name, msg) => { fail += 1; console.log(`FAIL: ${name} — ${msg}`); };
const loi = e => String((e && (e.stderr || e.message)) || e).split('\n').slice(0, 3).join(' | ');
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const soLan = (hay, kim) => hay.split(kim).length - 1;
const W = (d, rel, s) => { const f = path.join(d, rel); mkdirSync(path.dirname(f), { recursive: true }); writeFileSync(f, s); };

// ── Bản gốc (trước vòng) ────────────────────────────────────────────────────
const GOC_SHA = '115100b6';
const GOC = (() => {
  try {
    const d = mkdtempSync(path.join(TMP, 'goc-'));
    const tar = execFileSync('git', ['-C', KIT, 'archive', GOC_SHA, 'feature-loop', 'lib', 'scripts', 'skills'], { maxBuffer: 512 * 1024 * 1024 });
    execFileSync('tar', ['-x', '-C', d], { input: tar });
    return { goc: d, src: readFileSync(path.join(d, 'feature-loop', 'workflows', 'acceptance-verify.js'), 'utf8') };
  } catch (e) { return { loi: loi(e) }; }
})();
const MOI = { goc: KIT, src: SRC };

// ── Ma trận viết trước ──────────────────────────────────────────────────────
// Mã tác tử khai mà KHÔNG phải mã lượt — máy phải đúc mã. Hàng đầu là đúng vật crm (E9).
const DUC = ['`', '``', '`abc123`', '""', "''", "\"''\"", '   ', 'none', 'null', 'abc', 'rid 12', 'a/b-12'];
// Mã hợp lệ (đối chứng dương) — [tác tử khai, run-log phải ghi].
const GIU = [
  ['rid-a1', 'rid-a1'],
  ['"rid-e9"', 'rid-e9'],
  ["'rid-e9'", 'rid-e9'],
  ['run-1 # ghi chu', 'run-1'],
  ['3f2a9c1e-7b4d-4e2a-9f1c-0a1b2c3d4e5f', '3f2a9c1e-7b4d-4e2a-9f1c-0a1b2c3d4e5f'],
  ['2026-10-31T14:12:53Z', '2026-10-31T14:12:53Z'],
  ['minted-demo-E1-r1', 'minted-demo-E1-r1'],
  ['vitest_run.42', 'vitest_run.42'],
];

const VC = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2';
const ev = (id, cmd) => ({ id, criterion: 'AC-1', executor: 'script', cmd, ref: `config:executors.script.${id}`, expected: 'ok' });
const baseArgs = (over = {}) => ({ slug: 'demo', round: 2, riskTier: 'T2', evals: [ev('E1', 'bash t/a.sh')], suiteCommands: [],
  diffBase: 'main', repoRoot: '/repo', personasPath: '/p.md', templatePath: '/t.md', invokedAt: '2026-10-31T00:00:00Z', ...over });
const traLoi = (ridTheoLenh) => (call) => {
  const l = call.label;
  if (l.startsWith('machine:')) {
    const cmd = l.slice('machine:'.length);
    const rid = typeof ridTheoLenh === 'function' ? ridTheoLenh(cmd) : ridTheoLenh;
    return { exitCode: 0, outputTail: 'ok\n__EXIT=0', runId: rid, cannotRun: false };
  }
  if (l.startsWith('review:')) return { findings: [] };
  if (l.startsWith('refute:')) return { refuted: true, reason: 'x' };
  if (l.startsWith('triage')) return { items: [] };
  if (l.startsWith('baseline:')) return { results: [] };
  if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: VC };
  if (l === 'synthesize:report') return { report: '# Evidence', findings: '# Findings\n' };
  return null;
};
const dongLog = r => r.result.runLog.map(l => JSON.parse(l));
const ridEval = async (src, rid, id = 'E1') => (dongLog(await runWorkflow(WF, baseArgs(), traLoi(rid), src)).find(o => o.evalId === id) || {}).run_id;
const ridSuite = async (src, rid) => (dongLog(await runWorkflow(WF, baseArgs({ suiteCommands: ['bash t/s.sh'] }), traLoi(c => (c === 'bash t/s.sh' ? rid : 'rid-e1-ok')), src))
  .find(o => String(o.evalId).startsWith('SUITE-')) || {}).run_id;

// Đột biến của bên viết: bỏ danh sách cho phép, giữ phần bóc — đúng hình dạng lỗi #467.
const KIM_CHO_PHEP = "return RUN_ID_HINH.test(s) ? s : ''";
const DOT_BIEN = SRC.replace(KIM_CHO_PHEP, 'return s');

// ═════ RH1 — bên viết, dòng eval ════════════════════════════════════════════
if (want('RH1')) {
  const sai = [];
  for (const rid of DUC) {
    const got = await ridEval(SRC, rid);
    if (got !== 'minted-demo-E1-r2') sai.push(`${JSON.stringify(rid)} → ${JSON.stringify(got)}, mong minted-demo-E1-r2`);
  }
  for (const [rid, mong] of GIU) {
    const got = await ridEval(SRC, rid);
    if (got !== mong) sai.push(`doi chung ${JSON.stringify(rid)} → ${JSON.stringify(got)}, mong ${JSON.stringify(mong)}`);
  }
  if (sai.length) bad('RH1', sai.join(' ; '));
  else ok('RH1', `dong-eval — ${DUC.length}/${DUC.length} mã sai hình dạng đúc minted-demo-E1-r2; ${GIU.length}/${GIU.length} mã hợp lệ giữ đúng`);
}
if (want('RH1')) {
  const sai = [];
  if (GOC.loi) sai.push(`khong dung duoc ban goc: ${GOC.loi}`);
  else { const g = await ridEval(GOC.src, '`'); if (g !== '`') sai.push(`ban goc ${GOC_SHA} ghi ${JSON.stringify(g)} — fixture khong tai hien loi (mong «\`»)`); }
  if (soLan(SRC, KIM_CHO_PHEP) !== 1) sai.push(`kim cho-phep khop ${soLan(SRC, KIM_CHO_PHEP)} lan`);
  else { const m = await ridEval(DOT_BIEN, '`'); if (m !== '`') sai.push(`dot bien (bo danh sach cho phep) ghi ${JSON.stringify(m)}, mong «\`»`); }
  if (sai.length) bad('RH1-do', sai.join(' ; '));
  else ok('RH1-do', 'ban-goc-va-dot-bien — bản gốc và bản bỏ danh sách cho phép đều ghi «`» vào run-log');
}

// ═════ RH2 — bên viết, dòng suite ═══════════════════════════════════════════
if (want('RH2')) {
  const sai = [];
  for (const rid of DUC) {
    const got = await ridSuite(SRC, rid);
    if (!/^minted-demo-SUITE-bash_t_s_sh-r2$/.test(String(got))) sai.push(`${JSON.stringify(rid)} → ${JSON.stringify(got)}, mong minted-demo-SUITE-bash_t_s_sh-r2`);
  }
  for (const [rid, mong] of GIU) {
    const got = await ridSuite(SRC, rid);
    if (got !== mong) sai.push(`doi chung ${JSON.stringify(rid)} → ${JSON.stringify(got)}, mong ${JSON.stringify(mong)}`);
  }
  if (!GOC.loi) { const g = await ridSuite(GOC.src, '`'); if (g !== '`') sai.push(`ban goc ghi ${JSON.stringify(g)} cho suite — fixture khong tai hien loi`); }
  else sai.push(`khong dung duoc ban goc: ${GOC.loi}`);
  const m = await ridSuite(DOT_BIEN, '`'); if (m !== '`') sai.push(`dot bien ghi ${JSON.stringify(m)} cho suite, mong «\`»`);
  if (sai.length) bad('RH2', sai.join(' ; '));
  else ok('RH2', `dong-suite — ${DUC.length}/${DUC.length} đúc minted-demo-SUITE-…-r2, ${GIU.length}/${GIU.length} giữ; bản gốc và đột biến ghi «\`»`);
}

// ═════ RH3 — khứ hồi: mọi mã bên viết ghi → bộ đọc báo cáo đọc lại đúng nó, carry-plan nhận nó ═════
// Kho thử: một lượt chấm THẬT với mọi đầu vào của hai ma trận (mỗi eval một lệnh), run-log có sha;
// carry-plan lượt 2 không delta phải mang sang MỌI eval với đúng run_id lượt 1.
const CP = (goc) => path.join(goc, 'feature-loop', 'scripts', 'carry-plan.mjs');
function hoSoCarry(dongs) {
  const d = mkdtempSync(path.join(TMP, 'cp-'));
  const ids = [...new Set(dongs.map(l => l.evalId))];
  W(d, 'contract.md', ['---', 'slug: demo', 'risk_tier: T2', '---', '', '## Criteria', '', '- AC-1: Given a, When b, Then c.', ''].join('\n'));
  W(d, 'evals.yaml', ['evals:', ...ids.flatMap(id => [`  - id: ${id}`, '    criterion: AC-1', '    executor: script', `    cmd: "bash t/${id}.sh"`, `    paths: ["src/${id}/**"]`]), ''].join('\n'));
  W(d, 'run-log.jsonl', dongs.map(l => JSON.stringify(l)).join('\n') + '\n');
  return d;
}
const chayCarry = (goc, d, delta = '') => spawnSync(process.execPath, [CP(goc), '--run-log', path.join(d, 'run-log.jsonl'),
  '--evals', path.join(d, 'evals.yaml'), '--contract', path.join(d, 'contract.md'), '--round', '2', '--ag-root', goc,
  ...(delta ? ['--delta-files', delta] : ['--no-delta'])], { encoding: 'utf8' });
if (want('RH3')) {
  try {
    const vao = [...DUC, ...GIU.map(([r]) => r)];
    const evals = vao.map((_, i) => ev(`E${i + 1}`, `bash t/E${i + 1}.sh`));
    const r = await runWorkflow(WF, baseArgs({ round: 1, evals, invokedSha: VC }), traLoi(c => vao[Number(c.match(/E(\d+)\.sh$/)[1]) - 1]));
    const dongs = dongLog(r).filter(o => /^E\d+$/.test(o.evalId));
    const sai = [];
    if (dongs.length !== vao.length) sai.push(`${dongs.length} dong eval, mong ${vao.length}`);
    for (const l of dongs) {
      const doc = extractRunIds(`  run_id: ${l.run_id}`);
      if (!(doc.length === 1 && doc[0] === l.run_id)) sai.push(`${l.evalId}=${JSON.stringify(l.run_id)} doc lai ${JSON.stringify(doc)}`);
      if (String(l.run_id).length < 4) sai.push(`${l.evalId}=${JSON.stringify(l.run_id)} ngan hon 4 ky tu (the Cong 2 coi la thieu)`);
    }
    const d = hoSoCarry(dongs);
    const cp = chayCarry(KIT, d);
    const plan = cp.status === 0 ? JSON.parse(cp.stdout) : null;
    if (!plan) sai.push(`carry-plan thoat ${cp.status}: ${String(cp.stderr).split('\n')[0]}`);
    else {
      const mang = new Map(plan.carriedEvals.map(c => [c.id, c.runId]));
      for (const l of dongs) if (mang.get(l.evalId) !== l.run_id) sai.push(`${l.evalId}: carry-plan ${mang.has(l.evalId) ? `mang ${JSON.stringify(mang.get(l.evalId))}` : `khong mang (${plan.reason[l.evalId]})`}, mong mang ${JSON.stringify(l.run_id)}`);
    }
    if (sai.length) bad('RH3', sai.join(' ; '));
    else ok('RH3', `khu-hoi — ${dongs.length}/${vao.length} mã bên viết ghi: bộ đọc báo cáo đọc lại đúng, ≥ 4 ký tự, carry-plan mang sang nguyên văn`);
  } catch (e) { bad('RH3', loi(e)); }
}

// ═════ RH4 — bộ lọc mang sang của bộ chấm ═══════════════════════════════════
if (want('RH4')) {
  const sai = [];
  const coCham = c => c.label === 'machine:bash t/a.sh';
  const mangVao = rid => baseArgs({ suiteCommands: ['npm run build'], carriedEvals: [{ id: 'E1', runId: rid, fromRound: 1, verifiedAt: '2026-10-30T00:00:00Z', cmd: 'bash t/a.sh' }] });
  for (const rid of ['`', '``', '`abc123`', 'none', 'rid 12']) {
    const r = await runWorkflow(WF, mangVao(rid), traLoi('rid-moi-r2'));
    const d = dongLog(r).filter(o => o.evalId === 'E1');
    if (!(r.calls.some(coCham) && d.length === 1 && d[0].run_id === 'rid-moi-r2' && !('carried_from_round' in d[0])))
      sai.push(`${JSON.stringify(rid)} → ${JSON.stringify(d)} (chay lai: ${r.calls.some(coCham)})`);
  }
  const rOk = await runWorkflow(WF, mangVao('run-that-123'), traLoi('rid-moi-r2'));
  const dOk = dongLog(rOk).filter(o => o.evalId === 'E1');
  if (!(!rOk.calls.some(coCham) && dOk.length === 1 && dOk[0].run_id === 'run-that-123' && dOk[0].carried_from_round === 1))
    sai.push(`doi chung run-that-123 → ${JSON.stringify(dOk)}`);
  if (!GOC.loi) {
    const rg = await runWorkflow(WF, mangVao('`'), traLoi('rid-moi-r2'), GOC.src);
    const dg = dongLog(rg).filter(o => o.evalId === 'E1');
    if (!(dg.length === 1 && dg[0].run_id === '`' && dg[0].carried_from_round === 1)) sai.push(`ban goc khong mang «\`» sang — fixture khong tai hien loi: ${JSON.stringify(dg)}`);
  } else sai.push(`khong dung duoc ban goc: ${GOC.loi}`);
  if (sai.length) bad('RH4', sai.join(' ; '));
  else ok('RH4', 'loc-mang-sang — 5/5 mã mang sang sai hình dạng: eval chạy lại, dòng mới không mang carried_from_round; mã thật vẫn mang sang; bản gốc mang «`»');
}

// ═════ RH5 — sổ cũ hỏng qua s4-args + carry-plan (đầu-cuối trên kho git) ═════
const SLUG = 'demo';
const WS = d => path.join(d, '_acceptance', SLUG);
function kho() {
  const d = mkdtempSync(path.join(TMP, 'k-'));
  execFileSync('git', ['init', '-q', '-b', 'main', d]);
  git(d, 'config', 'user.email', 't@t.t'); git(d, 'config', 'user.name', 'T');
  W(d, '_acceptance/config.yaml', 'schema_version: 1\nexecutors:\n  script:\n    e1: "echo 1"\n    e2: "echo 2"\n    e3: "echo 3"\n  test:\n    suite: "echo s"\nfeature_loop:\n  suite_keys:\n    - executors.test.suite\nrisk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n');
  W(d, `_acceptance/${SLUG}/contract.md`, ['---', 'schema_version: 1', `slug: ${SLUG}`, 'risk_tier: T2', 'status: implemented', '---', '', `# Acceptance Contract: ${SLUG}`, '', '## Acceptance Criteria', '',
    '- AC-1: Given hồ sơ, When chạy, Then in ra 1.', '- AC-2: Given hồ sơ, When chạy, Then in ra 2.', '- AC-3: Given hồ sơ, When chạy, Then in ra 3.', ''].join('\n'));
  W(d, `_acceptance/${SLUG}/evals.yaml`, ['schema_version: 1', `feature_slug: ${SLUG}`, 'evals:',
    ...[1, 2, 3].flatMap(n => [`  - id: E${n}`, `    criterion: AC-${n}`, '    executor: script', `    cmd: config:executors.script.e${n}`, `    paths: [src/${n}.js]`, `    expected: in ra ${n}`]), ''].join('\n'));
  W(d, `_acceptance/${SLUG}/run-log.jsonl`, '');
  for (const n of [1, 2, 3]) W(d, `src/${n}.js`, `// ${n}\n`);
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'goc');
  git(d, 'checkout', '-qb', 'vong');
  W(d, 'src/1.js', '// 1 v1\n'); git(d, 'add', '-A'); git(d, 'commit', '-qm', 'vat');
  return d;
}
const commitAll = (d, msg) => { git(d, 'add', '-A'); git(d, 'commit', '-qm', msg, '--allow-empty'); return git(d, 'rev-parse', 'HEAD'); };
const s4 = (ban, d, extra) => spawnSync(process.execPath, [path.join(ban.goc, 'feature-loop', 'scripts', 's4-args.mjs'), '--slug', SLUG, '--root', d, '--ag-root', ban.goc, '--diff-base', 'main', ...extra], { encoding: 'utf8' });
function sinhArgs(ban, d, ten, extra) {
  const out = path.join(WS(d), ten);
  const r = s4(ban, d, ['--out', out, ...extra]);
  if (r.status !== 0) throw new Error(`s4-args thoat ${r.status}: ${String(r.stderr).split('\n').filter(Boolean).slice(-2).join(' | ')}`);
  return { a: JSON.parse(readFileSync(out, 'utf8')), stderr: r.stderr };
}
// Lượt 1 chấm bằng bộ chấm của bản `banGhi`: tác tử trả «`» cho lệnh của E1 (lệnh không in run_id),
// mã thật cho hai lệnh còn lại. Rồi một nhát sửa vật chạm src/2.js (E2 phải chạy lại vì delta).
async function luot1(banGhi, d) {
  const { a } = sinhArgs(MOI, d, 's4-args.json', []);
  const r = await runWorkflow(WF, { slug: SLUG, round: a.round, riskTier: 'T2', evals: a.evals, suiteCommands: a.suiteCommands, diffBase: 'main', repoRoot: d,
    personasPath: '/p', templatePath: '/t', invokedAt: a.invokedAt, invokedSha: a.invokedSha },
  traLoi(c => (/echo 1/.test(c) ? '`' : `rid-${/echo (\w)/.exec(c)?.[1] || 'x'}-r1-7f3a`)), banGhi.src);
  W(d, `_acceptance/${SLUG}/run-log.jsonl`, r.result.runLog.join('\n') + '\n');
  commitAll(d, 'so luot 1');
  W(d, 'src/2.js', '// 2 sua\n');
  commitAll(d, 'sua vat 2');
  return { anchor: a.invokedSha, e1: (dongLog(r).find(o => o.evalId === 'E1') || {}).run_id };
}
const mangIds = a => (a.carriedEvals || []).map(c => c.id).sort();
if (want('RH5')) {
  try {
    if (GOC.loi) throw new Error(`khong dung duoc ban goc: ${GOC.loi}`);
    const sai = [];
    // (a) sổ cũ do bản GỐC ghi → bản mới không mang E1, nói ra một dòng; bản gốc mang E1.
    const d = kho();
    const { anchor, e1 } = await luot1(GOC, d);
    if (e1 !== '`') sai.push(`ban goc ghi E1=${JSON.stringify(e1)} o luot 1 — fixture khong tai hien so cu hong`);
    const moi = sinhArgs(MOI, d, 's4-args-r2.json', ['--carry-anchor', anchor]);
    if (JSON.stringify(mangIds(moi.a)) !== JSON.stringify(['E3'])) sai.push(`ban moi mang ${JSON.stringify(mangIds(moi.a))}, mong ["E3"]`);
    if (!/s4-args: E1 không mang sang — run_id lượt trước sai hình dạng \("`"\)/.test(moi.stderr)) sai.push(`thieu dong ghim «E1 không mang sang — run_id lượt trước sai hình dạng ("\`")»: ${moi.stderr.split('\n').filter(l => /E1/.test(l)).join(' | ') || '(khong dong nao)'}`);
    if (/E3 không mang sang/.test(moi.stderr)) sai.push('ban moi bao nham E3');
    const cu = sinhArgs(GOC, d, 's4-args-r2-goc.json', ['--carry-anchor', anchor]);
    const e1Cu = (cu.a.carriedEvals || []).find(c => c.id === 'E1');
    if (!(e1Cu && e1Cu.runId === '`')) sai.push(`ban goc khong mang E1 «\`» sang — fixture khong tai hien loi: ${JSON.stringify(cu.a.carriedEvals)}`);
    // (b) đối chứng dương: sổ do bản MỚI ghi → E1 mang mã đúc, lượt 2 mang E1 sang, im.
    const d2 = kho();
    const l2 = await luot1(MOI, d2);
    const moi2 = sinhArgs(MOI, d2, 's4-args-r2.json', ['--carry-anchor', l2.anchor]);
    if (l2.e1 !== 'minted-demo-E1-r1') sai.push(`ban moi ghi E1=${JSON.stringify(l2.e1)}, mong minted-demo-E1-r1`);
    if (JSON.stringify(mangIds(moi2.a)) !== JSON.stringify(['E1', 'E3'])) sai.push(`doi chung: ban moi mang ${JSON.stringify(mangIds(moi2.a))}, mong ["E1","E3"]`);
    if (/sai hình dạng/.test(moi2.stderr)) sai.push('doi chung: so lanh van in dong sai hinh dang');
    if (sai.length) bad('RH5', sai.join(' ; '));
    else ok('RH5', 'so-cu-hong — sổ lượt 1 do bản gốc ghi «`»: bản mới mang [E3], in dòng ghim cho E1; bản gốc mang E1 «`»; sổ do bản mới ghi: mang [E1,E3], im');
  } catch (e) { bad('RH5', loi(e)); }
}

// ═════ RH6 — một nguồn: carry-plan rút luật từ khối RUN-ID-HINH của bộ chấm ═════
// Bản sao TRỌN feature-loop/ và lib/ (không chép danh sách tệp tay); sửa khối trong bản sao.
function banSao(sua) {
  const d = mkdtempSync(path.join(TMP, 'sao-'));
  for (const t of ['feature-loop', 'lib']) cpSync(path.join(KIT, t), path.join(d, t), { recursive: true });
  const f = path.join(d, 'feature-loop', 'workflows', 'acceptance-verify.js');
  const goc = readFileSync(f, 'utf8');
  const moi = sua(goc);
  writeFileSync(f, moi);
  return { d, khac: moi !== goc };
}
const KHOI_RE = /(\/\/ <<<RUN-ID-HINH\n)[\s\S]*?(\/\/ RUN-ID-HINH>>>)/;
if (want('RH6')) {
  try {
    const sai = [];
    const so = [{ ts: '2026-10-31T00:00:00Z', sha: VC, round: 1, evalId: 'E1', run_id: '`', exit_code: 0, cmd: 'bash t/E1.sh' },
      { ts: '2026-10-31T00:00:00Z', sha: VC, round: 1, evalId: 'E2', run_id: 'minted-demo-E2-r1', exit_code: 0, cmd: 'bash t/E2.sh' }];
    const hs = hoSoCarry(so);
    if ((SRC.match(new RegExp(KHOI_RE.source, 'g')) || []).length !== 1) sai.push('khoi RUN-ID-HINH khong khop dung mot lan trong bo cham');
    // đối chứng dương: bản sao nguyên vẹn → E1 chạy lại (lý do ghim), E2 mang sang.
    const lanh = banSao(s => s);
    const rL = chayCarry(lanh.d, hs);
    const pL = rL.status === 0 ? JSON.parse(rL.stdout) : null;
    if (!pL || JSON.stringify(pL.carriedEvals.map(c => c.id)) !== '["E2"]' || !/^run_id lượt trước sai hình dạng \("`"\)/.test(pL.reason.E1 || ''))
      sai.push(`ban sao lanh: thoat ${rL.status} ${pL ? JSON.stringify({ mang: pL.carriedEvals.map(c => c.id), E1: pL.reason.E1 }) : String(rL.stderr).split('\n')[0]}`);
    // (a) nới luật trong khối của bộ chấm → carry-plan nới theo (mang cả «`»).
    const noi = banSao(s => s.replace(KHOI_RE, '$1const RUN_ID_HINH = /^[\\s\\S]+$/\n$2'));
    const rN = chayCarry(noi.d, hs);
    const pN = rN.status === 0 ? JSON.parse(rN.stdout) : null;
    if (!noi.khac || !pN || JSON.stringify(pN.carriedEvals.map(c => c.id).sort()) !== '["E1","E2"]')
      sai.push(`noi khoi (khac=${noi.khac}): carry-plan ${pN ? `mang ${JSON.stringify(pN.carriedEvals.map(c => c.id))}` : `thoat ${rN.status}`}, mong ["E1","E2"] — carry-plan khong rut luat tu bo cham`);
    // (b) gỡ khối → carry-plan dừng có tên, không đoán.
    const go = banSao(s => s.replace(KHOI_RE, ''));
    const rG = chayCarry(go.d, hs);
    if (!go.khac || rG.status !== 2 || !/carry-plan: không rút được luật hình dạng run_id \(khối RUN-ID-HINH\)/.test(rG.stderr))
      sai.push(`go khoi (khac=${go.khac}): thoat ${rG.status}, stderr ${JSON.stringify(String(rG.stderr).split('\n')[0])}`);
    if (sai.length) bad('RH6', sai.join(' ; '));
    else ok('RH6', 'mot-nguon — bản sao lành: E1 «`» chạy lại có lý do, E2 mang; nới khối của bộ chấm → carry-plan mang cả E1; gỡ khối → thoát 2 có tên');
  } catch (e) { bad('RH6', loi(e)); }
}

rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
