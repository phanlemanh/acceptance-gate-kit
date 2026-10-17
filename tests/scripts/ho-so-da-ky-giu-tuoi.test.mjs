// GT — hồ sơ ho-so-da-ky-giu-tuoi (hàng K-A): lệnh giữ tươi theo khoảng gộp, quy đỏ về PR gây ra, nhãn
// «đỏ sẵn trên nền». Ca GT<n> = AC-n của hợp đồng; GT0-* là ca đơn vị của luật nhãn dùng chung
// (lib/do-san-tren-nen.cjs). Kho thử git do code sinh trong lượt; «bản trước vòng» = `git archive 43ed9e2b`
// bung trong lượt. Mọi đường dẫn suy từ vị trí tệp này. Chọn ca: GT_CASES=GT0-bam,GT1 node <tệp>.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const require = createRequire(import.meta.url);
const DS = require(path.join(ROOT, 'lib', 'do-san-tren-nen.cjs'));
const NCG = require(path.join(ROOT, 'lib', 'nhan-canh-gay.cjs'));
export const BAN_TRUOC_VONG = '43ed9e2b3e6d77e02d702a3171069c0af8843179';

const chon = (process.env.GT_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
let passed = 0, failed = 0;
const tmp = [];
async function ca(ten, f) {
  if (chon.length && !chon.some(c => ten === c || ten.startsWith(`${c} `) || ten.startsWith(`${c}-`))) return;
  try { const kq = await f(); passed++; console.log(`PASS: ${ten}${kq ? ` — ${kq}` : ''}`); }
  catch (e) { failed++; console.log(`FAIL: ${ten}\n    ${String(e && e.stack || e).split('\n').slice(0, 6).join('\n    ')}`); }
}
const thuMuc = (tien) => { const d = mkdtempSync(path.join(tmpdir(), tien)); tmp.push(d); return d; };

// Kho git tối thiểu cho ca đơn vị: một hồ sơ, run-log tuỳ ý, config với khoá tuỳ ý.
function khoDonVi({ khoa, runLog = [], evalsYaml }) {
  const root = thuMuc('gt0-');
  const git = (...a) => execFileSync('git', ['-C', root, '-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  const ws = path.join(root, '_acceptance', 'h5');
  mkdirSync(ws, { recursive: true });
  writeFileSync(path.join(root, '_acceptance', 'config.yaml'), `schema_version: 1\nfeature_loop:\n${khoa === undefined ? '' : `  do_san_tren_nen: ${khoa}\n`}  suite_keys: []\n`);
  writeFileSync(path.join(ws, 'evals.yaml'), evalsYaml || 'schema_version: 1\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.e1\n    expected: exit 0\n');
  git('init', '-q'); git('add', '-A'); git('commit', '-qm', 'goc');
  const sha = git('rev-parse', 'HEAD');
  writeFileSync(path.join(ws, 'run-log.jsonl'), runLog.map(l => (typeof l === 'string' ? l : JSON.stringify(l(sha)))).join('\n') + '\n');
  git('add', '-A'); git('commit', '-qm', 'nen');
  return { root, ws, git, sha };
}

const LOG_A = '(pass) ca-xanh [0.20ms]\nexpected 3 got 4\n    at /tmp/abc123/x.test.js:12:3\n(fail) ca-do [1.37ms]\nsau ca do\n';
const LOG_A_GIO = '(pass) ca-xanh [9.80ms]\nexpected 3 got 4\n    at /var/folders/zz/q1/x.test.js:12:9\n(fail) ca-do [12.04ms]\nsau ca do\n';
const LOG_B = '(pass) ca-xanh [0.20ms]\nTypeError: x is not a function\n    at /tmp/abc123/x.test.js:12:3\n(fail) ca-do [1.37ms]\nsau ca do\n';

await ca('GT0-bam — cùng ca khác lỗi khác băm · cùng lỗi khác giờ/đường dẫn bằng băm', () => {
  const a = DS.bamThongDiep(LOG_A, ['ca-do']);
  assert.match(a, /^[0-9a-f]{64}$/);
  assert.equal(DS.bamThongDiep(LOG_A_GIO, ['ca-do']), a, 'giờ chạy, đường tạm, số dòng-cột phải bị chuẩn hoá');
  assert.notEqual(DS.bamThongDiep(LOG_B, ['ca-do']), a, 'cùng ca mà đổi lỗi phải khác băm');
  assert.notEqual(DS.bamThongDiep(LOG_A, ['ca-khac']), a, 'khác ca phải khác băm');
  // Không rút được tên ca: 20 dòng cuối đã chuẩn hoá.
  const t1 = Array.from({ length: 30 }, (_, i) => `dong ${i} luc 2026-10-17T13:00:0${i % 10}Z mat 12ms`).join('\n');
  const t2 = t1.replace(/T13:00/g, 'T21:44').replace(/12ms/g, '9.5 ms');
  assert.equal(DS.bamThongDiep(t1, null), DS.bamThongDiep(t2, null));
  assert.notEqual(DS.bamThongDiep(t1, null), DS.bamThongDiep(t1.replace('dong 29', 'dong X'), null));
  const tr = DS.trichThongDiep(LOG_A, ['ca-do']);
  assert.ok(tr.split('\n').length <= 3 && tr.includes('ca-do'), `trích phải ≤ 3 dòng và có tên ca: ${tr}`);
  return '4 cặp so + trích';
});

await ca('GT0-khoa — vắng/false tắt, true bật, giá trị sai ném gọi tên khoá', () => {
  assert.equal(DS.khoaTuText('schema_version: 1\nfeature_loop:\n  suite_keys: []\n'), false);
  assert.equal(DS.khoaTuText('feature_loop:\n  do_san_tren_nen: false\n'), false);
  assert.equal(DS.khoaTuText('feature_loop:\n  do_san_tren_nen: true\n'), true);
  assert.throws(() => DS.khoaTuText('feature_loop:\n  do_san_tren_nen: co\n'), (e) => /feature_loop\.do_san_tren_nen/.test(e.message) && /true \| false/.test(e.message));
  assert.equal(NCG.NHAN.DO_SAN, 'đỏ sẵn trên nền');
});

const dongNen = (sha, over = {}) => Object.assign({ ts: '2026-10-17T01:00:00Z', kind: 'nen-do', run_id: 'gt-nen-1', sha, tu: sha, ket_cuc: 'do-khoang',
  lenh_do: [{ eval: 'E1', cmd: 'sh e1.sh', exit: 1, thong_diep_bam: 'b'.repeat(64), trich: '(fail) ca-do', log: null }], quy_ve: [{ pr: 12, sha_truoc: sha, sha_sau: sha }] }, over);

await ca('GT0-dong-hong — run-log có dòng JSON hỏng xen giữa: bỏ dòng hỏng, không ném', () => {
  const k = khoDonVi({ khoa: true, runLog: ['{hong', (sha) => dongNen(sha), 'cung hong}'] });
  const ds = DS.docDongNen(k.root, 'h5', null);
  assert.equal(ds.length, 1);
  assert.equal(DS.docDongNen(k.root, 'h5', 'HEAD').length, 1, 'đọc qua git show cũng bỏ dòng hỏng');
  assert.deepEqual(DS.docDongNen(k.root, 'khong-co', 'HEAD'), []);
});

await ca('GT0-kiem — đạt ở ô khớp, mỗi vế hỏng một ô ghim veHong', () => {
  const evalsYaml = 'schema_version: 1\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.e1\n    expected: exit 0\n';
  const dn = DS.bamDinhNghia(evalsYaml, 'E1');
  assert.match(dn, /^[0-9a-f]{64}$/);
  const k = khoDonVi({ khoa: true, evalsYaml, runLog: [(sha) => dongNen(sha, { dinh_nghia: { E1: dn } })] });
  const co = { root: k.root, slug: 'h5', evalId: 'E1', bam: 'b'.repeat(64), dinhNghia: dn, headRef: 'HEAD', baseRef: null, khoa: true };
  const ok = DS.kiemDoSan(co);
  assert.equal(ok.dat, true, JSON.stringify(ok)); assert.equal(ok.runId, 'gt-nen-1'); assert.deepEqual(ok.pr, [12]);
  const o = (over, ve) => { const r = DS.kiemDoSan(Object.assign({}, co, over)); assert.equal(r.dat, false); assert.equal(r.veHong, ve, JSON.stringify(r)); };
  o({ khoa: false }, 'khoa-tat');
  o({ evalId: 'E2' }, 'khong-co-dong-nen');
  o({ runId: 'khong-ton-tai' }, 'khong-co-dong-nen');
  o({ bam: 'c'.repeat(64) }, 'khac-ca-hoac-thong-diep');
  o({ dinhNghia: 'd'.repeat(64) }, 'doi-dinh-nghia');
  // Nền không là tổ tiên của đỉnh: sha của dòng nền là commit trên nhánh khác.
  const nhanhGoc = k.git('symbolic-ref', '--short', 'HEAD');
  k.git('checkout', '-qb', 'nhanh-khac', k.sha); writeFileSync(path.join(k.root, 'x.txt'), 'x'); k.git('add', '-A'); k.git('commit', '-qm', 'khac');
  const lac = k.git('rev-parse', 'HEAD'); k.git('checkout', '-q', nhanhGoc);
  writeFileSync(path.join(k.ws, 'run-log.jsonl'), JSON.stringify(dongNen(lac, { dinh_nghia: { E1: dn } })) + '\n');
  o({}, 'nen-khong-tren-nhanh-chinh');
  assert.ok(DS.cauVeHong('khoa-tat').includes('feature_loop.do_san_tren_nen'));
  return '1 ô đạt + 5 vế hỏng';
});

for (const d of tmp) rmSync(d, { recursive: true, force: true });
console.log(`\nGT Results: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
