// l1-khoi.test.mjs — L1 CONSISTENCY quét theo KHỐI, không quét trọn báo cáo
// (hồ sơ eval-khai-ma-thoat-mong-doi, task 4, AC-9).
//
// Bốn hình dạng phải phân biệt được — mỗi ca đổi ĐÚNG MỘT biến so với ca (a):
//   (a) mã khác 0 TRONG khối của eval đã khai đúng mã       -> KHÔNG vi phạm
//   (b) cùng khối, đổi MÃ                                    -> vi phạm, nêu tên eval
//   (c) mã khác 0 đặt NGOÀI mọi khối eval                    -> vi phạm như cũ
//   (d) mã khác 0 trong khối của eval KHÔNG khai              -> vi phạm
// Cộng: nới điều kiện hình dạng HAS_EXIT_ZERO, fail-closed khi evals.yaml khai
// sai, fail-closed khi không có fileDir, và một ca đi TRỌN qua
// scripts/recheck-evidence.cjs thật (nghĩa vụ riêng — đường đầu-cuối phải có
// người đo được, không chỉ unit test gọi thẳng evaluateEvidence).
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const CORE = require(path.join(ROOT, 'lib', 'evidence-core.cjs'));
const RECHECK = path.join(ROOT, 'scripts', 'recheck-evidence.cjs');

let pass = 0, fail = 0;
const ok = (id, m) => { console.log(`  PASS: ${id} ${m}`); pass++; };
const bad = (id, m) => { console.log(`  DO: ${id} ${m}`); fail++; };
const t = (id, cond, m) => cond ? ok(id, m) : bad(id, m);

// ─── fixture dựng workspace tối thiểu: _acceptance/<slug>/{evals.yaml} ─────
function mkWorkspace(evalsYamlText) {
  const root = mkdtempSync(path.join(tmpdir(), 'l1-khoi-'));
  const dir = path.join(root, '_acceptance', 'l1k');
  mkdirSync(dir, { recursive: true });
  if (evalsYamlText !== null) writeFileSync(path.join(dir, 'evals.yaml'), evalsYamlText);
  return { root, dir };
}

const EVALS_OK = `schema_version: 1\nslug: l1k\n\nevals:\n` +
  `  - id: E1\n    executor: script\n    cmd: x\n    expected_exit: 2\n` +
  `  - id: E2\n    executor: script\n    cmd: y\n`; // E2 không khai -> kỳ vọng 0

// ═══ Bốn hình dạng, mỗi ca đổi ĐÚNG MỘT biến so với ca (a) ═════════════════

// (a) mã khác 0 TRONG khối của eval đã khai đúng mã -> KHÔNG vi phạm.
{
  const { dir } = mkWorkspace(EVALS_OK);
  const payload = `---\nverdict: PASS\n---\n\n## Evidence\n- eval: E1\n  run_id: r-001\n  exit_code: 2\n  verifier: x\n  verified_at: 2026-01-01\n`;
  const r = CORE.evaluateEvidence(payload, { fileDir: dir });
  t('L1K-a', r.consistencyFailure === null, `ca (a) phải KHÔNG vi phạm, được: ${r.consistencyFailure}`);
}

// (b) đổi ĐÚNG mã trong khối sang một mã khác (2 -> 3) -> vi phạm, nêu tên eval.
{
  const { dir } = mkWorkspace(EVALS_OK);
  const payload = `---\nverdict: PASS\n---\n\n## Evidence\n- eval: E1\n  run_id: r-001\n  exit_code: 3\n  verifier: x\n  verified_at: 2026-01-01\n`;
  const r = CORE.evaluateEvidence(payload, { fileDir: dir });
  t('L1K-b', r.consistencyFailure !== null && r.consistencyFailure.includes('E1') && r.consistencyFailure.includes('mã 3') && r.consistencyFailure.includes('khai 2'),
    `ca (b) phải vi phạm và nêu tên eval + mã lệch, được: ${r.consistencyFailure}`);
}

// (c) đổi ĐÚNG chỗ đặt: mã khác 0 ra NGOÀI mọi khối eval -> vi phạm như cũ.
{
  const { dir } = mkWorkspace(EVALS_OK);
  const payload = `---\nverdict: PASS\n---\n\nghi chú tay: exit_code: 2\n\n## Evidence\n- eval: E1\n  run_id: r-001\n  exit_code: 0\n  verifier: x\n  verified_at: 2026-01-01\n`;
  const r = CORE.evaluateEvidence(payload, { fileDir: dir });
  t('L1K-c', r.consistencyFailure !== null && r.consistencyFailure.includes('ngoài mọi khối eval'),
    `ca (c) phải vi phạm nêu "ngoài mọi khối eval", được: ${r.consistencyFailure}`);
}

// (d) đổi ĐÚNG eval id: mã khác 0 trong khối của eval KHÔNG khai (E2) -> vi phạm.
{
  const { dir } = mkWorkspace(EVALS_OK);
  const payload = `---\nverdict: PASS\n---\n\n## Evidence\n- eval: E2\n  run_id: r-002\n  exit_code: 4\n  verifier: x\n  verified_at: 2026-01-01\n`;
  const r = CORE.evaluateEvidence(payload, { fileDir: dir });
  // E2 xuất hiện trong evals.yaml (không khai expected_exit -> kỳ vọng ngầm
  // 0) nên declared.has('E2') là true — đúng ý nghĩa (Phát hiện 2) là "khai
  // 0", không phải "chưa khai" (chuỗi đó dành riêng cho một eval id KHÔNG hề
  // xuất hiện trong evals.yaml, xem ca L1K-unknown-id bên dưới).
  t('L1K-d', r.consistencyFailure !== null && r.consistencyFailure.includes('E2') && r.consistencyFailure.includes('khai 0'),
    `ca (d) phải vi phạm nêu "khai 0", được: ${r.consistencyFailure}`);
}

// (d+) đối chứng cho "chưa khai" thật: eval id KHÔNG xuất hiện trong
// evals.yaml (không phải chỉ thiếu expected_exit như E2 ở trên) -> declared
// không có entry nào cho nó -> "chưa khai" đúng nghĩa.
{
  const { dir } = mkWorkspace(EVALS_OK);
  const payload = `---\nverdict: PASS\n---\n\n## Evidence\n- eval: E404\n  run_id: r-404\n  exit_code: 9\n  verifier: x\n  verified_at: 2026-01-01\n`;
  const r = CORE.evaluateEvidence(payload, { fileDir: dir });
  t('L1K-unknown-id', r.consistencyFailure !== null && r.consistencyFailure.includes('E404') && r.consistencyFailure.includes('chưa khai'),
    `eval id không có trong evals.yaml phải nêu "chưa khai" đúng nghĩa, được: ${r.consistencyFailure}`);
}

// ═══ Phát hiện 2: declared.has(id) chứ KHÔNG declared.get(id) truthy ═══════
// Một eval khai TƯỜNG MINH expected_exit: 0 phải đọc ra "khai 0" khi trượt —
// giá trị 0 là falsy nên phép kiểm cũ (declared.has(x) && declared.get(x))
// đọc nhầm nó thành "chưa khai".
{
  const evalsYaml = `schema_version: 1\nslug: l1k\n\nevals:\n` +
    `  - id: E3\n    executor: script\n    cmd: z\n    expected_exit: 0\n`;
  const { dir } = mkWorkspace(evalsYaml);
  const payload = `---\nverdict: PASS\n---\n\n## Evidence\n- eval: E3\n  run_id: r-003\n  exit_code: 7\n  verifier: x\n  verified_at: 2026-01-01\n`;
  const r = CORE.evaluateEvidence(payload, { fileDir: dir });
  t('L1K-explicit-zero', r.consistencyFailure !== null && r.consistencyFailure.includes('E3') && r.consistencyFailure.includes('khai 0') && !r.consistencyFailure.includes('chưa khai'),
    `expected_exit: 0 tường minh phải đọc "khai 0", không phải "chưa khai", được: ${r.consistencyFailure}`);
}

// ═══ Phát hiện 1: phân kỳ đã tái hiện — ghi chú tự do lẫn trong khối ═══════
// Khối eval khai mã 2 (declared), bên trong có một dòng ghi chú TỰ DO chứa
// cụm "exit_code: 9" (không phải trường thật — không đứng đầu dòng sau thụt
// lề) rồi mới tới dòng mã thoát THẬT exit_code: 2. Biểu thức không neo cũ đọc
// nhầm dòng ghi chú thành mã thoát của E1 (9 != khai 2) và chặn nhầm một báo
// cáo PASS hợp lệ.
{
  const { dir } = mkWorkspace(EVALS_OK);
  const payload = `---\nverdict: PASS\n---\n\n## Evidence\n- eval: E1\n  run_id: r-001\n  note: last run had exit_code: 9 (stale, ignore)\n  exit_code: 2\n  verifier: x\n  verified_at: 2026-01-01\n`;
  const r = CORE.evaluateEvidence(payload, { fileDir: dir });
  t('L1K-note-mid-block', r.consistencyFailure === null,
    `ghi chú tự do chứa "exit_code: 9" trong khối không được đọc thành mã thoát thật; mã thật (2) khớp khai -> KHÔNG vi phạm. Được: ${r.consistencyFailure}`);
}

// Đối chứng cùng fixture: đổi dòng mã thoát THẬT (không phải dòng ghi chú)
// sang 5 -> vi phạm, nêu tên eval và CẢ HAI mã (5 thực tế, 2 đã khai) — và
// KHÔNG lẫn mã 9 của dòng ghi chú vào thông điệp.
{
  const { dir } = mkWorkspace(EVALS_OK);
  const payload = `---\nverdict: PASS\n---\n\n## Evidence\n- eval: E1\n  run_id: r-001\n  note: last run had exit_code: 9 (stale, ignore)\n  exit_code: 5\n  verifier: x\n  verified_at: 2026-01-01\n`;
  const r = CORE.evaluateEvidence(payload, { fileDir: dir });
  t('L1K-note-mid-block-red',
    r.consistencyFailure !== null && r.consistencyFailure.includes('E1') && r.consistencyFailure.includes('mã 5') && r.consistencyFailure.includes('khai 2') && !r.consistencyFailure.includes('mã 9'),
    `mã thoát THẬT lệch khai phải vi phạm nêu tên eval + cả hai mã (5 thực tế, 2 đã khai), không lẫn mã 9 của ghi chú. Được: ${r.consistencyFailure}`);
}

// ═══ Lỗ fail-open: dòng mã thoát LỆCH ĐỊNH DẠNG trong khối (dấu gạch đầu
// dòng chen trước từ khoá, vd "  - exit_code: 9") từng bị walkEvalExits rơi
// mất hoàn toàn — không vào byEval (từ khoá không phải token đầu dòng),
// không vào outside (đang trong khối) — nên biến mất khỏi phép kiểm (hồ sơ
// eval-khai-ma-thoat-mong-doi 2026-09-09). Hai ca dưới đổi ĐÚNG MỘT biến
// (dòng thứ 3 trong cùng khối E1, mã thật exit_code: 2 khớp khai đứng sau):
//   - dòng lệch định dạng "- exit_code: 9"            -> VI PHẠM
//   - dòng ghi chú tự do "note: ... exit_code: 9 ..." -> KHÔNG vi phạm (đối chứng)
const skewedBlockPayload = (variableLine) =>
  `---\nverdict: PASS\n---\n\n## Evidence\n- eval: E1\n  run_id: r-001\n` +
  `${variableLine}\n  exit_code: 2\n  verifier: x\n  verified_at: 2026-01-01\n`;

{
  const { dir } = mkWorkspace(EVALS_OK);
  const payload = skewedBlockPayload('  - exit_code: 9');
  const r = CORE.evaluateEvidence(payload, { fileDir: dir });
  t('L1K-skewed-dash-exit',
    r.consistencyFailure !== null && r.consistencyFailure.includes('E1') &&
      r.consistencyFailure.includes('9') && r.consistencyFailure.includes('lệch định dạng'),
    `dòng "- exit_code: 9" lệch định dạng trong khối phải VI PHẠM và ghim rõ dòng lệch, được: ${r.consistencyFailure}`);
}

// Đối chứng cùng fixture: đúng ghi chú tự do đã được việc hợp nhất sinh ra
// để tha — không được lùi lại vì phần vá lỗ này.
{
  const { dir } = mkWorkspace(EVALS_OK);
  const payload = skewedBlockPayload('  note: last run had exit_code: 9 (stale, ignore)');
  const r = CORE.evaluateEvidence(payload, { fileDir: dir });
  t('L1K-skewed-note-tolerated', r.consistencyFailure === null,
    `đối chứng: ghi chú tự do chứa "exit_code: 9" không phải trường thật -> KHÔNG vi phạm (mã thật 2 khớp khai). Được: ${r.consistencyFailure}`);
}

// ═══ Nới điều kiện hình dạng: hồ sơ mà MỌI eval đều khai mã khác 0 ═════════

// Shape-1: block khớp đúng khai -> HAS_EXIT_ZERO thoả, không đòi dòng "exit_code: 0".
{
  const { dir } = mkWorkspace(EVALS_OK);
  const payload = `---\nverdict: PASS\n---\n\n## Evidence\n- eval: E1\n  run_id: r-001\n  exit_code: 2\n  verifier: x\n  verified_at: 2026-01-01\n`;
  const r = CORE.evaluateEvidence(payload, { fileDir: dir });
  t('L1K-shape-1', !r.missing.includes('exit_code: 0'),
    `khối khớp khai phải thoả điều kiện hình dạng, missing=${JSON.stringify(r.missing)}`);
}

// Shape-2 (đối chứng âm): mã trong khối LỆCH khai -> HAS_EXIT_ZERO không thoả
// qua đường ngoại lệ, và không có dòng "exit_code: 0" nào khác -> vẫn thiếu.
{
  const { dir } = mkWorkspace(EVALS_OK);
  const payload = `---\nverdict: PASS\n---\n\n## Evidence\n- eval: E1\n  run_id: r-001\n  exit_code: 3\n  verifier: x\n  verified_at: 2026-01-01\n`;
  const r = CORE.evaluateEvidence(payload, { fileDir: dir });
  t('L1K-shape-2', r.missing.includes('exit_code: 0'),
    `mã lệch khai không được ăn free-pass hình dạng, missing=${JSON.stringify(r.missing)}`);
}

// ═══ evals.yaml khai SAI luật -> KHÔNG tha gì cả (fail-closed) ═════════════
{
  // expected_exit khai trên executor "judgment" -> lỗi, errs không rỗng.
  const badYaml = `schema_version: 1\nslug: l1k\n\nevals:\n  - id: E1\n    executor: judgment\n    cmd: x\n    expected_exit: 2\n`;
  const { dir } = mkWorkspace(badYaml);
  const payload = `---\nverdict: PASS\n---\n\n## Evidence\n- eval: E1\n  run_id: r-001\n  exit_code: 2\n  verifier: x\n  verified_at: 2026-01-01\n`;
  const r = CORE.evaluateEvidence(payload, { fileDir: dir });
  t('L1K-failclosed-badyaml', r.consistencyFailure !== null && r.consistencyFailure.includes('E1'),
    `evals.yaml khai sai luật -> không tha, vẫn vi phạm; được: ${r.consistencyFailure}`);
}

// ═══ Không có fileDir -> declared rỗng -> fail-closed như luật cũ ══════════
{
  const payload = `---\nverdict: PASS\n---\n\n## Evidence\n- eval: E1\n  run_id: r-001\n  exit_code: 2\n  verifier: x\n  verified_at: 2026-01-01\n`;
  const r = CORE.evaluateEvidence(payload, {});
  t('L1K-no-filedir', r.consistencyFailure !== null && r.consistencyFailure.includes('E1'),
    `không có fileDir để đọc evals.yaml -> không tha gì, được: ${r.consistencyFailure}`);
}

// ═══ verdict FAIL vẫn bắt được (đường cũ không bị đổi) ═════════════════════
{
  const { dir } = mkWorkspace(EVALS_OK);
  const payload = `---\nverdict: PASS\n---\n\n## Evidence\n- eval: E1\n  run_id: r-001\n  exit_code: 0\n  verifier: x\n  verified_at: 2026-01-01\n  verdict: FAIL\n`;
  const r = CORE.evaluateEvidence(payload, { fileDir: dir });
  t('L1K-judgment-fail', r.consistencyFailure !== null && r.consistencyFailure.includes('failed judgment'),
    `verdict: FAIL vẫn phải bắt, được: ${r.consistencyFailure}`);
}

// ═══ Nghĩa vụ riêng: một ca đi TRỌN qua scripts/recheck-evidence.cjs thật ══
// Hồ sơ PASS thật, mã thoát khác 0 đã khai trong evals.yaml và ghi đúng
// trong khối eval — phải XANH đầu-cuối qua CLI thật, không chỉ qua
// evaluateEvidence() gọi thẳng.
{
  const root = mkdtempSync(path.join(tmpdir(), 'l1-khoi-e2e-'));
  const slug = 't4-l1-e2e';
  const dir = path.join(root, '_acceptance', slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, 'contract.md'),
    `---\nschema_version: 1\nfeature: ${slug}\nslug: ${slug}\nrisk_tier: T1\nsurfaces: [api]\nstatus: implemented\napproved_by: Manh Phan\n---\n`);
  writeFileSync(path.join(dir, 'evals.yaml'),
    `schema_version: 1\nslug: ${slug}\n\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: verify.sh\n    expected_exit: 3\n    expected: >\n      Xanh: rang E1 exit 3 (gioi han da khai).\n`);
  const verifier = path.join(dir, 'verify.sh');
  writeFileSync(verifier, '#!/bin/sh\nexit 3\n');
  chmodSync(verifier, 0o755);
  const reportPath = path.join(dir, 'evidence-report.md');
  writeFileSync(reportPath,
    `---\nschema_version: 1\nfeature_slug: ${slug}\nverdict: PASS\nverified_commit: ${'a'.repeat(40)}\nhuman_signoff: Manh 2026-09-10\n---\n\n` +
    `## Evidence\n- eval: E1\n  run_id: ${slug}-E1-001\n  exit_code: 3\n  verifier: verify.sh\n  verified_at: 2026-09-10\n`);
  let code = 0, out = '', err = '';
  try {
    out = execFileSync('node', [RECHECK, reportPath], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    code = e.status; err = String(e.stderr || '');
  }
  t('L1K-e2e-recheck-pass', code === 0,
    `recheck-evidence.cjs phải XANH cho mã khác 0 đã khai đúng khối, exit=${code} stderr=${err}`);

  // Đối chứng đỏ trên CÙNG fixture: đổi mã trong khối eval sang mã KHÔNG
  // khớp khai (3 -> 5) — recheck phải ĐỎ và ghim thông điệp neo TÊN eval + mã.
  const badReportPath = path.join(dir, 'evidence-report-bad.md');
  writeFileSync(badReportPath,
    `---\nschema_version: 1\nfeature_slug: ${slug}\nverdict: PASS\nverified_commit: ${'a'.repeat(40)}\nhuman_signoff: Manh 2026-09-10\n---\n\n` +
    `## Evidence\n- eval: E1\n  run_id: ${slug}-E1-002\n  exit_code: 5\n  verifier: verify.sh\n  verified_at: 2026-09-10\n`);
  let badCode = 0, badErr = '';
  try {
    execFileSync('node', [RECHECK, badReportPath], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    badCode = e.status; badErr = String(e.stderr || '');
  }
  t('L1K-e2e-recheck-fail', badCode === 1 && badErr.includes('E1') && badErr.includes('mã 5') && badErr.includes('khai 3'),
    `đối chứng đỏ phải ghim tên eval + mã lệch, exit=${badCode} stderr=${badErr}`);
}

console.log(`Results: l1-khoi ${fail === 0 ? 'passed' : 'FAILED'} (${pass} pass, ${fail} do)`);
process.exit(fail === 0 ? 0 : 1);
