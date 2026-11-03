// s4-args-dev-server.test.mjs — hồ sơ sua-loi-dau-chu-dong-vao (issue #477 lỗi 5), AC-7 nửa s4-args: bộ sinh args giải
// `config:dev_server.url` thành `args.devServerUrl` khi hồ sơ có eval ui-check, để workflow tiêm vào lời gọi người chấm.
//   DS-1 đối chứng dương — config khai dev_server.url → args mang đúng giá trị
//   DS-2 chiều im — config không khai → s4-args vẫn sinh tệp, khoá devServerUrl VẮNG HẲN
//   DS-3 không CỘNG trường — eval ui-check trong args không có khoá `target`
// Kho thử do code sinh trong lượt (khuôn s4-args-not-run.test.mjs); đường dẫn suy từ vị trí tệp. Chiều đỏ nằm trong lịch
// sử: commit ca đứng trước commit vật.
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
const loi = e => String((e && (e.stderr || e.message)) || e).split('\n').filter(Boolean).slice(-3).join(' | ');
const TMP = mkdtempSync(path.join(tmpdir(), 's4args-devserver-'));
const URL = 'http://localhost:4173';

const EVALS = 'schema_version: 1\nfeature_slug: demo\nevals:\n'
  + '  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.cli\n    expected: thuong\n'
  + '  - id: E2\n    criterion: AC-2\n    executor: ui-check\n    expected: thay bang\n    steps:\n      - "mo trang chu"\n      - "chup man"\n';
const CONFIG = (devServer) => 'schema_version: 1\n'
  + (devServer ? `dev_server:\n  url: "${URL}"\n  start: "npm run dev"\n` : '')
  + 'executors:\n  script:\n    cli: "echo x"\nfeature_loop:\n  suite_keys:\n    - executors.script.cli\n';

function buildRepo(devServer) {
  const d = path.join(TMP, 'r-' + Math.random().toString(36).slice(2));
  mkdirSync(path.join(d, '_acceptance', 'demo'), { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main', d]);
  git(d, 'config', 'user.email', 't@t.t'); git(d, 'config', 'user.name', 'T');
  writeFileSync(path.join(d, '_acceptance', 'config.yaml'), CONFIG(devServer));
  writeFileSync(path.join(d, '_acceptance', 'demo', 'contract.md'), '---\nschema_version: 1\nslug: demo\nrisk_tier: T2\nstatus: implemented\n---\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'evals.yaml'), EVALS);
  writeFileSync(path.join(d, 'README.md'), 'demo\n');
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'round1');
  git(d, 'checkout', '-qb', 'vong-nay');
  writeFileSync(path.join(d, 'src-demo.js'), 'x\n');
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'vat cua vong');
  return d;
}
const run = (d) => {
  const out = path.join(d, 'args.json');
  execFileSync(process.execPath, [S4ARGS, '--slug', 'demo', '--root', d, '--ag-root', KIT, '--out', out, '--diff-base', 'main'],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  return JSON.parse(readFileSync(out, 'utf8'));
};

let co = null;
try {
  co = run(buildRepo(true));
  if (co.devServerUrl !== URL) bad(`DS-1 devServerUrl phai la ${URL}`, String(co.devServerUrl));
  else ok('DS-1 doi chung duong — config khai dev_server.url thi args mang dung gia tri da giai');
} catch (e) { bad('DS-1 s4-args phai sinh tep', loi(e)); }

try {
  const vang = run(buildRepo(false));
  if (Object.prototype.hasOwnProperty.call(vang, 'devServerUrl')) bad('DS-2 config khong khai thi khoa devServerUrl phai vang han', JSON.stringify(vang.devServerUrl));
  else if (!(vang.evals || []).some(e => e.id === 'E2')) bad('DS-2 eval ui-check phai con trong args', JSON.stringify((vang.evals || []).map(e => e.id)));
  else ok('DS-2 chieu im — config khong khai dev_server.url: s4-args van sinh tep, khoa vang han');
} catch (e) { bad('DS-2 s4-args phai sinh tep ca khi config khong khai dev_server', loi(e)); }

if (co) {
  const ui = (co.evals || []).find(e => e.id === 'E2');
  if (!ui) bad('DS-3 eval ui-check E2 phai co trong args');
  else if (Object.prototype.hasOwnProperty.call(ui, 'target')) bad('DS-3 eval ui-check khong duoc mang khoa target (CONG chua phe)');
  else ok('DS-3 eval ui-check khong mang truong target moi');
} else bad('DS-3 khong chay duoc — DS-1 chua sinh tep');

rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
