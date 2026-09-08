// s4-args-delta.test.mjs — K8 phía SINH ARGS (AC-10): `deltaFiles` phải có mặt trong tệp
// args khi round ≥2 khai `--carry-anchor`, để làn review «conventions» của workflow biết
// file CHỮ nào đã đổi so round trước. Không anchor (round 1 / --no-carry) → không khoá.
// Fixture git do CODE SINH trong chính lần chạy; đường dẫn suy từ vị trí file.
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.join(HERE, '..', '..');
const S4ARGS = path.join(KIT, 'feature-loop', 'scripts', 's4-args.mjs');
let pass = 0, fail = 0;
const ok = m => { console.log(`  PASS: ${m}`); pass += 1; };
const bad = (m, d) => { console.log(`  FAIL: ${m}${d ? ` (${d})` : ''}`); fail += 1; };
const git = (cwd, ...a) => execFileSync('git', ['-C', cwd, ...a], { encoding: 'utf8' }).trim();

const TMP = mkdtempSync(path.join(tmpdir(), 's4args-delta-'));
function buildRepo() {
  const d = path.join(TMP, 'r-' + Math.random().toString(36).slice(2));
  mkdirSync(path.join(d, '_acceptance', 'demo'), { recursive: true });
  mkdirSync(path.join(d, 'docs'), { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main', d]);
  git(d, 'config', 'user.email', 't@t.t'); git(d, 'config', 'user.name', 'T');
  writeFileSync(path.join(d, '_acceptance', 'config.yaml'),
    'schema_version: 1\nexecutors:\n  test:\n    api: "echo x"\nfeature_loop:\n  suite_keys:\n    - executors.test.api\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'contract.md'),
    '---\nschema_version: 1\nslug: demo\nrisk_tier: T2\nstatus: implemented\n---\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'evals.yaml'),
    'schema_version: 1\nfeature_slug: demo\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: config:executors.test.api\n    paths: [src/**]\n    expected: x\n');
  // round 1 đã có báo cáo → s4-args tính round = 2 (đường round ≥2 mới đòi carry)
  writeFileSync(path.join(d, '_acceptance', 'demo', 'evidence-report.md'),
    '---\nschema_version: 1\nfeature_slug: demo\nverdict: REJECT\n---\n\n## Iterations\n\nRound 1: REJECT.\n');
  // carry-plan đọc run-log của round trước — fixture phải có, không thì lỗi hạ tầng
  // (ENOENT) trông y hệt lỗi vật.
  writeFileSync(path.join(d, '_acceptance', 'demo', 'run-log.jsonl'),
    '{"ts":"2026-09-01T00:00:00Z","kind":"eval","round":1,"eval_id":"E1","run_id":"demo-E1-001","exit_code":0,"sha":"0000000000000000000000000000000000000000"}\n');
  mkdirSync(path.join(d, 'src'), { recursive: true });
  writeFileSync(path.join(d, 'src', 'a.js'), 'a\n');
  writeFileSync(path.join(d, 'docs', 'note.md'), 'ghi chu\n');
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'round1');
  const anchor = git(d, 'rev-parse', 'HEAD');
  writeFileSync(path.join(d, 'docs', 'note.md'), 'ghi chu\nda sua\n');
  writeFileSync(path.join(d, 'src', 'a.js'), 'a\nb\n');
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'fix round2');
  return { d, anchor };
}

const run = (d, ...extra) => {
  const out = path.join(d, 'args.json');
  const r = execFileSync(process.execPath, [S4ARGS, '--slug', 'demo', '--root', d, '--out', out, '--diff-base', 'main', ...extra],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  return { out: JSON.parse(readFileSync(out, 'utf8')), stdout: r };
};

// SD1 — có --carry-anchor → args mang deltaFiles đúng danh sách (bỏ _acceptance/)
{
  const { d, anchor } = buildRepo();
  try {
    const { out } = run(d, '--carry-anchor', anchor);
    const df = out.deltaFiles;
    if (!Array.isArray(df)) bad('SD1 args thiếu khoá deltaFiles khi có --carry-anchor', JSON.stringify(Object.keys(out)));
    else if (JSON.stringify([...df].sort()) !== JSON.stringify(['docs/note.md', 'src/a.js'])) bad('SD1 deltaFiles sai', JSON.stringify(df));
    else ok('SD1 --carry-anchor → deltaFiles = đúng file đã đổi (ngoài _acceptance/)');
  } catch (e) { bad('SD1 s4-args lỗi', String(e.stderr || e.message).split('\n').filter(l => l && !/does not appear to be a git repository/.test(l)).slice(-2).join(' | ')); }
}

// SD2 — đối chứng âm: --no-carry (round ≥2 khai không carry) → KHÔNG có khoá
{
  const { d } = buildRepo();
  try {
    const { out } = run(d, '--no-carry');
    if ('deltaFiles' in out) bad('SD2 không carry mà vẫn có deltaFiles', JSON.stringify(out.deltaFiles));
    else ok('SD2 --no-carry → không khoá deltaFiles (làn conventions đọc trọn diff như cũ)');
  } catch (e) { bad('SD2 s4-args lỗi', String(e.stderr || e.message).split('\n')[0]); }
}

rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (s4-args-delta)`);
process.exit(fail ? 1 : 0);
