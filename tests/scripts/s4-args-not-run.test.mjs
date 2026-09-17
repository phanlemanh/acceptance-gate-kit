// s4-args-not-run.test.mjs — thuoc-co-cua AC-1 (E1): bộ sinh args NGHE lời khai
// `status: not-run` của hồ sơ. Ô tự khai không-chạy bị loại khỏi `args.evals` và được
// GỌI TÊN trong `args.evalsNotRun` — cùng hàm `machineEvalIdsSkipped` của
// lib/evidence-core.cjs mà làn ghim lại và bên đọc pin dùng, không chép luật.
//
// Bốn ca trên CÙNG một fixture code-sinh:
//   NRS1 đối chứng dương · NRS2 chiều đỏ (gỡ dòng khai → kết luận lật) ·
//   NRS3 chiều im (không ô nào khai → khoá VẮNG HẲN) · NRS4 một nguồn (thay hàm của
//   lib trong bản sao cây → kết luận lật).
// Mọi đường dẫn suy từ vị trí tệp này.
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync, readFileSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.join(HERE, '..', '..');
const S4ARGS = path.join(KIT, 'feature-loop', 'scripts', 's4-args.mjs');
let pass = 0, fail = 0;
const ok = m => { console.log(`  PASS: ${m}`); pass += 1; };
const bad = (m, d) => { console.log(`  FAIL: ${m}${d ? ` (${d})` : ''}`); fail += 1; };
const git = (cwd, ...a) => execFileSync('git', ['-C', cwd, ...a], { encoding: 'utf8' }).trim();
const loi = e => String((e && (e.stderr || e.message)) || e).split('\n').filter(Boolean).slice(-3).join(' | ');

const TMP = mkdtempSync(path.join(tmpdir(), 's4args-notrun-'));

const EVALS_KHAI = 'schema_version: 1\nfeature_slug: demo\nevals:\n'
  + '  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.cli\n    expected: thuong\n'
  + '  - id: E2\n    criterion: AC-2\n    executor: script\n    cmd: config:executors.script.cli\n    expected: khai khong chay\n    status: not-run\n'
  + '  - id: E3\n    criterion: AC-3\n    executor: judgment\n    question: co dung khong\n';
const DONG_KHAI = '    status: not-run\n';

// buildRepo(evalsYamlBody): khuôn của s4-args-expected-exit.test.mjs — kho git dựng bằng
// code trong lượt chạy, nhánh vòng riêng có một commit vật để mốc so khác HEAD.
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
  git(d, 'checkout', '-qb', 'vong-nay');
  writeFileSync(path.join(d, 'src-demo.js'), 'x\n');
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'vat cua vong');
  return d;
}

const run = (d, agRoot = KIT) => {
  const out = path.join(d, 'args.json');
  execFileSync(process.execPath, [S4ARGS, '--slug', 'demo', '--root', d, '--ag-root', agRoot, '--out', out, '--diff-base', 'main'],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  return JSON.parse(readFileSync(out, 'utf8'));
};
const ids = a => JSON.stringify((a.evals || []).map(e => e.id));

// ── NRS1 (đối chứng dương) ─────────────────────────────────────────────────
let nrs1 = null;
{
  const d = buildRepo(EVALS_KHAI);
  try {
    const a = run(d);
    if (ids(a) !== JSON.stringify(['E1', 'E3'])) bad('NRS1 args.evals phai la E1,E3 (E2 khai not-run)', ids(a));
    else if (JSON.stringify(a.evalsNotRun) !== JSON.stringify(['E2'])) bad('NRS1 evalsNotRun phai goi dung E2', JSON.stringify(a.evalsNotRun));
    else { nrs1 = a; ok('NRS1 doi chung duong — o khai status not-run vang khoi evals, evalsNotRun goi dung ten'); }
  } catch (e) { bad('NRS1 s4-args loi', loi(e)); }
}

// ── NRS2 (chiều đỏ, cùng fixture): gỡ đúng dòng khai → kết luận lật ──────────
{
  const d = buildRepo(EVALS_KHAI);
  try {
    const f = path.join(d, '_acceptance', 'demo', 'evals.yaml');
    const src = readFileSync(f, 'utf8');
    const n = src.split(DONG_KHAI).length - 1;
    if (n !== 1) throw new Error(`kim «status: not-run» khop ${n} lan (can dung 1)`);
    writeFileSync(f, src.replace(DONG_KHAI, ''));
    git(d, 'commit', '-qam', 'go dong khai');
    const a = run(d);
    const coE2 = (a.evals || []).some(e => e.id === 'E2');
    if (!nrs1) bad('NRS2 doi chung duong NRS1 khong xanh — khong tin duoc chieu do');
    else if (!coE2) bad('NRS2 go dong khai ma E2 van vang khoi evals', ids(a));
    else if ('evalsNotRun' in a) bad('NRS2 go dong khai ma khoa evalsNotRun van co', JSON.stringify(a.evalsNotRun));
    else ok('NRS2 chieu do — go dong status not-run thi E2 co mat trong evals va evalsNotRun vang');
  } catch (e) { bad('NRS2 s4-args loi', loi(e)); }
}

// ── NRS3 (chiều im): không ô nào khai → khoá VẮNG HẲN, không phải mảng rỗng ──
{
  const d = buildRepo(EVALS_KHAI.replace(DONG_KHAI, ''));
  try {
    const a = run(d);
    if (ids(a) !== JSON.stringify(['E1', 'E2', 'E3'])) bad('NRS3 doi chung: evals phai du E1,E2,E3', ids(a));
    else if (Object.prototype.hasOwnProperty.call(a, 'evalsNotRun')) bad('NRS3 khoa evalsNotRun phai vang han', JSON.stringify(a.evalsNotRun));
    else ok('NRS3 chieu im — khong o nao khai thi khoa evalsNotRun vang han');
  } catch (e) { bad('NRS3 s4-args loi', loi(e)); }
}

// ── NRS4 (một nguồn): thay thân machineEvalIdsSkipped bằng `return [];` trong bản
//    sao cây acceptance-gate → kết luận của NRS1 LẬT. Chép TRỌN thư mục (lib/ và
//    skills/acceptance/references/), không danh sách tệp tay.
{
  const d = buildRepo(EVALS_KHAI);
  try {
    const ag = path.join(TMP, 'ag-mutant');
    cpSync(path.join(KIT, 'lib'), path.join(ag, 'lib'), { recursive: true });
    cpSync(path.join(KIT, 'skills', 'acceptance', 'references'), path.join(ag, 'skills', 'acceptance', 'references'), { recursive: true });
    const f = path.join(ag, 'lib', 'evidence-core.cjs');
    const src = readFileSync(f, 'utf8');
    const KIM = 'function machineEvalIdsSkipped(';
    const n = src.split(KIM).length - 1;
    if (n !== 1) throw new Error(`kim «${KIM}» khop ${n} lan (can dung 1)`);
    writeFileSync(f, src.replace(KIM, `${KIM}evalsText) { return []; }\nfunction __goc_machineEvalIdsSkipped(`));
    const a = run(d, ag);
    const coE2 = (a.evals || []).some(e => e.id === 'E2');
    if (!nrs1) bad('NRS4 doi chung duong NRS1 khong xanh — khong tin duoc chieu lat');
    else if (!coE2) bad('NRS4 thay ham cua lib ma E2 van vang — bo sinh args khong goi ham dung chung', ids(a));
    else ok('NRS4 mot nguon — thay ham cua lib thi ket luan lat');
  } catch (e) { bad('NRS4 s4-args loi', loi(e)); }
}

rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (s4-args-not-run)`);
process.exit(fail ? 1 : 0);
