// s4-args-lenh-dai-chay-rieng.test.mjs — bên VIẾT của hồ sơ lenh-dai-chay-rieng (AC-1, AC-5).
//
//   SL* — `long_running: <phút>` trên eval → `longRunning` trong args; giá trị sai → exit 2 có tên.
//   SC* — `feature_loop.model_evals` → `evalsChayRieng`, đọc bằng CHÍNH docKhoa của làn ghim lại.
// Kho git fixture dựng bằng code trong lượt chạy (khuôn s4-args-not-run.test.mjs). Chiều đỏ chạy trên
// BẢN SAO trọn thư mục feature-loop/ (cpSync), mỗi kim khẳng định khớp ĐÚNG MỘT lần trong nguồn thật.
// Mọi đường dẫn suy từ vị trí tệp này.
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync, readFileSync, existsSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.join(HERE, '..', '..');
const FL = path.join(KIT, 'feature-loop');
let pass = 0, fail = 0;
const ok = m => { console.log(`  PASS: ${m}`); pass += 1; };
const bad = (m, d) => { console.log(`  FAIL: ${m}${d ? ` (${d})` : ''}`); fail += 1; };
const check = (m, c, d) => (c ? ok(m) : bad(m, d));
const git = (cwd, ...a) => execFileSync('git', ['-C', cwd, ...a], { encoding: 'utf8' }).trim();
const soLan = (hay, kim) => hay.split(kim).length - 1;
const TMP = mkdtempSync(path.join(tmpdir(), 's4args-ldcr-'));

const evalYaml = (rows) => 'schema_version: 1\nfeature_slug: demo\nevals:\n' + rows.map(r =>
  `  - id: ${r.id}\n    criterion: AC-1\n    executor: ${r.executor || 'script'}\n    cmd: config:executors.script.cli\n    expected: x\n`
  + (r.lr !== undefined ? `    long_running: ${r.lr}\n` : '') + (r.notRun ? '    status: not-run\n' : '')).join('');

function buildRepo(evalsBody, flExtra = '') {
  const d = path.join(TMP, 'r-' + Math.random().toString(36).slice(2));
  mkdirSync(path.join(d, '_acceptance', 'demo'), { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main', d]);
  git(d, 'config', 'user.email', 't@t.t'); git(d, 'config', 'user.name', 'T');
  writeFileSync(path.join(d, '_acceptance', 'config.yaml'),
    'schema_version: 1\nexecutors:\n  script:\n    cli: "echo x"\nfeature_loop:\n  suite_keys:\n    - executors.script.cli\n' + flExtra);
  writeFileSync(path.join(d, '_acceptance', 'demo', 'contract.md'), '---\nschema_version: 1\nslug: demo\nrisk_tier: T2\nstatus: implemented\n---\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'evals.yaml'), evalsBody);
  writeFileSync(path.join(d, 'README.md'), 'demo\n');
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'round1');
  git(d, 'checkout', '-qb', 'vong-nay');
  writeFileSync(path.join(d, 'src-demo.js'), 'x\n');
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'vat cua vong');
  return d;
}
// → { status, args|null, stderr }; s4Root = thư mục feature-loop/ (thật hoặc bản sao).
function run(d, s4Root = FL) {
  const out = path.join(d, 'args.json');
  try {
    execFileSync(process.execPath, [path.join(s4Root, 'scripts', 's4-args.mjs'), '--slug', 'demo', '--root', d, '--ag-root', KIT, '--out', out, '--diff-base', 'main'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { status: 0, args: JSON.parse(readFileSync(out, 'utf8')), stderr: '' };
  } catch (e) {
    return { status: e.status, args: existsSync(out) ? JSON.parse(readFileSync(out, 'utf8')) : null, stderr: String(e.stderr || '') };
  }
}
// Bản sao trọn feature-loop/ với MỘT phép thay trong một tệp; kim phải khớp đúng một lần.
function banSao(tep, kim, thay) {
  const dst = path.join(TMP, 'fl-' + Math.random().toString(36).slice(2));
  cpSync(FL, dst, { recursive: true });
  const f = path.join(dst, tep);
  const src = readFileSync(f, 'utf8');
  if (soLan(src, kim) !== 1) return { dst: null, kimLoi: `kim khớp ${soLan(src, kim)} lần trong ${tep}` };
  writeFileSync(f, src.replace(kim, thay));
  return { dst };
}

// ═════ SL — long_running (AC-1) ═════════════════════════════════════════════
console.log('SL1 đối chứng dương: 45 → longRunning 45; không khai → không khoá; biên 1 và 240 sinh tệp');
{
  const r = run(buildRepo(evalYaml([{ id: 'E1', lr: 45 }, { id: 'E2' }, { id: 'E3', lr: 1 }, { id: 'E4', lr: 240 }])));
  const by = id => ((r.args && r.args.evals) || []).find(e => e.id === id) || {};
  check('SL1 longRunning mang lên args đúng số, eval không khai không có khoá',
    r.status === 0 && by('E1').longRunning === 45 && !('longRunning' in by('E2')) && by('E3').longRunning === 1 && by('E4').longRunning === 240
      && !((r.args && r.args.evals) || []).some(e => 'long_running' in e),
    `${r.status} ${r.stderr.slice(-200)} ${JSON.stringify(r.args && r.args.evals)}`);
}
const SAI = ['0', '241', '2.5', 'abc', '-3'];
console.log(`SL2 ${SAI.length} giá trị sai viết trước → thoát 2, gọi tên eval và giá trị, không sinh tệp`);
{
  let dung = 0; const lech = [];
  for (const v of SAI) {
    const r = run(buildRepo(evalYaml([{ id: 'E1', lr: v }])));
    if (r.status === 2 && !r.args && r.stderr.includes('E1') && r.stderr.includes(`"${v}"`) && /long_running/.test(r.stderr)) dung += 1;
    else lech.push(`${v}→${r.status}/${r.args ? 'co tep' : 'khong tep'}/${r.stderr.split('\n')[0]}`);
  }
  check(`SL2 ${dung}/${SAI.length} giá trị sai bị chặn có tên`, dung === SAI.length, lech.join(' ; '));
}
const KIM_KIEM = 'if (!/^\\d+$/.test(raw) || Number(raw) < LONG_RUNNING.min || Number(raw) > LONG_RUNNING.max) die(';
console.log('SL3 chiều đỏ: bản sao s4-args gỡ bước kiểm → giá trị 0 lọt');
{
  const { dst, kimLoi } = banSao(path.join('scripts', 's4-args.mjs'), KIM_KIEM, 'if (false) die(');
  if (!dst) bad('SL3 không dựng được bản sao', kimLoi);
  else {
    const r = run(buildRepo(evalYaml([{ id: 'E1', lr: '0' }])), dst);
    const lot = r.status === 0 && !!r.args;
    if (lot) console.log('  (bản sao gỡ kiểm) long_running sai lọt');
    check('SL3 bản sao gỡ kiểm → "long_running sai lọt"', lot, `${r.status} ${r.stderr.split('\n')[0]}`);
  }
}
check('SL4 kim bước kiểm khớp đúng một lần trong nguồn thật', soLan(readFileSync(path.join(FL, 'scripts', 's4-args.mjs'), 'utf8'), KIM_KIEM) === 1);

// ═════ SC — model_evals → evalsChayRieng (AC-5) ═════════════════════════════
const EVALS_SC = evalYaml([{ id: 'E1' }, { id: 'E2' }, { id: 'E3', notRun: true }]);
const KHOA_SC = '  model_evals: [demo/E1, khac/E2, demo/E3]\n';
console.log('SC1 đối chứng dương: [demo/E1, khac/E2, demo/E3], E3 not-run → evalsChayRieng ["E1"]');
{
  const r = run(buildRepo(EVALS_SC, KHOA_SC));
  check('SC1 evalsChayRieng đúng ["E1"]', r.status === 0 && JSON.stringify(r.args.evalsChayRieng) === '["E1"]', `${r.status} ${r.stderr.slice(-200)} ${JSON.stringify(r.args && r.args.evalsChayRieng)}`);
}
console.log('SC2 khoá vắng → evalsChayRieng VẮNG HẲN');
{
  const r = run(buildRepo(EVALS_SC));
  check('SC2 không có khoá evalsChayRieng', r.status === 0 && r.args && !('evalsChayRieng' in r.args), `${r.status} ${JSON.stringify(r.args && Object.keys(r.args))}`);
}
console.log('SC3 mục sai dạng → thoát 2 với thông điệp docKhoa, không sinh tệp');
{
  const r = run(buildRepo(EVALS_SC, '  model_evals: [khong-gach]\n'));
  check('SC3 thoát 2 gọi tên feature_loop.model_evals', r.status === 2 && !r.args && r.stderr.includes('feature_loop.model_evals'), `${r.status} ${r.stderr.split('\n')[0]}`);
}
const KIM_DOC = 'return { repin_retry: retry, model_evals: new Set(model),';
console.log('SC4 chiều đỏ một nguồn: bản sao docKhoa trả model_evals rỗng → evalsChayRieng vắng');
{
  const { dst, kimLoi } = banSao(path.join('scripts', 'lib', 'lan-khoa.mjs'), KIM_DOC, 'return { repin_retry: retry, model_evals: new Set(),');
  if (!dst) bad('SC4 không dựng được bản sao', kimLoi);
  else {
    const r = run(buildRepo(EVALS_SC, KHOA_SC), dst);
    const vang = r.status === 0 && r.args && !('evalsChayRieng' in r.args);
    if (vang) console.log('  (bản sao docKhoa rỗng) không đọc qua docKhoa → evalsChayRieng vắng');
    check('SC4 bản sao docKhoa rỗng lật kết luận ("không đọc qua docKhoa")', vang, `${r.status} ${JSON.stringify(r.args && r.args.evalsChayRieng)}`);
  }
}

rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (s4-args-lenh-dai-chay-rieng)`);
if (fail) process.exit(1);
