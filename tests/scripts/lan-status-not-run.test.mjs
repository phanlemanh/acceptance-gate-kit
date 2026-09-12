#!/usr/bin/env node
// Ca vĩnh viễn cho hồ sơ lan-doc-status-not-run. Chạy trọn: node tests/scripts/lan-status-not-run.test.mjs
// Chạy một ca: LSNR_CASES=L01 node tests/scripts/lan-status-not-run.test.mjs
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
// suy từ vị trí script, không hardcode gốc kho — LSNR_ROOT (Bước 5) trỏ sang
// bản sao khi cần phá vật thật; đường tới bản khai của CHÍNH hồ sơ này vẫn
// luôn suy từ vị trí script (xem cuối L10), không đi qua LSNR_ROOT.
const ROOT = process.env.LSNR_ROOT ? path.resolve(process.env.LSNR_ROOT) : path.resolve(HERE, '..', '..');
const SELF_ROOT = path.resolve(HERE, '..', '..');
const core = require(path.join(ROOT, 'lib', 'evidence-core.cjs'));
// Làn thật của bên GHI — cùng ROOT (suy từ vị trí script / LSNR_ROOT) với
// `core` ở trên, để bản sao bị tiêm ở Bước 6 đổi CẢ HAI cùng lúc.
const LANE = path.join(ROOT, 'feature-loop', 'scripts', 'repin-lane.mjs');

const CASES = [];
const test = (id, name, fn) => CASES.push({ id, name, fn });
const fail = (msg) => { throw new Error(msg); };

function evalsYaml(rows) {   // fixture do MÃ SINH
  const body = rows.map(r => [
    `  - id: ${r.id}`,
    `    executor: ${r.executor || 'script'}`,
    `    cmd: ${r.cmd || 'true'}`,
    r.status === undefined ? null : `    status: ${r.status}`,
  ].filter(Boolean).join('\n')).join('\n');
  return `evals:\n${body}\n`;
}

// ── Task 2: kho tạm THẬT + chạy làn THẬT (helper dùng chung cho L01, L02) ──
// Kho do MÃ SINH (git init dưới os.tmpdir()), không viết tay theo khuôn bên
// đọc. Hai commit: 1) mã + config + _acceptance/s1 (chưa biết sha) → lấy HEAD,
// 2) evidence-report.md nhúng ĐÚNG sha đó vào verified_commit rồi commit lại —
// cùng khuôn hai-lượt-commit với mkRepo() của tests/scripts/repin-lane-lop-cu.test.mjs
// (kho tạm không thể tự biết sha của mình trước khi commit).
//
// opts.evals: nội dung evals.yaml THẲNG (dùng cho L01 — sinh bằng evalsYaml()
// ở trên, không đụng tới opts.danhDau).
// opts.danhDau: true → dựng đúng hai eval máy — E1 (cmd: true, luôn chạy) và
//   E2 (cmd ghi một TỆP DẤU vào kho.tepDau); E2 tự khai `status: not-run` TRỪ
//   KHI opts.goStatus true (đối chứng dương — gỡ dòng khai để E2 CHẠY ĐƯỢC).
function dungKhoTam(opts) {
  opts = opts || {};
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lsnr-'));
  const g = (...a) => execFileSync('git', ['-C', dir, '-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  const ws = path.join(dir, '_acceptance', 's1');
  fs.mkdirSync(ws, { recursive: true });
  // config tối thiểu: MỘT suite no-op (feature_loop.suite_keys trỏ nó).
  fs.writeFileSync(path.join(dir, '_acceptance', 'config.yaml'),
    'schema_version: 1\nfeature_loop:\n  suite_keys:\n    - executors.script.noop\nexecutors:\n  script:\n    noop: true\n');
  const tepDau = path.join(dir, 'danh-dau.txt');
  let evalsText;
  if (opts.danhDau) {
    evalsText = 'evals:\n' +
      '  - id: E1\n    executor: script\n    cmd: true\n' +
      `  - id: E2\n    executor: script\n    cmd: sh -c 'touch ${tepDau}'\n` +
      (opts.goStatus ? '' : '    status: not-run\n');
  } else {
    evalsText = opts.evals;
  }
  fs.writeFileSync(path.join(ws, 'evals.yaml'), evalsText);
  fs.writeFileSync(path.join(ws, 'run-log.jsonl'), '');
  fs.writeFileSync(path.join(ws, 'evidence-report.md'),
    '---\nschema_version: 1\nfeature_slug: s1\nverdict: PASS\nverified_commit: PENDING\nhuman_signoff: t 2026-09-12\n---\n\n## Evidence\n\n## Iterations\n\nRound 1 — PASS.\n');
  g('init', '-q');
  g('add', '-A');
  g('commit', '-qm', 'impl');
  const sha = g('rev-parse', 'HEAD');
  const reportPath = path.join(ws, 'evidence-report.md');
  fs.writeFileSync(reportPath, fs.readFileSync(reportPath, 'utf8').replace('verified_commit: PENDING', `verified_commit: ${sha}`));
  g('add', '-A');
  g('commit', '-qm', 'evidence');
  return { dir, tepDau };
}

// Chạy feature-loop/scripts/repin-lane.mjs THẬT (không --write: chỉ đọc, kho
// tạm không đổi) trên kho tạm; bắt mã thoát (execFileSync ném khi ≠ 0) và trả
// JSON stdout đã parse, gộp thêm `exit` — mã thoát của TIẾN TRÌNH, JSON riêng
// của làn không mang trường này. `--ag-root ROOT` neo bộ máy vào ĐÚNG cây đang
// đo (không phải plugin cache đã cài trên máy, có thể tụt version so với vá
// vừa làm) — cùng ROOT với `core`/`LANE` nên Bước 6 đổi cả ba bằng một
// LSNR_ROOT. `ids` không đi vào lệnh gọi (làn luôn chạy TRỌN eval máy của
// slug, không lọc theo id) — hai ca dưới tự đối chiếu tập id NGOÀI lệnh gọi.
function chayLan(kho, ids) {
  void ids;
  let exit = 0;
  let stdout = '';
  try {
    stdout = execFileSync(process.execPath, [LANE, '--root', kho.dir, '--slug', 's1', '--ag-root', ROOT, '--reason', 'ca kiểm'], { encoding: 'utf8' });
  } catch (e) {
    exit = e.status == null ? 1 : e.status;
    stdout = e.stdout || '';
  }
  let parsed = {};
  try { parsed = JSON.parse(stdout); } catch (_) { /* làn chết trước khi in JSON (die sớm) */ }
  return { exit, ...parsed };
}

test('L01', 'hai bên trả CÙNG một tập id', () => {
  const text = evalsYaml([{ id: 'E1' }, { id: 'E2', status: 'not-run' }, { id: 'E3', executor: 'test' }]);
  const kho = dungKhoTam({ evals: text });                  // helper ở Step 2
  const benDoc = core.machineEvalIds(text);
  const benGhi = Object.keys(chayLan(kho, ['E1','E2','E3']).slugs.s1.evals_exit);
  if (benDoc.join(',') !== benGhi.join(',')) fail(`L01 hai bên trả tập khác nhau — đọc=[${benDoc}] ghi=[${benGhi}]`);
  if (benDoc.includes('E2')) fail('L01 ô khai không-chạy vẫn nằm trong tập');
});

test('L02', 'ô khai không-chạy KHÔNG được thi hành', () => {
  const kho = dungKhoTam({ danhDau: true });                 // cmd của ô ghi một tệp dấu
  const r = chayLan(kho, []);
  if (r.exit !== 0) fail(`L02 làn phải xanh, nhận exit ${r.exit}`);
  if (fs.existsSync(kho.tepDau)) fail('L02 ô không-chạy ĐÃ BỊ THI HÀNH — tệp dấu tồn tại');
  const kho2 = dungKhoTam({ danhDau: true, goStatus: true }); // đối chứng dương
  chayLan(kho2, []);
  if (!fs.existsSync(kho2.tepDau)) fail('L02 đối chứng dương hỏng: gỡ lời khai mà ô vẫn không chạy — ca không phân biệt được gì');
});

test('L09', 'chuẩn hoá bảy hình dạng lời khai', () => {
  const DANG = [
    ['not-run', true], ['"not-run"', true], ["'not-run'", true],
    ['NOT-RUN', true], ['Not-Run', true], ['  not-run  ', true],
    ['not_run', false],
  ];
  let n = 0;
  for (const [raw, phaiLoai] of DANG) {
    const text = evalsYaml([{ id: 'E1' }, { id: 'E2', status: raw }]);
    const ids = core.machineEvalIds(text);
    const biLoai = !ids.includes('E2');
    if (biLoai !== phaiLoai) fail(`L09 dạng ${JSON.stringify(raw)}: phải ${phaiLoai ? 'BỊ LOẠI' : 'GIỮ'} mà không — ids=${ids.join(',')}`);
    n++;
  }
  if (n !== DANG.length) fail(`L09 số ô lệch: chạy ${n}, bảng có ${DANG.length}`);
});

test('L10', 'chỉ TRƯỜNG thật mới tính, bốn chỗ khác không', () => {
  const base = evalsYaml([{ id: 'E1' }, { id: 'E2' }]);
  const CHO = [
    ['comment', base.replace('evals:', '# status: not-run\nevals:')],
    ['folded', base.replace('    cmd: true\n', '    cmd: true\n    expected: >-\n      gỡ dòng status: not-run đi thì ô chạy\n')],
    ['literal', base.replace('    cmd: true\n', '    cmd: true\n    expected: |\n      status: not-run\n')],
    ['paths', base.replace('    cmd: true\n', '    cmd: true\n    paths:\n      - "docs/status: not-run.md"\n')],
  ];
  for (const [ten, text] of CHO) {
    const ids = core.machineEvalIds(text);
    if (ids.length !== 2) fail(`L10 chỗ ${ten}: tập id phải còn 2, nhận ${ids.length} (${ids.join(',')})`);
  }
  const that = evalsYaml([{ id: 'E1' }, { id: 'E2', status: 'not-run' }]);
  const ids = core.machineEvalIds(that);
  if (ids.length !== 1 || ids[0] !== 'E1') fail(`L10 trường thật: phải còn đúng E1, nhận ${ids.join(',')}`);
  // chân tự soi: bản khai CỦA CHÍNH hồ sơ này không khai ô nào là không-chạy
  const own = fs.readFileSync(path.join(SELF_ROOT, '_acceptance', 'lan-doc-status-not-run', 'evals.yaml'), 'utf8');
  const skipped = core.machineEvalIdsSkipped(own);
  if (skipped.length !== 0) fail(`L10 tự soi: bản khai của chính hồ sơ bị loại ${skipped.join(',')} — phải RỖNG`);
});

const only = (process.env.LSNR_CASES || '').split(/[,\s]+/).filter(Boolean);
const chay = only.length ? CASES.filter(c => only.includes(c.id)) : CASES;
if (!chay.length) { console.error(`lan-status-not-run: bộ lọc LSNR_CASES=${process.env.LSNR_CASES} khớp 0 ca — không có gì chạy`); process.exit(2); }
let ok = 0;
for (const c of chay) {
  try { c.fn(); ok++; console.log(`  ✓ ${c.id} ${c.name}`); }
  catch (e) { console.error(`  ✗ ${c.id} ${c.name}\n    ${e.message}`); process.exit(1); }
}
console.log(`lan-status-not-run: ${ok}/${chay.length} ca xanh`);
