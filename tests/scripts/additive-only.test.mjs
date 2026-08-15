// DV5 — ngưỡng chết O1 thành phép đo máy: diff 2 file cưỡng chế
// (pre-merge-check.sh + recheck-evidence.cjs) so với base CHỈ được THÊM.
// 3 răng chống 0-hit-giả: (a) base suy từ git lúc chạy, không hardcode sha;
// (b) sanity counter — số dòng luật cũ nhận diện được phải > 0;
// (c) mutant sửa 1 luật cũ → phép đo phải ĐỎ đích danh.
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const FILES = ['scripts/pre-merge-check.sh', 'scripts/recheck-evidence.cjs'];
// Ngoại lệ '-' liệt kê ĐÍCH DANH từng dòng nguyên văn. Hotfix 2026-08-05
// (sự kiện re-pin THỨ HAI làm luật per-section sha-khớp báo oan mọi section
// lịch sử — DV2-12/DV2p-10 ghim hành vi mới, DV2-13/DV2p-11 ghim fraud):
// phép so sha chuyển từ per-section sang quan-hệ ít-nhất-một-khớp-vc.
const ALLOWED_REMOVALS = [
  `        if (vc && e.sha !== vc) { errs.push(\`REPIN x repin line for run_id "\${id}" has sha \${e.sha} but report verified_commit is \${vc} — signature and lane disagree; re-pin against the verified commit\`); continue; }`,
  `      if [ -n "$vc" ] && [ "$rsha" != "$vc" ]; then`,
  `        echo "VIOLATION [$slug]: re-pin line for run_id \\"$rid\\" has sha $rsha but verified_commit is $vc — signature and lane disagree; re-pin against the verified commit"`,
  `        repin_bad=1; continue`,
  `      fi`,
  // Bugfix 1.39.1 (2026-08-08, lớp "vật chép sang consumer chưa từng được đo ở
  // consumer"): mọi file .js mà acceptance-init chép sang repo tiêu thụ đổi đuôi
  // .cjs — repo khai "type": "module" phân loại .js là ESM nên require() trong
  // recheck-evidence/lib nổ ReferenceError, tầng recheck câm lặng từ init.
  // Các dòng dưới là ĐÚNG các tham chiếu tên-cũ bị thay bằng tên .cjs, không
  // luật nào bị nới; đối chứng: tests/scripts/consumer-esm.test.mjs.
  `#     L1/L2/L3 bar, re-checked via scripts/recheck-evidence.js + lib/evidence-core.js`,
  `# lib/ac-line.js. Răng VẪN chạy (awk rộng hơn nên không rụng dòng nào), nhưng đó`,
  `# CI evidence re-checker shipped alongside this script (needs ../lib/evidence-core.js).`,
  `RECHECK="$HERE/recheck-evidence.js"`,
  `GP_LIB="$(cd "$(dirname "$0")/.." 2>/dev/null && pwd)/lib/gap-probe.js"`,
  `  # Đọc danh sách config qua MỘT nguồn luật (lib/workspace-record.js`,
  `  WSREC_LIB="$(cd "$(dirname "$0")/.." 2>/dev/null && pwd)/lib/workspace-record.js"`,
  `  # "Thế nào là một dòng criterion" có MỘT nguồn: lib/ac-line.js — cùng nơi`,
  `  # lib/md-section.js coi h1 là nội dung.`,
  `  AC_LINE_LIB="$(cd "$(dirname "$0")/.." 2>/dev/null && pwd)/lib/ac-line.js"`,
  `      ' "$AC_LINE_LIB" "$(dirname "$AC_LINE_LIB")/md-section.js" 2>/dev/null)"; then`,
  `        gap_probe_not_enforced "node lib/gap-probe.js classify thất bại trên $slug"`,
  `  # Ngữ pháp ranh giới section THỐNG NHẤT với recheck-evidence.js (fix S4-r2):`,
  `      echo "NOTE [$slug]: evidence re-check not vendored (recheck-evidence.js/node missing) — committed-evidence bar NOT enforced"`,
  `  echo "NOTE: cross-layer teeth graded with the built-in awk pattern, not lib/ac-line.js (node or the lib was unavailable). The teeth still fire — the awk form is WIDER than the shared parser, so it drops no criterion — but it does not reject cross-reference bullets and it closes the Criteria section at an H1, so a blocking finding reported above may be spurious. Install node / vendor lib/ac-line.js to grade on the same definition the rest of the kit uses."`,
  ` * recheck-evidence.js — CI re-verification of a COMMITTED evidence-report.md.`,
  ` * EXACT evidence bar (lib/evidence-core.js — same code the hook runs) to the`,
  ` * Usage: recheck-evidence.js <evidence-report.md>`,
  `  core = require(path.join(__dirname, '..', 'lib', 'evidence-core.js'));`,
  `  process.stderr.write(\`recheck-evidence: cannot load lib/evidence-core.js (\${e.message}) — vendor lib/ next to scripts/\\n\`);`,
  `  process.stderr.write('recheck-evidence: usage: recheck-evidence.js <evidence-report.md>\\n');`,
  // 2 cảnh báo lint của consumer (catch bind biến rồi bỏ trống) — đổi sang
  // optional catch binding kèm ghi chú, cùng đợt 1.39.1:
  `        try { const e = JSON.parse(l); if (e && e.kind === 'repin' && typeof e.run_id === 'string') repins.set(e.run_id, e); } catch (_) {}`,
  `  try { configText = fs.readFileSync(configPath, 'utf8'); } catch (_) {}`,
  // Bugfix 1.40.1 (2026-08-12) — lỗ MIỄN TRỪ của răng T1-escape. Điều kiện
  // "PR có mang bằng chứng" tính CẢ file nằm ngay trong _acceptance/
  // (config.yaml, README.md), nên sửa một dòng CẤU HÌNH cổng là đủ dập toàn
  // bộ răng cho phần còn lại của PR. Đo thật ở floorplanstudio PR #6: PR đổi
  // 30+ file mã non-T1 bị chặn ĐÚNG; commit kế tiếp sửa _acceptance/config.yaml
  // và CÙNG bộ mã đó pass, cả local lẫn CI. Đây là NỚI LUẬT ngoài ý muốn, nên
  // bản vá SIẾT lại đúng điều thông điệp violation đã hứa ("carries NO
  // _acceptance/<slug>/ artifacts"): phải có thư mục slug thật.
  // Không luật nào bị nới. Đối chứng: TE21/TE22 (đỏ trước khi vá, xanh sau) và
  // TE23 canh chiều ngược — miễn trừ THẬT phải còn nguyên.
  `# no path→slug mapping, so "carries artifacts" means any _acceptance/ change;`,
  `# the per-slug checks above judge their quality.`,
  `    case "$f" in _acceptance/*|*/_acceptance/*) gate_touched=1; continue ;; esac`,
  // đợt 2 «veto có dấu vết»: thêm luật `veto-trace` vào sổ luật. Dòng khai
  // LEDGER_EXPECTED buộc phải sửa — RL7a1 đòi tập tên trong sổ KHỚP tập
  // ledger_mark trong script, nên không có đường thêm luật mà không chạm dòng
  // này. Miễn trừ đích danh đúng chuỗi cũ (không phải mẫu), nên mọi sửa khác
  // trên dòng ấy vẫn ĐỎ.
  `LEDGER_EXPECTED="per-slug gap-probe t1-escape"`,
];
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };
const git = (...a) => execFileSync('git', ['-C', ROOT, ...a], { encoding: 'utf8' });

// (a) base suy lúc chạy: origin/main → main → master (merge-base với HEAD)
function resolveBase() {
  for (const ref of ['origin/main', 'main', 'master']) {
    try { execFileSync('git', ['-C', ROOT, 'rev-parse', '--verify', '-q', `${ref}^{commit}`], { stdio: 'ignore' }); }
    catch (_) { continue; }
    return git('merge-base', 'HEAD', ref).trim();
  }
  throw new Error('không resolve được nhánh chính (origin/main|main|master)');
}

// Phép đo dùng CHUNG cho cả leg thật lẫn leg mutant: git diff --no-index,
// trả danh sách dòng luật-cũ bị xoá/sửa (dòng '-' ngoài ALLOWED_REMOVALS).
function measure(baseText, curText) {
  const d = mkdtempSync(path.join(tmpdir(), 'addonly-'));
  const a = path.join(d, 'base'); const b = path.join(d, 'cur');
  writeFileSync(a, baseText); writeFileSync(b, curText);
  let out = '';
  try { execFileSync('git', ['diff', '--no-index', '--', a, b], { encoding: 'utf8' }); }
  catch (e) { out = String(e.stdout || ''); }
  return out.split('\n')
    .filter(l => /^-[^-]/.test(l) || l === '-')
    .map(l => l.slice(1))
    .filter(l => !ALLOWED_REMOVALS.includes(l));
}

const BASE = resolveBase();
// 1.39.1: recheck-evidence đổi đuôi .js → .cjs (fix ESM-scope ở consumer). Base
// trước đợt đó còn giữ tên .js — đọc tên hiện hành trước, lùi về tên cũ khi
// base chưa có, để phép đo sống được cả hai phía của lần đổi tên.
function showAtBase(f) {
  try {
    return execFileSync('git', ['-C', ROOT, 'show', `${BASE}:${f}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    if (f.endsWith('.cjs')) return git('show', `${BASE}:${f.slice(0, -4)}.js`);
    throw e;
  }
}
for (const f of FILES) {
  check(`DV5 ${f}: diff so với base ${BASE.slice(0, 7)} CHỈ THÊM (0 dòng luật cũ bị xoá/sửa)`, () => {
    const baseText = showAtBase(f);
    const curText = execFileSync('cat', [path.join(ROOT, f)], { encoding: 'utf8' });
    // (b) sanity counter: phép nhận diện luật cũ phải thấy > 0 dòng
    const oldRules = baseText.split('\n').filter(l => /VIOLATION|NOTE \[|process\.exit\(1\)/.test(l));
    assert.ok(oldRules.length > 0, `sanity counter: 0 dòng luật cũ nhận diện được trong ${f}@base — phép nhận diện hỏng`);
    const removed = measure(baseText, curText);
    assert.deepEqual(removed, [], `additive-only: existing rule line removed/modified trong ${f}:\n${removed.slice(0, 5).join('\n')}`);
  });
}

check('DV5m mutant: bản sao sửa 1 dòng VIOLATION cũ → phép đo phải ĐỎ đích danh', () => {
  const baseText = git('show', `${BASE}:scripts/pre-merge-check.sh`);
  const target = baseText.split('\n').find(l => l.includes('VIOLATION') && l.includes('stale'));
  assert.ok(target, 'không tìm được dòng luật cũ để mutate — sanity hỏng');
  const mutated = execFileSync('cat', [path.join(ROOT, 'scripts/pre-merge-check.sh')], { encoding: 'utf8' })
    .replace(target, target.replace('VIOLATION', 'RELAXED'));
  const removed = measure(baseText, mutated);
  assert.ok(removed.length > 0, 'mutant nới luật cũ mà phép đo vẫn 0 dòng xoá — additive-only không phân biệt được');
  assert.ok(removed.some(l => l.includes('VIOLATION')), 'phép đo đỏ nhưng không trỏ đúng dòng luật bị nới');
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
