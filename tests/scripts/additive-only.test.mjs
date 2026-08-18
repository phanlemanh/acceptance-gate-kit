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
  // đợt 2 «veto có dấu vết»: thêm luật `veto-trace` vào sổ luật. Dòng khai
  // LEDGER_EXPECTED buộc phải sửa — RL7a1 đòi tập tên trong sổ KHỚP tập
  // ledger_mark trong script, nên không có đường thêm luật mà không chạm dòng
  // này. Miễn trừ đích danh đúng chuỗi cũ (không phải mẫu), nên mọi sửa khác
  // trên dòng ấy vẫn ĐỎ.
  `LEDGER_EXPECTED="per-slug gap-probe t1-escape"`,
  // Hồ sơ `cong-chan-nham-cho` (2026-08-16, ADR 0012): gỡ lớp CHỨNG-MINH-chữ-ký
  // -bằng-commit và rút khối «sáu điều kiện xanh-sạch» thành hàm dùng chung
  // `xanh_sach_check` để luật Gate-1 (làn V) gọi ĐÚNG bộ kiểm ấy thay vì chép
  // bản thứ hai. Cả hai việc đều là XOÁ/DI CHUYỂN dòng luật cũ, nên không có
  // đường nào «chỉ thêm»: DV5 và mục tiêu của hồ sơ khoá nhau, đường thoát là
  // miễn trừ ĐÍCH DANH từng dòng nguyên văn (tiền lệ đợt 2 với LEDGER_EXPECTED).
  // Ba VIOLATION provenance bị gỡ có test đối chứng đổi-nghĩa H02/H03/H06;
  // khối xanh-sạch được kiểm lại y nguyên qua V01/V04/V04b.
  `        echo "VIOLATION [$slug]: status=$status but approved_by is empty and gate1_skipped is not true — Gate 1 approval was never recorded (contract skipped the gate)"`,
  `        violations=$((violations+1)); continue ;;`,
  `    _cdir="$(dirname "$report")"`,
  `    _tier="$(front_field "$_cdir/contract.md" risk_tier | tr '[:lower:]' '[:upper:]')"`,
  `    [ "$_tier" = "T2" ] || { clean_ok=0; clean_why="hạng $_tier (chỉ T2 được đi tiếp không ký)"; }`,
  `    if [ "$clean_ok" -eq 1 ] && grep -qiE '(^|[^a-z])UNCERTAIN([^a-z]|$)' "$report"; then`,
  `      clean_ok=0; clean_why="có mục UNCERTAIN"`,
  `    fi`,
  `    if [ "$clean_ok" -eq 1 ]; then`,
  `      for _sec in "Known limits" "Ngoài hợp đồng"; do`,
  `        # section() trả MẢNG RỖNG cho cả «tiêu đề vắng» lẫn «tiêu đề có mà`,
  `        # thân rỗng» — hai ca này phải khác nhau (vắng ≠ rỗng), nên sự hiện`,
  `        # diện của tiêu đề phải hỏi RIÊNG. Chân đỏ (4) bắt đúng chỗ này.`,
  `        _body="$(node -e '`,
  `          const {section}=require(process.argv[1]);`,
  `          const fs=require("fs");`,
  `          const t=fs.readFileSync(process.argv[2],"utf8");`,
  `          const h=process.argv[3];`,
  `          const has=t.split("\\n").some(l=>/^#{1,6}\\s+/.test(l)`,
  `            && l.replace(/^#{1,6}\\s+/,"").trim().toLowerCase()===h.toLowerCase());`,
  `          if(!has){process.stdout.write("__VANG__");process.exit(0);}`,
  `          process.stdout.write(section(t,h).join("\\n").trim()?"__CO__":"");`,
  `        ' "$ROOT/lib/md-section.cjs" "$report" "$_sec" 2>/dev/null || printf '__LOI__')"`,
  `        case "$_body" in`,
  `          __VANG__) clean_ok=0; clean_why="mục «$_sec» VẮNG khỏi báo cáo (vắng ≠ rỗng)"; break ;;`,
  `          __CO__)   clean_ok=0; clean_why="mục «$_sec» có nội dung"; break ;;`,
  `          __LOI__)  clean_ok=0; clean_why="không đọc được mục «$_sec» (fail-closed)"; break ;;`,
  `        esac`,
  `      done`,
  `    fi`,
  `  # Human-signoff provenance: the signature is text in an AI-writable file —`,
  `  # the git history of the commit that INTRODUCED it is the only`,
  `  # machine-checkable attribution. Standard flow: verify commits the`,
  `  # machine-written report first; the reviewer lands the signature in its own`,
  `  # commit touching only human-owned lines (human_signoff / human_override /`,
  `  # verdict upgrade / bypass_ack). Comment-only and blank +/- lines tolerated.`,
  `    if ! command -v git >/dev/null 2>&1 || ! git -C "$ROOT" rev-parse --git-dir >/dev/null 2>&1; then`,
  `      echo "NOTE [$slug]: signoff provenance unverifiable — $ROOT is not a git repo here (signoff.require_human_commit/agent_authors set)"`,
  `    else`,
  `      rel_report="\${report#"$ROOT"/}"`,
  `      sign_commit="$(git -C "$ROOT" log --format=%H -S"human_signoff: $signoff" -- "$rel_report" 2>/dev/null | head -1)"`,
  `      [ -z "$sign_commit" ] && sign_commit="$(git -C "$ROOT" log --format=%H -S"$signoff" -- "$rel_report" 2>/dev/null | head -1)"`,
  `      if [ -z "$sign_commit" ]; then`,
  `        if [ "$REQ_HUMAN_COMMIT" = "true" ]; then`,
  `          echo "VIOLATION [$slug]: human_signoff present but not found in any commit of $rel_report — the reviewer must COMMIT the signoff themselves (signoff.require_human_commit)"`,
  `          violations=$((violations+1)); continue`,
  `        fi`,
  `      else`,
  `        if [ -n "$AGENT_AUTHORS" ]; then`,
  `          author="$(git -C "$ROOT" log -1 --format=%ae "$sign_commit" 2>/dev/null)"`,
  `          hit=""`,
  `          while IFS= read -r g; do`,
  `            [ -n "$g" ] || continue`,
  `            case "$author" in $g) hit="$g" ;; esac`,
  `          done <<GLOBS2`,
  `$AGENT_AUTHORS`,
  `GLOBS2`,
  `          if [ -n "$hit" ]; then`,
  `            echo "VIOLATION [$slug]: signoff commit $sign_commit authored by \\"$author\\" — matches signoff.agent_authors blocklist ($hit); Gate 2 must be signed by a human identity"`,
  `            violations=$((violations+1)); continue`,
  `          fi`,
  `        fi`,
  `        if [ "$REQ_HUMAN_COMMIT" = "true" ]; then`,
  `          nonhuman="$(git -C "$ROOT" show --format= --unified=0 "$sign_commit" -- "$rel_report" 2>/dev/null \\`,
  `            | grep -E '^[+-]' | grep -vE '^(\\+\\+\\+|---)' \\`,
  `            | grep -vE '^[+-][[:space:]]*((human_signoff|human_override|verdict|bypass_ack)[[:space:]]*:|#|$)')"`,
  `          if [ -n "$nonhuman" ]; then`,
  `            echo "VIOLATION [$slug]: the commit introducing human_signoff ($sign_commit) also edits the report body — the Gate-2 signature must land in its own human-fields-only commit (signoff.require_human_commit). Offending lines:"`,
  `            printf '%s\\n' "$nonhuman" | head -5 | sed 's/^/    /'`,
  `            violations=$((violations+1)); continue`,
  `          fi`,
  `        fi`,
  `      fi`,
  // Hồ sơ `status-chua-arm-cong` (2026-08-18): (1) dòng `case "$status" …
  // continue` là ĐÚNG lỗ đang bịt — hồ sơ draft/approved đã có evidence hoặc
  // nằm trong PR đổi code chịu cổng không được `continue` im lặng nữa; dòng cũ
  // thay bằng khối `case` có nhánh VIOLATION (răng ARM01–ARM12); ba dòng
  // comment kèm theo nói «im lặng đúng thiết kế» nay SAI nên đổi. (2) khối
  // phân loại diff của T1-escape HOIST lên trước vòng per-slug (luật mới cần
  // nó sớm hơn) — T1-escape đọc lại biến, thông điệp nguyên văn, răng
  // ARM08/ARM08b + B01/B03 canh không đổi hành vi. Cả hai đều là DI CHUYỂN /
  // THAY dòng luật cũ, không nới luật nào — miễn trừ ĐÍCH DANH từng dòng
  // nguyên văn (tiền lệ đợt 2 + cong-chan-nham-cho).
  `  # Thiếu field ≠ khai báo → bị flag. Field CÓ mặt nhưng ngoài phạm vi (status`,
  `  # draft/approved, tier ngoài required_for) LÀ khai báo → vẫn im lặng đúng`,
  `  # thiết kế, xử ở hai \`case\` ngay dưới.`,
  `  case "$status" in implemented|verified|signed-off) ;; *) continue ;; esac`,
  `  changed="$DIFF_FILES"`,
  `  gate_touched=0; t3_hits=""; nont1_hits=""`,
  `  while IFS= read -r f; do`,
  `    [ -n "$f" ] || continue`,
  `    case "$f" in _acceptance/*|*/_acceptance/*) gate_touched=1; continue ;; esac`,
  `    if [ -n "$T3_PATHS" ] && match_globs "$f" "$T3_PATHS"; then`,
  `      t3_hits="\${t3_hits}\${f}"$'\\n'`,
  `    elif ! match_globs "$f" "$T1_GLOBS"; then`,
  `      nont1_hits="\${nont1_hits}\${f}"$'\\n'`,
  `    fi`,
  `  done <<CHANGED`,
  `$changed`,
  `CHANGED`,
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
