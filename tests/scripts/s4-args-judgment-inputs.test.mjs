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
import { execFileSync, spawnSync } from 'node:child_process';
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
  const r = spawnSync(process.execPath, [S4ARGS, '--slug', 'demo', '--root', repo, '--ag-root', KIT, '--no-carry', '--out', out],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  return { code: r.status, text: `${r.stdout || ''}${r.stderr || ''}`, out, wrote: existsSync(out) };
}
const inputsOf = (r) => JSON.parse(readFileSync(r.out, 'utf8')).evals.find(e => e.id === 'E2').inputs;
// `--only <nhóm>`: răng hồ sơ chạy từng nhóm riêng trên cây thật và trên bản sao
// đã tiêm đột biến. 0 nhóm khớp là lỗi có tên — không có màu xanh rỗng.
const ONLY = (() => { const i = process.argv.indexOf('--only'); return i >= 0 ? process.argv[i + 1] : null; })();
let groupsRun = 0;
function group(name, title, fn) {
  if (ONLY && ONLY !== name) return;
  groupsRun += 1; console.log(`${name} ${title}`); fn();
}
const goiY = (text) => [...text.matchAll(/«([^»]+)»/g)].map(m => m[1]);

group('JI1', 'inputs theo GỐC KHO, file có thật → giữ, giải thành abs path từ gốc kho (không phải từ thư mục hồ sơ)', () => {
  const repo = buildRepo(['src/a.ts', 'CONTEXT.md']);
  const r = runArgs(repo);
  const root = realpathSync(repo);
  const want = [path.join(root, 'src', 'a.ts'), path.join(root, 'CONTEXT.md')];
  const got = r.wrote ? inputsOf(r) : null;
  ok0(r.code === 0 && r.wrote, 'JI1 exit 0, sinh tệp', `code=${r.code} wrote=${r.wrote} ${r.text.split('\n').slice(-2).join(' | ')}`);
  ok0(JSON.stringify(got) === JSON.stringify(want), 'JI1 inputs = abs path tính từ gốc kho', `got=${JSON.stringify(got)} want=${JSON.stringify(want)}`);
  ok0(!!got && got.every(p => existsSync(p)), 'JI1 mọi input trong args tồn tại trên đĩa', JSON.stringify(got));
});

group('JI2', 'input KHÔNG tồn tại trên đĩa → exit 2 gọi tên file + eval, KHÔNG sinh tệp; đối chứng dương cùng fixture', () => {
  const repo = buildRepo(['src/a.ts', 'src/khong-co.ts']);
  const r = runArgs(repo);
  ok0(r.code === 2, 'JI2 exit 2', `code=${r.code}`);
  ok0(/không tồn tại trên đĩa: src\/khong-co\.ts \(/.test(r.text) && /eval E2 /.test(r.text), 'JI2 thông điệp nêu đường dẫn NGUYÊN VĂN (có ranh giới) + eval id', r.text.trim().split('\n').pop());
  ok0(!r.wrote, 'JI2 KHÔNG sinh tệp args', `wrote=${r.wrote}`);
  writeFileSync(path.join(repo, 'src', 'khong-co.ts'), 'export {};\n');
  const r2 = runArgs(repo);
  ok0(r2.code === 0 && r2.wrote, 'JI2 đối chứng dương: tạo file → sinh args', `code=${r2.code} ${r2.text.trim().split('\n').pop()}`);
});

group('JI3', 'đường dẫn kiểu cũ theo thư mục hồ sơ (../../x, contract.md) → exit 2 và gợi ý đúng dạng gốc kho', () => {
  const repo = buildRepo(['../../src/a.ts', 'contract.md']);
  const root = realpathSync(repo); const ws = path.join(root, '_acceptance', 'demo');
  const r = runArgs(repo);
  ok0(r.code === 2 && !r.wrote, 'JI3 exit 2, không sinh tệp', `code=${r.code} wrote=${r.wrote}`);
  const want1 = path.relative(root, path.resolve(ws, '../../src/a.ts'));
  const g1 = goiY(r.text);
  ok0(/\.\.\/\.\.\/src\/a\.ts/.test(r.text) && g1.length === 1 && g1[0] === want1 && want1 === 'src/a.ts', 'JI3 gợi ý viết lại «src/a.ts» cho ../../src/a.ts (BẰNG path.relative)', `got=${JSON.stringify(g1)} want=${want1}`);
  writeEvals(repo, ['contract.md']);
  const r3 = runArgs(repo);
  const want3 = path.relative(root, path.resolve(ws, 'contract.md'));
  const g3 = goiY(r3.text);
  ok0(r3.code === 2 && g3.length === 1 && g3[0] === want3 && want3 === '_acceptance/demo/contract.md', 'JI3 gợi ý viết lại «_acceptance/demo/contract.md» cho contract.md (BẰNG path.relative)', `got=${JSON.stringify(g3)} want=${want3}`);
  writeEvals(repo, [...g1, ...g3]);
  const r4 = runArgs(repo);
  ok0(g1.length + g3.length === 2 && r4.code === 0 && r4.wrote, 'JI3 đối chứng dương ROUND-TRIP: viết lại bằng đúng chuỗi rút từ stderr → sinh args', `code=${r4.code} inputs=${JSON.stringify([...g1, ...g3])}`);
});

group('JI4', 'abs path: có thật → giữ nguyên; không có → exit 2 có tên', () => {
  const repo = buildRepo(['src/a.ts']);
  const absOk = path.join(realpathSync(repo), 'CONTEXT.md');
  writeEvals(repo, [absOk]);
  const r = runArgs(repo);
  ok0(r.code === 0 && r.wrote && JSON.stringify(inputsOf(r)) === JSON.stringify([absOk]), 'JI4 abs path có thật giữ nguyên', `code=${r.code}`);
  const absBad = path.join(realpathSync(repo), 'khong', 'co.md');
  writeEvals(repo, [absBad]);
  const r2 = runArgs(repo);
  ok0(r2.code === 2 && !r2.wrote && r2.text.includes(absBad), 'JI4 abs path không có → exit 2 nêu tên, không sinh tệp', `code=${r2.code} wrote=${r2.wrote}`);
});

group('JI5', 'bằng chứng của CHÍNH hồ sơ (_acceptance/<slug>/evidence/…) chưa có → vẫn sinh args + một dòng khai; hồ sơ khác vắng → exit 2', () => {
  const repo = buildRepo(['src/a.ts', '_acceptance/demo/evidence/E3-step3.png']);
  const root = realpathSync(repo);
  const r = runArgs(repo);
  const want = [path.join(root, 'src', 'a.ts'), path.join(root, '_acceptance', 'demo', 'evidence', 'E3-step3.png')];
  const got = r.wrote ? inputsOf(r) : null;
  const khai = (r.text.match(/^s4-args: eval E2: input _acceptance\/demo\/evidence\/E3-step3\.png chưa có/mg) || []).length;
  ok0(r.code === 0 && r.wrote && JSON.stringify(got) === JSON.stringify(want), 'JI5 bằng chứng cùng hồ sơ chưa có → vẫn sinh args, abs từ gốc kho', `code=${r.code} got=${JSON.stringify(got)} | ${r.text.trim().split('\n').pop()}`);
  ok0(khai === 1, 'JI5 stderr có ĐÚNG MỘT dòng khai input chưa có', `đếm=${khai}`);
  writeEvals(repo, ['_acceptance/khac/evidence/x.png']);
  const r2 = runArgs(repo);
  ok0(r2.code === 2 && !r2.wrote && /không tồn tại trên đĩa: _acceptance\/khac\/evidence\/x\.png \(/.test(r2.text), 'JI5 evidence của hồ sơ KHÁC vắng → exit 2, không sinh tệp', `code=${r2.code} ${r2.text.trim().split('\n').pop()}`);
  mkdirSync(path.join(repo, '_acceptance', 'demo', 'evidence'), { recursive: true });
  writeFileSync(path.join(repo, '_acceptance', 'demo', 'evidence', 'E3-step3.png'), 'png');
  writeEvals(repo, ['_acceptance/demo/evidence/E3-step3.png']);
  const r3 = runArgs(repo);
  ok0(r3.code === 0 && r3.wrote && !/chưa có/.test(r3.text), 'JI5 đối chứng dương: file evidence CÓ thật → sinh args, không dòng khai', `code=${r3.code}`);
});

group('JI6', 'input trỏ THƯ MỤC → exit 2 «là thư mục, không phải file»; trỏ file trong đó → exit 0', () => {
  const repo = buildRepo(['src']);
  const r = runArgs(repo);
  ok0(r.code === 2 && !r.wrote, 'JI6 thư mục → exit 2, không sinh tệp', `code=${r.code} wrote=${r.wrote}`);
  ok0(/eval E2 /.test(r.text) && /là thư mục, không phải file: src \(/.test(r.text), 'JI6 thông điệp nêu eval + đường dẫn nguyên văn + «là thư mục, không phải file»', r.text.trim().split('\n').pop());
  writeEvals(repo, ['src/a.ts']);
  const r2 = runArgs(repo);
  ok0(r2.code === 0 && r2.wrote, 'JI6 đối chứng dương: trỏ file trong thư mục → sinh args', `code=${r2.code}`);
});

if (ONLY && groupsRun === 0) { console.log(`  FAIL: --only ${ONLY} không khớp nhóm nào (JI1|JI2|JI3|JI4|JI5|JI6)`); fail += 1; }
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
