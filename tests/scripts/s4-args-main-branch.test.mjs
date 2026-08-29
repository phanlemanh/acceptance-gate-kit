// s4-args-main-branch.test.mjs — LƯỚI THƯỜNG TRỰC cho phép dò nhánh chính của
// `feature-loop/scripts/s4-args.mjs` (hồ sơ nhanh-chinh-khong-ten-main, AC-7/AC-8/AC-9).
//
// Vì sao ở đây chứ không chỉ trong bộ răng hồ sơ: ADR 0011 — thứ gì phải đúng
// SAU MERGE thì không được nằm trong răng hồ sơ, vì răng chết theo hồ sơ. Mã
// này là engine phát hành cho repo tiêu thụ; hai hồi quy đã đóng (clone
// single-branch chết sai thông điệp · remote khai/hỏng mà máy đoán bừa sang tên
// khác → mốc so sánh sai, exit 0) cần lưới sống lâu hơn hồ sơ.
//
// Fixture do CODE SINH trong chính lần chạy; đường dẫn suy từ vị trí file.
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.join(HERE, '..', '..');
const S4ARGS = path.join(KIT, 'feature-loop', 'scripts', 's4-args.mjs');
let pass = 0, fail = 0;
const ok = (m) => { console.log(`  PASS: ${m}`); pass += 1; };
const bad = (m, d) => { console.log(`  FAIL: ${m}${d ? ` (${d})` : ''}`); fail += 1; };
const git = (cwd, ...a) => execFileSync('git', ['-C', cwd, ...a], { encoding: 'utf8' }).trim();

const TMP = mkdtempSync(path.join(tmpdir(), 's4args-mb-'));
function buildRepo(branch) {
  const d = path.join(TMP, `r-${branch}-${Math.random().toString(36).slice(2)}`);
  mkdirSync(path.join(d, '_acceptance', 'demo'), { recursive: true });
  execFileSync('git', ['init', '-q', '-b', branch, d]);
  git(d, 'config', 'user.email', 't@t.t'); git(d, 'config', 'user.name', 'T');
  writeFileSync(path.join(d, '_acceptance', 'config.yaml'),
    'schema_version: 1\nexecutors:\n  test:\n    api: "echo x"\nfeature_loop:\n  suite_keys:\n    - executors.test.api\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'contract.md'),
    '---\nschema_version: 1\nslug: demo\nrisk_tier: T2\nstatus: implemented\n---\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'evals.yaml'),
    'schema_version: 1\nfeature_slug: demo\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: config:executors.test.api\n    expected: x\n');
  writeFileSync(path.join(d, 'f.txt'), 'a\n');
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'base');
  git(d, 'checkout', '-q', '-b', 'feat/x');
  writeFileSync(path.join(d, 'f.txt'), 'a\nb\n');
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'work');
  return d;
}
function runArgs(repo, extra = []) {
  const out = path.join(TMP, `args-${Math.random().toString(36).slice(2)}.json`);
  try {
    const stdout = execFileSync(process.execPath, [S4ARGS, '--slug', 'demo', '--root', repo, '--ag-root', KIT, '--no-carry', '--out', out, ...extra],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { code: 0, text: stdout, out, wrote: existsSync(out) };
  } catch (e) {
    return { code: e.status, text: `${e.stdout || ''}${e.stderr || ''}`, out, wrote: existsSync(out) };
  }
}

console.log('SA1 nhánh chính không tên main, không remote → dò được, mốc = merge-base');
{
  const repo = buildRepo('master');
  const r = runArgs(repo);
  const want = git(repo, 'merge-base', 'master', 'HEAD');
  const got = r.wrote ? JSON.parse(execFileSync('cat', [r.out], { encoding: 'utf8' })).diffBase : null;
  ok0(r.code === 0 && got === want && got !== git(repo, 'rev-parse', 'HEAD'),
    'SA1 mốc BẰNG merge-base độc lập, khác HEAD', `code=${r.code} got=${got} want=${want}`);
}

console.log('SA2 remote KHAI tên mà cây không giải được → KHÔNG đoán sang tên khác');
{
  const repo = buildRepo('master');
  const bare = path.join(TMP, 'bare-a.git');
  execFileSync('git', ['init', '-q', '--bare', '-b', 'main', bare]);
  git(repo, 'branch', '-f', 'main', 'master');
  git(repo, 'remote', 'add', 'origin', bare);
  git(repo, 'push', '-q', 'origin', 'main', 'master', 'feat/x');
  git(repo, 'remote', 'set-head', 'origin', 'main');
  git(repo, 'branch', '-D', 'main');
  git(repo, 'update-ref', '-d', 'refs/remotes/origin/main');
  const r = runArgs(repo);
  ok0(r.code !== 0 && /remote khai nhánh chính/.test(r.text) && /--diff-base/.test(r.text) && !r.wrote,
    'SA2 kêu to nêu tên remote khai, không sinh tệp', `code=${r.code} wrote=${r.wrote}`);
  // đối chứng dương CÙNG fixture: trả ref về → chạy được
  git(repo, 'branch', 'main', 'master');
  const r2 = runArgs(repo);
  ok0(r2.code === 0 && r2.wrote, 'SA2 đối chứng dương: trả ref main về → sinh args', `code=${r2.code}`);
}

console.log('SA3 ref local vắng nhưng origin/<tên> còn → giải qua ref remote (hình dạng CI)');
{
  const repo = buildRepo('master');
  const bare = path.join(TMP, 'bare-b.git');
  execFileSync('git', ['init', '-q', '--bare', '-b', 'master', bare]);
  git(repo, 'remote', 'add', 'origin', bare);
  git(repo, 'push', '-q', 'origin', 'master', 'feat/x');
  const clone = path.join(TMP, 'ci-clone');
  execFileSync('git', ['clone', '-q', bare, clone]);
  execFileSync('cp', ['-R', path.join(repo, '_acceptance'), path.join(clone, '_acceptance')]);
  git(clone, 'checkout', '-q', 'feat/x');
  git(clone, 'branch', '-D', 'master');
  const r = runArgs(clone);
  const want = git(clone, 'merge-base', 'origin/master', 'HEAD');
  const got = r.wrote ? JSON.parse(execFileSync('cat', [r.out], { encoding: 'utf8' })).diffBase : null;
  ok0(r.code === 0 && got === want, 'SA3 giải qua origin/<tên>, mốc BẰNG merge-base độc lập', `code=${r.code} got=${got} want=${want}`);
}

console.log('SA4 có origin nhưng KHÔNG hỏi được → fail-closed, không đoán (S4-r5)');
{
  const repo = buildRepo('phat-trien');
  git(repo, 'branch', 'master', 'HEAD~1');           // tên quen còn sống làm mồi
  git(repo, 'remote', 'add', 'origin', 'https://192.0.2.1/nope.git');
  const t0 = Date.now();
  const r = runArgs(repo);
  const secs = (Date.now() - t0) / 1000;
  ok0(r.code !== 0 && /KHÔNG hỏi được nó/.test(r.text) && !r.wrote,
    'SA4 remote không với được → kêu to, không sinh tệp', `code=${r.code} text=${r.text.slice(0, 80)}`);
  ok0(!/giải bằng fallback/.test(r.text), 'SA4 KHÔNG rơi về đoán tên quen');
  ok0(secs < 40, 'SA4 về trong trần thời gian, không treo', `${secs.toFixed(1)}s`);
}

function ok0(cond, msg, detail) { cond ? ok(msg) : bad(msg, detail); }

rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (s4-args-main-branch)`);
process.exit(fail === 0 ? 0 : 1);
