// cham-lai-khong-tu-doi.test.mjs — hồ sơ cham-lai-khong-tu-doi (hàng VA1, T2, 16/10).
// Hai lỗi «thước tự dối» ở lượt chấm lại, cả hai có neo ở crm:
//   · mang sang (carry) một eval mà ĐỊNH NGHĨA của nó — khối eval hay chữ tiêu chí — đã đổi
//     giữa hai lượt (crm goi-y-mo-ke-hoach DA3b: E10 expected 21→22, vẫn mang từ lượt 2);
//   · thuoc-vat --write so thước/cây bằng tệp tham số của LƯỢT 1 khi phiên lưu tham số lượt
//     sau vào tệp riêng (crm K7: `s4-args-r2.json`, `s4-args-r3.json`) → dòng `thuoc-lech`
//     mang sha lượt 1 và dòng `cay-doi` muộn cho lượt 1, thẻ khoá «thước lệch».
// Tên nhóm CL<n> = AC-<n>.
//
// Fixture: kho git do CODE sinh; tệp args do s4-args THẬT sinh; dòng sổ của lượt chấm do bộ
// chấm THẬT dựng (harness vm); dòng thuoc-lech/cay-doi do thuoc-vat --write THẬT ghi. Bản
// «trước vòng» lấy bằng `git archive` (cha của commit đầu đưa `dinhNghiaTai` vào carry-plan;
// chưa commit → HEAD) — để mỗi ca chiều đỏ chứng được fixture TÁI HIỆN lỗi trên bản cũ, và mỗi
// ca chiều im so bằng nhau với bản cũ. Mọi đường suy từ vị trí tệp này.
//
//   node tests/scripts/cham-lai-khong-tu-doi.test.mjs [--only CL1,CL6]   (hoặc CL_CASES=…)
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, appendFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { runWorkflow } from '../workflows/harness.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const GOC = process.env.CL_GOC ? path.resolve(process.env.CL_GOC) : KIT;
const require = createRequire(import.meta.url);
const WF = path.join(KIT, 'feature-loop', 'workflows', 'acceptance-verify.js');
const TMP = mkdtempSync(path.join(tmpdir(), 'cham-lai-'));
const ONLY = (() => { const i = process.argv.indexOf('--only'); return i >= 0 ? process.argv[i + 1] : (process.env.CL_CASES || null); })();
const want = g => !ONLY || ONLY.split(',').includes(g);
let pass = 0; let fail = 0;
const ok = (name, msg = '') => { pass += 1; console.log(`PASS: ${name} ${msg}`.trimEnd() + ' '); };
const bad = (name, msg) => { fail += 1; console.log(`FAIL: ${name} — ${msg}`); };
const loi = e => String((e && (e.stderr || e.message)) || e).split('\n').slice(0, 3).join(' | ');
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const SLUG = 'demo';
const WS = d => path.join(d, '_acceptance', SLUG);
const W = (d, rel, s) => { const f = path.join(d, rel); mkdirSync(path.dirname(f), { recursive: true }); writeFileSync(f, s); };
const sortJ = a => JSON.stringify([...a].sort());

// ── hai bản engine: MỚI (cây này) và TRƯỚC VÒNG ──────────────────────────────
const MOI = { ten: 'moi', goc: KIT };
const TRUOC = (() => {
  try {
    const shas = git(GOC, 'log', '--format=%H', '--reverse', '-S', 'dinhNghiaTai', '--', 'feature-loop/scripts/carry-plan.mjs').split('\n').filter(Boolean);
    const ref = shas.length ? `${shas[0]}^` : 'HEAD';
    const d = mkdtempSync(path.join(TMP, 'truoc-'));
    const tar = execFileSync('git', ['-C', GOC, 'archive', ref, 'feature-loop', 'lib', 'scripts', 'skills'], { maxBuffer: 512 * 1024 * 1024 });
    execFileSync('tar', ['-x', '-C', d], { input: tar });
    return { ten: 'truoc', goc: d, ref };
  } catch (e) { return { ten: 'truoc', loi: loi(e) }; }
})();
const s4 = (ban, d, extra) => spawnSync(process.execPath, [path.join(ban.goc, 'feature-loop', 'scripts', 's4-args.mjs'), '--slug', SLUG, '--root', d, '--ag-root', ban.goc, '--diff-base', 'main', ...extra], { encoding: 'utf8' });
const tv = (ban, d, extra = []) => spawnSync(process.execPath, [path.join(ban.goc, 'feature-loop', 'scripts', 'thuoc-vat.mjs'), '--root', d, '--slug', SLUG, '--ag-root', ban.goc, '--write', ...extra], { encoding: 'utf8' });

// ── kho fixture: ba tiêu chí, ba eval máy, mỗi eval canh MỘT tệp vật ─────────
const EVALS = (e1 = {}) => [
  'schema_version: 1', `feature_slug: ${SLUG}`, 'evals:',
  '  # nhóm tiêu chí đầu',
  '  - id: E1', `    criterion: ${e1.criterion || 'AC-1'}`, `    executor: ${e1.executor || 'test'}`, `    cmd: ${e1.cmd || 'config:executors.test.api'}`,
  '    paths: [src/a.js]', ...(e1.expected_exit ? [`    expected_exit: ${e1.expected_exit}`] : []),
  '    expected: >', `      in ra ${e1.expected || '21'} dòng${e1.duoi || ''}`,
  '  - id: E2', '    criterion: AC-2', '    executor: test', '    cmd: config:executors.test.api', '    paths: [src/b.js]', '    expected: in ra x',
  '  - id: E3', '    criterion: AC-3', '    executor: test', '    cmd: config:executors.test.api', '    paths: [src/c.js]', '    expected: in ra x',
  // E10/AC-10: id và mã tiêu chí mang TIỀN TỐ của E1/AC-1 — hình dạng neo DA3b (E10, AC-10).
  '  - id: E10', '    criterion: AC-10', '    executor: test', '    cmd: config:executors.test.api', '    paths: [src/d.js]', `    expected: in ra ${e1.e10 || 'x'}`, '',
].join('\n');
const CONTRACT = (o = {}) => [
  '---', 'schema_version: 1', `slug: ${SLUG}`, 'risk_tier: T2', `status: ${o.status || 'implemented'}`, '---', '',
  `# Acceptance Contract: ${SLUG}`, '', '## Acceptance Criteria', '',
  `- AC-1: Given hồ sơ, When chạy, Then in ra ${o.ac1 || '21'} dòng.`,
  '- AC-2: Given hồ sơ, When chạy, Then in ra x.',
  '- AC-3: Given hồ sơ, When chạy, Then in ra x.',
  `- AC-10: Given hồ sơ, When chạy, Then in ra ${o.ac10 || 'x'}.`, '',
  ...(o.notes ? ['## Notes', '', o.notes, ''] : []),
].join('\n');
function kho() {
  const d = mkdtempSync(path.join(TMP, 'k-'));
  execFileSync('git', ['init', '-q', '-b', 'main', d]);
  git(d, 'config', 'user.email', 't@t.t'); git(d, 'config', 'user.name', 'T');
  W(d, '_acceptance/config.yaml', 'schema_version: 1\nexecutors:\n  test:\n    api: "echo x"\n    api2: "echo y"\n  script:\n    api: "echo x"\nfeature_loop:\n  suite_keys:\n    - executors.test.api\nrisk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n');
  W(d, `_acceptance/${SLUG}/contract.md`, CONTRACT());
  W(d, `_acceptance/${SLUG}/evals.yaml`, EVALS());
  W(d, `_acceptance/${SLUG}/run-log.jsonl`, '');
  W(d, `_acceptance/${SLUG}/rang/a.mjs`, '// rang\n');
  for (const f of ['a', 'b', 'c', 'd']) W(d, `src/${f}.js`, `// ${f}\n`);
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'goc');
  git(d, 'checkout', '-qb', 'vong');
  W(d, 'src/a.js', '// a v1\n'); git(d, 'add', '-A'); git(d, 'commit', '-qm', 'vat');
  return d;
}
const commitAll = (d, msg) => { git(d, 'add', '-A'); git(d, 'commit', '-qm', msg, '--allow-empty'); return git(d, 'rev-parse', 'HEAD'); };

// Lượt chấm thật: bộ chấm (harness vm) + tác tử giả, dòng sổ nối vào run-log y như phiên chính.
async function luotCham(d, a) {
  const r = await runWorkflow(WF, {
    slug: SLUG, round: a.round, riskTier: 'T2', evals: a.evals, suiteCommands: [], diffBase: 'main', repoRoot: d,
    personasPath: '/p', templatePath: '/t', invokedAt: a.invokedAt, invokedSha: a.invokedSha,
    ...(a.carriedEvals ? { carriedEvals: a.carriedEvals } : {}),
  }, c => {
    const l = c.label;
    if (l.startsWith('machine:')) return { exitCode: 0, outputTail: 'x\n__EXIT=0', runId: `rid-r${a.round}-${Math.random().toString(36).slice(2, 8)}`, cannotRun: false };
    if (l.startsWith('review:')) return { findings: [] };
    if (l.startsWith('refute:')) return { refuted: true, reason: 'x' };
    if (l.startsWith('baseline:')) return { results: [] };
    if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: a.invokedSha };
    if (l === 'synthesize:report') return { report: '# r', findings: '# f' };
    return null;
  });
  appendFileSync(path.join(WS(d), 'run-log.jsonl'), r.result.runLog.join('\n') + '\n');
  return r.result;
}
// Sinh args của một lượt (bản `ban`) vào `out`, đọc lại JSON.
function args(ban, d, out, extra) {
  const r = s4(ban, d, ['--out', out, ...extra]);
  if (r.status !== 0) throw new Error(`s4-args (${ban.ten}) thoat ${r.status}: ${String(r.stderr).split('\n').filter(Boolean).slice(-2).join(' | ')}`);
  return { a: JSON.parse(readFileSync(out, 'utf8')), stderr: r.stderr };
}
const mang = a => (a.carriedEvals || []).map(c => c.id);

// Lượt 1 chấm xong + commit sổ, rồi một nhát sửa vật chạm src/b.js (E2 phải chạy lại).
async function quaLuot1(d) {
  const { a } = args(MOI, d, path.join(WS(d), 's4-args.json'), []);
  await luotCham(d, a);
  commitAll(d, 'so luot 1');
  W(d, 'src/b.js', '// b sua\n');
  commitAll(d, 'sua vat b');
  return a.invokedSha;
}

// ── CL1 — khối eval đổi giữa hai lượt → không mang sang ─────────────────────
// Ma trận viết trước: mỗi mũi đổi đúng MỘT trường của khối E1, paths giữ nguyên.
const MUI_KHOI = [
  ['expected 21→22 (ca DA3b)', { expected: '22' }],
  ['cmd', { cmd: 'config:executors.test.api2' }],
  ['executor', { executor: 'script', cmd: 'config:executors.script.api' }],
  ['expected_exit', { expected_exit: 3 }],
  ['criterion', { criterion: 'AC-3' }],
];
async function caKhoi(ban, doi, sua = 'evals') {
  const d = kho();
  const anchor = await quaLuot1(d);
  if (sua !== 'contract') W(d, `_acceptance/${SLUG}/evals.yaml`, EVALS(doi));
  if (sua !== 'evals') W(d, `_acceptance/${SLUG}/contract.md`, CONTRACT(doi));
  commitAll(d, 'chu kho sua dinh nghia');
  return args(ban, d, path.join(WS(d), 's4-args-r2.json'), ['--carry-anchor', anchor]);
}
if (want('CL1')) {
  const sai = []; let n = 0;
  if (TRUOC.loi) sai.push(`khong dung duoc ban truoc vong: ${TRUOC.loi}`);
  // Đối chứng dương: không đổi gì → E1, E3 mang sang ở CẢ hai bản.
  try {
    const { a } = await caKhoi(MOI, {});
    if (sortJ(mang(a)) !== sortJ(['E1', 'E10', 'E3'])) sai.push(`doi chung: khong doi dinh nghia ma mang ${JSON.stringify(mang(a))}, mong [E1,E10,E3]`);
  } catch (e) { sai.push(`doi chung: ${loi(e)}`); }
  for (const [ten, doi] of MUI_KHOI) {
    n += 1;
    try {
      const moi = await caKhoi(MOI, doi);
      if (mang(moi.a).includes('E1')) { sai.push(`${ten}: ban moi van mang E1 sang`); continue; }
      if (sortJ(mang(moi.a)) !== sortJ(['E10', 'E3'])) { sai.push(`${ten}: ban moi mang ${JSON.stringify(mang(moi.a))}, mong [E10,E3]`); continue; }
      if (!/E1 không mang sang — định nghĩa eval đổi so với lượt gốc r1/.test(moi.stderr)) { sai.push(`${ten}: thieu thong diep ghim «E1 không mang sang — định nghĩa eval đổi so với lượt gốc r1»`); continue; }
      if (!TRUOC.loi) {
        const cu = await caKhoi(TRUOC, doi);
        if (!mang(cu.a).includes('E1')) sai.push(`${ten}: ban TRUOC VONG khong mang E1 — fixture khong tai hien loi`);
      }
    } catch (e) { sai.push(`${ten}: ${loi(e)}`); }
  }
  if (n !== MUI_KHOI.length) sai.push(`so mui ${n} != ${MUI_KHOI.length}`);
  if (sai.length) bad('CL1', sai.join(' ; '));
  else ok('CL1', `— ${n}/${MUI_KHOI.length} mũi đổi khối E1: bản mới chạy lại E1 (thông điệp ghim), bản trước vòng mang sang; không đổi → [E1,E10,E3] mang sang`);
}

// ── CL2 — chữ tiêu chí đổi → eval của tiêu chí đó không mang sang ───────────
if (want('CL2')) {
  try {
    const moi = await caKhoi(MOI, { ac1: '22' }, 'contract');
    const cu = TRUOC.loi ? null : await caKhoi(TRUOC, { ac1: '22' }, 'contract');
    // Mũi tiền tố (DA3b): AC-10 + khối E10 đổi → E10 chạy lại, E1 (tiền tố) vẫn mang sang và im.
    const m10 = await caKhoi(MOI, { ac10: '22', e10: '22' }, 'ca-hai');
    const cu10 = TRUOC.loi ? null : await caKhoi(TRUOC, { ac10: '22', e10: '22' }, 'ca-hai');
    if (TRUOC.loi) bad('CL2', `khong dung duoc ban truoc vong: ${TRUOC.loi}`);
    else if (sortJ(mang(moi.a)) !== sortJ(['E10', 'E3'])) bad('CL2', `AC-1 doi chu ma ban moi mang ${JSON.stringify(mang(moi.a))}, mong [E10,E3]`);
    else if (!/E1 không mang sang — tiêu chí AC-1 đổi chữ so với lượt gốc r1/.test(moi.stderr)) bad('CL2', 'thieu thong diep ghim «E1 không mang sang — tiêu chí AC-1 đổi chữ so với lượt gốc r1»');
    else if (!mang(cu.a).includes('E1')) bad('CL2', 'ban TRUOC VONG khong mang E1 — fixture khong tai hien loi');
    else if (sortJ(mang(m10.a)) !== sortJ(['E1', 'E3'])) bad('CL2', `tien to: AC-10 + E10 doi ma ban moi mang ${JSON.stringify(mang(m10.a))}, mong [E1,E3]`);
    else if (!/E10 không mang sang — định nghĩa eval đổi so với lượt gốc r1/.test(m10.stderr) || /E1 không mang sang/.test(m10.stderr)) bad('CL2', 'tien to: thong diep ghim sai (mong «E10 không mang sang — định nghĩa…», khong «E1 không mang sang»)');
    else if (!mang(cu10.a).includes('E10')) bad('CL2', 'tien to: ban truoc vong khong mang E10 — fixture khong tai hien DA3b');
    else ok('CL2', '— AC-1 đổi chữ: bản mới chạy lại E1, vẫn mang E10, E3; AC-10 + E10 đổi: chạy lại E10, E1 (tiền tố) im; bản trước vòng mang cả hai');
  } catch (e) { bad('CL2', loi(e)); }
}

// ── CL3 — chuỗi mang sang: so với lượt THẬT SỰ chạy, không với lượt mang ─────
// Lượt 2 do bản TRƯỚC VÒNG sinh (nó mang E1 dù khối đã đổi — đúng sổ đời cũ của DA3b); lượt 3
// bản mới phải so định nghĩa hôm nay với lượt 1 (nơi E1 thật chạy) và chạy lại E1.
if (want('CL3')) {
  try {
    if (TRUOC.loi) throw new Error(`khong dung duoc ban truoc vong: ${TRUOC.loi}`);
    const d = kho();
    const anchor1 = await quaLuot1(d);
    W(d, `_acceptance/${SLUG}/evals.yaml`, EVALS({ expected: '22' })); commitAll(d, 'sua E1');
    const r2 = args(TRUOC, d, path.join(WS(d), 's4-args-r2.json'), ['--carry-anchor', anchor1]);
    if (!mang(r2.a).includes('E1')) throw new Error('ban truoc vong khong mang E1 o luot 2 — fixture khong dung hinh');
    await luotCham(d, r2.a);
    const anchor2 = commitAll(d, 'so luot 2');
    W(d, 'src/b.js', '// b sua lan 2\n'); commitAll(d, 'sua vat b lan 2');
    const moi = args(MOI, d, path.join(WS(d), 's4-args-r3.json'), ['--carry-anchor', anchor2]);
    const cu = args(TRUOC, d, path.join(WS(d), 's4-args-r3-cu.json'), ['--carry-anchor', anchor2]);
    if (moi.a.round !== 3) bad('CL3', `round ${moi.a.round}, mong 3`);
    else if (mang(moi.a).includes('E1')) bad('CL3', 'luot 3 ban moi van mang E1 (so voi luot mang 2 thay vi luot goc 1)');
    else if (!/E1 không mang sang — định nghĩa eval đổi so với lượt gốc r1/.test(moi.stderr)) bad('CL3', 'thieu thong diep ghim tro luot goc r1');
    else if (!mang(cu.a).includes('E1')) bad('CL3', 'ban truoc vong o luot 3 khong mang E1 — fixture khong tai hien loi');
    else ok('CL3', '— E1 mang qua lượt 2 bởi bản cũ: lượt 3 bản mới so với lượt gốc r1 và chạy lại; bản cũ mang tiếp');
  } catch (e) { bad('CL3', loi(e)); }
}

// ── CL4 — chiều im: thứ KHÔNG phải định nghĩa eval đổi → mang sang y bản cũ ──
const MUI_IM = [
  ['trang thai hop dong', d => W(d, `_acceptance/${SLUG}/contract.md`, CONTRACT({ status: 'verified' }))],
  ['muc Notes hop dong', d => W(d, `_acceptance/${SLUG}/contract.md`, CONTRACT({ notes: 'Ghi chú thêm sau lượt 1.' }))],
  ['chu thich ngoai khoi eval', d => W(d, `_acceptance/${SLUG}/evals.yaml`, EVALS().replace('  # nhóm tiêu chí đầu', '  # nhóm tiêu chí đầu — đã rà'))],
  ['khoang trang cuoi dong trong khoi E1', d => W(d, `_acceptance/${SLUG}/evals.yaml`, EVALS().replace('    paths: [src/a.js]', '    paths: [src/a.js]   '))],
  ['khoi eval KHAC (E3) doi', d => W(d, `_acceptance/${SLUG}/evals.yaml`, EVALS().replace('  - id: E3\n    criterion: AC-3\n    executor: test\n    cmd: config:executors.test.api\n    paths: [src/c.js]\n    expected: in ra x', '  - id: E3\n    criterion: AC-3\n    executor: test\n    cmd: config:executors.test.api\n    paths: [src/c.js]\n    expected: in ra y'))],
  ['so quyet dinh', d => appendFileSync(path.join(WS(d), 'decisions.jsonl'), '{"id":"d-x-1","type":"fix","decision":"x"}\n')],
];
const MONG_IM = { 'khoi eval KHAC (E3) doi': ['E1', 'E10'] };
if (want('CL4')) {
  const sai = []; let n = 0;
  if (TRUOC.loi) sai.push(`khong dung duoc ban truoc vong: ${TRUOC.loi}`);
  for (const [ten, tiem] of MUI_IM) {
    n += 1;
    try {
      const chay = async ban => {
        const d = kho(); const anchor = await quaLuot1(d);
        const truoc = readFileSync(path.join(WS(d), 'evals.yaml'), 'utf8') + readFileSync(path.join(WS(d), 'contract.md'), 'utf8') + (existsSync(path.join(WS(d), 'decisions.jsonl')) ? readFileSync(path.join(WS(d), 'decisions.jsonl'), 'utf8') : '');
        tiem(d);
        const sau = readFileSync(path.join(WS(d), 'evals.yaml'), 'utf8') + readFileSync(path.join(WS(d), 'contract.md'), 'utf8') + (existsSync(path.join(WS(d), 'decisions.jsonl')) ? readFileSync(path.join(WS(d), 'decisions.jsonl'), 'utf8') : '');
        if (sau === truoc) throw new Error('mui tiem khong doi byte');
        commitAll(d, `tiem ${ten}`);
        return args(ban, d, path.join(WS(d), 's4-args-r2.json'), ['--carry-anchor', anchor]);
      };
      const moi = await chay(MOI);
      const mong = MONG_IM[ten] || ['E1', 'E10', 'E3'];
      if (sortJ(mang(moi.a)) !== sortJ(mong)) { sai.push(`${ten}: ban moi mang ${JSON.stringify(mang(moi.a))}, mong ${JSON.stringify(mong)}`); continue; }
      if (/E1 không mang sang/.test(moi.stderr)) { sai.push(`${ten}: ban moi in dong «E1 không mang sang» khi E1 khong doi`); continue; }
      if (!TRUOC.loi) {
        // Mũi đổi khối eval KHÁC: E3 chạy lại là đúng việc của vòng — so với bản cũ chỉ trên E1.
        const cu = await chay(TRUOC);
        if (MONG_IM[ten] ? !mang(cu.a).includes('E1') : sortJ(mang(cu.a)) !== sortJ(mang(moi.a))) sai.push(`${ten}: ban moi ${JSON.stringify(mang(moi.a))} khac ban truoc vong ${JSON.stringify(mang(cu.a))}`);
      }
    } catch (e) { sai.push(`${ten}: ${loi(e)}`); }
  }
  if (n !== MUI_IM.length) sai.push(`so mui ${n} != ${MUI_IM.length}`);
  if (sai.length) bad('CL4', sai.join(' ; '));
  else ok('CL4', `— ${n}/${MUI_IM.length} mũi không chạm định nghĩa E1: tập mang sang của bản mới BẰNG bản trước vòng`);
}

// ── CL5 — không đọc được định nghĩa ở lượt gốc → chạy lại, có tên (fail-closed) ─
const MUI_MU = [
  // (a) evals.yaml chưa commit lúc chấm lượt 1 — sha gốc không có tệp.
  ['evals.yaml chua commit luc luot 1', async () => {
    const d = kho();
    git(d, 'rm', '-q', '--cached', `_acceptance/${SLUG}/evals.yaml`); git(d, 'commit', '-qm', 'bo evals khoi git');
    const { a } = args(MOI, d, path.join(WS(d), 's4-args.json'), []);
    await luotCham(d, a); git(d, 'add', `_acceptance/${SLUG}/run-log.jsonl`); git(d, 'commit', '-qm', 'so luot 1');
    const anchor = a.invokedSha;
    W(d, 'src/b.js', '// b sua\n'); git(d, 'add', 'src/b.js'); git(d, 'commit', '-qm', 'sua b');
    return { d, anchor };
  }],
  // (b) lịch sử viết lại: commit của lượt 1 không còn trong kho.
  ['sha luot goc khong con', async () => {
    const d = kho();
    const anchor0 = await quaLuot1(d);
    // Dựng lại lịch sử: X = cây sau sổ lượt 1, Y = cây sau nhát sửa b — commit của lượt 1 mồ côi.
    const goc = git(d, 'rev-list', '--max-parents=0', 'HEAD');
    const x = git(d, 'commit-tree', 'HEAD~1^{tree}', '-p', goc, '-m', 'viet lai X');
    const y = git(d, 'commit-tree', 'HEAD^{tree}', '-p', x, '-m', 'viet lai Y');
    git(d, 'reset', '-q', '--hard', y);
    git(d, 'reflog', 'expire', '--expire=now', '--all'); git(d, 'gc', '-q', '--prune=now');
    if (spawnSync('git', ['-C', d, 'cat-file', '-e', `${anchor0}^{commit}`]).status === 0) throw new Error('commit luot 1 van con sau gc');
    return { d, anchor: x };
  }],
];
if (want('CL5')) {
  const sai = []; let n = 0;
  for (const [ten, dung] of MUI_MU) {
    n += 1;
    try {
      const { d, anchor } = await dung();
      const r = s4(MOI, d, ['--out', path.join(WS(d), 's4-args-r2.json'), '--carry-anchor', anchor]);
      if (r.status !== 0) { sai.push(`${ten}: s4-args thoat ${r.status} — ${String(r.stderr).split('\n').filter(Boolean).slice(-1)[0]}`); continue; }
      const a = JSON.parse(readFileSync(path.join(WS(d), 's4-args-r2.json'), 'utf8'));
      if (mang(a).length) { sai.push(`${ten}: van mang ${JSON.stringify(mang(a))}`); continue; }
      if (!/E1 không mang sang — không đọc được định nghĩa ở lượt gốc r1/.test(r.stderr)) { sai.push(`${ten}: thieu thong diep ghim «không đọc được định nghĩa ở lượt gốc r1»`); continue; }
      // Chiều đỏ trên bản trước vòng: cùng kho, bản cũ mang sang mù (nó không hỏi định nghĩa).
      if (!TRUOC.loi) {
        const rc = s4(TRUOC, d, ['--out', path.join(WS(d), 's4-args-r2-cu.json'), '--carry-anchor', anchor]);
        const ac = rc.status === 0 ? JSON.parse(readFileSync(path.join(WS(d), 's4-args-r2-cu.json'), 'utf8')) : null;
        if (!ac || !mang(ac).includes('E3')) sai.push(`${ten}: ban truoc vong khong mang E3 (thoat ${rc.status}) — fixture khong tai hien mang mu`);
      }
    } catch (e) { sai.push(`${ten}: ${loi(e)}`); }
  }
  if (n !== MUI_MU.length) sai.push(`so mui ${n} != ${MUI_MU.length}`);
  if (sai.length) bad('CL5', sai.join(' ; '));
  else ok('CL5', `— ${n}/${MUI_MU.length} ca không đọc được định nghĩa lượt gốc: không mang eval nào, gọi tên lý do`);
}

// ── thuoc-vat: kho theo thói quen crm K7 — tham số lượt 2 ở tệp riêng ───────
const dongSo = (d, kind) => readFileSync(path.join(WS(d), 'run-log.jsonl'), 'utf8').split('\n').filter(Boolean)
  .map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(o => o && o.kind === kind);
// Lượt 1 (args ở s4-args.json) + lượt 2 với --carry-anchor (args ở `out2`), nhát sửa giữa hai
// lượt chạm cả vật lẫn thước (rang/ của hồ sơ) — đúng hình K7. Trả kho + args lượt 2.
async function khoK7(out2 = d => path.join(WS(d), 's4-args-r2.json')) {
  const d = kho();
  const a1 = args(MOI, d, path.join(WS(d), 's4-args.json'), []).a;
  await luotCham(d, a1); commitAll(d, 'so luot 1');
  W(d, 'src/b.js', '// b sua\n'); W(d, `_acceptance/${SLUG}/rang/a.mjs`, '// rang sua\n'); commitAll(d, 'sua vat + rang');
  const f2 = out2(d);
  const a2 = args(MOI, d, f2, ['--carry-anchor', a1.invokedSha]).a;
  await luotCham(d, a2);
  return { d, a1, a2, f2 };
}
const tomDong = (d, kind) => dongSo(d, kind).map(o => `r${o.round}@${String(o.sha).slice(0, 8)}`);

// ── CL6 — chiều đỏ: tham số lượt cũ không được dùng để chấm lượt mới ─────────
if (want('CL6')) {
  const sai = []; let n = 0;
  if (TRUOC.loi) sai.push(`khong dung duoc ban truoc vong: ${TRUOC.loi}`);
  // (a) K7 nguyên hình, không đổi gì trong lượt 2: bản mới tự nhận tệp r2 → im; bản cũ khoá.
  n += 1;
  try {
    const { d, a1 } = await khoK7();
    const r = tv(MOI, d);
    if (r.status !== 0) sai.push(`(a) ban moi thoat ${r.status}, mong 0 — ${String(r.stderr).split('\n').filter(Boolean).slice(-1)[0]}`);
    else if (dongSo(d, 'thuoc-lech').length || dongSo(d, 'cay-doi').length) sai.push(`(a) ban moi van ghi thuoc-lech ${JSON.stringify(tomDong(d, 'thuoc-lech'))} / cay-doi ${JSON.stringify(tomDong(d, 'cay-doi'))}`);
    if (!TRUOC.loi) {
      const k = await khoK7(); const rc = tv(TRUOC, k.d);
      const lech = dongSo(k.d, 'thuoc-lech'); const cay = dongSo(k.d, 'cay-doi');
      if (!(rc.status === 5 && lech.length === 1 && lech[0].round === 2 && lech[0].sha === k.a1.invokedSha && cay.length === 1 && cay[0].round === 1))
        sai.push(`(a) ban truoc vong khong tai hien K7: thoat ${rc.status}, thuoc-lech ${JSON.stringify(tomDong(k.d, 'thuoc-lech'))}, cay-doi ${JSON.stringify(tomDong(k.d, 'cay-doi'))}`);
    }
    void a1;
  } catch (e) { sai.push(`(a) ${loi(e)}`); }
  // (b) thước lệch THẬT trong lượt 2: dòng mang sha + round của chính lượt 2.
  n += 1;
  try {
    const { d, a2 } = await khoK7();
    appendFileSync(path.join(WS(d), 'evals.yaml'), '# tiem trong luot 2\n');
    const r = tv(MOI, d); const L = dongSo(d, 'thuoc-lech');
    if (r.status !== 5) sai.push(`(b) thoat ${r.status}, mong 5`);
    else if (L.length !== 1 || L[0].round !== 2 || L[0].sha !== a2.generated_sha) sai.push(`(b) thuoc-lech ${JSON.stringify(tomDong(d, 'thuoc-lech'))}, mong r2@${a2.generated_sha.slice(0, 8)}`);
  } catch (e) { sai.push(`(b) ${loi(e)}`); }
  // (c) --args trỏ tệp lượt 1: dừng có tên, không ghi byte nào vào run-log.
  n += 1;
  try {
    const { d } = await khoK7();
    const truoc = readFileSync(path.join(WS(d), 'run-log.jsonl'), 'utf8');
    const r = tv(MOI, d, ['--args', path.join(WS(d), 's4-args.json')]);
    if (r.status !== 2) sai.push(`(c) thoat ${r.status}, mong 2`);
    else if (!r.stderr.includes('tệp args không thuộc lượt cuối')) sai.push(`(c) thieu thong diep ghim «tệp args không thuộc lượt cuối»: ${String(r.stderr).slice(0, 160)}`);
    else if (readFileSync(path.join(WS(d), 'run-log.jsonl'), 'utf8') !== truoc) sai.push('(c) run-log doi byte du da dung');
  } catch (e) { sai.push(`(c) ${loi(e)}`); }
  // (d) tham số lượt 2 ngoài hồ sơ: không tệp nào trong hồ sơ khớp → dừng có tên; --args đúng tệp → im.
  n += 1;
  try {
    const ngoai = mkdtempSync(path.join(TMP, 'ngoai-'));
    const { d, f2 } = await khoK7(() => path.join(ngoai, 'args-r2.json'));
    const truoc = readFileSync(path.join(WS(d), 'run-log.jsonl'), 'utf8');
    const r = tv(MOI, d);
    if (r.status !== 2) sai.push(`(d) thoat ${r.status}, mong 2`);
    else if (!r.stderr.includes('không tệp args nào trong hồ sơ thuộc lượt cuối')) sai.push(`(d) thieu thong diep ghim: ${String(r.stderr).slice(0, 160)}`);
    else if (readFileSync(path.join(WS(d), 'run-log.jsonl'), 'utf8') !== truoc) sai.push('(d) run-log doi byte du da dung');
    else {
      const r2 = tv(MOI, d, ['--args', f2]);
      if (r2.status !== 0 || dongSo(d, 'thuoc-lech').length || dongSo(d, 'cay-doi').length) sai.push(`(d) --args dung tep: thoat ${r2.status}, thuoc-lech ${dongSo(d, 'thuoc-lech').length}, cay-doi ${dongSo(d, 'cay-doi').length}`);
    }
  } catch (e) { sai.push(`(d) ${loi(e)}`); }
  // (e) hình dạng khung-man-chung + lượt chết: `-r2` khớp tally r2, `-r3` MỚI hơn (lượt 3 chết trước
  // khi ghi round-tally) và tác tử của lượt 3 sửa vật → chọn `-r3`, đúng một cay-doi round 3 (dòng mồ
  // côi s4-args đòi hoàn lại); chọn `-r2` thì dòng ấy mang round 2 và răng hoàn lại mù.
  n += 1;
  try {
    const { d, a2 } = await khoK7();
    commitAll(d, 'so luot 2'); W(d, 'src/b.js', '// b sua lan 2\n'); commitAll(d, 'sua vat b lan 2');
    // invokedAt có độ phân giải GIÂY; đời thật một lượt chấm kéo dài nhiều phút — chờ qua giây để
    // lượt 3 không trùng giờ với round-tally lượt 2.
    await new Promise(ok => setTimeout(ok, 1100));
    const a3 = args(MOI, d, path.join(WS(d), 's4-args-r3.json'), ['--carry-anchor', a2.invokedSha]).a;
    appendFileSync(path.join(d, 'src/a.js'), '// tac tu luot 3\n');
    const r = tv(MOI, d); const cay = dongSo(d, 'cay-doi');
    if (a3.round !== 3) sai.push(`(e) args luot 3 mang round ${a3.round}`);
    else if (r.status !== 6) sai.push(`(e) thoat ${r.status}, mong 6 — ${String(r.stderr).split('\n').filter(Boolean).slice(-1)[0]}`);
    else if (!r.stderr.includes('s4-args-r3.json')) sai.push(`(e) stderr khong noi da dung s4-args-r3.json: ${String(r.stderr).replace(/\n/g, " ¶ ").slice(0, 1200)}`);
    else if (cay.length !== 1 || cay[0].round !== 3 || cay[0].luot_ts !== a3.invokedAt) sai.push(`(e) cay-doi ${JSON.stringify(cay.map(o => ({ round: o.round, luot_ts: o.luot_ts })))}, mong mot dong round 3 luot_ts ${a3.invokedAt}`);
  } catch (e) { sai.push(`(e) ${loi(e)}`); }
  if (n !== 5) sai.push(`so mui ${n} != 5`);
  if (sai.length) bad('CL6', sai.join(' ; '));
  else ok('CL6', '— 5/5 mũi K7: bản mới nhận đúng tệp lượt 2 (im), lệch thật mang sha lượt 2, tệp lượt 1 / thiếu tệp dừng có tên không ghi byte, lượt chết nhận tệp mới nhất; bản trước vòng tái hiện K7');
}

// ── CL7 — chiều im: một tệp args theo đúng đường SKILL → y bản cũ ─────────────
// Ma trận: lành · thước lệch · cây đổi · chưa có lượt nào ghi sổ. Mỗi ô dựng HAI kho bằng cùng
// code, chạy bản mới và bản trước vòng, so mã thoát + dòng thuoc-vat/thuoc-lech/cay-doi (bỏ ts).
const O_IM = [
  ['lanh', async d => { const a = args(MOI, d, path.join(WS(d), 's4-args.json'), []).a; await luotCham(d, a); }],
  ['thuoc lech', async d => { const a = args(MOI, d, path.join(WS(d), 's4-args.json'), []).a; await luotCham(d, a); appendFileSync(path.join(WS(d), 'evals.yaml'), '# tiem\n'); }],
  ['cay doi', async d => { const a = args(MOI, d, path.join(WS(d), 's4-args.json'), []).a; await luotCham(d, a); appendFileSync(path.join(d, 'src/a.js'), '// tac tu\n'); }],
  ['chua co luot', async d => { args(MOI, d, path.join(WS(d), 's4-args.json'), []); }],
];
const chuan = d => readFileSync(path.join(WS(d), 'run-log.jsonl'), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l))
  .filter(o => ['thuoc-vat', 'thuoc-lech', 'cay-doi'].includes(o.kind))
  .map(o => { const { ts, luot_ts, sha, san, ...r } = o; return JSON.stringify({ ...r, co_sha: Boolean(sha) }); });
if (want('CL7')) {
  const sai = []; let n = 0;
  if (TRUOC.loi) sai.push(`khong dung duoc ban truoc vong: ${TRUOC.loi}`);
  else for (const [ten, dung] of O_IM) {
    n += 1;
    try {
      const k1 = kho(); await dung(k1); const rm = tv(MOI, k1);
      const k2 = kho(); await dung(k2); const rc = tv(TRUOC, k2);
      if (rm.status !== rc.status) sai.push(`${ten}: thoat moi ${rm.status} != cu ${rc.status}`);
      else if (JSON.stringify(chuan(k1)) !== JSON.stringify(chuan(k2))) sai.push(`${ten}: dong so khac — moi ${JSON.stringify(chuan(k1))} · cu ${JSON.stringify(chuan(k2))}`);
    } catch (e) { sai.push(`${ten}: ${loi(e)}`); }
  }
  if (!TRUOC.loi && n !== O_IM.length) sai.push(`so o ${n} != ${O_IM.length}`);
  if (sai.length) bad('CL7', sai.join(' ; '));
  else ok('CL7', `— ${n}/${O_IM.length} ô theo đường một tệp: mã thoát và dòng sổ bản mới BẰNG bản trước vòng`);
}

// ── CL8 — thẻ: bộ đọc nhãn cạnh gãy (lib/nhan-canh-gay.cjs) trên sổ bản mới ghi ─
if (want('CL8')) {
  try {
    const { canhGay, NGUON } = require(path.join(KIT, 'lib', 'nhan-canh-gay.cjs'));
    const nhan = d => canhGay({ runLogText: readFileSync(path.join(WS(d), 'run-log.jsonl'), 'utf8'), verdict: 'PASS', nguon: NGUON }).trangThai;
    const sai = [];
    const a = await khoK7(); tv(MOI, a.d);
    if (nhan(a.d) !== 'khong-ap') sai.push(`K7 lanh, ban moi ghi: the nhan «${nhan(a.d)}», mong khong-ap`);
    const b = await khoK7(); appendFileSync(path.join(WS(b.d), 'evals.yaml'), '# tiem\n'); tv(MOI, b.d);
    if (nhan(b.d) !== 'lech') sai.push(`K7 lech that, ban moi ghi: the nhan «${nhan(b.d)}», mong lech`);
    if (TRUOC.loi) sai.push(`khong dung duoc ban truoc vong: ${TRUOC.loi}`);
    else { const c = await khoK7(); tv(TRUOC, c.d); if (nhan(c.d) !== 'lech') sai.push(`K7 lanh, ban truoc vong ghi: the nhan «${nhan(c.d)}», mong lech (khoa oan) — fixture khong tai hien`); }
    if (sai.length) bad('CL8', sai.join(' ; '));
    else ok('CL8', '— K7 lành: thẻ không khoá «thước lệch» (bản trước vòng khoá oan); lệch thật vẫn khoá');
  } catch (e) { bad('CL8', loi(e)); }
}

console.log(`\nResults: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
