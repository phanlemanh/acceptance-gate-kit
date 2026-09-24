// htkd.test.mjs — hồ sơ ha-tang-khong-dot-luot (vòng meta sau 2.18.2). Tên ca = tên AC.
//   HT-AC1*  mảnh suite scripts: danh sách tệp mjs của từng mảnh là một phân hoạch
//   HT-AC2*  mảnh suite scripts: độ nhạy từng mảnh trên fixture ghép từ tệp chạy suite thật
//   HT-AC3*  suite_keys chấm bằng mảnh, lệnh trọn giữ nguyên
//   HT-AC4*  s4-args: lượt BLOCKED vì hạ tầng thử lại CÙNG round
//   HT-AC5*  khuôn /goal: tính chất trên ba bản
//   HT-AC6*  SKILL: bước BLOCKED + câu Gate 1.5
//   HT-AC7*  thẻ Cổng 1 hồ sơ đã khép
// Fixture do CODE SINH trong lượt; đường dẫn suy từ vị trí tệp này; bản «đời trước» neo tag v2.18.2.
// Chọn ca: đối số dòng lệnh (`node htkd.test.mjs HT-AC1 HT-AC2`) hoặc HTKD_CASES=a,b.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync, readdirSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const RUNNER = path.join(HERE, 'run-tests.sh');
const CONFIG = path.join(KIT, '_acceptance', 'config.yaml');
const require = createRequire(import.meta.url);
const { configList } = require(path.join(KIT, 'lib', 'workspace-record.cjs'));
const { resolveConfigKey } = require(path.join(KIT, 'lib', 'evidence-core.cjs'));
const TMP = mkdtempSync(path.join(tmpdir(), 'htkd-'));
let pass = 0; let fail = 0;
const ok = (name, msg = '') => { pass += 1; console.log(`PASS: ${name} ${msg}`.trimEnd() + ' '); };
const bad = (name, msg) => { fail += 1; console.log(`FAIL: ${name} — ${msg}`); };
const CHON = [...process.argv.slice(2), ...(process.env.HTKD_CASES ? process.env.HTKD_CASES.split(',') : [])];
const want = name => !CHON.length || CHON.some(c => name === c || name.startsWith(c + '-'));
const ca = async (name, fn) => { if (!want(name)) return; try { const m = await fn(); ok(name, m || ''); } catch (e) { bad(name, String(e && e.message || e).split('\n').slice(0, 6).join(' | ')); } };
const assert = (c, m) => { if (!c) throw new Error(m); };
const motLan = (src, kim, ten) => { const n = src.split(kim).length - 1; assert(n === 1, `kim ${ten} khop ${n} lan trong nguon that (can dung 1)`); };

// ── mảnh suite scripts ──────────────────────────────────────────────────────────
// Giá trị mảnh của một lệnh: đối số `--manh <v>` hoặc tiền tố `SCRIPTS_SHARD=<v>`; không có → null (lệnh trọn).
const manhCuaLenh = cmd => { const m = String(cmd).match(/--manh\s+(\S+)/) || String(cmd).match(/SCRIPTS_SHARD=(\S+)/); return m ? m[1] : null; };
const khoaSuite = cfg => configList(cfg, 'suite_keys');
const lenhCua = (cfg, k) => { const v = resolveConfigKey(cfg, k); return v == null ? null : String(v).replace(/^"|"$/g, ''); };
// Mọi giá trị mảnh mà suite_keys khai cho tệp chạy suite scripts.
function manhKhai(cfg) {
  const out = [];
  for (const k of khoaSuite(cfg)) {
    const c = lenhCua(cfg, k);
    if (c && c.includes('tests/scripts/run-tests.sh')) out.push({ khoa: k, lenh: c, manh: manhCuaLenh(c) });
  }
  return out;
}
const tapKyVong = dir => readdirSync(dir).filter(f => f.endsWith('.test.mjs') && f !== 'wf-usage.test.mjs').sort();
function lietKe(runner, manh) {
  const env = { ...process.env, SCRIPTS_SHARD_LIST: '1' };
  delete env.SCRIPTS_SHARD;
  if (manh) env.SCRIPTS_SHARD = manh;
  const r = spawnSync('bash', [runner], { encoding: 'utf8', env, timeout: 60000 });
  assert(r.status === 0, `liet ke manh ${manh || 'all'} thoat ${r.status}: ${(r.stderr || '').slice(0, 200)}`);
  return r.stdout.split('\n').map(s => s.trim()).filter(Boolean);
}
// Phép kiểm phân hoạch — trả danh sách lỗi (rỗng = đạt). Dùng chung cho vật thật và bản sao.
function kiemPhanHoach(runner, dir, cfg) {
  const loi = [];
  const mjs = manhKhai(cfg).map(x => x.manh).filter(v => v && v.startsWith('mjs:'));
  if (!mjs.length) return ['khong co manh mjs nao trong suite_keys'];
  const E = tapKyVong(dir);
  const seen = new Map();
  for (const v of mjs) {
    const L = lietKe(runner, v);
    if (!L.length) loi.push(`manh ${v} rong`);
    for (const f of L) { if (seen.has(f)) loi.push(`tep o hai manh: ${f} (${seen.get(f)} va ${v})`); seen.set(f, v); }
  }
  for (const f of E) if (!seen.has(f)) loi.push(`tep bi sot: ${f}`);
  for (const f of seen.keys()) if (!E.includes(f)) loi.push(`tep la: ${f}`);
  const B = lietKe(runner, 'bash');
  if (B.length) loi.push(`manh bash liet ${B.length} tep mjs`);
  const A = lietKe(runner, null).sort();
  if (JSON.stringify(A) !== JSON.stringify(E)) loi.push(`khong dat manh liet ${A.length} tep, ky vong ${E.length}`);
  return loi;
}

await ca('HT-AC1', () => {
  const loi = kiemPhanHoach(RUNNER, HERE, readFileSync(CONFIG, 'utf8'));
  assert(!loi.length, loi.join(' · '));
  return `(${tapKyVong(HERE).length} tep chia ${manhKhai(readFileSync(CONFIG, 'utf8')).filter(x => (x.manh || '').startsWith('mjs:')).length} manh mjs)`;
});

await ca('HT-AC1-dot-bien', () => {
  const src = readFileSync(RUNNER, 'utf8');
  const KIM = '[ $((k % n)) -eq $((i - 1)) ]';
  motLan(src, KIM, 'phep chon manh');
  const saoPath = path.join(HERE, `.htkd-ban-sao-${process.pid}.sh`);
  try {
    writeFileSync(saoPath, src.replace(KIM, `${KIM} && [ "$k" -lt $(( $(mjs_tat_ca | wc -l) - 1 )) ]`));
    const loi = kiemPhanHoach(saoPath, HERE, readFileSync(CONFIG, 'utf8'));
    const cuoi = tapKyVong(HERE).slice(-1)[0];
    assert(loi.some(l => l.startsWith('tep bi sot: ')), `ban sao bo chi so cuoi ma phep kiem khong do: ${loi.join(' · ') || '(rong)'}`);
    return `(do dung: ${loi.filter(l => l.startsWith('tep bi sot')).join(', ')}; tep cuoi theo glob ${cuoi})`;
  } finally { rmSync(saoPath, { force: true }); }
});

// Fixture ghép từ tệp chạy suite thật theo marker — phần đầu, khối gọi vòng mjs, phần kết.
function ghepFixture({ caBash = [], mjs = {} } = {}) {
  const lines = readFileSync(RUNNER, 'utf8').split('\n');
  const tim = m => { const idx = lines.map((l, i) => (l.trim() === m ? i : -1)).filter(i => i >= 0); assert(idx.length === 1, `marker ${m} khop ${idx.length} lan (can 1)`); return idx[0]; };
  const dau = tim('# <<<CA-BASH-DAU');
  const goiA = tim('# <<<MJS-GOI'); const goiB = tim('# MJS-GOI>>>');
  const ket = tim('# <<<KET-SUITE');
  const D = mkdtempSync(path.join(TMP, 'fx-'));
  const than = [...lines.slice(0, dau + 1), ...caBash, ...lines.slice(goiA, goiB + 1), ...lines.slice(ket)];
  writeFileSync(path.join(D, 'run-tests.sh'), than.join('\n'));
  for (const [ten, ma] of Object.entries(mjs)) writeFileSync(path.join(D, ten), `process.exit(${ma});\n`);
  return D;
}
function chay(runner, manh) {
  const env = { ...process.env }; delete env.SCRIPTS_SHARD; delete env.SCRIPTS_SHARD_LIST;
  if (manh) env.SCRIPTS_SHARD = manh;
  const r = spawnSync('bash', [runner], { encoding: 'utf8', env, timeout: 120000 });
  const m = (r.stdout || '').match(/Results: (\d+) passed, (\d+) failed/);
  return { rc: r.status, out: (r.stdout || '') + (r.stderr || ''), passed: m ? Number(m[1]) : null, failed: m ? Number(m[2]) : null };
}
const BASH_LANH = ['echo "HTX1 ca bash tiem mot"', 'check HTX1 0 0', 'echo "HTX2 ca bash tiem hai"', 'check HTX2 0 0'];
const MJS_LANH = { 'a.test.mjs': 0, 'b.test.mjs': 0, 'c.test.mjs': 0, 'd.test.mjs': 0 };

await ca('HT-AC2', () => {
  const D = ghepFixture({ caBash: BASH_LANH, mjs: MJS_LANH });
  const R = path.join(D, 'run-tests.sh');
  const all = chay(R, null), b = chay(R, 'bash'), m1 = chay(R, 'mjs:1/2'), m2 = chay(R, 'mjs:2/2');
  for (const [ten, x] of [['tat-ca', all], ['bash', b], ['mjs:1/2', m1], ['mjs:2/2', m2]]) {
    assert(x.rc === 0 && x.failed === 0, `luot ${ten} thoat ${x.rc}, failed=${x.failed}: ${x.out.slice(-300)}`);
  }
  for (const [ten, x] of [['mjs:1/2', m1], ['mjs:2/2', m2]]) assert(!/HTX[12]/.test(x.out), `manh ${ten} in tieu de ca bash`);
  assert(!/=== .*\.test\.mjs ===/.test(b.out), 'manh bash chay tep mjs');
  const n = 2;
  assert(all.passed === b.passed + m1.passed + m2.passed - (n - 1), `quan he cong lech: tat-ca ${all.passed} ≠ bash ${b.passed} + mjs1 ${m1.passed} + mjs2 ${m2.passed} − ${n - 1}`);
  return `(tat-ca ${all.passed} = ${b.passed} + ${m1.passed} + ${m2.passed} − ${n - 1})`;
});

await ca('HT-AC2-do-mjs', () => {
  const D = ghepFixture({ caBash: BASH_LANH, mjs: { ...MJS_LANH, 'e.test.mjs': 1 } });
  const R = path.join(D, 'run-tests.sh');
  const chu = ['mjs:1/2', 'mjs:2/2'].find(v => lietKe(R, v).includes('e.test.mjs'));
  assert(chu, 'khong manh nao liet e.test.mjs');
  const khac = chu === 'mjs:1/2' ? 'mjs:2/2' : 'mjs:1/2';
  const x = chay(R, chu), y = chay(R, khac);
  assert(x.rc !== 0 && /FAIL: e\.test\.mjs/.test(x.out), `manh ${chu} (chu cua ca do) thoat ${x.rc}, khong in FAIL: e.test.mjs`);
  assert(y.rc === 0, `manh ${khac} thoat ${y.rc} du khong chua ca do`);
  return `(ca do o ${chu}: thoat ${x.rc}; ${khac}: 0)`;
});

await ca('HT-AC2-do-bash', () => {
  const D = ghepFixture({ caBash: [...BASH_LANH, 'echo "HTX9 ca bash tiem do"', 'check HTX9 0 1'], mjs: MJS_LANH });
  const R = path.join(D, 'run-tests.sh');
  const b = chay(R, 'bash'), m1 = chay(R, 'mjs:1/2'), m2 = chay(R, 'mjs:2/2');
  assert(b.rc !== 0 && /FAIL: HTX9/.test(b.out), `manh bash thoat ${b.rc}, khong in FAIL: HTX9`);
  assert(m1.rc === 0 && m2.rc === 0, `manh mjs thoat ${m1.rc}/${m2.rc} du ca do la ca bash`);
  return `(bash thoat ${b.rc}; mjs 0/0)`;
});

// Phép kiểm config — trả danh sách lỗi.
function kiemConfig(cfg, gateYml) {
  const loi = [];
  const keys = khoaSuite(cfg);
  if (keys.includes('executors.test.scripts')) loi.push('suite_keys con executors.test.scripts nguyen khoi');
  const khai = manhKhai(cfg);
  if (!khai.some(x => x.manh === 'bash')) loi.push('manh thieu: bash');
  for (const x of khai) {
    const so = (x.lenh.match(/--manh\s+\S+/g) || []).length + (x.lenh.match(/SCRIPTS_SHARD=\S+/g) || []).length;
    if (so !== 1) loi.push(`khoa ${x.khoa} dat ${so} gia tri manh (can dung 1)`);
  }
  const mjs = khai.map(x => x.manh).filter(v => v && v.startsWith('mjs:'));
  const ns = [...new Set(mjs.map(v => Number(v.split('/')[1])))];
  if (!ns.length) loi.push('manh thieu: mjs');
  else if (ns.length > 1) loi.push(`manh mjs khai nhieu mau so: ${ns.join(',')}`);
  else for (let i = 1; i <= ns[0]; i += 1) if (!mjs.includes(`mjs:${i}/${ns[0]}`)) loi.push(`manh thieu: mjs:${i}/${ns[0]}`);
  const tron = lenhCua(cfg, 'executors.test.scripts');
  if (!tron) loi.push('executors.test.scripts vang');
  else if (manhCuaLenh(tron)) loi.push('executors.test.scripts dat manh — lenh tron phai chay tron');
  if (!/^\s*run:\s*bash tests\/scripts\/run-tests\.sh\s*$/m.test(gateYml)) loi.push('gate.yml khong con chay tron suite scripts');
  return loi;
}
const GATE_YML = () => readdirSync(path.join(KIT, '.github', 'workflows')).filter(f => f.endsWith('.yml')).map(f => readFileSync(path.join(KIT, '.github', 'workflows', f), 'utf8')).join('\n');

await ca('HT-AC3', () => {
  const loi = kiemConfig(readFileSync(CONFIG, 'utf8'), GATE_YML());
  assert(!loi.length, loi.join(' · '));
  return `(${manhKhai(readFileSync(CONFIG, 'utf8')).map(x => x.manh).join(', ')})`;
});

await ca('HT-AC3-dot-bien', () => {
  const cfg = readFileSync(CONFIG, 'utf8');
  const KIM = '    - executors.test.scripts_mjs_2\n';
  motLan(cfg, KIM, 'khoa scripts_mjs_2 trong suite_keys');
  const n = Number((manhKhai(cfg).map(x => x.manh).find(v => v && v.startsWith('mjs:')) || 'mjs:1/0').split('/')[1]);
  const ky = `manh thieu: mjs:2/${n}`;
  const loi = kiemConfig(cfg.replace(KIM, ''), GATE_YML());
  assert(n >= 2 && loi.includes(ky), `ban sao bo scripts_mjs_2 ma phep kiem khong do dung ten «${ky}»: ${loi.join(' · ') || '(rong)'}`);
  return `(do dung: ${ky})`;
});

// ── AC-4: s4-args thử lại CÙNG round ──────────────────────────────────────────
const S4ARGS = path.join(KIT, 'feature-loop', 'scripts', 's4-args.mjs');
const WF = path.join(KIT, 'feature-loop', 'workflows', 'acceptance-verify.js');
const NHAN = require(path.join(KIT, 'lib', 'nhan-canh-gay.cjs'));
const gitC = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
// Khoá dòng tally RÚT từ khối ROUND-TALLY-SCHEMA của bên viết — cùng cách round-tally-read.mjs rút.
const KHOA_TALLY = (() => {
  const src = readFileSync(WF, 'utf8');
  const m = src.match(/<<<ROUND-TALLY-SCHEMA\n([\s\S]*?)ROUND-TALLY-SCHEMA>>>/);
  assert(m, 'acceptance-verify.js mat khoi ROUND-TALLY-SCHEMA');
  const ks = [...m[1].matchAll(/"(\w+)":\s*[a-z|]+/g)].map(x => x[1]);
  assert(ks.includes('round') && ks.includes('verdict') && ks.includes('blocked'), `khoi ROUND-TALLY-SCHEMA thieu khoa: ${ks.join(',')}`);
  return ks;
})();
const tally = (ts, round, verdict, blocked = 0) => {
  const v = { round, verdict, expected: 1, returned: 1 - Math.min(blocked, 1), blocked, kind: 'round-tally' };
  const o = { ts }; for (const k of KHOA_TALLY) o[k] = v[k]; if (!('kind' in o)) o.kind = 'round-tally';
  return JSON.stringify(o);
};
const chet = (ts, round) => JSON.stringify({ ts, round, evalId: 'E1', kind: 'vang-mat', reason: `${NHAN.NGUON.deadReason} — khong co ket qua, khong duoc tinh la pass` });
const mu = (ts, round) => JSON.stringify({ ts, round, evalId: 'SUITE-suite', run_id: `minted-demo-SUITE-suite-r${round}`, exit_code: null, cmd: 'bash suite.sh', cannot_run: true, reason: NHAN.NGUON.toolKillReason });
const vat = (ts, round) => JSON.stringify({ ts, round, evalId: 'E1', run_id: `minted-demo-E1-r${round}`, exit_code: 1, cmd: 'echo x' });
const findingTrong = (ts, round) => JSON.stringify({ ts, round, kind: 'finding', file: 'src/x.js', title: 'loi trong hop dong', severity: 'high', source: 'review', inContract: true, acRef: 'AC-1', plain: '', proposal: '' });
const BAO_CAO = rounds => `---\nschema_version: 1\nfeature_slug: demo\nverdict: BLOCKED\n---\n\n# Evidence Report: demo\n\n## Iterations\n\n${rounds.map(r => `Round ${r} — chấm.`).join('\n')}\n`;
function khoS4({ baoCao = null, runLog = [] } = {}) {
  const d = mkdtempSync(path.join(TMP, 's4-'));
  mkdirSync(path.join(d, '_acceptance', 'demo'), { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main', d]);
  gitC(d, 'config', 'user.email', 't@t.t'); gitC(d, 'config', 'user.name', 'T');
  writeFileSync(path.join(d, '_acceptance', 'config.yaml'), 'schema_version: 1\nexecutors:\n  script:\n    cli: "echo x"\nfeature_loop:\n  suite_keys:\n    - executors.script.cli\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'contract.md'), '---\nschema_version: 1\nslug: demo\nrisk_tier: T2\nstatus: implemented\n---\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'evals.yaml'), 'schema_version: 1\nfeature_slug: demo\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.cli\n    expected: thuong\n');
  writeFileSync(path.join(d, 'README.md'), 'demo\n');
  gitC(d, 'add', '-A'); gitC(d, 'commit', '-qm', 'goc');
  gitC(d, 'checkout', '-qb', 'vong-nay');
  writeFileSync(path.join(d, 'src-demo.js'), 'x\n');
  if (baoCao) writeFileSync(path.join(d, '_acceptance', 'demo', 'evidence-report.md'), baoCao);
  if (runLog.length) writeFileSync(path.join(d, '_acceptance', 'demo', 'run-log.jsonl'), runLog.join('\n') + '\n');
  gitC(d, 'add', '-A'); gitC(d, 'commit', '-qm', 'vat cua vong');
  return d;
}
function chayS4(d, { carry = true, script = S4ARGS } = {}) {
  const out = path.join(d, 'args.json');
  const r = spawnSync(process.execPath, [script, '--slug', 'demo', '--root', d, '--ag-root', KIT, '--out', out, '--diff-base', 'main', ...(carry ? ['--no-carry'] : [])], { encoding: 'utf8' });
  return { rc: r.status, err: r.stderr || '', round: r.status === 0 ? JSON.parse(readFileSync(out, 'utf8')).round : null };
}
const T1 = '2026-09-24T01:00:00Z', T2 = '2026-09-24T02:00:00Z';
const MA_TRAN = [
  ['trong', {}],
  ['chi Iterations', { baoCao: BAO_CAO([1]) }],
  ['PASS', { baoCao: BAO_CAO([1]), runLog: [tally(T1, 1, 'PASS')] }],
  ['REJECT', { baoCao: BAO_CAO([1]), runLog: [vat(T1, 1), tally(T1, 1, 'REJECT')] }],
  ['BLOCKED chet lan dau', { baoCao: BAO_CAO([1]), runLog: [chet(T1, 1), tally(T1, 1, 'BLOCKED', 1)] }],
  ['BLOCKED mu lan dau', { baoCao: BAO_CAO([1]), runLog: [mu(T1, 1), tally(T1, 1, 'BLOCKED', 1)] }],
  ['BLOCKED da thu lai', { baoCao: BAO_CAO([1]), runLog: [chet(T1, 1), tally(T1, 1, 'BLOCKED', 1), chet(T2, 1), tally(T2, 1, 'BLOCKED', 1)] }],
  ['BLOCKED co vat', { baoCao: BAO_CAO([1]), runLog: [chet(T1, 1), vat(T1, 1), tally(T1, 1, 'BLOCKED', 1)] }],
  ['BLOCKED chet + finding trong hop dong', { baoCao: BAO_CAO([1]), runLog: [chet(T1, 1), findingTrong(T1, 1), tally(T1, 1, 'BLOCKED', 1)] }],
];
const KY_VONG = [1, 2, 2, 2, 1, 1, 2, 2, 2];
function chayMaTran(script) {
  return MA_TRAN.map(([ten, fx]) => ({ ten, ...chayS4(khoS4(fx), { script }) }));
}
let maTranThat = null;
await ca('HT-AC4', () => {
  maTranThat = chayMaTran(S4ARGS);
  const lech = maTranThat.map((x, i) => (x.round === KY_VONG[i] ? null : `hang ${i + 1} (${x.ten}): ra ${x.round} (rc ${x.rc}${x.rc ? ': ' + x.err.split('\n').filter(Boolean).pop() : ''}), ky vong ${KY_VONG[i]}`)).filter(Boolean);
  assert(lech.length === 0, lech.join(' · '));
  assert(maTranThat.length === KY_VONG.length, `so assert ${maTranThat.length} khac so hang ${KY_VONG.length}`);
  return `(${maTranThat.map(x => x.round).join(',')})`;
});
await ca('HT-AC4-thu-lai-roi', () => {
  const x = chayS4(khoS4(MA_TRAN[6][1]));
  const dong = x.err.split('\n').filter(l => l.includes('đã thử lại một lần vẫn chặn vì hạ tầng'));
  assert(dong.length === 1, `hang 7 stderr co ${dong.length} dong «đã thử lại một lần vẫn chặn vì hạ tầng» (can 1): ${x.err.slice(-300)}`);
  assert(dong[0].includes('trình thẻ Cổng Bằng chứng'), `dong stderr thieu «trình thẻ Cổng Bằng chứng»: ${dong[0]}`);
  return '(mot dong)';
});
await ca('HT-AC4-bao-cao-thieu', () => {
  const x = chayS4(khoS4({ baoCao: BAO_CAO([1]), runLog: [tally(T1, 1, 'PASS'), chet(T2, 2), tally(T2, 2, 'BLOCKED', 1)] }));
  assert(x.round === 2, `Iterations Round 1 + tally round 2 BLOCKED chet: ra ${x.round} (rc ${x.rc}), ky vong 2`);
  return '(2)';
});
await ca('HT-AC4-tran', () => {
  const fx = { baoCao: BAO_CAO([1, 2, 3]), runLog: [tally(T1, 1, 'REJECT'), tally(T1, 2, 'REJECT'), chet(T2, 3), tally(T2, 3, 'BLOCKED', 1)] };
  const x = chayS4(khoS4(fx));
  assert(x.round === 3, `tran: tally round 3 BLOCKED chet lan dau + --no-carry ra ${x.round} (rc ${x.rc}: ${x.err.split('\n').filter(Boolean).pop()}), ky vong 3`);
  const y = chayS4(khoS4(fx), { carry: false });
  assert(y.rc !== 0 && y.err.includes('phải khai tường minh'), `tran khong co co carry: rc ${y.rc}, stderr thieu «phải khai tường minh»`);
  return '(3; thieu co carry → thong diep carry)';
});
await ca('HT-AC4-dot-bien', () => {
  const src = readFileSync(S4ARGS, 'utf8');
  const m = src.match(/\n[^\n]*<<<THU-LAI-CUNG-ROUND[\s\S]*?THU-LAI-CUNG-ROUND>>>[^\n]*\n/g);
  assert(m && m.length === 1, `khoi marker THU-LAI-CUNG-ROUND khop ${m ? m.length : 0} lan (can 1)`);
  const sao = path.join(path.dirname(S4ARGS), `.htkd-s4-args-${process.pid}.mjs`);
  try {
    writeFileSync(sao, src.replace(m[0], '\n'));
    const kq = chayMaTran(sao);
    const lat = [5, 6].filter(h => kq[h - 1].round === 2).map(h => `hang ${h}`);
    assert(lat.length === 2, `ban sao go khoi thu-lai: hang 5 ra ${kq[4].round}, hang 6 ra ${kq[5].round} — phep do khong do`);
    return `(do dung: ${lat.join(', ')} lat sang 2)`;
  } finally { rmSync(sao, { force: true }); }
});
await ca('HT-AC4-khu-hoi', async () => {
  const { runWorkflow } = await import(path.join(KIT, 'tests', 'workflows', 'harness.mjs'));
  const kq = {};
  for (const [ten, coFinding] of [['chet', false], ['chet+finding', true]]) {
    const F = { title: 'loi trong hop dong', file: 'src/x.js', severity: 'high', detail: 'x' };
    const args = {
      slug: 'demo', round: 1, riskTier: 'T2',
      evals: [{ id: 'E1', criterion: 'AC-1', executor: 'script', cmd: 'echo x', ref: 'config:executors.script.cli', expected: 'thuong', paths: ['src/**'] }],
      suiteCommands: [], diffBase: 'main', repoRoot: '/repo', personasPath: '/refs/p.md', templatePath: '/refs/t.md',
      contractPath: '/repo/_acceptance/demo/contract.md', invokedAt: T1,
    };
    const respond = call => {
      const l = call.label;
      if (l.startsWith('machine:')) return null;                    // tác tử chấm lệnh CHẾT
      if (l.startsWith('review:')) return { findings: coFinding ? [F] : [] };
      if (l.startsWith('refute:')) return { refuted: false, reason: 'that' };
      if (l.startsWith('triage')) return { triaged: coFinding ? [{ title: F.title, file: F.file, inContract: true, acRef: 'AC-1', rationale: 'cham AC-1', proposal: '', plain: '' }] : [] };
      if (l.startsWith('judge:')) return { verdict: 'PASS', rationale: 'ok' };
      if (l.startsWith('baseline:')) return { results: [] };
      if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2' };
      if (l === 'synthesize:report') return { report: '# r', findings: '# f' };
      throw new Error('nhan la: ' + l);
    };
    const r = (await runWorkflow(WF, args, respond)).result;
    assert(r.verdict === 'BLOCKED', `workflow that (${ten}) ra verdict ${r.verdict}, can BLOCKED`);
    const x = chayS4(khoS4({ baoCao: BAO_CAO([1]), runLog: r.runLog }));
    kq[ten] = x.round;
  }
  assert(kq.chet === 1 && kq['chet+finding'] === 2, `run-log sinh boi workflow that: chet → ${kq.chet} (can 1), chet+finding → ${kq['chet+finding']} (can 2)`);
  return '(chet → 1, chet+finding → 2)';
});

// ── AC-5: khuôn /goal — tính chất trên ba bản ────────────────────────────────────
const SKILL_P = path.join(KIT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md');
const GUIDE_P = path.join(KIT, 'GUIDE.md');
const GC_P = path.join(KIT, 'scripts', 'gate-card.js');
const RX_MD = /<!-- <<<GOAL-TEMPLATE -->\n```\n([\s\S]*?)```\n<!-- GOAL-TEMPLATE>>> -->/;
const RX_JS = /\/\/ <<<GOAL-TEMPLATE[^\n]*\n(?:\/\/ [^\n]*\n)*const GOAL_TEMPLATE = `([\s\S]*?)`;\n\/\/ GOAL-TEMPLATE>>>/;
const rut = (rx, text, ten) => { const m = text.match(rx); assert(m, `${ten}: khong rut duoc khoi GOAL-TEMPLATE qua marker`); return m[1].trim(); };
// Phép kiểm tính chất của MỘT khuôn — trả danh sách lỗi (rỗng = đạt).
function kiemKhuon(k) {
  const loi = [];
  const n = k.split('\n').length;
  if (n !== 6) loi.push(`khuon ${n} dong (can 6)`);
  if (!k.startsWith('/goal ')) loi.push('khuon khong bat dau bang /goal');
  if (k.includes('status:')) loi.push('khuon con menh lenh trang thai tep «status:»');
  if (/không chắc/iu.test(k)) loi.push('khuon con ve «không chắc»');
  if (/người chọn/iu.test(k)) loi.push('khuon con ve «người chọn»');
  if (/nêu\s+(?:tiền đề hay\s+)?lối/iu.test(k)) loi.push('khuon con ve «nêu lối»');
  // Trạng thái «đã ký» rút từ lib (nếp hskt): tệp ca không mang chuỗi trạng thái của riêng nó (RT13).
  if (k.includes(require(path.join(KIT, 'lib', 'workspace-record.cjs')).DA_THONG_CONG_2[0])) loi.push('khuon nham dich trang thai da ky');
  if (!k.includes('sau 15 turns')) loi.push('khuon mat loi thoat «sau 15 turns»');
  if (!k.includes('Cổng Bằng chứng')) loi.push('khuon khong neo «Cổng Bằng chứng»');
  const cau = k.split('\n').join(' ').split(/(?<=[.!?])\s+/);
  for (const c of cau) if (c.includes('BLOCKED') && !c.includes('CHƯA hoàn thành')) loi.push(`BLOCKED ngoai cau CHUA hoan thanh: «${c.slice(0, 90)}»`);
  return loi;
}
const VE_BLOCKED_CU = 'Loop đã escalate cho user (REJECT quá 3 round / BLOCKED / chờ input người) cũng coi là HOÀN THÀNH.';
const VE_NEU_LOI_CU = 'Dừng mà không nêu tiền đề hay lối nào để người chọn = CHƯA hoàn thành.';
// Chèn một câu vào đầu dòng thứ hai, giữ đúng 6 dòng — đột biến chỉ đổi NGHĨA, không đổi hình.
const chen = (k, cau) => { const L = k.split('\n'); L[1] = `${cau} ${L[1]}`; return L.join('\n'); };

await ca('HT-AC5', async () => {
  const sb = rut(RX_MD, readFileSync(SKILL_P, 'utf8'), 'SKILL');
  const gb = rut(RX_MD, readFileSync(GUIDE_P, 'utf8'), 'GUIDE');
  const cb = rut(RX_JS, readFileSync(GC_P, 'utf8'), 'gate-card.js');
  assert(sb === gb && sb === cb, `ba ban khuon lech: SKILL${sb === gb ? '=' : '≠'}GUIDE, SKILL${sb === cb ? '=' : '≠'}gate-card`);
  const loi = kiemKhuon(sb);
  assert(!loi.length, loi.join(' · '));
  const { mkWs, G1, PROBE, card } = await import('./gate-fixture.mjs');
  const r = mkWs('g', G1(PROBE('findings')));
  const x = card(r, 'g', ['--extract']);
  assert(x.status === 0, `gate-card --extract thoat ${x.status}: ${(x.stderr || '').slice(0, 200)}`);
  const goal = JSON.parse(x.stdout).goal_line;
  const kyVong = sb.split('\n').join(' ').split('<slug>').join('g');
  assert(goal === kyVong, `the Cong 1 in goal_line khac khuon moi: «${String(goal).slice(0, 80)}…»`);
  return '(3 ban khop, 6 dong, du tinh chat, the Cong 1 in khuon moi)';
});

await ca('HT-AC5-dot-bien', () => {
  const sb = rut(RX_MD, readFileSync(SKILL_P, 'utf8'), 'SKILL');
  assert(!kiemKhuon(sb).length, 'doi chung duong: khuon lanh phai dat truoc khi tin mau do');
  const l1 = kiemKhuon(chen(sb, VE_BLOCKED_CU));
  assert(l1.some(l => l.startsWith('BLOCKED ngoai cau CHUA hoan thanh')), `chen lai ve BLOCKED-la-xong ma phep kiem khong do: ${l1.join(' · ') || '(rong)'}`);
  const l2 = kiemKhuon(chen(sb, VE_NEU_LOI_CU));
  assert(l2.some(l => l.includes('«nêu lối»')), `chen lai ve «neu loi» ma phep kiem khong do: ${l2.join(' · ') || '(rong)'}`);
  return '(do dung: BLOCKED ngoai cau CHUA hoan thanh · «nêu lối»)';
});

// ── AC-6: SKILL — bước BLOCKED + câu Gate 1.5 ─────────────────────────────────────
const MENH_DE_BLOCKED = ['s4-args', 'không đếm vào trần', 'MỘT lần', 'như REJECT', 'thẻ Cổng Bằng chứng'];
function kiemSkill(text) {
  const loi = [];
  const a = text.indexOf('   - `BLOCKED` →');
  const b = text.indexOf('<!-- <<<CLASSIFIER-FALLBACK -->');
  if (a < 0 || b < 0 || b < a) return ['khong tim thay doan buoc S4 BLOCKED (tu «- `BLOCKED` →» toi CLASSIFIER-FALLBACK)'];
  const doan = text.slice(a, b);
  for (const m of MENH_DE_BLOCKED) if (!doan.includes(m)) loi.push(`buoc BLOCKED thieu menh de «${m}»`);
  const cho = text.match(/chờ input người[^\n]*hoàn thành/iu);
  if (cho) loi.push(`SKILL con coi «chờ input người» la hoan thanh: «${cho[0].slice(0, 80)}»`);
  return loi;
}
await ca('HT-AC6', () => {
  const loi = kiemSkill(readFileSync(SKILL_P, 'utf8'));
  assert(!loi.length, loi.join(' · '));
  return `(du ${MENH_DE_BLOCKED.length} menh de; khong con «chờ input người» la hoan thanh)`;
});
await ca('HT-AC6-do', () => {
  const r = spawnSync('git', ['-C', KIT, 'show', 'v2.18.2:feature-loop/skills/feature-loop/SKILL.md'], { encoding: 'utf8' });
  assert(r.status === 0, `khong doc duoc SKILL doi truoc tai tag v2.18.2: ${(r.stderr || '').trim()}`);
  const loi = kiemSkill(r.stdout);
  assert(loi.some(l => l.startsWith('buoc BLOCKED thieu menh de')), `SKILL v2.18.2 ma phep kiem khong do buoc BLOCKED: ${loi.join(' · ') || '(rong)'}`);
  return `(do dung tren v2.18.2: ${loi.filter(l => l.startsWith('buoc BLOCKED')).length} menh de thieu)`;
});

// ── AC-7: thẻ Cổng 1 của hồ sơ đã khép ─────────────────────────────────────────
const WR = require(path.join(KIT, 'lib', 'workspace-record.cjs'));
const hopDongG1 = (slug, status) => `---\nschema_version: 1\nslug: ${slug}\nfeature: viec ${slug}\nowner: x@y.z\nrisk_tier: T2\nsurfaces: [cli]\nstatus: ${status}\napproved_by: M\napproved_at: 2026-09-01T00:00:00Z\n---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n\n## Out of scope\n\n- khong gi\n`;
const dongNghiG1 = () => JSON.stringify({ id: 'd-20260920T100000Z-1', type: 'nghi', stage: 'nghi', by: 'M', at: '2026-09-20T10:00:00Z', decision: 'tien de ngoai da chet' });
// Vế dòng quan sát RÚT từ lib (THUC_TE_VE) — không gõ tay danh sách vế.
const dongTTG1 = () => JSON.stringify({ id: 'd-20260921T100000Z-1', type: 'thuc-te', stage: 'thuc-te',
  ...Object.fromEntries(WR.THUC_TE_VE.map(k => [k, { id: 'd-20260921T100000Z-1', by: 'M', at: '2026-09-21T09:00:00Z', build_sha: 'f'.repeat(40), decision: 'chay tren prod' }[k]])) });
const MA_TRAN_AC7 = [
  ['g1-thuc-te', 'da-cham-boi-thuc-te', dongTTG1(), true],
  ['g1-nghi-chua-ky', 'approved', dongNghiG1(), false],
  ['g1-draft', 'draft', null, false],
  ['g1-approved', 'approved', null, false],
];
let _khoG1 = null;
function khoG1() {
  if (_khoG1) return _khoG1;
  const r = mkdtempSync(path.join(TMP, 'g1-'));
  execFileSync('git', ['init', '-q', '-b', 'main', r]); gitC(r, 'config', 'user.email', 'x@y.z'); gitC(r, 'config', 'user.name', 'x');
  mkdirSync(path.join(r, '_acceptance'), { recursive: true });
  writeFileSync(path.join(r, '_acceptance', 'config.yaml'), 'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "PRODUCT-MAP.md"\n');
  for (const [slug, status, dong] of MA_TRAN_AC7) {
    const d = path.join(r, '_acceptance', slug); mkdirSync(d, { recursive: true });
    writeFileSync(path.join(d, 'contract.md'), hopDongG1(slug, status));
    if (dong) writeFileSync(path.join(d, 'decisions.jsonl'), dong + '\n');
  }
  gitC(r, 'add', '-A'); gitC(r, 'commit', '-qm', 'fixture');
  return (_khoG1 = r);
}
const CAU_KHEP_G1 = 'không còn câu hỏi nào cho người';
function kiemG1(gc) {
  const R = khoG1(); const loi = [];
  for (const [slug, , , khep] of MA_TRAN_AC7) {
    const x = spawnSync(process.execPath, [gc, '--root', R, '--slug', slug, '--extract'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    if (x.status !== 0) { loi.push(`${slug}: --extract thoat ${x.status}: ${(x.stderr || '').slice(0, 160)}`); continue; }
    const j = JSON.parse(x.stdout);
    const h = spawnSync(process.execPath, [gc, '--root', R, '--slug', slug], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).stdout || '';
    const hoi = (j.routing && j.routing.hoi) || [];
    if (j.gate !== 1) loi.push(`${slug}: the tu nhan cong ${j.gate} (can 1)`);
    if (khep) {
      if (hoi.length) loi.push(`${slug}: ho so da khep ma routing.hoi=${JSON.stringify(hoi)}`);
      if (j.one_shot != null) loi.push(`${slug}: ho so da khep ma con one_shot`);
      if (j.goal_line != null) loi.push(`${slug}: ho so da khep ma con goal_line`);
      if (!h.includes(CAU_KHEP_G1)) loi.push(`${slug}: HTML thieu «${CAU_KHEP_G1}»`);
    } else if (JSON.stringify(hoi) !== JSON.stringify(['duyệt hay sửa'])) loi.push(`${slug}: ho so song ma routing.hoi=${JSON.stringify(hoi)}`);
  }
  return loi;
}
await ca('HT-AC7', () => {
  const loi = kiemG1(GC_P);
  assert(!loi.length, loi.join(' · '));
  return `(${MA_TRAN_AC7.length} ho so: 1 khep 0 o hoi, 3 song hoi nhu cu)`;
});
await ca('HT-AC7-dot-bien', () => {
  const src = readFileSync(GC_P, 'utf8');
  const KIM = 'const DA_KHEP_G1 = G1_CO_THE_KHEP && daKhepTu(quetHoSo().hit);';
  motLan(src, KIM, 'DA_KHEP_G1');
  const sao = path.join(path.dirname(GC_P), `.htkd-gate-card-${process.pid}.js`);
  try {
    writeFileSync(sao, src.replace(KIM, 'const DA_KHEP_G1 = false;'));
    const loi = kiemG1(sao);
    assert(loi.some(l => l.startsWith('g1-thuc-te: ho so da khep ma routing.hoi')), `ban sao go ve khep o nhanh Cong 1 ma phep kiem khong do dung ten: ${loi.join(' · ') || '(rong)'}`);
    return '(do dung: g1-thuc-te co lai o hoi)';
  } finally { rmSync(sao, { force: true }); }
});

// ── AC-8: suite plugins chia vùng ───────────────────────────────────────────────
const P_RUNNER = path.join(KIT, 'tests', 'plugins', 'run-tests.sh');
const RX_VUNG = /^# <<<PLUGINS-VUNG (\d+)$/;
// Cắt ĐỘC LẬP bằng JS (không gọi hàm ghép của tệp chạy): phần đầu · các vùng · phần kết.
function catVung(text) {
  const L = text.split('\n');
  const moc = []; let ket = -1;
  L.forEach((l, i) => { const m = l.match(RX_VUNG); if (m && ket < 0) moc.push({ k: Number(m[1]), i }); if (l === '# <<<PLUGINS-KET' && ket < 0) ket = i; });
  return { L, moc, ket };
}
function kiemVung(text, nKhai, emitFn) {
  const loi = [];
  const { L, moc, ket } = catVung(text);
  if (ket < 0) return ['thieu marker PLUGINS-KET'];
  for (let k = 1; k <= nKhai; k += 1) if (!moc.some(m => m.k === k)) loi.push(`vung thieu: ${k}`);
  if (moc.length !== nKhai) loi.push(`so marker vung ${moc.length} khac so vung khai ${nKhai}`);
  if (loi.length) return loi;
  const dau = L.slice(0, moc[0].i), cuoi = L.slice(ket);
  const noi = [];
  moc.forEach((m, j) => {
    const vung = L.slice(m.i, j + 1 < moc.length ? moc[j + 1].i : ket);
    noi.push(...vung.slice(1));
    if (vung.length < 2) loi.push(`vung ${m.k} rong`);
    if (emitFn) {
      const ky = [...dau, ...vung, ...cuoi].join('\n');
      const ra = emitFn(m.k);
      if (ra.replace(/\n$/, '') !== ky.replace(/\n$/, '')) loi.push(`ban ghep vung ${m.k} khac phan dau + vung ${m.k} + phan ket`);
    }
  });
  const than = L.slice(moc[0].i, ket).filter(l => !RX_VUNG.test(l));
  if (JSON.stringify(noi) !== JSON.stringify(than)) loi.push('noi cac vung khac than suite goc');
  return loi;
}
const emitThat = file => k => {
  const env = { ...process.env, PLUGINS_SHARD_EMIT: '1' }; delete env.PLUGINS_SHARD; delete env._PLUGINS_TRONG_MANH; delete env._PLUGINS_SELF_GOC; delete env._PLUGINS_ROOT_GOC;
  const r = spawnSync('bash', [file, '--manh', `vung:${k}`], { encoding: 'utf8', env, maxBuffer: 64 * 1024 * 1024 });
  assert(r.status === 0, `in ban ghep vung ${k} thoat ${r.status}: ${(r.stderr || '').slice(0, 200)}`);
  return r.stdout;
};
const vungKhai = cfg => khoaSuite(cfg).map(k => lenhCua(cfg, k) || '').filter(c => c.includes('tests/plugins/run-tests.sh')).map(c => { const m = c.match(/--manh\s+vung:(\d+)/); return m ? Number(m[1]) : null; });

await ca('HT-AC8', () => {
  const cfg = readFileSync(CONFIG, 'utf8');
  const vk = vungKhai(cfg);
  assert(vk.length && vk.every(v => v != null), `suite_keys khai lenh plugins khong dat vung: ${JSON.stringify(vk)}`);
  const n = Math.max(...vk);
  const loi = kiemVung(readFileSync(P_RUNNER, 'utf8'), n, emitThat(P_RUNNER));
  for (let k = 1; k <= n; k += 1) if (!vk.includes(k)) loi.push(`suite_keys thieu vung ${k}`);
  if (khoaSuite(cfg).includes('executors.test.plugins')) loi.push('suite_keys con executors.test.plugins nguyen khoi');
  if (/--manh/.test(lenhCua(cfg, 'executors.test.plugins') || '')) loi.push('executors.test.plugins dat manh — lenh tron phai chay tron');
  if (!/^\s*run:\s*bash tests\/plugins\/run-tests\.sh\s*$/m.test(GATE_YML())) loi.push('gate.yml khong con chay tron suite plugins');
  assert(!loi.length, loi.join(' · '));
  return `(${n} vung, noi = than goc, moi ban ghep = dau + vung + ket)`;
});

// Fixture: phần đầu THẬT (tới marker vùng 1) + ba vùng tí hon + phần kết THẬT.
function fixtureVung({ doVung2 = false } = {}) {
  const { L, moc, ket } = catVung(readFileSync(P_RUNNER, 'utf8'));
  assert(moc.length && ket > 0, 'tep chay plugins thieu marker vung/ket');
  const vung = k => [`# <<<PLUGINS-VUNG ${k}`, `run "HTP${k} ca tiem vung ${k}" true`, ...(doVung2 && k === 2 ? ['run "HTP9 ca tiem do" false'] : [])];
  const D = mkdtempSync(path.join(TMP, 'pv-'));
  writeFileSync(path.join(D, 'run-tests.sh'), [...L.slice(0, moc[0].i), ...vung(1), ...vung(2), ...vung(3), ...L.slice(ket)].join('\n'));
  return path.join(D, 'run-tests.sh');
}
function chayVung(file, k) {
  const env = { ...process.env }; for (const v of ['PLUGINS_SHARD', 'PLUGINS_SHARD_EMIT', '_PLUGINS_TRONG_MANH', '_PLUGINS_SELF_GOC', '_PLUGINS_ROOT_GOC', 'ONLY_BLOCK']) delete env[v];
  const r = spawnSync('bash', k ? [file, '--manh', `vung:${k}`] : [file], { encoding: 'utf8', env, timeout: 60000 });
  const out = (r.stdout || '') + (r.stderr || '');
  return { rc: r.status, out, pass: (out.match(/^ {2}PASS: /gm) || []).length };
}
await ca('HT-AC8-do', () => {
  const F = fixtureVung();
  const tron = chayVung(F, null), v = [1, 2, 3].map(k => chayVung(F, k));
  assert(tron.rc === 0 && v.every(x => x.rc === 0), `fixture lanh: tron ${tron.rc}, vung ${v.map(x => x.rc).join('/')}: ${tron.out.slice(-200)}`);
  const tong = v.reduce((a, x) => a + x.pass, 0);
  assert(tron.pass === tong && tong === 3, `PASS tron ${tron.pass} khac tong cac vung ${tong} (ky vong 3)`);
  const D = fixtureVung({ doVung2: true });
  const d = [1, 2, 3].map(k => chayVung(D, k));
  assert(d[1].rc !== 0 && /FAIL: HTP9 ca tiem do/.test(d[1].out), `vung 2 chua ca do thoat ${d[1].rc}, khong in FAIL: HTP9`);
  assert(d[0].rc === 0 && d[2].rc === 0, `vung 1/3 thoat ${d[0].rc}/${d[2].rc} du khong chua ca do`);
  return `(lanh: tron ${tron.pass} = ${v.map(x => x.pass).join(' + ')}; do: chi vung 2 thoat ${d[1].rc})`;
});
await ca('HT-AC8-dot-bien', () => {
  const src = readFileSync(P_RUNNER, 'utf8');
  const KIM = '\n# <<<PLUGINS-VUNG 2\n';
  motLan(src, KIM, 'marker vung 2');
  const n = Math.max(...vungKhai(readFileSync(CONFIG, 'utf8')));
  const loi = kiemVung(src.replace(KIM, '\n'), n, null);
  assert(loi.includes('vung thieu: 2'), `ban sao go marker vung 2 ma phep kiem khong do dung ten: ${loi.join(' · ') || '(rong)'}`);
  return '(do dung: vung thieu: 2)';
});

// ── AC-9: khuôn goal có điểm kết cho làn V ──────────────────────────────────────
const VE_S5 = 'hoặc (làn V) đã mở PR ở S5, ';
function kiemLamV(k) {
  const loi = [];
  const cau = k.split('\n').join(' ').split(/(?<=[.!?])\s+/);
  const xong = cau.find(c => c.includes('HOÀN THÀNH'));
  if (!xong) return ['khong thay cau HOAN THANH'];
  if (!(xong.includes('S5') && xong.includes('PR') && xong.includes('làn V'))) loi.push('thieu diem ket lam V');
  else if (/ký/u.test(xong)) loi.push('lam V bi dieu kien ky');
  for (const c of cau) if (c.includes('CHƯA hoàn thành') && /S5/.test(c)) loi.push('S5 sai cuc');
  return loi;
}
const CAU_TU_THOA = /^.*goal tự thỏa.*$/m;
function kiemGuideTuThoa(g) {
  const m = g.match(CAU_TU_THOA);
  if (!m) return ['thieu cau goal tu thoa'];
  const loi = [];
  if (!(m[0].includes('làn V') && m[0].includes('PR'))) loi.push(`cau goal tu thoa thieu lam V: «${m[0].slice(0, 80)}»`);
  return loi;
}
await ca('HT-AC9', () => {
  const sb = rut(RX_MD, readFileSync(SKILL_P, 'utf8'), 'SKILL');
  const gb = rut(RX_MD, readFileSync(GUIDE_P, 'utf8'), 'GUIDE');
  const cb = rut(RX_JS, readFileSync(GC_P, 'utf8'), 'gate-card.js');
  assert(sb === gb && sb === cb, 'ba ban khuon lech');
  const loi = [...kiemKhuon(sb), ...kiemLamV(sb), ...kiemGuideTuThoa(readFileSync(GUIDE_P, 'utf8'))];
  assert(!loi.length, loi.join(' · '));
  return '(ve lam V trong cau HOAN THANH; cau GUIDE goal tu thoa neu lam V + PR)';
});
await ca('HT-AC9-dot-bien', () => {
  const sb = rut(RX_MD, readFileSync(SKILL_P, 'utf8'), 'SKILL');
  assert(!kiemLamV(sb).length && !kiemKhuon(sb).length, 'doi chung duong: khuon lanh phai dat truoc');
  motLan(sb, VE_S5, 've S5 cua khuon');
  const go = kiemLamV(sb.replace(VE_S5, ''));
  assert(go.includes('thieu diem ket lam V'), `go ve S5 ma khong do dung ten: ${go.join(' · ') || '(rong)'}`);
  const ky = kiemLamV(sb.replace(VE_S5, 'hoặc (làn V) đã mở PR ở S5 sau khi người ký, '));
  assert(ky.includes('lam V bi dieu kien ky'), `chen dieu kien ky ma khong do: ${ky.join(' · ') || '(rong)'}`);
  const L = sb.replace(VE_S5, '').split('\n'); const i = L.findIndex(l => l.includes('CHƯA hoàn thành'));
  L[i] = L[i].replace('không hỏi.', 'không hỏi, kể cả khi (làn V) đã mở PR ở S5.');
  const cuc = kiemLamV(L.join('\n'));
  assert(cuc.includes('S5 sai cuc'), `chuyen ve S5 sang cau CHUA ma khong do: ${cuc.join(' · ') || '(rong)'}`);
  const g = readFileSync(GUIDE_P, 'utf8');
  assert(!kiemGuideTuThoa(g).length, 'doi chung duong: cau GUIDE lanh phai dat truoc');
  const cauG = g.match(CAU_TU_THOA)[0];
  const gGo = g.replace(cauG, cauG.split('làn V').join('lối tự động'));
  assert(kiemGuideTuThoa(gGo).some(l => l.startsWith('cau goal tu thoa thieu lam V')), 'ban sao GUIDE go lam V ma khong do');
  assert(kiemGuideTuThoa(g.replace(cauG, '')).includes('thieu cau goal tu thoa'), 'ban sao GUIDE xoa cau ma khong do');
  return '(do dung: thieu diem ket · dieu kien ky · S5 sai cuc · GUIDE go lam V · GUIDE xoa cau)';
});

// ── AC-10: mục /goal của GUIDE thôi đặt đích verified/escalate ─────────────────
const chuan = s => s.replace(/`/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
const boMarker = s => s.replace(/<!-- <<<GOAL-TEMPLATE -->[\s\S]*?<!-- GOAL-TEMPLATE>>> -->/g, '');
const mucGoal = g => { const m = g.match(/^## [^\n]*\/goal[^\n]*\n([\s\S]*?)(?=^## )/m); return m ? m[0] : ''; };
const cauCua = s => boMarker(s).split(/(?<=[.!?;])\s+|\n\s*[-*]\s+|\n\n+/).map(chuan).filter(Boolean);
const PHU_DINH = /(không|thôi|bỏ|cũ)/u;
const viPham = c => /goal/.test(c) && /(verified|escalate)/.test(c) && !PHU_DINH.test(c);
function kiemGoalGuide(g, cauCu) {
  const loi = [];
  const muc = mucGoal(g);
  if (!muc || !muc.includes('<<<GOAL-TEMPLATE') || !cauCua(muc).length) return ['muc goal rong'];
  const tat = cauCua(g).join(' \n ');
  for (const c of cauCu) if (tat.includes(c)) loi.push(`cau cu con tren cay: «${c.slice(0, 70)}»`);
  for (const c of cauCua(g)) if (viPham(c)) loi.push(`cau dat dich verified/escalate: «${c.slice(0, 70)}»`);
  return loi;
}
const GUIDE_CU = (() => { const r = spawnSync('git', ['-C', KIT, 'show', 'v2.18.2:GUIDE.md'], { encoding: 'utf8' }); return r.status === 0 ? r.stdout : null; })();
const cauCuTu = g => cauCua(mucGoal(g)).filter(c => /(verified|escalate)/.test(c));
await ca('HT-AC10', () => {
  assert(GUIDE_CU, 'khong doc duoc GUIDE tai tag v2.18.2');
  const cu = cauCuTu(GUIDE_CU);
  assert(cu.length, 'tap cau cu rut tu v2.18.2 rong — phep do tu chet');
  const loi = kiemGoalGuide(readFileSync(GUIDE_P, 'utf8'), cu);
  assert(!loi.length, loi.join(' · '));
  return `(${cu.length} cau cu rut tu v2.18.2, khong cau nao con)`;
});
await ca('HT-AC10-do', () => {
  assert(GUIDE_CU, 'khong doc duoc GUIDE tai tag v2.18.2');
  const cu = cauCuTu(GUIDE_CU);
  const l1 = kiemGoalGuide(GUIDE_CU, cu);
  assert(l1.some(l => l.startsWith('cau cu con tren cay')), `GUIDE v2.18.2 ma phep kiem khong do: ${l1.join(' · ') || '(rong)'}`);
  const g = readFileSync(GUIDE_P, 'utf8');
  const chen = g.replace('## Model theo giai đoạn', 'Chỉ đặt goal tới transcript xác nhận `verified` hay trạng thái escalate.\n\n## Model theo giai đoạn');
  const l2 = kiemGoalGuide(chen, cu);
  assert(l2.some(l => l.startsWith('cau dat dich verified/escalate')), `chen lai cau cu da doi mot chu ma khong do: ${l2.join(' · ') || '(rong)'}`);
  return `(do dung tren v2.18.2: ${l1.length} loi; cau cu doi chu van do)`;
});

// ── AC-11: s4-args soi đúng tập REJECT của bộ chấm ──────────────────────────────
const findingCo = (ts, round, co) => JSON.stringify({ ts, round, kind: 'finding', file: 'src/x.js', title: 'loi ' + JSON.stringify(co), severity: 'high', source: 'review', inContract: true, acRef: 'AC-1', plain: '', proposal: '', ...co });
const HANG_AC11 = [
  ['a unverified', [chet(T1, 1), findingCo(T1, 1, { unverified: true }), tally(T1, 1, 'BLOCKED', 1)], 1],
  ['b unclassified', [chet(T1, 1), findingCo(T1, 1, {}), JSON.stringify({ ts: T1, round: 1, kind: 'finding', file: 'src/y.js', title: 'chua phan loai', severity: 'low', source: 'review', inContract: false, acRef: '', plain: '', proposal: '', unclassified: true }), tally(T1, 1, 'BLOCKED', 1)], 1],
  ['c da bac bo', [chet(T1, 1), findingCo(T1, 1, {}), tally(T1, 1, 'BLOCKED', 1)], 2],
];
const chayAC11 = script => HANG_AC11.map(([ten, rl]) => ({ ten, round: chayS4(khoS4({ baoCao: BAO_CAO([1]), runLog: rl }), { script }).round }));
await ca('HT-AC11', () => {
  const kq = chayAC11(S4ARGS);
  const lech = kq.map((x, i) => (x.round === HANG_AC11[i][2] ? null : `hang ${x.ten}: ra ${x.round}, ky vong ${HANG_AC11[i][2]}`)).filter(Boolean);
  assert(!lech.length, lech.join(' · '));
  return `(${kq.map(x => x.round).join(',')})`;
});
// Ba lượt THẬT của bộ chấm qua harness; trả { ten, rejectRong, runLog }.
async function luotThat() {
  const { runWorkflow } = await import(path.join(KIT, 'tests', 'workflows', 'harness.mjs'));
  const F = { title: 'loi trong hop dong', file: 'src/x.js', severity: 'high', detail: 'x' };
  const args = {
    slug: 'demo', round: 1, riskTier: 'T2',
    evals: [{ id: 'E1', criterion: 'AC-1', executor: 'script', cmd: 'echo x', ref: 'config:executors.script.cli', expected: 'thuong', paths: ['src/**'] }],
    suiteCommands: [], diffBase: 'main', repoRoot: '/repo', personasPath: '/refs/p.md', templatePath: '/refs/t.md',
    contractPath: '/repo/_acceptance/demo/contract.md', invokedAt: T1,
  };
  const out = [];
  const G = { title: 'loi thu hai', file: 'src/z.js', severity: 'low', detail: 'z' };
  for (const [ten, kieu] of [['bac-bo-chet', 'refute'], ['triage-thieu-muc', 'triage'], ['da-bac-bo', 'lanh']]) {
    const respond = call => {
      const l = call.label;
      if (l.startsWith('machine:')) return null;
      // triage-thieu-muc: hai finding, triage chỉ trả MỘT (trong hợp đồng) cả hai lượt hỏi → triage không đủ.
      if (l.startsWith('review:')) return { findings: kieu === 'triage' ? [F, G] : [F] };
      if (l.startsWith('refute:')) return kieu === 'refute' ? null : { refuted: false, reason: 'that' };
      if (l.startsWith('triage')) return { triaged: [{ title: F.title, file: F.file, inContract: true, acRef: 'AC-1', rationale: 'r', proposal: '', plain: '' }] };
      if (l.startsWith('judge:')) return { verdict: 'PASS', rationale: 'ok' };
      if (l.startsWith('baseline:')) return { results: [] };
      if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2' };
      if (l === 'synthesize:report') return { report: '# r', findings: '# f' };
      throw new Error('nhan la: ' + l);
    };
    const r = (await runWorkflow(WF, args, respond)).result;
    assert(r.verdict === 'BLOCKED', `luot that ${ten} ra ${r.verdict}, can BLOCKED`);
    out.push({ ten, rejectRong: !(r.rejectFindings || []).length, runLog: r.runLog });
  }
  return out;
}
let _luot = null; const luotT = async () => (_luot ||= await luotThat());
await ca('HT-AC11-khu-hoi', async () => {
  const L = await luotT(); const loi = []; const bang = [];
  for (const x of L) {
    const round = chayS4(khoS4({ baoCao: BAO_CAO([1]), runLog: x.runLog })).round;
    bang.push(`${x.ten}: reject ${x.rejectRong ? 'rong' : 'co'} → round ${round}`);
    if (x.rejectRong !== (round === 1)) loi.push(`quan he lech o ${x.ten}: rejectFindings ${x.rejectRong ? 'rong' : 'khac rong'} nhung s4-args ra ${round}`);
  }
  assert(L.some(x => x.rejectRong) && L.some(x => !x.rejectRong), `ba luot khong phu ca hai phia cua quan he: ${bang.join(' · ')}`);
  assert(!loi.length, loi.join(' · '));
  return `(${bang.join(' · ')})`;
});
await ca('HT-AC11-dot-bien', async () => {
  const src = readFileSync(S4ARGS, 'utf8');
  const KIM_UV = ' && o.unverified !== true';
  const KIM_UC = 'const trieuHong = ';
  motLan(src, KIM_UV, 've unverified');
  motLan(src, KIM_UC, 've unclassified');
  const L = await luotT(); const loi = [];
  for (const [kim, doi, lat] of [[KIM_UV, '', 'bac-bo-chet'], [KIM_UC, 'const trieuHong = false && ', 'triage-thieu-muc']]) {
    const sao = path.join(path.dirname(S4ARGS), `.htkd-s4-ac11-${process.pid}.mjs`);
    try {
      writeFileSync(sao, src.replace(kim, doi));
      const kq = Object.fromEntries(L.map(x => [x.ten, chayS4(khoS4({ baoCao: BAO_CAO([1]), runLog: x.runLog }), { script: sao }).round]));
      const khac = L.filter(x => x.ten !== lat && x.rejectRong).map(x => x.ten);
      if (kq[lat] !== 2) loi.push(lat === 'triage-thieu-muc' ? `ve unclassified khong co chieu do tren ben viet that (${lat} ra ${kq[lat]})` : `bo ve unverified ma ${lat} ra ${kq[lat]}, can 2`);
      for (const k of khac) if (kq[k] !== 1) loi.push(`dot bien ${lat} lam lat ca ${k} (ra ${kq[k]})`);
    } finally { rmSync(sao, { force: true }); }
  }
  assert(!loi.length, loi.join(' · '));
  return '(bo ve unverified → chi bac-bo-chet lat; bo ve unclassified → chi triage-thieu-muc lat)';
});

// ── (các ca AC-4…AC-7 nối vào dưới) ─────────────────────────────────────────────

rmSync(TMP, { recursive: true, force: true });
console.log(`htkd: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
