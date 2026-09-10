// s4-args-expected-exit.test.mjs — Task 5 phía SINH ARGS: `evals.yaml` khai
// `expected_exit` (lib/eval-yaml.cjs::expectedExits) phải chảy vào tệp args
// dưới tên ĐÃ ĐỔI DẠNG `expectedExit` trên từng phần tử `evals[]` — workflow
// (acceptance-verify.js) chạy không có filesystem nên không tự đọc evals.yaml
// được; s4-args.mjs là nơi RÚT kỳ vọng DUY NHẤT. Vắng trường và khai 0 tường
// minh đi CÙNG một đường (mặc định 0). Khai sai luật (mã hạ tầng cấm, số
// không hợp lệ...) → fail-CLOSED: exit khác 0, KHÔNG sinh tệp, thông điệp nêu
// tên eval — không đoán.
//
// SA-EE4 là ràng buộc TĨNH: chuỗi "expected_exit" (dạng snake_case của
// lib/eval-yaml.cjs) không được rò vào bất kỳ bộ đọc nào khác — đó là cách kit
// chứng "không bộ đọc nào tự đọc trường", tên đã đổi dạng thành `expectedExit`
// ở mọi nơi khác.
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.join(HERE, '..', '..');
const S4ARGS = path.join(KIT, 'feature-loop', 'scripts', 's4-args.mjs');
let pass = 0, fail = 0;
const ok = m => { console.log(`  PASS: ${m}`); pass += 1; };
const bad = (m, d) => { console.log(`  FAIL: ${m}${d ? ` (${d})` : ''}`); fail += 1; };
const git = (cwd, ...a) => execFileSync('git', ['-C', cwd, ...a], { encoding: 'utf8' }).trim();

const TMP = mkdtempSync(path.join(tmpdir(), 's4args-ee-'));

// buildRepo(evalsYamlBody): fixture do CODE SINH trong chính lần chạy (không
// văn bản viết tay ngoài test) — round 1 nên không cần run-log/carry-anchor.
function buildRepo(evalsYamlBody) {
  const d = path.join(TMP, 'r-' + Math.random().toString(36).slice(2));
  mkdirSync(path.join(d, '_acceptance', 'demo'), { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main', d]);
  git(d, 'config', 'user.email', 't@t.t'); git(d, 'config', 'user.name', 'T');
  writeFileSync(path.join(d, '_acceptance', 'config.yaml'),
    'schema_version: 1\nexecutors:\n  script:\n    cli: "echo x"\nfeature_loop:\n  suite_keys:\n    - executors.script.cli\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'contract.md'),
    '---\nschema_version: 1\nslug: demo\nrisk_tier: T2\nstatus: implemented\n---\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'evals.yaml'), evalsYamlBody);
  writeFileSync(path.join(d, 'README.md'), 'demo\n');
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'round1');
  return d;
}

const run = (d, ...extra) => {
  const out = path.join(d, 'args.json');
  // --ag-root KIT: cây kit NÀY đóng vai bản cài (xem s4-args-delta.test.mjs) —
  // không có nó, s4-args đi tìm plugin cài trên máy tác giả, xanh cục bộ ĐỎ ở CI.
  const stdout = execFileSync(process.execPath, [S4ARGS, '--slug', 'demo', '--root', d, '--ag-root', KIT, '--out', out, '--diff-base', 'main', ...extra],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  return { out: JSON.parse(readFileSync(out, 'utf8')), stdout, outPath: out };
};

// SA-EE1 — evals.yaml khai expected_exit: 2 → tệp args có evals[i].expectedExit === 2
{
  const d = buildRepo(
    'schema_version: 1\nfeature_slug: demo\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.cli\n    expected: gioi han da khai\n    expected_exit: 2\n'
  );
  try {
    const { out } = run(d);
    const e1 = (out.evals || []).find(e => e.id === 'E1');
    if (!e1) bad('SA-EE1 khong thay eval E1 trong args', JSON.stringify(out.evals));
    else if (e1.expectedExit !== 2) bad('SA-EE1 expectedExit sai', JSON.stringify(e1));
    else ok('SA-EE1 evals.yaml khai expected_exit: 2 -> args evals[].expectedExit === 2');
  } catch (e) { bad('SA-EE1 s4-args loi', String(e.stderr || e.message).split('\n').slice(-3).join(' | ')); }
}

// SA-EE2 — vắng trường → expectedExit === 0 (đối chứng dương của SA-EE1)
{
  const d = buildRepo(
    'schema_version: 1\nfeature_slug: demo\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.cli\n    expected: binh thuong\n'
  );
  try {
    const { out } = run(d);
    const e1 = (out.evals || []).find(e => e.id === 'E1');
    if (!e1) bad('SA-EE2 khong thay eval E1 trong args', JSON.stringify(out.evals));
    else if (e1.expectedExit !== 0) bad('SA-EE2 vang truong phai mac dinh 0', JSON.stringify(e1));
    else ok('SA-EE2 vang truong expected_exit -> args evals[].expectedExit === 0');
  } catch (e) { bad('SA-EE2 s4-args loi', String(e.stderr || e.message).split('\n').slice(-3).join(' | ')); }
}

// SA-EE3 — khai sai luật (mã hạ tầng cấm 127) → script exit KHÁC 0, KHÔNG sinh
// tệp, thông điệp nêu tên eval (fail-CLOSED, không đoán).
{
  const d = buildRepo(
    'schema_version: 1\nfeature_slug: demo\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.cli\n    expected: sai luat\n    expected_exit: 127\n'
  );
  const outPath = path.join(d, 'args.json');
  try {
    run(d);
    bad('SA-EE3 s4-args phai exit khac 0 khi expected_exit la ma ha tang cam', 'exit 0 — sinh tep nham');
  } catch (e) {
    const status = typeof e.status === 'number' ? e.status : null;
    const stderr = String(e.stderr || '');
    const fileGenerated = existsSync(outPath);
    if (status === 0 || status === null) bad('SA-EE3 khong bat duoc exit code loi', String(e.message || '').split('\n')[0]);
    else if (fileGenerated) bad('SA-EE3 sinh tep du sai luat', outPath);
    else if (!stderr.includes('E1')) bad('SA-EE3 thong diep khong neu ten eval', stderr.split('\n').slice(-3).join(' | '));
    else if (!/127/.test(stderr)) bad('SA-EE3 thong diep khong neu ma bi cam', stderr.split('\n').slice(-3).join(' | '));
    else ok(`SA-EE3 expected_exit 127 (ma ha tang) -> exit ${status}, khong sinh tep, thong diep neu ten eval + ma`);
  }
}

// SA-EE4 — ràng buộc tĩnh: chuỗi "expected_exit" (dạng snake_case của
// lib/eval-yaml.cjs) khớp ĐÚNG 0 lần trong 4 bộ đọc dưới đây — mọi nơi khác
// PHẢI dùng tên đã đổi dạng `expectedExit`.
{
  const files = [
    path.join(KIT, 'feature-loop', 'scripts', 's4-args.mjs'),
    path.join(KIT, 'feature-loop', 'workflows', 'acceptance-verify.js'),
    path.join(KIT, 'feature-loop', 'scripts', 'repin-lane.mjs'),
    path.join(KIT, 'lib', 'evidence-core.cjs'),
  ];
  const hits = [];
  for (const f of files) {
    if (!existsSync(f)) { bad('SA-EE4 file khong ton tai', f); continue; }
    const src = readFileSync(f, 'utf8');
    const n = (src.match(/expected_exit/g) || []).length;
    if (n > 0) hits.push(`${path.relative(KIT, f)}: ${n}`);
  }
  if (hits.length) bad('SA-EE4 chuoi "expected_exit" ro vao bo doc khong duoc phep', hits.join(' ; '));
  else ok('SA-EE4 "expected_exit" khop DUNG 0 lan trong s4-args.mjs / acceptance-verify.js / repin-lane.mjs / evidence-core.cjs');
}

rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (s4-args-expected-exit)`);
process.exit(fail ? 1 : 0);
