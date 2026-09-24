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
const ca = (name, fn) => { if (!want(name)) return; try { const m = fn(); ok(name, m || ''); } catch (e) { bad(name, String(e && e.message || e).split('\n').slice(0, 6).join(' | ')); } };
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

ca('HT-AC1', () => {
  const loi = kiemPhanHoach(RUNNER, HERE, readFileSync(CONFIG, 'utf8'));
  assert(!loi.length, loi.join(' · '));
  return `(${tapKyVong(HERE).length} tep chia ${manhKhai(readFileSync(CONFIG, 'utf8')).filter(x => (x.manh || '').startsWith('mjs:')).length} manh mjs)`;
});

ca('HT-AC1-dot-bien', () => {
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

ca('HT-AC2', () => {
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

ca('HT-AC2-do-mjs', () => {
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

ca('HT-AC2-do-bash', () => {
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

ca('HT-AC3', () => {
  const loi = kiemConfig(readFileSync(CONFIG, 'utf8'), GATE_YML());
  assert(!loi.length, loi.join(' · '));
  return `(${manhKhai(readFileSync(CONFIG, 'utf8')).map(x => x.manh).join(', ')})`;
});

ca('HT-AC3-dot-bien', () => {
  const cfg = readFileSync(CONFIG, 'utf8');
  const KIM = '    - executors.test.scripts_mjs_2\n';
  motLan(cfg, KIM, 'khoa scripts_mjs_2 trong suite_keys');
  const loi = kiemConfig(cfg.replace(KIM, ''), GATE_YML());
  assert(loi.includes('manh thieu: mjs:2/2'), `ban sao bo scripts_mjs_2 ma phep kiem khong do dung ten: ${loi.join(' · ') || '(rong)'}`);
  return '(do dung: manh thieu: mjs:2/2)';
});

// ── (các ca AC-4…AC-7 nối vào dưới) ─────────────────────────────────────────────

rmSync(TMP, { recursive: true, force: true });
console.log(`htkd: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
