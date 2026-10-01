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
import { createRequire } from 'node:module';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync, existsSync, readFileSync, realpathSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.join(HERE, '..', '..');
const S4ARGS = path.join(KIT, 'feature-loop', 'scripts', 's4-args.mjs');
let pass = 0, fail = 0;
const ok0 = (cond, m, d) => { if (cond) { console.log(`  PASS: ${m}`); pass += 1; } else { console.log(`  FAIL: ${m}${d ? ` (${d})` : ''}`); fail += 1; } };
const git = (cwd, ...a) => execFileSync('git', ['-C', cwd, ...a], { encoding: 'utf8' }).trim();

const TMP = mkdtempSync(path.join(tmpdir(), 's4args-ji-'));
function buildRepo(inputs, dir) {
  const d = dir || path.join(TMP, `r-${Math.random().toString(36).slice(2)}`);
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
function runArgs(repo, slug = 'demo') {
  const out = path.join(TMP, `args-${Math.random().toString(36).slice(2)}.json`);
  const r = spawnSync(process.execPath, [S4ARGS, '--slug', slug, '--root', repo, '--ag-root', KIT, '--no-carry', '--out', out],
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

// ── JI7–JI12: răng «hỏi ngoài inputs» (hồ sơ thuoc-biet-truoc-khong-phan-duoc) ──
// Hội đồng chỉ đọc đúng các tệp trong `inputs` — không diff, không lệnh. Câu hỏi
// judgment đòi diff của lượt hoặc bảo chạy lệnh có phán quyết biết trước
// (UNCERTAIN, bất kể vật), nên s4-args chặn TRƯỚC lượt chấm: exit 2, không sinh
// tệp, thông điệp nêu hai lối ra. Bộ dò sống ở MỘT module, nạp cả ở đây.
const HOI = path.join(KIT, 'feature-loop', 'scripts', 'lib', 'hoi-ngoai-inputs.mjs');
// Nạp LƯỜI: nhóm JI1–JI6 (răng hồ sơ cũ gọi `--only`) không được sập vì module vắng.
const napHoi = () => { try { return createRequire(import.meta.url)(HOI); } catch { return null; } };
const RANG = 'câu hỏi đòi thứ hội đồng không đọc được';
// Ghi evals.yaml với một câu hỏi tuỳ ý cho E2 (judgment). `q` là phần YAML ngay
// sau `question:` — một dòng có nháy, hoặc `>` + các dòng khối thụt 6.
function writeEvalsQ(d, inputs, q, slug = 'demo') {
  const list = inputs.map(p => `      - ${p}`).join('\n');
  writeFileSync(path.join(d, '_acceptance', slug, 'evals.yaml'),
    `schema_version: 1\nfeature_slug: ${slug}\nevals:\n` +
    '  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: config:executors.test.api\n    expected: x\n' +
    `  - id: E2\n    criterion: AC-2\n    executor: judgment\n    question: ${q}\n    inputs:\n${list}\n    expected: PASS\n`);
}
const chan = (r) => r.code === 2 && !r.wrote && r.text.includes(`eval E2 (judgment): ${RANG}`);
const khop = (r) => (r.text.match(new RegExp(`${RANG} — «([^»]+)»`)) || [])[1];

group('JI7', 'judgment hỏi DIFF CỦA LƯỢT → exit 2, không sinh tệp, thông điệp nêu đoạn khớp + hai lối ra; khối gấp cũng bắt; đối chứng dương cùng fixture', () => {
  const repo = buildRepo(['CONTEXT.md']);
  writeEvalsQ(repo, ['CONTEXT.md'], '"Đọc diff của lượt (git diff diffBase...HEAD) có giữ luật kho không?"');
  const r = runArgs(repo);
  ok0(chan(r), 'JI7 exit 2', `code=${r.code} wrote=${r.wrote} ${r.text.trim().split('\n').pop()}`);
  ok0(khop(r) === 'diff của lượt', 'JI7 đoạn khớp «diff của lượt» nguyên văn', `got=${khop(r)}`);
  ok0(/\(a\) vế đo được bằng lệnh/.test(r.text) && /\(b\) vế cần phán/.test(r.text) && /KHÔNG sinh tệp/.test(r.text), 'JI7 thông điệp có đủ hai lối ra', r.text.trim().split('\n').pop());
  // Khối gấp: «diff của» và «lượt» nằm hai dòng nguồn — một câu trong nghĩa YAML.
  writeEvalsQ(repo, ['CONTEXT.md'], '>\n      Xét diff của\n      lượt này có giữ luật kho không?');
  // Tiền đề: bộ đọc thật trả xuống dòng NGUYÊN trong khối gấp — nếu nó tự gấp thì
  // phép gộp khoảng trắng của bộ dò thành thừa và đột biến khong-gop phải đo lại.
  const eyJ = createRequire(import.meta.url)(path.join(KIT, 'lib', 'eval-yaml.cjs'));
  const qJ = (eyJ.parseEvals(readFileSync(path.join(repo, '_acceptance', 'demo', 'evals.yaml'), 'utf8'), ['question']).find(e => e.id === 'E2') || {}).question || '';
  ok0(qJ.includes('\n'), 'JI7 tiền đề: parseEvals trả khối gấp còn xuống dòng', JSON.stringify(qJ));
  const rg = runArgs(repo);
  ok0(chan(rg) && khop(rg) === 'diff của lượt', 'JI7 khối gấp exit 2', `code=${rg.code} khop=${khop(rg)}`);
  writeEvalsQ(repo, ['CONTEXT.md'], '"Tài liệu có định nghĩa từ «hồ sơ» không?"');
  const r2 = runArgs(repo);
  ok0(r2.code === 0 && r2.wrote, 'JI7 đối chứng dương: hỏi nội dung tài liệu → sinh args', `code=${r2.code} ${r2.text.trim().split('\n').pop()}`);
});

group('JI8', 'judgment BẢO CHẠY LỆNH (Run: `…` · grep -n · git -C) → exit 2 cùng khuôn, nêu đoạn khớp của đúng dạng', () => {
  const repo = buildRepo(['CONTEXT.md']);
  for (const [q, want] of [['"Run: `pnpm lint` rồi xét kết quả có sạch không?"', 'Run: `'], ['"Chạy `pnpm typecheck` xem có lỗi không?"', 'Chạy `'], ['"grep -n console apps/ có ra dòng nào không?"', 'grep -'], ['"git -C apps log có commit sửa khoá không?"', 'git -C']]) {
    writeEvalsQ(repo, ['CONTEXT.md'], q);
    const r = runArgs(repo);
    ok0(chan(r) && khop(r) === want, `JI8 «${want}» exit 2 + đoạn khớp`, `code=${r.code} wrote=${r.wrote} khop=${khop(r)}`);
  }
});

group('JI9', 'inputs có TỆP DIFF có thật mà câu hỏi vẫn hỏi diff → vẫn exit 2 bằng thông điệp của răng (tên tệp không miễn); đối chứng dương cùng inputs', () => {
  const repo = buildRepo(['CONTEXT.md']);
  mkdirSync(path.join(repo, '_acceptance', 'demo', 'evidence'), { recursive: true });
  writeFileSync(path.join(repo, '_acceptance', 'demo', 'evidence', 'diff-luot.txt'), ' src/a.ts | 2 +-\n');
  writeEvalsQ(repo, ['_acceptance/demo/evidence/diff-luot.txt'], '"Nhìn diff của lượt trong tệp đính kèm: luật kho có giữ không?"');
  const r = runArgs(repo);
  ok0(chan(r), 'JI9 exit 2', `code=${r.code} wrote=${r.wrote} ${r.text.trim().split('\n').pop()}`);
  ok0(!/không tồn tại trên đĩa/.test(r.text), 'JI9 thông điệp là của răng, không phải input vắng', r.text.trim().split('\n').pop());
  writeEvalsQ(repo, ['_acceptance/demo/evidence/diff-luot.txt'], '"Tệp đính kèm có nêu tên tệp nào không?"');
  const r2 = runArgs(repo);
  ok0(r2.code === 0 && r2.wrote, 'JI9 đối chứng dương: cùng inputs, câu hỏi về nội dung tệp → sinh args', `code=${r2.code}`);
});

group('JI10', 'KHÔNG chặn oan: bốn câu hỏi trong phạm vi inputs → exit 0; bộ dò trên mọi eval judgment của kho kit → 0 khớp (đối chứng dương: tiêm một câu → 1)', () => {
  const repo = buildRepo(['CONTEXT.md']);
  for (const [ten, inp, q] of [
    ['tài liệu', ['CONTEXT.md'], '"Tài liệu có định nghĩa từ «hồ sơ» không?"'],
    ['tệp mã trong inputs', ['src/a.ts'], '"Hàm trong src/a.ts có parse dữ liệu ở biên không?"'],
    ['«diff» nghĩa khác', ['CONTEXT.md', 'src/a.ts'], '"Có diff giữa hai cấu hình đính kèm hợp lý không?"'],
    ['«đang chạy:»', ['CONTEXT.md'], '"Trên app QC đang chạy: chữ trên màn có đúng từ điển không?"'],
  ]) {
    writeEvalsQ(repo, inp, q);
    const r = runArgs(repo);
    ok0(r.code === 0 && r.wrote, `JI10 ${ten} exit 0`, `code=${r.code} ${r.text.trim().split('\n').pop()}`);
  }
  // Bộ hồ sơ THẬT của kho kit — gốc suy từ vị trí script, không hardcode.
  const mod = napHoi();
  ok0(!!mod, 'JI10 module bộ dò nạp được', HOI);
  if (!mod) return;
  const { hoiNgoaiInputs } = mod;
  const ey = createRequire(import.meta.url)(path.join(KIT, 'lib', 'eval-yaml.cjs'));
  const acc = path.join(KIT, '_acceptance');
  const texts = existsSync(acc) ? readdirSync(acc).map(s => path.join(acc, s, 'evals.yaml')).filter(f => existsSync(f)).map(f => [f, readFileSync(f, 'utf8')]) : [];
  const quet = (text) => ey.parseEvals(text, ['executor', 'question']).filter(e => e.executor === 'judgment');
  let soJ = 0; const trung = [];
  for (const [f, t] of texts) for (const e of quet(t)) { soJ += 1; const h = hoiNgoaiInputs(e.question); if (h) trung.push(`${path.basename(path.dirname(f))} ${e.id} «${h}»`); }
  ok0(soJ > 0, 'JI10 bộ hồ sơ của kho kit có eval judgment để dò', `so=${soJ}`);
  ok0(trung.length === 0, 'JI10 bộ dò trên hồ sơ kho kit: 0 khớp', trung.join(' · '));
  const tiem = (texts[0] ? texts[0][1] : 'evals:\n') + '  - id: EZ\n    criterion: AC-1\n    executor: judgment\n    question: "Nhìn diff của lượt: luật kho có giữ không?"\n';
  ok0(quet(tiem).filter(e => hoiNgoaiInputs(e.question)).length === 1, 'JI10 đối chứng dương: tiêm một câu hỏi diff → đúng 1 khớp');
});

group('JI11', 'tiền đề của răng: lời giao việc cho judge trong acceptance-verify.js còn MÙ DIFF và CHỈ đọc danh sách Input', () => {
  const lines = readFileSync(path.join(KIT, 'feature-loop', 'workflows', 'acceptance-verify.js'), 'utf8').split('\n').filter(l => l.includes('lens duy nhat') && !/^\s*(\/\/|\*)/.test(l) && l.includes('`'));
  ok0(lines.length === 1, 'JI11 tìm đúng một dòng dựng lời giao việc judge', `so dong=${lines.length}`);
  ok0(lines.length === 1 && lines[0].includes('KHONG doc diff') && lines[0].includes('CHI duoc doc dung cac file liet ke'),
    'JI11 lời giao việc hội đồng còn mù diff + chỉ đọc Input — tiền đề của răng hỏi-ngoài-inputs (s4-args.mjs); nới hội đồng thì gỡ răng cùng lúc');
});

group('JI12', 'bộ dò MỘT nguồn: khuôn chỉ ở module; round-trip — script quét của bản ghi phát hiện báo ĐÚNG tập eval mà s4-args chặn', () => {
  // (i) Mảnh đặc trưng của CẢ hai khuôn, viết như trong mã nguồn; quét mọi thư
  // mục nguồn của kit (trừ tests/ và _acceptance/ — nơi ca kiểm và răng hồ sơ
  // được phép nhắc khuôn để tiêm đột biến).
  const MANH = { 'hỏi diff': String.raw`\.\.\.\s*HEAD\b`, 'bảo chạy lệnh': String.raw`(Run|Chạy|Chay)\s*:?\s*` };
  const files = [];
  const walk = (dir) => { for (const n of readdirSync(dir, { withFileTypes: true })) { if (n.name === 'node_modules') continue; const p = path.join(dir, n.name); if (n.isDirectory()) walk(p); else files.push(p); } };
  for (const d of ['feature-loop', 'scripts', 'lib', 'hooks', 'skills', 'commands', path.join('docs', 'findings', 'assets')]) if (existsSync(path.join(KIT, d))) walk(path.join(KIT, d));
  const MOT = [path.join('feature-loop', 'scripts', 'lib', 'hoi-ngoai-inputs.mjs')];
  for (const [ten, manh] of Object.entries(MANH)) {
    const coTrong = files.filter(f => readFileSync(f, 'utf8').includes(manh)).map(f => path.relative(KIT, f)).sort();
    ok0(existsSync(HOI) && readFileSync(HOI, 'utf8').includes(manh), `JI12 mảnh khuôn «${ten}» có trong module (đối chứng dương của phép tìm)`);
    ok0(JSON.stringify(coTrong) === JSON.stringify(MOT), `JI12 khuôn bộ dò chỉ ở một module — «${ten}»`, `tep chua manh: ${JSON.stringify(coTrong)}`);
  }
  // (ii) Round-trip trên gốc kho giả do code sinh: một kho, ba hồ sơ.
  const dev = path.join(TMP, `dev-${Math.random().toString(36).slice(2)}`);
  const repo = buildRepo(['CONTEXT.md'], path.join(dev, 'khoA'));
  const HO = { 'h-diff': '"Nhìn diff của lượt: luật kho có giữ không?"', 'h-lenh': '"Run: `pnpm lint` rồi xét có sạch không?"', 'h-sach': '"Tài liệu có định nghĩa từ «hồ sơ» không?"' };
  for (const [slug, q] of Object.entries(HO)) {
    mkdirSync(path.join(repo, '_acceptance', slug), { recursive: true });
    writeFileSync(path.join(repo, '_acceptance', slug, 'contract.md'), `---\nschema_version: 1\nslug: ${slug}\nrisk_tier: T2\nstatus: implemented\n---\n`);
    writeEvalsQ(repo, ['CONTEXT.md'], q, slug);
  }
  const chanBoiS4 = Object.keys(HO).filter(slug => chan(runArgs(repo, slug))).map(s => `khoA/${s} E2`).sort();
  const QUET = path.join(KIT, 'docs', 'findings', 'assets', '2026-10-01-quet-judgment-hoi-ngoai-inputs.cjs');
  const sq = spawnSync(process.execPath, [QUET, dev], { encoding: 'utf8' });
  const baoBoiQuet = [...String(sq.stdout).matchAll(/^\s+(\S+) (E\d+) «/mg)].map(m => `${m[1]} ${m[2]}`).sort();
  ok0(sq.status === 0 && chanBoiS4.length === 2, 'JI12 round-trip có đối tượng: script quét chạy được và s4-args chặn đúng hai hồ sơ', `quet exit=${sq.status} ${String(sq.stderr).trim().split('\n').pop()} · s4=${JSON.stringify(chanBoiS4)}`);
  ok0(JSON.stringify(baoBoiQuet) === JSON.stringify(chanBoiS4), 'JI12 script quét báo đúng tập eval s4-args chặn', `quet=${JSON.stringify(baoBoiQuet)} s4=${JSON.stringify(chanBoiS4)}`);
});

if (ONLY && groupsRun === 0) { console.log(`  FAIL: --only ${ONLY} không khớp nhóm nào (JI1…JI12)`); fail += 1; }
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
