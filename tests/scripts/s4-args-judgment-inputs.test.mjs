// s4-args-judgment-inputs.test.mjs — LƯỚI THƯỜNG TRỰC cho gốc đường dẫn `inputs`
// của judgment eval trong `feature-loop/scripts/s4-args.mjs`.
//
// Lỗi đo được 2026-09-05 trên repo tiêu thụ (crm, hồ sơ
// cai-dat-con-lai-noi-tieng-viet): script giải `inputs` theo THƯ MỤC HỒ SƠ
// `_acceptance/<slug>/` trong khi mọi đường dẫn khác của evals.yaml (`paths`)
// và evals do skill sinh ra viết theo GỐC KHO. Kết quả: args sinh xong, exit 0,
// sáu đường dẫn trỏ vào file không tồn tại, hội đồng đọc file rỗng.
//
// Luật sau sửa: MỘT gốc = gốc kho (cùng gốc với `paths`); input vắng trên đĩa
// → exit 2 gọi tên file, KHÔNG sinh tệp — đúng nếp fail-closed của các trường
// khác trong cùng script. Fixture do CODE SINH trong chính lần chạy.
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync, existsSync, readFileSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.join(HERE, '..', '..');
const S4ARGS = path.join(KIT, 'feature-loop', 'scripts', 's4-args.mjs');
let pass = 0, fail = 0;
const ok0 = (cond, m, d) => { if (cond) { console.log(`  PASS: ${m}`); pass += 1; } else { console.log(`  FAIL: ${m}${d ? ` (${d})` : ''}`); fail += 1; } };
const git = (cwd, ...a) => execFileSync('git', ['-C', cwd, ...a], { encoding: 'utf8' }).trim();

const TMP = mkdtempSync(path.join(tmpdir(), 's4args-ji-'));
function buildRepo(inputs) {
  const d = path.join(TMP, `r-${Math.random().toString(36).slice(2)}`);
  mkdirSync(path.join(d, '_acceptance', 'demo'), { recursive: true });
  mkdirSync(path.join(d, 'src'), { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main', d]);
  git(d, 'config', 'user.email', 't@t.t'); git(d, 'config', 'user.name', 'T');
  writeFileSync(path.join(d, '_acceptance', 'config.yaml'),
    'schema_version: 1\nexecutors:\n  test:\n    api: "echo x"\nfeature_loop:\n  suite_keys:\n    - executors.test.api\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'contract.md'),
    '---\nschema_version: 1\nslug: demo\nrisk_tier: T2\nstatus: implemented\n---\n');
  writeFileSync(path.join(d, 'src', 'a.ts'), 'export const a = 1;\n');
  writeFileSync(path.join(d, 'CONTEXT.md'), '# từ điển\n');
  writeEvals(d, inputs);
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'base');
  git(d, 'checkout', '-q', '-b', 'feat/x');
  writeFileSync(path.join(d, 'src', 'a.ts'), 'export const a = 2;\n');
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'work');
  return d;
}
function writeEvals(d, inputs) {
  const list = inputs.map(p => `      - ${p}`).join('\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'evals.yaml'),
    'schema_version: 1\nfeature_slug: demo\nevals:\n' +
    '  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: config:executors.test.api\n    expected: x\n' +
    `  - id: E2\n    criterion: AC-2\n    executor: judgment\n    question: "chữ trên màn đúng từ điển?"\n    inputs:\n${list}\n    expected: PASS\n`);
}
function runArgs(repo) {
  const out = path.join(TMP, `args-${Math.random().toString(36).slice(2)}.json`);
  try {
    const stdout = execFileSync(process.execPath, [S4ARGS, '--slug', 'demo', '--root', repo, '--ag-root', KIT, '--no-carry', '--out', out],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { code: 0, text: stdout, out, wrote: existsSync(out) };
  } catch (e) {
    return { code: e.status, text: `${e.stdout || ''}${e.stderr || ''}`, out, wrote: existsSync(out) };
  }
}
const inputsOf = (r) => JSON.parse(readFileSync(r.out, 'utf8')).evals.find(e => e.id === 'E2').inputs;

console.log('JI1 inputs theo GỐC KHO, file có thật → giữ, giải thành abs path từ gốc kho (không phải từ thư mục hồ sơ)');
{
  const repo = buildRepo(['src/a.ts', 'CONTEXT.md']);
  const r = runArgs(repo);
  const root = realpathSync(repo);
  const want = [path.join(root, 'src', 'a.ts'), path.join(root, 'CONTEXT.md')];
  const got = r.wrote ? inputsOf(r) : null;
  ok0(r.code === 0 && r.wrote, 'JI1 exit 0, sinh tệp', `code=${r.code} wrote=${r.wrote} ${r.text.split('\n').slice(-2).join(' | ')}`);
  ok0(JSON.stringify(got) === JSON.stringify(want), 'JI1 inputs = abs path tính từ gốc kho', `got=${JSON.stringify(got)} want=${JSON.stringify(want)}`);
  ok0(!!got && got.every(p => existsSync(p)), 'JI1 mọi input trong args tồn tại trên đĩa', JSON.stringify(got));
}

console.log('JI2 input KHÔNG tồn tại trên đĩa → exit 2 gọi tên file + eval, KHÔNG sinh tệp; đối chứng dương cùng fixture');
{
  const repo = buildRepo(['src/a.ts', 'src/khong-co.ts']);
  const r = runArgs(repo);
  ok0(r.code === 2, 'JI2 exit 2', `code=${r.code}`);
  ok0(/src\/khong-co\.ts/.test(r.text) && /E2/.test(r.text) && /không tồn tại/.test(r.text), 'JI2 thông điệp nêu tên file thiếu + eval id', r.text.trim().split('\n').pop());
  ok0(!r.wrote, 'JI2 KHÔNG sinh tệp args', `wrote=${r.wrote}`);
  writeFileSync(path.join(repo, 'src', 'khong-co.ts'), 'export {};\n');
  const r2 = runArgs(repo);
  ok0(r2.code === 0 && r2.wrote, 'JI2 đối chứng dương: tạo file → sinh args', `code=${r2.code} ${r2.text.trim().split('\n').pop()}`);
}

console.log('JI3 đường dẫn kiểu cũ theo thư mục hồ sơ (../../x, contract.md) → exit 2 và gợi ý đúng dạng gốc kho');
{
  const repo = buildRepo(['../../src/a.ts', 'contract.md']);
  const r = runArgs(repo);
  ok0(r.code === 2 && !r.wrote, 'JI3 exit 2, không sinh tệp', `code=${r.code} wrote=${r.wrote}`);
  ok0(/\.\.\/\.\.\/src\/a\.ts/.test(r.text) && /«src\/a\.ts»/.test(r.text), 'JI3 gợi ý viết lại «src/a.ts» cho ../../src/a.ts', r.text.trim().split('\n').pop());
  writeEvals(repo, ['contract.md']);
  const r3 = runArgs(repo);
  ok0(r3.code === 2 && /«_acceptance\/demo\/contract\.md»/.test(r3.text), 'JI3 gợi ý viết lại «_acceptance/demo/contract.md» cho contract.md', r3.text.trim().split('\n').pop());
  writeEvals(repo, ['src/a.ts', '_acceptance/demo/contract.md']);
  const r4 = runArgs(repo);
  ok0(r4.code === 0 && r4.wrote, 'JI3 đối chứng dương: viết lại theo gốc kho → sinh args', `code=${r4.code}`);
}

console.log('JI4 abs path: có thật → giữ nguyên; không có → exit 2 có tên');
{
  const repo = buildRepo(['src/a.ts']);
  const absOk = path.join(realpathSync(repo), 'CONTEXT.md');
  writeEvals(repo, [absOk]);
  const r = runArgs(repo);
  ok0(r.code === 0 && r.wrote && JSON.stringify(inputsOf(r)) === JSON.stringify([absOk]), 'JI4 abs path có thật giữ nguyên', `code=${r.code}`);
  const absBad = path.join(realpathSync(repo), 'khong', 'co.md');
  writeEvals(repo, [absBad]);
  const r2 = runArgs(repo);
  ok0(r2.code === 2 && !r2.wrote && r2.text.includes(absBad), 'JI4 abs path không có → exit 2 nêu tên, không sinh tệp', `code=${r2.code} wrote=${r2.wrote}`);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
