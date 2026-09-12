#!/usr/bin/env node
// Ca vĩnh viễn cho hồ sơ lan-doc-status-not-run. Chạy trọn: node tests/scripts/lan-status-not-run.test.mjs
// Chạy một ca: LSNR_CASES=L01 node tests/scripts/lan-status-not-run.test.mjs
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
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

const SELF_FILE = fileURLToPath(import.meta.url);

// `muiTiem` = danh sách mũi tiêm CHẠY ĐƯỢC của ca (xem khối «lưới hai chiều»
// gần cuối tệp). Ca không có mũi tiêm PHẢI có một dòng lý do trong
// MIEN_MUI_TIEM — ca meta L13 đỏ nếu ai đó để mảng rỗng im lặng.
const CASES = [];
const test = (id, name, fn, muiTiem) => CASES.push({ id, name, fn, muiTiem: muiTiem || [] });
const fail = (msg) => { throw new Error(msg); };

// Một gốc tạm dùng chung cho mọi kho `dungKhoTam` sinh ra, dọn khi tiến trình
// thoát — cùng khuôn TMP + process.on('exit') của
// tests/scripts/repin-lane-lop-cu.test.mjs (dòng 35), tránh rơi vãi thư mục
// dưới os.tmpdir() sau mỗi lượt chạy (minor nêu ở phán quyết coordinator
// 12/09/2026).
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'lsnr-root-'));
process.on('exit', () => { try { fs.rmSync(TMP, { recursive: true, force: true }); } catch { /* dọn tạm */ } });

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
// opts.xungDot: true (Task 3, hồ sơ lan-doc-status-not-run) → cùng cặp E1/E2
//   của opts.danhDau (E2 LUÔN khai `status: not-run`), NHƯNG evidence-report.md
//   được dựng với hai khối `- eval:` ĐÃ KÝ (E1 lẫn E2) mang `exit_code: 0` —
//   vật quan sát cho «hồ sơ đã ký có mã thoát cho ô mà evals.yaml nay khai
//   không-chạy». Không có opts nào khác → evals mặc định một eval E1 xanh
//   (dùng cho đối chứng dương của L04: một lượt lành phải ĐỔI băm).
function dungKhoTam(opts) {
  opts = opts || {};
  const dir = fs.mkdtempSync(path.join(TMP, 'kho-'));
  const g = (...a) => execFileSync('git', ['-C', dir, '-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  const ws = path.join(dir, '_acceptance', 's1');
  fs.mkdirSync(ws, { recursive: true });
  // config tối thiểu: MỘT suite no-op (feature_loop.suite_keys trỏ nó).
  fs.writeFileSync(path.join(dir, '_acceptance', 'config.yaml'),
    'schema_version: 1\nfeature_loop:\n  suite_keys:\n    - executors.script.noop\nexecutors:\n  script:\n    noop: true\n');
  const tepDau = path.join(dir, 'danh-dau.txt');
  let evalsText;
  if (opts.xungDot) {
    evalsText = 'evals:\n' +
      '  - id: E1\n    executor: script\n    cmd: true\n' +
      `  - id: E2\n    executor: script\n    cmd: sh -c 'touch ${tepDau}'\n    status: not-run\n`;
  } else if (opts.danhDau) {
    evalsText = 'evals:\n' +
      '  - id: E1\n    executor: script\n    cmd: true\n' +
      `  - id: E2\n    executor: script\n    cmd: sh -c 'touch ${tepDau}'\n` +
      (opts.goStatus ? '' : '    status: not-run\n');
  } else {
    evalsText = opts.evals || evalsYaml([{ id: 'E1' }]);
  }
  fs.writeFileSync(path.join(ws, 'evals.yaml'), evalsText);
  fs.writeFileSync(path.join(ws, 'run-log.jsonl'), '');
  // Evidence + run-log THẬT (Vòng sửa 1, 12/09/2026 — lo ngại số 2 của báo
  // cáo Task 4): trước đây nhánh mặc định/danhDau dựng khối `## Evidence`
  // RỖNG — đủ cho L01/L02 (không bao giờ gọi --write) nhưng khiến bước tự
  // kiểm recheck-evidence.cjs BÊN TRONG làn luôn đỏ (L1 SHAPE) mỗi khi một ca
  // khác gọi --write trên chính fixture đó, mà không ca nào kiểm mã thoát của
  // bước ghi — "đường ghi chỉ được chứng một nửa". Nay MỌI eval CHẠY ĐƯỢC
  // (core.machineEvalIds trên evalsText, không phải id tự khai không-chạy)
  // đều có một khối Evidence đã ký THẬT + một dòng run-log khớp run_id/sha —
  // --write trên các fixture này giờ phải xanh tuyệt đối (recheck-evidence
  // exit 0), không chỉ "tệp có đổi". `runIds` rút MỘT LẦN từ evalsText vừa
  // ghi, dùng lại cho cả khối Evidence lẫn run-log (không parse hai nơi).
  //
  // opts.xungDot GIỮ NGUYÊN khối Evidence hai eval (E1 lẫn E2) đã ký sẵn — đó
  // CHÍNH LÀ vật quan sát của xung đột (báo cáo đã ký có mã thoát cho một
  // eval mà evals.yaml NAY khai không-chạy); không rút theo runIds vì E2 cố ý
  // không thuộc runIds, và fixture này luôn dừng ở notRunConflicts TRƯỚC khi
  // chạm recheck-evidence nên không cần run-log khớp.
  const runIds = opts.xungDot ? [] : core.machineEvalIds(evalsText);
  const khoiEvidence = (ids) => ids.map(id =>
    `- eval: ${id}\n  run_id: seed-${id}\n  exit_code: 0\n  verifier: config:executors.script.noop\n  verified_at: 2026-09-11\n\n`).join('');
  const evidenceBody = opts.xungDot
    ? '---\nschema_version: 1\nfeature_slug: s1\nverdict: PASS\nverified_commit: PENDING\nhuman_signoff: t 2026-09-12\n---\n\n' +
      '## Evidence\n\n' + khoiEvidence(['E1', 'E2']) + '## Iterations\n\nRound 1 — PASS.\n'
    : '---\nschema_version: 1\nfeature_slug: s1\nverdict: PASS\nverified_commit: PENDING\nhuman_signoff: t 2026-09-12\n---\n\n' +
      '## Evidence\n\n' + khoiEvidence(runIds) + '## Iterations\n\nRound 1 — PASS.\n';
  fs.writeFileSync(path.join(ws, 'evidence-report.md'), evidenceBody);
  g('init', '-q');
  g('add', '-A');
  g('commit', '-qm', 'impl');
  const sha = g('rev-parse', 'HEAD');
  const reportPath = path.join(ws, 'evidence-report.md');
  fs.writeFileSync(reportPath, fs.readFileSync(reportPath, 'utf8').replace('verified_commit: PENDING', `verified_commit: ${sha}`));
  // run-log.jsonl phải mang một dòng {kind:'eval', run_id: seed-<id>,...}
  // khớp sha vừa biết cho MỖI id trong runIds — recheck-evidence đòi run_id
  // trong khối Evidence được TÌM THẤY trong run-log (L2 PROVENANCE), không
  // chấp nhận run_id hand-mint không có dòng máy-ghi đứng sau nó.
  if (runIds.length) {
    fs.writeFileSync(path.join(ws, 'run-log.jsonl'), runIds.map(id =>
      JSON.stringify({ ts: '2026-09-11T00:00:00Z', kind: 'eval', run_id: `seed-${id}`, sha, eval: id, exit_code: 0 }) + '\n').join(''));
  }
  g('add', '-A');
  g('commit', '-qm', 'evidence');
  return { dir, tepDau };
}

// Chạy feature-loop/scripts/repin-lane.mjs THẬT trên kho tạm; bắt mã thoát
// (execFileSync ném khi ≠ 0) và trả JSON stdout đã parse, gộp thêm `exit` —
// mã thoát của TIẾN TRÌNH, JSON riêng của làn không mang trường này — và
// `stderr` (thông điệp của làn, để ca đối chiếu chữ). `--ag-root ROOT` neo bộ
// máy vào ĐÚNG cây đang đo (không phải plugin cache đã cài trên máy, có thể
// tụt version so với vá vừa làm) — cùng ROOT với `core`/`LANE` nên Bước 6 đổi
// cả ba bằng một LSNR_ROOT. `ids` không đi vào lệnh gọi (làn luôn chạy TRỌN
// eval máy của slug, không lọc theo id) — hai ca dưới tự đối chiếu tập id
// NGOÀI lệnh gọi. `opts.write` (mặc định false, giữ hành vi CŨ không --write
// — kho tạm không đổi) thêm cờ `--write`: L04 cần làn thật sự CHẠM tới lượt
// ghi để chứng minh nó KHÔNG ghi khi có xung đột, và đối chứng dương cần một
// lượt --write THẬT làm đổi băm.
function chayLan(kho, ids, opts) {
  void ids;
  opts = opts || {};
  const args = [LANE, '--root', kho.dir, '--slug', 's1', '--ag-root', ROOT, '--reason', 'ca kiểm'];
  if (opts.write) args.push('--write');
  let exit = 0;
  let stdout = '';
  let stderr = '';
  try {
    stdout = execFileSync(process.execPath, args, { encoding: 'utf8' });
  } catch (e) {
    exit = e.status == null ? 1 : e.status;
    stdout = e.stdout || '';
    stderr = e.stderr || '';
  }
  let parsed = {};
  try { parsed = JSON.parse(stdout); } catch (_) { /* làn chết trước khi in JSON (die sớm) */ }
  return { exit, stderr, ...parsed };
}

// ── Task 3: băm nội dung hồ sơ (run-log.jsonl + evidence-report.md) của kho
// `s1` — vật quan sát cho «chưa ghi byte nào». Băm SAI KHÁC (thiếu tệp) cũng
// được gộp vào digest bằng một placeholder cố định, để "tệp biến mất" cũng
// đổi băm thay vì ném lỗi làm ca chết oan.
function bam(kho) {
  const ws = path.join(kho.dir, '_acceptance', 's1');
  const h = crypto.createHash('sha256');
  for (const f of ['run-log.jsonl', 'evidence-report.md']) {
    h.update(f); h.update('\0');
    try { h.update(fs.readFileSync(path.join(ws, f))); } catch { h.update('__MISSING__'); }
  }
  return h.digest('hex');
}

// true nếu thư mục hồ sơ s1 có tệp NGOÀI ba tệp dungKhoTam đã dựng sẵn — làn
// xung đột không được để rơi rớt tệp mới nào (vd một .tmp nửa-ghi).
function themTepMoi(kho) {
  const ws = path.join(kho.dir, '_acceptance', 's1');
  const goc = new Set(['evals.yaml', 'run-log.jsonl', 'evidence-report.md']);
  return fs.readdirSync(ws).some(f => !goc.has(f));
}

// Dòng repin HỢP LỆ (đủ evals_exit cho mọi eval máy KHÔNG bị khai không-chạy —
// ở đây chỉ E1) để gọi thẳng core.checkRepinEvals — kiểm bên ĐỌC độc lập với
// làn (repin-lane.mjs), cùng dữ liệu xung đột.
function dongPinThieuE2(kho) {
  const sha = execFileSync('git', ['-C', kho.dir, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  return { run_id: 'lsnr-l04-doc', sha, ts: '2026-09-12T00:00:00Z', evals_exit: { E1: 0 } };
}

// ── Task 4: đọc dòng cuối một tệp NDJSON dưới ws của kho tạm, và hai lối tắt
// đọc evals.yaml/evidence-report.md — dùng cho L03/L06 (bên đọc PHẢI dùng bộ
// đọc KHÁC bộ đọc dòng log: JSON.parse cho run-log.jsonl, đọc chữ thường cho
// evidence-report.md).
function docDongCuoi(kho, ten) {
  const dong = fs.readFileSync(path.join(kho.dir, '_acceptance', 's1', ten), 'utf8').split('\n').filter(Boolean);
  return dong[dong.length - 1];
}
function docEvals(kho) { return fs.readFileSync(path.join(kho.dir, '_acceptance', 's1', 'evals.yaml'), 'utf8'); }
function docReport(kho) { return fs.readFileSync(path.join(kho.dir, '_acceptance', 's1', 'evidence-report.md'), 'utf8'); }

// Dòng pin THIẾU đúng một id CHẠY ĐƯỢC (không phải id tự khai không-chạy) —
// tổng quát hoá dongPinThieuE2 ở trên (E2 ở đó tự khai không-chạy nên bỏ nó ra
// là no-op đối với machineEvalIds; ở đây `idThieu` là một id THẬT sự phải
// chạy, việc thiếu nó phải bị bên đọc chặn). evals_exit mang 0 cho MỌI id máy
// khác ngoài `idThieu`, để ca chỉ còn đúng MỘT biến: chính id bị bỏ sót.
function pinThieu(idThieu, kho) {
  const sha = execFileSync('git', ['-C', kho.dir, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const ids = core.machineEvalIds(docEvals(kho)).filter(i => i !== idThieu);
  const evals_exit = {};
  for (const i of ids) evals_exit[i] = 0;
  return { run_id: 'lsnr-l03-doc', sha, ts: '2026-09-12T00:00:00Z', evals_exit };
}

// ── Mũi tiêm thường trực (rà cuối 12/09/2026, Important 4) ────────────────
// Nhánh này CỘNG một răng «mọi ca phải có ≥1 mũi tiêm» cho tệp ca lớp-cũ
// (GL09) nhưng tệp ca MỚI lại không có mũi tiêm thường trực nào ngoài chiều đỏ
// nội tại của L05/L07 — lưới hai chiều bất đối xứng. Nay mỗi ca lõi mang một
// mũi tiêm chạy được: MỘT chỗ trong bộ máy (lib/ · feature-loop/) bị sửa trên
// một BẢN SAO, rồi CHÍNH ca đó chạy lại trong bản sao đó (LSNR_ROOT) và phải
// ĐỎ kèm đúng chữ ghim. Khuôn giống GLLC_CHECK_MUTANTS của
// tests/scripts/repin-lane-lop-cu.test.mjs; bộ máy dựng ở `dungCayTiem` /
// `chayMuiTiem` gần cuối tệp.
//
// Mỗi phần tử `tiem`: [đường dẫn tương đối trong bộ máy, chuỗi neo, chuỗi thay].
// Chuỗi neo phải khớp ĐÚNG MỘT lần — trôi khỏi vật là ca đỏ có tên, không xanh lặng.
const LANE_REL = 'feature-loop/scripts/repin-lane.mjs';
const CORE_REL = 'lib/evidence-core.cjs';
const LOC_MAY = "REPIN_MACHINE_EXECUTORS.includes(String(e.executor || '').trim().toLowerCase())";
// Bên VIẾT hoàn nguyên bộ lọc riêng: lọc CHỈ theo executor, không đọc lời khai.
const TIEM_BEN_GHI = [[LANE_REL, '    .filter(e => core.isRepinMachineEval(e))', `    .filter(e => core.${LOC_MAY})`]];
const NEO_MACHINE_IDS = "  return ey.parseEvals(evalsText, ['executor', 'status']).filter(isRepinMachineEval).map(e => e.id);";
// Bên ĐỌC hoàn nguyên TẠI CHỖ DÙNG: `missing` đòi lại cả id đã khai không-chạy.
// KHÔNG tiêm vào chính machineEvalIds: `dungKhoTam` dựng khối Evidence của
// fixture BẰNG core.machineEvalIds, nên tiêm ở đó làm bản tiêm tự dựng một
// fixture khác (báo cáo đã ký có khối cho E2) và ca đỏ vì XUNG ĐỘT HAI VẾ —
// đỏ sai lý do. Tiêm ở chỗ dùng giữ fixture y nguyên (đo 12/09/2026).
const TIEM_BEN_DOC = [[CORE_REL,
  '  const missing = ids.filter(i => !has(i));',
  '  const missing = [...ids, ...(machineEvalIdsSkipped(evalsText) || [])].filter(i => !has(i));']];
// Bên ĐỌC quét THEO DÒNG, không phân biệt thân mô tả / chú thích / danh sách
// đường dẫn — đúng lớp lỗi AC-10 đi đóng.
const QUET_THO = [
  "  const recs = ey.parseEvals(evalsText, ['executor', 'status']);",
  "  const boQuaTho = new Set(); let cur = null;",
  "  for (const l of String(evalsText).split('\\n')) {",
  "    const m = l.match(/^\\s*-\\s*id:\\s*(\\S+)/); if (m) cur = m[1];",
  "    if (cur && /status:\\s*not-run/.test(l)) boQuaTho.add(cur);",
  "  }",
  `  return recs.filter(e => ${LOC_MAY} && !boQuaTho.has(e.id)).map(e => e.id);`,
].join('\n');
const TIEM_QUET_THEO_DONG = [[CORE_REL, NEO_MACHINE_IDS, QUET_THO]];
// Bên VIẾT thôi nối hậu tố nói-ra trên dòng `sha:`.
const THAN_HAU_TO = "  const veBoQua = boQua.length ? ` · không chạy theo hồ sơ: ${boQua.join(', ')}` : '';";
const TIEM_BO_HAU_TO = [[LANE_REL, THAN_HAU_TO, "  const veBoQua = '';"]];
// Bỏ VẾ 2 của luật hai vế: xung đột không bao giờ được báo.
const TIEM_BO_VE_HAI = [[CORE_REL,
  '  return { xungDot: skipped.filter(id => signed.has(id)), khongDoiChieuDuoc: [] };',
  '  return { xungDot: [], khongDoiChieuDuoc: [] };']];
// Thôi chuẩn hoá lời khai: nháy/hoa/khoảng trắng lọt.
const TIEM_KHONG_CHUAN_HOA = [[CORE_REL,
  "  return unquoteScalar(String(v == null ? '' : v)).trim().toLowerCase();",
  "  return String(v == null ? '' : v);"]];
// Gỡ răng «ô khai không-chạy mang mã đỏ» (rà cuối 12/09/2026, Important 1).
const TIEM_GO_RANG_MA_DO = [[CORE_REL,
  '  const doTrongOBoQua = boQua.filter(i => has(i) && ex[i] !== 0);',
  '  const doTrongOBoQua = [];']];
// Hoàn nguyên fail-OPEN của vế hai (rà cuối 12/09/2026, Important 2).
const TIEM_FAIL_OPEN = [[CORE_REL,
  '  if (reportText == null) return { xungDot: [], khongDoiChieuDuoc: skipped.slice() };',
  '  if (reportText == null) return { xungDot: [], khongDoiChieuDuoc: [] };']];

test('L01', 'hai bên trả CÙNG một tập id', () => {
  const text = evalsYaml([{ id: 'E1' }, { id: 'E2', status: 'not-run' }, { id: 'E3', executor: 'test' }]);
  const kho = dungKhoTam({ evals: text });                  // helper ở Step 2
  const benDoc = core.machineEvalIds(text);
  const benGhi = Object.keys(chayLan(kho, ['E1','E2','E3']).slugs.s1.evals_exit);
  if (benDoc.join(',') !== benGhi.join(',')) fail(`L01 hai bên trả tập khác nhau — đọc=[${benDoc}] ghi=[${benGhi}]`);
  if (benDoc.includes('E2')) fail('L01 ô khai không-chạy vẫn nằm trong tập');
}, [
  { pin: 'hai bên trả tập khác nhau', make: (c) => tiemBoMay(TIEM_BEN_GHI, c) },
]);

test('L02', 'ô khai không-chạy KHÔNG được thi hành', () => {
  const kho = dungKhoTam({ danhDau: true });                 // cmd của ô ghi một tệp dấu
  const r = chayLan(kho, []);
  if (r.exit !== 0) fail(`L02 làn phải xanh, nhận exit ${r.exit}`);
  if (fs.existsSync(kho.tepDau)) fail('L02 ô không-chạy ĐÃ BỊ THI HÀNH — tệp dấu tồn tại');
  const kho2 = dungKhoTam({ danhDau: true, goStatus: true }); // đối chứng dương
  chayLan(kho2, []);
  if (!fs.existsSync(kho2.tepDau)) fail('L02 đối chứng dương hỏng: gỡ lời khai mà ô vẫn không chạy — ca không phân biệt được gì');
}, [
  { pin: 'ĐÃ BỊ THI HÀNH', make: (c) => tiemBoMay(TIEM_BEN_GHI, c) },
]);

test('L03', 'bên đọc nhận pin thiếu id đã khai, vẫn chặn id CHẠY ĐƯỢC bị thiếu', () => {
  // Fixture = ĐÚNG fixture của AC-2 (`danhDau`: E1 chạy được + E2 khai
  // không-chạy) vì AC-3 khai Given là «dòng pin do làn AC-2 ghi». Bản trước
  // dùng fixture mặc định (chỉ E1, không ô nào khai không-chạy), nên vế «pin
  // thiếu id đã khai vẫn được nhận» KHÔNG có id nào bị thiếu để mà nhận — ca
  // xanh cả khi bộ lọc `status` của bên đọc bị hoàn nguyên (rà cuối 12/09/2026).
  const kho = dungKhoTam({ danhDau: true });
  const w = chayLan(kho, [], { write: true });
  if (w.exit !== 0) fail(`L03 lượt ghi phải xanh (đối chứng dương của bên đọc cần một pin THẬT hợp lệ), nhận exit ${w.exit}: ${w.stderr}`);
  let rc = '';
  try {
    rc = execFileSync(process.execPath, [path.join(ROOT, 'scripts', 'recheck-evidence.cjs'), path.join(kho.dir, '_acceptance', 's1', 'evidence-report.md')], { encoding: 'utf8' });
  } catch (e) { rc = String(e.stdout || '') + String(e.stderr || ''); }
  if (/lacks eval/.test(rc)) fail(`L03 pin hợp lệ bị báo thiếu id: ${rc}`);
  const thieuThat = core.checkRepinEvals(pinThieu('E1', kho), docEvals(kho), 's1', docReport(kho)).errs;
  if (!thieuThat.some(e => e.includes('E1'))) fail('L03 đối chứng dương hỏng: thiếu id CHẠY ĐƯỢC mà bên đọc im');
}, [
  { pin: 'lacks eval', make: (c) => tiemBoMay(TIEM_BEN_DOC, c) },
]);

test('L06', 'pin nói ra ô không đo ở CẢ HAI chỗ', () => {
  const kho = dungKhoTam({ danhDau: true });        // E2 tự khai status: not-run
  const w1 = chayLan(kho, [], { write: true });
  if (w1.exit !== 0) fail(`L06 lượt ghi (E2 khai không-chạy) phải xanh tuyệt đối, nhận exit ${w1.exit}: ${w1.stderr}`);
  const dong = JSON.parse(docDongCuoi(kho, 'run-log.jsonl'));
  if (JSON.stringify(dong.evals_not_run) !== JSON.stringify(['E2'])) fail(`L06 khoá JSON sai: ${JSON.stringify(dong.evals_not_run)}`);
  const rep = docReport(kho);
  if (!/· không chạy theo hồ sơ: E2/.test(rep)) fail('L06 dòng sha thiếu hậu tố nói-ra');
  const sach = dungKhoTam({});                       // hồ sơ mặc định: 0 ô khai không-chạy
  const w2 = chayLan(sach, [], { write: true });
  if (w2.exit !== 0) fail(`L06 lượt ghi (0 ô khai không-chạy) phải xanh tuyệt đối, nhận exit ${w2.exit}: ${w2.stderr}`);
  const d2 = JSON.parse(docDongCuoi(sach, 'run-log.jsonl'));
  if ('evals_not_run' in d2) fail('L06 hồ sơ không có ô nào mà pin vẫn mang khoá');
  if (/không chạy theo hồ sơ/.test(docReport(sach))) fail('L06 hậu tố xuất hiện khi không có ô nào');
}, [
  { pin: 'thiếu hậu tố nói-ra', make: (c) => tiemBoMay(TIEM_BO_HAU_TO, c) },
]);

test('L04', 'khai không-chạy mà báo cáo đã ký có mã thoát → dừng, chưa ghi byte nào', () => {
  const kho = dungKhoTam({ xungDot: true });   // báo cáo có khối `- eval: E2` + `exit_code: 0`
  const truoc = bam(kho);                       // băm run-log.jsonl + evidence-report.md TRƯỚC
  const r = chayLan(kho, [], { write: true });
  if (r.exit !== 2) fail(`L04 phải thoát 2, nhận ${r.exit}`);
  for (const can of ['s1', 'E2', 'không-chạy', 'báo cáo đã ký']) {
    if (!r.stderr.includes(can)) fail(`L04 thông điệp thiếu «${can}»: ${r.stderr.slice(0, 200)}`);
  }
  if (bam(kho) !== truoc) fail('L04 đã ghi byte trước khi dừng');
  if (themTepMoi(kho)) fail('L04 để lại tệp mới trong thư mục hồ sơ');
  // đối chứng dương: một lượt XANH thật sự PHẢI đổi băm — thiếu chân này thì
  // "băm giống nhau" không phân biệt được "không ghi" với "không chạy gì cả".
  const lanh = dungKhoTam({});
  const b0 = bam(lanh);
  const rLanh = chayLan(lanh, [], { write: true });
  if (bam(lanh) === b0) fail('L04 đối chứng dương hỏng: lượt xanh không đổi băm — băm-giống-nhau không chứng được gì');
  // Vòng sửa 1 (12/09/2026): "tệp có đổi" không chứng được "làn tự kiểm xong
  // xanh" — recheck-evidence.cjs BÊN TRONG làn có thể đỏ (SHAPE/PROVENANCE)
  // sau khi đã ghi, và trước đây không ca nào kiểm mã thoát của chính lượt
  // --write này. Nay đòi exit 0 tuyệt đối.
  if (rLanh.exit !== 0) fail(`L04 đối chứng dương: lượt --write phải xanh TUYỆT ĐỐI (recheck-evidence xong xanh), nhận exit ${rLanh.exit}: ${rLanh.stderr}`);
  // bên ĐỌC (checkRepinEvals) độc lập với làn cũng phải bắt xung đột này —
  // hai điểm chạm cùng một luật (readSignedReportFor / notRunConflicts).
  const ws = path.join(kho.dir, '_acceptance', 's1');
  const evalsXungDot = fs.readFileSync(path.join(ws, 'evals.yaml'), 'utf8');
  const baoCaoXungDot = fs.readFileSync(path.join(ws, 'evidence-report.md'), 'utf8');
  const errs = core.checkRepinEvals(dongPinThieuE2(kho), evalsXungDot, 's1', baoCaoXungDot).errs;
  if (!errs.some(e => e.includes('E2'))) fail('L04 bên đọc im lặng trước xung đột');
}, [
  { pin: 'L04 phải thoát 2', make: (c) => tiemBoMay(TIEM_BO_VE_HAI, c) },
]);

test('L09', 'chuẩn hoá bảy hình dạng lời khai', () => {
  const DANG = [
    ['not-run', true], ['"not-run"', true], ["'not-run'", true],
    ['NOT-RUN', true], ['Not-Run', true], ['  not-run  ', true],
    ['not_run', false],
  ];
  // Phép đếm phải có MỘT hằng số NGOÀI bảng (minor rà cuối 12/09/2026): `n`
  // chỉ tăng trong đúng vòng lặp tiêu thụ `DANG`, nên `n === DANG.length` là
  // tautology — bảng bị làm rỗng thì cả hai bằng 0 và ca vẫn xanh. AC-9 khai
  // BẢY hình dạng: ghim 7 ở đây, ngoài bảng.
  const SO_DANG_KHAI = 7;   // AC-9: trơn · nháy kép · nháy đơn · HOA · Hoa chữ đầu · thừa khoảng trắng · gạch dưới
  if (DANG.length !== SO_DANG_KHAI) fail(`L09 bảng ca lệch bản khai: hợp đồng khai ${SO_DANG_KHAI} hình dạng, bảng có ${DANG.length}`);
  let n = 0;
  for (const [raw, phaiLoai] of DANG) {
    const text = evalsYaml([{ id: 'E1' }, { id: 'E2', status: raw }]);
    const ids = core.machineEvalIds(text);
    const biLoai = !ids.includes('E2');
    if (biLoai !== phaiLoai) fail(`L09 dạng ${JSON.stringify(raw)}: phải ${phaiLoai ? 'BỊ LOẠI' : 'GIỮ'} mà không — ids=${ids.join(',')}`);
    n++;
  }
  if (n !== SO_DANG_KHAI) fail(`L09 số ô lệch: chạy ${n}, hợp đồng khai ${SO_DANG_KHAI}`);
}, [
  { pin: 'phải BỊ LOẠI', make: (c) => tiemBoMay(TIEM_KHONG_CHUAN_HOA, c) },
]);

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
}, [
  { pin: 'tập id phải còn 2', make: (c) => tiemBoMay(TIEM_QUET_THEO_DONG, c) },
]);

// ── Task 5: đường đọc-cũ — bản TRƯỚC vá do WRITER THẬT của nó ghi ─────────
// Ruling coordinator 12/09/2026 (progress.md của hồ sơ này): kế hoạch gốc viết
// mốc bản base là `git rev-parse HEAD~5` — SỐ TƯƠNG ĐỐI trôi theo mỗi commit
// của chính vòng này, đúng lớp lỗi mà vòng này đi đóng (bất biến CLAUDE.md
// "thước phải gắn vào vật được giao").
//
// Mốc PHẢI là SHA TUYỆT ĐỐI (rà cuối toàn nhánh 12/09/2026 — controller tự nhận
// một phán quyết SAI): bản trước đó dùng `git merge-base main HEAD`, tức MỘT
// MỆNH ĐỀ VỀ HÌNH DẠNG LỊCH SỬ, nên nó vẫn TRÔI — chỉ trôi theo chiều khác.
// Sau khi nhánh này GỘP, `main == HEAD` và merge-base CHÍNH LÀ bản đã mang vá:
// phép tự kiểm dưới nổ, và suite thường trực của main đỏ (mô phỏng thật:
// 865 passed, 1 failed). Một mốc bất biến là hằng số ghim cứng, đúng tiền lệ
// MOC_CU/MOC_LAI (`0b5c5b37`/`04069351`) của tests/scripts/repin-lane-lop-cu.test.mjs.
// Tự kiểm BẮT BUỘC trước khi tin: bản base phải KHÔNG chứa `isRepinMachineEval`
// (hàm Task 1 thêm) — mốc bị ai đó đổi sang một bản đã có hàm mới thì ca DỪNG,
// không lặng lẽ mất nghĩa phân biệt.
const MOC_TRUOC_VA = '9509a81e';  // điểm nhánh feat/lan-doc-status-not-run — bản TRƯỚC mọi commit của vòng này
let _banBase = null;
function dungBanBase() {
  if (_banBase) return _banBase;
  const sha = MOC_TRUOC_VA;
  const dir = fs.mkdtempSync(path.join(TMP, 'lsnr-base-'));
  // Mốc vắng (clone nông, fetch-depth khác 0) → ĐỎ CÓ TÊN, không đỏ vì `git
  // archive` thất bại với một dòng khó đọc — cùng nếp với layerAt() của
  // tests/scripts/repin-lane-lop-cu.test.mjs.
  {
    const co = execFileSync('git', ['-C', SELF_ROOT, 'cat-file', '-t', `${sha}^{commit}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
    if (co !== 'commit') fail(`L05 mốc bản base ${sha} không phải commit (nhận «${co}») — cần lịch sử git đầy đủ (fetch-depth: 0)`);
  }
  // TRỌN thư mục (lib scripts feature-loop), không danh sách file tay — một
  // bản base thiếu file thì đỏ vì HẠ TẦNG chứ không vì vật (bài học P150,
  // CLAUDE.md "thước phải gắn vào vật được giao").
  execFileSync('sh', ['-c', `git -C ${SELF_ROOT} archive ${sha} lib scripts feature-loop | tar -x -C ${dir}`]);
  let dong = [];
  try { dong = execFileSync('grep', ['-rn', 'isRepinMachineEval', dir], { encoding: 'utf8' }).split('\n').filter(Boolean); }
  catch (e) { if (e.status !== 1) throw e; /* grep: 0 dòng khớp — đúng như mong đợi */ }
  if (dong.length) fail(`L05 tự kiểm bản base ${sha} THẤT BẠI: isRepinMachineEval xuất hiện ${dong.length} lần — điểm nhánh đã mang vá, mốc không còn "trước vòng này"; DỪNG, không tin bản base này`);
  _banBase = { dir, sha };
  return _banBase;
}

// Chạy repin-lane.mjs CỦA MỘT BẢN CỤ THỂ (baseDir) — tổng quát hoá chayLan()
// ở trên (hardcode LANE/ROOT của bản hiện tại) để gọi được writer của bản
// base mà không đụng chayLan/ca cũ.
function chayLanBan(baseDir, kho, opts) {
  opts = opts || {};
  const lane = path.join(baseDir, 'feature-loop', 'scripts', 'repin-lane.mjs');
  const args = [lane, '--root', kho.dir, '--slug', 's1', '--ag-root', baseDir, '--reason', 'pin cũ'];
  if (opts.write) args.push('--write');
  let exit = 0; let stdout = ''; let stderr = '';
  try { stdout = execFileSync(process.execPath, args, { encoding: 'utf8' }); }
  catch (e) { exit = e.status == null ? 1 : e.status; stdout = e.stdout || ''; stderr = e.stderr || ''; }
  let parsed = {};
  try { parsed = JSON.parse(stdout); } catch (_) { /* làn chết trước khi in JSON */ }
  return { exit, stderr, ...parsed };
}

// Quét TRỌN corpus `_acceptance/*` dưới `accDir` bằng `node <recheckScript>
// <report>` cho MỖI hồ sơ có evidence-report.md — lối tương đương của
// `recheck-evidence.cjs --all` (cờ đó không tồn tại; script chỉ nhận MỘT
// đường dẫn một lượt). Trả `{ soDaCham, viPham }` thay vì ném ở hồ sơ đỏ đầu
// tiên, để ca so sánh được TẬP TÊN giữa hai lượt (bản base / bản hiện tại).
function quetKho(recheckScript, accDir) {
  const daCham = [];
  const viPham = [];
  for (const slug of fs.readdirSync(accDir).sort()) {
    const rp = path.join(accDir, slug, 'evidence-report.md');
    if (!fs.existsSync(rp)) continue;
    daCham.push(slug);
    try { execFileSync(process.execPath, [recheckScript, rp], { encoding: 'utf8' }); }
    catch (_) { viPham.push(slug); }
  }
  return { soDaCham: daCham.length, viPham };
}

// Tìm ĐỘNG (không hardcode tên slug — corpus đổi theo thời gian) một hồ sơ
// thật có dòng repin (kind:'repin', sha === verified_commit, được `### Re-pin`
// trích run_id) mang evals_exit ≥ 1 khoá — ứng viên cho mũi tiêm "thiếu id
// của ô CHẠY ĐƯỢC". Cùng biểu thức chính quy với recheck-evidence.cjs (đọc
// dòng run_id trong section), không phát minh luật đọc thứ hai.
function timUngVienDeTiem(accDir) {
  const secRe = /^###\s+Re-pin\b[^\n]*\n([\s\S]*?)(?=\n#{1,3}\s|$(?![\s\S]))/gm;
  for (const slug of fs.readdirSync(accDir).sort()) {
    const rp = path.join(accDir, slug, 'evidence-report.md');
    const lp = path.join(accDir, slug, 'run-log.jsonl');
    if (!fs.existsSync(rp) || !fs.existsSync(lp)) continue;
    const payload = fs.readFileSync(rp, 'utf8');
    if (!core.determineEnforce(payload)) continue;
    const vcm = payload.match(/^verified_commit\s*:\s*(\S+)/m);
    const vc = vcm ? vcm[1] : '';
    if (!vc) continue;
    const cited = [];
    let m; secRe.lastIndex = 0;
    while ((m = secRe.exec(payload)) !== null) {
      for (const im of m[1].matchAll(/^\s*run_id\s*[:=]\s*([^\s·,]+)/gim)) cited.push(im[1]);
    }
    if (!cited.length) continue;
    for (const l of fs.readFileSync(lp, 'utf8').split('\n').filter(Boolean)) {
      let e; try { e = JSON.parse(l); } catch (_) { continue; }
      if (e && e.kind === 'repin' && cited.includes(e.run_id) && e.sha === vc && e.evals_exit && Object.keys(e.evals_exit).length) {
        return { slug, runId: e.run_id, idBoQua: Object.keys(e.evals_exit)[0] };
      }
    }
  }
  return null;
}

// Sửa ĐÚNG MỘT dòng repin (khớp run_id) trong run-log.jsonl của `slug` dưới
// `accDir`: xoá `idBoQua` khỏi evals_exit — mũi tiêm "thiếu id của ô CHẠY
// ĐƯỢC", không đụng dòng nào khác trong tệp.
function tiemThieuId(accDir, slug, runId, idBoQua) {
  const lp = path.join(accDir, slug, 'run-log.jsonl');
  const moi = fs.readFileSync(lp, 'utf8').split('\n').map(l => {
    if (!l) return l;
    let e; try { e = JSON.parse(l); } catch (_) { return l; }
    if (!(e && e.kind === 'repin' && e.run_id === runId)) return l;
    const ex = { ...e.evals_exit };
    delete ex[idBoQua];
    return JSON.stringify({ ...e, evals_exit: ex });
  });
  fs.writeFileSync(lp, moi.join('\n'));
}

test('L05', 'pin CŨ do writer thật (bản trước vá) ghi vẫn xanh với bên đọc mới; corpus hiện có không hồ sơ nào hoá đỏ', () => {
  // ── Vế 1: writer THẬT của bản base ghi, bên đọc MỚI chấm ────────────────
  const { dir: base, sha: baseSha } = dungBanBase();
  const kho = dungKhoTam({});   // fixture mặc định: MỘT eval máy (E1), không
                                 // status — bản base không hiểu lời khai đó
  const w = chayLanBan(base, kho, { write: true });
  if (w.exit !== 0) fail(`L05 writer bản base ${baseSha} ghi thất bại, nhận exit ${w.exit}: ${w.stderr}`);
  const dongCu = docDongCuoi(kho, 'run-log.jsonl');
  const errsMoi = core.checkRepinEvals(JSON.parse(dongCu), docEvals(kho), 's1', docReport(kho)).errs;
  if (errsMoi.length) fail(`L05 bên đọc MỚI từ chối pin cũ do writer bản base ${baseSha} ghi: ${errsMoi.join(' | ')}`);
  const coreCu = require(path.join(base, 'lib', 'evidence-core.cjs'));
  const errsCu = coreCu.checkRepinEvals(JSON.parse(dongCu), docEvals(kho), 's1', docReport(kho)).errs;
  if (errsCu.length) fail(`L05 đối chứng dương hỏng: bên đọc CŨ cũng từ chối pin của chính nó — ${errsCu.join(' | ')}`);

  // ── Vế 2: «không hồ sơ nào hoá đỏ» — ghim BA thứ trên corpus thật ───────
  const accDir = path.join(SELF_ROOT, '_acceptance');
  const quetBase = quetKho(path.join(base, 'scripts', 'recheck-evidence.cjs'), accDir);
  const quetMoi = quetKho(path.join(SELF_ROOT, 'scripts', 'recheck-evidence.cjs'), accDir);
  console.log(`  L05: lượt bản base chấm ${quetBase.soDaCham} hồ sơ, ${quetBase.viPham.length} vi phạm`);
  console.log(`  L05: lượt bản hiện tại chấm ${quetMoi.soDaCham} hồ sơ, ${quetMoi.viPham.length} vi phạm`);
  if (quetBase.soDaCham === 0 || quetMoi.soDaCham === 0) fail(`L05 quét corpus rỗng — base=${quetBase.soDaCham} mới=${quetMoi.soDaCham}, không chứng được gì`);
  if (quetBase.viPham.length) fail(`L05 lượt bản base hoá đỏ trên hồ sơ ĐÃ KÝ: ${quetBase.viPham.join(', ')}`);
  if (quetMoi.viPham.length) fail(`L05 lượt bản hiện tại hoá đỏ trên hồ sơ ĐÃ KÝ (bản vá làm hồ sơ cũ thành đỏ): ${quetMoi.viPham.join(', ')}`);
  const tenBase = [...quetBase.viPham].sort().join(',');
  const tenMoi = [...quetMoi.viPham].sort().join(',');
  if (tenBase !== tenMoi) fail(`L05 tập tên hồ sơ vi phạm khác nhau giữa hai lượt — base=[${tenBase}] mới=[${tenMoi}]`);

  // ── Chân dương: tiêm một pin thiếu id CHẠY ĐƯỢC → vi phạm phải TĂNG đúng 1 ──
  const corpusSaoCha = fs.mkdtempSync(path.join(TMP, 'lsnr-corpus-'));
  // basename PHẢI là `_acceptance` — core.findAcceptanceConfig tìm config.yaml
  // bằng cách so basename thư mục; đặt tên khác sẽ không thấy config.yaml và
  // đo một đường khác với bản gốc (không cùng luật).
  const corpusSao = path.join(corpusSaoCha, '_acceptance');
  fs.cpSync(accDir, corpusSao, { recursive: true });
  const quetSaoTruoc = quetKho(path.join(SELF_ROOT, 'scripts', 'recheck-evidence.cjs'), corpusSao);
  if (quetSaoTruoc.viPham.length) fail(`L05 bản sao TRƯỚC khi tiêm đã có hồ sơ đỏ (${quetSaoTruoc.viPham.join(', ')}) — không dùng làm nền so sánh được`);
  const ung = timUngVienDeTiem(corpusSao);
  if (!ung) fail('L05 không tìm được ứng viên để tiêm (hồ sơ PASS có dòng repin evals_exit ≥ 1 khoá) — corpus đổi hình dạng, cần chọn ứng viên khác');
  tiemThieuId(corpusSao, ung.slug, ung.runId, ung.idBoQua);
  const quetSaoSau = quetKho(path.join(SELF_ROOT, 'scripts', 'recheck-evidence.cjs'), corpusSao);
  if (quetSaoSau.viPham.length !== quetSaoTruoc.viPham.length + 1) fail(`L05 tiêm thiếu ${ung.idBoQua} vào ${ung.slug}: vi phạm phải TĂNG đúng 1, nhận trước=${quetSaoTruoc.viPham.length} sau=${quetSaoSau.viPham.length}`);
  if (!quetSaoSau.viPham.includes(ung.slug)) fail(`L05 tiêm vào ${ung.slug} nhưng vi phạm không gọi đúng tên hồ sơ đó — vi phạm=[${quetSaoSau.viPham.join(',')}]`);
});

// ── Task 6: hình dạng THẬT đo ở OneFlow 12/09/2026 — evals.yaml có 14 ô máy,
// MỘT ô khai `status: not-run` trỏ một lệnh mà nếu bị chạy nhầm sẽ thoát 4;
// báo cáo đã ký có đúng 13 khối eval (không khối nào cho ô kia). Fixture do
// MÃ SINH (vòng lặp dựng `rows`), cùng khuôn dungKhoTam/evalsYaml — không viết
// tay 14 dòng YAML.
function dungKhoOneFlow() {
  const dir = fs.mkdtempSync(path.join(TMP, 'kho-of-'));
  const g = (...a) => execFileSync('git', ['-C', dir, '-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  const ws = path.join(dir, '_acceptance', 's1');
  fs.mkdirSync(ws, { recursive: true });
  fs.writeFileSync(path.join(dir, '_acceptance', 'config.yaml'),
    'schema_version: 1\nfeature_loop:\n  suite_keys:\n    - executors.script.noop\nexecutors:\n  script:\n    noop: true\n');
  const rows = Array.from({ length: 13 }, (_, i) => ({ id: `E${i + 1}` }));
  rows.push({ id: 'E14', cmd: "sh -c 'exit 4'", status: 'not-run' }); // bản base chạy nhầm cái này → thoát 4
  const evalsText = evalsYaml(rows);
  fs.writeFileSync(path.join(ws, 'evals.yaml'), evalsText);
  fs.writeFileSync(path.join(ws, 'run-log.jsonl'), '');
  // 13 id CHẠY ĐƯỢC — rút bằng core.machineEvalIds trên VĂN BẢN evalsText vừa
  // ghi (bộ đọc dùng chung), KHÔNG đếm lại từ vòng lặp `rows` ở trên: đây là
  // nguồn cho khối Evidence/run-log của FIXTURE, tách khỏi phép đếm-đối-chiếu
  // trong chính ca L07 bên dưới (đọc lại evalsText một lần NỮA, độc lập).
  const runIds = core.machineEvalIds(evalsText);
  const khoiEvidence = (ids) => ids.map(id =>
    `- eval: ${id}\n  run_id: seed-${id}\n  exit_code: 0\n  verifier: config:executors.script.noop\n  verified_at: 2026-09-11\n\n`).join('');
  const evidenceBody = '---\nschema_version: 1\nfeature_slug: s1\nverdict: PASS\nverified_commit: PENDING\nhuman_signoff: t 2026-09-12\n---\n\n' +
    '## Evidence\n\n' + khoiEvidence(runIds) + '## Iterations\n\nRound 1 — PASS.\n';
  fs.writeFileSync(path.join(ws, 'evidence-report.md'), evidenceBody);
  g('init', '-q');
  g('add', '-A');
  g('commit', '-qm', 'impl');
  const sha = g('rev-parse', 'HEAD');
  const reportPath = path.join(ws, 'evidence-report.md');
  fs.writeFileSync(reportPath, fs.readFileSync(reportPath, 'utf8').replace('verified_commit: PENDING', `verified_commit: ${sha}`));
  fs.writeFileSync(path.join(ws, 'run-log.jsonl'), runIds.map(id =>
    JSON.stringify({ ts: '2026-09-11T00:00:00Z', kind: 'eval', run_id: `seed-${id}`, sha, eval: id, exit_code: 0 }) + '\n').join(''));
  g('add', '-A');
  g('commit', '-qm', 'evidence');
  return { dir, evalsText };
}

test('L07', 'hình dạng OneFlow 12/09: 14 ô máy, một ô không-chạy trỏ lệnh thoát 4', () => {
  const kho = dungKhoOneFlow();
  const w = chayLan(kho, [], { write: true });
  if (w.exit !== 0) fail(`L07 làn --write phải xanh, nhận exit ${w.exit}: ${w.stderr}`);

  // Đếm ô máy ĐANG CHẠY từ HAI NGUỒN TÁCH BIỆT (bài học P86/lưới-rỗng-L09: một
  // phép đếm chỉ tăng bên trong đúng vòng lặp đang tiêu thụ chính bảng đó
  // không bao giờ sai được) — (a) bộ đọc dùng chung trên văn bản evalsText của
  // fixture, KHÔNG phải vòng lặp đã dựng `rows` trong dungKhoOneFlow, và
  // (b) số khoá THẬT mà làn vừa GHI ra trong evals_exit — đầu ra quan sát
  // được của bên GHI, không suy diễn từ input.
  const soDoc = core.machineEvalIds(kho.evalsText).length;
  const soGhi = Object.keys(w.slugs.s1.evals_exit).length;
  if (soDoc !== soGhi) fail(`L07 số ô đọc từ fixture (${soDoc}) khác số khoá làn ghi (${soGhi})`);
  if (soGhi !== 13) fail(`L07 kỳ vọng đúng 13 khoá evals_exit (14 ô máy trừ 1 không-chạy), nhận ${soGhi}`);

  const dong = JSON.parse(docDongCuoi(kho, 'run-log.jsonl'));
  if (JSON.stringify(dong.evals_not_run) !== JSON.stringify(['E14'])) fail(`L07 khoá evals_not_run sai: ${JSON.stringify(dong.evals_not_run)}`);

  try {
    execFileSync(process.execPath, [path.join(ROOT, 'scripts', 'recheck-evidence.cjs'), path.join(kho.dir, '_acceptance', 's1', 'evidence-report.md')], { encoding: 'utf8' });
  } catch (e) { fail(`L07 recheck-evidence phải 0 lỗi, nhận exit ${e.status}: ${e.stderr || e.stdout}`); }

  // ── Chiều đỏ: CÙNG hình dạng fixture (kho MỚI, không tái dùng kho đã ghi ở
  // trên), chạy bằng bộ máy của BẢN BASE (trước vá, dungBanBase() đã tự kiểm ở
  // L05). Bản base lọc ô máy CHỈ theo executor (xem /tmp thẩm định: MACHINE =
  // Set(core.REPIN_MACHINE_EXECUTORS), không biết `status`) nên nó CHẠY cả
  // E14; cmd của E14 thoát 4, evals.yaml không khai expected_exit cho E14 nên
  // 4 ≠ 0 → làn phải ĐỎ với đúng mã 4 — đúng hình dạng đã đo ở OneFlow
  // 12/09/2026 (bản trước vá từng ghim NHẦM một hồ sơ lành thành đỏ).
  const { dir: base } = dungBanBase();
  const khoDo = dungKhoOneFlow();
  const truoc = bam(khoDo);
  const rDo = chayLanBan(base, khoDo, { write: true });
  if (rDo.exit !== 1) fail(`L07 chiều đỏ: bản base phải thoát 1 (LÀN ĐỎ), nhận ${rDo.exit}: ${rDo.stderr}`);
  if (!/LÀN ĐỎ/.test(rDo.stderr)) fail(`L07 chiều đỏ: thiếu «LÀN ĐỎ» trong thông điệp: ${rDo.stderr}`);
  if (!/s1\/E14=4/.test(rDo.stderr)) fail(`L07 chiều đỏ: thông điệp thiếu đúng mã thoát 4 cho E14: ${rDo.stderr}`);
  if (bam(khoDo) !== truoc) fail('L07 chiều đỏ: bản base đã ghi byte dù làn đỏ');
});

test('L08', 'lưới bộ lọc rỗng: LSNR_CASES không khớp ca nào → thoát 2 kèm thông điệp', () => {
  // Bộ lọc `only`/`chay` sống ở CUỐI CHÍNH tệp này (dưới) và gọi process.exit
  // ngay khi nạp module — không gọi được trong-tiến-trình mà không giết ca
  // đang chạy, nên phải SINH TIẾN TRÌNH CON thật (bài học P86: lưới cho chính
  // phép đo — nếu không tự spawn thì ca này không bao giờ chạm được nhánh
  // "khớp 0 ca" nó tuyên bố đang kiểm).
  let exit = 0;
  let stderr = '';
  try {
    execFileSync(process.execPath, [path.join(HERE, 'lan-status-not-run.test.mjs')], {
      encoding: 'utf8',
      env: { ...process.env, LSNR_CASES: 'KHONG-CO-CA-NAY' },
    });
  } catch (e) {
    exit = e.status == null ? 1 : e.status;
    stderr = e.stderr || '';
  }
  if (exit !== 2) fail(`L08 bộ lọc không khớp ca nào phải thoát 2, nhận ${exit}: ${stderr}`);
  if (!/khớp 0 ca/.test(stderr)) fail(`L08 thông điệp thiếu «khớp 0 ca»: ${stderr}`);
});

// ── Rà cuối 12/09/2026, Important 1: ô bị loại rời khỏi vòng chấm mã thoát ──
test('L11', 'mã đỏ ghi cho chính ô khai không-chạy là vi phạm, gọi tên id', () => {
  const kho = dungKhoTam({ danhDau: true });     // E1 chạy được · E2 khai không-chạy
  const evalsText = docEvals(kho);
  const rep = docReport(kho);
  const sha = execFileSync('git', ['-C', kho.dir, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const pin = (evals_exit) => ({ run_id: 'lsnr-l11-doc', sha, ts: '2026-09-12T00:00:00Z', evals_exit });
  // Đối chứng dương: ĐÚNG vật làn ghi (chỉ id chạy được, mã 0) → sạch.
  const lanh = core.checkRepinEvals(pin({ E1: 0 }), evalsText, 's1', rep).errs;
  if (lanh.length) fail(`L11 đối chứng dương hỏng: dòng pin lành bị báo — ${lanh.join(' | ')}`);
  // Vật đo: id bị loại KHÔNG còn nằm trong `ids` nên vòng chấm mã thoát không
  // soi nó; thiếu răng riêng thì một mã đỏ chống lưng pin mà 0 ai kêu.
  const mangMaDo = core.checkRepinEvals(pin({ E1: 0, E2: 4 }), evalsText, 's1', rep).errs;
  if (!mangMaDo.some(e => e.includes('E2=4') && e.includes('không được mang mã đỏ chống lưng một pin'))) {
    fail(`L11 mã đỏ cho ô khai không-chạy LỌT: ${mangMaDo.join(' | ') || 'không lỗi nào'}`);
  }
  // Đừng đỏ oan: một khoá DƯ mang mã 0 không phải mã đỏ.
  const maKhong = core.checkRepinEvals(pin({ E1: 0, E2: 0 }), evalsText, 's1', rep).errs;
  if (maKhong.length) fail(`L11 đỏ oan trên khoá dư mang mã 0: ${maKhong.join(' | ')}`);
}, [
  { pin: 'mã đỏ cho ô khai không-chạy LỌT', make: (c) => tiemBoMay(TIEM_GO_RANG_MA_DO, c) },
]);

// ── Rà cuối 12/09/2026, Important 2: vế 2 phải fail-CLOSED ─────────────────
test('L12', 'ô khai không-chạy mà không đọc được báo cáo đã ký → fail-CLOSED, có tên', () => {
  const kho = dungKhoTam({ danhDau: true });
  const evalsText = docEvals(kho);
  const pinLanh = dongPinThieuE2(kho);           // evals_exit {E1:0} — đúng vật làn ghi
  // Đối chứng dương: BỐN đối số (có báo cáo đã ký) → sạch.
  const bonDoi = core.checkRepinEvals(pinLanh, evalsText, 's1', docReport(kho)).errs;
  if (bonDoi.length) fail(`L12 đối chứng dương hỏng: gọi bốn đối số mà vẫn đỏ — ${bonDoi.join(' | ')}`);
  // Vật đo: BA đối số (bản recheck/pre-merge của repo tiêu thụ chưa chép tệp
  // mới) → không đối chiếu được vế hai, phải ĐỎ chứ không im.
  const baDoi = core.checkRepinEvals(pinLanh, evalsText, 's1').errs;
  if (!baDoi.some(e => e.includes('E2') && e.includes('không đối chiếu được vế hai'))) {
    fail(`L12 vế hai IM LẶNG khi vắng báo cáo đã ký: ${baDoi.join(' | ') || 'không lỗi nào'}`);
  }
  // Đừng đỏ oan: hồ sơ KHÔNG có ô bị loại nào, gọi ba đối số → vẫn sạch.
  const sach = dungKhoTam({});
  const sachErrs = core.checkRepinEvals(dongPinThieuE2(sach), docEvals(sach), 's1').errs;
  if (sachErrs.length) fail(`L12 đỏ oan hồ sơ không khai ô nào khi vắng báo cáo: ${sachErrs.join(' | ')}`);
}, [
  { pin: 'vế hai IM LẶNG', make: (c) => tiemBoMay(TIEM_FAIL_OPEN, c) },
]);

// ── Lưới hai chiều: bộ máy dựng bản sao bị tiêm + ca meta ──────────────────
// Ca KHÔNG có mũi tiêm phải khai lý do ở đây; mảng rỗng im lặng là thứ L13 bắt.
const MIEN_MUI_TIEM = {
  L05: 'chiều đỏ NỘI TẠI: ca tự dựng bộ máy bản base THẬT (dungBanBase, mốc 9509a81e) rồi chấm bằng cả bên đọc cũ lẫn mới, và tự tiêm một pin thiếu id vào bản sao corpus — một mũi tiêm ngoài sẽ đo lại đúng thứ đó với giá hai lượt quét 63 hồ sơ.',
  L07: 'chiều đỏ NỘI TẠI: ca chạy CÙNG fixture bằng bộ máy bản base và ghim «LÀN ĐỎ … s1/E14=4» + khẳng định không ghi byte nào.',
  L08: 'đo bộ lọc ca của CHÍNH tệp này, không đi qua bộ máy dưới LSNR_ROOT — mũi tiêm phải sửa tệp ca, và đó chính là hình dạng mũi tiêm của L13.',
};
// Bản sao bộ máy (lib/ · scripts/ · feature-loop/) với MỘT chỗ bị sửa. Mỗi mũi
// tiêm phải khớp ĐÚNG MỘT lần và bản sao phải qua `node --check` — nếu không,
// ca đỏ vì HẠ TẦNG có tên thay vì đỏ lặng (bài học P150).
function dungCayTiem(tiem) {
  const dir = fs.mkdtempSync(path.join(TMP, 'lsnr-tiem-'));
  for (const d of ['lib', 'scripts', 'feature-loop']) fs.cpSync(path.join(SELF_ROOT, d), path.join(dir, d), { recursive: true });
  for (const [rel, truoc, sau] of tiem) {
    const f = path.join(dir, rel);
    const goc = fs.readFileSync(f, 'utf8');
    const lan = goc.split(truoc).length - 1;
    if (lan !== 1) fail(`mũi tiêm vào ${rel} khớp ${lan} lần (cần đúng 1) — chuỗi neo đã trôi khỏi vật, sửa mũi tiêm chứ đừng tin màu xanh`);
    const moi = goc.replace(truoc, sau);
    if (moi === goc) fail(`mũi tiêm vào ${rel} không đổi byte nào — mũi tiêm no-op không phân biệt được gì`);
    fs.writeFileSync(f, moi);
    try { execFileSync(process.execPath, ['--check', f], { stdio: ['ignore', 'pipe', 'pipe'] }); }
    catch (e) { fail(`bản tiêm ${rel} không qua node --check: ${String(e.stderr || e.message).split('\n').slice(0, 3).join(' ')}`); }
  }
  return dir;
}
// Mũi tiêm BỘ MÁY: tiến trình con chạy CHÍNH tệp ca này, đúng MỘT ca, trong cây
// đã tiêm (LSNR_ROOT). LSNR_TIEM=1 để tiến trình con không dựng mũi tiêm nữa.
function tiemBoMay(tiem, c) {
  return { file: SELF_FILE, env: { LSNR_ROOT: dungCayTiem(tiem), LSNR_CASES: c.id, LSNR_TIEM: '1' } };
}
// Mũi tiêm TỆP CA: bản sao chính tệp này (đặt dưới TMP nên ROOT phải trỏ lại
// bằng LSNR_ROOT), chạy ở chế độ kiểm mũi tiêm.
function tiemTepCa(truoc, sau) {
  const f = path.join(fs.mkdtempSync(path.join(TMP, 'lsnr-ca-')), 'ban-tiem.mjs');
  const goc = fs.readFileSync(SELF_FILE, 'utf8');
  const lan = goc.split(truoc).length - 1;
  if (lan !== 1) fail(`mũi tiêm vào tệp ca khớp ${lan} lần (cần đúng 1) — chuỗi neo đã trôi`);
  fs.writeFileSync(f, goc.replace(truoc, sau));
  return { file: f, env: { LSNR_ROOT: SELF_ROOT, LSNR_MUI_TIEM: '1', LSNR_TIEM: '1' } };
}
function chayMuiTiem(c) {
  for (const m of c.muiTiem) {
    const { file, env } = m.make(c);
    const r = (() => {
      try { return { status: 0, out: execFileSync(process.execPath, [file], { encoding: 'utf8', env: { ...process.env, ...env }, stdio: ['ignore', 'pipe', 'pipe'] }) }; }
      catch (e) { return { status: e.status == null ? 1 : e.status, out: String(e.stdout || '') + String(e.stderr || '') }; }
    })();
    if (r.status === 0) fail(`${c.id} chiều đỏ «${m.pin}»: bản tiêm vẫn XANH — phép đo không phân biệt được gì`);
    if (!r.out.includes(m.pin)) fail(`${c.id} chiều đỏ ĐỎ SAI LÝ DO: thiếu ghim «${m.pin}» trong:\n${r.out.slice(-700)}`);
    process.stdout.write(`    · ${c.id} chiều đỏ: bản tiêm ĐỎ, ghim «${m.pin}»\n`);
  }
}

test('L13', 'ca meta: mọi ca phải có mũi tiêm hoặc một dòng lý do miễn — mảng rỗng không lọt qua lặng lẽ', () => {
  const chay = (file, env) => {
    try { return { status: 0, out: execFileSync(process.execPath, [file], { encoding: 'utf8', env: { ...process.env, ...env }, stdio: ['ignore', 'pipe', 'pipe'] }) }; }
    catch (e) { return { status: e.status == null ? 1 : e.status, out: String(e.stdout || '') + String(e.stderr || '') }; }
  };
  // Vật thật: mọi ca hiện có (kể cả L13) đủ mũi tiêm hoặc có lý do miễn.
  const that = chay(SELF_FILE, { LSNR_MUI_TIEM: '1', LSNR_TIEM: '1' });
  if (that.status !== 0) fail(`L13 vật thật đỏ (exit ${that.status}): ${that.out.slice(-400)}`);
}, [
  {
    // Bản sao: MỘT ca (L11) bị làm rỗng mũi tiêm — ca meta PHẢI đỏ, gọi đúng tên.
    pin: 'không có mũi tiêm và không khai miễn: L11',
    make: () => tiemTepCa(
      "}, [\n  { pin: 'mã đỏ cho ô khai không-chạy LỌT', make: (c) => tiemBoMay(TIEM_GO_RANG_MA_DO, c) },\n]);",
      '}, []);',
    ),
  },
]);

// Chế độ kiểm mũi tiêm — đặt SAU mọi lượt `test(...)` để CASES đã đầy đủ (kể cả
// L13 tự soi chính nó), và THOÁT trước vòng chạy ca thường để bản sao tệp ca
// không đệ quy vào bộ chạy.
if (process.env.LSNR_MUI_TIEM) {
  const loi = [];
  const thieu = CASES.filter(c => !c.muiTiem.length && !MIEN_MUI_TIEM[c.id]).map(c => c.id);
  if (thieu.length) loi.push(`ca không có mũi tiêm và không khai miễn: ${thieu.join(',')}`);
  const mienSuong = Object.entries(MIEN_MUI_TIEM).filter(([, ly]) => String(ly || '').trim().length < 40).map(([id]) => id);
  if (mienSuong.length) loi.push(`ca khai miễn mà lý do rỗng/quá ngắn: ${mienSuong.join(',')}`);
  const mienLa = Object.keys(MIEN_MUI_TIEM).filter(id => !CASES.some(c => c.id === id));
  if (mienLa.length) loi.push(`khai miễn cho ca không tồn tại: ${mienLa.join(',')}`);
  const mienMaCoTiem = CASES.filter(c => c.muiTiem.length && MIEN_MUI_TIEM[c.id]).map(c => c.id);
  if (mienMaCoTiem.length) loi.push(`ca vừa khai miễn vừa có mũi tiêm (lý do miễn đã hết đúng): ${mienMaCoTiem.join(',')}`);
  if (loi.length) { console.error(`LSNR_MUI_TIEM: ${loi.join(' | ')}`); process.exit(1); }
  console.log(`LSNR_MUI_TIEM: ${CASES.filter(c => c.muiTiem.length).length} ca có mũi tiêm, ${Object.keys(MIEN_MUI_TIEM).length} ca miễn có lý do`);
  process.exit(0);
}

const only = (process.env.LSNR_CASES || '').split(/[,\s]+/).filter(Boolean);
const chay = only.length ? CASES.filter(c => only.includes(c.id)) : CASES;
if (!chay.length) { console.error(`lan-status-not-run: bộ lọc LSNR_CASES=${process.env.LSNR_CASES} khớp 0 ca — không có gì chạy`); process.exit(2); }
const LA_BAN_TIEM = !!process.env.LSNR_TIEM;   // tiến trình con: chạy ca, KHÔNG dựng mũi tiêm (đệ quy)
let ok = 0;
for (const c of chay) {
  try {
    c.fn();
    if (!LA_BAN_TIEM) chayMuiTiem(c);
    ok++; console.log(`  ✓ ${c.id} ${c.name}`);
  } catch (e) { console.error(`  ✗ ${c.id} ${c.name}\n    ${e.message}`); process.exit(1); }
}
console.log(`lan-status-not-run: ${ok}/${chay.length} ca xanh`);
